import { MAP_HEIGHT, MAP_WIDTH, landPath } from '../../assets/maps/land'
import { project } from '../../assets/maps/projection'
import { journeyPins, journeyPlaces, journeyRoutes } from '../../data/journeyLocations'
import JourneyMarker from './JourneyMarker'
import JourneyRoute from './JourneyRoute'

const parallels = [-40, -20, 0, 20, 40, 60]
const meridians = [-120, -60, 0, 60, 120]

export default function WorldMap({ chapters }) {
  // Combine preset pins with any dynamic chapters that have lon/lat coordinates
  const dynamicPins = Array.isArray(chapters)
    ? chapters
        .filter((ch) => typeof ch.lon === 'number' && typeof ch.lat === 'number' && (ch.lon !== 0 || ch.lat !== 0))
        .map((ch) => {
          const coords = project(ch.lon, ch.lat)
          return {
            id: ch.id || ch.countryKey || `dyn-${ch.index}`,
            label: ch.shortLocation || ch.location || 'Location',
            note: ch.pinNote || ch.year || '',
            align: 'up',
            x: coords.x,
            y: coords.y,
          }
        })
    : []

  // Unique list of all pins to render
  const existingIds = new Set(journeyPins.map((p) => p.id))
  const additionalPins = dynamicPins.filter((dp) => !existingIds.has(dp.id))
  const allMarkers = [...journeyPins, ...journeyPlaces, ...additionalPins]

  return (
    <div className="relative h-full min-h-[220px] w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMax meet"
        role="img"
        aria-label="World map of the route from Uganda to Bangalore, back through Ethiopia and Dubai, then South Africa and Russia"
      >
        <defs>
          <path id="journey-land" d={landPath} />
          <clipPath id="journey-land-clip">
            <use href="#journey-land" />
          </clipPath>
          <pattern id="journey-dots" width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="1.1" cy="1.1" r="0.55" fill="#C9A15A" opacity="0.55" />
          </pattern>
          <filter id="journey-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g data-journey-camera>
          <g opacity="0.16" stroke="#d9d0c4" strokeWidth="0.35" fill="none">
            {parallels.map((lat) => {
              const y = project(0, lat).y
              return <line key={lat} x1="0" y1={y} x2={MAP_WIDTH} y2={y} />
            })}
            {meridians.map((lon) => {
              const x = project(lon, 0).x
              return <line key={lon} x1={x} y1="0" x2={x} y2={MAP_HEIGHT} />
            })}
          </g>
          <rect
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            fill="url(#journey-dots)"
            clipPath="url(#journey-land-clip)"
            opacity="0.85"
          />
          <use href="#journey-land" fill="#C9A15A" fillOpacity="0.045" stroke="#C9A15A" strokeOpacity="0.28" strokeWidth="0.7" />
          {journeyRoutes.map((route) => (
            <JourneyRoute key={route.id} route={route} />
          ))}
          {allMarkers.map((pin) => (
            <JourneyMarker key={pin.id} pin={pin} label={pin.label} note={pin.note} align={pin.align} />
          ))}
        </g>
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,#0D0D0C_98%)]" />
      {journeyRoutes.filter((route) => route.hasPopup !== false).map((route) => (
        <div
          key={route.id}
          data-route-popup={route.id}
          className="pointer-events-none absolute z-20 w-max opacity-0"
        >
          <div className="border border-[#C9A15A]/55 bg-[#141311]/94 px-3 py-2 shadow-[0_16px_36px_-22px_rgba(0,0,0,0.85)]">
            <p className="font-sans text-[0.58rem] tracking-[0.18em] text-[#C9A15A] uppercase">Route</p>
            <p className="mt-1 font-sans text-sm text-[#f4f0e8]">{route.caption}</p>
          </div>
          <span className="mx-auto mt-1 block h-2 w-px bg-[#C9A15A]" aria-hidden="true" />
        </div>
      ))}
    </div>
  )
}
