import { useState } from 'react'
import { Heart, Sparkles, ShieldCheck, UserCheck } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import AppleJackieTestimony from '../components/LivingTestimony/AppleJackieTestimony'
import GladysNserekoTestimony from '../components/LivingTestimony/GladysNserekoTestimony'
import jack1Image from '../assets/images/jack1.jpg'
import paImage from '../assets/images/pa.jpeg'

const TESTIMONIALS = [
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

export default function LivingTestimony() {
  const [activeTab, setActiveTab] = useState('gladys')

  return (
    <section
      id="living-testimony"
      className="relative bg-ink text-paper py-20 md:py-28 border-t border-white/10 overflow-hidden"
    >
      {/* Ambient background glow elements */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-rose-500/10 via-amber-500/5 to-transparent blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 relative z-10">
        {/* Section Top Selector Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <ScrollReveal
            type="text"
            as="div"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-paper/90 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Living Testimonies of Hope · Cancer Charity Foundation
          </ScrollReveal>

          <ScrollReveal
            type="text"
            as="h2"
            className="display mt-4 text-3xl sm:text-5xl md:text-6xl text-paper"
          >
            Stories of Strength & Survival
          </ScrollReveal>

          <ScrollReveal
            type="text"
            as="p"
            className="mt-3 text-sm sm:text-base text-mist max-w-xl mx-auto"
          >
            Real people whose lives were saved through early detection, clinical treatment, and compassionate support from Mr. Jimmy & CCF.
          </ScrollReveal>

          {/* Interactive Survivor Tabs Bar */}
          <div className="mt-8 inline-flex flex-col sm:flex-row items-center gap-3 p-2 rounded-2xl sm:rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl max-w-full">
            {TESTIMONIALS.map((t) => {
              const isActive = activeTab === t.id
              const isRose = t.accentColor === 'rose'

              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`group relative flex items-center gap-3.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-full text-left transition-all duration-300 w-full sm:w-auto ${
                    isActive
                      ? isRose
                        ? 'bg-gradient-to-r from-rose-500/25 to-rose-600/20 border border-rose-500/50 shadow-lg shadow-rose-500/20 text-paper'
                        : 'bg-gradient-to-r from-amber-500/25 to-amber-600/20 border border-amber-500/50 shadow-lg shadow-amber-500/20 text-paper'
                      : 'border border-transparent text-mist hover:text-paper hover:bg-white/[0.05]'
                  }`}
                >
                  {/* Avatar thumbnail */}
                  <div
                    className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 transition-transform duration-300 group-hover:scale-105 ${
                      isActive
                        ? isRose
                          ? 'border-rose-400 shadow-md shadow-rose-400/40'
                          : 'border-amber-400 shadow-md shadow-amber-400/40'
                        : 'border-white/20 grayscale'
                    }`}
                  >
                    <img
                      src={t.image}
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
                          className={`flex h-2 w-2 rounded-full animate-pulse ${
                            isRose ? 'bg-rose-400' : 'bg-amber-400'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-[11px] font-medium ${
                          isActive
                            ? isRose
                              ? 'text-rose-300'
                              : 'text-amber-300'
                            : 'text-mist'
                        }`}
                      >
                        {t.badge}
                      </span>
                      <span className="text-[10px] text-paper/40 font-mono">• {t.age}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Dynamic Story Display */}
        <div className="transition-all duration-500">
          {activeTab === 'gladys' ? (
            <GladysNserekoTestimony />
          ) : (
            <AppleJackieTestimony />
          )}
        </div>
      </div>
    </section>
  )
}
