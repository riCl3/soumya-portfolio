import Markdown from 'react-markdown'

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
          isUser
            ? 'bg-[#1a1a1a] text-[#E5E5E5]'
            : 'bg-[#0a0a0a] border border-[#1a1a1a] text-[#E5E5E5]'
        }`}
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <div className="prose-chat">
            <Markdown>{message.content}</Markdown>
          </div>
        )}

        {!isUser && message.sources?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-[#1a1a1a]">
            {message.sources.map((s, i) => (
              <span
                key={i}
                className="text-[10px] px-1.5 py-0.5 bg-[#1a1a1a] text-[#808080] rounded"
              >
                {s.title}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
