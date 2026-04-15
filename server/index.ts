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

// Redis client configuration with retry strategy for production
const redisOptions = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    connectTimeout: 30_000,        // 30s to establish initial connection
    reconnectStrategy: (retries: number) => {
      if (retries > 20) {
        console.error('❌ Redis: max reconnection attempts reached')
        return new Error('Max Redis reconnection attempts reached')
      }
      const delay = Math.min(retries * 500, 30_000) // exponential backoff, max 30s
      console.log(`🔄 Redis reconnecting in ${delay}ms (attempt ${retries})...`)
      return delay
    },
  },
}

export const redis = createClient(redisOptions)
export const redisSub = redis.duplicate()

let isRedisReady = false

redis.on('connect', () => {
  isRedisReady = true
  console.log('✅ Redis connected')
})

// Graceful connect in background
async function connectRedis(maxAttempts = 10) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      if (redis.isOpen) return
      await redis.connect()
      await redisSub.connect()
      return
    } catch (err) {
      console.error(`❌ Redis connect attempt ${attempt}/${maxAttempts} failed:`, err)
      if (attempt === maxAttempts) {
        console.error('Final Redis connection attempt failed. Continuing in background...')
      }
      await new Promise((r) => setTimeout(r, attempt * 2000))
    }
  }
}

// Start Redis connection in background
connectRedis().catch(err => console.error('Background Redis connection error:', err))

// Health check
app.get('/health', (_, res) => res.json({ 
  status: 'ok', 
  redis: isRedisReady ? 'connected' : 'disconnected',
  timestamp: Date.now() 
}))

// Stats endpoint — total active users across all rooms
app.get('/stats', async (req, res) => {
  if (!isRedisReady) {
    return res.json({ totalOnline: 0, roomCount: 0, note: 'Redis not ready' })
  }
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
  registerHandlers(io, socket, redis as any)
})

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
  console.log(`🚀 CodeMate server running on port ${PORT}`)
  console.log(`📡 Port binding successful. System is listening.`)
})
