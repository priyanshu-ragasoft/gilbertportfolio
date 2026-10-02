import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Container from '../components/Container'
import ImageFrame from '../components/ImageFrame'
import PageMeta from '../components/PageMeta'
import ScrollReveal from '../components/ScrollReveal'
import { projects as defaultProjects } from '../data/projects'
import { projectAPI } from '../services/api'
import { resolveAsset } from '../utils/resolveAsset'

export default function ProjectDetail() {
  const { slug } = useParams()
  const [allProjects, setAllProjects] = useState(() => {
    const cached = localStorage.getItem('gilbert_cached_projects')
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (parsed.projects && parsed.projects.length > 0) {
          return parsed.projects
        }
      } catch (e) {
        // ignore
      }
    }
    return defaultProjects
  })

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await projectAPI.getProjects()
        if (res.success && res.data?.projects) {
          setAllProjects(res.data.projects)
        }
      } catch (e) {
        // fallback
      }
    }
    fetchLatest()

    const handleUpdate = (e) => {
      if (e.detail?.projects) {
        setAllProjects(e.detail.projects)
      }
    }
    window.addEventListener('gilbert_projects_updated', handleUpdate)
    return () => window.removeEventListener('gilbert_projects_updated', handleUpdate)
  }, [])

  const rawProject = allProjects.find((item) => item.slug === slug)

  if (!rawProject) {
    return (
      <Container data-scene="missing" className="py-40">
        <h1 data-missing="title" className="display text-3xl sm:text-5xl">
          Project not found
        </h1>
        <Link data-missing="link" to="/projects" className="mt-6 inline-block text-sm hover:text-bronze">
          Back to projects
        </Link>
      </Container>
    )
  }

  const project = {
    ...rawProject,
    image: resolveAsset(rawProject.image),
    heroImage: rawProject.heroImage ? resolveAsset(rawProject.heroImage) : undefined,
    gallery: Array.isArray(rawProject.gallery)
      ? rawProject.gallery.map((g) => ({
          ...g,
          src: resolveAsset(g.src),
        }))
      : [],
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
          <ScrollReveal type="text" as="h1" data-detail="title" className="display mt-4 max-w-4xl text-[clamp(2rem,8vw,4.5rem)] leading-[1.05] text-ink">
            {project.title}
          </ScrollReveal>
          <div className="mt-10">
            <ImageFrame
              src={project.image}
              alt={project.imageAlt || project.title}
              fit={project.imageFit || 'cover'}
              parallax={project.imageParallax ?? (project.imageFit !== 'contain')}
              position={project.imagePosition || (project.imageFit === 'contain' ? 'center' : 'center 12%')}
              className={project.imageClassName || (project.imageFit === 'contain' ? 'aspect-[3/2]' : 'aspect-[16/9]')}
              priority
            />
          </div>
          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <ScrollReveal type="block" stagger={0.1} className="space-y-5 text-base leading-relaxed text-muted sm:text-lg lg:col-span-7">
              {project.paragraphs?.map((paragraph, pIdx) => (
                <p data-detail="body" key={pIdx}>
                  {paragraph}
                </p>
              ))}
            </ScrollReveal>
            {project.tags?.length > 0 && (
              <ScrollReveal type="block" stagger={0.06} as="ul" className="h-fit border border-line bg-ivory p-6 lg:col-span-4 lg:col-start-9">
                {project.tags.map((tag) => (
                  <li data-detail="aside" key={tag} className="border-b border-line py-3 text-sm last:border-b-0">
                    {tag}
                  </li>
                ))}
              </ScrollReveal>
            )}
          </div>
          {project.gallery?.length ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 items-start">
              {project.gallery.map((image, idx) => (
                <ImageFrame
                  key={image.src || idx}
                  src={image.src}
                  alt={image.alt || project.title}
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
