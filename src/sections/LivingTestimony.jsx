import { useState, useEffect } from 'react'
import { Heart, Sparkles, ShieldCheck, UserCheck } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import AppleJackieTestimony from '../components/LivingTestimony/AppleJackieTestimony'
import GladysNserekoTestimony from '../components/LivingTestimony/GladysNserekoTestimony'
import { livingTestimonyAPI } from '../services/api'
import { resolveAsset } from '../utils/resolveAsset'
import jack1Image from '../assets/images/jack1.jpg'
import paImage from '../assets/images/pa.jpeg'

const DEFAULT_TESTIMONIALS = [
  {
    id: 'gladys',
    name: 'Mrs. Gladys Nsereko',
    badge: 'Breast Cancer Survivor',
    age: '70 Years Old',
    year: 'Since 2009',
    hospitals: 'Nsambya & Mulago',
    image: paImage,
    accentColor: 'rose',
    tagline: '70-Year-Old Beacon of Hope & Early Screening',
  },
  {
    id: 'jackie',
    name: 'Apple Jackie',
    badge: 'Cervical Cancer Survivor',
    age: '58 Years Old',
    year: 'Since 2010',
    hospitals: 'Nsambya Hospital',
    image: jack1Image,
    accentColor: 'amber',
    tagline: 'Mother of 4 & Living Voice of Early Action',
  },
]

const ACCENT_STYLES = {
  rose: {
    activeTab: 'bg-gradient-to-r from-rose-500/25 to-rose-600/20 border-rose-500/50 shadow-rose-500/20 text-paper',
    avatarBorder: 'border-rose-400 shadow-rose-400/40',
    pulse: 'bg-rose-400',
    badgeText: 'text-rose-300',
  },
  amber: {
    activeTab: 'bg-gradient-to-r from-amber-500/25 to-amber-600/20 border-amber-500/50 shadow-amber-500/20 text-paper',
    avatarBorder: 'border-amber-400 shadow-amber-400/40',
    pulse: 'bg-amber-400',
    badgeText: 'text-amber-300',
  },
  emerald: {
    activeTab: 'bg-gradient-to-r from-emerald-500/25 to-emerald-600/20 border-emerald-500/50 shadow-emerald-500/20 text-paper',
    avatarBorder: 'border-emerald-400 shadow-emerald-400/40',
    pulse: 'bg-emerald-400',
    badgeText: 'text-emerald-300',
  },
  blue: {
    activeTab: 'bg-gradient-to-r from-blue-500/25 to-blue-600/20 border-blue-500/50 shadow-blue-500/20 text-paper',
    avatarBorder: 'border-blue-400 shadow-blue-400/40',
    pulse: 'bg-blue-400',
    badgeText: 'text-blue-300',
  },
  purple: {
    activeTab: 'bg-gradient-to-r from-purple-500/25 to-purple-600/20 border-purple-500/50 shadow-purple-500/20 text-paper',
    avatarBorder: 'border-purple-400 shadow-purple-400/40',
    pulse: 'bg-purple-400',
    badgeText: 'text-purple-300',
  },
  orange: {
    activeTab: 'bg-gradient-to-r from-orange-500/25 to-orange-600/20 border-orange-500/50 shadow-orange-500/20 text-paper',
    avatarBorder: 'border-orange-400 shadow-orange-400/40',
    pulse: 'bg-orange-400',
    badgeText: 'text-orange-300',
  },
}

const GLOW_COLORS = {
  rose: 'from-rose-500/15 via-rose-500/5 to-transparent',
  amber: 'from-amber-500/15 via-amber-500/5 to-transparent',
  emerald: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
  blue: 'from-blue-500/15 via-blue-500/5 to-transparent',
  purple: 'from-purple-500/15 via-purple-500/5 to-transparent',
  orange: 'from-orange-500/15 via-orange-500/5 to-transparent',
}

