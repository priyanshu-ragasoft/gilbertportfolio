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
import paImage from '../../assets/images/pa.jpeg'
import peImage from '../../assets/images/pe.jpeg'
import jack1Image from '../../assets/images/jack1.jpg'
import jack2Image from '../../assets/images/jack2.jpg'

const COLOR_THEMES = {
  rose: {
    badgeBorder: 'border-rose-500/30',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-300',
    heartIcon: 'text-rose-400 fill-rose-400/30',
    cardHoverBorder: 'hover:border-rose-400/40',
    cardHoverShadow: 'hover:shadow-rose-500/10',
    topSparkleBadge: 'text-rose-300 border-rose-500/30',
    topSparkleIcon: 'text-rose-400',
    photoBadge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    photoHospitalBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    detectionIcon: 'text-rose-400',
    nameHighlight: 'text-rose-300',
    quoteBoxBorder: 'border-rose-400',
    quoteBoxBg: 'bg-rose-500/10',
    quoteIcon: 'text-rose-400',
    closingQuoteText: 'text-rose-200',
    milestoneEyebrow: 'text-rose-400',
    navBtnHover: 'hover:bg-rose-400 hover:text-ink hover:border-rose-400',
    carouselBorder: 'border-rose-500/30',
    carouselGlow: 'bg-rose-500/10',
    stepNumber: 'bg-rose-400 text-ink shadow-rose-400/30',
    stepTag: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    stepSubtitle: 'text-rose-300/90',
    slideQuoteIcon: 'text-rose-400/80',
    slideQuoteText: 'text-rose-200/90',
    progressBarCompleted: 'bg-rose-400',
    progressBarActive: 'bg-rose-400 shadow-md shadow-rose-400/50',
    quickNavActive: 'bg-rose-500/20 border-2 border-rose-400 text-paper shadow-lg shadow-rose-500/10',
    quickNavActiveStep: 'text-rose-400',
    ccfBox: 'bg-rose-400 text-ink shadow-rose-400/20',
  },
  amber: {
    badgeBorder: 'border-amber-500/30',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-300',
    heartIcon: 'text-amber-400 fill-amber-400/30',
    cardHoverBorder: 'hover:border-amber-400/40',
    cardHoverShadow: 'hover:shadow-amber-500/10',
    topSparkleBadge: 'text-amber-300 border-amber-500/30',
    topSparkleIcon: 'text-amber-400',
    photoBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    photoHospitalBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    detectionIcon: 'text-amber-400',
    nameHighlight: 'text-amber-300',
    quoteBoxBorder: 'border-amber-400',
    quoteBoxBg: 'bg-amber-500/10',
    quoteIcon: 'text-amber-400',
    closingQuoteText: 'text-amber-200',
    milestoneEyebrow: 'text-amber-400',
    navBtnHover: 'hover:bg-amber-400 hover:text-ink hover:border-amber-400',
    carouselBorder: 'border-amber-500/30',
    carouselGlow: 'bg-amber-500/10',
    stepNumber: 'bg-amber-400 text-ink shadow-amber-400/30',
    stepTag: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    stepSubtitle: 'text-amber-300/90',
    slideQuoteIcon: 'text-amber-400/80',
    slideQuoteText: 'text-amber-200/90',
    progressBarCompleted: 'bg-amber-400',
    progressBarActive: 'bg-amber-400 shadow-md shadow-amber-400/50',
    quickNavActive: 'bg-amber-500/20 border-2 border-amber-400 text-paper shadow-lg shadow-amber-500/10',
    quickNavActiveStep: 'text-amber-400',
    ccfBox: 'bg-amber-400 text-ink shadow-amber-400/20',
  },
  emerald: {
    badgeBorder: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-300',
    heartIcon: 'text-emerald-400 fill-emerald-400/30',
    cardHoverBorder: 'hover:border-emerald-400/40',
    cardHoverShadow: 'hover:shadow-emerald-500/10',
    topSparkleBadge: 'text-emerald-300 border-emerald-500/30',
    topSparkleIcon: 'text-emerald-400',
    photoBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    photoHospitalBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    detectionIcon: 'text-emerald-400',
    nameHighlight: 'text-emerald-300',
    quoteBoxBorder: 'border-emerald-400',
    quoteBoxBg: 'bg-emerald-500/10',
    quoteIcon: 'text-emerald-400',
    closingQuoteText: 'text-emerald-200',
    milestoneEyebrow: 'text-emerald-400',
    navBtnHover: 'hover:bg-emerald-400 hover:text-ink hover:border-emerald-400',
    carouselBorder: 'border-emerald-500/30',
    carouselGlow: 'bg-emerald-500/10',
    stepNumber: 'bg-emerald-400 text-ink shadow-emerald-400/30',
    stepTag: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    stepSubtitle: 'text-emerald-300/90',
    slideQuoteIcon: 'text-emerald-400/80',
    slideQuoteText: 'text-emerald-200/90',
    progressBarCompleted: 'bg-emerald-400',
    progressBarActive: 'bg-emerald-400 shadow-md shadow-emerald-400/50',
    quickNavActive: 'bg-emerald-500/20 border-2 border-emerald-400 text-paper shadow-lg shadow-emerald-500/10',
    quickNavActiveStep: 'text-emerald-400',
    ccfBox: 'bg-emerald-400 text-ink shadow-emerald-400/20',
  },
  blue: {
    badgeBorder: 'border-blue-500/30',
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-300',
    heartIcon: 'text-blue-400 fill-blue-400/30',
    cardHoverBorder: 'hover:border-blue-400/40',
    cardHoverShadow: 'hover:shadow-blue-500/10',
    topSparkleBadge: 'text-blue-300 border-blue-500/30',
    topSparkleIcon: 'text-blue-400',
    photoBadge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    photoHospitalBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    detectionIcon: 'text-blue-400',
    nameHighlight: 'text-blue-300',
    quoteBoxBorder: 'border-blue-400',
    quoteBoxBg: 'bg-blue-500/10',
    quoteIcon: 'text-blue-400',
    closingQuoteText: 'text-blue-200',
    milestoneEyebrow: 'text-blue-400',
    navBtnHover: 'hover:bg-blue-400 hover:text-ink hover:border-blue-400',
    carouselBorder: 'border-blue-500/30',
    carouselGlow: 'bg-blue-500/10',
    stepNumber: 'bg-blue-400 text-ink shadow-blue-400/30',
    stepTag: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    stepSubtitle: 'text-blue-300/90',
    slideQuoteIcon: 'text-blue-400/80',
    slideQuoteText: 'text-blue-200/90',
    progressBarCompleted: 'bg-blue-400',
    progressBarActive: 'bg-blue-400 shadow-md shadow-blue-400/50',
    quickNavActive: 'bg-blue-500/20 border-2 border-blue-400 text-paper shadow-lg shadow-blue-500/10',
    quickNavActiveStep: 'text-blue-400',
    ccfBox: 'bg-blue-400 text-ink shadow-blue-400/20',
  },
  purple: {
    badgeBorder: 'border-purple-500/30',
    badgeBg: 'bg-purple-500/10',
    badgeText: 'text-purple-300',
    heartIcon: 'text-purple-400 fill-purple-400/30',
    cardHoverBorder: 'hover:border-purple-400/40',
    cardHoverShadow: 'hover:shadow-purple-500/10',
    topSparkleBadge: 'text-purple-300 border-purple-500/30',
    topSparkleIcon: 'text-purple-400',
    photoBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    photoHospitalBadge: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
    detectionIcon: 'text-purple-400',
    nameHighlight: 'text-purple-300',
    quoteBoxBorder: 'border-purple-400',
    quoteBoxBg: 'bg-purple-500/10',
    quoteIcon: 'text-purple-400',
    closingQuoteText: 'text-purple-200',
    milestoneEyebrow: 'text-purple-400',
    navBtnHover: 'hover:bg-purple-400 hover:text-ink hover:border-purple-400',
    carouselBorder: 'border-purple-500/30',
    carouselGlow: 'bg-purple-500/10',
    stepNumber: 'bg-purple-400 text-ink shadow-purple-400/30',
    stepTag: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    stepSubtitle: 'text-purple-300/90',
    slideQuoteIcon: 'text-purple-400/80',
    slideQuoteText: 'text-purple-200/90',
    progressBarCompleted: 'bg-purple-400',
    progressBarActive: 'bg-purple-400 shadow-md shadow-purple-400/50',
    quickNavActive: 'bg-purple-500/20 border-2 border-purple-400 text-paper shadow-lg shadow-purple-500/10',
    quickNavActiveStep: 'text-purple-400',
    ccfBox: 'bg-purple-400 text-ink shadow-purple-400/20',
  },
  orange: {
    badgeBorder: 'border-orange-500/30',
    badgeBg: 'bg-orange-500/10',
    badgeText: 'text-orange-300',
    heartIcon: 'text-orange-400 fill-orange-400/30',
    cardHoverBorder: 'hover:border-orange-400/40',
    cardHoverShadow: 'hover:shadow-orange-500/10',
    topSparkleBadge: 'text-orange-300 border-orange-500/30',
    topSparkleIcon: 'text-orange-400',
    photoBadge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    photoHospitalBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    detectionIcon: 'text-orange-400',
    nameHighlight: 'text-orange-300',
    quoteBoxBorder: 'border-orange-400',
    quoteBoxBg: 'bg-orange-500/10',
    quoteIcon: 'text-orange-400',
    closingQuoteText: 'text-orange-200',
    milestoneEyebrow: 'text-orange-400',
    navBtnHover: 'hover:bg-orange-400 hover:text-ink hover:border-orange-400',
    carouselBorder: 'border-orange-500/30',
    carouselGlow: 'bg-orange-500/10',
    stepNumber: 'bg-orange-400 text-ink shadow-orange-400/30',
    stepTag: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    stepSubtitle: 'text-orange-300/90',
    slideQuoteIcon: 'text-orange-400/80',
    slideQuoteText: 'text-orange-200/90',
    progressBarCompleted: 'bg-orange-400',
    progressBarActive: 'bg-orange-400 shadow-md shadow-orange-400/50',
    quickNavActive: 'bg-orange-500/20 border-2 border-orange-400 text-paper shadow-lg shadow-orange-500/10',
    quickNavActiveStep: 'text-orange-400',
    ccfBox: 'bg-orange-400 text-ink shadow-orange-400/20',
  },
}

