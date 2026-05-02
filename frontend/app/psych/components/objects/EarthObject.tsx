"use client";

// ## SYCHO_STATIC_GEOMETRY_RULE
// Geometry must be initialized once and never resized.
// Only buffer values may change.
// Prevents WebGL buffer mismatch errors.

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { PsychVisualProps } from "../../lib/visual/psychVisualMapping";

type Props = { brightness?: number; activity?: number; selected?: boolean; visual?: PsychVisualProps; onObjectClick?: (id: string) => void };

const DEFAULT_VISUAL: PsychVisualProps = { glow: 0.3, pulse: 0.35, scale: 0, rotation: 0.25, colorShift: 0 };

const EarthObject = React.memo(function EarthObject({ brightness = 0.45, activity = 0.12, visual = DEFAULT_VISUAL, onObjectClick }: Props) {
  const ref = useRef<THREE.Mesh | null>(null);
  const haloRef = useRef<THREE.Mesh | null>(null);
  const ringRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const haloMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const smoothVisual = useRef<PsychVisualProps>({ ...DEFAULT_VISUAL });

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const alpha = Math.min(1, delta * 4.5);
    smoothVisual.current.glow = THREE.MathUtils.lerp(smoothVisual.current.glow, visual.glow, alpha);
    smoothVisual.current.pulse = THREE.MathUtils.lerp(smoothVisual.current.pulse, visual.pulse, alpha);
    smoothVisual.current.scale = THREE.MathUtils.lerp(smoothVisual.current.scale, visual.scale, alpha);
    smoothVisual.current.rotation = THREE.MathUtils.lerp(smoothVisual.current.rotation, visual.rotation, alpha);
    if (ref.current) {
      const breath = 1 + Math.sin(t * (0.45 + smoothVisual.current.pulse * 0.12)) * smoothVisual.current.scale * 0.24;
      ref.current.scale.setScalar(breath);
      ref.current.rotation.y = t * (0.1 + smoothVisual.current.rotation * 0.03);
      ref.current.rotation.x = Math.sin(t * 0.05) * 0.02;
    }
    if (haloRef.current) haloRef.current.scale.setScalar(1 + smoothVisual.current.scale + Math.sin(t * 0.7) * 0.015 * (1 + activity));
    if (ringRef.current) ringRef.current.rotation.z = t * (0.035 + smoothVisual.current.rotation * 0.012);
    if (materialRef.current) materialRef.current.emissiveIntensity = 0.04 + brightness * 0.08 + smoothVisual.current.glow * 0.08;
    if (haloMaterialRef.current) haloMaterialRef.current.opacity = Math.min(0.28, 0.1 + brightness * 0.035 + smoothVisual.current.glow * 0.035);
  });

  return (
    <group data-nx="psych-object-earth" onClick={(event) => { event.stopPropagation(); onObjectClick?.("earth"); }}>
      <mesh ref={haloRef} renderOrder={-1}>
        <sphereGeometry args={[0.92, 26, 13]} />
        <meshBasicMaterial ref={haloMaterialRef} color="#5f9a61" transparent opacity={0.12 + brightness * 0.04} depthWrite={false} />
      </mesh>
      <mesh ref={ref}>
        <sphereGeometry args={[0.54, 30, 15]} />
        <meshStandardMaterial ref={materialRef} color="#35533a" emissive="#5f8a52" emissiveIntensity={0.12 * brightness} roughness={0.78} metalness={0.04} />
      </mesh>
      <mesh rotation={[0.5, 0.2, -0.35]} position={[0.08, 0.02, 0.46]}>
        <sphereGeometry args={[0.13, 10, 6]} />
        <meshStandardMaterial color="#61764b" roughness={0.9} metalness={0} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2.45, 0.12, -0.22]}>
        <torusGeometry args={[0.7, 0.012, 8, 88]} />
        <meshBasicMaterial color="#76aa70" transparent opacity={0.28} depthWrite={false} />
      </mesh>
    </group>
  );
});

export default EarthObject;
