import { useRef, useMemo, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, useTexture, Html } from '@react-three/drei'
import * as THREE from 'three'
import earthGoldBlackImg from '../../assets/maps/earth_gold_black.jpg'
import { prefersReducedMotion } from '../../animations/gsapConfig'

// Convert Lat/Long to 3D Cartesian coordinates on sphere of radius R
function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return new THREE.Vector3(x, y, z)
}

// Global Hubs Configuration
const DUBAI_COORDS = [25.2048, 55.2708]
const GLOBAL_HUBS = [
  { name: 'Kampala', coords: [0.3476, 32.5825] },
  { name: 'Kigali', coords: [-1.9441, 30.0619] },
  { name: 'Addis Ababa', coords: [9.145, 40.4897] },
  { name: 'London', coords: [51.5074, -0.1278] },
  { name: 'Bangalore', coords: [12.9716, 77.5946] },
  { name: 'Johannesburg', coords: [-26.2041, 28.0473] },
]

/* ─── Animated Global Impact Routes with Traveling Photon Pulses ── */
function GlobalImpactRoutes() {
  const photonRefs = useRef([])

  const { curves, geoms } = useMemo(() => {
    const v0 = latLngToVector3(DUBAI_COORDS[0], DUBAI_COORDS[1], 1.6)
    const curveList = []
    const geomList = []

    GLOBAL_HUBS.forEach((hub) => {
      const v1 = latLngToVector3(hub.coords[0], hub.coords[1], 1.6)
      const mid = v0.clone().add(v1).multiplyScalar(0.5)
      const midLength = mid.length()
      mid.normalize().multiplyScalar(midLength + 0.32)

      const curve = new THREE.QuadraticBezierCurve3(v0, mid, v1)
      curveList.push(curve)
      const points = curve.getPoints(50)
      geomList.push(new THREE.BufferGeometry().setFromPoints(points))
    })

    return { curves: curveList, geoms: geomList }
  }, [])

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()
    curves.forEach((curve, i) => {
      const mesh = photonRefs.current[i]
      if (mesh) {
        // Continuous cycle along route
        const progress = ((elapsed * 0.45) + (i * 0.16)) % 1
        const point = curve.getPointAt(progress)
        mesh.position.copy(point)
        // Pulsing scale
        const scale = 0.8 + Math.sin(elapsed * 4 + i) * 0.3
        mesh.scale.set(scale, scale, scale)
      }
    })
  })

  return (
    <group>
      {/* 3D Arc Lines */}
      {geoms.map((geom, idx) => (
        <line key={`route-${idx}`} geometry={geom}>
          <lineBasicMaterial color="#FFD166" transparent opacity={0.65} linewidth={1.5} />
        </line>
      ))}

      {/* Traveling Energy Photons */}
      {curves.map((_, idx) => (
        <mesh key={`photon-${idx}`} ref={(el) => (photonRefs.current[idx] = el)}>
          <sphereGeometry args={[0.024, 12, 12]} />
          <meshBasicMaterial color="#FFF5B8" />
        </mesh>
      ))}

      {/* Global Hub Glowing Nodes */}
      {GLOBAL_HUBS.map((hub, idx) => {
        const hubPos = latLngToVector3(hub.coords[0], hub.coords[1], 1.605)
        return (
          <group key={`hub-${idx}`} position={hubPos.toArray()}>
            <mesh>
              <sphereGeometry args={[0.022, 12, 12]} />
              <meshBasicMaterial color="#FFD166" />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

/* ─── Ambient Floating Cosmic Gold Dust ────────────────────────── */
function CosmicStardust({ count = 90 }) {
  const points = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 2.0 + Math.random() * 1.8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.cos(phi)
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
    }
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return geom
  }, [count])

  const pointsRef = useRef()
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.04
      pointsRef.current.rotation.x += delta * 0.02
    }
  })

  return (
    <points ref={pointsRef} geometry={points}>
      <pointsMaterial
        size={0.038}
        color="#F5D77F"
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

/* ─── Dual Gyroscopic Planetary Celestial Rings ────────────────── */
function CelestialGyroRings() {
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const moonRef = useRef()

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()
    if (ring1Ref.current) ring1Ref.current.rotation.z = elapsed * 0.15
    if (ring2Ref.current) ring2Ref.current.rotation.z = -elapsed * 0.22

    if (moonRef.current) {
      const angle = elapsed * 0.6
      const rad = 2.05
      moonRef.current.position.set(Math.cos(angle) * rad, 0, Math.sin(angle) * rad)
    }
  })

  return (
    <group>
      {/* Primary Equatorial Golden Orbit Ring */}
      <group rotation={[Math.PI / 2.3, 0.2, 0]} ref={ring1Ref}>
        <mesh>
          <ringGeometry args={[1.98, 2.02, 96]} />
          <meshBasicMaterial color="#E5C378" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Secondary Tilted Cyan/Bronze Ring */}
      <group rotation={[Math.PI / 3.4, -0.4, 0.3]} ref={ring2Ref}>
        <mesh>
          <ringGeometry args={[2.18, 2.21, 96]} />
          <meshBasicMaterial color="#00F0FF" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
        {/* Orbiting Satellite Bead */}
        <mesh ref={moonRef}>
          <sphereGeometry args={[0.032, 16, 16]} />
          <meshBasicMaterial color="#00F0FF" />
        </mesh>
      </group>
    </group>
  )
}

