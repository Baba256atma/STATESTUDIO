/**
 * EX-2:8 — metadata-only Executive Journal Experience Freeze aggregate.
 *
 * EX-2:7 Certification is the sole upstream runtime dependency. Earlier phases
 * are reached only through that exact aggregate.
 */

import { ExecutiveJournalExperienceCertification } from "./executiveJournalExperienceCertification.ts";
import {
  ExecutiveJournalExperienceFreezeContracts,
  ExecutiveJournalExperienceFreezeLockOutcomeValues,
  isExecutiveJournalExperienceFreezeLockOutcome,
} from "./executiveJournalExperienceFreezeContracts.ts";
import {
  ExecutiveJournalExperienceFreezeApprovedAliases,
  ExecutiveJournalExperienceFreezeId,
  ExecutiveJournalExperienceFreezeIdentity,
  ExecutiveJournalExperienceFreezeNamespace,
  ExecutiveJournalExperienceFreezeNextPhase,
  ExecutiveJournalExperienceFreezePreviousPhase,
  ExecutiveJournalExperienceFreezeReadiness,
  ExecutiveJournalExperienceFreezeStatus,
  assertExecutiveJournalExperienceFreezeIdentity,
  resolveExecutiveJournalExperienceFreezeIdentity,
} from "./executiveJournalExperienceFreezeIdentity.ts";
import {
  ExecutiveJournalExperienceFreezeLifecycle,
  ExecutiveJournalExperienceFreezeLifecycleStates,
  assertExecutiveJournalExperienceFreezeLifecycleTransition,
  canTransitionExecutiveJournalExperienceFreezeLifecycle,
  isExecutiveJournalExperienceFreezeLifecycleState,
} from "./executiveJournalExperienceFreezeLifecycle.ts";
import {
  ExecutiveJournalExperienceFreezeLockByName,
  ExecutiveJournalExperienceFreezeLockSeal,
  ExecutiveJournalExperienceFreezeLockedCertification,
  ExecutiveJournalExperienceFreezeLocks,
} from "./executiveJournalExperienceFreezeLocks.ts";
import {
  ExecutiveJournalExperienceFreezeAuthorization,
  ExecutiveJournalExperienceFreezeBoundaries,
  ExecutiveJournalExperienceFreezeDecisions,
  ExecutiveJournalExperienceFreezeMetadata,
  ExecutiveJournalExperienceFreezeReadinessConditions,
} from "./executiveJournalExperienceFreezeMetadata.ts";
import type { ExecutiveJournalExperienceFreezeSummary } from "./executiveJournalExperienceFreezeTypes.ts";

export * from "./executiveJournalExperienceFreezeTypes.ts";
export * from "./executiveJournalExperienceFreezeIdentity.ts";
export * from "./executiveJournalExperienceFreezeLifecycle.ts";
export * from "./executiveJournalExperienceFreezeContracts.ts";
export * from "./executiveJournalExperienceFreezeLocks.ts";
export * from "./executiveJournalExperienceFreezeMetadata.ts";

if (
  ExecutiveJournalExperienceCertification
    !== ExecutiveJournalExperienceFreezeLockedCertification
) {
  throw new Error(
    "EX-2:8 Freeze must bind the exact EX-2:7 Certification aggregate.",
  );
}

if (ExecutiveJournalExperienceCertification.readiness !== "ReadyForFreeze") {
  throw new Error(
    "EX-2:8 Freeze requires Certification readiness ReadyForFreeze.",
  );
}

if (ExecutiveJournalExperienceCertification.status !== "Certified") {
  throw new Error("EX-2:8 Freeze requires Certification status Certified.");
}

if (
  ExecutiveJournalExperienceCertification.result.status !== "Certified"
  || ExecutiveJournalExperienceCertification.result.readiness
    !== "ReadyForFreeze"
) {
  throw new Error(
    "EX-2:8 Freeze requires Certification result Certified / ReadyForFreeze.",
  );
}

if (
  ExecutiveJournalExperienceCertification.authorization.authorizationDecisionId
    !== "AD-EX2-14"
  || ExecutiveJournalExperienceCertification.authorization.authorizationStatus
    !== "Accepted"
) {
  throw new Error(
    "EX-2:8 Freeze requires AD-EX2-14 Accepted Certification authorization.",
  );
}

if (
  !ExecutiveJournalExperienceFreezeLocks.every(
    (entry) => entry.outcome === "Locked",
  )
) {
  throw new Error("EX-2:8 Freeze requires all twelve locks Locked.");
}

export const ExecutiveJournalExperienceFreezeUpstream = Object.freeze({
  certification: ExecutiveJournalExperienceCertification,
  certificationIdentity: ExecutiveJournalExperienceCertification.identity,
  certificationLifecycle: ExecutiveJournalExperienceCertification.lifecycle,
  certificationResult: ExecutiveJournalExperienceCertification.result,
  certificationAuthorization:
    ExecutiveJournalExperienceCertification.authorization,
  certificationContracts: ExecutiveJournalExperienceCertification.contracts,
  openIssues: ExecutiveJournalExperienceCertification.openIssues,
  pendingGates: ExecutiveJournalExperienceCertification.pendingGates,
  upstreamChain: Object.freeze([
    ExecutiveJournalExperienceFreezeId,
    ...ExecutiveJournalExperienceCertification.upstream.upstreamChain,
  ] as const),
  exactReferencesPreserved: true as const,
  earlierPhasesReachedThroughCertificationOnly: true as const,
  metadataOnly: true as const,
  immutable: true as const,
});

