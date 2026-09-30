import { Link, useParams } from 'react-router-dom'
import Container from '../components/Container'
import ImageFrame from '../components/ImageFrame'
import PageMeta from '../components/PageMeta'
import ScrollReveal from '../components/ScrollReveal'
import { projects } from '../data/projects'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    return (
      <Container data-scene="missing" className="py-40">
        <h1 data-missing="title" className="display text-5xl">
          Project not found
        </h1>
        <Link data-missing="link" to="/projects" className="mt-6 inline-block text-sm hover:text-bronze">
          Back to projects
        </Link>
      </Container>
    )
  }

  return (
    <>
      <PageMeta title={`${project.title} — Gilbert Kevin Jimmy Kwizera`} description={project.summary} />
      <article data-scene="detail" className="bg-paper pt-28 pb-20 md:pt-36">
        <Container>
          <p data-detail="meta" className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
            {project.category}
            <span className="mx-2 text-bronze">/</span>
            {project.date}
          </p>
          <ScrollReveal type="text" as="h1" data-detail="title" className="display mt-4 max-w-4xl text-5xl text-ink sm:text-7xl">
            {project.title}
          </ScrollReveal>
          <div className="mt-10">
            <ImageFrame
              src={project.image}
              alt={project.imageAlt}
              fit={project.imageFit || 'cover'}
              parallax={project.imageParallax ?? (project.imageFit !== 'contain')}
              position={project.imagePosition || (project.imageFit === 'contain' ? 'center' : 'center 12%')}
              className={project.imageClassName || (project.imageFit === 'contain' ? 'aspect-[3/2]' : 'aspect-[16/9]')}
              priority
            />
          </div>
          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <ScrollReveal type="block" stagger={0.1} className="space-y-5 text-base leading-relaxed text-muted sm:text-lg lg:col-span-7">
              {project.paragraphs.map((paragraph) => (
                <p data-detail="body" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </ScrollReveal>
            <ScrollReveal type="block" stagger={0.06} as="ul" className="h-fit border border-line bg-ivory p-6 lg:col-span-4 lg:col-start-9">
              {project.tags.map((tag) => (
                <li data-detail="aside" key={tag} className="border-b border-line py-3 text-sm last:border-b-0">
                  {tag}
                </li>
              ))}
            </ScrollReveal>
          </div>
          {project.gallery?.length ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 items-start">
              {project.gallery.map((image) => (
                <ImageFrame
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  fit={image.fit || 'cover'}
                  parallax={image.parallax ?? false}
                  position={image.position || 'center top'}
                  className={image.className || 'aspect-[4/3]'}
                />
              ))}
            </div>
          ) : null}
          <Link data-detail="back" to="/projects" className="mt-12 inline-block text-sm font-medium hover:text-bronze">
            All projects
          </Link>
        </Container>
      </article>
    </>
  )
}
