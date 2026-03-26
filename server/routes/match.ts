import { Router, Request, Response } from 'express'
import { getAllRoomStats, getOnlineUsers } from '../redis/presence.js'
import { redis } from '../index.js'

const router = Router()

// GET /api/rooms — list all active rooms with counts
router.get('/rooms', async (req: Request, res: Response) => {
  try {
    const stats = await getAllRoomStats(redis)
    res.json({ rooms: stats })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/rooms/:slug — count for a specific question
router.get('/rooms/:slug', async (req: Request, res: Response) => {
  try {
    const users = await getOnlineUsers(redis, req.params.slug as string)
    res.json({ slug: req.params.slug, count: users.length })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

export default router
