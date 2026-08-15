/**
 * STAGE-2D:5 — Navigation Trail & Context Continuity.
 *
 * Navigation trail = interaction history (UX record).
 * Relationship graph = canonical business truth.
 * Current anchor = sole spatial Stage center.
 *
 * These three concepts must never collapse.
 *
 * Trail stores object identity only — never cached X/Y topology.
 */

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStage2DNavigationTrailIdentity =
  "STAGE-2D:5/ExecutiveStage2DNavigationTrail" as const;

export const executiveStage2DNavigationTrailVersion = "2.5.0" as const;

export const executiveStage2DNavigationTrailNamespace =
  "nexora.spatial-presentation.executive-stage-2d-navigation-trail" as const;

export const executiveStage2DNavigationTrailPhase =
  "ExecutiveStage2DNavigationTrailAndContextContinuity" as const;

export const executiveStage2DNavigationTrailArchitecturalRole =
  "PresentationOnlyStage2DNavigationTrail" as const;

export type ExecutiveStage2DNavigationTrailIdentity = {
  readonly id: typeof executiveStage2DNavigationTrailIdentity;
  readonly version: typeof executiveStage2DNavigationTrailVersion;
  readonly namespace: typeof executiveStage2DNavigationTrailNamespace;
  readonly phase: typeof executiveStage2DNavigationTrailPhase;
  readonly architecturalRole: typeof executiveStage2DNavigationTrailArchitecturalRole;
};

const IDENTITY: ExecutiveStage2DNavigationTrailIdentity = Object.freeze({
  id: executiveStage2DNavigationTrailIdentity,
  version: executiveStage2DNavigationTrailVersion,
  namespace: executiveStage2DNavigationTrailNamespace,
  phase: executiveStage2DNavigationTrailPhase,
  architecturalRole: executiveStage2DNavigationTrailArchitecturalRole,
});

export function getExecutiveStage2DNavigationTrailIdentity(): ExecutiveStage2DNavigationTrailIdentity {
  return IDENTITY;
}

export const EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_BOUNDARY = Object.freeze({
  architecturalRole: executiveStage2DNavigationTrailArchitecturalRole,
  inventsRelationships: false as const,
  storesCachedTopology: false as const,
  drawsTrailEdgesOnStage: false as const,
  expandsNeighborhoodBeyondOneHop: false as const,
  persistenceScope: "current-stage-session" as const,
  overviewClearsTrail: true as const,
  revisitPolicy: "append-again" as const,
});

export const EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_LIMITS = Object.freeze({
  /** Internal session bound — drop oldest when exceeded. */
  maxEntries: 32,
  /** Visible breadcrumb density (excluding Overview root). */
  maxVisibleEntries: 4,
});

export const EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_OBSERVABILITY = Object.freeze({
  mode: "trail" as const,
  contract: "stage-2d-5" as const,
});

// ─── State contract ─────────────────────────────────────────────────────────

/**
 * Canonical Stage-2D navigation trail.
 * Overview is not an object entry — empty trail + null active = Overview.
 */
export type ExecutiveStage2DNavigationTrail = {
  readonly objectIds: readonly string[];
  readonly activeObjectId: string | null;
  readonly currentIndex: number;
};

export function createEmptyExecutiveStage2DNavigationTrail(): ExecutiveStage2DNavigationTrail {
  return Object.freeze({
    objectIds: Object.freeze([]),
    activeObjectId: null,
    currentIndex: -1,
  });
}

function freezeTrail(
  objectIds: readonly string[],
  currentIndex: number,
): ExecutiveStage2DNavigationTrail {
  const bounded = objectIds.slice(
    Math.max(0, objectIds.length - EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_LIMITS.maxEntries),
  );
  const indexOffset = objectIds.length - bounded.length;
  const nextIndex =
    currentIndex < 0
      ? -1
      : Math.min(
          Math.max(0, currentIndex - indexOffset),
          Math.max(-1, bounded.length - 1),
        );
  const activeObjectId =
    nextIndex >= 0 && nextIndex < bounded.length ? bounded[nextIndex]! : null;
  return Object.freeze({
    objectIds: Object.freeze([...bounded]),
    activeObjectId,
    currentIndex: activeObjectId == null ? -1 : nextIndex,
  });
}

