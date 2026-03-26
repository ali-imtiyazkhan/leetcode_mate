import { Server, Socket } from 'socket.io'
import type { RedisClientType } from 'redis'
import {
  joinQuestion,
  leaveQuestion,
  getCount,
  getOnlineUsers,
  getUserData,
  refreshTTL,
} from '../redis/presence.js'

export function registerHandlers(io: Server, socket: Socket, redis: RedisClientType<any, any, any>) {
  let currentQuestion: string | null = null // which room this socket is currently in
  let currentUserId: string | null = null
  let currentDisplayName: string | null = null

  // ─── JOIN: user opens a LeetCode problem ────────────────────────────────────
  socket.on('join:question', async ({ questionSlug, userId, displayName }: { questionSlug: string, userId: string, displayName: string }) => {
    // Leave previous room if user switched problems
    if (currentQuestion && currentQuestion !== questionSlug) {
      await handleLeave(io, socket, redis, currentQuestion)
    }

    currentQuestion = questionSlug
    currentUserId = userId || socket.id
    currentDisplayName = displayName || 'Anonymous'

    socket.join(questionSlug)

    await joinQuestion(redis, {
      questionSlug,
      userId: currentUserId,
      socketId: socket.id,
      displayName: currentDisplayName,
    })

    const count = await getCount(redis, questionSlug)

    // Broadcast updated count to everyone in the room
    io.to(questionSlug).emit('presence:update', { questionSlug, count })

    // Confirm to the joining socket
    socket.emit('join:confirmed', { questionSlug, count })

    console.log(`[${questionSlug}] ${currentDisplayName} joined — ${count} online`)
  })

  // ─── HEARTBEAT: refresh TTL every 60s ───────────────────────────────────────
  socket.on('heartbeat', async () => {
    if (!currentQuestion) return
    await refreshTTL(redis, { questionSlug: currentQuestion, socketId: socket.id })
  })

  // ─── MATCH REQUEST: find a partner on the same problem ──────────────────────
  socket.on('match:request', async ({ questionSlug, preferences }: { questionSlug: string, preferences: any }) => {
    const candidates = await getOnlineUsers(redis, questionSlug)
    const others = candidates.filter((id) => id !== socket.id)

    if (others.length === 0) {
      socket.emit('match:none', { message: 'No one else is on this problem right now. Try again in a moment!' })
      return
    }

    // Pick a random candidate (upgrade to skill-based matching in Phase 2)
    const targetSocketId = others[Math.floor(Math.random() * others.length)]
    const targetData = await getUserData(redis, targetSocketId)

    socket.emit('match:found', {
      partnerSocketId: targetSocketId,
      partnerName: targetData?.displayName || 'Anonymous',
      questionSlug,
    })

    io.to(targetSocketId).emit('match:incoming', {
      fromSocketId: socket.id,
      fromName: currentDisplayName,
      questionSlug,
    })
  })

  // ─── MATCH ACCEPT ────────────────────────────────────────────────────────────
  socket.on('match:accept', ({ fromSocketId }: { fromSocketId: string }) => {
    // Create a deterministic private room name for this pair
    const sessionRoom = [socket.id, fromSocketId].sort().join('::')
    socket.join(sessionRoom)

    io.to(fromSocketId).emit('match:accepted', {
      sessionRoom,
      partnerSocketId: socket.id,
      partnerName: currentDisplayName,
    })
    socket.emit('match:accepted', {
      sessionRoom,
      partnerSocketId: fromSocketId,
    })

    console.log(`Session started: ${sessionRoom}`)
  })

  // ─── MATCH DECLINE ───────────────────────────────────────────────────────────
  socket.on('match:decline', ({ fromSocketId }: { fromSocketId: string }) => {
    io.to(fromSocketId).emit('match:declined', { message: 'The other user declined the session.' })
  })

  // ─── TEXT CHAT within a session ─────────────────────────────────────────────
  socket.on('chat:message', ({ sessionRoom, message }: { sessionRoom: string, message: string }) => {
    if (!message || !sessionRoom) return
    io.to(sessionRoom).emit('chat:message', {
      from: socket.id,
      displayName: currentDisplayName,
      message: message.slice(0, 500), // cap message length
      timestamp: Date.now(),
    })
  })

  // ─── TYPING INDICATOR ────────────────────────────────────────────────────────
  socket.on('chat:typing', ({ sessionRoom, isTyping }: { sessionRoom: string, isTyping: boolean }) => {
    socket.to(sessionRoom).emit('chat:typing', { from: socket.id, isTyping })
  })

  // ─── WebRTC SIGNALING ────────────────────────────────────────────────────────
  socket.on('webrtc:offer', ({ to, offer }: { to: string, offer: any }) => {
    io.to(to).emit('webrtc:offer', { from: socket.id, offer })
  })

  socket.on('webrtc:answer', ({ to, answer }: { to: string, answer: any }) => {
    io.to(to).emit('webrtc:answer', { from: socket.id, answer })
  })

  socket.on('webrtc:ice', ({ to, candidate }: { to: string, candidate: any }) => {
    io.to(to).emit('webrtc:ice', { from: socket.id, candidate })
  })

  socket.on('webrtc:hangup', ({ to }: { to: string }) => {
    io.to(to).emit('webrtc:hangup', { from: socket.id })
  })

  // ─── DISCONNECT ──────────────────────────────────────────────────────────────
  socket.on('disconnect', async (reason) => {
    console.log(`🔌 Disconnected: ${socket.id} (${reason})`)
    if (currentQuestion) {
      await handleLeave(io, socket, redis, currentQuestion)
    }
  })
}

// ── Shared leave helper ────────────────────────────────────────────────────────
async function handleLeave(io: Server, socket: Socket, redis: RedisClientType<any, any, any>, questionSlug: string) {
  socket.leave(questionSlug)
  await leaveQuestion(redis, { questionSlug, socketId: socket.id })
  const count = await getCount(redis, questionSlug)
  io.to(questionSlug).emit('presence:update', { questionSlug, count })
  console.log(`[${questionSlug}] user left — ${count} remaining`)
}
