/**
 * RTC-3:3 — Executive Decision Register Model.
 *
 * Canonical immutable domain model for the Executive Decision Register.
 * Consumes RTC-3:2 Registry public surface only and resolves RTC-3:1
 * foundation through registry lookup. Structure only — no validation,
 * behaviour, persistence, or UI.
 *
 * Ownership: owned exclusively by RTC-3:3.
 *
 * Public exports:
 *   ExecutiveDecisionRegisterModelId
 *   ExecutiveDecisionRegisterModelVersion
 *   ExecutiveDecisionRegisterModelName
 *   ExecutiveDecisionRegisterModelNamespace
 *   ExecutiveDecisionRegisterModelStatus
 *   ExecutiveDecisionRegisterModelReadiness
 *   ExecutiveDecisionRegisterModel
 *   getExecutiveDecisionRegisterModelSummary()
 */

import {
  ExecutiveDecisionRegisterModelContractNames,
  ExecutiveDecisionRegisterModelContracts,
  ExecutiveDecisionRegisterModelInvariants,
} from "./executiveDecisionRegisterModelContracts.ts";
import {
  ExecutiveDecisionAlternativeEntityModel,
  ExecutiveDecisionAuthorityEntityModel,
  ExecutiveDecisionConfirmationEntityModel,
  ExecutiveDecisionConstraintEntityModel,
  ExecutiveDecisionCorrectionEntityModel,
  ExecutiveDecisionDispositionEntityModel,
  ExecutiveDecisionDisputeEntityModel,
  ExecutiveDecisionEvidenceEntityModel,
  ExecutiveDecisionOutcomeReferenceEntityModel,
  ExecutiveDecisionProjectionEntityModel,
  ExecutiveDecisionProposalEntityModel,
  ExecutiveDecisionRecordEntityModel,
  ExecutiveDecisionRegisterRootEntityModel,
  ExecutiveDecisionRegisterEntityModels,
  ExecutiveDecisionRegisterEntityNames,
  ExecutiveDecisionSupersessionEntityModel,
  isCanonicalDecisionRegisterEntityKind,
} from "./executiveDecisionRegisterModelEntities.ts";
import {
  ExecutiveDecisionRegisterModelId,
  ExecutiveDecisionRegisterModelIdentity,
  ExecutiveDecisionRegisterModelName,
  ExecutiveDecisionRegisterModelNamespace,
  ExecutiveDecisionRegisterModelNextPhase,
  ExecutiveDecisionRegisterModelReadiness,
  ExecutiveDecisionRegisterModelStatus,
  ExecutiveDecisionRegisterModelVersion,
} from "./executiveDecisionRegisterModelIdentity.ts";
import {
  ExecutiveDecisionRegisterModelLifecycle,
  ExecutiveDecisionRegisterRelationshipKinds,
  ExecutiveDecisionRegisterStateDistinctions,
  isCanonicalDecisionRegisterAuthorityState,
  isCanonicalDecisionRegisterClosureState,
  isCanonicalDecisionRegisterCurrencyState,
  isCanonicalDecisionRegisterDecisionLifecycleState,
  isCanonicalDecisionRegisterDispositionState,
  isCanonicalDecisionRegisterDisputeState,
  isCanonicalDecisionRegisterEvidenceCategory,
  isCanonicalDecisionRegisterModelLifecycleState,
  isCanonicalDecisionRegisterOriginState,
  isCanonicalDecisionRegisterPrivacyCategory,
  isCanonicalDecisionRegisterRelationshipKind,
} from "./executiveDecisionRegisterModelLifecycle.ts";
import {
  ExecutiveDecisionRegisterModelAiMustNot,
  ExecutiveDecisionRegisterModelBoundaries,
  ExecutiveDecisionRegisterModelDecisions,
  ExecutiveDecisionRegisterModelMetadata,
  ExecutiveDecisionRegisterModelOpenIssues,
  ExecutiveDecisionRegisterModelOwnership,
  ExecutiveDecisionRegisterModelPrinciples,
  ExecutiveDecisionRegisterModelProhibitedSurfaces,
  ExecutiveDecisionRegisterModelUpstreamFoundationDecisions,
  ExecutiveDecisionRegisterModelUpstreamRegistryDecisions,
} from "./executiveDecisionRegisterModelMetadata.ts";
import type { ExecutiveDecisionRegisterModelSummary } from "./executiveDecisionRegisterModelTypes.ts";
import {
  ExecutiveDecisionRegisterRegistry,
  resolveExecutiveDecisionRegisterById,
} from "./executiveDecisionRegisterRegistry.ts";

