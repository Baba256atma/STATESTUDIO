/**
 * EX-2:5 — Executive Journal Experience Manifest aggregate.
 *
 * The exact EX-2:4 Validation aggregate is the sole upstream runtime
 * dependency. Earlier EX-2 phases are reached only through Validation.
 */

import { ExecutiveJournalExperienceValidation } from "./executiveJournalExperienceValidation.ts";
import {
  ExecutiveJournalExperienceManifestCapabilitySupportValues,
  ExecutiveJournalExperienceManifestCompatibilityValues,
  ExecutiveJournalExperienceManifestContracts,
  ExecutiveJournalExperienceManifestEligibilityValues,
  ExecutiveJournalExperienceManifestEntryKinds,
  ExecutiveJournalExperienceManifestReasonCodes,
  ExecutiveJournalExperienceManifestReasonDefinitions,
  ExecutiveJournalExperienceManifestRequirementStatusValues,
  assertExecutiveJournalExperienceManifestEntryKind,
  assertExecutiveJournalExperienceManifestReasonCode,
  isExecutiveJournalExperienceManifestCapabilitySupport,
  isExecutiveJournalExperienceManifestCompatibility,
  isExecutiveJournalExperienceManifestEligibility,
  isExecutiveJournalExperienceManifestEntryKind,
  isExecutiveJournalExperienceManifestReasonCode,
  isExecutiveJournalExperienceManifestRequirementStatus,
} from "./executiveJournalExperienceManifestContracts.ts";
import {
  ExecutiveJournalExperienceManifestCapabilityDefinitions,
  ExecutiveJournalExperienceManifestNonCapabilityDefinitions,
  ExecutiveJournalExperienceManifestPlatformPrerequisiteDefinitions,
  createExecutiveJournalExperienceManifestEntries,
} from "./executiveJournalExperienceManifestEntries.ts";
import {
  ExecutiveJournalExperienceManifestApprovedAliases,
  ExecutiveJournalExperienceManifestId,
  ExecutiveJournalExperienceManifestIdentity,
  ExecutiveJournalExperienceManifestNamespace,
  ExecutiveJournalExperienceManifestNextPhase,
  ExecutiveJournalExperienceManifestPreviousPhase,
  ExecutiveJournalExperienceManifestReadiness,
  ExecutiveJournalExperienceManifestStatus,
  assertExecutiveJournalExperienceManifestIdentity,
  resolveExecutiveJournalExperienceManifestIdentity,
} from "./executiveJournalExperienceManifestIdentity.ts";
import {
  ExecutiveJournalExperienceManifestLifecycle,
  ExecutiveJournalExperienceManifestLifecycleStates,
  assertExecutiveJournalExperienceManifestLifecycleTransition,
  canTransitionExecutiveJournalExperienceManifestLifecycle,
  isExecutiveJournalExperienceManifestLifecycleState,
} from "./executiveJournalExperienceManifestLifecycle.ts";
import {
  ExecutiveJournalExperienceManifestAuthorization,
  ExecutiveJournalExperienceManifestBoundaries,
  ExecutiveJournalExperienceManifestDecisions,
  ExecutiveJournalExperienceManifestMetadata,
  assertExecutiveJournalExperienceManifestBoundaryIdentity,
  isExecutiveJournalExperienceManifestBoundaryIdentity,
} from "./executiveJournalExperienceManifestMetadata.ts";
import type {
  ExecutiveJournalExperienceManifestEligibilityResult,
  ExecutiveJournalExperienceManifestInput,
  ExecutiveJournalExperienceManifestReason,
  ExecutiveJournalExperienceManifestReasonCode,
  ExecutiveJournalExperienceManifestSummary,
} from "./executiveJournalExperienceManifestTypes.ts";

