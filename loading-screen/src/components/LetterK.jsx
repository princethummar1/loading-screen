import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshStandardMaterial } from 'three'
import './LetterK.css'

// Individual segment of the K letter
function KSegment({ position, rotation, args, mousePos, depthOffset = 0 }) {
  const meshRef = useRef()
  const targetRotation = useRef({ x: 0, y: 0 })

  useFrame(() => {
    if (meshRef.current) {
      // Calculate target rotation based on mouse position
      targetRotation.current.x = mousePos.y * 0.15 + depthOffset * 0.02
      targetRotation.current.y = mousePos.x * 0.15 + depthOffset * 0.02

      // Lerp to smooth rotation
      meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.08
      meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.08
    }
  })

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <boxGeometry args={args} />
      <meshStandardMaterial 
        color="#7c3aed" 
        roughness={0.2} 
        metalness={0.6}
      />
    </mesh>
  )
}

// The deconstructed K letter made of segments
function DeconstructedK({ mousePos }) {
  const groupRef = useRef()

  return (
    <group ref={groupRef}>
      {/* Vertical bar (left side of K) */}
      <KSegment 
        position={[-1.2, 0, 0]} 
        rotation={[0, 0, 0]}
        args={[0.5, 3.5, 0.5]} 
        mousePos={mousePos}
        depthOffset={0}
      />
      
      {/* Upper diagonal arm */}
      <KSegment 
        position={[0.3, 0.9, 0.1]} 
        rotation={[0, 0, -0.7]}
        args={[0.5, 2, 0.5]} 
        mousePos={mousePos}
        depthOffset={1}
      />
      
      {/* Lower diagonal arm */}
      <KSegment 
        position={[0.3, -0.9, 0.2]} 
        rotation={[0, 0, 0.7]}
        args={[0.5, 2, 0.5]} 
        mousePos={mousePos}
        depthOffset={2}
      />
      
      {/* Center connection piece */}
      <KSegment 
        position={[-0.5, 0, 0.15]} 
        rotation={[0, 0, 0]}
        args={[0.6, 0.5, 0.5]} 
        mousePos={mousePos}
        depthOffset={1.5}
      />
    </group>
  )
}

function Scene({ mousePos }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[0, -5, 3]} intensity={0.3} color="#6d28d9" />
      <DeconstructedK mousePos={mousePos} />
    </>
  )
}

function LetterK() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize mouse position to -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      setMousePos({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="letter-k-container">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <Scene mousePos={mousePos} />
      </Canvas>
    </div>
  )
}

export default LetterK
