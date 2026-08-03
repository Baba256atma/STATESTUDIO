/**
 * EX-2:7 — metadata-only Executive Journal Experience Certification aggregate.
 *
 * EX-2:6 Platform is the sole upstream runtime dependency. Earlier phases are
 * reached only through that exact aggregate.
 */

import { ExecutiveJournalExperiencePlatform } from "./executiveJournalExperiencePlatform.ts";
import {
  ExecutiveJournalExperienceCertificationContracts,
  ExecutiveJournalExperienceCertificationCriterionOutcomeValues,
  ExecutiveJournalExperienceCertificationEvidenceKindValues,
  ExecutiveJournalExperienceCertificationResultStatusValues,
  isExecutiveJournalExperienceCertificationCriterionOutcome,
  isExecutiveJournalExperienceCertificationEvidenceKind,
  isExecutiveJournalExperienceCertificationResultStatus,
} from "./executiveJournalExperienceCertificationContracts.ts";
import {
  ExecutiveJournalExperienceCertificationEvidence,
  ExecutiveJournalExperienceCertificationEvidenceByKind,
  ExecutiveJournalExperienceCertificationEvidenceCatalogue,
} from "./executiveJournalExperienceCertificationEvidence.ts";
import {
  ExecutiveJournalExperienceCertificationApprovedAliases,
  ExecutiveJournalExperienceCertificationId,
  ExecutiveJournalExperienceCertificationIdentity,
  ExecutiveJournalExperienceCertificationNamespace,
  ExecutiveJournalExperienceCertificationNextPhase,
  ExecutiveJournalExperienceCertificationPreviousPhase,
  ExecutiveJournalExperienceCertificationReadiness,
  ExecutiveJournalExperienceCertificationStatus,
  assertExecutiveJournalExperienceCertificationIdentity,
  resolveExecutiveJournalExperienceCertificationIdentity,
} from "./executiveJournalExperienceCertificationIdentity.ts";
import {
  ExecutiveJournalExperienceCertificationLifecycle,
  ExecutiveJournalExperienceCertificationLifecycleStates,
  assertExecutiveJournalExperienceCertificationLifecycleTransition,
  canTransitionExecutiveJournalExperienceCertificationLifecycle,
  isExecutiveJournalExperienceCertificationLifecycleState,
} from "./executiveJournalExperienceCertificationLifecycle.ts";
import {
  ExecutiveJournalExperienceCertificationAuthorization,
  ExecutiveJournalExperienceCertificationBoundaries,
  ExecutiveJournalExperienceCertificationCriteria,
  ExecutiveJournalExperienceCertificationDecisions,
  ExecutiveJournalExperienceCertificationMetadata,
  ExecutiveJournalExperienceCertificationReadinessConditions,
} from "./executiveJournalExperienceCertificationMetadata.ts";
import type { ExecutiveJournalExperienceCertificationSummary } from "./executiveJournalExperienceCertificationTypes.ts";

export * from "./executiveJournalExperienceCertificationTypes.ts";
export * from "./executiveJournalExperienceCertificationIdentity.ts";
export * from "./executiveJournalExperienceCertificationLifecycle.ts";
export * from "./executiveJournalExperienceCertificationContracts.ts";
export * from "./executiveJournalExperienceCertificationEvidence.ts";
export * from "./executiveJournalExperienceCertificationMetadata.ts";

if (
  ExecutiveJournalExperiencePlatform
    !== ExecutiveJournalExperienceCertificationEvidenceByKind.platform.platform
) {
  throw new Error(
    "EX-2:7 Certification must bind the exact EX-2:6 Platform aggregate.",
  );
}

if (
  ExecutiveJournalExperiencePlatform.readiness !== "ReadyForCertification"
) {
  throw new Error(
    "EX-2:7 Certification requires Platform readiness ReadyForCertification.",
  );
}

if (!ExecutiveJournalExperiencePlatform.canonicalEligibility.eligible) {
  throw new Error(
    "EX-2:7 Certification requires Platform canonical eligibility Eligible.",
  );
}

if (
  ExecutiveJournalExperiencePlatform.authorization.authorizationDecisionId
    !== "AD-EX2-14"
  || ExecutiveJournalExperiencePlatform.authorization.authorizationStatus
    !== "Accepted"
) {
  throw new Error(
    "EX-2:7 Certification requires AD-EX2-14 Accepted Platform authorization.",
  );
}

if (
  !ExecutiveJournalExperienceCertificationCriteria.every(
    (entry) => entry.outcome === "Satisfied",
  )
) {
  throw new Error(
    "EX-2:7 Certification requires all sixteen criteria Satisfied.",
  );
}

export const ExecutiveJournalExperienceCertificationUpstream = Object.freeze({
  platform: ExecutiveJournalExperiencePlatform,
  platformIdentity: ExecutiveJournalExperiencePlatform.identity,
  platformLifecycle: ExecutiveJournalExperiencePlatform.lifecycle,
  platformCanonicalEligibility:
    ExecutiveJournalExperiencePlatform.canonicalEligibility,
  platformAuthorization: ExecutiveJournalExperiencePlatform.authorization,
  platformContracts: ExecutiveJournalExperiencePlatform.contracts,
  platformBindings: ExecutiveJournalExperiencePlatform.bindings,
  openIssues: ExecutiveJournalExperiencePlatform.openIssues,
  pendingGates: ExecutiveJournalExperiencePlatform.pendingGates,
  upstreamChain: Object.freeze([
    ExecutiveJournalExperienceCertificationId,
    ...ExecutiveJournalExperiencePlatform.upstream.upstreamChain,
  ] as const),
  exactReferencesPreserved: true as const,
  earlierPhasesReachedThroughPlatformOnly: true as const,
  metadataOnly: true as const,
  immutable: true as const,
});

