"use client";

import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Text, OrbitControls } from "@react-three/drei";

export type ObjState = "stable" | "warning" | "critical";

export type DecisionObjectNode = {
  id: string;
  label: string;
  pos: [number, number, number];
  state: ObjState;
  intensity: number; // 0..1
  opacity?: number; // 0..1
  visible?: boolean;
};

export type DecisionEdge = {
  from: string;
  to: string;
  type?: "influence" | "link";
  weight?: number; // 0..1
  active?: boolean;
};

export type DecisionLoop = {
  id: string;
  label?: string;
  path: string[]; // list of node ids; first may equal last
  intensity: number; // 0..1
  pulseSpeed?: number; // ~0.2..2
  active?: boolean;
};

export type DecisionGraph3DProps = {
  /** Graph nodes (required). */
  objects: DecisionObjectNode[];
  /** Optional edges. If you don't have edges yet, you can omit. */
  edges?: DecisionEdge[];
  /** Optional loop(s). */
  loops?: DecisionLoop[];

  /** Camera config */
  cameraPosition?: [number, number, number];
  fov?: number;

  /** Controls */
  enableControls?: boolean;

  /** Callbacks */
  onNodeClick?: (id: string) => void;

  /** Styling */
  background?: string; // CSS color
};

function clamp01(x: number) {
  if (Number.isNaN(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

function colorForState(state: ObjState) {
  switch (state) {
    case "stable":
      return new THREE.Color("#4ea1ff");
    case "warning":
      return new THREE.Color("#ffd166");
    case "critical":
      return new THREE.Color("#ef476f");
    default:
      return new THREE.Color("#4ea1ff");
  }
}

function lerpColor(a: THREE.Color, b: THREE.Color, t: number) {
  return a.clone().lerp(b, clamp01(t));
}

function safeVec3(pos: [number, number, number]) {
  const x = Number(pos?.[0] ?? 0);
  const y = Number(pos?.[1] ?? 0);
  const z = Number(pos?.[2] ?? 0);
  return new THREE.Vector3(x, y, z);
}

function DecisionNode({ obj, onClick }: { obj: DecisionObjectNode; onClick?: (id: string) => void }) {
  const meshRef = React.useRef<THREE.Mesh>(null);

  const intensity = clamp01(obj.intensity);
  const opacity = clamp01(obj.opacity ?? 0.95);
  const visible = obj.visible !== false;
  const baseColor = React.useMemo(() => colorForState(obj.state), [obj.state]);

  const material = React.useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: baseColor,
      emissive: lerpColor(baseColor, new THREE.Color("white"), 0.15),
      emissiveIntensity: 0.2 + intensity * 1.8,
      roughness: 0.35,
      metalness: 0.2,
      transparent: true,
      opacity,
      depthWrite: true,
    });
  }, [baseColor, intensity, opacity]);

  useFrame(() => {
    if (!meshRef.current) return;
    const t = performance.now() * 0.001;
    const breathe = 1 + Math.sin(t * 2) * 0.03 * intensity;
    meshRef.current.scale.setScalar((1 + intensity * 0.6) * breathe);
  });

  if (!visible) return null;

  return (
    <group position={obj.pos}>
      <mesh
        ref={meshRef}
        material={material}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(obj.id);
        }}
      >
        <sphereGeometry args={[0.28, 32, 32]} />
      </mesh>

      <Text
        position={[0, 0.52, 0]}
        fontSize={0.14}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.003}
        outlineColor="#000000"
      >
        {obj.label}
      </Text>
    </group>
  );
}

function DecisionEdgeLine({ from, to, weight, active }: { from: DecisionObjectNode; to: DecisionObjectNode; weight: number; active: boolean }) {
  const w = clamp01(weight);
  const points = React.useMemo(() => [safeVec3(from.pos), safeVec3(to.pos)], [from.pos, to.pos]);

  const color = React.useMemo(() => {
    const cf = colorForState(from.state);
    const ct = colorForState(to.state);
    const mid = lerpColor(cf, ct, 0.5);
    const boosted = lerpColor(mid, new THREE.Color("white"), active ? 0.35 : 0.15);
    return boosted;
  }, [from.state, to.state, active]);

  return (
    <Line
      points={points}
      lineWidth={active ? 2.5 + w * 2 : 1 + w * 2}
      color={color}
      transparent
      opacity={active ? 0.35 + w * 0.35 : 0.18 + w * 0.25}
    />
  );
}

