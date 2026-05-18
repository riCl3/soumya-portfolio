import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Home, Briefcase, FolderGit2, BookOpen, Menu, X, Search, GraduationCap, Code } from 'lucide-react'

const navItems = [
  { label: 'Home', href: '#home', icon: Home },
  { label: 'Work', href: '#work', icon: Briefcase },
  { label: 'Education', href: '#education', icon: GraduationCap },
  { label: 'Projects', href: '#projects', icon: FolderGit2 },
  { label: 'Skills', href: '#skills', icon: Code },
  { label: 'Blog', href: '#blog', icon: BookOpen },
]

function Navbar({ onSearchOpen }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const location = useLocation()
  const navigate = useNavigate()
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    if (!isHomePage) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -60% 0px' }
    )

    navItems.forEach(item => {
      const el = document.querySelector(item.href)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [isHomePage])

  const handleNavClick = (href) => {
    setIsMobileMenuOpen(false)
    if (!isHomePage) {
      navigate('/' + href)
      return
    }
    const el = document.querySelector(href)
    if (el) {
      const offset = 80
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-sm border-b border-[#1a1a1a]">
      <div className="max-w-[800px] mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-[#FF5733]">&gt;</span>
          <span className="font-semibold">soumya</span>
          <span className="text-[#808080]">~/portfolio</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = isHomePage && activeSection === item.href.slice(1)
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`px-3 py-1.5 text-sm rounded transition-all ${
                  isActive
                    ? 'text-[#E5E5E5] bg-[#1a1a1a]'
                    : 'text-[#808080] hover:text-[#E5E5E5] hover:bg-[#1a1a1a]'
                }`}
              >
                {item.label}
              </button>
            )
          })}
          <button
            onClick={onSearchOpen}
            className="ml-2 px-3 py-1.5 text-sm text-[#808080] hover:text-[#E5E5E5] hover:bg-[#1a1a1a] rounded flex items-center gap-2 transition-all border border-[#1a1a1a]"
            aria-label="Open search"
          >
            <Search size={14} />
            <span className="text-xs">⌘K</span>
          </button>
        </div>

        <button
          className="md:hidden p-2 hover:bg-[#1a1a1a] rounded transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#1a1a1a] px-4 py-2">
          {navItems.map((item) => {
            const isActive = isHomePage && activeSection === item.href.slice(1)
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`block w-full text-left py-2 rounded px-2 transition-colors ${
                  isActive ? 'text-[#E5E5E5] bg-[#1a1a1a]' : 'text-[#808080] hover:text-[#E5E5E5]'
                }`}
              >
                {item.label}
              </button>
            )
          })}
          <button
            onClick={() => { onSearchOpen(); setIsMobileMenuOpen(false) }}
            className="flex items-center gap-2 py-2 text-[#808080] w-full px-2"
          >
            <Search size={14} />
            <span>Search... ⌘K</span>
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