const GLADYS_TIMELINE_STAGES = [
  {
    step: '01',
    year: '2009',
    tag: 'Early Warning',
    shortTitle: 'Self-Check Discovery',
    title: 'Radio Broadcasts & Prompt Self-Examination',
    subtitle: 'Heeding awareness advice leading to immediate hospital consultation',
    description:
      'In 2009, having heard radio health programs advising women to regularly check their breasts, Gladys examined her right breast while bathing. Noticing an unusual bloody discharge from the nipple without lump or pain, she acted decisively and sought immediate medical attention at Nsambya Hospital.',
    highlight:
      '“I followed that advice and examined my right breast... When I pressed the nipple, I noticed an unusual discharge mixed with blood. I immediately went to Nsambya Hospital.”',
  },
  {
    step: '02',
    year: 'Diagnosis',
    tag: 'Stage 2 Diagnosis',
    shortTitle: 'Mastectomy Surgery',
    title: 'Stage 2 Confirmation & Life-Saving Surgery',
    subtitle: 'Biopsy confirmation and swift surgical intervention at Nsambya Hospital',
    description:
      'Detailed clinical examinations and a biopsy at Nsambya Hospital confirmed Stage 2 breast cancer. To prevent the cancer from spreading further, the surgical team advised immediate mastectomy surgery. Gladys underwent successful surgery and prepared for post-operative chemotherapy.',
    highlight:
      '“The results confirmed that I had breast cancer at Stage 2. The doctors advised that the affected breast needed to be removed... I underwent surgery.”',
  },
  {
    step: '03',
    year: 'The Lifeline',
    tag: 'Mr. Jimmy Sponsorship',
    shortTitle: 'Chemo Sponsorship',
    title: 'Mr. Jimmy & CCF Full Medication Support',
    subtitle: 'Relieving overwhelming financial burdens across 6 chemotherapy cycles',
    description:
      'Chemotherapy was required at Mulago Hospital for 6 monthly cycles. Weakened by treatment, Gladys received a life-saving intervention when Mr. Jimmy (Gilbert Kevin Jimmy Kwizera) learned of her situation through Bishop Paul Ssemogerere. Mr. Jimmy funded all essential chemotherapy medicines for the entire duration of her treatment.',
    highlight:
      '“For all six cycles of chemotherapy, Mr. Jimmy continued supporting me with the cost of my medicines. His assistance made a significant difference when the financial burden was overwhelming.”',
  },
  {
    step: '04',
    year: 'Treatment',
    tag: 'Radiotherapy & Scans',
    shortTitle: 'Radiotherapy & PET Scan',
    title: 'Radiotherapy & Comprehensive Clear Scans',
    subtitle: '6 radiotherapy sessions and advanced scans at Aga Khan Hospital Nairobi',
    description:
      'Following chemotherapy, Gladys completed six sessions of radiotherapy for severe back pain. In 2013, to rule out bone recurrence, she traveled with her son’s support to Aga Khan Hospital in Nairobi and abroad for advanced PET scans, which confirmed she was completely cancer-free.',
    highlight:
      '“With the help of my son, I was able to get an appointment at Aga Khan Hospital in Nairobi, where I underwent the scan... The results indicated that I did not have cancer.”',
  },
  {
    step: '05',
    year: 'Today',
    tag: '70 Years Milestone',
    shortTitle: '70 & Cancer Free',
    title: '70-Year-Old Living Beacon of Hope',
    subtitle: 'Celebrating 70 years, vigilant health monitoring, and inspiring early detection',
    description:
      'Having celebrated her 70th birthday on September 5th, Gladys continues regular check-ups while sharing her story. She stands as living proof that listening to your body, seeking immediate medical care, and compassionate benefactors make survival possible.',
    highlight:
      '“Mr. Jimmy was the person who came forward to help me when I needed support the most... ensuring people facing cancer are not left alone because they cannot afford treatment.”',
  },
]

