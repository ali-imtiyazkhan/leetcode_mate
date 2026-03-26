// CodeMate Content Script
// Runs on https://leetcode.com/problems/* pages

import { io, Socket } from 'socket.io-client'

const SERVER_URL = 'http://localhost:4000'

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

// ── Widget HTML & CSS (injected into Shadow DOM) ───────────────────────────────

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

      /* Video Styles */
      .video-wrap {
        display: none;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 10px;
        position: relative;
      }
      .video-wrap.visible { display: grid; }
      
      video {
        width: 100%;
        height: 80px;
        background: #080810;
        border-radius: 8px;
        object-fit: cover;
        border: 1px solid #2a2a40;
      }
      .local-video { transform: scaleX(-1); }

      .call-controls {
        display: flex;
        gap: 6px;
        margin-bottom: 10px;
      }
      .call-controls .btn { padding: 6px; font-size: 11px; }

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

      <button class="btn" id="cm-match-btn">Find a partner</button>
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

        <div class="call-controls" id="cm-call-controls">
          <button class="btn" id="cm-call-btn" style="background:#22c55e">Video Call</button>
          <button class="btn danger" id="cm-hangup-btn" style="display:none">Hang Up</button>
        </div>

        <div class="video-wrap" id="cm-video-wrap">
          <video id="cm-remote-video" autoplay playsinline title="Partner"></video>
          <video id="cm-local-video" autoplay playsinline muted class="local-video" title="You"></video>
        </div>

        <div class="chat-box" id="cm-chat-box"></div>
        <div class="typing-indicator" id="cm-typing">Partner is typing...</div>
        <div class="chat-input-row">
          <input type="text" id="cm-msg-input" placeholder="Message your partner..." maxlength="500" />
          <button id="cm-send-btn">Send</button>
        </div>
        <button class="btn danger" id="cm-end-btn">End session</button>
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
  const socket: Socket = io(SERVER_URL, { transports: ['websocket'] })

  const userId = getUserId()
  const displayName = 'Coder_' + userId.slice(-5)

  let sessionRoom: string | null = null
  let partnerSocketId: string | null = null
  let typingTimer: any = null

  // WebRTC state
  let peerConnection: RTCPeerConnection | null = null
  let localStream: MediaStream | null = null
  const ICESERVERS = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  }

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

  // Video refs
  const $callBtn     = shadow.getElementById('cm-call-btn') as HTMLButtonElement
  const $hangupBtn   = shadow.getElementById('cm-hangup-btn') as HTMLButtonElement
  const $videoWrap   = shadow.getElementById('cm-video-wrap') as HTMLDivElement
  const $localVideo  = shadow.getElementById('cm-local-video') as HTMLVideoElement
  const $remoteVideo = shadow.getElementById('cm-remote-video') as HTMLVideoElement

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

  // Typing indicator
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

  // ── WebRTC Logic ──
  async function startCall() {
    try {
      appendSystemMessage('Requesting camera/mic...')
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      $localVideo.srcObject = localStream
      $videoWrap.classList.add('visible')
      $callBtn.style.display = 'none'
      $hangupBtn.style.display = 'block'

      peerConnection = new RTCPeerConnection(ICESERVERS)
      
      localStream.getTracks().forEach(track => {
        peerConnection!.addTrack(track, localStream!)
      })

      peerConnection.ontrack = (event) => {
        $remoteVideo.srcObject = event.streams[0]
      }

      peerConnection.onicecandidate = (event) => {
        if (event.candidate && partnerSocketId) {
          socket.emit('webrtc:ice', { to: partnerSocketId, candidate: event.candidate })
        }
      }

      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)
      socket.emit('webrtc:offer', { to: partnerSocketId!, offer })
      
      appendSystemMessage('Calling partner...')
    } catch (err) {
      console.error('Call failed', err)
      appendSystemMessage('Call error: ' + (err as Error).message)
    }
  }

  function hangUp(notify = true) {
    if (notify && partnerSocketId) {
       socket.emit('webrtc:hangup', { to: partnerSocketId })
    }
    if (peerConnection) {
      peerConnection.close()
      peerConnection = null
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
      localStream = null
    }
    $localVideo.srcObject = null
    $remoteVideo.srcObject = null
    $videoWrap.classList.remove('visible')
    $callBtn.style.display = 'block'
    $hangupBtn.style.display = 'none'
    appendSystemMessage('Call ended.')
  }

  $callBtn.addEventListener('click', startCall)
  $hangupBtn.addEventListener('click', () => hangUp(true))

  socket.on('webrtc:offer', async ({ from, offer }: { from: string, offer: any }) => {
    try {
      if (!peerConnection) {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        $localVideo.srcObject = localStream
        $videoWrap.classList.add('visible')
        $callBtn.style.display = 'none'
        $hangupBtn.style.display = 'block'

        peerConnection = new RTCPeerConnection(ICESERVERS)
        localStream.getTracks().forEach(track => {
          peerConnection!.addTrack(track, localStream!)
        })
        
        peerConnection.ontrack = (event) => {
          $remoteVideo.srcObject = event.streams[0]
        }
        
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('webrtc:ice', { to: from, candidate: event.candidate })
          }
        }
      }

      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)
      socket.emit('webrtc:answer', { to: from, answer })
      appendSystemMessage('Incoming call...')
    } catch (err) {
       console.error('Error handling offer', err)
    }
  })

  socket.on('webrtc:answer', async ({ answer }: { answer: any }) => {
    if (peerConnection) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
      appendSystemMessage('Call connected!')
    }
  })

  socket.on('webrtc:ice', async ({ candidate }: { candidate: any }) => {
    if (peerConnection) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
      } catch (e) {
        console.error('Error adding ICE candidate', e)
      }
    }
  })

  socket.on('webrtc:hangup', () => {
    hangUp(false)
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
