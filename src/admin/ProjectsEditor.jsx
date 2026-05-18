import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Trash2, Save, Star, GripVertical } from 'lucide-react'

const emptyProject = { title: '', description: '', tags: [], github: '', demo: '', featured: false, date: new Date().toISOString().split('T')[0] }

function ProjectsEditor() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('*').order('sort_order')
    setProjects(data || [])
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    for (let i = 0; i < projects.length; i++) {
      const proj = { ...projects[i], sort_order: i + 1 }
      if (proj.id) {
        await supabase.from('projects').update(proj).eq('id', proj.id)
      } else {
        await supabase.from('projects').insert(proj)
      }
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    fetchProjects()
  }

  function addProject() {
    setProjects([...projects, { ...emptyProject }])
  }

  function removeProject(index) {
    const proj = projects[index]
    if (proj.id) {
      supabase.from('projects').delete().eq('id', proj.id)
    }
    setProjects(projects.filter((_, i) => i !== index))
  }

  function updateField(index, field, value) {
    const updated = [...projects]
    updated[index] = { ...updated[index], [field]: value }
    setProjects(updated)
  }

  function toggleFeatured(index) {
    updateField(index, 'featured', !projects[index].featured)
  }

  if (loading) return <div className="text-[#808080]">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#E5E5E5]">Projects</h1>
        <div className="flex gap-2">
          <button onClick={addProject} className="flex items-center gap-1 px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded text-sm text-[#808080] hover:text-[#E5E5E5] transition-colors">
            <Plus size={14} /> Add
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#FF5733] text-black font-medium rounded hover:bg-[#FF5733]/90 transition-colors disabled:opacity-50">
            <Save size={14} />
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {projects.map((proj, i) => (
          <div key={proj.id || i} className={`p-4 bg-[#0a0a0a] border rounded-lg ${proj.featured ? 'border-[#FF5733]/30' : 'border-[#1a1a1a]'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <GripVertical size={14} className="text-[#808080]" />
                <button onClick={() => toggleFeatured(i)} className={`p-1 rounded transition-colors ${proj.featured ? 'text-[#FF5733]' : 'text-[#808080] hover:text-[#FF5733]'}`}>
                  <Star size={14} fill={proj.featured ? 'currentColor' : 'none'} />
                </button>
              </div>
              <button onClick={() => removeProject(i)} className="p-1 text-[#808080] hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-[#808080] mb-1">Title</label>
                <input value={proj.title} onChange={e => updateField(i, 'title', e.target.value)} className="w-full px-3 py-2 bg-[#000] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs text-[#808080] mb-1">Date</label>
                <input type="date" value={proj.date} onChange={e => updateField(i, 'date', e.target.value)} className="w-full px-3 py-2 bg-[#000] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs text-[#808080] mb-1">Description</label>
              <textarea value={proj.description} onChange={e => updateField(i, 'description', e.target.value)} rows={2} className="w-full px-3 py-2 bg-[#000] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none resize-y" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-[#808080] mb-1">GitHub URL</label>
                <input value={proj.github || ''} onChange={e => updateField(i, 'github', e.target.value)} className="w-full px-3 py-2 bg-[#000] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs text-[#808080] mb-1">Demo URL</label>
                <input value={proj.demo || ''} onChange={e => updateField(i, 'demo', e.target.value)} className="w-full px-3 py-2 bg-[#000] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#808080] mb-1">Tags (comma-separated)</label>
              <input
                value={(proj.tags || []).join(', ')}
                onChange={e => updateField(i, 'tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                className="w-full px-3 py-2 bg-[#000] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none"
                placeholder="React, Node.js, Docker"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectsEditor
