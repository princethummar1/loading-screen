import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

/**
 * Creates a rounded rectangle shape for extrusion
 */
function createRoundedRect(x, y, w, h, r) {
  const shape = new THREE.Shape()
  shape.moveTo(x + r, y)
  shape.lineTo(x + w - r, y)
  shape.quadraticCurveTo(x + w, y, x + w, y + r)
  shape.lineTo(x + w, y + h - r)
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  shape.lineTo(x + r, y + h)
  shape.quadraticCurveTo(x, y + h, x, y + h - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)
  return shape
}

/**
 * Photorealistic chrome material for the K
 */
function useChromeMaterial() {
  return useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#1a0a2e'),
      metalness: 1.0,
      roughness: 0.05,
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity: 2.5,
      iridescence: 0.8,
      iridescenceIOR: 1.8,
      sheen: 1.0,
      sheenColor: new THREE.Color('#9333ea'),
      sheenRoughness: 0.1,
    })
  }, [])
}

/**
 * Extrude settings for the pill-shaped K
 */
const extrudeSettings = {
  depth: 0.5,
  bevelEnabled: true,
  bevelThickness: 0.12,
  bevelSize: 0.12,
  bevelSegments: 12,
  curveSegments: 24,
}

/**
 * The 3D Letter K mesh with all pieces
 */
export default function LetterKMesh({ mousePos }) {
  const groupRef = useRef()
  const purpleLightRef = useRef()
  const pinkLightRef = useRef()

  // Create geometries for each piece of the K
  const geometries = useMemo(() => {
    // Vertical bar (left stem) - tall pill shape
    const verticalShape = createRoundedRect(0, 0, 0.55, 2.4, 0.27)
    const verticalGeom = new THREE.ExtrudeGeometry(verticalShape, extrudeSettings)
    verticalGeom.center()

    // Upper diagonal arm - rotated pill
    const upperShape = createRoundedRect(0, 0, 0.5, 1.3, 0.25)
    const upperGeom = new THREE.ExtrudeGeometry(upperShape, extrudeSettings)
    upperGeom.center()

    // Lower diagonal arm - rotated pill
    const lowerShape = createRoundedRect(0, 0, 0.5, 1.3, 0.25)
    const lowerGeom = new THREE.ExtrudeGeometry(lowerShape, extrudeSettings)
    lowerGeom.center()

    return { verticalGeom, upperGeom, lowerGeom }
  }, [])

  const chromeMaterial = useChromeMaterial()

  // Entrance animation on mount
  useEffect(() => {
    if (groupRef.current) {
      // Start hidden and rotated
      groupRef.current.scale.set(0, 0, 0)
      groupRef.current.rotation.y = Math.PI * 1.5

      // Animate in
      gsap.to(groupRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.4,
        ease: 'elastic.out(1, 0.5)',
        delay: 0.3,
      })
      gsap.to(groupRef.current.rotation, {
        y: 0,
        duration: 1.6,
        ease: 'power4.out',
        delay: 0.2,
      })
    }
  }, [])

  // Animation loop
  useFrame((state) => {
    if (!groupRef.current) return

    const t = state.clock.elapsedTime

    // Float animation (always running)
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.08
    groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.015

    // Mouse parallax rotation (lerp toward mouse position)
    const targetRotY = mousePos.x * 0.3
    const targetRotX = -mousePos.y * 0.15
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.05
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05

    // Pulsing light intensity
    if (purpleLightRef.current) {
      purpleLightRef.current.intensity = 8 + Math.sin(t * 1.2) * 2
    }
    if (pinkLightRef.current) {
      pinkLightRef.current.intensity = 8 + Math.sin(t * 0.9 + 1) * 2
    }
  })

  return (
    <>
      {/* Lighting Setup */}
      {/* Ambient - very subtle */}
      <ambientLight intensity={0.15} color="#1a0a2e" />

      {/* Left rim light - purple/blue */}
      <pointLight
        ref={purpleLightRef}
        position={[-4, 2, 2]}
        intensity={8}
        color="#7c3aed"
        distance={10}
      />

      {/* Right rim light - hot pink/magenta */}
      <pointLight
        ref={pinkLightRef}
        position={[4, -1, 2]}
        intensity={8}
        color="#ec4899"
        distance={10}
      />

      {/* Top fill - blue */}
      <pointLight position={[0, 5, 3]} intensity={4} color="#3b82f6" distance={12} />

      {/* Back light - creates glow behind */}
      <pointLight position={[0, 0, -3]} intensity={3} color="#9333ea" />

      {/* Spot for specular highlights */}
      <spotLight
        position={[-2, 3, 4]}
        intensity={15}
        angle={0.4}
        penumbra={0.8}
        color="#ffffff"
      />

      {/* The K Letter Group */}
      <group ref={groupRef}>
        {/* Vertical bar (left stem) */}
        <mesh geometry={geometries.verticalGeom} material={chromeMaterial} position={[-0.8, 0, 0]} />

        {/* Upper diagonal arm */}
        <mesh
          geometry={geometries.upperGeom}
          material={chromeMaterial}
          position={[0.15, 0.45, 0]}
          rotation={[0, 0, -Math.PI * 0.32]}
        />

        {/* Lower diagonal arm */}
        <mesh
          geometry={geometries.lowerGeom}
          material={chromeMaterial}
          position={[0.15, -0.45, 0]}
          rotation={[0, 0, Math.PI * 0.32]}
        />
      </group>
    </>
  )
}
