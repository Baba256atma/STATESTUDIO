/**
 * SP:4.1 — Topology-Guided Executive Stage Composition.
 *
 * Topology becomes the structural layout authority for Overview/Focus Stage
 * placement. Three.js remains the 3D rendering/presentation layer.
 *
 * Dependency direction (required):
 *   Canonical Objects + Canonical Relationships + Focus presentation state
 *     → Topology Input
 *       → Topology Selection (flow | hub | auto)
 *         → Topology Layout (reuses existing flow/hub generators)
 *           → Presentation Calibration (topology-preserving)
 *             → ExecutiveTopologyStagePosition
 *               → Stage targetPosition / overviewPosition
 *
 * Does not invent relationships, alter Data Reality, or replace SP:3 lighting.
 */

import {
  generateFlowTopology,
} from "../scene/topology/flowTopologyGenerator.ts";
import {
  HUB_RADIUS,
  generateHubTopology,
} from "../scene/topology/hubTopologyGenerator.ts";
import type {
  ResolvedTopologyType,
  TopologyNode,
  TopologyType,
} from "../scene/topology/topologyTypes.ts";
import { isLegacyWorkflowWorkspaceIdentifier } from "../workspace/workspaceRegistryContract.ts";
import {
  EXECUTIVE_FOCUS_ANCHOR_TARGET,
} from "./executiveCameraFoundation.ts";
import {
  EXECUTIVE_STAGE_2D_DEPTH,
  normalizeExecutiveStage2DPosition,
  remapLegacyHubXzToExecutiveStage2D,
} from "./executiveStage2DTopologyPlane.ts";
import {
  EXECUTIVE_LIGHTING_EMPHASIS_PROFILES,
  resolveExecutiveLightingEmphasis,
} from "./executiveLightingHierarchy.ts";
import {
  EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
  applyExecutiveSpatialUiOverlaySafeCorrection,
  clampExecutiveSpatialVector,
  type ExecutiveSpatialCompositionBounds,
  type ExecutiveSpatialVector,
} from "./executiveSpatialComposition.ts";
import { resolveExecutiveFocusRelatedObjectIds } from "./executiveFocusChoreography.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveTopologyGuidedStageCompositionIdentity =
  "SP:4.1/TopologyGuidedExecutiveStageComposition" as const;

export const executiveTopologyGuidedStageCompositionVersion =
  "4.1.0" as const;

export const executiveTopologyGuidedStageCompositionNamespace =
  "nexora.spatial-presentation.topology-guided-stage" as const;

export const executiveTopologyGuidedStageCompositionPhase =
  "TopologyGuidedExecutiveStageComposition" as const;

export const executiveTopologyGuidedStageCompositionArchitecturalRole =
  "PresentationOnlyTopologyGuidedExecutiveStageComposition" as const;

export const executiveTopologyGuidedStageCompositionReadiness =
  "AwaitingHumanVisualSignOff" as const;

export type ExecutiveTopologyGuidedStageCompositionIdentity = {
  readonly id: typeof executiveTopologyGuidedStageCompositionIdentity;
  readonly version: typeof executiveTopologyGuidedStageCompositionVersion;
  readonly namespace: typeof executiveTopologyGuidedStageCompositionNamespace;
  readonly phase: typeof executiveTopologyGuidedStageCompositionPhase;
  readonly architecturalRole: typeof executiveTopologyGuidedStageCompositionArchitecturalRole;
};

const COMPOSITION_IDENTITY: ExecutiveTopologyGuidedStageCompositionIdentity =
  Object.freeze({
    id: executiveTopologyGuidedStageCompositionIdentity,
    version: executiveTopologyGuidedStageCompositionVersion,
    namespace: executiveTopologyGuidedStageCompositionNamespace,
    phase: executiveTopologyGuidedStageCompositionPhase,
    architecturalRole:
      executiveTopologyGuidedStageCompositionArchitecturalRole,
  });

export function getExecutiveTopologyGuidedStageCompositionIdentity(): ExecutiveTopologyGuidedStageCompositionIdentity {
  return COMPOSITION_IDENTITY;
}

