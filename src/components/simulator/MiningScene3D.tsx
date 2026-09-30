'use client';
import { useRef } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { HazardDef } from '@/app/simulator/mining-hazards/page';

function HazardObject({ hazard, identified, wrongClicked, onHazardClick }: {
  hazard: HazardDef;
  identified: boolean;
  wrongClicked: boolean;
  onHazardClick: (h: HazardDef) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    if (!identified && hazard.isHazard) {
      ref.current.rotation.y = t * 0.5;
    }
    if (identified) {
      ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, 1.15, 0.05));
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!identified && !wrongClicked) onHazardClick(hazard);
  };

  const color = identified ? '#10b981' : wrongClicked ? '#ef4444' : hazard.color;
  const emissive = identified ? '#10b981' : wrongClicked ? '#ef4444' : hazard.isHazard ? hazard.color : '#000000';

  return (
    <group position={hazard.position}>
      {/* Main body */}
      <mesh
        ref={ref}
        castShadow
        onClick={handleClick}
        onPointerOver={() => { if (!identified) document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        {hazard.isHazard ? (
          hazard.id === 'falling_rock' ? <dodecahedronGeometry args={[0.5, 0]} /> :
          hazard.id === 'missing_ppe' ? <capsuleGeometry args={[0.25, 0.5, 8, 16]} /> :
          hazard.id === 'electrical_hazard' ? <boxGeometry args={[0.2, 0.8, 0.2]} /> :
          hazard.id === 'blocked_exit' ? <boxGeometry args={[1.2, 0.6, 0.3]} /> :
          <torusGeometry args={[0.3, 0.12, 8, 20]} />
        ) : (
          hazard.id === 'safe_equipment' ? <boxGeometry args={[0.5, 0.8, 0.3]} /> :
          <boxGeometry args={[0.15, 0.8, 0.15]} />
        )}
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={identified ? 1 : wrongClicked ? 0.8 : hazard.isHazard ? 0.3 : 0.1}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* Floating indicator above */}
      {!identified && !wrongClicked && (
        <mesh position={[0, 1.2, 0]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={hazard.isHazard ? '#f97316' : '#3b82f6'}
            emissive={hazard.isHazard ? '#f97316' : '#3b82f6'}
            emissiveIntensity={2}
            transparent opacity={0.7}
          />
        </mesh>
      )}

      {/* Check mark when found */}
      {identified && (
        <mesh position={[0, 1.3, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}

function MiningEnvironment() {
  return (
    <group>
      {/* Mine floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#1c1208" roughness={1} />
      </mesh>

      {/* Tunnel walls */}
      <mesh position={[0, 1.5, -3.5]} receiveShadow>
        <boxGeometry args={[14, 5, 0.3]} />
        <meshStandardMaterial color="#2d1a0a" roughness={1} />
      </mesh>
      <mesh position={[-5, 1.5, 0]} receiveShadow>
        <boxGeometry args={[0.3, 5, 14]} />
        <meshStandardMaterial color="#261508" roughness={1} />
      </mesh>
      <mesh position={[5, 1.5, 0]} receiveShadow>
        <boxGeometry args={[0.3, 5, 14]} />
        <meshStandardMaterial color="#261508" roughness={1} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 3.5, 0]} receiveShadow>
        <boxGeometry args={[14, 0.3, 14]} />
        <meshStandardMaterial color="#1c1208" roughness={1} />
      </mesh>

      {/* Support beams */}
      {[-2, 0, 2].map(x => (
        <group key={x} position={[x, 1.5, -1]}>
          <mesh>
            <boxGeometry args={[0.15, 3, 0.15]} />
            <meshStandardMaterial color="#5c3a1e" roughness={0.9} />
          </mesh>
          <mesh position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.15, 2.5, 0.15]} />
            <meshStandardMaterial color="#5c3a1e" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Rocks on floor */}
      {[[-3.5, -0.3, 0.5], [3.2, -0.3, 0.8], [1, -0.35, -2.5], [-1.5, -0.32, 2]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <dodecahedronGeometry args={[0.25, 0]} />
          <meshStandardMaterial color="#4a3728" roughness={1} />
        </mesh>
      ))}

      {/* Mine cart */}
      <group position={[0, -0.1, 0.5]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.4, 0.5]} />
          <meshStandardMaterial color="#374151" roughness={0.6} metalness={0.4} />
        </mesh>
      </group>

      {/* Tunnel lights */}
      <pointLight position={[0, 2.5, 0]} intensity={2} color="#fef3c7" distance={10} />
      <pointLight position={[-3, 2.5, -2]} intensity={1.5} color="#fde68a" distance={8} />
      <pointLight position={[3, 2.5, -2]} intensity={1.5} color="#fde68a" distance={8} />

      {/* Grid */}
      <gridHelper args={[14, 20, '#2d1a0a', '#1c1208']} position={[0, -0.49, 0]} />
    </group>
  );
}

interface MiningScene3DProps {
  hazards: HazardDef[];
  identified: Set<string>;
  wrongClicks: Set<string>;
  onHazardClick: (h: HazardDef) => void;
}

export default function MiningScene3D({ hazards, identified, wrongClicks, onHazardClick }: MiningScene3DProps) {
  return (
    <Canvas camera={{ position: [0, 3, 6], fov: 60 }} shadows>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} castShadow />

      <MiningEnvironment />

      {hazards.map(h => (
        <HazardObject
          key={h.id}
          hazard={h}
          identified={identified.has(h.id)}
          wrongClicked={wrongClicks.has(h.id)}
          onHazardClick={onHazardClick}
        />
      ))}

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={Math.PI / 6}
        maxDistance={10}
        minDistance={3}
      />
      <fog attach="fog" args={['#0a0502', 8, 16]} />
    </Canvas>
  );
}
