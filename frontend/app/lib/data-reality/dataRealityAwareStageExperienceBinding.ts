/**
 * P2:3 — Data-Reality-Aware Stage Experience Binding.
 *
 * Maps canonical P2:2 MVP Runtime Reality State onto existing Stage objects
 * as semantic presentation bindings. Stage consumes truth; it does not
 * recompute it.
 *
 * Layers preserved:
 *   TRUTH          → P2:2 runtime state
 *   STAGE SEMANTICS → this binding (emphasis / mvp status-attention)
 *   RENDERING      → existing React / Three.js Stage components
 *
 * Chain:
 *   P2:2 Runtime Reality State
 *   → P2:3 Stage Experience Binding (this module)
 *   → Existing NEX-MVP Stage
 */

import {
  dataRealityAwareMVPRuntimeStateIdentity,
  dataRealityAwareMVPRuntimeStateNamespace,
  dataRealityAwareMVPRuntimeStateVersion,
  type DataRealityAwareMVPObjectRuntimeState,
  type DataRealityAwareMVPRuntimeState,
  type ResolveDataRealityAwareMVPRuntimeStateInput,
  resolveDataRealityAwareMVPRuntimeState,
} from "./dataRealityAwareMVPRuntimeState.ts";
import type {
  DataRealityAdvisorAttentionLevel,
  DataRealityAdvisorState,
} from "./dataRealityAwareExecutiveAdvisorFoundation.ts";
import type { DataRealityExecutiveGuidance } from "./dataRealityExecutiveAdvisoryResolution.ts";
import type { DataRealityAdvisorMVPObjectResolutionStatus } from "./dataRealityAdvisorMVPBridge.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const dataRealityAwareStageExperienceBindingIdentity =
  "P2:3/DataRealityAwareStageExperienceBinding" as const;

export const dataRealityAwareStageExperienceBindingVersion = "2.3.0" as const;

export const dataRealityAwareStageExperienceBindingNamespace =
  "nexora.data-reality.stage-experience-binding" as const;

export const dataRealityAwareStageExperienceBindingPhase =
  "StageExperienceBinding" as const;

export const dataRealityAwareStageExperienceBindingArchitecturalRole =
  "DataRealityAwareStagePresentationBoundary" as const;

export interface DataRealityAwareStageExperienceBindingIdentity {
  readonly identity: "P2:3/DataRealityAwareStageExperienceBinding";
  readonly version: "2.3.0";
  readonly namespace: "nexora.data-reality.stage-experience-binding";
  readonly phase: "StageExperienceBinding";
  readonly architecturalRole: "DataRealityAwareStagePresentationBoundary";
}

const IDENTITY: DataRealityAwareStageExperienceBindingIdentity = Object.freeze({
  identity: dataRealityAwareStageExperienceBindingIdentity,
  version: dataRealityAwareStageExperienceBindingVersion,
  namespace: dataRealityAwareStageExperienceBindingNamespace,
  phase: dataRealityAwareStageExperienceBindingPhase,
  architecturalRole: dataRealityAwareStageExperienceBindingArchitecturalRole,
});

export function getDataRealityAwareStageExperienceBindingIdentity(): DataRealityAwareStageExperienceBindingIdentity {
  return IDENTITY;
}

export const DATA_REALITY_AWARE_STAGE_EXPERIENCE_BINDING_BOUNDARY =
  Object.freeze({
    architecturalRole: dataRealityAwareStageExperienceBindingArchitecturalRole,
    ownsKpiComputation: false as const,
    ownsExecutiveStateResolution: false as const,
    ownsAdvisorReasoning: false as const,
    ownsRecommendationLogic: false as const,
    duplicatesBusinessThresholds: false as const,
    createsStageGeometry: false as const,
    ownsCameraChoreography: false as const,
    redesignsEnvironment: false as const,
    redesignsAdvisorPanel: false as const,
    consumesP22RuntimeStateOnly: true as const,
    immediateRuntimeSource: dataRealityAwareMVPRuntimeStateIdentity,
    bindingCertified: false as const,
  });

export const DATA_REALITY_AWARE_STAGE_EXPERIENCE_BINDING_PROVENANCE_CHAIN =
  Object.freeze([
    "NexoraDataset",
    "P0 Data Reality",
    "P1 Executive Advisor",
    "P2:1 MVP Bridge",
    "P2:2 MVP Runtime Reality State",
    "P2:3 Stage Experience Binding",
  ] as const);

// ─── Semantic emphasis / Stage visual vocabulary ────────────────────────────

