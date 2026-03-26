'use client'
import { usePresence } from '../hooks/usePresence'

export default function PresenceBadge({ questionSlug }: { questionSlug: string }) {
  const { count, joined } = usePresence(questionSlug)

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: '#13131f',
      border: '1px solid #1e1e30',
      borderRadius: 20,
      padding: '6px 14px',
      fontSize: 13,
      color: '#e2e2f0',
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: joined ? '#22c55e' : '#4b5563',
        display: 'inline-block',
      }} />
      <span style={{ fontWeight: 700, color: '#a78bfa', fontSize: 16 }}>{count}</span>
      <span style={{ color: '#6b7280' }}>solving this now</span>
    </div>
  )
}