export {
  ExecutiveJournalExperienceManifestApprovedAliases,
  ExecutiveJournalExperienceManifestAuthorization,
  ExecutiveJournalExperienceManifestBoundaries,
  ExecutiveJournalExperienceManifestCapabilityDefinitions,
  ExecutiveJournalExperienceManifestCapabilitySupportValues,
  ExecutiveJournalExperienceManifestCompatibilityValues,
  ExecutiveJournalExperienceManifestContracts,
  ExecutiveJournalExperienceManifestDecisions,
  ExecutiveJournalExperienceManifestEligibilityValues,
  ExecutiveJournalExperienceManifestEntryKinds,
  ExecutiveJournalExperienceManifestId,
  ExecutiveJournalExperienceManifestIdentity,
  ExecutiveJournalExperienceManifestLifecycle,
  ExecutiveJournalExperienceManifestLifecycleStates,
  ExecutiveJournalExperienceManifestMetadata,
  ExecutiveJournalExperienceManifestNamespace,
  ExecutiveJournalExperienceManifestNextPhase,
  ExecutiveJournalExperienceManifestNonCapabilityDefinitions,
  ExecutiveJournalExperienceManifestPlatformPrerequisiteDefinitions,
  ExecutiveJournalExperienceManifestPreviousPhase,
  ExecutiveJournalExperienceManifestReadiness,
  ExecutiveJournalExperienceManifestReasonCodes,
  ExecutiveJournalExperienceManifestReasonDefinitions,
  ExecutiveJournalExperienceManifestRequirementStatusValues,
  ExecutiveJournalExperienceManifestStatus,
  assertExecutiveJournalExperienceManifestBoundaryIdentity,
  assertExecutiveJournalExperienceManifestEntryKind,
  assertExecutiveJournalExperienceManifestIdentity,
  assertExecutiveJournalExperienceManifestLifecycleTransition,
  assertExecutiveJournalExperienceManifestReasonCode,
  canTransitionExecutiveJournalExperienceManifestLifecycle,
  isExecutiveJournalExperienceManifestBoundaryIdentity,
  isExecutiveJournalExperienceManifestCapabilitySupport,
  isExecutiveJournalExperienceManifestCompatibility,
  isExecutiveJournalExperienceManifestEligibility,
  isExecutiveJournalExperienceManifestEntryKind,
  isExecutiveJournalExperienceManifestLifecycleState,
  isExecutiveJournalExperienceManifestReasonCode,
  isExecutiveJournalExperienceManifestRequirementStatus,
  resolveExecutiveJournalExperienceManifestIdentity,
};

export type {
  ExecutiveJournalExperienceManifestCapabilityEntry,
  ExecutiveJournalExperienceManifestCapabilitySupport,
  ExecutiveJournalExperienceManifestCompatibility,
  ExecutiveJournalExperienceManifestContract,
  ExecutiveJournalExperienceManifestEligibility,
  ExecutiveJournalExperienceManifestEligibilityResult,
  ExecutiveJournalExperienceManifestEntryKind,
  ExecutiveJournalExperienceManifestInput,
  ExecutiveJournalExperienceManifestLifecycleState,
  ExecutiveJournalExperienceManifestNonCapabilityEntry,
  ExecutiveJournalExperienceManifestPlatformPrerequisite,
  ExecutiveJournalExperienceManifestReason,
  ExecutiveJournalExperienceManifestReasonCode,
  ExecutiveJournalExperienceManifestRequirementStatus,
  ExecutiveJournalExperienceManifestSummary,
  ExecutiveJournalExperienceManifestValidationBinding,
} from "./executiveJournalExperienceManifestTypes.ts";

const requiredEntity = (kind: Parameters<
  typeof ExecutiveJournalExperienceValidation.model.getEntity
>[0]) => {
  const entity = ExecutiveJournalExperienceValidation.model.getEntity(kind);
  if (entity === null) {
    throw new Error(`EX-2:5 requires validated entity ${kind}.`);
  }
  return entity;
};

const experience = requiredEntity("ExecutiveJournalExperience");
const projection = requiredEntity("JournalProjection");
const entryList = requiredEntity("JournalEntryList");
const entrySummary = requiredEntity("JournalEntrySummary");
const entryDetail = requiredEntity("JournalEntryDetail");
const category = requiredEntity("EntryCategoryPresentation");
const lifecyclePresentation = requiredEntity("LifecyclePresentation");
const origin = requiredEntity("OriginPresentation");
const authority = requiredEntity("AuthorityPresentation");
const integrity = requiredEntity("IntegrityPresentation");
const provenance = requiredEntity("ProvenancePresentation");
const correctionSupersession =
  requiredEntity("CorrectionSupersessionPresentation");
const filterModel = requiredEntity("JournalFilterModel");
const tier0Evidence = requiredEntity("Tier0EvidenceReference");

