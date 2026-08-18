/**
 * STAGE-2D:3 — Click-to-Center Topology Recomposition.
 *
 * Navigation model:
 *   click object → object becomes spatial anchor → anchor at exact (0,0,0)
 *   → canonical 1-hop neighbors reorganize in X/Y → unrelated recede/hide
 *   → camera NEVER moves
 *
 * Relationship truth is mandatory — no inference from proximity/attention.
 */

import {
  EXECUTIVE_STAGE_VISUAL_BALANCE_BUDGET,
  placeExecutiveStagePeripheralSlot,
  selectExecutiveStagePeripheralObjectIds,
} from "./executiveStageVisualBalance.ts";
import {
  EXECUTIVE_STAGE_2D_CENTER,
  EXECUTIVE_STAGE_2D_DEPTH,
  normalizeExecutiveStage2DPosition,
} from "./executiveStage2DFixedCamera.ts";
import {
  resolveExecutiveFocusRelatedObjectIds,
} from "./executiveFocusChoreography.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStage2DTopologyRecompositionIdentity =
  "STAGE-2D:3/ExecutiveStage2DTopologyRecomposition" as const;

export const executiveStage2DTopologyRecompositionVersion = "2.3.0" as const;

export const executiveStage2DTopologyRecompositionNamespace =
  "nexora.spatial-presentation.executive-stage-2d-topology-recomposition" as const;

export const executiveStage2DTopologyRecompositionPhase =
  "ExecutiveStage2DClickToCenterTopologyRecomposition" as const;

export const executiveStage2DTopologyRecompositionArchitecturalRole =
  "PresentationOnlyClickToCenterTopologyRecomposition" as const;

export type ExecutiveStage2DTopologyRecompositionIdentity = {
  readonly id: typeof executiveStage2DTopologyRecompositionIdentity;
  readonly version: typeof executiveStage2DTopologyRecompositionVersion;
  readonly namespace: typeof executiveStage2DTopologyRecompositionNamespace;
  readonly phase: typeof executiveStage2DTopologyRecompositionPhase;
  readonly architecturalRole: typeof executiveStage2DTopologyRecompositionArchitecturalRole;
};

const IDENTITY: ExecutiveStage2DTopologyRecompositionIdentity = Object.freeze({
  id: executiveStage2DTopologyRecompositionIdentity,
  version: executiveStage2DTopologyRecompositionVersion,
  namespace: executiveStage2DTopologyRecompositionNamespace,
  phase: executiveStage2DTopologyRecompositionPhase,
  architecturalRole: executiveStage2DTopologyRecompositionArchitecturalRole,
});

export function getExecutiveStage2DTopologyRecompositionIdentity(): ExecutiveStage2DTopologyRecompositionIdentity {
  return IDENTITY;
}

/**
 * Spatial anchor authority for Stage-2D click navigation.
 *
 * Direct pointer interaction:
 *   clicked selected object → becomes the sole physical topology anchor.
 * Focus/attention may remain semantic; only one physical anchor exists.
 */
export const EXECUTIVE_STAGE_2D_ANCHOR_AUTHORITY = Object.freeze({
  statement:
    "Clicked selected object is the sole physical Stage topology anchor.",
  physicalAnchorSource: "selected-or-focused-object" as const,
  anchorOwnsExactCenter: true as const,
  competingSpatialAuthoritiesForbidden: true as const,
  cameraMayNotCompensate: true as const,
});

/**
 * UX:2 — Stage Interaction law (presentation contract only).
 * Does not introduce a second Stage authority; click/focus/anchor remain
 * owned by existing interaction + STAGE-2D recomposition.
 */
export const EXECUTIVE_STAGE_UX2_INTERACTION_LAW = Object.freeze({
  statement: "CLICK OBJECT → CENTER → RECOMPOSE RELATED CONTEXT",
  camera: "fixed" as const,
  topologyZ: 0 as const,
  anchorTarget: Object.freeze({ x: 0, y: 0, z: 0 }),
  focusPrecedence: Object.freeze([
    "direct-user-click",
    "navigation-restore",
    "automatic-attention",
    "recommendation",
    "fallback",
  ]),
  spatialGrammar: Object.freeze([
    "center",
    "related",
    "watch",
    "queue",
  ]),
  queueIsTopology: false as const,
});

