/**
 * RTC-2:3 — Executive Journal Runtime Model.
 *
 * Canonical immutable domain model for the Executive Journal Runtime.
 * Consumes RTC-2:2 Registry public surface only and resolves RTC-2:1
 * foundation through registry lookup. Structure only — no validation,
 * behaviour, persistence, or UI.
 *
 * Ownership: owned exclusively by RTC-2:3.
 *
 * Public exports:
 *   ExecutiveJournalRuntimeModelId
 *   ExecutiveJournalRuntimeModelVersion
 *   ExecutiveJournalRuntimeModelName
 *   ExecutiveJournalRuntimeModelNamespace
 *   ExecutiveJournalRuntimeModelStatus
 *   ExecutiveJournalRuntimeModelReadiness
 *   ExecutiveJournalRuntimeModel
 *   getExecutiveJournalRuntimeModelSummary()
 */

import {
  ExecutiveJournalRuntimeRegistry,
  resolveExecutiveJournalRuntimeById,
} from "./executiveJournalRuntimeRegistry.ts";
import {
  ExecutiveJournalRuntimeModelContractNames,
  ExecutiveJournalRuntimeModelContracts,
  ExecutiveJournalRuntimeModelInvariants,
} from "./executiveJournalRuntimeModelContracts.ts";
import {
  ExecutiveJournalAuthorityReferenceEntityModel,
  ExecutiveJournalCommitmentEntityModel,
  ExecutiveJournalCorrectionEntityModel,
  ExecutiveJournalDecisionEntityModel,
  ExecutiveJournalDisclosureRecordEntityModel,
  ExecutiveJournalDispositionRecordEntityModel,
  ExecutiveJournalDisputeEntityModel,
  ExecutiveJournalEntityModel,
  ExecutiveJournalEvidenceReferenceEntityModel,
  ExecutiveJournalExceptionEntityModel,
  ExecutiveJournalIntentEntityModel,
  ExecutiveJournalOutcomeEntityModel,
  ExecutiveJournalProjectionEntityModel,
  ExecutiveJournalRiskEntityModel,
  ExecutiveJournalRuntimeEntityModels,
  ExecutiveJournalRuntimeEntityNames,
} from "./executiveJournalRuntimeModelEntities.ts";
import {
  ExecutiveJournalRuntimeModelId,
  ExecutiveJournalRuntimeModelIdentity,
  ExecutiveJournalRuntimeModelName,
  ExecutiveJournalRuntimeModelNamespace,
  ExecutiveJournalRuntimeModelNextPhase,
  ExecutiveJournalRuntimeModelReadiness,
  ExecutiveJournalRuntimeModelStatus,
  ExecutiveJournalRuntimeModelVersion,
} from "./executiveJournalRuntimeModelIdentity.ts";
import {
  ExecutiveJournalRuntimeModelLifecycle,
  ExecutiveJournalRuntimeStateDistinctions,
} from "./executiveJournalRuntimeModelLifecycle.ts";
import {
  ExecutiveJournalModelAiMustNot,
  ExecutiveJournalRuntimeModelBoundaries,
  ExecutiveJournalRuntimeModelDecisions,
  ExecutiveJournalRuntimeModelMetadata,
  ExecutiveJournalRuntimeModelOpenIssues,
  ExecutiveJournalRuntimeModelOwnership,
  ExecutiveJournalRuntimeModelPrinciples,
  ExecutiveJournalRuntimeModelProhibitedSurfaces,
} from "./executiveJournalRuntimeModelMetadata.ts";
import type { ExecutiveJournalRuntimeModelSummary } from "./executiveJournalRuntimeModelTypes.ts";

export {
  ExecutiveJournalRuntimeModelId,
  ExecutiveJournalRuntimeModelIdentity,
  ExecutiveJournalRuntimeModelName,
  ExecutiveJournalRuntimeModelNamespace,
  ExecutiveJournalRuntimeModelNextPhase,
  ExecutiveJournalRuntimeModelReadiness,
  ExecutiveJournalRuntimeModelStatus,
  ExecutiveJournalRuntimeModelVersion,
};

const foundationControlId =
  ExecutiveJournalRuntimeRegistry.canonicalEntry.controlId;

const foundationResolveResult =
  resolveExecutiveJournalRuntimeById(foundationControlId);

if (foundationResolveResult.ok !== true) {
  throw new Error(
    "RTC-2:3 model requires RTC-2:1 foundation to resolve through RTC-2:2 registry.",
  );
}

const resolvedFoundationEntry = foundationResolveResult.entry;
const resolvedFoundation = resolvedFoundationEntry.foundation;

/**
 * Canonical immutable Executive Journal Runtime Model aggregate.
 */
