import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CodeMate — Solve DSA together',
  description: 'Find people solving the same LeetCode question and collaborate in real time.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
