// Redis presence manager
// Uses sorted sets: key = room:<slug>, member = socketId, score = join timestamp
// TTL auto-expires stale users who never disconnected cleanly
const PRESENCE_TTL = 60 * 5; // 5 minutes
export async function joinQuestion(redis, { questionSlug, userId, socketId, displayName }) {
    const roomKey = `room:${questionSlug}`;
    const userKey = `user:${socketId}`;
    // Check if this is a new room (doesn't exist yet or is empty)
    const existingCount = await redis.zCard(roomKey);
    const isNewRoom = existingCount === 0;
    // Store user metadata as a hash
    await redis.hSet(userKey, {
        userId: userId || 'anonymous',
        displayName: displayName || 'Anonymous',
        questionSlug,
        socketId,
        joinedAt: Date.now().toString(),
    });
    await redis.expire(userKey, PRESENCE_TTL);
    // Add to sorted set for this question room (score = timestamp for ordering)
    await redis.zAdd(roomKey, { score: Date.now(), value: socketId });
    await redis.expire(roomKey, PRESENCE_TTL);
    // Update global counters (O(1) instead of scanning all keys)
    await redis.incr('global:online');
    if (isNewRoom) {
        await redis.incr('global:roomCount');
    }
}
export async function leaveQuestion(redis, { questionSlug, socketId }) {
    const roomKey = `room:${questionSlug}`;
    // Check if user actually exists in this room before decrementing
    const rank = await redis.zRank(roomKey, socketId);
    if (rank === null)
        return; // User wasn't in this room
    await redis.zRem(roomKey, socketId);
    await redis.del(`user:${socketId}`);
    // Update global counters
    await redis.decr('global:online');
    // Check if room is now empty
    const remaining = await redis.zCard(roomKey);
    if (remaining === 0) {
        await redis.del(roomKey);
        await redis.decr('global:roomCount');
    }
}
export async function getCount(redis, questionSlug) {
    return redis.zCard(`room:${questionSlug}`);
}
export async function getOnlineUsers(redis, questionSlug) {
    // Returns all socketIds currently in this room
    return redis.zRange(`room:${questionSlug}`, 0, -1);
}
export async function getUserData(redis, socketId) {
    return redis.hGetAll(`user:${socketId}`);
}
export async function refreshTTL(redis, { questionSlug, socketId }) {
    // Called on heartbeat to keep presence alive
    const roomKey = `room:${questionSlug}`;
    await redis.expire(roomKey, PRESENCE_TTL);
    await redis.expire(`user:${socketId}`, PRESENCE_TTL);
    // Refresh score so inactive users sort to the bottom
    await redis.zAdd(roomKey, { score: Date.now(), value: socketId });
}
export async function getGlobalStats(redis) {
    // O(1) — reads pre-computed counters
    const [online, roomCount] = await Promise.all([
        redis.get('global:online'),
        redis.get('global:roomCount'),
    ]);
    return {
        totalOnline: Math.max(0, parseInt(online || '0', 10)),
        roomCount: Math.max(0, parseInt(roomCount || '0', 10)),
    };
}
export async function getAllRoomStats(redis) {
    // Note: This still uses KEYS for the room listing (needed for dashboard table).
    // But the /stats endpoint no longer uses this — it uses getGlobalStats() instead.
    const keys = await redis.keys('room:*');
    const stats = [];
    for (const key of keys) {
        const slug = key.replace('room:', '');
        const count = await redis.zCard(key);
        if (count > 0)
            stats.push({ slug, count });
    }
    return stats.sort((a, b) => b.count - a.count);
}
