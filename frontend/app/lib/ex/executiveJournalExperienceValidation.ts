/**
 * EX-2:4 — Executive Journal Experience Validation aggregate.
 *
 * The sole upstream runtime dependency is the exact EX-2:3 Model.
 */

import { ExecutiveJournalExperienceModel } from "./executiveJournalExperienceModel.ts";
import {
  ExecutiveJournalExperienceValidationContracts,
  ExecutiveJournalExperienceValidationIssueCodes,
  ExecutiveJournalExperienceValidationResults,
  ExecutiveJournalExperienceValidationSeverities,
  ExecutiveJournalExperienceValidationSubjectKinds,
  assertExecutiveJournalExperienceValidationIssueCode,
  assertExecutiveJournalExperienceValidationSubjectKind,
  isExecutiveJournalExperienceValidationIssueCode,
  isExecutiveJournalExperienceValidationResult,
  isExecutiveJournalExperienceValidationSeverity,
  isExecutiveJournalExperienceValidationSubjectKind,
} from "./executiveJournalExperienceValidationContracts.ts";
import {
  ExecutiveJournalExperienceValidationApprovedAliases,
  ExecutiveJournalExperienceValidationId,
  ExecutiveJournalExperienceValidationIdentity,
  ExecutiveJournalExperienceValidationNamespace,
  ExecutiveJournalExperienceValidationNextPhase,
  ExecutiveJournalExperienceValidationPreviousPhase,
  ExecutiveJournalExperienceValidationReadiness,
  ExecutiveJournalExperienceValidationStatus,
  assertExecutiveJournalExperienceValidationIdentity,
  resolveExecutiveJournalExperienceValidationIdentity,
} from "./executiveJournalExperienceValidationIdentity.ts";
import {
  ExecutiveJournalExperienceValidationLifecycle,
  ExecutiveJournalExperienceValidationLifecycleStates,
  assertExecutiveJournalExperienceValidationLifecycleTransition,
  canTransitionExecutiveJournalExperienceValidationLifecycle,
  isExecutiveJournalExperienceValidationLifecycleState,
} from "./executiveJournalExperienceValidationLifecycle.ts";
import {
  ExecutiveJournalExperienceValidationAuthorization,
  ExecutiveJournalExperienceValidationBoundaries,
  ExecutiveJournalExperienceValidationDecisions,
  ExecutiveJournalExperienceValidationMetadata,
  assertExecutiveJournalExperienceValidationBoundaryIdentity,
  isExecutiveJournalExperienceValidationBoundaryIdentity,
} from "./executiveJournalExperienceValidationMetadata.ts";
import {
  ExecutiveJournalExperienceValidationRuleFamilies,
  ExecutiveJournalExperienceValidationRules,
  assertExecutiveJournalExperienceValidationRuleFamily,
  isExecutiveJournalExperienceValidationRuleFamily,
  validateExecutiveJournalExperienceMetadata,
} from "./executiveJournalExperienceValidationRules.ts";
import type {
  ExecutiveJournalExperienceValidationInput,
  ExecutiveJournalExperienceValidationSummary,
} from "./executiveJournalExperienceValidationTypes.ts";

