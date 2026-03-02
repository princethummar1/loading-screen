import { useRef, useEffect, useMemo, Suspense, useState, useCallback, memo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import gsap from 'gsap'
import { useAudio } from '../../context/AudioContext'
import './HeroOrganism.css'

// ============================================================
// AUDIO CONFIGURATION
// Place your audio file at: public/audio/hero-music.mp3
// Supported: .mp3, .wav, .ogg
// ============================================================
const AUDIO_SRC = '/audio/hero-music.mp3'

// ============================================================
// SHOCKWAVE RING COMPONENT
// ============================================================
function ShockwaveRing({ trigger }) {
  const ringRef = useRef()
  const matRef = useRef()
  
  useEffect(() => {
    if (!trigger || !ringRef.current || !matRef.current) return
    
    // Reset
    ringRef.current.scale.set(0.1, 0.1, 0.1)
    matRef.current.opacity = 0.8
    
    // Expand rapidly
    gsap.to(ringRef.current.scale, {
      x: 6, y: 6, z: 6,
      duration: 0.8,
      ease: 'power2.out'
    })
    // Fade out
    gsap.to(matRef.current, {
      opacity: 0,
      duration: 0.6,
      delay: 0.1,
      ease: 'power2.out'
    })
  }, [trigger])

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1, 0.02, 8, 64]} />
      <meshBasicMaterial
        ref={matRef}
        color="#9333ea"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

// ============================================================
// CAMERA CONTROLLER (for shake effects)
// ============================================================
function CameraController({ cameraShake }) {
  const { camera } = useThree()
  
  useFrame(() => {
    if (cameraShake.current) {
      camera.position.x = cameraShake.current.x
      camera.position.y = cameraShake.current.y
    }
  })
  
  return null
}

// ============================================================
// GEOMETRY HELPERS FOR LETTER K
// ============================================================
function createSelectiveRoundedRect(w, h, r, corners) {
  const s = new THREE.Shape()
  const [tl, tr, br, bl] = corners
  
  // Start at bottom-left
  if (bl) {
    s.moveTo(-w/2 + r, -h/2)
  } else {
    s.moveTo(-w/2, -h/2)
  }
  
  // Bottom edge to bottom-right
  if (br) {
    s.lineTo(w/2 - r, -h/2)
    s.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r)
  } else {
    s.lineTo(w/2, -h/2)
  }
  
  // Right edge to top-right
  if (tr) {
    s.lineTo(w/2, h/2 - r)
    s.quadraticCurveTo(w/2, h/2, w/2 - r, h/2)
  } else {
    s.lineTo(w/2, h/2)
  }
  
  // Top edge to top-left
  if (tl) {
    s.lineTo(-w/2 + r, h/2)
    s.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r)
  } else {
    s.lineTo(-w/2, h/2)
  }
  
  // Left edge back to bottom-left
  if (bl) {
    s.lineTo(-w/2, -h/2 + r)
    s.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2)
  } else {
    s.lineTo(-w/2, -h/2)
  }
  
  s.closePath()
  return s
}

function createPillShape(length, thickness, radius) {
  const s = new THREE.Shape()
  // Left rounded cap
  s.absarc(-length/2 + radius, 0, radius, Math.PI/2, -Math.PI/2, true)
  // Right rounded cap
  s.absarc(length/2 - radius, 0, radius, -Math.PI/2, Math.PI/2, true)
  s.closePath()
  return s
}

