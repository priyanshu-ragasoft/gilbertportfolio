import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, Calendar, Tag, ArrowUpRight, Share2, Compass, HeartHandshake } from 'lucide-react'
import Container from '../components/Container'
import ImageFrame from '../components/ImageFrame'
import VideoPlayer from '../components/VideoPlayer'
import PageMeta from '../components/PageMeta'
import ScrollReveal from '../components/ScrollReveal'
import BlogCard from '../components/BlogCard'
import { posts as defaultPosts } from '../data/blog'
import { profile } from '../data/profile'
import { blogAPI } from '../services/api'
import { resolveAsset } from '../utils/resolveAsset'

export default function InsightDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const basePath = pathname.startsWith('/insights') ? '/insights' : '/blog'
  const isBlog = basePath === '/blog'

  const [allPosts, setAllPosts] = useState(defaultPosts)

  useEffect(() => {
    const fetchLatest = async () => {
      let apiPosts = []
      try {
        const res = await blogAPI.getBlogs()
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          apiPosts = res.data
        }
      } catch (e) {
        console.warn('Backend fetch notice:', e.message)
      }

      let localBlogs = []
      try {
        localBlogs = JSON.parse(localStorage.getItem('gilbert_cached_blogs') || '[]')
      } catch (e) {
        localBlogs = []
      }

      const mergedMap = new Map()
      defaultPosts.forEach((p) => mergedMap.set(p.slug || p._id, p))
      localBlogs.forEach((p) => {
        if (p && (p.slug || p._id)) mergedMap.set(p.slug || p._id, p)
      })
      apiPosts.forEach((p) => {
        if (p && (p.slug || p._id)) mergedMap.set(p.slug || p._id, p)
      })

      setAllPosts(Array.from(mergedMap.values()))
    }
    fetchLatest()
  }, [slug])

  const rawPost = allPosts.find((item) => item.slug === slug)
  const relatedPosts = allPosts
    .filter((item) => item.slug !== slug)
    .slice(0, 2)
    .map((p) => ({
      ...p,
      image: resolveAsset(p.image),
    }))

  const post = rawPost
    ? {
        ...rawPost,
        image: resolveAsset(rawPost.image),
        gallery: Array.isArray(rawPost.gallery)
          ? rawPost.gallery.map((g) => ({
              ...g,
              src: resolveAsset(g.src),
            }))
          : [],
      }
    : null

  if (!post) {
    return (
      <Container data-scene="missing" className="py-40 text-center">
        <h1 data-missing="title" className="display text-4xl sm:text-5xl text-ink">
          Article Not Found
        </h1>
        <p className="mt-4 text-muted">The requested article could not be located in the published archives.</p>
        <Link
          data-missing="link"
          to={basePath}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-xs font-semibold text-paper hover:bg-[#8d7043] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {isBlog ? 'Blog' : 'Insights'}
        </Link>
      </Container>
    )
  }

  return (
    <>
      <PageMeta
        title={`${post.title} — Gilbert Kevin Jimmy Kwizera`}
        description={post.excerpt}
      />
      <article data-scene="detail" className="bg-paper pt-32 pb-24 md:pt-40 md:pb-32">
        <Container className="max-w-4xl">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between border-b border-line/60 pb-6 mb-8">
            <Link
              to={basePath}
              className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted hover:text-[#8d7043] transition-colors"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to {isBlog ? 'All Blog Posts' : 'All Insights'}</span>
            </Link>

            <span className="rounded-full border border-line bg-white/80 px-3 py-1 text-[0.68rem] font-medium text-muted uppercase tracking-wider">
              {post.category}
            </span>
          </div>

          {/* Article Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1.5 font-medium text-[#8d7043]">
                <Calendar className="h-3.5 w-3.5" />
                {post.date}
              </span>
              {post.readTime && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-bronze" />
                    {post.readTime}
                  </span>
                </>
              )}
              {post.author && (
                <>
                  <span>•</span>
                  <span className="font-light">By {post.author}</span>
                </>
              )}
            </div>

            <ScrollReveal type="text" as="h1" data-detail="title" className="display text-3xl font-normal leading-tight text-ink sm:text-5xl lg:text-5xl">
              {post.title}
            </ScrollReveal>

            <p className="text-base sm:text-lg text-muted/90 font-serif italic leading-relaxed border-l-2 border-[#8d7043] pl-4 py-1">
              &ldquo;{post.excerpt}&rdquo;
            </p>
          </div>

          {/* Media Player or Main Image */}
          <div className="mt-10 overflow-hidden rounded-2xl sm:rounded-3xl border border-line shadow-md">
            {post.videoFile ? (
              <VideoPlayer
                src={post.videoFile}
                poster={post.image}
                title={post.title}
                onClose={() => navigate(basePath)}
                className="aspect-[16/10] sm:aspect-video w-full"
              />
            ) : (
              <ImageFrame src={post.image} alt={post.imageAlt} className="aspect-[16/10] w-full object-cover" priority />
            )}
          </div>

          {/* Article Body Content */}
          <ScrollReveal type="block" stagger={0.08} className="mt-10 space-y-6 text-base leading-relaxed text-ink/85 sm:text-lg">
            {post.paragraphs.map((paragraph, idx) => (
              <p data-detail="body" key={idx} className="leading-[1.8] font-light">
                {paragraph}
              </p>
            ))}
          </ScrollReveal>

          {/* Dedicated Post Photo Gallery */}
          {post.gallery && post.gallery.length > 0 && (
            <div className="mt-12 rounded-2xl border border-line bg-ivory p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8d7043] mb-4">
                <Tag className="h-3.5 w-3.5" />
                <span>Field Documentation &amp; Photo Gallery ({post.gallery.length} Images)</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {post.gallery.map((photo, pIdx) => (
                  <div key={pIdx} className="group overflow-hidden rounded-xl border border-line/80 bg-paper shadow-sm">
                    <div className="aspect-[4/3] w-full overflow-hidden">
                      <img
                        src={photo.src}
                        alt={photo.caption}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    {photo.caption && (
                      <p className="p-3 text-xs text-muted leading-relaxed font-light">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video external watch link if available */}
          {post.video ? (
            <div className="mt-8 rounded-2xl border border-line bg-ivory p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8d7043]">Recorded Archive</p>
                <p className="text-sm text-ink font-medium">Watch the original documentary recording on YouTube</p>
              </div>
              <a
                href={post.video}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2 text-xs font-semibold text-paper hover:bg-[#8d7043] transition-colors shrink-0"
              >
                <span>Open YouTube Film</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          ) : null}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-line/60 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5 mr-2">
                <Tag className="h-3.5 w-3.5 text-[#8d7043]" />
                Topic Tags:
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-line bg-white/60 px-3 py-1 text-xs text-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Author Quote / Dignity Standard Footer */}
          <div className="mt-12 rounded-2xl border border-line/80 bg-ivory p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-[#8d7043]/15 flex items-center justify-center text-[#8d7043] shrink-0 font-serif font-bold text-lg">
                GK
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-lg text-ink font-semibold">{profile.name}</h4>
                <p className="text-xs text-muted uppercase tracking-wider">{profile.title}</p>
                <p className="text-sm text-muted mt-2 font-light leading-relaxed">
                  Publications and essays documenting active initiatives in oncology patient welfare, youth scholastic access, and blockchain technology systems.
                </p>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-line/60">
              <div className="flex items-center justify-between mb-8">
                <h3 className="display text-2xl text-ink font-normal">Related Publications</h3>
                <Link
                  to={basePath}
                  className="text-xs font-semibold uppercase tracking-wider text-[#8d7043] hover:underline"
                >
                  View All &rarr;
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {relatedPosts.map((related) => (
                  <BlogCard key={related.slug} post={related} layout="row" basePath={basePath} />
                ))}
              </div>
            </div>
          )}

          {/* Bottom Back Button */}
          <div className="mt-14 text-center">
            <Link
              to={basePath}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-paper hover:bg-[#8d7043] hover:shadow-lg transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to {isBlog ? 'Blog Archive' : 'Insights Archive'}</span>
            </Link>
          </div>
        </Container>
      </article>
    </>
  )
}
