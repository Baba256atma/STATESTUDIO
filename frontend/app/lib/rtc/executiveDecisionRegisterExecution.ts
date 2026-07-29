/**
 * RTC-3:7 — Executive Decision Register Execution Contract.
 *
 * Deterministic execution-boundary contract over RTC-3:6 Enforcement.
 * Consumes RTC-3:6 public surface only. Reach policy/validation/model/registry/
 * foundation through the upstream chain. Contracts and pure transforms only.
 *
 * Ownership: owned exclusively by RTC-3:7.
 */

import { ExecutiveDecisionRegisterEnforcement } from "./executiveDecisionRegisterEnforcement.ts";
import {
  ExecutiveDecisionRegisterExecutionContractNames,
  ExecutiveDecisionRegisterExecutionContracts,
} from "./executiveDecisionRegisterExecutionContracts.ts";
import {
  ExecutiveDecisionRegisterExecutionId,
  ExecutiveDecisionRegisterExecutionIdentity,
  ExecutiveDecisionRegisterExecutionName,
  ExecutiveDecisionRegisterExecutionNamespace,
  ExecutiveDecisionRegisterExecutionNextPhase,
  ExecutiveDecisionRegisterExecutionReadiness,
  ExecutiveDecisionRegisterExecutionStatus,
  ExecutiveDecisionRegisterExecutionVersion,
} from "./executiveDecisionRegisterExecutionIdentity.ts";
import {
  ExecutiveDecisionRegisterExecutionLifecycle,
  ExecutiveDecisionRegisterExecutionStepKinds,
} from "./executiveDecisionRegisterExecutionLifecycle.ts";
import {
  ExecutiveDecisionRegisterArchitectureDecisionAdrtc307,
  ExecutiveDecisionRegisterExecutionAiMustNot,
  ExecutiveDecisionRegisterExecutionArchitectureDecisions,
  ExecutiveDecisionRegisterExecutionBoundaries,
  ExecutiveDecisionRegisterExecutionDecisions,
  ExecutiveDecisionRegisterExecutionMetadata,
  ExecutiveDecisionRegisterExecutionOpenIssues,
  ExecutiveDecisionRegisterExecutionOwnership,
  ExecutiveDecisionRegisterExecutionPrinciples,
  ExecutiveDecisionRegisterExecutionProhibitedSurfaces,
  ExecutiveDecisionRegisterExecutionUpstreamArchitectureDecision,
  ExecutiveDecisionRegisterExecutionUpstreamEnforcementDecisions,
  ExecutiveDecisionRegisterExecutionUpstreamFoundationDecisions,
  ExecutiveDecisionRegisterExecutionUpstreamModelDecisions,
  ExecutiveDecisionRegisterExecutionUpstreamPolicyDecisions,
  ExecutiveDecisionRegisterExecutionUpstreamRegistryDecisions,
  ExecutiveDecisionRegisterExecutionUpstreamValidationDecisions,
} from "./executiveDecisionRegisterExecutionMetadata.ts";
import {
  compareExecutiveDecisionRegisterIdempotency,
  constructExecutiveDecisionRegisterExecutionIntent,
  createExecutiveDecisionRegisterExecutionReceipt,
  ExecutiveDecisionRegisterExecutionRules,
  isExecutiveDecisionRegisterExecutionExecutable,
  isExecutiveDecisionRegisterExecutionRejected,
} from "./executiveDecisionRegisterExecutionRules.ts";
import type { ExecutiveDecisionRegisterExecutionSummary } from "./executiveDecisionRegisterExecutionTypes.ts";

export {
  ExecutiveDecisionRegisterExecutionId,
  ExecutiveDecisionRegisterExecutionIdentity,
  ExecutiveDecisionRegisterExecutionName,
  ExecutiveDecisionRegisterExecutionNamespace,
  ExecutiveDecisionRegisterExecutionNextPhase,
  ExecutiveDecisionRegisterExecutionReadiness,
  ExecutiveDecisionRegisterExecutionStatus,
  ExecutiveDecisionRegisterExecutionVersion,
};

