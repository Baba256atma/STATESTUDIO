/**
 * RTC-3:6 — Executive Decision Register Enforcement.
 *
 * Deterministic enforcement-planning layer over RTC-3:5 Policy.
 * Consumes RTC-3:5 public surface only. Reach validation/model/registry/
 * foundation through the upstream chain. Planning only — never executes.
 *
 * Ownership: owned exclusively by RTC-3:6.
 */

import { ExecutiveDecisionRegisterPolicy } from "./executiveDecisionRegisterPolicy.ts";
import {
  ExecutiveDecisionRegisterEnforcementContractNames,
  ExecutiveDecisionRegisterEnforcementContracts,
} from "./executiveDecisionRegisterEnforcementContracts.ts";
import {
  ExecutiveDecisionRegisterEnforcementId,
  ExecutiveDecisionRegisterEnforcementIdentity,
  ExecutiveDecisionRegisterEnforcementName,
  ExecutiveDecisionRegisterEnforcementNamespace,
  ExecutiveDecisionRegisterEnforcementNextPhase,
  ExecutiveDecisionRegisterEnforcementReadiness,
  ExecutiveDecisionRegisterEnforcementStatus,
  ExecutiveDecisionRegisterEnforcementVersion,
} from "./executiveDecisionRegisterEnforcementIdentity.ts";
import {
  ExecutiveDecisionRegisterEnforcementLifecycle,
  ExecutiveDecisionRegisterEnforcementStepKinds,
} from "./executiveDecisionRegisterEnforcementLifecycle.ts";
import {
  ExecutiveDecisionRegisterArchitectureDecisionAdrtc306,
  ExecutiveDecisionRegisterEnforcementAiMustNot,
  ExecutiveDecisionRegisterEnforcementArchitectureDecisions,
  ExecutiveDecisionRegisterEnforcementBoundaries,
  ExecutiveDecisionRegisterEnforcementDecisions,
  ExecutiveDecisionRegisterEnforcementMetadata,
  ExecutiveDecisionRegisterEnforcementOpenIssues,
  ExecutiveDecisionRegisterEnforcementOwnership,
  ExecutiveDecisionRegisterEnforcementPrinciples,
  ExecutiveDecisionRegisterEnforcementProhibitedSurfaces,
  ExecutiveDecisionRegisterEnforcementUpstreamFoundationDecisions,
  ExecutiveDecisionRegisterEnforcementUpstreamModelDecisions,
  ExecutiveDecisionRegisterEnforcementUpstreamPolicyDecisions,
  ExecutiveDecisionRegisterEnforcementUpstreamRegistryDecisions,
  ExecutiveDecisionRegisterEnforcementUpstreamValidationDecisions,
} from "./executiveDecisionRegisterEnforcementMetadata.ts";
import {
  ExecutiveDecisionRegisterEnforcementRules,
  ExecutiveDecisionRegisterObligationStepMapping,
  isExecutiveDecisionRegisterEnforcementAwaitingConfirmation,
  isExecutiveDecisionRegisterEnforcementBlocked,
  isExecutiveDecisionRegisterEnforcementEnforceable,
  planExecutiveDecisionRegisterEnforcement,
  verifyExecutiveDecisionRegisterObligationStepMapping,
} from "./executiveDecisionRegisterEnforcementRules.ts";
import type { ExecutiveDecisionRegisterEnforcementSummary } from "./executiveDecisionRegisterEnforcementTypes.ts";

export {
  ExecutiveDecisionRegisterEnforcementId,
  ExecutiveDecisionRegisterEnforcementIdentity,
  ExecutiveDecisionRegisterEnforcementName,
  ExecutiveDecisionRegisterEnforcementNamespace,
  ExecutiveDecisionRegisterEnforcementNextPhase,
  ExecutiveDecisionRegisterEnforcementReadiness,
  ExecutiveDecisionRegisterEnforcementStatus,
  ExecutiveDecisionRegisterEnforcementVersion,
};

