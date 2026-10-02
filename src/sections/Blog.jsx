import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import BlogCard from '../components/BlogCard'
import Button from '../components/Button'
import Container from '../components/Container'
import SectionHeading from '../components/SectionHeading'
import { posts as defaultPosts } from '../data/blog'
import { blogAPI, insightsSectionAPI } from '../services/api'
import { resolveAsset } from '../utils/resolveAsset'

const DEFAULT_INSIGHTS_CONFIG = {
  eyebrow: 'Insights',
  title: 'Notes from the work',
  leadText:
    'Essays and short films published on his site, kept in his own record rather than retold as something else.',
  buttonText: 'View All Blog & Insights',
  buttonLink: '/blog',
  featuredSlug: 'pio-system-and-gilbert-kevin-jimmy-kwizeras-innovation-role',
  bottomNote: 'Looking for the project records? They live on the projects page.',
}

export default function Blog({ limit, page = false }) {
  const [insightsConfig, setInsightsConfig] = useState(() => {
    const cached = localStorage.getItem('gilbert_cached_insights')
    if (cached) {
      try {
        return JSON.parse(cached)
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_INSIGHTS_CONFIG
  })

  const [allPosts, setAllPosts] = useState(defaultPosts)

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const [sectionRes, blogRes] = await Promise.allSettled([
          insightsSectionAPI.getInsightsSection(),
          blogAPI.getBlogs(),
        ])

        if (sectionRes.status === 'fulfilled' && sectionRes.value?.success && sectionRes.value?.data) {
          setInsightsConfig(sectionRes.value.data)
          localStorage.setItem('gilbert_cached_insights', JSON.stringify(sectionRes.value.data))
        }

        if (blogRes.status === 'fulfilled' && blogRes.value?.success && blogRes.value?.data?.length > 0) {
          setAllPosts(blogRes.value.data)
        }
      } catch (e) {
        // keep cached / defaults
      }
    }

    loadInsights()

    const handleUpdate = (e) => {
      if (e.detail) {
        setInsightsConfig(e.detail)
      }
    }

    window.addEventListener('gilbert_insights_updated', handleUpdate)
    return () => window.removeEventListener('gilbert_insights_updated', handleUpdate)
  }, [])

  // Resolve posts with image asset resolver
  const resolvedPosts = useMemo(() => {
    return allPosts.map((p) => ({
      ...p,
      image: resolveAsset(p.image),
      gallery: Array.isArray(p.gallery)
        ? p.gallery.map((g) => ({
            ...g,
            src: resolveAsset(g.src),
          }))
        : [],
    }))
  }, [allPosts])

  // Featured post resolution based on configured featuredSlug
  const { featured, rest } = useMemo(() => {
    const visible = typeof limit === 'number' ? resolvedPosts.slice(0, limit) : resolvedPosts
    if (visible.length === 0) return { featured: defaultPosts[0], rest: [] }

    let feat = visible.find((p) => p.slug === insightsConfig.featuredSlug)
    if (!feat) feat = visible[0]

    const other = visible.filter((p) => p.slug !== feat.slug)
    return { featured: feat, rest: other }
  }, [resolvedPosts, insightsConfig.featuredSlug, limit])

  return (
    <section
      id="insights"
      data-scene="insights"
      className={`bg-ivory ${page ? 'pt-32 pb-20 md:pt-40 md:pb-32' : 'py-20 md:py-32'}`}
    >
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            as={page ? 'h1' : 'h2'}
            eyebrow={insightsConfig.eyebrow || 'Insights'}
            title={insightsConfig.title || 'Notes from the work'}
          >
            {insightsConfig.leadText}
          </SectionHeading>
          {limit ? (
            <Button
              to={insightsConfig.buttonLink || '/blog'}
              data-insights-action
              variant="ghost"
              className="shrink-0 text-ink"
            >
              {insightsConfig.buttonText || 'View All Blog & Insights'}
            </Button>
          ) : null}
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          {featured && (
            <div data-feature className="lg:col-span-7">
              <BlogCard post={featured} layout="feature" />
            </div>
          )}
          <div data-side className="space-y-8 lg:col-span-5">
            {rest.map((post) => (
              <div key={post.slug}>
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        </div>

        {!limit ? (
          <p data-insights-note className="mt-16 text-sm text-muted">
            Looking for the project records? They live on the{' '}
            <Link to="/projects" className="text-ink underline decoration-line underline-offset-4">
              projects
            </Link>{' '}
            page.
          </p>
        ) : null}
      </Container>
    </section>
  )
}
