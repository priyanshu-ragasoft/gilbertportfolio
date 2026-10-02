import { useRef, useState, useEffect } from 'react'
import { ArrowDown } from 'lucide-react'
import JourneyContent, { JourneyChapterList } from '../components/journey/JourneyContent'
import JourneyTimeline from '../components/journey/JourneyTimeline'
import WorldMap from '../components/journey/WorldMap'
import { prefersReducedMotion } from '../animations/gsapConfig'
import { useJourneyAnimation } from '../hooks/useJourneyAnimation'
import { journeyAPI } from '../services/api'
import { journeyChapters } from '../data/journeyLocations'

const DEFAULT_JOURNEY_DATA = {
  eyebrow: 'Journey',
  title: 'A Journey',
  subtitle: 'Across Borders',
  introText:
    'Kampala, the years of study, a life in the Emirates, and the work that kept returning to Uganda.',
  scrollHintText: 'Scroll to travel',
  chapters: journeyChapters,
}

function Heading({ data }) {
  const eyebrow = data?.eyebrow || 'Journey'
  const title = data?.title || 'A Journey'
  const subtitle = data?.subtitle || 'Across Borders'
  const introText =
    data?.introText ||
    'Kampala, the years of study, a life in the Emirates, and the work that kept returning to Uganda.'

  return (
    <div className="max-w-xl">
      <p className="flex items-center gap-2.5 font-sans text-[0.62rem] sm:text-[0.68rem] tracking-[0.22em] text-[#C9A15A] uppercase">
        <span className="h-px w-6 sm:w-8 bg-[#C9A15A]" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 className="display mt-1 text-2xl leading-[0.96] text-[#f4f0e8] sm:text-4xl lg:text-[3.2rem] xl:text-[3.6rem]">
        {title}
        {subtitle && <span className="block italic">{subtitle}</span>}
      </h2>
      <p className="mt-1.5 max-w-md text-[0.72rem] sm:text-xs leading-relaxed text-[#b7b0a6] line-clamp-2 sm:line-clamp-none">
        {introText}
      </p>
    </div>
  )
}

function JourneyPinned({ data }) {
  const sectionRef = useRef(null)
  useJourneyAnimation(sectionRef)

  const chapters = data?.chapters || journeyChapters
  const scrollHint = data?.scrollHintText || 'Scroll to travel'

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative h-[100svh] min-h-[580px] overflow-hidden bg-[#0D0D0C] text-[#f4f0e8]"
    >
      <div className="mx-auto flex h-full max-w-[1400px] flex-col justify-between px-4 pt-20 pb-3 xs:px-5 xs:pt-22 sm:px-8 sm:pt-24 sm:pb-5 lg:px-12">
        <div className="grid min-h-0 flex-1 grid-cols-1 items-center gap-3 sm:gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Heading + Chapter Cards */}
          <div className="flex flex-col justify-center lg:col-span-6 xl:col-span-5 z-10">
            <Heading data={data} />
            <div className="mt-3 sm:mt-6">
              <JourneyContent chapters={chapters} />
            </div>
          </div>

          {/* Right Column: World Map + Horizontal Timeline underneath */}
          <div className="flex h-full flex-col justify-end pb-1 gap-1.5 sm:gap-2 lg:col-span-6 xl:col-span-7">
            {/* World Map */}
            <div className="relative w-full h-[200px] xs:h-[230px] sm:h-[380px] lg:h-[430px] xl:h-[460px]">
              <WorldMap chapters={chapters} />
            </div>

            {/* Horizontal Timeline right beneath the map */}
            <div className="w-full pt-0.5 sm:pt-1">
              <JourneyTimeline orientation="horizontal" chapters={chapters} />
            </div>
          </div>
        </div>

        {/* Bottom Bar: Scroll Hint */}
        <div className="flex items-center justify-between pt-1 sm:pt-2">
          <p
            data-journey-hint
            className="pointer-events-none flex items-center gap-1.5 sm:gap-2 font-sans text-[0.62rem] sm:text-[0.68rem] tracking-[0.18em] text-[#b7b0a6] uppercase"
          >
            <ArrowDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#C9A15A]" aria-hidden="true" />
            {scrollHint}
          </p>
        </div>
      </div>
    </section>
  )
}

function JourneyStatic({ data }) {
  const chapters = data?.chapters || journeyChapters

  return (
    <section id="journey" className="bg-[#0D0D0C] px-5 py-24 text-[#f4f0e8] sm:px-8">
      <div className="mx-auto max-w-[1240px]">
        <Heading data={data} />
        <div className="mt-10 h-[320px] sm:h-[420px]">
          <WorldMap chapters={chapters} />
        </div>
        <div className="mt-8 max-w-sm">
          <JourneyTimeline orientation="vertical" chapters={chapters} />
        </div>
        <JourneyChapterList chapters={chapters} />
      </div>
    </section>
  )
}

export default function Journey() {
  const [journeyData, setJourneyData] = useState(() => {
    try {
      const cached = localStorage.getItem('gilbert_cached_journey')
      if (cached) return JSON.parse(cached)
    } catch (e) {
      // ignore
    }
    return DEFAULT_JOURNEY_DATA
  })

  useEffect(() => {
    const loadJourney = async () => {
      try {
        const res = await journeyAPI.getJourney()
        if (res.success && res.data) {
          const loadedChapters = Array.isArray(res.data.chapters) && res.data.chapters.length > 0
            ? res.data.chapters.map((ch, idx) => ({
                ...DEFAULT_JOURNEY_DATA.chapters[idx % DEFAULT_JOURNEY_DATA.chapters.length],
                ...ch,
                id: ch.id || `chapter-${idx + 1}`,
                index: String(idx + 1).padStart(2, '0'),
              }))
            : DEFAULT_JOURNEY_DATA.chapters

          const finalData = {
            ...res.data,
            chapters: loadedChapters,
          }
          setJourneyData(finalData)
          localStorage.setItem('gilbert_cached_journey', JSON.stringify(finalData))
        }
      } catch (err) {
        console.warn('Journey public API notice:', err.message)
      }
    }

    loadJourney()

    const handleUpdate = (e) => {
      if (e.detail) {
        setJourneyData((prev) => ({
          ...prev,
          ...e.detail,
        }))
      }
    }

    window.addEventListener('gilbert_journey_updated', handleUpdate)
    return () => window.removeEventListener('gilbert_journey_updated', handleUpdate)
  }, [])

  if (prefersReducedMotion()) return <JourneyStatic data={journeyData} />
  return <JourneyPinned data={journeyData} />
}
