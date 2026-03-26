import express from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import { createClient } from 'redis'
import cors from 'cors'
import { registerHandlers } from './socket/handlers.js'

const app = express()
const httpServer = createServer(app)

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }))
app.use(express.json())

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

// Redis client (pub/sub needs two separate connections)
export const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' })
export const redisSub = redis.duplicate()

redis.on('error', (err) => console.error('Redis error:', err))

await redis.connect()
await redisSub.connect()

console.log('✅ Redis connected')

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: Date.now() }))

// Stats endpoint — total active users across all rooms
app.get('/stats', async (req, res) => {
  try {
    const keys = await redis.keys('room:*')
    let total = 0
    for (const key of keys) {
      total += await redis.zCard(key)
    }
    res.json({ totalOnline: total, roomCount: keys.length })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// Register all socket event handlers
io.on('connection', (socket: Socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`)
  registerHandlers(io, socket, redis as any) // Type cast for now if redis client type is complex
})

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
  console.log(`🚀 CodeMate server running on port ${PORT}`)
})
