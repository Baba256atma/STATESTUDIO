"use client";

import { useMemo } from "react";
import { Line } from "@react-three/drei";
import type {
  NexoraMVPStageConnectionPresentation,
  NexoraMVPStageObjectPresentation,
} from "@/app/lib/nex-mvp/nexora3DExecutiveStage";
import type { NexoraMVPContextNodePresentation } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";

type Props = {
  readonly connections: readonly NexoraMVPStageConnectionPresentation[];
  readonly objects: readonly NexoraMVPStageObjectPresentation[];
  readonly contextNodes?: readonly NexoraMVPContextNodePresentation[];
};

/**
 * Thin subordinate connection layer — presentation only.
 */
export function NexoraStageConnections({
  connections,
  objects,
  contextNodes = [],
}: Props) {
  const positions = useMemo(() => {
    const map = new Map<string, readonly [number, number, number]>();
    for (const object of objects) {
      map.set(object.id, object.targetPosition);
    }
    for (const node of contextNodes) {
      map.set(node.id, node.targetPosition);
      map.set(node.subjectId, node.targetPosition);
    }
    return map;
  }, [objects, contextNodes]);

  return (
    <group>
      {connections.map((connection) => {
        const source = positions.get(connection.sourceId);
        const target = positions.get(connection.targetId);
        if (!source || !target) return null;

        return (
          <Line
            key={connection.id}
            points={[
              [source[0], source[1], source[2]],
              [target[0], target[1], target[2]],
            ]}
            color={connection.emphasized ? "#e2e8f0" : "#64748b"}
            transparent
            opacity={connection.opacity}
            lineWidth={connection.emphasized ? 1.5 : 1}
            depthWrite={false}
          />
        );
      })}
    </group>
  );
}
