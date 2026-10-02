import { Link, useParams } from 'react-router-dom'
import Container from '../components/Container'
import ImageFrame from '../components/ImageFrame'
import PageMeta from '../components/PageMeta'
import ScrollReveal from '../components/ScrollReveal'
import { impactAreas } from '../data/impact'

export default function ImpactDetail() {
  const { slug } = useParams()
  const area = impactAreas.find((item) => item.slug === slug)

  if (!area) {
    return (
      <Container data-scene="missing" className="py-40">
        <h1 data-missing="title" className="display text-5xl">
          This page is not available
        </h1>
        <Link data-missing="link" to="/#impact" className="mt-6 inline-block text-sm hover:text-bronze">
          Back to impact
        </Link>
      </Container>
    )
  }

  return (
    <>
      <PageMeta title={`${area.organization} — Gilbert Kevin Jimmy Kwizera`} description={area.summary} />
      <article data-scene="detail" className="bg-paper pt-28 pb-20 md:pt-36">
        <Container>
          <p data-detail="meta" className="text-xs font-medium uppercase tracking-[0.2em] text-bronze">
            {area.number}
          </p>
          <ScrollReveal type="text" as="h1" data-detail="title" className="display mt-3 max-w-4xl break-words text-[clamp(2rem,8vw,4.5rem)] leading-[1.05] text-ink">
            {area.title}
          </ScrollReveal>
          <ScrollReveal type="block" stagger={0.1}>
            <p data-detail="standfirst" className="mt-4 text-lg text-ink">
              {area.organization}
            </p>
            <p data-detail="standfirst" className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
              {area.summary}
            </p>
          </ScrollReveal>
          <div className="mt-10">
            <ImageFrame src={area.image} alt={area.imageAlt} className="aspect-[16/9]" priority />
          </div>
          <div className="mt-10 grid gap-12 lg:grid-cols-12">
            <ScrollReveal type="block" stagger={0.1} className="space-y-5 text-base leading-relaxed text-muted sm:text-lg lg:col-span-7">
              {area.paragraphs.map((paragraph) => (
                <p data-detail="body" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </ScrollReveal>
            <ScrollReveal type="block" stagger={0.08} as="ol" className="space-y-6 lg:col-span-4 lg:col-start-9">
              {area.points.map((point, index) => (
                <li key={point.title} data-detail="aside">
                  <p className="text-xs tracking-[0.16em] text-bronze">0{index + 1}</p>
                  <h2 className="mt-2 text-lg text-ink">{point.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{point.text}</p>
                </li>
              ))}
            </ScrollReveal>
          </div>
          {area.gallery?.length ? (
            <div className="mt-12">
              {area.gallery.map((image) => (
                <ImageFrame key={image.src} src={image.src} alt={image.alt} className="aspect-[16/10]" />
              ))}
            </div>
          ) : null}
          <Link data-detail="back" to="/#impact" className="mt-12 inline-block text-sm font-medium hover:text-bronze">
            All areas of impact
          </Link>
        </Container>
      </article>
    </>
  )
}
