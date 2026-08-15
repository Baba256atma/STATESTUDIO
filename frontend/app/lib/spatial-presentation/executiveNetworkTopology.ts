/**
 * SP:4.3 — Executive Network Topology Composition.
 *
 * Native 2.5D executive network on the SP:4.2 presentation plane.
 *
 *   Disclosure → Network Topology → ExecutivePresentationPosition
 *     → SP:4.2 Plane Mapper → R3F
 *
 * No world-space XYZ layout, camera projection, force simulation, or
 * Z-escape collision resolution.
 */

import {
  createExecutivePresentationPlane,
  createExecutivePresentationPosition,
  createExecutivePresentationTerritory,
  executivePresentationTerritoriesIntersect,
  resolveExecutivePresentationFootprint,
  resolveExecutivePresentationSafeAreas,
  type ExecutivePresentationFootprint,
  type ExecutivePresentationPlane,
  type ExecutivePresentationPosition,
  type ExecutivePresentationSafeArea,
  type ExecutivePresentationTerritory,
} from "./executivePresentationPlaneFoundation.ts";

export const executiveNetworkTopologyIdentity =
  "SP:4.3/ExecutiveNetworkTopologyComposition" as const;
export const executiveNetworkTopologyVersion = "4.3.0" as const;
export const executiveNetworkTopologyNamespace =
  "nexora.spatial-presentation.executive-network-topology" as const;
export const executiveNetworkTopologyPhase =
  "ExecutiveNetworkTopologyComposition" as const;
export const executiveNetworkTopologyArchitecturalRole =
  "PresentationOnlyExecutiveNetworkTopologyComposition" as const;
export const executiveNetworkTopologyReadiness =
  "AwaitingHumanVisualSignOff" as const;

export type ExecutiveNetworkTopologyIdentity = {
  readonly id: typeof executiveNetworkTopologyIdentity;
  readonly version: typeof executiveNetworkTopologyVersion;
  readonly namespace: typeof executiveNetworkTopologyNamespace;
  readonly phase: typeof executiveNetworkTopologyPhase;
  readonly architecturalRole: typeof executiveNetworkTopologyArchitecturalRole;
};

const TOPOLOGY_IDENTITY: ExecutiveNetworkTopologyIdentity = Object.freeze({
  id: executiveNetworkTopologyIdentity,
  version: executiveNetworkTopologyVersion,
  namespace: executiveNetworkTopologyNamespace,
  phase: executiveNetworkTopologyPhase,
  architecturalRole: executiveNetworkTopologyArchitecturalRole,
});

export function getExecutiveNetworkTopologyIdentity(): ExecutiveNetworkTopologyIdentity {
  return TOPOLOGY_IDENTITY;
}

export const EXECUTIVE_NETWORK_TOPOLOGY_BOUNDARY = Object.freeze({
  architecturalRole: executiveNetworkTopologyArchitecturalRole,
  ownsBusinessTruth: false as const,
  ownsDataReality: false as const,
  ownsDisclosureMembership: false as const,
  inventsRelationships: false as const,
  ownsScale: false as const,
  ownsLighting: false as const,
  ownsFocusChoreography: false as const,
  ownsFinalSeparation: false as const,
  usesWorldSpaceXyzLayout: false as const,
  usesCameraProjection: false as const,
  usesProjectedHubSectors: false as const,
  usesForceSimulation: false as const,
  usesPhysicsEngine: false as const,
  usesPerFrameSolver: false as const,
  usesRandomLayout: false as const,
  usesZEscapeForCollision: false as const,
  overviewDefaultsToFlow: false as const,
  overviewDefaultsToExecutiveNetwork: true as const,
  presentationOnly: true as const,
});

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 1e6) / 1e6;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export const EXECUTIVE_NETWORK_PRESENTATION_GAP = Object.freeze({
  minimumSurfaceGap: 0.22,
  anchorClearZonePadding: 0.38,
  labelBreathingRoom: 0.06,
});

export const EXECUTIVE_NETWORK_UTILIZATION = Object.freeze({
  minWidthFraction: 0.5,
  maxWidthFraction: 0.7,
  minHeightFraction: 0.4,
  maxHeightFraction: 0.65,
});

export const EXECUTIVE_NETWORK_LAYOUT_SAFE_AREA_IDS = Object.freeze([
  "workspace-dial",
  "timeline",
  "presentation-depth",
] as const);

export const EXECUTIVE_NETWORK_SLOT_IDS = Object.freeze([
  "right",
  "upper-right",
  "upper",
  "upper-left",
  "left",
  "lower-left",
  "lower",
  "lower-right",
] as const);

/**
 * Layout exclusions for network placement.
 * Uses Dial / Timeline / Presentation Depth only — not the large object-list
 * or advisor strips (those are HUD overlays, not presentation-plane dead zones).
 */
export function resolveExecutiveNetworkLayoutSafeAreas(
  plane: ExecutivePresentationPlane = createExecutivePresentationPlane(),
): readonly ExecutivePresentationSafeArea[] {
  const all = resolveExecutivePresentationSafeAreas(plane);
  const allowed = new Set<string>(EXECUTIVE_NETWORK_LAYOUT_SAFE_AREA_IDS);
  return Object.freeze(
    all
      .filter((area) => allowed.has(area.id))
      .map((area) => {
        if (area.id === "presentation-depth") {
          return Object.freeze({
            ...area,
            minX: -0.85,
            maxX: 0.85,
            minY: plane.maxY - 0.22,
            maxY: plane.maxY,
          });
        }
        if (area.id === "timeline") {
          return Object.freeze({
            ...area,
            minY: plane.minY,
            maxY: plane.minY + 0.18,
          });
        }
        return area;
      }),
  );
}

export type ExecutiveNetworkSlotId = (typeof EXECUTIVE_NETWORK_SLOT_IDS)[number];

export const EXECUTIVE_NETWORK_SLOT_ANGLES = Object.freeze({
  right: 0,
  "upper-right": Math.PI / 4,
  upper: Math.PI / 2,
  "upper-left": (Math.PI * 3) / 4,
  left: Math.PI,
  "lower-left": (-Math.PI * 3) / 4,
  lower: -Math.PI / 2,
  "lower-right": -Math.PI / 4,
} as const satisfies Record<ExecutiveNetworkSlotId, number>);

export const EXECUTIVE_NETWORK_SLOT_RADIUS_BIAS = Object.freeze({
  right: 1.08,
  "upper-right": 0.94,
  upper: 0.86,
  "upper-left": 0.94,
  left: 1.08,
  "lower-left": 0.9,
  lower: 0.82,
  "lower-right": 0.9,
} as const satisfies Record<ExecutiveNetworkSlotId, number>);

export type ExecutiveNetworkLayer = 0 | 1 | 2 | 3;

export type ExecutiveNetworkNode = {
  readonly objectId: string;
  readonly label?: string;
  readonly objectKind?: string;
  readonly compositionScale: number;
  readonly attention?: string;
  readonly status?: string;
  readonly disclosureState?: string;
};

export type ExecutiveNetworkEdge = {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
};

export type ExecutiveNetworkNodePlacement = {
  readonly objectId: string;
  readonly presentationPosition: ExecutivePresentationPosition;
  readonly layer: ExecutiveNetworkLayer;
  readonly slotId: ExecutiveNetworkSlotId | "center" | "overflow";
  readonly topologyImportance: number;
  readonly territory: ExecutivePresentationTerritory;
  readonly footprint: ExecutivePresentationFootprint;
};

export type ExecutiveNetworkTopologyDiagnostics = {
  readonly topologyKind: "executive-network";
  readonly anchorObjectId: string | null;
  readonly centerObjectId: string;
  readonly occupiedRegions: readonly ExecutiveNetworkSlotId[];
  readonly rejectedSafeAreaCandidates: number;
  readonly rejectedTerritoryCandidates: number;
  readonly territoryPressurePairs: readonly string[];
  readonly edgeCrossingScore: number;
  readonly collinear: boolean;
  readonly distributionRegionCount: number;
  readonly overflowNodeIds: readonly string[];
};

export type ExecutiveNetworkTopology = {
  readonly identity: typeof executiveNetworkTopologyIdentity;
  readonly version: typeof executiveNetworkTopologyVersion;
  readonly topologyKind: "executive-network";
  readonly nodes: readonly ExecutiveNetworkNodePlacement[];
  readonly edges: readonly ExecutiveNetworkEdge[];
  readonly positions: Readonly<Record<string, ExecutivePresentationPosition>>;
  readonly byId: ReadonlyMap<string, ExecutiveNetworkNodePlacement>;
  readonly diagnostics: ExecutiveNetworkTopologyDiagnostics;
};

export type ResolveExecutiveNetworkTopologyInput = {
  readonly nodes: readonly ExecutiveNetworkNode[];
  readonly edges: readonly ExecutiveNetworkEdge[];
  readonly plane?: ExecutivePresentationPlane;
  readonly safeAreas?: readonly ExecutivePresentationSafeArea[];
  readonly anchorObjectId?: string | null;
  readonly mode?: "overview" | "focus";
};

export function resolveExecutiveNetworkPreferredSlotIndex(
  objectId: string,
): number {
  let hash = 0;
  for (let i = 0; i < objectId.length; i += 1) {
    hash = (hash * 33 + objectId.charCodeAt(i)) >>> 0;
  }
  return hash % EXECUTIVE_NETWORK_SLOT_IDS.length;
}