export default function LivingTestimony() {
  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem('gilbert_cached_testimonies')
      if (cached) return JSON.parse(cached)
    } catch (e) {}
    return {
      eyebrow: 'Living Testimonies of Hope · Cancer Charity Foundation',
      title: 'Stories of Strength & Survival',
      subtitle:
        'Real people whose lives were saved through early detection, clinical treatment, and compassionate support from Mr. Jimmy & CCF.',
      survivors: DEFAULT_TESTIMONIALS,
    }
  })

  const [activeTab, setActiveTab] = useState('gladys')

  useEffect(() => {
    const fetchLiveTestimonies = async () => {
      try {
        const res = await livingTestimonyAPI.getTestimonies()
        if (res.success && res.data) {
          setData(res.data)
          localStorage.setItem('gilbert_cached_testimonies', JSON.stringify(res.data))
        }
      } catch (err) {
        console.warn('Testimonies fetch notice:', err.message)
      }
    }

    fetchLiveTestimonies()

    const handleUpdate = (e) => {
      if (e.detail) {
        setData(e.detail)
      }
    }

    window.addEventListener('gilbert_testimonies_updated', handleUpdate)
    return () => window.removeEventListener('gilbert_testimonies_updated', handleUpdate)
  }, [])

  const survivors = Array.isArray(data.survivors) && data.survivors.length > 0 ? data.survivors : DEFAULT_TESTIMONIALS
  const currentSurvivor = survivors.find((s) => s.id === activeTab) || survivors[0]

  return (
    <section
      id="living-testimony"
      className="relative bg-ink text-paper py-20 md:py-28 border-t border-white/10 overflow-hidden"
    >
      {/* Ambient background glow elements reacting to active survivor's theme */}
      <div className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b ${GLOW_COLORS[currentSurvivor?.accentColor] || GLOW_COLORS.rose} blur-[120px] pointer-events-none transition-all duration-700`} />

      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 relative z-10">
        {/* Section Top Selector Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <ScrollReveal
            type="text"
            as="div"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-paper/90 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            {data.eyebrow || 'Living Testimonies of Hope · Cancer Charity Foundation'}
          </ScrollReveal>

          <ScrollReveal
            type="text"
            as="h2"
            className="display mt-4 break-words text-[clamp(1.75rem,7vw,3.75rem)] leading-[1.08] text-paper"
          >
            {data.title || 'Stories of Strength & Survival'}
          </ScrollReveal>

          <ScrollReveal
            type="text"
            as="p"
            className="mt-3 text-sm sm:text-base text-mist max-w-xl mx-auto"
          >
            {data.subtitle ||
              'Real people whose lives were saved through early detection, clinical treatment, and compassionate support from Mr. Jimmy & CCF.'}
          </ScrollReveal>

          {/* Interactive Survivor Tabs Bar */}
          <div className="mt-8 inline-flex flex-col sm:flex-row items-center gap-3 p-2 rounded-2xl sm:rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl max-w-full">
            {survivors.map((t) => {
              const isActive = (activeTab === t.id) || (!survivors.some(s => s.id === activeTab) && t === survivors[0])
              const theme = ACCENT_STYLES[t.accentColor] || ACCENT_STYLES.rose

              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`group relative flex items-center gap-3.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-full text-left transition-all duration-300 w-full sm:w-auto ${
                    isActive
                      ? `${theme.activeTab} border shadow-lg`
                      : 'border border-transparent text-mist hover:text-paper hover:bg-white/[0.05]'
                  }`}
                >
                  {/* Avatar thumbnail */}
                  <div
                    className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 transition-transform duration-300 group-hover:scale-105 ${
                      isActive
                        ? `${theme.avatarBorder} shadow-md`
                        : 'border-white/20 grayscale'
                    }`}
                  >
                    <img
                      src={t.image ? resolveAsset(t.image) : paImage}
                      alt={t.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  {/* Text details */}
                  <div className="pr-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-semibold text-paper font-serif leading-tight">
                        {t.name}
                      </span>
                      {isActive && (
                        <span
                          className={`flex h-2 w-2 rounded-full animate-pulse ${theme.pulse}`}
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-[11px] font-medium ${
                          isActive
                            ? theme.badgeText
                            : 'text-mist'
                        }`}
                      >
                        {t.badge}
                      </span>
                      {t.age && <span className="text-[10px] text-paper/40 font-mono">• {t.age}</span>}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Dynamic Story Display */}
        <div className="transition-all duration-500">
          <GladysNserekoTestimony survivorData={currentSurvivor} />
        </div>
      </div>
    </section>
  )
}
