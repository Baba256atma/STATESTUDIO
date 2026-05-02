"use client";

// ## SYCHO_CINEMATIC_LAYER
// These effects are visual-only layers.
// Must NOT affect scene logic or geometry buffers.
// GPU-safe and non-reactive to avoid WebGL errors.

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function NebulaField(): React.JSX.Element {
  const ref = useRef<THREE.Mesh | null>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += Math.min(delta, 0.033) * 0.01;
    ref.current.rotation.x += Math.min(delta, 0.033) * 0.002;
  });

  return (
    <mesh ref={ref} position={[0, 0, -30]} renderOrder={-10}>
      <sphereGeometry args={[60, 32, 32]} />
      <meshBasicMaterial color="#1e3a8a" transparent opacity={0.15} side={THREE.BackSide} depthWrite={false} fog={false} />
    </mesh>
  );
}

export default React.memo(NebulaField, () => true);
