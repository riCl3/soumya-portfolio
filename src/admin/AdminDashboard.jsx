import { Link } from 'react-router-dom'
import { User, Briefcase, FolderGit2, Code, BookOpen, ExternalLink } from 'lucide-react'

const sections = [
  { to: '/admin/profile', label: 'Profile & Education', icon: User, desc: 'Update your name, bio, socials, resume links' },
  { to: '/admin/experience', label: 'Experience', icon: Briefcase, desc: 'Add or edit work experience entries' },
  { to: '/admin/projects', label: 'Projects', icon: FolderGit2, desc: 'Manage project listings and featured status' },
  { to: '/admin/skills', label: 'Skills', icon: Code, desc: 'Update skill categories and items' },
  { to: '/admin/blogs', label: 'Blogs', icon: BookOpen, desc: 'Create, edit, and publish blog posts' },
]

function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#E5E5E5]">Dashboard</h1>
        <p className="text-[#808080] text-sm mt-1">Manage your portfolio content</p>
      </div>

      <div className="grid gap-4">
        {sections.map(section => (
          <Link
            key={section.to}
            to={section.to}
            className="flex items-center gap-4 p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg hover:border-[#FF5733]/50 transition-all group"
          >
            <div className="w-10 h-10 rounded bg-[#1a1a1a] flex items-center justify-center group-hover:bg-[#FF5733]/10 transition-colors">
              <section.icon size={20} className="text-[#808080] group-hover:text-[#FF5733] transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[#E5E5E5] group-hover:text-[#FF5733] transition-colors">{section.label}</h3>
              <p className="text-xs text-[#808080]">{section.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
        <h3 className="text-sm font-medium text-[#E5E5E5] mb-2">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/blogs/new"
            className="px-3 py-1.5 bg-[#FF5733]/10 border border-[#FF5733]/30 rounded text-sm text-[#FF5733] hover:bg-[#FF5733]/20 transition-colors"
          >
            + New Blog Post
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] border border-[#333] rounded text-sm text-[#808080] hover:text-[#E5E5E5] transition-colors"
          >
            <ExternalLink size={12} />
            View Live Site
          </a>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
