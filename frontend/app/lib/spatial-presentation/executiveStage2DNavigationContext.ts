/**
 * STAGE-2D:6 — Navigation Context Density & Workspace Isolation Polish.
 *
 * Extends STAGE-2D:5 trail with:
 *   - explicit workspace/model scope isolation
 *   - current-index-aware breadcrumb condensation
 *   - deterministic label budget
 *
 * Does not invent relationships, expand 1-hop topology, or move the camera.
 */

import type { NexoraMVPWorkspaceKind } from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation";
import {
  EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_LIMITS,
  canStepBackExecutiveStage2DNavigationTrail,
  canStepForwardExecutiveStage2DNavigationTrail,
  createEmptyExecutiveStage2DNavigationTrail,
  pushExecutiveStage2DNavigationEntry,
  resetExecutiveStage2DNavigationTrail,
  sanitizeExecutiveStage2DNavigationTrail,
  type ExecutiveStage2DNavigationTrail,
} from "./executiveStage2DNavigationTrail.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveStage2DNavigationContextIdentity =
  "STAGE-2D:6/ExecutiveStage2DNavigationContext" as const;

export const executiveStage2DNavigationContextVersion = "2.6.0" as const;

export const executiveStage2DNavigationContextNamespace =
  "nexora.spatial-presentation.executive-stage-2d-navigation-context" as const;

export const executiveStage2DNavigationContextPhase =
  "ExecutiveStage2DNavigationContextDensityAndWorkspaceIsolation" as const;

export const executiveStage2DNavigationContextArchitecturalRole =
  "PresentationOnlyStage2DNavigationContextPolish" as const;

export type ExecutiveStage2DNavigationContextIdentity = {
  readonly id: typeof executiveStage2DNavigationContextIdentity;
  readonly version: typeof executiveStage2DNavigationContextVersion;
  readonly namespace: typeof executiveStage2DNavigationContextNamespace;
  readonly phase: typeof executiveStage2DNavigationContextPhase;
  readonly architecturalRole: typeof executiveStage2DNavigationContextArchitecturalRole;
};

const IDENTITY: ExecutiveStage2DNavigationContextIdentity = Object.freeze({
  id: executiveStage2DNavigationContextIdentity,
  version: executiveStage2DNavigationContextVersion,
  namespace: executiveStage2DNavigationContextNamespace,
  phase: executiveStage2DNavigationContextPhase,
  architecturalRole: executiveStage2DNavigationContextArchitecturalRole,
});

export function getExecutiveStage2DNavigationContextIdentity(): ExecutiveStage2DNavigationContextIdentity {
  return IDENTITY;
}

export const EXECUTIVE_STAGE_2D_NAVIGATION_CONTEXT_BOUNDARY = Object.freeze({
  architecturalRole: executiveStage2DNavigationContextArchitecturalRole,
  inventsRelationships: false as const,
  persistsMultiWorkspaceHistory: false as const,
  resetsOnPresentationStateChange: false as const,
  resetsOnDataRealityRefresh: false as const,
  expandsNeighborhoodBeyondOneHop: false as const,
  storesCachedTopology: false as const,
  drawsTrailEdgesOnStage: false as const,
});

export const EXECUTIVE_STAGE_2D_NAVIGATION_CONTEXT_LIMITS = Object.freeze({
  maxEntries: EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_LIMITS.maxEntries,
  maxVisibleEntries: EXECUTIVE_STAGE_2D_NAVIGATION_TRAIL_LIMITS.maxVisibleEntries,
  /** Character budget for the entire object breadcrumb strip (excl. Overview). */
  labelBudgetChars: 52,
  currentLabelMaxChars: 22,
  immediatePastLabelMaxChars: 16,
  otherLabelMaxChars: 10,
});

export const EXECUTIVE_STAGE_2D_NAVIGATION_CONTEXT_OBSERVABILITY = Object.freeze({
  contract: "stage-2d-6" as const,
  mode: "trail" as const,
});

/** Default Stage catalog model identity for NEX-MVP (no separate model switch yet). */
export const EXECUTIVE_STAGE_2D_DEFAULT_MODEL_ID =
  "nexora.mvp.stage-catalog" as const;

// ─── Scope contract ─────────────────────────────────────────────────────────

/**
 * Semantic navigation scope.
 * Composition uses existing workspace reference ids (`workspace.${kind}`)
 * plus a stable Stage catalog model id — never presentation/theme/camera.
 */
