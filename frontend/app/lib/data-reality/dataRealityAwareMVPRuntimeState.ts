/**
 * P2:2 — Data-Reality-Aware MVP Runtime State Integration.
 *
 * Converts the P2:1 Certified Advisor → MVP Bridge result into one stable
 * runtime Reality State for NEX-MVP consumers.
 *
 * Architectural role: canonical runtime-state boundary.
 * Does NOT own presentation, KPI/advisor business logic, React, or networking.
 *
 * Chain:
 *   NexoraDataset
 *   → P0 Data Reality
 *   → P1 Executive Advisor
 *   → P2:1 DataRealityAdvisorMVPBridge
 *   → P2:2 MVP Runtime Reality State (this module)
 *   → Later Stage / Advisor / Focus / Attention bindings
 */

import {
  dataRealityAdvisorMVPBridgeIdentity,
  dataRealityAdvisorMVPBridgeNamespace,
  dataRealityAdvisorMVPBridgeVersion,
  resolveDataRealityAdvisorForMVPRuntime,
  type DataRealityAdvisorMVPBridgeProvenance,
  type DataRealityAdvisorMVPExecutiveSummary,
  type DataRealityAdvisorMVPObjectReality,
  type DataRealityAdvisorMVPObjectResolutionStatus,
  type DataRealityAdvisorMVPOverallCondition,
  type DataRealityAdvisorMVPPrioritizedSubject,
  type DataRealityAdvisorMVPRecommendedFocus,
  type DataRealityAdvisorMVPRuntimeBridgeResult,
  type ResolveDataRealityAdvisorMVPRuntimeInput,
} from "./dataRealityAdvisorMVPBridge.ts";
import type {
  DataRealityAdvisorAttentionLevel,
  DataRealityAdvisorState,
} from "./dataRealityAwareExecutiveAdvisorFoundation.ts";
import type { DataRealityExecutiveGuidance } from "./dataRealityExecutiveAdvisoryResolution.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const dataRealityAwareMVPRuntimeStateIdentity =
  "P2:2/DataRealityAwareMVPRuntimeStateIntegration" as const;

export const dataRealityAwareMVPRuntimeStateVersion = "2.2.0" as const;

export const dataRealityAwareMVPRuntimeStateNamespace =
  "nexora.data-reality.mvp-runtime-state" as const;

export const dataRealityAwareMVPRuntimeStatePhase =
  "MVPRuntimeRealityStateIntegration" as const;

export const dataRealityAwareMVPRuntimeStateArchitecturalRole =
  "DataRealityAwareMVPRuntimeStateBoundary" as const;

export interface DataRealityAwareMVPRuntimeStateIdentity {
  readonly identity: "P2:2/DataRealityAwareMVPRuntimeStateIntegration";
  readonly version: "2.2.0";
  readonly namespace: "nexora.data-reality.mvp-runtime-state";
  readonly phase: "MVPRuntimeRealityStateIntegration";
  readonly architecturalRole: "DataRealityAwareMVPRuntimeStateBoundary";
}

const IDENTITY: DataRealityAwareMVPRuntimeStateIdentity = Object.freeze({
  identity: dataRealityAwareMVPRuntimeStateIdentity,
  version: dataRealityAwareMVPRuntimeStateVersion,
  namespace: dataRealityAwareMVPRuntimeStateNamespace,
  phase: dataRealityAwareMVPRuntimeStatePhase,
  architecturalRole: dataRealityAwareMVPRuntimeStateArchitecturalRole,
});

export function getDataRealityAwareMVPRuntimeStateIdentity(): DataRealityAwareMVPRuntimeStateIdentity {
  return IDENTITY;
}

/**
 * Boundary markers. P2:2 is a runtime-state integration phase — not certified.
 */
export const DATA_REALITY_AWARE_MVP_RUNTIME_STATE_BOUNDARY = Object.freeze({
  architecturalRole: dataRealityAwareMVPRuntimeStateArchitecturalRole,
  ownsKpiComputation: false as const,
  ownsExecutiveStateResolution: false as const,
  ownsAdvisorReasoning: false as const,
  ownsRecommendationLogic: false as const,
  duplicatesBusinessThresholds: false as const,
  ownsPresentationLogic: false as const,
  ownsSelectionFocusTruth: false as const,
  performsUiWork: false as const,
  performsNetworkWork: false as const,
  introducesReactStore: false as const,
  runtimeStateCertified: false as const,
  consumesP21BridgeOnly: true as const,
  immediateDataRealitySource: dataRealityAdvisorMVPBridgeIdentity,
});

