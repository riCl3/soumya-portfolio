import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Trash2, Save } from 'lucide-react'

function ProfileEditor() {
  const [hero, setHero] = useState({
    name: '', title: '', tagline: '', bio: '', location: '',
    socials: [], resume_files: []
  })
  const [education, setEducation] = useState({
    institution: '', degree: '', period: '', cgpa: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    const { data } = await supabase.from('profiles').select('*').limit(1).single()
    if (data) {
      setHero(data.hero || {})
      setEducation(data.education || {})
    }
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    const { data } = await supabase.from('profiles').select('id').limit(1).single()
    if (data) {
      await supabase.from('profiles').update({ hero, education, updated_at: new Date().toISOString() }).eq('id', data.id)
    } else {
      await supabase.from('profiles').insert({ hero, education })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function addSocial() {
    setHero({ ...hero, socials: [...hero.socials, { label: '', url: '' }] })
  }

  function removeSocial(index) {
    setHero({ ...hero, socials: hero.socials.filter((_, i) => i !== index) })
  }

  function addResume() {
    setHero({ ...hero, resume_files: [...hero.resume_files, { label: '', file: '' }] })
  }

  function removeResume(index) {
    setHero({ ...hero, resume_files: hero.resume_files.filter((_, i) => i !== index) })
  }

  if (loading) return <div className="text-[#808080]">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#E5E5E5]">Profile</h1>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#FF5733] text-black font-medium rounded hover:bg-[#FF5733]/90 transition-colors disabled:opacity-50">
          <Save size={14} />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
        </button>
      </div>

      {/* Hero Section */}
      <section className="mb-8">
        <h2 className="text-lg font-medium text-[#E5E5E5] mb-4">Hero</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#808080] mb-1">Name</label>
              <input value={hero.name} onChange={e => setHero({ ...hero, name: e.target.value })} className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs text-[#808080] mb-1">Title</label>
              <input value={hero.title} onChange={e => setHero({ ...hero, title: e.target.value })} className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#808080] mb-1">Tagline</label>
            <input value={hero.tagline} onChange={e => setHero({ ...hero, tagline: e.target.value })} className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-[#808080] mb-1">Bio</label>
            <textarea value={hero.bio} onChange={e => setHero({ ...hero, bio: e.target.value })} rows={3} className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none resize-y" />
          </div>
          <div>
            <label className="block text-xs text-[#808080] mb-1">Location</label>
            <input value={hero.location} onChange={e => setHero({ ...hero, location: e.target.value })} className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
          </div>
        </div>
      </section>

      {/* Socials */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-[#E5E5E5]">Social Links</h2>
          <button onClick={addSocial} className="flex items-center gap-1 text-sm text-[#FF5733] hover:underline">
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="space-y-3">
          {hero.socials.map((social, i) => (
            <div key={i} className="flex gap-2 items-start">
              <input value={social.label} onChange={e => {
                const updated = [...hero.socials]
                updated[i].label = e.target.value
                setHero({ ...hero, socials: updated })
              }} placeholder="Label" className="w-32 px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
              <input value={social.url} onChange={e => {
                const updated = [...hero.socials]
                updated[i].url = e.target.value
                setHero({ ...hero, socials: updated })
              }} placeholder="URL" className="flex-1 px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
              <button onClick={() => removeSocial(i)} className="p-2 text-[#808080] hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Resume Files */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-[#E5E5E5]">Resume Files</h2>
          <button onClick={addResume} className="flex items-center gap-1 text-sm text-[#FF5733] hover:underline">
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="space-y-3">
          {hero.resume_files.map((resume, i) => (
            <div key={i} className="flex gap-2 items-start">
              <input value={resume.label} onChange={e => {
                const updated = [...hero.resume_files]
                updated[i].label = e.target.value
                setHero({ ...hero, resume_files: updated })
              }} placeholder="Label" className="w-48 px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
              <input value={resume.file} onChange={e => {
                const updated = [...hero.resume_files]
                updated[i].file = e.target.value
                setHero({ ...hero, resume_files: updated })
              }} placeholder="File path" className="flex-1 px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
              <button onClick={() => removeResume(i)} className="p-2 text-[#808080] hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section>
        <h2 className="text-lg font-medium text-[#E5E5E5] mb-4">Education</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#808080] mb-1">Institution</label>
            <input value={education.institution} onChange={e => setEducation({ ...education, institution: e.target.value })} className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-[#808080] mb-1">Degree</label>
            <input value={education.degree} onChange={e => setEducation({ ...education, degree: e.target.value })} className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#808080] mb-1">Period</label>
              <input value={education.period} onChange={e => setEducation({ ...education, period: e.target.value })} className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs text-[#808080] mb-1">CGPA</label>
              <input value={education.cgpa} onChange={e => setEducation({ ...education, cgpa: e.target.value })} className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProfileEditor
