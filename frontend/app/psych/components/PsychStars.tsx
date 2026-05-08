"use client";

// ## SYCHO_STARS_STATIC_LAYER
// Stars are a static background system.
// They must NEVER re-render or dispose during runtime.
// This prevents WebGL buffer mismatch and ensures stable rendering.

import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEmotionStore } from "../engine/useEmotionStore";
import { mapEmotionToElements } from "../engine/emotionElementMapping";
import { buildAtmosphere, emotionInputFromStore, type AtmosphereState } from "../engine/sceneAtmosphere";
import { getMemoryFamiliarity, getMemoryScores, loadMemory } from "../engine/memoryEngine";

type PsychStarsProps = {
  compact?: boolean;
  energy?: number;
};

type StarLayer = {
  geometry: THREE.BufferGeometry;
  count: number;
};

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function createStarGeometry(count: number, spreadX: number, spreadY: number, zMin: number, zMax: number, colorRange: "far" | "near" | "dust"): StarLayer {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();
  const random = createSeededRandom(colorRange === "far" ? 12031 : colorRange === "near" ? 45061 : 77017);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (random() - 0.5) * spreadX;
    positions[i3 + 1] = (random() - 0.5) * spreadY;
    positions[i3 + 2] = -(zMin + random() * (zMax - zMin));

    if (colorRange === "near") {
      color.setHSL((198 + random() * 24) / 360, 0.2, (62 + random() * 22) / 100);
    } else if (colorRange === "dust") {
      color.setHSL((205 + random() * 24) / 360, 0.34, (34 + random() * 20) / 100);
    } else {
      color.setHSL((210 + random() * 18) / 360, 0.16, (48 + random() * 22) / 100);
    }
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setDrawRange(0, count);
  return { geometry, count };
}

function createGalaxyDustGeometry(count: number): StarLayer {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();
  const random = createSeededRandom(91033);
  const armCount = 4;
  const maxRadius = 13.8;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const coreBias = random();
    const radius = 0.45 + Math.pow(coreBias, 1.72) * maxRadius;
    const normalizedRadius = radius / maxRadius;
    const arm = i % armCount;
    const spin = radius * 0.74;
    const armLooseness = 0.1 + normalizedRadius * 0.72;
    const angle = arm * ((Math.PI * 2) / armCount) + spin + (random() - 0.5) * armLooseness;
    const crossArmDrift = (random() - 0.5) * (0.2 + normalizedRadius * 1.05);
    const edgeFalloff = 1 - normalizedRadius;
    const centerLift = Math.pow(edgeFalloff, 1.8);

    positions[i3] = Math.cos(angle) * radius + Math.cos(angle + Math.PI / 2) * crossArmDrift;
    positions[i3 + 1] = Math.sin(angle) * radius * 0.34 + Math.sin(angle + Math.PI / 2) * crossArmDrift * 0.26 + (random() - 0.5) * (0.55 + normalizedRadius * 1.55);
    positions[i3 + 2] = -(12 + normalizedRadius * 50 + (random() - 0.5) * (4 + normalizedRadius * 10));

    const choice = random();
    if (choice < centerLift * 0.55) {
      color.setHSL((38 + random() * 16) / 360, 0.38, 0.48 + centerLift * 0.18);
    } else if (choice > 0.78) {
      color.setHSL((190 + random() * 22) / 360, 0.42, 0.42 + edgeFalloff * 0.12);
    } else {
      color.setHSL((214 + random() * 20) / 360, 0.3 + normalizedRadius * 0.12, 0.28 + edgeFalloff * 0.18);
    }
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setDrawRange(0, count);
  return { geometry, count };
}

