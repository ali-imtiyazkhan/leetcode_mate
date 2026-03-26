# CodeMate 🧑‍💻👥

> Stop solving DSA alone. See who else is on the same LeetCode question — and pair up instantly.

CodeMate is a browser extension + real-time backend that shows a live presence count on every LeetCode problem page and lets you match with a partner for a text chat session.

---

## Project structure

```
codemate/
├── server/          Node.js + Socket.io + Redis backend
├── extension/       Chrome extension (Manifest V3)
└── web/             Next.js dashboard & landing page
```

---

## Quick start

### 1. Start the backend (Redis + server)

```bash
cd server
cp .env.example .env
docker-compose up
```

This spins up:
- Redis on port `6379`
- CodeMate server on port `4000`

### 2. Start the web app

```bash
cd web
cp .env.local.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Load the extension in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `extension/` folder

### 4. Use it!

Navigate to any LeetCode problem (e.g. [Two Sum](https://leetcode.com/problems/two-sum/)) — the CodeMate widget appears in the bottom-right corner.

---

## How it works

| Layer | Technology | Role |
|-------|-----------|------|
| Extension | Chrome MV3 + vanilla JS | Detects problem slug, injects widget via Shadow DOM |
| Widget | Vanilla JS + Shadow DOM CSS | Live counter, match button, chat UI |
| Server | Node.js + Express + Socket.io | Presence rooms, matchmaking, chat relay, WebRTC signaling |
| Presence | Redis sorted sets | Per-question user counts with 5-minute TTL auto-expiry |
| Web | Next.js 14 (App Router) | Landing page + live dashboard |

### Socket.io events

| Event | Direction | Payload |
|-------|-----------|---------|
| `join:question` | client → server | `{ questionSlug, userId, displayName }` |
| `join:confirmed` | server → client | `{ questionSlug, count }` |
| `presence:update` | server → room | `{ questionSlug, count }` |
| `match:request` | client → server | `{ questionSlug }` |
| `match:found` | server → client | `{ partnerSocketId, partnerName }` |
| `match:incoming` | server → client | `{ fromSocketId, fromName }` |
| `match:accept` | client → server | `{ fromSocketId }` |
| `match:accepted` | server → both | `{ sessionRoom, partnerSocketId }` |
| `chat:message` | client → server | `{ sessionRoom, message }` |
| `chat:message` | server → session | `{ from, message, timestamp }` |
| `chat:typing` | client → server | `{ sessionRoom, isTyping }` |
| `webrtc:offer` | client → server | `{ to, offer }` |
| `webrtc:answer` | client → server | `{ to, answer }` |
| `webrtc:ice` | client → server | `{ to, candidate }` |
| `heartbeat` | client → server | (empty) |

---

## Roadmap

### Phase 1 (MVP) ✅
- [x] Live user count per question
- [x] Random partner matching
- [x] Text chat in extension widget
- [x] WebRTC signaling infrastructure
- [x] Next.js dashboard

### Phase 2
- [ ] Voice/video call via WebRTC
- [ ] Skill-based matching (Easy/Medium/Hard history)
- [ ] User accounts (NextAuth)
- [ ] Session timer + Pomodoro mode

### Phase 3
- [ ] AI hint assistant (contextual, no spoilers)
- [ ] Accountability streaks
- [ ] Public profiles & stats

---

## Tech stack

- **Node.js** — server runtime
- **Express** — HTTP layer + REST endpoints
- **Socket.io** — real-time bidirectional events
- **Redis** — presence tracking (sorted sets + TTL)
- **Docker Compose** — local Redis + server orchestration
- **Next.js 14** — web app (App Router)
- **Chrome Manifest V3** — extension platform

---

## License

MIT
