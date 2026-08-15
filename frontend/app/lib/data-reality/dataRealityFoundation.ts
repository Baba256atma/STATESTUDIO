/**
 * P0:1 — Data Reality Foundation.
 *
 * Establishes the canonical data-reality model for Nexora Executive Stage.
 * Foundation only: contracts, deterministic normalization, validation seams,
 * and demo dataset access. No Stage mutations. No KPI engine. No runtime apply.
 *
 * Desired dependency direction (future):
 *   Dataset → Data Reality → Object/KPI interpretation → Executive Runtime → Presentation → Stage
 *
 * Future boundary illustration (not implemented here):
 *   const snapshot = resolveDataReality(dataset);
 *   runtime.applyDataReality(snapshot);
 *
 * Reuse targets for later P0 phases (do not duplicate):
 *   - NOL `NexoraObjectIdentity.id` via Public Index
 *   - NOL KPI / executive facets (projection only)
 *   - NEX-MVP Stage fixtures as replaceable presentation projection
 *   - REX / NEX-CI Public Indexes for runtime attention/focus
 *   - Presentation depth minimum|report|operation (separate dimension)
 */

import type {
  NexoraBoundBusinessFact,
  NexoraBusinessFact,
  NexoraDataRealityIdentity,
  NexoraDataRealitySnapshot,
  NexoraDataset,
  NexoraDatasetRecord,
  NexoraExecutiveState,
  NexoraExecutiveStateRule,
  NexoraKPIDefinition,
  NexoraKPIResult,
  NexoraResolvedObjectDataBinding,
} from "./dataRealityContracts.ts";
import {
  NEXORA_EXECUTIVE_STATES,
  NEXORA_EXECUTIVE_STATE_MEANING,
  NEXORA_EXECUTIVE_STATE_TO_NOL_STATUS_MEANING,
  NEXORA_PRESENTATION_DEPTH_STATES,
} from "./dataRealityContracts.ts";
import {
  validateNexoraDataset,
  type NexoraDataRealityValidationResult,
} from "./dataRealityValidation.ts";
import {
  bindBusinessFactsToNexoraObjects,
  type NexoraObjectBindingIssue,
} from "./objectDataBinding.ts";
import {
  computeNexoraKPIs,
  type NexoraKPIComputationIssue,
} from "./kpiComputation.ts";
import {
  resolveObjectExecutiveStates,
  type NexoraExecutiveStateIssue,
  type NexoraExecutiveStateResolutionResult,
} from "./executiveStateResolution.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const dataRealityFoundationIdentity =
  "P0:1/NexoraDataRealityFoundation" as const;

export const dataRealityFoundationVersion = "1.0.0" as const;

export const dataRealityFoundationNamespace =
  "nexora.data-reality.foundation" as const;

export const dataRealityFoundationPhase = "DataRealityFoundation" as const;

export const dataRealityFoundationArchitecturalRole =
  "BusinessDataRealityContractsAndNormalization" as const;

const IDENTITY: NexoraDataRealityIdentity = Object.freeze({
  id: dataRealityFoundationIdentity,
  version: dataRealityFoundationVersion,
  namespace: dataRealityFoundationNamespace,
  phase: dataRealityFoundationPhase,
  architecturalRole: dataRealityFoundationArchitecturalRole,
});

export function getDataRealityFoundationIdentity(): NexoraDataRealityIdentity {
  return IDENTITY;
}

export const DATA_REALITY_FOUNDATION_BOUNDARY = Object.freeze({
  architecturalRole: dataRealityFoundationArchitecturalRole,
  ownsStageMutation: false as const,
  ownsThreeJs: false as const,
  ownsReactState: false as const,
  ownsKpiComputationEngine: false as const,
  ownsExecutiveStateResolutionEngine: false as const,
  ownsRuntimeApply: false as const,
  duplicatesNexoraObjectModel: false as const,
  duplicatesPresentationDepth: false as const,
  stageMayImportDemoDataset: false as const,
  uiMayOwnKpiBusinessLogic: false as const,
  futureIntegrationSurface: "NEX-MVP catalog / REX Public Indexes" as const,
  futureObjectIdentityTarget: "NOL NexoraObjectIdentity.id" as const,
});

