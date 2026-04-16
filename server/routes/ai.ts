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

  const prompt = `You are an expert competitive programmer and a very friendly, patient educator.
Solve the following LeetCode problem. Your goal is to explain the solution in the absolute simplest way possible, as if explaining it to a beginner.

**Problem:** ${title}

**Description:**
${description}

**Requirements:**
1. **Intuition**: Explain the core idea in plain English. Use simple analogies. Do not use complex math formulas. 
2. **Approach**: Explain the algorithm step-by-step using plain, easy-to-understand language.
3. **Complexity Analysis**: State Time and Space complexity simply.
4. **Code**: Provide the standard LeetCode \`class Solution:\` format in ${lang}. Write extremely clean, readable code with simple variable names, and add clear comments for each step.

Format your response in Markdown. 
IMPORTANT: DO NOT use LaTeX math symbols like $ or $$. Just write normal text (e.g. "O(n)" instead of "$O(n)$").
Use \`\`\`${lang.toLowerCase()}\`\`\` for code blocks.`

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
