'use client'
import { useEffect, useState } from 'react'
import { useSocket } from '../../hooks/useSocket'

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
    const interval = setInterval(fetchStats, 10_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a12', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#e2e2f0', marginBottom: 4 }}>
              CodeMate Dashboard
            </h1>
            <p style={{ fontSize: 13, color: '#6b7280' }}>Live presence across all LeetCode problems</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#13131f', border: '1px solid #1e1e30', borderRadius: 8, padding: '8px 14px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: isConnected ? '#22c55e' : '#ef4444' }} />
            <span style={{ fontSize: 12, color: isConnected ? '#4ade80' : '#f87171' }}>
              {isConnected ? 'Live' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total online', value: loading ? '...' : totalOnline, color: '#a78bfa' },
            { label: 'Active rooms', value: loading ? '...' : rooms.length, color: '#34d399' },
            { label: 'Most active', value: loading ? '...' : (rooms[0]?.slug?.replace(/-/g, ' ') || '—'), color: '#fbbf24', small: true },
          ].map((s) => (
            <div key={s.label} style={{ background: '#13131f', border: '1px solid #1e1e30', borderRadius: 12, padding: '20px 22px' }}>
              <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: s.small ? 16 : 28, fontWeight: 800, color: s.color, lineHeight: 1.1 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Rooms table */}
        <div style={{ background: '#13131f', border: '1px solid #1e1e30', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #1e1e30', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e2f0' }}>Active rooms</span>
            <span style={{ fontSize: 12, color: '#6b7280' }}>Refreshes every 10s</span>
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#4b5563' }}>Loading...</div>
          ) : rooms.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#4b5563' }}>
              No active rooms right now. Open a LeetCode problem to start!
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1e1e30' }}>
                  {['Problem', 'Online', ''].map((h) => (
                    <th key={h} style={{ padding: '10px 24px', textAlign: 'left', fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rooms.map((room, i) => (
                  <tr key={room.slug} style={{ borderBottom: i < rooms.length - 1 ? '1px solid #1a1a28' : 'none' }}>
                    <td style={{ padding: '14px 24px' }}>
                      <a
                        href={`https://leetcode.com/problems/${room.slug}/`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#a78bfa', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}
                      >
                        {room.slug.replace(/-/g, ' ')}
                      </a>
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
                        <span style={{ fontSize: 14, color: '#e2e2f0', fontWeight: 600 }}>{room.count}</span>
                        <span style={{ fontSize: 12, color: '#6b7280' }}>online</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <div style={{ background: '#1e1040', borderRadius: 6, height: 6, width: 100, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: '#7c3aed', width: `${Math.min(100, (room.count / (rooms[0]?.count || 1)) * 100)}%`, borderRadius: 6, transition: 'width 0.5s' }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