export function resolveExecutiveNetworkTopologyImportance(input: {
  readonly objectId: string;
  readonly degree: number;
  readonly attention?: string;
  readonly status?: string;
}): number {
  const attentionPart =
    input.attention === "critical"
      ? 4
      : input.attention === "important"
        ? 3
        : input.attention === "elevated"
          ? 2
          : 1;
  const statusPart =
    input.status === "risk"
      ? 3
      : input.status === "watch" || input.status === "unresolved"
        ? 2
        : 1;
  let hash = 0;
  for (let i = 0; i < input.objectId.length; i += 1) {
    hash = (hash * 31 + input.objectId.charCodeAt(i)) >>> 0;
  }
  return stabilize(input.degree * 10 + attentionPart * 3 + statusPart * 2 + (hash % 997) / 10000);
}

function buildAdjacency(
  nodeIds: readonly string[],
  edges: readonly ExecutiveNetworkEdge[],
): Map<string, Set<string>> {
  const idSet = new Set(nodeIds);
  const adj = new Map<string, Set<string>>();
  for (const id of nodeIds) adj.set(id, new Set());
  for (const edge of edges) {
    if (!idSet.has(edge.sourceId) || !idSet.has(edge.targetId)) continue;
    if (edge.sourceId === edge.targetId) continue;
    adj.get(edge.sourceId)!.add(edge.targetId);
    adj.get(edge.targetId)!.add(edge.sourceId);
  }
  return adj;
}

function bfsLayers(
  centerId: string,
  adj: Map<string, Set<string>>,
  nodeIds: readonly string[],
): Map<string, ExecutiveNetworkLayer> {
  const layers = new Map<string, ExecutiveNetworkLayer>();
  const queue: string[] = [centerId];
  layers.set(centerId, 0);
  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentLayer = layers.get(current) ?? 0;
    for (const next of adj.get(current) ?? []) {
      if (layers.has(next)) continue;
      const nextLayer = Math.min(3, currentLayer + 1) as ExecutiveNetworkLayer;
      layers.set(next, nextLayer);
      queue.push(next);
    }
  }
  for (const id of nodeIds) {
    if (!layers.has(id)) layers.set(id, 3);
  }
  return layers;
}

function selectNetworkCenter(
  nodes: readonly ExecutiveNetworkNode[],
  importance: Map<string, number>,
  anchorObjectId: string | null,
): string {
  if (anchorObjectId != null && nodes.some((n) => n.objectId === anchorObjectId)) {
    return anchorObjectId;
  }
  const ranked = [...nodes].sort((a, b) => {
    const diff =
      (importance.get(b.objectId) ?? 0) - (importance.get(a.objectId) ?? 0);
    if (diff !== 0) return diff;
    return a.objectId.localeCompare(b.objectId);
  });
  return ranked[0]!.objectId;
}

function layerRadius(
  layer: ExecutiveNetworkLayer,
  nodeCount: number,
  plane: ExecutivePresentationPlane,
): number {
  const usableW = plane.width * EXECUTIVE_NETWORK_UTILIZATION.maxWidthFraction;
  const usableH = plane.height * EXECUTIVE_NETWORK_UTILIZATION.maxHeightFraction;
  const base = Math.min(usableW, usableH * 1.35) * 0.5;
  const densityBoost = nodeCount <= 3 ? 0.72 : nodeCount <= 6 ? 0.88 : 1;
  switch (layer) {
    case 0:
      return 0;
    case 1:
      return stabilize(base * 0.55 * densityBoost);
    case 2:
      return stabilize(base * 0.82 * densityBoost);
    default:
      return stabilize(base * 1.05 * densityBoost);
  }
}

function slotPosition(
  slotId: ExecutiveNetworkSlotId,
  radius: number,
): ExecutivePresentationPosition {
  const angle = EXECUTIVE_NETWORK_SLOT_ANGLES[slotId];
  const bias = EXECUTIVE_NETWORK_SLOT_RADIUS_BIAS[slotId];
  const r = radius * bias;
  return createExecutivePresentationPosition(
    Math.cos(angle) * r,
    Math.sin(angle) * r,
  );
}

function rectsOverlap(
  a: { minX: number; maxX: number; minY: number; maxY: number },
  b: { minX: number; maxX: number; minY: number; maxY: number },
): boolean {
  return !(
    a.maxX <= b.minX ||
    a.minX >= b.maxX ||
    a.maxY <= b.minY ||
    a.minY >= b.maxY
  );
}

