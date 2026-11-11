"use client";

import { Html } from "@react-three/drei";
import type { OrganizationalSolarLayout } from "@/app/lib/scene-org/organizationalSolarView";

type Props = Readonly<{
  layout: OrganizationalSolarLayout | null;
}>;

/** Presentation rings and a non-canonical center marker. Draws no relationship edges. */
export function NexoraOrganizationalSolarGuides({ layout }: Props) {
  if (layout == null) return null;
  return (
    <group name="organizational-solar-guides">
      <mesh position={[0, 0, 0]}>
        <circleGeometry args={[0.12, 24]} />
        <meshBasicMaterial color="#d6b25e" transparent opacity={0.9} />
      </mesh>
      <Html center position={[0, 0.28, 0]} style={{ pointerEvents: "none" }}>
        <span
          data-testid="nexora-solar-center"
          data-center-kind="presentation-marker"
          data-canonical-object-id=""
          style={{
            color: "rgba(214,178,94,0.95)",
            fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
            fontSize: 8,
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
          }}
        >
          Presentation center
        </span>
      </Html>
      {layout.rings.map((ring) => (
        <group key={ring.ringId}>
          <mesh>
            <ringGeometry args={[ring.radius - 0.012, ring.radius + 0.012, 72]} />
            <meshBasicMaterial color="#94a3b8" transparent opacity={0.38} />
          </mesh>
          <Html center position={[ring.radius, 0.22, 0]} style={{ pointerEvents: "none" }}>
            <span
              data-testid={`nexora-solar-ring-${ring.ringId}`}
              data-ring-semantic={ring.semanticType}
              data-ring-radius={String(ring.radius)}
              data-ring-objects={ring.objectIds.join(",")}
              style={{
                color: "rgba(148,163,184,0.9)",
                fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
                fontSize: 8,
                whiteSpace: "nowrap",
              }}
            >
              {ring.label}
            </span>
          </Html>
        </group>
      ))}
    </group>
  );
}
