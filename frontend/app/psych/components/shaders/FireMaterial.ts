import * as THREE from "three";

export function createFireMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      time: { value: 0 },
      intensity: { value: 0.5 },
      opacity: { value: 0.88 },
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
      uniform float intensity;
      uniform float opacity;
      varying vec2 vUv;

      void main() {
        float flame = sin(vUv.y * 12.0 + time * (3.2 + intensity * 2.4)) * 0.5 + 0.5;
        float lick = sin((vUv.x + vUv.y) * 18.0 - time * 2.1) * 0.18;
        float strength = clamp(flame + lick + intensity * 0.25, 0.0, 1.0);
        vec3 ember = vec3(0.16, 0.015, 0.0);
        vec3 orange = vec3(1.0, 0.28, 0.02);
        vec3 gold = vec3(1.0, 0.68, 0.14);
        vec3 color = mix(ember, orange, strength);
        color = mix(color, gold, smoothstep(0.72, 1.0, strength) * 0.42);
        float alpha = opacity * (0.62 + strength * 0.34);
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
}
