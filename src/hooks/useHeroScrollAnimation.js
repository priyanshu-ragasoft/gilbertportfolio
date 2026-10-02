import { useLayoutEffect } from 'react'
import { buildHeroScrollReduced, buildHeroScrollTimeline } from '../animations/heroScrollAnimation'
import { bindHeroParallax } from '../animations/heroParallax'
import { gsap, prefersReducedMotion } from '../animations/gsapConfig'
import { useGSAP } from './useGSAP'

export function useHeroScrollAnimation(heroRef, deps = []) {
  useLayoutEffect(() => {
    if (!prefersReducedMotion()) return undefined
    const section = heroRef.current
    if (!section) return undefined
    const context = gsap.context(() => {
      buildHeroScrollReduced(section)
    }, section)
    return () => context.revert()
  }, [heroRef, ...deps])

  useGSAP(() => {
    const section = heroRef.current
    if (!section) return undefined

    const getProgress = () => Number(section.dataset.heroProgress || 0)
    let releaseParallax = () => {}

    const media = gsap.matchMedia()
    media.add('(max-width: 767px)', () => {
      buildHeroScrollTimeline(section, 'mobile')
    })
    media.add('(min-width: 768px) and (max-width: 1099px)', () => {
      buildHeroScrollTimeline(section, 'tablet')
      releaseParallax = bindHeroParallax(section, getProgress)
    })
    media.add('(min-width: 1100px)', () => {
      buildHeroScrollTimeline(section, 'desktop')
      releaseParallax = bindHeroParallax(section, getProgress)
    })

    return () => {
      releaseParallax()
      media.revert()
    }
  }, { scope: heroRef, dependencies: [heroRef, ...deps] })
}
