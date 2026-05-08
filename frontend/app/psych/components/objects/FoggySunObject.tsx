"use client";

// ## SYCHO_STATIC_GEOMETRY_RULE
// Geometry must be initialized once and never resized.
// Only buffer values may change.
// Prevents WebGL buffer mismatch errors.

import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { PsychVisualProps } from "../../lib/visual/psychVisualMapping";
import { useEmotionStore } from "../../engine/useEmotionStore";
import { getElementVisualScore, logVisualIntensity, mapScoreToVisual } from "../../engine/elementVisualIntensity";

type Props = { brightness?: number; activity?: number; selected?: boolean; visual?: PsychVisualProps; onObjectClick?: (id: string) => void };

const DEFAULT_VISUAL: PsychVisualProps = { glow: 0.7, pulse: 0.7, scale: 0, rotation: 0.2, colorShift: 0 };

const FoggySunObject = React.memo(function FoggySunObject({ brightness = 0.9, activity = 0.2, visual = DEFAULT_VISUAL, onObjectClick }: Props) {
  const coreRef = useRef<THREE.Mesh | null>(null);
  const haloRef = useRef<THREE.Mesh | null>(null);
  const innerRingRef = useRef<THREE.Mesh | null>(null);
  const coreMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const haloMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const smoothVisual = useRef<PsychVisualProps>({ ...DEFAULT_VISUAL });
  const emotion = useEmotionStore();
  const smoothElementScoreRef = useRef(0);
  const lastIntensityLogAtRef = useRef(0);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const alpha = Math.min(1, delta * 5.5);
    smoothVisual.current.glow = THREE.MathUtils.lerp(smoothVisual.current.glow, visual.glow, alpha);
    smoothVisual.current.pulse = THREE.MathUtils.lerp(smoothVisual.current.pulse, visual.pulse, alpha);
    smoothVisual.current.scale = THREE.MathUtils.lerp(smoothVisual.current.scale, visual.scale, alpha);
    smoothVisual.current.rotation = THREE.MathUtils.lerp(smoothVisual.current.rotation, visual.rotation, alpha);
    const elementScore = getElementVisualScore("sun", emotion.current);
    smoothElementScoreRef.current += (elementScore - smoothElementScoreRef.current) * 0.05;
    const elementVisual = mapScoreToVisual(smoothElementScoreRef.current);
    const dominantPulse = smoothElementScoreRef.current > 0.6 ? 1 + Math.sin(t * 1.15) * 0.02 : 1;
    logVisualIntensity("sun", smoothElementScoreRef.current, lastIntensityLogAtRef);
    const pulse = 1 + Math.sin(t * (0.8 + smoothVisual.current.pulse * 0.25)) * (0.055 + smoothVisual.current.scale * 0.35) * (0.5 + activity);
    if (coreRef.current) {
      coreRef.current.scale.setScalar((0.52 + smoothVisual.current.scale) * pulse * (0.82 + brightness * 0.32) * elementVisual.scale * dominantPulse);
      coreRef.current.position.y = Math.sin(t * 0.7) * elementVisual.motion;
      coreRef.current.rotation.y = t * (0.08 + smoothVisual.current.rotation * 0.035 + elementVisual.motion);
    }
    if (haloRef.current) haloRef.current.scale.setScalar((1.16 + smoothVisual.current.scale * 1.4) * pulse * (0.86 + brightness * 0.3) * (1 + smoothElementScoreRef.current * 0.08));
    if (innerRingRef.current) innerRingRef.current.rotation.z = t * (0.04 + smoothVisual.current.rotation * 0.02);
    if (coreMaterialRef.current) coreMaterialRef.current.emissiveIntensity = Math.min(1.22, 0.14 + elementVisual.glow * 0.22 + 0.42 * brightness + smoothVisual.current.glow * 0.18);
    if (haloMaterialRef.current) haloMaterialRef.current.opacity = Math.min(0.44, 0.04 + elementVisual.opacity * 0.1 + 0.1 * brightness + smoothVisual.current.glow * 0.052);
  });

  return (
    <group data-nx="psych-object-sun" onClick={(event) => { event.stopPropagation(); onObjectClick?.("sun"); }}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 36, 18]} />
        <meshStandardMaterial ref={coreMaterialRef} color="#d99d3f" emissive="#f0a33b" emissiveIntensity={0.72 * brightness} roughness={0.34} metalness={0.02} />
      </mesh>
      <mesh ref={haloRef} renderOrder={-1}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshBasicMaterial ref={haloMaterialRef} color="#f0a33b" transparent opacity={0.18 * brightness} depthWrite={false} />
      </mesh>
      <mesh ref={innerRingRef} rotation={[Math.PI / 2.6, 0.1, 0.2]} renderOrder={-1}>
        <torusGeometry args={[0.74, 0.014, 8, 96]} />
        <meshBasicMaterial color="#ffd48a" transparent opacity={0.42} depthWrite={false} />
      </mesh>
    </group>
  );
});

export default FoggySunObject;