// ============================================================
// LETTER K COMPONENT (4 chrome pieces with gaps)
// ============================================================
function LetterK({ 
  smoothMouse, 
  audioData, 
  kGroupRef 
}) {
  const materialRef = useRef()
  
  // Chrome material with iridescence
  const chromeMat = useMemo(() => 
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#1a0533'),
      emissive: new THREE.Color('#4a1080'),
      emissiveIntensity: 0.4,
      metalness: 1.0,
      roughness: 0.04,
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      iridescence: 1.0,
      iridescenceIOR: 2.0,
      iridescenceThicknessRange: [200, 1000],
      envMapIntensity: 3.5,
    }), []
  )
  
  // Store material ref for audio reactivity
  useEffect(() => {
    materialRef.current = chromeMat
  }, [chromeMat])
  
  // Extrude settings
  const extrudeSettings = useMemo(() => ({
    depth: 0.45,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.06,
    bevelSegments: 8,
    curveSegments: 16,
  }), [])
  
  // Create all 4 geometries
  const { upperStemGeo, lowerStemGeo, upperArmGeo, lowerArmGeo } = useMemo(() => {
    // Piece 1: Upper stem (rounded top corners only)
    const upperStemShape = createSelectiveRoundedRect(
      0.52, 1.30, 0.26, [true, true, false, false]
    )
    const upperStem = new THREE.ExtrudeGeometry(upperStemShape, extrudeSettings)
    upperStem.center()
    
    // Piece 2: Lower stem (rounded bottom corners only)
    const lowerStemShape = createSelectiveRoundedRect(
      0.52, 1.10, 0.26, [false, false, true, true]
    )
    const lowerStem = new THREE.ExtrudeGeometry(lowerStemShape, extrudeSettings)
    lowerStem.center()
    
    // Piece 3: Upper diagonal arm (pill shape)
    const upperArmShape = createPillShape(1.35, 0.38, 0.19)
    const upperArm = new THREE.ExtrudeGeometry(upperArmShape, extrudeSettings)
    upperArm.center()
    
    // Piece 4: Lower diagonal arm (pill shape)
    const lowerArmShape = createPillShape(1.35, 0.38, 0.19)
    const lowerArm = new THREE.ExtrudeGeometry(lowerArmShape, extrudeSettings)
    lowerArm.center()
    
    return {
      upperStemGeo: upperStem,
      lowerStemGeo: lowerStem,
      upperArmGeo: upperArm,
      lowerArmGeo: lowerArm
    }
  }, [extrudeSettings])
  
  // Entrance animation
  useEffect(() => {
    if (kGroupRef.current) {
      kGroupRef.current.scale.set(0, 0, 0)
      gsap.to(kGroupRef.current.scale, {
        x: 1, y: 1, z: 1,
        duration: 2.0,
        ease: 'elastic.out(1, 0.4)',
        delay: 0.5,
      })
    }
  }, [kGroupRef])
  
  useFrame((state) => {
    if (!kGroupRef.current || !materialRef.current) return
    
    const t = state.clock.elapsedTime
    const mouse = smoothMouse.current
    const audio = audioData.current
    
    // Enhanced mouse interactivity - faster response, more rotation
    const targetRotY = mouse.x * 0.8
    const targetRotX = -mouse.y * 0.5
    const targetRotZ = mouse.x * mouse.y * 0.15
    
    kGroupRef.current.rotation.y += (targetRotY - kGroupRef.current.rotation.y) * 0.12
    kGroupRef.current.rotation.x += (targetRotX - kGroupRef.current.rotation.x) * 0.12
    kGroupRef.current.rotation.z += (targetRotZ - kGroupRef.current.rotation.z) * 0.08
    
    // Mouse-driven position offset (subtle parallax)
    const targetPosX = mouse.x * 0.15
    const targetPosY = Math.sin(t * 0.6) * 0.06 + mouse.y * 0.1
    kGroupRef.current.position.x = 0.3 + (targetPosX - (kGroupRef.current.position.x - 0.3)) * 0.1
    kGroupRef.current.position.y += (targetPosY - kGroupRef.current.position.y) * 0.1
    
    // Audio reactivity on material
    const mat = materialRef.current
    mat.emissiveIntensity = 0.4 + audio.mid * 1.5
    
    // Color shifts with frequencies (purple → pink)
    const r = 0.29 + audio.high * 0.4
    const g = 0.06 + audio.mid * 0.08
    const b = 0.50 - audio.high * 0.2
    mat.emissive.setRGB(r, g, b)
    
    // Scale pulse with bass
    const targetScale = 1.0 + audio.bass * 0.25
    const currentScale = kGroupRef.current.scale.x
    const newScale = currentScale + (targetScale - currentScale) * 0.12
    kGroupRef.current.scale.setScalar(newScale)
  })
  
  return (
    <group ref={kGroupRef} position={[0.3, 0, 0]}>
      {/* Piece 1: Upper stem */}
      <mesh 
        geometry={upperStemGeo} 
        material={chromeMat}
        position={[-0.72, 0.38, 0]}
      />
      
      {/* Piece 2: Lower stem */}
      <mesh 
        geometry={lowerStemGeo} 
        material={chromeMat}
        position={[-0.72, -0.67, 0]}
      />
      
      {/* Piece 3: Upper diagonal arm */}
      <mesh 
        geometry={upperArmGeo} 
        material={chromeMat}
        position={[0.10, 0.28, 0]}
        rotation={[0, 0, -0.60]}
      />
      
      {/* Piece 4: Lower diagonal arm */}
      <mesh 
        geometry={lowerArmGeo} 
        material={chromeMat}
        position={[0.10, -0.28, 0]}
        rotation={[0, 0, 0.60]}
      />
    </group>
  )
}

