import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ReactMarkdown from 'react-markdown'
import { Save, ArrowLeft, Eye, Edit3, Trash2, Plus } from 'lucide-react'

const emptyBlog = {
  title: '', slug: '', excerpt: '', content: '', tags: [],
  featured: false, published: false, published_at: new Date().toISOString().split('T')[0], read_time: 5
}

function BlogList() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs()
  }, [])

  async function fetchBlogs() {
    const { data } = await supabase.from('blogs').select('id, title, slug, published, featured, published_at').order('created_at', { ascending: false })
    setBlogs(data || [])
    setLoading(false)
  }

  async function togglePublished(blog) {
    await supabase.from('blogs').update({ published: !blog.published }).eq('id', blog.id)
    fetchBlogs()
  }

  async function toggleFeatured(blog) {
    await supabase.from('blogs').update({ featured: !blog.featured }).eq('id', blog.id)
    fetchBlogs()
  }

  async function deleteBlog(id) {
    if (!confirm('Delete this blog post?')) return
    await supabase.from('blogs').delete().eq('id', id)
    fetchBlogs()
  }

  if (loading) return <div className="text-[#808080]">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#E5E5E5]">Blogs</h1>
        <Link to="/admin/blogs/new" className="flex items-center gap-1 px-3 py-2 bg-[#FF5733] text-black font-medium rounded hover:bg-[#FF5733]/90 transition-colors">
          <Plus size={14} /> New Post
        </Link>
      </div>

      {blogs.length === 0 ? (
        <p className="text-[#808080]">No blog posts yet. Create your first one!</p>
      ) : (
        <div className="space-y-2">
          {blogs.map(blog => (
            <div key={blog.id} className="flex items-center gap-4 p-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
              <div className="flex-1 min-w-0">
                <Link to={`/admin/blogs/${blog.id}`} className="font-medium text-[#E5E5E5] hover:text-[#FF5733] transition-colors truncate block">
                  {blog.title}
                </Link>
                <span className="text-xs text-[#808080]">{blog.published_at}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFeatured(blog)}
                  className={`px-2 py-0.5 rounded text-xs ${blog.featured ? 'bg-[#FF5733]/20 text-[#FF5733]' : 'bg-[#1a1a1a] text-[#808080]'} transition-colors`}
                >
                  {blog.featured ? 'Featured' : 'Feature'}
                </button>
                <button
                  onClick={() => togglePublished(blog)}
                  className={`px-2 py-0.5 rounded text-xs ${blog.published ? 'bg-green-500/20 text-green-400' : 'bg-[#1a1a1a] text-[#808080]'} transition-colors`}
                >
                  {blog.published ? 'Published' : 'Draft'}
                </button>
                <Link to={`/admin/blogs/${blog.id}`} className="p-1 text-[#808080] hover:text-[#E5E5E5] transition-colors">
                  <Edit3 size={14} />
                </Link>
                <button onClick={() => deleteBlog(blog.id)} className="p-1 text-[#808080] hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function BlogEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const [blog, setBlog] = useState(emptyBlog)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    if (!isNew) fetchBlog()
  }, [id])

  async function fetchBlog() {
    const { data } = await supabase.from('blogs').select('*').eq('id', id).single()
    if (data) setBlog(data)
    setLoading(false)
  }

  function generateSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  function handleTitleChange(title) {
    setBlog({
      ...blog,
      title,
      slug: isNew ? generateSlug(title) : blog.slug
    })
  }

  async function handleSave() {
    setSaving(true)
    const payload = {
      ...blog,
      updated_at: new Date().toISOString()
    }

    if (isNew) {
      const { data, error } = await supabase.from('blogs').insert(payload).select().single()
      if (data) {
        navigate(`/admin/blogs/${data.id}`, { replace: true })
      }
    } else {
      await supabase.from('blogs').update(payload).eq('id', id)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="text-[#808080]">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/admin/blogs" className="text-[#808080] hover:text-[#E5E5E5] transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-semibold text-[#E5E5E5]">
            {isNew ? 'New Blog Post' : 'Edit Post'}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPreview(!preview)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm transition-colors ${
              preview ? 'bg-[#FF5733]/20 text-[#FF5733]' : 'bg-[#1a1a1a] text-[#808080] hover:text-[#E5E5E5]'
            }`}
          >
            {preview ? <Edit3 size={14} /> : <Eye size={14} />}
            {preview ? 'Edit' : 'Preview'}
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#FF5733] text-black font-medium rounded hover:bg-[#FF5733]/90 transition-colors disabled:opacity-50">
            <Save size={14} />
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-[#808080] mb-1">Title</label>
            <input value={blog.title} onChange={e => handleTitleChange(e.target.value)} className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-[#808080] mb-1">Slug</label>
            <input value={blog.slug} onChange={e => setBlog({ ...blog, slug: e.target.value })} className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#808080] mb-1">Excerpt</label>
          <input value={blog.excerpt || ''} onChange={e => setBlog({ ...blog, excerpt: e.target.value })} className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-[#808080] mb-1">Published Date</label>
            <input type="date" value={blog.published_at} onChange={e => setBlog({ ...blog, published_at: e.target.value })} className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-[#808080] mb-1">Read Time (min)</label>
            <input type="number" value={blog.read_time} onChange={e => setBlog({ ...blog, read_time: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-[#808080] mb-1">Tags (comma-separated)</label>
            <input
              value={(blog.tags || []).join(', ')}
              onChange={e => setBlog({ ...blog, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={blog.published} onChange={e => setBlog({ ...blog, published: e.target.checked })} className="accent-[#FF5733]" />
            <span className="text-sm text-[#808080]">Published</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={blog.featured} onChange={e => setBlog({ ...blog, featured: e.target.checked })} className="accent-[#FF5733]" />
            <span className="text-sm text-[#808080]">Featured</span>
          </label>
        </div>

        <div>
          <label className="block text-xs text-[#808080] mb-1">Content (Markdown)</label>
          {preview ? (
            <div className="min-h-[400px] p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-xl font-semibold text-[#E5E5E5] mt-8 mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-semibold text-[#FF5733] mt-6 mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-semibold text-[#E5E5E5] mt-4 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="text-[#808080] leading-relaxed mb-4">{children}</p>,
                  code: ({ children, className }) => {
                    const isInline = !className
                    return isInline
                      ? <code className="bg-[#1a1a1a] px-1.5 py-0.5 rounded text-sm text-[#FF5733]">{children}</code>
                      : <code className="block bg-[#000] border border-[#1a1a1a] p-4 rounded text-sm text-[#E5E5E5] overflow-x-auto my-4">{children}</code>
                  },
                  ul: ({ children }) => <ul className="list-disc list-inside text-[#808080] mb-4 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside text-[#808080] mb-4 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-[#808080]">{children}</li>,
                  table: ({ children }) => <table className="w-full border-collapse my-4 text-sm">{children}</table>,
                  th: ({ children }) => <th className="text-left py-2 px-3 text-[#E5E5E5] font-medium border-b border-[#1a1a1a]">{children}</th>,
                  td: ({ children }) => <td className="py-2 px-3 text-[#808080]">{children}</td>,
                }}
              >
                {blog.content || '*No content yet*'}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={blog.content || ''}
              onChange={e => setBlog({ ...blog, content: e.target.value })}
              rows={20}
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm font-mono focus:border-[#FF5733]/50 focus:outline-none resize-y"
              placeholder="Write your blog post in Markdown..."
            />
          )}
        </div>
      </div>
    </div>
  )
}

export { BlogList, BlogEdit }
