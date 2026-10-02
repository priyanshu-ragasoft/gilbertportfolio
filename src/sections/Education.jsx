import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Container from '../components/Container'
import ImageFrame from '../components/ImageFrame'
import ScrollReveal from '../components/ScrollReveal'
import { profile } from '../data/profile'
import { educationAPI } from '../services/api'
import { resolveAsset } from '../utils/resolveAsset'

const DEFAULT_EDUCATION = {
  eyebrow: 'Knowledge',
  title: 'Education as a Tool for Service',
  paragraphs: [
    'In his published writing, learning was never framed as a private advantage. Business, information technology, and finance were how he learned to see institutions: where resources go, and how a system can help a person or harm them.',
    'That is the bridge into the humanitarian work. Compassion still needs a structure that is transparent and able to last. ISBET Brainery Academy is the education platform in this body of work — practical technology training, guided lessons, and career skills.',
    'The same conviction shows up in direct gifts: books and tools in a classroom, so a child’s day is not stopped by the absence of something basic.',
  ],
  linkText: 'Explore ISBET Brainery',
  linkUrl: '/impact/isbet-brainery',
  image: profile.educationImage,
  imageAlt: 'Pupils holding new exercise books after a donation of scholastic materials',
}

export default function Education() {
  const [eduData, setEduData] = useState(() => {
    const cached = localStorage.getItem('gilbert_cached_education')
    if (cached) {
      try {
        return JSON.parse(cached)
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_EDUCATION
  })

  useEffect(() => {
    const loadEducation = async () => {
      try {
        const res = await educationAPI.getEducation()
        if (res.success && res.data) {
          const formatted = {
            eyebrow: res.data.eyebrow || DEFAULT_EDUCATION.eyebrow,
            title: res.data.title || DEFAULT_EDUCATION.title,
            paragraphs:
              Array.isArray(res.data.paragraphs) && res.data.paragraphs.length > 0
                ? res.data.paragraphs
                : DEFAULT_EDUCATION.paragraphs,
            linkText: res.data.linkText || DEFAULT_EDUCATION.linkText,
            linkUrl: res.data.linkUrl || DEFAULT_EDUCATION.linkUrl,
            image: res.data.image || DEFAULT_EDUCATION.image,
            imageAlt: res.data.imageAlt || DEFAULT_EDUCATION.imageAlt,
          }
          setEduData(formatted)
          localStorage.setItem('gilbert_cached_education', JSON.stringify(formatted))
        }
      } catch (e) {
        // fallback to cache
      }
    }

    loadEducation()

    const handleUpdate = (e) => {
      if (e.detail) {
        setEduData(e.detail)
      }
    }

    window.addEventListener('gilbert_education_updated', handleUpdate)
    return () => window.removeEventListener('gilbert_education_updated', handleUpdate)
  }, [])

  const displayImage = resolveAsset(eduData.image)

  return (
    <section id="education" data-scene="education" className="bg-paper py-20 md:py-32 scroll-mt-20">
      <Container className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p data-edu-kicker className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-muted">
            <span className="h-px w-8 bg-bronze" aria-hidden="true" />
            {eduData.eyebrow || 'Knowledge'}
          </p>
          <ScrollReveal type="text" as="h2" className="display mt-4 break-words text-[clamp(1.85rem,7vw,3.75rem)] leading-[1.08] text-ink">
            {eduData.title || 'Education as a Tool for Service'}
          </ScrollReveal>
          <ScrollReveal type="block" stagger={0.1} data-edu-copy className="mt-6 space-y-4 text-base leading-relaxed text-muted">
            {(eduData.paragraphs || []).map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </ScrollReveal>
          <Link
            to={eduData.linkUrl || '/impact/isbet-brainery'}
            data-edu-link
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-bronze"
          >
            {eduData.linkText || 'Explore ISBET Brainery'}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div data-edu-visual className="lg:col-span-6 lg:col-start-7">
          <ImageFrame
            src={displayImage}
            alt={eduData.imageAlt || 'Education initiative'}
            className="aspect-[4/5] sm:aspect-[5/4]"
          />
        </div>
      </Container>
    </section>
  )
}
