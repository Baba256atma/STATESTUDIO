/**
 * P2:1 — Certified Advisor → MVP Runtime Bridge.
 *
 * Converts the certified P1:6 Executive Advisor integration result into a
 * stable, MVP-consumable runtime representation.
 *
 * Does NOT:
 *   - recompute KPIs / thresholds
 *   - resolve executive states
 *   - invent advisor meaning or recommendations
 *   - perform React / UI / network work
 *
 * Chain:
 *   NexoraDataset
 *   → P0 Certified Data Reality
 *   → P1 Certified Executive Advisor (P1:6)
 *   → P2:1 MVP Runtime Bridge (this module)
 *   → Existing NEX-MVP Runtime consumers (later P2 phases)
 */

import type { NexoraDataset, NexoraExecutiveState } from "./dataRealityContracts.ts";
import type {
  DataRealityAdvisorAttentionLevel,
  DataRealityAdvisorState,
  DataRealityAdvisorSubjectKind,
  DataRealityExecutiveObservation,
} from "./dataRealityAwareExecutiveAdvisorFoundation.ts";
import type { DataRealityAdvisorResponseTone } from "./dataRealityExecutiveAdvisorResponseComposition.ts";
import type {
  DataRealityExecutiveGuidance,
  DataRealityExecutiveGuidancePriority,
} from "./dataRealityExecutiveAdvisoryResolution.ts";
import {
  resolveDataRealityExecutiveAdvisorIntegration,
  type DataRealityExecutiveAdvisorIntegrationResult,
  type DataRealityExecutiveAdvisorTraceability,
  type ResolveDataRealityExecutiveAdvisorIntegrationInput,
} from "./dataRealityExecutiveAdvisorIntegration.ts";
import { NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS } from "./dataRealityStageProjection.ts";

/** Certified P1:6 upstream identity — literal to avoid circular init coupling. */
const CERTIFIED_P1_INTEGRATION_IDENTITY =
  "P1:6/DataRealityExecutiveAdvisorIntegration" as const;
const CERTIFIED_P1_INTEGRATION_VERSION = "1.0.0" as const;
const CERTIFIED_P1_INTEGRATION_NAMESPACE =
  "nexora.data-reality.executive-advisor.integration" as const;

// ─── Identity ───────────────────────────────────────────────────────────────

export const dataRealityAdvisorMVPBridgeIdentity =
  "P2:1/DataRealityAdvisorMVPBridge" as const;

export const dataRealityAdvisorMVPBridgeVersion = "2.1.0" as const;

export const dataRealityAdvisorMVPBridgeNamespace =
  "nexora.data-reality.advisor.mvp-bridge" as const;

export const dataRealityAdvisorMVPBridgePhase =
  "CertifiedAdvisorToMVPRuntimeBridge" as const;

export const dataRealityAdvisorMVPBridgeArchitecturalRole =
  "DataRealityAwareExecutiveExperienceIntegration" as const;

export interface DataRealityAdvisorMVPBridgeIdentity {
  readonly identity: "P2:1/DataRealityAdvisorMVPBridge";
  readonly version: "2.1.0";
  readonly namespace: "nexora.data-reality.advisor.mvp-bridge";
  readonly phase: "CertifiedAdvisorToMVPRuntimeBridge";
  readonly architecturalRole: "DataRealityAwareExecutiveExperienceIntegration";
}

const IDENTITY: DataRealityAdvisorMVPBridgeIdentity = Object.freeze({
  identity: dataRealityAdvisorMVPBridgeIdentity,
  version: dataRealityAdvisorMVPBridgeVersion,
  namespace: dataRealityAdvisorMVPBridgeNamespace,
  phase: dataRealityAdvisorMVPBridgePhase,
  architecturalRole: dataRealityAdvisorMVPBridgeArchitecturalRole,
});

export function getDataRealityAdvisorMVPBridgeIdentity(): DataRealityAdvisorMVPBridgeIdentity {
  return IDENTITY;
}

/**
 * Architectural boundary markers. P2:1 is a bridge phase — not yet certified.
 */
export const DATA_REALITY_ADVISOR_MVP_BRIDGE_BOUNDARY = Object.freeze({
  architecturalRole: dataRealityAdvisorMVPBridgeArchitecturalRole,
  ownsKpiComputation: false as const,
  ownsExecutiveStateResolution: false as const,
  ownsAdvisorReasoning: false as const,
  ownsRecommendationLogic: false as const,
  duplicatesBusinessThresholds: false as const,
  performsUiWork: false as const,
  performsNetworkWork: false as const,
  bridgeCertified: false as const,
  consumesCertifiedP1Integration: true as const,
  certifiedUpstreamIdentity: CERTIFIED_P1_INTEGRATION_IDENTITY,
});