export const DATA_REALITY_AWARE_MVP_RUNTIME_STATE_PROVENANCE_CHAIN =
  Object.freeze([
    "NexoraDataset",
    "P0 Data Reality",
    "P1 Executive Advisor",
    "P2:1 MVP Bridge",
    "P2:2 MVP Runtime Reality State",
  ] as const);

// ─── Input contract ─────────────────────────────────────────────────────────

/**
 * Canonical runtime-state input.
 * Composes the P2:1 bridge input; adds only optional MVP interaction overlays
 * that do not invent new workspace/mode taxonomies.
 */
export type ResolveDataRealityAwareMVPRuntimeStateInput =
  ResolveDataRealityAdvisorMVPRuntimeInput & {
    /**
     * MVP presentation depth when known (minimum | report | operation).
     * Stored in runtime context only — not reinterpreted as executive truth.
     */
    readonly presentationState?: string;
    /**
     * Convenience single-selection id. When omitted, the first
     * `selectedObjectIds` entry (if any) is treated as the selected object.
     */
    readonly selectedObjectId?: string;
  };

// ─── Runtime contracts ──────────────────────────────────────────────────────

export interface DataRealityAwareMVPDatasetIdentity {
  readonly datasetId: string;
  readonly bridgeId: string;
  readonly integrationId: string;
}

/**
 * Object-level runtime reality. Interaction flags never rewrite executive truth.
 */
export interface DataRealityAwareMVPObjectRuntimeState {
  readonly objectId: string;
  readonly objectKey?: string;
  readonly nexoraObjectId?: string;
  readonly executiveState: DataRealityAdvisorState;
  readonly attention: DataRealityAdvisorAttentionLevel;
  readonly priority?: DataRealityAdvisorMVPObjectReality["priority"];
  readonly advisorMeaning: string;
  readonly evidenceIds: readonly string[];
  readonly recommendedAction?: DataRealityExecutiveGuidance;
  readonly hasData: boolean;
  readonly hasKPI: boolean;
  readonly resolutionStatus: DataRealityAdvisorMVPObjectResolutionStatus;
  readonly isSelected: boolean;
  readonly isFocused: boolean;
}

/**
 * Keep advisor-recommended, user-selected, and runtime-focused ids distinct.
 */
export interface DataRealityAwareMVPRuntimeFocus {
  readonly recommendedObjectId?: string;
  readonly selectedObjectId?: string;
  readonly focusedObjectId?: string;
}

/** Semantic attention only — no presentation styling decisions. */
export interface DataRealityAwareMVPRuntimeAttention {
  readonly dominantAttention: DataRealityAdvisorAttentionLevel;
  readonly dominantState: DataRealityAdvisorState;
  readonly requiresImmediateAttention: boolean;
  readonly hasUnresolvedReality: boolean;
}

export interface DataRealityAwareMVPRuntimeRecommendations {
  readonly recommendedFocus?: DataRealityAdvisorMVPRecommendedFocus;
  readonly actions: readonly DataRealityExecutiveGuidance[];
}

export interface DataRealityAwareMVPRuntimeUnresolved {
  readonly objectIds: readonly string[];
  readonly unavailableInformation: readonly string[];
}

/**
 * Runtime interaction context preserved alongside certified reality.
 * Does not mutate business truth.
 */
export interface DataRealityAwareMVPRuntimeContext {
  readonly workspace?: string;
  readonly presentationState?: string;
  readonly selectedObjectId?: string;
  readonly selectedObjectIds: readonly string[];
  readonly focusedObjectId?: string;
  readonly requestedIntent?: ResolveDataRealityAdvisorMVPRuntimeInput["requestedIntent"];
  readonly responseMode?: ResolveDataRealityAdvisorMVPRuntimeInput["responseMode"];
  readonly currentGoalId?: string;
  readonly currentScenarioId?: string;
  readonly currentDecisionId?: string;
}