// ─── Deterministic normalization ────────────────────────────────────────────

function compareRecords(
  a: NexoraDatasetRecord,
  b: NexoraDatasetRecord,
): number {
  const byObject = a.objectKey.localeCompare(b.objectKey);
  if (byObject !== 0) return byObject;
  return a.metricKey.localeCompare(b.metricKey);
}

function freezeRecord(record: NexoraDatasetRecord): NexoraDatasetRecord {
  return Object.freeze({
    objectKey: record.objectKey,
    metricKey: record.metricKey,
    value: record.value,
    ...(record.unit !== undefined ? { unit: record.unit } : {}),
    ...(record.observedAt !== undefined
      ? { observedAt: record.observedAt }
      : {}),
  });
}

function freezeFact(fact: NexoraBusinessFact): NexoraBusinessFact {
  return Object.freeze({
    objectKey: fact.objectKey,
    metricKey: fact.metricKey,
    value: fact.value,
    sourceDatasetId: fact.sourceDatasetId,
    ...(fact.unit !== undefined ? { unit: fact.unit } : {}),
  });
}

/**
 * Deterministically normalize a dataset into business facts.
 * Does not mutate the input dataset. Sorting is stable by objectKey, metricKey.
 */
export function normalizeDatasetToBusinessFacts(
  dataset: NexoraDataset,
): readonly NexoraBusinessFact[] {
  const sorted = [...dataset.records].sort(compareRecords);
  return Object.freeze(
    sorted.map((record) =>
      freezeFact({
        objectKey: record.objectKey,
        metricKey: record.metricKey,
        value: record.value,
        unit: record.unit,
        sourceDatasetId: dataset.id,
      }),
    ),
  );
}

/**
 * Produce a shallow immutable clone of a dataset with replaced records.
 * Used for Dataset A → Snapshot A / Dataset B → Snapshot B preparation.
 * Never mutates the original dataset.
 */
export function withDatasetRecords(
  dataset: NexoraDataset,
  records: readonly NexoraDatasetRecord[],
): NexoraDataset {
  return Object.freeze({
    id: dataset.id,
    name: dataset.name,
    version: dataset.version,
    capturedAt: dataset.capturedAt,
    source: dataset.source,
    familyId: dataset.familyId,
    scenario: dataset.scenario,
    records: Object.freeze(records.map(freezeRecord)),
  });
}

/**
 * Clone a dataset into a different scenario under the same family.
 * Architecture prep for Dataset A (baseline) vs Dataset B (operational-pressure).
 */
export function withDatasetScenario(
  dataset: NexoraDataset,
  options: {
    readonly id: string;
    readonly scenario: NexoraDataset["scenario"];
    readonly capturedAt: string;
    readonly records: readonly NexoraDatasetRecord[];
    readonly name?: string;
    readonly version?: string;
  },
): NexoraDataset {
  return Object.freeze({
    id: options.id,
    name: options.name ?? dataset.name,
    version: options.version ?? dataset.version,
    capturedAt: options.capturedAt,
    source: dataset.source,
    familyId: dataset.familyId,
    scenario: options.scenario,
    records: Object.freeze(options.records.map(freezeRecord)),
  });
}

export function validateDataRealityDataset(
  dataset: NexoraDataset,
): NexoraDataRealityValidationResult {
  return validateNexoraDataset(dataset);
}

export function isNexoraExecutiveState(
  value: unknown,
): value is NexoraExecutiveState {
  return (NEXORA_EXECUTIVE_STATES as readonly unknown[]).includes(value);
}

export function isPresentationDepthState(value: unknown): boolean {
  return (NEXORA_PRESENTATION_DEPTH_STATES as readonly unknown[]).includes(
    value,
  );
}