export {
  ExecutiveJournalExperienceValidationApprovedAliases,
  ExecutiveJournalExperienceValidationAuthorization,
  ExecutiveJournalExperienceValidationBoundaries,
  ExecutiveJournalExperienceValidationContracts,
  ExecutiveJournalExperienceValidationDecisions,
  ExecutiveJournalExperienceValidationId,
  ExecutiveJournalExperienceValidationIdentity,
  ExecutiveJournalExperienceValidationIssueCodes,
  ExecutiveJournalExperienceValidationLifecycle,
  ExecutiveJournalExperienceValidationLifecycleStates,
  ExecutiveJournalExperienceValidationMetadata,
  ExecutiveJournalExperienceValidationNamespace,
  ExecutiveJournalExperienceValidationNextPhase,
  ExecutiveJournalExperienceValidationPreviousPhase,
  ExecutiveJournalExperienceValidationReadiness,
  ExecutiveJournalExperienceValidationResults,
  ExecutiveJournalExperienceValidationRuleFamilies,
  ExecutiveJournalExperienceValidationRules,
  ExecutiveJournalExperienceValidationSeverities,
  ExecutiveJournalExperienceValidationStatus,
  ExecutiveJournalExperienceValidationSubjectKinds,
  assertExecutiveJournalExperienceValidationIdentity,
  assertExecutiveJournalExperienceValidationBoundaryIdentity,
  assertExecutiveJournalExperienceValidationIssueCode,
  assertExecutiveJournalExperienceValidationLifecycleTransition,
  assertExecutiveJournalExperienceValidationSubjectKind,
  canTransitionExecutiveJournalExperienceValidationLifecycle,
  isExecutiveJournalExperienceValidationIssueCode,
  isExecutiveJournalExperienceValidationBoundaryIdentity,
  isExecutiveJournalExperienceValidationLifecycleState,
  isExecutiveJournalExperienceValidationResult,
  isExecutiveJournalExperienceValidationSeverity,
  isExecutiveJournalExperienceValidationSubjectKind,
  assertExecutiveJournalExperienceValidationRuleFamily,
  isExecutiveJournalExperienceValidationRuleFamily,
  resolveExecutiveJournalExperienceValidationIdentity,
};

const projection = ExecutiveJournalExperienceModel.getEntity("JournalProjection");
const filterModel = ExecutiveJournalExperienceModel.getEntity("JournalFilterModel");
const tier0EvidenceReference =
  ExecutiveJournalExperienceModel.getEntity("Tier0EvidenceReference");
const provenance =
  ExecutiveJournalExperienceModel.getEntity("ProvenancePresentation");
const correctionSupersession =
  ExecutiveJournalExperienceModel.getEntity(
    "CorrectionSupersessionPresentation",
  );

if (
  projection === null
  || filterModel === null
  || tier0EvidenceReference === null
  || provenance === null
  || correctionSupersession === null
) {
  throw new Error("EX-2:4 requires the complete sealed EX-2:3 entity catalogue.");
}

