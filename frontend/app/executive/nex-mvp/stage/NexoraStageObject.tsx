"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Group, Mesh } from "three";
import type { NexoraMVPStageObjectPresentation } from "@/app/lib/nex-mvp/nexora3DExecutiveStage";

type Props = {
  readonly presentation: NexoraMVPStageObjectPresentation;
  readonly hoveredId: string | null;
  readonly onSelect: (objectId: string) => void;
  readonly onHover: (objectId: string | null) => void;
};

const STATUS_COLOR: Record<string, string> = {
  stable: "#7dd3fc",
  watch: "#fbbf24",
  risk: "#f87171",
};

/**
 * Compact executive object mesh — geometry only, no domain logic.
 */
export function NexoraStageObject({
  presentation,
  hoveredId,
  onSelect,
  onHover,
}: Props) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const hovered = hoveredId === presentation.id;
  const color = STATUS_COLOR[presentation.status] ?? STATUS_COLOR.stable;

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const speed = Math.min(1, delta * 5.5);
    const [tx, ty, tz] = presentation.targetPosition;
    group.position.x += (tx - group.position.x) * speed;
    group.position.y += (ty - group.position.y) * speed;
    group.position.z += (tz - group.position.z) * speed;

    const hoverBoost = hovered && !presentation.focused ? 1.06 : 1;
    const targetScale = presentation.scale * hoverBoost;
    const current = group.scale.x;
    const next = current + (targetScale - current) * speed;
    group.scale.setScalar(next);

    const mesh = meshRef.current;
    if (mesh && "opacity" in mesh.material) {
      const material = mesh.material as {
        opacity: number;
        emissiveIntensity?: number;
      };
      material.opacity += (presentation.opacity - material.opacity) * speed;
      if (typeof material.emissiveIntensity === "number") {
        const targetEmissive =
          presentation.emissiveIntensity + (hovered ? 0.08 : 0);
        material.emissiveIntensity +=
          (targetEmissive - material.emissiveIntensity) * speed;
      }
    }
  });

  const showLabel =
    presentation.labelProminence !== "minimal" ||
    presentation.focused ||
    hovered;

  return (
    <group
      ref={groupRef}
      position={[
        presentation.overviewPosition[0],
        presentation.overviewPosition[1],
        presentation.overviewPosition[2],
      ]}
      userData={{ objectId: presentation.id }}
    >
      <mesh
        ref={meshRef}
        castShadow={false}
        receiveShadow={false}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(presentation.id);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(presentation.id);
        }}
        onPointerOut={() => onHover(null)}
      >
        <boxGeometry args={[0.72, 0.72, 0.72]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={presentation.emissiveIntensity}
          metalness={0.35}
          roughness={0.42}
          transparent
          opacity={presentation.opacity}
        />
      </mesh>

      {presentation.focused ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]}>
          <ringGeometry args={[0.55, 0.7, 48]} />
          <meshBasicMaterial
            color="#e2e8f0"
            transparent
            opacity={0.45}
            depthWrite={false}
          />
        </mesh>
      ) : null}

      {showLabel ? (
        <Html
          center
          distanceFactor={10}
          position={[0, 0.72, 0]}
          style={{
            pointerEvents: "none",
            userSelect: "none",
            whiteSpace: "nowrap",
            fontFamily:
              '"IBM Plex Sans", "Segoe UI", system-ui, sans-serif',
            fontSize:
              presentation.labelProminence === "full" ? "11px" : "10px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color:
              presentation.focused || hovered
                ? "#f8fafc"
                : "rgba(226, 232, 240, 0.72)",
            opacity: presentation.labelProminence === "minimal" ? 0.55 : 1,
            textShadow: "0 1px 8px rgba(2, 6, 14, 0.85)",
          }}
        >
          {presentation.label}
        </Html>
      ) : null}
    </group>
  );
}
