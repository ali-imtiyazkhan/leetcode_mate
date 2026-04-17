'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [count, setCount] = useState(47)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1
        return Math.max(30, Math.min(70, prev + delta))
      })
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #000000;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
        }

        .cm-root {
          min-height: 100vh;
          background: #000000;
          position: relative;
          overflow: hidden;
        }

        .cm-glow {
          position: absolute;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 700px;
          height: 460px;
          background: radial-gradient(ellipse 60% 55% at 50% 30%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 45%, transparent 75%);
          pointer-events: none;
          z-index: 0;
        }

        .cm-glow2 {
          position: absolute;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          width: 380px;
          height: 220px;
          background: radial-gradient(ellipse 55% 50% at 50% 20%, rgba(255,255,255,0.05) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .cm-inner {
          position: relative;
          z-index: 1;
          max-width: 740px;
          margin: 0 auto;
          padding: 0 24px 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cm-nav {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 0 0;
          margin-bottom: 64px;
        }

        .cm-logo {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }

        .cm-logo-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #a3a3a3;
          box-shadow: 0 0 10px #a3a3a388;
          animation: pulse-dot 2.4s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }

        .cm-nav-links {
          display: flex;
          gap: 6px;
        }

        .cm-nav-link {
          font-size: 13px;
          color: #6b7280;
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 8px;
          transition: color 0.2s;
        }

        .cm-nav-link:hover { color: #d4d4d4; }

        .cm-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 100px;
          padding: 5px 14px 5px 10px;
          font-size: 11.5px;
          color: #d4d4d4;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 26px;
        }

        .cm-badge-pip {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #a3a3a3;
          animation: pulse-dot 1.8s ease-in-out infinite;
        }

        .cm-h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.4rem, 6vw, 3.6rem);
          font-weight: 800;
          line-height: 1.09;
          text-align: center;
          color: #fff;
          margin: 0 0 20px;
          letter-spacing: -0.025em;
        }

        .cm-accent {
          color: transparent;
          background: linear-gradient(135deg, #d4d4d4 20%, #a3a3a3 60%, #ffffff 100%);
          -webkit-background-clip: text;
          background-clip: text;
        }

        .cm-sub {
          font-size: 15.5px;
          color: #6b7280;
          text-align: center;
          line-height: 1.75;
          max-width: 470px;
          margin: 0 0 36px;
        }

        .cm-cta-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 72px;
        }

        .cm-btn-primary {
          background: #ffffff;
          color: #000;
          border: none;
          padding: 13px 30px;
          border-radius: 10px;
          font-size: 14.5px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: transform 0.15s, background 0.2s;
          box-shadow: 0 0 28px rgba(255,255,255,0.4);
          text-decoration: none;
          display: inline-block;
        }

        .cm-btn-primary:hover { background: #e5e5e5; transform: translateY(-1px); }

        .cm-btn-secondary {
          background: rgba(255,255,255,0.04);
          color: #d4d4d4;
          border: 1px solid rgba(255,255,255,0.2);
          padding: 13px 30px;
          border-radius: 10px;
          font-size: 14.5px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          text-decoration: none;
          display: inline-block;
        }

        .cm-btn-secondary:hover { background: rgba(255,255,255,0.1); transform: translateY(-1px); }

        .cm-preview {
          width: 100%;
          max-width: 520px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 20px 22px;
          margin-bottom: 72px;
          position: relative;
          overflow: hidden;
        }

        .cm-preview::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
        }

        .cm-preview-bar {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 16px;
        }

        .cm-dot { width: 9px; height: 9px; border-radius: 50%; }
        .cm-dot.r { background: #ff5f57; }
        .cm-dot.y { background: #ffbd2e; }
        .cm-dot.g { background: #28c840; }

        .cm-preview-title {
          font-size: 11px;
          color: #4b5563;
          margin-left: auto;
          font-family: monospace;
          letter-spacing: 0.02em;
        }

        .cm-widget {
          background: rgba(20,12,40,0.8);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cm-widget-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cm-widget-label {
          font-size: 11px;
          color: #ffffff;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .cm-live-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.25);
          border-radius: 100px;
          padding: 2px 8px;
          font-size: 10px;
          color: #34d399;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .cm-live-pip {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #34d399;
          animation: pulse-dot 1.4s ease-in-out infinite;
        }

        .cm-widget-count {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .cm-count-num {
          font-family: 'Syne', sans-serif;
          font-size: 2.4rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
          transition: all 0.3s ease;
        }

        .cm-count-label {
          font-size: 12px;
          color: #6b7280;
        }

        .cm-avatars {
          display: flex;
        }

        .cm-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 2px solid #14082a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 700;
          margin-right: -8px;
          color: #fff;
        }

        .cm-widget-btn {
          width: 100%;
          background: #fff; color: #000;
          border: none;
          border-radius: 9px;
          padding: 10px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          transition: opacity 0.2s;
        }

        .cm-widget-btn:hover { opacity: 0.88; }

        .cm-features {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          width: 100%;
          margin-bottom: 52px;
        }

        @media (max-width: 480px) {
          .cm-features { grid-template-columns: 1fr; }
        }

        .cm-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 20px 18px;
          transition: border-color 0.2s, background 0.2s;
          position: relative;
          overflow: hidden;
        }

        .cm-card:hover {
          border-color: rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.06);
        }

        .cm-card-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          font-size: 15px;
        }

        .cm-card-title {
          font-family: 'Syne', sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          color: #e5e7eb;
          margin-bottom: 6px;
        }

        .cm-card-desc {
          font-size: 12px;
          color: #4b5563;
          line-height: 1.65;
        }

        .cm-soon {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          padding: 2px 7px;
          font-size: 9px;
          color: #4b5563;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .cm-steps-wrap {
          width: 100%;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 18px;
          padding: 28px 30px;
          position: relative;
          overflow: hidden;
          margin-bottom: 52px;
        }

        .cm-steps-wrap::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        }

        .cm-steps-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #e2e2f0;
          margin-bottom: 22px;
        }

        .cm-step {
          display: flex;
          gap: 15px;
          align-items: flex-start;
          margin-bottom: 18px;
        }

        .cm-step:last-child { margin-bottom: 0; }

        .cm-step-num {
          min-width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.35);
          color: #a3a3a3;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
        }

        .cm-step-text {
          font-size: 13px;
          color: #9ca3af;
          line-height: 1.65;
          padding-top: 4px;
        }

        .cm-step-text code {
          font-family: monospace;
          background: rgba(255,255,255,0.1);
          color: #d4d4d4;
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 11.5px;
        }

        .cm-stack {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 10px;
          align-items: center;
        }

        .cm-pill {
          font-size: 11px;
          color: #374151;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 100px;
          padding: 4px 12px;
          font-weight: 500;
          letter-spacing: 0.03em;
        }

        .cm-divider {
          width: 1px;
          height: 14px;
          background: rgba(255,255,255,0.07);
        }
      `}</style>

      <div className="cm-root">
        <div className="cm-glow" />
        <div className="cm-glow2" />
        <div className="cm-inner">

          {/* Nav */}
          <nav className="cm-nav">
            <Link href="/" className="cm-logo">
              <div className="cm-logo-dot" />
              CodeMate
            </Link>
            <div className="cm-nav-links">
              <a className="cm-nav-link" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
              <a className="cm-nav-link" href="#">Docs</a>
              <Link href="/dashboard" className="cm-nav-link">Dashboard</Link>
            </div>
          </nav>

          {/* Badge */}
          <div className="cm-badge">
            <div className="cm-badge-pip" />
            Beta · Free to use
          </div>

          {/* Hero */}
          <h1 className="cm-h1">
            Stop solving DSA<br />
            <span className="cm-accent">alone.</span>
          </h1>

          <p className="cm-sub">
            CodeMate shows you exactly how many people are solving the same LeetCode problem right now — and lets you pair up in one click.
          </p>

          <div className="cm-cta-row">
            <a href="/codemate-extension.zip" download="codemate-extension.zip" className="cm-btn-primary">Download Extension</a>
            <Link href="/dashboard" className="cm-btn-secondary">View Dashboard</Link>
          </div>

          {/* Widget Preview */}
          <div className="cm-preview">
            <div className="cm-preview-bar">
              <div className="cm-dot r" />
              <div className="cm-dot y" />
              <div className="cm-dot g" />
              <span className="cm-preview-title">Two Sum — LeetCode #1</span>
            </div>
            <div className="cm-widget">
              <div className="cm-widget-header">
                <div className="cm-widget-label">CodeMate</div>
                <div className="cm-live-pill">
                  <div className="cm-live-pip" />
                  Live
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="cm-widget-count">
                  <span className="cm-count-num">{count}</span>
                  <span className="cm-count-label">solving now</span>
                </div>
                <div className="cm-avatars">
                  <div className="cm-avatar" style={{ background: '#ffffff' }}>AK</div>
                  <div className="cm-avatar" style={{ background: '#333' }}>MR</div>
                  <div className="cm-avatar" style={{ background: '#444' }}>JL</div>
                  <div className="cm-avatar" style={{ background: '#555' }}>+{count - 3}</div>
                </div>
              </div>
              <button className="cm-widget-btn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Pair with someone
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="cm-features">
            {[
              { icon: '👥', title: 'Live presence', desc: 'See exactly how many coders are on the same problem right now, in real time.' },
              { icon: '⚡', title: 'Instant match', desc: 'One click to pair with a partner. No sign-up required to get started.' },
              { icon: '💬', title: 'Real-time chat', desc: 'Text chat lives inside the extension, right on the LeetCode page.' },
              { icon: '📹', title: 'Voice & video', desc: 'WebRTC voice and video calls coming in Phase 2.', soon: true },
            ].map((f) => (
              <div key={f.title} className="cm-card">
                <div className="cm-card-icon">{f.icon}</div>
                <div className="cm-card-title">{f.title}</div>
                <div className="cm-card-desc">{f.desc}</div>
                {f.soon && <div className="cm-soon">Soon</div>}
              </div>
            ))}
          </div>

          {/* Install Steps */}
          <div className="cm-steps-wrap" id="install">
            <div className="cm-steps-title">Get started in 3 steps</div>
            {[
              { n: '1', text: <span>Clone the repo and run <code>docker-compose up</code> inside <code>/server</code></span> },
              { n: '2', text: <span>Go to <code>chrome://extensions</code> → Enable developer mode → Load unpacked → select <code>/extension</code></span> },
              { n: '3', text: 'Open any LeetCode problem and watch the widget appear in the bottom right corner.' },
            ].map((s) => (
              <div key={s.n} className="cm-step">
                <div className="cm-step-num">{s.n}</div>
                <div className="cm-step-text">{s.text}</div>
              </div>
            ))}
          </div>

          {/* Stack */}
          <div className="cm-stack">
            {['Next.js', 'Node.js', 'Socket.io', 'Redis', 'WebRTC'].map((tech, i, arr) => (
              <>
                <span key={tech} className="cm-pill">{tech}</span>
                {i < arr.length - 1 && <div key={`d-${i}`} className="cm-divider" />}
              </>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}