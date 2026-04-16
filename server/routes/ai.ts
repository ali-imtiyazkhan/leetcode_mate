import { Router, Request, Response } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = Router()

const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60_000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) || []
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW_MS)
  rateLimitMap.set(ip, recent)
  if (recent.length >= RATE_LIMIT) return true
  recent.push(now)
  return false
}

setInterval(() => {
  const now = Date.now()
  for (const [ip, timestamps] of rateLimitMap) {
    const recent = timestamps.filter((t) => now - t < RATE_WINDOW_MS)
    if (recent.length === 0) rateLimitMap.delete(ip)
    else rateLimitMap.set(ip, recent)
  }
}, 5 * 60_000)

router.post('/solve', async (req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'AI service not configured. Set GEMINI_API_KEY on the server.' })
  }

  const ip = req.ip || req.socket.remoteAddress || 'unknown'
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute before trying again.' })
  }

  const { slug, title, description, language } = req.body

  if (!title || !description) {
    return res.status(400).json({ error: 'Missing title or description.' })
  }

  const lang = language || 'Python'

  const prompt = `You are an expert competitive programmer and educator.
Solve the following LeetCode problem. Provide a clear, well-structured solution.

**Problem:** ${title}

**Description:**
${description}

**Requirements:**
1. Start with a brief **Intuition** section (2-3 sentences on the core idea)
2. Then a detailed **Approach** section explaining the algorithm step-by-step
3. Then **Complexity Analysis** with Time and Space complexity
4. Finally, provide clean, well-commented **Code** in ${lang}

Format your response in Markdown. Use \`\`\`${lang.toLowerCase()}\`\`\` for code blocks.
Keep explanations concise but thorough. Focus on the optimal solution.`

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    res.json({ solution: text, model: 'gemini-2.0-flash' })
  } catch (err: any) {
    console.error('❌ AI generation error:', err.message)
    res.status(500).json({ error: 'Failed to generate solution. Please try again.' })
  }
})

export default router
