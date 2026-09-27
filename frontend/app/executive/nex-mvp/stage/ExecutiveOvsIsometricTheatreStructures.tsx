"use client";

import { useMemo } from "react";
import type { ExecutiveOvsIsometricTheatreVisual } from "@/app/lib/spatial-presentation/executiveOvsIsometricTheatreVisual";

type Props = {
  readonly visual: ExecutiveOvsIsometricTheatreVisual;
};

/**
 * Visual structure only. Never a canonical Object. No independent motion loop. No Canvas.
 */
export function ExecutiveOvsIsometricTheatreStructures({ visual }: Props) {
  const structures = useMemo(
    () => (visual.sceneStatus === "available" ? visual.structures : []),
    [visual],
  );
  if (structures.length === 0) return null;

  return (
    <group
      userData={{ ovs3Structures: true, isCanonicalObject: false }}
      renderOrder={-1}
    >
      {structures.map((entry) => (
        <mesh
          key={entry.structureId}
          position={[
            entry.worldPosition[0],
            entry.worldPosition[1],
            entry.worldPosition[2],
          ]}
          scale={[
            entry.worldSize[0],
            entry.worldSize[1],
            Math.max(0.02, entry.worldSize[2]),
          ]}
          userData={{
            ovs3StructureId: entry.structureId,
            isCanonicalObject: false,
            canonicalObjectId: null,
            selectable: false,
            stageHitKind: "ovs3-structure",
          }}
          frustumCulled
          raycast={() => null}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={
              entry.primitive === "platform"
                ? "#2d4260"
                : entry.primitive === "path" || entry.primitive === "timeline-track"
                  ? "#3a5474"
                  : "#243650"
            }
            roughness={0.88}
            metalness={0.05}
            emissive="#152033"
            emissiveIntensity={
              entry.primitive === "platform"
                ? 0.18
                : entry.primitive === "path" || entry.primitive === "timeline-track"
                  ? 0.16
                  : 0.12
            }
            transparent
            opacity={
              entry.primitive === "platform"
                ? 0.5
                : entry.primitive === "lane"
                  ? 0.4
                  : entry.primitive === "path" || entry.primitive === "timeline-track"
                    ? 0.46
                    : entry.primitive === "node-support"
                      ? 0.38
                      : 0.34
            }
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
