import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Container from '../components/Container'
import ScrollReveal from '../components/ScrollReveal'
import {
  introduction as defaultIntroParagraphs,
  introductionFacts as defaultIntroFacts,
  introductionPillars as defaultIntroPillars,
  profile,
} from '../data/profile'
import { introAPI } from '../services/api'
import { resolveAsset } from '../utils/resolveAsset'

const DEFAULT_INTRO_DATA = {
  indexNumber: '01',
  kicker: 'Introduction',
  titleLine1: 'A Life Dedicated to',
  titleLine2: 'Service, Dignity, and Hope.',
  role: profile.title || 'Humanitarian leader, international consultant, and volunteer',
  paragraphs: defaultIntroParagraphs,
  profileLinkText: 'Read the full profile',
  profileLinkUrl: '/about',
  shutterBadge: 'Hover to reveal',
  shutterTag: 'A working standard',
  shutterHeading: 'Charity is treated as a duty, not a performance.',
  shutterDescription:
    'Show up, use resources carefully, and leave a person’s dignity intact. The work is meant to continue when no one is watching.',
  shutterImage: profile.office,
  shutterOriginLabel: 'Origin',
  shutterOriginValue: 'Kampala, Uganda',
  shutterNowLabel: 'Now',
  shutterNowValue: 'Jumeirah, Dubai',
  facts: defaultIntroFacts,
  pillars: defaultIntroPillars,
}

