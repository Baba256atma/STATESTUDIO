"use client";

// ## SYCHO_STATIC_GEOMETRY_RULE
// Geometry must be initialized once and never resized.
// Only buffer values may change.
// Prevents WebGL buffer mismatch errors.

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type PsychSparklesProps = {
  intensity: number;
};

type SparkleLayer = {
  geometry: THREE.BufferGeometry;
  maxCount: number;
};

const MAX_SPARKLES = 180;
let sparkleTargetIntensity = 0;

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

function createSparkleGeometry(): SparkleLayer {
  const positions = new Float32Array(MAX_SPARKLES * 3);
  const colors = new Float32Array(MAX_SPARKLES * 3);
  const color = new THREE.Color();
  const random = createSeededRandom(36091);

  for (let i = 0; i < MAX_SPARKLES; i++) {
    const i3 = i * 3;
    positions[i3] = (random() - 0.5) * 8;
    positions[i3 + 1] = (random() - 0.5) * 8;
    positions[i3 + 2] = (random() - 0.5) * 8;

    const warmAccent = random() > 0.92;
    if (warmAccent) {
      color.setHSL(44 / 360, 0.42, 0.62);
    } else {
      color.setHSL((195 + random() * 24) / 360, 0.55, 0.62 + random() * 0.16);
    }
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setDrawRange(0, MAX_SPARKLES);
  return { geometry, maxCount: MAX_SPARKLES };
}

function PsychSparkles({ intensity }: PsychSparklesProps): React.JSX.Element {
  sparkleTargetIntensity = clampIntensity(intensity);
  const groupRef = useRef<THREE.Group | null>(null);
  const materialRef = useRef<THREE.PointsMaterial | null>(null);
  const layerRef = useRef<SparkleLayer | null>(null);
  const currentIntensityRef = useRef(sparkleTargetIntensity);

  if (!layerRef.current) {
    layerRef.current = createSparkleGeometry();
  }

  const layer = layerRef.current;

  useFrame((_, delta) => {
    const safeDelta = Math.min(delta, 0.033);
    currentIntensityRef.current = THREE.MathUtils.lerp(currentIntensityRef.current, sparkleTargetIntensity, safeDelta * 5);

    if (materialRef.current) {
      materialRef.current.opacity = 0.16 + currentIntensityRef.current * 0.38;
      materialRef.current.size = 0.045 + currentIntensityRef.current * 0.035;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += safeDelta * (0.015 + currentIntensityRef.current * 0.025);
      groupRef.current.rotation.z += safeDelta * 0.01;
    }
  });

  // ## SYCHO_SPARKLES_RULE:
  // Sparkles represent emotional energy.
  // Must react to global scene intensity (not single object).
  return (
    <group ref={groupRef}>
      <points geometry={layer.geometry} frustumCulled={false} renderOrder={-1}>
        <pointsMaterial ref={materialRef} size={0.045} vertexColors transparent opacity={0.16} depthWrite={false} sizeAttenuation toneMapped={false} fog={false} />
      </points>
    </group>
  );
}

export default React.memo(PsychSparkles, (_previous, next) => {
  sparkleTargetIntensity = clampIntensity(next.intensity);
  return true;
});