export const DATA_REALITY_ADVISOR_MVP_BRIDGE_PROVENANCE_CHAIN = Object.freeze([
  "NexoraDataset",
  "P0 Data Reality",
  "P1 Executive Advisor",
  "P2:1 MVP Bridge",
] as const);

// ─── Input / resolution contracts ───────────────────────────────────────────

/**
 * Canonical bridge input — identical to the certified P1:6 integration input.
 * Prefer the active NexoraDataset; do not invent a parallel dataset structure.
 */
export type ResolveDataRealityAdvisorMVPRuntimeInput =
  ResolveDataRealityExecutiveAdvisorIntegrationInput;

export type DataRealityAdvisorMVPObjectResolutionStatus =
  | "resolved"
  | "unresolved"
  | "unavailable";

/**
 * Runtime-safe object-level executive/advisor reality for MVP consumers.
 * Fields are projected from certified upstream truth only.
 */
export interface DataRealityAdvisorMVPObjectReality {
  readonly objectId: string;
  readonly objectKey?: string;
  readonly nexoraObjectId?: string;
  /** P1 advisor reality state — preserves unresolved/unknown. */
  readonly executiveState: DataRealityAdvisorState;
  /** P0 business executive state when present; omitted when unresolved. */
  readonly p0ExecutiveState?: NexoraExecutiveState;
  readonly attention: DataRealityAdvisorAttentionLevel;
  /** Guidance priority when P1 provides guidance for this object. */
  readonly priority?: DataRealityExecutiveGuidancePriority;
  readonly advisorMeaning: string;
  readonly evidenceIds: readonly string[];
  readonly recommendedAction?: DataRealityExecutiveGuidance;
  readonly hasData: boolean;
  readonly hasKPI: boolean;
  readonly resolutionStatus: DataRealityAdvisorMVPObjectResolutionStatus;
}

export interface DataRealityAdvisorMVPPrioritizedSubject {
  readonly subjectId: string;
  readonly subjectKind: DataRealityAdvisorSubjectKind;
  readonly executiveState: DataRealityAdvisorState;
  readonly attention: DataRealityAdvisorAttentionLevel;
  readonly priority?: DataRealityExecutiveGuidancePriority;
  readonly guidanceId?: string;
  readonly observationId?: string;
}

export interface DataRealityAdvisorMVPOverallCondition {
  readonly dominantState: DataRealityAdvisorState;
  readonly attention: DataRealityAdvisorAttentionLevel;
  readonly requiresImmediateAttention: boolean;
  readonly hasUnresolvedReality: boolean;
  readonly tone: DataRealityAdvisorResponseTone;
}

export interface DataRealityAdvisorMVPExecutiveSummary {
  readonly headline: string;
  readonly summary: string;
  readonly primarySubjectKind: DataRealityAdvisorSubjectKind;
  readonly primarySubjectId?: string;
}

export interface DataRealityAdvisorMVPRecommendedFocus {
  readonly subjectKind: DataRealityAdvisorSubjectKind;
  readonly subjectId?: string;
  readonly guidanceId?: string;
  readonly observationId?: string;
}

export interface DataRealityAdvisorMVPBridgeProvenance {
  readonly bridgeIdentity: "P2:1/DataRealityAdvisorMVPBridge";
  readonly bridgeVersion: "2.1.0";
  readonly bridgeNamespace: "nexora.data-reality.advisor.mvp-bridge";
  readonly bridgePhase: "CertifiedAdvisorToMVPRuntimeBridge";
  readonly bridgeCertified: false;
  readonly chain: typeof DATA_REALITY_ADVISOR_MVP_BRIDGE_PROVENANCE_CHAIN;
  readonly datasetId: string;
  readonly snapshotDatasetId: string;
  readonly certifiedP1Identity: typeof CERTIFIED_P1_INTEGRATION_IDENTITY;
  readonly certifiedP1Version: typeof CERTIFIED_P1_INTEGRATION_VERSION;
  readonly certifiedP1Namespace: typeof CERTIFIED_P1_INTEGRATION_NAMESPACE;
  readonly integrationId: string;
  readonly contextId: string;
  readonly responseId: string;
  readonly traceability: DataRealityExecutiveAdvisorTraceability;
}