function LoopPulse({ loop, objectsById }: { loop: DecisionLoop; objectsById: Record<string, DecisionObjectNode> }) {
  const pulseRef = React.useRef<THREE.Mesh>(null);

  const pts = React.useMemo(() => {
    const vecs: THREE.Vector3[] = [];
    for (const id of loop.path) {
      const o = objectsById[id];
      if (o && o.visible !== false) vecs.push(safeVec3(o.pos));
    }
    // Ensure we have at least 2 points
    return vecs.length >= 2 ? vecs : [];
  }, [loop.path, objectsById]);

  const { cumulative, total } = React.useMemo(() => {
    const cum: number[] = [0];
    let sum = 0;
    for (let i = 1; i < pts.length; i++) {
      sum += pts[i].distanceTo(pts[i - 1]);
      cum.push(sum);
    }
    return { cumulative: cum, total: sum || 1 };
  }, [pts]);

  const intensity = clamp01(loop.intensity);
  const speed = Number(loop.pulseSpeed ?? 0.9);
  const isActive = loop.active !== false;

  useFrame(() => {
    if (!pulseRef.current || pts.length < 2 || !isActive) return;

    const t = performance.now() * 0.001 * speed;
    const phase = t % 1; // 0..1
    const dist = phase * total;

    let i = 1;
    while (i < cumulative.length && cumulative[i] < dist) i++;
    i = Math.min(i, pts.length - 1);

    const d0 = cumulative[i - 1];
    const d1 = cumulative[i];
    const localT = (dist - d0) / Math.max(1e-6, d1 - d0);

    const p = pts[i - 1].clone().lerp(pts[i], clamp01(localT));
    pulseRef.current.position.copy(p);

    const s = 0.12 + intensity * 0.18;
    pulseRef.current.scale.setScalar(s);
  });

  if (!isActive || pts.length < 2) return null;

  return (
    <group>
      <Line
        points={pts}
        lineWidth={2.5}
        color={lerpColor(new THREE.Color("#ffffff"), new THREE.Color("#ef476f"), intensity)}
        transparent
        opacity={0.10 + intensity * 0.25}
      />

      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="white"
          emissive={new THREE.Color("white")}
          emissiveIntensity={0.6 + intensity * 2.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {loop.label ? (
        <Text
          position={[0, 1.8, 0]}
          fontSize={0.14}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.003}
          outlineColor="#000000"
        >
          {loop.label}
        </Text>
      ) : null}
    </group>
  );
}

function SceneContent({
  objects,
  edges,
  loops,
  enableControls,
  onNodeClick,
}: {
  objects: DecisionObjectNode[];
  edges: DecisionEdge[];
  loops: DecisionLoop[];
  enableControls: boolean;
  onNodeClick?: (id: string) => void;
}) {
  const objectsById = React.useMemo(() => {
    const m: Record<string, DecisionObjectNode> = {};
    for (const o of objects) m[o.id] = o;
    return m;
  }, [objects]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.0} />

      {enableControls ? <OrbitControls enableDamping dampingFactor={0.08} /> : null}

      {edges.map((e, idx) => {
        const from = objectsById[e.from];
        const to = objectsById[e.to];
        if (!from || !to) return null;
        const weight = clamp01(e.weight ?? 0.5);
        const active = e.active !== false;
        return <DecisionEdgeLine key={`${e.from}-${e.to}-${idx}`} from={from} to={to} weight={weight} active={active} />;
      })}

      {objects.map((o) => (
        <DecisionNode key={o.id} obj={o} onClick={onNodeClick} />
      ))}

      {loops.map((l) => (
        <LoopPulse key={l.id} loop={l} objectsById={objectsById} />
      ))}
    </>
  );
}

export default function DecisionGraph3D({
  objects,
  edges = [],
  loops = [],
  cameraPosition = [0, 0.2, 4.2],
  fov = 50,
  enableControls = true,
  onNodeClick,
  background = "transparent",
}: DecisionGraph3DProps) {
  // Defensive: ensure ids are unique
  const safeObjects = React.useMemo(() => {
    const seen = new Set<string>();
    const out: DecisionObjectNode[] = [];
    for (const o of objects || []) {
      if (!o?.id || seen.has(o.id)) continue;
      seen.add(o.id);
      out.push({
        ...o,
        intensity: clamp01(Number(o.intensity ?? 0)),
        opacity: clamp01(Number(o.opacity ?? 0.95)),
        visible: o.visible !== false,
      });
    }
    return out;
  }, [objects]);

  const safeEdges = React.useMemo(() => {
    return (edges || []).filter((e) => !!e?.from && !!e?.to);
  }, [edges]);

  const safeLoops = React.useMemo(() => {
    return (loops || []).filter((l) => !!l?.id && Array.isArray(l.path) && l.path.length >= 2);
  }, [loops]);

  return (
    <div style={{ width: "100%", height: "100%", background }}>
      <Canvas camera={{ position: cameraPosition, fov }}>
        <SceneContent
          objects={safeObjects}
          edges={safeEdges}
          loops={safeLoops}
          enableControls={enableControls}
          onNodeClick={onNodeClick}
        />
      </Canvas>
    </div>
  );
}