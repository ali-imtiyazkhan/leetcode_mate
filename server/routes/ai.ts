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

  const prompt = `You are a modern, high-energy competitive programming mentor.
Solve the following LeetCode problem. Explain it cleanly using emojis, bullet points, and highly readable formatting—exactly like ChatGPT does.

**Problem:** ${title}

**Description:**
${description}

**Requirements for your response:**
1. **🧠 Key Idea:** Summarize the absolute core of the problem in 2-3 short bullet points.
2. **⚡ Optimization Insight:** Explain *why* the slow approach fails and *what* optimization (e.g. Map, Binary Search) fixes it. Write this visually.
3. **💡 Approach:** Give the direct, step-by-step algorithm. Short, snappy sentences.
4. **Code:** Provide the standard LeetCode \`class Solution\` format in ${lang}. Format with \`\`\`${lang.toLowerCase()}\`\`\`.

**Formatting Rules:**
- DO NOT write giant walls of text. Use extremely aggressive formatting: short lines, bullet points, code snippets inline, and emojis.
- DO NOT use LaTeX math symbols like $ or $$. Just write normal text (e.g. "O(N)" instead of "$O(N)$").
- Keep explanations punchy and impactful.`

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

  const prompt = `You are a modern, high-energy competitive programming mentor.
A student is trying to solve the following LeetCode problem, but their code might have bugs or inefficiencies. Explain their mistakes cleanly using emojis, bullet points, and highly readable formatting—exactly like ChatGPT does.

**Problem:** ${title}

**Description:**
${description}

**The Student's Current Code:**
\`\`\`
${code}
\`\`\`

**Requirements for your response:**
1. **📉 Brief Assessment:** Tell them if it's completely wrong, almost there, or correct but slow. Be highly encouraging!
2. **🐞 Bugs & Edge Cases:** Point out the specific logical flaw or line without rewriting the whole code.
3. **⚡ Optimization Hints:** Tell them *why* their approach is failing and *what* optimization (e.g. Map, Two Pointers) to use.
4. DO NOT provide the fully corrected code. Your goal is to guide them to find the answer themselves.

**Formatting Rules:**
- DO NOT write giant walls of text. Use extremely aggressive formatting: short lines, bullet points, code snippets inline, and emojis.
- DO NOT use LaTeX math symbols like $ or $$. Just write normal text.
- Keep explanations punchy and impactful.`

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