/**
 * Semantic Stage emphasis — not final render constants.
 * Reality emphasis and interaction markers remain composable.
 */
export const DATA_REALITY_AWARE_STAGE_EMPHASIS = Object.freeze([
  "default",
  "muted",
  "attention",
  "critical",
  "unresolved",
  "recommended",
  "focused",
  "selected",
] as const);

export type DataRealityAwareStageEmphasis =
  (typeof DATA_REALITY_AWARE_STAGE_EMPHASIS)[number];

/** Existing Stage fixture status vocabulary, extended for unresolved safety. */
export const DATA_REALITY_AWARE_STAGE_MVP_STATUSES = Object.freeze([
  "stable",
  "watch",
  "risk",
  "unresolved",
] as const);

export type DataRealityAwareStageMvpStatus =
  (typeof DATA_REALITY_AWARE_STAGE_MVP_STATUSES)[number];

export const DATA_REALITY_AWARE_STAGE_MVP_ATTENTIONS = Object.freeze([
  "normal",
  "elevated",
  "important",
  "critical",
] as const);

export type DataRealityAwareStageMvpAttention =
  (typeof DATA_REALITY_AWARE_STAGE_MVP_ATTENTIONS)[number];

export type DataRealityAwareStageBindingStatus =
  | "bound"
  | "unbound"
  | "unresolved"
  | "unavailable";

export type DataRealityAwareStageObjectRef = {
  readonly id: string;
};

// ─── Input / output contracts ───────────────────────────────────────────────

/**
 * Preferred: pass a pre-resolved P2:2 runtime state (no duplicate resolution).
 * Optional `runtimeInput` enables a single-call convenience path.
 */
export type ResolveDataRealityAwareStageBindingInput = {
  readonly runtimeState?: DataRealityAwareMVPRuntimeState;
  readonly runtimeInput?: ResolveDataRealityAwareMVPRuntimeStateInput;
  readonly stageObjects: readonly DataRealityAwareStageObjectRef[];
  readonly presentationState?: string;
  readonly selectedObjectId?: string;
  readonly focusedObjectId?: string;
};

export type DataRealityAwareStageObjectBinding = {
  readonly objectId: string;
  readonly realityState: DataRealityAdvisorState;
  readonly attention: DataRealityAdvisorAttentionLevel;
  readonly priority?: DataRealityAwareMVPObjectRuntimeState["priority"];
  readonly isSelected: boolean;
  readonly isFocused: boolean;
  readonly isRecommendedFocus: boolean;
  readonly isUnresolved: boolean;
  readonly hasData: boolean;
  readonly hasKPI: boolean;
  /** Canonical Runtime KPI passthrough; Stage must not calculate this value. */
  readonly primaryKPI?: DataRealityAwareMVPObjectRuntimeState["primaryKPI"];
  readonly resolutionStatus: DataRealityAdvisorMVPObjectResolutionStatus;
  readonly bindingStatus: DataRealityAwareStageBindingStatus;
  /** Primary reality-driven emphasis (interaction markers are separate flags). */
  readonly presentationEmphasis: DataRealityAwareStageEmphasis;
  readonly presentationState: string;
  readonly advisorMeaning: string;
  readonly recommendedAction?: DataRealityExecutiveGuidance;
  readonly evidenceIds: readonly string[];
  /**
   * Existing Stage visual vocabulary projection (status/attention).
   * Rendering components consume these; P2:3 does not hard-code colors/scales.
   */
  readonly mvpStatus: DataRealityAwareStageMvpStatus;
  readonly mvpAttention: DataRealityAwareStageMvpAttention;
};

export type DataRealityAwareStageSceneAttention = {
  readonly dominantState: DataRealityAdvisorState;
  readonly dominantAttention: DataRealityAdvisorAttentionLevel;
  readonly criticalObjectIds: readonly string[];
  readonly attentionObjectIds: readonly string[];
  readonly unresolvedObjectIds: readonly string[];
};

export type DataRealityAwareStageBindingFocus = {
  readonly recommendedObjectId?: string;
  readonly selectedObjectId?: string;
  readonly focusedObjectId?: string;
};

export type DataRealityAwareStageBindingUnresolved = {
  readonly objectIds: readonly string[];
  readonly unboundObjectIds: readonly string[];
  readonly unavailableInformation: readonly string[];
};