export {
  planExecutiveDecisionRegisterEnforcement,
  isExecutiveDecisionRegisterEnforcementBlocked,
  isExecutiveDecisionRegisterEnforcementAwaitingConfirmation,
  isExecutiveDecisionRegisterEnforcementEnforceable,
  verifyExecutiveDecisionRegisterObligationStepMapping,
  ExecutiveDecisionRegisterObligationStepMapping,
};

if (ExecutiveDecisionRegisterPolicy.readiness !== "ReadyForEnforcement") {
  throw new Error(
    "RTC-3:6 Enforcement requires RTC-3:5 Policy readiness ReadyForEnforcement.",
  );
}

if (
  ExecutiveDecisionRegisterPolicy.identity.id
    !== "RTC-3:5/ExecutiveDecisionRegisterPolicy"
) {
  throw new Error(
    "RTC-3:6 Enforcement requires the canonical RTC-3:5 Policy aggregate.",
  );
}

if (!verifyExecutiveDecisionRegisterObligationStepMapping()) {
  throw new Error(
    "RTC-3:6 Enforcement requires a complete obligation-to-step mapping.",
  );
}

/**
 * Canonical immutable Executive Decision Register Enforcement aggregate.
 */
export const ExecutiveDecisionRegisterEnforcement = Object.freeze({
  identity: ExecutiveDecisionRegisterEnforcementIdentity,
  policy: ExecutiveDecisionRegisterPolicy,
  validation: ExecutiveDecisionRegisterPolicy.validation,
  model: ExecutiveDecisionRegisterPolicy.model,
  registry: ExecutiveDecisionRegisterPolicy.registry,
  foundation: ExecutiveDecisionRegisterPolicy.foundation,
  lifecycle: ExecutiveDecisionRegisterEnforcementLifecycle,
  contracts: ExecutiveDecisionRegisterEnforcementContracts,
  contractNames: ExecutiveDecisionRegisterEnforcementContractNames,
  rules: ExecutiveDecisionRegisterEnforcementRules,
  stepKinds: ExecutiveDecisionRegisterEnforcementStepKinds,
  obligationStepMapping: ExecutiveDecisionRegisterObligationStepMapping,
  principles: ExecutiveDecisionRegisterEnforcementPrinciples,
  decisions: ExecutiveDecisionRegisterEnforcementDecisions,
  architectureDecision: ExecutiveDecisionRegisterArchitectureDecisionAdrtc306,
  architectureDecisions:
    ExecutiveDecisionRegisterEnforcementArchitectureDecisions,
  architectureDecisionIds: Object.freeze(["AD-RTC3-06"] as const),
  upstreamFoundationDecisions:
    ExecutiveDecisionRegisterEnforcementUpstreamFoundationDecisions,
  upstreamRegistryDecisions:
    ExecutiveDecisionRegisterEnforcementUpstreamRegistryDecisions,
  upstreamModelDecisions:
    ExecutiveDecisionRegisterEnforcementUpstreamModelDecisions,
  upstreamValidationDecisions:
    ExecutiveDecisionRegisterEnforcementUpstreamValidationDecisions,
  upstreamPolicyDecisions:
    ExecutiveDecisionRegisterEnforcementUpstreamPolicyDecisions,
  openIssues: ExecutiveDecisionRegisterEnforcementOpenIssues,
  ownership: ExecutiveDecisionRegisterEnforcementOwnership,
  boundaries: ExecutiveDecisionRegisterEnforcementBoundaries,
  prohibitedSurfaces: ExecutiveDecisionRegisterEnforcementProhibitedSurfaces,
  aiMustNot: ExecutiveDecisionRegisterEnforcementAiMustNot,
  metadata: ExecutiveDecisionRegisterEnforcementMetadata,
  status: ExecutiveDecisionRegisterEnforcementStatus,
  readiness: ExecutiveDecisionRegisterEnforcementReadiness,
  nextPhase: ExecutiveDecisionRegisterEnforcementNextPhase,
  plan: planExecutiveDecisionRegisterEnforcement,
  isBlocked: isExecutiveDecisionRegisterEnforcementBlocked,
  isAwaitingConfirmation:
    isExecutiveDecisionRegisterEnforcementAwaitingConfirmation,
  isEnforceable: isExecutiveDecisionRegisterEnforcementEnforceable,
  verifyObligationMapping:
    verifyExecutiveDecisionRegisterObligationStepMapping,
  statistics: Object.freeze({
    ruleCount: ExecutiveDecisionRegisterEnforcementRules.length,
    contractCount: ExecutiveDecisionRegisterEnforcementContracts.length,
    stepKindCount: ExecutiveDecisionRegisterEnforcementStepKinds.length,
    obligationMappingCount: Object.keys(
      ExecutiveDecisionRegisterObligationStepMapping,
    ).length,
    openIssueCount: ExecutiveDecisionRegisterEnforcementOpenIssues.length,
    principleCount: ExecutiveDecisionRegisterEnforcementPrinciples.length,
    decisionCount: ExecutiveDecisionRegisterEnforcementDecisions.length,
  }),
  upstreamDependencies: Object.freeze([
    "RTC-3:5 — Executive Decision Register Policy",
  ]),
  upstreamChain: Object.freeze({
    policy: ExecutiveDecisionRegisterPolicy.identity.id,
    validation: ExecutiveDecisionRegisterPolicy.validation.identity.id,
    model: ExecutiveDecisionRegisterPolicy.model.identity.id,
    registry: ExecutiveDecisionRegisterPolicy.registry.identity.id,
    foundation:
      ExecutiveDecisionRegisterPolicy.foundation.identity.foundationId,
  }),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  plansOnly: true as const,
  executesPlans: false as const,
  failClosed: true as const,
  mutatesInputs: false as const,
  usesSystemClock: false as const,
  usesNetwork: false as const,
  usesRandomness: false as const,
  ownsAuthentication: false as const,
  ownsLiveAuthorityRegistry: false as const,
  ownsExportGeneration: false as const,
  ownsRetentionScheduling: false as const,
  ownsClosureSufficiency: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  resolvesOpenIssues: false as const,
  importsPolicyOnly: true as const,
  importsValidationDirectly: false as const,
  importsModelDirectly: false as const,
  importsRegistryDirectly: false as const,
  importsFoundationDirectly: false as const,
  executionContractPhase: false as const,
  importsRtc2: false as const,
  importsRtc1: false as const,
  importsApp8: false as const,
} as const);