export default function Introduction() {
  const [plateOpen, setPlateOpen] = useState(false)
  const [data, setData] = useState(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem('gilbert_cached_intro') : null
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        return { ...DEFAULT_INTRO_DATA, ...parsed }
      } catch (e) {}
    }
    return DEFAULT_INTRO_DATA
  })

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e?.detail) {
        setData((prev) => ({ ...prev, ...e.detail }))
      }
    }

    window.addEventListener('gilbert_intro_updated', handleUpdate)

    const fetchLiveIntro = async () => {
      try {
        const res = await introAPI.getIntro()
        if (res.success && res.data) {
          setData((prev) => ({
            ...DEFAULT_INTRO_DATA,
            ...res.data,
          }))
          localStorage.setItem('gilbert_cached_intro', JSON.stringify(res.data))
        }
      } catch (err) {
        // Keep cached state
      }
    }

    fetchLiveIntro()

    return () => {
      window.removeEventListener('gilbert_intro_updated', handleUpdate)
    }
  }, [])

  return (
    <section id="intro" data-scene="intro" data-hero-next className="bg-paper py-20 md:py-32">
      <Container>
        <div className="flex items-end justify-between border-b border-line pb-5">
          <p
            data-intro-kicker
            className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-muted"
          >
            <span className="h-px w-8 bg-bronze" aria-hidden="true" />
            {data.kicker || 'Introduction'}
          </p>
          <p data-intro-index className="text-xs font-medium tracking-[0.2em] text-bronze">
            {data.indexNumber || '01'}
          </p>
        </div>

        <div className="mt-10 grid items-end gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <ScrollReveal
              type="text"
              as="h2"
              data-intro-title
              className="display text-[2.6rem] leading-[0.92] text-ink sm:text-6xl lg:text-[4.6rem]"
            >
              {data.titleLine1 || 'A Life Dedicated to'}
              <span className="mt-2 block italic">{data.titleLine2 || 'Service, Dignity, and Hope.'}</span>
            </ScrollReveal>
          </div>
          <p data-intro-role className="max-w-sm text-sm leading-relaxed text-muted lg:col-span-4">
            {data.role || profile.title}
          </p>
        </div>

        <div className="mt-14 grid items-start gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-16">
          <ScrollReveal type="block" stagger={0.1} data-intro-copy className="space-y-5 lg:col-span-6">
            {(data.paragraphs?.length ? data.paragraphs : defaultIntroParagraphs).map((paragraph, index) => (
              <p
                key={`${paragraph.slice(0, 20)}-${index}`}
                className={
                  index === 0
                    ? 'text-lg leading-relaxed text-ink'
                    : 'text-base leading-relaxed text-muted'
                }
              >
                {paragraph}
              </p>
            ))}
            <Link
              to={data.profileLinkUrl || '/about'}
              data-intro-link
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-bronze"
            >
              {data.profileLinkText || 'Read the full profile'}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </ScrollReveal>

          <aside className="lg:col-span-5 lg:col-start-8">
            <div
              className="relative mx-auto w-full max-w-[380px]"
              onMouseEnter={() => setPlateOpen(true)}
              onMouseLeave={() => setPlateOpen(false)}
            >
              <div
                className="pointer-events-none absolute -inset-2 rounded-[2rem] border border-[#C9A15A]/40"
                aria-hidden="true"
              />
              <div
                data-intro-plate
                className="group relative aspect-[4/5] cursor-pointer select-none overflow-hidden rounded-[1.65rem] border border-white/10 bg-ink text-paper shadow-[0_24px_50px_-28px_rgba(20,19,17,0.55)] transition-shadow duration-500 hover:shadow-[0_28px_60px_-24px_rgba(20,19,17,0.7)]"
              >
                {/* Full-color portrait revealed on hover */}
                <img
                  src={resolveAsset(data.shutterImage || profile.office)}
                  alt="Gilbert Kwizera"
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_18%] transition-all duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] ${plateOpen ? 'scale-105 opacity-100' : 'scale-100 opacity-0'}`}
                />

                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 z-[2] h-1/2 border-b border-[#C9A15A]/25 bg-ink transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.2,1)] ${plateOpen ? '-translate-y-full' : ''}`}
                  aria-hidden="true"
                />
                <div
                  className={`pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-1/2 border-t border-[#C9A15A]/25 bg-ink transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.2,1)] ${plateOpen ? 'translate-y-full' : ''}`}
                  aria-hidden="true"
                />

                <div className={`pointer-events-none absolute top-5 right-5 z-20 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[10px] tracking-wider text-mist/80 uppercase backdrop-blur-md transition-all duration-500 ${plateOpen ? 'scale-90 opacity-0' : ''}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C9A15A] animate-pulse" />
                  <span>{data.shutterBadge || 'Hover to reveal'}</span>
                </div>

                {/* Editorial Text Content (Smoothly wipes / fades out like a shutter on hover) */}
                <div className={`absolute inset-x-0 bottom-0 z-10 px-6 pt-16 pb-6 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] sm:px-7 sm:pb-7 ${plateOpen ? 'translate-y-3 opacity-0' : ''}`}>
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-[#C9A15A]">
                    {data.shutterTag || 'A working standard'}
                  </p>
                  <p className="display mt-5 text-3xl leading-[1.05] sm:text-4xl">
                    {data.shutterHeading || 'Charity is treated as a duty, not a performance.'}
                  </p>
                  <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/75">
                    {data.shutterDescription || 'Show up, use resources carefully, and leave a person’s dignity intact. The work is meant to continue when no one is watching.'}
                  </p>
                  <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/15 pt-6">
                    <div>
                      <dt className="text-[0.62rem] uppercase tracking-[0.18em] text-paper/50">
                        {data.shutterOriginLabel || 'Origin'}
                      </dt>
                      <dd className="mt-1 text-sm text-paper">{data.shutterOriginValue || 'Kampala, Uganda'}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.62rem] uppercase tracking-[0.18em] text-paper/50">
                        {data.shutterNowLabel || 'Now'}
                      </dt>
                      <dd className="mt-1 text-sm text-paper">{data.shutterNowValue || 'Jumeirah, Dubai'}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <ScrollReveal
          type="block"
          stagger={0.08}
          as="dl"
          data-intro-facts
          className="mt-16 grid gap-6 border-y border-line py-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {(data.facts?.length ? data.facts : defaultIntroFacts).map((fact, fIdx) => (
            <div key={`${fact.label}-${fIdx}`} data-intro-fact>
              <dt className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-bronze">
                {fact.label}
              </dt>
              <dd className="mt-2 text-base text-ink sm:text-lg">{fact.value}</dd>
            </div>
          ))}
        </ScrollReveal>

        <ScrollReveal
          type="block"
          stagger={0.1}
          data-intro-pillars
          className="mt-16 grid gap-px border border-line bg-line md:grid-cols-3"
        >
          {(data.pillars?.length ? data.pillars : defaultIntroPillars).map((pillar, pIdx) => (
            <article
              key={`${pillar.number}-${pIdx}`}
              data-intro-pillar
              className="group bg-paper p-6 transition-colors duration-300 hover:bg-ivory sm:p-8"
            >
              <p className="text-[0.65rem] tracking-[0.18em] text-bronze">{pillar.number}</p>
              <h3 className="display mt-4 text-3xl text-ink sm:text-4xl">{pillar.title}</h3>
              <p className="mt-2 text-sm font-medium text-ink">{pillar.organization}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted">{pillar.text}</p>
              <Link
                to={pillar.to || '/about'}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors group-hover:text-bronze"
              >
                Explore
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </article>
          ))}
        </ScrollReveal>
      </Container>
    </section>
  )
}
