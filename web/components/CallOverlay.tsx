'use client'
import { useEffect, useRef } from 'react'

interface CallOverlayProps {
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  callState: 'idle' | 'calling' | 'ringing' | 'connecting' | 'connected' | 'ended'
  micOn: boolean
  camOn: boolean
  isSharing: boolean
  callDuration: number
  partnerName: string
  onHangUp: () => void
  onToggleMic: () => void
  onToggleCam: () => void
  onShareScreen: () => void
}

function formatDuration(secs: number) {
  const m = String(Math.floor(secs / 60)).padStart(2, '0')
  const s = String(secs % 60).padStart(2, '0')
  return `${m}:${s}`
}

export default function CallOverlay({
  localStream, remoteStream,
  callState, micOn, camOn, isSharing, callDuration,
  partnerName,
  onHangUp, onToggleMic, onToggleCam, onShareScreen,
}: CallOverlayProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  if (callState === 'idle') return null

  return (
    <div style={{
      background: '#0a0a12',
      border: '1px solid #1e1e30',
      borderRadius: 16,
      padding: 16,
      marginTop: 16,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>In call with </span>
          <span style={{ fontSize: 13, color: '#a78bfa', fontWeight: 700 }}>{partnerName}</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#4ade80', fontVariantNumeric: 'tabular-nums' }}>
          {callState === 'connected' ? formatDuration(callDuration) : callState}
        </div>
      </div>

      {/* Video grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        <div style={{ background: '#080810', borderRadius: 10, overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}>
          <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <span style={{ position: 'absolute', bottom: 6, left: 8, fontSize: 11, color: 'rgba(255,255,255,0.7)', background: 'rgba(0,0,0,0.4)', padding: '1px 6px', borderRadius: 4 }}>You</span>
        </div>
        <div style={{ background: '#080810', borderRadius: 10, overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}>
          <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <span style={{ position: 'absolute', bottom: 6, left: 8, fontSize: 11, color: 'rgba(255,255,255,0.7)', background: 'rgba(0,0,0,0.4)', padding: '1px 6px', borderRadius: 4 }}>{partnerName}</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {[
          { label: 'Mic', active: micOn, onClick: onToggleMic, offLabel: 'Muted' },
          { label: 'Camera', active: camOn, onClick: onToggleCam, offLabel: 'Off' },
          { label: isSharing ? 'Stop share' : 'Share', active: isSharing, onClick: onShareScreen, offLabel: 'Screen' },
        ].map((btn) => (
          <button key={btn.label} onClick={btn.onClick} style={{
            padding: '10px 4px',
            borderRadius: 10,
            border: 'none',
            background: btn.active ? '#2e1065' : '#1e1e30',
            color: btn.active ? '#a78bfa' : '#6b7280',
            fontSize: 12,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}>
            {btn.active ? btn.label : btn.offLabel}
          </button>
        ))}
        <button onClick={onHangUp} style={{
          padding: '10px 4px',
          borderRadius: 10,
          border: 'none',
          background: '#7f1d1d',
          color: '#fca5a5',
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer',
        }}>
          End call
        </button>
      </div>
    </div>
  )
}
