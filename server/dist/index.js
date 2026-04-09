import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import cors from 'cors';
import { registerHandlers } from './socket/handlers.js';
import { getGlobalStats } from './redis/presence.js';
import matchRouter from './routes/match.js';
import authRouter from './routes/auth.js';
const app = express();
const httpServer = createServer(app);
// Support multiple origins (comma-separated in env)
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (extensions, curl, etc.)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    },
    credentials: true,
}));
app.use(express.json());
const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
// Redis client (pub/sub needs two separate connections)
export const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
export const redisSub = redis.duplicate();
redis.on('error', (err) => console.error('Redis error:', err));
await redis.connect();
await redisSub.connect();
console.log('✅ Redis connected');
// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: Date.now() }));
// Stats endpoint — O(1) via pre-computed global counters
app.get('/stats', async (req, res) => {
    try {
        const stats = await getGlobalStats(redis);
        res.json(stats);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// REST API routes
app.use('/api', matchRouter);
// Auth routes (GitHub OAuth)
app.use('/auth', authRouter);
// Register all socket event handlers
io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);
    registerHandlers(io, socket, redis);
});
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`🚀 CodeMate server running on port ${PORT}`);
});
