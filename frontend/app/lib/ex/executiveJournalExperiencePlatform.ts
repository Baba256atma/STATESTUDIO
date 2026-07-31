/**
 * EX-2:6 — metadata-only Executive Journal Experience Platform aggregate.
 *
 * EX-2:5 Manifest is the sole upstream runtime dependency. Earlier phases are
 * reached only through that exact aggregate.
 */

import { ExecutiveJournalExperienceManifest } from "./executiveJournalExperienceManifest.ts";
import {
  ExecutiveJournalExperiencePlatformAccessClassificationValues,
  ExecutiveJournalExperiencePlatformAvailabilityValues,
  ExecutiveJournalExperiencePlatformBindingKinds,
  ExecutiveJournalExperiencePlatformBindingStatusValues,
  ExecutiveJournalExperiencePlatformContracts,
  ExecutiveJournalExperiencePlatformEligibilityValues,
  ExecutiveJournalExperiencePlatformExposureStatusValues,
  ExecutiveJournalExperiencePlatformIntegrityStatusValues,
  ExecutiveJournalExperiencePlatformIsolationValues,
  ExecutiveJournalExperiencePlatformProviderModeValues,
  ExecutiveJournalExperiencePlatformReasonCodes,
  ExecutiveJournalExperiencePlatformReasonDefinitions,
  ExecutiveJournalExperiencePlatformSourceClassificationValues,
  isExecutiveJournalExperiencePlatformAccessClassification,
  isExecutiveJournalExperiencePlatformBindingKind,
  isExecutiveJournalExperiencePlatformProviderMode,
  isExecutiveJournalExperiencePlatformReasonCode,
  isExecutiveJournalExperiencePlatformSourceClassification,
} from "./executiveJournalExperiencePlatformContracts.ts";
import {
  ExecutiveJournalExperiencePlatformId,
  ExecutiveJournalExperiencePlatformIdentity,
  ExecutiveJournalExperiencePlatformNamespace,
  ExecutiveJournalExperiencePlatformNextPhase,
  ExecutiveJournalExperiencePlatformPreviousPhase,
  ExecutiveJournalExperiencePlatformReadiness,
  ExecutiveJournalExperiencePlatformStatus,
  assertExecutiveJournalExperiencePlatformIdentity,
  resolveExecutiveJournalExperiencePlatformIdentity,
} from "./executiveJournalExperiencePlatformIdentity.ts";
import {
  ExecutiveJournalExperiencePlatformLifecycle,
  ExecutiveJournalExperiencePlatformLifecycleStates,
  assertExecutiveJournalExperiencePlatformLifecycleTransition,
  canTransitionExecutiveJournalExperiencePlatformLifecycle,
  isExecutiveJournalExperiencePlatformLifecycleState,
} from "./executiveJournalExperiencePlatformLifecycle.ts";
import {
  ExecutiveJournalExperiencePlatformAuthorization,
  ExecutiveJournalExperiencePlatformBoundaries,
  ExecutiveJournalExperiencePlatformDecisions,
  ExecutiveJournalExperiencePlatformMetadata,
  ExecutiveJournalExperiencePlatformProviderSourceBoundaries,
  ExecutiveJournalExperiencePlatformReadinessConditions,
} from "./executiveJournalExperiencePlatformMetadata.ts";
import {
  ExecutiveJournalExperiencePlatformConsumerBindingFields,
  createExecutiveJournalExperiencePlatformBindings,
  createExecutiveJournalExperiencePlatformConsumerBinding,
} from "./executiveJournalExperiencePlatformBindings.ts";
import type {
  ExecutiveJournalExperiencePlatformEligibilityResult,
  ExecutiveJournalExperiencePlatformInput,
  ExecutiveJournalExperiencePlatformReason,
  ExecutiveJournalExperiencePlatformReasonCode,
  ExecutiveJournalExperiencePlatformSummary,
} from "./executiveJournalExperiencePlatformTypes.ts";

