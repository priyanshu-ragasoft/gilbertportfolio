import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// Milestone nodes in 3D space
const MILESTONE_NODES = [
  { id: 0, label: '2010 Signs', pos: [-1.8, 0.9, 0.4], color: '#f59e0b' },
  { id: 1, label: 'Diagnosis', pos: [-1.2, -1.1, 0.8], color: '#f97316' },
  { id: 2, label: 'CCF Lifeline', pos: [0, 1.6, -0.4], color: '#fbbf24' },
  { id: 3, label: '7-Day Care', pos: [1.3, -0.9, 0.7], color: '#10b981' },
  { id: 4, label: 'Healed Today', pos: [1.8, 0.8, -0.3], color: '#38bdf8' },
]

/**
 * 3D Crystalline Hope Core with morphing wireframe and inner pulsating ember
 */
function CrystallineCore({ activeStage }) {
  const crystalRef = useRef(null)
  const wireRef = useRef(null)
  const innerRef = useRef(null)
  const ring1Ref = useRef(null)
  const ring2Ref = useRef(null)
  const ring3Ref = useRef(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (crystalRef.current) {
      crystalRef.current.rotation.x = t * 0.25
      crystalRef.current.rotation.y = t * 0.35
      const s = 1 + Math.sin(t * 2) * 0.05
      crystalRef.current.scale.set(s, s, s)
    }

    if (wireRef.current) {
      wireRef.current.rotation.x = -t * 0.2
      wireRef.current.rotation.z = t * 0.15
    }

    if (innerRef.current) {
      const pulse = 1 + Math.sin(t * 3.5) * 0.12
      innerRef.current.scale.set(pulse, pulse, pulse)
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.4
      ring1Ref.current.rotation.y = t * 0.2
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.3
      ring2Ref.current.rotation.z = t * 0.25
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -t * 0.25
      ring3Ref.current.rotation.z = -t * 0.35
    }
  })

  // Color changes based on active stage
  const stageColors = ['#f59e0b', '#f97316', '#fbbf24', '#10b981', '#38bdf8']
  const currentColor = stageColors[activeStage] || '#fbbf24'

  return (
    <group>
      {/* Outer Geodesic Crystalline Facet */}
      <mesh ref={crystalRef}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshPhysicalMaterial
          color={currentColor}
          emissive={currentColor}
          emissiveIntensity={0.25}
          roughness={0.1}
          metalness={0.8}
          transmission={0.6}
          thickness={0.8}
          transparent
          opacity={0.7}
          wireframe={false}
        />
      </mesh>

      {/* Wireframe Holographic Shell */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.25, 2]} />
        <meshStandardMaterial
          color="#fef3c7"
          emissive={currentColor}
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Glowing Inner Life Core */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <pointLight color={currentColor} intensity={2.5} distance={5} />

      {/* Orbiting Concentric Gold Energy Rings */}
      <group ref={ring1Ref}>
        <mesh>
          <torusGeometry args={[1.65, 0.018, 16, 100]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.6} metalness={0.9} />
        </mesh>
      </group>

      <group ref={ring2Ref}>
        <mesh>
          <torusGeometry args={[1.9, 0.015, 16, 100]} />
          <meshStandardMaterial color="#d97706" emissive="#d97706" emissiveIntensity={0.5} metalness={0.9} />
        </mesh>
      </group>

      <group ref={ring3Ref}>
        <mesh>
          <torusGeometry args={[2.15, 0.012, 16, 100]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.7} metalness={0.9} />
        </mesh>
      </group>
    </group>
  )
}

/**
 * 3D Curved Light Arcs connecting milestones to the center
 */