export const EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDARY = Object.freeze({
  architecturalRole: executiveStage2DTopologyRecompositionArchitecturalRole,
  inventsRelationships: false as const,
  usesProximityInference: false as const,
  usesAttentionAsRelated: false as const,
  neighborhoodDepth: 1 as const,
  movesCamera: false as const,
  usesZForSeparation: false as const,
  anchorExactCenter: true as const,
  collisionMayMoveAnchor: false as const,
});

// ─── Layout contracts ───────────────────────────────────────────────────────

/**
 * Usable Stage XY bounds for front-facing fixed camera (STAGE-2D:1).
 * Wider than legacy elevated-camera Y band so radial neighborhoods fit.
 */
export const EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS = Object.freeze({
  minX: -3.2,
  maxX: 3.2,
  minY: -2.4,
  maxY: 2.4,
});

export const EXECUTIVE_STAGE_2D_RECOMPOSITION_LAYOUT = Object.freeze({
  relatedRadius: 1.72,
  secondaryRadius: 2.55,
  backgroundMinRadius: 2.95,
  maxRelatedVisible: 6,
  maxSecondaryVisible: 4,
  minimumSeparation: 0.92,
  maxRelaxationIterations: 6,
  maxRelaxationNudge: 0.28,
});

/** Deterministic related slots on the XY plane (unit directions × radius). */
export const EXECUTIVE_STAGE_2D_RELATED_SLOT_DIRECTIONS: readonly Readonly<{
  readonly x: number;
  readonly y: number;
}>[] = Object.freeze([
  Object.freeze({ x: 1, y: 0 }),
  Object.freeze({ x: 0, y: 1 }),
  Object.freeze({ x: -1, y: 0 }),
  Object.freeze({ x: 0.707106, y: -0.55 }),
  Object.freeze({ x: -0.707106, y: -0.55 }),
  Object.freeze({ x: 0.707106, y: 0.707106 }),
  Object.freeze({ x: -0.707106, y: 0.707106 }),
  Object.freeze({ x: 0, y: -0.85 }),
]);

export type ExecutiveStage2DNeighborhoodClass =
  | "anchor"
  | "related"
  | "secondary"
  | "peripheral"
  | "background"
  | "hidden";

export type ExecutiveStage2DRecompositionObjectInput = {
  readonly objectId: string;
  readonly label?: string;
  readonly attention?: string;
  readonly status?: string;
  readonly recommended?: boolean;
  readonly disclosureState?: string;
  readonly basePosition?: {
    readonly x: number;
    readonly y: number;
    readonly z?: number;
  };
};

export type ExecutiveStage2DRecompositionRelationshipInput = {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
};

export type ExecutiveStage2DRecompositionContextLinkInput = {
  readonly id: string;
  readonly objectId: string;
  readonly contextId: string;
};

export type ResolveExecutiveStage2DTopologyRecompositionInput = {
  readonly anchorObjectId: string | null;
  readonly objects: readonly ExecutiveStage2DRecompositionObjectInput[];
  readonly relationships: readonly ExecutiveStage2DRecompositionRelationshipInput[];
  /** Optional canonical context links (objectId ↔ contextId). */
  readonly contextLinks?: readonly ExecutiveStage2DRecompositionContextLinkInput[];
  /** Explicit secondary ids (e.g. already-derived Stage context nodes). */
  readonly secondaryCandidateIds?: readonly string[];
  readonly maxRelated?: number;
  readonly maxSecondary?: number;
};

export type ExecutiveStage2DResolvedPosition = Readonly<{
  readonly x: number;
  readonly y: number;
  readonly z: 0;
}>;