export {
  ExecutiveDecisionRegisterArchitectureDecisionAdrtc307,
  ExecutiveDecisionRegisterExecutionDecisions,
};

export {
  constructExecutiveDecisionRegisterExecutionIntent,
  createExecutiveDecisionRegisterExecutionReceipt,
  compareExecutiveDecisionRegisterIdempotency,
  isExecutiveDecisionRegisterExecutionRejected,
  isExecutiveDecisionRegisterExecutionExecutable,
};

if (
  ExecutiveDecisionRegisterEnforcement.readiness
    !== "ReadyForExecutionContract"
) {
  throw new Error(
    "RTC-3:7 Execution Contract requires RTC-3:6 Enforcement readiness ReadyForExecutionContract.",
  );
}

if (
  ExecutiveDecisionRegisterEnforcement.identity.id
    !== "RTC-3:6/ExecutiveDecisionRegisterEnforcement"
) {
  throw new Error(
    "RTC-3:7 Execution Contract requires the canonical RTC-3:6 Enforcement aggregate.",
  );
}

/**
 * Canonical immutable Executive Decision Register Execution Contract aggregate.
 */
export const ExecutiveDecisionRegisterExecution = Object.freeze({
  identity: ExecutiveDecisionRegisterExecutionIdentity,
  enforcement: ExecutiveDecisionRegisterEnforcement,
  policy: ExecutiveDecisionRegisterEnforcement.policy,
  validation: ExecutiveDecisionRegisterEnforcement.validation,
  model: ExecutiveDecisionRegisterEnforcement.model,
  registry: ExecutiveDecisionRegisterEnforcement.registry,
  foundation: ExecutiveDecisionRegisterEnforcement.foundation,
  lifecycle: ExecutiveDecisionRegisterExecutionLifecycle,
  contracts: ExecutiveDecisionRegisterExecutionContracts,
  contractNames: ExecutiveDecisionRegisterExecutionContractNames,
  rules: ExecutiveDecisionRegisterExecutionRules,
  stepKinds: ExecutiveDecisionRegisterExecutionStepKinds,
  principles: ExecutiveDecisionRegisterExecutionPrinciples,
  decisions: ExecutiveDecisionRegisterExecutionDecisions,
  architectureDecision: ExecutiveDecisionRegisterArchitectureDecisionAdrtc307,
  architectureDecisions:
    ExecutiveDecisionRegisterExecutionArchitectureDecisions,
  architectureDecisionIds: Object.freeze([
    "AD-RTC3-06",
    "AD-RTC3-07",
  ] as const),
  upstreamArchitectureDecision:
    ExecutiveDecisionRegisterExecutionUpstreamArchitectureDecision,
  upstreamFoundationDecisions:
    ExecutiveDecisionRegisterExecutionUpstreamFoundationDecisions,
  upstreamRegistryDecisions:
    ExecutiveDecisionRegisterExecutionUpstreamRegistryDecisions,
  upstreamModelDecisions:
    ExecutiveDecisionRegisterExecutionUpstreamModelDecisions,
  upstreamValidationDecisions:
    ExecutiveDecisionRegisterExecutionUpstreamValidationDecisions,
  upstreamPolicyDecisions:
    ExecutiveDecisionRegisterExecutionUpstreamPolicyDecisions,
  upstreamEnforcementDecisions:
    ExecutiveDecisionRegisterExecutionUpstreamEnforcementDecisions,
  openIssues: ExecutiveDecisionRegisterExecutionOpenIssues,
  ownership: ExecutiveDecisionRegisterExecutionOwnership,
  boundaries: ExecutiveDecisionRegisterExecutionBoundaries,
  prohibitedSurfaces: ExecutiveDecisionRegisterExecutionProhibitedSurfaces,
  aiMustNot: ExecutiveDecisionRegisterExecutionAiMustNot,
  metadata: ExecutiveDecisionRegisterExecutionMetadata,
  status: ExecutiveDecisionRegisterExecutionStatus,
  readiness: ExecutiveDecisionRegisterExecutionReadiness,
  nextPhase: ExecutiveDecisionRegisterExecutionNextPhase,
  constructIntent: constructExecutiveDecisionRegisterExecutionIntent,
  createReceipt: createExecutiveDecisionRegisterExecutionReceipt,
  compareIdempotency: compareExecutiveDecisionRegisterIdempotency,
  isRejected: isExecutiveDecisionRegisterExecutionRejected,
  isExecutable: isExecutiveDecisionRegisterExecutionExecutable,
  statistics: Object.freeze({
    ruleCount: ExecutiveDecisionRegisterExecutionRules.length,
    contractCount: ExecutiveDecisionRegisterExecutionContracts.length,
    stepKindCount: ExecutiveDecisionRegisterExecutionStepKinds.length,
    openIssueCount: ExecutiveDecisionRegisterExecutionOpenIssues.length,
    principleCount: ExecutiveDecisionRegisterExecutionPrinciples.length,
    decisionCount: ExecutiveDecisionRegisterExecutionDecisions.length,
  }),
  upstreamDependencies: Object.freeze([
    "RTC-3:6 — Executive Decision Register Enforcement",
  ]),
  upstreamChain: Object.freeze({
    enforcement: ExecutiveDecisionRegisterEnforcement.identity.id,
    policy: ExecutiveDecisionRegisterEnforcement.policy.identity.id,
    validation: ExecutiveDecisionRegisterEnforcement.validation.identity.id,
    model: ExecutiveDecisionRegisterEnforcement.model.identity.id,
    registry: ExecutiveDecisionRegisterEnforcement.registry.identity.id,
    foundation:
      ExecutiveDecisionRegisterEnforcement.foundation.identity.foundationId,
  }),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  contractsOnly: true as const,
  executesIntents: false as const,
  executes: false as const,
  persists: false as const,
  dispatches: false as const,
  publishes: false as const,
  mutatesDomainState: false as const,
  createsAuthority: false as const,
  confirmsDecisions: false as const,
  inventsOutcomes: false as const,
  failClosed: true as const,
  mutatesInputs: false as const,
  usesSystemClock: false as const,
  usesNetwork: false as const,
  usesRandomness: false as const,
  ownsAuthentication: false as const,
  ownsLiveAuthorityRegistry: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  resolvesOpenIssues: false as const,
  importsEnforcementOnly: true as const,
  importsPolicyDirectly: false as const,
  assurancePhase: false as const,
  importsRtc2: false as const,
  importsRtc1: false as const,
  importsApp8: false as const,
} as const);