/**
 * Push a Stage object navigation entry.
 * - Consecutive duplicate of the active entry is a no-op.
 * - New click after Back truncates the obsolete forward branch.
 * - Revisiting an earlier object appends again (history, not collapse).
 */
export function pushExecutiveStage2DNavigationEntry(
  trail: ExecutiveStage2DNavigationTrail,
  objectId: string,
): ExecutiveStage2DNavigationTrail {
  if (!objectId) return trail;
  if (
    trail.activeObjectId === objectId &&
    trail.currentIndex === trail.objectIds.length - 1
  ) {
    return trail;
  }
  // Truncate forward branch when navigating from a non-tip index.
  const base =
    trail.currentIndex >= 0
      ? trail.objectIds.slice(0, trail.currentIndex + 1)
      : [...trail.objectIds];
  // Consecutive duplicate after truncate (active tip) — no-op.
  if (base.length > 0 && base[base.length - 1] === objectId) {
    return freezeTrail(base, base.length - 1);
  }
  return freezeTrail([...base, objectId], base.length);
}

export function stepBackExecutiveStage2DNavigationTrail(
  trail: ExecutiveStage2DNavigationTrail,
): ExecutiveStage2DNavigationTrail {
  if (trail.currentIndex < 0 || trail.objectIds.length === 0) {
    return createEmptyExecutiveStage2DNavigationTrail();
  }
  if (trail.currentIndex === 0) {
    // Preserve history for optional Forward after Overview? Policy: Overview clears.
    // Back from first entry → Overview (empty trail).
    return createEmptyExecutiveStage2DNavigationTrail();
  }
  return freezeTrail(trail.objectIds, trail.currentIndex - 1);
}

export function stepForwardExecutiveStage2DNavigationTrail(
  trail: ExecutiveStage2DNavigationTrail,
): ExecutiveStage2DNavigationTrail {
  if (trail.currentIndex < 0) return trail;
  if (trail.currentIndex >= trail.objectIds.length - 1) return trail;
  return freezeTrail(trail.objectIds, trail.currentIndex + 1);
}

/**
 * Jump to a historical index without truncating the forward branch.
 * Breadcrumb clicks use this path.
 */
export function jumpExecutiveStage2DNavigationTrail(
  trail: ExecutiveStage2DNavigationTrail,
  index: number,
): ExecutiveStage2DNavigationTrail {
  if (trail.objectIds.length === 0) {
    return createEmptyExecutiveStage2DNavigationTrail();
  }
  if (index < 0) {
    return createEmptyExecutiveStage2DNavigationTrail();
  }
  const nextIndex = Math.min(index, trail.objectIds.length - 1);
  return freezeTrail(trail.objectIds, nextIndex);
}

export function resetExecutiveStage2DNavigationTrail(): ExecutiveStage2DNavigationTrail {
  return createEmptyExecutiveStage2DNavigationTrail();
}

/**
 * Remove invalid object IDs. Prefer trimming invalid entries while preserving
 * relative order; if active becomes invalid, move to nearest prior valid entry
 * or Overview.
 */
export function sanitizeExecutiveStage2DNavigationTrail(
  trail: ExecutiveStage2DNavigationTrail,
  isValidObjectId: (objectId: string) => boolean,
): ExecutiveStage2DNavigationTrail {
  if (trail.objectIds.length === 0) {
    return createEmptyExecutiveStage2DNavigationTrail();
  }
  const validPairs: { readonly id: string; readonly wasActive: boolean }[] = [];
  for (let index = 0; index < trail.objectIds.length; index += 1) {
    const id = trail.objectIds[index]!;
    if (!isValidObjectId(id)) continue;
    validPairs.push(
      Object.freeze({
        id,
        wasActive: index === trail.currentIndex,
      }),
    );
  }
  if (validPairs.length === 0) {
    return createEmptyExecutiveStage2DNavigationTrail();
  }
  const objectIds = validPairs.map((entry) => entry.id);
  // STAGE-PROD:1 — Overview with retained Forward tip (currentIndex < 0, ids kept).
  if (trail.currentIndex < 0) {
    return freezeTrail(objectIds, -1);
  }
  let currentIndex = validPairs.findIndex((entry) => entry.wasActive);
  if (currentIndex < 0) {
    // Active was removed — land on nearest prior valid (last kept before old index).
    let priorCount = 0;
    for (let index = 0; index < trail.currentIndex && index < trail.objectIds.length; index += 1) {
      if (isValidObjectId(trail.objectIds[index]!)) priorCount += 1;
    }
    currentIndex = Math.max(0, priorCount - 1);
    if (priorCount === 0) currentIndex = 0;
  }
  return freezeTrail(objectIds, currentIndex);
}

