import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { journeyChapters } from '../../data/journeyLocations'

function ChapterCard({ chapter }) {
  return (
    <article
      data-journey-chapter={chapter.id}
      className="absolute inset-0 flex items-center justify-between gap-3 sm:grid sm:grid-cols-[minmax(0,1fr)_12.5rem] xl:grid-cols-[minmax(0,1fr)_14rem]"
    >
      <div className="min-w-0 flex-1 pr-1 sm:pr-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-sans text-[0.66rem] sm:text-xs font-semibold tracking-[0.2em] text-[#C9A15A]">{chapter.index}</span>
          <span className="h-px w-2.5 sm:w-3 bg-[#C9A15A]/40" />
          <span className="font-sans text-[0.6rem] sm:text-[0.66rem] tracking-[0.16em] text-[#b7b0a6] uppercase">{chapter.date}</span>
        </div>
        <h3 className="display mt-1 sm:mt-2 text-base sm:text-2xl xl:text-[2.2rem] leading-tight text-[#f4f0e8] line-clamp-2">{chapter.title}</h3>
        <p className="mt-1 sm:mt-2.5 text-[0.72rem] sm:text-xs xl:text-[0.84rem] leading-relaxed text-[#b7b0a6] line-clamp-2 sm:line-clamp-4">{chapter.description}</p>
        <Link
          data-journey-cta
          to={chapter.href}
          className="mt-2 sm:mt-3.5 inline-flex items-center gap-1.5 sm:gap-2 text-[0.72rem] sm:text-sm font-medium text-[#f4f0e8] transition-colors hover:text-[#C9A15A]"
        >
          {chapter.cta}
          <ArrowUpRight data-journey-arrow className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div
        data-journey-figure={chapter.id}
        className="relative shrink-0 w-[82px] xs:w-[96px] sm:w-full sm:max-w-none"
      >
        {/* Luxury Gold Bezel Frame */}
        <div className="relative aspect-[3/4] max-h-[115px] xs:max-h-[135px] sm:max-h-[265px] w-full overflow-hidden rounded-xl sm:rounded-2xl border border-[#C9A15A]/35 bg-gradient-to-b from-[#1a1815] to-[#0D0D0C] p-0.5 sm:p-1 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.85),0_0_16px_-6px_rgba(201,161,90,0.22)]">
          <div className="relative h-full w-full overflow-hidden rounded-[10px] sm:rounded-[14px]">
            <img
              src={chapter.image}
              alt={chapter.imageAlt}
              className="h-full w-full object-cover object-[center_top] transition-transform duration-700 hover:scale-105"
              data-journey-photo
            />
            {/* Subtle Gradient Vignette */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />
            
            {/* Location Pill Badge */}
            <div className="absolute top-1 left-1 sm:top-2.5 sm:left-2.5 flex items-center gap-1 sm:gap-1.5 rounded-full border border-[#C9A15A]/40 bg-black/85 px-1.5 py-0.5 sm:px-2 backdrop-blur-md shadow-md">
              <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-[#C9A15A] animate-pulse" />
              <span className="font-sans text-[0.52rem] sm:text-[0.6rem] font-medium tracking-wider sm:tracking-widest text-[#C9A15A] uppercase">
                {chapter.shortLocation}
              </span>
            </div>

            {/* Year Tag */}
            <div className="absolute right-1 bottom-1 sm:right-2.5 sm:bottom-2.5 rounded border border-white/10 bg-black/75 px-1.5 py-0.5 sm:px-2 backdrop-blur-sm">
              <span className="font-sans text-[0.5rem] sm:text-[0.58rem] tracking-wider text-[#d9d0c4] uppercase">
                {chapter.year}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function JourneyContent({ chapters }) {
  const items = Array.isArray(chapters) && chapters.length > 0 ? chapters : journeyChapters
  return (
    <div className="relative min-h-[8.5rem] xs:min-h-[9.8rem] sm:min-h-[17rem] lg:min-h-[17.5rem]" aria-live="polite">
      {items.map((chapter) => (
        <ChapterCard key={chapter.id} chapter={chapter} />
      ))}
    </div>
  )
}

export function JourneyChapterList({ chapters }) {
  const items = Array.isArray(chapters) && chapters.length > 0 ? chapters : journeyChapters
  return (
    <div className="mt-10 space-y-8">
      {items.map((chapter) => (
        <article key={chapter.id} className="grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-[minmax(0,1fr)_12rem]">
          <div>
            <p className="font-sans text-xs tracking-[0.2em] text-[#C9A15A]">
              {chapter.index}
              <span className="mx-2 text-[#8a847c]">/</span>
              {chapter.date || chapter.year}
            </p>
            <h3 className="display mt-2 text-4xl text-[#f4f0e8]">{chapter.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#b7b0a6]">{chapter.description}</p>
            <Link to={chapter.href} className="mt-4 inline-flex items-center gap-2 text-sm text-[#f4f0e8]">
              {chapter.cta}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <img src={chapter.image} alt={chapter.imageAlt} className="h-40 w-full object-cover object-[center_12%] sm:h-full" />
        </article>
      ))}
    </div>
  )
}
