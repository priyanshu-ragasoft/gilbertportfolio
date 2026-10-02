import { useState, useEffect } from 'react'
import ScrollReveal from '../components/ScrollReveal'
import { profile, philosophy as defaultPhilosophy } from '../data/profile'
import { philosophyAPI } from '../services/api'
import { resolveAsset } from '../utils/resolveAsset'

// Import all high-res photography assets directly for 100% reliable Vite bundling
import officeImg from '../assets/images/gilbert-kwizera-office-standing.jpg'
import formalImg from '../assets/images/gilbert-kwizera-lounge-armchair.jpg'
import executiveImg from '../assets/images/gilbert-kwizera-executive.jpg'
import yachtImg from '../assets/images/gilbert-kwizera-dubai-marina-yacht.jpg'
import walkingImg from '../assets/images/gilbert-kwizera-dubai-walking.jpg'
import lobbyImg from '../assets/images/gilbert-kwizera-marble-lobby.jpg'
import sanjayImg from '../assets/images/gilbert-kwizera-sanjay-dutt.jpg'
import uciImg from '../assets/images/ccf-uci.jpg'
import pioImg from '../assets/images/pio-ecosystem-technology.jpg'

const resolveBgImage = (img) => {
  if (!img) return officeImg
  if (
    img.startsWith('data:') ||
    img.startsWith('http://') ||
    img.startsWith('https://') ||
    img.startsWith('/uploads/')
  ) {
    return resolveAsset(img)
  }
  if (img === '/src/assets/images/gilbert-office.jpg' || img.includes('office')) return officeImg
  if (img === '/src/assets/images/gilbert-portrait.jpg' || img.includes('lounge-armchair')) return formalImg
  if (img.includes('executive')) return executiveImg
  if (img.includes('marina-yacht') || img.includes('yacht')) return yachtImg
  if (img.includes('walking')) return walkingImg
  if (img.includes('marble-lobby') || img.includes('lobby')) return lobbyImg
  if (img.includes('sanjay-dutt') || img.includes('sanjay')) return sanjayImg
  if (img.includes('ccf-uci') || img.includes('uci')) return uciImg
  if (img.includes('pio-ecosystem') || img.includes('pio')) return pioImg
  return resolveAsset(img)
}

export default function Philosophy() {
  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem('gilbert_cached_philosophy')
      if (cached) {
        return JSON.parse(cached)
      }
    } catch (e) {
      // ignore
    }
    return {
      kicker: 'A thematic statement',
      statement: defaultPhilosophy.statement,
      note: defaultPhilosophy.note,
      image: officeImg,
    }
  })

  useEffect(() => {
    // Fetch from backend
    const loadPhilosophy = async () => {
      try {
        const res = await philosophyAPI.getPhilosophy()
        if (res.success && res.data) {
          const fetched = {
            kicker: res.data.kicker || 'A thematic statement',
            statement: res.data.statement || defaultPhilosophy.statement,
            note: res.data.note || defaultPhilosophy.note,
            image: res.data.image || officeImg,
          }
          setData(fetched)
          localStorage.setItem('gilbert_cached_philosophy', JSON.stringify(fetched))
        }
      } catch (err) {
        console.warn('Philosophy backend fetch notice:', err.message)
      }
    }

    loadPhilosophy()

    // Listen for real-time admin updates
    const handleUpdate = (e) => {
      if (e.detail) {
        setData((prev) => ({
          ...prev,
          ...e.detail,
        }))
      }
    }

    window.addEventListener('gilbert_philosophy_updated', handleUpdate)
    return () => {
      window.removeEventListener('gilbert_philosophy_updated', handleUpdate)
    }
  }, [])

  const currentBgSrc = resolveBgImage(data.image)

  return (
    <section
      data-scene="philosophy"
      className="relative min-h-[88svh] overflow-hidden bg-ink text-paper"
      data-parallax-bounds
    >
      <div data-philosophy-plate className="absolute inset-0">
        <div data-parallax className="absolute inset-x-0 -top-[14%] h-[128%]">
          <img
            src={currentBgSrc}
            alt="Thematic backdrop"
            aria-hidden="true"
            className="h-full w-full object-cover object-[center_15%] opacity-35 transition-all duration-700"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-ink/72" />
      <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-[1180px] flex-col justify-end px-5 py-20 sm:px-8 md:py-28">
        <p data-philosophy-kicker className="text-xs font-medium uppercase tracking-[0.22em] text-mist">
          {data.kicker || 'A thematic statement'}
        </p>
        <ScrollReveal
          type="text"
          as="p"
          data-philosophy-line
          className="display mt-6 max-w-4xl break-words text-[clamp(1.85rem,7vw,4.5rem)] leading-[1.08]"
        >
          {data.statement || defaultPhilosophy.statement}
        </ScrollReveal>
        <p data-philosophy-note className="mt-6 max-w-lg text-sm leading-relaxed text-mist">
          {data.note || defaultPhilosophy.note}
        </p>
      </div>
    </section>
  )
}
