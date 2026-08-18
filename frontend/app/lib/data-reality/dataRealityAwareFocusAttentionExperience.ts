/**
 * P2:5 — Data-Reality-Aware Focus & Attention Experience Integration.
 *
 * Semantic orchestration of attention vs focus vs selection vs recommended
 * focus. Sibling consumer of P2:2 alongside P2:3 (Stage) and P2:4 (Advisor).
 *
 * Does NOT:
 *   - recompute KPI / executive state / advisor reasoning
 *   - invent severity scores or recommendations
 *   - move camera or geometry
 *   - derive truth from Stage or Advisor presentation
 *
 * Chain:
 *   P2:2 Runtime Reality State
 *   → P2:5 Focus & Attention Experience (this module)
 *   → Existing NEX-MVP interaction / presentation consumers
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
import type { DataRealityAdvisorMVPObjectResolutionStatus } from "./dataRealityAdvisorMVPBridge.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const dataRealityAwareFocusAttentionExperienceIdentity =
  "P2:5/DataRealityAwareFocusAttentionExperienceIntegration" as const;

export const dataRealityAwareFocusAttentionExperienceVersion = "2.5.0" as const;

export const dataRealityAwareFocusAttentionExperienceNamespace =
  "nexora.data-reality.focus-attention-experience" as const;

export const dataRealityAwareFocusAttentionExperiencePhase =
  "FocusAttentionExperienceIntegration" as const;

export const dataRealityAwareFocusAttentionExperienceArchitecturalRole =
  "DataRealityAwareExecutiveAttentionBoundary" as const;

export interface DataRealityAwareFocusAttentionExperienceIdentity {
  readonly identity: "P2:5/DataRealityAwareFocusAttentionExperienceIntegration";
  readonly version: "2.5.0";
  readonly namespace: "nexora.data-reality.focus-attention-experience";
  readonly phase: "FocusAttentionExperienceIntegration";
  readonly architecturalRole: "DataRealityAwareExecutiveAttentionBoundary";
}

const IDENTITY: DataRealityAwareFocusAttentionExperienceIdentity = Object.freeze({
  identity: dataRealityAwareFocusAttentionExperienceIdentity,
  version: dataRealityAwareFocusAttentionExperienceVersion,
  namespace: dataRealityAwareFocusAttentionExperienceNamespace,
  phase: dataRealityAwareFocusAttentionExperiencePhase,
  architecturalRole: dataRealityAwareFocusAttentionExperienceArchitecturalRole,
});

export function getDataRealityAwareFocusAttentionExperienceIdentity(): DataRealityAwareFocusAttentionExperienceIdentity {
  return IDENTITY;
}

export const DATA_REALITY_AWARE_FOCUS_ATTENTION_EXPERIENCE_BOUNDARY =
  Object.freeze({
    architecturalRole: dataRealityAwareFocusAttentionExperienceArchitecturalRole,
    ownsKpiComputation: false as const,
    ownsExecutiveStateResolution: false as const,
    ownsAdvisorReasoning: false as const,
    inventsRecommendations: false as const,
    inventsSeverityScores: false as const,
    usesStagePresentationAsTruth: false as const,
    ownsCameraChoreography: false as const,
    repositionsGeometry: false as const,
    collapsesSelectionIntoImportance: false as const,
    consumesP22RuntimeStateOnly: true as const,
    immediateRuntimeSource: dataRealityAwareMVPRuntimeStateIdentity,
    experienceCertified: false as const,
  });

export const DATA_REALITY_AWARE_FOCUS_ATTENTION_EXPERIENCE_PROVENANCE_CHAIN =
  Object.freeze([
    "NexoraDataset",
    "P0 Data Reality",
    "P1 Executive Advisor",
    "P2:1 MVP Bridge",
    "P2:2 MVP Runtime Reality State",
    "P2:5 Focus & Attention Experience",
  ] as const);

// ─── Semantic focus roles (thin P2 vocabulary; not DRI/REX imports) ──────────

export const DATA_REALITY_AWARE_FOCUS_ROLES = Object.freeze([
  "primary",
  "recommended",
  "selected",
  "focused",
  "supporting",
  "background",
  "unresolved",
] as const);

export type DataRealityAwareFocusRole =
  (typeof DATA_REALITY_AWARE_FOCUS_ROLES)[number];

// ─── Input / output contracts ───────────────────────────────────────────────

export type ResolveDataRealityAwareFocusAttentionExperienceInput = {
  readonly runtimeState?: DataRealityAwareMVPRuntimeState;
  readonly runtimeInput?: ResolveDataRealityAwareMVPRuntimeStateInput;
  readonly selectedObjectId?: string;
  readonly focusedObjectId?: string;
  readonly presentationState?: string;
  readonly workspace?: string;
  readonly mode?: string;
};

export type DataRealityAwareFocusAttentionObjectState = {
  readonly objectId: string;
  readonly executiveState: DataRealityAdvisorState;
  readonly attention: DataRealityAdvisorAttentionLevel;
  readonly priority?: DataRealityAwareMVPObjectRuntimeState["priority"];
  readonly isSelected: boolean;
  readonly isFocused: boolean;
  readonly isRecommendedFocus: boolean;
  readonly isPrimaryFocus: boolean;
  readonly isCritical: boolean;
  readonly isUnresolved: boolean;
  /** Stable upstream order index (0 = highest upstream priority). Not a score. */
  readonly attentionRank: number;
  readonly focusRole: DataRealityAwareFocusRole;
  readonly shouldForeground: boolean;
  readonly shouldDeemphasize: boolean;
  readonly evidenceIds: readonly string[];
  readonly resolutionStatus: DataRealityAdvisorMVPObjectResolutionStatus;
  readonly hasData: boolean;
  readonly hasKPI: boolean;
};

