import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchContent()
  }, [])

  async function fetchContent() {
    try {
      const [profileRes, experienceRes, projectsRes, skillsRes] = await Promise.all([
        supabase.from('profiles').select('*').limit(1).single(),
        supabase.from('experience').select('*').order('sort_order'),
        supabase.from('projects').select('*').order('sort_order'),
        supabase.from('skills').select('*').order('sort_order'),
      ])

      setContent({
        hero: profileRes.data?.hero || {},
        education: profileRes.data?.education || {},
        experience: experienceRes.data || [],
        projects: projectsRes.data || [],
        skills: (skillsRes.data || []).reduce((acc, s) => {
          acc[s.category] = s.items
          return acc
        }, {}),
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ContentContext.Provider value={{ content, loading, error, refetch: fetchContent }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  return ctx
}
