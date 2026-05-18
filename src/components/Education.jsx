import { useContent } from '../hooks/useContent'

function Education() {
  const { content, loading } = useContent()

  if (loading || !content) return null

  const { education } = content

  return (
    <section id="education" className="py-12">
      <h2 className="text-xl font-semibold mb-8 flex items-center gap-2">
        <span className="text-[#FF5733]">##</span>
        Education
      </h2>

      <div className="relative">
        <div className="absolute left-[7px] top-2 bottom-0 w-px border-l-2 border-dashed border-[#333]"></div>

        <div className="relative pl-8">
          <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[#000] flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#808080]"></span>
          </div>

          <h3 className="text-lg font-semibold text-[#E5E5E5]">{education.institution}</h3>
          <p className="text-[#FF5733] text-sm mb-1">{education.degree}</p>
          <p className="text-[#808080] text-sm mb-3">{education.period} {education.cgpa && `• CGPA: ${education.cgpa}`}</p>
        </div>
      </div>
    </section>
  )
}

export default Education