export type DataRealityAwareFocusAttentionSceneAttention = {
  readonly primaryFocusObjectId?: string;
  readonly recommendedFocusObjectId?: string;
  readonly selectedObjectId?: string;
  readonly runtimeFocusedObjectId?: string;
  readonly criticalObjectIds: readonly string[];
  readonly attentionObjectIds: readonly string[];
  readonly unresolvedObjectIds: readonly string[];
  readonly backgroundAttentionObjectIds: readonly string[];
  readonly hasCompetingAttention: boolean;
};

export type DataRealityAwareFocusAttentionPresentationGuidance = {
  readonly foregroundObjectIds: readonly string[];
  readonly deemphasizeObjectIds: readonly string[];
  readonly retainAttentionObjectIds: readonly string[];
  readonly presentationState?: string;
  readonly workspace?: string;
  readonly mode?: string;
};

export type DataRealityAwareFocusAttentionProvenance = {
  readonly experienceIdentity: "P2:5/DataRealityAwareFocusAttentionExperienceIntegration";
  readonly experienceVersion: "2.5.0";
  readonly experienceNamespace: "nexora.data-reality.focus-attention-experience";
  readonly experiencePhase: "FocusAttentionExperienceIntegration";
  readonly experienceCertified: false;
  readonly chain: typeof DATA_REALITY_AWARE_FOCUS_ATTENTION_EXPERIENCE_PROVENANCE_CHAIN;
  readonly immediateRuntimeSource: typeof dataRealityAwareMVPRuntimeStateIdentity;
  readonly immediateRuntimeVersion: typeof dataRealityAwareMVPRuntimeStateVersion;
  readonly immediateRuntimeNamespace: typeof dataRealityAwareMVPRuntimeStateNamespace;
  readonly runtimeStateId: string;
  readonly datasetId: string;
};

export type DataRealityAwareFocusAttentionExperienceResult = {
  readonly experienceId: string;
  readonly identity: DataRealityAwareFocusAttentionExperienceIdentity;
  readonly datasetIdentity: DataRealityAwareMVPRuntimeState["datasetIdentity"];
  readonly primaryFocus?: string;
  readonly recommendedFocus?: string;
  readonly selectedFocus?: string;
  readonly runtimeFocus?: string;
  readonly attentionObjects: readonly string[];
  readonly criticalObjects: readonly string[];
  readonly unresolvedObjects: readonly string[];
  readonly objectStates: readonly DataRealityAwareFocusAttentionObjectState[];
  readonly sceneAttention: DataRealityAwareFocusAttentionSceneAttention;
  readonly presentationGuidance: DataRealityAwareFocusAttentionPresentationGuidance;
  readonly provenance: DataRealityAwareFocusAttentionProvenance;
  readonly sourceRuntimeState: DataRealityAwareMVPRuntimeState;
};

// ─── Lookup helpers ─────────────────────────────────────────────────────────

export function getDataRealityAwarePrimaryFocus(
  result: DataRealityAwareFocusAttentionExperienceResult,
): string | undefined {
  return result.primaryFocus;
}

export function getDataRealityAwareAttentionObjectState(
  result: DataRealityAwareFocusAttentionExperienceResult,
  objectId: string,
): DataRealityAwareFocusAttentionObjectState | undefined {
  return result.objectStates.find((entry) => entry.objectId === objectId);
}

