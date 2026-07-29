/**
 * RTC-3:8 — Executive Decision Register Reconciliation & Assurance.
 *
 * Deterministic evidence, reconciliation, and assurance layer over
 * RTC-3:7 Execution Contract. Consumes RTC-3:7 public surface only.
 * Reach enforcement/policy/validation/model/registry/foundation through
 * the upstream chain. Evaluation only — never repairs or fetches.
 *
 * Ownership: owned exclusively by RTC-3:8.
 */

import { ExecutiveDecisionRegisterExecution } from "./executiveDecisionRegisterExecution.ts";
import {
  ExecutiveDecisionRegisterAssuranceContractNames,
  ExecutiveDecisionRegisterAssuranceContracts,
} from "./executiveDecisionRegisterAssuranceContracts.ts";
import {
  ExecutiveDecisionRegisterAssuranceId,
  ExecutiveDecisionRegisterAssuranceIdentity,
  ExecutiveDecisionRegisterAssuranceName,
  ExecutiveDecisionRegisterAssuranceNamespace,
  ExecutiveDecisionRegisterAssuranceNextPhase,
  ExecutiveDecisionRegisterAssurancePreviousPhase,
  ExecutiveDecisionRegisterAssuranceReadiness,
  ExecutiveDecisionRegisterAssuranceStatus,
  ExecutiveDecisionRegisterAssuranceVersion,
} from "./executiveDecisionRegisterAssuranceIdentity.ts";
import {
  ExecutiveDecisionRegisterAssuranceEvidenceKinds,
  ExecutiveDecisionRegisterAssuranceLifecycle,
  ExecutiveDecisionRegisterAssuranceSubjectKinds,
} from "./executiveDecisionRegisterAssuranceLifecycle.ts";
import {
  ExecutiveDecisionRegisterArchitectureDecisionAdrtc308,
  ExecutiveDecisionRegisterAssuranceAiMustNot,
  ExecutiveDecisionRegisterAssuranceArchitectureDecisions,
  ExecutiveDecisionRegisterAssuranceBoundaries,
  ExecutiveDecisionRegisterAssuranceDecisions,
  ExecutiveDecisionRegisterAssuranceMetadata,
  ExecutiveDecisionRegisterAssuranceOpenIssues,
  ExecutiveDecisionRegisterAssuranceOwnership,
  ExecutiveDecisionRegisterAssurancePrinciples,
  ExecutiveDecisionRegisterAssuranceProhibitedSurfaces,
  ExecutiveDecisionRegisterAssuranceUpstreamAdrtc306,
  ExecutiveDecisionRegisterAssuranceUpstreamAdrtc307,
  ExecutiveDecisionRegisterAssuranceUpstreamEnforcementDecisions,
  ExecutiveDecisionRegisterAssuranceUpstreamExecutionDecisions,
  ExecutiveDecisionRegisterAssuranceUpstreamFoundationDecisions,
  ExecutiveDecisionRegisterAssuranceUpstreamModelDecisions,
  ExecutiveDecisionRegisterAssuranceUpstreamPolicyDecisions,
  ExecutiveDecisionRegisterAssuranceUpstreamRegistryDecisions,
  ExecutiveDecisionRegisterAssuranceUpstreamValidationDecisions,
} from "./executiveDecisionRegisterAssuranceMetadata.ts";
import {
  assessExecutiveDecisionRegisterAssurance,
  ExecutiveDecisionRegisterAssuranceFindingCodes,
  ExecutiveDecisionRegisterAssuranceRules,
  getExecutiveDecisionRegisterAssuranceFindings,
  isExecutiveDecisionRegisterAssured,
  isExecutiveDecisionRegisterNotAssured,
  reconcileExecutiveDecisionRegisterEvidenceBundle,
  reconcileExecutiveDecisionRegisterIntentReceipt,
  validateExecutiveDecisionRegisterAssuranceRuleCatalogue,
} from "./executiveDecisionRegisterAssuranceRules.ts";
import type { ExecutiveDecisionRegisterAssuranceSummary } from "./executiveDecisionRegisterAssuranceTypes.ts";

export {
  ExecutiveDecisionRegisterAssuranceId,
  ExecutiveDecisionRegisterAssuranceIdentity,
  ExecutiveDecisionRegisterAssuranceName,
  ExecutiveDecisionRegisterAssuranceNamespace,
  ExecutiveDecisionRegisterAssuranceNextPhase,
  ExecutiveDecisionRegisterAssurancePreviousPhase,
  ExecutiveDecisionRegisterAssuranceReadiness,
  ExecutiveDecisionRegisterAssuranceStatus,
  ExecutiveDecisionRegisterAssuranceVersion,
};

export {
  ExecutiveDecisionRegisterArchitectureDecisionAdrtc308,
  ExecutiveDecisionRegisterAssuranceDecisions,
};

