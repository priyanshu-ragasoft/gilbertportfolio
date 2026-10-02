import { useRef, useEffect } from 'react'
import { gsap, prefersReducedMotion } from '../animations/gsapConfig'
import { profile } from '../data/profile'

export default function AboutPortrait3D({
  className = '',
  image,
  badgeTopText = 'EST. 1971',
  badgeSubText = 'Kampala · Dubai',
}) {
  const containerRef = useRef(null)
  const cardRef = useRef(null)
  const glareRef = useRef(null)
  const badgeRef = useRef(null)
  const portraitSrc = image || profile.portrait || '/src/assets/images/gilbert-kwizera-lounge-armchair.jpg'

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const container = containerRef.current
    const card = cardRef.current
    const glare = glareRef.current
    const badge = badgeRef.current
    if (!container || !card) return undefined

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      gsap.to(card, {
        rotateY: x * 16,
        rotateX: -y * 16,
        scale: 1.025,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 1100,
        transformOrigin: 'center center',
      })

      if (glare) {
        gsap.to(glare, {
          x: (x + 0.5) * 100 + '%',
          y: (y + 0.5) * 100 + '%',
          opacity: 0.35,
          duration: 0.4,
          ease: 'power2.out',
        })
      }

      if (badge) {
        gsap.to(badge, {
          x: x * 18,
          y: y * 18,
          duration: 0.5,
          ease: 'power2.out',
        })
      }
    }

    const onPointerLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.9,
        ease: 'elastic.out(1, 0.45)',
      })

      if (glare) {
        gsap.to(glare, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        })
      }

      if (badge) {
        gsap.to(badge, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        })
      }
    }

    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerleave', onPointerLeave)

    return () => {
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`group relative mx-auto max-w-[420px] cursor-pointer select-none py-6 ${className}`}
      style={{ perspective: '1200px' }}
      data-cursor="view"
      data-sr-ignore
    >
      {/* 3D Atmospheric ambient glow behind portrait */}
      <div
        className="pointer-events-none absolute -inset-6 rounded-t-[190px] sm:rounded-t-[230px] rounded-b-[40px] opacity-40 blur-3xl transition-opacity duration-700 group-hover:opacity-75"
        style={{
          background: 'radial-gradient(ellipse at 50% 35%, rgba(201,161,90,0.32), transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Floating outer architectural gold hairline frame */}
      <div
        className="pointer-events-none absolute -inset-3 rounded-t-[184px] sm:rounded-t-[224px] rounded-b-[38px] border border-[#C9A15A]/35 transition-transform duration-500 ease-out group-hover:scale-[1.025] group-hover:border-[#C9A15A]/60"
        aria-hidden="true"
      />

      {/* Main 3D Card with Architectural Arch Silhouette */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-t-[170px] sm:rounded-t-[210px] rounded-b-[28px] border border-white/20 bg-[#121110] shadow-[0_30px_70px_-15px_rgba(20,19,17,0.35)] will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Top-left numeral seal */}
        <div
          style={{ transform: 'translateZ(26px)' }}
          className="absolute top-5 left-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#0D0D0C]/80 font-sans text-[0.62rem] font-medium tracking-[0.14em] text-[#C9A15A] backdrop-blur-md shadow-md"
        >
          01
        </div>

        {/* Portrait Image with B&W to Full Color bloom on hover */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0D0D0C]">
          <img
            src={portraitSrc}
            alt="Portrait of Gilbert Kevin Jimmy Kwizera"
            decoding="async"
            fetchPriority="high"
            className="h-full w-full object-cover object-[center_8%] grayscale-[30%] contrast-[1.03] transition-all duration-700 ease-out group-hover:scale-106 group-hover:grayscale-0 group-hover:contrast-105"
          />

          {/* Vignette & depth lighting */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D0D0C]/90 via-[#0D0D0C]/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-30" />

          {/* Interactive Specular Glare */}
          <div
            ref={glareRef}
            className="pointer-events-none absolute -top-1/2 -left-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(201,161,90,0.18) 40%, transparent 68%)',
            }}
            aria-hidden="true"
          />
        </div>

        {/* Floating 3D Badge on bottom right */}
        <div
          ref={badgeRef}
          style={{ transform: 'translateZ(36px)' }}
          className="absolute right-4 bottom-4 z-20 flex items-center gap-3 border border-[#C9A15A]/60 bg-[#0D0D0C]/92 px-4 py-2.5 shadow-[0_16px_36px_-10px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-300 group-hover:border-[#C9A15A]"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A15A] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C9A15A]" />
          </span>
          <div>
            <p className="text-[0.6rem] font-medium tracking-[0.24em] text-[#C9A15A] uppercase">{badgeTopText || 'EST. 1971'}</p>
            <p className="font-serif text-xs font-medium text-paper">{badgeSubText || 'Kampala · Dubai'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