/** True when a KPI definition carries no presentation/Stage fields. */
export function isPresentationIndependentKpiDefinition(
  definition: NexoraKPIDefinition,
): boolean {
  const keys = Object.keys(definition);
  const allowed = new Set([
    "id",
    "objectKey",
    "name",
    "requiredMetrics",
    "unit",
    "computationKind",
  ]);
  if (!keys.every((key) => allowed.has(key))) return false;
  const forbiddenTokens = [
    "color",
    "material",
    "animation",
    "camera",
    "three",
    "component",
    "mesh",
  ];
  const serialized = JSON.stringify(definition).toLowerCase();
  return !forbiddenTokens.some((token) => serialized.includes(token));
}

export function getExecutiveStateMeaning(
  state: NexoraExecutiveState,
): string {
  return NEXORA_EXECUTIVE_STATE_MEANING[state];
}

export function getExecutiveStateNolStatusMeaning(
  state: NexoraExecutiveState,
): string {
  return NEXORA_EXECUTIVE_STATE_TO_NOL_STATUS_MEANING[state];
}

export type {
  NexoraBoundBusinessFact,
  NexoraBusinessFact,
  NexoraDataRealityIdentity,
  NexoraDataRealitySnapshot,
  NexoraDataset,
  NexoraDatasetId,
  NexoraDatasetRecord,
  NexoraDatasetScenario,
  NexoraDatasetSource,
  NexoraExecutiveState,
  NexoraExecutiveStateReason,
  NexoraExecutiveStateRule,
  NexoraKPIComputationKind,
  NexoraKPIDefinition,
  NexoraKPIResult,
  NexoraKPIThresholdBand,
  NexoraObjectDataBinding,
  NexoraObjectExecutiveState,
  NexoraPresentationDepthState,
  NexoraResolvedObjectDataBinding,
} from "./dataRealityContracts.ts";

export {
  NEXORA_DATASET_SCENARIOS,
  NEXORA_DATASET_SOURCES,
  NEXORA_EXECUTIVE_STATES,
  NEXORA_EXECUTIVE_STATE_MEANING,
  NEXORA_EXECUTIVE_STATE_TO_NOL_STATUS_MEANING,
  NEXORA_KPI_COMPUTATION_KINDS,
  NEXORA_PRESENTATION_DEPTH_STATES,
} from "./dataRealityContracts.ts";

export {
  validateNexoraBusinessFacts,
  validateNexoraDataset,
  validateNexoraKPIDefinitions,
  validateNexoraObjectDataBindings,
} from "./dataRealityValidation.ts";

export type {
  NexoraDataRealityValidationCode,
  NexoraDataRealityValidationIssue,
  NexoraDataRealityValidationResult,
} from "./dataRealityValidation.ts";

export {
  OBJECT_DATA_BINDING_BOUNDARY,
  bindBusinessFactToNexoraObject,
  bindBusinessFactsToNexoraObjects,
  getObjectDataBindingIdentity,
  isValidNexoraObjectIdentityId,
  objectDataBindingIdentity,
  objectDataBindingVersion,
  resolveNexoraObjectBinding,
  validateAndResolveObjectDataBindings,
} from "./objectDataBinding.ts";

export type {
  NexoraObjectBindingIssue,
  NexoraObjectBindingIssueCode,
  NexoraObjectBindingRegistryValidationResult,
  NexoraObjectBindingResult,
} from "./objectDataBinding.ts";

export {
  KPI_COMPUTATION_BOUNDARY,
  computeNexoraKPI,
  computeNexoraKPIs,
  getKpiComputationIdentity,
  kpiComputationIdentity,
  kpiComputationVersion,
} from "./kpiComputation.ts";

export type {
  NexoraKPIComputationContext,
  NexoraKPIComputationIssue,
  NexoraKPIComputationIssueCode,
  NexoraKPIComputationResult,
} from "./kpiComputation.ts";

export {
  EXECUTIVE_STATE_RESOLUTION_BOUNDARY,
  NEXORA_EXECUTIVE_STATE_SEVERITY,
  executiveStateResolutionIdentity,
  executiveStateResolutionVersion,
  getExecutiveStateResolutionIdentity,
  matchesExecutiveStateBand,
  resolveKPIExecutiveState,
  resolveObjectExecutiveStates,
} from "./executiveStateResolution.ts";