export const EXECUTIVE_TOPOLOGY_GUIDED_STAGE_COMPOSITION_BOUNDARY =
  Object.freeze({
    architecturalRole:
      executiveTopologyGuidedStageCompositionArchitecturalRole,
    ownsBusinessTruth: false as const,
    ownsDataReality: false as const,
    ownsRelationships: false as const,
    inventsRelationships: false as const,
    ownsFocusSemantics: false as const,
    ownsAttentionSemantics: false as const,
    ownsSelectionSemantics: false as const,
    ownsWorkspaceSemantics: false as const,
    ownsCameraContracts: false as const,
    replacesSp31Lighting: false as const,
    replacesSp32LightingHierarchy: false as const,
    introducesForceDirectedLayout: false as const,
    introducesPhysicsLayout: false as const,
    introducesFreeOrbitCamera: false as const,
    activatesRingClusterHybrid: false as const,
    introducesTopologyTransitionChoreography: false as const,
    presentationOnly: true as const,
  });

// ─── Contracts ──────────────────────────────────────────────────────────────

export type ExecutiveTopologyStageMode = "overview" | "focus";

export type ExecutiveTopologyRequestedType =
  | "auto"
  | ResolvedTopologyType
  | Extract<TopologyType, "ring" | "cluster" | "hybrid">;

export type ExecutiveTopologyStageDepthRole =
  | "primary"
  | "related"
  | "normal"
  | "background";

export type ExecutiveTopologyStageObjectInput = {
  readonly objectId: string;
  readonly label?: string;
  readonly attention?: string;
  readonly status?: string;
  readonly stateMarker?: string;
  /** Management kind. Company and Goal are layout eligibility signals. */
  readonly objectKind?: string;
  /** Manager workspace that owns this subject. Absent means ownership is unproven. */
  readonly managerWorkspaceId?: string | null;
  /** Explicit primary when more than one Company or Goal is eligible. */
  readonly authoritativePrimary?: boolean;
  /** Presentation authorization. False excludes the subject. */
  readonly presentationAuthorized?: boolean;
  /** Disclosure. False excludes the subject from the ring and the center. */
  readonly disclosed?: boolean;
};

export type ExecutiveTopologyStageRelationshipInput = {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
};

/**
 * Topology-resolved Stage world position — Three.js compatible.
 */
export type ExecutiveTopologyStagePosition = {
  readonly objectId: string;
  readonly position: ExecutiveSpatialVector;
  readonly tuple: readonly [number, number, number];
  readonly depthRole: ExecutiveTopologyStageDepthRole;
  readonly topologyNodeId: string;
};

export type ResolveExecutiveTopologyGuidedStageCompositionInput = {
  readonly objects: readonly ExecutiveTopologyStageObjectInput[];
  readonly relationships: readonly ExecutiveTopologyStageRelationshipInput[];
  readonly focusedObjectId?: string | null;
  readonly topologyType?: ExecutiveTopologyRequestedType;
  readonly bounds?: ExecutiveSpatialCompositionBounds;
  /** Registry workspace id. Workflow names are not workspace ids. */
  readonly activeManagerWorkspaceId?: string | null;
};

export type ExecutiveTopologyGuidedStageCompositionResult = {
  readonly identity: typeof executiveTopologyGuidedStageCompositionIdentity;
  readonly version: typeof executiveTopologyGuidedStageCompositionVersion;
  readonly mode: ExecutiveTopologyStageMode;
  readonly topology: ResolvedTopologyType;
  readonly autoSelected: boolean;
  readonly selectionReason: string;
  readonly focusedObjectId: string | null;
  /** Layout-only Overview center. Never an interaction focus. */
  readonly overviewAnchorId: string | null;
  readonly hubAnchorObjectId: string | null;
  readonly flowOrder: readonly string[];
  readonly relatedObjectIds: readonly string[];
  readonly positions: readonly ExecutiveTopologyStagePosition[];
  readonly byId: ReadonlyMap<string, ExecutiveTopologyStagePosition>;
  /** Canonical relationships only — never topology-invented edges. */
  readonly canonicalConnections: readonly ExecutiveTopologyStageRelationshipInput[];
  readonly generatedAt: 0;
};

/** Symmetric volume for one Overview ring. The legacy Stage band clamps Y to 0.58. */
const EXECUTIVE_OVERVIEW_RING_BOUNDS: ExecutiveSpatialCompositionBounds = Object.freeze({
  minX: -2.6,
  maxX: 2.6,
  minY: -2.6,
  maxY: 2.6,
  minZ: -1.85,
  maxZ: 1.4,
});

