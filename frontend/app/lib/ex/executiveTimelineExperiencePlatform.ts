/**
 * EX-3:6 — metadata-only Executive Timeline Experience Platform aggregate.
 *
 * EX-3:5 Manifest is the sole upstream runtime dependency.
 */

import { ExecutiveTimelineExperienceManifest } from "./executiveTimelineExperienceManifest.ts";
import {
  ExecutiveTimelineExperiencePlatformCapabilityBindingCount,
  ExecutiveTimelineExperiencePlatformCapabilityBindings,
  ExecutiveTimelineExperiencePlatformCapabilitySummary,
  ExecutiveTimelineExperiencePlatformCanonicalConsumerBinding,
} from "./executiveTimelineExperiencePlatformBindings.ts";
import {
  ExecutiveTimelineExperiencePlatformContractCount,
  ExecutiveTimelineExperiencePlatformContracts,
  ExecutiveTimelineExperiencePlatformReasonCodes,
  createExecutiveTimelineExperiencePlatformReason,
} from "./executiveTimelineExperiencePlatformContracts.ts";
import {
  ExecutiveTimelineExperiencePlatformApprovedAliases,
  ExecutiveTimelineExperiencePlatformId,
  ExecutiveTimelineExperiencePlatformIdentity,
  ExecutiveTimelineExperiencePlatformNamespace,
  ExecutiveTimelineExperiencePlatformNextPhase,
  ExecutiveTimelineExperiencePlatformPreviousPhase,
  ExecutiveTimelineExperiencePlatformReadiness,
  ExecutiveTimelineExperiencePlatformStatus,
  ExecutiveTimelineExperiencePlatformVersion,
  assertExecutiveTimelineExperiencePlatformIdentity,
  resolveExecutiveTimelineExperiencePlatformIdentity,
} from "./executiveTimelineExperiencePlatformIdentity.ts";
import {
  ExecutiveTimelineExperiencePlatformLifecycle,
  ExecutiveTimelineExperiencePlatformLifecycleStates,
  assertExecutiveTimelineExperiencePlatformLifecycleTransition,
  canTransitionExecutiveTimelineExperiencePlatformLifecycle,
  isExecutiveTimelineExperiencePlatformLifecycleState,
} from "./executiveTimelineExperiencePlatformLifecycle.ts";
import {
  ExecutiveTimelineExperiencePlatformAuthorization,
  ExecutiveTimelineExperiencePlatformBoundaries,
  ExecutiveTimelineExperiencePlatformDecisions,
  ExecutiveTimelineExperiencePlatformMetadata,
} from "./executiveTimelineExperiencePlatformMetadata.ts";
import type {
  ExecutiveTimelineExperiencePlatformEligibilityResult,
  ExecutiveTimelineExperiencePlatformInput,
  ExecutiveTimelineExperiencePlatformReasonCode,
  ExecutiveTimelineExperiencePlatformSummary,
} from "./executiveTimelineExperiencePlatformTypes.ts";

export * from "./executiveTimelineExperiencePlatformTypes.ts";
export * from "./executiveTimelineExperiencePlatformIdentity.ts";
export * from "./executiveTimelineExperiencePlatformLifecycle.ts";
export * from "./executiveTimelineExperiencePlatformContracts.ts";
export * from "./executiveTimelineExperiencePlatformBindings.ts";
export * from "./executiveTimelineExperiencePlatformMetadata.ts";

if (ExecutiveTimelineExperienceManifest.readiness !== "ReadyForPlatform") {
  throw new Error(
    "EX-3:6 Platform requires Manifest readiness ReadyForPlatform.",
  );
}

if (ExecutiveTimelineExperienceManifest.status !== "Manifest") {
  throw new Error("EX-3:6 Platform requires Manifest status Manifest.");
}

if (ExecutiveTimelineExperiencePlatformCapabilityBindings.length !== 16) {
  throw new Error("EX-3:6 Platform requires exactly sixteen capability bindings.");
}

