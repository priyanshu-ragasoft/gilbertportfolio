import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { gsap, prefersReducedMotion } from '../animations/gsapConfig'
import { navLinks, profile } from '../data/profile'
import { lenis } from '../hooks/useLenis'
import Button from './Button'
import Logo from './Logo'

function isActive(to, pathname, hash) {
  if (to.startsWith('/#')) return pathname === '/' && hash === to.slice(1)
  return pathname === to
}

export default function Navbar() {
  const { pathname, hash } = useLocation()
  const [menuPath, setMenuPath] = useState(null)
  const [scrolled, setScrolled] = useState(() => window.scrollY > 24)
  const bgRef = useRef(null)
  const panelRef = useRef(null)
  const open = menuPath === pathname
  const solid = scrolled || pathname !== '/'

  useEffect(() => {
    const background = bgRef.current
    const paint = (next) => {
      if (!background) return
      if (prefersReducedMotion()) {
        gsap.set(background, { opacity: next ? 1 : 0 })
        return
      }
      gsap.to(background, {
        opacity: next ? 1 : 0,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    paint(solid)
  }, [solid])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (event) => {
      if (event.key === 'Escape') setMenuPath(null)
    }

    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    if (!open || !panelRef.current || prefersReducedMotion()) return undefined
    const items = panelRef.current.querySelectorAll('[data-menu-item]')
    const context = gsap.context(() => {
      // Animate items smoothly; keep background 100% solid and opaque immediately
      gsap.from(items, {
        y: 22,
        opacity: 0,
        duration: 0.45,
        stagger: 0.05,
        ease: 'power3.out',
      })
    })
    return () => context.revert()
  }, [open])

  const light = pathname === '/' && !solid
  const close = () => setMenuPath(null)

  const handleNavClick = (e, to) => {
    close()
    const smoothEase = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    if (to.startsWith('/#') && pathname === '/') {
      const hashTarget = document.querySelector(to.slice(1))
      if (hashTarget) {
        e.preventDefault()
        window.history.pushState(null, '', to)
        if (lenis) {
          lenis.scrollTo(hashTarget, { offset: -80, duration: 1.25, easing: smoothEase })
        } else {
          hashTarget.scrollIntoView({ behavior: 'smooth' })
        }
      }
      return
    }

    // Standard route links (e.g. /insights, /contact, /about, /projects, /archive, /)
    if (!to.includes('#')) {
      if (pathname === to) {
        // Already on this page: smooth scroll to the top
        e.preventDefault()
        if (lenis) {
          lenis.scrollTo(0, { duration: 1.1, easing: smoothEase })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      } else {
        // Navigating to another page: reset immediately to top
        if (lenis) {
          lenis.scrollTo(0, { immediate: true })
        }
        window.scrollTo(0, 0)
      }
    }
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 transition-colors duration-300 transform-gpu will-change-transform">
        <div
          ref={bgRef}
          className="absolute inset-0 border-b border-line bg-paper/88 opacity-0 backdrop-blur-md transition-all duration-300"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex h-20 max-w-[1180px] items-center px-5 sm:h-24 sm:px-8">
          <Link
            to="/"
            data-nav-logo
            aria-label={profile.name}
            className={`relative z-10 inline-flex origin-left transition-transform duration-300 ${scrolled ? 'scale-105' : 'scale-100'}`}
            onClick={(e) => handleNavClick(e, '/')}
          >
            <Logo priority className={`h-11 w-auto max-w-[9.5rem] object-contain object-left drop-shadow-sm transition-all duration-300 sm:h-16 sm:max-w-none md:h-20 ${!light ? 'brightness-0' : ''}`} />
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:flex" aria-label="Primary">
            {navLinks.map((link) => {
              const active = isActive(link.to, pathname, hash)
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  data-nav-link
                  onClick={(e) => handleNavClick(e, link.to)}
                  aria-current={active ? 'page' : undefined}
                  className={`relative py-1 text-[0.82rem] tracking-[0.04em] transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-center after:bg-bronze after:transition-transform after:duration-300 ${
                    active ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
                  } ${light ? 'text-paper/80 hover:text-paper' : 'text-muted hover:text-ink'} ${
                    active ? (light ? 'text-paper' : 'text-ink') : ''
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="relative z-10 ml-auto flex items-center">
            <Link
              to="/contact"
              data-nav-link
              onClick={(e) => handleNavClick(e, '/contact')}
              className={`group relative hidden min-h-11 items-center gap-2.5 rounded-full pl-5 pr-2.5 text-[0.88rem] font-medium tracking-wide transition-all duration-300 hover:scale-[1.03] lg:inline-flex ${
                light
                  ? 'bg-paper text-ink shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-white hover:shadow-[0_8px_25px_rgba(255,255,255,0.25)]'
                  : 'bg-bronze text-paper shadow-[0_6px_20px_rgba(141,112,67,0.35)] hover:bg-ink hover:shadow-[0_8px_25px_rgba(23,21,19,0.4)]'
              }`}
            >
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">Donation</span>
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ${
                  light
                    ? 'bg-ink/10 text-ink group-hover:bg-ink group-hover:text-paper'
                    : 'bg-white/20 text-paper group-hover:bg-paper group-hover:text-ink'
                }`}
              >
                {/* Diagonal arrow rotates 45deg clockwise to become straight right on hover */}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:rotate-45 group-hover:translate-x-0.5" />
              </span>
            </Link>
          <button
            type="button"
            className={`relative z-10 inline-flex h-11 w-11 items-center justify-center lg:hidden ${light ? 'text-paper' : 'text-ink'}`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuPath(open ? null : pathname)}
          >
            <Menu className="h-6 w-6" />
          </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Portal Mobile Menu Drawer */}
      {open && typeof document !== 'undefined'
        ? createPortal(
            <div
              id="mobile-menu"
              ref={panelRef}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100dvh',
                backgroundColor: '#f3efe8',
                zIndex: 99999,
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
              }}
              className="text-ink lg:hidden"
            >
              {/* Top Header inside Mobile Menu */}
              <div className="relative mx-auto flex h-20 sm:h-24 w-full max-w-[1180px] shrink-0 items-center justify-between border-b border-line/70 px-5 sm:px-8">
                <Link
                  to="/"
                  aria-label={profile.name}
                  className="inline-flex"
                  onClick={(e) => handleNavClick(e, '/')}
                >
                  <Logo priority className="h-16 w-auto sm:h-20 brightness-0 drop-shadow-sm" />
                </Link>

                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:text-bronze focus-visible:outline-none"
                  aria-label="Close menu"
                  onClick={close}
                >
                  <X className="h-7 w-7" />
                </button>
              </div>

              {/* Navigation Links and CTA */}
              <nav
                className="mx-auto flex w-full max-w-md flex-1 flex-col justify-between px-6 py-4 sm:py-6"
                aria-label="Mobile Navigation"
              >
                <div className="flex flex-col divide-y divide-line/60">
                  {navLinks.map((link) => {
                    const active = isActive(link.to, pathname, hash)
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        data-menu-item
                        onClick={(e) => handleNavClick(e, link.to)}
                        aria-current={active ? 'page' : undefined}
                        className={`display py-2.5 sm:py-3 text-[1.65rem] sm:text-3xl transition-colors hover:text-bronze ${
                          active ? 'text-bronze font-semibold' : 'text-ink'
                        }`}
                      >
                        {link.label}
                      </Link>
                    )
                  })}
                </div>

                <div
                  data-menu-item
                  className="pt-5 pb-8 sm:pb-10"
                  style={{ paddingBottom: 'max(2.5rem, calc(env(safe-area-inset-bottom) + 1.5rem))' }}
                >
                  <Link
                    to="/contact"
                    onClick={(e) => handleNavClick(e, '/contact')}
                    className="group flex w-full items-center justify-center gap-3 rounded-full bg-bronze py-4 text-center text-lg font-medium text-paper shadow-[0_10px_22px_-14px_rgba(141,112,67,0.95)] transition-all duration-300 hover:bg-ink"
                  >
                    <span className="transition-transform duration-300 group-hover:translate-x-0.5">Donation</span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-paper transition-all duration-300 group-hover:bg-paper group-hover:text-ink">
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:rotate-45 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </div>
              </nav>
            </div>,
            document.body
          )
        : null}
    </>
  )
}