export type ExecutiveStage2DTopologyRecomposition = {
  readonly identity: typeof executiveStage2DTopologyRecompositionIdentity;
  readonly version: typeof executiveStage2DTopologyRecompositionVersion;
  readonly mode: "overview" | "anchored";
  readonly anchorObjectId: string | null;
  readonly anchorPosition: ExecutiveStage2DResolvedPosition;
  readonly relatedObjectIds: readonly string[];
  readonly secondaryObjectIds: readonly string[];
  readonly backgroundObjectIds: readonly string[];
  readonly peripheralObjectIds?: readonly string[];
  readonly hiddenObjectIds: readonly string[];
  readonly classifications: Readonly<
    Record<string, ExecutiveStage2DNeighborhoodClass>
  >;
  readonly positions: Readonly<
    Record<string, ExecutiveStage2DResolvedPosition>
  >;
  readonly recompositionReason: string;
  readonly neighborhoodDepth: 1;
};

export const EXECUTIVE_STAGE_2D_RECOMPOSITION_OBSERVABILITY = Object.freeze({
  anchoredMode: "anchored" as const,
  overviewMode: "overview" as const,
  neighborhoodDepth: "1" as const,
  contract: "stage-2d-3" as const,
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function stabilize(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const rounded = Math.round(value * 1e6) / 1e6;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function clampToBounds(
  x: number,
  y: number,
): ExecutiveStage2DResolvedPosition {
  const bounds = EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDS;
  return normalizeExecutiveStage2DPosition({
    x: Math.min(bounds.maxX, Math.max(bounds.minX, x)),
    y: Math.min(bounds.maxY, Math.max(bounds.minY, y)),
    z: EXECUTIVE_STAGE_2D_DEPTH,
  }) as ExecutiveStage2DResolvedPosition;
}

function isCriticalAttention(attention: string | undefined): boolean {
  const value = (attention ?? "normal").toLowerCase();
  return value === "critical" || value === "important";
}

function placeRelatedSlot(
  index: number,
  total: number,
): ExecutiveStage2DResolvedPosition {
  const layout = EXECUTIVE_STAGE_2D_RECOMPOSITION_LAYOUT;
  const directions = EXECUTIVE_STAGE_2D_RELATED_SLOT_DIRECTIONS;
  const direction = directions[index % directions.length]!;
  // Mild radius step when overflowing slot count — still deterministic.
  const ring = Math.floor(index / directions.length);
  const radius = layout.relatedRadius * (1 + ring * 0.22);
  void total;
  return clampToBounds(direction.x * radius, direction.y * radius);
}

function placeSecondarySlot(
  index: number,
): ExecutiveStage2DResolvedPosition {
  const layout = EXECUTIVE_STAGE_2D_RECOMPOSITION_LAYOUT;
  // Offset secondary angles from related cardinals for readability.
  const angle = (Math.PI / 4) + (index * (Math.PI * 2)) / 8;
  return clampToBounds(
    Math.cos(angle) * layout.secondaryRadius,
    Math.sin(angle) * layout.secondaryRadius,
  );
}

function placeBackground(
  objectId: string,
  index: number,
  base?: { readonly x: number; readonly y: number },
): ExecutiveStage2DResolvedPosition {
  const layout = EXECUTIVE_STAGE_2D_RECOMPOSITION_LAYOUT;
  let hash = 0;
  for (let i = 0; i < objectId.length; i += 1) {
    hash = (hash * 31 + objectId.charCodeAt(i)) >>> 0;
  }
  const angle =
    ((hash % 360) / 360) * Math.PI * 2 + index * 0.37;
  let x = base?.x ?? 0;
  let y = base?.y ?? 0;
  const radial = Math.hypot(x, y);
  if (radial < layout.backgroundMinRadius) {
    x = Math.cos(angle) * layout.backgroundMinRadius;
    y = Math.sin(angle) * layout.backgroundMinRadius;
  } else {
    const scale = layout.backgroundMinRadius / radial;
    // Push farther out if already outside related ring.
    x *= Math.max(1.15, scale);
    y *= Math.max(1.15, scale);
  }
  return clampToBounds(x, y);
}

/**
 * Deterministic XY relaxation. Anchor is immovable. Never uses Z.
 */
export function relaxExecutiveStage2DPositions(input: {
  readonly positions: Readonly<Record<string, ExecutiveStage2DResolvedPosition>>;
  readonly orderedIds: readonly string[];
  readonly anchorObjectId: string;
  readonly priority: Readonly<Record<string, number>>;
}): Readonly<Record<string, ExecutiveStage2DResolvedPosition>> {
  const layout = EXECUTIVE_STAGE_2D_RECOMPOSITION_LAYOUT;
  const next: Record<string, ExecutiveStage2DResolvedPosition> = {
    ...input.positions,
  };
  // Force anchor exact center every pass.
  next[input.anchorObjectId] = normalizeExecutiveStage2DPosition({
    x: 0,
    y: 0,
    z: 0,
  }) as ExecutiveStage2DResolvedPosition;

  for (let pass = 0; pass < layout.maxRelaxationIterations; pass += 1) {
    let moved = false;
    for (let i = 0; i < input.orderedIds.length; i += 1) {
      const leftId = input.orderedIds[i]!;
      const left = next[leftId];
      if (left == null) continue;
      for (let j = i + 1; j < input.orderedIds.length; j += 1) {
        const rightId = input.orderedIds[j]!;
        const right = next[rightId];
        if (right == null) continue;
        const dx = right.x - left.x;
        const dy = right.y - left.y;
        const distance = Math.hypot(dx, dy);
        if (distance >= layout.minimumSeparation || distance < 1e-6) {
          continue;
        }
        const push = Math.min(
          layout.maxRelaxationNudge,
          (layout.minimumSeparation - distance) * 0.5,
        );
        const nx = dx / distance;
        const ny = dy / distance;
        const leftPriority = input.priority[leftId] ?? 0;
        const rightPriority = input.priority[rightId] ?? 0;
        const leftIsAnchor = leftId === input.anchorObjectId;
        const rightIsAnchor = rightId === input.anchorObjectId;

        if (!leftIsAnchor && leftPriority <= rightPriority) {
          next[leftId] = clampToBounds(left.x - nx * push, left.y - ny * push);
          moved = true;
        }
        if (!rightIsAnchor && rightPriority <= leftPriority) {
          next[rightId] = clampToBounds(
            right.x + nx * push,
            right.y + ny * push,
          );
          moved = true;
        }
      }
    }
    // Re-assert immovable anchor after every pass.
    next[input.anchorObjectId] = normalizeExecutiveStage2DPosition({
      x: 0,
      y: 0,
      z: 0,
    }) as ExecutiveStage2DResolvedPosition;
    if (!moved) break;
  }

  return Object.freeze({ ...next });
}

// ─── Resolver ───────────────────────────────────────────────────────────────

/**
 * Resolve click-to-center topology recomposition.
 * Overview (`anchorObjectId = null`) returns mode overview with empty layout.
 */
export function resolveExecutiveStage2DTopologyRecomposition(
  input: ResolveExecutiveStage2DTopologyRecompositionInput,
): ExecutiveStage2DTopologyRecomposition {
  const anchorObjectId = input.anchorObjectId;

  if (anchorObjectId == null) {
    return Object.freeze({
      identity: executiveStage2DTopologyRecompositionIdentity,
      version: executiveStage2DTopologyRecompositionVersion,
      mode: "overview" as const,
      anchorObjectId: null,
      anchorPosition: normalizeExecutiveStage2DPosition(
        EXECUTIVE_STAGE_2D_CENTER,
      ) as ExecutiveStage2DResolvedPosition,
      relatedObjectIds: Object.freeze([]),
      secondaryObjectIds: Object.freeze([]),
      backgroundObjectIds: Object.freeze([]),
      peripheralObjectIds: Object.freeze([]),
      hiddenObjectIds: Object.freeze([]),
      classifications: Object.freeze({}),
      positions: Object.freeze({}),
      recompositionReason: "overview-no-anchor",
      neighborhoodDepth: 1 as const,
    });
  }

  const objectIds = new Set(input.objects.map((entry) => entry.objectId));
  if (!objectIds.has(anchorObjectId)) {
    return Object.freeze({
      identity: executiveStage2DTopologyRecompositionIdentity,
      version: executiveStage2DTopologyRecompositionVersion,
      mode: "overview" as const,
      anchorObjectId: null,
      anchorPosition: normalizeExecutiveStage2DPosition(
        EXECUTIVE_STAGE_2D_CENTER,
      ) as ExecutiveStage2DResolvedPosition,
      relatedObjectIds: Object.freeze([]),
      secondaryObjectIds: Object.freeze([]),
      backgroundObjectIds: Object.freeze([]),
      peripheralObjectIds: Object.freeze([]),
      hiddenObjectIds: Object.freeze([]),
      classifications: Object.freeze({}),
      positions: Object.freeze({}),
      recompositionReason: "anchor-missing-from-objects",
      neighborhoodDepth: 1 as const,
    });
  }

  const maxRelated =
    input.maxRelated ?? EXECUTIVE_STAGE_2D_RECOMPOSITION_LAYOUT.maxRelatedVisible;
  const maxSecondary =
    input.maxSecondary ??
    EXECUTIVE_STAGE_2D_RECOMPOSITION_LAYOUT.maxSecondaryVisible;

  const allRelated = resolveExecutiveFocusRelatedObjectIds({
    focusedObjectId: anchorObjectId,
    connections: input.relationships,
  }).filter((objectId) => objectIds.has(objectId) && objectId !== anchorObjectId);

  const relatedObjectIds = Object.freeze(allRelated.slice(0, maxRelated));
  const relatedSet = new Set(relatedObjectIds);

  const contextLinks = input.contextLinks ?? [];
  const linkedContextIds = [
    ...new Set(
      contextLinks
        .filter((link) => link.objectId === anchorObjectId)
        .map((link) => link.contextId),
    ),
  ];
  const secondaryCandidates = [
    ...new Set([
      ...linkedContextIds,
      ...(input.secondaryCandidateIds ?? []),
    ]),
  ]
    .filter((id) => id !== anchorObjectId && !relatedSet.has(id))
    .sort(compareIds);
  const secondaryObjectIds = Object.freeze(
    secondaryCandidates.slice(0, maxSecondary),
  );
  const secondarySet = new Set(secondaryObjectIds);

  const classifications: Record<string, ExecutiveStage2DNeighborhoodClass> = {
    [anchorObjectId]: "anchor",
  };
  const positions: Record<string, ExecutiveStage2DResolvedPosition> = {
    [anchorObjectId]: normalizeExecutiveStage2DPosition({
      x: 0,
      y: 0,
      z: 0,
    }) as ExecutiveStage2DResolvedPosition,
  };
  const priority: Record<string, number> = {
    [anchorObjectId]: 100,
  };

  relatedObjectIds.forEach((objectId, index) => {
    classifications[objectId] = "related";
    positions[objectId] = placeRelatedSlot(index, relatedObjectIds.length);
    priority[objectId] = 80 - index;
  });

  secondaryObjectIds.forEach((objectId, index) => {
    classifications[objectId] = "secondary";
    positions[objectId] = placeSecondarySlot(index);
    priority[objectId] = 40 - index;
  });

  const backgroundObjectIds: string[] = [];
  const peripheralObjectIds: string[] = [];
  const hiddenObjectIds: string[] = [];

  const exclude = new Set<string>([
    anchorObjectId,
    ...relatedObjectIds,
    ...secondaryObjectIds,
  ]);
  const peripheralSelected = selectExecutiveStagePeripheralObjectIds({
    candidates: input.objects
      .filter((object) => object.disclosureState !== "hidden")
      .map((object) =>
        Object.freeze({
          objectId: object.objectId,
          attention: object.attention,
          status: object.status,
          recommended: object.recommended,
        }),
      ),
    excludeIds: exclude,
    maxPeripheral: EXECUTIVE_STAGE_VISUAL_BALANCE_BUDGET.maxPeripheral,
  });
  const peripheralSet = new Set(peripheralSelected);

  peripheralSelected.forEach((objectId, index) => {
    const object = input.objects.find((entry) => entry.objectId === objectId);
    classifications[objectId] = "peripheral";
    peripheralObjectIds.push(objectId);
    // Keep backgroundObjectIds populated for STAGE-2D:4 compatibility readers.
    backgroundObjectIds.push(objectId);
    positions[objectId] = placeExecutiveStagePeripheralSlot({
      objectId,
      index,
      base: object?.basePosition,
    });
    priority[objectId] = 35 - index;
  });

  input.objects.forEach((object) => {
    if (object.objectId === anchorObjectId) return;
    if (relatedSet.has(object.objectId)) return;
    if (secondaryObjectIds.includes(object.objectId)) return;
    if (peripheralSet.has(object.objectId)) return;
    if (object.disclosureState === "hidden") {
      classifications[object.objectId] = "hidden";
      hiddenObjectIds.push(object.objectId);
      return;
    }
    classifications[object.objectId] = "hidden";
    hiddenObjectIds.push(object.objectId);
  });

  const orderedIds = Object.freeze([
    anchorObjectId,
    ...relatedObjectIds,
    ...secondaryObjectIds,
    ...peripheralObjectIds,
  ]);

  const relaxed = relaxExecutiveStage2DPositions({
    positions,
    orderedIds,
    anchorObjectId,
    priority,
  });

  // Final immovable anchor assertion.
  const finalPositions: Record<string, ExecutiveStage2DResolvedPosition> = {
    ...relaxed,
    [anchorObjectId]: normalizeExecutiveStage2DPosition({
      x: 0,
      y: 0,
      z: 0,
    }) as ExecutiveStage2DResolvedPosition,
  };

  return Object.freeze({
    identity: executiveStage2DTopologyRecompositionIdentity,
    version: executiveStage2DTopologyRecompositionVersion,
    mode: "anchored" as const,
    anchorObjectId,
    anchorPosition: finalPositions[anchorObjectId]!,
    relatedObjectIds,
    secondaryObjectIds,
    backgroundObjectIds: Object.freeze(backgroundObjectIds.sort(compareIds)),
    peripheralObjectIds: Object.freeze(peripheralObjectIds.sort(compareIds)),
    hiddenObjectIds: Object.freeze(hiddenObjectIds.sort(compareIds)),
    classifications: Object.freeze(classifications),
    positions: Object.freeze(finalPositions),
    recompositionReason: "click-to-center-one-hop",
    neighborhoodDepth: 1 as const,
  });
}

export function verifyExecutiveStage2DTopologyRecomposition(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly inventsRelationships: boolean;
  readonly anchorExact: boolean;
  readonly cameraStatic: boolean;
}> {
  const identity = getExecutiveStage2DTopologyRecompositionIdentity();
  const identityValid =
    identity.id === "STAGE-2D:3/ExecutiveStage2DTopologyRecomposition" &&
    identity.version === "2.3.0";
  const inventsRelationships =
    EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDARY.inventsRelationships;
  const sample = resolveExecutiveStage2DTopologyRecomposition({
    anchorObjectId: "obj-a",
    objects: [
      Object.freeze({ objectId: "obj-a" }),
      Object.freeze({ objectId: "obj-b" }),
      Object.freeze({ objectId: "obj-c", attention: "critical" }),
    ],
    relationships: [
      Object.freeze({
        id: "rel-a-b",
        sourceId: "obj-a",
        targetId: "obj-b",
      }),
    ],
  });
  const anchorExact =
    sample.anchorPosition.x === 0 &&
    sample.anchorPosition.y === 0 &&
    sample.anchorPosition.z === 0 &&
    sample.positions["obj-a"]?.z === 0;
  const cameraStatic =
    EXECUTIVE_STAGE_2D_RECOMPOSITION_BOUNDARY.movesCamera === false;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    inventsRelationships === false &&
    anchorExact &&
    cameraStatic;

  return Object.freeze({
    ok,
    identityValid,
    inventsRelationships,
    anchorExact,
    cameraStatic,
  });
}

export function stabilizeExecutiveStage2DScalar(value: number): number {
  return stabilize(value);
}
