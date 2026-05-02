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
      debugReveal: { value: 0 },
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
      uniform float debugReveal;
      varying vec2 vUv;

      float softEllipse(vec2 p, vec2 center, vec2 radius, float softness) {
        vec2 d = (p - center) / radius;
        float dist = dot(d, d);
        return 1.0 - smoothstep(1.0 - softness, 1.0 + softness, dist);
      }

      void main() {
        vec2 uv = vUv;
        vec2 p = uv - 0.5;
        float face = softEllipse(uv, vec2(0.5, 0.5), vec2(0.34, 0.48), 0.42);
        float leftEye = softEllipse(uv, vec2(0.39, 0.58), vec2(0.055, 0.034), 0.5);
        float rightEye = softEllipse(uv, vec2(0.61, 0.58), vec2(0.055, 0.034), 0.5);
        float brow = softEllipse(uv, vec2(0.5, 0.64), vec2(0.24, 0.035), 0.8) * 0.28;
        float mouth = softEllipse(uv, vec2(0.5, 0.36), vec2(0.13, 0.026), 0.7) * 0.38;
        float coreGlow = softEllipse(uv, vec2(0.5, 0.5), vec2(0.22, 0.32), 0.7);
        float veil = sin((uv.y + time * 0.05) * 18.0) * 0.04 * (1.0 - clarity);
        float features = clamp(leftEye + rightEye + brow + mouth + veil, 0.0, 1.0);
        vec3 shadow = vec3(0.02, 0.018, 0.03);
        vec3 ember = vec3(1.0, 0.63, 0.28);
        vec3 color = mix(shadow, ember, coreGlow * (0.25 + clarity * 0.45));
        color = mix(color, vec3(0.0, 0.0, 0.0), features * (0.5 + darkness * 0.3));
        float alpha = face * visibility * mix(0.18 + clarity * 0.58, 0.45, debugReveal);
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
  const faceLightRef = useRef<THREE.PointLight | null>(null);
  const ringRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const glowMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const lensGlowMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const faceMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const smoothVisual = useRef<PsychVisualProps>({ ...DEFAULT_VISUAL });
  const emotion = useEmotionStore();
  const smoothFocusRef = useRef(0.4);
  const smoothIdentityRef = useRef(0);
  const smoothFocusBiasRef = useRef(0);
  const faceStateRef = useRef<FaceState>({ visibility: 0, clarity: 0 });
  const lastFaceLogAtRef = useRef(0);

  if (!faceMaterialRef.current) {
    faceMaterialRef.current = createShadowFaceMaterial();
  }

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
    const debugRevealActive = performance.now() < emotion.current.faceRevealUntil;
    const identityTarget = meaning.type === "identity" ? meaning.weight : 0;
    smoothIdentityRef.current += (identityTarget - smoothIdentityRef.current) * 0.05;
    smoothFocusBiasRef.current += (personalityFocusTarget - smoothFocusBiasRef.current) * 0.03;
    const blendedFocus = emotion.current.focus * 0.7 + meaning.weight * 0.3;
    smoothFocusRef.current += (blendedFocus - smoothFocusRef.current) * 0.05;

    let targetVisibility = 0.12 + smoothFocusBiasRef.current * 0.16;
    let targetClarity = 0.24 + smoothFocusBiasRef.current * 0.28;
    if (meaning.type === "identity") {
      targetVisibility = 0.8;
      targetClarity = 0.86;
    } else if (meaning.type === "fear") {
      targetVisibility = 0.3;
      targetClarity = 0.18;
    } else if (meaning.type === "control") {
      targetVisibility = 0.58;
      targetClarity = 0.9;
    } else if (meaning.type === "exploration") {
      targetVisibility = 0.38 + Math.sin(t * 2.1) * 0.1;
      targetClarity = 0.48 + Math.sin(t * 1.4) * 0.08;
    }
    if (debugRevealActive) {
      targetVisibility = 1;
      targetClarity = 1;
    }
    targetVisibility = Math.max(0, Math.min(0.82, targetVisibility - personalityFearTarget * 0.12));
    targetClarity = Math.max(0, Math.min(1, targetClarity - personalityFearTarget * 0.18));
    if (debugRevealActive) {
      targetVisibility = 1;
      targetClarity = 1;
    }
    faceStateRef.current.visibility += (targetVisibility - faceStateRef.current.visibility) * 0.05;
    faceStateRef.current.clarity += (targetClarity - faceStateRef.current.clarity) * 0.05;

    if (ref.current) {
      const focusSlowdown = 1 - smoothIdentityRef.current * 0.28;
      ref.current.rotation.y = t * (0.1 + smoothVisual.current.rotation * 0.025) * focusSlowdown;
      ref.current.rotation.x = Math.sin(t * 0.22) * 0.05;
      const pulse = 1 + Math.sin(t * (0.75 + smoothVisual.current.pulse * 0.2)) * (0.018 + smoothVisual.current.scale * 0.18) * (1 + activity);
      ref.current.scale.setScalar((0.56 + smoothVisual.current.scale * 0.45) * pulse * (0.86 + brightness * 0.2) * (1 + smoothFocusRef.current * 0.1 + smoothIdentityRef.current * 0.06 + smoothFocusBiasRef.current * 0.025));
    }
    if (glowRef.current) glowRef.current.scale.setScalar(0.78 + smoothVisual.current.scale * 0.75 + smoothFocusRef.current * 0.12 + smoothIdentityRef.current * 0.16 + smoothFocusBiasRef.current * 0.08 + Math.sin(t * 1.1) * 0.018);
    if (lensGlowRef.current) {
      lensGlowRef.current.scale.setScalar(1.42 + smoothVisual.current.scale * 0.55 + smoothFocusRef.current * 0.14 + Math.sin(t * 0.62) * 0.018);
    }
    if (ringRef.current) ringRef.current.rotation.z = t * (0.05 + smoothVisual.current.rotation * 0.014);
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.08 + brightness * 0.12 + smoothVisual.current.glow * 0.14 + smoothIdentityRef.current * 0.16 + smoothFocusBiasRef.current * 0.08;
      materialRef.current.emissive.lerpColors(new THREE.Color("#b99059"), new THREE.Color("#b95b4a"), smoothVisual.current.colorShift * 0.65);
    }
    if (glowMaterialRef.current) {
      const faceGlowReduction = faceStateRef.current.visibility * 0.35;
      glowMaterialRef.current.opacity = Math.min(0.22, 0.055 + brightness * 0.022 + smoothVisual.current.glow * 0.026) * (1 - faceGlowReduction);
      glowMaterialRef.current.color.lerpColors(new THREE.Color("#b99059"), new THREE.Color("#b95b4a"), smoothVisual.current.colorShift * 0.55);
    }
    if (lensGlowMaterialRef.current) {
      lensGlowMaterialRef.current.opacity = Math.min(0.2, 0.08 + brightness * 0.018 + smoothVisual.current.glow * 0.018 + smoothFocusRef.current * 0.035 + smoothIdentityRef.current * 0.05 + Math.sin(t * 0.58) * 0.01);
    }
    if (faceRef.current) {
      faceRef.current.lookAt(camera.position);
      const softBlurJitter = (1 - faceStateRef.current.clarity) * 0.018;
      faceRef.current.scale.setScalar(1 + Math.sin(t * 1.3) * softBlurJitter);
    }
    if (faceMaterialRef.current) {
      faceMaterialRef.current.uniforms.time.value = t;
      faceMaterialRef.current.uniforms.visibility.value = faceStateRef.current.visibility;
      faceMaterialRef.current.uniforms.clarity.value = faceStateRef.current.clarity;
      faceMaterialRef.current.uniforms.darkness.value = personalityFearTarget;
      faceMaterialRef.current.uniforms.debugReveal.value = debugRevealActive ? 1 : 0;
    }
    if (faceLightRef.current) {
      const lightIntensity = emotion.current.intensity * 0.5 + meaning.weight * 0.5;
      faceLightRef.current.intensity = Math.min(0.9, lightIntensity * (0.28 + faceStateRef.current.visibility * 0.45));
    }
    if (process.env.NODE_ENV !== "production" && t - lastFaceLogAtRef.current > 2.5) {
      lastFaceLogAtRef.current = t;
      console.log("[Sycho][B12.6.5][FaceState]", {
        visibility: Number(faceStateRef.current.visibility.toFixed(3)),
        clarity: Number(faceStateRef.current.clarity.toFixed(3)),
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
      <mesh ref={faceRef} position={[0, 0, 0.62]} material={faceMaterialRef.current} renderOrder={3}>
        <planeGeometry args={[1.2, 1.6]} />
      </mesh>
      <pointLight ref={faceLightRef} position={[0, 0, 0.18]} color="#ffd27a" intensity={0.12} distance={3} />
      <mesh ref={ringRef} rotation={[Math.PI / 2.15, 0.28, 0.08]}>
        <torusGeometry args={[0.75, 0.012, 8, 96]} />
        <meshBasicMaterial color="#c7a06d" transparent opacity={0.34} depthWrite={false} />
      </mesh>
    </group>
  );
});

export default EgoObject;