export {
  ExecutiveDecisionRegisterModelId,
  ExecutiveDecisionRegisterModelIdentity,
  ExecutiveDecisionRegisterModelName,
  ExecutiveDecisionRegisterModelNamespace,
  ExecutiveDecisionRegisterModelNextPhase,
  ExecutiveDecisionRegisterModelReadiness,
  ExecutiveDecisionRegisterModelStatus,
  ExecutiveDecisionRegisterModelVersion,
};

export {
  isCanonicalDecisionRegisterEntityKind,
  isCanonicalDecisionRegisterAuthorityState,
  isCanonicalDecisionRegisterOriginState,
  isCanonicalDecisionRegisterDecisionLifecycleState,
  isCanonicalDecisionRegisterCurrencyState,
  isCanonicalDecisionRegisterDisputeState,
  isCanonicalDecisionRegisterClosureState,
  isCanonicalDecisionRegisterDispositionState,
  isCanonicalDecisionRegisterEvidenceCategory,
  isCanonicalDecisionRegisterPrivacyCategory,
  isCanonicalDecisionRegisterRelationshipKind,
  isCanonicalDecisionRegisterModelLifecycleState,
};

if (ExecutiveDecisionRegisterRegistry.readiness !== "ReadyForModel") {
  throw new Error(
    "RTC-3:3 model requires RTC-3:2 registry readiness ReadyForModel.",
  );
}

const foundationControlId =
  ExecutiveDecisionRegisterRegistry.canonicalEntry.controlId;

const foundationResolveResult =
  resolveExecutiveDecisionRegisterById(foundationControlId);

if (foundationResolveResult.ok !== true) {
  throw new Error(
    "RTC-3:3 model requires RTC-3:1 foundation to resolve through RTC-3:2 registry.",
  );
}

const resolvedFoundationEntry = foundationResolveResult.entry;
const resolvedFoundation = resolvedFoundationEntry.foundation;

if (resolvedFoundation.readiness !== "ReadyForRegistry") {
  throw new Error(
    "RTC-3:3 model requires resolved RTC-3:1 foundation readiness ReadyForRegistry.",
  );
}

if (
  resolvedFoundationEntry !== ExecutiveDecisionRegisterRegistry.canonicalEntry
  || resolvedFoundation !== ExecutiveDecisionRegisterRegistry.foundation
) {
  throw new Error(
    "RTC-3:3 model requires exact RTC-3:2 entry and foundation object identity.",
  );
}

/**
 * Canonical immutable Executive Decision Register Model aggregate.
 */
