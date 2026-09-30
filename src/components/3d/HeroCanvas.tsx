'use client';
import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

// Animated fire mesh
function FireCore({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hue] = useState(() => Math.random() * 0.05);
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.scale.y = 1 + Math.sin(t * 3 + hue * 100) * 0.15;
    meshRef.current.position.y = position[1] + Math.sin(t * 2) * 0.05;
    meshRef.current.rotation.y = t * 0.5;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 1.5 + Math.sin(t * 4) * 0.5;
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <coneGeometry args={[0.3, 0.8, 8]} />
      <meshStandardMaterial
        color="#f97316"
        emissive="#f97316"
        emissiveIntensity={2}
        roughness={0.2}
      />
    </mesh>
  );
}

// Extinguisher model
function Extinguisher({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3;
  });
  return (
    <group ref={ref} position={position}>
      {/* Body */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1, 16]} />
        <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Top */}
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Handle */}
      <mesh position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Hose */}
      <mesh position={[0.15, 0.6, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      {/* Label */}
      <mesh position={[0, 0.5, 0.21]}>
        <planeGeometry args={[0.3, 0.6]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Floor grid
function Floor() {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0f1629" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Grid lines */}
      <gridHelper args={[20, 20, '#1e2d4a', '#141c2e']} position={[0, -0.49, 0]} />
    </group>
  );
}

// Floating particles
function Particles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => new Float32Array(100 * 3).map(() => (Math.random() - 0.5) * 10), []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#3b82f6" transparent opacity={0.6} />
    </points>
  );
}

// Mining drill prop
function Drill({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.children[0].rotation.z = state.clock.getElapsedTime() * 5;
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <cylinderGeometry args={[0.08, 0.02, 0.8, 12]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.45, 0]}>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  );
}

export default function HeroCanvas() {
  return (
    <div style={{ width: '100%', height: '100%', borderRadius: 20, overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [3, 3, 5], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow color="#e2e8f0" />
        <pointLight position={[-1, 2, 0]} intensity={3} color="#f97316" distance={5} />
        <pointLight position={[1, 1, 2]} intensity={1} color="#3b82f6" distance={8} />

        <Particles />
        <Floor />

        {/* Fires */}
        <FireCore position={[-1, 0, 0]} />
        <FireCore position={[-0.7, -0.2, 0.3]} />
        <FireCore position={[-1.3, -0.2, -0.2]} />

        {/* Extinguisher */}
        <Extinguisher position={[1.2, -0.5, 0]} />

        {/* Drill */}
        <Drill position={[0, 1.5, -1]} />

        {/* Crates */}
        <mesh position={[-2, -0.2, -1]} castShadow>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color="#7c5f3a" roughness={0.9} />
        </mesh>
        <mesh position={[-2, 0.4, -1]} castShadow>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color="#7c5f3a" roughness={0.9} />
        </mesh>

        {/* Hazard sign */}
        <mesh position={[2, 0.5, -1.5]} castShadow>
          <boxGeometry args={[0.05, 0.8, 0.8]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.6} />
        </mesh>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 4}
        />
        <fog attach="fog" args={['#0a0e1a', 8, 20]} />
      </Canvas>
    </div>
  );
}
