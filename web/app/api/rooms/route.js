const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4000'

export async function GET() {
  try {
    const res = await fetch(`${SERVER_URL}/api/rooms`, {
      next: { revalidate: 5 }, // ISR — cache 5 seconds
    })
    const data = await res.json()
    return Response.json(data)
  } catch (err) {
    return Response.json({ error: 'Server unreachable' }, { status: 503 })
  }
}