export type ExecutiveStage2DNavigationScope = {
  readonly workspaceId: string;
  readonly modelId: string;
};

export type ExecutiveStage2DNavigationScopeStatus =
  | "stable"
  | "changed"
  | "sanitized"
  | "reset";

/**
 * Scoped trail — STAGE-2D:5 identity trail + explicit scope ownership.
 */
export type ExecutiveStage2DScopedNavigationTrail =
  ExecutiveStage2DNavigationTrail & {
    readonly scopeKey: string;
    readonly scope: ExecutiveStage2DNavigationScope;
  };

export function resolveExecutiveStage2DWorkspaceId(
  workspace: NexoraMVPWorkspaceKind,
): string {
  return `workspace.${workspace}`;
}

/**
 * Exact scope-key composition: `${workspaceId}:${modelId}`
 * Example: `workspace.overview:nexora.mvp.stage-catalog`
 */
export function composeExecutiveStage2DNavigationScopeKey(
  scope: ExecutiveStage2DNavigationScope,
): string {
  return `${scope.workspaceId}:${scope.modelId}`;
}

export function resolveExecutiveStage2DNavigationScope(input: {
  readonly workspace: NexoraMVPWorkspaceKind;
  readonly modelId?: string;
}): {
  readonly scope: ExecutiveStage2DNavigationScope;
  readonly scopeKey: string;
} {
  const scope = Object.freeze({
    workspaceId: resolveExecutiveStage2DWorkspaceId(input.workspace),
    modelId: input.modelId ?? EXECUTIVE_STAGE_2D_DEFAULT_MODEL_ID,
  });
  return Object.freeze({
    scope,
    scopeKey: composeExecutiveStage2DNavigationScopeKey(scope),
  });
}

export function createEmptyExecutiveStage2DScopedNavigationTrail(
  scopeInput: {
    readonly workspace: NexoraMVPWorkspaceKind;
    readonly modelId?: string;
  },
): ExecutiveStage2DScopedNavigationTrail {
  const resolved = resolveExecutiveStage2DNavigationScope(scopeInput);
  const empty = createEmptyExecutiveStage2DNavigationTrail();
  return Object.freeze({
    ...empty,
    scopeKey: resolved.scopeKey,
    scope: resolved.scope,
  });
}

function withScope(
  trail: ExecutiveStage2DNavigationTrail,
  scope: ExecutiveStage2DNavigationScope,
  scopeKey: string,
): ExecutiveStage2DScopedNavigationTrail {
  return Object.freeze({
    ...trail,
    scope,
    scopeKey,
  });
}

export function ensureExecutiveStage2DScopedNavigationTrail(
  trail:
    | ExecutiveStage2DScopedNavigationTrail
    | ExecutiveStage2DNavigationTrail
    | null
    | undefined,
  scopeInput: {
    readonly workspace: NexoraMVPWorkspaceKind;
    readonly modelId?: string;
  },
): ExecutiveStage2DScopedNavigationTrail {
  const resolved = resolveExecutiveStage2DNavigationScope(scopeInput);
  if (trail == null) {
    return createEmptyExecutiveStage2DScopedNavigationTrail(scopeInput);
  }
  if (
    "scopeKey" in trail &&
    typeof trail.scopeKey === "string" &&
    "scope" in trail
  ) {
    return trail as ExecutiveStage2DScopedNavigationTrail;
  }
  return withScope(trail, resolved.scope, resolved.scopeKey);
}

export function pushExecutiveStage2DScopedNavigationEntry(
  trail: ExecutiveStage2DScopedNavigationTrail,
  objectId: string,
): ExecutiveStage2DScopedNavigationTrail {
  const next = pushExecutiveStage2DNavigationEntry(trail, objectId);
  return withScope(next, trail.scope, trail.scopeKey);
}

export function resetExecutiveStage2DScopedNavigationTrail(
  trail: ExecutiveStage2DScopedNavigationTrail,
): ExecutiveStage2DScopedNavigationTrail {
  const empty = resetExecutiveStage2DNavigationTrail();
  return withScope(empty, trail.scope, trail.scopeKey);
}

/**
 * Sanitize by object existence + scope membership.
 * `isValidInScope` should encode both existence and current-model membership.
 */