export * from "./executiveJournalExperiencePlatformTypes.ts";
export * from "./executiveJournalExperiencePlatformIdentity.ts";
export * from "./executiveJournalExperiencePlatformLifecycle.ts";
export * from "./executiveJournalExperiencePlatformContracts.ts";
export * from "./executiveJournalExperiencePlatformBindings.ts";
export * from "./executiveJournalExperiencePlatformMetadata.ts";

export const ExecutiveJournalExperiencePlatformManifestBinding = Object.freeze({
  manifest: ExecutiveJournalExperienceManifest,
  manifestIdentity: ExecutiveJournalExperienceManifest.identity,
  manifestEligibility: ExecutiveJournalExperienceManifest.canonicalEligibility,
  manifestLifecycle: ExecutiveJournalExperienceManifest.lifecycle,
  capabilities: ExecutiveJournalExperienceManifest.capabilities,
  nonCapabilities: ExecutiveJournalExperienceManifest.nonCapabilities,
  platformPrerequisites: ExecutiveJournalExperienceManifest.platformPrerequisites,
  exactValidEx24Evidence: ExecutiveJournalExperienceManifest.validation.canonicalResult,
  upstream: ExecutiveJournalExperienceManifest.upstream,
  bindingStatus: "Bound" as const,
  exactReference: true as const,
  metadataOnly: true as const,
  immutable: true as const,
});

const generatedBindings = createExecutiveJournalExperiencePlatformBindings(
  ExecutiveJournalExperienceManifest,
);
export const ExecutiveJournalExperiencePlatformCapabilityBindings =
  generatedBindings.capabilityBindings;
export const ExecutiveJournalExperiencePlatformNonCapabilityEnforcement =
  generatedBindings.nonCapabilityEnforcement;