export const ExecutiveJournalExperienceValidationUpstream = Object.freeze({
  model: ExecutiveJournalExperienceModel,
  registry: ExecutiveJournalExperienceModel.registry,
  resolvedRegistryEntry: ExecutiveJournalExperienceModel.resolvedRegistryEntry,
  foundation: ExecutiveJournalExperienceModel.foundation,
  modelIdentity: ExecutiveJournalExperienceModel.identity,
  modelReadiness: ExecutiveJournalExperienceModel.readiness,
  registryIdentity: ExecutiveJournalExperienceModel.registry.identity,
  registrySeal: ExecutiveJournalExperienceModel.registry.sealed,
  foundationIdentity: ExecutiveJournalExperienceModel.foundation.identity,
  foundationReadiness: ExecutiveJournalExperienceModel.foundation.readiness,
  entities: ExecutiveJournalExperienceModel.entities,
  relationships: ExecutiveJournalExperienceModel.relationships,
  modelDecisions: ExecutiveJournalExperienceModel.decisions,
  foundationArchitectureDecisionLedger:
    ExecutiveJournalExperienceModel.upstream.foundationArchitectureDecisionLedger,
  tier0EvidenceLedger:
    ExecutiveJournalExperienceModel.upstream.tier0SupportingEvidenceLedger,
  registryAuthorization:
    ExecutiveJournalExperienceModel.upstream.registryAuthorization,
  foundationAuthorization:
    ExecutiveJournalExperienceModel.foundation.authorizationScope,
  foundationAuthorizingDecision:
    ExecutiveJournalExperienceModel.foundation.authorizingDecision,
  modelAuthorization: ExecutiveJournalExperienceModel.authorization,
  openIssues: ExecutiveJournalExperienceModel.unresolvedIssues,
  pendingGates: ExecutiveJournalExperienceModel.pendingGates,
  upstreamChain: Object.freeze([
    ExecutiveJournalExperienceValidationId,
    "EX-2:3/ExecutiveJournalExperienceModel",
    "EX-2:2/ExecutiveJournalExperienceRegistry",
    "EX-2:1/ExecutiveJournalExperienceFoundation",
  ] as const),
  exactReferencesPreserved: true as const,
  adEx212InjectedIntoFoundationOrRegistryLedger: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

export const ExecutiveJournalExperienceValidationAggregateDescriptor =
  Object.freeze({
    aggregateId:
      "EX-2:4/ExecutiveJournalExperienceValidationAggregate" as const,
    modelIdentity: "EX-2:3/ExecutiveJournalExperienceModel" as const,
    ruleCount: 20 as const,
    familyCount: 17 as const,
    complete: true as const,
    metadataOnly: true as const,
    deterministic: true as const,
    immutable: true as const,
  });

export const ExecutiveJournalExperienceValidationSummaryValue =
  Object.freeze({
    identity: ExecutiveJournalExperienceValidationId,
    namespace: ExecutiveJournalExperienceValidationNamespace,
    status: ExecutiveJournalExperienceValidationStatus,
    readiness: ExecutiveJournalExperienceValidationReadiness,
    previousPhase: ExecutiveJournalExperienceValidationPreviousPhase,
    nextPhase: ExecutiveJournalExperienceValidationNextPhase,
    resultCount: 2,
    severityCount: 4,
    ruleCount: 20,
    ruleFamilyCount: 17,
    subjectKindCount: 30,
    issueCodeCount: 39,
    contractCount: 8,
    decisionCount: 6,
    openIssueCount: 13,
    pendingGateCount: 3,
    upstreamChain: ExecutiveJournalExperienceValidationUpstream.upstreamChain,
    authorizationDecisionId: "AD-EX2-12",
    metadataOnly: true,
    sideEffectFree: true,
    deterministic: true,
    failClosed: true,
    repairsInput: false,
    mutatesInput: false,
    ex25Created: false,
    ex25Authorized: false,
    ciLintClassification: "CiStillBlockedByParkedReactCompilerDebt",
  } as const satisfies ExecutiveJournalExperienceValidationSummary);

export const ExecutiveJournalExperienceValidationDependencyDeclaration =
  Object.freeze({
    runtimeDependency: "EX-2:3/ExecutiveJournalExperienceModel" as const,
    modelOnly: true as const,
    registryAndFoundationReachedThroughModelOnly: true as const,
    prohibitedDependencies: Object.freeze([] as const),
    dynamicImports: false as const,
    requireCalls: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveJournalExperienceValidationEvidence = Object.freeze({
  complete: true as const,
  ruleIds: Object.freeze(
    ExecutiveJournalExperienceValidationRules.map((descriptor) =>
      descriptor.ruleId
    ),
  ),
  metadataOnly: true as const,
  tier0EvidenceReclassifiedAsFormalEvidence: false as const,
  immutable: true as const,
});

const validationContext = Object.freeze({
  model: ExecutiveJournalExperienceModel,
  aggregate: ExecutiveJournalExperienceValidationAggregateDescriptor,
  summary: ExecutiveJournalExperienceValidationSummaryValue,
  lifecycle: ExecutiveJournalExperienceValidationLifecycle,
  entities: ExecutiveJournalExperienceModel.entities,
  entityKinds: ExecutiveJournalExperienceModel.entityKinds,
  relationships: ExecutiveJournalExperienceModel.relationships,
  relationshipKinds: Object.freeze(
    ExecutiveJournalExperienceModel.relationships.map(
      (relationship) => relationship.kind,
    ),
  ),
  vocabularies: ExecutiveJournalExperienceModel.vocabularies,
  projection,
  filterModel,
  tier0EvidenceReference,
  provenance,
  correctionSupersession,
});

export const ExecutiveJournalExperienceValidationCanonicalInput =
  Object.freeze({
    model: ExecutiveJournalExperienceModel,
    aggregate: ExecutiveJournalExperienceValidationAggregateDescriptor,
    summary: ExecutiveJournalExperienceValidationSummaryValue,
    identity: ExecutiveJournalExperienceValidationId,
    lifecycle: ExecutiveJournalExperienceValidationLifecycle,
    entities: ExecutiveJournalExperienceModel.entities,
    relationships: ExecutiveJournalExperienceModel.relationships,
    vocabularies: ExecutiveJournalExperienceModel.vocabularies,
    contracts: ExecutiveJournalExperienceValidationContracts,
    boundaries: ExecutiveJournalExperienceValidationBoundaries,
    projection,
    filterModel,
    tier0EvidenceReference,
    provenance,
    correctionSupersession,
    dependencyDeclaration:
      ExecutiveJournalExperienceValidationDependencyDeclaration,
    validationEvidence: ExecutiveJournalExperienceValidationEvidence,
    normalizationRequested: false,
    repairRequested: false,
    coercionRequested: false,
    silentStrippingRequested: false,
    mutationRequested: false,
  } as const satisfies ExecutiveJournalExperienceValidationInput);

export const validateExecutiveJournalExperience = (
  input: unknown,
) => validateExecutiveJournalExperienceMetadata(input, validationContext);

export const ExecutiveJournalExperienceValidationCanonicalResult =
  validateExecutiveJournalExperience(
    ExecutiveJournalExperienceValidationCanonicalInput,
  );

export const getExecutiveJournalExperienceValidationSummary =
  (): ExecutiveJournalExperienceValidationSummary =>
    ExecutiveJournalExperienceValidationSummaryValue;

export const ExecutiveJournalExperienceValidation = Object.freeze({
  identity: ExecutiveJournalExperienceValidationIdentity,
  lifecycle: ExecutiveJournalExperienceValidationLifecycle,
  types: Object.freeze({
    results: ExecutiveJournalExperienceValidationResults,
    severities: ExecutiveJournalExperienceValidationSeverities,
    subjects: ExecutiveJournalExperienceValidationSubjectKinds,
    issueCodes: ExecutiveJournalExperienceValidationIssueCodes,
  }),
  contracts: ExecutiveJournalExperienceValidationContracts,
  rules: ExecutiveJournalExperienceValidationRules,
  ruleFamilies: ExecutiveJournalExperienceValidationRuleFamilies,
  issueCodeCatalogue: ExecutiveJournalExperienceValidationIssueCodes,
  metadata: ExecutiveJournalExperienceValidationMetadata,
  model: ExecutiveJournalExperienceModel,
  upstream: ExecutiveJournalExperienceValidationUpstream,
  decisions: ExecutiveJournalExperienceValidationDecisions,
  openIssues: ExecutiveJournalExperienceModel.unresolvedIssues,
  pendingGates: ExecutiveJournalExperienceModel.pendingGates,
  authorization: ExecutiveJournalExperienceValidationAuthorization,
  boundaries: ExecutiveJournalExperienceValidationBoundaries,
  aggregateDescriptor: ExecutiveJournalExperienceValidationAggregateDescriptor,
  canonicalInput: ExecutiveJournalExperienceValidationCanonicalInput,
  canonicalResult: ExecutiveJournalExperienceValidationCanonicalResult,
  validate: validateExecutiveJournalExperience,
  getSummary: getExecutiveJournalExperienceValidationSummary,
  status: ExecutiveJournalExperienceValidationStatus,
  readiness: ExecutiveJournalExperienceValidationReadiness,
  metadataOnly: true as const,
  sideEffectFree: true as const,
  deterministic: true as const,
  immutable: true as const,
  failClosed: true as const,
  repairsInput: false as const,
  mutatesInput: false as const,
  ex25Created: false as const,
  ex25Authorized: false as const,
});