function territoryRect(territory: ExecutivePresentationTerritory) {
  const halfW =
    territory.width / 2 +
    territory.padding +
    EXECUTIVE_NETWORK_PRESENTATION_GAP.minimumSurfaceGap / 2;
  const halfH =
    territory.height / 2 +
    territory.padding +
    EXECUTIVE_NETWORK_PRESENTATION_GAP.minimumSurfaceGap / 2 +
    EXECUTIVE_NETWORK_PRESENTATION_GAP.labelBreathingRoom;
  return {
    minX: territory.center.x - halfW,
    maxX: territory.center.x + halfW,
    minY: territory.center.y - halfH,
    maxY: territory.center.y + halfH,
  };
}

function intersectsSafeArea(
  territory: ExecutivePresentationTerritory,
  safeAreas: readonly ExecutivePresentationSafeArea[],
): boolean {
  const rect = territoryRect(territory);
  for (const area of safeAreas) {
    if (!area.excludesLayout) continue;
    if (
      rectsOverlap(rect, {
        minX: area.minX,
        maxX: area.maxX,
        minY: area.minY,
        maxY: area.maxY,
      })
    ) {
      return true;
    }
  }
  return false;
}

function withinPlane(
  territory: ExecutivePresentationTerritory,
  plane: ExecutivePresentationPlane,
): boolean {
  const rect = territoryRect(territory);
  return (
    rect.minX >= plane.minX - 1e-6 &&
    rect.maxX <= plane.maxX + 1e-6 &&
    rect.minY >= plane.minY - 1e-6 &&
    rect.maxY <= plane.maxY + 1e-6
  );
}

function segmentsCross(
  a1: ExecutivePresentationPosition,
  a2: ExecutivePresentationPosition,
  b1: ExecutivePresentationPosition,
  b2: ExecutivePresentationPosition,
): boolean {
  const orient = (
    p: ExecutivePresentationPosition,
    q: ExecutivePresentationPosition,
    r: ExecutivePresentationPosition,
  ) => {
    const v = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (Math.abs(v) < 1e-9) return 0;
    return v > 0 ? 1 : 2;
  };
  const o1 = orient(a1, a2, b1);
  const o2 = orient(a1, a2, b2);
  const o3 = orient(b1, b2, a1);
  const o4 = orient(b1, b2, a2);
  if (o1 !== o2 && o3 !== o4) {
    if (
      (a1.x === b1.x && a1.y === b1.y) ||
      (a1.x === b2.x && a1.y === b2.y) ||
      (a2.x === b1.x && a2.y === b1.y) ||
      (a2.x === b2.x && a2.y === b2.y)
    ) {
      return false;
    }
    return true;
  }
  return false;
}

function countEdgeCrossings(
  candidateId: string,
  candidatePos: ExecutivePresentationPosition,
  placed: Map<string, ExecutivePresentationPosition>,
  edges: readonly ExecutiveNetworkEdge[],
): number {
  let crossings = 0;
  const withCandidate = new Map(placed);
  withCandidate.set(candidateId, candidatePos);
  const placedEdges = edges.filter(
    (edge) =>
      withCandidate.has(edge.sourceId) && withCandidate.has(edge.targetId),
  );
  for (let i = 0; i < placedEdges.length; i += 1) {
    for (let j = i + 1; j < placedEdges.length; j += 1) {
      const e1 = placedEdges[i]!;
      const e2 = placedEdges[j]!;
      const ids = new Set([
        e1.sourceId,
        e1.targetId,
        e2.sourceId,
        e2.targetId,
      ]);
      if (ids.size < 4) continue;
      if (
        segmentsCross(
          withCandidate.get(e1.sourceId)!,
          withCandidate.get(e1.targetId)!,
          withCandidate.get(e2.sourceId)!,
          withCandidate.get(e2.targetId)!,
        )
      ) {
        crossings += 1;
      }
    }
  }
  return crossings;
}

export function isExecutiveNetworkCollinear(
  positions: readonly ExecutivePresentationPosition[],
  tolerance = 0.12,
): boolean {
  if (positions.length < 3) return false;
  let origin = positions[0]!;
  let dir: ExecutivePresentationPosition | null = null;
  for (let i = 1; i < positions.length; i += 1) {
    const dx = positions[i]!.x - origin.x;
    const dy = positions[i]!.y - origin.y;
    if (Math.hypot(dx, dy) > 1e-4) {
      const len = Math.hypot(dx, dy);
      dir = createExecutivePresentationPosition(dx / len, dy / len);
      break;
    }
  }
  if (dir == null) return true;
  let near = 0;
  for (const p of positions) {
    const vx = p.x - origin.x;
    const vy = p.y - origin.y;
    const cross = Math.abs(vx * dir.y - vy * dir.x);
    if (cross <= tolerance) near += 1;
  }
  return near / positions.length >= 0.7;
}

