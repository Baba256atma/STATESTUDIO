/**
 * EX-3:8 — metadata-only Executive Timeline Experience Freeze aggregate.
 *
 * EX-3:7 Certification is the sole upstream runtime dependency.
 */

import { ExecutiveTimelineExperienceCertification } from "./executiveTimelineExperienceCertification.ts";
import {
  ExecutiveTimelineExperienceFreezeContractCount,
  ExecutiveTimelineExperienceFreezeContracts,
} from "./executiveTimelineExperienceFreezeContracts.ts";
import {
  ExecutiveTimelineExperienceFreezeApprovedAliases,
  ExecutiveTimelineExperienceFreezeId,
  ExecutiveTimelineExperienceFreezeIdentity,
  ExecutiveTimelineExperienceFreezeNamespace,
  ExecutiveTimelineExperienceFreezeNextPhase,
  ExecutiveTimelineExperienceFreezePreviousPhase,
  ExecutiveTimelineExperienceFreezeReadiness,
  ExecutiveTimelineExperienceFreezeStatus,
  ExecutiveTimelineExperienceFreezeVersion,
  assertExecutiveTimelineExperienceFreezeIdentity,
  resolveExecutiveTimelineExperienceFreezeIdentity,
} from "./executiveTimelineExperienceFreezeIdentity.ts";
import {
  ExecutiveTimelineExperienceFreezeLifecycle,
  ExecutiveTimelineExperienceFreezeLifecycleStates,
  assertExecutiveTimelineExperienceFreezeLifecycleTransition,
  canTransitionExecutiveTimelineExperienceFreezeLifecycle,
  isExecutiveTimelineExperienceFreezeLifecycleState,
} from "./executiveTimelineExperienceFreezeLifecycle.ts";
import {
  ExecutiveTimelineExperienceFreezeLockCount,
  ExecutiveTimelineExperienceFreezeLockSeal,
  ExecutiveTimelineExperienceFreezeLockedCertification,
  ExecutiveTimelineExperienceFreezeLocks,
} from "./executiveTimelineExperienceFreezeLocks.ts";
import {
  ExecutiveTimelineExperienceFreezeAuthorization,
  ExecutiveTimelineExperienceFreezeBoundaries,
  ExecutiveTimelineExperienceFreezeDecisions,
  ExecutiveTimelineExperienceFreezeMetadata,
} from "./executiveTimelineExperienceFreezeMetadata.ts";
import type { ExecutiveTimelineExperienceFreezeSummary } from "./executiveTimelineExperienceFreezeTypes.ts";

export * from "./executiveTimelineExperienceFreezeTypes.ts";
export * from "./executiveTimelineExperienceFreezeIdentity.ts";
export * from "./executiveTimelineExperienceFreezeLifecycle.ts";
export * from "./executiveTimelineExperienceFreezeContracts.ts";
export * from "./executiveTimelineExperienceFreezeLocks.ts";
export * from "./executiveTimelineExperienceFreezeMetadata.ts";

if (
  ExecutiveTimelineExperienceCertification
    !== ExecutiveTimelineExperienceFreezeLockedCertification
) {
  throw new Error(
    "EX-3:8 Freeze must bind the exact EX-3:7 Certification aggregate.",
  );
}

if (ExecutiveTimelineExperienceCertification.readiness !== "ReadyForFreeze") {
  throw new Error(
    "EX-3:8 Freeze requires Certification readiness ReadyForFreeze.",
  );
}

if (ExecutiveTimelineExperienceCertification.status !== "Certified") {
  throw new Error("EX-3:8 Freeze requires Certification status Certified.");
}

if (
  ExecutiveTimelineExperienceCertification.result.status !== "Certified"
  || ExecutiveTimelineExperienceCertification.result.readiness
    !== "ReadyForFreeze"
) {
  throw new Error(
    "EX-3:8 Freeze requires Certification result Certified / ReadyForFreeze.",
  );
}

if (ExecutiveTimelineExperienceFreezeLocks.length !== 12) {
  throw new Error("EX-3:8 Freeze requires exactly twelve architectural locks.");
}