export function getDataRealityAwareCriticalAttentionObjects(
  result: DataRealityAwareFocusAttentionExperienceResult,
): readonly DataRealityAwareFocusAttentionObjectState[] {
  return Object.freeze(
    result.objectStates.filter((entry) => entry.isCritical),
  );
}

export function getDataRealityAwareCompetingAttention(
  result: DataRealityAwareFocusAttentionExperienceResult,
): {
  readonly hasCompetingAttention: boolean;
  readonly primaryFocusObjectId?: string;
  readonly competingObjectIds: readonly string[];
} {
  const competingObjectIds = Object.freeze(
    result.sceneAttention.backgroundAttentionObjectIds,
  );
  return Object.freeze({
    hasCompetingAttention: result.sceneAttention.hasCompetingAttention,
    ...(result.primaryFocus !== undefined
      ? { primaryFocusObjectId: result.primaryFocus }
      : {}),
    competingObjectIds,
  });
}

// ─── Projection (no business scoring) ───────────────────────────────────────

function normalizeToken(value: string | undefined): string {
  if (!value || value.length === 0) return "none";
  return value.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function resolveRuntimeState(
  input: ResolveDataRealityAwareFocusAttentionExperienceInput,
): DataRealityAwareMVPRuntimeState {
  if (input.runtimeState) return input.runtimeState;
  if (input.runtimeInput) {
    return resolveDataRealityAwareMVPRuntimeState(input.runtimeInput);
  }
  throw new Error(
    "resolveDataRealityAwareFocusAttentionExperience requires runtimeState or runtimeInput",
  );
}

/**
 * Presentation primary-focus precedence (interaction over severity):
 * 1. explicit runtime focused object (honored even if absent from DR object set)
 * 2. explicit user selected object (honored even if absent from DR object set)
 * 3. Advisor recommended focus (must be a known DR object)
 * 4. first upstream prioritized subject
 * 5. none
 *
 * Explicit user focus beats automatic executive attention.
 * UX:2 precedence (highest first):
 *   DIRECT USER CLICK → NAVIGATION RESTORE → AUTOMATIC ATTENTION
 *   → RECOMMENDATION → FALLBACK
 * Navigation restore writes the same focused/selected ids as a click, so it
 * wins through the same explicit-parameter path. Automatic attention must not
 * steal center after an explicit manager click.
 */
export function resolveDataRealityAwarePrimaryFocusObjectId(
  runtimeState: DataRealityAwareMVPRuntimeState,
  selectedObjectId?: string,
  focusedObjectId?: string,
): string | undefined {
  const known = new Set(runtimeState.objects.map((entry) => entry.objectId));

  // Explicit parameters win even when the Stage object is not in the DR catalog
  // (e.g. Budget). Automatic attention must not steal direct user focus.
  if (focusedObjectId) return focusedObjectId;
  if (selectedObjectId) return selectedObjectId;

  const focused = runtimeState.focus.focusedObjectId;
  if (focused && known.has(focused)) return focused;

  const selected = runtimeState.focus.selectedObjectId;
  if (selected && known.has(selected)) return selected;

  const recommended = runtimeState.focus.recommendedObjectId;
  if (recommended && known.has(recommended)) return recommended;

  const firstPrioritized = runtimeState.prioritizedSubjects[0]?.subjectId;
  if (firstPrioritized && known.has(firstPrioritized)) return firstPrioritized;

  return undefined;
}

function isAttentionSignificant(
  attention: DataRealityAdvisorAttentionLevel,
  executiveState: DataRealityAdvisorState,
): boolean {
  if (
    executiveState === "critical" ||
    executiveState === "risk" ||
    executiveState === "watch" ||
    executiveState === "opportunity"
  ) {
    return true;
  }
  return (
    attention === "medium" ||
    attention === "high" ||
    attention === "immediate"
  );
}

function resolveFocusRole(input: {
  readonly isPrimaryFocus: boolean;
  readonly isRecommendedFocus: boolean;
  readonly isSelected: boolean;
  readonly isFocused: boolean;
  readonly isUnresolved: boolean;
  readonly isAttentionSignificant: boolean;
}): DataRealityAwareFocusRole {
  if (input.isPrimaryFocus) return "primary";
  if (input.isRecommendedFocus) return "recommended";
  if (input.isFocused) return "focused";
  if (input.isSelected) return "selected";
  if (input.isUnresolved) return "unresolved";
  if (input.isAttentionSignificant) return "supporting";
  return "background";
}

function upstreamAttentionRank(
  objectId: string,
  runtimeState: DataRealityAwareMVPRuntimeState,
): number {
  const index = runtimeState.prioritizedSubjects.findIndex(
    (entry) => entry.subjectId === objectId,
  );
  if (index >= 0) return index;
  const objectIndex = runtimeState.objects.findIndex(
    (entry) => entry.objectId === objectId,
  );
  return objectIndex >= 0
    ? runtimeState.prioritizedSubjects.length + objectIndex
    : Number.MAX_SAFE_INTEGER;
}

function projectObjectState(
  object: DataRealityAwareMVPObjectRuntimeState,
  primaryFocus: string | undefined,
  selectedObjectId: string | undefined,
  focusedObjectId: string | undefined,
  recommendedObjectId: string | undefined,
  runtimeState: DataRealityAwareMVPRuntimeState,
): DataRealityAwareFocusAttentionObjectState {
  // Effective selection/focus come from resolved interaction context
  // (input override or runtime snapshot). Do not OR with stale object flags
  // when an explicit effective id is already chosen for this resolve cycle.
  const isSelected = selectedObjectId === object.objectId;
  const isFocused = focusedObjectId === object.objectId;
  const isRecommendedFocus = recommendedObjectId === object.objectId;
  const isPrimaryFocus = primaryFocus === object.objectId;
  const isCritical = object.executiveState === "critical";
  const isUnresolved =
    object.executiveState === "unresolved" ||
    object.resolutionStatus === "unresolved" ||
    object.resolutionStatus === "unavailable";
  const attentionSignificant = isAttentionSignificant(
    object.attention,
    object.executiveState,
  );
  const focusRole = resolveFocusRole({
    isPrimaryFocus,
    isRecommendedFocus,
    isSelected,
    isFocused,
    isUnresolved,
    isAttentionSignificant: attentionSignificant,
  });

  const shouldForeground = isPrimaryFocus || isFocused || isSelected;
  // Deemphasize only non-primary interaction; never erase attention significance.
  const shouldDeemphasize =
    !shouldForeground &&
    !isRecommendedFocus &&
    !isCritical &&
    !isUnresolved &&
    !attentionSignificant;

  return Object.freeze({
    objectId: object.objectId,
    executiveState: object.executiveState,
    attention: object.attention,
    ...(object.priority !== undefined ? { priority: object.priority } : {}),
    isSelected,
    isFocused,
    isRecommendedFocus,
    isPrimaryFocus,
    isCritical,
    isUnresolved,
    attentionRank: upstreamAttentionRank(object.objectId, runtimeState),
    focusRole,
    shouldForeground,
    shouldDeemphasize,
    evidenceIds: object.evidenceIds,
    resolutionStatus: object.resolutionStatus,
    hasData: object.hasData,
    hasKPI: object.hasKPI,
  });
}

// ─── Core API ───────────────────────────────────────────────────────────────

/**
 * Primary P2:5 Focus & Attention experience API.
 */
export function resolveDataRealityAwareFocusAttentionExperience(
  input: ResolveDataRealityAwareFocusAttentionExperienceInput,
): DataRealityAwareFocusAttentionExperienceResult {
  const runtimeState = resolveRuntimeState(input);
  const selectedObjectId =
    input.selectedObjectId ?? runtimeState.focus.selectedObjectId;
  const focusedObjectId =
    input.focusedObjectId ?? runtimeState.focus.focusedObjectId;
  const recommendedObjectId = runtimeState.focus.recommendedObjectId;
  const presentationState =
    input.presentationState ?? runtimeState.context.presentationState;
  const workspace = input.workspace ?? runtimeState.context.workspace;

  const primaryFocus = resolveDataRealityAwarePrimaryFocusObjectId(
    runtimeState,
    selectedObjectId,
    focusedObjectId,
  );

  const objectStates = Object.freeze(
    runtimeState.objects.map((object) =>
      projectObjectState(
        object,
        primaryFocus,
        selectedObjectId,
        focusedObjectId,
        recommendedObjectId,
        runtimeState,
      ),
    ),
  );

  const criticalObjects = Object.freeze(
    objectStates
      .filter((entry) => entry.isCritical)
      .map((entry) => entry.objectId),
  );
  const attentionObjects = Object.freeze(
    objectStates
      .filter(
        (entry) =>
          entry.isCritical ||
          entry.executiveState === "risk" ||
          entry.executiveState === "watch" ||
          entry.executiveState === "opportunity" ||
          entry.attention === "medium" ||
          entry.attention === "high" ||
          entry.attention === "immediate",
      )
      .map((entry) => entry.objectId),
  );
  const unresolvedObjects = Object.freeze(
    objectStates
      .filter((entry) => entry.isUnresolved)
      .map((entry) => entry.objectId),
  );

  const backgroundAttentionObjectIds = Object.freeze(
    objectStates
      .filter(
        (entry) =>
          !entry.isPrimaryFocus &&
          (entry.isCritical ||
            entry.isRecommendedFocus ||
            entry.isUnresolved ||
            entry.executiveState === "risk" ||
            entry.executiveState === "watch"),
      )
      .map((entry) => entry.objectId),
  );

  const hasCompetingAttention =
    primaryFocus !== undefined &&
    backgroundAttentionObjectIds.some(
      (objectId) =>
        objectId !== primaryFocus &&
        (criticalObjects.includes(objectId) ||
          objectId === recommendedObjectId ||
          unresolvedObjects.includes(objectId)),
    );

  const foregroundObjectIds = Object.freeze(
    objectStates
      .filter((entry) => entry.shouldForeground)
      .map((entry) => entry.objectId),
  );
  const deemphasizeObjectIds = Object.freeze(
    objectStates
      .filter((entry) => entry.shouldDeemphasize)
      .map((entry) => entry.objectId),
  );
  const retainAttentionObjectIds = Object.freeze(
    objectStates
      .filter(
        (entry) =>
          !entry.shouldForeground &&
          (entry.isCritical ||
            entry.isRecommendedFocus ||
            entry.isUnresolved ||
            entry.focusRole === "supporting"),
      )
      .map((entry) => entry.objectId),
  );

  const experienceId = [
    "focus-attention-experience",
    normalizeToken(runtimeState.datasetIdentity.datasetId),
    normalizeToken(runtimeState.stateId),
    normalizeToken(primaryFocus),
    normalizeToken(selectedObjectId),
    normalizeToken(focusedObjectId),
    normalizeToken(recommendedObjectId),
  ].join(":");

  return Object.freeze({
    experienceId,
    identity: IDENTITY,
    datasetIdentity: runtimeState.datasetIdentity,
    ...(primaryFocus !== undefined ? { primaryFocus } : {}),
    ...(recommendedObjectId !== undefined
      ? { recommendedFocus: recommendedObjectId }
      : {}),
    ...(selectedObjectId !== undefined
      ? { selectedFocus: selectedObjectId }
      : {}),
    ...(focusedObjectId !== undefined
      ? { runtimeFocus: focusedObjectId }
      : {}),
    attentionObjects,
    criticalObjects,
    unresolvedObjects,
    objectStates,
    sceneAttention: Object.freeze({
      ...(primaryFocus !== undefined
        ? { primaryFocusObjectId: primaryFocus }
        : {}),
      ...(recommendedObjectId !== undefined
        ? { recommendedFocusObjectId: recommendedObjectId }
        : {}),
      ...(selectedObjectId !== undefined ? { selectedObjectId } : {}),
      ...(focusedObjectId !== undefined
        ? { runtimeFocusedObjectId: focusedObjectId }
        : {}),
      criticalObjectIds: criticalObjects,
      attentionObjectIds: attentionObjects,
      unresolvedObjectIds: unresolvedObjects,
      backgroundAttentionObjectIds,
      hasCompetingAttention,
    }),
    presentationGuidance: Object.freeze({
      foregroundObjectIds,
      deemphasizeObjectIds,
      retainAttentionObjectIds,
      ...(presentationState !== undefined ? { presentationState } : {}),
      ...(workspace !== undefined ? { workspace } : {}),
      ...(input.mode !== undefined ? { mode: input.mode } : {}),
    }),
    provenance: Object.freeze({
      experienceIdentity: dataRealityAwareFocusAttentionExperienceIdentity,
      experienceVersion: dataRealityAwareFocusAttentionExperienceVersion,
      experienceNamespace: dataRealityAwareFocusAttentionExperienceNamespace,
      experiencePhase: dataRealityAwareFocusAttentionExperiencePhase,
      experienceCertified: false,
      chain: DATA_REALITY_AWARE_FOCUS_ATTENTION_EXPERIENCE_PROVENANCE_CHAIN,
      immediateRuntimeSource: dataRealityAwareMVPRuntimeStateIdentity,
      immediateRuntimeVersion: dataRealityAwareMVPRuntimeStateVersion,
      immediateRuntimeNamespace: dataRealityAwareMVPRuntimeStateNamespace,
      runtimeStateId: runtimeState.stateId,
      datasetId: runtimeState.datasetIdentity.datasetId,
    }),
    sourceRuntimeState: runtimeState,
  });
}