export function countExecutiveNetworkOccupiedRegions(
  positions: ReadonlyMap<string, ExecutivePresentationPosition>,
  center: ExecutivePresentationPosition = createExecutivePresentationPosition(
    0,
    0,
  ),
): number {
  const regions = new Set<string>();
  for (const pos of positions.values()) {
    const dx = pos.x - center.x;
    const dy = pos.y - center.y;
    if (Math.hypot(dx, dy) < 0.15) {
      regions.add("center");
      continue;
    }
    const angle = Math.atan2(dy, dx);
    let best: ExecutiveNetworkSlotId = "right";
    let bestDelta = Infinity;
    for (const slot of EXECUTIVE_NETWORK_SLOT_IDS) {
      let delta = Math.abs(angle - EXECUTIVE_NETWORK_SLOT_ANGLES[slot]);
      if (delta > Math.PI) delta = 2 * Math.PI - delta;
      if (delta < bestDelta) {
        bestDelta = delta;
        best = slot;
      }
    }
    regions.add(best);
  }
  return regions.size;
}

function buildTerritory(input: {
  readonly objectId: string;
  readonly center: ExecutivePresentationPosition;
  readonly footprint: ExecutivePresentationFootprint;
  readonly padding?: number;
}): ExecutivePresentationTerritory {
  return createExecutivePresentationTerritory({
    objectId: input.objectId,
    center: input.center,
    footprint: input.footprint,
    padding:
      input.padding ??
      EXECUTIVE_NETWORK_PRESENTATION_GAP.minimumSurfaceGap / 2,
    region: "business-network",
    depthRole: "standard",
  });
}

function candidateSlotOrder(
  objectId: string,
  occupied: ReadonlySet<ExecutiveNetworkSlotId>,
): ExecutiveNetworkSlotId[] {
  const preferred = resolveExecutiveNetworkPreferredSlotIndex(objectId);
  const ordered: ExecutiveNetworkSlotId[] = [];
  for (let i = 0; i < EXECUTIVE_NETWORK_SLOT_IDS.length; i += 1) {
    ordered.push(
      EXECUTIVE_NETWORK_SLOT_IDS[
        (preferred + i) % EXECUTIVE_NETWORK_SLOT_IDS.length
      ]!,
    );
  }
  return [
    ...ordered.filter((slot) => !occupied.has(slot)),
    ...ordered.filter((slot) => occupied.has(slot)),
  ];
}

function radiusVariants(base: number): number[] {
  return [
    base,
    base * 1.12,
    base * 1.24,
    base * 0.9,
    base * 1.36,
    base * 1.5,
    base * 1.68,
    base * 1.88,
  ].map(stabilize);
}

/** Extra angular offsets — restrained asymmetry beyond the 8 primary slots. */
function slotAngleOffsets(): readonly number[] {
  return Object.freeze([0, 0.22, -0.22, 0.4, -0.4]);
}

function angledSlotPosition(
  slotId: ExecutiveNetworkSlotId,
  radius: number,
  angleOffset: number,
): ExecutivePresentationPosition {
  const angle = EXECUTIVE_NETWORK_SLOT_ANGLES[slotId] + angleOffset;
  const bias = EXECUTIVE_NETWORK_SLOT_RADIUS_BIAS[slotId];
  const r = radius * bias * (angleOffset === 0 ? 1 : 1.04);
  return createExecutivePresentationPosition(
    Math.cos(angle) * r,
    Math.sin(angle) * r,
  );
}

/**
 * Resolve native 2.5D executive network topology on the presentation plane.
 */
