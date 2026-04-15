export const dynamic = 'force-dynamic'

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4000'

export async function GET() {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)

  try {
    const res = await fetch(`${SERVER_URL}/api/rooms`, {
      next: { revalidate: 0 },
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!res.ok) throw new Error(`Backend returned ${res.status}`)
    
    const data = await res.json()
    return Response.json(data)
  } catch (err) {
    clearTimeout(timeoutId)
    console.error('Rooms API error:', err)
    return Response.json({ error: 'Server unreachable', rooms: [] }, { status: 503 })
  }
}
