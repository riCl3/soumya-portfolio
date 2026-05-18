import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LogOut, LayoutDashboard, User, Briefcase, FolderGit2, Code, BookOpen } from 'lucide-react'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/profile', label: 'Profile', icon: User },
  { to: '/admin/experience', label: 'Experience', icon: Briefcase },
  { to: '/admin/projects', label: 'Projects', icon: FolderGit2 },
  { to: '/admin/skills', label: 'Skills', icon: Code },
  { to: '/admin/blogs', label: 'Blogs', icon: BookOpen },
]

function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col shrink-0">
        <div className="p-4 border-b border-[#1a1a1a]">
          <span className="text-[#FF5733]">$</span>
          <span className="ml-2 text-sm font-medium text-[#E5E5E5]">Admin Panel</span>
        </div>

        <nav className="flex-1 p-2 space-y-0.5">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors ${
                  isActive
                    ? 'bg-[#1a1a1a] text-[#FF5733]'
                    : 'text-[#808080] hover:text-[#E5E5E5] hover:bg-[#1a1a1a]/50'
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-[#1a1a1a]">
          <div className="text-xs text-[#808080] mb-2 truncate">{user?.email}</div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-3 py-2 rounded text-sm text-[#808080] hover:text-red-400 hover:bg-[#1a1a1a] transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[900px] mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
