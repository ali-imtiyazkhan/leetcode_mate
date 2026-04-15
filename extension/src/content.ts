// CodeMate Content Script
// Runs on https://leetcode.com/problems/* pages

import { io, Socket } from 'socket.io-client'
import { WebRTCPeer } from './webrtc'

const SERVER_URL = (import.meta as any).env.VITE_SERVER_URL || 'http://localhost:4000'

// ── Helpers ────────────────────────────────────────────────────────────────────

function getQuestionSlug(): string | null {
  const match = window.location.pathname.match(/\/problems\/([^/]+)/)
  return match ? match[1] : null
}

function getUserId(): string {
  let id = localStorage.getItem('codemate_uid')
  if (!id) {
    id = 'user_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12)
    localStorage.setItem('codemate_uid', id)
  }
  return id
}

function getWidgetHTML(): string {
  return `
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      .card {
        background: #0f0f1a;
        border: 1px solid #2a2a40;
        border-radius: 14px;
        padding: 14px 16px;
        min-width: 240px;
        max-width: 280px;
        color: #e2e2f0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 13px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }

      .brand {
        font-size: 11px;
        font-weight: 600;
        color: #7c3aed;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .presence {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #22c55e;
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.85); }
      }

      .count-wrap { display: flex; align-items: baseline; gap: 4px; }
      .count { font-size: 24px; font-weight: 700; color: #a78bfa; line-height: 1; }
      .count-label { font-size: 12px; color: #6b7280; }

      .divider {
        height: 1px;
        background: #1e1e2e;
        margin: 10px 0;
      }

      .btn {
        width: 100%;
        padding: 9px 12px;
        border-radius: 8px;
        border: none;
        background: #7c3aed;
        color: #fff;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s, opacity 0.2s;
        letter-spacing: 0.02em;
      }
      .btn:hover:not(:disabled) { background: #6d28d9; }
      .btn:disabled { background: #1e1e2e; color: #4b5563; cursor: default; }
      .btn.secondary {
        background: transparent;
        border: 1px solid #374151;
        color: #9ca3af;
        margin-top: 6px;
      }
      .btn.secondary:hover:not(:disabled) { border-color: #6b7280; color: #e2e2f0; }
      .btn.danger { background: #7f1d1d; color: #fca5a5; margin-top: 6px; }
      .btn.danger:hover:not(:disabled) { background: #991b1b; }

      .status {
        font-size: 11px;
        color: #6b7280;
        margin-top: 8px;
        text-align: center;
        min-height: 16px;
      }
      .status.success { color: #4ade80; }
      .status.error { color: #f87171; }

      .incoming-banner {
        background: #1a1040;
        border: 1px solid #4c1d95;
        border-radius: 8px;
        padding: 10px 12px;
        margin-top: 10px;
        display: none;
      }
      .incoming-banner.visible { display: block; }
      .incoming-name { font-weight: 600; color: #c4b5fd; font-size: 12px; }
      .incoming-actions { display: flex; gap: 6px; margin-top: 8px; }
      .incoming-actions .btn { margin-top: 0; padding: 6px; font-size: 12px; }

      .chat-wrap { display: none; margin-top: 10px; }
      .chat-wrap.open { display: block; }

      .chat-partner {
        font-size: 11px;
        color: #6b7280;
        margin-bottom: 6px;
        text-align: center;
      }
      .chat-partner span { color: #a78bfa; font-weight: 600; }

      .chat-box {
        background: #080810;
        border-radius: 8px;
        padding: 8px;
        height: 150px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 4px;
        scrollbar-width: thin;
        scrollbar-color: #2a2a40 transparent;
      }

      .msg {
        font-size: 12px;
        line-height: 1.4;
        padding: 4px 8px;
        border-radius: 6px;
        max-width: 90%;
        word-break: break-word;
      }
      .msg.me {
        background: #2e1a5e;
        color: #c4b5fd;
        align-self: flex-end;
      }
      .msg.them {
        background: #1a1a2a;
        color: #d1d5db;
        align-self: flex-start;
      }

      .typing-indicator {
        font-size: 11px;
        color: #4b5563;
        padding: 2px 8px;
        font-style: italic;
        display: none;
      }
      .typing-indicator.visible { display: block; }

      .chat-input-row {
        display: flex;
        gap: 6px;
        margin-top: 8px;
      }
      .chat-input-row input {
        flex: 1;
        background: #0d0d1a;
        border: 1px solid #2a2a40;
        border-radius: 6px;
        padding: 7px 10px;
        color: #e2e2f0;
        font-size: 12px;
        outline: none;
        transition: border-color 0.2s;
      }
      .chat-input-row input:focus { border-color: #7c3aed; }
      .chat-input-row button {
        background: #7c3aed;
        border: none;
        border-radius: 6px;
        padding: 7px 12px;
        color: #fff;
        font-size: 12px;
        cursor: pointer;
        transition: background 0.2s;
        white-space: nowrap;
      }
      .chat-input-row button:hover { background: #6d28d9; }

      .minimize-btn {
        background: none;
        border: none;
        color: #4b5563;
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
        padding: 0 2px;
        transition: color 0.2s;
      }
      .minimize-btn:hover { color: #9ca3af; }

      /* Call UI Styles */
      .call-wrap { display: none; margin-top: 10px; }
      .call-wrap.open { display: block; }

      .call-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #080810;
        border-radius: 10px;
        padding: 10px 12px;
        margin-bottom: 8px;
      }
      .call-status { font-size: 12px; color: #9ca3af; }
      .call-status .name { color: #a78bfa; font-weight: 600; }
      .call-timer { font-size: 13px; font-weight: 700; color: #4ade80; font-variant-numeric: tabular-nums; }

      .videos {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
        margin-bottom: 8px;
      }
      .video-wrap {
        background: #080810;
        border-radius: 8px;
        overflow: hidden;
        aspect-ratio: 4/3;
        position: relative;
      }
      .video-wrap video { width: 100%; height: 100%; object-fit: cover; }
      .video-label {
        position: absolute;
        bottom: 4px; left: 6px;
        font-size: 10px;
        color: rgba(255,255,255,0.7);
        background: rgba(0,0,0,0.4);
        padding: 1px 5px;
        border-radius: 4px;
      }
      
      .call-controls { display: flex; gap: 6px; }
      .ctrl-btn {
        flex: 1; padding: 8px 4px; border-radius: 8px; border: none;
        background: #1e1e30; color: #e2e2f0; font-size: 11px; cursor: pointer;
        transition: background 0.15s; display: flex; flex-direction: column;
        align-items: center; gap: 3px;
      }
      .ctrl-btn:hover { background: #2a2a44; }
      .ctrl-btn.active { background: #2e1065; color: #a78bfa; }
      .ctrl-btn.end { background: #7f1d1d; color: #fca5a5; }
      .ctrl-btn.end:hover { background: #991b1b; }
      .ctrl-icon { font-size: 16px; }

      .incoming-call {
        background: #0d1f0d;
        border: 1px solid #14532d;
        border-radius: 10px;
        padding: 12px;
        margin-top: 10px;
        display: none;
      }
      .incoming-call.visible { display: block; }
      .incoming-call-name { color: #4ade80; font-weight: 600; font-size: 13px; }
      .incoming-call-actions { display: flex; gap: 6px; margin-top: 8px; }

      .pill {
        display: none;
        align-items: center;
        gap: 6px;
        background: #0f0f1a;
        border: 1px solid #2a2a40;
        border-radius: 20px;
        padding: 6px 12px;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
      }
      .pill-count { font-size: 13px; font-weight: 700; color: #a78bfa; }
      .pill-label { font-size: 11px; color: #6b7280; }
    </style>

    <div class="pill" id="cm-pill">
      <div class="dot"></div>
      <span class="pill-count" id="cm-pill-count">--</span>
      <span class="pill-label">solving</span>
    </div>

    <div class="card" id="cm-card">
      <div class="header">
        <span class="brand">CodeMate</span>
        <button class="minimize-btn" id="cm-minimize" title="Minimize">−</button>
      </div>

      <div class="presence">
        <div class="dot"></div>
        <div class="count-wrap">
          <span class="count" id="cm-count">--</span>
          <span class="count-label">people solving this</span>
        </div>
      </div>

      <div class="divider"></div>

      <div id="cm-signin-wrap" style="display:none; flex-direction:column; gap:8px;">
        <div style="font-size:12px;color:#9ca3af;margin-bottom:4px">Enter your name to join</div>
        <input type="text" id="cm-name-input" placeholder="Your display name..." maxlength="20" style="background:#0d0d1a;border:1px solid #2a2a40;border-radius:6px;padding:9px 12px;color:#e2e2f0;font-size:13px;outline:none;width:100%" />
        <button class="btn" id="cm-signin-btn">Join CodeMate</button>
      </div>

      <button class="btn" id="cm-match-btn" style="display:none">Find a partner</button>
      <div class="status" id="cm-status"></div>

      <div class="incoming-banner" id="cm-incoming">
        <div class="incoming-name" id="cm-incoming-name"></div>
        <div style="font-size:11px;color:#9ca3af;margin-top:2px">wants to solve this with you</div>
        <div class="incoming-actions">
          <button class="btn" id="cm-accept-btn" style="background:#15803d">Accept</button>
          <button class="btn secondary" id="cm-decline-btn">Decline</button>
        </div>
      </div>

      <div class="chat-wrap" id="cm-chat-wrap">
        <div class="chat-partner">Paired with <span id="cm-partner-name">partner</span></div>
        <div class="chat-box" id="cm-chat-box"></div>
        <div class="typing-indicator" id="cm-typing">Partner is typing...</div>
        <div class="chat-input-row">
          <input type="text" id="cm-msg-input" placeholder="Message your partner..." maxlength="500" />
          <button id="cm-send-btn">Send</button>
        </div>
        
        <div class="divider"></div>
        
        <button class="btn" id="cm-start-call-btn" style="background:#0f6e56;margin-bottom:6px;display:none">
          Start video call
        </button>
        
        <button class="btn danger" id="cm-end-btn">End session</button>

        <div class="call-wrap" id="cm-call-wrap">
          <div class="call-bar">
            <div class="call-status">Call with <span class="name" id="cm-call-partner">partner</span></div>
            <div class="call-timer" id="cm-call-timer">00:00</div>
          </div>
          <div class="videos">
            <div class="video-wrap">
              <video id="cm-local-video" autoplay muted playsinline></video>
              <div class="video-label">You</div>
            </div>
            <div class="video-wrap">
              <video id="cm-remote-video" autoplay playsinline></video>
              <div class="video-label" id="cm-remote-label">Partner</div>
            </div>
          </div>
          <div class="call-controls">
            <button class="ctrl-btn active" id="cm-mic-btn">
              <span class="ctrl-icon">🎙</span><span>Mic</span>
            </button>
            <button class="ctrl-btn active" id="cm-cam-btn">
              <span class="ctrl-icon">📷</span><span>Cam</span>
            </button>
            <button class="ctrl-btn" id="cm-screen-btn">
              <span class="ctrl-icon">🖥</span><span>Screen</span>
            </button>
            <button class="ctrl-btn end" id="cm-hangup-btn">
              <span class="ctrl-icon">📵</span><span>End</span>
            </button>
          </div>
        </div>

        <div class="incoming-call" id="cm-incoming-call">
          <div class="incoming-call-name" id="cm-caller-name">Someone</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px">is calling you...</div>
          <div class="incoming-call-actions">
            <button class="btn" id="cm-answer-btn" style="background:#15803d;margin-top:0;padding:7px">Answer</button>
            <button class="btn secondary" id="cm-reject-btn" style="margin-top:0;padding:7px">Decline</button>
          </div>
        </div>
      </div>
    </div>
  `
}

