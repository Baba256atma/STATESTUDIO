"use client";

// ## SYCHO_STATIC_GEOMETRY_RULE
// Geometry must be initialized once and never resized.
// Only buffer values may change.
// Prevents WebGL buffer mismatch errors.

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { PsychVisualProps } from "../../lib/visual/psychVisualMapping";
import { useEmotionStore } from "../../engine/useEmotionStore";
import { getEyeMemory } from "../../engine/eyeMemory";
import { getOracleMemoryState } from "../../engine/inspirationEngine";
import { psychLogger } from "../../engine/psychLogger";

type Props = { brightness?: number; activity?: number; selected?: boolean; visual?: PsychVisualProps; onObjectClick?: (id: string) => void };

const DEFAULT_VISUAL: PsychVisualProps = { glow: 0.4, pulse: 0.35, scale: 0, rotation: 0.3, colorShift: 0 };

type FaceState = {
  visibility: number;
  clarity: number;
};

function createShadowFaceMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      time: { value: 0 },
      visibility: { value: 0 },
      clarity: { value: 0 },
      darkness: { value: 0 },
      emotionIntensity: { value: 0 },
      debugReveal: { value: 0 },
      devBoost: { value: process.env.NODE_ENV !== "production" ? 1 : 0 },
    },
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform float visibility;
      uniform float clarity;
      uniform float darkness;
      uniform float emotionIntensity;
      uniform float debugReveal;
      uniform float devBoost;
      varying vec2 vUv;

      float softEllipse(vec2 p, vec2 center, vec2 radius, float softness) {
        vec2 d = (p - center) / radius;
        float dist = dot(d, d);
        return 1.0 - smoothstep(1.0 - softness, 1.0 + softness, dist);
      }

      void main() {
        vec2 uv = vUv;
        vec2 warpedUv = uv;
        warpedUv.x += sin(uv.y * 7.0 + time * 0.28) * 0.008 * (1.0 - clarity);
        warpedUv.y += sin(uv.x * 5.0 - time * 0.22) * 0.006;
        warpedUv.x += sin(time * 0.17) * 0.008;
        warpedUv.y += cos(time * 0.13) * 0.005;
        vec2 p = warpedUv - 0.5;
        float radial = smoothstep(0.66, 0.1, length(vec2(p.x * 0.86, p.y * 0.68)));
        float inverseRim = smoothstep(0.12, 0.72, length(vec2(p.x * 0.9, p.y * 0.7)));
        float face = softEllipse(warpedUv, vec2(0.505, 0.5), vec2(0.39, 0.53), 0.5) * radial;
        float eyeDrift = sin(time * 0.31) * 0.004;
        float leftEye = softEllipse(warpedUv, vec2(0.395 + eyeDrift, 0.586), vec2(0.07, 0.044), 0.48) * 0.42;
        float rightEye = softEllipse(warpedUv, vec2(0.625 - eyeDrift * 0.7, 0.562), vec2(0.066, 0.042), 0.52) * 0.34;
        float brow = softEllipse(warpedUv, vec2(0.515, 0.64), vec2(0.24, 0.048), 0.72) * 0.14;
        float mouth = softEllipse(warpedUv, vec2(0.485, 0.36), vec2(0.13, 0.033), 0.76) * 0.16;
        float coreGlow = softEllipse(warpedUv, vec2(0.49, 0.5), vec2(0.27, 0.36), 0.72);
        float noseShadow = softEllipse(warpedUv, vec2(0.505, 0.49), vec2(0.045, 0.22), 0.68) * 0.24;
        float cheekGlint = softEllipse(warpedUv, vec2(0.64 + sin(time * 0.23) * 0.012, 0.51), vec2(0.035, 0.026), 0.82);
        float eyeGlint = softEllipse(warpedUv, vec2(0.405, 0.59), vec2(0.018, 0.012), 0.9);
        float microHighlight = max(cheekGlint * 0.11, eyeGlint * 0.1);
        float asymmetry = smoothstep(0.25, 0.78, warpedUv.x) * 0.12;
        float topDepth = smoothstep(0.42, 0.86, warpedUv.y) * 0.18;
        float midLift = softEllipse(warpedUv, vec2(0.52, 0.5), vec2(0.28, 0.2), 0.8) * 0.12;
        float bottomFade = smoothstep(0.28, 0.02, warpedUv.y) * 0.22;
        float veil = sin((warpedUv.y + time * 0.035) * 12.0 + sin(warpedUv.x * 9.0)) * 0.035;
        float eyeAnchors = clamp(leftEye + rightEye, 0.0, 0.62);
        float features = clamp(eyeAnchors + brow + mouth + noseShadow + veil * (1.0 - clarity), 0.0, 0.68);
        float innerShadow = (1.0 - inverseRim) * 0.48 + smoothstep(0.12, 0.7, length(vec2(p.x * 1.2, p.y))) * 0.16 + topDepth + bottomFade;
        vec3 shadow = vec3(0.02, 0.018, 0.03);
        vec3 ember = vec3(0.82, 0.48, 0.2);
        vec3 rim = vec3(0.9, 0.56, 0.24);
        vec3 color = mix(shadow, ember, coreGlow * (0.1 + emotionIntensity * 0.32));
        color = mix(color, rim, (inverseRim * 0.24 + asymmetry + microHighlight + midLift) * (0.42 + emotionIntensity * 0.4));
        color = mix(color, vec3(0.0, 0.0, 0.0), clamp(features + innerShadow + darkness * 0.16, 0.0, 0.84));
        color += vec3(1.0, 0.66, 0.3) * microHighlight;
        float reveal = 0.72 + smoothstep(0.16, 0.7, emotionIntensity) * 0.28;
        float phase = 0.36 + smoothstep(0.76, 1.0, sin(time * 0.9) * 0.5 + 0.5) * 0.09;
        float debugMultiplier = mix(1.0, 1.5, max(debugReveal, devBoost));
        float alpha = face * visibility * reveal * phase * debugMultiplier;
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
}

function createProceduralEyeMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    toneMapped: false,
    blending: THREE.NormalBlending,
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uVisibility: { value: 0 },
      uNoiseScale: { value: 6.0 },
      uEyeFocus: { value: 0 },
      uShadowDepth: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uIntensity;
      uniform float uVisibility;
      uniform float uNoiseScale;
      uniform float uEyeFocus;
      uniform float uShadowDepth;
      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      void main() {
        vec2 uv = vUv;
        vec2 drift = vec2(
          sin(uTime * 0.37) * 0.003,
          cos(uTime * 0.29) * 0.003
        );
        vec2 pupilDrift = vec2(
          sin(uTime * 1.13) * 0.004,
          cos(uTime * 0.91) * 0.003
        ) * (0.35 + uEyeFocus * 0.65);
        vec2 p = uv - 0.5 + drift;
        float n = noise((uv + vec2(uTime * 0.018, -uTime * 0.011)) * uNoiseScale);
        p += (n - 0.5) * 0.018 * (0.25 + uIntensity);

        float eyeEllipse = 1.0 - smoothstep(0.78, 1.02, length(vec2(p.x * 1.08, p.y / 0.56)));
        float lidFade = smoothstep(0.5, 0.12, abs(p.y));
        float edgeDissolve = smoothstep(0.92, 0.18, length(vec2(p.x * 0.9, p.y * 1.55)));
        float grain = 0.82 + n * 0.28;
        float mask = eyeEllipse * lidFade * edgeDissolve * grain;

        float radius = length(p - pupilDrift);
        float pupil = 1.0 - smoothstep(0.075 + uEyeFocus * 0.025, 0.14 + uEyeFocus * 0.02, radius);
        float iris = smoothstep(0.32, 0.08, radius) * (1.0 - pupil * 0.55);
        float irisRipple = sin(radius * 42.0 + uTime * 1.1 + n * 3.0) * 0.035;
        float centerGlow = smoothstep(0.28, 0.02, radius) * (0.22 + uIntensity * 0.32);

        vec3 shadow = vec3(0.018, 0.016, 0.013);
        vec3 amber = vec3(0.96, 0.58, 0.18);
        vec3 gold = vec3(1.0, 0.78, 0.34);
        vec3 irisColor = mix(amber, gold, clamp(iris + irisRipple + uIntensity * 0.2, 0.0, 1.0));
        vec3 color = mix(shadow, irisColor, iris * (0.56 + uIntensity * 0.3));
        float memoryShadow = smoothstep(0.58, 0.08, radius) * uShadowDepth;
        color = mix(color, vec3(0.01, 0.009, 0.008), clamp(pupil * 0.95 + memoryShadow * 0.28, 0.0, 1.0));
        color += gold * centerGlow * 0.42;

        float alpha = mask * uVisibility * (0.18 + iris * 0.62 + pupil * (0.2 + uShadowDepth * 0.16));
        alpha *= smoothstep(0.02, 0.18, uVisibility);
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
}

