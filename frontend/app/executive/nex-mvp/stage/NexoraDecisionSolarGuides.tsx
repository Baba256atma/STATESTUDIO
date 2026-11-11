"use client";

import { Html } from "@react-three/drei";
import type { DecisionSolarLayout } from "@/app/lib/scene-org/decisionSolarProjection";

type Props = Readonly<{
  layout: DecisionSolarLayout | null;
}>;

/** Presentation rings and explicit decision edges. Ring radius is not a score. */
export function NexoraDecisionSolarGuides({ layout }: Props) {
  if (layout == null) return null;
  const position = new Map(layout.placements.map((placement) => [placement.id, placement.position]));
  return (
    <group name="decision-solar-guides">
      {layout.rings.map((ring) => (
        <group key={ring.ringId}>
          <mesh>
            <ringGeometry args={[ring.radius - 0.012, ring.radius + 0.012, 72]} />
            <meshBasicMaterial color="#5eead4" transparent opacity={0.35} />
          </mesh>
          <Html center position={[ring.radius, 0.22, 0]} style={{ pointerEvents: "none" }}>
            <span data-testid={`nexora-decision-ring-${ring.ringId}`} style={{ color: "rgba(94,234,212,0.9)", fontSize: 8, whiteSpace: "nowrap" }}>
              {ring.label}
            </span>
          </Html>
        </group>
      ))}
      {layout.edges.map((edge) => {
        const source = position.get(edge.sourceId);
        const target = position.get(edge.targetId);
        if (!source || !target) return null;
        const length = Math.hypot(target.x - source.x, target.y - source.y);
        const angle = Math.atan2(target.y - source.y, target.x - source.x);
        return (
          <mesh
            key={edge.relationshipId}
            position={[(source.x + target.x) / 2, (source.y + target.y) / 2, 0.02]}
            rotation={[0, 0, angle]}
            userData={{ relationshipId: edge.relationshipId, relationshipType: edge.relationshipType }}
          >
            <boxGeometry args={[Math.max(length, 0.01), 0.015, 0.01]} />
            <meshBasicMaterial color="#5eead4" transparent opacity={0.75} />
          </mesh>
        );
      })}
    </group>
  );
}