function HopeLightArcs({ activeStage, onSelectStage }) {
  const photonRefs = useRef([])

  const { curves, geoms } = useMemo(() => {
    const curveList = []
    const geomList = []
    const center = new THREE.Vector3(0, 0, 0)

    MILESTONE_NODES.forEach((node) => {
      const v = new THREE.Vector3(...node.pos)
      const mid = v.clone().multiplyScalar(0.5)
      mid.y += 0.35
      mid.z += 0.2

      const curve = new THREE.QuadraticBezierCurve3(center, mid, v)
      curveList.push(curve)
      const pts = curve.getPoints(40)
      geomList.push(new THREE.BufferGeometry().setFromPoints(pts))
    })

    return { curves: curveList, geoms: geomList }
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    curves.forEach((curve, i) => {
      const photon = photonRefs.current[i]
      if (photon) {
        const speed = i === activeStage ? 0.8 : 0.4
        const progress = ((t * speed) + (i * 0.2)) % 1
        const point = curve.getPointAt(progress)
        photon.position.copy(point)
        const scale = i === activeStage ? 1.4 + Math.sin(t * 6) * 0.3 : 0.8
        photon.scale.set(scale, scale, scale)
      }
    })
  })

  return (
    <group>
      {/* Light Arcs */}
      {geoms.map((geom, idx) => (
        <line key={`arc-${idx}`} geometry={geom}>
          <lineBasicMaterial
            color={idx === activeStage ? '#fde047' : '#d97706'}
            transparent
            opacity={idx === activeStage ? 0.85 : 0.25}
            linewidth={idx === activeStage ? 2 : 1}
          />
        </line>
      ))}

      {/* Traveling Energy Photons */}
      {curves.map((_, idx) => (
        <mesh key={`photon-${idx}`} ref={(el) => (photonRefs.current[idx] = el)}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={idx === activeStage ? '#ffffff' : '#fef08a'} />
        </mesh>
      ))}

      {/* Interactive Milestone Nodes */}
      {MILESTONE_NODES.map((node) => {
        const isSelected = node.id === activeStage
        return (
          <group
            key={`node-${node.id}`}
            position={node.pos}
            onClick={() => onSelectStage && onSelectStage(node.id)}
          >
            {/* Glowing Sphere */}
            <mesh>
              <sphereGeometry args={[isSelected ? 0.16 : 0.1, 24, 24]} />
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={isSelected ? 1.4 : 0.6}
                metalness={0.8}
              />
            </mesh>

            {/* Pulsing Outer Halo */}
            <mesh>
              <ringGeometry args={[isSelected ? 0.22 : 0.14, isSelected ? 0.26 : 0.16, 32]} />
              <meshBasicMaterial color={node.color} side={THREE.DoubleSide} transparent opacity={isSelected ? 0.8 : 0.3} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

/**
 * Swirling Fluid Constellation Particle Vortex
 */
function HopeParticleVortex({ count = 180, mouse }) {
  const pointsRef = useRef(null)
  const posArray = useRef(null)

  const { positions, radiusArr, speedArr, angleArr, ySpeedArr } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const rad = new Float32Array(count)
    const spd = new Float32Array(count)
    const ang = new Float32Array(count)
    const ySpd = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      rad[i] = 1.2 + Math.random() * 2.8
      ang[i] = Math.random() * Math.PI * 2
      spd[i] = 0.2 + Math.random() * 0.4
      ySpd[i] = (Math.random() - 0.5) * 0.8

      pos[i * 3] = Math.cos(ang[i]) * rad[i]
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3.2
      pos[i * 3 + 2] = Math.sin(ang[i]) * rad[i]
    }
    return { positions: pos, radiusArr: rad, speedArr: spd, angleArr: ang, ySpeedArr: ySpd }
  }, [count])

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3))
    return g
  }, [positions])

  useEffect(() => {
    posArray.current = positions.slice()
    return () => geom.dispose()
  }, [geom, positions])

  useFrame((state, delta) => {
    if (!pointsRef.current || !posArray.current) return
    const pos = posArray.current
    const n = pos.length / 3

    for (let i = 0; i < n; i++) {
      angleArr[i] += speedArr[i] * delta * 0.8
      const r = radiusArr[i]
      const mx = mouse.current.x * 0.4
      const my = mouse.current.y * 0.4

      pos[i * 3] = Math.cos(angleArr[i]) * r + mx
      pos[i * 3 + 1] += ySpeedArr[i] * delta * 0.5 + my * 0.05
      pos[i * 3 + 2] = Math.sin(angleArr[i]) * r

      // Wrap vertically
      if (pos[i * 3 + 1] > 2.2) pos[i * 3 + 1] = -2.2
      if (pos[i * 3 + 1] < -2.2) pos[i * 3 + 1] = 2.2
    }

    const attr = pointsRef.current.geometry.getAttribute('position')
    attr.array.set(pos)
    attr.needsUpdate = true
  })

  return (
    <points ref={pointsRef} geometry={geom}>
      <pointsMaterial
        color="#fbbf24"
        size={0.055}
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function Scene({ activeStage, onSelectStage }) {
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => window.removeEventListener('pointermove', handleMove)
  }, [])

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 6, 4]} intensity={1.8} color="#fef3c7" />
      <pointLight position={[-4, -3, 3]} intensity={1.2} color="#f59e0b" />
      <pointLight position={[3, -4, -2]} intensity={1.0} color="#10b981" />

      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
        <CrystallineCore activeStage={activeStage} />
        <HopeLightArcs activeStage={activeStage} onSelectStage={onSelectStage} />
      </Float>

      <HopeParticleVortex count={180} mouse={mouse} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.6}
        maxPolarAngle={Math.PI / 1.6}
        minPolarAngle={Math.PI / 2.6}
      />
    </>
  )
}

export default function TestimonyRibbonCanvas({ activeStage = 0, onSelectStage, className = '' }) {
  return (
    <div className={`relative h-full w-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Scene activeStage={activeStage} onSelectStage={onSelectStage} />
      </Canvas>
    </div>
  )
}