export const ExecutiveJournalExperienceFreezeDependencyDeclaration =
  Object.freeze({
    runtimeDependency:
      "EX-2:7/ExecutiveJournalExperienceCertification" as const,
    certificationOnly: true as const,
    earlierPhasesReachedThroughCertificationOnly: true as const,
    prohibitedDependencies: Object.freeze([
      "Platform",
      "Manifest",
      "Validation",
      "Model",
      "Registry",
      "Foundation",
      "RTC",
      "Scene",
      "UI",
      "Providers",
    ] as const),
    dynamicImports: false as const,
    requireCalls: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveJournalExperienceFreezeSummaryValue = Object.freeze({
  identity: ExecutiveJournalExperienceFreezeId,
  namespace: ExecutiveJournalExperienceFreezeNamespace,
  status: ExecutiveJournalExperienceFreezeStatus,
  readiness: ExecutiveJournalExperienceFreezeReadiness,
  previousPhase: ExecutiveJournalExperienceFreezePreviousPhase,
  nextPhase: ExecutiveJournalExperienceFreezeNextPhase,
  lockCount: 12,
  contractCount: 10,
  decisionCount: 6,
  lifecycleStateCount: 5,
  authorizationDecisionId: "AD-EX2-14",
  certificationIdentity: "EX-2:7/ExecutiveJournalExperienceCertification",
  certificationReadiness: "ReadyForFreeze",
  certificationStatus: "Certified",
  metadataOnly: true,
  deterministic: true,
  sideEffectFree: true,
  sealed: true,
  modifiesCertification: false,
  publicIndexCreated: false,
  publicIndexAuthorized: false,
  ciLintClassification: "CiStillBlockedByParkedReactCompilerDebt",
} as const satisfies ExecutiveJournalExperienceFreezeSummary);

export const getExecutiveJournalExperienceFreezeSummary =
  (): ExecutiveJournalExperienceFreezeSummary =>
    ExecutiveJournalExperienceFreezeSummaryValue;

export const ExecutiveJournalExperienceFreeze = Object.freeze({
  identity: ExecutiveJournalExperienceFreezeIdentity,
  lifecycle: ExecutiveJournalExperienceFreezeLifecycle,
  types: Object.freeze({
    lockOutcomes: ExecutiveJournalExperienceFreezeLockOutcomeValues,
    lifecycleStates: ExecutiveJournalExperienceFreezeLifecycleStates,
  }),
  contracts: ExecutiveJournalExperienceFreezeContracts,
  locks: ExecutiveJournalExperienceFreezeLocks,
  lockByName: ExecutiveJournalExperienceFreezeLockByName,
  lockSeal: ExecutiveJournalExperienceFreezeLockSeal,
  readinessConditions: ExecutiveJournalExperienceFreezeReadinessConditions,
  metadata: ExecutiveJournalExperienceFreezeMetadata,
  certification: ExecutiveJournalExperienceCertification,
  upstream: ExecutiveJournalExperienceFreezeUpstream,
  decisions: ExecutiveJournalExperienceFreezeDecisions,
  openIssues: ExecutiveJournalExperienceCertification.openIssues,
  pendingGates: ExecutiveJournalExperienceCertification.pendingGates,
  authorization: ExecutiveJournalExperienceFreezeAuthorization,
  boundaries: ExecutiveJournalExperienceFreezeBoundaries,
  dependencyDeclaration:
    ExecutiveJournalExperienceFreezeDependencyDeclaration,
  getSummary: getExecutiveJournalExperienceFreezeSummary,
  status: ExecutiveJournalExperienceFreezeStatus,
  readiness: ExecutiveJournalExperienceFreezeReadiness,
  aliases: ExecutiveJournalExperienceFreezeApprovedAliases,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  failClosed: true as const,
  sideEffectFree: true as const,
  sealed: true as const,
  mutationAllowed: false as const,
  modifiesCertification: false as const,
  providerExecution: false as const,
  realRtc2Consumption: false as const,
  productionAuthorized: false as const,
  publicIndexCreated: false as const,
  publicIndexAuthorized: false as const,
  ex29Created: false as const,
  ex29Authorized: false as const,
});

export {
  assertExecutiveJournalExperienceFreezeIdentity,
  assertExecutiveJournalExperienceFreezeLifecycleTransition,
  canTransitionExecutiveJournalExperienceFreezeLifecycle,
  isExecutiveJournalExperienceFreezeLifecycleState,
  isExecutiveJournalExperienceFreezeLockOutcome,
  resolveExecutiveJournalExperienceFreezeIdentity,
};
