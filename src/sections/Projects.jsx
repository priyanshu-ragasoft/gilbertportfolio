import { useState, useEffect } from 'react'
import Container from '../components/Container'
import ProjectCard from '../components/ProjectCard'
import SectionHeading from '../components/SectionHeading'
import { projects as initialProjects } from '../data/projects'
import { projectAPI } from '../services/api'
import { resolveAsset } from '../utils/resolveAsset'

export default function Projects({ showHeading = true }) {
  const [sectionData, setSectionData] = useState(() => {
    const cached = localStorage.getItem('gilbert_cached_projects')
    if (cached) {
      try {
        return JSON.parse(cached)
      } catch (e) {
        // ignore
      }
    }
    return {
      eyebrow: 'Selected work',
      title: 'Projects That Impact Lives',
      leadText:
        'Documented initiatives spanning education in Fort Portal, cancer care advocacy, pan-African employment awareness, and global cultural dialogue.',
      projects: initialProjects,
    }
  })

  useEffect(() => {
    const loadProjectsData = async () => {
      try {
        const res = await projectAPI.getProjects()
        if (res.success && res.data) {
          const formatted = {
            eyebrow: res.data.eyebrow || 'Selected work',
            title: res.data.title || 'Projects That Impact Lives',
            leadText:
              res.data.leadText ||
              'Documented initiatives spanning education in Fort Portal, cancer care advocacy, pan-African employment awareness, and global cultural dialogue.',
            projects:
              res.data.projects && res.data.projects.length > 0
                ? res.data.projects
                : initialProjects,
          }
          setSectionData(formatted)
          localStorage.setItem('gilbert_cached_projects', JSON.stringify(formatted))
        }
      } catch (err) {
        // Keep cached/default on error
      }
    }

    loadProjectsData()

    const handleUpdate = (e) => {
      if (e.detail) {
        setSectionData(e.detail)
      }
    }

    window.addEventListener('gilbert_projects_updated', handleUpdate)
    return () => window.removeEventListener('gilbert_projects_updated', handleUpdate)
  }, [])

  const activeProjects = sectionData.projects.map((proj) => ({
    ...proj,
    image: resolveAsset(proj.image),
    heroImage: proj.heroImage ? resolveAsset(proj.heroImage) : undefined,
    gallery: Array.isArray(proj.gallery)
      ? proj.gallery.map((g) => ({
          ...g,
          src: resolveAsset(g.src),
        }))
      : [],
  }))

  return (
    <section
      id="projects"
      data-scene="projects"
      className={`bg-ivory ${showHeading ? 'py-20 md:py-32' : 'pt-12 pb-20 md:pb-32'}`}
    >
      <Container>
        {showHeading ? (
          <SectionHeading eyebrow={sectionData.eyebrow} title={sectionData.title}>
            {sectionData.leadText}
          </SectionHeading>
        ) : null}
        <div className={`space-y-20 md:space-y-28 ${showHeading ? 'mt-16' : ''}`}>
          {activeProjects.map((project, index) => (
            <ProjectCard key={project.slug || index} project={project} reverse={index % 2 === 1} />
          ))}
        </div>
      </Container>
    </section>
  )
}
