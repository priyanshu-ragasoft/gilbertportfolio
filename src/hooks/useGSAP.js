import { useLayoutEffect } from 'react'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../animations/gsapConfig'

export function useGSAP(animation, deps = []) {
  const isConfig = deps && !Array.isArray(deps) && typeof deps === 'object'
  const scope = isConfig ? deps.scope : undefined
  const dependencyArray = Array.isArray(deps) ? deps : isConfig ? deps.dependencies || [] : []

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined

    let active = true
    const context = gsap.context(() => animation(), scope)

    document.fonts?.ready?.then(() => {
      if (active) ScrollTrigger.refresh()
    })

    return () => {
      active = false
      context.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyArray)
}