export const ExecutiveDecisionRegisterModel = Object.freeze({
  identity: ExecutiveDecisionRegisterModelIdentity,
  registry: ExecutiveDecisionRegisterRegistry,
  foundationEntry: resolvedFoundationEntry,
  foundation: resolvedFoundation,
  lifecycle: ExecutiveDecisionRegisterModelLifecycle,
  stateDistinctions: ExecutiveDecisionRegisterStateDistinctions,
  relationshipKinds: ExecutiveDecisionRegisterRelationshipKinds,
  contracts: ExecutiveDecisionRegisterModelContracts,
  contractNames: ExecutiveDecisionRegisterModelContractNames,
  invariants: ExecutiveDecisionRegisterModelInvariants,
  root: ExecutiveDecisionRegisterRootEntityModel,
  entityNames: ExecutiveDecisionRegisterEntityNames,
  entities: ExecutiveDecisionRegisterEntityModels,
  decisionRegister: ExecutiveDecisionRegisterRootEntityModel,
  decisionRecord: ExecutiveDecisionRecordEntityModel,
  decisionProposal: ExecutiveDecisionProposalEntityModel,
  decisionAuthority: ExecutiveDecisionAuthorityEntityModel,
  decisionConfirmation: ExecutiveDecisionConfirmationEntityModel,
  decisionAlternative: ExecutiveDecisionAlternativeEntityModel,
  decisionConstraint: ExecutiveDecisionConstraintEntityModel,
  decisionEvidence: ExecutiveDecisionEvidenceEntityModel,
  decisionCorrection: ExecutiveDecisionCorrectionEntityModel,
  decisionDispute: ExecutiveDecisionDisputeEntityModel,
  decisionSupersession: ExecutiveDecisionSupersessionEntityModel,
  decisionOutcomeReference: ExecutiveDecisionOutcomeReferenceEntityModel,
  decisionProjection: ExecutiveDecisionProjectionEntityModel,
  decisionDisposition: ExecutiveDecisionDispositionEntityModel,
  principles: ExecutiveDecisionRegisterModelPrinciples,
  decisions: ExecutiveDecisionRegisterModelDecisions,
  upstreamFoundationDecisions:
    ExecutiveDecisionRegisterModelUpstreamFoundationDecisions,
  upstreamRegistryDecisions:
    ExecutiveDecisionRegisterModelUpstreamRegistryDecisions,
  openIssues: ExecutiveDecisionRegisterModelOpenIssues,
  ownership: ExecutiveDecisionRegisterModelOwnership,
  boundaries: ExecutiveDecisionRegisterModelBoundaries,
  prohibitedSurfaces: ExecutiveDecisionRegisterModelProhibitedSurfaces,
  aiMustNot: ExecutiveDecisionRegisterModelAiMustNot,
  metadata: ExecutiveDecisionRegisterModelMetadata,
  status: ExecutiveDecisionRegisterModelStatus,
  readiness: ExecutiveDecisionRegisterModelReadiness,
  nextPhase: ExecutiveDecisionRegisterModelNextPhase,
  isCanonicalEntityKind: isCanonicalDecisionRegisterEntityKind,
  statistics: Object.freeze({
    entityCount: ExecutiveDecisionRegisterEntityModels.length,
    relationshipKindCount: ExecutiveDecisionRegisterRelationshipKinds.length,
    contractCount: ExecutiveDecisionRegisterModelContracts.length,
    invariantCount: ExecutiveDecisionRegisterModelInvariants.length,
    openIssueCount: ExecutiveDecisionRegisterModelOpenIssues.length,
    principleCount: ExecutiveDecisionRegisterModelPrinciples.length,
    lifecycleStateCount: ExecutiveDecisionRegisterModelLifecycle.stateCount,
    modelDecisionCount: ExecutiveDecisionRegisterModelDecisions.length,
    rootFieldCount: ExecutiveDecisionRegisterRootEntityModel.fieldCount,
  }),
  upstreamDependencies: Object.freeze([
    "RTC-3:2 — Executive Decision Register Registry",
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
  selectsLiveAuthorityRegistry: false as const,
  privateReflectionOutsideModel: true as const,
  validationPhase: false as const,
  manifestPhase: false as const,
  platformPhase: false as const,
  importsRtc2: false as const,
  importsRtc1: false as const,
  importsApp8: false as const,
} as const);

/** Deterministic frozen Model summary. */
export function getExecutiveDecisionRegisterModelSummary():
  ExecutiveDecisionRegisterModelSummary {
  return Object.freeze({
    modelId: ExecutiveDecisionRegisterModelId,
    version: ExecutiveDecisionRegisterModelVersion,
    name: ExecutiveDecisionRegisterModelName,
    namespace: ExecutiveDecisionRegisterModelNamespace,
    status: ExecutiveDecisionRegisterModelStatus,
    readiness: ExecutiveDecisionRegisterModelReadiness,
    rootEntity: "DecisionRegister" as const,
    entityCount: ExecutiveDecisionRegisterEntityModels.length,
    relationshipKindCount: ExecutiveDecisionRegisterRelationshipKinds.length,
    contractCount: ExecutiveDecisionRegisterModelContracts.length,
    openIssueCount: ExecutiveDecisionRegisterModelOpenIssues.length,
    sourceRegistry: "RTC-3:2/ExecutiveDecisionRegisterRegistry" as const,
    nextPhase: ExecutiveDecisionRegisterModelNextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveDecisionRegisterModel = () =>
  ExecutiveDecisionRegisterModel;