function PsychStars({ compact = false, energy = 50 }: PsychStarsProps): React.JSX.Element {
  const groupRef = useRef<THREE.Group | null>(null);
  const farMaterialRef = useRef<THREE.PointsMaterial | null>(null);
  const nearMaterialRef = useRef<THREE.PointsMaterial | null>(null);
  const dustMaterialRef = useRef<THREE.PointsMaterial | null>(null);
  const farRef = useRef<StarLayer | null>(null);
  const nearRef = useRef<StarLayer | null>(null);
  const dustRef = useRef<StarLayer | null>(null);
  const emotion = useEmotionStore();
  const smoothEmotionIntensityRef = useRef(0.2);
  const smoothMeaningWeightRef = useRef(0.3);
  const smoothPersonalityFocusRef = useRef(0);
  const smoothPersonalityFearRef = useRef(0);
  const smoothPersonalityCuriosityRef = useRef(0);
  const smoothSceneReactionRef = useRef(0);
  const smoothAtmosphereRef = useRef<AtmosphereState>({
    ambientIntensity: 0.34,
    contrast: 1,
    calmFactor: 0,
    tensionFactor: 0,
    warmth: 0,
    brightness: 0.85,
  });
  const baseFarColorRef = useRef(new THREE.Color("#cfe8ff"));
  const baseNearColorRef = useRef(new THREE.Color("#d9f2ff"));
  const baseDustColorRef = useRef(new THREE.Color("#7dd3fc"));
  const atmosphereTintRef = useRef(new THREE.Color("#cfe8ff"));
  const counts = compact
    ? { far: 600, near: 450, dust: 500 }
    : { far: 1000, near: 700, dust: 700 };

  if (!farRef.current) {
    farRef.current = createStarGeometry(counts.far, 44, 25, 24, 90, "far");
  }
  if (!nearRef.current) {
    nearRef.current = createStarGeometry(counts.near, 26, 15, 8, 35, "near");
  }
  if (!dustRef.current) {
    dustRef.current = createGalaxyDustGeometry(counts.dust);
  }

  const far = farRef.current;
  const near = nearRef.current;
  const dust = dustRef.current;
  const energyGlow = 0.9 + Math.min(100, Math.max(0, energy)) / 100 * 0.18;

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Sycho][SYCHO-B12.1-FIX][StarGeometryReady]", {
        farCount: far.count,
        nearCount: near.count,
        galaxyDustCount: dust.count,
        totalCount: far.count + near.count + dust.count,
      });
    }
  }, [far, near, dust]);

  useFrame(() => {
    if (!groupRef.current) return;
    const t = performance.now() * 0.0001;
    const meaning = emotion.current.meaning;
    const atmosphereEmotion = emotionInputFromStore(emotion.current);
    const atmosphereScores = mapEmotionToElements(atmosphereEmotion);
    const targetAtmosphere = buildAtmosphere(atmosphereScores, atmosphereEmotion);
    const memory = loadMemory();
    const memoryScores = getMemoryScores(memory);
    const baselineWarmth = Math.max(-0.12, Math.min(0.12, (memoryScores.fire + memoryScores.sun - memoryScores.water) * 0.12));
    const baselineCalm = Math.max(0, Math.min(0.12, (memoryScores.water + memoryScores.earth) * 0.06));
    targetAtmosphere.warmth = Math.max(-1, Math.min(1, targetAtmosphere.warmth + baselineWarmth));
    targetAtmosphere.calmFactor = Math.max(0, Math.min(1, targetAtmosphere.calmFactor + baselineCalm));
    targetAtmosphere.brightness = Math.max(0.6, Math.min(1.2, targetAtmosphere.brightness + getMemoryFamiliarity(memory) * 0.03));
    const atmosphere = smoothAtmosphereRef.current;
    atmosphere.ambientIntensity += (targetAtmosphere.ambientIntensity - atmosphere.ambientIntensity) * 0.05;
    atmosphere.contrast += (targetAtmosphere.contrast - atmosphere.contrast) * 0.05;
    atmosphere.calmFactor += (targetAtmosphere.calmFactor - atmosphere.calmFactor) * 0.05;
    atmosphere.tensionFactor += (targetAtmosphere.tensionFactor - atmosphere.tensionFactor) * 0.05;
    atmosphere.warmth += (targetAtmosphere.warmth - atmosphere.warmth) * 0.05;
    atmosphere.brightness += (targetAtmosphere.brightness - atmosphere.brightness) * 0.05;
    const sceneReaction = emotion.current.sceneReaction;
    const reactionActive = !!sceneReaction && performance.now() < sceneReaction.pulseUntil;
    const reactionTarget = reactionActive ? sceneReaction.intensity : 0;
    smoothSceneReactionRef.current += (reactionTarget - smoothSceneReactionRef.current) * 0.06;
    const personality = emotion.current.personality;
    const adaptiveEnabled = emotion.current.adaptivePersonalityEnabled;
    const targetFocusBias = adaptiveEnabled ? personality.focusBias : 0;
    const targetFearBias = adaptiveEnabled ? personality.fearBias : 0;
    const targetCuriosityBias = adaptiveEnabled ? personality.curiosityBias : 0;
    smoothPersonalityFocusRef.current += (targetFocusBias - smoothPersonalityFocusRef.current) * 0.03;
    smoothPersonalityFearRef.current += (targetFearBias - smoothPersonalityFearRef.current) * 0.03;
    smoothPersonalityCuriosityRef.current += (targetCuriosityBias - smoothPersonalityCuriosityRef.current) * 0.03;
    const personalityBlend = adaptiveEnabled ? smoothPersonalityFocusRef.current * 0.1 : 0;
    const blendedIntensity = adaptiveEnabled ? emotion.current.intensity * 0.7 + meaning.weight * 0.2 + personalityBlend : emotion.current.intensity * 0.7 + meaning.weight * 0.3;
    smoothEmotionIntensityRef.current += (blendedIntensity - smoothEmotionIntensityRef.current) * 0.05;
    smoothMeaningWeightRef.current += (meaning.weight - smoothMeaningWeightRef.current) * 0.05;
    const fearDim = meaning.type === "fear" ? 1 - smoothMeaningWeightRef.current * 0.18 : 1;
    const explorationBoost = meaning.type === "exploration" ? 1 + smoothMeaningWeightRef.current * 0.22 : 1;
    const dominantModeBoost = adaptiveEnabled && personality.dominantMode === "explorative" ? 1 + smoothPersonalityCuriosityRef.current * 0.05 : 1;
    const dominantModeDim = adaptiveEnabled && personality.dominantMode === "reactive" ? 1 - smoothPersonalityFearRef.current * 0.08 : 1;
    const emotionGlow = (1 + smoothEmotionIntensityRef.current * 0.3) * fearDim * explorationBoost * dominantModeBoost * dominantModeDim;
    const sceneGlow = sceneReaction ? 1 + smoothSceneReactionRef.current * sceneReaction.glow : 1;
    const sceneMotion = sceneReaction ? 1 + smoothSceneReactionRef.current * sceneReaction.motion : 1;
    const explorationScale = meaning.type === "exploration" ? smoothMeaningWeightRef.current * 0.01 : 0;
    const sceneScale = sceneReaction ? smoothSceneReactionRef.current * sceneReaction.orbitScale : 0;
    const controlDamp = meaning.type === "control" ? 1 - smoothMeaningWeightRef.current * 0.35 : 1;
    const personalityMotion = adaptiveEnabled && personality.dominantMode === "explorative" ? 1.05 : adaptiveEnabled && personality.dominantMode === "reactive" ? 0.94 : 1;
    const motionScale = 1 + atmosphere.tensionFactor * 0.2 - atmosphere.calmFactor * 0.2;
    const calmPositionDamp = 1 - atmosphere.calmFactor * 0.1;
    const atmosphereGlow = atmosphere.brightness * atmosphere.contrast * (1 - atmosphere.calmFactor * 0.2 + atmosphere.tensionFactor * 0.2);
    const pulseAmplitude = 0.01 + atmosphere.tensionFactor * 0.01 - atmosphere.calmFactor * 0.005;
    groupRef.current.rotation.z += 0.0003 * controlDamp * personalityMotion * sceneMotion * motionScale;
    groupRef.current.rotation.y += 0.00015 * controlDamp * personalityMotion * sceneMotion * motionScale;
    groupRef.current.position.x = Math.sin(t) * 0.05 * controlDamp * personalityMotion * sceneMotion * calmPositionDamp;
    groupRef.current.position.y = Math.cos(t) * 0.05 * controlDamp * personalityMotion * sceneMotion * calmPositionDamp;
    groupRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * pulseAmplitude + explorationScale + sceneScale);
    const tint = atmosphere.warmth >= 0 ? "#ffd7a3" : "#b9e8ff";
    atmosphereTintRef.current.set(tint);
    if (farMaterialRef.current) {
      farMaterialRef.current.opacity = Math.min(0.9, 0.5 * energyGlow * emotionGlow * sceneGlow * atmosphereGlow);
      farMaterialRef.current.color.copy(baseFarColorRef.current).lerp(atmosphereTintRef.current, Math.min(0.16, Math.abs(atmosphere.warmth) * 0.14));
    }
    if (nearMaterialRef.current) {
      nearMaterialRef.current.opacity = Math.min(0.96, 0.68 * energyGlow * emotionGlow * sceneGlow * atmosphereGlow);
      nearMaterialRef.current.color.copy(baseNearColorRef.current).lerp(atmosphereTintRef.current, Math.min(0.18, Math.abs(atmosphere.warmth) * 0.16));
    }
    if (dustMaterialRef.current) {
      dustMaterialRef.current.opacity = Math.min(0.4, 0.16 * energyGlow * emotionGlow * sceneGlow * atmosphereGlow);
      dustMaterialRef.current.color.copy(baseDustColorRef.current).lerp(atmosphereTintRef.current, Math.min(0.22, Math.abs(atmosphere.warmth) * 0.18));
    }
  });

  // ## SYCHO_STARS_RULE:
  // Stars must be visible, soft, and immersive.
  // No harsh white dots. Slight gray/blue tone preferred.
  return (
    <group ref={groupRef}>
      <points geometry={far.geometry} renderOrder={-5} frustumCulled={false}>
        <pointsMaterial ref={farMaterialRef} size={0.022} vertexColors transparent opacity={0.5 * energyGlow} depthWrite={false} sizeAttenuation toneMapped={false} fog={false} />
      </points>
      <points geometry={near.geometry} renderOrder={-4} frustumCulled={false}>
        <pointsMaterial ref={nearMaterialRef} size={0.03} vertexColors transparent opacity={0.68 * energyGlow} depthWrite={false} sizeAttenuation toneMapped={false} fog={false} />
      </points>
      <points geometry={dust.geometry} position={[0, 0, -3]} renderOrder={-6} frustumCulled={false}>
        <pointsMaterial ref={dustMaterialRef} color="#7dd3fc" size={0.04} vertexColors transparent opacity={Math.min(0.25, 0.16 * energyGlow)} depthWrite={false} sizeAttenuation toneMapped={false} fog={false} />
      </points>
    </group>
  );
}

export default React.memo(PsychStars, () => true);