export const EXECUTIVE_TOPOLOGY_STAGE_LAYOUT = Object.freeze({
  /** Stage-fit hub radius (XY plane) — scaled from topology HUB_RADIUS. */
  hubRadius: 1.72,
  /** Horizontal flow usable span inside Stage bounds. */
  flowSpanX: 5.05,
  flowBaseY: 0.18,
  hubAnchor: EXECUTIVE_FOCUS_ANCHOR_TARGET,
  /**
   * STAGE-2D:2 — depth roles remain metadata only.
   * Physical Z bias is always EXECUTIVE_STAGE_2D_DEPTH (0).
   */
  depthPrimaryZ: EXECUTIVE_STAGE_2D_DEPTH,
  depthRelatedZ: EXECUTIVE_STAGE_2D_DEPTH,
  depthNormalZ: EXECUTIVE_STAGE_2D_DEPTH,
  depthBackgroundZ: EXECUTIVE_STAGE_2D_DEPTH,
  backgroundRadialScale: 1.38,
  minimumNodeSeparation: 0.72,
  maxCalibrationIterations: 4,
  maxCalibrationNudge: 0.22,
});

export const EXECUTIVE_TOPOLOGY_GUIDED_COMPLEXITY = Object.freeze({
  usesForceSimulation: false as const,
  usesPhysicsEngine: false as const,
  perFrameRecalculation: false as const,
  inventsEdges: false as const,
  activatesRingClusterHybrid: false as const,
  maximumLayoutPasses: 4 as const,
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const rounded = Math.round(value * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function stabilizeVector(vector: ExecutiveSpatialVector): ExecutiveSpatialVector {
  return Object.freeze({
    x: stabilize(vector.x),
    y: stabilize(vector.y),
    z: stabilize(vector.z),
  });
}

function toTuple(
  position: ExecutiveSpatialVector,
): readonly [number, number, number] {
  return Object.freeze([position.x, position.y, position.z] as const);
}

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function isCriticalAttention(attention: string | undefined): boolean {
  const value = (attention ?? "normal").toLowerCase();
  return value === "critical" || value === "important";
}

/**
 * Deterministic Kahn topological order over canonical directed edges.
 * Disconnected / cyclic remainder appended by stable id sort.
 */
export function resolveExecutiveTopologyFlowOrder(input: {
  readonly objectIds: readonly string[];
  readonly relationships: readonly ExecutiveTopologyStageRelationshipInput[];
}): readonly string[] {
  const idSet = new Set(input.objectIds);
  const ids = [...input.objectIds].sort(compareIds);
  const inbound = new Map<string, number>();
  const outbound = new Map<string, string[]>();
  for (const id of ids) {
    inbound.set(id, 0);
    outbound.set(id, []);
  }

  for (const relationship of input.relationships) {
    if (!idSet.has(relationship.sourceId) || !idSet.has(relationship.targetId)) {
      continue;
    }
    if (relationship.sourceId === relationship.targetId) continue;
    outbound.get(relationship.sourceId)!.push(relationship.targetId);
    inbound.set(
      relationship.targetId,
      (inbound.get(relationship.targetId) ?? 0) + 1,
    );
  }

  for (const [id, targets] of outbound) {
    outbound.set(id, [...targets].sort(compareIds));
  }

  const queue = ids.filter((id) => (inbound.get(id) ?? 0) === 0).sort(compareIds);
  const ordered: string[] = [];
  const remaining = new Set(ids);

  while (queue.length > 0) {
    const next = queue.shift()!;
    if (!remaining.has(next)) continue;
    remaining.delete(next);
    ordered.push(next);
    for (const target of outbound.get(next) ?? []) {
      if (!remaining.has(target)) continue;
      const nextInbound = (inbound.get(target) ?? 0) - 1;
      inbound.set(target, nextInbound);
      if (nextInbound <= 0) {
        queue.push(target);
        queue.sort(compareIds);
      }
    }
  }

  const leftover = [...remaining].sort(compareIds);
  return Object.freeze([...ordered, ...leftover]);
}

function isOverviewCompanyKind(kind: string | undefined): boolean {
  const value = (kind ?? "").toLowerCase().trim();
  return (
    value === "company" ||
    value === "executive" ||
    value === "executive-context" ||
    value === "business-context" ||
    value === "enterprise" ||
    value === "pack"
  );
}

function isOverviewGoalKind(kind: string | undefined): boolean {
  return (kind ?? "").toLowerCase().trim().includes("goal");
}

function overviewSubjectEligible(
  object: ExecutiveTopologyStageObjectInput,
  workspaceId: string,
): boolean {
  if (object.managerWorkspaceId !== workspaceId) return false;
  if (object.presentationAuthorized === false) return false;
  if (object.disclosed === false) return false;
  return true;
}

function pickAuthoritativeOverviewSubject(
  subjects: readonly ExecutiveTopologyStageObjectInput[],
): string | null {
  if (subjects.length === 0) return null;
  if (subjects.length === 1) return subjects[0]!.objectId;
  const primaries = subjects.filter((subject) => subject.authoritativePrimary === true);
  if (primaries.length === 1) return primaries[0]!.objectId;
  return null;
}

/**
 * The authorized Overview ring already owns XY.
 * Later grammar and network passes must not replace those positions.
 */
export function executiveOverviewRingOwnsPlacement(input: {
  readonly mode?: string | null;
  readonly overviewAnchorId?: string | null;
  readonly focusedObjectId?: string | null;
  readonly focusedSubjectId?: string | null;
}): boolean {
  return (
    input.mode === "overview" &&
    input.overviewAnchorId != null &&
    input.focusedObjectId == null &&
    input.focusedSubjectId == null
  );
}

/**
 * Layout-only Overview center.
 * Company wins over Goal. Ambiguous sets preserve Flow.
 * Missing workspace ownership or a workflow id preserves Flow.
 */
export function resolveExecutiveOverviewAnchor(input: {
  readonly objects: readonly ExecutiveTopologyStageObjectInput[];
  readonly activeManagerWorkspaceId?: string | null;
}): string | null {
  const workspaceId = input.activeManagerWorkspaceId ?? null;
  if (workspaceId == null || isLegacyWorkflowWorkspaceIdentifier(workspaceId)) {
    return null;
  }
  const eligible = input.objects.filter((object) =>
    overviewSubjectEligible(object, workspaceId),
  );
  const companies = eligible.filter((object) => isOverviewCompanyKind(object.objectKind));
  if (companies.length > 0) {
    return pickAuthoritativeOverviewSubject(companies);
  }
  const goals = eligible.filter((object) => isOverviewGoalKind(object.objectKind));
  return pickAuthoritativeOverviewSubject(goals);
}

function overviewRingIds(input: {
  readonly anchorId: string;
  readonly objects: readonly ExecutiveTopologyStageObjectInput[];
  readonly relationships: readonly ExecutiveTopologyStageRelationshipInput[];
  readonly workspaceId: string;
}): readonly string[] {
  const allowed = new Set(
    input.objects
      .filter(
        (object) =>
          object.objectId !== input.anchorId &&
          overviewSubjectEligible(object, input.workspaceId),
      )
      .map((object) => object.objectId),
  );
  const related = new Set<string>();
  for (const relationship of input.relationships) {
    if (relationship.sourceId === input.anchorId && allowed.has(relationship.targetId)) {
      related.add(relationship.targetId);
    }
    if (relationship.targetId === input.anchorId && allowed.has(relationship.sourceId)) {
      related.add(relationship.sourceId);
    }
  }
  return Object.freeze([...related].sort(compareIds));
}

export function selectExecutiveTopologyType(input: {
  readonly focusedObjectId?: string | null;
  readonly objectIds: readonly string[];
  readonly requested?: ExecutiveTopologyRequestedType;
  readonly overviewAnchorId?: string | null;
}): Readonly<{
  readonly topology: ResolvedTopologyType;
  readonly autoSelected: boolean;
  readonly selectionReason: string;
}> {
  const requested = input.requested ?? "auto";
  const focusId = input.focusedObjectId ?? null;
  const focusValid =
    focusId != null && input.objectIds.includes(focusId);

  if (requested === "flow" || requested === "hub") {
    return Object.freeze({
      topology: requested,
      autoSelected: false,
      selectionReason: `explicit:${requested}`,
    });
  }

  // ring/cluster/hybrid preserved in contract but not activated in SP:4.1.
  if (
    requested === "ring" ||
    requested === "cluster" ||
    requested === "hybrid"
  ) {
    const fallback: ResolvedTopologyType = focusValid ? "hub" : "flow";
    return Object.freeze({
      topology: fallback,
      autoSelected: true,
      selectionReason: `${requested}-deferred→${fallback}`,
    });
  }

  if (focusValid) {
    return Object.freeze({
      topology: "hub",
      autoSelected: true,
      selectionReason: "focus-anchor→hub",
    });
  }

  const overviewAnchorId = input.overviewAnchorId ?? null;
  if (
    overviewAnchorId != null &&
    input.objectIds.includes(overviewAnchorId)
  ) {
    return Object.freeze({
      topology: "hub",
      autoSelected: true,
      selectionReason: "overview-anchor→hub",
    });
  }

  return Object.freeze({
    topology: "flow",
    autoSelected: true,
    selectionReason: "overview→flow",
  });
}

function depthRoleFor(input: {
  readonly objectId: string;
  readonly focusedObjectId: string | null;
  readonly relatedIds: ReadonlySet<string>;
  readonly attention?: string;
}): ExecutiveTopologyStageDepthRole {
  if (input.focusedObjectId != null && input.objectId === input.focusedObjectId) {
    return "primary";
  }
  if (input.relatedIds.has(input.objectId)) {
    return "related";
  }
  if (isCriticalAttention(input.attention)) {
    return "normal";
  }
  if (input.focusedObjectId != null) {
    return "background";
  }
  return "normal";
}

function depthBiasFor(role: ExecutiveTopologyStageDepthRole): number {
  // STAGE-2D:2 — depth roles are semantic metadata; never displace Z.
  void role;
  return EXECUTIVE_STAGE_2D_DEPTH;
}

function scaleFlowPositions(
  topologyNodes: readonly TopologyNode[],
  bounds: ExecutiveSpatialCompositionBounds,
): Map<string, ExecutiveSpatialVector> {
  const layout = EXECUTIVE_TOPOLOGY_STAGE_LAYOUT;
  const count = topologyNodes.length;
  const map = new Map<string, ExecutiveSpatialVector>();
  if (count === 0) return map;

  const usable = Math.min(
    layout.flowSpanX,
    bounds.maxX - bounds.minX - 0.35,
  );
  const startX = stabilize(-(usable / 2));
  const step = count === 1 ? 0 : stabilize(usable / Math.max(1, count - 1));

  topologyNodes.forEach((node, index) => {
    map.set(
      node.id,
      stabilizeVector(
        normalizeExecutiveStage2DPosition({
          x: startX + index * step,
          y: layout.flowBaseY + ((index % 2 === 0 ? 1 : -1) * 0.05),
          z: EXECUTIVE_STAGE_2D_DEPTH,
        }),
      ),
    );
  });

  return map;
}

function scaleHubPositions(
  topologyNodes: readonly TopologyNode[],
  relatedIds: ReadonlySet<string>,
  focusedObjectId: string,
  bounds: ExecutiveSpatialCompositionBounds,
): Map<string, ExecutiveSpatialVector> {
  const layout = EXECUTIVE_TOPOLOGY_STAGE_LAYOUT;
  const map = new Map<string, ExecutiveSpatialVector>();
  const scale = layout.hubRadius / HUB_RADIUS;
  const anchor = layout.hubAnchor;

  for (const node of topologyNodes) {
    const raw = node.position ?? { x: 0, y: 0, z: 0 };
    const isAnchor = node.id === focusedObjectId;
    if (isAnchor) {
      map.set(
        node.id,
        stabilizeVector(
          normalizeExecutiveStage2DPosition({
            x: anchor.x,
            y: anchor.y,
            z: EXECUTIVE_STAGE_2D_DEPTH,
          }),
        ),
      );
      continue;
    }

    // Type-C hub emits an XZ ring; remap onto Stage XY before scaling.
    const plane = remapLegacyHubXzToExecutiveStage2D(raw);
    let x = plane.x * scale + anchor.x;
    let y = plane.y * scale + anchor.y;

    if (!relatedIds.has(node.id)) {
      // Background / non-1-hop: push outward in X/Y only.
      x = anchor.x + (x - anchor.x) * layout.backgroundRadialScale;
      y = anchor.y + (y - anchor.y) * layout.backgroundRadialScale;
    }

    map.set(
      node.id,
      clampExecutiveSpatialVector(
        stabilizeVector(
          normalizeExecutiveStage2DPosition({
            x,
            y,
            z: EXECUTIVE_STAGE_2D_DEPTH,
          }),
        ),
        bounds,
      ),
    );
  }

  return map;
}

/**
 * Secondary topology-preserving calibration — not primary layout authority.
 * Preserves hub anchor / flow order; applies UI safe correction + mild separation.
 */
export function calibrateExecutiveTopologyStagePositions(input: {
  readonly positions: ReadonlyMap<string, ExecutiveSpatialVector>;
  readonly orderedObjectIds: readonly string[];
  readonly hubAnchorObjectId?: string | null;
  readonly bounds?: ExecutiveSpatialCompositionBounds;
}): Map<string, ExecutiveSpatialVector> {
  const bounds = input.bounds ?? EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS;
  const layout = EXECUTIVE_TOPOLOGY_STAGE_LAYOUT;
  const next = new Map<string, ExecutiveSpatialVector>();

  for (const objectId of input.orderedObjectIds) {
    const current = input.positions.get(objectId);
    if (current == null) continue;
    if (input.hubAnchorObjectId != null && objectId === input.hubAnchorObjectId) {
      next.set(objectId, stabilizeVector(current));
      continue;
    }
    next.set(
      objectId,
      applyExecutiveSpatialUiOverlaySafeCorrection(current, bounds),
    );
  }

  for (let pass = 0; pass < layout.maxCalibrationIterations; pass += 1) {
    let moved = false;
    for (let i = 0; i < input.orderedObjectIds.length; i += 1) {
      const leftId = input.orderedObjectIds[i]!;
      const left = next.get(leftId);
      if (left == null) continue;
      for (let j = i + 1; j < input.orderedObjectIds.length; j += 1) {
        const rightId = input.orderedObjectIds[j]!;
        const right = next.get(rightId);
        if (right == null) continue;
        const dx = right.x - left.x;
        const dy = right.y - left.y;
        const distance = Math.hypot(dx, dy);
        if (distance >= layout.minimumNodeSeparation || distance < 1e-6) {
          continue;
        }
        const push =
          Math.min(
            layout.maxCalibrationNudge,
            (layout.minimumNodeSeparation - distance) * 0.5,
          );
        const nx = dx / distance;
        const ny = dy / distance;
        const leftIsAnchor =
          input.hubAnchorObjectId != null && leftId === input.hubAnchorObjectId;
        const rightIsAnchor =
          input.hubAnchorObjectId != null && rightId === input.hubAnchorObjectId;

        if (!leftIsAnchor) {
          next.set(
            leftId,
            applyExecutiveSpatialUiOverlaySafeCorrection(
              normalizeExecutiveStage2DPosition({
                x: left.x - nx * push,
                y: left.y - ny * push,
                z: EXECUTIVE_STAGE_2D_DEPTH,
              }),
              bounds,
            ),
          );
          moved = true;
        }
        if (!rightIsAnchor) {
          next.set(
            rightId,
            applyExecutiveSpatialUiOverlaySafeCorrection(
              normalizeExecutiveStage2DPosition({
                x: right.x + nx * push,
                y: right.y + ny * push,
                z: EXECUTIVE_STAGE_2D_DEPTH,
              }),
              bounds,
            ),
          );
          moved = true;
        }
      }
    }
    if (!moved) break;
  }

  return next;
}

function buildTopologyNodes(
  orderedIds: readonly string[],
  labelsById: ReadonlyMap<string, string>,
): TopologyNode[] {
  return orderedIds.map((objectId) =>
    Object.freeze({
      id: objectId,
      name: labelsById.get(objectId) ?? objectId,
    }),
  );
}

// ─── Resolver ───────────────────────────────────────────────────────────────

/**
 * Deterministic topology-guided Stage composition.
 * Topology invents no edges; Stage relationships remain canonical.
 */
export function resolveExecutiveTopologyGuidedStageComposition(
  input: ResolveExecutiveTopologyGuidedStageCompositionInput,
): ExecutiveTopologyGuidedStageCompositionResult {
  const bounds = input.bounds ?? EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS;
  let compositionBounds = bounds;
  const objectIds = Object.freeze(
    input.objects.map((object) => object.objectId),
  );
  const labelsById = new Map(
    input.objects.map((object) => [
      object.objectId,
      object.label ?? object.objectId,
    ]),
  );
  const attentionById = new Map(
    input.objects.map((object) => [object.objectId, object.attention]),
  );

  const focusedObjectId =
    input.focusedObjectId != null && objectIds.includes(input.focusedObjectId)
      ? input.focusedObjectId
      : null;
  const mode: ExecutiveTopologyStageMode =
    focusedObjectId == null ? "overview" : "focus";
  const overviewAnchorId =
    focusedObjectId == null
      ? resolveExecutiveOverviewAnchor({
          objects: input.objects,
          activeManagerWorkspaceId: input.activeManagerWorkspaceId,
        })
      : null;

  const selection = selectExecutiveTopologyType({
    focusedObjectId,
    objectIds,
    requested: input.topologyType ?? "auto",
    overviewAnchorId,
  });

  const overviewRing =
    overviewAnchorId != null && input.activeManagerWorkspaceId != null
      ? overviewRingIds({
          anchorId: overviewAnchorId,
          objects: input.objects,
          relationships: input.relationships,
          workspaceId: input.activeManagerWorkspaceId,
        })
      : Object.freeze([]);

  const relatedObjectIds =
    focusedObjectId != null
      ? resolveExecutiveFocusRelatedObjectIds({
          focusedObjectId,
          connections: input.relationships,
        })
      : overviewRing;
  const relatedSet = new Set(relatedObjectIds);

  const canonicalConnections = Object.freeze(
    input.relationships
      .filter(
        (relationship) =>
          objectIds.includes(relationship.sourceId) &&
          objectIds.includes(relationship.targetId),
      )
      .map((relationship) =>
        Object.freeze({
          id: relationship.id,
          sourceId: relationship.sourceId,
          targetId: relationship.targetId,
        }),
      ),
  );

  let flowOrder: readonly string[] = objectIds;
  let hubAnchorObjectId: string | null = null;
  let rawPositions = new Map<string, ExecutiveSpatialVector>();

  if (selection.topology === "flow") {
    flowOrder = resolveExecutiveTopologyFlowOrder({
      objectIds,
      relationships: canonicalConnections,
    });
    const nodes = buildTopologyNodes(flowOrder, labelsById);
    const layout = generateFlowTopology(nodes);
    rawPositions = scaleFlowPositions(layout.nodes, bounds);
  } else if (focusedObjectId == null && overviewAnchorId != null) {
    hubAnchorObjectId = overviewAnchorId;
    compositionBounds = EXECUTIVE_OVERVIEW_RING_BOUNDS;
    flowOrder = Object.freeze([overviewAnchorId, ...overviewRing]);
    const nodes = buildTopologyNodes(flowOrder, labelsById);
    const layout = generateHubTopology(nodes);
    rawPositions = scaleHubPositions(
      layout.nodes,
      relatedSet,
      overviewAnchorId,
      compositionBounds,
    );
  } else {
    hubAnchorObjectId = focusedObjectId;
    const relatedSorted = [...relatedObjectIds].sort(compareIds);
    const backgroundSorted = objectIds
      .filter(
        (objectId) =>
          objectId !== focusedObjectId && !relatedSet.has(objectId),
      )
      .sort(compareIds);
    // Focus first so existing hub generator treats it as anchor.
    flowOrder = Object.freeze([
      ...(focusedObjectId != null ? [focusedObjectId] : []),
      ...relatedSorted,
      ...backgroundSorted,
    ]);
    const nodes = buildTopologyNodes(flowOrder, labelsById);
    const layout = generateHubTopology(nodes);
    rawPositions = scaleHubPositions(
      layout.nodes,
      relatedSet,
      focusedObjectId ?? layout.nodes[0]?.id ?? "",
      bounds,
    );
  }

  // STAGE-2D:2 — depth roles stay as metadata; physical Z remains 0.
  const depthAdjusted = new Map<string, ExecutiveSpatialVector>();
  for (const objectId of flowOrder) {
    const base = rawPositions.get(objectId);
    if (base == null) continue;
    const role = depthRoleFor({
      objectId,
      focusedObjectId,
      relatedIds: relatedSet,
      attention: attentionById.get(objectId),
    });
    void role;
    depthAdjusted.set(
      objectId,
      clampExecutiveSpatialVector(
        stabilizeVector(
          normalizeExecutiveStage2DPosition({
            x: base.x,
            y: base.y,
            z: base.z + depthBiasFor(role),
          }),
        ),
        compositionBounds,
      ),
    );
  }

  const calibrated =
    overviewAnchorId != null
      ? depthAdjusted
      : calibrateExecutiveTopologyStagePositions({
          positions: depthAdjusted,
          orderedObjectIds: flowOrder,
          hubAnchorObjectId,
          bounds: compositionBounds,
        });
  if (overviewAnchorId != null) {
    const anchor = calibrated.get(overviewAnchorId);
    if (anchor != null && (anchor.x !== 0 || anchor.y !== 0)) {
      for (const [objectId, position] of calibrated) {
        calibrated.set(
          objectId,
          stabilizeVector(
            normalizeExecutiveStage2DPosition({
              x: position.x - anchor.x,
              y: position.y - anchor.y,
              z: EXECUTIVE_STAGE_2D_DEPTH,
            }),
          ),
        );
      }
    }
  }

  const positions = Object.freeze(
    flowOrder
      .map((objectId) => {
        const position = calibrated.get(objectId);
        if (position == null) return null;
        const role = depthRoleFor({
          objectId,
          focusedObjectId,
          relatedIds: relatedSet,
          attention: attentionById.get(objectId),
        });
        return Object.freeze({
          objectId,
          position,
          tuple: toTuple(position),
          depthRole: role,
          topologyNodeId: objectId,
        });
      })
      .filter((entry): entry is ExecutiveTopologyStagePosition => entry != null),
  );

  const byId = new Map(positions.map((entry) => [entry.objectId, entry]));

  return Object.freeze({
    identity: executiveTopologyGuidedStageCompositionIdentity,
    version: executiveTopologyGuidedStageCompositionVersion,
    mode,
    topology: selection.topology,
    autoSelected: selection.autoSelected,
    selectionReason: selection.selectionReason,
    focusedObjectId,
    overviewAnchorId,
    hubAnchorObjectId,
    flowOrder,
    relatedObjectIds,
    positions,
    byId,
    canonicalConnections,
    generatedAt: 0 as const,
  });
}

export function buildExecutiveTopologyStagePositionMap(
  result: ExecutiveTopologyGuidedStageCompositionResult,
): ReadonlyMap<string, readonly [number, number, number]> {
  return new Map(
    result.positions.map((entry) => [entry.objectId, entry.tuple]),
  );
}

export function verifyExecutiveTopologyGuidedStageComposition(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly boundaryValid: boolean;
  readonly deterministic: boolean;
  readonly noInventedEdges: boolean;
  readonly lightingUnaffected: boolean;
}> {
  const identity = getExecutiveTopologyGuidedStageCompositionIdentity();
  const identityValid =
    identity.id === "SP:4.1/TopologyGuidedExecutiveStageComposition" &&
    identity.version === "4.1.0" &&
    identity.namespace ===
      "nexora.spatial-presentation.topology-guided-stage" &&
    identity.architecturalRole ===
      "PresentationOnlyTopologyGuidedExecutiveStageComposition";

  const boundaryValid =
    EXECUTIVE_TOPOLOGY_GUIDED_STAGE_COMPOSITION_BOUNDARY.presentationOnly ===
      true &&
    EXECUTIVE_TOPOLOGY_GUIDED_STAGE_COMPOSITION_BOUNDARY.inventsRelationships ===
      false &&
    EXECUTIVE_TOPOLOGY_GUIDED_STAGE_COMPOSITION_BOUNDARY.ownsDataReality ===
      false &&
    EXECUTIVE_TOPOLOGY_GUIDED_STAGE_COMPOSITION_BOUNDARY.introducesForceDirectedLayout ===
      false;

  const sampleObjects = Object.freeze([
    Object.freeze({ objectId: "revenue", label: "Revenue", attention: "elevated" }),
    Object.freeze({ objectId: "capacity", label: "Capacity", attention: "critical" }),
    Object.freeze({ objectId: "delivery", label: "Delivery", attention: "important" }),
    Object.freeze({ objectId: "customer", label: "Customer", attention: "normal" }),
  ]);
  const sampleRels = Object.freeze([
    Object.freeze({
      id: "r1",
      sourceId: "capacity",
      targetId: "delivery",
    }),
    Object.freeze({
      id: "r2",
      sourceId: "delivery",
      targetId: "customer",
    }),
    Object.freeze({
      id: "r3",
      sourceId: "customer",
      targetId: "revenue",
    }),
  ]);

  const a = resolveExecutiveTopologyGuidedStageComposition({
    objects: sampleObjects,
    relationships: sampleRels,
    focusedObjectId: "revenue",
    topologyType: "auto",
  });
  const b = resolveExecutiveTopologyGuidedStageComposition({
    objects: sampleObjects,
    relationships: sampleRels,
    focusedObjectId: "revenue",
    topologyType: "auto",
  });
  const deterministic =
    JSON.stringify(a.positions) === JSON.stringify(b.positions) &&
    a.selectionReason === b.selectionReason;

  const noInventedEdges =
    a.canonicalConnections.length === sampleRels.length &&
    a.canonicalConnections.every((connection) =>
      sampleRels.some((rel) => rel.id === connection.id),
    );

  const lighting = resolveExecutiveLightingEmphasis({
    objectId: "revenue",
    focused: true,
  });
  const lightingUnaffected =
    lighting.level === "primary" &&
    lighting.strength === EXECUTIVE_LIGHTING_EMPHASIS_PROFILES.primary.strength &&
    EXECUTIVE_TOPOLOGY_GUIDED_STAGE_COMPOSITION_BOUNDARY.replacesSp32LightingHierarchy ===
      false;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    boundaryValid &&
    deterministic &&
    noInventedEdges &&
    lightingUnaffected;

  return Object.freeze({
    ok,
    identityValid,
    boundaryValid,
    deterministic,
    noInventedEdges,
    lightingUnaffected,
  });
}
