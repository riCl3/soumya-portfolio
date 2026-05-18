import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

const MESSAGES = [
  "Hey! Want to ask me anything about Soumya?",
  "Curious about Soumya's work? Ask me!",
  "I'm Soumya's AI assistant — try me!",
  "Got questions? I know everything about Soumya."
]

export default function ChatPrompt({ onDismiss }) {
  const [visible, setVisible] = useState(false)
  const [typedText, setTypedText] = useState('')
  const [message] = useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)])
  const [cursorVisible, setCursorVisible] = useState(true)
  const [dismissed, setDismissed] = useState(false)
  const typingRef = useRef(null)
  const dismissTimerRef = useRef(null)

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(showTimer)
  }, [])

  useEffect(() => {
    if (!visible || dismissed) return

    let i = 0
    typingRef.current = setInterval(() => {
      if (i < message.length) {
        setTypedText(message.slice(0, i + 1))
        i++
      } else {
        clearInterval(typingRef.current)
        dismissTimerRef.current = setTimeout(() => handleDismiss(), 8000)
      }
    }, 50)

    const cursorInterval = setInterval(() => {
      setCursorVisible(v => !v)
    }, 530)

    return () => {
      clearInterval(typingRef.current)
      clearInterval(cursorInterval)
      clearTimeout(dismissTimerRef.current)
    }
  }, [visible, message, dismissed])

  function handleDismiss() {
    setDismissed(true)
    setVisible(false)
    clearInterval(typingRef.current)
    clearTimeout(dismissTimerRef.current)
    onDismiss?.()
  }

  if (dismissed || !visible || !typedText) return null

  return (
    <div
      className="fixed bottom-24 right-4 sm:right-6 z-50 animate-chat-prompt"
      onClick={handleDismiss}
    >
      <div className="relative bg-[#0a0a0a] border border-[#FF5733]/40 rounded-lg px-4 py-3 max-w-[260px] shadow-xl cursor-pointer group">
        <div className="absolute inset-0 rounded-lg bg-[#FF5733]/5 group-hover:bg-[#FF5733]/10 transition-colors" />

        <button
          onClick={(e) => { e.stopPropagation(); handleDismiss() }}
          className="absolute -top-2 -right-2 w-5 h-5 bg-[#1a1a1a] border border-[#333] rounded-full flex items-center justify-center text-[#808080] hover:text-[#E5E5E5] transition-colors"
        >
          <X size={10} />
        </button>

        <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#FF5733]/40" />

        <p className="text-sm text-[#E5E5E5] font-mono relative">
          <span className="text-[#FF5733]">$</span> {typedText}
          <span className={`inline-block w-[2px] h-[14px] bg-[#FF5733] ml-0.5 align-middle ${cursorVisible ? 'opacity-100' : 'opacity-0'}`} />
        </p>
      </div>
    </div>
  )
}
