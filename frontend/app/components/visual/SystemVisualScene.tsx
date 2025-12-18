"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import type {
  VisualField,
  VisualFlow,
  VisualLever,
  VisualLoop,
  VisualNode,
  VisualState,
} from "../../lib/visualState";
import { parseVisualState } from "../../lib/visualState";
import { damp, dampVec3 } from "./damp";

type FocusHandler = (id: string) => void;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function clamp01(value: number) {
  return clamp(value, 0, 1);
}

function hashTo01(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i += 1) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

function mixColor(base: string, intensity: number) {
  const color = new THREE.Color(base);
  const target = new THREE.Color("#ffffff");
  return color.lerp(target, clamp01(intensity) * 0.35).getStyle();
}

function getNodeGeometry(shape: VisualNode["shape"]) {
  switch (shape) {
    case "sphere":
      return <sphereGeometry args={[0.5, 32, 32]} />;
    case "box":
      return <boxGeometry args={[0.9, 0.9, 0.9]} />;
    case "ico":
      return <icosahedronGeometry args={[0.6, 0]} />;
    case "dodeca":
      return <dodecahedronGeometry args={[0.6, 0]} />;
    default:
      return <sphereGeometry args={[0.5, 32, 32]} />;
  }
}

export function NodeMesh({
  node,
  focused,
  focusActive,
}: {
  node: VisualNode;
  focused: boolean;
  focusActive: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const whiteRef = useMemo(() => new THREE.Color("#ffffff"), []);
  const seed = useMemo(() => hashTo01(node.id), [node.id]);
  const baseScale = node.scale ?? 1;
  const isPoly = node.shape === "ico" || node.shape === "dodeca";
  const posRef = useRef(new THREE.Vector3(...node.pos));
  const targetPos = useMemo(() => new THREE.Vector3(...node.pos), [node.pos]);
  const baseScaleRef = useRef(baseScale);
  const opacityRef = useRef(clamp01(node.opacity));
  const emissiveRef = useRef(clamp01(node.intensity) * 0.6);
  const colorRef = useRef(new THREE.Color(node.color));
  const targetColor = useMemo(() => new THREE.Color(mixColor(node.color, node.intensity)), [node.color, node.intensity]);

  useFrame((state, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = state.clock.getElapsedTime() + seed * 5;
    const pulse = 1 + Math.sin(t * 1.5) * 0.05 * clamp01(node.intensity);
    const focusBoost = focused ? 1.08 : 1;
    baseScaleRef.current = damp(baseScaleRef.current, baseScale * focusBoost, 6, delta);
    mesh.scale.setScalar(baseScaleRef.current * pulse);
    if (isPoly) {
      const rotSpeed = clamp(0.1 + node.intensity * 0.25, 0.05, 0.4);
      mesh.rotation.y += delta * rotSpeed;
      mesh.rotation.x += delta * rotSpeed * 0.45;
    }
    dampVec3(posRef.current, targetPos, 8, delta);
    mesh.position.copy(posRef.current);

    const dimFactor = focusActive && !focused ? 0.7 : 1;
    const targetOpacity = clamp01(node.opacity) * dimFactor;
    opacityRef.current = damp(opacityRef.current, targetOpacity, 10, delta);

    const targetEmissive = (clamp01(node.intensity) * 0.6 + (focused ? 0.4 : 0)) * (focusActive && !focused ? 0.35 : 1);
    emissiveRef.current = damp(emissiveRef.current, targetEmissive, 10, delta);

    colorRef.current.lerp(targetColor, 1 - Math.exp(-6 * delta));
    if (materialRef.current) {
      materialRef.current.opacity = opacityRef.current;
      materialRef.current.emissiveIntensity = emissiveRef.current;
      materialRef.current.color.copy(colorRef.current);
      materialRef.current.emissive.copy(focused ? whiteRef : colorRef.current);
    }
  });

  return (
    <mesh ref={ref} position={node.pos}>
      {getNodeGeometry(node.shape)}
      <meshStandardMaterial
        ref={materialRef}
        color={mixColor(node.color, node.intensity)}
        emissive={focused ? "#ffffff" : node.color}
        emissiveIntensity={focused ? 0.75 : node.intensity * 0.6}
        transparent
        opacity={clamp01(node.opacity)}
      />
    </mesh>
  );
}

export function LoopRing({
  loop,
  focused,
  focusActive,
}: {
  loop: VisualLoop;
  focused: boolean;
  focusActive: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const particleRef = useRef<THREE.Mesh>(null);
  const bottleneckRef = useRef<THREE.Mesh>(null);
  const delayArcRef = useRef<THREE.Mesh>(null);
  const ringMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const seed = useMemo(() => hashTo01(loop.id), [loop.id]);
  const phaseRef = useRef(seed * Math.PI * 2);
  const speedRef = useRef(loop.flowSpeed);
  const posRef = useRef(new THREE.Vector3(...loop.center));
  const targetPos = useMemo(() => new THREE.Vector3(...loop.center), [loop.center]);

  useFrame((state, delta) => {
    speedRef.current = damp(speedRef.current, clamp(loop.flowSpeed, 0.05, 1.2), 8, delta);
    phaseRef.current += speedRef.current * delta;
    const angle = phaseRef.current % (Math.PI * 2);
    const x = Math.cos(angle) * loop.radius;
    const y = Math.sin(angle) * loop.radius;
    const particle = particleRef.current;
    if (particle) {
      particle.position.set(x, y, 0);
    }
    if (bottleneckRef.current && loop.bottleneck !== undefined) {
      const flicker = 0.5 + Math.sin(phaseRef.current * 2.2) * 0.12;
      (bottleneckRef.current.material as THREE.MeshStandardMaterial).opacity = clamp01(
        0.35 + loop.bottleneck * 0.3 * flicker
      );
    }
    if (delayArcRef.current && loop.delay !== undefined) {
      (delayArcRef.current.material as THREE.MeshStandardMaterial).opacity = clamp01(
        0.2 + loop.delay * 0.6
      );
    }
    if (groupRef.current) {
      dampVec3(posRef.current, targetPos, 6, delta);
      groupRef.current.position.copy(posRef.current);
    }
    if (ringMatRef.current) {
      const dimFactor = focusActive && !focused ? 0.7 : 1;
      const targetOpacity = 0.85 * dimFactor;
      ringMatRef.current.opacity = damp(ringMatRef.current.opacity, targetOpacity, 8, delta);
      const targetEmissive = focused ? 0.6 : loop.intensity * 0.4 * dimFactor;
      ringMatRef.current.emissiveIntensity = damp(
        ringMatRef.current.emissiveIntensity,
        targetEmissive,
        8,
        delta
      );
    }
  });

  const baseColor = loop.type === "R" ? "#a6b2bf" : "#88909b";
  const ringColor = mixColor(baseColor, loop.intensity * (loop.type === "R" ? 1.0 : 0.6));

  return (
    <group ref={groupRef} position={loop.center}>
      <mesh ref={ringRef} rotation={[0, 0, 0]}>
        <torusGeometry args={[loop.radius, 0.08, 16, 80]} />
        <meshStandardMaterial
          ref={ringMatRef}
          color={ringColor}
          emissive={focused ? "#ffffff" : ringColor}
          emissiveIntensity={focused ? 0.6 : loop.intensity * 0.4}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.05 + loop.intensity * 0.05, 12, 12]} />
        <meshStandardMaterial color={ringColor} emissive={ringColor} emissiveIntensity={0.8} />
      </mesh>
      {loop.bottleneck !== undefined && (
        <mesh ref={bottleneckRef} position={[loop.radius, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.25, 12]} />
          <meshStandardMaterial color="#323843" transparent opacity={0.4} />
        </mesh>
      )}
      {loop.delay !== undefined && (
        <mesh ref={delayArcRef} rotation={[0, 0, Math.PI * 0.25]}>
          <torusGeometry args={[loop.radius, 0.05, 12, 24, Math.PI * (0.2 + loop.delay * 0.5)]} />
          <meshStandardMaterial color="#4b5563" transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}

export function LeverHandle({
  lever,
  focused,
  onFocus,
  focusActive,
}: {
  lever: VisualLever;
  focused: boolean;
  onFocus?: FocusHandler;
  focusActive: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const strength = clamp01(lever.strength);
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const scaleRef = useRef(0.6 + strength * 0.6);
  const pulseRef = useRef(0);
  const pulseDuration = 0.3;

  useFrame((_, delta) => {
    pulseRef.current = Math.max(0, pulseRef.current - delta / pulseDuration);
    const baseScale = 0.6 + strength * 0.6;
    const hoverBoost = hovered ? 0.04 : 0;
    const focusBoost = focused ? 0.04 : 0;
    const clickBoost = pulseRef.current * 0.06;
    const targetScale = baseScale * (1 + hoverBoost + focusBoost + clickBoost);
    scaleRef.current = damp(scaleRef.current, targetScale, 8, delta);
    if (meshRef.current) {
      meshRef.current.scale.setScalar(scaleRef.current);
    }
    if (matRef.current) {
      const dimFactor = focusActive && !focused ? 0.6 : 1;
      const baseEmissive = focused ? 0.7 : strength * 0.7;
      const hoverEmissive = hovered ? 0.08 : 0;
      const pulseEmissive = pulseRef.current * 0.12;
      const targetEmissive = clamp01(baseEmissive + hoverEmissive + pulseEmissive) * dimFactor;
      matRef.current.emissiveIntensity = damp(matRef.current.emissiveIntensity, targetEmissive, 8, delta);
      matRef.current.opacity = damp(matRef.current.opacity, dimFactor, 8, delta);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={lever.pos}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        pulseRef.current = 1;
        onFocus?.(lever.target || lever.id);
      }}
    >
      <coneGeometry args={[0.25, 0.6, 20]} />
      <meshStandardMaterial
        ref={matRef}
        color="#9aa4b2"
        emissive={focused ? "#ffffff" : "#9aa4b2"}
        emissiveIntensity={focused ? 0.7 : strength * 0.7}
        transparent
        opacity={1}
      />
    </mesh>
  );
}

export function FlowLink({
  flow,
  from,
  to,
  focused,
}: {
  flow: VisualFlow;
  from: VisualNode;
  to: VisualNode;
  focused: boolean;
}) {
  const particleRef = useRef<THREE.Mesh>(null);
  const seed = useMemo(() => hashTo01(flow.id), [flow.id]);
  const intensity = clamp01(flow.intensity ?? 0.5);
  const color = flow.color ?? "#9aa4b2";

  const curve = useMemo(() => {
    const start = new THREE.Vector3(...from.pos);
    const end = new THREE.Vector3(...to.pos);
    const mid = start.clone().lerp(end, 0.5);
    const lift = start.clone().sub(end).length() * 0.15;
    mid.z += lift;
    return new THREE.CatmullRomCurve3([start, mid, end]);
  }, [from.pos, to.pos]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * flow.speed + seed;
    const u = ((t % 1) + 1) % 1;
    const point = curve.getPointAt(u);
    if (particleRef.current) {
      particleRef.current.position.copy(point);
    }
  });

  const geometry = useMemo(() => {
    if (flow.type === "tube") {
      return new THREE.TubeGeometry(curve, 40, 0.04 + intensity * 0.03, 8, false);
    }
    const points = curve.getPoints(24);
    const g = new THREE.BufferGeometry().setFromPoints(points);
    return g;
  }, [curve, flow.type, intensity]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <group>
      {flow.type === "tube" ? (
        <mesh geometry={geometry}>
          <meshStandardMaterial
            color={mixColor(color, intensity)}
            emissive={focused ? "#ffffff" : color}
            emissiveIntensity={focused ? 0.5 : intensity * 0.4}
            transparent
            opacity={0.8}
          />
        </mesh>
      ) : (
        <line geometry={geometry}>
          <lineBasicMaterial color={mixColor(color, intensity)} transparent opacity={0.7} />
        </line>
      )}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.05 + intensity * 0.04, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
}

export function ChaosField({ field }: { field: VisualField }) {
  const pointsRef = useRef<THREE.Points>(null);
  const seed = Math.floor((field.chaos + field.density + field.noiseAmp) * 1000);
  const count = Math.floor(clamp(120 + field.density * 480, 120, 600));

  const geometry = useMemo(() => {
    let s = seed || 1;
    const rand = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = 3.5 + rand() * 2.5;
      const theta = rand() * Math.PI * 2;
      const phi = rand() * Math.PI;
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.cos(phi) * r;
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count, seed]);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const drift = Math.sin(t * 0.2) * field.noiseAmp * (0.03 + field.chaos * 0.04);
    if (pointsRef.current) {
      pointsRef.current.rotation.y = drift;
      pointsRef.current.rotation.x = drift * 0.6;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#64748b"
        size={0.04}
        transparent
        opacity={0.35 + field.chaos * 0.25}
        sizeAttenuation
      />
    </points>
  );
}

export function SceneMood({
  chaos,
  mode = "night",
}: {
  chaos: number;
  mode?: "day" | "night" | "stars";
}) {
  const { scene } = useThree();
  useEffect(() => {
    const settings = {
      day: { fogColor: "#d7e3f4", baseNear: 10, baseFar: 32 },
      night: { fogColor: "#0b0f16", baseNear: 7, baseFar: 20 },
      stars: { fogColor: "#070b1a", baseNear: 8, baseFar: 24 },
    }[mode];
    const near = settings.baseNear - chaos * 0.6;
    const far = settings.baseFar - chaos * 1.2;
    scene.fog = new THREE.Fog(
      settings.fogColor,
      Math.max(3, near),
      Math.max(near + 6, far)
    );
    return () => {
      scene.fog = null;
    };
  }, [chaos, mode, scene]);

  const baseAmbient = mode === "day" ? 0.55 : mode === "night" ? 0.3 : 0.26;
  const intensity = clamp(baseAmbient + chaos * 0.08, 0.22, 0.7);
  return <ambientLight intensity={intensity} />;
}

function ErrorOverlay({ error }: { error: string }) {
  useEffect(() => {
    console.error("[VisualState] schema error:", error);
  }, [error]);
  return (
    <Html position={[0, 0, 0]} center>
      <div
        style={{
          padding: "10px 12px",
          borderRadius: 8,
          background: "rgba(20, 22, 28, 0.8)",
          color: "white",
          fontSize: 12,
          border: "1px solid rgba(255,255,255,0.12)",
          maxWidth: 320,
        }}
      >
        VisualState error. Check console for details.
      </div>
    </Html>
  );
}

function CameraInit({ position }: { position: [number, number, number] }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(...position);
    camera.lookAt(0, 0, 0);
  }, [camera, position]);
  return null;
}

export function SystemVisualScene({
  visual,
  onFocus,
  backgroundMode = "night",
}: {
  visual: unknown;
  onFocus?: FocusHandler;
  backgroundMode?: "day" | "night" | "stars";
}) {
  const parsed = useMemo(() => parseVisualState(visual), [visual]);
  if (!parsed.ok) {
    return (
      <>
        <CameraInit position={[0, 0, 6]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 4]} intensity={0.6} />
        <ErrorOverlay error={parsed.error} />
      </>
    );
  }

  const data: VisualState = parsed.data;
  const focusId = data.focus;
  const focusActive = !!focusId;
  const nodeMap = useMemo(() => {
    const map = new Map<string, VisualNode>();
    data.nodes.forEach((node) => map.set(node.id, node));
    return map;
  }, [data.nodes]);

  const chaos = data.field?.chaos ?? 0;
  const directionalIntensity =
    backgroundMode === "day"
      ? 0.7
      : backgroundMode === "night"
      ? 0.45
      : 0.4;
  const directionalColor = backgroundMode === "day" ? "#ffffff" : "#c6d0dd";

  return (
    <>
      <CameraInit position={[0, 0, 6]} />
      <SceneMood chaos={chaos} mode={backgroundMode} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={directionalIntensity}
        color={directionalColor}
      />

      {data.field && <ChaosField field={data.field} />}

      {data.loops.map((loop) => (
        <LoopRing key={loop.id} loop={loop} focused={loop.id === focusId} focusActive={focusActive} />
      ))}

      {data.flows?.map((flow) => {
        const from = nodeMap.get(flow.from);
        const to = nodeMap.get(flow.to);
        if (!from || !to) return null;
        return (
          <FlowLink
            key={flow.id}
            flow={flow}
            from={from}
            to={to}
            focused={flow.id === focusId}
          />
        );
      })}

      {data.nodes.map((node) => (
        <NodeMesh
          key={node.id}
          node={node}
          focused={node.id === focusId}
          focusActive={focusActive}
        />
      ))}

      {data.levers.map((lever) => (
        <LeverHandle
          key={lever.id}
          lever={lever}
          focused={lever.id === focusId || lever.target === focusId}
          focusActive={focusActive}
          onFocus={onFocus}
        />
      ))}
    </>
  );
}
