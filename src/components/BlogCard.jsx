import { ArrowUpRight, Clock, Play, Camera, Tag } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import ImageFrame from './ImageFrame'

export default function BlogCard({ post, layout = 'grid', basePath }) {
  const { pathname } = useLocation()
  const pathPrefix = basePath || (pathname.startsWith('/insights') ? '/insights' : '/blog')
  const detailUrl = `${pathPrefix}/${post.slug}`
  const isVideo = Boolean(post.videoFile || post.video)
  const photoCount = post.gallery ? post.gallery.length : 1

  // 1. Large Spotlight Feature Layout
  if (layout === 'feature') {
    return (
      <article
        data-lift
        data-cursor="view"
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#e3dbd1] bg-gradient-to-b from-[#faf8f4] to-[#f4efe8] shadow-[0_4px_24px_-6px_rgba(20,19,17,0.06)] transition-all duration-500 hover:border-[#C9A15A]/80 hover:shadow-[0_24px_56px_-12px_rgba(141,112,67,0.22)] hover:-translate-y-1.5 sm:rounded-3xl"
      >
        {/* Top Gold Laser Accent Line */}
        <div
          className="pointer-events-none absolute top-0 inset-x-8 h-[2px] scale-x-0 bg-gradient-to-r from-transparent via-[#C9A15A] to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100"
          aria-hidden="true"
        />

        {/* Media Frame */}
        <div className="relative overflow-hidden">
          <ImageFrame
            src={post.image}
            alt={post.imageAlt || post.title}
            shape="flush"
            hoverEffect={false}
            className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {isVideo ? (
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1 text-[0.68rem] font-medium tracking-wider text-white backdrop-blur-md">
              <Play className="h-3 w-3 fill-white text-white" />
              <span>Documentary Film</span>
            </div>
          ) : (
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[0.68rem] font-medium tracking-wider text-white backdrop-blur-md">
              <Camera className="h-3 w-3 text-[#fae8be]" />
              <span>{photoCount} Photos</span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex flex-1 flex-col p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-px w-5 bg-[#C9A15A] transition-all duration-300 group-hover:w-8" />
              <span className="font-sans text-[0.68rem] font-semibold tracking-[0.2em] text-[#8d7043] uppercase">
                {post.category}
              </span>
            </div>
            {post.readTime ? (
              <span className="flex items-center gap-1 text-[0.68rem] text-muted">
                <Clock className="h-3 w-3 text-bronze" />
                {post.readTime}
              </span>
            ) : null}
            {post.date && (
              <>
                <span className="text-[0.68rem] text-muted">•</span>
                <span className="text-[0.68rem] text-muted">{post.date}</span>
              </>
            )}
          </div>

          <h3 className="display mt-3 text-2xl font-normal leading-tight text-ink transition-colors duration-300 sm:text-3xl lg:text-[2.2rem] group-hover:text-[#8d7043]">
            <Link to={detailUrl}>
              {post.title}
            </Link>
          </h3>

          <p className="mt-3.5 flex-1 text-sm leading-relaxed text-muted sm:text-base line-clamp-3">
            {post.excerpt}
          </p>

          {post.tags && post.tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-[#e3dbd1] bg-white/60 px-2 py-0.5 text-[0.68rem] font-medium text-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-6 pt-2">
            <Link
              to={detailUrl}
              className="group/btn relative inline-flex items-center gap-3 rounded-full border border-ink/20 bg-ink px-5 py-2.5 text-xs sm:text-sm font-semibold tracking-wider text-paper uppercase transition-all duration-300 hover:border-[#8d7043] hover:bg-[#8d7043] hover:shadow-[0_8px_20px_-4px_rgba(141,112,67,0.35)]"
            >
              <span className="relative z-10">{isVideo ? 'Watch Film' : 'Read Full Article'}</span>
              <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white transition-all duration-300 group-hover/btn:bg-white group-hover/btn:text-ink group-hover/btn:rotate-45">
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </div>
            </Link>
          </div>
        </div>
      </article>
    )
  }

  // 2. Horizontal Row Layout (for Latest Releases list)
  if (layout === 'row') {
    return (
      <article
        data-lift
        data-cursor="view"
        className="group relative flex flex-col sm:flex-row gap-4 overflow-hidden rounded-2xl border border-[#e3dbd1]/80 bg-gradient-to-b from-[#faf8f4] to-[#f4efe8] p-3.5 transition-all duration-300 hover:border-[#C9A15A]/70 hover:shadow-[0_16px_36px_-8px_rgba(141,112,67,0.16)] hover:-translate-y-1"
      >
        {/* Side Image Frame */}
        <div className="relative w-full sm:w-[150px] lg:w-[170px] shrink-0 overflow-hidden rounded-xl aspect-[16/10] sm:aspect-[4/3]">
          <ImageFrame
            src={post.image}
            alt={post.imageAlt || post.title}
            hoverEffect={false}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute bottom-2 left-2 z-10 rounded bg-black/75 px-2 py-0.5 text-[0.58rem] font-semibold tracking-wider text-[#fae8be] uppercase backdrop-blur-sm flex items-center gap-1">
            {isVideo ? (
              <>
                <Play className="h-2 w-2 fill-[#fae8be] text-[#fae8be]" />
                Film
              </>
            ) : (
              post.category
            )}
          </span>
        </div>

        {/* Content Details */}
        <div className="flex flex-1 flex-col justify-between py-1">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted">
              <span className="text-[#8d7043]">{post.category}</span>
              {post.date && (
                <>
                  <span>•</span>
                  <span>{post.date}</span>
                </>
              )}
              {post.readTime && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <Clock className="h-2.5 w-2.5 text-bronze" />
                    {post.readTime}
                  </span>
                </>
              )}
            </div>

            <h4 className="display mt-1 text-base font-normal leading-snug text-ink transition-colors duration-200 sm:text-lg group-hover:text-[#8d7043] line-clamp-2">
              <Link to={detailUrl} className="transition-colors hover:text-[#8d7043]">
                {post.title}
              </Link>
            </h4>

            <p className="mt-1.5 text-xs leading-relaxed text-muted line-clamp-2">
              {post.excerpt}
            </p>
          </div>

          <Link
            to={detailUrl}
            className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-ink uppercase transition-colors group-hover:text-[#8d7043]"
          >
            <span>{isVideo ? 'Watch film' : 'Read more'}</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </article>
    )
  }

  // 3. Full Vertical Grid Card Layout (Default for "More Articles" section)
  return (
    <article
      data-lift
      data-cursor="view"
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#e3dbd1]/90 bg-gradient-to-b from-[#faf8f4] to-[#f4efe8] shadow-[0_4px_20px_-6px_rgba(20,19,17,0.05)] transition-all duration-400 hover:border-[#C9A15A]/80 hover:shadow-[0_20px_45px_-10px_rgba(141,112,67,0.2)] hover:-translate-y-1.5"
    >
      {/* Top Image Frame */}
      <div className="relative overflow-hidden aspect-[16/10] w-full">
        <ImageFrame
          src={post.image}
          alt={post.imageAlt || post.title}
          hoverEffect={false}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {isVideo ? (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-0.5 text-[0.62rem] font-medium tracking-wider text-white backdrop-blur-md">
            <Play className="h-2.5 w-2.5 fill-white text-white" />
            <span>Film</span>
          </div>
        ) : photoCount > 1 ? (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[0.62rem] font-medium tracking-wider text-white backdrop-blur-md">
            <Camera className="h-2.5 w-2.5 text-[#fae8be]" />
            <span>{photoCount} Photos</span>
          </div>
        ) : null}

        <div className="absolute bottom-3 left-3 z-10">
          <span className="rounded-md bg-black/80 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-wider text-[#fae8be] backdrop-blur-md shadow-sm">
            {post.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-xs text-muted mb-2.5">
            <span className="text-[0.68rem]">{post.date || 'Published'}</span>
            {post.readTime && (
              <span className="flex items-center gap-1 text-[0.68rem] text-muted">
                <Clock className="h-3 w-3 text-bronze" />
                {post.readTime}
              </span>
            )}
          </div>

          {/* Title */}
          <h4 className="display text-xl sm:text-[1.35rem] font-normal leading-snug text-ink transition-colors duration-300 group-hover:text-[#8d7043] line-clamp-2">
            <Link to={detailUrl}>
              {post.title}
            </Link>
          </h4>

          {/* Excerpt */}
          <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted line-clamp-3 font-light">
            {post.excerpt}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-line/60 flex items-center justify-between">
          {post.tags && post.tags.length > 0 ? (
            <span className="text-[0.65rem] font-medium text-muted/80 truncate max-w-[60%]">
              #{post.tags[0]}
            </span>
          ) : (
            <span />
          )}

          <Link
            to={detailUrl}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink transition-colors group-hover:text-[#8d7043]"
          >
            <span>{isVideo ? 'Watch film' : 'Read more'}</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}
