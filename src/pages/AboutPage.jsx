import { Link } from 'react-router-dom'
import Container from '../components/Container'
import AboutPortrait3D from '../components/AboutPortrait3D'
import PageMeta from '../components/PageMeta'
import ScrollReveal from '../components/ScrollReveal'
import { biography, educationNotes, journey, profile, roles } from '../data/profile'

export default function AboutPage() {
  return (
    <>
      <PageMeta
        title="About — Gilbert Kevin Jimmy Kwizera"
        description="Biography of Gilbert Kevin Jimmy Kwizera, humanitarian leader, international consultant, and volunteer."
      />
      <article data-scene="profile" className="bg-paper pt-28 pb-20 md:pt-36 md:pb-28">
        <Container>
          <p data-profile="kicker" className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
            About
          </p>
          <ScrollReveal type="text" as="h1" data-profile="title" className="display mt-4 max-w-4xl text-[clamp(2.1rem,8vw,4.5rem)] leading-[1.05] text-ink">
            Who is Gilbert Kevin Jimmy Kwizera?
          </ScrollReveal>
          <div className="mt-12 grid items-start gap-12 lg:grid-cols-12">
            <div data-profile="portrait" className="lg:sticky lg:top-28 lg:col-span-5">
              <AboutPortrait3D />
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p data-profile="role" className="text-sm font-medium text-bronze">
                {profile.title}
              </p>
              <ScrollReveal type="block" stagger={0.1} className="mt-6 space-y-5 text-base leading-relaxed text-muted sm:text-lg">
                {biography.map((paragraph) => (
                  <p data-profile="bio" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </ScrollReveal>
            </div>
          </div>

          <ScrollReveal type="block" stagger={0.1} className="mt-20 grid gap-10 border-t border-line pt-12 md:grid-cols-3">
            {roles.map((role) => (
              <div key={role.title} data-profile="role-card">
                <h2 className="display text-3xl text-ink">{role.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{role.text}</p>
              </div>
            ))}
          </ScrollReveal>

          <div className="mt-20 grid gap-10 lg:grid-cols-12">
            <ScrollReveal type="text" as="h2" data-profile="education-title" className="display text-4xl text-ink lg:col-span-4">
              Education
            </ScrollReveal>
            <ScrollReveal type="block" stagger={0.08} as="ul" className="space-y-5 lg:col-span-7 lg:col-start-6">
              {educationNotes.map((note) => (
                <li
                  key={note}
                  data-profile="education-item"
                  className="border-t border-line pt-5 text-base leading-relaxed text-muted"
                >
                  {note}
                </li>
              ))}
            </ScrollReveal>
          </div>

          <div className="mt-20">
            <ScrollReveal type="text" as="h2" data-profile="miles-title" className="display text-4xl text-ink">
              Milestones
            </ScrollReveal>
            <ScrollReveal type="block" stagger={0.08} as="ol" className="mt-8 divide-y divide-line border-y border-line">
              {journey.map((item) => (
                <li key={item.title} data-profile="mile" className="grid gap-3 py-6 md:grid-cols-[180px_1fr]">
                  <p className="text-sm font-medium text-bronze">{item.date}</p>
                  <div>
                    <h3 className="text-lg text-ink">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                  </div>
                </li>
              ))}
            </ScrollReveal>
            <Link
              to="/#journey"
              data-profile="back"
              className="mt-8 inline-block text-sm font-medium text-ink hover:text-bronze"
            >
              See the journey on the home page
            </Link>
          </div>
        </Container>
      </article>
    </>
  )
}