if (ExecutiveTimelineExperienceFreezeContracts.length !== 10) {
  throw new Error("EX-3:8 Freeze requires exactly ten contracts.");
}

if (
  !ExecutiveTimelineExperienceFreezeLocks.every(
    (entry) => entry.outcome === "Locked",
  )
) {
  throw new Error("EX-3:8 Freeze requires all twelve locks Locked.");
}

export const ExecutiveTimelineExperienceFreezeDependencyDeclaration =
  Object.freeze({
    runtimeDependency:
      "EX-3:7/ExecutiveTimelineExperienceCertification" as const,
    certificationOnly: true as const,
    earlierPhasesReachedThroughCertificationOnly: true as const,
    dynamicImports: false as const,
    requireCalls: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveTimelineExperienceFreezeSummaryValue = Object.freeze({
  identity: ExecutiveTimelineExperienceFreezeId,
  namespace: ExecutiveTimelineExperienceFreezeNamespace,
  version: ExecutiveTimelineExperienceFreezeVersion,
  status: ExecutiveTimelineExperienceFreezeStatus,
  readiness: ExecutiveTimelineExperienceFreezeReadiness,
  previousPhase: ExecutiveTimelineExperienceFreezePreviousPhase,
  nextPhase: ExecutiveTimelineExperienceFreezeNextPhase,
  upstreamDependency: "EX-3:7/ExecutiveTimelineExperienceCertification",
  lockCount: 12,
  contractCount: 10,
  metadataOnly: true,
  deterministic: true,
  sideEffectFree: true,
  sealed: true,
  publicIndexCreated: false,
  publicIndexAuthorized: false,
} as const satisfies ExecutiveTimelineExperienceFreezeSummary);

export const getExecutiveTimelineExperienceFreezeSummary =
  (): ExecutiveTimelineExperienceFreezeSummary =>
    ExecutiveTimelineExperienceFreezeSummaryValue;

export const ExecutiveTimelineExperienceFreeze = Object.freeze({
  identity: ExecutiveTimelineExperienceFreezeIdentity,
  lifecycle: ExecutiveTimelineExperienceFreezeLifecycle,
  locks: ExecutiveTimelineExperienceFreezeLocks,
  lockSeal: ExecutiveTimelineExperienceFreezeLockSeal,
  contracts: ExecutiveTimelineExperienceFreezeContracts,
  metadata: ExecutiveTimelineExperienceFreezeMetadata,
  authorization: ExecutiveTimelineExperienceFreezeAuthorization,
  boundaries: ExecutiveTimelineExperienceFreezeBoundaries,
  decisions: ExecutiveTimelineExperienceFreezeDecisions,
  certification: ExecutiveTimelineExperienceCertification,
  dependencyDeclaration:
    ExecutiveTimelineExperienceFreezeDependencyDeclaration,
  getSummary: getExecutiveTimelineExperienceFreezeSummary,
  status: ExecutiveTimelineExperienceFreezeStatus,
  readiness: ExecutiveTimelineExperienceFreezeReadiness,
  aliases: ExecutiveTimelineExperienceFreezeApprovedAliases,
  lockCount: ExecutiveTimelineExperienceFreezeLockCount,
  contractCount: ExecutiveTimelineExperienceFreezeContractCount,
  lifecycleStates: ExecutiveTimelineExperienceFreezeLifecycleStates,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  failClosed: true as const,
  sideEffectFree: true as const,
  sealed: true as const,
  mutationAllowed: false as const,
  modifiesCertification: false as const,
  providerExecution: false as const,
  rtcIntegration: false as const,
  uiRendering: false as const,
  playbackEngine: false as const,
  publicIndexCreated: false as const,
  publicIndexAuthorized: false as const,
  ex39Created: false as const,
  ex39Authorized: false as const,
});

export {
  assertExecutiveTimelineExperienceFreezeIdentity,
  assertExecutiveTimelineExperienceFreezeLifecycleTransition,
  canTransitionExecutiveTimelineExperienceFreezeLifecycle,
  isExecutiveTimelineExperienceFreezeLifecycleState,
  resolveExecutiveTimelineExperienceFreezeIdentity,
};
