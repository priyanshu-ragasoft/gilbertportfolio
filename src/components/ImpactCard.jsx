import { useRef } from 'react'
import { ArrowUpRight, Sparkles, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { gsap, prefersReducedMotion } from '../animations/gsapConfig'
import ImageFrame from './ImageFrame'
import { profile } from '../data/profile'

function canTilt() {
  return (
    !prefersReducedMotion() &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  )
}

export default function ImpactCard({ area, featured = false }) {
  const faceRef = useRef(null)
  const edgeRef = useRef(null)

  const handleMouseMove = (event) => {
    const face = faceRef.current
    if (!face || !canTilt()) return

    const rect = face.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5

    gsap.to(face, {
      rotateY: px * 12,
      rotateX: py * -8,
      y: -6,
      duration: 0.45,
      ease: 'power2.out',
      overwrite: 'auto',
    })

    const edge = edgeRef.current
    if (!edge) return
    const angle = Math.atan2(py, px) * (180 / Math.PI) + 90
    edge.style.opacity = '1'
    edge.style.background = `linear-gradient(${angle}deg, transparent 55%, rgba(141, 112, 67, 0.55))`
  }

  const handleMouseLeave = () => {
    const face = faceRef.current
    if (edgeRef.current) edgeRef.current.style.opacity = '0'
    if (!face || !canTilt()) return
    gsap.to(face, {
      rotateX: 0,
      rotateY: 0,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }

  return (
    <article
      data-lift
      data-card-3d
      data-cursor="view"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group h-full ${featured ? 'lg:min-h-[36rem]' : ''}`}
      style={{ perspective: '1200px' }}
    >
      <div
        ref={faceRef}
        data-card-face
        className="relative flex h-full min-h-full flex-col rounded-2xl border border-line bg-gradient-to-b from-[#faf8f4] to-[#f4efe8] p-2.5 transition-[border-color,box-shadow] duration-500 ease-out hover:border-bronze/40 hover:shadow-[0_22px_36px_-28px_rgba(20,19,17,0.55),0_14px_24px_-20px_rgba(141,112,67,0.28)] sm:rounded-3xl sm:p-3.5"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          ref={edgeRef}
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 sm:rounded-3xl"
          style={{
            padding: '1px',
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            maskComposite: 'exclude',
          }}
          aria-hidden="true"
        />

      <div
        className="relative overflow-hidden rounded-xl sm:rounded-2xl"
        style={{ transform: 'translateZ(12px)' }}
      >
        <ImageFrame
          src={area.image}
          fallback={profile.storyImage}
          alt={area.imageAlt || area.title}
          fit={area.imageFit || 'cover'}
          trim={area.imageTrim}
          parallax={area.imageFit !== 'contain'}
          position={area.imageFit === 'contain' ? 'center' : undefined}
          className={`${area.imageFit === 'contain' ? 'bg-transparent' : featured ? 'aspect-[16/10] lg:aspect-[16/11]' : 'aspect-[16/10]'} w-full`}
        />

        {/* Dark Vignette Overlay for Crisp Contrast */}
        <div
          className={`pointer-events-none absolute inset-0 ${area.imageFit === 'contain' ? 'bg-gradient-to-t from-black/25 via-transparent to-black/10' : 'bg-gradient-to-t from-black/75 via-black/20 to-black/35'}`}
          aria-hidden="true"
        />

        {/* Top-Left: Floating Glass Status Badge */}
        <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10 flex items-center gap-1.5 rounded-full border border-white/25 bg-black/60 px-2.5 py-1 sm:px-3 sm:py-1 backdrop-blur-md shadow-md transition-transform duration-300 group-hover:scale-105">
          <span className="relative flex h-2 w-2 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A15A] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C9A15A]" />
          </span>
          <span className="font-sans text-[0.58rem] sm:text-[0.66rem] font-semibold tracking-wider text-[#fae8be] uppercase">
            {area.organization}
          </span>
        </div>

        {/* Top-Right: Luxury Floating Number Medallion */}
        <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/30 bg-black/60 backdrop-blur-md shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:border-[#C9A15A] group-hover:bg-[#141311]">
          <span className="font-serif text-xs sm:text-sm font-semibold tracking-wider text-[#fae8be] group-hover:text-[#C9A15A] transition-colors">
            {area.number}
          </span>
        </div>

        {/* Bottom Banner Tag on Image */}
       
      </div>

      {/* 4. Card Content Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-6 lg:p-7">
        {/* Eyebrow Label */}
        <div className="flex items-center gap-2">
          <span className="h-px w-4 bg-[#8d7043] transition-all duration-300 group-hover:w-7 group-hover:bg-[#C9A15A]" />
          <span className="font-sans text-[0.64rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#8d7043] transition-colors group-hover:text-[#C9A15A]">
            Humanitarian Pillar
          </span>
        </div>

        {/* Title */}
        <h3 className="display mt-2 text-2xl font-normal text-[#141311] transition-colors duration-300 sm:text-3xl lg:text-[2.2rem] group-hover:text-[#8d7043]">
          {area.title}
        </h3>

        {/* Organization Tag */}
        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#8d7043]/20 bg-[#8d7043]/10 px-3 py-1 text-xs font-medium text-[#655f57] w-fit">
          <CheckCircle2 className="h-3 w-3 text-[#8d7043]" />
          <span>{area.organization}</span>
        </div>

        {/* Summary Description */}
        <p className="mt-3.5 flex-1 text-sm leading-relaxed text-[#4e4943] sm:text-base">
          {area.summary}
        </p>

        {/* Key Highlights / Pillars from Data */}
        {area.points && area.points.length > 0 && (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-line/60 pt-4">
            {area.points.slice(0, 2).map((point) => (
              <div
                key={point.title}
                className="flex items-center gap-2 rounded-lg bg-white/40 px-2.5 py-1.5 border border-line/40 transition-colors group-hover:bg-white/70"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#C9A15A] shrink-0" />
                <span className="text-xs font-medium text-[#141311] truncate">{point.title}</span>
              </div>
            ))}
          </div>
        )}

        {/* 5. Interactive Action Pill Button */}
        <div className="mt-6 pt-2">
          <Link
            to={`/impact/${area.slug}`}
            className="group/btn relative inline-flex w-full items-center justify-between rounded-full border border-bronze/40 bg-bronze px-5 py-3 text-xs font-semibold tracking-wider text-void uppercase transition-all duration-300 hover:bg-cream sm:text-sm"
          >
            <span className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1">
              Explore Initiative
            </span>
            <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white transition-all duration-300 group-hover/btn:bg-white group-hover/btn:text-[#141311] group-hover/btn:rotate-45">
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" aria-hidden="true" />
            </div>
          </Link>
        </div>
      </div>
      </div>
    </article>
  )
}
