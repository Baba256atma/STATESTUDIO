/**
 * RTC-2:8 — Executive Journal Runtime Reconciliation & Assurance.
 *
 * Deterministic evidence, reconciliation, and assurance layer over
 * RTC-2:7 Execution Contract. Consumes RTC-2:7 public surface only.
 * Reach enforcement/policy/validation/model/registry/foundation through
 * the upstream chain. Evaluation only — never repairs or fetches.
 *
 * Ownership: owned exclusively by RTC-2:8.
 */

import { ExecutiveJournalRuntimeExecution } from "./executiveJournalRuntimeExecution.ts";
import {
  ExecutiveJournalRuntimeAssuranceContractNames,
  ExecutiveJournalRuntimeAssuranceContracts,
} from "./executiveJournalRuntimeAssuranceContracts.ts";
import {
  ExecutiveJournalRuntimeAssuranceId,
  ExecutiveJournalRuntimeAssuranceIdentity,
  ExecutiveJournalRuntimeAssuranceName,
  ExecutiveJournalRuntimeAssuranceNamespace,
  ExecutiveJournalRuntimeAssuranceNextPhase,
  ExecutiveJournalRuntimeAssurancePreviousPhase,
  ExecutiveJournalRuntimeAssuranceReadiness,
  ExecutiveJournalRuntimeAssuranceStatus,
  ExecutiveJournalRuntimeAssuranceVersion,
} from "./executiveJournalRuntimeAssuranceIdentity.ts";
import {
  ExecutiveJournalRuntimeAssuranceLifecycle,
  ExecutiveJournalRuntimeAssuranceSubjectKinds,
} from "./executiveJournalRuntimeAssuranceLifecycle.ts";
import {
  ExecutiveJournalAssuranceAiMustNot,
  ExecutiveJournalRuntimeAssuranceBoundaries,
  ExecutiveJournalRuntimeAssuranceMetadata,
  ExecutiveJournalRuntimeAssuranceOpenIssues,
  ExecutiveJournalRuntimeAssuranceOwnership,
  ExecutiveJournalRuntimeAssurancePrinciples,
  ExecutiveJournalRuntimeAssuranceProhibitedSurfaces,
} from "./executiveJournalRuntimeAssuranceMetadata.ts";
import {
  assessExecutiveJournalRuntimeAssurance,
  ExecutiveJournalRuntimeAssuranceRules,
  getExecutiveJournalRuntimeAssuranceFindings,
  isExecutiveJournalRuntimeReconciled,
  reconcileExecutiveJournalRuntimeEvidenceBundle,
  reconcileExecutiveJournalRuntimeIntentReceipt,
  validateExecutiveJournalAssuranceRuleCatalogue,
} from "./executiveJournalRuntimeAssuranceRules.ts";
import type { ExecutiveJournalRuntimeAssuranceSummary } from "./executiveJournalRuntimeAssuranceTypes.ts";

export {
  ExecutiveJournalRuntimeAssuranceId,
  ExecutiveJournalRuntimeAssuranceIdentity,
  ExecutiveJournalRuntimeAssuranceName,
  ExecutiveJournalRuntimeAssuranceNamespace,
  ExecutiveJournalRuntimeAssuranceNextPhase,
  ExecutiveJournalRuntimeAssurancePreviousPhase,
  ExecutiveJournalRuntimeAssuranceReadiness,
  ExecutiveJournalRuntimeAssuranceStatus,
  ExecutiveJournalRuntimeAssuranceVersion,
};

export {
  assessExecutiveJournalRuntimeAssurance,
  reconcileExecutiveJournalRuntimeEvidenceBundle,
  reconcileExecutiveJournalRuntimeIntentReceipt,
  isExecutiveJournalRuntimeReconciled,
  getExecutiveJournalRuntimeAssuranceFindings,
  validateExecutiveJournalAssuranceRuleCatalogue,
};

if (ExecutiveJournalRuntimeExecution.readiness !== "ReadyForAssurance") {
  throw new Error(
    "RTC-2:8 Assurance requires RTC-2:7 Execution Contract readiness ReadyForAssurance.",
  );
}

if (
  ExecutiveJournalRuntimeExecution.identity.id
    !== "RTC-2:7/ExecutiveJournalRuntimeExecutionContract"
) {
  throw new Error(
    "RTC-2:8 Assurance requires the canonical RTC-2:7 Execution Contract aggregate.",
  );
}

if (!validateExecutiveJournalAssuranceRuleCatalogue()) {
  throw new Error(
    "RTC-2:8 Assurance requires a complete unique-priority rule catalogue.",
  );
}

/**
 * Canonical immutable Executive Journal Runtime Assurance aggregate.
 */
