import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Trash2, Save, X } from 'lucide-react'

function SkillsEditor() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newCategory, setNewCategory] = useState('')

  useEffect(() => {
    fetchSkills()
  }, [])

  async function fetchSkills() {
    const { data } = await supabase.from('skills').select('*').order('sort_order')
    setSkills(data || [])
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    for (let i = 0; i < skills.length; i++) {
      const skill = { ...skills[i], sort_order: i + 1 }
      if (skill.id) {
        await supabase.from('skills').update(skill).eq('id', skill.id)
      } else {
        await supabase.from('skills').insert(skill)
      }
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    fetchSkills()
  }

  function addCategory() {
    if (!newCategory.trim()) return
    setSkills([...skills, { category: newCategory.trim(), items: [] }])
    setNewCategory('')
  }

  function removeCategory(index) {
    const skill = skills[index]
    if (skill.id) {
      supabase.from('skills').delete().eq('id', skill.id)
    }
    setSkills(skills.filter((_, i) => i !== index))
  }

  function addItem(index, item) {
    if (!item.trim()) return
    const updated = [...skills]
    updated[index] = { ...updated[index], items: [...updated[index].items, item.trim()] }
    setSkills(updated)
  }

  function removeItem(skillIndex, itemIndex) {
    const updated = [...skills]
    updated[skillIndex] = {
      ...updated[skillIndex],
      items: updated[skillIndex].items.filter((_, i) => i !== itemIndex)
    }
    setSkills(updated)
  }

  if (loading) return <div className="text-[#808080]">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#E5E5E5]">Skills</h1>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#FF5733] text-black font-medium rounded hover:bg-[#FF5733]/90 transition-colors disabled:opacity-50">
          <Save size={14} />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
        </button>
      </div>

      <div className="space-y-4">
        {skills.map((skill, i) => (
          <SkillCard
            key={skill.id || i}
            skill={skill}
            index={i}
            onRemove={() => removeCategory(i)}
            onAddItem={(item) => addItem(i, item)}
            onRemoveItem={(itemIndex) => removeItem(i, itemIndex)}
          />
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addCategory()}
          placeholder="New category name"
          className="flex-1 px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none"
        />
        <button onClick={addCategory} className="flex items-center gap-1 px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded text-sm text-[#808080] hover:text-[#E5E5E5] transition-colors">
          <Plus size={14} /> Add Category
        </button>
      </div>
    </div>
  )
}

function SkillCard({ skill, index, onRemove, onAddItem, onRemoveItem }) {
  const [newItem, setNewItem] = useState('')

  function handleAdd() {
    onAddItem(newItem)
    setNewItem('')
  }

  return (
    <div className="p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-[#E5E5E5]">{skill.category}</h3>
        <button onClick={onRemove} className="p-1 text-[#808080] hover:text-red-400 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {(skill.items || []).map((item, j) => (
          <span key={j} className="flex items-center gap-1 px-2.5 py-1 bg-[#1a1a1a] border border-[#333] rounded text-sm text-[#E5E5E5]">
            {item}
            <button onClick={() => onRemoveItem(j)} className="text-[#808080] hover:text-red-400 transition-colors">
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add skill"
          className="flex-1 px-3 py-1.5 bg-[#000] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm focus:border-[#FF5733]/50 focus:outline-none"
        />
        <button onClick={handleAdd} className="px-3 py-1.5 bg-[#1a1a1a] border border-[#333] rounded text-sm text-[#808080] hover:text-[#E5E5E5] transition-colors">
          <Plus size={14} />
        </button>
      </div>
    </div>
  )
}

export default SkillsEditor
