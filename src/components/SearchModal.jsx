import { Search, X } from 'lucide-react'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import { supabase } from '../lib/supabase'

function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [blogPosts, setBlogPosts] = useState([])
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { content } = useContent()

  const staticTargets = useMemo(() => {
    if (!content) return []

    const targets = [
      { label: 'Home', section: '#home', route: '/', type: 'section' },
      { label: 'Experience', section: '#work', route: '/', type: 'section' },
      { label: 'Education', section: '#education', route: '/', type: 'section' },
      { label: 'Projects', section: '#projects', route: '/', type: 'section' },
      { label: 'Skills', section: '#skills', route: '/', type: 'section' },
      { label: 'Blog', section: '#blog', route: '/', type: 'section' },
    ]

    content.experience?.forEach(exp => {
      targets.push({ label: exp.company, section: '#work', route: '/', type: 'experience' })
    })

    if (content.education) {
      targets.push({ label: content.education.institution, section: '#education', route: '/', type: 'education' })
    }

    content.projects?.forEach(proj => {
      targets.push({ label: proj.title, section: '#projects', route: '/', type: 'project' })
    })

    Object.values(content.skills || {}).flat().forEach(skill => {
      targets.push({ label: skill, section: '#skills', route: '/', type: 'skill' })
    })

    return targets
  }, [content])

  const allTargets = useMemo(() => {
    const blogEntries = blogPosts.map(post => ({
      label: post.title,
      section: '#blog',
      route: `/blog/${post.slug}`,
      type: 'blog',
    }))
    return [...staticTargets, ...blogEntries]
  }, [staticTargets, blogPosts])

  const results = useMemo(() => query.length > 0
    ? allTargets.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase())
      )
    : [], [query, allTargets])

  useEffect(() => {
    if (isOpen && blogPosts.length === 0) {
      supabase
        .from('blogs')
        .select('title, slug')
        .eq('published', true)
        .then(({ data }) => { if (data) setBlogPosts(data) })
    }
  }, [isOpen, blogPosts.length])

  const handleNavigate = useCallback((item) => {
    if (item.route && item.route !== '/') {
      navigate(item.route)
    } else if (item.section) {
      window.location.hash = item.section
    }
  }, [navigate])

  const handleClose = useCallback(() => {
    setQuery('')
    setSelectedIndex(0)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      inputRef.current?.focus()
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      handleClose()
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleNavigate(results[selectedIndex])
      handleClose()
    }
  }, [results, selectedIndex, handleClose, handleNavigate])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-[#000000]/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh] px-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        className="w-full max-w-[500px] bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1a1a1a]">
          <Search size={18} className="text-[#808080] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search sections, projects, skills, blogs..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0) }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-[#E5E5E5] placeholder-[#808080] text-sm"
          />
          <button onClick={handleClose} className="text-[#808080] hover:text-[#E5E5E5] transition-colors" aria-label="Close search">
            <X size={16} />
          </button>
        </div>

        {results.length > 0 ? (
          <div className="max-h-[300px] overflow-y-auto">
            {results.map((item, index) => (
              <button
                key={index}
                onClick={() => { handleNavigate(item); handleClose() }}
                className={`w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors ${
                  index === selectedIndex ? 'bg-[#1a1a1a]' : ''
                }`}
              >
                <span className="text-sm text-[#E5E5E5]">{item.label}</span>
                <span className="text-xs text-[#808080] capitalize px-2 py-0.5 bg-[#1a1a1a] rounded">{item.type}</span>
              </button>
            ))}
          </div>
        ) : query.length > 0 ? (
          <div className="px-4 py-8 text-center text-[#808080] text-sm">
            No results for "{query}"
          </div>
        ) : (
          <div className="px-4 py-6 text-sm text-[#808080]">
            <p className="mb-2">Quick navigation:</p>
            <div className="space-y-1">
              {staticTargets.filter(t => t.type === 'section').map(item => (
                <button
                  key={item.section}
                  onClick={() => { handleNavigate(item); handleClose() }}
                  className="block w-full text-left py-1 hover:text-[#E5E5E5] transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 py-2 border-t border-[#1a1a1a] flex items-center justify-between text-xs text-[#808080]">
          <div className="flex gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-[#1a1a1a] rounded">↑↓</kbd> navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-[#1a1a1a] rounded">↵</kbd> open</span>
          </div>
          <span><kbd className="px-1.5 py-0.5 bg-[#1a1a1a] rounded">ESC</kbd> close</span>
        </div>
      </div>
    </div>
  )
}

export default SearchModal
