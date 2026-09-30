import { useState, useEffect, useRef } from 'react'
import {
  Heart,
  Quote,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Activity,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import ScrollReveal from '../ScrollReveal'
import jack1 from '../../assets/images/jack1.jpg'
import jack2 from '../../assets/images/jack2.jpg'

const TIMELINE_STAGES = [
  {
    step: '01',
    year: '2010',
    tag: 'Early Warning',
    shortTitle: 'Initial Signs',
    title: 'Initial Symptoms & Decisive Action',
    subtitle: 'Prompt medical consultation after unusual bleeding',
    description:
      'In 2010, Jackie began experiencing persistent unusual bleeding outside her normal cycle. Rather than ignoring the signs, she immediately consulted doctors. They recommended specialized cancer tests, and samples indicated cervical cancer.',
    highlight: '“In 2010, I began experiencing unusual bleeding... Concerned about my health, I went to the hospital.”',
  },
  {
    step: '02',
    year: 'Diagnosis',
    tag: 'Hospital Verification',
    shortTitle: 'Diagnosis',
    title: 'Triple Confirmatory Testing',
    subtitle: 'Confirmation across Kampala and Mulago Hospital',
    description:
      'To ensure absolute certainty, Jackie and her family pursued further clinical evaluations in Kampala and at Mulago National Referral Hospital. Each test confirmed the cervical cancer diagnosis, beginning an anxious chapter for the family.',
    highlight: '“I underwent another test in Kampala, and later went to Mulago Hospital... once again confirming the diagnosis.”',
  },
  {
    step: '03',
    year: 'The Lifeline',
    tag: 'Humanitarian Care',
    shortTitle: 'CCF Lifeline',
    title: 'Connection to Mr. Jimmy & CCF',
    subtitle: 'Compassionate medical sponsorship and guidance',
    description:
      'Through a colleague at work, Jackie’s situation was brought to the attention of Mr. Jimmy (Gilbert Kevin Jimmy Kwizera). His Cancer Charity Foundation (CCF) immediately stepped in to provide compassionate medical, financial, and logistical support.',
    highlight: '“Fortunately, my situation was brought to Mr. Jimmy. Through his Cancer Charity Foundation, I received the care I needed.”',
  },
  {
    step: '04',
    year: 'Treatment',
    tag: 'Medical Recovery',
    shortTitle: 'Nsambya Care',
    title: '7 Days of Care at Nsambya Hospital',
    subtitle: 'Specialized hospital treatment and comprehensive support',
    description:
      'The foundation facilitated all necessary diagnostic tests and seven days of targeted medical treatment at Nsambya Hospital. Because the cancer was detected at an early stage, Jackie achieved complete remission and recovery.',
    highlight: '“I received treatment for seven days at Nsambya Hospital, and because it was detected early, I was able to recover.”',
  },
  {
    step: '05',
    year: 'Today',
    tag: '100% Cancer Free',
    shortTitle: 'Living Testimony',
    title: 'Living Testimony of Hope & Advocacy',
    subtitle: 'Health restored, caring for family, and inspiring others',
    description:
      'Today, at 58 years old, Jackie lives in full health with her husband Godfrey Ikoro and four children. She stands as an enduring living testimony that early screening, timely medical care, and compassionate community support save lives.',
    highlight: '“Today, I stand as a living testimony of hope, early treatment, and compassionate support.”',
  },
]

export default function AppleJackieTestimony() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const slideTimerRef = useRef(null)
  const navContainerRef = useRef(null)
  const buttonRefs = useRef([])

  // Auto-scroll ONLY the horizontal milestone buttons container (without scrolling the page window)
  useEffect(() => {
    const container = navContainerRef.current
    const activeBtn = buttonRefs.current[activeSlide]
    if (container && activeBtn) {
      const scrollOffset =
        activeBtn.offsetLeft -
        container.offsetWidth / 2 +
        activeBtn.offsetWidth / 2

      container.scrollTo({
        left: Math.max(0, scrollOffset),
        behavior: 'smooth',
      })
    }
  }, [activeSlide])

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % TIMELINE_STAGES.length)
  }

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + TIMELINE_STAGES.length) % TIMELINE_STAGES.length)
  }

  // Smooth touch swipe handlers
  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) nextSlide()
    if (isRightSwipe) prevSlide()
  }

  // Automatic Smooth Slider Interval (5.5s per slide)
  useEffect(() => {
    if (isAutoPlay && !isHovered) {
      slideTimerRef.current = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % TIMELINE_STAGES.length)
      }, 5500)
    }

    return () => {
      if (slideTimerRef.current) {
        clearInterval(slideTimerRef.current)
      }
    }
  }, [isAutoPlay, isHovered, activeSlide])

  return (
    <section className="bg-ink text-paper py-20 md:py-28 border-t border-white/10 overflow-hidden">
      <style>{`
        @keyframes runningBar {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        {/* Centered Header */}
        <div className="text-center max-w-3xl mx-auto">
          <ScrollReveal type="text" as="div" className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-amber-300 backdrop-blur-md">
            <Heart className="h-3.5 w-3.5 text-amber-400 fill-amber-400/30" />
            Living Testimony · Cancer Charity Foundation
          </ScrollReveal>

          <ScrollReveal type="text" as="h2" className="display mt-5 text-4xl sm:text-6xl md:text-7xl text-paper">
            Apple Jackie
          </ScrollReveal>

          <ScrollReveal type="text" as="p" className="mt-4 text-lg sm:text-xl text-paper/85 font-serif italic max-w-2xl mx-auto leading-relaxed">
            “Today, I stand as a living testimony of hope, early treatment, and compassionate support.”
          </ScrollReveal>
        </div>

        {/* Top Section: Photo Showcase + Verbatim Narrative */}
        <div className="mt-16 grid gap-10 lg:grid-cols-12 items-center">
          {/* Left 5 Cols: Interactive Dual Photo Card (Black & White to Color on Hover) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-2xl backdrop-blur-md transition-all duration-700 hover:border-amber-400/40 hover:shadow-amber-500/10">
              {/* Photo Frame with Black & White -> Color Hover Cross-Fade */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-charcoal">
                {/* Photo 1 (Default: Black & White Portrait) */}
                <img
                  src={jack1}
                  alt="Apple Jackie, cancer survivor"
                  className="h-full w-full object-cover object-center grayscale contrast-110 brightness-95 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-0"
                />

                {/* Photo 2 (Hover: Full Color Standing Photograph) */}
                <img
                  src={jack2}
                  alt="Apple Jackie standing in good health"
                  className="absolute inset-0 h-full w-full object-cover object-center grayscale contrast-110 opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105"
                />

                {/* Ambient Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-90 pointer-events-none" />

                {/* Top Badge Overlay */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
                  <span className="flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium text-amber-300 backdrop-blur-md border border-amber-500/30">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    Cancer Survivor
                  </span>

                  <span className="rounded-full bg-ink/70 px-3 py-1 text-[11px] text-paper/75 backdrop-blur-md border border-white/10 opacity-80 group-hover:opacity-100 transition-opacity">
                    Hover to reveal
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-5 left-5 right-5 z-10 pointer-events-none">
                  <h3 className="text-2xl sm:text-3xl font-serif text-paper">Apple Jackie</h3>
                  <p className="text-sm text-paper/80 mt-0.5">58 Years Old · Married to Godfrey Ikoro</p>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-md bg-white/15 px-2.5 py-1 text-paper backdrop-blur-sm border border-white/15">
                      4 Children
                    </span>
                    <span className="rounded-md bg-emerald-500/20 text-emerald-300 px-2.5 py-1 backdrop-blur-sm border border-emerald-500/30">
                      Cervical Cancer Survivor
                    </span>
                    <span className="rounded-md bg-amber-500/20 text-amber-300 px-2.5 py-1 backdrop-blur-sm border border-amber-500/30">
                      Nsambya Hospital
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metric Chips */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold uppercase">
                  <Activity className="h-3.5 w-3.5" />
                  <span>Detection</span>
                </div>
                <p className="mt-1 text-xl font-bold text-paper font-serif">Early Stage</p>
                <p className="text-xs text-mist mt-0.5">Prompt screening in 2010</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold uppercase">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Treatment</span>
                </div>
                <p className="mt-1 text-xl font-bold text-paper font-serif">7 Days Care</p>
                <p className="text-xs text-mist mt-0.5">Nsambya Hospital & CCF</p>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Full Written Testimony */}
          <div className="lg:col-span-7 space-y-5 text-base sm:text-lg leading-relaxed text-paper/85 bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
            <p className="text-xl text-paper font-serif leading-relaxed">
              <strong className="text-amber-300 font-semibold">“My name is Apple Jackie.</strong> I am 58 years old, married to Godfrey Ikoro, and blessed with four children.”
            </p>

            <p>
              In 2010, I began experiencing unusual bleeding. At first, I did not take it seriously because I thought it might be related to my menstrual cycle. However, the bleeding continued, including at times when I was not on my period.
            </p>

            <p>
              Concerned about my health, I went to the hospital and explained my symptoms to the doctors. They advised me to undergo tests for cancer and referred me to a specialist. Samples were taken for testing, and after two days, I returned to receive my results. I was told that the tests indicated cervical cancer.
            </p>

            <p>
              I shared the news with my family, and they encouraged me to seek further confirmation. I underwent another test in Kampala, which produced the same results. I later went to Mulago Hospital for further testing, and once again, the results confirmed the diagnosis.
            </p>

            {/* Highlighted Quote Box */}
            <div className="rounded-2xl border-l-4 border-amber-400 bg-amber-500/10 p-5 my-3">
              <Quote className="h-6 w-6 text-amber-400 mb-2" />
              <p className="italic text-paper font-serif text-lg sm:text-xl leading-relaxed">
                “At that point, my family and I were deeply concerned about what the future would hold. Fortunately, someone I knew through work was connected to <strong className="text-amber-300 font-bold not-italic">Mr. Jimmy</strong>, and my situation was brought to his attention. Through his <strong className="text-amber-300 font-bold not-italic">Cancer Charity Foundation (CCF)</strong>, I was connected to the support and medical care I needed.”
              </p>
            </div>

            <p>
              The foundation helped me with the necessary medical tests and treatment at Nsambya Hospital. I received treatment for seven days, and because the cancer was detected at an early stage, I was able to recover.
            </p>

            <p className="text-amber-200 font-serif font-medium text-lg pt-1">
              “Today, I stand as a living testimony of hope, early treatment, and compassionate support. I am deeply grateful to Mr. Jimmy and the Cancer Charity Foundation for standing with me during one of the most difficult moments of my life... and giving me the opportunity to continue living and caring for my family.”
            </p>
          </div>
        </div>

        {/* FULL WIDTH BUTTERY SMOOTH HORIZONTAL SLIDER: Key Journey Milestones */}
        <div className="mt-20 border-t border-white/10 pt-16">
          {/* Slider Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
                  Key Journey Milestones
                </p>

              </div>

              <h3 className="display mt-2 text-3xl sm:text-5xl text-paper">
                The Path to Recovery
              </h3>
              <p className="text-sm text-mist mt-1">
                Explore the 5 vital chapters of Jackie’s journey to complete healing
              </p>
            </div>

            {/* Slider Navigation Controls */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={prevSlide}
                aria-label="Previous milestone"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-paper transition-all duration-300 hover:bg-amber-400 hover:text-ink hover:border-amber-400 hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next milestone"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-paper transition-all duration-300 hover:bg-amber-400 hover:text-ink hover:border-amber-400 hover:scale-105 active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Full Width Smooth Horizontal Carousel Container */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-white/[0.01] shadow-2xl backdrop-blur-xl select-none"
          >
            {/* Ambient Glow */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />

            {/* Horizontal Moving Track with Buttery Smooth Bezier Easing */}
            <div
              className="flex w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
              style={{
                transform: `translateX(-${activeSlide * 100}%)`,
              }}
            >
              {TIMELINE_STAGES.map((stg, idx) => (
                <div
                  key={stg.step}
                  className="min-w-full w-full shrink-0 p-5 sm:p-8 md:p-12"
                >
                  <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 items-center">
                    {/* Left Info */}
                    <div className="lg:col-span-5 space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-400 text-ink font-bold text-base sm:text-lg font-mono shadow-lg shadow-amber-400/30">
                          {stg.step}
                        </span>
                        <div>
                          <span className="inline-block rounded-full bg-amber-500/20 px-2.5 sm:px-3 py-0.5 text-[11px] sm:text-xs font-medium text-amber-300 border border-amber-500/30">
                            {stg.tag}
                          </span>
                          <p className="text-[11px] sm:text-xs text-mist font-mono mt-0.5">Year: {stg.year}</p>
                        </div>
                      </div>

                      <h4 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-paper font-semibold leading-tight">
                        {stg.title}
                      </h4>

                      <p className="text-xs sm:text-sm text-amber-300/90 font-medium">
                        {stg.subtitle}
                      </p>
                    </div>

                    {/* Right Info */}
                    <div className="lg:col-span-7 space-y-4 sm:space-y-5 lg:border-l lg:border-white/10 lg:pl-8">
                      <p className="text-sm sm:text-base md:text-lg leading-relaxed text-paper/90">
                        {stg.description}
                      </p>

                      <div className="rounded-2xl border border-white/10 bg-ink/60 p-4 sm:p-5 backdrop-blur-sm">
                        <Quote className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400/80 mb-1" />
                        <p className="text-xs sm:text-sm md:text-base italic text-amber-200/90 font-serif leading-relaxed">
                          {stg.highlight}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Smooth Running Progress Track Indicator */}
            <div className="px-5 sm:px-12 pb-5 sm:pb-8 pt-3 sm:pt-4 border-t border-white/10 flex gap-2 sm:gap-2.5">
              {TIMELINE_STAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="group relative h-1.5 sm:h-2 flex-1 overflow-hidden rounded-full bg-white/15 transition-all hover:bg-white/25"
                >
                  {/* Completed slides */}
                  {i < activeSlide && (
                    <div className="h-full w-full rounded-full bg-amber-400" />
                  )}

                  {/* Active running slide */}
                  {i === activeSlide && (
                    <div
                      key={`progress-${activeSlide}`}
                      style={{
                        animation: `runningBar 5.5s linear forwards`,
                        animationPlayState: isHovered ? 'paused' : 'running',
                      }}
                      className="h-full rounded-full bg-amber-400 shadow-md shadow-amber-400/50"
                    />
                  )}

                  {/* Upcoming slides */}
                  {i > activeSlide && (
                    <div className="h-full w-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quick-Select Milestone Navigation: Scrollable on mobile, 5-col grid on desktop */}
          <div
            ref={navContainerRef}
            className="mt-4 flex sm:grid sm:grid-cols-5 gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-none snap-x scroll-smooth"
          >
            {TIMELINE_STAGES.map((stg, i) => (
              <button
                key={stg.step}
                ref={(el) => (buttonRefs.current[i] = el)}
                onClick={() => setActiveSlide(i)}
                className={`flex shrink-0 sm:shrink flex-col items-start rounded-xl sm:rounded-2xl p-3 sm:p-4 text-left transition-all duration-300 min-w-[130px] sm:min-w-0 snap-center ${
                  activeSlide === i
                    ? 'bg-amber-500/20 border-2 border-amber-400 text-paper shadow-lg shadow-amber-500/10 scale-[1.02]'
                    : 'bg-white/[0.03] border border-white/10 text-mist hover:bg-white/[0.06] hover:text-paper hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-mono font-bold ${activeSlide === i ? 'text-amber-400' : 'text-mist'}`}>
                    {stg.step}
                  </span>
                  <span className="text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded bg-white/5 text-mist font-mono">
                    {stg.year}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-paper mt-1.5 sm:mt-2 line-clamp-1">
                  {stg.shortTitle}
                </p>
              </button>
            ))}
          </div>

          {/* Bottom CCF Trust & Verification Banner (Mobile Optimized) */}
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6 backdrop-blur-md">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-amber-400 text-ink font-bold flex items-center justify-center text-sm shadow-md shadow-amber-400/20">
                CCF
              </div>
              <div>
                <h5 className="text-sm sm:text-base font-semibold text-paper leading-tight">Cancer Charity Foundation</h5>
                <p className="text-xs text-mist mt-0.5 leading-relaxed">Dedicated to early detection, dignifying patient care, and recovery support across Uganda</p>
              </div>
            </div>

            <div className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-300 border border-emerald-500/30 shrink-0">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span className="text-center">Verified Living Testimony · Nsambya Hospital Care</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
