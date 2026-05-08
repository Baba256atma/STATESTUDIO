"use client";

// ## SYCHO_CINEMATIC_LAYER
// These effects are visual-only layers.
// Must NOT affect scene logic or geometry buffers.
// GPU-safe and non-reactive to avoid WebGL errors.

// ## SYCHO_STATIC_GEOMETRY_RULE
// Geometry must be initialized once and never resized.
// Only buffer values may change.
// Prevents WebGL buffer mismatch errors.

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEmotionStore } from "../../engine/useEmotionStore";

type EmotionSparklesProps = {
  intensity?: number;
};

type SparkleLayer = {
  geometry: THREE.BufferGeometry;
  maxCount: number;
};

const MAX_EMOTION_SPARKLES = 120;
let emotionSparkleTarget = 0.5;

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function clampIntensity(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function createEmotionSparkleGeometry(): SparkleLayer {
  const positions = new Float32Array(MAX_EMOTION_SPARKLES * 3);
  const colors = new Float32Array(MAX_EMOTION_SPARKLES * 3);
  const color = new THREE.Color();
  const random = createSeededRandom(58013);

  for (let i = 0; i < MAX_EMOTION_SPARKLES; i++) {
    const i3 = i * 3;
    positions[i3] = (random() - 0.5) * 20;
    positions[i3 + 1] = (random() - 0.5) * 10;
    positions[i3 + 2] = (random() - 0.5) * 20 - 7;

    const warm = random() > 0.9;
    if (warm) {
      color.setHSL(42 / 360, 0.36, 0.58);
    } else {
      color.setHSL((194 + random() * 24) / 360, 0.52, 0.62 + random() * 0.16);
    }
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setDrawRange(0, MAX_EMOTION_SPARKLES);
  return { geometry, maxCount: MAX_EMOTION_SPARKLES };
}

function EmotionSparkles({ intensity = 0.5 }: EmotionSparklesProps): React.JSX.Element {
  emotionSparkleTarget = clampIntensity(intensity);
  const groupRef = useRef<THREE.Group | null>(null);
  const materialRef = useRef<THREE.PointsMaterial | null>(null);
  const layerRef = useRef<SparkleLayer | null>(null);
  const currentIntensityRef = useRef(emotionSparkleTarget);
  const sceneReactionRef = useRef(0);
  const emotion = useEmotionStore();

  if (!layerRef.current) {
    layerRef.current = createEmotionSparkleGeometry();
  }

  const layer = layerRef.current;

  useFrame((_, delta) => {
    const safeDelta = Math.min(delta, 0.033);
    const sceneReaction = emotion.current.sceneReaction;
    const reactionTarget = sceneReaction && performance.now() < sceneReaction.pulseUntil ? sceneReaction.intensity : 0;
    sceneReactionRef.current = THREE.MathUtils.lerp(sceneReactionRef.current, reactionTarget, safeDelta * 3.8);
    const particleBoost = sceneReaction ? sceneReaction.particles * sceneReactionRef.current : 0;
    currentIntensityRef.current = THREE.MathUtils.lerp(currentIntensityRef.current, emotionSparkleTarget, safeDelta * 4);

    if (materialRef.current) {
      materialRef.current.opacity = Math.max(0.08, 0.22 + currentIntensityRef.current * 0.24 + particleBoost * 0.18);
      materialRef.current.size = 0.075 + currentIntensityRef.current * 0.04 + Math.max(0, particleBoost) * 0.018;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += safeDelta * (0.018 + currentIntensityRef.current * 0.035 + particleBoost * 0.03);
      groupRef.current.rotation.z += safeDelta * 0.006;
    }
  });

  return (
    <group ref={groupRef}>
      <points geometry={layer.geometry} frustumCulled={false} renderOrder={-2}>
        <pointsMaterial ref={materialRef} size={0.09} vertexColors transparent opacity={0.34} depthWrite={false} sizeAttenuation toneMapped={false} fog={false} />
      </points>
    </group>
  );
}

export default React.memo(EmotionSparkles, (_previous, next) => {
  emotionSparkleTarget = clampIntensity(next.intensity ?? 0.5);
  return true;
});