export const ExecutiveJournalRuntimeAssurance = Object.freeze({
  identity: ExecutiveJournalRuntimeAssuranceIdentity,
  execution: ExecutiveJournalRuntimeExecution,
  enforcement: ExecutiveJournalRuntimeExecution.enforcement,
  policy: ExecutiveJournalRuntimeExecution.policy,
  validation: ExecutiveJournalRuntimeExecution.validation,
  model: ExecutiveJournalRuntimeExecution.model,
  registry: ExecutiveJournalRuntimeExecution.registry,
  foundation: ExecutiveJournalRuntimeExecution.foundation,
  lifecycle: ExecutiveJournalRuntimeAssuranceLifecycle,
  contracts: ExecutiveJournalRuntimeAssuranceContracts,
  contractNames: ExecutiveJournalRuntimeAssuranceContractNames,
  rules: ExecutiveJournalRuntimeAssuranceRules,
  subjectKinds: ExecutiveJournalRuntimeAssuranceSubjectKinds,
  principles: ExecutiveJournalRuntimeAssurancePrinciples,
  openIssues: ExecutiveJournalRuntimeAssuranceOpenIssues,
  ownership: ExecutiveJournalRuntimeAssuranceOwnership,
  boundaries: ExecutiveJournalRuntimeAssuranceBoundaries,
  prohibitedSurfaces: ExecutiveJournalRuntimeAssuranceProhibitedSurfaces,
  aiMustNot: ExecutiveJournalAssuranceAiMustNot,
  metadata: ExecutiveJournalRuntimeAssuranceMetadata,
  status: ExecutiveJournalRuntimeAssuranceStatus,
  readiness: ExecutiveJournalRuntimeAssuranceReadiness,
  previousPhase: ExecutiveJournalRuntimeAssurancePreviousPhase,
  nextPhase: ExecutiveJournalRuntimeAssuranceNextPhase,
  assess: assessExecutiveJournalRuntimeAssurance,
  reconcileBundle: reconcileExecutiveJournalRuntimeEvidenceBundle,
  reconcileIntentReceipt: reconcileExecutiveJournalRuntimeIntentReceipt,
  isReconciled: isExecutiveJournalRuntimeReconciled,
  getFindings: getExecutiveJournalRuntimeAssuranceFindings,
  validateRuleCatalogue: validateExecutiveJournalAssuranceRuleCatalogue,
  statistics: Object.freeze({
    ruleCount: ExecutiveJournalRuntimeAssuranceRules.length,
    contractCount: ExecutiveJournalRuntimeAssuranceContracts.length,
    subjectKindCount: ExecutiveJournalRuntimeAssuranceSubjectKinds.length,
    openIssueCount: ExecutiveJournalRuntimeAssuranceOpenIssues.length,
    principleCount: ExecutiveJournalRuntimeAssurancePrinciples.length,
  }),
  upstreamDependencies: Object.freeze([
    "RTC-2:7 — Executive Journal Runtime Execution Contract",
  ]),
  upstreamChain: Object.freeze({
    execution: ExecutiveJournalRuntimeExecution.identity.id,
    enforcement: ExecutiveJournalRuntimeExecution.enforcement.identity.id,
    policy: ExecutiveJournalRuntimeExecution.policy.identity.id,
    validation: ExecutiveJournalRuntimeExecution.validation.identity.id,
    model: ExecutiveJournalRuntimeExecution.model.identity.id,
    registry: ExecutiveJournalRuntimeExecution.registry.identity.id,
    foundation:
      ExecutiveJournalRuntimeExecution.foundation.identity.foundationId,
  }),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  evaluatesOnly: true as const,
  repairsEvidence: false as const,
  failClosed: true as const,
  mutatesInputs: false as const,
  usesSystemClock: false as const,
  usesNetwork: false as const,
  usesRandomness: false as const,
  verifiesCryptography: false as const,
  performsReplay: false as const,
  performsRecovery: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  resolvesOpenIssues: false as const,
  importsExecutionOnly: true as const,
  assurancePhase: true as const,
  freezePhase: false as const,
} as const);

export function getExecutiveJournalRuntimeAssuranceSummary():
  ExecutiveJournalRuntimeAssuranceSummary {
  return Object.freeze({
    assuranceId: ExecutiveJournalRuntimeAssuranceId,
    version: ExecutiveJournalRuntimeAssuranceVersion,
    name: ExecutiveJournalRuntimeAssuranceName,
    namespace: ExecutiveJournalRuntimeAssuranceNamespace,
    status: ExecutiveJournalRuntimeAssuranceStatus,
    readiness: ExecutiveJournalRuntimeAssuranceReadiness,
    ruleCount: ExecutiveJournalRuntimeAssuranceRules.length,
    subjectKindCount: ExecutiveJournalRuntimeAssuranceSubjectKinds.length,
    openIssueCount: ExecutiveJournalRuntimeAssuranceOpenIssues.length,
    sourceExecution:
      "RTC-2:7/ExecutiveJournalRuntimeExecutionContract" as const,
    previousPhase: ExecutiveJournalRuntimeAssurancePreviousPhase,
    nextPhase: ExecutiveJournalRuntimeAssuranceNextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveJournalRuntimeAssurance = () =>
  ExecutiveJournalRuntimeAssurance;