export type {
  NexoraExecutiveStateIssue,
  NexoraExecutiveStateIssueCode,
  NexoraExecutiveStateResolutionResult,
  NexoraKPIExecutiveStateResolution,
} from "./executiveStateResolution.ts";

export {
  DATA_REALITY_STAGE_PROJECTION_BOUNDARY,
  NEXORA_DATA_REALITY_RUNTIME_ATTENTION_MAP,
  NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS,
  dataRealityStageProjectionIdentity,
  dataRealityStageProjectionVersion,
  getDataRealityStageIdentityBindings,
  getDataRealityStageProjectionIdentity,
  mapExecutiveStateToMvpRuntimeAttention,
  projectDataRealityToExecutiveRuntime,
  validateDataRealityStageIdentityBindings,
} from "./dataRealityStageProjection.ts";

export type {
  NexoraDataRealityRuntimeAttentionMapping,
  NexoraDataRealityStageIdentityBinding,
  NexoraDataRealityStageObjectProjection,
  NexoraDataRealityStageProjectionIssue,
  NexoraDataRealityStageProjectionIssueCode,
  NexoraDataRealityStageProjectionResult,
  NexoraMvpStageAttention,
  NexoraMvpStageStatus,
} from "./dataRealityStageProjection.ts";

export {
  NEXORA_DATA_REALITY_CERTIFIED_INVARIANTS,
  NEXORA_DATA_REALITY_KNOWN_LIMITATIONS,
  NEXORA_DATA_REALITY_MANUAL_VISUAL_EVIDENCE,
  NEXORA_DATA_REALITY_P0_STATUS_LABEL,
  createDataRealityCertificationResult,
  dataRealityCertificationIdentity,
  dataRealityCertificationVersion,
  getDataRealityCertificationIdentity,
} from "./dataRealityCertification.ts";

export type {
  NexoraDataRealityCertificationCheck,
  NexoraDataRealityCertificationResult,
  NexoraDataRealityCertificationStatus,
  NexoraDataRealityCertifiedInvariant,
} from "./dataRealityCertification.ts";

export {
  DATA_REALITY_ADVISOR_ATTENTION_LEVELS,
  DATA_REALITY_ADVISOR_EVIDENCE_SOURCE_KINDS,
  DATA_REALITY_ADVISOR_INTENT_KINDS,
  DATA_REALITY_ADVISOR_INTENT_MEANING,
  DATA_REALITY_ADVISOR_STATES,
  DATA_REALITY_ADVISOR_STATE_MEANING,
  DATA_REALITY_ADVISOR_SUBJECT_KINDS,
  DATA_REALITY_AWARE_ADVISOR_CORE_PRINCIPLE,
  DATA_REALITY_AWARE_ADVISOR_FOUNDATION_CAPABILITIES,
  DATA_REALITY_AWARE_ADVISOR_FOUNDATION_INVARIANTS,
  DATA_REALITY_AWARE_ADVISOR_FOUNDATION_PRINCIPLES,
  dataRealityAwareExecutiveAdvisorFoundationArchitecturalRole,
  dataRealityAwareExecutiveAdvisorFoundationIdentity,
  dataRealityAwareExecutiveAdvisorFoundationNamespace,
  dataRealityAwareExecutiveAdvisorFoundationPhase,
  dataRealityAwareExecutiveAdvisorFoundationVersion,
  getDataRealityAwareExecutiveAdvisorFoundationIdentity,
  getDataRealityAwareExecutiveAdvisorFoundationMetadata,
  isDataRealityAdvisorAttentionLevel,
  isDataRealityAdvisorEvidenceSourceKind,
  isDataRealityAdvisorIntentKind,
  isDataRealityAdvisorState,
  isDataRealityAdvisorSubjectKind,
} from "./dataRealityAwareExecutiveAdvisorFoundation.ts";

