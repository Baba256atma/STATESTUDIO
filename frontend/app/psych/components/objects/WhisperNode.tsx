"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";
import type { InspirationSignal } from "../../engine/inspirationEngine";

type WhisperNodeProps = {
  signal: InspirationSignal | null;
};

const NODE_POSITION = new THREE.Vector3(0.9, 0.58, 0.22);
const ELEMENT_POSITIONS: Array<[number, number, number]> = [
  [0, 1.8, -0.4],
  [2.4, 0.5, 0],
  [-2.2, -0.7, 0],
  [-1.7, 0.9, -0.2],
  [1.6, -1.3, 0.2],
  [0, 0, 0],
];

const AURA_POINTS: Array<[number, number, number, number]> = [
  [0.16, 0.04, 0.02, 0.014],
  [-0.14, 0.08, -0.01, 0.011],
  [0.08, -0.13, 0.04, 0.012],
  [-0.07, -0.1, -0.03, 0.009],
  [0.02, 0.17, 0.01, 0.01],
  [0.2, -0.05, -0.02, 0.008],
  [-0.18, -0.02, 0.02, 0.01],
  [0.11, 0.13, -0.04, 0.008],
];

function createConnectionGeometry(): THREE.BufferGeometry {
  const positions = new Float32Array(ELEMENT_POSITIONS.length * 2 * 3);
  ELEMENT_POSITIONS.forEach((position, index) => {
    const offset = index * 6;
    positions[offset] = position[0];
    positions[offset + 1] = position[1];
    positions[offset + 2] = position[2];
    positions[offset + 3] = NODE_POSITION.x;
    positions[offset + 4] = NODE_POSITION.y;
    positions[offset + 5] = NODE_POSITION.z;
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setDrawRange(0, ELEMENT_POSITIONS.length * 2);
  return geometry;
}

function createOracleGeometry(): THREE.SphereGeometry {
  // ## SYCHO_STATIC_GEOMETRY_RULE
  // Whisper geometry is displaced once at mount and never resized or mutated per frame.
  const geometry = new THREE.SphereGeometry(0.135, 42, 26);
  const noise = new ImprovedNoise();
  const position = geometry.attributes.position as THREE.BufferAttribute;
  const vertex = new THREE.Vector3();
  const direction = new THREE.Vector3();

  for (let index = 0; index < position.count; index += 1) {
    vertex.fromBufferAttribute(position, index);
    direction.copy(vertex).normalize();
    const ridges =
      noise.noise(direction.x * 2.5 + 0.4, direction.y * 2.5 - 0.2, direction.z * 2.5 + 0.15) * 0.52 +
      noise.noise(direction.x * 5.4 - 0.1, direction.y * 5.4 + 0.3, direction.z * 5.4) * 0.28 +
      noise.noise(direction.x * 10.0, direction.y * 10.0, direction.z * 10.0 + 0.5) * 0.1;
    const organicBias = 1 + Math.sin(direction.y * Math.PI * 2.4) * 0.025;
    const radius = 1 + ridges * 0.22 + organicBias * 0.035;
    vertex.copy(direction).multiplyScalar(0.135 * radius);
    position.setXYZ(index, vertex.x, vertex.y, vertex.z);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

const WhisperNode = React.memo(function WhisperNode({ signal }: WhisperNodeProps): React.JSX.Element {
  const groupRef = useRef<THREE.Group | null>(null);
  const orbRef = useRef<THREE.Mesh | null>(null);
  const orbMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const haloMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const ringMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const lineMaterialRef = useRef<THREE.LineBasicMaterial | null>(null);
  const lightRef = useRef<THREE.PointLight | null>(null);
  const auraMaterialRefs = useRef<Array<THREE.MeshBasicMaterial | null>>([]);
  const visibleRef = useRef(0);
  const intensityRef = useRef(0);
  const lastSignalIdRef = useRef(0);
  const connectionGeometry = useMemo(() => createConnectionGeometry(), []);
  const oracleGeometry = useMemo(() => createOracleGeometry(), []);

  useFrame(({ clock }, delta) => {
    const now = Date.now();
    const active = signal && now < signal.pulseUntil;
    if (active && signal.id !== lastSignalIdRef.current) {
      lastSignalIdRef.current = signal.id;
      if (process.env.NODE_ENV !== "production") {
        console.log("[Sycho][B13][WhisperNodeAppeared]");
        if (signal.source === "oracle") console.log("[Sycho][B13.3][OracleNodeAppeared]");
      }
    }

    const target = active ? 1 : 0;
    const targetIntensity = active ? signal.intensity : 0;
    const oraclePresence = active && signal.source === "oracle" ? 1 : 0;
    const safeDelta = Math.min(delta, 0.033);
    visibleRef.current = THREE.MathUtils.lerp(visibleRef.current, target, safeDelta * (active ? 3.8 : 1.7));
    intensityRef.current = THREE.MathUtils.lerp(intensityRef.current, targetIntensity, safeDelta * 3.2);

    const visibility = visibleRef.current;
    const intensity = intensityRef.current;
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      const floatY = Math.sin(t * 0.74) * 0.045;
      const floatX = Math.cos(t * 0.43) * 0.025;
      groupRef.current.position.set(NODE_POSITION.x + floatX, NODE_POSITION.y + floatY, NODE_POSITION.z);
      groupRef.current.scale.setScalar(0.66 + visibility * (0.55 + intensity * 0.32 + oraclePresence * 0.12) + Math.sin(t * 1.2) * 0.022 * visibility);
      groupRef.current.rotation.y += delta * (0.11 + intensity * 0.08 + oraclePresence * 0.04);
      groupRef.current.rotation.z = Math.sin(t * 0.31) * 0.08 * visibility + oraclePresence * Math.sin(t * 0.18) * 0.025;
    }
    if (orbRef.current) {
      orbRef.current.rotation.x += delta * (0.07 + intensity * 0.04);
      orbRef.current.rotation.y += delta * (0.16 + intensity * 0.08);
    }
    if (orbMaterialRef.current) {
      orbMaterialRef.current.opacity = visibility * (0.28 + intensity * 0.42 + oraclePresence * 0.12);
      orbMaterialRef.current.color.lerpColors(new THREE.Color("#facc15"), new THREE.Color("#a78bfa"), 0.42 + Math.sin(t * 0.38) * 0.12);
      orbMaterialRef.current.emissive.lerpColors(new THREE.Color("#f59e0b"), new THREE.Color("#7c3aed"), 0.38 + Math.sin(t * 0.52) * 0.16);
      orbMaterialRef.current.emissiveIntensity = visibility * (0.72 + intensity * 1.25 + oraclePresence * 0.45);
    }
    if (haloMaterialRef.current) {
      haloMaterialRef.current.opacity = visibility * (0.08 + intensity * 0.13 + oraclePresence * 0.06);
    }
    if (ringMaterialRef.current) {
      ringMaterialRef.current.opacity = visibility * (0.16 + intensity * 0.18 + oraclePresence * 0.08);
    }
    if (lineMaterialRef.current) {
      lineMaterialRef.current.opacity = visibility * (0.045 + intensity * 0.075 + oraclePresence * 0.035);
    }
    if (lightRef.current) {
      lightRef.current.intensity = visibility * (0.18 + intensity * 0.34 + oraclePresence * 0.22);
    }
    auraMaterialRefs.current.forEach((material, index) => {
      if (!material) return;
      material.opacity = visibility * (0.1 + intensity * 0.15 + oraclePresence * 0.04) * (0.7 + Math.sin(t * 0.8 + index) * 0.18);
    });
  });

  return (
    <group data-nx="psych-whisper-node">
      <lineSegments geometry={connectionGeometry} renderOrder={-1}>
        <lineBasicMaterial ref={lineMaterialRef} color="#f8d58a" transparent opacity={0} depthWrite={false} />
      </lineSegments>
      <group ref={groupRef} position={NODE_POSITION}>
        <mesh ref={orbRef} geometry={oracleGeometry} renderOrder={3}>
          <meshStandardMaterial
            ref={orbMaterialRef}
            color="#facc15"
            emissive="#f59e0b"
            emissiveIntensity={0}
            transparent
            opacity={0}
            roughness={0.48}
            metalness={0.12}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh renderOrder={2}>
          <sphereGeometry args={[0.32, 24, 12]} />
          <meshBasicMaterial ref={haloMaterialRef} color="#a78bfa" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
        <pointLight ref={lightRef} color="#f8d58a" intensity={0} distance={1.8} />
        <mesh rotation={[Math.PI / 2.4, 0.35, 0.1]} renderOrder={3}>
          <torusGeometry args={[0.22, 0.005, 6, 56]} />
          <meshBasicMaterial ref={ringMaterialRef} color="#fde68a" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
        {AURA_POINTS.map(([x, y, z, size], index) => (
          <mesh key={index} position={[x, y, z]} renderOrder={4}>
            <sphereGeometry args={[size, 10, 6]} />
            <meshBasicMaterial
              ref={(material) => { auraMaterialRefs.current[index] = material; }}
              color={index % 3 === 0 ? "#c4b5fd" : "#fde68a"}
              transparent
              opacity={0}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
});

export default WhisperNode;
