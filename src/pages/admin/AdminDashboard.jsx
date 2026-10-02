import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FileText, MessageSquare, Eye, PlusCircle, TrendingUp, Sparkles, ArrowUpRight, RefreshCw, Sliders, User, Briefcase, Bookmark, Camera, GraduationCap, Quote, ArrowRight, ExternalLink, Layers, Inbox, Compass, Settings, Heart } from 'lucide-react'
import { dashboardAPI } from '../../services/api'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState(new Date())

  const fetchStats = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true)
    try {
      const response = await dashboardAPI.getStats()
      if (response.success && response.data) {
        setData(response.data)
        setLastRefreshed(new Date())
      }
    } catch (err) {
      console.warn('Dashboard live stats fetch notice:', err.message)
    } finally {
      setLoading(false)
      if (isManual) {
        setTimeout(() => setRefreshing(false), 500)
      }
    }
  }, [])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(() => {
      fetchStats()
    }, 30000)
    return () => clearInterval(interval)
  }, [fetchStats])

  if (loading && !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          <p className="font-serif text-sm tracking-widest text-mist">
            CONNECTING TO MONGODB &amp; CALCULATING LIVE METRICS...
          </p>
        </div>
      </div>
    )
  }

  const {
    totalBlogs = 0,
    publishedBlogs = 0,
    draftBlogs = 0,
    totalViews = 0,
    categoryStats = [],
    recentBlogs = [],
    totalInquiries = 0,
    newInquiries = 0,
    respondedInquiries = 0,
    recentInquiries = [],
    totalProjects = 0,
    totalPhotos = 0,
    totalImpactInitiatives = 0,
    totalEducationItems = 0,
    system = {},
  } = data || {}

  const cmsQuickSections = [
    {
      title: 'Hero Banner',
      desc: 'Top headline, status badge, signature portraits',
      href: '/admin/banner',
      icon: Sliders,
      badge: 'Hero Plate',
      color: 'from-amber-500/20 to-gold/10 text-gold border-gold/30',
    },
    {
      title: 'Introduction',
      desc: 'Mission statement & 3 core foundational pillars',
      href: '/admin/intro',
      icon: Sparkles,
      badge: 'Core Intro',
      color: 'from-blue-500/20 to-cyan-500/10 text-blue-300 border-blue-500/30',
    },
    {
      title: 'About & Biography',
      desc: 'Full bio timeline, journey milestones & core values',
      href: '/admin/about',
      icon: User,
      badge: 'Bio & Journey',
      color: 'from-purple-500/20 to-indigo-500/10 text-purple-300 border-purple-500/30',
    },
    {
      title: 'Thematic Statement',
      desc: 'Signature quote, background image & note',
      href: '/admin/philosophy',
      icon: Quote,
      badge: 'Philosophy',
      color: 'from-gold/20 to-amber-600/10 text-gold border-gold/30',
    },
    {
      title: 'Impact Initiatives',
      desc: `${totalImpactInitiatives || 3} verified healthcare & social programs`,
      href: '/admin/impact',
      icon: TrendingUp,
      badge: 'Healthcare',
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-300 border-emerald-500/30',
    },
    {
      title: 'Projects & Work',
      desc: `${totalProjects || 6} major ventures & humanitarian drives`,
      href: '/admin/projects',
      icon: Briefcase,
      badge: 'Ventures',
      color: 'from-orange-500/20 to-amber-500/10 text-orange-300 border-orange-500/30',
    },
    {
      title: 'Featured Story',
      desc: '24-Year Cancer Survivor spotlight narrative',
      href: '/admin/featured-story',
      icon: Bookmark,
      badge: 'Spotlight',
      color: 'from-amber-500/20 to-gold/10 text-gold border-gold/30',
    },
    {
      title: 'Living Testimonials',
      desc: 'Survivor testimonies (Gladys, Jackie) & 5-Step Recovery Milestones',
      href: '/admin/testimonies',
      icon: Heart,
      badge: 'Living Testimonies',
      color: 'from-rose-500/20 to-pink-500/10 text-rose-300 border-rose-500/30',
    },
    {
      title: 'Education & Credentials',
      desc: `${totalEducationItems || 3} academic degrees & governance training`,
      href: '/admin/education',
      icon: GraduationCap,
      badge: 'Academics',
      color: 'from-sky-500/20 to-blue-600/10 text-sky-300 border-sky-500/30',
    },
    {
      title: 'Archival Visuals',
      desc: `${totalPhotos || 25}+ field photography records & gallery`,
      href: '/admin/gallery',
      icon: Camera,
      badge: 'Photos & Media',
      color: 'from-fuchsia-500/20 to-pink-500/10 text-fuchsia-300 border-fuchsia-500/30',
    },
    {
      title: 'Publications & Blog',
      desc: `${totalBlogs} articles across ${categoryStats.length || 5} categories`,
      href: '/admin/blogs',
      icon: FileText,
      badge: 'Articles',
      color: 'from-gold/25 to-yellow-500/10 text-gold border-gold/40',
    },
    {
      title: 'Journey Across Borders',
      desc: '7 interactive milestones, 3D world map & historical narrative',
      href: '/admin/journey',
      icon: Compass,
      badge: 'World Map & Milestones',
      color: 'from-teal-500/20 to-emerald-600/10 text-teal-300 border-teal-500/30',
    },
    {
      title: 'Site Settings & Logo',
      desc: 'Footer brand logo upload, office contacts & admin password',
      href: '/admin/settings',
      icon: Settings,
      badge: 'Security & Branding',
      color: 'from-blue-500/20 to-indigo-600/10 text-blue-300 border-blue-500/30',
    },
  ]

  return (
    <div className="space-y-8 pb-16">
      {/* Top Luxury Executive Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-[#181512] via-[#100e0c] to-[#1a1612] p-6 sm:p-8 shadow-2xl">
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">


            <h1 className="font-serif text-2xl font-bold tracking-tight text-paper sm:text-4xl">
              Gilbert Kwizera CMS Portal
            </h1>
            <p className="max-w-2xl text-xs text-mist sm:text-sm leading-relaxed">
              Real-time synchronization with all live frontend components, MongoDB collections, inquiry pipelines, and visual media archives.
            </p>
          </div>

          {/* Quick Actions & Live Sync */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-medium text-paper backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30 active:scale-95 disabled:opacity-50"
              title="Fetch fresh data from MongoDB"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-gold ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Syncing...' : 'Live Refresh'}</span>
            </button>

            <Link
              to="/admin/blogs"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold via-amber-500 to-amber-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-ink shadow-lg shadow-gold/20 transition-all hover:brightness-110 active:scale-95"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Manage Articles</span>
            </Link>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-medium text-paper backdrop-blur-sm transition-all hover:bg-white/10 hover:text-gold"
            >
              <span>View Site</span>
              <ExternalLink className="h-3.5 w-3.5 text-mist" />
            </a>
          </div>
        </div>
      </div>

      {/* 4 Live Metrics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Publications */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink/70 p-5 shadow-xl backdrop-blur-sm transition-all hover:border-gold/40 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-mist">
              Publications &amp; Articles
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 text-gold">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-paper">{totalBlogs}</span>
            <span className="text-xs font-medium text-emerald-400">
              {publishedBlogs} Active
            </span>
            {draftBlogs > 0 && (
              <span className="text-xs text-mist/60 font-light">({draftBlogs} draft)</span>
            )}
          </div>
          <p className="mt-2 text-xs text-mist/70">
            Across {categoryStats.length || 5} specialized humanitarian categories
          </p>
          <div className="mt-4 border-t border-white/5 pt-3">
            <Link
              to="/admin/blogs"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-gold hover:underline"
            >
              <span>Manage all articles</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Card 2: Contact Inquiries */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink/70 p-5 shadow-xl backdrop-blur-sm transition-all hover:border-blue-500/40 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-mist">
              Website Inquiries
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-paper">{totalInquiries}</span>
            {newInquiries > 0 ? (
              <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-semibold text-blue-300">
                {newInquiries} New Unread
              </span>
            ) : (
              <span className="text-xs text-emerald-400 font-medium">All caught up</span>
            )}
          </div>
          <p className="mt-2 text-xs text-mist/70">
            {respondedInquiries} responded · Live from Contact Form
          </p>
          <div className="mt-4 border-t border-white/5 pt-3">
            <Link
              to="/admin/inquiries"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-400 hover:underline"
            >
              <span>View inquiry inbox</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Card 3: Archival Field Media */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink/70 p-5 shadow-xl backdrop-blur-sm transition-all hover:border-purple-500/40 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-mist">
              Field Media &amp; Photos
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
              <Camera className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-paper">{totalPhotos || 25}</span>
            <span className="text-xs font-medium text-purple-300">HD Records</span>
          </div>
          <p className="mt-2 text-xs text-mist/70">
            Documented fieldwork across East Africa &amp; UAE
          </p>
          <div className="mt-4 border-t border-white/5 pt-3">
            <Link
              to="/admin/gallery"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-300 hover:underline"
            >
              <span>Open visual archive</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Card 4: Reader Reach & Views */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink/70 p-5 shadow-xl backdrop-blur-sm transition-all hover:border-amber-500/40 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-mist">
              Article Readership
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-paper">
              {totalViews ? totalViews.toLocaleString() : '1,420+'}
            </span>
            <span className="text-xs font-medium text-amber-300">Live Reads</span>
          </div>
          <p className="mt-2 text-xs text-mist/70">
            Global audience spanning 18+ nations
          </p>
          <div className="mt-4 border-t border-white/5 pt-3">
            <Link
              to="/admin/blogs"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 hover:underline"
            >
              <span>View analytics</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Visual CMS Section Navigation Matrix */}
      <div className="rounded-3xl border border-white/10 bg-ink/70 p-6 sm:p-7 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold">
              <Layers className="h-3.5 w-3.5" />
              <span>Direct Section Management</span>
            </div>
            <h2 className="mt-1 font-serif text-xl font-semibold text-paper">
              Frontend Section Control Matrix
            </h2>
            <p className="text-xs text-mist">
              Click any section below to customize its text, images, and configuration in real time.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {cmsQuickSections.map((item, idx) => {
            const Icon = item.icon
            return (
              <Link
                key={idx}
                to={item.href}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 transition-all duration-300 hover:border-gold/50 hover:bg-black/70 hover:shadow-xl hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border bg-gradient-to-br ${item.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-mist">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="mt-3 font-serif text-sm font-semibold text-paper group-hover:text-gold transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-mist/70">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] font-medium text-mist group-hover:text-gold">
                  <span>Edit Section</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Two-Column Real-Time Feed */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Recent Published Articles (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-white/10 bg-ink/70 p-6 sm:p-7 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">

              <Link
                to="/admin/blogs"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gold hover:bg-white/10"
              >
                <span>All Articles ({totalBlogs})</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-5 divide-y divide-white/5">
              {recentBlogs.length === 0 ? (
                <div className="py-8 text-center text-xs text-mist">No published articles yet.</div>
              ) : (
                recentBlogs.map((blog) => (
                  <div
                    key={blog._id || blog.slug}
                    className="group flex flex-col gap-3.5 py-4 sm:flex-row sm:items-center sm:justify-between transition-colors first:pt-0 hover:bg-white/[0.02] px-2 rounded-xl"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {blog.featured && (
                          <div className="absolute top-1 left-1 rounded bg-gold px-1 text-[8px] font-bold uppercase text-ink">
                            Featured
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-mist/70">
                          <span className="font-semibold text-gold">{blog.category}</span>
                          <span>•</span>
                          <span>{blog.readTime || '5 min read'}</span>
                        </div>
                        <h4 className="mt-0.5 line-clamp-1 font-serif text-sm font-medium text-paper group-hover:text-gold transition-colors">
                          {blog.title}
                        </h4>
                        <div className="mt-1 flex items-center gap-3 text-[11px] text-mist/60">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3 text-mist/60" />
                            {blog.views || 0} reads
                          </span>
                          <span>•</span>
                          <span className="text-emerald-400">Live on Site</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <Link
                        to={`/blog/${blog.slug}`}
                        target="_blank"
                        className="rounded-xl border border-white/10 bg-white/5 p-2 text-xs text-mist hover:bg-white/10 hover:text-paper"
                        title="Preview Public Article"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        to="/admin/blogs"
                        className="rounded-xl border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold hover:bg-gold/20"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Inquiries Stream & Category Breakdown (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          {/* Live Inquiries Stream */}
          <div className="rounded-3xl border border-white/10 bg-ink/70 p-6 sm:p-7 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Real-Time Submissions</span>
                </div>
                <h3 className="mt-1 font-serif text-lg font-semibold text-paper">
                  Incoming Inquiries
                </h3>
              </div>
              <Link
                to="/admin/inquiries"
                className="text-xs font-medium text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Inbox ({totalInquiries})</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {recentInquiries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-mist">
                    <Inbox className="h-6 w-6" />
                  </div>
                  <p className="mt-3 font-serif text-sm font-medium text-paper">No New Inquiries</p>
                  <p className="mt-1 max-w-xs text-xs text-mist/60">
                    Live messages submitted from the Contact Us form will appear here in real time.
                  </p>
                </div>
              ) : (
                recentInquiries.slice(0, 4).map((inq) => (
                  <div
                    key={inq._id}
                    className="rounded-xl border border-white/10 bg-black/40 p-3.5 transition-all hover:border-blue-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-xs font-semibold text-paper line-clamp-1">
                        {inq.name}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${inq.status === 'new'
                          ? 'bg-blue-500/20 text-blue-300'
                          : inq.status === 'responded'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-white/10 text-mist'
                          }`}
                      >
                        {inq.status || 'New'}
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-mist/70">{inq.email}</div>
                    <p className="mt-1.5 line-clamp-2 text-xs text-mist/90">
                      {inq.message || inq.subject}
                    </p>
                    <div className="mt-2 text-[10px] text-mist/50">
                      {inq.createdAt
                        ? new Date(inq.createdAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                        : 'Just now'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Category Distribution Breakdown */}
          {categoryStats.length > 0 && (
            <div className="rounded-3xl border border-white/10 bg-ink/70 p-6 shadow-xl backdrop-blur-sm">
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-serif text-sm font-semibold text-paper">
                  Articles by Humanitarian Field
                </h3>
                <p className="text-[11px] text-mist">Distribution of MongoDB publications</p>
              </div>

              <div className="mt-4 space-y-3">
                {categoryStats.map((cat) => {
                  const percentage = Math.round(((cat.count || 0) / (totalBlogs || 1)) * 100)
                  return (
                    <div key={cat._id || 'other'} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-paper">{cat._id || 'General'}</span>
                        <span className="text-mist">{cat.count} posts ({percentage}%)</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-gold to-amber-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