export type DataRealityAwareStageBindingProvenance = {
  readonly bindingIdentity: "P2:3/DataRealityAwareStageExperienceBinding";
  readonly bindingVersion: "2.3.0";
  readonly bindingNamespace: "nexora.data-reality.stage-experience-binding";
  readonly bindingPhase: "StageExperienceBinding";
  readonly bindingCertified: false;
  readonly chain: typeof DATA_REALITY_AWARE_STAGE_EXPERIENCE_BINDING_PROVENANCE_CHAIN;
  readonly immediateRuntimeSource: typeof dataRealityAwareMVPRuntimeStateIdentity;
  readonly immediateRuntimeVersion: typeof dataRealityAwareMVPRuntimeStateVersion;
  readonly immediateRuntimeNamespace: typeof dataRealityAwareMVPRuntimeStateNamespace;
  readonly runtimeStateId: string;
  readonly datasetId: string;
};

export type DataRealityAwareStageBindingResult = {
  readonly bindingId: string;
  readonly identity: DataRealityAwareStageExperienceBindingIdentity;
  readonly datasetIdentity: DataRealityAwareMVPRuntimeState["datasetIdentity"];
  readonly objects: readonly DataRealityAwareStageObjectBinding[];
  readonly sceneAttention: DataRealityAwareStageSceneAttention;
  readonly focus: DataRealityAwareStageBindingFocus;
  readonly unresolved: DataRealityAwareStageBindingUnresolved;
  readonly presentationState: string;
  readonly provenance: DataRealityAwareStageBindingProvenance;
  /** Traceability only — ordinary Stage consumers use `objects`. */
  readonly sourceRuntimeState: DataRealityAwareMVPRuntimeState;
};

// ─── Lookup helpers ─────────────────────────────────────────────────────────

export function getDataRealityAwareStageObjectBinding(
  binding: DataRealityAwareStageBindingResult,
  objectId: string,
): DataRealityAwareStageObjectBinding | undefined {
  return binding.objects.find((entry) => entry.objectId === objectId);
}

export function getCriticalDataRealityStageObjects(
  binding: DataRealityAwareStageBindingResult,
): readonly DataRealityAwareStageObjectBinding[] {
  return Object.freeze(
    binding.objects.filter((entry) => entry.realityState === "critical"),
  );
}

export function getUnresolvedDataRealityStageObjects(
  binding: DataRealityAwareStageBindingResult,
): readonly DataRealityAwareStageObjectBinding[] {
  return Object.freeze(
    binding.objects.filter((entry) => entry.isUnresolved),
  );
}

// ─── Projection (no business thresholds / advisor reasoning) ────────────────