// ── Widget injection ───────────────────────────────────────────────────────────

function injectWidget(slug: string): void {
  if (document.getElementById('codemate-root')) return

  const root = document.createElement('div')
  root.id = 'codemate-root'
  root.style.cssText = `
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 2147483647;
  `

  const shadow = root.attachShadow({ mode: 'open' })
  shadow.innerHTML = getWidgetHTML()
  document.body.appendChild(root)

  initSocket(shadow, slug)
}

// ── Socket initialisation & event wiring ──────────────────────────────────────

function initSocket(shadow: ShadowRoot, slug: string): void {
  const socket: Socket = io(SERVER_URL, { transports: ['websocket'], autoConnect: false })

  const userId = getUserId()
  let displayName = localStorage.getItem('codemate_username') || ''

  let sessionRoom: string | null = null
  let partnerSocketId: string | null = null
  let typingTimer: any = null

  // WebRTC
  let peer: WebRTCPeer | null = null
  let callTimer: any = null
  let callSeconds = 0
  let micEnabled = true
  let camEnabled = true
  let isSharing = false

  // ── DOM refs ──
  const $count       = shadow.getElementById('cm-count') as HTMLSpanElement
  const $pillCount   = shadow.getElementById('cm-pill-count') as HTMLSpanElement
  const $status      = shadow.getElementById('cm-status') as HTMLDivElement
  const $matchBtn    = shadow.getElementById('cm-match-btn') as HTMLButtonElement
  const $incoming    = shadow.getElementById('cm-incoming') as HTMLDivElement
  const $incomingName = shadow.getElementById('cm-incoming-name') as HTMLDivElement
  const $acceptBtn   = shadow.getElementById('cm-accept-btn') as HTMLButtonElement
  const $declineBtn  = shadow.getElementById('cm-decline-btn') as HTMLButtonElement
  const $chatWrap    = shadow.getElementById('cm-chat-wrap') as HTMLDivElement
  const $chatBox     = shadow.getElementById('cm-chat-box') as HTMLDivElement
  const $typing      = shadow.getElementById('cm-typing') as HTMLDivElement
  const $msgInput    = shadow.getElementById('cm-msg-input') as HTMLInputElement
  const $sendBtn     = shadow.getElementById('cm-send-btn') as HTMLButtonElement
  const $endBtn      = shadow.getElementById('cm-end-btn') as HTMLButtonElement
  const $partnerName = shadow.getElementById('cm-partner-name') as HTMLSpanElement
  const $minimize    = shadow.getElementById('cm-minimize') as HTMLButtonElement
  const $card        = shadow.getElementById('cm-card') as HTMLDivElement
  const $pill        = shadow.getElementById('cm-pill') as HTMLDivElement

  const $signinWrap  = shadow.getElementById('cm-signin-wrap') as HTMLDivElement
  const $nameInput   = shadow.getElementById('cm-name-input') as HTMLInputElement
  const $signinBtn   = shadow.getElementById('cm-signin-btn') as HTMLButtonElement

  function showMainUI() {
    $signinWrap.style.display = 'none'
    $matchBtn.style.display = 'block'
    socket.connect()
  }

  if (displayName) {
    showMainUI()
  } else {
    $signinWrap.style.display = 'flex'
    $matchBtn.style.display = 'none'
  }

  $signinBtn.addEventListener('click', () => {
    const val = $nameInput.value.trim()
    if (!val) return
    displayName = val
    localStorage.setItem('codemate_username', displayName)
    showMainUI()
  })

  // Call DOM refs
  const $startCallBtn = shadow.getElementById('cm-start-call-btn') as HTMLButtonElement
  const $callWrap     = shadow.getElementById('cm-call-wrap') as HTMLDivElement
  const $callPartner  = shadow.getElementById('cm-call-partner') as HTMLSpanElement
  const $callTimer    = shadow.getElementById('cm-call-timer') as HTMLDivElement
  const $localVideo   = shadow.getElementById('cm-local-video') as HTMLVideoElement
  const $remoteVideo  = shadow.getElementById('cm-remote-video') as HTMLVideoElement
  const $micBtn       = shadow.getElementById('cm-mic-btn') as HTMLButtonElement
  const $camBtn       = shadow.getElementById('cm-cam-btn') as HTMLButtonElement
  const $screenBtn    = shadow.getElementById('cm-screen-btn') as HTMLButtonElement
  const $hangupBtn    = shadow.getElementById('cm-hangup-btn') as HTMLButtonElement
  const $incomingCall = shadow.getElementById('cm-incoming-call') as HTMLDivElement
  const $callerName   = shadow.getElementById('cm-caller-name') as HTMLDivElement
  const $answerBtn    = shadow.getElementById('cm-answer-btn') as HTMLButtonElement
  const $rejectBtn    = shadow.getElementById('cm-reject-btn') as HTMLButtonElement

  // ── Minimize ──
  $minimize.addEventListener('click', () => {
    $card.style.display = 'none'
    $pill.style.display = 'flex'
  })

  $pill.addEventListener('click', () => {
    $card.style.display = 'block'
    $pill.style.display = 'none'
  })

  // ── Connect ──
  socket.on('connect', () => {
    socket.emit('join:question', { questionSlug: slug, userId, displayName })
  })

  socket.on('connect_error', () => {
    setStatus('Cannot connect to server', 'error')
  })

  // ── Presence ──
  function updateCount(count: number): void {
    $count.textContent = String(count)
    $pillCount.textContent = String(count)
    chrome.runtime.sendMessage({ type: 'update_badge', count })
  }

  socket.on('join:confirmed', ({ count }: { count: number }) => updateCount(count))
  socket.on('presence:update', ({ count }: { count: number }) => updateCount(count))

  // ── Match request ──
  $matchBtn.addEventListener('click', () => {
    setStatus('Looking for a partner...')
    $matchBtn.disabled = true
    socket.emit('match:request', { questionSlug: slug, userId })
  })

  socket.on('match:none', ({ message }: { message: string }) => {
    setStatus(message, 'error')
    $matchBtn.disabled = false
  })

  socket.on('match:found', ({ partnerSocketId: pid, partnerName }: { partnerSocketId: string, partnerName: string }) => {
    partnerSocketId = pid
    setStatus(`Found ${partnerName || 'someone'}! Sending request...`)
    socket.emit('match:accept', { fromSocketId: pid })
  })

  // ── Incoming match ──
  socket.on('match:incoming', ({ fromSocketId, fromName }: { fromSocketId: string, fromName: string }) => {
    partnerSocketId = fromSocketId
    $incomingName.textContent = fromName || 'Someone'
    $incoming.classList.add('visible')
  })

  $acceptBtn.addEventListener('click', () => {
    $incoming.classList.remove('visible')
    socket.emit('match:accept', { fromSocketId: partnerSocketId })
  })

  $declineBtn.addEventListener('click', () => {
    $incoming.classList.remove('visible')
    socket.emit('match:decline', { fromSocketId: partnerSocketId })
    partnerSocketId = null
  })

  socket.on('match:declined', ({ message }: { message: string }) => {
    setStatus(message, 'error')
    $matchBtn.disabled = false
  })

  // ── Session established ──
  socket.on('match:accepted', ({ sessionRoom: room, partnerSocketId: pid, partnerName }: { sessionRoom: string, partnerSocketId: string, partnerName: string }) => {
    sessionRoom = room
    partnerSocketId = pid
    $partnerName.textContent = partnerName || 'your partner'
    $matchBtn.style.display = 'none'
    $status.style.display = 'none'
    $chatWrap.classList.add('open')
    $startCallBtn.style.display = 'block'
    appendSystemMessage('Session started! Say hello 👋')
  })

  // ── Chat ──
  function sendMessage(): void {
    const text = $msgInput.value.trim()
    if (!text || !sessionRoom) return
    socket.emit('chat:message', { sessionRoom, message: text })
    appendMessage(text, true)
    $msgInput.value = ''
  }

  $sendBtn.addEventListener('click', sendMessage)
  $msgInput.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage()
  })

  $msgInput.addEventListener('input', () => {
    if (!sessionRoom) return
    socket.emit('chat:typing', { sessionRoom, isTyping: true })
    clearTimeout(typingTimer)
    typingTimer = setTimeout(() => {
      socket.emit('chat:typing', { sessionRoom, isTyping: false })
    }, 1500)
  })

  socket.on('chat:message', ({ from, message, displayName: name }: { from: string, message: string, displayName: string }) => {
    if (from !== socket.id) {
      $typing.classList.remove('visible')
      appendMessage(message, false, name)
    }
  })

  socket.on('chat:typing', ({ from, isTyping }: { from: string, isTyping: boolean }) => {
    if (from !== socket.id) {
      $typing.classList.toggle('visible', isTyping)
    }
  })

  // WebRTC

  function createPeer(targetId: string) {
    peer = new WebRTCPeer({
      onTrack: (stream) => {
        $remoteVideo.srcObject = stream
      },
      onIceCandidate: (candidate) => {
        socket.emit('webrtc:ice', { to: targetId, candidate })
      },
      onConnectionChange: (state) => {
        if (state === 'connected') startCallTimer()
        if (state === 'disconnected' || state === 'failed') hangUp()
      },
    })
    return peer
  }

  async function startCall(targetId: string) {
    if (!sessionRoom) return
    // Now we ONLY emit call:start and wait for callee to accept via 'call:accepted'
    socket.emit('call:start', { to: targetId, sessionRoom })
    setStatus('Calling partner...')
  }

  async function handleCallAccepted(targetId: string) {
    if (!sessionRoom || peer) return // already in a call or no session
    
    const p = createPeer(targetId)
    const stream = await p.startLocalMedia()
    $localVideo.srcObject = stream
    
    const offer = await p.createOffer()
    socket.emit('webrtc:offer', { to: targetId, offer })
    
    openCallUI($partnerName.textContent || 'partner')
  }

  async function answerCall(targetId: string) {
    if (!sessionRoom) return
    const p = createPeer(targetId)
    const stream = await p.startLocalMedia()
    $localVideo.srcObject = stream
    
    socket.emit('call:accept', { to: targetId, sessionRoom })
    openCallUI($partnerName.textContent || 'partner')
  }

  function hangUp(notify = true) {
    if (notify && partnerSocketId && sessionRoom) {
      socket.emit('call:end', { to: partnerSocketId, sessionRoom })
    }
    peer?.destroy()
    peer = null
    stopCallTimer()
    $callWrap.classList.remove('open')
    $localVideo.srcObject = null
    $remoteVideo.srcObject = null
    $startCallBtn.style.display = 'block'
    micEnabled = true
    camEnabled = true
    isSharing = false
    updateControlStates()
  }

  function openCallUI(partnerName: string) {
    $callPartner.textContent = partnerName
    $callWrap.classList.add('open')
    $startCallBtn.style.display = 'none'
  }

  $startCallBtn.addEventListener('click', () => {
    if (partnerSocketId) startCall(partnerSocketId)
  })

  $micBtn.addEventListener('click', () => {
    micEnabled = !micEnabled
    peer?.toggleAudio(micEnabled)
    socket.emit('call:media', { to: partnerSocketId, audio: micEnabled, video: camEnabled })
    updateControlStates()
  })

  $camBtn.addEventListener('click', () => {
    camEnabled = !camEnabled
    peer?.toggleVideo(camEnabled)
    socket.emit('call:media', { to: partnerSocketId, audio: micEnabled, video: camEnabled })
    updateControlStates()
  })

  $screenBtn.addEventListener('click', async () => {
    if (!peer) return
    if (!isSharing) {
      try {
        await peer.startScreenShare()
        isSharing = true
      } catch (e: any) {
        setStatus(e.message, 'error')
      }
    } else {
      await peer.stopScreenShare()
      isSharing = false
    }
    updateControlStates()
  })

  $hangupBtn.addEventListener('click', () => hangUp(true))

  // Signaling
  socket.on('call:incoming', ({ from, fromName }: { from: string, fromName: string }) => {
    $callerName.textContent = fromName || 'Someone'
    $incomingCall.classList.add('visible')
    $answerBtn.onclick = () => {
       $incomingCall.classList.remove('visible')
       answerCall(from)
    }
    $rejectBtn.onclick = () => {
       $incomingCall.classList.remove('visible')
       socket.emit('call:reject', { to: from })
    }
  })

  socket.on('call:accepted', ({ from }: { from: string }) => {
    handleCallAccepted(from)
  })


  socket.on('webrtc:offer', async ({ from, offer }: { from: string, offer: any }) => {
    if (!peer) return
    const answer = await peer.handleOffer(offer)
    socket.emit('webrtc:answer', { to: from, answer })
  })

  socket.on('webrtc:answer', async ({ answer }: { answer: any }) => {
    if (peer) await peer.handleAnswer(answer)
  })

  socket.on('webrtc:ice', async ({ candidate }: { candidate: any }) => {
    if (peer) await peer.addIceCandidate(candidate)
  })

  socket.on('call:ended', () => {
    hangUp(false)
    appendSystemMessage('Call ended.')
  })

  socket.on('call:rejected', () => {
    setStatus('Call declined.', 'error')
    $startCallBtn.style.display = 'block'
  })

  // ── End session ──
  $endBtn.addEventListener('click', () => {
    hangUp(true)
    sessionRoom = null
    partnerSocketId = null
    $chatWrap.classList.remove('open')
    $matchBtn.style.display = 'block'
    $matchBtn.disabled = false
    $status.style.display = 'block'
    setStatus('Session ended.')
    $chatBox.innerHTML = ''
  })

  // ── Heartbeat every 60s ──
  setInterval(() => socket.emit('heartbeat'), 60_000)

  // ── Helpers ──
  function setStatus(msg: string, type: string = ''): void {
    $status.textContent = msg
    $status.className = 'status' + (type ? ' ' + type : '')
  }

  function appendMessage(text: string, isMe: boolean, name?: string): void {
    const div = document.createElement('div')
    div.className = 'msg ' + (isMe ? 'me' : 'them')
    div.textContent = (isMe ? 'You' : (name || 'Partner')) + ': ' + text
    $chatBox.appendChild(div)
    $chatBox.scrollTop = $chatBox.scrollHeight
  }

  function appendSystemMessage(text: string): void {
    const div = document.createElement('div')
    div.style.cssText = 'font-size:11px;color:#4b5563;text-align:center;padding:4px 0;'
    div.textContent = text
    $chatBox.appendChild(div)
    $chatBox.scrollTop = $chatBox.scrollHeight
  }

  function updateControlStates() {
    $micBtn.classList.toggle('active', micEnabled)
    $camBtn.classList.toggle('active', camEnabled)
    $screenBtn.classList.toggle('active', isSharing)
  }

  function startCallTimer() {
    callSeconds = 0
    callTimer = setInterval(() => {
      callSeconds++
      const m = String(Math.floor(callSeconds / 60)).padStart(2, '0')
      const s = String(callSeconds % 60).padStart(2, '0')
      $callTimer.textContent = `${m}:${s}`
    }, 1000)
  }

  function stopCallTimer() {
    if (callTimer) clearInterval(callTimer)
    callTimer = null
    $callTimer.textContent = '00:00'
  }
}

// ── SPA navigation watcher ─────────────────────────────────────────────────────

let lastSlug: string | null = null

function checkAndInject(): void {
  const slug = getQuestionSlug()
  if (slug && slug !== lastSlug) {
    const old = document.getElementById('codemate-root')
    if (old) old.remove()

    lastSlug = slug
    injectWidget(slug)
  }
}

const observer = new MutationObserver(checkAndInject)
observer.observe(document.body, { childList: true, subtree: true })

const _pushState = history.pushState.bind(history)
history.pushState = function (...args) {
  _pushState(...args)
  setTimeout(checkAndInject, 500)
}

window.addEventListener('popstate', () => setTimeout(checkAndInject, 500))

checkAndInject()
