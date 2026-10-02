import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Compass,
  Sliders,
  Sparkles,
  User,
  TrendingUp,
  Briefcase,
  Bookmark,
  Camera,
  GraduationCap,
  Quote,
  Settings,
  Heart,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/Logo'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Hero Banner Editor', href: '/admin/banner', icon: Sliders },
  { name: 'Introduction Editor', href: '/admin/intro', icon: Sparkles },
  { name: 'About Section Editor', href: '/admin/about', icon: User },
  { name: 'Thematic Statement / Quote', href: '/admin/philosophy', icon: Quote },
  { name: 'Journey Across Borders', href: '/admin/journey', icon: Compass },
  { name: 'Impact Section Editor', href: '/admin/impact', icon: TrendingUp },
  { name: 'Projects Section Editor', href: '/admin/projects', icon: Briefcase },
  { name: 'Featured Story Editor', href: '/admin/featured-story', icon: Bookmark },
  { name: 'Living Testimonials', href: '/admin/testimonies', icon: Heart },
  { name: 'Education Section Editor', href: '/admin/education', icon: GraduationCap },
  { name: 'Archive & Gallery Editor', href: '/admin/gallery', icon: Camera },
  { name: 'Publications & Blog', href: '/admin/blogs', icon: FileText },
  { name: 'Inquiries & Messages', href: '/admin/inquiries', icon: MessageSquare },
  { name: 'Settings & Security', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Ensure scroll is fully enabled on all admin views
  useEffect(() => {
    document.documentElement.classList.remove('is-intro')
    document.documentElement.style.overflow = 'auto'
    document.body.style.overflow = 'auto'
    document.body.style.height = 'auto'
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const isCurrent = (item) => {
    if (item.exact) return location.pathname === item.href
    return location.pathname.startsWith(item.href)
  }

  return (
    <div className="admin-shell min-h-screen w-full max-w-[100vw] bg-[#0d0c0a] text-paper flex overflow-x-hidden selection:bg-[#8d7043]/30 selection:text-white">
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#12100d] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Top Brand Header */}
        <div className="flex h-14 shrink-0 items-center justify-between px-4 border-b border-white/10 bg-[#12100d]">
          <Link to="/admin" className="flex items-center gap-2.5">
            <Logo variant="lockup" priority className="h-8 w-auto object-contain" />
            <div className="border-l border-white/20 pl-2.5">
              <span className="block text-[0.6rem] font-semibold tracking-[0.2em] text-[#C9A15A] uppercase">
                CMS Admin
              </span>
              <span className="block text-xs text-mist/80 font-serif leading-tight">Gilbert Hub</span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-mist/60 hover:text-white p-1"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Nav Items Area (All 13 items perfectly visible) */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2.5 space-y-1 no-scrollbar select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <nav className="space-y-1" aria-label="Admin Navigation">
            {navigation.map((item) => {
              const active = isCurrent(item)
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-medium tracking-wide transition-all ${active
                    ? 'bg-gradient-to-r from-[#8d7043]/35 to-[#C9A15A]/20 text-[#fae8be] border border-[#C9A15A]/50 font-semibold shadow-sm'
                    : 'text-mist/75 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${active ? 'text-[#C9A15A]' : 'text-mist/50 group-hover:text-[#C9A15A]'
                      }`}
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Fixed Bottom Actions */}
        <div className="p-2.5 shrink-0 border-t border-white/10 space-y-1.5 bg-[#0e0d0a]">
          {/* View Live Public Site */}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-mist/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Compass className="h-3.5 w-3.5 text-[#C9A15A]" />
              <span className="font-medium">Preview Live Site</span>
            </span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="font-medium">Sign Out Securely</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 bg-[#0d0c0a]/90 px-4 backdrop-blur-md sm:h-20 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-mist/80 hover:text-white"
              aria-label="Open mobile menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-mist/60">
              <span>Admin Portal</span>
              <span>/</span>
              <span className="text-white capitalize font-medium">
                {location.pathname.replace('/admin', '').replace('/', '') || 'Dashboard'}
              </span>
            </div>
          </div>


        </header>

        {/* Page Content */}
        <main className="min-w-0 flex-1 overflow-x-hidden px-3 py-5 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
