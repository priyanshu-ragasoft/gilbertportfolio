
import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../animations/gsapConfig'

export default function Cursor() {
  const cursorRef = useRef(null)
  const labelRef  = useRef(null)

  const fine    = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduced = typeof window !== 'undefined' && prefersReducedMotion()
  const enabled = fine && !reduced

  useEffect(() => {
    if (!enabled || !cursorRef.current) return undefined

    const cursor = cursorRef.current
    const label  = labelRef.current

    // Initial position off-screen so it doesn't flash at 0,0 on mount
    gsap.set(cursor, { x: -100, y: -100, opacity: 0 })

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.2, ease: 'power3.out' })
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.2, ease: 'power3.out' })

    let moved = false

    const move = (e) => {
      xTo(e.clientX)
      yTo(e.clientY)
      if (!moved) {
        moved = true
        gsap.to(cursor, { opacity: 1, duration: 0.25, ease: 'power2.out' })
      }
    }

    const over = (e) => {
      // Check project first (higher specificity than generic link)
      const isProject = e.target.closest?.('[data-tilt], [data-project]')
      const isInteractive = !isProject && e.target.closest?.('a, button, [data-button], input, textarea, select')

      if (isProject) {
        gsap.to(cursor, { scale: 2.8, duration: 0.3, ease: 'power3.out', overwrite: 'auto' })
        if (label) gsap.to(label, { opacity: 1, scale: 1, duration: 0.25, ease: 'power3.out', overwrite: 'auto' })
      } else if (isInteractive) {
        gsap.to(cursor, { scale: 1.85, duration: 0.25, ease: 'power2.out', overwrite: 'auto' })
        if (label) gsap.to(label, { opacity: 0, scale: 0.5, duration: 0.2, overwrite: 'auto' })
      } else {
        gsap.to(cursor, { scale: 1, duration: 0.28, ease: 'power2.out', overwrite: 'auto' })
        if (label) gsap.to(label, { opacity: 0, scale: 0.5, duration: 0.2, overwrite: 'auto' })
      }
    }

    const down = () => gsap.to(cursor, { scale: 0.85, duration: 0.1, ease: 'power2.out', overwrite: 'auto' })
    const up   = (e) => over(e)   // restore correct state after press

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over)
    document.addEventListener('pointerdown', down)
    document.addEventListener('pointerup',   up)

    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.removeEventListener('pointerdown', down)
      document.removeEventListener('pointerup',   up)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={cursorRef}
      data-cursor-el
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[200] hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center lg:flex"
    >
      {/* Ring */}
      <div className="h-4 w-4 rounded-full border border-bronze" />
      {/* VIEW label — appears on project/card hover */}
     
    </div>
  )
}
