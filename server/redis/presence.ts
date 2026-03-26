import type { RedisClientType } from 'redis'

// Redis presence manager
// Uses sorted sets: key = room:<slug>, member = socketId, score = join timestamp
// TTL auto-expires stale users who never disconnected cleanly

const PRESENCE_TTL = 60 * 5 // 5 minutes

export interface UserPresence {
  questionSlug: string
  userId: string
  socketId: string
  displayName: string
}

export async function joinQuestion(redis: RedisClientType<any, any, any>, { questionSlug, userId, socketId, displayName }: UserPresence) {
  const roomKey = `room:${questionSlug}`
  const userKey = `user:${socketId}`

  // Store user metadata as a hash
  await redis.hSet(userKey, {
    userId: userId || 'anonymous',
    displayName: displayName || 'Anonymous',
    questionSlug,
    socketId,
    joinedAt: Date.now().toString(),
  })
  await redis.expire(userKey, PRESENCE_TTL)

  // Add to sorted set for this question room (score = timestamp for ordering)
  await redis.zAdd(roomKey, { score: Date.now(), value: socketId })
  await redis.expire(roomKey, PRESENCE_TTL)
}

export async function leaveQuestion(redis: RedisClientType<any, any, any>, { questionSlug, socketId }: { questionSlug: string, socketId: string }) {
  const roomKey = `room:${questionSlug}`
  await redis.zRem(roomKey, socketId)
  await redis.del(`user:${socketId}`)
}

export async function getCount(redis: RedisClientType<any, any, any>, questionSlug: string) {
  return redis.zCard(`room:${questionSlug}`)
}

export async function getOnlineUsers(redis: RedisClientType<any, any, any>, questionSlug: string) {
  // Returns all socketIds currently in this room
  return redis.zRange(`room:${questionSlug}`, 0, -1)
}

export async function getUserData(redis: RedisClientType<any, any, any>, socketId: string) {
  return redis.hGetAll(`user:${socketId}`)
}

export async function refreshTTL(redis: RedisClientType<any, any, any>, { questionSlug, socketId }: { questionSlug: string, socketId: string }) {
  // Called on heartbeat to keep presence alive
  const roomKey = `room:${questionSlug}`
  await redis.expire(roomKey, PRESENCE_TTL)
  await redis.expire(`user:${socketId}`, PRESENCE_TTL)
  // Refresh score so inactive users sort to the bottom
  await redis.zAdd(roomKey, { score: Date.now(), value: socketId })
}

export async function getAllRoomStats(redis: RedisClientType<any, any, any>) {
  const keys = await redis.keys('room:*')
  const stats: { slug: string; count: number }[] = []
  for (const key of keys) {
    const slug = key.replace('room:', '')
    const count = await redis.zCard(key)
    if (count > 0) stats.push({ slug, count })
  }
  return stats.sort((a, b) => b.count - a.count)
}
