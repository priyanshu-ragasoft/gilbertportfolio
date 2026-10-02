import { journeyChapters } from '../../data/journeyLocations'
import { ScrollTrigger } from '../../animations/gsapConfig'
import { lenis } from '../../hooks/useLenis'

export default function JourneyTimeline({ orientation = 'horizontal', chapters }) {
  const vertical = orientation === 'vertical'
  const items = Array.isArray(chapters) && chapters.length > 0 ? chapters : journeyChapters

  const scrollToChapter = (index) => {
    const journeySection = document.getElementById('journey')
    if (!journeySection) return
    const allTriggers = ScrollTrigger?.getAll() || []
    const trigger = allTriggers.find((st) => st.trigger === journeySection)
    if (trigger) {
      const count = items.length
      const stepProgress = Math.min(0.999, Math.max(0, (index + 0.4) / count))
      const targetScroll = trigger.start + (trigger.end - trigger.start) * stepProgress
      if (lenis) {
        lenis.scrollTo(targetScroll, { duration: 1.2 })
      } else {
        window.scrollTo({ top: targetScroll, behavior: 'smooth' })
      }
    }
  }

  if (vertical) {
    return (
      <nav
        aria-label="Journey timeline"
        className="relative flex flex-col justify-center py-4 pl-4 pr-1 select-none"
      >
        <div
          className="absolute top-5 bottom-5 left-[2.2rem] w-[1.5px] rounded-full bg-white/10"
          aria-hidden="true"
        />
        <div
          data-journey-line="y"
          className="absolute top-5 bottom-5 left-[2.2rem] w-[1.5px] origin-top rounded-full bg-gradient-to-b from-[#C9A15A] via-[#f5deb3] to-[#C9A15A] shadow-[0_0_8px_rgba(201,161,90,0.85)]"
          aria-hidden="true"
        />

        <ol className="relative flex flex-col gap-5 xl:gap-6">
          {items.map((chapter, index) => (
            <li
              key={chapter.id}
              data-journey-step-item={chapter.id}
              className="group relative flex cursor-pointer items-center gap-3 text-left transition-transform duration-300 hover:translate-x-1"
              onClick={() => scrollToChapter(index)}
            >
              <span
                data-journey-step={chapter.id}
                className="w-5 text-right font-sans text-[0.68rem] tracking-[0.16em] text-[#8a847c] transition-colors duration-300 group-hover:text-[#f4f0e8]"
              >
                {chapter.index}
              </span>

              <div className="relative flex h-5 w-5 items-center justify-center">
                <span
                  data-journey-node-glow={chapter.id}
                  className="absolute inset-0 rounded-full border border-[#C9A15A]/60 opacity-0 transition-opacity duration-300"
                  aria-hidden="true"
                />
                <span
                  data-journey-node={chapter.id}
                  className="relative z-10 h-2.5 w-2.5 rounded-full border border-[#C9A15A]/40 bg-[#0D0D0C] transition-all duration-300 group-hover:scale-125 group-hover:border-[#C9A15A]"
                  aria-hidden="true"
                />
              </div>

              <div className="flex flex-col leading-none">
                <span
                  data-journey-year={chapter.id}
                  className="font-sans text-[0.64rem] font-medium tracking-[0.14em] text-[#8a847c] uppercase transition-colors duration-300 group-hover:text-[#f4f0e8]"
                >
                  {chapter.year}
                </span>
                <span
                  data-journey-step-loc={chapter.id}
                  className="mt-1 font-sans text-[0.72rem] tracking-[0.08em] whitespace-nowrap text-[#8a847c] uppercase transition-colors duration-300 group-hover:text-[#C9A15A]"
                >
                  {chapter.shortLocation}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    )
  }

  // Wave vertical offsets for the 7 undulating milestones
  const waveOffsets = [
    'translate-y-1 sm:translate-y-2',           // 0: Uganda (entry)
    '-translate-y-1.5 sm:-translate-y-2.5',     // 1: Bangalore (crest)
    'translate-y-2 sm:translate-y-2.5',         // 2: Uganda Mine (trough)
    '-translate-y-2 sm:-translate-y-3',         // 3: Ethiopia (high crest)
    'translate-y-2 sm:translate-y-2.5',         // 4: Dubai (trough)
    '-translate-y-1.5 sm:-translate-y-2.5',     // 5: South Africa (crest)
    'translate-y-0.5 sm:translate-y-1',         // 6: Russia (smooth finale)
  ]

  // Horizontal Timeline (Modern Fluid Stepper with Undulating Curved Wave)
  return (
    <nav
      aria-label="Journey timeline"
      className="relative w-full overflow-x-auto px-1 pt-2 pb-1 sm:px-2 sm:pt-2.5 sm:pb-1.5 select-none"
    >
      <div className="relative min-w-[34rem] sm:min-w-full">
      {/* Background Ambient SVG Wave Track */}
      <svg
        className="pointer-events-none absolute inset-x-2 top-0 h-10 w-[calc(100%-1rem)] sm:inset-x-4 sm:h-12 sm:w-[calc(100%-2rem)]"
        viewBox="0 0 1000 60"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="wave-gold-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A15A" stopOpacity="0.8" />
            <stop offset="25%" stopColor="#fae8be" />
            <stop offset="50%" stopColor="#C9A15A" />
            <stop offset="75%" stopColor="#fae8be" />
            <stop offset="100%" stopColor="#C9A15A" />
          </linearGradient>
          <filter id="wave-gold-glow" x="-30%" y="-50%" width="160%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Dark Guiding Wave */}
        <path
          pathLength="1000"
          d="M 15 36 C 85 44, 145 16, 214 16 C 285 16, 310 44, 357 44 C 410 44, 445 14, 500 14 C 555 14, 590 44, 643 44 C 700 44, 735 16, 786 16 C 845 16, 885 34, 985 34"
          fill="none"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Subtle Dotted Secondary Energy Guide */}
        <path
          pathLength="1000"
          d="M 15 36 C 85 44, 145 16, 214 16 C 285 16, 310 44, 357 44 C 410 44, 445 14, 500 14 C 555 14, 590 44, 643 44 C 700 44, 735 16, 786 16 C 845 16, 885 34, 985 34"
          fill="none"
          stroke="rgba(201, 161, 90, 0.3)"
          strokeWidth="1"
          strokeDasharray="4 6"
          strokeLinecap="round"
        />

        {/* Gold wave draws along the track as the journey scroll progresses */}
        <path
          data-journey-line="x"
          d="M 15 36 C 85 44, 145 16, 214 16 C 285 16, 310 44, 357 44 C 410 44, 445 14, 500 14 C 555 14, 590 44, 643 44 C 700 44, 735 16, 786 16 C 845 16, 885 34, 985 34"
          fill="none"
          stroke="url(#wave-gold-gradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#wave-gold-glow)"
        />
      </svg>

      <ol className="relative z-10 flex items-center justify-between">
        {items.map((chapter, index) => (
          <li
            key={chapter.id}
            data-journey-step-item={chapter.id}
            className="group relative flex cursor-pointer flex-col items-center text-center"
            onClick={() => scrollToChapter(index)}
          >
            {/* Medallion Node (Number inside illuminated glass circle) */}
            <div className={`relative flex h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 items-center justify-center transition-transform duration-300 group-hover:-translate-y-0.5 ${waveOffsets[index] || ''}`}>
              {/* Outer Glowing Beacon Aura */}
              <span
                data-journey-node-glow={chapter.id}
                className="absolute -inset-1 rounded-full border border-[#C9A15A] opacity-0 transition-opacity duration-300 shadow-[0_0_16px_rgba(201,161,90,0.85)]"
                aria-hidden="true"
              />

              {/* Circular Medallion Body */}
              <span
                data-journey-node={chapter.id}
                className="relative z-10 flex h-full w-full items-center justify-center rounded-full border border-white/20 bg-[#141311] transition-all duration-300 shadow-md group-hover:border-[#C9A15A]"
                aria-hidden="true"
              >
                <span
                  data-journey-step={chapter.id}
                  className="font-sans text-[0.55rem] xs:text-[0.62rem] sm:text-[0.72rem] font-semibold tracking-wider text-[#8a847c] transition-colors duration-300 group-hover:text-[#f4f0e8]"
                >
                  {chapter.index}
                </span>
              </span>
            </div>

            {/* Micro Year / Category Tag */}
            <span
              data-journey-year={chapter.id}
              className="mt-3.5 sm:mt-5 font-sans text-[0.46rem] xs:text-[0.52rem] sm:text-[0.62rem] font-medium tracking-[0.04em] sm:tracking-[0.14em] text-[#8a847c] uppercase transition-colors duration-300 group-hover:text-[#f4f0e8] whitespace-nowrap"
            >
              {chapter.year}
            </span>

            {/* Clean Location Tag with Pulse Indicator */}
            <div
              data-journey-step-chip={chapter.id}
              className="mt-0.5 flex items-center gap-1 px-1 py-0.5 transition-all duration-300"
            >
              <span
                data-journey-chip-dot={chapter.id}
                className="h-1 w-1 rounded-full bg-[#C9A15A] opacity-0 transition-opacity duration-300"
              />
              <span
                data-journey-step-loc={chapter.id}
                className="font-sans text-[0.46rem] xs:text-[0.52rem] sm:text-[0.64rem] tracking-[0.04em] sm:tracking-[0.08em] whitespace-nowrap text-[#8a847c] uppercase transition-colors duration-300 group-hover:text-[#C9A15A]"
              >
                {chapter.shortLocation}
              </span>
            </div>
          </li>
        ))}
      </ol>
      </div>
    </nav>
  )
}