export function sanitizeExecutiveStage2DScopedNavigationTrail(
  trail: ExecutiveStage2DScopedNavigationTrail,
  isValidInScope: (objectId: string) => boolean,
): ExecutiveStage2DScopedNavigationTrail {
  const sanitized = sanitizeExecutiveStage2DNavigationTrail(
    trail,
    isValidInScope,
  );
  return withScope(sanitized, trail.scope, trail.scopeKey);
}

/**
 * Single scope-transition authority.
 * Same scope → sanitize only (preserve history).
 * New scope → rebuild from valid focus or empty Overview (no multi-workspace store).
 */
export function transitionExecutiveStage2DNavigationScope(input: {
  readonly previousTrail: ExecutiveStage2DScopedNavigationTrail;
  readonly nextWorkspace: NexoraMVPWorkspaceKind;
  readonly nextModelId?: string;
  readonly currentFocusObjectId: string | null;
  readonly isValidInScope: (objectId: string) => boolean;
}): {
  readonly trail: ExecutiveStage2DScopedNavigationTrail;
  readonly scopeStatus: ExecutiveStage2DNavigationScopeStatus;
  readonly focusObjectId: string | null;
} {
  const nextResolved = resolveExecutiveStage2DNavigationScope({
    workspace: input.nextWorkspace,
    modelId: input.nextModelId,
  });

  if (input.previousTrail.scopeKey === nextResolved.scopeKey) {
    const beforeIds = input.previousTrail.objectIds.join("|");
    const sanitized = sanitizeExecutiveStage2DScopedNavigationTrail(
      withScope(
        input.previousTrail,
        nextResolved.scope,
        nextResolved.scopeKey,
      ),
      input.isValidInScope,
    );
    const afterIds = sanitized.objectIds.join("|");
    const status: ExecutiveStage2DNavigationScopeStatus =
      beforeIds === afterIds ? "stable" : "sanitized";
    return Object.freeze({
      trail: sanitized,
      scopeStatus: status,
      focusObjectId: sanitized.activeObjectId,
    });
  }

  // Scope changed — no history leakage; clear Forward branch by rebuilding.
  const focus =
    input.currentFocusObjectId != null &&
    input.isValidInScope(input.currentFocusObjectId)
      ? input.currentFocusObjectId
      : null;

  if (focus == null) {
    return Object.freeze({
      trail: createEmptyExecutiveStage2DScopedNavigationTrail({
        workspace: input.nextWorkspace,
        modelId: input.nextModelId,
      }),
      scopeStatus: "reset" as const,
      focusObjectId: null,
    });
  }

  const seeded = pushExecutiveStage2DScopedNavigationEntry(
    createEmptyExecutiveStage2DScopedNavigationTrail({
      workspace: input.nextWorkspace,
      modelId: input.nextModelId,
    }),
    focus,
  );
  return Object.freeze({
    trail: seeded,
    scopeStatus: "changed" as const,
    focusObjectId: focus,
  });
}

// ─── Breadcrumb density ─────────────────────────────────────────────────────

export type ExecutiveStage2DBreadcrumbLabelMode =
  | "full"
  | "compact"
  | "truncated";

export type ExecutiveStage2DNavigationBreadcrumbWindow = {
  readonly visibleObjectIds: readonly string[];
  readonly visibleStartIndex: number;
  readonly overflowBefore: number;
  readonly overflowAfter: number;
  readonly hasOverflowBefore: boolean;
  readonly hasOverflowAfter: boolean;
  readonly visibleCount: number;
};

/**
 * Current-index-aware visible window.
 * Prefers immediate past + current + immediate future when Forward history exists.
 */
