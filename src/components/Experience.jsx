import { useContent } from '../hooks/useContent'

function Experience() {
  const { content, loading } = useContent()

  if (loading || !content) return null

  const { experience } = content

  return (
    <section id="work" className="py-12">
      <h2 className="text-xl font-semibold mb-8 flex items-center gap-2">
        <span className="text-[#FF5733]">##</span>
        Experience
      </h2>

      <div className="relative">
        <div className="absolute left-[7px] top-2 bottom-0 w-px border-l-2 border-dashed border-[#333]"></div>

        {experience.map((exp, index) => (
          <div key={exp.company} className={`relative pl-8 ${index < experience.length - 1 ? 'pb-10' : ''}`}>
            <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[#000] flex items-center justify-center`}>
              {exp.current ? (
                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse"></span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-[#808080]"></span>
              )}
            </div>

            {exp.current && (
              <div className="mb-1">
                <span className="text-[#22c55e] text-sm font-medium">Working</span>
              </div>
            )}
            <h3 className="text-lg font-semibold text-[#E5E5E5]">{exp.company}</h3>
            <p className="text-[#FF5733] text-sm mb-1">{exp.role}</p>
            <p className="text-[#808080] text-sm mb-3">{exp.period}</p>
            <ul className="space-y-2">
              {exp.highlights.map((highlight, i) => (
                <li key={i} className="text-sm text-[#808080] flex items-start gap-2">
                  <span className="text-[#FF5733] mt-1">▸</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Experience
