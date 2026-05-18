import { useState, useRef, useEffect } from 'react'
import { X, Send, Trash2, Loader2 } from 'lucide-react'
import ChatMessage from './ChatMessage'

export default function ChatWindow({ messages, loading, error, onSend, onClose, onClear, modelProgress }) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (!loading) inputRef.current?.focus()
  }, [loading])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !loading) {
      onSend(input.trim())
      setInput('')
    }
  }

  return (
    <div className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] h-[500px] max-h-[70vh] bg-[#000000] border border-[#1a1a1a] rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <span className="text-[#FF5733] text-sm font-semibold">$</span>
          <span className="text-[#E5E5E5] text-sm font-medium">Ask about Soumya</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-[#FF5733]/10 text-[#FF5733] rounded font-mono">ONNX</span>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={onClear}
              className="p-1.5 text-[#808080] hover:text-[#E5E5E5] transition-colors"
              title="Clear chat"
            >
              <Trash2 size={14} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-[#808080] hover:text-[#E5E5E5] transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin">
        {messages.length === 0 && !modelProgress && (
          <div className="text-center text-[#808080] text-xs mt-8 space-y-2">
            <p className="text-[#FF5733] font-mono">$ ./ask_soumya.sh</p>
            <p>Ask me about Soumya's experience, projects, skills, or blog posts.</p>
            <p className="text-[10px] text-[#555]">Powered by ONNX embeddings + Gemini</p>
          </div>
        )}

        {modelProgress && (
          <div className="text-center text-[#808080] text-xs mt-8 space-y-3">
            <Loader2 size={20} className="animate-spin mx-auto text-[#FF5733]" />
            <p>Loading ONNX embedding model...</p>
            {modelProgress.progress != null && (
              <div className="w-48 mx-auto">
                <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF5733] transition-all duration-300"
                    style={{ width: `${Math.round(modelProgress.progress)}%` }}
                  />
                </div>
                <p className="text-[10px] mt-1 text-[#555]">
                  {modelProgress.file || 'Downloading...'} ({Math.round(modelProgress.progress)}%)
                </p>
              </div>
            )}
          </div>
        )}

        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {loading && !modelProgress && (
          <div className="flex justify-start mb-3">
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-3 py-2 text-sm text-[#808080] flex items-center gap-2">
              <Loader2 size={12} className="animate-spin" />
              <span>Thinking...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center text-xs text-red-400 bg-red-400/5 border border-red-400/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-[#1a1a1a]">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={modelProgress ? 'Loading model...' : 'Ask a question...'}
            disabled={loading || !!modelProgress}
            className="flex-1 px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none transition-colors disabled:opacity-50 placeholder-[#555]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || !!modelProgress}
            className="p-2 bg-[#FF5733] text-black rounded hover:bg-[#FF5733]/90 transition-colors disabled:opacity-30"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  )
}
