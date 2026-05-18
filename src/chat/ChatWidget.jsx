import { useState, useEffect, useCallback } from 'react'
import { MessageSquare, X } from 'lucide-react'
import ChatWindow from './ChatWindow'
import ChatPrompt from './ChatPrompt'
import { useChat } from './useChat'
import { loadEmbedder, setProgressCallback } from './ragEngine'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [modelProgress, setModelProgress] = useState(null)
  const [showPrompt, setShowPrompt] = useState(true)
  const { messages, loading, error, sendMessage, clearChat } = useChat()

  const handleOpen = useCallback(async () => {
    setIsOpen(true)
    if (!modelLoaded) {
      setProgressCallback((progress) => {
        if (progress.status === 'progress' || progress.status === 'download') {
          setModelProgress({
            progress: progress.progress,
            file: progress.file
          })
        } else if (progress.status === 'done') {
          setModelProgress(null)
        }
      })
      try {
        await loadEmbedder()
        setModelLoaded(true)
        setModelProgress(null)
      } catch (err) {
        console.error('Failed to load embedding model:', err)
        setModelProgress(null)
      }
    }
  }, [modelLoaded])

  // Hide prompt when chat opens
  useEffect(() => {
    if (isOpen) setShowPrompt(false)
  }, [isOpen])

  return (
    <>
      {!isOpen && showPrompt && (
        <ChatPrompt onDismiss={() => setShowPrompt(false)} />
      )}

      {isOpen && (
        <ChatWindow
          messages={messages}
          loading={loading}
          error={error}
          onSend={sendMessage}
          onClose={() => setIsOpen(false)}
          onClear={clearChat}
          modelProgress={modelProgress}
        />
      )}

      <button
        onClick={isOpen ? () => setIsOpen(false) : handleOpen}
        className={`fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen
            ? 'bg-[#1a1a1a] border border-[#333] hover:bg-[#222]'
            : 'bg-[#FF5733] hover:bg-[#FF5733]/90 animate-pulse-slow'
        }`}
        title={isOpen ? 'Close chat' : 'Ask about Soumya'}
      >
        {isOpen ? (
          <X size={20} className="text-[#E5E5E5]" />
        ) : (
          <MessageSquare size={20} className="text-black" />
        )}
      </button>
    </>
  )
}