export type {
  BuildDataRealityAwareAdvisorContextInput,
  DataRealityAdvisorAttentionLevel,
  DataRealityAdvisorEvidence,
  DataRealityAdvisorEvidenceSourceKind,
  DataRealityAdvisorIntentKind,
  DataRealityAdvisorQuestion,
  DataRealityAdvisorState,
  DataRealityAdvisorSubjectKind,
  DataRealityAdvisoryCandidate,
  DataRealityAwareAdvisorContext,
  DataRealityAwareAdvisorFoundationPrinciple,
  DataRealityAwareExecutiveAdvisorFoundationCapability,
  DataRealityAwareExecutiveAdvisorFoundationIdentity,
  DataRealityAwareExecutiveAdvisorFoundationMetadata,
  DataRealityExecutiveObservation,
} from "./dataRealityAwareExecutiveAdvisorFoundation.ts";

export {
  DATA_REALITY_ADVISOR_ATTENTION_SEVERITY_ORDER,
  DATA_REALITY_ADVISOR_STATE_SEVERITY_ORDER,
  DATA_REALITY_ADVISOR_STATE_TO_ATTENTION,
  DATA_REALITY_EXECUTIVE_OBSERVATION_RESOLUTION_CAPABILITIES,
  DATA_REALITY_EXECUTIVE_OBSERVATION_RESOLUTION_INVARIANTS,
  DATA_REALITY_TO_ADVISOR_STATE_MAP,
  dataRealityExecutiveObservationResolutionArchitecturalRole,
  dataRealityExecutiveObservationResolutionIdentity,
  dataRealityExecutiveObservationResolutionNamespace,
  dataRealityExecutiveObservationResolutionPhase,
  dataRealityExecutiveObservationResolutionVersion,
  getDataRealityExecutiveObservationResolutionIdentity,
  resolveAdvisorAttentionFromAdvisorState,
  resolveAdvisorStateFromDataReality,
  resolveDataRealityAdvisorEvidence,
  resolveDataRealityExecutiveObservationResolution,
  resolveDataRealityExecutiveObservations,
  resolveDominantDataRealityAdvisorAttention,
  resolveDominantDataRealityAdvisorState,
} from "./dataRealityExecutiveObservationResolution.ts";

export type {
  DataRealityExecutiveObservationResolutionCapability,
  DataRealityExecutiveObservationResolutionIdentity,
  DataRealityExecutiveObservationResolutionResult,
  ResolveDataRealityExecutiveObservationsInput,
} from "./dataRealityExecutiveObservationResolution.ts";

export {
  DATA_REALITY_AWARE_ADVISOR_CONTEXT_RESOLUTION_CAPABILITIES,
  DATA_REALITY_AWARE_ADVISOR_CONTEXT_RESOLUTION_INVARIANTS,
  DATA_REALITY_AWARE_ADVISOR_CONTEXT_RESOLUTION_PRINCIPLES,
  buildDataRealityAwareAdvisorContext,
  buildDataRealityAwareAdvisorContextId,
  dataRealityAwareAdvisorContextResolutionArchitecturalRole,
  dataRealityAwareAdvisorContextResolutionIdentity,
  dataRealityAwareAdvisorContextResolutionNamespace,
  dataRealityAwareAdvisorContextResolutionPhase,
  dataRealityAwareAdvisorContextResolutionVersion,
  getDataRealityAwareAdvisorContextResolutionIdentity,
  getDataRealityAwareAdvisorContextResolutionMetadata,
  resolveDataRealityAdvisorAvailableIntents,
  resolveDataRealityAdvisorPrimarySubject,
  resolveDataRealityAdvisorRelevantEvidence,
  resolveDataRealityAdvisorRelevantObservations,
  resolveDataRealityAdvisorSelectedObjectIds,
  resolveDataRealityAwareAdvisorContext,
} from "./dataRealityAwareAdvisorContextResolution.ts";

export type {
  DataRealityAdvisorPrimarySubjectResolution,
  DataRealityAwareAdvisorContextResolutionCapability,
  DataRealityAwareAdvisorContextResolutionIdentity,
  DataRealityAwareAdvisorContextResolutionMetadata,
  DataRealityAwareAdvisorContextResolutionPrinciple,
  DataRealityAwareAdvisorContextResolutionResult,
  ResolveDataRealityAdvisorAvailableIntentsInput,
} from "./dataRealityAwareAdvisorContextResolution.ts";