function normalizeToken(value: string | undefined): string {
  if (!value || value.length === 0) return "none";
  return value.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

/**
 * Project P2:2 advisor reality onto existing Stage status/attention vocabulary.
 * Explicit mapping only — not a second executive-state engine.
 */
export function mapDataRealityAdvisorStateToStageMvpVocabulary(
  realityState: DataRealityAdvisorState,
): {
  readonly mvpStatus: DataRealityAwareStageMvpStatus;
  readonly mvpAttention: DataRealityAwareStageMvpAttention;
  readonly presentationEmphasis: DataRealityAwareStageEmphasis;
} {
  switch (realityState) {
    case "stable":
      return Object.freeze({
        mvpStatus: "stable",
        mvpAttention: "normal",
        presentationEmphasis: "default",
      });
    case "watch":
      return Object.freeze({
        mvpStatus: "watch",
        mvpAttention: "important",
        presentationEmphasis: "attention",
      });
    case "opportunity":
      return Object.freeze({
        mvpStatus: "watch",
        mvpAttention: "elevated",
        presentationEmphasis: "attention",
      });
    case "risk":
      return Object.freeze({
        mvpStatus: "risk",
        mvpAttention: "important",
        presentationEmphasis: "attention",
      });
    case "critical":
      return Object.freeze({
        mvpStatus: "risk",
        mvpAttention: "critical",
        presentationEmphasis: "critical",
      });
    case "unresolved":
      return Object.freeze({
        mvpStatus: "unresolved",
        mvpAttention: "normal",
        presentationEmphasis: "unresolved",
      });
    default: {
      const _exhaustive: never = realityState;
      return _exhaustive;
    }
  }
}

function resolveRuntimeState(
  input: ResolveDataRealityAwareStageBindingInput,
): DataRealityAwareMVPRuntimeState {
  if (input.runtimeState) return input.runtimeState;
  if (input.runtimeInput) {
    return resolveDataRealityAwareMVPRuntimeState(input.runtimeInput);
  }
  throw new Error(
    "resolveDataRealityAwareStageBinding requires runtimeState or runtimeInput",
  );
}

function bindingStatusFromObject(
  object: DataRealityAwareMVPObjectRuntimeState | undefined,
): DataRealityAwareStageBindingStatus {
  if (!object) return "unbound";
  if (object.resolutionStatus === "unavailable") return "unavailable";
  if (
    object.resolutionStatus === "unresolved" ||
    object.executiveState === "unresolved"
  ) {
    return "unresolved";
  }
  return "bound";
}

function projectBoundObject(
  object: DataRealityAwareMVPObjectRuntimeState,
  presentationState: string,
  selectedObjectId: string | undefined,
  focusedObjectId: string | undefined,
  recommendedObjectId: string | undefined,
): DataRealityAwareStageObjectBinding {
  const vocabulary = mapDataRealityAdvisorStateToStageMvpVocabulary(
    object.executiveState,
  );
  // Effective selection/focus from this resolve cycle (input override or
  // runtime snapshot). Do not OR with stale object flags from the snapshot.
  const isSelected = selectedObjectId === object.objectId;
  const isFocused = focusedObjectId === object.objectId;
  const isRecommendedFocus = recommendedObjectId === object.objectId;
  const isUnresolved =
    object.executiveState === "unresolved" ||
    object.resolutionStatus === "unresolved" ||
    object.resolutionStatus === "unavailable";

  return Object.freeze({
    objectId: object.objectId,
    realityState: object.executiveState,
    attention: object.attention,
    ...(object.priority !== undefined ? { priority: object.priority } : {}),
    isSelected,
    isFocused,
    isRecommendedFocus,
    isUnresolved,
    hasData: object.hasData,
    hasKPI: object.hasKPI,
    ...(object.primaryKPI !== undefined
      ? { primaryKPI: object.primaryKPI }
      : {}),
    resolutionStatus: object.resolutionStatus,
    bindingStatus: bindingStatusFromObject(object),
    presentationEmphasis: vocabulary.presentationEmphasis,
    presentationState,
    advisorMeaning: object.advisorMeaning,
    ...(object.recommendedAction !== undefined
      ? { recommendedAction: object.recommendedAction }
      : {}),
    evidenceIds: object.evidenceIds,
    mvpStatus: vocabulary.mvpStatus,
    mvpAttention: vocabulary.mvpAttention,
  });
}

function projectUnboundStageObject(
  objectId: string,
  presentationState: string,
  selectedObjectId: string | undefined,
  focusedObjectId: string | undefined,
  recommendedObjectId: string | undefined,
): DataRealityAwareStageObjectBinding {
  const vocabulary = mapDataRealityAdvisorStateToStageMvpVocabulary("unresolved");
  return Object.freeze({
    objectId,
    realityState: "unresolved",
    attention: "none",
    isSelected: selectedObjectId === objectId,
    isFocused: focusedObjectId === objectId,
    isRecommendedFocus: recommendedObjectId === objectId,
    isUnresolved: true,
    hasData: false,
    hasKPI: false,
    resolutionStatus: "unavailable",
    bindingStatus: "unbound",
    presentationEmphasis: vocabulary.presentationEmphasis,
    presentationState,
    advisorMeaning:
      "No certified runtime reality is currently bound to this Stage object.",
    evidenceIds: Object.freeze([]),
    mvpStatus: vocabulary.mvpStatus,
    mvpAttention: vocabulary.mvpAttention,
  });
}

function buildSceneAttention(
  runtimeState: DataRealityAwareMVPRuntimeState,
  objects: readonly DataRealityAwareStageObjectBinding[],
): DataRealityAwareStageSceneAttention {
  const criticalObjectIds = Object.freeze(
    objects
      .filter((entry) => entry.realityState === "critical")
      .map((entry) => entry.objectId),
  );
  const attentionObjectIds = Object.freeze(
    objects
      .filter((entry) =>
        entry.realityState === "watch" ||
        entry.realityState === "risk" ||
        entry.realityState === "opportunity",
      )
      .map((entry) => entry.objectId),
  );
  const unresolvedObjectIds = Object.freeze(
    objects
      .filter((entry) => entry.isUnresolved)
      .map((entry) => entry.objectId),
  );

  return Object.freeze({
    dominantState: runtimeState.attention.dominantState,
    dominantAttention: runtimeState.attention.dominantAttention,
    criticalObjectIds,
    attentionObjectIds,
    unresolvedObjectIds,
  });
}

// ─── Core API ───────────────────────────────────────────────────────────────

/**
 * Primary P2:3 Stage binding API.
 * Consumes P2:2 runtime truth and matches it to existing Stage object ids.
 */
export function resolveDataRealityAwareStageBinding(
  input: ResolveDataRealityAwareStageBindingInput,
): DataRealityAwareStageBindingResult {
  const runtimeState = resolveRuntimeState(input);
  const presentationState =
    input.presentationState ??
    runtimeState.context.presentationState ??
    "report";
  const selectedObjectId =
    input.selectedObjectId ?? runtimeState.focus.selectedObjectId;
  const focusedObjectId =
    input.focusedObjectId ?? runtimeState.focus.focusedObjectId;
  const recommendedObjectId = runtimeState.focus.recommendedObjectId;

  const realityById = new Map(
    runtimeState.objects.map((entry) => [entry.objectId, entry]),
  );

  const stageIds = Object.freeze(
    Array.from(new Set(input.stageObjects.map((entry) => entry.id))),
  );

  const objects: DataRealityAwareStageObjectBinding[] = [];
  const unboundObjectIds: string[] = [];

  for (const objectId of stageIds) {
    const reality = realityById.get(objectId);
    if (reality) {
      objects.push(
        projectBoundObject(
          reality,
          presentationState,
          selectedObjectId,
          focusedObjectId,
          recommendedObjectId,
        ),
      );
      realityById.delete(objectId);
    } else {
      unboundObjectIds.push(objectId);
      objects.push(
        projectUnboundStageObject(
          objectId,
          presentationState,
          selectedObjectId,
          focusedObjectId,
          recommendedObjectId,
        ),
      );
    }
  }

  // Runtime-only subjects (e.g. cost) with no Stage geometry — preserved, not materialized.
  const runtimeOnlyObjectIds = Object.freeze(
    Array.from(realityById.keys()).sort((a, b) => a.localeCompare(b)),
  );

  const unresolvedObjectIds = Object.freeze(
    [
      ...objects
        .filter((entry) => entry.isUnresolved)
        .map((entry) => entry.objectId),
      ...runtimeOnlyObjectIds.filter((id) => {
        const entry = runtimeState.objects.find((object) => object.objectId === id);
        return (
          entry?.executiveState === "unresolved" ||
          entry?.resolutionStatus === "unresolved" ||
          entry?.resolutionStatus === "unavailable"
        );
      }),
    ].sort((a, b) => a.localeCompare(b)),
  );

  const bindingId = [
    "stage-experience-binding",
    normalizeToken(runtimeState.datasetIdentity.datasetId),
    normalizeToken(runtimeState.stateId),
    normalizeToken(presentationState),
    normalizeToken(selectedObjectId),
    normalizeToken(focusedObjectId),
  ].join(":");

  return Object.freeze({
    bindingId,
    identity: IDENTITY,
    datasetIdentity: runtimeState.datasetIdentity,
    objects: Object.freeze(objects),
    sceneAttention: buildSceneAttention(runtimeState, objects),
    focus: Object.freeze({
      ...(recommendedObjectId !== undefined
        ? { recommendedObjectId }
        : {}),
      ...(selectedObjectId !== undefined ? { selectedObjectId } : {}),
      ...(focusedObjectId !== undefined ? { focusedObjectId } : {}),
    }),
    unresolved: Object.freeze({
      objectIds: unresolvedObjectIds,
      unboundObjectIds: Object.freeze(
        unboundObjectIds.slice().sort((a, b) => a.localeCompare(b)),
      ),
      unavailableInformation: runtimeState.unresolved.unavailableInformation,
    }),
    presentationState,
    provenance: Object.freeze({
      bindingIdentity: dataRealityAwareStageExperienceBindingIdentity,
      bindingVersion: dataRealityAwareStageExperienceBindingVersion,
      bindingNamespace: dataRealityAwareStageExperienceBindingNamespace,
      bindingPhase: dataRealityAwareStageExperienceBindingPhase,
      bindingCertified: false,
      chain: DATA_REALITY_AWARE_STAGE_EXPERIENCE_BINDING_PROVENANCE_CHAIN,
      immediateRuntimeSource: dataRealityAwareMVPRuntimeStateIdentity,
      immediateRuntimeVersion: dataRealityAwareMVPRuntimeStateVersion,
      immediateRuntimeNamespace: dataRealityAwareMVPRuntimeStateNamespace,
      runtimeStateId: runtimeState.stateId,
      datasetId: runtimeState.datasetIdentity.datasetId,
    }),
    sourceRuntimeState: runtimeState,
  });
}