export function resolveExecutiveNetworkTopology(
  input: ResolveExecutiveNetworkTopologyInput,
): ExecutiveNetworkTopology {
  const plane = input.plane ?? createExecutivePresentationPlane();
  const safeAreas =
    input.safeAreas ?? resolveExecutiveNetworkLayoutSafeAreas(plane);

  const nodes = Object.freeze(
    input.nodes.filter((node) => node.disclosureState !== "hidden"),
  );
  const nodeIds = nodes.map((node) => node.objectId);
  const edges = Object.freeze(
    input.edges.filter(
      (edge) =>
        nodeIds.includes(edge.sourceId) && nodeIds.includes(edge.targetId),
    ),
  );

  if (nodes.length === 0) {
    return Object.freeze({
      identity: executiveNetworkTopologyIdentity,
      version: executiveNetworkTopologyVersion,
      topologyKind: "executive-network" as const,
      nodes: Object.freeze([]),
      edges,
      positions: Object.freeze({}),
      byId: new Map(),
      diagnostics: Object.freeze({
        topologyKind: "executive-network" as const,
        anchorObjectId: input.anchorObjectId ?? null,
        centerObjectId: "",
        occupiedRegions: Object.freeze([]),
        rejectedSafeAreaCandidates: 0,
        rejectedTerritoryCandidates: 0,
        territoryPressurePairs: Object.freeze([]),
        edgeCrossingScore: 0,
        collinear: false,
        distributionRegionCount: 0,
        overflowNodeIds: Object.freeze([]),
      }),
    });
  }

  const adj = buildAdjacency(nodeIds, edges);
  const importance = new Map<string, number>();
  for (const node of nodes) {
    importance.set(
      node.objectId,
      resolveExecutiveNetworkTopologyImportance({
        objectId: node.objectId,
        degree: adj.get(node.objectId)?.size ?? 0,
        attention: node.attention,
        status: node.status,
      }),
    );
  }

  const anchorObjectId =
    input.anchorObjectId != null &&
    nodes.some((node) => node.objectId === input.anchorObjectId)
      ? input.anchorObjectId
      : null;

  const centerObjectId = selectNetworkCenter(nodes, importance, anchorObjectId);
  const layers = bfsLayers(centerObjectId, adj, nodeIds);

  const footprints = new Map<string, ExecutivePresentationFootprint>();
  for (const node of nodes) {
    footprints.set(
      node.objectId,
      resolveExecutivePresentationFootprint({
        objectKind: node.objectKind ?? "object",
        compositionScale: node.compositionScale,
      }),
    );
  }

  const placements = new Map<string, ExecutiveNetworkNodePlacement>();
  const placedPositions = new Map<string, ExecutivePresentationPosition>();
  const occupiedSlots = new Set<ExecutiveNetworkSlotId>();
  let rejectedSafeAreaCandidates = 0;
  let rejectedTerritoryCandidates = 0;
  const overflowNodeIds: string[] = [];
  let edgeCrossingScore = 0;

  const centerFootprint = footprints.get(centerObjectId)!;
  const centerPos = createExecutivePresentationPosition(0, 0);
  const centerTerritory = buildTerritory({
    objectId: centerObjectId,
    center: centerPos,
    footprint: centerFootprint,
    padding:
      EXECUTIVE_NETWORK_PRESENTATION_GAP.minimumSurfaceGap / 2 +
      (anchorObjectId != null
        ? EXECUTIVE_NETWORK_PRESENTATION_GAP.anchorClearZonePadding
        : 0.12),
  });
  placements.set(
    centerObjectId,
    Object.freeze({
      objectId: centerObjectId,
      presentationPosition: centerPos,
      layer: 0,
      slotId: "center",
      topologyImportance: importance.get(centerObjectId) ?? 0,
      territory: centerTerritory,
      footprint: centerFootprint,
    }),
  );
  placedPositions.set(centerObjectId, centerPos);

  const remaining = [...nodes]
    .filter((node) => node.objectId !== centerObjectId)
    .sort((a, b) => {
      const layerDiff =
        (layers.get(a.objectId) ?? 3) - (layers.get(b.objectId) ?? 3);
      if (layerDiff !== 0) return layerDiff;
      const impDiff =
        (importance.get(b.objectId) ?? 0) - (importance.get(a.objectId) ?? 0);
      if (impDiff !== 0) return impDiff;
      return a.objectId.localeCompare(b.objectId);
    });

  for (const node of remaining) {
    const layer = (layers.get(node.objectId) ?? 3) as ExecutiveNetworkLayer;
    const footprint = footprints.get(node.objectId)!;
    const baseRadius = layerRadius(layer, nodes.length, plane);
    const slotOrder = candidateSlotOrder(node.objectId, occupiedSlots);

    let chosen: {
      readonly position: ExecutivePresentationPosition;
      readonly slotId: ExecutiveNetworkSlotId;
      readonly territory: ExecutivePresentationTerritory;
      readonly crossings: number;
    } | null = null;

    for (const radius of radiusVariants(baseRadius)) {
      for (const slotId of slotOrder) {
        for (const angleOffset of slotAngleOffsets()) {
          const position = angledSlotPosition(slotId, radius, angleOffset);
          const territory = buildTerritory({
            objectId: node.objectId,
            center: position,
            footprint,
          });

          if (!withinPlane(territory, plane)) continue;
          if (intersectsSafeArea(territory, safeAreas)) {
            rejectedSafeAreaCandidates += 1;
            continue;
          }

          let collision = false;
          for (const prior of placements.values()) {
            if (
              rectsOverlap(
                territoryRect(territory),
                territoryRect(prior.territory),
              ) ||
              executivePresentationTerritoriesIntersect(
                territory,
                prior.territory,
              )
            ) {
              collision = true;
              break;
            }
          }
          if (collision) {
            rejectedTerritoryCandidates += 1;
            continue;
          }

          const crossings = countEdgeCrossings(
            node.objectId,
            position,
            placedPositions,
            edges,
          );
          if (
            chosen == null ||
            crossings < chosen.crossings ||
            (crossings === chosen.crossings &&
              occupiedSlots.has(chosen.slotId) &&
              !occupiedSlots.has(slotId))
          ) {
            chosen = { position, slotId, territory, crossings };
            if (crossings === 0 && !occupiedSlots.has(slotId) && angleOffset === 0) {
              break;
            }
          }
        }
        if (chosen != null && chosen.crossings === 0 && !occupiedSlots.has(chosen.slotId)) {
          break;
        }
      }
      if (chosen != null && chosen.crossings === 0) break;
    }

    if (chosen == null) {
      overflowNodeIds.push(node.objectId);
      // Deterministic overflow spiral — never clamp multiple nodes into one pile.
      let placedOverflow = false;
      for (let ring = 0; ring < 8 && !placedOverflow; ring += 1) {
        for (let step = 0; step < 8 && !placedOverflow; step += 1) {
          const angle =
            (Math.PI * 2 * step) / 8 +
            resolveExecutiveNetworkPreferredSlotIndex(node.objectId) * 0.17 +
            ring * 0.11;
          const radius =
            layerRadius(3, nodes.length, plane) * (1.45 + ring * 0.18);
          const position = createExecutivePresentationPosition(
            clamp(Math.cos(angle) * radius, plane.minX + 0.4, plane.maxX - 0.4),
            clamp(Math.sin(angle) * radius, plane.minY + 0.4, plane.maxY - 0.4),
          );
          const territory = buildTerritory({
            objectId: node.objectId,
            center: position,
            footprint,
          });
          if (!withinPlane(territory, plane)) continue;
          if (intersectsSafeArea(territory, safeAreas)) continue;
          let collision = false;
          for (const prior of placements.values()) {
            if (
              rectsOverlap(
                territoryRect(territory),
                territoryRect(prior.territory),
              )
            ) {
              collision = true;
              break;
            }
          }
          if (collision) continue;
          placements.set(
            node.objectId,
            Object.freeze({
              objectId: node.objectId,
              presentationPosition: position,
              layer,
              slotId: "overflow",
              topologyImportance: importance.get(node.objectId) ?? 0,
              territory,
              footprint,
            }),
          );
          placedPositions.set(node.objectId, position);
          placedOverflow = true;
        }
      }
      if (!placedOverflow) {
        const fallbackSlot =
          slotOrder.find((slot) => !occupiedSlots.has(slot)) ?? slotOrder[0]!;
        const position = angledSlotPosition(
          fallbackSlot,
          layerRadius(3, nodes.length, plane) * 1.9,
          0,
        );
        const clamped = createExecutivePresentationPosition(
          clamp(position.x, plane.minX + 0.35, plane.maxX - 0.35),
          clamp(position.y, plane.minY + 0.35, plane.maxY - 0.35),
        );
        const territory = buildTerritory({
          objectId: node.objectId,
          center: clamped,
          footprint,
        });
        placements.set(
          node.objectId,
          Object.freeze({
            objectId: node.objectId,
            presentationPosition: clamped,
            layer,
            slotId: "overflow",
            topologyImportance: importance.get(node.objectId) ?? 0,
            territory,
            footprint,
          }),
        );
        placedPositions.set(node.objectId, clamped);
        occupiedSlots.add(fallbackSlot);
      }
      continue;
    }

    edgeCrossingScore += chosen.crossings;
    occupiedSlots.add(chosen.slotId);
    placements.set(
      node.objectId,
      Object.freeze({
        objectId: node.objectId,
        presentationPosition: chosen.position,
        layer,
        slotId: chosen.slotId,
        topologyImportance: importance.get(node.objectId) ?? 0,
        territory: chosen.territory,
        footprint,
      }),
    );
    placedPositions.set(node.objectId, chosen.position);
  }

  edgeCrossingScore = 0;
  const finalEdges = edges.filter(
    (edge) =>
      placedPositions.has(edge.sourceId) && placedPositions.has(edge.targetId),
  );
  for (let i = 0; i < finalEdges.length; i += 1) {
    for (let j = i + 1; j < finalEdges.length; j += 1) {
      const e1 = finalEdges[i]!;
      const e2 = finalEdges[j]!;
      const ids = new Set([
        e1.sourceId,
        e1.targetId,
        e2.sourceId,
        e2.targetId,
      ]);
      if (ids.size < 4) continue;
      if (
        segmentsCross(
          placedPositions.get(e1.sourceId)!,
          placedPositions.get(e1.targetId)!,
          placedPositions.get(e2.sourceId)!,
          placedPositions.get(e2.targetId)!,
        )
      ) {
        edgeCrossingScore += 1;
      }
    }
  }

  const orderedPlacements = Object.freeze(
    [...placements.values()].sort((a, b) =>
      a.objectId.localeCompare(b.objectId),
    ),
  );

  const positionsRecord: Record<string, ExecutivePresentationPosition> = {};
  for (const placement of orderedPlacements) {
    positionsRecord[placement.objectId] = placement.presentationPosition;
  }

  const occupiedRegions = Object.freeze(
    EXECUTIVE_NETWORK_SLOT_IDS.filter((slot) =>
      orderedPlacements.some((placement) => placement.slotId === slot),
    ),
  );

  const pressure: string[] = [];
  for (let i = 0; i < orderedPlacements.length; i += 1) {
    for (let j = i + 1; j < orderedPlacements.length; j += 1) {
      const left = orderedPlacements[i]!;
      const right = orderedPlacements[j]!;
      if (
        rectsOverlap(
          territoryRect(left.territory),
          territoryRect(right.territory),
        )
      ) {
        pressure.push(`${left.objectId}↔${right.objectId}`);
      }
    }
  }

  const collinear = isExecutiveNetworkCollinear(
    orderedPlacements.map((placement) => placement.presentationPosition),
  );
  const distributionRegionCount =
    countExecutiveNetworkOccupiedRegions(placedPositions);

  if (anchorObjectId != null) {
    const anchor = placements.get(anchorObjectId);
    if (
      anchor == null ||
      anchor.presentationPosition.x !== 0 ||
      anchor.presentationPosition.y !== 0
    ) {
      throw new Error(`SP:4.3 anchor invariant violated for ${anchorObjectId}`);
    }
  }

  return Object.freeze({
    identity: executiveNetworkTopologyIdentity,
    version: executiveNetworkTopologyVersion,
    topologyKind: "executive-network" as const,
    anchorObjectId,
    nodes: orderedPlacements,
    edges,
    positions: Object.freeze(positionsRecord),
    byId: placements,
    diagnostics: Object.freeze({
      topologyKind: "executive-network" as const,
      anchorObjectId,
      centerObjectId,
      occupiedRegions,
      rejectedSafeAreaCandidates,
      rejectedTerritoryCandidates,
      territoryPressurePairs: Object.freeze(pressure),
      edgeCrossingScore,
      collinear,
      distributionRegionCount,
      overflowNodeIds: Object.freeze(overflowNodeIds),
    }),
  });
}

