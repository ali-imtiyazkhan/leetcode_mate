import type { RedisClientType } from 'redis'

// Helpers for WebRTC call state tracking in Redis
// Tracks active calls so we can clean them up on disconnect

const CALL_TTL = 60 * 60 // 1 hour max call length

export interface CallInfo {
  sessionRoom: string
  callerSocketId: string
  calleeSocketId: string
  startedAt: string
  status: string
}

export async function startCall(redis: RedisClientType<any, any, any>, { sessionRoom, callerSocketId, calleeSocketId }: { sessionRoom: string, callerSocketId: string, calleeSocketId: string }) {
  const key = `call:${sessionRoom}`
  await redis.hSet(key, {
    callerSocketId,
    calleeSocketId,
    startedAt: Date.now().toString(),
    status: 'active',
  })
  await redis.expire(key, CALL_TTL)
}

export async function endCall(redis: RedisClientType<any, any, any>, sessionRoom: string) {
  await redis.del(`call:${sessionRoom}`)
}

export async function getActiveCall(redis: RedisClientType<any, any, any>, sessionRoom: string) {
  return redis.hGetAll(`call:${sessionRoom}`)
}

// Find any active call a socket is participating in
export async function findCallBySocket(redis: RedisClientType<any, any, any>, socketId: string): Promise<CallInfo | null> {
  const keys = await redis.keys('call:*')
  for (const key of keys) {
    const call = await redis.hGetAll(key)
    if (call.callerSocketId === socketId || call.calleeSocketId === socketId) {
      return { sessionRoom: key.replace('call:', ''), ...call as any } as CallInfo
    }
  }
  return null
}