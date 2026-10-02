import { useRef, useState, useEffect, useMemo } from 'react'
import { ArrowDown } from 'lucide-react'
import HeroDust from '../components/HeroDust'
import FragmentedHeroImage from '../components/FragmentedHeroImage'
import FragmentedText from '../components/FragmentedText'
import Button from '../components/Button'
import { prefersReducedMotion } from '../animations/gsapConfig'
import { profile } from '../data/profile'
import { useHeroScrollAnimation } from '../hooks/useHeroScrollAnimation'
import { bannerAPI } from '../services/api'

const DEFAULT_LINES = ['Turning Purpose', 'Into Meaningful', 'Impact.']
const DEFAULT_HERO_IMAGES = [
  profile.hero,
  profile.portrait,
  profile.office,
]

export default function Hero() {
  const heroRef = useRef(null)
  const [compact, setCompact] = useState(false)
  const motion = !prefersReducedMotion()

  const [activeSlide, setActiveSlide] = useState(0)

  // Dynamic banner state with fallback to defaults
  const [banner, setBanner] = useState(() => {
    const cached = typeof window !== 'undefined' ? (localStorage.getItem('gilbert_cached_banner') || localStorage.getItem('krinova_cached_banner')) : null
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        const cachedImgs = parsed.images?.length > 0 ? parsed.images : (parsed.image ? [parsed.image] : DEFAULT_HERO_IMAGES)
        return {
          kicker: parsed.kicker || 'HUMANITARIAN • CONSULTANT • SOCIAL IMPACT',
          heading: parsed.heading || 'Turning Purpose Into Meaningful Impact.',
          lines: parsed.lines?.length ? parsed.lines : DEFAULT_LINES,
          description: parsed.description || '',
          primaryButtonText: parsed.primaryButtonText || 'Explore My Journey',
          primaryButtonLink: parsed.primaryButtonLink || '/#journey',
          secondaryButtonText: parsed.secondaryButtonText || "Let's Connect",
          secondaryButtonLink: parsed.secondaryButtonLink || '/contact',
          image: cachedImgs[0],
          images: cachedImgs,
          autoSlideInterval: parsed.autoSlideInterval || 5000,
        }
      } catch (e) {}
    }
    return {
      kicker: 'HUMANITARIAN • CONSULTANT • SOCIAL IMPACT',
      heading: 'Turning Purpose Into Meaningful Impact.',
      lines: DEFAULT_LINES,
      description:
        'Gilbert Kevin Jimmy Kwizera builds practical support for people at their most vulnerable — in cancer care, recovery, education, and the quiet work of protecting dignity.',
      primaryButtonText: 'Explore My Journey',
      primaryButtonLink: '/#journey',
      secondaryButtonText: "Let's Connect",
      secondaryButtonLink: '/contact',
      image: profile.hero,
      images: DEFAULT_HERO_IMAGES,
      autoSlideInterval: 5000,
    }
  })

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const sync = () => setCompact(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  // Auto-slide transition for multi-image banner
  const bannerImages = useMemo(() => {
    if (Array.isArray(banner.images) && banner.images.length > 0) {
      return banner.images.filter(Boolean)
    }
    if (banner.image) {
      return [banner.image]
    }
    return DEFAULT_HERO_IMAGES
  }, [banner.images, banner.image])

  useEffect(() => {
    if (bannerImages.length <= 1) return undefined
    const duration = Number(banner.autoSlideInterval) || 5000
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % bannerImages.length)
    }, duration)
    return () => clearInterval(timer)
  }, [bannerImages, banner.autoSlideInterval])

  // Fetch dynamic banner from backend & listen for live admin updates
  useEffect(() => {
    const handleUpdateEvent = (e) => {
      if (e?.detail) {
        const liveData = e.detail
        const imgs = liveData.images?.length ? liveData.images : (liveData.image ? [liveData.image] : DEFAULT_HERO_IMAGES)
        setBanner({
          kicker: liveData.kicker || 'HUMANITARIAN • CONSULTANT • SOCIAL IMPACT',
          heading: liveData.heading || 'Turning Purpose Into Meaningful Impact.',
          lines: liveData.lines?.length ? liveData.lines : DEFAULT_LINES,
          description: liveData.description || '',
          primaryButtonText: liveData.primaryButtonText || 'Explore My Journey',
          primaryButtonLink: liveData.primaryButtonLink || '/#journey',
          secondaryButtonText: liveData.secondaryButtonText || "Let's Connect",
          secondaryButtonLink: liveData.secondaryButtonLink || '/contact',
          image: imgs[0],
          images: imgs,
          autoSlideInterval: liveData.autoSlideInterval || 5000,
        })
        setActiveSlide(0)
      }
    }

    window.addEventListener('gilbert_banner_updated', handleUpdateEvent)

    const fetchLiveBanner = async () => {
      try {
        const res = await bannerAPI.getBanner()
        if (res.success && res.data) {
          const liveData = res.data
          const imgs = liveData.images?.length ? liveData.images : (liveData.image ? [liveData.image] : DEFAULT_HERO_IMAGES)

          const updated = {
            kicker: liveData.kicker || 'HUMANITARIAN • CONSULTANT • SOCIAL IMPACT',
            heading: liveData.heading || 'Turning Purpose Into Meaningful Impact.',
            lines: liveData.lines?.length ? liveData.lines : DEFAULT_LINES,
            description: liveData.description || '',
            primaryButtonText: liveData.primaryButtonText || 'Explore My Journey',
            primaryButtonLink: liveData.primaryButtonLink || '/#journey',
            secondaryButtonText: liveData.secondaryButtonText || "Let's Connect",
            secondaryButtonLink: liveData.secondaryButtonLink || '/contact',
            image: imgs[0],
            images: imgs,
            autoSlideInterval: liveData.autoSlideInterval || 5000,
          }
          setBanner(updated)
          localStorage.setItem('gilbert_cached_banner', JSON.stringify(updated))
        }
      } catch (err) {
        // Keep cached state
      }
    }

    fetchLiveBanner()

    return () => {
      window.removeEventListener('gilbert_banner_updated', handleUpdateEvent)
    }
  }, [])

  const activeLines = banner.lines?.length ? banner.lines : DEFAULT_LINES
  const heroImageSrc = bannerImages[0] || profile.hero

  useHeroScrollAnimation(heroRef, [compact])

  return (
    <section ref={heroRef} data-hero className="pointer-events-none relative z-20 bg-transparent text-paper">
      <div data-hero-stage className="relative min-h-[100svh] overflow-hidden bg-transparent">
        <div data-hero-frame className="absolute inset-x-0 -top-[2%] h-[106%]">
          <div data-hero-parallax="deep" className="absolute inset-0 h-full w-full will-change-transform">
            <img
              data-hero-image
              src={bannerImages[activeSlide] || profile.hero}
              alt="Portrait of Gilbert Kevin Jimmy Kwizera"
              className="relative z-[1] h-full w-full object-cover object-[center_8%] sm:object-[66%_14%] transition-all duration-700 ease-in-out"
              fetchPriority="high"
              decoding="async"
            />
            {motion ? (
              <FragmentedHeroImage
                src={bannerImages[activeSlide] || profile.hero}
                cols={compact ? 4 : 7}
                rows={compact ? 4 : 5}
                compact={compact}
                objectPosition={compact ? 'center 8%' : '66% 14%'}
              />
            ) : null}
          </div>
        </div>
        <div data-hero-scrim className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25 sm:bg-gradient-to-r sm:from-ink sm:via-ink/80 sm:to-ink/15" />
        <div data-hero-veil className="pointer-events-none absolute inset-0 bg-ink opacity-0" />
        <div data-hero-overlay className="pointer-events-none absolute inset-0 bg-black/10" aria-hidden="true" />
        <div
          data-hero-bloom
          className="pointer-events-none absolute left-[18%] top-[12%] z-[2] h-[55%] w-[42%] rounded-full bg-[#C9A15A]/25 blur-3xl sm:left-[38%] sm:top-[8%] sm:h-[62%] sm:w-[34%]"
          aria-hidden="true"
        />
        <div
          data-hero-sweep
          className="pointer-events-none absolute inset-y-0 left-0 z-[3] w-[38%] bg-gradient-to-r from-transparent via-[#f4f0e8]/18 to-transparent mix-blend-screen"
          aria-hidden="true"
        />
        {motion ? <HeroDust compact={compact} /> : null}

        <div
          data-hero-parallax="mid"
          className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1180px] flex-col justify-end px-5 pt-20 pb-12 will-change-transform sm:px-8 sm:pt-24 sm:pb-14 lg:pb-16"
        >
          <p
            data-hero-kicker
            className="max-w-[16rem] text-[0.62rem] font-medium tracking-[0.16em] text-paper/85 sm:max-w-none sm:text-xs sm:tracking-[0.24em]"
          >
            {banner.kicker}
          </p>

          <div data-hero-heading className="relative mt-3 sm:mt-4 max-w-4xl">
            <h1 className="display text-[clamp(2.2rem,5.8vw,5.4rem)] leading-[1.06] text-paper">
              {activeLines.map((line, idx) => (
                <span key={`${line}-${idx}`} className="block overflow-hidden pb-[0.08em]">
                  <span data-hero-line className="block">
                    {line}
                  </span>
                </span>
              ))}
            </h1>
            {motion ? (
              <div
                data-hero-fragments
                className="pointer-events-none absolute inset-0 z-[11]"
                aria-hidden="true"
              >
                {activeLines.map((line, index) => (
                  <FragmentedText
                    key={`${line}-${index}`}
                    text={line}
                    seed={index + 1}
                    compact={compact}
                    cols={compact ? 4 : 8}
                    rows={compact ? 2 : 3}
                    className="display text-[clamp(2.2rem,5.8vw,5.4rem)] text-paper"
                  />
                ))}
              </div>
            ) : null}
          </div>

          <p
            data-hero-parallax="light"
            data-hero-copy
            className="mt-4 sm:mt-5 max-w-xl text-base leading-relaxed text-paper/80 will-change-transform sm:text-lg"
          >
            {banner.description}
          </p>
          <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3.5">
            <span data-hero-action className="pointer-events-auto inline-block">
              <Button to={banner.primaryButtonLink || '/#journey'} variant="light" className="shadow-lg shadow-black/20 font-semibold px-7 py-3.5">
                {banner.primaryButtonText || 'Explore My Journey'}
              </Button>
            </span>
            <span data-hero-action className="pointer-events-auto inline-block">
              <Button to={banner.secondaryButtonLink || '/contact'} variant="ghost" className="text-paper ring-1 ring-paper/50 hover:bg-paper hover:text-ink font-semibold px-7 py-3.5">
                {banner.secondaryButtonText || "Let's Connect"}
              </Button>
            </span>
          </div>
          <div
            data-hero-indicator
            className="mt-8 sm:mt-10 lg:mt-12 flex items-center gap-3 text-xs tracking-[0.2em] text-paper/70"
          >
            <span className="relative block h-12 w-px bg-paper/25" aria-hidden="true">
              <span
                data-hero-progress
                className="absolute inset-0 origin-top bg-paper/80"
                style={{ transform: 'scaleY(0)' }}
              />
            </span>
            <div>
              <p data-hero-progress-label className="font-sans text-[0.62rem] tracking-[0.18em] uppercase">
                Scroll to explore
              </p>
              <ArrowDown className="mt-1 h-4 w-4" aria-hidden="true" />
            </div>
            <span className="sr-only">Scroll</span>
          </div>
        </div>
      </div>
    </section>
  )
}