export default function GladysNserekoTestimony({ survivorData }) {
  const theme = COLOR_THEMES[survivorData?.accentColor] || COLOR_THEMES.rose
  const rawStages = survivorData?.milestones?.length ? survivorData.milestones : GLADYS_TIMELINE_STAGES
  const stages = rawStages.filter((stg) => stg.enabled !== false)
  const survivorName = survivorData?.name || 'Mrs. Gladys Nsereko'
  const survivorBadge = survivorData?.badge || 'Breast Cancer Survivor'
  const survivorAge = survivorData?.age || '70 Years Old · Turned 70 on September 5th'
  const survivorYear = survivorData?.year || 'Surviving Since 2009'
  const survivorHospitals = survivorData?.hospitals || 'Nsambya & Mulago'
  const survivorQuote = survivorData?.quote || '“My journey began in 2009... Mr. Jimmy was the person who came forward to help me when I needed support the most.”'
  
  // Dynamic primary and secondary hover images
  let survivorImage = survivorData?.image || paImage
  let hoverImage = peImage

  if (survivorData?.id === 'jackie' || survivorData?.image?.includes('jack1')) {
    survivorImage = survivorData?.image || jack1Image
    hoverImage = jack2Image
  } else if (survivorData?.image && !survivorData.image.includes('pa.jpeg')) {
    hoverImage = survivorData.image
  }

  const detectionLabel = survivorData?.detectionStatLabel || 'Self-Exam'
  const detectionSub = survivorData?.detectionStatSub || 'Prompt media guidance in 2009'
  const chemoLabel = survivorData?.chemoStatLabel || '6 Cycles'
  const chemoSub = survivorData?.chemoStatSub || 'Medication funded by Mr. Jimmy'
  const highlightQuote = survivorData?.highlightQuote || '“During this difficult period, Mr. Jimmy became involved in my case after learning about my situation through Bishop Paul Ssemogerere. He offered to support me with the cost of the medicines I needed during my chemotherapy treatment. For all six cycles of chemotherapy, Mr. Jimmy continued supporting me with the cost of my medicines.”'

  const [activeSlide, setActiveSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const slideTimerRef = useRef(null)
  const navContainerRef = useRef(null)
  const buttonRefs = useRef([])

  // Reset active slide if survivor changes or slide index is out of bounds
  useEffect(() => {
    setActiveSlide(0)
  }, [survivorData?.id])

  useEffect(() => {
    if (activeSlide >= stages.length && stages.length > 0) {
      setActiveSlide(0)
    }
  }, [stages.length, activeSlide])

  // Auto-scroll horizontal milestone buttons container
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
    if (stages.length === 0) return
    setActiveSlide((prev) => (prev + 1) % stages.length)
  }

  const prevSlide = () => {
    if (stages.length === 0) return
    setActiveSlide((prev) => (prev - 1 + stages.length) % stages.length)
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
    if (isAutoPlay && !isHovered && stages.length > 0) {
      slideTimerRef.current = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % stages.length)
      }, 5500)
    }

    return () => {
      if (slideTimerRef.current) {
        clearInterval(slideTimerRef.current)
      }
    }
  }, [isAutoPlay, isHovered, activeSlide, stages.length])

  return (
    <div className="text-paper">
      <style>{`
        @keyframes runningGladysBar {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>

      {/* Header Info */}
      <div className="text-center max-w-3xl mx-auto">
        <ScrollReveal
          type="text"
          as="div"
          className={`inline-flex items-center gap-2 rounded-full border ${theme.badgeBorder} ${theme.badgeBg} px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] ${theme.badgeText} backdrop-blur-md`}
        >
          <Heart className={`h-3.5 w-3.5 ${theme.heartIcon}`} />
          Living Testimony · {survivorBadge}
        </ScrollReveal>

        <ScrollReveal
          type="text"
          as="h2"
          className="display mt-5 text-4xl sm:text-6xl md:text-7xl text-paper"
        >
          {survivorName}
        </ScrollReveal>

        <ScrollReveal
          type="text"
          as="p"
          className="mt-4 text-lg sm:text-xl text-paper/85 font-serif italic max-w-2xl mx-auto leading-relaxed"
        >
          {survivorQuote}
        </ScrollReveal>
      </div>

      {/* Top Section: Photo Showcase + Verbatim Narrative */}
      <div className="mt-16 grid gap-10 lg:grid-cols-12 items-center">
        {/* Left 5 Cols: Interactive Dual Photo Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-2xl backdrop-blur-md transition-all duration-700 ${theme.cardHoverBorder} ${theme.cardHoverShadow}`}>
            {/* Photo Frame with Black & White -> Color Hover Cross-Fade */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-charcoal">
              {/* Photo 1 (Default Portrait) */}
              <img
                src={survivorImage}
                alt={`${survivorName}, ${survivorBadge}`}
                className="h-full w-full object-cover object-[center_20%] grayscale contrast-110 brightness-95 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-0"
              />

              {/* Photo 2 (Hover) */}
              <img
                src={hoverImage}
                alt={`${survivorName} in good health`}
                className="absolute inset-0 h-full w-full object-cover object-[center_top] grayscale contrast-110 opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105"
              />

              {/* Ambient Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-90 pointer-events-none" />

              {/* Top Badge Overlay */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
                <span className={`flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium ${theme.topSparkleBadge} backdrop-blur-md border`}>
                  <Sparkles className={`h-3.5 w-3.5 ${theme.topSparkleIcon}`} />
                  {survivorBadge}
                </span>

                <span className="rounded-full bg-ink/70 px-3 py-1 text-[11px] text-paper/75 backdrop-blur-md border border-white/10 opacity-80 group-hover:opacity-100 transition-opacity">
                  Hover to reveal
                </span>
              </div>

              {/* Bottom Overlay Info */}
              <div className="absolute bottom-5 left-5 right-5 z-10 pointer-events-none">
                <h3 className="text-2xl sm:text-3xl font-serif text-paper">
                  {survivorName}
                </h3>
                <p className="text-sm text-paper/80 mt-0.5">
                  {survivorAge}
                </p>

                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-md bg-white/15 px-2.5 py-1 text-paper backdrop-blur-sm border border-white/15">
                    {survivorYear}
                  </span>
                  <span className={`rounded-md ${theme.photoBadge} px-2.5 py-1 backdrop-blur-sm border`}>
                    {survivorBadge}
                  </span>
                  <span className={`rounded-md ${theme.photoHospitalBadge} px-2.5 py-1 backdrop-blur-sm border`}>
                    {survivorHospitals}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Metric Chips */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className={`flex items-center gap-1.5 ${theme.detectionIcon} text-xs font-semibold uppercase`}>
                <Activity className="h-3.5 w-3.5" />
                <span>Detection</span>
              </div>
              <p className="mt-1 text-xl font-bold text-paper font-serif">{detectionLabel}</p>
              <p className="text-xs text-mist mt-0.5">{detectionSub}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold uppercase">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Treatment</span>
              </div>
              <p className="mt-1 text-xl font-bold text-paper font-serif">{chemoLabel}</p>
              <p className="text-xs text-mist mt-0.5">{chemoSub}</p>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Full Written Testimony */}
        <div className="lg:col-span-7 space-y-5 text-base sm:text-lg leading-relaxed text-paper/85 bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
          {survivorData?.introStory ? (
            <div className="space-y-4">
              <p className="text-xl text-paper font-serif leading-relaxed">
                <strong className={`${theme.nameHighlight} font-semibold`}>
                  “My name is {survivorName}.”
                </strong>
              </p>
              <p className="text-base sm:text-lg leading-relaxed whitespace-pre-line text-paper/90">
                {survivorData.introStory}
              </p>
            </div>
          ) : survivorData?.id === 'jackie' ? (
            <>
              <p className="text-xl text-paper font-serif leading-relaxed">
                <strong className={`${theme.nameHighlight} font-semibold`}>
                  “My name is Apple Jackie.
                </strong>{' '}
                I am 58 years old, married to Godfrey Ikoro, and blessed with four children.”
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
            </>
          ) : (
            <>
              <p className="text-xl text-paper font-serif leading-relaxed">
                <strong className={`${theme.nameHighlight} font-semibold`}>
                  “My name is {survivorName}
                </strong>{' '}
                and I turned 70 years old on September 5th. My journey with breast cancer began in 2009, when I discovered something unusual in my right breast.”
              </p>

              <p>
                At the time, I had heard health programs on the radio advising women to regularly check their breasts for any unusual lumps or changes. One day, while bathing, I followed that advice and examined my right breast. When I pressed the nipple, I noticed an unusual discharge mixed with blood. I was frightened even though I did not feel any lump or pain.
              </p>

              <p>
                I immediately went to Nsambya Hospital and explained what had happened to the doctor. After examining me, the doctors recommended further tests, including a biopsy. The results confirmed that I had breast cancer, which was at Stage 2.
              </p>

              <p>
                The doctors advised that the affected breast needed to be removed because they were concerned that the cancer could spread. I underwent surgery and after recovering, I was told that I needed chemotherapy at Mulago Hospital for six cycles.
              </p>
            </>
          )}

          {/* Highlighted Quote Box */}
          <div className={`rounded-2xl border-l-4 ${theme.quoteBoxBorder} ${theme.quoteBoxBg} p-5 my-3`}>
            <Quote className={`h-6 w-6 ${theme.quoteIcon} mb-2`} />
            <p className="italic text-paper font-serif text-lg sm:text-xl leading-relaxed">
              {highlightQuote}
            </p>
          </div>

          <p>
            Because I was too weak to travel myself, my family would reach out to foundation coordinators to ensure critical medicines were purchased without interruption. Their assistance made a significant difference to me and my family at a time when the financial burden was overwhelming.
          </p>

          <p className={`${theme.closingQuoteText} font-serif font-medium text-lg pt-1`}>
            “My story is a reminder of the importance of paying attention to changes in your body, seeking medical attention early, and ensuring that people facing cancer are not left alone because they cannot afford the treatment and medicines they need.”
          </p>
        </div>
      </div>

      {/* FULL WIDTH HORIZONTAL SLIDER: Key Journey Milestones */}
      <div className="mt-20 border-t border-white/10 pt-16">
        {/* Slider Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${theme.milestoneEyebrow}`}>
                Key Journey Milestones
              </p>
            </div>

            <h3 className="display mt-2 text-3xl sm:text-5xl text-paper">
              {survivorData?.milestonesHeading || 'The Path to Recovery'}
            </h3>
            <p className="text-sm text-mist mt-1">
              {survivorData?.milestonesSub || `Explore the ${stages.length} vital chapters of ${survivorName}’s courageous recovery`}
            </p>
          </div>

          {/* Slider Navigation Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={prevSlide}
              aria-label="Previous milestone"
              className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-paper transition-all duration-300 ${theme.navBtnHover} hover:scale-105 active:scale-95`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next milestone"
              className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-paper transition-all duration-300 ${theme.navBtnHover} hover:scale-105 active:scale-95`}
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
          className={`relative overflow-hidden rounded-3xl border ${theme.carouselBorder} bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-white/[0.01] shadow-2xl backdrop-blur-xl select-none`}
        >
          {/* Ambient Glow */}
          <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full ${theme.carouselGlow} blur-[80px] pointer-events-none`} />

          {/* Horizontal Moving Track */}
          <div
            className="flex w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
            style={{
              transform: `translateX(-${activeSlide * 100}%)`,
            }}
          >
            {stages.map((stg) => (
              <div
                key={stg.step}
                className="min-w-full w-full shrink-0 p-5 sm:p-8 md:p-12"
              >
                <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 items-center">
                  {/* Left Info */}
                  <div className="lg:col-span-5 space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl ${theme.stepNumber} font-bold text-base sm:text-lg font-mono shadow-lg`}>
                        {stg.step}
                      </span>
                      <div>
                        <span className={`inline-block rounded-full ${theme.stepTag} px-2.5 sm:px-3 py-0.5 text-[11px] sm:text-xs font-medium border`}>
                          {stg.tag}
                        </span>
                        <p className="text-[11px] sm:text-xs text-mist font-mono mt-0.5">
                          Year: {stg.year}
                        </p>
                      </div>
                    </div>

                    <h4 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-paper font-semibold leading-tight">
                      {stg.title}
                    </h4>

                    <p className={`text-xs sm:text-sm ${theme.stepSubtitle} font-medium`}>
                      {stg.subtitle}
                    </p>
                  </div>

                  {/* Right Info */}
                  <div className="lg:col-span-7 space-y-4 sm:space-y-5 lg:border-l lg:border-white/10 lg:pl-8">
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed text-paper/90">
                      {stg.description}
                    </p>

                    <div className="rounded-2xl border border-white/10 bg-ink/60 p-4 sm:p-5 backdrop-blur-sm">
                      <Quote className={`h-4 w-4 sm:h-5 sm:w-5 ${theme.slideQuoteIcon} mb-1`} />
                      <p className={`text-xs sm:text-sm md:text-base italic ${theme.slideQuoteText} font-serif leading-relaxed`}>
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
            {stages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="group relative h-1.5 sm:h-2 flex-1 overflow-hidden rounded-full bg-white/15 transition-all hover:bg-white/25"
              >
                {/* Completed slides */}
                {i < activeSlide && (
                  <div className={`h-full w-full rounded-full ${theme.progressBarCompleted}`} />
                )}

                {/* Active running slide */}
                {i === activeSlide && (
                  <div
                    key={`progress-survivor-${survivorData?.id}-${activeSlide}`}
                    style={{
                      animation: `runningGladysBar 5.5s linear forwards`,
                      animationPlayState: isHovered ? 'paused' : 'running',
                    }}
                    className={`h-full rounded-full ${theme.progressBarActive}`}
                  />
                )}

                {/* Upcoming slides */}
                {i > activeSlide && <div className="h-full w-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Quick-Select Milestone Navigation */}
        <div
          ref={navContainerRef}
          className={`mt-4 flex sm:grid gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-none snap-x scroll-smooth ${
            stages.length === 1
              ? 'sm:grid-cols-1 max-w-xs'
              : stages.length === 2
              ? 'sm:grid-cols-2 max-w-xl'
              : stages.length === 3
              ? 'sm:grid-cols-3'
              : stages.length === 4
              ? 'sm:grid-cols-4'
              : 'sm:grid-cols-5'
          }`}
        >
          {stages.map((stg, i) => (
            <button
              key={stg.step}
              ref={(el) => (buttonRefs.current[i] = el)}
              onClick={() => setActiveSlide(i)}
              className={`flex shrink-0 sm:shrink flex-col items-start rounded-xl sm:rounded-2xl p-3 sm:p-4 text-left transition-all duration-300 min-w-[130px] sm:min-w-0 snap-center ${
                activeSlide === i
                  ? `${theme.quickNavActive} scale-[1.02]`
                  : 'bg-white/[0.03] border border-white/10 text-mist hover:bg-white/[0.06] hover:text-paper hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-xs font-mono font-bold ${
                    activeSlide === i ? theme.quickNavActiveStep : 'text-mist'
                  }`}
                >
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

        {/* Bottom CCF Trust & Verification Banner */}
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6 backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className={`h-11 w-11 shrink-0 rounded-xl ${theme.ccfBox} font-bold flex items-center justify-center text-sm shadow-md`}>
              CCF
            </div>
            <div>
              <h5 className="text-sm sm:text-base font-semibold text-paper leading-tight">
                Cancer Charity Foundation
              </h5>
              <p className="text-xs text-mist mt-0.5 leading-relaxed">
                Dedicated to early detection, dignifying patient care, and recovery support across Uganda
              </p>
            </div>
          </div>

          <div className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-300 border border-emerald-500/30 shrink-0">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span className="text-center">
              Verified Living Testimony · Nsambya & Mulago Care
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