export {
  DATA_REALITY_ADVISOR_STATE_ADVISORY_SEVERITY_ORDER,
  DATA_REALITY_ADVISOR_STATE_TO_GUIDANCE_PRIORITY,
  DATA_REALITY_EXECUTIVE_ADVISORY_CORE_PRINCIPLE,
  DATA_REALITY_EXECUTIVE_ADVISORY_RESOLUTION_CAPABILITIES,
  DATA_REALITY_EXECUTIVE_ADVISORY_RESOLUTION_INVARIANTS,
  DATA_REALITY_EXECUTIVE_ADVISORY_RESOLUTION_PRINCIPLES,
  DATA_REALITY_EXECUTIVE_GUIDANCE_KINDS,
  DATA_REALITY_EXECUTIVE_GUIDANCE_PRIORITIES,
  DATA_REALITY_EXECUTIVE_GUIDANCE_PRIORITY_ORDER,
  dataRealityExecutiveAdvisoryResolutionArchitecturalRole,
  dataRealityExecutiveAdvisoryResolutionIdentity,
  dataRealityExecutiveAdvisoryResolutionNamespace,
  dataRealityExecutiveAdvisoryResolutionPhase,
  dataRealityExecutiveAdvisoryResolutionVersion,
  getDataRealityExecutiveAdvisoryResolutionIdentity,
  getDataRealityExecutiveAdvisoryResolutionMetadata,
  resolveDataRealityAdvisoryCandidates,
  resolveDataRealityExecutiveAdvisoryResolution,
  resolveDataRealityExecutiveGuidance,
  resolveGuidancePriorityFromAdvisorState,
} from "./dataRealityExecutiveAdvisoryResolution.ts";

export type {
  DataRealityExecutiveAdvisoryResolutionCapability,
  DataRealityExecutiveAdvisoryResolutionIdentity,
  DataRealityExecutiveAdvisoryResolutionMetadata,
  DataRealityExecutiveAdvisoryResolutionPrinciple,
  DataRealityExecutiveAdvisoryResolutionResult,
  DataRealityExecutiveGuidance,
  DataRealityExecutiveGuidanceKind,
  DataRealityExecutiveGuidancePriority,
  ResolveDataRealityExecutiveAdvisoryInput,
} from "./dataRealityExecutiveAdvisoryResolution.ts";

export {
  DATA_REALITY_ADVISOR_RESPONSE_MODES,
  DATA_REALITY_ADVISOR_RESPONSE_SECTION_KINDS,
  DATA_REALITY_ADVISOR_RESPONSE_TONES,
  DATA_REALITY_ADVISOR_STATE_TO_RESPONSE_TONE,
  DATA_REALITY_EXECUTIVE_ADVISOR_RESPONSE_COMPOSITION_CAPABILITIES,
  DATA_REALITY_EXECUTIVE_ADVISOR_RESPONSE_COMPOSITION_INVARIANTS,
  DATA_REALITY_EXECUTIVE_ADVISOR_RESPONSE_COMPOSITION_PRINCIPLES,
  DATA_REALITY_EXECUTIVE_ADVISOR_RESPONSE_CORE_PRINCIPLE,
  composeDataRealityExecutiveAdvisorResponse,
  dataRealityExecutiveAdvisorResponseCompositionArchitecturalRole,
  dataRealityExecutiveAdvisorResponseCompositionIdentity,
  dataRealityExecutiveAdvisorResponseCompositionNamespace,
  dataRealityExecutiveAdvisorResponseCompositionPhase,
  dataRealityExecutiveAdvisorResponseCompositionVersion,
  getDataRealityExecutiveAdvisorResponseCompositionIdentity,
  getDataRealityExecutiveAdvisorResponseCompositionMetadata,
  resolveDataRealityAdvisorResponseTone,
  resolveRequiresImmediateAttention,
} from "./dataRealityExecutiveAdvisorResponseComposition.ts";

