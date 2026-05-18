import { Mail, Phone, MapPin, Download } from 'lucide-react'
import { useContent } from '../hooks/useContent'

const Github = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
)

const Linkedin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

const iconMap = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Email: Mail,
}

function Hero() {
  const { content, loading } = useContent()

  if (loading || !content) return null

  const { hero } = content

  return (
    <section id="home" className="py-12">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-40 h-40 md:w-48 md:h-48 flex-shrink-0 bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#1a1a1a]">
          <img
            src="/profile-pic.jpg"
            alt={`${hero.name} - ${hero.title}`}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        <div className="flex-1">
          <div className="mb-4">
            <span className="text-[#FF5733]">$</span>
            <span className="ml-2 text-[#808080]">whoami</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold text-[#E5E5E5] mb-2">{hero.name}</h1>
          <p className="text-[#FF5733] text-lg mb-4">{hero.title}</p>
          <p className="text-[#808080] text-sm leading-relaxed mb-6">{hero.bio}</p>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            {hero.location && (
              <span className="flex items-center gap-1.5 text-sm text-[#808080]">
                <MapPin size={14} />
                {hero.location}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {hero.socials.map(social => {
              const Icon = iconMap[social.label] || Mail
              return (
                <a
                  key={social.label}
                  href={social.url}
                  target={social.url.startsWith('http') ? '_blank' : undefined}
                  rel={social.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-2 px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg hover:border-[#FF5733]/50 transition-all duration-300 text-sm text-[#808080] hover:text-[#E5E5E5]"
                >
                  <Icon size={16} />
                  {social.label}
                </a>
              )
            })}
          </div>

          {hero.resume_files && hero.resume_files.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {hero.resume_files.map(resume => (
                <a
                  key={resume.label}
                  href={resume.file}
                  download
                  className="flex items-center gap-2 px-4 py-2 bg-[#FF5733]/10 border border-[#FF5733]/30 rounded-lg hover:border-[#FF5733]/60 transition-all duration-300 text-sm text-[#FF5733] hover:bg-[#FF5733]/20"
                >
                  <Download size={14} />
                  {resume.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Hero
