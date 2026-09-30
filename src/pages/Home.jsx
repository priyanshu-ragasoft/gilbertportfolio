import PageMeta from '../components/PageMeta'
import RevealImage from '../components/RevealImage'
import { projects } from '../data/projects'
import About from '../sections/About'
import Blog from '../sections/Blog'
import Contact from '../sections/Contact'
import Education from '../sections/Education'
import FeaturedStory from '../sections/FeaturedStory'
import Gallery from '../sections/Gallery'
import Hero from '../sections/Hero'
import Impact from '../sections/Impact'
import Introduction from '../sections/Introduction'
import Journey from '../sections/Journey'
import Philosophy from '../sections/Philosophy'
import Projects from '../sections/Projects'
import Values from '../sections/Values'
import LivingTestimony from '../sections/LivingTestimony'

/**
 * Chunk reveals live inside each section via <ScrollReveal>:
 *
 *   <ScrollReveal type="text">
 *     <h2>A Life Dedicated to Service, Dignity, and Hope.</h2>
 *   </ScrollReveal>
 *
 *   <ScrollReveal type="block" stagger={0.08}>
 *     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 *       {items.map((item) => <article key={item.id}>...</article>)}
 *     </div>
 *   </ScrollReveal>
 *
 * Headings use type="text" (word/line spans). Card grids use type="block"
 * (direct children, ScrollTrigger.batch when there are 4+). Hero and Journey
 * keep their own timelines. Pass debug on any wrapper to show markers.
 *
 * Image slide distance and easing: src/hooks/useImageReveal.js (SLIDE_X, SLIDE_Y, power3.out).
 * Pass direction to override auto-detect. Pass debug for ScrollTrigger markers.
 */
function ImageRevealExamples() {
  const left = projects[0]
  const right = projects[1]
  if (!left || !right) return null

  return (
    <section className="bg-ivory py-20 md:py-28">
      <div className="mx-auto grid max-w-[1180px] items-center gap-8 px-5 sm:px-8 lg:grid-cols-2">
        <RevealImage
          src={left.image}
          alt={left.imageAlt}
          direction="left"
          className="aspect-[4/3] w-full rounded-xl object-cover"
        />
        <RevealImage
          src={right.image}
          alt={right.imageAlt}
          direction="right"
          className="aspect-[4/3] w-full rounded-xl object-cover"
        />
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <PageMeta
        title="Gilbert Kevin Jimmy Kwizera"
        description="Humanitarian leader, international consultant, and volunteer. A portfolio of dignity-based care, education, and social impact."
      />
      <Hero />
      <Introduction />
      <About />
      <Journey />
      <Values />
      <Impact />
      <Projects />
      <ImageRevealExamples />
      <FeaturedStory />
      <LivingTestimony />
      <Gallery />
      <Education />
      <Blog limit={3} />
      <Philosophy />
      <Contact />
    </>
  )
}