export type {
  ComposeDataRealityExecutiveAdvisorResponseInput,
  DataRealityAdvisorResponseMode,
  DataRealityAdvisorResponseSectionKind,
  DataRealityAdvisorResponseTone,
  DataRealityExecutiveAdvisorResponse,
  DataRealityExecutiveAdvisorResponseCompositionCapability,
  DataRealityExecutiveAdvisorResponseCompositionIdentity,
  DataRealityExecutiveAdvisorResponseCompositionMetadata,
  DataRealityExecutiveAdvisorResponseCompositionPrinciple,
  DataRealityExecutiveAdvisorResponseSection,
} from "./dataRealityExecutiveAdvisorResponseComposition.ts";

export {
  dataRealityExecutiveAdvisorIntegrationArchitecturalRole,
  dataRealityExecutiveAdvisorIntegrationIdentity,
  dataRealityExecutiveAdvisorIntegrationNamespace,
  dataRealityExecutiveAdvisorIntegrationPhase,
  dataRealityExecutiveAdvisorIntegrationVersion,
  getDataRealityExecutiveAdvisorIntegrationIdentity,
  resolveDataRealityExecutiveAdvisorIntegration,
} from "./dataRealityExecutiveAdvisorIntegration.ts";

export type {
  DataRealityExecutiveAdvisorIntegrationIdentity,
  DataRealityExecutiveAdvisorIntegrationResult,
  DataRealityExecutiveAdvisorTraceKind,
  DataRealityExecutiveAdvisorTraceLink,
  DataRealityExecutiveAdvisorTraceability,
  ResolveDataRealityExecutiveAdvisorIntegrationInput,
} from "./dataRealityExecutiveAdvisorIntegration.ts";

// P1:6 Executive Advisor certification is NODE-ONLY (uses node:fs for source
// inspection). Do NOT re-export it from this client-safe foundation surface.
// Import certification exclusively from:
//   ./dataRealityExecutiveAdvisorCertification.ts
//
// P2:1 bridge publishes from ./dataRealityAdvisorMVPBridge.ts (not here):
// re-exporting would cycle foundation → bridge → P1:6 integration → foundation.

export type NexoraDatasetKPIRealityResult = {
  readonly status: "computed" | "partial" | "invalid";
  readonly datasetId: string;
  readonly boundFacts: readonly NexoraBoundBusinessFact[];
  readonly bindingIssues: readonly NexoraObjectBindingIssue[];
  readonly kpis: readonly NexoraKPIResult[];
  readonly issues: readonly NexoraKPIComputationIssue[];
};

export type NexoraDatasetExecutiveRealityResult = {
  readonly status: "resolved" | "partial" | "invalid";
  readonly datasetId: string;
  readonly facts: readonly NexoraBusinessFact[];
  readonly boundFacts: readonly NexoraBoundBusinessFact[];
  readonly kpis: readonly NexoraKPIResult[];
  readonly objectStates: NexoraExecutiveStateResolutionResult["objectStates"];
  readonly bindingIssues: readonly NexoraObjectBindingIssue[];
  readonly kpiIssues: readonly NexoraKPIComputationIssue[];
  readonly stateIssues: readonly NexoraExecutiveStateIssue[];
  readonly snapshot: NexoraDataRealitySnapshot;
};

/**
 * Data Reality helper: Dataset → facts → bound facts → KPI results.
 * Not a Runtime/Stage integration API.
 */