const EgoObject = React.memo(function EgoObject({ brightness = 0.6, activity = 0.12, visual = DEFAULT_VISUAL, onObjectClick }: Props) {
  const ref = useRef<THREE.Mesh | null>(null);
  const glowRef = useRef<THREE.Mesh | null>(null);
  const lensGlowRef = useRef<THREE.Mesh | null>(null);
  const faceRef = useRef<THREE.Mesh | null>(null);
  const proceduralEyeRef = useRef<THREE.Mesh | null>(null);
  const eyeFaceRef = useRef<THREE.Group | null>(null);
  const pupilRef = useRef<THREE.Mesh | null>(null);
  const faceLightRef = useRef<THREE.PointLight | null>(null);
  const ringRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const glowMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const lensGlowMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const eyeFadeMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const irisMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const pupilMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const sharpCoreMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const centerShadowMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const leftEyeGlowMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const rightEyeGlowMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const eyeShadowMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const rightEyeShadowMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const mouthShadowMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const topShadeMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const centerLightMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const eyelidMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const lowerEyelidMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const eyeGlintMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const faceMaterial = useMemo(() => createShadowFaceMaterial(), []);
  const proceduralEyeMaterial = useMemo(() => createProceduralEyeMaterial(), []);
  const smoothVisual = useRef<PsychVisualProps>({ ...DEFAULT_VISUAL });
  const emotion = useEmotionStore();
  const smoothFocusRef = useRef(0.4);
  const smoothIdentityRef = useRef(0);
  const smoothFocusBiasRef = useRef(0);
  const smoothEgoSpeakPulseRef = useRef(0);
  const faceStateRef = useRef<FaceState>({ visibility: 0, clarity: 0 });
  const lastFaceLogAtRef = useRef(0);
  const eyeFaceLoggedRef = useRef(false);
  const faceRecognitionLoggedRef = useRef(false);
  const faceRecognitionWasActiveRef = useRef(false);
  const debugRevealWasActiveRef = useRef(false);
  const facePhaseStartedAtRef = useRef(0);
  const smoothProceduralEyeRef = useRef(0.1);
  const proceduralEyeLoggedRef = useRef(false);
  const eyePulseRef = useRef(0);
  const eyeActiveRef = useRef(false);
  const lastEyeContactTimestampRef = useRef(0);
  const smoothOracleFearRef = useRef(0);
  const smoothOracleExplorationRef = useRef(0);
  const smoothOracleControlRef = useRef(0);
  const smoothOracleFamiliarityRef = useRef(0);
  const lastOracleSyncLogAtRef = useRef(0);

  useFrame(({ camera, clock }, delta) => {
    const t = clock.getElapsedTime();
    const alpha = Math.min(1, delta * 5);
    smoothVisual.current.glow = THREE.MathUtils.lerp(smoothVisual.current.glow, visual.glow, alpha);
    smoothVisual.current.pulse = THREE.MathUtils.lerp(smoothVisual.current.pulse, visual.pulse, alpha);
    smoothVisual.current.scale = THREE.MathUtils.lerp(smoothVisual.current.scale, visual.scale, alpha);
    smoothVisual.current.rotation = THREE.MathUtils.lerp(smoothVisual.current.rotation, visual.rotation, alpha);
    smoothVisual.current.colorShift = THREE.MathUtils.lerp(smoothVisual.current.colorShift, visual.colorShift, alpha);
    const meaning = emotion.current.meaning;
    const personalityFocusTarget = emotion.current.adaptivePersonalityEnabled ? emotion.current.personality.focusBias : 0;
    const personalityFearTarget = emotion.current.adaptivePersonalityEnabled ? emotion.current.personality.fearBias : 0;
    const nowMs = performance.now();
    const debugRevealActive = nowMs < emotion.current.faceRevealUntil;
    const egoSpeakPulseTarget = nowMs < emotion.current.egoSpeakPulseUntil ? 1 : 0;
    const sceneReaction = emotion.current.sceneReaction;
    const sceneReactionActive = !!sceneReaction && nowMs < sceneReaction.pulseUntil;
    const sceneReactionIntensity = sceneReactionActive ? sceneReaction.intensity : 0;
    const sceneEgoBoost = sceneReactionActive && sceneReaction.affectedObjects.includes("ego") ? sceneReactionIntensity : 0;
    const eyeMemory = getEyeMemory();
    const memoryFamiliarity = Math.min(1, eyeMemory.familiarity);
    const memoryShadowDepth = Math.min(1, eyeMemory.shadowDepth);
    const oracleMemory = getOracleMemoryState();
    const oracleFamiliarityTarget = Math.min(1, oracleMemory.familiarityScore);
    const oracleFearTarget = oracleMemory.dominantMood === "fear" ? Math.min(0.15, 0.06 + oracleFamiliarityTarget * 0.06) : 0;
    const oracleExplorationTarget = oracleMemory.dominantMood === "exploration" || oracleMemory.dominantMood === "identity" ? Math.min(0.15, 0.06 + oracleFamiliarityTarget * 0.08) : 0;
    const oracleControlTarget = oracleMemory.dominantMood === "control" ? Math.min(0.15, 0.06 + oracleFamiliarityTarget * 0.06) : 0;
    smoothOracleFearRef.current += (oracleFearTarget - smoothOracleFearRef.current) * 0.02;
    smoothOracleExplorationRef.current += (oracleExplorationTarget - smoothOracleExplorationRef.current) * 0.02;
    smoothOracleControlRef.current += (oracleControlTarget - smoothOracleControlRef.current) * 0.02;
    smoothOracleFamiliarityRef.current += (oracleFamiliarityTarget - smoothOracleFamiliarityRef.current) * 0.02;
    const oracleFear = smoothOracleFearRef.current;
    const oracleExploration = smoothOracleExplorationRef.current;
    const oracleControl = smoothOracleControlRef.current;
    const oracleFamiliarity = smoothOracleFamiliarityRef.current;
    const eyeContactTrigger = emotion.current.eyeContactTrigger;
    if (
      eyeContactTrigger.active &&
      eyeContactTrigger.timestamp !== lastEyeContactTimestampRef.current &&
      Date.now() - eyeContactTrigger.timestamp < 1500
    ) {
      lastEyeContactTimestampRef.current = eyeContactTrigger.timestamp;
      eyeActiveRef.current = true;
      eyePulseRef.current = Math.max(eyePulseRef.current, eyeContactTrigger.intensity);
    }
    if (eyeActiveRef.current) {
      eyePulseRef.current *= Math.pow(0.92, Math.max(1, delta * 60));
      if (eyePulseRef.current < 0.02) {
        eyePulseRef.current = 0;
        eyeActiveRef.current = false;
      }
    }
    const eyeContactPulse = eyePulseRef.current;
    const identityTarget = meaning.type === "identity" ? meaning.weight : 0;
    smoothIdentityRef.current += (identityTarget - smoothIdentityRef.current) * 0.05;
    smoothFocusBiasRef.current += (personalityFocusTarget - smoothFocusBiasRef.current) * 0.03;
    smoothEgoSpeakPulseRef.current += (egoSpeakPulseTarget - smoothEgoSpeakPulseRef.current) * 0.08;
    const blendedFocus = emotion.current.focus * 0.7 + meaning.weight * 0.3;
    smoothFocusRef.current += (blendedFocus - smoothFocusRef.current) * 0.05;

    let targetVisibility = 0.12 + smoothFocusBiasRef.current * 0.16;
    let targetClarity = 0.24 + smoothFocusBiasRef.current * 0.28;
    if (meaning.type === "identity") {
      targetVisibility = 0.72;
      targetClarity = 0.62;
    } else if (meaning.type === "fear") {
      targetVisibility = 0.24;
      targetClarity = 0.12;
    } else if (meaning.type === "control") {
      targetVisibility = 0.48;
      targetClarity = 0.68;
    } else if (meaning.type === "exploration") {
      targetVisibility = 0.3 + Math.sin(t * 1.1) * 0.06;
      targetClarity = 0.32 + Math.sin(t * 0.9) * 0.05;
    }
    if (debugRevealActive) {
      targetVisibility = 0.9;
      targetClarity = 0.68;
    }
    const emotionReveal = Math.max(0.08, Math.min(1, emotion.current.intensity));
    targetVisibility = Math.max(0, Math.min(0.78, targetVisibility * (0.35 + emotionReveal * 0.65) - personalityFearTarget * 0.12));
    targetClarity = Math.max(0, Math.min(0.72, targetClarity - personalityFearTarget * 0.18));
    targetVisibility = Math.max(0, Math.min(0.78, targetVisibility + oracleFamiliarity * 0.02 + oracleExploration * 0.04 - oracleFear * 0.08));
    targetClarity = Math.max(0, Math.min(0.72, targetClarity + oracleFamiliarity * 0.06 - oracleFear * 0.04));
    if (debugRevealActive) {
      targetVisibility = 0.9;
      targetClarity = 0.68;
    }
    const faceRecognitionActive = debugRevealActive || sceneEgoBoost > 0.25 || meaning.type === "identity" || meaning.weight > 0.65 || emotion.current.intensity > 0.4;
    if ((faceRecognitionActive && !faceRecognitionWasActiveRef.current) || (debugRevealActive && !debugRevealWasActiveRef.current)) {
      facePhaseStartedAtRef.current = nowMs;
    }
    faceRecognitionWasActiveRef.current = faceRecognitionActive;
    debugRevealWasActiveRef.current = debugRevealActive;
    const facePhaseElapsed = Math.max(0, nowMs - facePhaseStartedAtRef.current);
    const appearProgress = Math.min(1, facePhaseElapsed / 420);
    const holdActive = debugRevealActive || (facePhaseElapsed >= 420 && facePhaseElapsed <= 2300);
    const fadeProgress = facePhaseElapsed > 2300 ? Math.min(1, (facePhaseElapsed - 2300) / 1800) : 0;
    const phasePeak = !faceRecognitionActive ? 0 : debugRevealActive ? 1 : facePhaseElapsed < 420 ? appearProgress : holdActive ? 1 : Math.max(0.25, 1 - fadeProgress * 0.75);
    const phaseScale = debugRevealActive ? 1.2 : facePhaseElapsed < 420 ? 1 + appearProgress * (0.2 + oracleExploration * 0.08) : holdActive ? 1.1 + oracleExploration * 0.04 : Math.max(1.02, 1.1 - fadeProgress * (0.08 + oracleFear * 0.16));
    const memoryTrace = Math.min(0.18, 0.08 + memoryFamiliarity * 0.1);
    let proceduralTarget = memoryTrace + emotion.current.intensity * 0.04;
    if (meaning.type === "identity") proceduralTarget = 0.58;
    else if (meaning.type === "fear") proceduralTarget = 0.24;
    else if (meaning.type === "exploration") proceduralTarget = 0.28;
    proceduralTarget += oracleExploration * 0.1 + oracleFamiliarity * 0.02 - oracleFear * 0.08;
    if (sceneEgoBoost > 0.25) proceduralTarget = Math.max(proceduralTarget, 0.36 + sceneEgoBoost * 0.18);
    if (eyeContactPulse > 0) proceduralTarget = Math.max(proceduralTarget, 0.24 + eyeContactPulse * 0.5);
    if (debugRevealActive) proceduralTarget = 0.64;
    const proceduralLerp = debugRevealActive || meaning.type === "identity" || eyeContactPulse > 0.02
      ? 0.08 + memoryFamiliarity * 0.025
      : proceduralTarget > smoothProceduralEyeRef.current
        ? 0.04 + memoryFamiliarity * 0.015 + oracleExploration * 0.04
        : 0.026 + memoryFamiliarity * 0.012 + oracleFamiliarity * 0.02 - oracleFear * 0.03;
    smoothProceduralEyeRef.current += (proceduralTarget - smoothProceduralEyeRef.current) * proceduralLerp;
    const faceTransition = 0.05 + oracleFamiliarity * 0.015 - oracleFear * 0.02;
    faceStateRef.current.visibility += (targetVisibility - faceStateRef.current.visibility) * Math.max(0.025, faceTransition);
    faceStateRef.current.clarity += (targetClarity - faceStateRef.current.clarity) * Math.max(0.025, faceTransition);

    if (ref.current) {
      const focusSlowdown = 1 - smoothIdentityRef.current * 0.28;
      const motionStability = 1 - oracleControl * 0.52;
      ref.current.rotation.y = t * (0.1 + smoothVisual.current.rotation * 0.025) * focusSlowdown * motionStability;
      ref.current.rotation.x = Math.sin(t * 0.22) * 0.05 * motionStability;
      const pulseAmplitude = (0.018 + smoothVisual.current.scale * 0.18) * (1 + oracleExploration * 0.28 - oracleControl * 0.32);
      const pulse = 1 + Math.sin(t * (0.75 + smoothVisual.current.pulse * 0.2) * (1 - oracleControl * 0.18)) * pulseAmplitude * (1 + activity);
      ref.current.scale.setScalar((0.56 + smoothVisual.current.scale * 0.45) * pulse * (0.86 + brightness * 0.2) * (1 + smoothFocusRef.current * 0.1 + smoothIdentityRef.current * 0.06 + smoothFocusBiasRef.current * 0.025 + sceneEgoBoost * 0.05));
    }
    if (glowRef.current) glowRef.current.scale.setScalar(0.78 + smoothVisual.current.scale * 0.75 + smoothFocusRef.current * 0.12 + smoothIdentityRef.current * 0.16 + smoothFocusBiasRef.current * 0.08 + oracleExploration * 0.08 + Math.sin(t * 1.1) * 0.018 * (1 - oracleControl * 0.35));
    if (lensGlowRef.current) {
      lensGlowRef.current.scale.setScalar(1.42 + smoothVisual.current.scale * 0.55 + smoothFocusRef.current * 0.14 + Math.sin(t * 0.62) * 0.018);
    }
    if (ringRef.current) ringRef.current.rotation.z = t * (0.05 + smoothVisual.current.rotation * 0.014);
    if (materialRef.current) {
      const emotionEmissive = 0.08 + brightness * 0.12 + smoothVisual.current.glow * 0.14 + smoothIdentityRef.current * 0.16 + smoothFocusBiasRef.current * 0.08 + smoothEgoSpeakPulseRef.current * 0.14 + sceneEgoBoost * 0.12;
      const memoryGlow = Math.max(0.9, Math.min(1.08, 1 + oracleExploration * 0.45 - oracleFear * 0.65));
      materialRef.current.emissiveIntensity = emotionEmissive * memoryGlow;
      materialRef.current.emissive.lerpColors(new THREE.Color("#b99059"), new THREE.Color("#b95b4a"), smoothVisual.current.colorShift * 0.65);
    }
    if (glowMaterialRef.current) {
      const faceGlowReduction = faceStateRef.current.visibility * 0.35;
      const visibleFaceHaloReduction = eyeContactPulse > 0.02 ? 0.24 : smoothProceduralEyeRef.current > 0.24 ? 0.3 : faceRecognitionActive ? 0.4 : 1;
      glowMaterialRef.current.opacity = Math.min(0.22, 0.055 + brightness * 0.022 + smoothVisual.current.glow * 0.026) * (1 - faceGlowReduction) * visibleFaceHaloReduction;
      glowMaterialRef.current.color.lerpColors(new THREE.Color("#b99059"), new THREE.Color("#b95b4a"), smoothVisual.current.colorShift * 0.55);
    }
    if (lensGlowMaterialRef.current) {
      lensGlowMaterialRef.current.opacity = Math.min(0.24, 0.08 + brightness * 0.018 + smoothVisual.current.glow * 0.018 + smoothFocusRef.current * 0.035 + smoothIdentityRef.current * 0.05 + smoothEgoSpeakPulseRef.current * 0.04 + sceneEgoBoost * 0.04 + eyeContactPulse * 0.03 + Math.sin(t * 0.58) * 0.01) * (eyeContactPulse > 0.02 ? 0.24 : smoothProceduralEyeRef.current > 0.24 ? 0.3 : faceRecognitionActive ? 0.4 : 1);
    }
    if (faceRef.current) {
      faceRef.current.lookAt(camera.position);
      const softBlurJitter = (1 - faceStateRef.current.clarity) * 0.01 * (holdActive ? 0.6 : 1);
      faceRef.current.scale.setScalar(1 + Math.sin(t * 0.42) * 0.02 + Math.sin(t * 1.3) * softBlurJitter);
    }
    if (proceduralEyeRef.current) {
      proceduralEyeRef.current.lookAt(camera.position);
      const eyeBreath = 1 + Math.sin(t * 0.42) * 0.02 + eyeContactPulse * 0.08;
      proceduralEyeRef.current.scale.set(eyeBreath, eyeBreath, eyeBreath);
    }
    if (eyeFaceRef.current) {
      eyeFaceRef.current.lookAt(camera.position);
      const eyeBreath = 1 + Math.sin(t * 0.38) * 0.018;
      const recognitionScale = faceRecognitionActive ? phaseScale : 1;
      eyeFaceRef.current.scale.set(eyeBreath * 1.02 * recognitionScale, eyeBreath * (0.94 + emotion.current.calm * 0.035) * recognitionScale, eyeBreath * recognitionScale);
    }
    if (pupilRef.current) {
      pupilRef.current.position.x = Math.sin(t * 0.29) * 0.003 + smoothIdentityRef.current * 0.003;
      pupilRef.current.position.y = Math.cos(t * 0.23) * 0.0025 - personalityFearTarget * 0.003;
    }
    const calmSoftening = emotion.current.calm * 0.08;
    const proceduralSoftening = Math.min(0.55, smoothProceduralEyeRef.current * 0.85);
    const eyeVisibility = debugRevealActive ? 0.3 : faceRecognitionActive ? Math.min(0.4, Math.max(0.22, faceStateRef.current.visibility * 0.25 + 0.22 + smoothIdentityRef.current * 0.06 + phasePeak * 0.05 - personalityFearTarget * 0.04 + oracleFamiliarity * 0.02 - oracleFear * 0.03)) * (1 - proceduralSoftening) : Math.min(0.42, Math.max(0.18, faceStateRef.current.visibility * 0.36 + 0.2 + smoothIdentityRef.current * 0.08 - personalityFearTarget * 0.08 + oracleFamiliarity * 0.02 - oracleFear * 0.03)) * (1 - proceduralSoftening);
    const eyeClarity = debugRevealActive ? 1 : Math.min(1, Math.max(faceRecognitionActive ? 0.5 : 0.2, faceStateRef.current.clarity + smoothIdentityRef.current * 0.22 + phasePeak * 0.2 - personalityFearTarget * 0.12 + oracleFamiliarity * 0.04 - oracleFear * 0.03));
    const shadowStrength = Math.min(1, 0.5 + personalityFearTarget * 0.55 + (meaning.type === "fear" ? meaning.weight * 0.3 : 0));
    if (eyeFadeMaterialRef.current) {
      eyeFadeMaterialRef.current.opacity = debugRevealActive ? 0.34 : eyeVisibility * (faceRecognitionActive ? 0.26 : 0.16 + calmSoftening);
    }
    if (irisMaterialRef.current) {
      irisMaterialRef.current.opacity = debugRevealActive ? 0.65 : eyeVisibility * (0.48 + eyeClarity * 0.16);
      irisMaterialRef.current.color.set(meaning.type === "fear" ? "#b8845a" : emotion.current.calm > 0.58 ? "#93c5fd" : "#ffd27a");
    }
    if (pupilMaterialRef.current) {
      pupilMaterialRef.current.opacity = debugRevealActive ? 0.9 : Math.min(0.82, eyeVisibility * (faceRecognitionActive ? 1.26 + phasePeak * 0.12 : 0.78 + shadowStrength * 0.2));
    }
    if (sharpCoreMaterialRef.current) {
      sharpCoreMaterialRef.current.opacity = debugRevealActive ? 0.96 : Math.min(0.92, eyeVisibility * (faceRecognitionActive ? 1.35 + phasePeak * 0.18 : 0.4));
    }
    if (centerShadowMaterialRef.current) {
      centerShadowMaterialRef.current.opacity = debugRevealActive ? 0.76 : Math.min(0.64, eyeVisibility * (faceRecognitionActive ? 1.02 + phasePeak * 0.12 : 0.45 + shadowStrength * 0.1));
    }
    if (leftEyeGlowMaterialRef.current) {
      leftEyeGlowMaterialRef.current.opacity = faceRecognitionActive ? Math.min(0.2, 0.08 + phasePeak * 0.1) : 0.04;
    }
    if (rightEyeGlowMaterialRef.current) {
      rightEyeGlowMaterialRef.current.opacity = faceRecognitionActive ? Math.min(0.17, 0.07 + phasePeak * 0.08) : 0.035;
    }
    if (eyeShadowMaterialRef.current) {
      eyeShadowMaterialRef.current.opacity = debugRevealActive ? 0.68 : eyeVisibility * (faceRecognitionActive ? 0.82 + phasePeak * 0.18 : 0.34 + shadowStrength * 0.22);
    }
    if (rightEyeShadowMaterialRef.current) {
      rightEyeShadowMaterialRef.current.opacity = debugRevealActive ? 0.6 : eyeVisibility * (faceRecognitionActive ? 0.7 + phasePeak * 0.16 : 0.29 + shadowStrength * 0.18);
    }
    if (mouthShadowMaterialRef.current) {
      mouthShadowMaterialRef.current.opacity = debugRevealActive ? 0.34 : Math.min(0.3, eyeVisibility * (faceRecognitionActive ? 0.42 : 0.18));
    }
    if (topShadeMaterialRef.current) {
      topShadeMaterialRef.current.opacity = faceRecognitionActive ? Math.min(0.26, 0.1 + phasePeak * 0.12 + personalityFearTarget * 0.08) : 0.06;
    }
    if (centerLightMaterialRef.current) {
      centerLightMaterialRef.current.opacity = faceRecognitionActive ? Math.min(0.18, 0.06 + phasePeak * 0.08 + emotion.current.intensity * 0.04) : 0.04;
    }
    if (eyelidMaterialRef.current) {
      eyelidMaterialRef.current.opacity = debugRevealActive ? 0.56 : eyeVisibility * (0.32 + eyeClarity * 0.12);
    }
    if (lowerEyelidMaterialRef.current) {
      lowerEyelidMaterialRef.current.opacity = debugRevealActive ? 0.42 : eyeVisibility * (0.2 + eyeClarity * 0.08 + calmSoftening);
    }
    if (eyeGlintMaterialRef.current) {
      eyeGlintMaterialRef.current.opacity = debugRevealActive ? 0.32 : Math.min(0.22, eyeVisibility * (0.16 + eyeClarity * 0.08));
    }
    faceMaterial.uniforms.time.value = t;
    faceMaterial.uniforms.visibility.value = faceStateRef.current.visibility;
    faceMaterial.uniforms.clarity.value = faceStateRef.current.clarity;
    faceMaterial.uniforms.darkness.value = personalityFearTarget;
    faceMaterial.uniforms.emotionIntensity.value = emotion.current.intensity;
    faceMaterial.uniforms.debugReveal.value = debugRevealActive ? 1 : 0;
    proceduralEyeMaterial.uniforms.uTime.value = t;
    proceduralEyeMaterial.uniforms.uIntensity.value = Math.max(emotion.current.intensity, eyeContactPulse, memoryShadowDepth * 0.45, oracleExploration * 0.7);
    proceduralEyeMaterial.uniforms.uVisibility.value = Math.min(0.72, smoothProceduralEyeRef.current + eyeContactPulse * 0.32 + oracleFamiliarity * 0.02 - oracleFear * 0.02);
    proceduralEyeMaterial.uniforms.uNoiseScale.value = 5.5 + smoothProceduralEyeRef.current * 3.5 + memoryShadowDepth * 1.2;
    proceduralEyeMaterial.uniforms.uEyeFocus.value = Math.max(smoothIdentityRef.current, sceneEgoBoost, eyeContactPulse, debugRevealActive ? 1 : 0);
    proceduralEyeMaterial.uniforms.uShadowDepth.value = memoryShadowDepth;
    if (faceLightRef.current) {
      const lightIntensity = emotion.current.intensity * 0.5 + meaning.weight * 0.5;
      faceLightRef.current.intensity = Math.min(0.9, lightIntensity * (0.28 + faceStateRef.current.visibility * 0.45));
    }
    if (t - lastFaceLogAtRef.current > 2.5) {
      lastFaceLogAtRef.current = t;
      psychLogger.trace("[B12.6.5][FaceState]", {
        visibility: Number(faceStateRef.current.visibility.toFixed(3)),
        clarity: Number(faceStateRef.current.clarity.toFixed(3)),
      });
    }
    if (process.env.NODE_ENV !== "production" && !eyeFaceLoggedRef.current) {
      eyeFaceLoggedRef.current = true;
      console.log("[Sycho][B12.6.10][EgoEyeFaceActive]");
    }
    if (process.env.NODE_ENV !== "production" && faceRecognitionActive && !faceRecognitionLoggedRef.current) {
      faceRecognitionLoggedRef.current = true;
      console.log("[Sycho][B12.6.13][FaceAnchoringFix]");
    }
    if (process.env.NODE_ENV !== "production" && smoothProceduralEyeRef.current > 0.18 && !proceduralEyeLoggedRef.current) {
      proceduralEyeLoggedRef.current = true;
      console.log("[Sycho][B12.6.20][ProceduralEyeActive]");
    }
    if (t - lastOracleSyncLogAtRef.current > 8) {
      lastOracleSyncLogAtRef.current = t;
      psychLogger.trace("[B13.6][EgoMemorySyncApplied]", {
        mood: oracleMemory.dominantMood,
        familiarity: Number(oracleFamiliarity.toFixed(3)),
      });
    }
  });

  return (
    <group data-nx="psych-object-ego" onClick={(event) => { event.stopPropagation(); onObjectClick?.("ego"); }}>
      <mesh ref={glowRef} renderOrder={-1}>
        <sphereGeometry args={[0.82, 30, 15]} />
        <meshBasicMaterial ref={glowMaterialRef} color="#b99059" transparent opacity={0.07 + brightness * 0.025} depthWrite={false} />
      </mesh>
      <mesh ref={lensGlowRef} renderOrder={-2}>
        <sphereGeometry args={[0.98, 28, 14]} />
        <meshBasicMaterial ref={lensGlowMaterialRef} color="#ffd27a" transparent opacity={0.1} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <mesh ref={ref}>
        <sphereGeometry args={[0.98, 28, 16]} />
        <meshStandardMaterial ref={materialRef} color="#343541" emissive="#b99059" emissiveIntensity={0.2 * brightness} roughness={0.24} metalness={0.58} />
      </mesh>
      <mesh ref={faceRef} position={[0, 0, 0.34]} material={faceMaterial} renderOrder={1}>
        <planeGeometry args={[1.2, 1.6]} />
      </mesh>
      <mesh ref={proceduralEyeRef} position={[0, 0, 0.26]} material={proceduralEyeMaterial} renderOrder={2}>
        <planeGeometry args={[1.18, 0.78]} />
      </mesh>
      <group ref={eyeFaceRef} position={[0, 0, 0.5]} renderOrder={2}>
        <mesh scale={[1.18, 0.78, 1]} position={[0.012, 0.015, -0.006]}>
          <circleGeometry args={[0.36, 48]} />
          <meshBasicMaterial ref={eyeFadeMaterialRef} color="#ffd27a" transparent opacity={0.08} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
        <mesh scale={[1.12, 0.56, 1]}>
          <torusGeometry args={[0.24, 0.008, 8, 72]} />
          <meshBasicMaterial ref={irisMaterialRef} color="#ffd27a" transparent opacity={0.2} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
        <mesh ref={pupilRef} position={[0.006, -0.002, 0.006]} scale={[0.95, 1.18, 1]}>
          <circleGeometry args={[0.062, 36]} />
          <meshBasicMaterial ref={pupilMaterialRef} color="#020617" transparent opacity={0.32} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh position={[0.008, -0.002, 0.014]}>
          <circleGeometry args={[0.024, 28]} />
          <meshBasicMaterial ref={sharpCoreMaterialRef} color="#00040b" transparent opacity={0.46} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh position={[0.008, -0.045, 0.008]} scale={[0.72, 1.42, 1]}>
          <circleGeometry args={[0.046, 32]} />
          <meshBasicMaterial ref={centerShadowMaterialRef} color="#020617" transparent opacity={0.28} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh position={[-0.185, 0.056, 0]} scale={[1.7, 1.0, 1]}>
          <circleGeometry args={[0.07, 28]} />
          <meshBasicMaterial ref={leftEyeGlowMaterialRef} color="#fbbf24" transparent opacity={0.06} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
        <mesh position={[0.178, 0.038, 0]} scale={[1.55, 0.92, 1]}>
          <circleGeometry args={[0.064, 28]} />
          <meshBasicMaterial ref={rightEyeGlowMaterialRef} color="#fbbf24" transparent opacity={0.05} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
        <mesh position={[-0.185, 0.056, 0.002]} scale={[1.24, 0.74, 1]} rotation={[0, 0, 0.04]}>
          <circleGeometry args={[0.055, 28]} />
          <meshBasicMaterial ref={eyeShadowMaterialRef} color="#050914" transparent opacity={0.18} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh position={[0.178, 0.038, 0.002]} scale={[1.04, 0.66, 1]} rotation={[0, 0, -0.05]}>
          <circleGeometry args={[0.05, 28]} />
          <meshBasicMaterial ref={rightEyeShadowMaterialRef} color="#050914" transparent opacity={0.16} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh position={[0.016, 0.086, 0.004]} scale={[1.45, 0.35, 1]} rotation={[0, 0, -0.04]}>
          <torusGeometry args={[0.2, 0.006, 8, 64, Math.PI]} />
          <meshBasicMaterial ref={eyelidMaterialRef} color="#c7a06d" transparent opacity={0.14} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
        <mesh position={[-0.018, -0.098, 0.004]} scale={[1.32, 0.28, 1]} rotation={[0, 0, Math.PI + 0.05]}>
          <torusGeometry args={[0.18, 0.005, 8, 56, Math.PI]} />
          <meshBasicMaterial ref={lowerEyelidMaterialRef} color="#c7a06d" transparent opacity={0.1} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
        <mesh position={[0.01, -0.172, 0.008]} scale={[1.55, 0.42, 1]} rotation={[0, 0, -0.03]}>
          <circleGeometry args={[0.048, 28]} />
          <meshBasicMaterial ref={mouthShadowMaterialRef} color="#030712" transparent opacity={0.12} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh position={[0.012, 0.182, 0.006]} scale={[2.3, 0.9, 1]} rotation={[0, 0, -0.02]}>
          <circleGeometry args={[0.1, 36]} />
          <meshBasicMaterial ref={topShadeMaterialRef} color="#020617" transparent opacity={0.08} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh position={[0.005, -0.008, 0.004]} scale={[1.2, 1.7, 1]}>
          <circleGeometry args={[0.09, 36]} />
          <meshBasicMaterial ref={centerLightMaterialRef} color="#f8d58a" transparent opacity={0.05} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
        <mesh position={[-0.035, 0.034, 0.01]} scale={[1.45, 0.9, 1]}>
          <circleGeometry args={[0.018, 20]} />
          <meshBasicMaterial ref={eyeGlintMaterialRef} color="#fde68a" transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
      </group>
      <pointLight ref={faceLightRef} position={[0, 0, 0.18]} color="#ffd27a" intensity={0.12} distance={3} />
      <mesh ref={ringRef} rotation={[Math.PI / 2.15, 0.28, 0.08]}>
        <torusGeometry args={[0.75, 0.012, 8, 96]} />
        <meshBasicMaterial color="#c7a06d" transparent opacity={0.34} depthWrite={false} />
      </mesh>
    </group>
  );
});

export default EgoObject;