export interface DataRealityAwareMVPRuntimeProvenance {
  readonly runtimeIdentity: "P2:2/DataRealityAwareMVPRuntimeStateIntegration";
  readonly runtimeVersion: "2.2.0";
  readonly runtimeNamespace: "nexora.data-reality.mvp-runtime-state";
  readonly runtimePhase: "MVPRuntimeRealityStateIntegration";
  readonly runtimeStateCertified: false;
  readonly chain: typeof DATA_REALITY_AWARE_MVP_RUNTIME_STATE_PROVENANCE_CHAIN;
  readonly immediateDataRealitySource: typeof dataRealityAdvisorMVPBridgeIdentity;
  readonly immediateSourceVersion: typeof dataRealityAdvisorMVPBridgeVersion;
  readonly immediateSourceNamespace: typeof dataRealityAdvisorMVPBridgeNamespace;
  readonly bridgeProvenance: DataRealityAdvisorMVPBridgeProvenance;
}

/**
 * Canonical NEX-MVP Reality State — “what Nexora currently knows”.
 */
export interface DataRealityAwareMVPRuntimeState {
  readonly stateId: string;
  readonly identity: DataRealityAwareMVPRuntimeStateIdentity;
  readonly datasetIdentity: DataRealityAwareMVPDatasetIdentity;
  readonly overallCondition: DataRealityAdvisorMVPOverallCondition;
  readonly summary: DataRealityAdvisorMVPExecutiveSummary;
  readonly objects: readonly DataRealityAwareMVPObjectRuntimeState[];
  readonly prioritizedSubjects: readonly DataRealityAdvisorMVPPrioritizedSubject[];
  readonly focus: DataRealityAwareMVPRuntimeFocus;
  readonly attention: DataRealityAwareMVPRuntimeAttention;
  readonly recommendations: DataRealityAwareMVPRuntimeRecommendations;
  readonly unresolved: DataRealityAwareMVPRuntimeUnresolved;
  readonly context: DataRealityAwareMVPRuntimeContext;
  readonly provenance: DataRealityAwareMVPRuntimeProvenance;
  /**
   * Full P2:1 bridge result for traceability/debugging.
   * Ordinary UI consumers should use the runtime fields above.
   */
  readonly sourceReality: DataRealityAdvisorMVPRuntimeBridgeResult;
}

// ─── Helpers (read-only) ────────────────────────────────────────────────────

export function getDataRealityAwareMVPObjectRuntimeState(
  runtimeState: DataRealityAwareMVPRuntimeState,
  objectId: string,
): DataRealityAwareMVPObjectRuntimeState | undefined {
  return runtimeState.objects.find((entry) => entry.objectId === objectId);
}

export function getDataRealityAwareMVPRecommendedFocus(
  runtimeState: DataRealityAwareMVPRuntimeState,
): DataRealityAwareMVPRuntimeFocus["recommendedObjectId"] {
  return runtimeState.focus.recommendedObjectId;
}

export function getDataRealityAwareMVPUnresolvedObjects(
  runtimeState: DataRealityAwareMVPRuntimeState,
): readonly DataRealityAwareMVPObjectRuntimeState[] {
  return Object.freeze(
    runtimeState.objects.filter((entry) =>
      runtimeState.unresolved.objectIds.includes(entry.objectId),
    ),
  );
}

// ─── Projection (no business rules) ─────────────────────────────────────────

