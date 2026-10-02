import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, ArrowUpRight, Mail, MapPin, Phone, ShieldCheck, HeartHandshake } from 'lucide-react'
import { footerLinks, profile, socials } from '../data/profile'
import { settingsAPI } from '../services/api'
import Logo from './Logo'
import ScrollReveal from './ScrollReveal'
import { lenis } from '../hooks/useLenis'

// Bespoke, pixel-perfect brand icons for luxury dark background
const socialIcons = {
  LinkedIn: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  ),
  Instagram: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  YouTube: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  X: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Pinterest: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.373-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
    </svg>
  ),
}

export default function Footer() {
  const [siteSettings, setSiteSettings] = useState(() => {
    try {
      const cached = localStorage.getItem('gilbert_cached_settings')
      if (cached) return JSON.parse(cached)
    } catch (e) {
      // ignore
    }
    return {
      footerCornerImage: '',
      footerWatermarkOpacity: 18,
      footerLogo: '',
      footerTagline:
        'Dedicated to dignity-based care, ethical resource stewardship, and sustainable social systems across East Africa and the Middle East.',
      officeAddress: profile.location,
      contactPhone: profile.phone,
      contactEmail: profile.email,
      quoteText: 'When you choose to help others up, you help people rise as well.',
      quoteAuthor: 'Core Leadership Principle',
      copyrightText: `© 2026 ${profile.name}. All rights reserved.`,
    }
  })

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await settingsAPI.getSettings()
        if (res.success && res.data) {
          setSiteSettings(res.data)
          localStorage.setItem('gilbert_cached_settings', JSON.stringify(res.data))
        }
      } catch (err) {
        console.warn('Footer settings backend notice:', err.message)
      }
    }

    loadSettings()

    const handleUpdate = (e) => {
      if (e.detail) {
        setSiteSettings((prev) => ({
          ...prev,
          ...e.detail,
        }))
      }
    }

    window.addEventListener('gilbert_settings_updated', handleUpdate)
    return () => window.removeEventListener('gilbert_settings_updated', handleUpdate)
  }, [])

  const handleScrollTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.1 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleFooterLinkClick = (e, to) => {
    if (to.startsWith('/#')) {
      const hashTarget = document.querySelector(to.slice(1))
      if (hashTarget) {
        e.preventDefault()
        window.history.pushState(null, '', to)
        if (lenis) {
          lenis.scrollTo(hashTarget, { offset: -80, duration: 1.1 })
        } else {
          hashTarget.scrollIntoView({ behavior: 'smooth' })
        }
      }
      return
    }

    if (!to.includes('#')) {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true })
      }
      window.scrollTo(0, 0)
    }
  }

  return (
    <footer className="relative border-t border-line/20 bg-[#0d0c0a] text-paper overflow-hidden selection:bg-bronze/30 selection:text-white">
      {/* Ambient luxury lighting */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[380px] w-[720px] -translate-x-1/2 rounded-full bg-bronze/10 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-bronze/45 to-transparent"
        aria-hidden="true"
      />

      {/* Luxury Background Shaded Watermark / Brand Graphic (Bleeding into dark background) */}
      {siteSettings.showFooterCornerImage !== false && siteSettings.footerCornerImage && (
        <div
          className="pointer-events-none absolute right-0 bottom-0 z-0 flex items-end justify-end overflow-hidden max-w-[60vw] max-h-[95%] select-none"
          aria-hidden="true"
        >
          <img
            src={siteSettings.footerCornerImage}
            alt=""
            style={{
              opacity: (siteSettings.footerWatermarkOpacity ?? 18) / 100,
            }}
            className="w-auto h-auto max-h-[280px] sm:max-h-[380px] md:max-h-[480px] lg:max-h-[540px] max-w-[340px] sm:max-w-[500px] md:max-w-[640px] object-contain object-right-bottom translate-x-6 translate-y-6 sm:translate-x-10 sm:translate-y-8 filter brightness-110 contrast-125 transition-opacity duration-500"
          />
        </div>
      )}

      {/* Main Architectural Grid */}
      <ScrollReveal type="block" stagger={0.08} className="relative z-10 mx-auto grid max-w-[1180px] gap-12 px-5 py-16 sm:px-8 md:grid-cols-12 md:py-20 lg:gap-14">
        {/* Brand & Mission Column */}
        <div data-footer-col className="md:col-span-12 lg:col-span-4">
          <Link
            to="/"
            onClick={(e) => handleFooterLinkClick(e, '/')}
            aria-label={profile.name}
            className="group inline-flex items-center transition-transform duration-300 hover:scale-[1.02]"
          >
            <Logo variant="lockup" priority className="h-16 w-auto sm:h-20 object-contain drop-shadow-md" />
          </Link>

          <p className="mt-6 text-sm leading-relaxed text-mist/80 font-light">
            {siteSettings.footerTagline ||
              'Dedicated to dignity-based care, ethical resource stewardship, and sustainable social systems across East Africa and the Middle East.'}
          </p>

          <div className="mt-6 border-l-2 border-bronze/70 pl-4 py-1">
            <p className="font-serif italic text-base text-paper/90 leading-snug">
              &ldquo;{siteSettings.quoteText || 'When you choose to help others up, you help people rise as well.'}&rdquo;
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-widest text-bronze font-medium">
              {siteSettings.quoteAuthor || 'Core Leadership Principle'}
            </p>
          </div>
        </div>

        {/* Navigation Column */}
        <div data-footer-col className="md:col-span-4 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-bronze">
            Explore
          </p>
          <ul className="mt-5 space-y-2.5">
            {footerLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={(e) => handleFooterLinkClick(e, link.to)}
                  className="group inline-flex items-center text-sm text-mist/80 transition-all duration-200 hover:translate-x-1 hover:text-paper"
                >
                  <span className="h-px w-0 bg-bronze transition-all duration-200 group-hover:w-2.5 group-hover:mr-2" />
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Foundations & Social Impact Column */}
        <div data-footer-col className="md:col-span-4 lg:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-bronze">
            Initiatives
          </p>
          <ul className="mt-5 space-y-3.5 text-xs text-mist/85">
            <li className="group">
              <Link
                to="/impact/cancer-charity-foundation"
                onClick={(e) => handleFooterLinkClick(e, '/impact/cancer-charity-foundation')}
                className="block"
              >
                <span className="font-medium text-paper flex items-center gap-1 group-hover:text-bronze transition-colors">
                  Cancer Charity Foundation
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <span className="mt-0.5 block text-mist/70 leading-normal">
                  Oncology patient care, accommodation &amp; treatment access.
                </span>
              </Link>
            </li>
            <li className="group">
              <Link
                to="/impact/haven-welfare"
                onClick={(e) => handleFooterLinkClick(e, '/impact/haven-welfare')}
                className="block"
              >
                <span className="font-medium text-paper flex items-center gap-1 group-hover:text-bronze transition-colors">
                  Haven Welfare
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <span className="mt-0.5 block text-mist/70 leading-normal">
                  Dignity-first rehabilitation and social reintegration.
                </span>
              </Link>
            </li>
            <li className="group">
              <Link
                to="/impact/isbet-brainery"
                onClick={(e) => handleFooterLinkClick(e, '/impact/isbet-brainery')}
                className="block"
              >
                <span className="font-medium text-paper flex items-center gap-1 group-hover:text-bronze transition-colors">
                  Education &amp; Skills
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <span className="mt-0.5 block text-mist/70 leading-normal">
                  Classroom development &amp; service-driven youth learning.
                </span>
              </Link>
            </li>
          </ul>

          <div className="mt-5 rounded-lg border border-white/5 bg-white/[0.02] p-3 text-[11px] leading-relaxed text-mist/70">
            <span className="flex items-center gap-1.5 font-medium text-paper/90 mb-1">
              <HeartHandshake className="h-3.5 w-3.5 text-bronze shrink-0" />
              Dignity Standard
            </span>
            Care delivered without public exposure, safeguarding personal privacy and honour.
          </div>
        </div>

        {/* Office & Direct Connection Column */}
        <div data-footer-col className="md:col-span-4 lg:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-bronze">
            Dubai Office &amp; Connect
          </p>

          <div className="mt-5 space-y-3 text-xs text-mist/85">
            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bronze" />
              <span className="leading-snug text-paper/85">
                {siteSettings.officeAddress || profile.location}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-bronze" />
              <a
                href={siteSettings.contactPhone ? `tel:${siteSettings.contactPhone.replace(/\s+/g, '')}` : profile.phoneHref}
                className="text-paper/85 transition-colors hover:text-white hover:underline underline-offset-4"
              >
                {siteSettings.contactPhone || profile.phone}
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-bronze" />
              <a
                href={`mailto:${siteSettings.contactEmail || profile.email}`}
                className="text-paper/85 transition-colors hover:text-white hover:underline underline-offset-4 break-all"
              >
                {siteSettings.contactEmail || profile.email}
              </a>
            </div>
          </div>

          {/* Social Presence Pills */}
          <div className="mt-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-mist/60 mb-2.5">
              Official Channels
            </p>
            <div className="flex flex-wrap gap-2">
              {socials.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  title={item.label}
                  aria-label={item.label}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-mist transition-all duration-300 hover:border-bronze/70 hover:bg-bronze/10 hover:text-white"
                >
                  <span className="text-mist group-hover:text-bronze transition-colors">
                    {socialIcons[item.label] ?? <ArrowUpRight className="h-3.5 w-3.5" />}
                  </span>
                  <span className="font-light">{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 text-[11px] text-mist/60">
            <ShieldCheck className="h-3.5 w-3.5 text-bronze/80 shrink-0" />
            <span>Strict confidentiality for diplomatic &amp; advisory inquiries</span>
          </div>
        </div>
      </ScrollReveal>

      {/* Colophon & Copyright Bar */}
      <div data-footer-base className="relative z-10 border-t border-white/[0.08] bg-black/40">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-6 text-xs text-mist/75 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="tracking-wide">
            {siteSettings.copyrightText || `© 2026 ${profile.name}. All rights reserved.`}
          </p>
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Link
              to="/privacy"
              onClick={(e) => handleFooterLinkClick(e, '/privacy')}
              className="transition-colors hover:text-paper"
            >
              Privacy Policy
            </Link>
            <span aria-hidden="true" className="text-white/25">|</span>
            <Link
              to="/terms"
              onClick={(e) => handleFooterLinkClick(e, '/terms')}
              className="transition-colors hover:text-paper"
            >
              Terms & Conditions
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

