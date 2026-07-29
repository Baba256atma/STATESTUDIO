/**
 * RTC-2:7 — Executive Journal Runtime Execution Contract.
 *
 * Deterministic execution-boundary contract over RTC-2:6 Policy Enforcement.
 * Consumes RTC-2:6 public surface only. Reach policy/validation/model/registry/
 * foundation through the upstream chain. Contracts and pure transforms only.
 *
 * Ownership: owned exclusively by RTC-2:7.
 */

import { ExecutiveJournalRuntimeEnforcement } from "./executiveJournalRuntimeEnforcement.ts";
import {
  ExecutiveJournalRuntimeExecutionContractNames,
  ExecutiveJournalRuntimeExecutionContracts,
} from "./executiveJournalRuntimeExecutionContracts.ts";
import {
  ExecutiveJournalRuntimeExecutionArchitectureDivergence,
  ExecutiveJournalRuntimeExecutionId,
  ExecutiveJournalRuntimeExecutionIdentity,
  ExecutiveJournalRuntimeExecutionName,
  ExecutiveJournalRuntimeExecutionNamespace,
  ExecutiveJournalRuntimeExecutionNextPhase,
  ExecutiveJournalRuntimeExecutionReadiness,
  ExecutiveJournalRuntimeExecutionStatus,
  ExecutiveJournalRuntimeExecutionVersion,
} from "./executiveJournalRuntimeExecutionIdentity.ts";
import {
  ExecutiveJournalRuntimeExecutionLifecycle,
  ExecutiveJournalRuntimeExecutionStepKinds,
} from "./executiveJournalRuntimeExecutionLifecycle.ts";
import {
  ExecutiveJournalExecutionAiMustNot,
  ExecutiveJournalRuntimeArchitectureDecisionAdrtc207,
  ExecutiveJournalRuntimeExecutionBoundaries,
  ExecutiveJournalRuntimeExecutionDecisions,
  ExecutiveJournalRuntimeExecutionMetadata,
  ExecutiveJournalRuntimeExecutionOpenIssues,
  ExecutiveJournalRuntimeExecutionOwnership,
  ExecutiveJournalRuntimeExecutionPrinciples,
  ExecutiveJournalRuntimeExecutionProhibitedSurfaces,
} from "./executiveJournalRuntimeExecutionMetadata.ts";
import {
  compareExecutiveJournalRuntimeIdempotency,
  constructExecutiveJournalRuntimeExecutionIntent,
  createExecutiveJournalRuntimeExecutionReceipt,
  ExecutiveJournalRuntimeExecutionRules,
  isExecutiveJournalExecutionExecutable,
  isExecutiveJournalExecutionRejected,
} from "./executiveJournalRuntimeExecutionRules.ts";
import type { ExecutiveJournalRuntimeExecutionSummary } from "./executiveJournalRuntimeExecutionTypes.ts";

export {
  ExecutiveJournalRuntimeExecutionArchitectureDivergence,
  ExecutiveJournalRuntimeExecutionId,
  ExecutiveJournalRuntimeExecutionIdentity,
  ExecutiveJournalRuntimeExecutionName,
  ExecutiveJournalRuntimeExecutionNamespace,
  ExecutiveJournalRuntimeExecutionNextPhase,
  ExecutiveJournalRuntimeExecutionReadiness,
  ExecutiveJournalRuntimeExecutionStatus,
  ExecutiveJournalRuntimeExecutionVersion,
};

export {
  ExecutiveJournalRuntimeArchitectureDecisionAdrtc207,
  ExecutiveJournalRuntimeExecutionDecisions,
};

export {
  constructExecutiveJournalRuntimeExecutionIntent,
  createExecutiveJournalRuntimeExecutionReceipt,
  compareExecutiveJournalRuntimeIdempotency,
  isExecutiveJournalExecutionRejected,
  isExecutiveJournalExecutionExecutable,
};

if (ExecutiveJournalRuntimeEnforcement.readiness !== "ReadyForCertification") {
  throw new Error(
    "RTC-2:7 Execution Contract requires RTC-2:6 Enforcement readiness ReadyForCertification.",
  );
}

if (
  ExecutiveJournalRuntimeEnforcement.identity.id
    !== "RTC-2:6/ExecutiveJournalRuntimePolicyEnforcement"
) {
  throw new Error(
    "RTC-2:7 Execution Contract requires the canonical RTC-2:6 Enforcement aggregate.",
  );
}

/**
 * Canonical immutable Executive Journal Runtime Execution Contract aggregate.
 */