export function verifyExecutiveNetworkTopology(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly overviewNotFlow: boolean;
  readonly anchorCenter: boolean;
  readonly noForce: boolean;
  readonly deterministic: boolean;
}> {
  const identity = getExecutiveNetworkTopologyIdentity();
  const identityValid =
    identity.id === "SP:4.3/ExecutiveNetworkTopologyComposition" &&
    identity.version === "4.3.0";
  const overviewNotFlow =
    EXECUTIVE_NETWORK_TOPOLOGY_BOUNDARY.overviewDefaultsToFlow === false &&
    EXECUTIVE_NETWORK_TOPOLOGY_BOUNDARY.overviewDefaultsToExecutiveNetwork ===
      true;
  const sampleNodes: ExecutiveNetworkNode[] = [
    { objectId: "obj-budget", compositionScale: 0.55, attention: "normal", status: "stable" },
    { objectId: "obj-capacity", compositionScale: 0.5, attention: "important", status: "watch" },
    { objectId: "obj-delivery", compositionScale: 0.5, attention: "important", status: "watch" },
  ];
  const sampleEdges: ExecutiveNetworkEdge[] = [
    { id: "e1", sourceId: "obj-budget", targetId: "obj-capacity" },
    { id: "e2", sourceId: "obj-capacity", targetId: "obj-delivery" },
  ];
  const a = resolveExecutiveNetworkTopology({
    nodes: sampleNodes,
    edges: sampleEdges,
    anchorObjectId: "obj-budget",
  });
  const b = resolveExecutiveNetworkTopology({
    nodes: sampleNodes,
    edges: sampleEdges,
    anchorObjectId: "obj-budget",
  });
  const anchorCenter =
    a.positions["obj-budget"]?.x === 0 && a.positions["obj-budget"]?.y === 0;
  const deterministic =
    JSON.stringify(a.positions) === JSON.stringify(b.positions);
  const noForce =
    EXECUTIVE_NETWORK_TOPOLOGY_BOUNDARY.usesForceSimulation === false &&
    EXECUTIVE_NETWORK_TOPOLOGY_BOUNDARY.usesPhysicsEngine === false;
  const ok =
    options?.forceFailure === true
      ? false
      : identityValid && overviewNotFlow && anchorCenter && noForce && deterministic;
  return Object.freeze({
    ok,
    identityValid,
    overviewNotFlow,
    anchorCenter,
    noForce,
    deterministic,
  });
}