export function resolveExecutiveStage2DNavigationBreadcrumbWindow(
  trail: ExecutiveStage2DNavigationTrail,
  maxVisible: number = EXECUTIVE_STAGE_2D_NAVIGATION_CONTEXT_LIMITS.maxVisibleEntries,
): ExecutiveStage2DNavigationBreadcrumbWindow {
  const n = trail.objectIds.length;
  const cur = trail.currentIndex;
  if (n === 0 || cur < 0) {
    return Object.freeze({
      visibleObjectIds: Object.freeze([]),
      visibleStartIndex: 0,
      overflowBefore: 0,
      overflowAfter: 0,
      hasOverflowBefore: false,
      hasOverflowAfter: false,
      visibleCount: 0,
    });
  }
  if (n <= maxVisible) {
    return Object.freeze({
      visibleObjectIds: trail.objectIds,
      visibleStartIndex: 0,
      overflowBefore: 0,
      overflowAfter: 0,
      hasOverflowBefore: false,
      hasOverflowAfter: false,
      visibleCount: n,
    });
  }

  let start: number;
  let end: number;

  if (cur === n - 1) {
    // Tip: trailing window — … / past / past / CURRENT
    end = n;
    start = Math.max(0, n - maxVisible);
  } else if (cur === 0) {
    // Start: CURRENT / future / …
    start = 0;
    end = Math.min(n, maxVisible);
  } else {
    // Middle: prefer ≥1 past and ≥1 future around current.
    const pastBudget = Math.max(1, Math.floor((maxVisible - 1) / 2));
    const futureBudget = maxVisible - 1 - pastBudget;
    let before = Math.min(cur, pastBudget);
    let after = Math.min(n - 1 - cur, futureBudget);
    let used = 1 + before + after;
    if (used < maxVisible) {
      const extra = maxVisible - used;
      const addBefore = Math.min(extra, cur - before);
      before += addBefore;
      after += Math.min(extra - addBefore, n - 1 - cur - after);
    }
    start = cur - before;
    end = cur + after + 1;
  }

  return Object.freeze({
    visibleObjectIds: Object.freeze(trail.objectIds.slice(start, end)),
    visibleStartIndex: start,
    overflowBefore: start,
    overflowAfter: n - end,
    hasOverflowBefore: start > 0,
    hasOverflowAfter: end < n,
    visibleCount: end - start,
  });
}

export function truncateExecutiveStage2DNavigationLabel(
  label: string,
  maxChars: number,
): string {
  if (!Number.isFinite(maxChars) || maxChars <= 0) return "";
  if (label.length <= maxChars) return label;
  if (maxChars === 1) return "…";
  return `${label.slice(0, maxChars - 1).trimEnd()}…`;
}

export function resolveExecutiveStage2DBreadcrumbLabelMode(input: {
  readonly isCurrent: boolean;
  readonly isImmediatePast: boolean;
  readonly fullLabel: string;
  readonly maxChars: number;
}): ExecutiveStage2DBreadcrumbLabelMode {
  if (input.fullLabel.length <= input.maxChars) return "full";
  if (input.isCurrent) {
    return input.fullLabel.length <= input.maxChars + 4 ? "compact" : "truncated";
  }
  if (input.isImmediatePast) return "compact";
  return "truncated";
}

export type ExecutiveStage2DBreadcrumbLabelResolution = {
  readonly objectId: string;
  readonly fullLabel: string;
  readonly displayLabel: string;
  readonly mode: ExecutiveStage2DBreadcrumbLabelMode;
  readonly isCurrent: boolean;
  readonly trailIndex: number;
};

/**
 * Current anchor receives highest label budget; immediate past next; others compact.
 */
export function resolveExecutiveStage2DBreadcrumbLabels(input: {
  readonly trail: ExecutiveStage2DNavigationTrail;
  readonly window: ExecutiveStage2DNavigationBreadcrumbWindow;
  readonly labelsById: Readonly<Record<string, string>>;
}): readonly ExecutiveStage2DBreadcrumbLabelResolution[] {
  const limits = EXECUTIVE_STAGE_2D_NAVIGATION_CONTEXT_LIMITS;
  const currentIndex = input.trail.currentIndex;
  const resolutions: ExecutiveStage2DBreadcrumbLabelResolution[] = [];

  for (let offset = 0; offset < input.window.visibleObjectIds.length; offset += 1) {
    const objectId = input.window.visibleObjectIds[offset]!;
    const trailIndex = input.window.visibleStartIndex + offset;
    const isCurrent = trailIndex === currentIndex;
    const isImmediatePast = trailIndex === currentIndex - 1;
    const fullLabel = input.labelsById[objectId] ?? objectId;
    const maxChars = isCurrent
      ? limits.currentLabelMaxChars
      : isImmediatePast
        ? limits.immediatePastLabelMaxChars
        : limits.otherLabelMaxChars;
    const mode = resolveExecutiveStage2DBreadcrumbLabelMode({
      isCurrent,
      isImmediatePast,
      fullLabel,
      maxChars,
    });
    const displayLabel =
      mode === "full"
        ? fullLabel
        : truncateExecutiveStage2DNavigationLabel(fullLabel, maxChars);
    resolutions.push(
      Object.freeze({
        objectId,
        fullLabel,
        displayLabel,
        mode,
        isCurrent,
        trailIndex,
      }),
    );
  }

  // If total display length still exceeds budget, tighten non-current entries.
  let total = resolutions.reduce(
    (sum, entry) => sum + entry.displayLabel.length,
    0,
  );
  if (total > limits.labelBudgetChars) {
    for (let i = resolutions.length - 1; i >= 0; i -= 1) {
      const entry = resolutions[i]!;
      if (entry.isCurrent) continue;
      const tighter = truncateExecutiveStage2DNavigationLabel(
        entry.fullLabel,
        Math.min(limits.otherLabelMaxChars, 8),
      );
      resolutions[i] = Object.freeze({
        ...entry,
        displayLabel: tighter,
        mode: "truncated" as const,
      });
      total = resolutions.reduce(
        (sum, item) => sum + item.displayLabel.length,
        0,
      );
      if (total <= limits.labelBudgetChars) break;
    }
  }

  return Object.freeze(resolutions);
}

export function getExecutiveStage2DNavigationContextObservability(input: {
  readonly trail: ExecutiveStage2DScopedNavigationTrail;
  readonly window: ExecutiveStage2DNavigationBreadcrumbWindow;
  readonly scopeStatus?: ExecutiveStage2DNavigationScopeStatus;
}): Readonly<{
  readonly navigationMode: string;
  readonly navigationScope: string;
  readonly navigationScopeStatus: string;
  readonly navigationDepth: string;
  readonly visibleCount: string;
  readonly overflowBefore: string;
  readonly overflowAfter: string;
  readonly currentIndex: string;
  readonly currentObjectId: string;
  readonly canBack: string;
  readonly canForward: string;
  readonly contract: string;
}> {
  return Object.freeze({
    navigationMode: EXECUTIVE_STAGE_2D_NAVIGATION_CONTEXT_OBSERVABILITY.mode,
    navigationScope: input.trail.scopeKey,
    navigationScopeStatus: input.scopeStatus ?? "stable",
    navigationDepth: String(input.trail.objectIds.length),
    visibleCount: String(input.window.visibleCount),
    overflowBefore: String(input.window.overflowBefore),
    overflowAfter: String(input.window.overflowAfter),
    currentIndex: String(input.trail.currentIndex),
    currentObjectId: input.trail.activeObjectId ?? "none",
    canBack: String(canStepBackExecutiveStage2DNavigationTrail(input.trail)),
    canForward: String(
      canStepForwardExecutiveStage2DNavigationTrail(input.trail),
    ),
    contract: EXECUTIVE_STAGE_2D_NAVIGATION_CONTEXT_OBSERVABILITY.contract,
  });
}

export function verifyExecutiveStage2DNavigationContext(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly inventsRelationships: boolean;
  readonly isolatesScopes: boolean;
}> {
  const identity = getExecutiveStage2DNavigationContextIdentity();
  const identityValid =
    identity.id === "STAGE-2D:6/ExecutiveStage2DNavigationContext" &&
    identity.version === "2.6.0";
  const inventsRelationships =
    EXECUTIVE_STAGE_2D_NAVIGATION_CONTEXT_BOUNDARY.inventsRelationships;

  let trail = createEmptyExecutiveStage2DScopedNavigationTrail({
    workspace: "overview",
  });
  trail = pushExecutiveStage2DScopedNavigationEntry(trail, "obj-revenue");
  trail = pushExecutiveStage2DScopedNavigationEntry(trail, "obj-delivery");
  const transitioned = transitionExecutiveStage2DNavigationScope({
    previousTrail: trail,
    nextWorkspace: "scenario",
    currentFocusObjectId: "obj-cost",
    isValidInScope: (id) => id === "obj-cost",
  });
  const isolatesScopes =
    transitioned.scopeStatus === "changed" &&
    transitioned.trail.objectIds.length === 1 &&
    transitioned.trail.objectIds[0] === "obj-cost" &&
    !transitioned.trail.objectIds.includes("obj-revenue");

  return Object.freeze({
    ok:
      options?.forceFailure !== true &&
      identityValid &&
      inventsRelationships === false &&
      isolatesScopes,
    identityValid,
    inventsRelationships,
    isolatesScopes,
  });
}
