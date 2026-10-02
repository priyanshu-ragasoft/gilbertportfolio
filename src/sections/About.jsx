import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Container from '../components/Container'
import AboutPortrait3D from '../components/AboutPortrait3D'
import ScrollReveal from '../components/ScrollReveal'
import { profile, roles as defaultRoles } from '../data/profile'
import { aboutAPI } from '../services/api'

const DEFAULT_ABOUT = {
  kicker: 'About',
  headline: 'Who is Gilbert Kevin Jimmy Kwizera?',
  bodyText:
    'A humanitarian leader, international consultant, and volunteer. Born in Kampala on 30 November 1971, trained in information systems and finance, and now based in the United Arab Emirates. The public measure of the work is simple: whether it protects dignity and can be sustained.',
  portraitImage: profile.portrait || '/src/assets/images/gilbert-kwizera-lounge-armchair.jpg',
  badgeTopText: 'EST. 1971',
  badgeSubText: 'Kampala · Dubai',
  profileLinkText: 'Read the full profile',
  profileLinkUrl: '/about',
  roles: defaultRoles || [
    {
      title: 'Humanitarian leader',
      text: 'Founder of the Cancer Charity Foundation and Haven Welfare, with the work measured by dignity, consistency, and care.',
    },
    {
      title: 'International consultant',
      text: 'A consultant and social entrepreneur based in the United Arab Emirates, focused on ethical, people-centred decisions.',
    },
  ],
}

export default function About() {
  const [data, setData] = useState(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem('gilbert_cached_about') : null
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        return { ...DEFAULT_ABOUT, ...parsed }
      } catch (e) {}
    }
    return DEFAULT_ABOUT
  })

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e?.detail) {
        setData((prev) => ({ ...prev, ...e.detail }))
      }
    }

    window.addEventListener('gilbert_about_updated', handleUpdate)

    const fetchLiveAbout = async () => {
      try {
        const res = await aboutAPI.getAbout()
        if (res.success && res.data) {
          setData((prev) => ({
            ...DEFAULT_ABOUT,
            ...res.data,
          }))
          localStorage.setItem('gilbert_cached_about', JSON.stringify(res.data))
        }
      } catch (err) {
        // Keep cached state
      }
    }

    fetchLiveAbout()

    return () => {
      window.removeEventListener('gilbert_about_updated', handleUpdate)
    }
  }, [])

  const activeRoles = data.roles?.length ? data.roles : defaultRoles

  return (
    <section id="about" data-scene="about" className="bg-ivory py-20 md:py-32">
      <Container className="grid items-center gap-12 lg:grid-cols-12">
        <div data-about-visual className="lg:col-span-5">
          <AboutPortrait3D
            image={data.portraitImage}
            badgeTopText={data.badgeTopText}
            badgeSubText={data.badgeSubText}
          />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p
            data-about-kicker
            className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-muted"
          >
            <span className="h-px w-8 bg-bronze" aria-hidden="true" />
            {data.kicker || 'About'}
          </p>
          <ScrollReveal
            type="text"
            as="h2"
            className="display mt-4 text-4xl text-ink sm:text-5xl md:text-6xl"
          >
            {data.headline || 'Who is Gilbert Kevin Jimmy Kwizera?'}
          </ScrollReveal>
          <ScrollReveal type="block">
            <p data-about-body className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
              {data.bodyText ||
                'A humanitarian leader, international consultant, and volunteer. Born in Kampala on 30 November 1971, trained in information systems and finance, and now based in the United Arab Emirates. The public measure of the work is simple: whether it protects dignity and can be sustained.'}
            </p>
          </ScrollReveal>
          <ScrollReveal
            type="block"
            stagger={0.1}
            as="ul"
            className="mt-8 divide-y divide-line border-y border-line"
            data-stagger
          >
            {activeRoles.map((role, rIdx) => (
              <li
                key={`${role.title}-${rIdx}`}
                data-stagger-item
                className="grid gap-2 py-4 sm:grid-cols-[180px_1fr] sm:gap-6"
              >
                <p className="text-sm font-medium text-ink">{role.title}</p>
                <p className="text-sm leading-relaxed text-muted">{role.text}</p>
              </li>
            ))}
          </ScrollReveal>
          <Link
            to={data.profileLinkUrl || '/about'}
            data-about-link
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-bronze"
          >
            {data.profileLinkText || 'Read the full profile'}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
