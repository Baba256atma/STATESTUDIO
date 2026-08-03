/**
 * EX-3:7 — metadata-only Executive Timeline Experience Certification aggregate.
 *
 * EX-3:6 Platform is the sole upstream runtime dependency.
 */

import { ExecutiveTimelineExperiencePlatform } from "./executiveTimelineExperiencePlatform.ts";
import {
  ExecutiveTimelineExperienceCertificationContractCount,
  ExecutiveTimelineExperienceCertificationContracts,
} from "./executiveTimelineExperienceCertificationContracts.ts";
import { ExecutiveTimelineExperienceCertificationEvidenceRecord } from "./executiveTimelineExperienceCertificationEvidence.ts";
import {
  ExecutiveTimelineExperienceCertificationApprovedAliases,
  ExecutiveTimelineExperienceCertificationId,
  ExecutiveTimelineExperienceCertificationIdentity,
  ExecutiveTimelineExperienceCertificationNamespace,
  ExecutiveTimelineExperienceCertificationNextPhase,
  ExecutiveTimelineExperienceCertificationPreviousPhase,
  ExecutiveTimelineExperienceCertificationReadiness,
  ExecutiveTimelineExperienceCertificationStatus,
  ExecutiveTimelineExperienceCertificationVersion,
  assertExecutiveTimelineExperienceCertificationIdentity,
  resolveExecutiveTimelineExperienceCertificationIdentity,
} from "./executiveTimelineExperienceCertificationIdentity.ts";
import {
  ExecutiveTimelineExperienceCertificationLifecycle,
  ExecutiveTimelineExperienceCertificationLifecycleStates,
  assertExecutiveTimelineExperienceCertificationLifecycleTransition,
  canTransitionExecutiveTimelineExperienceCertificationLifecycle,
  isExecutiveTimelineExperienceCertificationLifecycleState,
} from "./executiveTimelineExperienceCertificationLifecycle.ts";
import {
  ExecutiveTimelineExperienceCertificationAuthorization,
  ExecutiveTimelineExperienceCertificationBoundaries,
  ExecutiveTimelineExperienceCertificationCriteria,
  ExecutiveTimelineExperienceCertificationCriteriaCount,
  ExecutiveTimelineExperienceCertificationDecisions,
  ExecutiveTimelineExperienceCertificationMetadata,
} from "./executiveTimelineExperienceCertificationMetadata.ts";
import type { ExecutiveTimelineExperienceCertificationSummary } from "./executiveTimelineExperienceCertificationTypes.ts";

export * from "./executiveTimelineExperienceCertificationTypes.ts";
export * from "./executiveTimelineExperienceCertificationIdentity.ts";
export * from "./executiveTimelineExperienceCertificationLifecycle.ts";
export * from "./executiveTimelineExperienceCertificationContracts.ts";
export * from "./executiveTimelineExperienceCertificationEvidence.ts";
export * from "./executiveTimelineExperienceCertificationMetadata.ts";

if (ExecutiveTimelineExperiencePlatform.readiness !== "ReadyForCertification") {
  throw new Error(
    "EX-3:7 Certification requires Platform readiness ReadyForCertification.",
  );
}

if (ExecutiveTimelineExperiencePlatform.status !== "Platform") {
  throw new Error("EX-3:7 Certification requires Platform status Platform.");
}

if (!ExecutiveTimelineExperiencePlatform.canonicalEligibility.eligible) {
  throw new Error(
    "EX-3:7 Certification requires Platform canonical eligibility Eligible.",
  );
}

if (ExecutiveTimelineExperienceCertificationCriteria.length !== 16) {
  throw new Error(
    "EX-3:7 Certification requires exactly sixteen certification criteria.",
  );
}

if (ExecutiveTimelineExperienceCertificationContracts.length !== 10) {
  throw new Error("EX-3:7 Certification requires exactly ten contracts.");
}

if (
  !ExecutiveTimelineExperienceCertificationCriteria.every(
    (entry) => entry.outcome === "Satisfied",
  )
) {
  throw new Error(
    "EX-3:7 Certification requires all sixteen criteria Satisfied.",
  );
}

