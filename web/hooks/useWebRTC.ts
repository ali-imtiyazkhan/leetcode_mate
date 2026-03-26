'use client'
import { useRef, useState, useCallback, useEffect } from 'react'
import { Socket } from 'socket.io-client'

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
]

export type CallState = 'idle' | 'calling' | 'ringing' | 'connecting' | 'connected' | 'ended'

interface UseWebRTCProps {
  socket: Socket | null
  sessionRoom: string | null
  partnerSocketId: string | null
}

export function useWebRTC({ socket, sessionRoom, partnerSocketId }: UseWebRTCProps) {
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)

  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [callState, setCallState] = useState<CallState>('idle')
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [isSharing, setIsSharing] = useState(false)
  const [callDuration, setCallDuration] = useState(0)

  const timerRef = useRef<any>(null)

  // Cleanup function
  const cleanup = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop())
    pcRef.current?.close()
    pcRef.current = null
    localStreamRef.current = null
    setLocalStream(null)
    setRemoteStream(null)
    setCallState('idle')
    if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
    }
    setCallDuration(0)
  }, [])

  // ── Create peer connection ────────────────────────────────────────────────────
  const createPeer = useCallback(() => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS })

    pc.onicecandidate = ({ candidate }) => {
      if (candidate && socket && partnerSocketId) {
        socket.emit('webrtc:ice', { to: partnerSocketId, candidate })
      }
    }

    pc.ontrack = ({ streams }) => {
      setRemoteStream(streams[0])
    }

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        setCallState('connected')
        setCallDuration(0)
        timerRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000)
      }
      if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) {
        cleanup()
      }
    }

    pcRef.current = pc
    return pc
  }, [socket, partnerSocketId, cleanup])

  // ── Start call (caller) ───────────────────────────────────────────────────────
  const startCall = useCallback(async () => {
    if (!socket || !partnerSocketId || !sessionRoom) return
    try {
      setCallState('calling')

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      localStreamRef.current = stream
      setLocalStream(stream)

      const pc = createPeer()
      stream.getTracks().forEach((t) => pc.addTrack(t, stream))

      socket.emit('call:start', { to: partnerSocketId, sessionRoom })

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      socket.emit('webrtc:offer', { to: partnerSocketId, offer })
    } catch (err) {
      console.error('Failed to start call', err)
      cleanup()
    }
  }, [socket, partnerSocketId, sessionRoom, createPeer, cleanup])

  // ── Answer call (callee) ──────────────────────────────────────────────────────
  const answerCall = useCallback(async () => {
    if (!socket || !partnerSocketId || !sessionRoom) return
    try {
      setCallState('connecting')

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      localStreamRef.current = stream
      setLocalStream(stream)

      const pc = createPeer()
      stream.getTracks().forEach((t) => pc.addTrack(t, stream))

      socket.emit('call:accept', { to: partnerSocketId, sessionRoom })
    } catch (err) {
      console.error('Failed to answer call', err)
      cleanup()
    }
  }, [socket, partnerSocketId, sessionRoom, createPeer, cleanup])

  // ── Handle incoming offer ─────────────────────────────────────────────────────
  const handleOffer = useCallback(async (offer: RTCSessionDescriptionInit) => {
    const pc = pcRef.current
    if (!pc || !socket || !partnerSocketId) return
    await pc.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    socket.emit('webrtc:answer', { to: partnerSocketId, answer })
  }, [socket, partnerSocketId])

  const handleAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    if (pcRef.current) {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer))
    }
  }, [])

  const handleIce = useCallback(async (candidate: RTCIceCandidateInit) => {
    try {
      if (pcRef.current) {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate))
      }
    } catch (err) {
        console.warn('Failed to add ICE candidate', err)
    }
  }, [])

  // ── Controls ──────────────────────────────────────────────────────────────────
  const toggleMic = useCallback(() => {
    const enabled = !micOn
    localStreamRef.current?.getAudioTracks().forEach((t) => (t.enabled = enabled))
    setMicOn(enabled)
    socket?.emit('call:media', { to: partnerSocketId, audio: enabled, video: camOn })
  }, [micOn, camOn, socket, partnerSocketId])

  const toggleCam = useCallback(() => {
    const enabled = !camOn
    localStreamRef.current?.getVideoTracks().forEach((t) => (t.enabled = enabled))
    setCamOn(enabled)
    socket?.emit('call:media', { to: partnerSocketId, audio: micOn, video: enabled })
  }, [camOn, micOn, socket, partnerSocketId])

  const shareScreen = useCallback(async () => {
    if (!pcRef.current) return
    try {
      if (isSharing) {
        const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true })
        const track = cameraStream.getVideoTracks()[0]
        const sender = pcRef.current.getSenders().find((s) => s.track?.kind === 'video')
        await sender?.replaceTrack(track)
        setIsSharing(false)
      } else {
        const screen = await (navigator.mediaDevices as any).getDisplayMedia({ video: true })
        const track = screen.getVideoTracks()[0]
        const sender = pcRef.current.getSenders().find((s) => s.track?.kind === 'video')
        await sender?.replaceTrack(track)
        track.onended = () => setIsSharing(false)
        setIsSharing(true)
      }
    } catch (err) {
      console.error('Screen sharing error', err)
    }
  }, [isSharing])

  const hangUp = useCallback(() => {
    if (socket && partnerSocketId && sessionRoom) {
        socket.emit('call:end', { to: partnerSocketId, sessionRoom })
    }
    cleanup()
  }, [socket, partnerSocketId, sessionRoom, cleanup])

  useEffect(() => () => cleanup(), [cleanup])

  return {
    localStream, remoteStream,
    callState, micOn, camOn, isSharing, callDuration,
    startCall, answerCall, hangUp,
    toggleMic, toggleCam, shareScreen,
    handleOffer, handleAnswer, handleIce,
  }
}