export const ExecutiveJournalRuntimeExecution = Object.freeze({
  identity: ExecutiveJournalRuntimeExecutionIdentity,
  enforcement: ExecutiveJournalRuntimeEnforcement,
  policy: ExecutiveJournalRuntimeEnforcement.policy,
  validation: ExecutiveJournalRuntimeEnforcement.validation,
  model: ExecutiveJournalRuntimeEnforcement.model,
  registry: ExecutiveJournalRuntimeEnforcement.registry,
  foundation: ExecutiveJournalRuntimeEnforcement.foundation,
  lifecycle: ExecutiveJournalRuntimeExecutionLifecycle,
  contracts: ExecutiveJournalRuntimeExecutionContracts,
  contractNames: ExecutiveJournalRuntimeExecutionContractNames,
  rules: ExecutiveJournalRuntimeExecutionRules,
  stepKinds: ExecutiveJournalRuntimeExecutionStepKinds,
  principles: ExecutiveJournalRuntimeExecutionPrinciples,
  decisions: ExecutiveJournalRuntimeExecutionDecisions,
  architectureDecision: ExecutiveJournalRuntimeArchitectureDecisionAdrtc207,
  architectureDivergence:
    ExecutiveJournalRuntimeExecutionArchitectureDivergence,
  openIssues: ExecutiveJournalRuntimeExecutionOpenIssues,
  ownership: ExecutiveJournalRuntimeExecutionOwnership,
  boundaries: ExecutiveJournalRuntimeExecutionBoundaries,
  prohibitedSurfaces: ExecutiveJournalRuntimeExecutionProhibitedSurfaces,
  aiMustNot: ExecutiveJournalExecutionAiMustNot,
  metadata: ExecutiveJournalRuntimeExecutionMetadata,
  status: ExecutiveJournalRuntimeExecutionStatus,
  readiness: ExecutiveJournalRuntimeExecutionReadiness,
  nextPhase: ExecutiveJournalRuntimeExecutionNextPhase,
  constructIntent: constructExecutiveJournalRuntimeExecutionIntent,
  createReceipt: createExecutiveJournalRuntimeExecutionReceipt,
  compareIdempotency: compareExecutiveJournalRuntimeIdempotency,
  isRejected: isExecutiveJournalExecutionRejected,
  isExecutable: isExecutiveJournalExecutionExecutable,
  statistics: Object.freeze({
    ruleCount: ExecutiveJournalRuntimeExecutionRules.length,
    contractCount: ExecutiveJournalRuntimeExecutionContracts.length,
    stepKindCount: ExecutiveJournalRuntimeExecutionStepKinds.length,
    openIssueCount: ExecutiveJournalRuntimeExecutionOpenIssues.length,
    principleCount: ExecutiveJournalRuntimeExecutionPrinciples.length,
    decisionCount: ExecutiveJournalRuntimeExecutionDecisions.length,
  }),
  upstreamDependencies: Object.freeze([
    "RTC-2:6 — Executive Journal Runtime Policy Enforcement",
  ]),
  upstreamChain: Object.freeze({
    enforcement: ExecutiveJournalRuntimeEnforcement.identity.id,
    policy: ExecutiveJournalRuntimeEnforcement.policy.identity.id,
    validation: ExecutiveJournalRuntimeEnforcement.validation.identity.id,
    model: ExecutiveJournalRuntimeEnforcement.model.identity.id,
    registry: ExecutiveJournalRuntimeEnforcement.registry.identity.id,
    foundation:
      ExecutiveJournalRuntimeEnforcement.foundation.identity.foundationId,
  }),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  contractsOnly: true as const,
  executesIntents: false as const,
  inventsOutcomes: false as const,
  failClosed: true as const,
  mutatesInputs: false as const,
  usesSystemClock: false as const,
  usesNetwork: false as const,
  usesRandomness: false as const,
  ownsAuthentication: false as const,
  ownsLiveAuthorityRegistry: false as const,
  ownsExportGeneration: false as const,
  ownsRetentionScheduling: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  resolvesOpenIssues: false as const,
  importsEnforcementOnly: true as const,
  certificationPhase: false as const,
} as const);

export function getExecutiveJournalRuntimeExecutionSummary():
  ExecutiveJournalRuntimeExecutionSummary {
  return Object.freeze({
    executionId: ExecutiveJournalRuntimeExecutionId,
    version: ExecutiveJournalRuntimeExecutionVersion,
    name: ExecutiveJournalRuntimeExecutionName,
    namespace: ExecutiveJournalRuntimeExecutionNamespace,
    status: ExecutiveJournalRuntimeExecutionStatus,
    readiness: ExecutiveJournalRuntimeExecutionReadiness,
    stepKindCount: ExecutiveJournalRuntimeExecutionStepKinds.length,
    contractCount: ExecutiveJournalRuntimeExecutionContracts.length,
    openIssueCount: ExecutiveJournalRuntimeExecutionOpenIssues.length,
    sourceEnforcement:
      "RTC-2:6/ExecutiveJournalRuntimePolicyEnforcement" as const,
    nextPhase: ExecutiveJournalRuntimeExecutionNextPhase,
    architectureDecisionIds: Object.freeze(["AD-RTC2-07"] as const),
    architectureDivergence:
      ExecutiveJournalRuntimeExecutionArchitectureDivergence,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveJournalRuntimeExecution = () =>
  ExecutiveJournalRuntimeExecution;
