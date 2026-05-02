"use client";

// ## SYCHO_STATIC_GEOMETRY_RULE
// Geometry must be initialized once and never resized.
// Only buffer values may change.
// Prevents WebGL buffer mismatch errors.

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { PsychVisualProps } from "../../lib/visual/psychVisualMapping";
import { useEmotionStore } from "../../engine/useEmotionStore";

type Props = { brightness?: number; activity?: number; selected?: boolean; visual?: PsychVisualProps; onObjectClick?: (id: string) => void };

const DEFAULT_VISUAL: PsychVisualProps = { glow: 0.4, pulse: 0.6, scale: 0, rotation: 0.7, colorShift: 0 };

const AirObject = React.memo(function AirObject({ brightness = 0.5, activity = 0.25, visual = DEFAULT_VISUAL, onObjectClick }: Props) {
  const ringARef = useRef<THREE.Mesh | null>(null);
  const ringBRef = useRef<THREE.Mesh | null>(null);
  const haloRef = useRef<THREE.Mesh | null>(null);
  const nodeARef = useRef<THREE.Mesh | null>(null);
  const nodeBRef = useRef<THREE.Mesh | null>(null);
  const nodeCRef = useRef<THREE.Mesh | null>(null);
  const haloMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const ringAMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const smoothVisual = useRef<PsychVisualProps>({ ...DEFAULT_VISUAL });
  const emotion = useEmotionStore();
  const smoothCuriosityRef = useRef(0.3);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const alpha = Math.min(1, delta * 5.5);
    smoothVisual.current.glow = THREE.MathUtils.lerp(smoothVisual.current.glow, visual.glow, alpha);
    smoothVisual.current.pulse = THREE.MathUtils.lerp(smoothVisual.current.pulse, visual.pulse, alpha);
    smoothVisual.current.scale = THREE.MathUtils.lerp(smoothVisual.current.scale, visual.scale, alpha);
    smoothVisual.current.rotation = THREE.MathUtils.lerp(smoothVisual.current.rotation, visual.rotation, alpha);
    smoothCuriosityRef.current += (emotion.current.curiosity - smoothCuriosityRef.current) * 0.05;
    const motion = 0.5 + activity + smoothVisual.current.rotation * 0.45 + smoothCuriosityRef.current * 0.28;
    if (ringARef.current) ringARef.current.rotation.z = t * 0.18 * motion;
    if (ringBRef.current) ringBRef.current.rotation.z = -t * 0.12 * motion;
    if (haloRef.current) haloRef.current.scale.setScalar(1 + smoothVisual.current.scale * 1.3 + Math.sin(t * (0.9 + smoothVisual.current.pulse * 0.25)) * 0.025);
    if (nodeARef.current) nodeARef.current.position.set(Math.sin(t * (0.8 + smoothVisual.current.pulse * 0.25)) * (0.1 + smoothVisual.current.scale), Math.cos(t * 0.6) * 0.06, 0.38);
    if (nodeBRef.current) nodeBRef.current.position.set(Math.cos(t * 0.55) * (-0.42 - smoothVisual.current.scale), Math.sin(t * (0.7 + smoothVisual.current.pulse * 0.18)) * 0.12, -0.08);
    if (nodeCRef.current) nodeCRef.current.position.set(Math.sin(t * 0.7) * (0.34 + smoothVisual.current.scale), Math.cos(t * 0.5) * -0.14, 0.12);
    if (haloMaterialRef.current) haloMaterialRef.current.opacity = Math.min(0.3, 0.06 + brightness * 0.032 + smoothVisual.current.glow * 0.038 + smoothCuriosityRef.current * 0.045);
    if (ringAMaterialRef.current) ringAMaterialRef.current.opacity = Math.min(0.64, 0.26 + brightness * 0.052 + smoothVisual.current.glow * 0.066 + smoothCuriosityRef.current * 0.06);
  });

  return (
    <group data-nx="psych-object-air" onClick={(event) => { event.stopPropagation(); onObjectClick?.("air"); }}>
      <mesh ref={haloRef} renderOrder={-1}>
        <sphereGeometry args={[0.95, 24, 12]} />
        <meshBasicMaterial ref={haloMaterialRef} color="#9bd9e6" transparent opacity={0.08 + brightness * 0.04} depthWrite={false} />
      </mesh>
      <mesh ref={ringARef} rotation={[Math.PI / 2.15, 0.18, 0]}>
        <torusGeometry args={[0.74, 0.011, 8, 96]} />
        <meshBasicMaterial ref={ringAMaterialRef} color="#d9fbff" transparent opacity={0.34 + brightness * 0.08} depthWrite={false} />
      </mesh>
      <mesh ref={ringBRef} rotation={[Math.PI / 2.85, -0.42, 0.35]}>
        <torusGeometry args={[0.55, 0.009, 8, 88]} />
        <meshBasicMaterial color="#8fd4e4" transparent opacity={0.28 + brightness * 0.06} depthWrite={false} />
      </mesh>
      <mesh ref={nodeARef} position={[0, 0, 0.38]}>
        <sphereGeometry args={[0.09, 12, 8]} />
        <meshStandardMaterial color="#d7fbff" emissive="#d7fbff" emissiveIntensity={0.38 * brightness} roughness={0.5} metalness={0.0} transparent opacity={0.82} />
      </mesh>
      <mesh ref={nodeBRef} position={[-0.42, 0, -0.08]}>
        <sphereGeometry args={[0.055, 10, 6]} />
        <meshBasicMaterial color="#b9edf5" transparent opacity={0.58} depthWrite={false} />
      </mesh>
      <mesh ref={nodeCRef} position={[0.34, -0.1, 0.12]}>
        <sphereGeometry args={[0.045, 10, 6]} />
        <meshBasicMaterial color="#e8ffff" transparent opacity={0.52} depthWrite={false} />
      </mesh>
    </group>
  );
});

export default AirObject;