export const ExecutiveJournalExperienceManifestUpstream = Object.freeze({
  validation: ExecutiveJournalExperienceValidation,
  validationIdentity: ExecutiveJournalExperienceValidation.identity,
  validationLifecycle: ExecutiveJournalExperienceValidation.lifecycle,
  validationAggregateDescriptor:
    ExecutiveJournalExperienceValidation.aggregateDescriptor,
  validationCanonicalResult:
    ExecutiveJournalExperienceValidation.canonicalResult,
  validationResults: ExecutiveJournalExperienceValidation.types.results,
  validationSeverities: ExecutiveJournalExperienceValidation.types.severities,
  validationSubjectKinds: ExecutiveJournalExperienceValidation.types.subjects,
  validationIssueCodes:
    ExecutiveJournalExperienceValidation.issueCodeCatalogue,
  validationRules: ExecutiveJournalExperienceValidation.rules,
  validationRuleFamilies: ExecutiveJournalExperienceValidation.ruleFamilies,
  model: ExecutiveJournalExperienceValidation.model,
  registry: ExecutiveJournalExperienceValidation.upstream.registry,
  resolvedRegistryEntry:
    ExecutiveJournalExperienceValidation.upstream.resolvedRegistryEntry,
  foundation: ExecutiveJournalExperienceValidation.upstream.foundation,
  modelEntities: ExecutiveJournalExperienceValidation.model.entities,
  modelRelationships:
    ExecutiveJournalExperienceValidation.model.relationships,
  modelVocabularies: ExecutiveJournalExperienceValidation.model.vocabularies,
  foundationBoundaries:
    ExecutiveJournalExperienceValidation.upstream.foundation.boundaries,
  foundationPrinciples:
    ExecutiveJournalExperienceValidation.upstream.foundation.principles,
  foundationArchitectureDecisionLedger:
    ExecutiveJournalExperienceValidation.upstream
      .foundationArchitectureDecisionLedger,
  tier0EvidenceLedger:
    ExecutiveJournalExperienceValidation.upstream.tier0EvidenceLedger,
  authorizationRecords: Object.freeze({
    foundation:
      ExecutiveJournalExperienceValidation.upstream.foundationAuthorization,
    registry:
      ExecutiveJournalExperienceValidation.upstream.registryAuthorization,
    model: ExecutiveJournalExperienceValidation.upstream.modelAuthorization,
    validation: ExecutiveJournalExperienceValidation.authorization,
  }),
  openIssues: ExecutiveJournalExperienceValidation.openIssues,
  pendingGates: ExecutiveJournalExperienceValidation.pendingGates,
  upstreamChain: Object.freeze([
    ExecutiveJournalExperienceManifestId,
    "EX-2:4/ExecutiveJournalExperienceValidation",
    "EX-2:3/ExecutiveJournalExperienceModel",
    "EX-2:2/ExecutiveJournalExperienceRegistry",
    "EX-2:1/ExecutiveJournalExperienceFoundation",
  ] as const),
  exactReferencesPreserved: true as const,
  earlierPhasesReachedThroughValidationOnly: true as const,
  adEx213InjectedIntoSealedUpstreamLedgers: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

export const ExecutiveJournalExperienceManifestEntries =
  createExecutiveJournalExperienceManifestEntries({
    experience,
    projection,
    entryList,
    entrySummary,
    entryDetail,
    category,
    lifecycle: lifecyclePresentation,
    origin,
    authority,
    integrity,
    provenance,
    correctionSupersession,
    filterModel,
    tier0Evidence,
    validationSummary: ExecutiveJournalExperienceValidation.getSummary(),
    validationBoundaries: ExecutiveJournalExperienceValidation.boundaries,
    manifestIdentity: ExecutiveJournalExperienceManifestIdentity,
    validationResult: ExecutiveJournalExperienceValidation.canonicalResult,
    validationUpstream: ExecutiveJournalExperienceValidation.upstream,
    manifestLifecycle: ExecutiveJournalExperienceManifestLifecycle,
    nonCapabilities:
      ExecutiveJournalExperienceManifestNonCapabilityDefinitions,
    openIssues: ExecutiveJournalExperienceValidation.openIssues,
    pendingGates: ExecutiveJournalExperienceValidation.pendingGates,
    manifestAuthorization: ExecutiveJournalExperienceManifestAuthorization,
    tier0EvidenceLedger:
      ExecutiveJournalExperienceValidation.upstream.tier0EvidenceLedger,
  });

export const ExecutiveJournalExperienceManifestCapabilities =
  ExecutiveJournalExperienceManifestEntries.capabilities;
export const ExecutiveJournalExperienceManifestNonCapabilities =
  ExecutiveJournalExperienceManifestEntries.nonCapabilities;
export const ExecutiveJournalExperienceManifestPlatformPrerequisites =
  ExecutiveJournalExperienceManifestEntries.platformPrerequisites;

const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isClonedValidationAggregate = (
  value: unknown,
): boolean =>
  isRecord(value)
  && value !== ExecutiveJournalExperienceValidation
  && value.identity === ExecutiveJournalExperienceValidation.identity
  && value.model === ExecutiveJournalExperienceValidation.model
  && value.aggregateDescriptor
    === ExecutiveJournalExperienceValidation.aggregateDescriptor
  && value.canonicalResult
    === ExecutiveJournalExperienceValidation.canonicalResult;

const isClonedValidationAggregateDescriptor = (
  value: unknown,
): boolean =>
  isRecord(value)
  && value !== ExecutiveJournalExperienceValidation.aggregateDescriptor
  && value.aggregateId
    === ExecutiveJournalExperienceValidation.aggregateDescriptor.aggregateId
  && value.modelIdentity
    === ExecutiveJournalExperienceValidation.aggregateDescriptor.modelIdentity;

const createReason = (
  code: ExecutiveJournalExperienceManifestReasonCode,
): ExecutiveJournalExperienceManifestReason => {
  const definition =
    ExecutiveJournalExperienceManifestReasonDefinitions.find(
      (candidate) => candidate.code === code,
    );
  if (definition === undefined) {
    throw new Error("EX-2:5 internal reason catalogue is incomplete.");
  }
  return Object.freeze({
    reasonId: `EX-2:5/Reason/${code}` as const,
    code,
    order: definition.order,
    detail: definition.detail,
    safeStructuralDetailOnly: true as const,
    echoesInput: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });
};

export const evaluateExecutiveJournalExperienceManifestEligibility = (
  input: unknown,
): ExecutiveJournalExperienceManifestEligibilityResult => {
  if (!isRecord(input)) {
    const reasons = Object.freeze([
      createReason("ValidationEvidenceMalformed"),
    ]);
    return Object.freeze({
      manifestId: ExecutiveJournalExperienceManifestId,
      eligibility: "Ineligible" as const,
      eligible: false as const,
      reasonCount: reasons.length,
      reasons,
      validationResultRequired: "Valid" as const,
      createsAuthority: false as const,
      implementsCapabilities: false as const,
      productionAuthorized: false as const,
      platformAuthorized: false as const,
      ex26Authorized: false as const,
      repairedInput: false as const,
      mutatedInput: false as const,
      metadataOnly: true as const,
      sideEffectFree: true as const,
      deterministic: true as const,
      immutable: true as const,
    });
  }

  const reasonCodes: ExecutiveJournalExperienceManifestReasonCode[] = [];
  const addReason = (
    code: ExecutiveJournalExperienceManifestReasonCode,
  ): void => {
    if (!reasonCodes.includes(code)) {
      reasonCodes.push(code);
    }
  };

  const validationResult = input.validationResult;
  if (validationResult === undefined || validationResult === null) {
    addReason("ValidationEvidenceMissing");
  } else if (!isRecord(validationResult)) {
    addReason("ValidationEvidenceMalformed");
  } else if (validationResult.result === "Invalid") {
    addReason("ValidationEvidenceInvalid");
  } else if (validationResult.result !== "Valid") {
    addReason("ValidationEvidenceUnknown");
  } else if (
    !Object.is(
      validationResult,
      ExecutiveJournalExperienceValidation.canonicalResult,
    )
  ) {
    addReason("ValidationEvidenceCloned");
  }

  if (isClonedValidationAggregate(input.validation)) {
    addReason("ValidationEvidenceCloned");
  } else if (input.validation !== ExecutiveJournalExperienceValidation) {
    addReason("ValidationEvidenceMismatched");
  }
  if (
    isClonedValidationAggregateDescriptor(
      input.validationAggregateDescriptor,
    )
  ) {
    addReason("ValidationEvidenceCloned");
  } else if (
    input.validationAggregateDescriptor
      !== ExecutiveJournalExperienceValidation.aggregateDescriptor
  ) {
    addReason("ValidationEvidenceMismatched");
  }
  if (
    input.validationIdentity
      !== ExecutiveJournalExperienceValidation.identity.id
    || input.validatedModel
      !== ExecutiveJournalExperienceValidation.model
  ) {
    addReason("ValidationEvidenceMismatched");
  }
  if (input.evidenceCurrent !== true) {
    addReason("ValidationEvidenceStale");
  }
  if (input.evidenceComplete !== true) {
    addReason("ValidationEvidenceMissing");
  }
  if (input.evidenceCanonical !== true || input.evidenceKnown !== true) {
    addReason("ValidationEvidenceUnknown");
  }
  if (
    input.capabilities !== ExecutiveJournalExperienceManifestCapabilities
    || input.unsupportedCapabilityDeclared === true
  ) {
    addReason("UnsupportedCapability");
  }
  if (
    input.nonCapabilities
      !== ExecutiveJournalExperienceManifestNonCapabilities
    || input.prohibitedDeclarationConflict === true
    || input.evidenceImpliesProductionAuthority === true
    || input.ex26Authorized !== false
  ) {
    addReason("ProhibitedCapability");
  }
  if (input.dependencyBoundaryIntact !== true) {
    addReason("DependencyBoundaryViolation");
  }
  if (
    input.platformPrerequisites
      !== ExecutiveJournalExperienceManifestPlatformPrerequisites
    || input.lifecycle !== ExecutiveJournalExperienceManifestLifecycle
    || input.entriesSealed !== true
  ) {
    addReason("ManifestEntryUnsealed");
  }
  if (input.separatePlatformAuthorizationRequired !== true) {
    addReason("PlatformAuthorizationMissing");
  }

  const orderedCodes = ExecutiveJournalExperienceManifestReasonCodes.filter(
    (code) => reasonCodes.includes(code),
  );
  if (orderedCodes.length === 0) {
    return Object.freeze({
      manifestId: ExecutiveJournalExperienceManifestId,
      eligibility: "Eligible" as const,
      eligible: true as const,
      reasonCount: 0 as const,
      reasons: Object.freeze([] as const),
      validationResultRequired: "Valid" as const,
      createsAuthority: false as const,
      implementsCapabilities: false as const,
      productionAuthorized: false as const,
      platformAuthorized: false as const,
      ex26Authorized: false as const,
      repairedInput: false as const,
      mutatedInput: false as const,
      metadataOnly: true as const,
      sideEffectFree: true as const,
      deterministic: true as const,
      immutable: true as const,
    });
  }

  const reasons = Object.freeze(orderedCodes.map(createReason));
  return Object.freeze({
    manifestId: ExecutiveJournalExperienceManifestId,
    eligibility: "Ineligible" as const,
    eligible: false as const,
    reasonCount: reasons.length,
    reasons,
    validationResultRequired: "Valid" as const,
    createsAuthority: false as const,
    implementsCapabilities: false as const,
    productionAuthorized: false as const,
    platformAuthorized: false as const,
    ex26Authorized: false as const,
    repairedInput: false as const,
    mutatedInput: false as const,
    metadataOnly: true as const,
    sideEffectFree: true as const,
    deterministic: true as const,
    immutable: true as const,
  });
};

export const ExecutiveJournalExperienceManifestCanonicalInput = Object.freeze({
  validation: ExecutiveJournalExperienceValidation,
  validationIdentity: ExecutiveJournalExperienceValidation.identity.id,
  validationAggregateDescriptor:
    ExecutiveJournalExperienceValidation.aggregateDescriptor,
  validationResult: ExecutiveJournalExperienceValidation.canonicalResult,
  validatedModel: ExecutiveJournalExperienceValidation.model,
  evidenceCurrent: true,
  evidenceComplete: true,
  evidenceCanonical: true,
  evidenceKnown: true,
  evidenceImpliesProductionAuthority: false,
  capabilities: ExecutiveJournalExperienceManifestCapabilities,
  nonCapabilities: ExecutiveJournalExperienceManifestNonCapabilities,
  platformPrerequisites:
    ExecutiveJournalExperienceManifestPlatformPrerequisites,
  lifecycle: ExecutiveJournalExperienceManifestLifecycle,
  dependencyBoundaryIntact: true,
  entriesSealed: true,
  separatePlatformAuthorizationRequired: true,
  prohibitedDeclarationConflict: false,
  unsupportedCapabilityDeclared: false,
  ex26Authorized: false,
} as const satisfies ExecutiveJournalExperienceManifestInput);

export const ExecutiveJournalExperienceManifestCanonicalEligibility =
  evaluateExecutiveJournalExperienceManifestEligibility(
    ExecutiveJournalExperienceManifestCanonicalInput,
  );

if (!ExecutiveJournalExperienceManifestCanonicalEligibility.eligible) {
  throw new Error("EX-2:5 canonical Manifest input must remain Eligible.");
}

export const ExecutiveJournalExperienceManifestSummaryValue = Object.freeze({
  identity: ExecutiveJournalExperienceManifestId,
  namespace: ExecutiveJournalExperienceManifestNamespace,
  status: ExecutiveJournalExperienceManifestStatus,
  readiness: ExecutiveJournalExperienceManifestReadiness,
  previousPhase: ExecutiveJournalExperienceManifestPreviousPhase,
  nextPhase: ExecutiveJournalExperienceManifestNextPhase,
  eligibility: "Eligible",
  capabilityCount: 16,
  nonCapabilityCount: 19,
  platformPrerequisiteCount: 9,
  eligibilityValueCount: 2,
  capabilitySupportValueCount: 3,
  compatibilityValueCount: 3,
  requirementStatusValueCount: 3,
  entryKindCount: 11,
  reasonCodeCount: 12,
  lifecycleStateCount: 5,
  contractCount: 8,
  decisionCount: 6,
  openIssueCount: 13,
  pendingGateCount: 3,
  authorizationDecisionId: "AD-EX2-13",
  upstreamChain: ExecutiveJournalExperienceManifestUpstream.upstreamChain,
  metadataOnly: true,
  sideEffectFree: true,
  deterministic: true,
  failClosed: true,
  createsAuthority: false,
  implementsCapabilities: false,
  ex26Created: false,
  ex26Authorized: false,
  ciLintClassification: "CiStillBlockedByParkedReactCompilerDebt",
} as const satisfies ExecutiveJournalExperienceManifestSummary);

export const getExecutiveJournalExperienceManifestSummary =
  (): ExecutiveJournalExperienceManifestSummary =>
    ExecutiveJournalExperienceManifestSummaryValue;

export const ExecutiveJournalExperienceManifestDependencyDeclaration =
  Object.freeze({
    runtimeDependency:
      "EX-2:4/ExecutiveJournalExperienceValidation" as const,
    validationOnly: true as const,
    earlierPhasesReachedThroughValidationOnly: true as const,
    prohibitedDependencies: Object.freeze([] as const),
    dynamicImports: false as const,
    requireCalls: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveJournalExperienceManifest = Object.freeze({
  identity: ExecutiveJournalExperienceManifestIdentity,
  lifecycle: ExecutiveJournalExperienceManifestLifecycle,
  types: Object.freeze({
    eligibility: ExecutiveJournalExperienceManifestEligibilityValues,
    capabilitySupport:
      ExecutiveJournalExperienceManifestCapabilitySupportValues,
    compatibility: ExecutiveJournalExperienceManifestCompatibilityValues,
    requirementStatus:
      ExecutiveJournalExperienceManifestRequirementStatusValues,
    entryKinds: ExecutiveJournalExperienceManifestEntryKinds,
    reasonCodes: ExecutiveJournalExperienceManifestReasonCodes,
  }),
  contracts: ExecutiveJournalExperienceManifestContracts,
  entries: ExecutiveJournalExperienceManifestEntries,
  capabilities: ExecutiveJournalExperienceManifestCapabilities,
  nonCapabilities: ExecutiveJournalExperienceManifestNonCapabilities,
  platformPrerequisites:
    ExecutiveJournalExperienceManifestPlatformPrerequisites,
  evaluateEligibility:
    evaluateExecutiveJournalExperienceManifestEligibility,
  canonicalInput: ExecutiveJournalExperienceManifestCanonicalInput,
  canonicalEligibility:
    ExecutiveJournalExperienceManifestCanonicalEligibility,
  metadata: ExecutiveJournalExperienceManifestMetadata,
  validation: ExecutiveJournalExperienceValidation,
  upstream: ExecutiveJournalExperienceManifestUpstream,
  decisions: ExecutiveJournalExperienceManifestDecisions,
  openIssues: ExecutiveJournalExperienceValidation.openIssues,
  pendingGates: ExecutiveJournalExperienceValidation.pendingGates,
  authorization: ExecutiveJournalExperienceManifestAuthorization,
  boundaries: ExecutiveJournalExperienceManifestBoundaries,
  dependencyDeclaration:
    ExecutiveJournalExperienceManifestDependencyDeclaration,
  getSummary: getExecutiveJournalExperienceManifestSummary,
  status: ExecutiveJournalExperienceManifestStatus,
  readiness: ExecutiveJournalExperienceManifestReadiness,
  metadataOnly: true as const,
  sideEffectFree: true as const,
  deterministic: true as const,
  immutable: true as const,
  failClosed: true as const,
  createsAuthority: false as const,
  implementsCapabilities: false as const,
  ex26Created: false as const,
  ex26Authorized: false as const,
});