export function getExecutiveDecisionRegisterExecutionSummary():
  ExecutiveDecisionRegisterExecutionSummary {
  return Object.freeze({
    executionId: ExecutiveDecisionRegisterExecutionId,
    version: ExecutiveDecisionRegisterExecutionVersion,
    name: ExecutiveDecisionRegisterExecutionName,
    namespace: ExecutiveDecisionRegisterExecutionNamespace,
    status: ExecutiveDecisionRegisterExecutionStatus,
    readiness: ExecutiveDecisionRegisterExecutionReadiness,
    ruleCount: ExecutiveDecisionRegisterExecutionRules.length,
    stepKindCount: ExecutiveDecisionRegisterExecutionStepKinds.length,
    contractCount: ExecutiveDecisionRegisterExecutionContracts.length,
    openIssueCount: ExecutiveDecisionRegisterExecutionOpenIssues.length,
    decisionCount: ExecutiveDecisionRegisterExecutionDecisions.length,
    sourceEnforcement:
      "RTC-3:6/ExecutiveDecisionRegisterEnforcement" as const,
    nextPhase: ExecutiveDecisionRegisterExecutionNextPhase,
    architectureDecisionIds: Object.freeze([
      "AD-RTC3-06",
      "AD-RTC3-07",
    ] as const),
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveDecisionRegisterExecution = () =>
  ExecutiveDecisionRegisterExecution;
