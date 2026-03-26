'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

export function useSocket(serverUrl: string) {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!serverUrl) return

    socketRef.current = io(serverUrl, {
      transports: ['websocket'],
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })

    socketRef.current.on('connect', () => {
      setIsConnected(true)
      console.log('Socket connected:', socketRef.current?.id)
    })

    socketRef.current.on('disconnect', (reason) => {
      setIsConnected(false)
      console.log('Socket disconnected:', reason)
    })

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message)
      setIsConnected(false)
    })

    return () => {
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [serverUrl])

  const emit = useCallback((event: string, data: any) => {
    socketRef.current?.emit(event, data)
  }, [])

  const on = useCallback((event: string, handler: (...args: any[]) => void) => {
    const socket = socketRef.current
    socket?.on(event, handler)
    return () => {
      socket?.off(event, handler)
    }
  }, [])

  return { socket: socketRef.current, isConnected, emit, on }
}
