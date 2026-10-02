import { Link } from 'react-router-dom'
import Container from '../components/Container'
import PageMeta from '../components/PageMeta'
import ScrollReveal from '../components/ScrollReveal'

export default function NotFound() {
  return (
    <>
      <PageMeta title="Page not found — Gilbert Kevin Jimmy Kwizera" />
      <Container data-scene="missing" className="py-40">
        <p data-missing="kicker" className="text-xs uppercase tracking-[0.2em] text-muted">
          404
        </p>
        <ScrollReveal type="text" as="h1" data-missing="title" className="display mt-4 text-[clamp(2.1rem,8vw,4.5rem)] leading-[1.05] text-ink">
          This page is not on the record.
        </ScrollReveal>
        <Link data-missing="link" to="/" className="mt-8 inline-block text-sm font-medium hover:text-bronze">
          Return home
        </Link>
      </Container>
    </>
  )
}