/* ─── Pulsing Dubai Location Beacon with Ultra-Crisp 3D Vector Card ─── */
function DubaiLocationMarker({ radius = 1.62 }) {
  const markerGroupRef = useRef()
  const ringRef = useRef()
  const ring2Ref = useRef()
  const [facingFront, setFacingFront] = useState(true)

  // Dubai: lat 25.2048, lon 55.2708
  const pos = useMemo(() => latLngToVector3(25.2048, 55.2708, radius), [radius])

  const worldPos = useMemo(() => new THREE.Vector3(), [])
  const surfaceNormal = useMemo(() => new THREE.Vector3(), [])
  const toCamera = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ camera }, delta) => {
    if (!markerGroupRef.current) return

    // Calculate Dot Product for 3D Horizon Occlusion Check
    markerGroupRef.current.getWorldPosition(worldPos)
    surfaceNormal.copy(worldPos).normalize()
    toCamera.copy(camera.position).sub(worldPos).normalize()
    const dot = surfaceNormal.dot(toCamera)

    const isFacing = dot > 0.05
    if (isFacing !== facingFront) {
      setFacingFront(isFacing)
    }

    if (isFacing) {
      if (ringRef.current) {
        ringRef.current.scale.x += delta * 1.5
        ringRef.current.scale.y += delta * 1.5
        if (ringRef.current.scale.x > 3.2) ringRef.current.scale.set(1, 1, 1)
        if (ringRef.current.material) {
          ringRef.current.material.opacity = Math.max(0, 1 - (ringRef.current.scale.x - 1) / 2.2)
        }
      }
      if (ring2Ref.current) {
        ring2Ref.current.scale.x += delta * 1.1
        ring2Ref.current.scale.y += delta * 1.1
        if (ring2Ref.current.scale.x > 4.0) ring2Ref.current.scale.set(1, 1, 1)
        if (ring2Ref.current.material) {
          ring2Ref.current.material.opacity = Math.max(0, 1 - (ring2Ref.current.scale.x - 1) / 3.0)
        }
      }
    }
  })

  const normal = useMemo(() => pos.clone().normalize(), [pos])
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion()
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)
    return q
  }, [normal])

  return (
    <group ref={markerGroupRef} position={pos.toArray()} quaternion={quaternion}>
      {/* 3D Gold Pin Stem */}
      <mesh position={[0, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.016, 0.005, 0.18, 16]} />
        <meshBasicMaterial color="#FFD166" />
      </mesh>

      {/* Glowing Red Pin Head */}
      <mesh position={[0, 0, 0.18]}>
        <sphereGeometry args={[0.065, 20, 20]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>

      {/* Center White Core */}
      <mesh position={[0, 0, 0.18]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      {/* Radar Pulse 1 */}
      <mesh ref={ringRef} position={[0, 0, 0.01]}>
        <ringGeometry args={[0.07, 0.11, 32]} />
        <meshBasicMaterial color="#EF4444" transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Radar Pulse 2 */}
      <mesh ref={ring2Ref} position={[0, 0, 0.01]}>
        <ringGeometry args={[0.12, 0.16, 32]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* 🌟 Ultra-Crisp, Small & Sleek Vector Pin Tooltip 🌟 */}
      <Html
        position={[0, 0, 0.22]}
        center
        style={{
          opacity: facingFront ? 1 : 0,
          transform: `scale(${facingFront ? 0.68 : 0.35}) translateY(-38px)`,
          transformOrigin: 'bottom center',
          transition: 'opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div className="relative flex flex-col gap-0.5 rounded-lg border border-[#C9A15A]/80 bg-[#0c0b0a]/95 px-2.5 py-1.5 shadow-[0_6px_20px_rgba(0,0,0,0.85)] backdrop-blur-md whitespace-nowrap">
          {/* Speech Bubble Pointer Tail */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-x-[5px] border-t-[6px] border-x-transparent border-t-[#C9A15A]/80" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-x-[4px] border-t-[5px] border-x-transparent border-t-[#0c0b0a]" />

          {/* Title */}
          <h4 className="font-sans text-[11px] font-bold leading-tight tracking-tight text-[#F7F4EE]">
            Gilbert Kwizera HQ
          </h4>

          {/* Location Subtitle */}
          <div className="flex items-center gap-1 text-[9px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444] shadow-[0_0_4px_#EF4444]" />
            <span className="font-sans font-medium text-[#D1C9BC]">Port de La Mer, Dubai</span>
          </div>
        </div>
      </Html>
    </group>
  )
}

/* ─── Sci-Fi Holographic Vertical Laser Scanner Wave ─────────── */
function HolographicLaserScan() {
  const scanMeshRef = useRef()
  const ringRef = useRef()

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()
    // Smooth vertical cycle up and down
    const y = Math.sin(elapsed * 1.3) * 1.42
    if (scanMeshRef.current) {
      scanMeshRef.current.position.y = y
      // Adjust ring radius to hug the sphere geometry
      const sphereR = 1.6
      const rad = Math.sqrt(Math.max(0.1, sphereR * sphereR - y * y)) + 0.04
      scanMeshRef.current.scale.set(rad, rad, 1)
      if (ringRef.current && ringRef.current.material) {
        // Fade at the extreme poles
        const alpha = Math.max(0.1, 1 - Math.abs(y) / 1.5) * 0.45
        ringRef.current.material.opacity = alpha
      }
    }
  })

  return (
    <group ref={scanMeshRef} rotation={[Math.PI / 2, 0, 0]}>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.98, 1.02, 64]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

/* ─── Ultra-Realistic Photorealistic Gold & Black Earth Globe ──── */
function GoldAndBlackGlobe({ reduced }) {
  const globeGroupRef = useRef()
  const earthTexture = useTexture(earthGoldBlackImg)

  useMemo(() => {
    if (earthTexture) {
      earthTexture.wrapS = THREE.RepeatWrapping
      earthTexture.wrapT = THREE.ClampToEdgeWrapping
      earthTexture.anisotropy = 16
    }
  }, [earthTexture])

  useFrame((_, delta) => {
    if (reduced) return
    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.y += delta * 0.14
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.14} floatIntensity={0.25}>
      {/* Starting orientation showcasing Dubai & Europe/Africa */}
      <group ref={globeGroupRef} rotation={[0.22, 1.4, 0]}>
        {/* Core Photorealistic Gold & Black Earth Sphere */}
        <mesh>
          <sphereGeometry args={[1.6, 64, 64]} />
          {earthTexture ? (
            <meshStandardMaterial
              map={earthTexture}
              bumpMap={earthTexture}
              bumpScale={0.048}
              roughness={0.2}
              metalness={0.9}
            />
          ) : (
            <meshStandardMaterial color="#141210" roughness={0.4} metalness={0.8} />
          )}
        </mesh>

        {/* Holographic Cybernetic Lat-Long Wireframe Grid */}
        <mesh>
          <sphereGeometry args={[1.614, 32, 32]} />
          <meshBasicMaterial
            wireframe
            color="#FFD166"
            transparent
            opacity={0.065}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Vertical Holographic Sci-Fi Laser Scan Wave */}
        <HolographicLaserScan />

        {/* Dynamic Global Impact Animated Arc Routes & Photons */}
        <GlobalImpactRoutes />

        {/* Golden Atmospheric Glow Aura */}
        <mesh>
          <sphereGeometry args={[1.65, 64, 64]} />
          <meshStandardMaterial
            color="#D4AF37"
            transparent
            opacity={0.22}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Outer Cosmic Corona Rim */}
        <mesh>
          <sphereGeometry args={[1.72, 48, 48]} />
          <meshStandardMaterial
            color="#00F0FF"
            transparent
            opacity={0.09}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Dual Gyroscopic Planetary Rings & Orbiting Satellite */}
        <CelestialGyroRings />

        {/* Ambient Floating Cosmic Gold Dust */}
        <CosmicStardust />

        {/* Dubai Live Location Beacon & Attached 3D Name Tag */}
        <DubaiLocationMarker radius={1.6} />
      </group>
    </Float>
  )
}

export default function Contact3DCanvas({ className = '' }) {
  const reduced = useMemo(() => prefersReducedMotion(), [])

  return (
    <div className={`relative h-full w-full min-h-[340px] cursor-grab active:cursor-grabbing ${className}`}>
      <Canvas
        camera={{ position: [0, 0.2, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={1.25} />
        {/* Warm Golden Key Light */}
        <directionalLight position={[6, 5, 5]} intensity={2.9} color="#FFF8E0" />
        {/* Bronze Gold Rim Fill Light */}
        <directionalLight position={[-6, -4, -4]} intensity={1.7} color="#C9A15A" />
        {/* Cyan Accent Backlight */}
        <directionalLight position={[0, -5, -4]} intensity={1.3} color="#00E5FF" />
        <pointLight position={[0, 6, 3]} intensity={1.8} color="#FFDF78" />

        <Suspense fallback={null}>
          <GoldAndBlackGlobe reduced={reduced} />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.55}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  )
}