// ============================================================
// PARTICLE RING COMPONENT
// ============================================================
function ParticleRing({ 
  count, 
  baseRadius, 
  radiusVariance, 
  speed, 
  size, 
  color,
  opacity = 0.9,
  tiltX = 0, 
  tiltZ = 0,
  smoothMouse,
  scrollProgress,
  ringIndex,
  audioData,
  explosionProgress,
  particleBeatBurst
}) {
  const pointsRef = useRef()
  const materialRef = useRef()
  const positionsRef = useRef()
  const initialAnglesRef = useRef()
  const initialRadiiRef = useRef()
  const velocitiesRef = useRef([])
  
  // Initialize particle data
  const { positions, initialAngles, initialRadii } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const angles = new Float32Array(count)
    const radii = new Float32Array(count)
    const vels = []
    
    for (let i = 0; i < count; i++) {
      angles[i] = (i / count) * Math.PI * 2
      radii[i] = baseRadius + (Math.random() - 0.5) * radiusVariance
      
      const angle = angles[i]
      const radius = radii[i]
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = 0
      pos[i * 3 + 2] = Math.sin(angle) * radius
      
      vels.push({
        x: (Math.random() - 0.5) * 0.3,
        y: (Math.random() - 0.5) * 0.3,
        z: (Math.random() - 0.5) * 0.2
      })
    }
    velocitiesRef.current = vels
    
    return { positions: pos, initialAngles: angles, initialRadii: radii }
  }, [count, baseRadius, radiusVariance])
  
  useEffect(() => {
    positionsRef.current = positions.slice()
    initialAnglesRef.current = initialAngles
    initialRadiiRef.current = initialRadii
  }, [positions, initialAngles, initialRadii])
  
  useFrame((state) => {
    if (!pointsRef.current || !positionsRef.current) return
    
    // Skip updates when hero is scrolled out of view (scroll > 1.2)
    const scroll = scrollProgress.current
    if (scroll > 1.2) return
    
    const t = state.clock.elapsedTime
    const mouse = smoothMouse.current
    const audio = audioData.current
    const explosion = explosionProgress.current
    const beatBurst = particleBeatBurst.current
    
    const posArray = pointsRef.current.geometry.attributes.position.array
    
    // Audio-modified parameters
    let radiusMod = 1
    let speedMod = speed
    let currentOpacity = opacity
    let currentSize = size
    
    if (ringIndex === 0) {
      // Inner ring: SLOW DOWN when music plays, bass pulses outward
      radiusMod = 1 - scroll * 0.2 + audio.bass * 0.3
      speedMod = speed * (1 - audio.avg * 0.6)  // Reduce speed with music
      currentSize = size + audio.bass * 0.02
    } else if (ringIndex === 1) {
      // Mid ring (pink): vertical bounce with bass beats
      radiusMod = 1 + scroll * 0.5
      speedMod = speed * 0.8  // Slightly slower base speed
    } else if (ringIndex === 2) {
      // Outer ring: high controls brightness/size
      radiusMod = 1 + scroll * 0.8
      currentOpacity = opacity + audio.high * 0.5
      currentSize = size + audio.high * 0.04
    }
    
    for (let i = 0; i < count; i++) {
      const baseAngle = initialAnglesRef.current[i]
      const radius = initialRadiiRef.current[i] * radiusMod
      
      // Orbit motion with audio speed mod
      const angle = baseAngle + t * speedMod
      
      // Base position
      let x = Math.cos(angle) * radius
      let z = Math.sin(angle) * radius
      let y = Math.sin(t * 0.5 + i * 0.3) * 0.3
      
      // Pink ring (ringIndex 1): bounce up/down with bass beats
      if (ringIndex === 1) {
        const beatBounce = audio.bass * 0.8 * Math.sin(t * 8 + i * 0.5)
        y += beatBounce
        // Also add subtle wave motion synced to mid frequencies
        y += audio.mid * 0.3 * Math.sin(t * 4 + i * 0.8)
      }
      
      // Mouse attraction
      x += mouse.x * (1 / (radius * 0.5)) * 0.3
      y += mouse.y * (1 / (radius * 0.5)) * 0.2
      
      // Explosion effect
      if (explosion > 0.01) {
        const vel = velocitiesRef.current[i]
        x += vel.x * explosion * 8
        y += vel.y * explosion * 8
        z += vel.z * explosion * 8
      }
      
      // Beat burst scatter
      if (beatBurst > 0.01) {
        const vel = velocitiesRef.current[i]
        x += vel.x * beatBurst * 3
        y += vel.y * beatBurst * 3
        z += vel.z * beatBurst * 2
      }
      
      posArray[i * 3] = x
      posArray[i * 3 + 1] = y
      posArray[i * 3 + 2] = z
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true
    
    // Update material properties
    if (materialRef.current) {
      materialRef.current.opacity = currentOpacity
      materialRef.current.size = currentSize
    }
    
    // Ring rotation follows mouse
    pointsRef.current.rotation.y = mouse.x * 0.3
    pointsRef.current.rotation.x = mouse.y * 0.2
  })
  
  return (
    <group rotation={[tiltX, 0, tiltZ]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          size={size}
          color={color}
          transparent
          opacity={opacity}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  )
}

// ============================================================
// MAIN SCENE - Contains blob + particles + shockwave
// ============================================================
function OrganismScene({ 
  smoothMouse, 
  scrollProgress, 
  isMobile,
  audioData,
  morphIntensity,
  explosionProgress,
  particleBeatBurst,
  shockwaveTrigger,
  blobRef
}) {
  const sceneRef = useRef()
  
  // Particle counts (reduced on mobile)
  const ring1Count = isMobile ? 50 : 120
  const ring2Count = isMobile ? 30 : 80
  const ring3Count = isMobile ? 20 : 50
  
  useFrame((state) => {
    if (!sceneRef.current) return
    
    const t = state.clock.elapsedTime
    const mouse = smoothMouse.current
    const scroll = scrollProgress.current
    const audio = audioData.current
    
    // Whole scene subtle parallax
    sceneRef.current.rotation.y = mouse.x * 0.08
    sceneRef.current.rotation.x = -mouse.y * 0.05
    
    // Scroll moves scene up and tilts
    sceneRef.current.position.y = scroll * 2
    
    // Audio sway: scene rotates slightly with beat
    sceneRef.current.rotation.z = Math.sin(t * 0.5) * 0.02 * (1 + audio.avg * 2) + scroll * 0.3
  })
  
  return (
    <group ref={sceneRef}>
      {/* The 3D chrome Letter K */}
      <LetterK 
        smoothMouse={smoothMouse} 
        audioData={audioData}
        kGroupRef={blobRef}
      />
      
      {/* Shockwave ring */}
      <ShockwaveRing trigger={shockwaveTrigger} />
      
      {/* Ring 1 - Inner orbit (close, fast) */}
      <ParticleRing
        count={ring1Count}
        baseRadius={2.0}
        radiusVariance={0.4}
        speed={0.4}
        size={0.06}
        color="#a855f7"
        opacity={0.9}
        smoothMouse={smoothMouse}
        scrollProgress={scrollProgress}
        ringIndex={0}
        audioData={audioData}
        explosionProgress={explosionProgress}
        particleBeatBurst={particleBeatBurst}
      />
      
      {/* Ring 2 - Mid orbit (tilted, slower) */}
      <ParticleRing
        count={ring2Count}
        baseRadius={3.0}
        radiusVariance={0.6}
        speed={0.22}
        size={0.045}
        color="#ec4899"
        opacity={0.8}
        tiltX={Math.PI * 0.19}
        smoothMouse={smoothMouse}
        scrollProgress={scrollProgress}
        ringIndex={1}
        audioData={audioData}
        explosionProgress={explosionProgress}
        particleBeatBurst={particleBeatBurst}
      />
      
      {/* Ring 3 - Outer orbit (far, slowest) */}
      <ParticleRing
        count={ring3Count}
        baseRadius={4.6}
        radiusVariance={0.8}
        speed={0.12}
        size={0.03}
        color="#818cf8"
        opacity={0.7}
        tiltZ={Math.PI * 0.36}
        smoothMouse={smoothMouse}
        scrollProgress={scrollProgress}
        ringIndex={2}
        audioData={audioData}
        explosionProgress={explosionProgress}
        particleBeatBurst={particleBeatBurst}
      />
    </group>
  )
}

// ============================================================
// BEAT DETECTOR COMPONENT
// ============================================================
function BeatDetector({ audioData, onBeat }) {
  const lastBass = useRef(0)
  const beatCooldown = useRef(0)
  const beatThreshold = 0.75
  
  useFrame((state) => {
    const bass = audioData.current.bass
    const now = state.clock.elapsedTime
    
    // Beat detected!
    if (bass > beatThreshold && 
        bass > lastBass.current && 
        now - beatCooldown.current > 0.5) {
      
      beatCooldown.current = now
      onBeat(bass)
    }
    lastBass.current = bass
  })
  
  return null
}

// ============================================================
// MAIN EXPORT COMPONENT
// ============================================================
function HeroOrganism({ className = '' }) {
  const mouse = useRef({ x: 0, y: 0 })
  const smoothMouse = useRef({ x: 0, y: 0 })
  const scrollProgress = useRef(0)
  const [isMobile, setIsMobile] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const [shockwaveTrigger, setShockwaveTrigger] = useState(0)
  
  // Shared audio context
  const { 
    isPlaying, 
    setIsPlaying, 
    markClicked, 
    analyserRef, 
    audioDataRef,
    registerToggle
  } = useAudio()
  
  // Local audio refs
  const audioCtx = useRef(null)
  const analyser = useRef(null)
  const audioDataArray = useRef(new Uint8Array(256))
  const audioElement = useRef(null)
  const source = useRef(null)
  const audioData = useRef({ bass: 0, mid: 0, high: 0, avg: 0 })
  const smoothedAudio = useRef({ bass: 0, mid: 0, high: 0, avg: 0 })
  const isPlayingRef = useRef(false)
  
  // Animation refs
  const blobRef = useRef()
  const cameraShake = useRef({ x: 0, y: 0 })
  const morphIntensity = useRef(0.25)
  const explosionProgress = useRef(0)
  const particleBeatBurst = useRef(0)
  
  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector('.hero-background')
      if (!hero) return
      const rect = hero.getBoundingClientRect()
      scrollProgress.current = Math.max(0, Math.min(1, -rect.top / rect.height))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Smooth mouse interpolation + audio data update with LERP
  useEffect(() => {
    let animationId
    const lerpSpeed = 0.15  // Smooth audio transitions (higher = more reactive)
    
    const animate = () => {
      smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.04
      smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.04
      
      // FIX 2: Smoothed audio data with lerp
      if (analyser.current && isPlayingRef.current) {
        analyser.current.getByteFrequencyData(audioDataArray.current)
        const data = audioDataArray.current
        
        // Raw values from specific frequency bins
        // Bass: frequencies 2-12 (skip 0-1 which can have DC offset)
        let bassSum = 0
        for (let i = 2; i < 12; i++) bassSum += data[i]
        const rawBass = bassSum / 10 / 255
        
        // Mid: frequencies 12-80
        let midSum = 0
        for (let i = 12; i < 80; i++) midSum += data[i]
        const rawMid = midSum / 68 / 255
        
        // High: frequencies 80-180
        let highSum = 0
        for (let i = 80; i < 180; i++) highSum += data[i]
        const rawHigh = highSum / 100 / 255
        
        // Average
        let totalSum = 0
        for (let i = 0; i < data.length; i++) totalSum += data[i]
        const rawAvg = totalSum / data.length / 255
        
        // SMOOTH with lerp — removes spikes and jumps
        smoothedAudio.current.bass += (rawBass - smoothedAudio.current.bass) * lerpSpeed
        smoothedAudio.current.mid += (rawMid - smoothedAudio.current.mid) * lerpSpeed
        smoothedAudio.current.high += (rawHigh - smoothedAudio.current.high) * lerpSpeed
        smoothedAudio.current.avg += (rawAvg - smoothedAudio.current.avg) * lerpSpeed
        
        // Update the audioData ref with smoothed values
        audioData.current = { ...smoothedAudio.current }
        
        // Update morph intensity based on mid
        morphIntensity.current = 0.25 + smoothedAudio.current.mid * 0.4
      } else {
        // Slowly decay to 0 when not playing
        smoothedAudio.current.bass *= 0.95
        smoothedAudio.current.mid *= 0.95
        smoothedAudio.current.high *= 0.95
        smoothedAudio.current.avg *= 0.95
        audioData.current = { ...smoothedAudio.current }
      }
      
      // Decay beat burst
      particleBeatBurst.current *= 0.92
      
      animationId = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(animationId)
  }, [])
  
  // Initialize audio
  const initAudio = useCallback(() => {
    if (audioCtx.current) return
    
    audioCtx.current = new (window.AudioContext || window.webkitAudioContext)()
    
    audioElement.current = new Audio(AUDIO_SRC)
    audioElement.current.loop = true
    audioElement.current.crossOrigin = 'anonymous'
    
    source.current = audioCtx.current.createMediaElementSource(audioElement.current)
    
    analyser.current = audioCtx.current.createAnalyser()
    analyser.current.fftSize = 256
    analyser.current.smoothingTimeConstant = 0.8
    
    // Share analyser with navbar SoundWave component
    analyserRef.current = analyser.current
    audioDataRef.current = new Uint8Array(128)
    
    source.current.connect(analyser.current)
    analyser.current.connect(audioCtx.current.destination)
  }, [analyserRef, audioDataRef])
  
  // Explosion effect
  const triggerExplosionEffect = useCallback(() => {
    if (!blobRef.current) return
    
    // 1. Blob rapidly expands then contracts
    gsap.to(blobRef.current.scale, {
      x: 2.5, y: 2.5, z: 2.5,
      duration: 0.3,
      ease: 'power4.out',
      onComplete: () => {
        gsap.to(blobRef.current.scale, {
          x: 1, y: 1, z: 1,
          duration: 0.8,
          ease: 'elastic.out(1, 0.4)'
        })
      }
    })
    
    // 2. Screen flash effect
    gsap.to('.hero-flash-overlay', {
      opacity: 0.6,
      duration: 0.05,
      onComplete: () => {
        gsap.to('.hero-flash-overlay', {
          opacity: 0,
          duration: 0.4
        })
      }
    })
    
    // 3. Particles explode outward
    explosionProgress.current = 1.0
    gsap.to(explosionProgress, {
      current: 0,
      duration: 1.5,
      ease: 'power3.out'
    })
    
    // 4. Camera shake
    gsap.to(cameraShake.current, {
      x: (Math.random() - 0.5) * 0.3,
      y: (Math.random() - 0.5) * 0.3,
      duration: 0.1,
      yoyo: true,
      repeat: 5,
      ease: 'none',
      onComplete: () => {
        gsap.to(cameraShake.current, { x: 0, y: 0, duration: 0.3 })
      }
    })
    
    // 5. Shockwave ring
    setShockwaveTrigger(prev => prev + 1)
  }, [])
  
  // Collapse effect
  const triggerCollapseEffect = useCallback(() => {
    if (!blobRef.current) return
    
    gsap.to(blobRef.current.scale, {
      x: 0.6, y: 0.6, z: 0.6,
      duration: 0.2,
      ease: 'power4.in',
      onComplete: () => {
        gsap.to(blobRef.current.scale, {
          x: 1, y: 1, z: 1,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)'
        })
      }
    })
  }, [])
  
  // Handle blob click
  const handleBlobClick = useCallback(async () => {
    // Hide hint after first click
    setShowHint(false)
    
    // Mark as clicked for cursor badge
    markClicked()
    
    // Init audio on first click (browser policy)
    initAudio()
    
    if (isPlaying) {
      // PAUSE
      audioElement.current.pause()
      setIsPlaying(false)
      isPlayingRef.current = false
      triggerCollapseEffect()
    } else {
      // PLAY
      await audioCtx.current.resume()
      audioElement.current.play()
      setIsPlaying(true)
      isPlayingRef.current = true
      triggerExplosionEffect()
    }
  }, [isPlaying, initAudio, triggerExplosionEffect, triggerCollapseEffect, markClicked, setIsPlaying])
  
  // Register toggle callback for navbar SoundWave button
  useEffect(() => {
    registerToggle(handleBlobClick)
    return () => registerToggle(null)
  }, [handleBlobClick, registerToggle])
  
  // Handle beat detection
  const handleBeatDetected = useCallback((intensity) => {
    if (!blobRef.current) return
    
    // 1. Quick scale punch on blob
    gsap.to(blobRef.current.scale, {
      x: 1 + intensity * 0.4,
      y: 1 + intensity * 0.4,
      z: 1 + intensity * 0.4,
      duration: 0.08,
      yoyo: true,
      repeat: 1,
      ease: 'power4.out'
    })
    
    // 2. Spawn mini shockwave
    setShockwaveTrigger(prev => prev + 1)
    
    // 3. All particles briefly scatter
    particleBeatBurst.current = intensity
    
    // 4. Screen edge vignette flash
    gsap.to('.hero-vignette', {
      opacity: intensity * 0.4,
      duration: 0.05,
      yoyo: true,
      repeat: 1
    })
  }, [])
  
  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioElement.current) {
        audioElement.current.pause()
        audioElement.current.src = ''
      }
      if (audioCtx.current) {
        audioCtx.current.close()
      }
    }
  }, [])
  
  return (
    <div className={`hero-organism-container ${className}`}>
      {/* Ambient glow behind blob */}
      <div className="hero-glow" />
      
      {/* Flash overlay on click */}
      <div className="hero-flash-overlay" />
      
      {/* Vignette for beat flash */}
      <div className="hero-vignette" />
      
      {/* Click hint */}
      {showHint && (
        <div className="blob-hint">
          ▶ Click to play
        </div>
      )}
      
      
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.6,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent', cursor: 'pointer' }}
        onClick={handleBlobClick}
      >
        <Suspense fallback={null}>
          {/* Camera controller for shake */}
          <CameraController cameraShake={cameraShake} />
          
          {/* Beat detector */}
          <BeatDetector 
            audioData={audioData} 
            onBeat={handleBeatDetected} 
          />
          
          {/* Chrome-optimized lighting */}
          <ambientLight intensity={0.3} color="#ffffff" />
          
          {/* Key light - main specular highlight */}
          <spotLight 
            position={[3, 4, 5]} 
            intensity={80} 
            color="#ffffff"
            angle={0.5}
            penumbra={0.5}
          />
          
          {/* Rim lights for chrome edges */}
          <pointLight position={[-5, 2, -2]} intensity={40} color="#a855f7" />
          <pointLight position={[5, -2, -2]} intensity={40} color="#ec4899" />
          
          {/* Fill lights */}
          <pointLight position={[0, 5, 3]} intensity={25} color="#3b82f6" />
          <pointLight position={[0, -4, 2]} intensity={20} color="#8b5cf6" />
          
          {/* Environment for chrome reflections */}
          <Environment background={false} preset="city" />
          
          {/* The organism */}
          <OrganismScene 
            smoothMouse={smoothMouse} 
            scrollProgress={scrollProgress}
            isMobile={isMobile}
            audioData={audioData}
            morphIntensity={morphIntensity}
            explosionProgress={explosionProgress}
            particleBeatBurst={particleBeatBurst}
            shockwaveTrigger={shockwaveTrigger}
            blobRef={blobRef}
          />
          
          {/* Refined bloom for chrome */}
          <EffectComposer>
            <Bloom
              intensity={2.0}
              luminanceThreshold={0.4}
              luminanceSmoothing={0.8}
              mipmapBlur={true}
              radius={0.6}
              blendFunction={BlendFunction.ADD}
            />
            <ChromaticAberration
              offset={[0.0008, 0.0008]}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}

export default memo(HeroOrganism)
