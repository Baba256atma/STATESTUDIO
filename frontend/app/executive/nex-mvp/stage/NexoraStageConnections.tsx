"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type {
  NexoraMVPStageConnectionPresentation,
  NexoraMVPStageObjectPresentation,
} from "@/app/lib/nex-mvp/nexora3DExecutiveStage";
import type { NexoraMVPContextNodePresentation } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import { resolveExecutiveStage2DVisualAttachmentPosition } from "./executiveStage2DLivePositions";
import { getActiveExecutiveStageMotionTransition } from "@/app/lib/spatial-presentation/executiveStageMotion";
import { useExecutiveThemeCssColor } from "@/app/lib/ui/executiveThemeCssBridge";

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
  const side = 0.04;
  const px = -uy;
  const py = ux;
  return [
    [
      tip[0] - ux * 0.07 + px * side,
      tip[1] - uy * 0.07 + py * side,
      tip[2] - uz * 0.07,
    ],
    tip,
    [
      tip[0] - ux * 0.07 - px * side,
      tip[1] - uy * 0.07 - py * side,
      tip[2] - uz * 0.07,
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

function curveBias(id: string): number {
  let hash = 2166136261;
  for (let index = 0; index < id.length; index += 1) {
    hash = Math.imul(hash ^ id.charCodeAt(index), 16777619);
  }
  const unit = (hash >>> 0) / 4294967295;
  return (unit - 0.5) * 2;
}

function sampleCubic(
  start: Point,
  controlA: Point,
  controlB: Point,
  end: Point,
): Point[] {
  const steps = 18;
  const points: Point[] = [];
  for (let step = 0; step <= steps; step += 1) {
    const t = step / steps;
    const u = 1 - t;
    const lift = Math.sin(t * Math.PI) * 0.045;
    points.push([
      u * u * u * start[0] +
        3 * u * u * t * controlA[0] +
        3 * u * t * t * controlB[0] +
        t * t * t * end[0],
      u * u * u * start[1] +
        3 * u * u * t * controlA[1] +
        3 * u * t * t * controlB[1] +
        t * t * t * end[1],
      u * u * u * start[2] +
        3 * u * u * t * controlA[2] +
        3 * u * t * t * controlB[2] +
        t * t * t * end[2] +
        lift,
    ]);
  }
  return points;
}

/**
 * Presentation curve only. Endpoints stay on the existing edge attach.
 * Curvature is deterministic from the connection id and the live span.
 */
function smoothSpatialArc(
  source: Point,
  target: Point,
  id: string,
  mid?: Point,
): Point[] {
  const dx = target[0] - source[0];
  const dy = target[1] - source[1];
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  let bow =
    curveBias(id) *
    Math.min(0.52, Math.max(0.22, length * 0.34));
  if (mid) {
    const side = (mid[0] - source[0]) * -uy + (mid[1] - source[1]) * ux;
    if (Math.abs(side) > 0.04) {
      bow = Math.sign(side) * Math.max(Math.abs(bow) * 0.65, Math.min(0.52, Math.abs(side)));
    }
  }
  if (length < 0.7) bow *= length / 0.7;
  const px = -uy * bow;
  const py = ux * bow;
  const controlA: Point = [
    source[0] + ux * length * 0.3 + px,
    source[1] + uy * length * 0.3 + py,
    source[2],
  ];
  const controlB: Point = [
    source[0] + ux * length * 0.7 + px * 0.7,
    source[1] + uy * length * 0.7 + py * 0.7,
    target[2],
  ];
  return sampleCubic(source, controlA, controlB, target);
}

function flowHighlight(points: Point[], travel: number): Point[] {
  const last = points.length - 1;
  const cursor = travel * last;
  const index = Math.min(last - 1, Math.floor(cursor));
  const blend = cursor - index;
  const from = points[index]!;
  const to = points[Math.min(last, index + 1)]!;
  const next = points[Math.min(last, index + 2)]!;
  const mix = (a: Point, b: Point): Point => [
    a[0] + (b[0] - a[0]) * blend,
    a[1] + (b[1] - a[1]) * blend,
    a[2] + (b[2] - a[2]) * blend,
  ];
  return [mix(from, to), mix(to, next)];
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
  // STAGE-MOTION:1 — during travel follow live endpoints. The curve is
  // rebuilt from those endpoints so a semantic midpoint cannot pop early.
  if (
    inFlight ||
    !connection.routePoints ||
    connection.routePoints.length < 3
  ) {
    return smoothSpatialArc(source, target, connection.id);
  }
  const mid = connection.routePoints[Math.floor(connection.routePoints.length / 2)]!;
  return smoothSpatialArc(source, target, connection.id, [mid[0], mid[1], mid[2]]);
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

function usePrefersReducedStageMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return reduced;
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
  const reducedMotion = usePrefersReducedStageMotion();
  const accent = useExecutiveThemeCssColor("--nx-relationship", "#93c5fd");
  const muted = useExecutiveThemeCssColor("--nx-relationship-muted", "#64748b");
  const arrow = useExecutiveThemeCssColor("--nx-accent-ink", "#dbeafe");
  const [points, setPoints] = useState<Point[]>(() =>
    resolveLiveRoute(connection, fallbackSource, fallbackTarget),
  );
  const [flowTravel, setFlowTravel] = useState(0);
  const flowClock = useRef(0);

  useFrame((_, delta) => {
    const next = resolveLiveRoute(connection, fallbackSource, fallbackTarget);
    setPoints((previous) => (pointsChanged(previous, next) ? next : previous));
    if (!connection.emphasized || reducedMotion) return;
    flowClock.current += delta;
    if (flowClock.current < 0.16) return;
    flowClock.current = 0;
    setFlowTravel((travel) => (travel + 0.02) % 1);
  });

  const visualRole =
    connection.visualRole ??
    (connection.emphasized
      ? "anchor-incident"
      : connection.opacity <= 0.15
        ? "background"
        : "context");
  const directionCue = connection.directionCue ?? "none";
  const active = connection.emphasized || visualRole === "anchor-incident";
  const lineWidth = active ? 1.05 : 0.72;
  const color = active ? accent : visualRole === "background" ? muted : accent;
  const flowPoints =
    active && !reducedMotion && points.length > 2
      ? flowHighlight(points, flowTravel)
      : null;

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
        linePattern: connection.linePattern ?? "solid",
        presentationKind: connection.presentationKind ?? null,
        routeKind: connection.routeKind ?? "straight",
        stageHitKind: "connection",
      }}
    >
      <Line
        points={points}
        color={color}
        transparent
        opacity={Math.min(0.22, connection.opacity * 0.28)}
        lineWidth={2.4}
        depthWrite={false}
        raycast={() => null}
      />
      <Line
        points={points}
        color={color}
        transparent
        opacity={connection.opacity}
        lineWidth={lineWidth}
        dashed={connection.linePattern === "dashed"}
        dashSize={0.12}
        gapSize={0.1}
        dashScale={1}
        depthWrite={false}
        onClick={(event) => {
          event.stopPropagation();
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
      />
      {flowPoints ? (
        <Line
          points={flowPoints}
          color={arrow}
          transparent
          opacity={Math.min(0.55, connection.opacity)}
          lineWidth={1.15}
          depthWrite={false}
          raycast={() => null}
        />
      ) : null}
      {directionCue === "source-to-target" ? (
        <Line
          points={directionMarkerPoints(
            points[Math.max(0, points.length - 2)]!,
            points[points.length - 1]!,
          )}
          color={color}
          transparent
          opacity={Math.min(
            connection.opacity + (connection.emphasized ? 0.08 : 0.02),
            0.55,
          )}
          lineWidth={0.7}
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