export const ExecutiveJournalRuntimeModel = Object.freeze({
  identity: ExecutiveJournalRuntimeModelIdentity,
  registry: ExecutiveJournalRuntimeRegistry,
  foundationEntry: resolvedFoundationEntry,
  foundation: resolvedFoundation,
  lifecycle: ExecutiveJournalRuntimeModelLifecycle,
  stateDistinctions: ExecutiveJournalRuntimeStateDistinctions,
  contracts: ExecutiveJournalRuntimeModelContracts,
  contractNames: ExecutiveJournalRuntimeModelContractNames,
  invariants: ExecutiveJournalRuntimeModelInvariants,
  root: ExecutiveJournalEntityModel,
  entityNames: ExecutiveJournalRuntimeEntityNames,
  entities: ExecutiveJournalRuntimeEntityModels,
  journal: ExecutiveJournalEntityModel,
  intent: ExecutiveJournalIntentEntityModel,
  decision: ExecutiveJournalDecisionEntityModel,
  commitment: ExecutiveJournalCommitmentEntityModel,
  risk: ExecutiveJournalRiskEntityModel,
  exception: ExecutiveJournalExceptionEntityModel,
  outcome: ExecutiveJournalOutcomeEntityModel,
  evidenceReference: ExecutiveJournalEvidenceReferenceEntityModel,
  authorityReference: ExecutiveJournalAuthorityReferenceEntityModel,
  correction: ExecutiveJournalCorrectionEntityModel,
  dispute: ExecutiveJournalDisputeEntityModel,
  projection: ExecutiveJournalProjectionEntityModel,
  disclosureRecord: ExecutiveJournalDisclosureRecordEntityModel,
  dispositionRecord: ExecutiveJournalDispositionRecordEntityModel,
  principles: ExecutiveJournalRuntimeModelPrinciples,
  decisions: ExecutiveJournalRuntimeModelDecisions,
  openIssues: ExecutiveJournalRuntimeModelOpenIssues,
  ownership: ExecutiveJournalRuntimeModelOwnership,
  boundaries: ExecutiveJournalRuntimeModelBoundaries,
  prohibitedSurfaces: ExecutiveJournalRuntimeModelProhibitedSurfaces,
  aiMustNot: ExecutiveJournalModelAiMustNot,
  metadata: ExecutiveJournalRuntimeModelMetadata,
  status: ExecutiveJournalRuntimeModelStatus,
  readiness: ExecutiveJournalRuntimeModelReadiness,
  nextPhase: ExecutiveJournalRuntimeModelNextPhase,
  statistics: Object.freeze({
    entityCount: ExecutiveJournalRuntimeEntityModels.length,
    contractCount: ExecutiveJournalRuntimeModelContracts.length,
    invariantCount: ExecutiveJournalRuntimeModelInvariants.length,
    openIssueCount: ExecutiveJournalRuntimeModelOpenIssues.length,
    principleCount: ExecutiveJournalRuntimeModelPrinciples.length,
    lifecycleStateCount: ExecutiveJournalRuntimeModelLifecycle.stateCount,
    rootFieldCount: ExecutiveJournalEntityModel.fieldCount,
  }),
  upstreamDependencies: Object.freeze([
    "RTC-2:2 — Executive Journal Runtime Registry",
  ]),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  storesRuntimeValues: false as const,
  executesTransitions: false as const,
  performsValidation: false as const,
  mutatesRuntimeState: false as const,
  renderingBehavior: false as const,
  calculatesMetrics: false as const,
  invokesAi: false as const,
  accessesDatabases: false as const,
  managesPersistence: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  aiAuthorityBehavior: false as const,
  resolvesOpenIssues: false as const,
  importsFoundationDirectly: false as const,
  resolvesFoundationViaRegistry: true as const,
  validationPhase: false as const,
  manifestPhase: false as const,
  platformPhase: false as const,
} as const);

/** Deterministic frozen Model summary. */
export function getExecutiveJournalRuntimeModelSummary():
  ExecutiveJournalRuntimeModelSummary {
  return Object.freeze({
    modelId: ExecutiveJournalRuntimeModelId,
    version: ExecutiveJournalRuntimeModelVersion,
    name: ExecutiveJournalRuntimeModelName,
    namespace: ExecutiveJournalRuntimeModelNamespace,
    status: ExecutiveJournalRuntimeModelStatus,
    readiness: ExecutiveJournalRuntimeModelReadiness,
    rootEntity: "Journal" as const,
    entityCount: ExecutiveJournalRuntimeEntityModels.length,
    contractCount: ExecutiveJournalRuntimeModelContracts.length,
    invariantCount: ExecutiveJournalRuntimeModelInvariants.length,
    openIssueCount: ExecutiveJournalRuntimeModelOpenIssues.length,
    sourceRegistry: "RTC-2:2/ExecutiveJournalRuntimeRegistry" as const,
    nextPhase: ExecutiveJournalRuntimeModelNextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveJournalRuntimeModel = () =>
  ExecutiveJournalRuntimeModel;