function normalizeToken(value: string | undefined): string {
  if (!value || value.length === 0) return "none";
  return value.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function resolveSelectedObjectId(
  input: ResolveDataRealityAwareMVPRuntimeStateInput,
): string | undefined {
  if (input.selectedObjectId !== undefined && input.selectedObjectId.length > 0) {
    return input.selectedObjectId;
  }
  const first = input.selectedObjectIds?.[0];
  return first !== undefined && first.length > 0 ? first : undefined;
}

function resolveSelectedObjectIds(
  input: ResolveDataRealityAwareMVPRuntimeStateInput,
  selectedObjectId: string | undefined,
): readonly string[] {
  if (input.selectedObjectIds && input.selectedObjectIds.length > 0) {
    return Object.freeze([...input.selectedObjectIds]);
  }
  if (selectedObjectId !== undefined) {
    return Object.freeze([selectedObjectId]);
  }
  return Object.freeze([]);
}

function projectObjectRuntimeState(
  objectReality: DataRealityAdvisorMVPObjectReality,
  selectedIds: ReadonlySet<string>,
  focusedObjectId: string | undefined,
): DataRealityAwareMVPObjectRuntimeState {
  return Object.freeze({
    objectId: objectReality.objectId,
    ...(objectReality.objectKey !== undefined
      ? { objectKey: objectReality.objectKey }
      : {}),
    ...(objectReality.nexoraObjectId !== undefined
      ? { nexoraObjectId: objectReality.nexoraObjectId }
      : {}),
    executiveState: objectReality.executiveState,
    attention: objectReality.attention,
    ...(objectReality.priority !== undefined
      ? { priority: objectReality.priority }
      : {}),
    advisorMeaning: objectReality.advisorMeaning,
    evidenceIds: objectReality.evidenceIds,
    ...(objectReality.recommendedAction !== undefined
      ? { recommendedAction: objectReality.recommendedAction }
      : {}),
    hasData: objectReality.hasData,
    hasKPI: objectReality.hasKPI,
    resolutionStatus: objectReality.resolutionStatus,
    isSelected: selectedIds.has(objectReality.objectId),
    isFocused: focusedObjectId === objectReality.objectId,
  });
}

function projectRuntimeState(
  input: ResolveDataRealityAwareMVPRuntimeStateInput,
  bridgeResult: DataRealityAdvisorMVPRuntimeBridgeResult,
): DataRealityAwareMVPRuntimeState {
  const selectedObjectId = resolveSelectedObjectId(input);
  const selectedObjectIds = resolveSelectedObjectIds(input, selectedObjectId);
  const selectedIdSet = new Set(selectedObjectIds);
  const focusedObjectId = input.focusedObjectId;

  const objects = Object.freeze(
    bridgeResult.objectRealities.map((entry) =>
      projectObjectRuntimeState(entry, selectedIdSet, focusedObjectId),
    ),
  );

  const stateId = [
    "mvp-runtime-reality",
    normalizeToken(bridgeResult.datasetId),
    normalizeToken(bridgeResult.bridgeId),
    normalizeToken(focusedObjectId),
    normalizeToken(selectedObjectId),
    normalizeToken(input.currentWorkspace),
    normalizeToken(input.presentationState),
  ].join(":");

  const focus: DataRealityAwareMVPRuntimeFocus = Object.freeze({
    ...(bridgeResult.recommendedFocus?.subjectId !== undefined
      ? { recommendedObjectId: bridgeResult.recommendedFocus.subjectId }
      : {}),
    ...(selectedObjectId !== undefined ? { selectedObjectId } : {}),
    ...(focusedObjectId !== undefined ? { focusedObjectId } : {}),
  });

  const context: DataRealityAwareMVPRuntimeContext = Object.freeze({
    ...(input.currentWorkspace !== undefined
      ? { workspace: input.currentWorkspace }
      : {}),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
    ...(selectedObjectId !== undefined ? { selectedObjectId } : {}),
    selectedObjectIds,
    ...(focusedObjectId !== undefined ? { focusedObjectId } : {}),
    ...(input.requestedIntent !== undefined
      ? { requestedIntent: input.requestedIntent }
      : {}),
    ...(input.responseMode !== undefined
      ? { responseMode: input.responseMode }
      : {}),
    ...(input.currentGoalId !== undefined
      ? { currentGoalId: input.currentGoalId }
      : {}),
    ...(input.currentScenarioId !== undefined
      ? { currentScenarioId: input.currentScenarioId }
      : {}),
    ...(input.currentDecisionId !== undefined
      ? { currentDecisionId: input.currentDecisionId }
      : {}),
  });

  const provenance: DataRealityAwareMVPRuntimeProvenance = Object.freeze({
    runtimeIdentity: dataRealityAwareMVPRuntimeStateIdentity,
    runtimeVersion: dataRealityAwareMVPRuntimeStateVersion,
    runtimeNamespace: dataRealityAwareMVPRuntimeStateNamespace,
    runtimePhase: dataRealityAwareMVPRuntimeStatePhase,
    runtimeStateCertified: false,
    chain: DATA_REALITY_AWARE_MVP_RUNTIME_STATE_PROVENANCE_CHAIN,
    immediateDataRealitySource: dataRealityAdvisorMVPBridgeIdentity,
    immediateSourceVersion: dataRealityAdvisorMVPBridgeVersion,
    immediateSourceNamespace: dataRealityAdvisorMVPBridgeNamespace,
    bridgeProvenance: bridgeResult.provenance,
  });

  return Object.freeze({
    stateId,
    identity: IDENTITY,
    datasetIdentity: Object.freeze({
      datasetId: bridgeResult.datasetId,
      bridgeId: bridgeResult.bridgeId,
      integrationId: bridgeResult.integrationId,
    }),
    overallCondition: bridgeResult.overallCondition,
    summary: bridgeResult.executiveSummary,
    objects,
    prioritizedSubjects: bridgeResult.prioritizedSubjects,
    focus,
    attention: Object.freeze({
      dominantAttention: bridgeResult.overallCondition.attention,
      dominantState: bridgeResult.overallCondition.dominantState,
      requiresImmediateAttention:
        bridgeResult.overallCondition.requiresImmediateAttention,
      hasUnresolvedReality: bridgeResult.overallCondition.hasUnresolvedReality,
    }),
    recommendations: Object.freeze({
      ...(bridgeResult.recommendedFocus !== undefined
        ? { recommendedFocus: bridgeResult.recommendedFocus }
        : {}),
      actions: bridgeResult.recommendedActions,
    }),
    unresolved: Object.freeze({
      objectIds: bridgeResult.unresolvedObjectIds,
      unavailableInformation: bridgeResult.unavailableInformation,
    }),
    context,
    provenance,
    sourceReality: bridgeResult,
  });
}

// ─── Core API ───────────────────────────────────────────────────────────────

/**
 * Primary P2:2 resolver.
 *
 * Invokes P2:1 exclusively, then integrates runtime interaction context into
 * one deterministic Reality State for NEX-MVP consumers.
 */
export function resolveDataRealityAwareMVPRuntimeState(
  input: ResolveDataRealityAwareMVPRuntimeStateInput,
): DataRealityAwareMVPRuntimeState {
  const selectedObjectId = resolveSelectedObjectId(input);
  const selectedObjectIds = resolveSelectedObjectIds(input, selectedObjectId);

  const bridgeInput: ResolveDataRealityAdvisorMVPRuntimeInput = {
    dataset: input.dataset,
    ...(input.focusedObjectId !== undefined
      ? { focusedObjectId: input.focusedObjectId }
      : {}),
    ...(selectedObjectIds.length > 0
      ? { selectedObjectIds }
      : {}),
    ...(input.currentWorkspace !== undefined
      ? { currentWorkspace: input.currentWorkspace }
      : {}),
    ...(input.currentGoalId !== undefined
      ? { currentGoalId: input.currentGoalId }
      : {}),
    ...(input.currentScenarioId !== undefined
      ? { currentScenarioId: input.currentScenarioId }
      : {}),
    ...(input.currentDecisionId !== undefined
      ? { currentDecisionId: input.currentDecisionId }
      : {}),
    ...(input.requestedIntent !== undefined
      ? { requestedIntent: input.requestedIntent }
      : {}),
    ...(input.responseMode !== undefined
      ? { responseMode: input.responseMode }
      : {}),
    ...(input.includeSecondaryGuidance !== undefined
      ? { includeSecondaryGuidance: input.includeSecondaryGuidance }
      : {}),
    ...(input.maxEvidenceItems !== undefined
      ? { maxEvidenceItems: input.maxEvidenceItems }
      : {}),
    ...(input.maxCandidates !== undefined
      ? { maxCandidates: input.maxCandidates }
      : {}),
  };

  const bridgeResult = resolveDataRealityAdvisorForMVPRuntime(bridgeInput);
  return projectRuntimeState(input, bridgeResult);
}