if (ExecutiveTimelineExperiencePlatformContracts.length !== 10) {
  throw new Error("EX-3:6 Platform requires exactly ten contracts.");
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const result = (
  reasonCodes: readonly ExecutiveTimelineExperiencePlatformReasonCode[],
): ExecutiveTimelineExperiencePlatformEligibilityResult => {
  const reasons = Object.freeze(
    reasonCodes.map(createExecutiveTimelineExperiencePlatformReason),
  );
  return Object.freeze({
    platformId: ExecutiveTimelineExperiencePlatformId,
    eligibility: reasons.length === 0 ? "Eligible" : "Ineligible",
    eligible: reasons.length === 0,
    reasonCount: reasons.length,
    reasons,
    metadataOnly: true,
    createsAuthority: false,
    productionAuthorized: false,
    ex37Authorized: false,
    repairedInput: false,
    mutatedInput: false,
    deterministic: true,
    immutable: true,
  });
};

export const evaluateExecutiveTimelineExperiencePlatformEligibility = (
  input: unknown,
): ExecutiveTimelineExperiencePlatformEligibilityResult => {
  if (!isRecord(input)) return result(["ManifestMalformed"]);
  const found: ExecutiveTimelineExperiencePlatformReasonCode[] = [];
  const add = (code: ExecutiveTimelineExperiencePlatformReasonCode) => {
    if (!found.includes(code)) found.push(code);
  };

  if (input.manifest === undefined || input.manifest === null) {
    add("ManifestMissing");
  } else if (!isRecord(input.manifest)) {
    add("ManifestMalformed");
  } else if (
    input.manifest !== ExecutiveTimelineExperienceManifest
    && input.manifestIdentity
      === ExecutiveTimelineExperienceManifest.identity.id
  ) {
    add("ManifestCloned");
  } else if (input.manifest !== ExecutiveTimelineExperienceManifest) {
    add("ManifestIdentityMismatch");
  }

  if (
    input.manifestIdentity
      !== ExecutiveTimelineExperienceManifest.identity.id
  ) {
    add("ManifestIdentityMismatch");
  }

  if (
    input.manifestReadiness
      !== ExecutiveTimelineExperienceManifest.readiness
  ) {
    add("ManifestReadinessMismatch");
  }

  if (
    ExecutiveTimelineExperienceManifest.readiness !== "ReadyForPlatform"
  ) {
    add("UpstreamReadinessMismatch");
  }

  if (
    input.capabilityBindings
      !== ExecutiveTimelineExperiencePlatformCapabilityBindings
    || !Array.isArray(input.capabilityBindings)
    || input.capabilityBindings.length !== 16
  ) {
    add("CapabilityBindingIncomplete");
  }

  if (
    input.contracts !== ExecutiveTimelineExperiencePlatformContracts
    || !Array.isArray(input.contracts)
    || input.contracts.length !== 10
    || input.contractsSealed !== true
  ) {
    add("ContractIncomplete");
  }

  if (
    input.lifecycleState
      !== ExecutiveTimelineExperiencePlatformLifecycle.currentState
    || input.lifecycleState !== "ReadyForCertification"
  ) {
    add("LifecycleInvalid");
  }

  if (
    input.metadata !== ExecutiveTimelineExperiencePlatformMetadata
    || !isRecord(input.metadata)
    || input.metadata.metadataOnly !== true
    || input.metadata.immutable !== true
  ) {
    add("MetadataIntegrityFailure");
  }

  return result(
    ExecutiveTimelineExperiencePlatformReasonCodes.filter((code) =>
      found.includes(code)
    ),
  );
};

export const ExecutiveTimelineExperiencePlatformCanonicalInput = Object.freeze({
  manifest: ExecutiveTimelineExperienceManifest,
  manifestIdentity: ExecutiveTimelineExperienceManifest.identity.id,
  manifestReadiness: ExecutiveTimelineExperienceManifest.readiness,
  capabilityBindings: ExecutiveTimelineExperiencePlatformCapabilityBindings,
  contracts: ExecutiveTimelineExperiencePlatformContracts,
  lifecycleState: ExecutiveTimelineExperiencePlatformLifecycle.currentState,
  metadata: ExecutiveTimelineExperiencePlatformMetadata,
  contractsSealed: true,
} as const satisfies ExecutiveTimelineExperiencePlatformInput);

export const ExecutiveTimelineExperiencePlatformCanonicalEligibility =
  evaluateExecutiveTimelineExperiencePlatformEligibility(
    ExecutiveTimelineExperiencePlatformCanonicalInput,
  );

if (!ExecutiveTimelineExperiencePlatformCanonicalEligibility.eligible) {
  throw new Error("EX-3:6 canonical Platform input must remain Eligible.");
}

export const ExecutiveTimelineExperiencePlatformDependencyDeclaration =
  Object.freeze({
    runtimeDependency: "EX-3:5/ExecutiveTimelineExperienceManifest" as const,
    manifestOnly: true as const,
    earlierPhasesReachedThroughManifestOnly: true as const,
    dynamicImports: false as const,
    requireCalls: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveTimelineExperiencePlatformSummaryValue = Object.freeze({
  identity: ExecutiveTimelineExperiencePlatformId,
  namespace: ExecutiveTimelineExperiencePlatformNamespace,
  version: ExecutiveTimelineExperiencePlatformVersion,
  status: ExecutiveTimelineExperiencePlatformStatus,
  readiness: ExecutiveTimelineExperiencePlatformReadiness,
  previousPhase: ExecutiveTimelineExperiencePlatformPreviousPhase,
  nextPhase: ExecutiveTimelineExperiencePlatformNextPhase,
  upstreamDependency: "EX-3:5/ExecutiveTimelineExperienceManifest",
  capabilityBindingCount: 16,
  contractCount: 10,
  eligibility: "Eligible",
  metadataOnly: true,
  deterministic: true,
  sideEffectFree: true,
  certificationCreated: false,
  certificationAuthorized: false,
} as const satisfies ExecutiveTimelineExperiencePlatformSummary);

export const getExecutiveTimelineExperiencePlatformSummary =
  (): ExecutiveTimelineExperiencePlatformSummary =>
    ExecutiveTimelineExperiencePlatformSummaryValue;

export const ExecutiveTimelineExperiencePlatform = Object.freeze({
  identity: ExecutiveTimelineExperiencePlatformIdentity,
  lifecycle: ExecutiveTimelineExperiencePlatformLifecycle,
  contracts: ExecutiveTimelineExperiencePlatformContracts,
  capabilityBindings: ExecutiveTimelineExperiencePlatformCapabilityBindings,
  capabilitySummary: ExecutiveTimelineExperiencePlatformCapabilitySummary,
  consumerBinding: ExecutiveTimelineExperiencePlatformCanonicalConsumerBinding,
  metadata: ExecutiveTimelineExperiencePlatformMetadata,
  authorization: ExecutiveTimelineExperiencePlatformAuthorization,
  boundaries: ExecutiveTimelineExperiencePlatformBoundaries,
  decisions: ExecutiveTimelineExperiencePlatformDecisions,
  manifest: ExecutiveTimelineExperienceManifest,
  dependencySummary: ExecutiveTimelineExperienceManifest.dependencySummary,
  dependencyDeclaration:
    ExecutiveTimelineExperiencePlatformDependencyDeclaration,
  evaluateEligibility:
    evaluateExecutiveTimelineExperiencePlatformEligibility,
  canonicalInput: ExecutiveTimelineExperiencePlatformCanonicalInput,
  canonicalEligibility:
    ExecutiveTimelineExperiencePlatformCanonicalEligibility,
  getSummary: getExecutiveTimelineExperiencePlatformSummary,
  status: ExecutiveTimelineExperiencePlatformStatus,
  readiness: ExecutiveTimelineExperiencePlatformReadiness,
  aliases: ExecutiveTimelineExperiencePlatformApprovedAliases,
  capabilityBindingCount:
    ExecutiveTimelineExperiencePlatformCapabilityBindingCount,
  contractCount: ExecutiveTimelineExperiencePlatformContractCount,
  lifecycleStates: ExecutiveTimelineExperiencePlatformLifecycleStates,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  failClosed: true as const,
  sideEffectFree: true as const,
  providerExecution: false as const,
  rtcIntegration: false as const,
  uiRendering: false as const,
  playbackEngine: false as const,
  certificationCreated: false as const,
  certificationAuthorized: false as const,
  ex37Created: false as const,
  ex37Authorized: false as const,
});

export {
  assertExecutiveTimelineExperiencePlatformIdentity,
  assertExecutiveTimelineExperiencePlatformLifecycleTransition,
  canTransitionExecutiveTimelineExperiencePlatformLifecycle,
  isExecutiveTimelineExperiencePlatformLifecycleState,
  resolveExecutiveTimelineExperiencePlatformIdentity,
};