export {
  assessExecutiveDecisionRegisterAssurance,
  reconcileExecutiveDecisionRegisterEvidenceBundle,
  reconcileExecutiveDecisionRegisterIntentReceipt,
  isExecutiveDecisionRegisterAssured,
  isExecutiveDecisionRegisterNotAssured,
  getExecutiveDecisionRegisterAssuranceFindings,
  validateExecutiveDecisionRegisterAssuranceRuleCatalogue,
};

if (ExecutiveDecisionRegisterExecution.readiness !== "ReadyForAssurance") {
  throw new Error(
    "RTC-3:8 Assurance requires RTC-3:7 Execution Contract readiness ReadyForAssurance.",
  );
}

if (
  ExecutiveDecisionRegisterExecution.identity.id
    !== "RTC-3:7/ExecutiveDecisionRegisterExecutionContract"
) {
  throw new Error(
    "RTC-3:8 Assurance requires the canonical RTC-3:7 Execution Contract aggregate.",
  );
}

if (!validateExecutiveDecisionRegisterAssuranceRuleCatalogue()) {
  throw new Error(
    "RTC-3:8 Assurance requires a complete unique-priority rule catalogue.",
  );
}

/**
 * Canonical immutable Executive Decision Register Assurance aggregate.
 */
export const ExecutiveDecisionRegisterAssurance = Object.freeze({
  identity: ExecutiveDecisionRegisterAssuranceIdentity,
  execution: ExecutiveDecisionRegisterExecution,
  enforcement: ExecutiveDecisionRegisterExecution.enforcement,
  policy: ExecutiveDecisionRegisterExecution.policy,
  validation: ExecutiveDecisionRegisterExecution.validation,
  model: ExecutiveDecisionRegisterExecution.model,
  registry: ExecutiveDecisionRegisterExecution.registry,
  foundation: ExecutiveDecisionRegisterExecution.foundation,
  lifecycle: ExecutiveDecisionRegisterAssuranceLifecycle,
  contracts: ExecutiveDecisionRegisterAssuranceContracts,
  contractNames: ExecutiveDecisionRegisterAssuranceContractNames,
  rules: ExecutiveDecisionRegisterAssuranceRules,
  findingCodes: ExecutiveDecisionRegisterAssuranceFindingCodes,
  subjectKinds: ExecutiveDecisionRegisterAssuranceSubjectKinds,
  evidenceKinds: ExecutiveDecisionRegisterAssuranceEvidenceKinds,
  principles: ExecutiveDecisionRegisterAssurancePrinciples,
  decisions: ExecutiveDecisionRegisterAssuranceDecisions,
  architectureDecision: ExecutiveDecisionRegisterArchitectureDecisionAdrtc308,
  architectureDecisions:
    ExecutiveDecisionRegisterAssuranceArchitectureDecisions,
  architectureDecisionIds: Object.freeze([
    "AD-RTC3-06",
    "AD-RTC3-07",
    "AD-RTC3-08",
  ] as const),
  upstreamArchitectureDecisionAdrtc306:
    ExecutiveDecisionRegisterAssuranceUpstreamAdrtc306,
  upstreamArchitectureDecisionAdrtc307:
    ExecutiveDecisionRegisterAssuranceUpstreamAdrtc307,
  upstreamFoundationDecisions:
    ExecutiveDecisionRegisterAssuranceUpstreamFoundationDecisions,
  upstreamRegistryDecisions:
    ExecutiveDecisionRegisterAssuranceUpstreamRegistryDecisions,
  upstreamModelDecisions:
    ExecutiveDecisionRegisterAssuranceUpstreamModelDecisions,
  upstreamValidationDecisions:
    ExecutiveDecisionRegisterAssuranceUpstreamValidationDecisions,
  upstreamPolicyDecisions:
    ExecutiveDecisionRegisterAssuranceUpstreamPolicyDecisions,
  upstreamEnforcementDecisions:
    ExecutiveDecisionRegisterAssuranceUpstreamEnforcementDecisions,
  upstreamExecutionDecisions:
    ExecutiveDecisionRegisterAssuranceUpstreamExecutionDecisions,
  openIssues: ExecutiveDecisionRegisterAssuranceOpenIssues,
  ownership: ExecutiveDecisionRegisterAssuranceOwnership,
  boundaries: ExecutiveDecisionRegisterAssuranceBoundaries,
  prohibitedSurfaces: ExecutiveDecisionRegisterAssuranceProhibitedSurfaces,
  aiMustNot: ExecutiveDecisionRegisterAssuranceAiMustNot,
  metadata: ExecutiveDecisionRegisterAssuranceMetadata,
  status: ExecutiveDecisionRegisterAssuranceStatus,
  readiness: ExecutiveDecisionRegisterAssuranceReadiness,
  previousPhase: ExecutiveDecisionRegisterAssurancePreviousPhase,
  nextPhase: ExecutiveDecisionRegisterAssuranceNextPhase,
  assess: assessExecutiveDecisionRegisterAssurance,
  reconcileBundle: reconcileExecutiveDecisionRegisterEvidenceBundle,
  reconcileIntentReceipt: reconcileExecutiveDecisionRegisterIntentReceipt,
  isAssured: isExecutiveDecisionRegisterAssured,
  isNotAssured: isExecutiveDecisionRegisterNotAssured,
  getFindings: getExecutiveDecisionRegisterAssuranceFindings,
  validateRuleCatalogue: validateExecutiveDecisionRegisterAssuranceRuleCatalogue,
  statistics: Object.freeze({
    ruleCount: ExecutiveDecisionRegisterAssuranceRules.length,
    contractCount: ExecutiveDecisionRegisterAssuranceContracts.length,
    subjectKindCount: ExecutiveDecisionRegisterAssuranceSubjectKinds.length,
    evidenceKindCount: ExecutiveDecisionRegisterAssuranceEvidenceKinds.length,
    findingCodeCount: ExecutiveDecisionRegisterAssuranceFindingCodes.length,
    openIssueCount: ExecutiveDecisionRegisterAssuranceOpenIssues.length,
    principleCount: ExecutiveDecisionRegisterAssurancePrinciples.length,
    decisionCount: ExecutiveDecisionRegisterAssuranceDecisions.length,
  }),
  upstreamDependencies: Object.freeze([
    "RTC-3:7 — Executive Decision Register Execution Contract",
  ]),
  upstreamChain: Object.freeze({
    execution: ExecutiveDecisionRegisterExecution.identity.id,
    enforcement: ExecutiveDecisionRegisterExecution.enforcement.identity.id,
    policy: ExecutiveDecisionRegisterExecution.policy.identity.id,
    validation: ExecutiveDecisionRegisterExecution.validation.identity.id,
    model: ExecutiveDecisionRegisterExecution.model.identity.id,
    registry: ExecutiveDecisionRegisterExecution.registry.identity.id,
    foundation:
      ExecutiveDecisionRegisterExecution.foundation.identity.foundationId,
  }),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  evaluatesOnly: true as const,
  repairsEvidence: false as const,
  repairsInput: false as const,
  failClosed: true as const,
  mutatesInputs: false as const,
  executes: false as const,
  persists: false as const,
  dispatches: false as const,
  publishes: false as const,
  mutatesDomainState: false as const,
  createsAuthority: false as const,
  confirmsDecisions: false as const,
  certifies: false as const,
  authorizesConsumption: false as const,
  authorizesIntegration: false as const,
  authorizesDeployment: false as const,
  usesSystemClock: false as const,
  usesNetwork: false as const,
  usesRandomness: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  resolvesOpenIssues: false as const,
  importsExecutionOnly: true as const,
  importsEnforcementDirectly: false as const,
  assurancePhase: true as const,
  certificationPhase: false as const,
  freezePhase: false as const,
  importsRtc2: false as const,
  importsRtc1: false as const,
  importsApp8: false as const,
} as const);

