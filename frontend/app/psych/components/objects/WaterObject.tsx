"use client";

// ## SYCHO_STATIC_GEOMETRY_RULE
// Geometry must be initialized once and never resized.
// Only buffer values may change.
// Prevents WebGL buffer mismatch errors.

import React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";
import type { PsychVisualProps } from "../../lib/visual/psychVisualMapping";
import { useEmotionStore } from "../../engine/useEmotionStore";
import { getElementVisualScore, logVisualIntensity, mapScoreToVisual } from "../../engine/elementVisualIntensity";

type Props = { brightness?: number; activity?: number; selected?: boolean; visual?: PsychVisualProps; onObjectClick?: (id: string) => void };

const DEFAULT_VISUAL: PsychVisualProps = { glow: 0.4, pulse: 0.4, scale: 0, rotation: 0.2, colorShift: 0 };

const WaterObject = React.memo(function WaterObject({ brightness = 0.6, activity = 0.3, visual = DEFAULT_VISUAL, onObjectClick }: Props) {
  const ref = useRef<THREE.Mesh | null>(null);
  const haloRef = useRef<THREE.Mesh | null>(null);
  const ringRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const haloMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const smoothVisual = useRef<PsychVisualProps>({ ...DEFAULT_VISUAL });
  const emotion = useEmotionStore();
  const smoothCalmRef = useRef(0.3);
  const smoothElementScoreRef = useRef(0);
  const lastIntensityLogAtRef = useRef(0);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const alpha = Math.min(1, delta * 5);
    smoothVisual.current.glow = THREE.MathUtils.lerp(smoothVisual.current.glow, visual.glow, alpha);
    smoothVisual.current.pulse = THREE.MathUtils.lerp(smoothVisual.current.pulse, visual.pulse, alpha);
    smoothVisual.current.scale = THREE.MathUtils.lerp(smoothVisual.current.scale, visual.scale, alpha);
    smoothVisual.current.rotation = THREE.MathUtils.lerp(smoothVisual.current.rotation, visual.rotation, alpha);
    const sceneReaction = emotion.current.sceneReaction;
    const sceneBoost = sceneReaction && performance.now() < sceneReaction.pulseUntil && sceneReaction.affectedObjects.includes("water") ? sceneReaction.intensity : 0;
    const elementScore = getElementVisualScore("water", emotion.current);
    smoothElementScoreRef.current += (elementScore - smoothElementScoreRef.current) * 0.05;
    const elementVisual = mapScoreToVisual(smoothElementScoreRef.current);
    const dominantPulse = smoothElementScoreRef.current > 0.6 ? 1 + Math.sin(t * 1.2) * 0.018 : 1;
    logVisualIntensity("water", smoothElementScoreRef.current, lastIntensityLogAtRef);
    smoothCalmRef.current += (emotion.current.calm - smoothCalmRef.current) * 0.05;
    if (ref.current) {
      const calmFlow = smoothCalmRef.current;
      const wave = 1 + Math.sin(t * (0.72 + smoothVisual.current.pulse * 0.35)) * (0.028 + smoothVisual.current.scale * 0.24 + calmFlow * 0.018) * (0.4 + activity);
      ref.current.scale.set((0.54 + smoothVisual.current.scale + calmFlow * 0.035 + sceneBoost * 0.025) * wave * (0.82 + brightness * 0.28) * elementVisual.scale * dominantPulse, (0.48 + smoothVisual.current.scale * 0.55 + calmFlow * 0.02 + sceneBoost * 0.012) * (1 + Math.cos(t * 0.8) * 0.024) * elementVisual.scale, (0.54 + smoothVisual.current.scale + calmFlow * 0.035 + sceneBoost * 0.025) * wave * elementVisual.scale * dominantPulse);
      ref.current.position.y = Math.sin(t * 0.9) * elementVisual.motion;
      ref.current.rotation.y = t * (0.08 + smoothVisual.current.rotation * 0.05 + elementVisual.motion) * (0.3 + activity);
    }
    if (haloRef.current) haloRef.current.scale.setScalar((1.0 + smoothVisual.current.scale * 1.4 + smoothCalmRef.current * 0.12 + Math.sin(t * 0.8) * 0.024) * (1 + smoothElementScoreRef.current * 0.06));
    if (ringRef.current) ringRef.current.rotation.z = t * (0.06 + smoothVisual.current.rotation * 0.045);
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.06 + elementVisual.glow * 0.16 + brightness * 0.12 + smoothVisual.current.glow * 0.16 + smoothCalmRef.current * 0.16 + sceneBoost * 0.12;
      materialRef.current.opacity = Math.min(0.86, 0.34 + elementVisual.opacity * 0.34 + brightness * 0.12 + smoothCalmRef.current * 0.08);
    }
    if (haloMaterialRef.current) haloMaterialRef.current.opacity = Math.min(0.48, 0.06 + elementVisual.opacity * 0.1 + brightness * 0.035 + smoothVisual.current.glow * 0.055 + smoothCalmRef.current * 0.06 + sceneBoost * 0.06);
  });

  return (
    <group data-nx="psych-object-liquid" onClick={(event) => { event.stopPropagation(); onObjectClick?.("liquid"); }}>
      <mesh ref={haloRef} renderOrder={-1}>
        <sphereGeometry args={[0.96, 28, 14]} />
        <meshBasicMaterial ref={haloMaterialRef} color="#2ea7c8" transparent opacity={0.13 + brightness * 0.04} depthWrite={false} />
      </mesh>
      <mesh ref={ref}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial ref={materialRef} color="#1f7898" emissive="#2ea7c8" emissiveIntensity={0.2 * brightness} transparent opacity={0.56 + brightness * 0.12} roughness={0.18} metalness={0.03} envMapIntensity={0.2} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2.7, 0.18, -0.32]}>
        <torusGeometry args={[0.72, 0.013, 8, 88]} />
        <meshBasicMaterial color="#65cce1" transparent opacity={0.34} depthWrite={false} />
      </mesh>
    </group>
  );
});

export default WaterObject;