export const ExecutiveTimelineExperienceCertificationDependencyDeclaration =
  Object.freeze({
    runtimeDependency: "EX-3:6/ExecutiveTimelineExperiencePlatform" as const,
    platformOnly: true as const,
    earlierPhasesReachedThroughPlatformOnly: true as const,
    dynamicImports: false as const,
    requireCalls: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveTimelineExperienceCertificationSummaryValue =
  Object.freeze({
    identity: ExecutiveTimelineExperienceCertificationId,
    namespace: ExecutiveTimelineExperienceCertificationNamespace,
    version: ExecutiveTimelineExperienceCertificationVersion,
    status: ExecutiveTimelineExperienceCertificationStatus,
    readiness: ExecutiveTimelineExperienceCertificationReadiness,
    previousPhase: ExecutiveTimelineExperienceCertificationPreviousPhase,
    nextPhase: ExecutiveTimelineExperienceCertificationNextPhase,
    upstreamDependency: "EX-3:6/ExecutiveTimelineExperiencePlatform",
    criteriaCount: 16,
    contractCount: 10,
    metadataOnly: true,
    deterministic: true,
    sideEffectFree: true,
    freezeCreated: false,
    freezeAuthorized: false,
  } as const satisfies ExecutiveTimelineExperienceCertificationSummary);

export const getExecutiveTimelineExperienceCertificationSummary =
  (): ExecutiveTimelineExperienceCertificationSummary =>
    ExecutiveTimelineExperienceCertificationSummaryValue;

export const ExecutiveTimelineExperienceCertificationResult = Object.freeze({
  resultId: "EX-3:7/ExecutiveTimelineExperienceCertificationResult" as const,
  status: "Certified" as const,
  readiness: "ReadyForFreeze" as const,
  certifiedPlatformIdentity:
    "EX-3:6/ExecutiveTimelineExperiencePlatform" as const,
  criterionCount: 16 as const,
  satisfiedCriterionCount: 16 as const,
  failedCriterionCount: 0 as const,
  criteria: ExecutiveTimelineExperienceCertificationCriteria,
  evidence: ExecutiveTimelineExperienceCertificationEvidenceRecord,
  freezeAuthorized: false as const,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
});

export const ExecutiveTimelineExperienceCertification = Object.freeze({
  identity: ExecutiveTimelineExperienceCertificationIdentity,
  lifecycle: ExecutiveTimelineExperienceCertificationLifecycle,
  criteria: ExecutiveTimelineExperienceCertificationCriteria,
  evidence: ExecutiveTimelineExperienceCertificationEvidenceRecord,
  contracts: ExecutiveTimelineExperienceCertificationContracts,
  metadata: ExecutiveTimelineExperienceCertificationMetadata,
  authorization: ExecutiveTimelineExperienceCertificationAuthorization,
  boundaries: ExecutiveTimelineExperienceCertificationBoundaries,
  decisions: ExecutiveTimelineExperienceCertificationDecisions,
  result: ExecutiveTimelineExperienceCertificationResult,
  platform: ExecutiveTimelineExperiencePlatform,
  dependencyDeclaration:
    ExecutiveTimelineExperienceCertificationDependencyDeclaration,
  getSummary: getExecutiveTimelineExperienceCertificationSummary,
  status: ExecutiveTimelineExperienceCertificationStatus,
  readiness: ExecutiveTimelineExperienceCertificationReadiness,
  aliases: ExecutiveTimelineExperienceCertificationApprovedAliases,
  criteriaCount: ExecutiveTimelineExperienceCertificationCriteriaCount,
  contractCount: ExecutiveTimelineExperienceCertificationContractCount,
  lifecycleStates: ExecutiveTimelineExperienceCertificationLifecycleStates,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  failClosed: true as const,
  sideEffectFree: true as const,
  providerExecution: false as const,
  rtcIntegration: false as const,
  uiRendering: false as const,
  playbackEngine: false as const,
  freezeCreated: false as const,
  freezeAuthorized: false as const,
  ex38Created: false as const,
  ex38Authorized: false as const,
});

export {
  assertExecutiveTimelineExperienceCertificationIdentity,
  assertExecutiveTimelineExperienceCertificationLifecycleTransition,
  canTransitionExecutiveTimelineExperienceCertificationLifecycle,
  isExecutiveTimelineExperienceCertificationLifecycleState,
  resolveExecutiveTimelineExperienceCertificationIdentity,
};