export function getExecutiveDecisionRegisterAssuranceSummary():
  ExecutiveDecisionRegisterAssuranceSummary {
  return Object.freeze({
    assuranceId: ExecutiveDecisionRegisterAssuranceId,
    version: ExecutiveDecisionRegisterAssuranceVersion,
    name: ExecutiveDecisionRegisterAssuranceName,
    namespace: ExecutiveDecisionRegisterAssuranceNamespace,
    status: ExecutiveDecisionRegisterAssuranceStatus,
    readiness: ExecutiveDecisionRegisterAssuranceReadiness,
    ruleCount: ExecutiveDecisionRegisterAssuranceRules.length,
    subjectKindCount: ExecutiveDecisionRegisterAssuranceSubjectKinds.length,
    evidenceKindCount: ExecutiveDecisionRegisterAssuranceEvidenceKinds.length,
    findingCodeCount: ExecutiveDecisionRegisterAssuranceFindingCodes.length,
    openIssueCount: ExecutiveDecisionRegisterAssuranceOpenIssues.length,
    decisionCount: ExecutiveDecisionRegisterAssuranceDecisions.length,
    sourceExecution:
      "RTC-3:7/ExecutiveDecisionRegisterExecutionContract" as const,
    previousPhase: ExecutiveDecisionRegisterAssurancePreviousPhase,
    nextPhase: ExecutiveDecisionRegisterAssuranceNextPhase,
    architectureDecisionIds: Object.freeze([
      "AD-RTC3-06",
      "AD-RTC3-07",
      "AD-RTC3-08",
    ] as const),
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveDecisionRegisterAssurance = () =>
  ExecutiveDecisionRegisterAssurance;
