import { useRef } from 'react'
import { useImageReveal } from '../hooks/useImageReveal'

export default function ImageFrame({
  src,
  alt,
  className = '',
  tone = 'light',
  priority = false,
  parallax = true,
  position = 'center 12%',
  hoverEffect = true,
  fit = 'cover',
  shape = 'default',
  trim = null,
}) {
  const frameRef = useRef(null)
  useImageReveal(frameRef)

  const shapeClass = {
    default: 'rounded-2xl',
    flush: 'rounded-none',
    arch: 'rounded-t-[160px] sm:rounded-t-[200px] rounded-b-[24px]',
    beveled: 'rounded-tl-[64px] rounded-br-[64px] rounded-tr-[20px] rounded-bl-[20px]',
    pill: 'rounded-full',
  }[shape] || 'rounded-2xl'

  return (
    <div
      ref={frameRef}
      className={`group relative overflow-hidden ${fit === 'contain' ? 'bg-transparent' : 'bg-line'} ${shapeClass} ${className}`}
      data-image-reveal
      data-sr-ignore
      data-parallax-bounds={parallax ? '' : undefined}
    >
      {fit === 'contain' ? (
        trim ? (
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: trim.aspect }}>
            <img
              src={src}
              alt={alt}
              className="absolute inset-x-0 w-full max-w-none"
              style={{ top: trim.top, height: trim.height }}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
            />
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            className="relative block h-auto w-full"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        )
      ) : (
        <div
          data-parallax={parallax ? '' : undefined}
          className={parallax ? 'absolute inset-x-0 -top-[12%] h-[124%]' : 'absolute inset-0 h-full w-full'}
        >
          <div data-image-zoom className="h-full w-full origin-center">
            <img
              src={src}
              alt={alt}
              className={`h-full w-full object-cover transition-all duration-700 ease-out will-change-transform ${
                hoverEffect
                  ? 'grayscale-[30%] contrast-[1.02] group-hover:scale-105 group-hover:grayscale-0 group-hover:contrast-105 hover:scale-105 hover:grayscale-0'
                  : ''
              }`}
              style={{ objectPosition: position }}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
            />
          </div>
        </div>
      )}
      <span
        data-image-mask
        className={`pointer-events-none absolute inset-0 ${tone === 'dark' ? 'bg-void' : 'bg-paper'}`}
        aria-hidden="true"
      />
    </div>
  )
}
