'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ─────── Scene objects ───────
function FireObject({ active, step, onClickBase }: { active: boolean; step: number; onClickBase: (correct: boolean) => void }) {
  const flameRef = useRef<THREE.Mesh>(null);
  const [intensity, setIntensity] = useState(1);

  useEffect(() => {
    if (step >= 4) setIntensity(Math.max(0, 1 - (step - 3) * 0.4));
  }, [step]);

  useFrame((state) => {
    if (!flameRef.current || intensity <= 0) return;
    const t = state.clock.getElapsedTime();
    flameRef.current.scale.y = (0.8 + Math.sin(t * 4) * 0.2) * intensity;
    flameRef.current.scale.x = (0.9 + Math.sin(t * 3.5 + 1) * 0.1) * intensity;
    const mat = flameRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = (2 + Math.sin(t * 6) * 0.5) * intensity;
    mat.opacity = intensity;
  });

  const handleFlameClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    // Clicking the flame top is wrong (should click base)
    onClickBase(false);
  };

  const handleBaseClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClickBase(true);
  };

  if (intensity <= 0) return null;

  return (
    <group position={[-1.5, 0, 0]}>
      {/* Base glow ring (target for step 3) */}
      {step === 2 && (
        <mesh position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]} onClick={handleBaseClick}>
          <ringGeometry args={[0.3, 0.5, 32]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={2} transparent opacity={0.6} />
        </mesh>
      )}
      {/* Fuel barrel */}
      <mesh position={[0, -0.3, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.4, 16]} />
        <meshStandardMaterial color="#374151" roughness={0.8} metalness={0.3} />
      </mesh>
      {/* Fire flame */}
      <mesh
        ref={flameRef}
        position={[0, 0.1, 0]}
        castShadow
        onClick={handleFlameClick}
      >
        <coneGeometry args={[0.3, 0.9, 10]} />
        <meshStandardMaterial
          color="#f97316" emissive="#ef4444" emissiveIntensity={2}
          transparent opacity={intensity} roughness={0.1}
        />
      </mesh>
      {/* Inner flame */}
      <mesh position={[0, 0.05, 0]} scale={[0.6, 0.7, 0.6]}>
        <coneGeometry args={[0.3, 0.9, 10]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={3} transparent opacity={0.8 * intensity} roughness={0.1} />
      </mesh>
      {/* Light from fire */}
      <pointLight position={[0, 0.5, 0]} intensity={3 * intensity} color="#f97316" distance={5} />
    </group>
  );
}

