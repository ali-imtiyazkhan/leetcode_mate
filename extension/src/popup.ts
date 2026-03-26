const SERVER_URL = 'http://localhost:4000'

const $srvDot = document.getElementById('srv-dot') as HTMLSpanElement
const $srvStatus = document.getElementById('srv-status') as HTMLSpanElement
const $totalOnline = document.getElementById('total-online') as HTMLSpanElement
const $activeRooms = document.getElementById('active-rooms') as HTMLSpanElement

async function checkServer() {
  try {
    const res = await fetch(`${SERVER_URL}/health`)
    if (res.ok) {
      $srvDot.className = 'status-dot'
      $srvStatus.textContent = 'Online'
      $srvStatus.style.color = '#4ade80'
    } else {
      throw new Error()
    }
  } catch (e) {
    $srvDot.className = 'status-dot offline'
    $srvStatus.textContent = 'Server unreachable'
    $srvStatus.style.color = '#f87171'
  }
}

async function fetchStats() {
  try {
    const [statsRes, roomsRes] = await Promise.all([
      fetch(`${SERVER_URL}/stats`),
      fetch(`${SERVER_URL}/api/rooms`),
    ])
    const stats = await statsRes.json()
    const rooms = await roomsRes.json()

    $totalOnline.textContent = stats.totalOnline || '0'
    $activeRooms.textContent = String(rooms.rooms?.length || 0)
  } catch (e) {
    console.error('Failed to fetch stats', e)
    $totalOnline.textContent = 'Error'
    $activeRooms.textContent = 'Error'
  }
}

checkServer()
fetchStats()
setInterval(fetchStats, 10_000)
