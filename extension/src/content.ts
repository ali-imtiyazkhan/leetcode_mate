import { io, Socket } from 'socket.io-client'
import { WebRTCPeer } from './webrtc'

const SERVER_URL = (import.meta as any).env.VITE_SERVER_URL || 'http://localhost:4000'

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
        background: #282828;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 0;
        min-width: 300px;
        max-width: 340px;
        color: #eff2f6;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        font-size: 13px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
      }

      .brand {
        font-size: 12px;
        font-weight: 700;
        color: #ffa116;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      .presence {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #1a1a1a;
        padding: 10px;
        border-radius: 8px;
        margin-bottom: 4px;
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #2cbb5d;
        box-shadow: 0 0 10px rgba(44, 187, 93, 0.4);
        animation: pulse 2.5s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(0.9); }
      }

      .count-wrap { display: flex; align-items: baseline; gap: 6px; }
      .count { font-size: 20px; font-weight: 700; color: #eff2f6; line-height: 1; }
      .count-label { font-size: 12px; color: #8a8a8e; }

      .divider {
        height: 1px;
        background: rgba(255, 255, 255, 0.06);
        margin: 14px 0;
      }

      .btn {
        width: 100%;
        padding: 10px 14px;
        border-radius: 8px;
        border: none;
        background: #ffa116;
        color: #1a1a1a;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .btn:hover:not(:disabled) { background: #ffb84d; transform: translateY(-1px); }
      .btn:active:not(:disabled) { transform: translateY(0); }
      .btn:disabled { background: #3e3e3e; color: #8a8a8e; cursor: not-allowed; }
      
      .btn.secondary {
        background: #3e3e3e;
        color: #eff2f6;
        margin-top: 8px;
      }
      .btn.secondary:hover:not(:disabled) { background: #4a4a4a; }
      
      .btn.danger { background: #ef4743; color: #fff; margin-top: 8px; }
      .btn.danger:hover:not(:disabled) { background: #f85e5a; }

      .status {
        font-size: 11px;
        color: #8a8a8e;
        margin-top: 10px;
        text-align: center;
        min-height: 16px;
      }
      .status.success { color: #2cbb5d; }
      .status.error { color: #ef4743; }

      .incoming-banner {
        background: rgba(255, 161, 22, 0.1);
        border: 1px solid rgba(255, 161, 22, 0.2);
        border-radius: 10px;
        padding: 12px;
        margin-top: 12px;
        display: none;
      }
      .incoming-banner.visible { display: block; }
      .incoming-name { font-weight: 600; color: #ffa116; font-size: 13px; }
      .incoming-actions { display: flex; gap: 8px; margin-top: 10px; }
      .incoming-actions .btn { margin-top: 0; padding: 8px; font-size: 12px; }

      .chat-wrap { display: none; margin-top: 12px; }
      .chat-wrap.open { display: block; }

      .chat-partner {
        font-size: 11px;
        color: #8a8a8e;
        margin-bottom: 8px;
        text-align: center;
      }
      .chat-partner span { color: #ffa116; font-weight: 600; }

      .chat-box {
        background: #1a1a1a;
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        padding: 10px;
        height: 180px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 6px;
        scrollbar-width: thin;
        scrollbar-color: #3e3e3e transparent;
      }

      .msg {
        font-size: 12px;
        line-height: 1.5;
        padding: 6px 12px;
        border-radius: 14px;
        max-width: 85%;
        word-break: break-word;
      }
      .msg.me {
        background: #ffa116;
        color: #1a1a1a;
        align-self: flex-end;
        border-bottom-right-radius: 4px;
      }
      .msg.them {
        background: #3e3e3e;
        color: #eff2f6;
        align-self: flex-start;
        border-bottom-left-radius: 4px;
      }

      .typing-indicator {
        font-size: 11px;
        color: #8a8a8e;
        padding: 4px 10px;
        font-style: italic;
        display: none;
      }
      .typing-indicator.visible { display: block; }

      .chat-input-row {
        display: flex;
        gap: 8px;
        margin-top: 10px;
      }
      .chat-input-row input {
        flex: 1;
        background: #1a1a1a;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 8px 12px;
        color: #eff2f6;
        font-size: 12px;
        outline: none;
        transition: border-color 0.2s;
      }
      .chat-input-row input:focus { border-color: #ffa116; }
      .chat-input-row button {
        background: #3e3e3e;
        border: none;
        border-radius: 8px;
        padding: 8px 14px;
        color: #eff2f6;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .chat-input-row button:hover { background: #4a4a4a; }

      .minimize-btn {
        background: none;
        border: none;
        color: #8a8a8e;
        cursor: pointer;
        font-size: 18px;
        line-height: 1;
        padding: 4px;
        transition: color 0.2s;
      }
      .minimize-btn:hover { color: #eff2f6; }

      /* Call UI Styles */
      .call-wrap { display: none; margin-top: 12px; }
      .call-wrap.open { display: block; }

      .call-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #1a1a1a;
        border-radius: 10px;
        padding: 10px 14px;
        margin-bottom: 10px;
      }
      .call-status { font-size: 12px; color: #8a8a8e; }
      .call-status .name { color: #ffa116; font-weight: 600; }
      .call-timer { font-size: 13px; font-weight: 700; color: #2cbb5d; font-variant-numeric: tabular-nums; }

      .videos {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 10px;
      }
      .video-wrap {
        background: #1a1a1a;
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        overflow: hidden;
        aspect-ratio: 4/3;
        position: relative;
      }
      .video-wrap video { width: 100%; height: 100%; object-fit: cover; }
      .video-label {
        position: absolute;
        bottom: 6px; left: 8px;
        font-size: 10px;
        color: rgba(255,255,255,0.7);
        background: rgba(0,0,0,0.6);
        padding: 2px 6px;
        border-radius: 4px;
        backdrop-filter: blur(4px);
      }
      
      .call-controls { display: flex; gap: 8px; }
      .ctrl-btn {
        flex: 1; padding: 10px 4px; border-radius: 10px; border: none;
        background: #3e3e3e; color: #eff2f6; font-size: 11px; cursor: pointer;
        transition: all 0.2s; display: flex; flex-direction: column;
        align-items: center; gap: 4px;
      }
      .ctrl-btn:hover { background: #4a4a4a; }
      .ctrl-btn.active { background: rgba(255, 161, 22, 0.15); color: #ffa116; border: 1px solid rgba(255, 161, 22, 0.3); }
      .ctrl-btn.end { background: #ef4743; color: #fff; }
      .ctrl-btn.end:hover { background: #f85e5a; }
      .ctrl-icon { font-size: 18px; }

      .incoming-call {
        background: #1d2b1d;
        border: 1px solid #2cbb5d;
        border-radius: 12px;
        padding: 14px;
        margin-top: 12px;
        display: none;
      }
      .incoming-call.visible { display: block; }
      .incoming-call-name { color: #2cbb5d; font-weight: 700; font-size: 14px; }
      .incoming-call-actions { display: flex; gap: 8px; margin-top: 10px; }

      .pill {
        display: none;
        align-items: center;
        gap: 8px;
        background: #282828;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        padding: 8px 16px;
        cursor: pointer;
        box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        transition: transform 0.2s;
      }
      .pill:hover { transform: scale(1.05); }
      .pill-count { font-size: 14px; font-weight: 700; color: #ffa116; }
      .pill-label { font-size: 12px; color: #8a8a8e; }

      /* ── Tab Bar ─────────────────────────────────── */
      .tab-bar {
        display: flex;
        background: #1a1a1a;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        border-radius: 12px 12px 0 0;
        overflow: hidden;
      }
      .tab-btn {
        flex: 1;
        padding: 10px 8px;
        background: none;
        border: none;
        color: #6b6b70;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.25s ease;
        position: relative;
        letter-spacing: 0.02em;
      }
      .tab-btn:hover { color: #a0a0a8; }
      .tab-btn.active {
        color: #ffa116;
        background: rgba(255, 161, 22, 0.06);
      }
      .tab-btn.active::after {
        content: '';
        position: absolute;
        bottom: 0; left: 20%; right: 20%;
        height: 2px;
        background: linear-gradient(90deg, transparent, #ffa116, transparent);
        border-radius: 2px;
      }

      .tab-panel { display: none; padding: 16px; }
      .tab-panel.active { display: block; }

      /* ── AI Panel Styles ─────────────────────────── */
      .ai-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
      }
      .ai-title {
        font-size: 13px;
        font-weight: 700;
        color: #eff2f6;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .ai-title .sparkle { font-size: 16px; }

      .ai-lang-select {
        background: #1a1a1a;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 6px;
        color: #eff2f6;
        font-size: 11px;
        padding: 5px 8px;
        outline: none;
        cursor: pointer;
        transition: border-color 0.2s;
      }
      .ai-lang-select:focus { border-color: #ffa116; }

      .ai-generate-btn {
        width: 100%;
        padding: 11px 14px;
        border-radius: 10px;
        border: none;
        background: linear-gradient(135deg, #ffa116 0%, #ff6b2b 100%);
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        letter-spacing: 0.02em;
        box-shadow: 0 4px 15px rgba(255, 161, 22, 0.2);
      }
      .ai-generate-btn:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(255, 161, 22, 0.35);
      }
      .ai-generate-btn:active:not(:disabled) { transform: translateY(0); }
      .ai-generate-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        box-shadow: none;
      }

      /* Loading skeleton */
      .ai-loading {
        display: none;
        margin-top: 14px;
      }
      .ai-loading.visible { display: block; }
      .ai-skeleton {
        height: 14px;
        background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s ease-in-out infinite;
        border-radius: 4px;
        margin-bottom: 8px;
      }
      .ai-skeleton:nth-child(2) { width: 85%; }
      .ai-skeleton:nth-child(3) { width: 70%; }
      .ai-skeleton:nth-child(4) { width: 90%; height: 10px; }
      .ai-skeleton:nth-child(5) { width: 60%; height: 10px; }
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      /* Solution output */
      .ai-output {
        display: none;
        margin-top: 14px;
        max-height: 420px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #3e3e3e transparent;
        animation: fadeInUp 0.4s ease;
      }
      .ai-output.visible { display: block; }

      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .ai-section-title {
        font-size: 12px;
        font-weight: 700;
        color: #ffa116;
        margin: 14px 0 6px 0;
        display: flex;
        align-items: center;
        gap: 6px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
      .ai-section-title:first-child { margin-top: 0; }

      .ai-text {
        font-size: 12.5px;
        line-height: 1.7;
        color: #c8c8d0;
        word-break: break-word;
      }
      .ai-text strong { color: #eff2f6; }
      .ai-text em { color: #a78bfa; font-style: italic; }

      .ai-complexity {
        background: rgba(255, 161, 22, 0.06);
        border: 1px solid rgba(255, 161, 22, 0.12);
        border-radius: 8px;
        padding: 10px 12px;
        font-size: 12px;
        color: #c8c8d0;
        line-height: 1.6;
      }
      .ai-complexity strong { color: #ffa116; }

      .ai-code-wrap {
        position: relative;
        margin-top: 6px;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.06);
      }
      .ai-code-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #1a1a1a;
        padding: 6px 12px;
        font-size: 10px;
        color: #6b6b70;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .ai-copy-btn {
        background: none;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 4px;
        color: #8a8a8e;
        font-size: 10px;
        padding: 3px 8px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .ai-copy-btn:hover { color: #ffa116; border-color: #ffa116; }
      .ai-code-block {
        background: #0d0d0d;
        padding: 14px;
        font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
        font-size: 12px;
        line-height: 1.7;
        color: #c8c8d0;
        overflow-x: auto;
        white-space: pre;
        tab-size: 4;
        scrollbar-width: thin;
        scrollbar-color: #3e3e3e transparent;
      }

      /* Syntax highlighting tokens */
      .tok-kw { color: #c678dd; } /* keywords */
      .tok-str { color: #98c379; } /* strings */
      .tok-num { color: #d19a66; } /* numbers */
      .tok-cm { color: #5c6370; font-style: italic; } /* comments */
      .tok-fn { color: #61afef; } /* functions */
      .tok-type { color: #e5c07b; } /* types */
      .tok-op { color: #56b6c2; } /* operators */

      .ai-error {
        background: rgba(239, 71, 67, 0.1);
        border: 1px solid rgba(239, 71, 67, 0.2);
        border-radius: 8px;
        padding: 10px 12px;
        font-size: 12px;
        color: #ef4743;
        margin-top: 12px;
        display: none;
      }
      .ai-error.visible { display: block; }

      .ai-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 10px;
        color: #4b5563;
        margin-top: 10px;
      }
      .ai-badge .dot-sm {
        width: 5px; height: 5px;
        border-radius: 50%;
        background: #2cbb5d;
      }
      /* ── Board Panel Styles ──────────────────────── */
      .board-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        background: #1a1a1a;
        padding: 6px 10px;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.05);
      }
      .board-colors { display: flex; gap: 8px; }
      .board-color {
        width: 16px; height: 16px;
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid transparent;
        transition: transform 0.2s;
      }
      .board-color:hover { transform: scale(1.1); }
      .board-color.active { border-color: #fff; transform: scale(1.1); }
      .board-clear {
        background: none; border: none; color: #ef4743; font-size: 11px; font-weight: 600; cursor: pointer;
        padding: 4px 8px; border-radius: 4px; transition: background 0.2s;
      }
      .board-clear:hover { background: rgba(239, 71, 67, 0.1); }
      .board-canvas-wrap {
        background: #0d0d0d;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.1);
        overflow: hidden;
        cursor: crosshair;
        touch-action: none;
        display: flex;
        justify-content: center;
      }
      .board-canvas {
        background: #0d0d0d;
        width: 300px;
        height: 350px;
      }
    </style>

    <div class="pill" id="cm-pill">
      <div class="dot"></div>
      <span class="pill-count" id="cm-pill-count">--</span>
      <span class="pill-label">solving</span>
    </div>

    <div class="card" id="cm-card">
      <!-- Tab Bar -->
      <div class="tab-bar">
        <button class="tab-btn active" id="cm-tab-main">👥 Collab</button>
        <button class="tab-btn" id="cm-tab-ai">✨ AI Sol</button>
        <button class="tab-btn" id="cm-tab-board">🎨 Board</button>
      </div>

      <!-- Main Tab Panel -->
      <div class="tab-panel active" id="cm-panel-main">
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

      <!-- AI Solution Tab Panel -->
      <div class="tab-panel" id="cm-panel-ai">
        <div class="ai-header">
          <div class="ai-title">
            <span class="sparkle">✨</span> AI Solution
          </div>
          <select class="ai-lang-select" id="cm-ai-lang">
            <option value="Python">Python</option>
            <option value="JavaScript">JavaScript</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
            <option value="Go">Go</option>
            <option value="Rust">Rust</option>
          </select>
        </div>

        <button class="ai-generate-btn" id="cm-ai-generate">
          <span>⚡</span> Generate Solution
        </button>
        <button class="ai-generate-btn" id="cm-ai-analyze" style="background:#3e3e3e;margin-top:8px;box-shadow:none;color:#eff2f6;">
          <span>🐞</span> Analyze My Code
        </button>

        <div class="ai-loading" id="cm-ai-loading">
          <div class="ai-skeleton"></div>
          <div class="ai-skeleton"></div>
          <div class="ai-skeleton"></div>
          <div class="ai-skeleton"></div>
          <div class="ai-skeleton"></div>
        </div>

        <div class="ai-error" id="cm-ai-error"></div>

        <div class="ai-output" id="cm-ai-output"></div>

        <div class="ai-badge" id="cm-ai-badge" style="display:none">
          <span class="dot-sm"></span>
          Powered by Gemini Flash
        </div>
      </div>

      <!-- Board Tab Panel -->
      <div class="tab-panel" id="cm-panel-board">
        <div class="board-toolbar">
          <div class="board-colors">
            <div class="board-color active" style="background:#ffa116" data-color="#ffa116"></div>
            <div class="board-color" style="background:#2cbb5d" data-color="#2cbb5d"></div>
            <div class="board-color" style="background:#ef4743" data-color="#ef4743"></div>
            <div class="board-color" style="background:#61afef" data-color="#61afef"></div>
            <div class="board-color" style="background:#e2e2f0" data-color="#e2e2f0"></div>
          </div>
          <button class="board-clear" id="cm-board-clear">Clear 🗑</button>
        </div>
        <div class="board-canvas-wrap">
          <canvas id="cm-canvas" class="board-canvas" width="300" height="350"></canvas>
        </div>
      </div>
    </div>
  `
}

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

  // DOM refs
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

  // AI Panel DOM refs
  const $tabMain      = shadow.getElementById('cm-tab-main') as HTMLButtonElement
  const $tabAi        = shadow.getElementById('cm-tab-ai') as HTMLButtonElement
  const $panelMain    = shadow.getElementById('cm-panel-main') as HTMLDivElement
  const $panelAi      = shadow.getElementById('cm-panel-ai') as HTMLDivElement
  const $aiLang       = shadow.getElementById('cm-ai-lang') as HTMLSelectElement
  const $aiGenerate   = shadow.getElementById('cm-ai-generate') as HTMLButtonElement
  const $aiLoading    = shadow.getElementById('cm-ai-loading') as HTMLDivElement
  const $aiError      = shadow.getElementById('cm-ai-error') as HTMLDivElement
  const $aiOutput     = shadow.getElementById('cm-ai-output') as HTMLDivElement
  const $aiBadge      = shadow.getElementById('cm-ai-badge') as HTMLDivElement
  const $aiAnalyze    = shadow.getElementById('cm-ai-analyze') as HTMLButtonElement

  // Board Panel DOM refs
  const $tabBoard     = shadow.getElementById('cm-tab-board') as HTMLButtonElement
  const $panelBoard   = shadow.getElementById('cm-panel-board') as HTMLDivElement
  const $boardColors  = shadow.querySelectorAll('.board-color')
  const $boardClear   = shadow.getElementById('cm-board-clear') as HTMLButtonElement
  const $canvas       = shadow.getElementById('cm-canvas') as HTMLCanvasElement

  // Tab switching
  function switchTab(tab: 'main' | 'ai' | 'board') {
    $tabMain.classList.toggle('active', tab === 'main')
    $tabAi.classList.toggle('active', tab === 'ai')
    $tabBoard.classList.toggle('active', tab === 'board')
    $panelMain.classList.toggle('active', tab === 'main')
    $panelAi.classList.toggle('active', tab === 'ai')
    $panelBoard.classList.toggle('active', tab === 'board')
  }

  $tabMain.addEventListener('click', () => switchTab('main'))
  $tabAi.addEventListener('click', () => switchTab('ai'))
  $tabBoard.addEventListener('click', () => switchTab('board'))

  // Scrape problem from LeetCode DOM
  function scrapeQuestion(): { title: string; description: string } | null {
    // Try to get the title
    const titleEl = document.querySelector('[data-cy="question-title"]')
      || document.querySelector('.text-title-large')
      || document.querySelector('div[class*="title"] a')
      || document.querySelector('h4[class*="title"]')
      || document.querySelector('[class*="flexlayout__tab"] [class*="title"]')
    
    let title = titleEl?.textContent?.trim() || ''
    
    // Fallback: build from slug
    if (!title && slug) {
      title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }

    // Try to get the description
    const descEl = document.querySelector('[data-track-load="description_content"]')
      || document.querySelector('div[class*="elfjS"]')
      || document.querySelector('.question-content')
      || document.querySelector('[class*="_1l1MA"]')

    let description = descEl?.textContent?.trim() || ''

    if (!description) {
      // Last resort: grab from meta tag
      const meta = document.querySelector('meta[name="description"]')
      description = meta?.getAttribute('content') || ''
    }

    if (!title && !description) return null
    
    // Truncate very long descriptions to stay within API limits
    if (description.length > 3000) {
      description = description.substring(0, 3000) + '...'
    }
    
    return { title, description }
  }

  function scrapeUserCode(): string | null {
    // LeetCode uses Monaco editor, which breaks code into .view-line divs
    const lines = document.querySelectorAll('.view-line')
    if (!lines || lines.length === 0) return null
    return Array.from(lines).map(line => line.textContent).join('\n')
  }

  // ── Basic syntax highlighter ──
  function highlightCode(code: string, lang: string): string {
    let html = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    // Comments
    html = html.replace(/(\/\/.*$|#.*$)/gm, '<span class="tok-cm">$1</span>')
    html = html.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-cm">$1</span>')

    // Strings
    html = html.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g, '<span class="tok-str">$1</span>')

    // Numbers
    html = html.replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-num">$1</span>')

    // Keywords
    const kwPatterns: Record<string, string> = {
      python: 'def|class|return|if|elif|else|for|while|in|not|and|or|True|False|None|import|from|as|with|try|except|finally|raise|yield|lambda|pass|break|continue|self',
      javascript: 'const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|new|this|import|export|from|async|await|try|catch|finally|throw|typeof|instanceof|null|undefined|true|false',
      typescript: 'const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|new|this|import|export|from|async|await|try|catch|finally|throw|typeof|instanceof|null|undefined|true|false|interface|type|enum|readonly|abstract|implements|extends',
      java: 'public|private|protected|class|interface|extends|implements|return|if|else|for|while|do|switch|case|break|continue|new|this|super|static|final|void|int|long|double|float|boolean|char|String|null|true|false|try|catch|finally|throw|throws|import|package',
      cpp: 'int|long|double|float|char|bool|void|string|vector|map|set|class|struct|return|if|else|for|while|do|switch|case|break|continue|new|delete|this|nullptr|true|false|const|auto|using|namespace|include|template|typename|public|private|protected|virtual|override|static',
      go: 'func|return|if|else|for|range|switch|case|break|continue|var|const|type|struct|interface|map|chan|go|defer|select|package|import|nil|true|false|string|int|int64|float64|bool|error|make|append|len',
      rust: 'fn|let|mut|return|if|else|for|while|loop|match|break|continue|struct|enum|impl|trait|pub|use|mod|self|Self|true|false|None|Some|Ok|Err|String|Vec|Box|Option|Result|i32|i64|f64|bool|usize|async|await|move|ref|where',
    }

    const langKey = lang.toLowerCase().replace('c++', 'cpp')
    const kws = kwPatterns[langKey] || kwPatterns['python']
    html = html.replace(new RegExp(`\\b(${kws})\\b`, 'g'), '<span class="tok-kw">$1</span>')

    // Function calls
    html = html.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '<span class="tok-fn">$1</span>')

    return html
  }

  // Render markdown solution to HTML
  function renderSolution(markdown: string): string {
    let html = ''
    const lines = markdown.split('\n')
    let inCodeBlock = false
    let codeContent = ''
    let codeLang = ''
    let blockId = 0

    for (const line of lines) {
      if (line.trim().startsWith('```') && !inCodeBlock) {
        inCodeBlock = true
        codeLang = line.trim().replace('```', '').trim() || 'text'
        codeContent = ''
        continue
      }
      if (line.trim().startsWith('```') && inCodeBlock) {
        inCodeBlock = false
        const highlighted = highlightCode(codeContent.trimEnd(), codeLang)
        const bid = `cm-code-${blockId++}`
        html += `<div class="ai-code-wrap">
          <div class="ai-code-header">
            <span>${codeLang}</span>
            <button class="ai-copy-btn" data-code-id="${bid}">Copy</button>
          </div>
          <pre class="ai-code-block" id="${bid}">${highlighted}</pre>
        </div>`
        continue
      }
      if (inCodeBlock) {
        codeContent += line + '\n'
        continue
      }

      // Headings → section titles
      if (line.startsWith('## ') || line.startsWith('**') && line.endsWith('**')) {
        const text = line.replace(/^#+\s*/, '').replace(/\*\*/g, '')
        const icon = text.toLowerCase().includes('intuition') ? '💡' :
                     text.toLowerCase().includes('approach') ? '🎯' :
                     text.toLowerCase().includes('complexity') ? '📊' :
                     text.toLowerCase().includes('code') ? '💻' : '📌'
        html += `<div class="ai-section-title">${icon} ${text}</div>`
        continue
      }

      if (line.startsWith('# ')) continue // skip top-level heading

      // Inline formatting
      let processed = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code style="background:#1a1a1a;padding:1px 5px;border-radius:3px;font-size:11px;color:#ffa116">$1</code>')
        .replace(/^- (.+)/, '• $1')

      if (processed.trim()) {
        // Check if it's a complexity line
        if (processed.toLowerCase().includes('time complexity') || processed.toLowerCase().includes('space complexity')) {
          html += `<div class="ai-complexity">${processed}</div>`
        } else {
          html += `<div class="ai-text">${processed}</div>`
        }
      } else {
        html += '<div style="height:6px"></div>'
      }
    }

    return html
  }

  // Fetch AI solution from server
  async function fetchAISolution() {
    const scraped = scrapeQuestion()
    if (!scraped) {
      $aiError.textContent = 'Could not read the problem from this page. Please make sure you are on a LeetCode problem page.'
      $aiError.classList.add('visible')
      return
    }

    const lang = $aiLang.value

    // Reset state
    $aiError.classList.remove('visible')
    $aiOutput.classList.remove('visible')
    $aiBadge.style.display = 'none'
    $aiLoading.classList.add('visible')
    $aiGenerate.disabled = true
    $aiGenerate.innerHTML = '<span>⏳</span> Generating...'

    try {
      const response = await fetch(`${SERVER_URL}/ai/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          title: scraped.title,
          description: scraped.description,
          language: lang,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate solution')
      }

      // Render the solution
      $aiOutput.innerHTML = renderSolution(data.solution)
      $aiOutput.classList.add('visible')
      $aiBadge.style.display = 'inline-flex'

      // Wire up copy buttons
      $aiOutput.querySelectorAll('.ai-copy-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const codeId = (btn as HTMLElement).dataset.codeId
          if (!codeId) return
          const codeEl = shadow.getElementById(codeId)
          if (!codeEl) return
          const text = codeEl.textContent || ''
          navigator.clipboard.writeText(text).then(() => {
            const origText = btn.textContent
            btn.textContent = 'Copied!'
            ;(btn as HTMLElement).style.color = '#2cbb5d'
            ;(btn as HTMLElement).style.borderColor = '#2cbb5d'
            setTimeout(() => {
              btn.textContent = origText
              ;(btn as HTMLElement).style.color = ''
              ;(btn as HTMLElement).style.borderColor = ''
            }, 2000)
          })
        })
      })

    } catch (err: any) {
      $aiError.textContent = err.message || 'Something went wrong. Please try again.'
      $aiError.classList.add('visible')
    } finally {
      $aiLoading.classList.remove('visible')
      $aiGenerate.disabled = false
      $aiGenerate.innerHTML = '<span>⚡</span> Generate Solution'
    }
  }

  // Fetch AI Code Analysis from server
  async function fetchAIAnalyze() {
    const scraped = scrapeQuestion()
    const userCode = scrapeUserCode()
    if (!scraped) {
      $aiError.textContent = 'Could not read the problem description from this page.'
      $aiError.classList.add('visible')
      return
    }
    if (!userCode || userCode.trim() === '') {
      $aiError.textContent = 'Could not find any code in the editor to analyze. Make sure you have written some code.'
      $aiError.classList.add('visible')
      return
    }

    // Reset state
    $aiError.classList.remove('visible')
    $aiOutput.classList.remove('visible')
    $aiBadge.style.display = 'none'
    $aiLoading.classList.add('visible')
    $aiAnalyze.disabled = true
    $aiAnalyze.innerHTML = '<span>⏳</span> Analyzing...'

    try {
      const response = await fetch(`${SERVER_URL}/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: scraped.title,
          description: scraped.description,
          code: userCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze code')
      }

      // Render the analysis (re-using the solution renderer)
      $aiOutput.innerHTML = renderSolution(data.analysis)
      $aiOutput.classList.add('visible')
      $aiBadge.style.display = 'inline-flex'
      
      // Wire up copy buttons (if any are generated)
      $aiOutput.querySelectorAll('.ai-copy-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const codeId = (btn as HTMLElement).dataset.codeId
          if (!codeId) return
          const codeEl = shadow.getElementById(codeId)
          if (!codeEl) return
          navigator.clipboard.writeText(codeEl.textContent || '').then(() => {
            const origText = btn.textContent
            btn.textContent = 'Copied!'
            ;(btn as HTMLElement).style.color = '#2cbb5d'
            setTimeout(() => { btn.textContent = origText; (btn as HTMLElement).style.color = '' }, 2000)
          })
        })
      })

    } catch (err: any) {
      $aiError.textContent = err.message || 'Something went wrong. Please try again.'
      $aiError.classList.add('visible')
    } finally {
      $aiLoading.classList.remove('visible')
      $aiAnalyze.disabled = false
      $aiAnalyze.innerHTML = '<span>🐞</span> Analyze My Code'
    }
  }

  $aiGenerate.addEventListener('click', fetchAISolution)
  $aiAnalyze.addEventListener('click', fetchAIAnalyze)

  // Native Board Logic
  const ctx = $canvas.getContext('2d')
  let isDrawing = false
  let currentStrokeColor = '#ffa116'
  let lastX = 0
  let lastY = 0

  $boardColors.forEach(el => {
    el.addEventListener('click', () => {
      $boardColors.forEach(c => c.classList.remove('active'))
      el.classList.add('active')
      currentStrokeColor = (el as HTMLDivElement).dataset.color || '#ffa116'
    })
  })

  $boardClear.addEventListener('click', () => {
    ctx?.clearRect(0, 0, $canvas.width, $canvas.height)
    if (sessionRoom) {
      socket.emit('board:clear', { sessionRoom })
    }
  })

  function drawLine(x0: number, y0: number, x1: number, y1: number, color: string, emit: boolean) {
    if (!ctx) return
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.stroke()
    ctx.closePath()

    if (!emit || !sessionRoom) return
    socket.emit('board:draw', {
      sessionRoom,
      x0, y0, x1, y1, color
    })
  }

  function getMousePos(e: MouseEvent | TouchEvent) {
    const rect = $canvas.getBoundingClientRect()
    let clientX, clientY
    if (window.TouchEvent && e instanceof TouchEvent) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = (e as MouseEvent).clientX
      clientY = (e as MouseEvent).clientY
    }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }

  function startDrawing(e: MouseEvent | TouchEvent) {
    isDrawing = true
    const pos = getMousePos(e)
    lastX = pos.x
    lastY = pos.y
  }

  function draw(e: MouseEvent | TouchEvent) {
    if (!isDrawing) return
    e.preventDefault()
    const pos = getMousePos(e)
    drawLine(lastX, lastY, pos.x, pos.y, currentStrokeColor, true)
    lastX = pos.x
    lastY = pos.y
  }

  function stopDrawing() {
    isDrawing = false
  }

  $canvas.addEventListener('mousedown', startDrawing)
  $canvas.addEventListener('mousemove', draw)
  $canvas.addEventListener('mouseup', stopDrawing)
  $canvas.addEventListener('mouseout', stopDrawing)
  $canvas.addEventListener('touchstart', startDrawing)
  $canvas.addEventListener('touchmove', draw)
  $canvas.addEventListener('touchend', stopDrawing)


  $minimize.addEventListener('click', () => {
    $card.style.display = 'none'
    $pill.style.display = 'flex'
  })

  $pill.addEventListener('click', () => {
    $card.style.display = 'block'
    $pill.style.display = 'none'
  })

  socket.on('connect', () => {
    socket.emit('join:question', { questionSlug: slug, userId, displayName })
  })

  socket.on('connect_error', () => {
    setStatus('Cannot connect to server', 'error')
  })

  function updateCount(count: number): void {
    $count.textContent = String(count)
    $pillCount.textContent = String(count)
    chrome.runtime.sendMessage({ type: 'update_badge', count })
  }

  socket.on('join:confirmed', ({ count }: { count: number }) => updateCount(count))
  socket.on('presence:update', ({ count }: { count: number }) => updateCount(count))

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

  // Incoming match
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

  // ── Board Sync ──
  socket.on('board:draw', (data: { x0: number, y0: number, x1: number, y1: number, color: string }) => {
    drawLine(data.x0, data.y0, data.x1, data.y1, data.color, false)
  })

  socket.on('board:clear', () => {
    ctx?.clearRect(0, 0, $canvas.width, $canvas.height)
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
