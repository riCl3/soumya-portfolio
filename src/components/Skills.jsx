import { useContent } from '../hooks/useContent'

function Skills() {
  const { content, loading } = useContent()

  if (loading || !content) return null

  const { skills } = content

  return (
    <section id="skills" className="py-8 mt-8 border-t border-[#1a1a1a]">
      <h3 className="text-sm font-semibold text-[#808080] mb-4 flex items-center gap-2">
        <span className="text-[#FF5733]">$</span>
        cat skills.txt
      </h3>
      <div className="space-y-3">
        {Object.entries(skills).map(([category, skillList]) => (
          <div key={category}>
            <span className="text-xs text-[#808080] mb-2 block">{category}</span>
            <div className="flex flex-wrap gap-2">
              {skillList.map(skill => (
                <span key={skill} className="px-3 py-1.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded text-[#E5E5E5] text-sm hover:border-[#FF5733]/50 hover:shadow-[0_0_8px_rgba(255,87,51,0.2)] transition-all cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills
