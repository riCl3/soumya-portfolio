import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'

function BlogList() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBlogs()
  }, [])

  async function fetchBlogs() {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, slug, excerpt, featured, published_at, read_time')
        .eq('published', true)
        .order('published_at', { ascending: false })

      if (error) throw error
      setBlogs(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const featured = blogs.filter(b => b.featured)
  const regular = blogs.filter(b => !b.featured)

  if (loading) {
    return (
      <section id="blog" className="py-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="text-[#FF5733]">##</span>
          Blog
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg animate-pulse">
              <div className="h-5 bg-[#1a1a1a] rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-[#1a1a1a] rounded w-full mb-2"></div>
              <div className="h-3 bg-[#1a1a1a] rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="blog" className="py-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="text-[#FF5733]">##</span>
          Blog
        </h2>
        <p className="text-red-400 text-sm">Failed to load posts: {error}</p>
      </section>
    )
  }

  if (blogs.length === 0) {
    return (
      <section id="blog" className="py-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="text-[#FF5733]">##</span>
          Blog
        </h2>
        <p className="text-[#808080] text-sm">No posts yet. Check back soon.</p>
      </section>
    )
  }

  return (
    <section id="blog" className="py-12">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <span className="text-[#FF5733]">##</span>
        Blog
      </h2>

      {featured.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-[#808080] mb-4 flex items-center gap-2">
            <Star size={14} className="text-[#FF5733]" fill="currentColor" />
            Featured
          </h3>
          <div className="space-y-4">
            {featured.map(post => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="block p-5 bg-[#0a0a0a] border border-[#FF5733]/30 rounded-lg hover:border-[#FF5733]/60 transition-all duration-300 group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-[#FF5733] bg-[#FF5733]/10 px-2 py-0.5 rounded flex items-center gap-1">
                    <Star size={10} fill="currentColor" />
                    Featured
                  </span>
                </div>
                <h3 className="font-medium text-lg mb-2 group-hover:text-[#FF5733] transition-colors">{post.title}</h3>
                <p className="text-[#808080] text-sm mb-3">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-[#808080]">
                  <span>{new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  {post.read_time && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.read_time} min read
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {regular.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#808080] mb-4">All Posts</h3>
          <div className="space-y-4">
            {regular.map(post => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="block p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg hover:border-[#FF5733]/50 transition-all duration-300 group">
                <h3 className="font-medium mb-2 group-hover:text-[#FF5733] transition-colors">{post.title}</h3>
                <p className="text-[#808080] text-sm mb-2">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-[#808080]">
                  <span>{new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  {post.read_time && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.read_time} min read
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default BlogList
