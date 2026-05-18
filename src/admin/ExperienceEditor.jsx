import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Trash2, Save, GripVertical } from 'lucide-react'

const emptyExp = { company: '', role: '', period: '', current: false, highlights: [''] }

function ExperienceEditor() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchExperiences()
  }, [])

  async function fetchExperiences() {
    const { data } = await supabase.from('experience').select('*').order('sort_order')
    setExperiences(data || [])
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    // Upsert each experience
    for (let i = 0; i < experiences.length; i++) {
      const exp = { ...experiences[i], sort_order: i + 1 }
      if (exp.id) {
        await supabase.from('experience').update(exp).eq('id', exp.id)
      } else {
        await supabase.from('experience').insert(exp)
      }
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    fetchExperiences()
  }

  function addExperience() {
    setExperiences([...experiences, { ...emptyExp, highlights: [''] }])
  }

  function removeExperience(index) {
    const exp = experiences[index]
    if (exp.id) {
      supabase.from('experience').delete().eq('id', exp.id)
    }
    setExperiences(experiences.filter((_, i) => i !== index))
  }

  function updateField(index, field, value) {
    const updated = [...experiences]
    updated[index] = { ...updated[index], [field]: value }
    setExperiences(updated)
  }

  function addHighlight(expIndex) {
    const updated = [...experiences]
    updated[expIndex].highlights = [...(updated[expIndex].highlights || []), '']
    setExperiences(updated)
  }

  function removeHighlight(expIndex, hIndex) {
    const updated = [...experiences]
    updated[expIndex].highlights = updated[expIndex].highlights.filter((_, i) => i !== hIndex)
    setExperiences(updated)
  }

  function updateHighlight(expIndex, hIndex, value) {
    const updated = [...experiences]
    updated[expIndex].highlights[hIndex] = value
    setExperiences(updated)
  }

  if (loading) return <div className="text-[#808080]">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#E5E5E5]">Experience</h1>
        <div className="flex gap-2">
          <button onClick={addExperience} className="flex items-center gap-1 px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded text-sm text-[#808080] hover:text-[#E5E5E5] transition-colors">
            <Plus size={14} /> Add
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#FF5733] text-black font-medium rounded hover:bg-[#FF5733]/90 transition-colors disabled:opacity-50">
            <Save size={14} />
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {experiences.map((exp, i) => (
          <div key={exp.id || i} className="p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 text-[#808080]">
                <GripVertical size={14} />
                <span className="text-xs">#{i + 1}</span>
              </div>
              <button onClick={() => removeExperience(i)} className="p-1 text-[#808080] hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-[#808080] mb-1">Company</label>
                <input value={exp.company} onChange={e => updateField(i, 'company', e.target.value)} className="w-full px-3 py-2 bg-[#000] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs text-[#808080] mb-1">Role</label>
                <input value={exp.role} onChange={e => updateField(i, 'role', e.target.value)} className="w-full px-3 py-2 bg-[#000] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-[#808080] mb-1">Period</label>
                <input value={exp.period} onChange={e => updateField(i, 'period', e.target.value)} className="w-full px-3 py-2 bg-[#000] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={exp.current} onChange={e => updateField(i, 'current', e.target.checked)} className="accent-[#FF5733]" />
                  <span className="text-sm text-[#808080]">Current</span>
                </label>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-[#808080]">Highlights</label>
                <button onClick={() => addHighlight(i)} className="text-xs text-[#FF5733] hover:underline">+ Add</button>
              </div>
              <div className="space-y-2">
                {(exp.highlights || []).map((h, j) => (
                  <div key={j} className="flex gap-2">
                    <input value={h} onChange={e => updateHighlight(i, j, e.target.value)} className="flex-1 px-3 py-2 bg-[#000] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none" />
                    <button onClick={() => removeHighlight(i, j)} className="p-2 text-[#808080] hover:text-red-400 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExperienceEditor
