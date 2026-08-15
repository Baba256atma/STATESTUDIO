/**
 * P0:5 — Data Reality → existing NEX-MVP Stage projection adapter.
 *
 * Translation only. Does not recompute KPIs, re-run thresholds, own React
 * state, or touch Three.js. NOL status is not projected — NEX-MVP Stage
 * currently consumes local MVP status/attention fixtures as the shortest
 * canonical runtime path (REX/DRI are not imported by Stage UI).
 *
 * Mapping (Data Reality → existing MVP Stage vocabulary):
 *   normal    → status:stable   + attention:normal
 *   attention → status:watch    + attention:important
 *   critical  → status:risk     + attention:critical
 */

import type {
  NexoraDataRealitySnapshot,
  NexoraExecutiveState,
  NexoraExecutiveStateReason,
  NexoraObjectExecutiveState,
} from "./dataRealityContracts.ts";
import { NEXORA_EXECUTIVE_STATES } from "./dataRealityContracts.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const dataRealityStageProjectionIdentity =
  "P0:5/NexoraDataRealityStageProjection" as const;

export const dataRealityStageProjectionVersion = "1.0.0" as const;

export const dataRealityStageProjectionNamespace =
  "nexora.data-reality.stage-projection" as const;

export const dataRealityStageProjectionPhase =
  "RuntimeStageBinding" as const;

export const dataRealityStageProjectionArchitecturalRole =
  "DataRealityToExistingMvpStageProjectionAdapter" as const;

export const DATA_REALITY_STAGE_PROJECTION_BOUNDARY = Object.freeze({
  architecturalRole: dataRealityStageProjectionArchitecturalRole,
  ownsKpiComputation: false as const,
  ownsExecutiveStateResolution: false as const,
  ownsParallelRuntime: false as const,
  ownsThreeJs: false as const,
  ownsReactState: false as const,
  projectsNolStatus: false as const,
  projectsRexAttention: false as const,
  projectsDriAttention: false as const,
  consumesExistingMvpStatusAttention: true as const,
  mutatesSelectionFocus: false as const,
  mutatesWorkspaceEnvironment: false as const,
});

export function getDataRealityStageProjectionIdentity() {
  return Object.freeze({
    id: dataRealityStageProjectionIdentity,
    version: dataRealityStageProjectionVersion,
    namespace: dataRealityStageProjectionNamespace,
    phase: dataRealityStageProjectionPhase,
    architecturalRole: dataRealityStageProjectionArchitecturalRole,
  });
}

// ─── Existing MVP Stage runtime vocabulary (consumed, not invented) ─────────

export const NEXORA_MVP_STAGE_STATUSES = Object.freeze([
  "stable",
  "watch",
  "risk",
] as const);

export type NexoraMvpStageStatus = (typeof NEXORA_MVP_STAGE_STATUSES)[number];

export const NEXORA_MVP_STAGE_ATTENTIONS = Object.freeze([
  "normal",
  "elevated",
  "important",
  "critical",
] as const);

export type NexoraMvpStageAttention =
  (typeof NEXORA_MVP_STAGE_ATTENTIONS)[number];

export type NexoraDataRealityRuntimeAttentionMapping = {
  readonly executiveState: NexoraExecutiveState;
  readonly mvpStatus: NexoraMvpStageStatus;
  readonly mvpAttention: NexoraMvpStageAttention;
};

/**
 * Explicit business-state → existing MVP Stage presentation vocabulary.
 * Uses important (not elevated) for attention so A/B is visibly distinct.
 */
export const NEXORA_DATA_REALITY_RUNTIME_ATTENTION_MAP: readonly NexoraDataRealityRuntimeAttentionMapping[] =
  Object.freeze([
    Object.freeze({
      executiveState: "normal" as const,
      mvpStatus: "stable" as const,
      mvpAttention: "normal" as const,
    }),
    Object.freeze({
      executiveState: "attention" as const,
      mvpStatus: "watch" as const,
      mvpAttention: "important" as const,
    }),
    Object.freeze({
      executiveState: "critical" as const,
      mvpStatus: "risk" as const,
      mvpAttention: "critical" as const,
    }),
  ]);

// ─── Stage identity bridge ──────────────────────────────────────────────────

export type NexoraDataRealityStageIdentityBinding = {
  readonly objectKey: string;
  readonly nexoraObjectId: string;
  readonly mvpStageObjectId: string;
  readonly alignment: "exact" | "semantic-approximate";
};

/**
 * Canonical Data Reality ↔ MVP Stage identity bridge.
 * Cost intentionally omitted (no Stage object, no executive state).
 */
export const NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS: readonly NexoraDataRealityStageIdentityBinding[] =
  Object.freeze([
    Object.freeze({
      objectKey: "revenue",
      nexoraObjectId: "nexora.executive-operations.object.revenue",
      mvpStageObjectId: "obj-revenue",
      alignment: "exact" as const,
    }),
    Object.freeze({
      objectKey: "production",
      nexoraObjectId: "nexora.executive-operations.object.production",
      mvpStageObjectId: "obj-capacity",
      alignment: "semantic-approximate" as const,
    }),
    Object.freeze({
      objectKey: "warehouse",
      nexoraObjectId: "nexora.executive-operations.object.warehouse",
      mvpStageObjectId: "obj-inventory",
      alignment: "semantic-approximate" as const,
    }),
    Object.freeze({
      objectKey: "shipping",
      nexoraObjectId: "nexora.executive-operations.object.shipping",
      mvpStageObjectId: "obj-delivery",
      alignment: "semantic-approximate" as const,
    }),
    Object.freeze({
      objectKey: "customer",
      nexoraObjectId: "nexora.executive-operations.object.customer",
      mvpStageObjectId: "obj-customer",
      alignment: "exact" as const,
    }),
  ]);

export function getDataRealityStageIdentityBindings(): readonly NexoraDataRealityStageIdentityBinding[] {
  return NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS;
}

// ─── Projection contracts ───────────────────────────────────────────────────

export type NexoraDataRealityStageObjectProjection = {
  readonly stageObjectId: string;
  readonly nexoraObjectId: string;
  readonly objectKey: string;
  readonly executiveState: NexoraExecutiveState;
  readonly mvpStatus: NexoraMvpStageStatus;
  readonly mvpAttention: NexoraMvpStageAttention;
  readonly reasons: readonly NexoraExecutiveStateReason[];
};

export const NEXORA_DATA_REALITY_STAGE_PROJECTION_ISSUE_CODES = Object.freeze([
  "UNMAPPED_STAGE_OBJECT",
  "INVALID_STAGE_IDENTITY_BINDING",
  "DUPLICATE_STAGE_IDENTITY_BINDING",
  "UNSUPPORTED_EXECUTIVE_STATE",
  "UNSUPPORTED_RUNTIME_ATTENTION_MAPPING",
  "RUNTIME_PROJECTION_FAILED",
] as const);

export type NexoraDataRealityStageProjectionIssueCode =
  (typeof NEXORA_DATA_REALITY_STAGE_PROJECTION_ISSUE_CODES)[number];

export type NexoraDataRealityStageProjectionIssue = {
  readonly code: NexoraDataRealityStageProjectionIssueCode;
  readonly message: string;
  readonly objectKey?: string;
  readonly nexoraObjectId?: string;
  readonly stageObjectId?: string;
};

export type NexoraDataRealityStageProjectionResult = {
  readonly status: "projected" | "partial" | "invalid";
  readonly projections: readonly NexoraDataRealityStageObjectProjection[];
  readonly issues: readonly NexoraDataRealityStageProjectionIssue[];
};

function projectionIssue(
  code: NexoraDataRealityStageProjectionIssueCode,
  message: string,
  extras?: Omit<NexoraDataRealityStageProjectionIssue, "code" | "message">,
): NexoraDataRealityStageProjectionIssue {
  return Object.freeze({ code, message, ...extras });
}

export function mapExecutiveStateToMvpRuntimeAttention(
  state: NexoraExecutiveState,
): NexoraDataRealityRuntimeAttentionMapping | null {
  return (
    NEXORA_DATA_REALITY_RUNTIME_ATTENTION_MAP.find(
      (entry) => entry.executiveState === state,
    ) ?? null
  );
}

export function validateDataRealityStageIdentityBindings(
  bindings: readonly NexoraDataRealityStageIdentityBinding[] = NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS,
): readonly NexoraDataRealityStageProjectionIssue[] {
  const issues: NexoraDataRealityStageProjectionIssue[] = [];
  const seenNexora = new Set<string>();
  const seenStage = new Set<string>();

  for (const binding of bindings) {
    if (
      !binding.nexoraObjectId.trim() ||
      !binding.mvpStageObjectId.trim() ||
      !binding.objectKey.trim()
    ) {
      issues.push(
        projectionIssue(
          "INVALID_STAGE_IDENTITY_BINDING",
          "Stage identity binding is missing required identity fields.",
          {
            objectKey: binding.objectKey,
            nexoraObjectId: binding.nexoraObjectId,
            stageObjectId: binding.mvpStageObjectId,
          },
        ),
      );
      continue;
    }
    if (seenNexora.has(binding.nexoraObjectId)) {
      issues.push(
        projectionIssue(
          "DUPLICATE_STAGE_IDENTITY_BINDING",
          `Duplicate nexoraObjectId "${binding.nexoraObjectId}".`,
          { nexoraObjectId: binding.nexoraObjectId },
        ),
      );
    } else {
      seenNexora.add(binding.nexoraObjectId);
    }
    if (seenStage.has(binding.mvpStageObjectId)) {
      issues.push(
        projectionIssue(
          "DUPLICATE_STAGE_IDENTITY_BINDING",
          `Duplicate mvpStageObjectId "${binding.mvpStageObjectId}".`,
          { stageObjectId: binding.mvpStageObjectId },
        ),
      );
    } else {
      seenStage.add(binding.mvpStageObjectId);
    }
  }

  return Object.freeze(issues);
}

function projectObjectState(
  objectState: NexoraObjectExecutiveState,
  bindings: readonly NexoraDataRealityStageIdentityBinding[],
):
  | { readonly ok: true; readonly projection: NexoraDataRealityStageObjectProjection }
  | {
      readonly ok: false;
      readonly issues: readonly NexoraDataRealityStageProjectionIssue[];
    } {
  if (
    !(NEXORA_EXECUTIVE_STATES as readonly string[]).includes(objectState.state)
  ) {
    return {
      ok: false,
      issues: Object.freeze([
        projectionIssue(
          "UNSUPPORTED_EXECUTIVE_STATE",
          `Unsupported executive state "${String(objectState.state)}".`,
          {
            objectKey: objectState.objectKey,
            nexoraObjectId: objectState.nexoraObjectId,
          },
        ),
      ]),
    };
  }

  const binding = bindings.find(
    (entry) => entry.nexoraObjectId === objectState.nexoraObjectId,
  );
  if (!binding) {
    return {
      ok: false,
      issues: Object.freeze([
        projectionIssue(
          "UNMAPPED_STAGE_OBJECT",
          `No Stage identity mapping for nexoraObjectId "${objectState.nexoraObjectId}".`,
          {
            objectKey: objectState.objectKey,
            nexoraObjectId: objectState.nexoraObjectId,
          },
        ),
      ]),
    };
  }

  if (binding.objectKey !== objectState.objectKey) {
    return {
      ok: false,
      issues: Object.freeze([
        projectionIssue(
          "INVALID_STAGE_IDENTITY_BINDING",
          `Identity binding objectKey "${binding.objectKey}" does not match state objectKey "${objectState.objectKey}".`,
          {
            objectKey: objectState.objectKey,
            nexoraObjectId: objectState.nexoraObjectId,
            stageObjectId: binding.mvpStageObjectId,
          },
        ),
      ]),
    };
  }

  const runtime = mapExecutiveStateToMvpRuntimeAttention(objectState.state);
  if (!runtime) {
    return {
      ok: false,
      issues: Object.freeze([
        projectionIssue(
          "UNSUPPORTED_RUNTIME_ATTENTION_MAPPING",
          `No MVP runtime attention mapping for executive state "${objectState.state}".`,
          {
            objectKey: objectState.objectKey,
            nexoraObjectId: objectState.nexoraObjectId,
          },
        ),
      ]),
    };
  }

  return {
    ok: true,
    projection: Object.freeze({
      stageObjectId: binding.mvpStageObjectId,
      nexoraObjectId: objectState.nexoraObjectId,
      objectKey: objectState.objectKey,
      executiveState: objectState.state,
      mvpStatus: runtime.mvpStatus,
      mvpAttention: runtime.mvpAttention,
      reasons: Object.freeze([...objectState.reasons]),
    }),
  };
}

/**
 * Pure adapter: Data Reality snapshot → Stage-facing projections.
 * Does not mutate the snapshot or identity registry.
 * Does not invent normal for unmapped/unresolved objects.
 */
export function projectDataRealityToExecutiveRuntime(
  snapshot: NexoraDataRealitySnapshot,
  identityBindings: readonly NexoraDataRealityStageIdentityBinding[] = NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS,
): NexoraDataRealityStageProjectionResult {
  const issues: NexoraDataRealityStageProjectionIssue[] = [
    ...validateDataRealityStageIdentityBindings(identityBindings),
  ];
  const projections: NexoraDataRealityStageObjectProjection[] = [];

  try {
    for (const objectState of snapshot.objectStates) {
      const projected = projectObjectState(objectState, identityBindings);
      if (!projected.ok) {
        issues.push(...projected.issues);
        continue;
      }
      projections.push(projected.projection);
    }
  } catch (error) {
    issues.push(
      projectionIssue(
        "RUNTIME_PROJECTION_FAILED",
        error instanceof Error
          ? error.message
          : "Runtime projection failed unexpectedly.",
      ),
    );
  }

  projections.sort((a, b) => a.stageObjectId.localeCompare(b.stageObjectId));

  const status =
    projections.length === 0
      ? "invalid"
      : issues.length === 0
        ? "projected"
        : "partial";

  return Object.freeze({
    status,
    projections: Object.freeze(projections),
    issues: Object.freeze(issues),
  });
}