export const ExecutiveJournalExperiencePlatformUpstream = Object.freeze({
  manifest: ExecutiveJournalExperienceManifest,
  manifestIdentity: ExecutiveJournalExperienceManifest.identity,
  manifestLifecycle: ExecutiveJournalExperienceManifest.lifecycle,
  manifestCanonicalEligibility:
    ExecutiveJournalExperienceManifest.canonicalEligibility,
  validation: ExecutiveJournalExperienceManifest.validation,
  validationResult:
    ExecutiveJournalExperienceManifest.validation.canonicalResult,
  model: ExecutiveJournalExperienceManifest.upstream.model,
  registry: ExecutiveJournalExperienceManifest.upstream.registry,
  foundation: ExecutiveJournalExperienceManifest.upstream.foundation,
  architectureDecisionLedger:
    ExecutiveJournalExperienceManifest.upstream
      .foundationArchitectureDecisionLedger,
  tier0EvidenceLedger:
    ExecutiveJournalExperienceManifest.upstream.tier0EvidenceLedger,
  authorizationRecords:
    ExecutiveJournalExperienceManifest.upstream.authorizationRecords,
  openIssues: ExecutiveJournalExperienceManifest.openIssues,
  pendingGates: ExecutiveJournalExperienceManifest.pendingGates,
  upstreamChain: Object.freeze([
    ExecutiveJournalExperiencePlatformId,
    ...ExecutiveJournalExperienceManifest.upstream.upstreamChain,
  ] as const),
  exactReferencesPreserved: true as const,
  earlierPhasesReachedThroughManifestOnly: true as const,
  adEx214InjectedIntoSealedUpstreamLedgers: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const createReason = (
  code: ExecutiveJournalExperiencePlatformReasonCode,
): ExecutiveJournalExperiencePlatformReason => {
  const definition = ExecutiveJournalExperiencePlatformReasonDefinitions.find(
    (candidate) => candidate.code === code,
  );
  if (!definition) throw new Error("EX-2:6 internal reason catalogue is incomplete.");
  return Object.freeze({
    reasonId: `EX-2:6/Reason/${code}`,
    code,
    order: definition.order,
    detail: definition.detail,
    safeStructuralDetailOnly: true,
    echoesInput: false,
    immutable: true,
  });
};

const result = (
  reasonCodes: readonly ExecutiveJournalExperiencePlatformReasonCode[],
): ExecutiveJournalExperiencePlatformEligibilityResult => {
  const reasons = Object.freeze(reasonCodes.map(createReason));
  return Object.freeze({
    platformId: ExecutiveJournalExperiencePlatformId,
    eligibility: reasons.length === 0 ? "Eligible" : "Ineligible",
    eligible: reasons.length === 0,
    reasonCount: reasons.length,
    reasons,
    metadataOnly: true,
    createsAuthority: false,
    productionAuthorized: false,
    ex27Authorized: false,
    repairedInput: false,
    mutatedInput: false,
    deterministic: true,
    immutable: true,
  });
};

export const evaluateExecutiveJournalExperiencePlatformEligibility = (
  input: unknown,
): ExecutiveJournalExperiencePlatformEligibilityResult => {
  if (!isRecord(input)) return result(["ManifestMalformed"]);
  const found: ExecutiveJournalExperiencePlatformReasonCode[] = [];
  const add = (code: ExecutiveJournalExperiencePlatformReasonCode) => {
    if (!found.includes(code)) found.push(code);
  };
  if (input.manifest === undefined || input.manifest === null) {
    add("ManifestMissing");
  } else if (!isRecord(input.manifest)) {
    add("ManifestMalformed");
  } else if (
    input.manifest !== ExecutiveJournalExperienceManifest
    && input.manifestIdentity
      === ExecutiveJournalExperienceManifest.identity.id
  ) {
    add("ManifestCloned");
  } else if (input.manifest !== ExecutiveJournalExperienceManifest) {
    add("ManifestIdentityMismatch");
  }
  if (
    input.manifestEligibility
      !== ExecutiveJournalExperienceManifest.canonicalEligibility
  ) {
    add(
      isRecord(input.manifestEligibility)
      && input.manifestEligibility.eligibility === "Ineligible"
        ? "ManifestIneligible"
        : "ManifestCloned",
    );
  }
  if (
    input.manifestIdentity
      !== ExecutiveJournalExperienceManifest.identity.id
  ) add("ManifestIdentityMismatch");
  if (
    input.manifestReadiness
      !== ExecutiveJournalExperienceManifest.readiness
  ) add("ManifestReadinessMismatch");
  if (input.manifestCurrent !== true) add("ManifestStale");
  if (input.capabilities !== ExecutiveJournalExperienceManifest.capabilities) {
    add("CapabilityCatalogueMismatch");
  }
  if (
    input.nonCapabilities
      !== ExecutiveJournalExperienceManifest.nonCapabilities
  ) add("NonCapabilityCatalogueMismatch");
  if (
    input.platformPrerequisites
      !== ExecutiveJournalExperienceManifest.platformPrerequisites
  ) add("PrerequisiteCatalogueMismatch");
  if (input.upstream !== ExecutiveJournalExperienceManifest.upstream) {
    add("UpstreamReferenceMismatch");
  }
  if (
    input.platformAuthorization
      !== ExecutiveJournalExperiencePlatformAuthorization
  ) add("PlatformAuthorizationMissing");
  if (input.contractsSealed !== true) add("PlatformContractUnsealed");
  return result(
    ExecutiveJournalExperiencePlatformReasonCodes.filter((code) =>
      found.includes(code)),
  );
};

export const ExecutiveJournalExperiencePlatformCanonicalInput = Object.freeze({
  manifest: ExecutiveJournalExperienceManifest,
  manifestIdentity: ExecutiveJournalExperienceManifest.identity.id,
  manifestEligibility:
    ExecutiveJournalExperienceManifest.canonicalEligibility,
  manifestReadiness: ExecutiveJournalExperienceManifest.readiness,
  manifestCurrent: true,
  capabilities: ExecutiveJournalExperienceManifest.capabilities,
  nonCapabilities: ExecutiveJournalExperienceManifest.nonCapabilities,
  platformPrerequisites:
    ExecutiveJournalExperienceManifest.platformPrerequisites,
  upstream: ExecutiveJournalExperienceManifest.upstream,
  platformAuthorization: ExecutiveJournalExperiencePlatformAuthorization,
  contractsSealed: true,
} as const satisfies ExecutiveJournalExperiencePlatformInput);

export const ExecutiveJournalExperiencePlatformCanonicalEligibility =
  evaluateExecutiveJournalExperiencePlatformEligibility(
    ExecutiveJournalExperiencePlatformCanonicalInput,
  );

if (!ExecutiveJournalExperiencePlatformCanonicalEligibility.eligible) {
  throw new Error("EX-2:6 canonical Platform input must remain Eligible.");
}

export const ExecutiveJournalExperiencePlatformSummaryValue = Object.freeze({
  identity: ExecutiveJournalExperiencePlatformId,
  namespace: ExecutiveJournalExperiencePlatformNamespace,
  status: ExecutiveJournalExperiencePlatformStatus,
  readiness: ExecutiveJournalExperiencePlatformReadiness,
  previousPhase: ExecutiveJournalExperiencePlatformPreviousPhase,
  nextPhase: ExecutiveJournalExperiencePlatformNextPhase,
  eligibility: "Eligible",
  capabilityBindingCount: 16,
  nonCapabilityEnforcementCount: 19,
  readinessConditionCount: 12,
  consumerBindingFieldCount: 10,
  vocabularyCounts: Object.freeze({
    eligibility: ExecutiveJournalExperiencePlatformEligibilityValues.length,
    bindingStatus: ExecutiveJournalExperiencePlatformBindingStatusValues.length,
    exposureStatus: ExecutiveJournalExperiencePlatformExposureStatusValues.length,
    availability: ExecutiveJournalExperiencePlatformAvailabilityValues.length,
    isolation: ExecutiveJournalExperiencePlatformIsolationValues.length,
    providerMode: ExecutiveJournalExperiencePlatformProviderModeValues.length,
    accessClassification:
      ExecutiveJournalExperiencePlatformAccessClassificationValues.length,
    sourceClassification:
      ExecutiveJournalExperiencePlatformSourceClassificationValues.length,
    integrityStatus:
      ExecutiveJournalExperiencePlatformIntegrityStatusValues.length,
    reasonCodes: ExecutiveJournalExperiencePlatformReasonCodes.length,
    bindingKinds: ExecutiveJournalExperiencePlatformBindingKinds.length,
    lifecycleStates:
      ExecutiveJournalExperiencePlatformLifecycleStates.length,
  }),
  contractCount: ExecutiveJournalExperiencePlatformContracts.length,
  decisionCount: 6,
  openIssueCount: 13,
  pendingGateCount: 3,
  authorizationDecisionId: "AD-EX2-14",
  metadataOnly: true,
  contractOnly: true,
  sideEffectFree: true,
  providerExecution: false,
  realRtc2Consumption: false,
  ex27Created: false,
  ex27Authorized: false,
  ciLintClassification: "CiStillBlockedByParkedReactCompilerDebt",
} as const satisfies ExecutiveJournalExperiencePlatformSummary);

export const getExecutiveJournalExperiencePlatformSummary =
  (): ExecutiveJournalExperiencePlatformSummary =>
    ExecutiveJournalExperiencePlatformSummaryValue;

export const ExecutiveJournalExperiencePlatformDependencyDeclaration =
  Object.freeze({
    runtimeDependency:
      "EX-2:5/ExecutiveJournalExperienceManifest" as const,
    manifestOnly: true as const,
    earlierPhasesReachedThroughManifestOnly: true as const,
    prohibitedDependencies: Object.freeze([] as const),
    dynamicImports: false as const,
    requireCalls: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveJournalExperiencePlatform = Object.freeze({
  identity: ExecutiveJournalExperiencePlatformIdentity,
  lifecycle: ExecutiveJournalExperiencePlatformLifecycle,
  types: Object.freeze({
    eligibility: ExecutiveJournalExperiencePlatformEligibilityValues,
    bindingStatus: ExecutiveJournalExperiencePlatformBindingStatusValues,
    exposureStatus: ExecutiveJournalExperiencePlatformExposureStatusValues,
    availability: ExecutiveJournalExperiencePlatformAvailabilityValues,
    isolation: ExecutiveJournalExperiencePlatformIsolationValues,
    providerMode: ExecutiveJournalExperiencePlatformProviderModeValues,
    accessClassification:
      ExecutiveJournalExperiencePlatformAccessClassificationValues,
    sourceClassification:
      ExecutiveJournalExperiencePlatformSourceClassificationValues,
    integrityStatus: ExecutiveJournalExperiencePlatformIntegrityStatusValues,
    reasonCodes: ExecutiveJournalExperiencePlatformReasonCodes,
    bindingKinds: ExecutiveJournalExperiencePlatformBindingKinds,
    lifecycleStates: ExecutiveJournalExperiencePlatformLifecycleStates,
  }),
  contracts: ExecutiveJournalExperiencePlatformContracts,
  bindings: Object.freeze({
    manifest: ExecutiveJournalExperiencePlatformManifestBinding,
    capabilities: ExecutiveJournalExperiencePlatformCapabilityBindings,
    nonCapabilities:
      ExecutiveJournalExperiencePlatformNonCapabilityEnforcement,
    consumerFields:
      ExecutiveJournalExperiencePlatformConsumerBindingFields,
    createConsumerBinding:
      createExecutiveJournalExperiencePlatformConsumerBinding,
  }),
  providerSourceBoundaries:
    ExecutiveJournalExperiencePlatformProviderSourceBoundaries,
  readinessConditions:
    ExecutiveJournalExperiencePlatformReadinessConditions,
  evaluateEligibility:
    evaluateExecutiveJournalExperiencePlatformEligibility,
  canonicalInput: ExecutiveJournalExperiencePlatformCanonicalInput,
  canonicalEligibility:
    ExecutiveJournalExperiencePlatformCanonicalEligibility,
  metadata: ExecutiveJournalExperiencePlatformMetadata,
  manifest: ExecutiveJournalExperienceManifest,
  upstream: ExecutiveJournalExperiencePlatformUpstream,
  decisions: ExecutiveJournalExperiencePlatformDecisions,
  openIssues: ExecutiveJournalExperienceManifest.openIssues,
  pendingGates: ExecutiveJournalExperienceManifest.pendingGates,
  authorization: ExecutiveJournalExperiencePlatformAuthorization,
  boundaries: ExecutiveJournalExperiencePlatformBoundaries,
  dependencyDeclaration:
    ExecutiveJournalExperiencePlatformDependencyDeclaration,
  getSummary: getExecutiveJournalExperiencePlatformSummary,
  status: ExecutiveJournalExperiencePlatformStatus,
  readiness: ExecutiveJournalExperiencePlatformReadiness,
  metadataOnly: true as const,
  contractOnly: true as const,
  sideEffectFree: true as const,
  deterministic: true as const,
  immutable: true as const,
  failClosed: true as const,
  providerExecution: false as const,
  realRtc2Consumption: false as const,
  productionAuthorized: false as const,
  ex27Created: false as const,
  ex27Authorized: false as const,
});

export {
  assertExecutiveJournalExperiencePlatformIdentity,
  assertExecutiveJournalExperiencePlatformLifecycleTransition,
  canTransitionExecutiveJournalExperiencePlatformLifecycle,
  isExecutiveJournalExperiencePlatformAccessClassification,
  isExecutiveJournalExperiencePlatformBindingKind,
  isExecutiveJournalExperiencePlatformLifecycleState,
  isExecutiveJournalExperiencePlatformProviderMode,
  isExecutiveJournalExperiencePlatformReasonCode,
  isExecutiveJournalExperiencePlatformSourceClassification,
  resolveExecutiveJournalExperiencePlatformIdentity,
};
