import { ExternalLink, Star } from 'lucide-react'
import { useContent } from '../hooks/useContent'

const Github = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
)

function FeaturedProjectCard({ project }) {
  return (
    <div className="p-6 bg-[#0a0a0a] border border-[#FF5733]/30 rounded-lg hover:border-[#FF5733]/60 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2">
        <span className="text-xs text-[#FF5733] bg-[#FF5733]/10 px-2 py-0.5 rounded flex items-center gap-1">
          <Star size={10} fill="currentColor" />
          Featured
        </span>
      </div>

      <h3 className="font-medium text-lg mb-2 group-hover:text-[#FF5733] transition-colors pr-20">{project.title}</h3>
      <p className="text-[#808080] text-sm mb-4">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map(tag => (
          <span key={tag} className="text-xs text-[#FF5733] bg-[#FF5733]/10 px-2 py-0.5 rounded">{tag}</span>
        ))}
      </div>

      <div className="flex gap-3">
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-[#808080] hover:text-[#E5E5E5] transition-colors">
            <Github />
            Code
          </a>
        )}
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-[#808080] hover:text-[#E5E5E5] transition-colors">
            <ExternalLink size={14} />
            Demo
          </a>
        )}
      </div>
    </div>
  )
}

function ProjectCard({ project }) {
  return (
    <div className="p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg hover:border-[#FF5733]/50 transition-all duration-300 group">
      <h3 className="font-medium mb-2 group-hover:text-[#FF5733] transition-colors">{project.title}</h3>
      <p className="text-[#808080] text-sm mb-3">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        {project.tags.map(tag => (
          <span key={tag} className="text-xs text-[#808080] bg-[#1a1a1a] px-2 py-0.5 rounded">{tag}</span>
        ))}
      </div>

      <div className="flex gap-3">
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-[#808080] hover:text-[#E5E5E5] transition-colors">
            <Github />
            Code
          </a>
        )}
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-[#808080] hover:text-[#E5E5E5] transition-colors">
            <ExternalLink size={14} />
            Demo
          </a>
        )}
      </div>
    </div>
  )
}

function Projects() {
  const { content, loading } = useContent()

  if (loading || !content) return null

  const { projects } = content
  const featured = projects.filter(p => p.featured)
  const regular = projects.filter(p => !p.featured)

  return (
    <section id="projects" className="py-12">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <span className="text-[#FF5733]">##</span>
        Projects
      </h2>

      {featured.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-[#808080] mb-4 flex items-center gap-2">
            <Star size={14} className="text-[#FF5733]" fill="currentColor" />
            Featured
          </h3>
          <div className="grid gap-4">
            {featured.map(project => (
              <FeaturedProjectCard key={project.title} project={project} />
            ))}
          </div>
        </div>
      )}

      {regular.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#808080] mb-4">All Projects</h3>
          <div className="grid gap-4">
            {regular.map(project => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default Projects
