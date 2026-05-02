"use client";

// ## SYCHO_STATIC_GEOMETRY_RULE
// Geometry must be initialized once and never resized.
// Only buffer values may change.
// Prevents WebGL buffer mismatch errors.

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type PsychFoggySunProps = {
  intensity: number;
};

export default function PsychFoggySun({ intensity }: PsychFoggySunProps): React.JSX.Element {
  const ref = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const safeIntensity = Math.max(0, Math.min(1, intensity));

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.scale.setScalar(1 + safeIntensity * 0.52 + Math.sin(t * 0.72) * (0.035 + safeIntensity * 0.035));
      ref.current.rotation.y += Math.min(delta, 0.033) * 0.12;
    }
    if (materialRef.current) {
      const glow = 1.2 + Math.sin(t * 1.5) * 0.2 + safeIntensity * 1.65;
      materialRef.current.emissiveIntensity = glow;
      materialRef.current.opacity = 0.22 + safeIntensity * 0.18;
    }
  });

  // ## SYCHO_EGO_RULE:
  // FoggySun = Ego center.
  // Must always exist.
  // Must pulse slowly (not aggressively).
  return (
    <mesh ref={ref} position={[0, 0, -0.04]} renderOrder={-1}>
      <sphereGeometry args={[0.9, 32, 32]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#facc15"
        emissive="#f59e0b"
        emissiveIntensity={1.35 + safeIntensity * 2.35}
        roughness={0.3}
        transparent
        opacity={0.22 + safeIntensity * 0.18}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
