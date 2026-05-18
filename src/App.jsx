import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import SearchModal from './components/SearchModal'
import Hero from './components/Hero'
import Experience from './components/Experience'
import Projects from './components/Projects'
import BlogList from './components/BlogList'
import BlogPost from './components/BlogPost'
import Skills from './components/Skills'
import Education from './components/Education'
import Footer from './components/Footer'
import { useScrollAnimation } from './hooks/useScrollAnimation'
import { ContentProvider } from './hooks/useContent'
import { AuthProvider, useAuth } from './hooks/useAuth'
import AdminLayout from './admin/AdminLayout'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import ProfileEditor from './admin/ProfileEditor'
import ExperienceEditor from './admin/ExperienceEditor'
import ProjectsEditor from './admin/ProjectsEditor'
import SkillsEditor from './admin/SkillsEditor'
import { BlogList as AdminBlogList, BlogEdit } from './admin/BlogEditor'
import ChatWidget from './chat/ChatWidget'

function AnimatedSection({ children, className = '', delay = 0 }) {
  const [ref, isVisible] = useScrollAnimation(0.1)

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        const offset = 80
        const top = el.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function HomePage() {
  return (
    <main className="max-w-[800px] mx-auto px-4 py-8">
      <AnimatedSection>
        <Hero />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <Experience />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <Education />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <Projects />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <BlogList />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <Skills />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <Footer />
      </AnimatedSection>
    </main>
  )
}

function NotFound() {
  return (
    <main className="max-w-[800px] mx-auto px-4 py-8 text-center">
      <h1 className="text-4xl font-semibold text-[#FF5733] mb-4">404</h1>
      <p className="text-[#808080] mb-6">Page not found</p>
      <a href="/" className="text-[#FF5733] hover:underline">Go home</a>
    </main>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#808080]">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsSearchOpen(prev => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <AuthProvider>
      <ContentProvider>
        {isAdminRoute ? (
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="profile" element={<ProfileEditor />} />
              <Route path="experience" element={<ExperienceEditor />} />
              <Route path="projects" element={<ProjectsEditor />} />
              <Route path="skills" element={<SkillsEditor />} />
              <Route path="blogs" element={<AdminBlogList />} />
              <Route path="blogs/:id" element={<BlogEdit />} />
            </Route>
          </Routes>
        ) : (
          <div className="min-h-screen bg-[#000000] text-[#E5E5E5] font-mono relative overflow-x-hidden">
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cpath fill='none' stroke='%23ffffff' stroke-width='0.5' d='M0 200 Q100 150 150 180 T300 120 T400 160 M50 250 Q120 200 180 230 T350 180 Q380 200 400 180 M20 300 Q80 260 140 290 T280 240 T400 280 M0 350 Q100 310 200 340 T400 300'/%3E%3Cpath fill='none' stroke='%23ffffff' stroke-width='0.3' d='M100 0 Q120 100 80 200 T120 400 M200 0 Q220 80 180 180 T220 400 M350 50 Q380 120 320 220 T380 400'/%3E%3Cpath fill='none' stroke='%23ffffff' stroke-width='0.2' d='M0 100 Q50 80 100 120 T200 80 T300 100 T400 60 M0 320 Q60 300 120 340 T240 300 T400 340'/%3E%3C/svg%3E")`,
                backgroundSize: '600px 600px',
                backgroundPosition: 'bottom right',
                backgroundRepeat: 'no-repeat'
              }}
            ></div>
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cpath fill='none' stroke='%23ffffff' stroke-width='0.5' d='M400 200 Q300 150 250 180 T100 120 T0 160 M350 250 Q280 200 220 230 T50 180 Q20 200 0 180 M380 300 Q300 260 260 290 T120 240 T0 280'/%3E%3Cpath fill='none' stroke='%23ffffff' stroke-width='0.3' d='M300 0 Q280 100 320 200 T280 400 M200 0 Q180 80 220 180 T180 400 M50 50 Q20 120 80 220 T20 400'/%3E%3Cpath fill='none' stroke='%23ffffff' stroke-width='0.2' d='M400 100 Q350 80 300 120 T200 80 T100 100 T0 60 M400 320 Q340 300 280 340 T160 300 T0 340'/%3E%3C/svg%3E")`,
                backgroundSize: '600px 600px',
                backgroundPosition: 'bottom left',
                backgroundRepeat: 'no-repeat'
              }}
            ></div>

            <ScrollToTop />
            <Navbar onSearchOpen={() => setIsSearchOpen(true)} />
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <ChatWidget />

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        )}
      </ContentProvider>
    </AuthProvider>
  )
}

export default App