export function computeDatasetKPIReality(
  dataset: NexoraDataset,
  options: {
    readonly bindings: readonly NexoraResolvedObjectDataBinding[];
    readonly definitions: readonly NexoraKPIDefinition[];
    readonly calculatedAt?: string;
  },
): NexoraDatasetKPIRealityResult {
  const calculatedAt = options.calculatedAt ?? dataset.capturedAt;
  const facts = normalizeDatasetToBusinessFacts(dataset);
  const binding = bindBusinessFactsToNexoraObjects(facts, options.bindings);

  if (binding.status !== "bound") {
    return Object.freeze({
      status: "invalid" as const,
      datasetId: dataset.id,
      boundFacts: binding.boundFacts,
      bindingIssues: binding.issues,
      kpis: Object.freeze([]),
      issues: Object.freeze([
        Object.freeze({
          code: "OBJECT_BINDING_MISMATCH" as const,
          message:
            "Dataset facts could not be fully bound before KPI computation.",
        }),
      ]),
    });
  }

  const kpiResult = computeNexoraKPIs(options.definitions, binding.boundFacts, {
    calculatedAt,
  });

  return Object.freeze({
    status: kpiResult.status,
    datasetId: dataset.id,
    boundFacts: binding.boundFacts,
    bindingIssues: Object.freeze([]),
    kpis: kpiResult.kpis,
    issues: kpiResult.issues,
  });
}

/**
 * Build a Data Reality snapshot from facts, KPIs, and resolved object states.
 * createdAt is caller/dataset-provided — no wall-clock injection.
 */
export function buildDataRealitySnapshot(input: {
  readonly datasetId: string;
  readonly facts: readonly NexoraBusinessFact[];
  readonly kpis: readonly NexoraKPIResult[];
  readonly objectStates: NexoraExecutiveStateResolutionResult["objectStates"];
  readonly createdAt: string;
}): NexoraDataRealitySnapshot {
  return Object.freeze({
    datasetId: input.datasetId,
    facts: Object.freeze([...input.facts]),
    kpis: Object.freeze([...input.kpis]),
    objectStates: Object.freeze([...input.objectStates]),
    createdAt: input.createdAt,
  });
}

/**
 * Data Reality helper:
 * Dataset → Facts → Bindings → KPIs → Executive States → Snapshot.
 * Not a Runtime/Stage integration API.
 */
export function resolveDatasetExecutiveReality(
  dataset: NexoraDataset,
  options: {
    readonly bindings: readonly NexoraResolvedObjectDataBinding[];
    readonly definitions: readonly NexoraKPIDefinition[];
    readonly rules: readonly NexoraExecutiveStateRule[];
    readonly createdAt?: string;
  },
): NexoraDatasetExecutiveRealityResult {
  const createdAt = options.createdAt ?? dataset.capturedAt;
  const facts = normalizeDatasetToBusinessFacts(dataset);
  const kpiReality = computeDatasetKPIReality(dataset, {
    bindings: options.bindings,
    definitions: options.definitions,
    calculatedAt: createdAt,
  });

  if (kpiReality.status === "invalid") {
    const emptySnapshot = buildDataRealitySnapshot({
      datasetId: dataset.id,
      facts,
      kpis: Object.freeze([]),
      objectStates: Object.freeze([]),
      createdAt,
    });
    return Object.freeze({
      status: "invalid" as const,
      datasetId: dataset.id,
      facts,
      boundFacts: kpiReality.boundFacts,
      kpis: Object.freeze([]),
      objectStates: Object.freeze([]),
      bindingIssues: kpiReality.bindingIssues,
      kpiIssues: kpiReality.issues,
      stateIssues: Object.freeze([]),
      snapshot: emptySnapshot,
    });
  }

  const stateResult = resolveObjectExecutiveStates(
    kpiReality.kpis,
    options.rules,
  );
  const snapshot = buildDataRealitySnapshot({
    datasetId: dataset.id,
    facts,
    kpis: kpiReality.kpis,
    objectStates: stateResult.objectStates,
    createdAt,
  });

  const status =
    stateResult.status === "resolved" && kpiReality.status === "computed"
      ? "resolved"
      : stateResult.objectStates.length === 0
        ? "invalid"
        : "partial";

  return Object.freeze({
    status,
    datasetId: dataset.id,
    facts,
    boundFacts: kpiReality.boundFacts,
    kpis: kpiReality.kpis,
    objectStates: stateResult.objectStates,
    bindingIssues: kpiReality.bindingIssues,
    kpiIssues: kpiReality.issues,
    stateIssues: stateResult.issues,
    snapshot,
  });
}
