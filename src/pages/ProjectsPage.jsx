import PageMeta from '../components/PageMeta'
import Container from '../components/Container'
import ScrollReveal from '../components/ScrollReveal'
import Projects from '../sections/Projects'

export default function ProjectsPage() {
  return (
    <>
      <PageMeta
        title="Projects — Gilbert Kevin Jimmy Kwizera"
        description="Published projects: education support in Fort Portal and a cancer-care story from Uganda."
      />
      <div data-scene="listing" className="bg-ivory pt-28 md:pt-36">
        <Container>
          <p data-listing-kicker className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
            Projects
          </p>
          <ScrollReveal type="text" as="h1" data-listing-title className="display mt-4 max-w-3xl text-[clamp(2.1rem,8vw,4.5rem)] leading-[1.05] text-ink">
            Projects That Impact Lives
          </ScrollReveal>
          <ScrollReveal type="block" data-listing-lede className="mt-5 max-w-xl">
            <p className="text-base leading-relaxed text-muted">
              The project records published on his site. Nothing here is added beyond that record.
            </p>
          </ScrollReveal>
        </Container>
      </div>
      <Projects showHeading={false} />
    </>
  )
}
