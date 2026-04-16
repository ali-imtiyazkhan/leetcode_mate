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
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    res.json({ solution: text, model: 'gemini-flash-latest' })
  } catch (err: any) {
    console.error('❌ AI generation error:', err.message)
    res.status(500).json({ error: 'Failed to generate solution. Please try again.' })
  }
})

router.post('/analyze', async (req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'AI service not configured. Set GEMINI_API_KEY on the server.' })
  }

  const ip = req.ip || req.socket.remoteAddress || 'unknown'
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute before trying again.' })
  }

  const { title, description, code } = req.body

  if (!title || !code) {
    return res.status(400).json({ error: 'Missing title or code.' })
  }

  const prompt = `You are an expert competitive programmer and a supportive mentor.
A student is trying to solve the following LeetCode problem, but their code might have bugs or inefficiencies.

**Problem:** ${title}

**Description:**
${description}

**The Student's Current Code:**
\`\`\`
${code}
\`\`\`

**Your Task:**
1. Start with a **Brief Assessment** (is it completely wrong, close, just a simple bug, or correct but slow?).
2. Point out **Bugs & Edge Cases** (do not just rewrite the code for them, point out the line or the logical flaw).
3. Provide **Hints for Optimization** if their approach is too slow (e.g., O(N^2) instead of O(N)).
4. DO NOT provide the fully corrected code. Your goal is to guide them to find the answer themselves like a real tutor.

Format your response in Markdown. Keep it encouraging and concise.`

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    res.json({ analysis: text, model: 'gemini-flash-latest' })
  } catch (err: any) {
    console.error('❌ AI analysis error:', err.message)
    res.status(500).json({ error: 'Failed to analyze code. Please try again.' })
  }
})

export default router