export function getExecutiveDecisionRegisterEnforcementSummary():
  ExecutiveDecisionRegisterEnforcementSummary {
  return Object.freeze({
    enforcementId: ExecutiveDecisionRegisterEnforcementId,
    version: ExecutiveDecisionRegisterEnforcementVersion,
    name: ExecutiveDecisionRegisterEnforcementName,
    namespace: ExecutiveDecisionRegisterEnforcementNamespace,
    status: ExecutiveDecisionRegisterEnforcementStatus,
    readiness: ExecutiveDecisionRegisterEnforcementReadiness,
    ruleCount: ExecutiveDecisionRegisterEnforcementRules.length,
    stepKindCount: ExecutiveDecisionRegisterEnforcementStepKinds.length,
    obligationMappingCount: Object.keys(
      ExecutiveDecisionRegisterObligationStepMapping,
    ).length,
    openIssueCount: ExecutiveDecisionRegisterEnforcementOpenIssues.length,
    decisionCount: ExecutiveDecisionRegisterEnforcementDecisions.length,
    sourcePolicy: "RTC-3:5/ExecutiveDecisionRegisterPolicy" as const,
    nextPhase: ExecutiveDecisionRegisterEnforcementNextPhase,
    architectureDecisionIds: Object.freeze(["AD-RTC3-06"] as const),
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveDecisionRegisterEnforcement = () =>
  ExecutiveDecisionRegisterEnforcement;
