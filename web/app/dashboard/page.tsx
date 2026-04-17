'use client'
import { useEffect, useState } from 'react'
import { useSocket } from '../../hooks/useSocket'
import { BackgroundBeams } from '../../components/BackgroundBeams'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4000'

interface RoomStat {
  slug: string
  count: number
}

export default function DashboardPage() {
  const { isConnected } = useSocket(SERVER_URL)
  const [rooms, setRooms] = useState<RoomStat[]>([])
  const [totalOnline, setTotalOnline] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [statsRes, roomsRes] = await Promise.all([
          fetch(`${SERVER_URL}/stats`),
          fetch(`${SERVER_URL}/api/rooms`),
        ])
        const stats = await statsRes.json()
        const roomData = await roomsRes.json()
        setTotalOnline(stats.totalOnline || 0)
        setRooms(roomData.rooms || [])
      } catch (e) {
        console.error('Failed to fetch stats', e)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen bg-neutral-950 w-full overflow-hidden text-neutral-200 font-sans selection:bg-purple-500/30">
      <BackgroundBeams className="opacity-100" />
      
      {/* Content wrapper on top of beams */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 lg:py-20 flex flex-col gap-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-4"
        >
          <div>
            <Link href="/" className="inline-block text-xs font-semibold tracking-wider text-purple-400 mb-2 hover:text-purple-300 transition-colors uppercase">
              ← Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm">
              Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Activity</span>
            </h1>
            <p className="mt-3 text-neutral-400 text-sm md:text-base max-w-xl leading-relaxed">
              Real-time visualization of developer presence across all LeetCode problems. Join a problem to appear here instantly.
            </p>
          </div>

          <div className="flex items-center gap-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-4 py-2 w-max shadow-xl hover:bg-white/10 transition-colors">
            <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${isConnected ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-red-500 shadow-red-500/50 animate-pulse'}`} />
            <span className={`text-xs font-semibold uppercase tracking-wider ${isConnected ? 'text-emerald-300' : 'text-red-400'}`}>
              {isConnected ? 'System Live' : 'Reconnecting...'}
            </span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Developers Online', value: loading ? '—' : totalOnline.toLocaleString(), color: 'text-white' },
            { label: 'Active Problem Rooms', value: loading ? '—' : rooms.length.toLocaleString(), color: 'text-purple-300' },
            { label: 'Trending Problem', value: loading ? '—' : (rooms[0]?.slug?.replace(/-/g, ' ') || 'None'), color: 'text-cyan-300', isText: true }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
              className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.15] hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 blur-xl group-hover:opacity-30 transition-opacity">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500`} />
              </div>
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">
                {stat.label}
              </h3>
              <div className={`font-bold tracking-tight ${stat.isText ? 'text-xl capitalize truncate' : 'text-4xl'} ${stat.color} drop-shadow-md`}>
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Active Rooms Table / List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl shadow-2xl overflow-hidden mt-4"
        >
          <div className="px-6 py-5 border-b border-white/[0.08] flex justify-between items-center bg-white/[0.01]">
            <h2 className="text-lg font-semibold text-white tracking-wide">Live Coding Rooms</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 font-medium tracking-wide">Auto-updates</span>
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping opacity-75" />
            </div>
          </div>

          <div className="p-1">
            {loading ? (
              <div className="py-20 text-center flex flex-col items-center gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                <span className="text-sm text-neutral-500 tracking-wider fade-in">Syncing presence data...</span>
              </div>
            ) : rooms.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-3">
                <div className="text-4xl opacity-50 mb-2">🔭</div>
                <div className="text-neutral-300 font-medium">It's quiet right now.</div>
                <div className="text-sm text-neutral-500 max-w-sm mx-auto">Open any LeetCode problem with the CodeMate extension to start a live room.</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider bg-white/[0.02]">
                      <th className="px-6 py-4">Problem Name</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 w-1/3">Activity Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    <AnimatePresence>
                      {rooms.map((room, i) => (
                        <motion.tr 
                          key={room.slug}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          className="hover:bg-white/[0.03] transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <a
                              href={`https://leetcode.com/problems/${room.slug}/`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-neutral-200 font-medium capitalize text-sm hover:text-purple-400 transition-colors drop-shadow-sm flex items-center gap-2"
                            >
                              <span className="group-hover:translate-x-1 transition-transform">
                                {room.slug.replace(/-/g, ' ')}
                              </span>
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-400 text-xs">↗</span>
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </div>
                              <div className="flex gap-1.5 items-baseline">
                                <span className="text-sm font-bold text-white tabular-nums">{room.count}</span>
                                <span className="text-xs text-neutral-500 font-medium">coders</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (room.count / (rooms[0]?.count || 1)) * 100)}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-purple-600 to-cyan-400 rounded-full relative"
                              >
                                <div className="absolute inset-0 bg-white/20 w-full h-full [mask-image:linear-gradient(to_right,transparent,white)] animate-pulse" />
                              </motion.div>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] text-neutral-500 uppercase tracking-widest backdrop-blur-sm shadow-xl">
            <span>Powered by Next.js & Socket.io</span>
            <span className="w-1 h-1 rounded-full bg-neutral-700" />
            <span>Redis Presence</span>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
