"use client";

import { useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type {
  NexoraMVPStageConnectionPresentation,
  NexoraMVPStageObjectPresentation,
} from "@/app/lib/nex-mvp/nexora3DExecutiveStage";
import type { NexoraMVPContextNodePresentation } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import { resolveExecutiveStage2DVisualAttachmentPosition } from "./executiveStage2DLivePositions";
import { getActiveExecutiveStageMotionTransition } from "@/app/lib/spatial-presentation/executiveStageMotion";

type Props = {
  readonly connections: readonly NexoraMVPStageConnectionPresentation[];
  readonly objects: readonly NexoraMVPStageObjectPresentation[];
  readonly contextNodes?: readonly NexoraMVPContextNodePresentation[];
};

type Point = [number, number, number];

function directionMarkerPoints(
  source: readonly [number, number, number],
  target: readonly [number, number, number],
): Point[] {
  const dx = target[0] - source[0];
  const dy = target[1] - source[1];
  const dz = target[2] - source[2];
  const length = Math.hypot(dx, dy, dz) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const uz = dz / length;
  const tip: Point = [
    target[0] - ux * 0.08,
    target[1] - uy * 0.08,
    target[2] - uz * 0.08,
  ];
  const side = 0.11;
  const px = -uy;
  const py = ux;
  return [
    [
      tip[0] - ux * 0.16 + px * side,
      tip[1] - uy * 0.16 + py * side,
      tip[2] - uz * 0.16,
    ],
    tip,
    [
      tip[0] - ux * 0.16 - px * side,
      tip[1] - uy * 0.16 - py * side,
      tip[2] - uz * 0.16,
    ],
  ];
}

function edgeAttach(
  from: readonly [number, number, number],
  toward: readonly [number, number, number],
  inset = 0.48,
): Point {
  const dx = toward[0] - from[0];
  const dy = toward[1] - from[1];
  const length = Math.hypot(dx, dy) || 1;
  // STAGE-OBJ:3 — attach at projected footprint edge, keep semantic z.
  if (length < inset * 1.15) {
    return [from[0], from[1], from[2]];
  }
  return [
    from[0] + (dx / length) * inset,
    from[1] + (dy / length) * inset,
    from[2],
  ];
}

function resolveLiveRoute(
  connection: NexoraMVPStageConnectionPresentation,
  fallbackSource: readonly [number, number, number],
  fallbackTarget: readonly [number, number, number],
): Point[] {
  const sourceCenter = resolveExecutiveStage2DVisualAttachmentPosition(
    connection.sourceId,
    fallbackSource,
  );
  const targetCenter = resolveExecutiveStage2DVisualAttachmentPosition(
    connection.targetId,
    fallbackTarget,
  );
  const source = edgeAttach(sourceCenter, targetCenter);
  const target = edgeAttach(targetCenter, sourceCenter);
  const motion = getActiveExecutiveStageMotionTransition();
  const inFlight =
    motion != null &&
    !motion.settled &&
    (motion.phase === "transitioning" || motion.phase === "settling");
  // STAGE-MOTION:1 — during travel prefer live→live straight endpoints to avoid
  // bent-route midpoints popping to the final semantic path early.
  if (
    inFlight ||
    !connection.routePoints ||
    connection.routePoints.length < 3
  ) {
    return [
      [source[0], source[1], source[2]],
      [target[0], target[1], target[2]],
    ];
  }
  const mid = connection.routePoints[Math.floor(connection.routePoints.length / 2)]!;
  return [
    [source[0], source[1], source[2]],
    [mid[0], mid[1], mid[2]],
    [target[0], target[1], target[2]],
  ];
}

function pointsChanged(a: Point[], b: Point[], epsilon = 0.012): boolean {
  if (a.length !== b.length) return true;
  for (let i = 0; i < a.length; i += 1) {
    if (Math.hypot(a[i]![0] - b[i]![0], a[i]![1] - b[i]![1], a[i]![2] - b[i]![2]) > epsilon) {
      return true;
    }
  }
  return false;
}

function LiveStageConnection({
  connection,
  fallbackSource,
  fallbackTarget,
}: {
  readonly connection: NexoraMVPStageConnectionPresentation;
  readonly fallbackSource: readonly [number, number, number];
  readonly fallbackTarget: readonly [number, number, number];
}) {
  const [points, setPoints] = useState<Point[]>(() =>
    resolveLiveRoute(connection, fallbackSource, fallbackTarget),
  );

  useFrame(() => {
    const next = resolveLiveRoute(connection, fallbackSource, fallbackTarget);
    setPoints((previous) => (pointsChanged(previous, next) ? next : previous));
  });

  const visualRole =
    connection.visualRole ??
    (connection.emphasized
      ? "anchor-incident"
      : connection.opacity <= 0.15
        ? "background"
        : "context");
  const directionCue = connection.directionCue ?? "none";
  const lineWidth =
    connection.lineWidth ?? (connection.emphasized ? 1.45 : 0.95);
  const color =
    visualRole === "anchor-incident"
      ? "#e2e8f0"
      : visualRole === "context"
        ? "#94a3b8"
        : "#64748b";

  return (
    <group
      userData={{
        connectionId: connection.id,
        canonicalId: connection.id,
        sourceId: connection.sourceId,
        targetId: connection.targetId,
        emphasized: connection.emphasized,
        opacity: connection.opacity,
        visualRole,
        directionCue,
        relation: connection.relation ?? "related",
        visibilityState: visualRole,
        visualAudit: "stage-connection",
        impliesCausality: false,
        routeKind: connection.routeKind ?? "straight",
        stageHitKind: "connection",
      }}
    >
      <Line
        points={points}
        color={color}
        transparent
        opacity={connection.opacity}
        lineWidth={lineWidth}
        depthWrite={false}
        onClick={(event) => {
          event.stopPropagation();
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
      />
      {directionCue === "source-to-target" && connection.emphasized ? (
        <Line
          points={directionMarkerPoints(points[0]!, points[points.length - 1]!)}
          color={color}
          transparent
          opacity={Math.min(connection.opacity + 0.08, 0.85)}
          lineWidth={Math.max(lineWidth - 0.2, 1)}
          depthWrite={false}
          onClick={(event) => {
            event.stopPropagation();
          }}
        />
      ) : null}
    </group>
  );
}

/**
 * Thin subordinate connection layer — presentation only.
 * STAGE-MOTION:1 — endpoints follow live mesh positions during transition.
 */
export function NexoraStageConnections({
  connections,
  objects,
  contextNodes = [],
}: Props) {
  const fallbacks = useMemo(() => {
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
    <group userData={{ visualAudit: "stage-connections" }}>
      {connections.map((connection) => {
        if (connection.visualRole === "hidden" || connection.opacity <= 0) {
          return null;
        }
        const source = fallbacks.get(connection.sourceId);
        const target = fallbacks.get(connection.targetId);
        if (!source || !target) return null;
        return (
          <LiveStageConnection
            key={connection.id}
            connection={connection}
            fallbackSource={source}
            fallbackTarget={target}
          />
        );
      })}
    </group>
  );
}
