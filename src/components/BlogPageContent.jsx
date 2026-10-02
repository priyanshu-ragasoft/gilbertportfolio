import { useState, useMemo, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Sparkles, BookOpen, Compass, HeartHandshake, Camera, Image as ImageIcon, X, Maximize2, MapPin } from 'lucide-react'
import Container from './Container'
import ScrollReveal from './ScrollReveal'
import BlogCard from './BlogCard'
import ImageFrame from './ImageFrame'
import { posts as defaultPosts } from '../data/blog'
import { profile } from '../data/profile'
import { galleryItems } from '../data/gallery'
import { blogAPI } from '../services/api'
import { resolveAsset } from '../utils/resolveAsset'

const CATEGORIES = ['All', 'Innovation', 'Cancer Care', 'Education', 'Profile & Philosophy']

export default function BlogPageContent() {
  const { pathname } = useLocation()
  const basePath = pathname.startsWith('/insights') ? '/insights' : '/blog'
  const [allPosts, setAllPosts] = useState(defaultPosts)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [activePhotoModal, setActivePhotoModal] = useState(null)
  const [activePhotoTab, setActivePhotoTab] = useState('All')

  useEffect(() => {
    const loadLivePosts = async () => {
      let apiPosts = []
      try {
        const res = await blogAPI.getBlogs()
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          apiPosts = res.data
        }
      } catch (e) {
        console.warn('Backend blogs fetch notice:', e.message)
      }

      // Check local cached blogs
      let localBlogs = []
      try {
        localBlogs = JSON.parse(localStorage.getItem('gilbert_cached_blogs') || '[]')
      } catch (e) {
        localBlogs = []
      }

      const mergedMap = new Map()
      // Initial defaults
      defaultPosts.forEach((p) => mergedMap.set(p.slug || p._id, p))
      // Local caches
      localBlogs.forEach((p) => {
        if (p && (p.slug || p._id)) mergedMap.set(p.slug || p._id, p)
      })
      // API blogs
      apiPosts.forEach((p) => {
        if (p && (p.slug || p._id)) mergedMap.set(p.slug || p._id, p)
      })

      setAllPosts(Array.from(mergedMap.values()))
    }

    loadLivePosts()

    // Real-time listener for admin updates
    const handleLiveUpdate = () => {
      loadLivePosts()
    }
    window.addEventListener('gilbert_blog_updated', handleLiveUpdate)
    return () => window.removeEventListener('gilbert_blog_updated', handleLiveUpdate)
  }, [])

  const resolvedPosts = useMemo(() => {
    return allPosts.map((p) => ({
      ...p,
      image: resolveAsset(p.image),
      gallery: Array.isArray(p.gallery)
        ? p.gallery.map((g) => ({
            ...g,
            src: resolveAsset(g.src),
          }))
        : [],
    }))
  }, [allPosts])

  const filteredPosts = useMemo(() => {
    return resolvedPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        (post.category && post.category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
        (selectedCategory === 'Cancer Care' && post.category?.toLowerCase().includes('cancer')) ||
        (selectedCategory === 'Profile & Philosophy' &&
          (post.category?.toLowerCase().includes('profile') || post.category?.toLowerCase().includes('philosophy')))

      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !q ||
        (post.title && post.title.toLowerCase().includes(q)) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(q)) ||
        (Array.isArray(post.paragraphs) && post.paragraphs.some((p) => p.toLowerCase().includes(q))) ||
        (Array.isArray(post.tags) && post.tags.some((t) => t.toLowerCase().includes(q)))

      return matchesCategory && matchesSearch
    })
  }, [resolvedPosts, selectedCategory, searchQuery])

  const isDefaultView = selectedCategory === 'All' && !searchQuery.trim()
  const [featured, ...rest] = filteredPosts

  // Curated field photography for visual dispatches section
  const visualDispatches = useMemo(() => {
    if (activePhotoTab === 'All') return galleryItems.slice(0, 8)
    return galleryItems.filter((item) => item.category.toLowerCase().includes(activePhotoTab.toLowerCase())).slice(0, 8)
  }, [activePhotoTab])

  return (
    <div className="bg-ivory pt-32 pb-24 md:pt-40 md:pb-36 min-h-screen">
      <Container>
        {/* Header Banner */}
        <div className="border-b border-line/60 pb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-[#8d7043] uppercase mb-3">
                <Compass className="h-3.5 w-3.5" />
                <span>Official Editorial, Publications &amp; Field Records</span>
              </div>
              <h1 className="display text-4xl text-ink sm:text-5xl lg:text-6xl font-normal leading-[1.12]">
                Essays, Photo Stories &amp; Documentaries
              </h1>
              <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg leading-relaxed font-light">
                Recorded accounts, photo archives, philosophical essays, and documentary initiatives published directly by {profile.shortName}—documenting humanitarian missions, enterprise leadership, and sustainable community models.
              </p>
            </div>

            {/* Quick Summary Pill stats */}
            <div className="flex flex-wrap items-center gap-4 bg-paper/90 rounded-2xl border border-line/80 p-4 shrink-0 shadow-sm">
              <div className="pr-4 border-r border-line/60">
                <span className="block text-2xl font-serif text-ink font-bold">{allPosts.length}</span>
                <span className="text-[0.68rem] tracking-wider uppercase text-muted">Publications</span>
              </div>
              <div className="pr-4 border-r border-line/60">
                <span className="block text-2xl font-serif text-[#8d7043] font-bold">25+</span>
                <span className="text-[0.68rem] tracking-wider uppercase text-muted">Field Photos</span>
              </div>
              <div>
                <span className="block text-2xl font-serif text-ink font-bold">100%</span>
                <span className="text-[0.68rem] tracking-wider uppercase text-muted">Original Record</span>
              </div>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Article Categories">
              {CATEGORIES.map((category) => {
                const active = selectedCategory === category
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-all duration-300 ${
                      active
                        ? 'bg-ink text-paper shadow-md scale-[1.02]'
                        : 'bg-paper text-muted border border-line/80 hover:border-[#8d7043] hover:text-ink'
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>

            {/* Search input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
              <input
                type="text"
                placeholder="Search articles, photos, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-line/80 bg-paper py-2 pl-9 pr-4 text-xs text-ink placeholder:text-muted/70 focus:border-[#8d7043] focus:outline-none focus:ring-1 focus:ring-[#8d7043]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Rendering */}
        {filteredPosts.length === 0 ? (
          <div className="py-24 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted/50 mb-3" />
            <h3 className="display text-2xl text-ink">No publications found</h3>
            <p className="mt-2 text-sm text-muted">
              No articles matched your filter criteria &ldquo;{searchQuery}&rdquo;. Try selecting &ldquo;All&rdquo; categories or clearing search.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All')
                setSearchQuery('')
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-paper hover:bg-[#8d7043] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : isDefaultView && featured ? (
          <div className="mt-12 space-y-14">
            {/* Top Spotlight + Latest Releases Section */}
            <ScrollReveal type="block">
              <div className="grid gap-8 lg:grid-cols-12 items-stretch">
                <div className="lg:col-span-7">
                  <div className="mb-3 text-xs font-semibold tracking-wider text-[#8d7043] uppercase flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Spotlight Publication</span>
                  </div>
                  <BlogCard post={featured} layout="feature" basePath={basePath} />
                </div>

                {/* Side list of next articles */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
                  <div className="text-xs font-semibold tracking-wider text-muted uppercase">
                    <span>Latest Releases</span>
                  </div>
                  {rest.length > 0 ? (
                    <div className="space-y-3.5">
                      {rest.slice(0, 3).map((post) => (
                        <BlogCard key={post.slug || post._id} post={post} layout="row" basePath={basePath} />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-line/60 bg-paper/60 p-6 text-center text-sm text-muted">
                      Showing top matched article.
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Additional Remaining Articles in Beautiful 3-Column Grid */}
            {rest.length > 3 && (
              <ScrollReveal type="block" className="pt-8 border-t border-line/60">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="display text-2xl sm:text-3xl text-ink font-normal">
                      More Articles &amp; Documentary Records
                    </h3>
                    <p className="text-xs sm:text-sm text-muted font-light mt-1">
                      Comprehensive archives on health equity, agricultural development, and leadership.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#8d7043] uppercase tracking-wider">
                    {rest.slice(3).length} Articles
                  </span>
                </div>

                <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.slice(3).map((post) => (
                    <BlogCard key={post.slug || post._id} post={post} layout="grid" basePath={basePath} />
                  ))}
                </div>
              </ScrollReveal>
            )}
          </div>
        ) : (
          /* Filtered or Search View: Clean 3-Column Grid for All Matches */
          <div className="mt-12">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-line/60">
              <h3 className="display text-2xl text-ink">
                Matching Publications ({filteredPosts.length})
              </h3>
              <span className="text-xs text-muted">
                Category: <span className="font-semibold text-ink">{selectedCategory}</span>
              </span>
            </div>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <BlogCard key={post.slug || post._id} post={post} layout="grid" basePath={basePath} />
              ))}
            </div>
          </div>
        )}

        {/* Visual Dispatches & Field Photography Section */}
        <ScrollReveal type="block" className="mt-24 border-t border-line/60 pt-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#8d7043] uppercase mb-2">
                <Camera className="h-4 w-4" />
                <span>Visual Dispatches &amp; On-Ground Archive</span>
              </div>
              <h2 className="display text-3xl sm:text-4xl text-ink font-normal">
                Field Photography &amp; Mission Records
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted">
                Direct visual documentation of oncology patient care, classroom support, economic initiatives, and diplomatic summits.
              </p>
            </div>

            {/* Category Filter for Photos */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Humanitarian', 'Education', 'Leadership'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActivePhotoTab(tab)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                    activePhotoTab === tab
                      ? 'bg-ink text-paper'
                      : 'bg-paper text-muted border border-line/80 hover:text-ink'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visualDispatches.map((item) => (
              <div
                key={item.id}
                onClick={() => setActivePhotoModal(item)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-line/80 bg-paper transition-all duration-300 hover:border-[#8d7043] hover:shadow-lg hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-4">
                    <span className="flex items-center gap-1 text-[0.65rem] text-[#fae8be] uppercase tracking-wider font-semibold">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </span>
                    <p className="text-xs text-white font-medium line-clamp-2 mt-0.5">{item.title}</p>
                    <div className="mt-2 inline-flex items-center gap-1 text-[0.68rem] text-white/90">
                      <Maximize2 className="h-3 w-3" />
                      <span>View Full Photo</span>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between text-[0.68rem] text-muted">
                    <span className="text-[#8d7043] font-semibold">{item.tag || item.category}</span>
                    <span>{item.year}</span>
                  </div>
                  <h4 className="mt-1 text-xs font-medium text-ink line-clamp-1">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Thought Leadership & Connect Callout */}
        <ScrollReveal type="block" className="mt-20">
          <div className="relative overflow-hidden rounded-3xl border border-[#e3dbd1] bg-gradient-to-br from-[#171513] to-[#25221d] p-8 sm:p-12 text-paper shadow-xl">
            <div
              className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-[#8d7043]/20 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs text-[#fae8be] backdrop-blur-md mb-4">
                <HeartHandshake className="h-3.5 w-3.5 text-[#C9A15A]" />
                <span>Dignity-First Standard</span>
              </div>
              <h3 className="display text-2xl sm:text-3xl text-white font-normal leading-snug">
                &ldquo;When you choose to help others up, you help people rise as well.&rdquo;
              </h3>
              <p className="mt-4 text-sm sm:text-base text-mist/85 leading-relaxed font-light">
                All essays, photographs, and media published on this platform reflect direct operational principles—safeguarding personal dignity, advancing grassroots education, and funding cancer patient advocacy.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-[#8d7043] px-6 py-3 text-xs sm:text-sm font-semibold tracking-wider text-paper uppercase transition-all duration-300 hover:bg-white hover:text-ink hover:shadow-lg"
                >
                  <span>Connect with Gilbert</span>
                  <span className="text-xs">&rarr;</span>
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs sm:text-sm font-semibold tracking-wider text-white uppercase transition-all duration-300 hover:border-white hover:bg-white/10"
                >
                  <span>View Projects</span>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>

      {/* Lightbox Modal for Photo Zoom */}
      {activePhotoModal && (
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setActivePhotoModal(null)}
        >
          <div
            className="relative max-w-4xl w-full overflow-hidden rounded-2xl bg-[#171513] border border-white/15 shadow-2xl text-paper"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-white hover:text-black transition-colors"
              aria-label="Close photo"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={activePhotoModal.image}
                alt={activePhotoModal.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 text-xs text-[#fae8be] mb-1">
                <span className="font-semibold uppercase tracking-wider">{activePhotoModal.tag || activePhotoModal.category}</span>
                <span>•</span>
                <span>{activePhotoModal.location}</span>
                <span>•</span>
                <span>{activePhotoModal.year}</span>
              </div>
              <h3 className="text-xl text-white font-serif">{activePhotoModal.title}</h3>
              <p className="mt-2 text-sm text-mist/80 font-light">{activePhotoModal.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
