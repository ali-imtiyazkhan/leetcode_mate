'use client'
import { useEffect, useState } from 'react'
import { useSocket } from './useSocket'

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4000'

export function usePresence(questionSlug: string) {
  const { socket, isConnected, on } = useSocket(SERVER_URL)
  const [count, setCount] = useState(0)
  const [joined, setJoined] = useState(false)

  useEffect(() => {
    if (!socket || !isConnected || !questionSlug) return

    const userId = typeof window !== 'undefined'
      ? localStorage.getItem('codemate_uid') || 'anon'
      : 'anon'

    socket.emit('join:question', { questionSlug, userId, displayName: 'WebUser' })

    const offConfirm = on('join:confirmed', ({ count }: { count: number }) => {
      setCount(count)
      setJoined(true)
    })

    const offUpdate = on('presence:update', ({ questionSlug: slug, count }: { questionSlug: string, count: number }) => {
      if (slug === questionSlug) setCount(count)
    })

    const heartbeat = setInterval(() => socket.emit('heartbeat'), 60_000)

    return () => {
      offConfirm?.()
      offUpdate?.()
      clearInterval(heartbeat)
    }
  }, [socket, isConnected, questionSlug, on])

  return { count, joined, isConnected }
}