/**
 * Stable MVP-facing bridge result.
 * Prefer references to canonical P1 types over duplicated domain models.
 */
export interface DataRealityAdvisorMVPRuntimeBridgeResult {
  readonly bridgeId: string;
  readonly identity: DataRealityAdvisorMVPBridgeIdentity;
  readonly datasetId: string;
  readonly integrationId: string;
  readonly overallCondition: DataRealityAdvisorMVPOverallCondition;
  readonly executiveSummary: DataRealityAdvisorMVPExecutiveSummary;
  readonly prioritizedSubjects: readonly DataRealityAdvisorMVPPrioritizedSubject[];
  readonly objectRealities: readonly DataRealityAdvisorMVPObjectReality[];
  readonly recommendedFocus?: DataRealityAdvisorMVPRecommendedFocus;
  /** Preserved P1 guidance — empty when P1 provides none (never fabricated). */
  readonly recommendedActions: readonly DataRealityExecutiveGuidance[];
  readonly unresolvedObjectIds: readonly string[];
  readonly unavailableInformation: readonly string[];
  readonly evidenceIds: readonly string[];
  readonly provenance: DataRealityAdvisorMVPBridgeProvenance;
  /** Full certified P1 integration result — preserved without reinterpretation. */
  readonly certifiedAdvisorResult: DataRealityExecutiveAdvisorIntegrationResult;
}

// ─── Projection helpers (no business rules) ─────────────────────────────────