export const ExecutiveJournalExperienceCertificationResult = Object.freeze({
  resultId: "EX-2:7/ExecutiveJournalExperienceCertificationResult" as const,
  status: "Certified" as const,
  readiness: "ReadyForFreeze" as const,
  certifiedPlatformIdentity:
    "EX-2:6/ExecutiveJournalExperiencePlatform" as const,
  criterionCount: 16 as const,
  satisfiedCriterionCount: 16 as const,
  failedCriterionCount: 0 as const,
  criteria: ExecutiveJournalExperienceCertificationCriteria,
  authorizationDecisionId: "AD-EX2-14" as const,
  evidenceCount: 7 as const,
  metadataOnly: true as const,
  deterministic: true as const,
  modifiesPlatform: false as const,
  freezeAuthorized: false as const,
  immutable: true as const,
});

export const ExecutiveJournalExperienceCertificationDependencyDeclaration =
  Object.freeze({
    runtimeDependency:
      "EX-2:6/ExecutiveJournalExperiencePlatform" as const,
    platformOnly: true as const,
    earlierPhasesReachedThroughPlatformOnly: true as const,
    prohibitedDependencies: Object.freeze([
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

export const ExecutiveJournalExperienceCertificationSummaryValue = Object.freeze(
  {
    identity: ExecutiveJournalExperienceCertificationId,
    namespace: ExecutiveJournalExperienceCertificationNamespace,
    status: ExecutiveJournalExperienceCertificationStatus,
    readiness: ExecutiveJournalExperienceCertificationReadiness,
    previousPhase: ExecutiveJournalExperienceCertificationPreviousPhase,
    nextPhase: ExecutiveJournalExperienceCertificationNextPhase,
    criterionCount: 16,
    contractCount: 10,
    evidenceCount: 7,
    decisionCount: 6,
    lifecycleStateCount: 5,
    authorizationDecisionId: "AD-EX2-14",
    platformIdentity: "EX-2:6/ExecutiveJournalExperiencePlatform",
    platformReadiness: "ReadyForCertification",
    platformEligible: true,
    metadataOnly: true,
    deterministic: true,
    sideEffectFree: true,
    modifiesPlatform: false,
    freezeCreated: false,
    freezeAuthorized: false,
    publicIndexCreated: false,
    ciLintClassification: "CiStillBlockedByParkedReactCompilerDebt",
  } as const satisfies ExecutiveJournalExperienceCertificationSummary,
);

export const getExecutiveJournalExperienceCertificationSummary =
  (): ExecutiveJournalExperienceCertificationSummary =>
    ExecutiveJournalExperienceCertificationSummaryValue;

export const ExecutiveJournalExperienceCertification = Object.freeze({
  identity: ExecutiveJournalExperienceCertificationIdentity,
  lifecycle: ExecutiveJournalExperienceCertificationLifecycle,
  types: Object.freeze({
    criterionOutcomes:
      ExecutiveJournalExperienceCertificationCriterionOutcomeValues,
    resultStatuses: ExecutiveJournalExperienceCertificationResultStatusValues,
    evidenceKinds: ExecutiveJournalExperienceCertificationEvidenceKindValues,
    lifecycleStates: ExecutiveJournalExperienceCertificationLifecycleStates,
  }),
  contracts: ExecutiveJournalExperienceCertificationContracts,
  criteria: ExecutiveJournalExperienceCertificationCriteria,
  evidence: ExecutiveJournalExperienceCertificationEvidence,
  evidenceCatalogue: ExecutiveJournalExperienceCertificationEvidenceCatalogue,
  evidenceByKind: ExecutiveJournalExperienceCertificationEvidenceByKind,
  result: ExecutiveJournalExperienceCertificationResult,
  readinessConditions:
    ExecutiveJournalExperienceCertificationReadinessConditions,
  metadata: ExecutiveJournalExperienceCertificationMetadata,
  platform: ExecutiveJournalExperiencePlatform,
  upstream: ExecutiveJournalExperienceCertificationUpstream,
  decisions: ExecutiveJournalExperienceCertificationDecisions,
  openIssues: ExecutiveJournalExperiencePlatform.openIssues,
  pendingGates: ExecutiveJournalExperiencePlatform.pendingGates,
  authorization: ExecutiveJournalExperienceCertificationAuthorization,
  boundaries: ExecutiveJournalExperienceCertificationBoundaries,
  dependencyDeclaration:
    ExecutiveJournalExperienceCertificationDependencyDeclaration,
  getSummary: getExecutiveJournalExperienceCertificationSummary,
  status: ExecutiveJournalExperienceCertificationStatus,
  readiness: ExecutiveJournalExperienceCertificationReadiness,
  aliases: ExecutiveJournalExperienceCertificationApprovedAliases,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  failClosed: true as const,
  sideEffectFree: true as const,
  evaluatesOnly: true as const,
  modifiesPlatform: false as const,
  providerExecution: false as const,
  realRtc2Consumption: false as const,
  productionAuthorized: false as const,
  freezeCreated: false as const,
  freezeAuthorized: false as const,
  publicIndexCreated: false as const,
  ex28Created: false as const,
  ex28Authorized: false as const,
});

export {
  assertExecutiveJournalExperienceCertificationIdentity,
  assertExecutiveJournalExperienceCertificationLifecycleTransition,
  canTransitionExecutiveJournalExperienceCertificationLifecycle,
  isExecutiveJournalExperienceCertificationCriterionOutcome,
  isExecutiveJournalExperienceCertificationEvidenceKind,
  isExecutiveJournalExperienceCertificationLifecycleState,
  isExecutiveJournalExperienceCertificationResultStatus,
  resolveExecutiveJournalExperienceCertificationIdentity,
};
