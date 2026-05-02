"use client";

// ## SYCHO_NEBULA_STATIC_LAYER
// Nebula is a static background mesh with a fixed plane geometry.
// Runtime animation updates only shader uniforms.
// No geometry resize, no disposal, no state updates from useFrame.

import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function createNebulaMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    toneMapped: false,
    uniforms: {
      time: { value: 0 },
      opacity: { value: 0.13 },
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
      uniform float opacity;
      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 4; i++) {
          value += amplitude * noise(p);
          p *= 2.02;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = vUv - 0.5;
        float vignette = smoothstep(0.78, 0.08, length(uv));
        float drift = time * 0.025;
        float cloudA = fbm(uv * 3.0 + vec2(drift, -drift * 0.7));
        float cloudB = fbm(uv * 5.4 + vec2(-drift * 0.5, drift));
        float nebula = smoothstep(0.24, 0.92, cloudA * 0.72 + cloudB * 0.38);
        vec3 navy = vec3(0.012, 0.032, 0.09);
        vec3 blue = vec3(0.08, 0.2, 0.48);
        vec3 violet = vec3(0.22, 0.08, 0.34);
        vec3 color = mix(navy, blue, cloudA);
        color = mix(color, violet, cloudB * 0.46);
        float alpha = clamp(opacity * nebula * vignette, 0.0, 0.18);
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
}

function PsychNebula(): React.JSX.Element {
  const geometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  if (!geometryRef.current) {
    geometryRef.current = new THREE.PlaneGeometry(120, 80, 1, 1);
  }
  if (!materialRef.current) {
    materialRef.current = createNebulaMaterial();
  }

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Sycho][B12.3-A][NebulaReady]");
    }
  }, []);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.time.value = clock.getElapsedTime();
  });

  return <mesh geometry={geometryRef.current} material={materialRef.current} position={[0, 0, -60]} renderOrder={-20} frustumCulled={false} />;
}

export default React.memo(PsychNebula, () => true);