function normalizeToken(value: string | undefined): string {
  if (!value || value.length === 0) return "none";
  return value.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function objectKeyForSubjectId(
  subjectId: string,
  result: DataRealityExecutiveAdvisorIntegrationResult,
): string | undefined {
  const stageBinding = NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS.find(
    (binding) =>
      binding.mvpStageObjectId === subjectId ||
      binding.objectKey === subjectId ||
      binding.nexoraObjectId === subjectId,
  );
  if (stageBinding) return stageBinding.objectKey;

  const fromState = result.dataRealitySnapshot.objectStates.find(
    (entry) =>
      entry.objectKey === subjectId || entry.nexoraObjectId === subjectId,
  );
  if (fromState) return fromState.objectKey;

  const fromKpi = result.dataRealitySnapshot.kpis.find(
    (entry) =>
      entry.objectKey === subjectId || entry.nexoraObjectId === subjectId,
  );
  if (fromKpi) return fromKpi.objectKey;

  if (
    result.dataRealitySnapshot.facts.some(
      (entry) => entry.objectKey === subjectId,
    )
  ) {
    return subjectId;
  }

  return undefined;
}

function nexoraObjectIdForSubject(
  subjectId: string,
  objectKey: string | undefined,
  result: DataRealityExecutiveAdvisorIntegrationResult,
): string | undefined {
  if (objectKey) {
    const fromState = result.dataRealitySnapshot.objectStates.find(
      (entry) => entry.objectKey === objectKey,
    )?.nexoraObjectId;
    if (fromState) return fromState;
    const fromKpi = result.dataRealitySnapshot.kpis.find(
      (entry) => entry.objectKey === objectKey,
    )?.nexoraObjectId;
    if (fromKpi) return fromKpi;
    const stageBinding = NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS.find(
      (binding) => binding.objectKey === objectKey,
    );
    if (stageBinding) return stageBinding.nexoraObjectId;
  }

  const stageBySubject = NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS.find(
    (binding) =>
      binding.mvpStageObjectId === subjectId ||
      binding.nexoraObjectId === subjectId,
  );
  return stageBySubject?.nexoraObjectId;
}

function p0ExecutiveStateForObjectKey(
  objectKey: string | undefined,
  result: DataRealityExecutiveAdvisorIntegrationResult,
): NexoraExecutiveState | undefined {
  if (!objectKey) return undefined;
  return result.dataRealitySnapshot.objectStates.find(
    (entry) => entry.objectKey === objectKey,
  )?.state;
}

function resolutionStatusFromAdvisorState(
  state: DataRealityAdvisorState,
): DataRealityAdvisorMVPObjectResolutionStatus {
  if (state === "unresolved") return "unresolved";
  return "resolved";
}

function primaryGuidanceForSubject(
  subjectId: string,
  guidance: readonly DataRealityExecutiveGuidance[],
): DataRealityExecutiveGuidance | undefined {
  return guidance.find((entry) => entry.subjectId === subjectId);
}

function projectObjectReality(
  observation: DataRealityExecutiveObservation,
  result: DataRealityExecutiveAdvisorIntegrationResult,
): DataRealityAdvisorMVPObjectReality {
  const objectKey = objectKeyForSubjectId(observation.subjectId, result);
  const hasData =
    objectKey !== undefined &&
    result.dataRealitySnapshot.facts.some(
      (entry) => entry.objectKey === objectKey,
    );
  const hasKPI =
    objectKey !== undefined &&
    result.dataRealitySnapshot.kpis.some(
      (entry) => entry.objectKey === objectKey,
    );
  const p0ExecutiveState = p0ExecutiveStateForObjectKey(objectKey, result);
  const recommendedAction = primaryGuidanceForSubject(
    observation.subjectId,
    result.advisoryResolution.guidance,
  );
  const resolutionStatus = resolutionStatusFromAdvisorState(observation.state);
  const nexoraObjectId = nexoraObjectIdForSubject(
    observation.subjectId,
    objectKey,
    result,
  );

  return Object.freeze({
    objectId: observation.subjectId,
    ...(objectKey !== undefined ? { objectKey } : {}),
    ...(nexoraObjectId !== undefined ? { nexoraObjectId } : {}),
    executiveState: observation.state,
    ...(p0ExecutiveState !== undefined ? { p0ExecutiveState } : {}),
    attention: observation.attention,
    ...(recommendedAction !== undefined
      ? { priority: recommendedAction.priority }
      : {}),
    advisorMeaning: observation.executiveMeaning,
    evidenceIds: observation.evidenceIds,
    ...(recommendedAction !== undefined ? { recommendedAction } : {}),
    hasData,
    hasKPI,
    resolutionStatus:
      resolutionStatus === "unresolved" && !hasData && !hasKPI
        ? "unavailable"
        : resolutionStatus,
  });
}

function projectPrioritizedSubjects(
  result: DataRealityExecutiveAdvisorIntegrationResult,
): readonly DataRealityAdvisorMVPPrioritizedSubject[] {
  const observationBySubject = new Map(
    result.advisorContext.observations.map((entry) => [entry.subjectId, entry]),
  );
  const seen = new Set<string>();
  const prioritized: DataRealityAdvisorMVPPrioritizedSubject[] = [];

  for (const guidance of result.advisoryResolution.guidance) {
    if (seen.has(guidance.subjectId)) continue;
    seen.add(guidance.subjectId);
    const observation = observationBySubject.get(guidance.subjectId);
    prioritized.push(
      Object.freeze({
        subjectId: guidance.subjectId,
        subjectKind: guidance.subjectKind,
        executiveState: observation?.state ?? "unresolved",
        attention: observation?.attention ?? "none",
        priority: guidance.priority,
        guidanceId: guidance.id,
        ...(observation !== undefined ? { observationId: observation.id } : {}),
      }),
    );
  }

  for (const observation of result.advisorContext.observations) {
    if (seen.has(observation.subjectId)) continue;
    seen.add(observation.subjectId);
    prioritized.push(
      Object.freeze({
        subjectId: observation.subjectId,
        subjectKind: observation.subjectKind,
        executiveState: observation.state,
        attention: observation.attention,
        observationId: observation.id,
      }),
    );
  }

  return Object.freeze(prioritized);
}

function collectUnavailableInformation(
  result: DataRealityExecutiveAdvisorIntegrationResult,
): readonly string[] {
  const items: string[] = [];
  for (const observation of result.advisorContext.observations) {
    if (observation.state === "unresolved") {
      items.push(observation.executiveMeaning);
    }
  }
  for (const section of result.response.sections) {
    if (section.kind === "caveat" && section.text.length > 0) {
      items.push(section.text);
    }
  }
  return Object.freeze(Array.from(new Set(items)));
}

function projectBridgeResult(
  inputDataset: NexoraDataset,
  result: DataRealityExecutiveAdvisorIntegrationResult,
): DataRealityAdvisorMVPRuntimeBridgeResult {
  const objectObservations = result.advisorContext.observations.filter(
    (entry) => entry.subjectKind === "object",
  );
  const objectRealities = Object.freeze(
    objectObservations.map((observation) =>
      projectObjectReality(observation, result),
    ),
  );
  const unresolvedObjectIds = Object.freeze(
    objectRealities
      .filter(
        (entry) =>
          entry.resolutionStatus === "unresolved" ||
          entry.resolutionStatus === "unavailable" ||
          entry.executiveState === "unresolved",
      )
      .map((entry) => entry.objectId),
  );

  const primaryGuidance = result.advisoryResolution.guidance.find(
    (entry) => entry.id === result.advisoryResolution.primaryGuidanceId,
  );
  const primaryObservation = result.advisorContext.observations.find(
    (entry) => entry.subjectId === result.response.primarySubjectId,
  );

  const recommendedFocus: DataRealityAdvisorMVPRecommendedFocus | undefined =
    result.response.primarySubjectId !== undefined ||
    result.response.primarySubjectKind !== undefined
      ? Object.freeze({
          subjectKind: result.response.primarySubjectKind,
          ...(result.response.primarySubjectId !== undefined
            ? { subjectId: result.response.primarySubjectId }
            : {}),
          ...(primaryGuidance !== undefined
            ? { guidanceId: primaryGuidance.id }
            : {}),
          ...(primaryObservation !== undefined
            ? { observationId: primaryObservation.id }
            : {}),
        })
      : undefined;

  const bridgeId = [
    "advisor-mvp-bridge",
    normalizeToken(inputDataset.id),
    normalizeToken(result.integrationId),
  ].join(":");

  const provenance: DataRealityAdvisorMVPBridgeProvenance = Object.freeze({
    bridgeIdentity: dataRealityAdvisorMVPBridgeIdentity,
    bridgeVersion: dataRealityAdvisorMVPBridgeVersion,
    bridgeNamespace: dataRealityAdvisorMVPBridgeNamespace,
    bridgePhase: dataRealityAdvisorMVPBridgePhase,
    bridgeCertified: false,
    chain: DATA_REALITY_ADVISOR_MVP_BRIDGE_PROVENANCE_CHAIN,
    datasetId: inputDataset.id,
    snapshotDatasetId: result.dataRealitySnapshot.datasetId,
    certifiedP1Identity: CERTIFIED_P1_INTEGRATION_IDENTITY,
    certifiedP1Version: CERTIFIED_P1_INTEGRATION_VERSION,
    certifiedP1Namespace: CERTIFIED_P1_INTEGRATION_NAMESPACE,
    integrationId: result.integrationId,
    contextId: result.advisorContext.contextId,
    responseId: result.response.id,
    traceability: result.traceability,
  });

  return Object.freeze({
    bridgeId,
    identity: IDENTITY,
    datasetId: inputDataset.id,
    integrationId: result.integrationId,
    overallCondition: Object.freeze({
      dominantState: result.advisorContext.dominantState,
      attention: result.advisorContext.attention,
      requiresImmediateAttention: result.response.requiresImmediateAttention,
      hasUnresolvedReality: result.response.hasUnresolvedReality,
      tone: result.response.tone,
    }),
    executiveSummary: Object.freeze({
      headline: result.response.headline,
      summary: result.response.summary,
      primarySubjectKind: result.response.primarySubjectKind,
      ...(result.response.primarySubjectId !== undefined
        ? { primarySubjectId: result.response.primarySubjectId }
        : {}),
    }),
    prioritizedSubjects: projectPrioritizedSubjects(result),
    objectRealities,
    ...(recommendedFocus !== undefined ? { recommendedFocus } : {}),
    recommendedActions: result.advisoryResolution.guidance,
    unresolvedObjectIds,
    unavailableInformation: collectUnavailableInformation(result),
    evidenceIds: result.advisorContext.evidence.map((entry) => entry.id),
    provenance,
    certifiedAdvisorResult: result,
  });
}

// ─── Core API ───────────────────────────────────────────────────────────────

/**
 * Primary P2:1 bridge API.
 *
 * Accepts the canonical P1:6 input contract, invokes the certified Executive
 * Advisor integration, and projects the result into the stable MVP runtime
 * bridge contract without duplicating upstream business logic.
 */
export function resolveDataRealityAdvisorForMVPRuntime(
  input: ResolveDataRealityAdvisorMVPRuntimeInput,
): DataRealityAdvisorMVPRuntimeBridgeResult {
  const certifiedAdvisorResult =
    resolveDataRealityExecutiveAdvisorIntegration(input);
  return projectBridgeResult(input.dataset, certifiedAdvisorResult);
}

/**
 * Conceptual alias preferred by MVP runtime consumers.
 * Identical to {@link resolveDataRealityAdvisorForMVPRuntime}.
 */
export function resolveMVPExecutiveAdvisorReality(
  input: ResolveDataRealityAdvisorMVPRuntimeInput,
): DataRealityAdvisorMVPRuntimeBridgeResult {
  return resolveDataRealityAdvisorForMVPRuntime(input);
}