export function canStepBackExecutiveStage2DNavigationTrail(
  trail: ExecutiveStage2DNavigationTrail,
): boolean {
  return trail.currentIndex >= 0;
}

export function canStepForwardExecutiveStage2DNavigationTrail(
  trail: ExecutiveStage2DNavigationTrail,
): boolean {
  return (
    trail.currentIndex >= 0 &&
    trail.currentIndex < trail.objectIds.length - 1
  );
}

/**
 * Visible breadcrumb slice (excluding Overview root).
 * Long trails render as: … / a / b / c / d
 */
export function resolveExecutiveStage2DNavigationTrailVisibleEntries(
  trail: ExecutiveStage2DNavigationTrail,
  maxVisible: number = EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_LIMITS.maxVisibleEntries,
): {
  readonly visibleObjectIds: readonly string[];
  readonly visibleStartIndex: number;
  readonly hasOverflow: boolean;
} {
  if (trail.objectIds.length === 0) {
    return Object.freeze({
      visibleObjectIds: Object.freeze([]),
      visibleStartIndex: 0,
      hasOverflow: false,
    });
  }
  if (trail.objectIds.length <= maxVisible) {
    return Object.freeze({
      visibleObjectIds: trail.objectIds,
      visibleStartIndex: 0,
      hasOverflow: false,
    });
  }
  // Prefer keeping the current entry and nearest neighbors toward the tip.
  const tip = Math.max(trail.currentIndex, 0);
  let end = Math.min(trail.objectIds.length, Math.max(tip + 1, maxVisible));
  let start = Math.max(0, end - maxVisible);
  if (end - start < maxVisible) {
    end = Math.min(trail.objectIds.length, start + maxVisible);
  }
  return Object.freeze({
    visibleObjectIds: Object.freeze(trail.objectIds.slice(start, end)),
    visibleStartIndex: start,
    hasOverflow: start > 0,
  });
}

export function getExecutiveStage2DNavigationTrailObservability(
  trail: ExecutiveStage2DNavigationTrail,
): Readonly<{
  readonly navigationMode: string;
  readonly navigationDepth: string;
  readonly currentIndex: string;
  readonly currentObjectId: string;
  readonly canBack: string;
  readonly canForward: string;
  readonly contract: string;
}> {
  const depth = trail.objectIds.length;
  return Object.freeze({
    navigationMode: EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_OBSERVABILITY.mode,
    navigationDepth: String(depth),
    currentIndex: String(trail.currentIndex),
    currentObjectId: trail.activeObjectId ?? "none",
    canBack: String(canStepBackExecutiveStage2DNavigationTrail(trail)),
    canForward: String(canStepForwardExecutiveStage2DNavigationTrail(trail)),
    contract: EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_OBSERVABILITY.contract,
  });
}

export function verifyExecutiveStage2DNavigationTrail(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly inventsRelationships: boolean;
  readonly revisitAppends: boolean;
}> {
  const identity = getExecutiveStage2DNavigationTrailIdentity();
  const identityValid =
    identity.id === "STAGE-2D:5/ExecutiveStage2DNavigationTrail" &&
    identity.version === "2.5.0";
  const inventsRelationships =
    EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_BOUNDARY.inventsRelationships;

  let trail = createEmptyExecutiveStage2DNavigationTrail();
  trail = pushExecutiveStage2DNavigationEntry(trail, "obj-revenue");
  trail = pushExecutiveStage2DNavigationEntry(trail, "obj-delivery");
  trail = pushExecutiveStage2DNavigationEntry(trail, "obj-customer");
  trail = pushExecutiveStage2DNavigationEntry(trail, "obj-revenue");
  const revisitAppends =
    trail.objectIds.length === 4 &&
    trail.objectIds[3] === "obj-revenue" &&
    trail.currentIndex === 3;

  return Object.freeze({
    ok:
      options?.forceFailure !== true &&
      identityValid &&
      inventsRelationships === false &&
      revisitAppends,
    identityValid,
    inventsRelationships,
    revisitAppends,
  });
}
