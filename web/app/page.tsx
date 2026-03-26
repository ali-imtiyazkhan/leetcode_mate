import Link from 'next/link'

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#0a0a12' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', maxWidth: 600, marginBottom: '3rem' }}>
        <div style={{ display: 'inline-block', background: '#1a1040', border: '1px solid #4c1d95', borderRadius: 20, padding: '4px 14px', fontSize: 12, color: '#a78bfa', marginBottom: 20, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Beta — free to use
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 16 }}>
          Stop solving DSA <span style={{ color: '#a78bfa' }}>alone</span>
        </h1>
        <p style={{ fontSize: 16, color: '#9ca3af', lineHeight: 1.7, marginBottom: 32 }}>
          CodeMate shows you how many people are solving the same LeetCode question right now — and lets you pair up for a live chat session in one click.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="#install"
            style={{ background: '#7c3aed', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: 'none', transition: 'background 0.2s' }}
          >
            Install Extension
          </a>
          <Link
            href="/dashboard"
            style={{ background: '#1a1a2a', color: '#a78bfa', padding: '12px 28px', borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: 'none', border: '1px solid #2d2d44' }}
          >
            View Dashboard
          </Link>
        </div>
      </div>

      {/* Feature cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, width: '100%', maxWidth: 700, marginBottom: '3rem' }}>
        {[
          { icon: '👥', title: 'Live presence', desc: 'See exactly how many coders are on the same problem right now.' },
          { icon: '⚡', title: 'Instant match', desc: 'One click to pair with a partner — no sign-up required to start.' },
          { icon: '💬', title: 'Real-time chat', desc: 'Text chat inside the extension, right on the LeetCode page.' },
          { icon: '📹', title: 'Voice (soon)', desc: 'WebRTC voice & video calls coming in Phase 2.' },
        ].map((f) => (
          <div key={f.title} style={{ background: '#13131f', border: '1px solid #1e1e30', borderRadius: 12, padding: '20px 18px' }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
            <div style={{ fontWeight: 700, color: '#e2e2f0', marginBottom: 6, fontSize: 14 }}>{f.title}</div>
            <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Install steps */}
      <div id="install" style={{ width: '100%', maxWidth: 700, background: '#13131f', border: '1px solid #1e1e30', borderRadius: 16, padding: '28px 32px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#e2e2f0', marginBottom: 20 }}>Get started in 3 steps</h2>
        {[
          { step: '1', text: 'Clone the repo and run docker-compose up inside /server' },
          { step: '2', text: 'Go to chrome://extensions → Enable developer mode → Load unpacked → select /extension' },
          { step: '3', text: 'Open any LeetCode problem and watch the widget appear in the bottom right' },
        ].map((s) => (
          <div key={s.step} style={{ display: 'flex', gap: 14, marginBottom: 14, alignItems: 'flex-start' }}>
            <div style={{ minWidth: 28, height: 28, borderRadius: '50%', background: '#2e1065', color: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{s.step}</div>
            <div style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.6, paddingTop: 4 }}>{s.text}</div>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 40, fontSize: 12, color: '#374151' }}>
        Built with Next.js · Node.js · Socket.io · Redis
      </p>
    </main>
  )
}
