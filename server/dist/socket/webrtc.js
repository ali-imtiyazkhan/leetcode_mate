// Helpers for WebRTC call state tracking in Redis
// Tracks active calls so we can clean them up on disconnect
const CALL_TTL = 60 * 60; // 1 hour max call length
export async function startCall(redis, { sessionRoom, callerSocketId, calleeSocketId }) {
    const key = `call:${sessionRoom}`;
    await redis.hSet(key, {
        callerSocketId,
        calleeSocketId,
        startedAt: Date.now().toString(),
        status: 'active',
    });
    await redis.expire(key, CALL_TTL);
    // Write socket→call index so we can find calls by socketId in O(1)
    await redis.set(`socketcall:${callerSocketId}`, sessionRoom, { EX: CALL_TTL });
    await redis.set(`socketcall:${calleeSocketId}`, sessionRoom, { EX: CALL_TTL });
}
export async function endCall(redis, sessionRoom) {
    const call = await redis.hGetAll(`call:${sessionRoom}`);
    // Clean up socket→call indexes
    if (call.callerSocketId)
        await redis.del(`socketcall:${call.callerSocketId}`);
    if (call.calleeSocketId)
        await redis.del(`socketcall:${call.calleeSocketId}`);
    await redis.del(`call:${sessionRoom}`);
}
export async function getActiveCall(redis, sessionRoom) {
    return redis.hGetAll(`call:${sessionRoom}`);
}
// Find any active call a socket is participating in — O(1) via index
export async function findCallBySocket(redis, socketId) {
    const sessionRoom = await redis.get(`socketcall:${socketId}`);
    if (!sessionRoom)
        return null;
    const call = await redis.hGetAll(`call:${sessionRoom}`);
    if (!call.callerSocketId)
        return null; // call data expired
    return { sessionRoom, ...call };
}
