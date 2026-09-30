import { useState, useMemo, useEffect, useRef, lazy, Suspense } from 'react'
import { Mail, MapPin, Phone, Clock, Copy, Check, Sparkles, Send, Globe } from 'lucide-react'
import { gsap, prefersReducedMotion } from '../animations/gsapConfig'
import Button from '../components/Button'
import Container from '../components/Container'
import ScrollReveal from '../components/ScrollReveal'
import hotelEntrance from '../assets/images/gilbert-kwizera-hotel-entrance.jpg'
import { profile } from '../data/profile'
import { useGSAP } from '../hooks/useGSAP'

const Contact3DCanvas = lazy(() => import('../three/Contact/Contact3DCanvas'))
const ParticlesCanvas = lazy(() => import('../three/Particles/ParticlesCanvas'))

const initial = { name: '', email: '', topic: 'Philanthropy & Donation', message: '' }

const TOPICS = [
  'Philanthropy & Donation',
  'Education Initiatives',
  'Global Consultation',
  'Partnership',
  'General Inquiry',
]

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Please add your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Use an email address we can reply to.'
  }
  if (values.message.trim().length < 8) {
    errors.message = 'Please add a brief message about your inquiry.'
  }
  return errors
}

export default function Contact({ standalone = false }) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [copiedKey, setCopiedKey] = useState(null)
  const [dubaiTime, setDubaiTime] = useState('')
  const [viewMode, setViewMode] = useState('3d') // '3d' | 'photo'

  const cardRef = useRef(null)
  const reduced = useMemo(() => prefersReducedMotion(), [])

  // Live Dubai Time Clock (GST, UTC+4)
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date()
        const timeStr = now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Dubai',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
        setDubaiTime(timeStr)
      } catch {
        setDubaiTime('GST (UTC+4)')
      }
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // 3D Card Parallax Tilt on Mouse Move
  const handleCardMouseMove = (e) => {
    if (reduced || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -6
    const rotateY = ((x - centerX) / centerX) * 6

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`
  }

  const handleCardMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  }

  useGSAP(() => {
    if (!sent) return undefined
    const node = document.getElementById('contact-thanks')
    if (!node) return undefined
    gsap.fromTo(node, { opacity: 0, y: 20, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' })
    return undefined
  }, [sent])

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2200)
    })
  }

  const onChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const selectTopic = (topic) => {
    setValues((current) => ({ ...current, topic }))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const subject = encodeURIComponent(`[${values.topic}] Note from ${values.name.trim()}`)
    const body = encodeURIComponent(
      `Inquiry Topic: ${values.topic}\n\n${values.message.trim()}\n\n---\nSender: ${values.name.trim()}\nEmail: ${values.email.trim()}`
    )
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  const fieldClass = (name) =>
    `w-full rounded-lg border bg-white/70 px-4 py-3.5 text-base text-ink outline-none transition-all duration-300 placeholder:text-muted/60 backdrop-blur-sm ${errors[name]
      ? 'border-bronze shadow-[0_0_0_3px_rgba(141,112,67,0.15)]'
      : 'border-line focus:border-bronze focus:bg-white focus:shadow-[0_0_0_4px_rgba(141,112,67,0.12)]'
    }`

  return (
    <section
      id="contact"
      data-scene="contact"
      className={`relative overflow-hidden ${standalone ? 'bg-paper pt-32 pb-24 md:pt-40 md:pb-36' : 'bg-paper py-24 md:py-36'}`}
    >
      {/* Dynamic ambient 3D glow & particle atmosphere */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-bronze/15 via-bronze/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-bronze/10 via-bronze/5 to-transparent blur-3xl" />

      <Suspense fallback={null}>
        <div className="pointer-events-none absolute inset-0 z-0 opacity-60" aria-hidden="true">
          <ParticlesCanvas count={65} reduced={reduced} />
        </div>
      </Suspense>

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto lg:mx-0 text-center lg:text-left flex flex-col items-center lg:items-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-bronze/30 bg-bronze/10 px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] sm:tracking-[0.2em] text-bronze backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 shrink-0 animate-pulse text-bronze" />
            <span className="truncate">Direct Inquiries &amp; Philanthropy</span>
          </div>

          {standalone ? (
            <ScrollReveal type="text" as="h1" data-contact-intro className="display mt-5 sm:mt-6 text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-ink leading-tight">
              Let&apos;s Create <span className="font-serif italic text-bronze">Meaningful</span> Impact.
            </ScrollReveal>
          ) : (
            <ScrollReveal type="text" as="h2" data-contact-intro className="display mt-5 sm:mt-6 text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-ink leading-tight">
              Let&apos;s Create <span className="font-serif italic text-bronze">Meaningful</span> Impact.
            </ScrollReveal>
          )}

          <ScrollReveal type="block" data-contact-intro className="mt-4 sm:mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-base md:text-lg">
            For conversations regarding foundation initiatives, educational sponsorships, executive consultations, or private philanthropy, write directly.
          </ScrollReveal>
        </div>

        {/* Main Grid: 3D Interactive Card + Form */}
        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: 3D Interactive Dubai HQ Showcase */}
          <div className="flex flex-col gap-6 lg:col-span-5 max-w-lg mx-auto lg:max-w-none w-full">
            <div
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{ transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
              className="relative overflow-hidden rounded-2xl border border-line/80 bg-ivory/90 shadow-[0_20px_50px_-20px_rgba(23,21,19,0.12)] backdrop-blur-xl"
            >
              {/* Card Top Bar with View Toggles — Single Row Layout */}
              <div className="flex items-center justify-between gap-1.5 sm:gap-2 border-b border-line/70 px-3 sm:px-5 py-2.5 sm:py-3.5 flex-nowrap overflow-hidden">
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-ink shrink-0">
                    Headquarters
                  </span>
                </div>

                <div className="flex items-center rounded-lg border border-line/60 bg-paper/60 p-0.5 text-[10px] sm:text-xs font-medium text-muted shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewMode('3d')}
                    className={`flex items-center gap-1 sm:gap-1.5 rounded-md px-1.5 sm:px-2.5 py-0.5 sm:py-1 whitespace-nowrap transition-all ${viewMode === '3d' ? 'bg-bronze text-paper shadow-sm font-semibold' : 'hover:text-ink'
                      }`}
                  >
                    <Globe className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                    <span>3D Globe</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('map')}
                    className={`flex items-center gap-1 sm:gap-1.5 rounded-md px-1.5 sm:px-2.5 py-0.5 sm:py-1 whitespace-nowrap transition-all ${viewMode === 'map' ? 'bg-bronze text-paper shadow-sm font-semibold' : 'hover:text-ink'
                      }`}
                  >
                    <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                    <span>Map View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('photo')}
                    className={`flex items-center gap-1 sm:gap-1.5 rounded-md px-1.5 sm:px-2.5 py-0.5 sm:py-1 whitespace-nowrap transition-all ${viewMode === 'photo' ? 'bg-bronze text-paper shadow-sm font-semibold' : 'hover:text-ink'
                      }`}
                  >
                    <span>Photo</span>
                  </button>
                </div>
              </div>

              {/* Viewport: 3D Globe Canvas OR Live Map OR Photo */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-stone-900 to-black">
                {viewMode === '3d' ? (
                  <Suspense
                    fallback={
                      <div className="flex h-full w-full items-center justify-center text-xs font-mono text-bronze">
                        Loading 3D Dubai Globe...
                      </div>
                    }
                  >
                    <Contact3DCanvas />
                  </Suspense>
                ) : viewMode === 'map' ? (
                  <div className="relative h-full w-full overflow-hidden bg-[#0c0e12]">
                    {/* Dark Luxury Map with Obsidian & Gold Color Filter */}
                    <iframe
                      title="Dubai Office Location Map"
                      src="https://maps.google.com/maps?q=Port+de+la+Mer+Le+Pont+Jumeirah+Dubai&t=&z=15&ie=UTF8&iwloc=&output=embed"
                      className="h-full w-full border-0 transition-all duration-500 [filter:invert(92%)_hue-rotate(180deg)_contrast(118%)_brightness(88%)_sepia(18%)]"
                      loading="lazy"
                      allowFullScreen
                    />

                    {/* Subtle Dark Vignette & Gold Rim Glow */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                    <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]" />

                    {/* Top Floating Action Pill: Open in Maps */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                      <a
                        href="https://maps.google.com/?q=Port+de+la+Mer+Le+Pont+Jumeirah+Dubai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-1.5 rounded-lg border border-bronze/40 bg-black/80 px-2.5 py-1.5 text-[11px] font-medium text-paper backdrop-blur-md transition-all hover:border-bronze hover:bg-black hover:text-bronze"
                      >
                        <MapPin className="h-3 w-3 text-bronze" />
                        <span>Open in Google Maps</span>
                      </a>
                    </div>

                    {/* Top Right Live GPS Status */}


                    {/* Bottom Luxury Location Card Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between rounded-xl border border-bronze/40 bg-black/85 p-3 shadow-xl backdrop-blur-md">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-bronze shadow-[0_0_8px_#C9A15A]" />
                          <p className="font-sans text-xs font-bold text-white tracking-wide">
                            Gilbert Kwizera HQ
                          </p>
                        </div>
                        <p className="mt-0.5 text-[11px] text-[#D1C9BC]">
                          Port de La Mer — Le Pont, Jumeirah 1, Dubai, UAE
                        </p>
                      </div>

                      <div className="hidden xs:block text-right">
                        <span className="inline-block rounded border border-bronze/30 bg-bronze/15 px-2 py-0.5 font-mono text-[9px] font-bold text-bronze uppercase">
                          Headquarter&apos;s
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-full w-full">
                    <img
                      src={hotelEntrance}
                      alt="Gilbert Kevin Jimmy Kwizera in Dubai"
                      className="h-full w-full object-cover object-[center_12%] transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <p className="text-sm font-semibold">Gilbert Kwizera HQ</p>
                      <p className="text-xs text-white/80">Le Pont, Port de la Mer, Jumeirah 1, Dubai, UAE</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Office Details & Live Clock */}
              <div className="p-5 sm:p-6">
                <div className="border-b border-line/60 pb-4 text-center sm:text-left">
                  <h3 className="font-serif text-lg sm:text-xl font-medium text-ink">
                    International Humanitarian Office
                  </h3>
                  <p className="mt-0.5 text-xs text-muted">Gilbert Kevin Jimmy Kwizera Global Practice</p>
                </div>

                {/* Quick Interactive Contact Rows */}
                <div className="mt-4 space-y-3">
                  <div className="group flex items-center justify-between rounded-xl border border-transparent bg-paper/60 p-3 transition-colors hover:border-line hover:bg-paper">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bronze/15 text-bronze">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-medium text-ink sm:text-sm">{profile.location}</span>
                    </div>
                  </div>

                  <div className="group flex items-center justify-between rounded-xl border border-transparent bg-paper/60 p-3 transition-colors hover:border-line hover:bg-paper">
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bronze/15 text-bronze transition-colors group-hover:bg-bronze group-hover:text-paper">
                        <Mail className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-medium text-ink transition-colors group-hover:text-bronze sm:text-sm">
                        {profile.email}
                      </span>
                    </a>
                    <button
                      type="button"
                      aria-label="Copy email"
                      onClick={() => copyToClipboard(profile.email, 'email')}
                      className="rounded-md p-1.5 text-muted hover:bg-ivory hover:text-ink transition-colors"
                      title="Copy email"
                    >
                      {copiedKey === 'email' ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <Check className="h-3.5 w-3.5" /> Copied
                        </span>
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="group flex items-center justify-between rounded-xl border border-transparent bg-paper/60 p-3 transition-colors hover:border-line hover:bg-paper">
                    <a href={profile.phoneHref} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bronze/15 text-bronze transition-colors group-hover:bg-bronze group-hover:text-paper">
                        <Phone className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-medium text-ink transition-colors group-hover:text-bronze sm:text-sm">
                        {profile.phone}
                      </span>
                    </a>
                    <button
                      type="button"
                      aria-label="Copy phone number"
                      onClick={() => copyToClipboard(profile.phone, 'phone')}
                      className="rounded-md p-1.5 text-muted hover:bg-ivory hover:text-ink transition-colors"
                      title="Copy phone"
                    >
                      {copiedKey === 'phone' ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <Check className="h-3.5 w-3.5" /> Copied
                        </span>
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D-styled Glass Form Card */}
          <div className="relative rounded-2xl border border-line/80 bg-ivory/80 p-6 shadow-[0_20px_50px_-20px_rgba(23,21,19,0.1)] backdrop-blur-xl sm:p-10 lg:col-span-7">
            {sent ? (
              <div id="contact-thanks" className="flex flex-col items-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bronze/15 text-bronze">
                  <Check className="h-8 w-8" />
                </div>
                <h3 className="display mt-6 text-4xl text-ink">Inquiry Sent.</h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
                  Thank you, <span className="font-semibold text-ink">{values.name}</span>. Your inquiry regarding{' '}
                  <span className="font-medium text-bronze">{values.topic}</span> has been formatted and forwarded to {profile.email}.
                </p>
                <div className="mt-8 flex gap-4">
                  <Button onClick={() => setSent(false)}>
                    Send Another Note
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-6">
                {/* Topic Selector Chips */}
                <div>
                  <label className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    Inquiry Topic
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map((topic) => {
                      const selected = values.topic === topic
                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => selectTopic(topic)}
                          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300 ${selected
                            ? 'bg-bronze text-paper shadow-[0_4px_14px_rgba(141,112,67,0.35)] scale-[1.02]'
                            : 'border border-line bg-paper/80 text-muted hover:border-bronze hover:text-ink'
                            }`}
                        >
                          {topic}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Name & Email Row */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div data-field>
                    <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      autoComplete="name"
                      placeholder="e.g. Elena Rostova"
                      value={values.name}
                      onChange={onChange}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      className={fieldClass('name')}
                    />
                    {errors.name ? (
                      <p id="name-error" className="mt-1.5 text-xs font-medium text-bronze">
                        {errors.name}
                      </p>
                    ) : null}
                  </div>

                  <div data-field>
                    <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="e.g. elena@example.com"
                      value={values.email}
                      onChange={onChange}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className={fieldClass('email')}
                    />
                    {errors.email ? (
                      <p id="email-error" className="mt-1.5 text-xs font-medium text-bronze">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Message Field */}
                <div data-field>
                  <label htmlFor="message" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Your Message / Proposal *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Describe your initiative, foundation objective, or consultation inquiry..."
                    value={values.message}
                    onChange={onChange}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    className={fieldClass('message')}
                  />
                  {errors.message ? (
                    <p id="message-error" className="mt-1.5 text-xs font-medium text-bronze">
                      {errors.message}
                    </p>
                  ) : null}
                </div>

                {/* Submit Action */}
                <div className="flex flex-col items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
                  <p className="text-xs text-muted">
                    Inquiries are received directly by Gilbert Kevin Jimmy Kwizera&apos;s executive office.
                  </p>
                  <button
                    type="submit"
                    data-submit
                    className="group relative inline-flex shrink-0 items-center justify-center gap-3 whitespace-nowrap rounded-full bg-bronze px-6 sm:px-7 py-3.5 text-sm font-medium tracking-wide text-paper shadow-[0_8px_25px_rgba(141,112,67,0.35)] transition-all duration-300 hover:scale-[1.03] hover:bg-ink hover:shadow-[0_8px_25px_rgba(23,21,19,0.4)]"
                  >
                    <span className="whitespace-nowrap">Transmit Message</span>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-paper transition-all duration-300 group-hover:bg-paper group-hover:text-ink group-hover:rotate-45">
                      <Send className="h-3.5 w-3.5 shrink-0" />
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
