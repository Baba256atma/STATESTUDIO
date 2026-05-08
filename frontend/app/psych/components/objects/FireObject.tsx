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
import { getElementVisualScore, logVisualIntensity, mapScoreToVisual } from "../../engine/elementVisualIntensity";
import { createFireMaterial } from "../shaders/FireMaterial";

type Props = { brightness?: number; activity?: number; selected?: boolean; visual?: PsychVisualProps; onObjectClick?: (id: string) => void };

const DEFAULT_VISUAL: PsychVisualProps = { glow: 0.6, pulse: 0.8, scale: 0, rotation: 0.5, colorShift: 0 };

const FireObject = React.memo(function FireObject({ brightness = 0.75, activity = 0.6, visual = DEFAULT_VISUAL, onObjectClick }: Props) {
  const core = useRef<THREE.Mesh | null>(null);
  const halo = useRef<THREE.Mesh | null>(null);
  const ring = useRef<THREE.Mesh | null>(null);
  const fireMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const haloMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const smoothVisual = useRef<PsychVisualProps>({ ...DEFAULT_VISUAL });
  const emotion = useEmotionStore();
  const smoothTensionRef = useRef(0.2);
  const smoothFearRef = useRef(0);
  const smoothFearBiasRef = useRef(0);
  const smoothElementScoreRef = useRef(0);
  const lastIntensityLogAtRef = useRef(0);

  if (!fireMaterialRef.current) {
    fireMaterialRef.current = createFireMaterial();
  }

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const alpha = Math.min(1, delta * 5.5);
    smoothVisual.current.glow = THREE.MathUtils.lerp(smoothVisual.current.glow, visual.glow, alpha);
    smoothVisual.current.pulse = THREE.MathUtils.lerp(smoothVisual.current.pulse, visual.pulse, alpha);
    smoothVisual.current.scale = THREE.MathUtils.lerp(smoothVisual.current.scale, visual.scale, alpha);
    smoothVisual.current.rotation = THREE.MathUtils.lerp(smoothVisual.current.rotation, visual.rotation, alpha);
    smoothVisual.current.colorShift = THREE.MathUtils.lerp(smoothVisual.current.colorShift, visual.colorShift, alpha);
    const meaning = emotion.current.meaning;
    const sceneReaction = emotion.current.sceneReaction;
    const sceneBoost = sceneReaction && performance.now() < sceneReaction.pulseUntil && sceneReaction.affectedObjects.includes("fire") ? sceneReaction.intensity : 0;
    const elementScore = getElementVisualScore("fire", emotion.current);
    smoothElementScoreRef.current += (elementScore - smoothElementScoreRef.current) * 0.05;
    const elementVisual = mapScoreToVisual(smoothElementScoreRef.current);
    const dominantPulse = smoothElementScoreRef.current > 0.6 ? 1 + Math.sin(t * 2.6) * 0.025 : 1;
    logVisualIntensity("fire", smoothElementScoreRef.current, lastIntensityLogAtRef);
    const fearTarget = meaning.type === "fear" ? meaning.weight : 0;
    const personalityFearTarget = emotion.current.adaptivePersonalityEnabled ? emotion.current.personality.fearBias : 0;
    smoothFearRef.current += (fearTarget - smoothFearRef.current) * 0.05;
    smoothFearBiasRef.current += (personalityFearTarget - smoothFearBiasRef.current) * 0.03;
    const blendedTension = emotion.current.tension * 0.7 + meaning.weight * 0.3;
    smoothTensionRef.current += (blendedTension - smoothTensionRef.current) * 0.05;
    if (core.current) {
      const emotionalTension = smoothTensionRef.current;
      const flicker = 1 + Math.sin(t * (8 + smoothVisual.current.pulse * 3.1 + emotionalTension * 2 + smoothFearRef.current * 2.4 + smoothFearBiasRef.current * 0.7 + sceneBoost * 1.4) + activity * 8) * (0.04 + smoothVisual.current.scale * 0.45 + emotionalTension * 0.025 + smoothFearRef.current * 0.035 + smoothFearBiasRef.current * 0.012 + sceneBoost * 0.018) * (0.4 + activity) + Math.sin(t * 17) * 0.018;
      const shake = Math.max(0, activity - 0.58) * 0.035 + emotionalTension * 0.012 + smoothFearRef.current * 0.016 + smoothFearBiasRef.current * 0.004;
      core.current.scale.set((0.5 + smoothVisual.current.scale) * flicker * elementVisual.scale * dominantPulse, (0.58 + smoothVisual.current.scale * 1.1) * flicker * elementVisual.scale * dominantPulse, (0.5 + smoothVisual.current.scale) * flicker * elementVisual.scale * dominantPulse);
      core.current.position.set(Math.sin(t * 31) * shake, Math.cos(t * 27) * shake * 0.65 + Math.sin(t * 1.4) * elementVisual.motion, 0);
      core.current.rotation.y = Math.sin(t * 0.6) * 0.1 * activity + t * smoothVisual.current.rotation * 0.025 + elementVisual.motion * 0.5;
    }
    if (halo.current) halo.current.scale.setScalar((1.02 + smoothVisual.current.scale * 1.8 + Math.sin(t * 8) * 0.028 * activity) * (1 + smoothElementScoreRef.current * 0.08));
    if (ring.current) ring.current.rotation.z = t * (0.18 + smoothVisual.current.rotation * 0.06);
    if (fireMaterialRef.current) {
      fireMaterialRef.current.uniforms.time.value = t;
      fireMaterialRef.current.uniforms.intensity.value = Math.min(1.18, 0.28 + brightness * 0.38 + activity * 0.2 + smoothVisual.current.glow * 0.26 + smoothTensionRef.current * 0.32 + smoothFearRef.current * 0.22 + smoothFearBiasRef.current * 0.08 + sceneBoost * 0.18 + elementVisual.glow * 0.18);
      fireMaterialRef.current.uniforms.opacity.value = Math.min(0.98, (0.58 + elementVisual.opacity * 0.24) + brightness * 0.12 + smoothVisual.current.glow * 0.08 + smoothTensionRef.current * 0.06 + smoothFearRef.current * 0.05);
    }
    if (haloMaterialRef.current) haloMaterialRef.current.opacity = Math.min(0.62, 0.06 + elementVisual.opacity * 0.12 + brightness * 0.03 + smoothVisual.current.glow * 0.06 + smoothTensionRef.current * 0.08 + smoothFearRef.current * 0.06 + sceneBoost * 0.08);
  });

  return (
    <group data-nx="psych-object-fire" onClick={(event) => { event.stopPropagation(); onObjectClick?.("fire"); }}>
      <mesh ref={halo} renderOrder={-1}>
        <sphereGeometry args={[0.98, 28, 14]} />
        <meshBasicMaterial ref={haloMaterialRef} color="#e85a24" transparent opacity={0.14 + brightness * 0.04} depthWrite={false} />
      </mesh>
      <mesh ref={core} material={fireMaterialRef.current}>
        <sphereGeometry args={[1, 28, 14]} />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2.35, -0.16, 0.36]}>
        <torusGeometry args={[0.72, 0.014, 8, 88]} />
        <meshBasicMaterial color="#ff9d4d" transparent opacity={0.38} depthWrite={false} />
      </mesh>
    </group>
  );
});

export default FireObject;
