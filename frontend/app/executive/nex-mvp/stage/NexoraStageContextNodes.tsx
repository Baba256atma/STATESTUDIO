"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Group, Mesh } from "three";
import type { NexoraMVPContextNodePresentation } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";

type Props = {
  readonly nodes: readonly NexoraMVPContextNodePresentation[];
  readonly hoveredId: string | null;
  readonly onSelect: (subjectId: string) => void;
  readonly onHover: (subjectId: string | null) => void;
};

const KIND_COLOR: Record<string, string> = {
  object: "#7dd3fc",
  problem: "#f87171",
  scenario: "#c4b5fd",
  decision: "#fbbf24",
  execution: "#4ade80",
};

function ContextNodeMesh({
  node,
  hoveredId,
  onSelect,
  onHover,
}: {
  readonly node: NexoraMVPContextNodePresentation;
  readonly hoveredId: string | null;
  readonly onSelect: (subjectId: string) => void;
  readonly onHover: (subjectId: string | null) => void;
}) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const hovered = hoveredId === node.subjectId;
  const color = KIND_COLOR[node.kind] ?? KIND_COLOR.object;
  const isAnchor = node.role === "source-anchor";

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const speed = Math.min(1, delta * 5.5);
    const [tx, ty, tz] = node.targetPosition;
    group.position.x += (tx - group.position.x) * speed;
    group.position.y += (ty - group.position.y) * speed;
    group.position.z += (tz - group.position.z) * speed;
    const targetScale = node.scale * (hovered ? 1.08 : 1);
    const next = group.scale.x + (targetScale - group.scale.x) * speed;
    group.scale.setScalar(next);
    const mesh = meshRef.current;
    if (mesh && "opacity" in mesh.material) {
      const material = mesh.material as { opacity: number };
      material.opacity += (node.opacity - material.opacity) * speed;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Expanded invisible hit target */}
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect(node.subjectId);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(node.subjectId);
        }}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh ref={meshRef}>
        {isAnchor || node.kind === "object" ? (
          <boxGeometry args={[0.48, 0.48, 0.48]} />
        ) : node.kind === "decision" ? (
          <octahedronGeometry args={[0.38, 0]} />
        ) : node.kind === "execution" ? (
          <cylinderGeometry args={[0.28, 0.28, 0.5, 20]} />
        ) : (
          <sphereGeometry args={[0.36, 24, 24]} />
        )}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={node.focused ? 0.4 : 0.16}
          metalness={0.25}
          roughness={0.48}
          transparent
          opacity={node.opacity}
          wireframe={node.kind === "scenario"}
        />
      </mesh>

      <Html
        center
        distanceFactor={10}
        position={[0, 0.62, 0]}
        style={{
          pointerEvents: "none",
          userSelect: "none",
          whiteSpace: "nowrap",
          fontFamily: '"IBM Plex Sans", "Segoe UI", system-ui, sans-serif',
          fontSize: "10px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: hovered || node.focused ? "#f8fafc" : "rgba(226,232,240,0.78)",
          textShadow: "0 1px 8px rgba(2, 6, 14, 0.85)",
        }}
      >
        <span data-testid={`nexora-context-label-${node.subjectId}`}>
          {node.kind} · {node.label}
        </span>
      </Html>
    </group>
  );
}

/**
 * Contextual Problem / Scenario / Decision / Execution nodes.
 * Presentation only — selection forwarded to interaction coordinator.
 */
export function NexoraStageContextNodes({
  nodes,
  hoveredId,
  onSelect,
  onHover,
}: Props) {
  if (nodes.length === 0) return null;
  return (
    <group>
      {nodes.map((node) => (
        <ContextNodeMesh
          key={node.id}
          node={node}
          hoveredId={hoveredId}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}
    </group>
  );
}
