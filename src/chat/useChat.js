import { useState, useRef, useCallback } from 'react'
import { query } from './ragEngine'

const COOLDOWN_MS = 4000

export function useChat() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const lastSentRef = useRef(0)

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return

    // Rate limit cooldown
    const now = Date.now()
    const elapsed = now - lastSentRef.current
    if (elapsed < COOLDOWN_MS) {
      const wait = Math.ceil((COOLDOWN_MS - elapsed) / 1000)
      setError(`Please wait ${wait}s before sending another message.`)
      setTimeout(() => setError(null), COOLDOWN_MS - elapsed)
      return
    }

    lastSentRef.current = now
    setError(null)

    const userMsg = { role: 'user', content: text, id: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const result = await query(text, [...messages, userMsg])
      const assistantMsg = {
        role: 'assistant',
        content: result.text,
        sources: result.sources,
        id: Date.now() + 1
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [messages, loading])

  const clearChat = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return { messages, loading, error, sendMessage, clearChat }
}