function ExtinguisherObject({ step, onClickExtinguisher, onClickPin, onClickHandle }: {
  step: number;
  onClickExtinguisher: () => void;
  onClickPin: () => void;
  onClickHandle: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const [grabbed, setGrabbed] = useState(false);

  useEffect(() => {
    if (step >= 1) setGrabbed(true);
  }, [step]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    if (!grabbed) {
      ref.current.rotation.y = Math.sin(t * 0.8) * 0.3;
    } else {
      // Move towards center when grabbed
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, step >= 2 ? -0.5 : 1.2, 0.05);
    }
  });

  const bodyColor = step >= 1 ? '#dc2626' : '#ef4444';
  const isHighlighted = step === 0;

  return (
    <group ref={ref} position={[1.2, -0.3, 0]}>
      {/* Highlight ring */}
      {isHighlighted && (
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.5, 32]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} transparent opacity={0.5} />
        </mesh>
      )}

      {/* Extinguisher body — clickable on step 0 */}
      <mesh
        position={[0, 0.5, 0]}
        castShadow
        onClick={(e) => { e.stopPropagation(); if (step === 0) onClickExtinguisher(); }}
        onPointerOver={() => { if (step === 0) document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <cylinderGeometry args={[0.18, 0.18, 1, 16]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.25} metalness={0.5}
          emissive={isHighlighted ? '#3b82f6' : '#000000'}
          emissiveIntensity={isHighlighted ? 0.3 : 0}
        />
      </mesh>

      {/* Top cap */}
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.25} metalness={0.5} />
      </mesh>

      {/* Safety pin — clickable on step 1 */}
      {step <= 1 && (
        <mesh
          position={[0.2, 1.0, 0]}
          onClick={(e) => { e.stopPropagation(); if (step === 1) onClickPin(); }}
          onPointerOver={() => { if (step === 1) document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
          <cylinderGeometry args={[0.04, 0.04, 0.3, 8]} />
          <meshStandardMaterial
            color={step === 1 ? '#fbbf24' : '#94a3b8'}
            emissive={step === 1 ? '#fbbf24' : '#000000'}
            emissiveIntensity={step === 1 ? 1.5 : 0}
            metalness={0.8}
          />
        </mesh>
      )}

      {/* Handle — clickable on step 3 */}
      <mesh
        position={[0, 1.15, 0]}
        rotation={[0, 0, Math.PI / 4]}
        onClick={(e) => { e.stopPropagation(); if (step === 3) onClickHandle(); }}
        onPointerOver={() => { if (step === 3) document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
        <meshStandardMaterial
          color={step === 3 ? '#22d3ee' : '#1e293b'}
          emissive={step === 3 ? '#22d3ee' : '#000000'}
          emissiveIntensity={step === 3 ? 1 : 0}
          metalness={0.7}
        />
      </mesh>

      {/* Hose */}
      <mesh position={[0.15, 0.6, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.035, 0.035, 0.4, 8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Spray effect when step >= 4
function SprayEffect({ active, step, onSweepComplete }: { active: boolean; step: number; onSweepComplete: () => void }) {
  const [sweepX, setSweepX] = useState(-1.8);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (step !== 4 || completed) return;
    const interval = setInterval(() => {
      setSweepX(prev => {
        if (prev >= -1.0) {
          clearInterval(interval);
          setCompleted(true);
          onSweepComplete();
          return -1.0;
        }
        return prev + 0.04;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [step, completed, onSweepComplete]);

  if (!active || step < 3) return null;

  return (
    <group position={[sweepX, -0.2, 0.2]}>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.4, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#e2e8f0" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Floor() {
  return (
    <>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#111827" roughness={0.95} />
      </mesh>
      <gridHelper args={[14, 14, '#1e2d4a', '#0f1629']} position={[0, -0.495, 0]} />
    </>
  );
}

function Wall() {
  return (
    <mesh receiveShadow position={[0, 2, -3]}>
      <boxGeometry args={[12, 6, 0.2]} />
      <meshStandardMaterial color="#0f172a" roughness={0.95} />
    </mesh>
  );
}

function Crate({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[0.55, 0.55, 0.55]} />
      <meshStandardMaterial color="#7c5f3a" roughness={0.9} />
    </mesh>
  );
}

// ─────── Main 3D scene ───────
interface FireSim3DProps {
  currentStep: number;
  onAction: (action: string, correct: boolean) => void;
}

export default function FireSim3D({ currentStep, onAction }: FireSim3DProps) {
  const [spraying, setSpraying] = useState(false);

  const handleExtinguisherClick = () => {
    if (currentStep === 0) onAction('click_extinguisher', true);
  };
  const handlePinClick = () => {
    if (currentStep === 1) onAction('click_pin', true);
  };
  const handleFireBase = (correct: boolean) => {
    if (currentStep === 2) onAction('click_fire_base', correct);
  };
  const handleHandle = () => {
    if (currentStep === 3) { setSpraying(true); onAction('click_handle', true); }
  };
  const handleSweepComplete = useCallback(() => {
    if (currentStep === 4) onAction('sweep', true);
  }, [currentStep, onAction]);

  // Sweep — auto-trigger on step 4 after 2.5s
  useEffect(() => {
    if (currentStep === 4) {
      const timer = setTimeout(() => handleSweepComplete(), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, handleSweepComplete]);

  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 55 }} shadows>
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      <pointLight position={[0, 4, 2]} intensity={0.8} color="#1e40af" distance={10} />

      <Wall />
      <Floor />

      <Crate position={[-3, -0.22, -1]} />
      <Crate position={[-3, 0.35, -1]} />
      <Crate position={[2.5, -0.22, -1.5]} />

      <FireObject active={true} step={currentStep} onClickBase={handleFireBase} />
      <ExtinguisherObject
        step={currentStep}
        onClickExtinguisher={handleExtinguisherClick}
        onClickPin={handlePinClick}
        onClickHandle={handleHandle}
      />
      <SprayEffect active={spraying} step={currentStep} onSweepComplete={handleSweepComplete} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={Math.PI / 5}
      />
      <fog attach="fog" args={['#0a0e1a', 8, 18]} />
    </Canvas>
  );
}
