import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'

function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [slug])

  async function fetchPost() {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()

      if (error || !data) {
        setNotFound(true)
      } else {
        setPost(data)
      }
    } catch {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-[#1a1a1a] rounded w-24 mb-8"></div>
          <div className="h-8 bg-[#1a1a1a] rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-[#1a1a1a] rounded w-1/4 mb-8"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-4 bg-[#1a1a1a] rounded w-3/4"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-8">
        <Link to="/#blog" className="text-[#808080] hover:text-[#E5E5E5] text-sm flex items-center gap-2 mb-8 transition-colors">
          <ArrowLeft size={14} />
          Back to Blog
        </Link>
        <h1 className="text-2xl font-semibold text-[#E5E5E5] mb-4">Post not found</h1>
        <p className="text-[#808080]">This post doesn't exist or hasn't been published yet.</p>
      </div>
    )
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <Link to="/#blog" className="text-[#808080] hover:text-[#E5E5E5] text-sm flex items-center gap-2 mb-8 transition-colors">
        <ArrowLeft size={14} />
        Back to Blog
      </Link>

      <article>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#E5E5E5] mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-[#808080] mb-8 pb-8 border-b border-[#1a1a1a]">
          <span>{new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          {post.read_time && (
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {post.read_time} min read
            </span>
          )}
        </div>

        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-xl font-semibold text-[#E5E5E5] mt-8 mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-semibold text-[#FF5733] mt-6 mb-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-semibold text-[#E5E5E5] mt-4 mb-2">{children}</h3>,
              p: ({ children }) => <p className="text-[#808080] leading-relaxed mb-4">{children}</p>,
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#FF5733] hover:underline">
                  {children}
                </a>
              ),
              code: ({ children, className }) => {
                const isInline = !className
                return isInline
                  ? <code className="bg-[#1a1a1a] px-1.5 py-0.5 rounded text-sm text-[#FF5733]">{children}</code>
                  : <code className="block bg-[#0a0a0a] border border-[#1a1a1a] p-4 rounded text-sm text-[#E5E5E5] overflow-x-auto my-4">{children}</code>
              },
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-[#FF5733]/50 pl-4 text-[#808080] italic my-4">{children}</blockquote>
              ),
              ul: ({ children }) => <ul className="list-disc list-inside text-[#808080] mb-4 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside text-[#808080] mb-4 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="text-[#808080]">{children}</li>,
              table: ({ children }) => <table className="w-full border-collapse my-4 text-sm">{children}</table>,
              thead: ({ children }) => <thead className="border-b border-[#1a1a1a]">{children}</thead>,
              th: ({ children }) => <th className="text-left py-2 px-3 text-[#E5E5E5] font-medium">{children}</th>,
              td: ({ children }) => <td className="py-2 px-3 text-[#808080]">{children}</td>,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  )
}

export default BlogPost
