/**
 * RTC-3:5 — Executive Decision Register Policy.
 *
 * Closed deterministic policy layer over RTC-3:4 Validation.
 * Consumes RTC-3:4 public surface only. Reach model/registry/foundation
 * through the upstream chain. Evaluation only — no authn, live registry,
 * network, clock, or UI.
 *
 * Ownership: owned exclusively by RTC-3:5.
 */

import { ExecutiveDecisionRegisterValidation } from "./executiveDecisionRegisterValidation.ts";
import {
  ExecutiveDecisionRegisterPolicyContractNames,
  ExecutiveDecisionRegisterPolicyContracts,
  ExecutiveDecisionRegisterPolicyRuleFamilies,
} from "./executiveDecisionRegisterPolicyContracts.ts";
import {
  ExecutiveDecisionRegisterPolicyId,
  ExecutiveDecisionRegisterPolicyIdentity,
  ExecutiveDecisionRegisterPolicyName,
  ExecutiveDecisionRegisterPolicyNamespace,
  ExecutiveDecisionRegisterPolicyNextPhase,
  ExecutiveDecisionRegisterPolicyReadiness,
  ExecutiveDecisionRegisterPolicyStatus,
  ExecutiveDecisionRegisterPolicyVersion,
} from "./executiveDecisionRegisterPolicyIdentity.ts";
import {
  ExecutiveDecisionRegisterPolicyLifecycle,
  ExecutiveDecisionRegisterPolicyObligationKinds,
  ExecutiveDecisionRegisterPolicyOperations,
} from "./executiveDecisionRegisterPolicyLifecycle.ts";
import {
  ExecutiveDecisionRegisterPolicyAiMustNot,
  ExecutiveDecisionRegisterPolicyBoundaries,
  ExecutiveDecisionRegisterPolicyDecisions,
  ExecutiveDecisionRegisterPolicyMetadata,
  ExecutiveDecisionRegisterPolicyOpenIssues,
  ExecutiveDecisionRegisterPolicyOwnership,
  ExecutiveDecisionRegisterPolicyPrinciples,
  ExecutiveDecisionRegisterPolicyProhibitedSurfaces,
  ExecutiveDecisionRegisterPolicyUpstreamFoundationDecisions,
  ExecutiveDecisionRegisterPolicyUpstreamModelDecisions,
  ExecutiveDecisionRegisterPolicyUpstreamRegistryDecisions,
  ExecutiveDecisionRegisterPolicyUpstreamValidationDecisions,
} from "./executiveDecisionRegisterPolicyMetadata.ts";
import {
  evaluateExecutiveDecisionRegisterPolicy,
  getExecutiveDecisionRegisterPolicyObligations,
  isExecutiveDecisionRegisterPolicyAllowed,
  isExecutiveDecisionRegisterPolicyConfirmationRequired,
  isExecutiveDecisionRegisterPolicyDenied,
  verifyExecutiveDecisionRegisterPolicyRuleCompleteness,
  ExecutiveDecisionRegisterPolicyRules,
} from "./executiveDecisionRegisterPolicyRules.ts";
import type { ExecutiveDecisionRegisterPolicySummary } from "./executiveDecisionRegisterPolicyTypes.ts";

export {
  ExecutiveDecisionRegisterPolicyId,
  ExecutiveDecisionRegisterPolicyIdentity,
  ExecutiveDecisionRegisterPolicyName,
  ExecutiveDecisionRegisterPolicyNamespace,
  ExecutiveDecisionRegisterPolicyNextPhase,
  ExecutiveDecisionRegisterPolicyReadiness,
  ExecutiveDecisionRegisterPolicyStatus,
  ExecutiveDecisionRegisterPolicyVersion,
};

export {
  evaluateExecutiveDecisionRegisterPolicy,
  getExecutiveDecisionRegisterPolicyObligations,
  isExecutiveDecisionRegisterPolicyAllowed,
  isExecutiveDecisionRegisterPolicyConfirmationRequired,
  isExecutiveDecisionRegisterPolicyDenied,
  verifyExecutiveDecisionRegisterPolicyRuleCompleteness,
};

if (ExecutiveDecisionRegisterValidation.readiness !== "ReadyForPolicy") {
  throw new Error(
    "RTC-3:5 Policy requires RTC-3:4 Validation readiness ReadyForPolicy.",
  );
}

if (
  ExecutiveDecisionRegisterValidation.identity.id
    !== "RTC-3:4/ExecutiveDecisionRegisterValidation"
) {
  throw new Error(
    "RTC-3:5 Policy requires the canonical RTC-3:4 Validation aggregate.",
  );
}

/**
 * Canonical immutable Executive Decision Register Policy aggregate.
 */
export const ExecutiveDecisionRegisterPolicy = Object.freeze({
  identity: ExecutiveDecisionRegisterPolicyIdentity,
  validation: ExecutiveDecisionRegisterValidation,
  model: ExecutiveDecisionRegisterValidation.model,
  registry: ExecutiveDecisionRegisterValidation.registry,
  foundation: ExecutiveDecisionRegisterValidation.foundation,
  lifecycle: ExecutiveDecisionRegisterPolicyLifecycle,
  contracts: ExecutiveDecisionRegisterPolicyContracts,
  contractNames: ExecutiveDecisionRegisterPolicyContractNames,
  families: ExecutiveDecisionRegisterPolicyRuleFamilies,
  rules: ExecutiveDecisionRegisterPolicyRules,
  operations: ExecutiveDecisionRegisterPolicyOperations,
  obligationKinds: ExecutiveDecisionRegisterPolicyObligationKinds,
  principles: ExecutiveDecisionRegisterPolicyPrinciples,
  decisions: ExecutiveDecisionRegisterPolicyDecisions,
  upstreamFoundationDecisions:
    ExecutiveDecisionRegisterPolicyUpstreamFoundationDecisions,
  upstreamRegistryDecisions:
    ExecutiveDecisionRegisterPolicyUpstreamRegistryDecisions,
  upstreamModelDecisions: ExecutiveDecisionRegisterPolicyUpstreamModelDecisions,
  upstreamValidationDecisions:
    ExecutiveDecisionRegisterPolicyUpstreamValidationDecisions,
  openIssues: ExecutiveDecisionRegisterPolicyOpenIssues,
  ownership: ExecutiveDecisionRegisterPolicyOwnership,
  boundaries: ExecutiveDecisionRegisterPolicyBoundaries,
  prohibitedSurfaces: ExecutiveDecisionRegisterPolicyProhibitedSurfaces,
  aiMustNot: ExecutiveDecisionRegisterPolicyAiMustNot,
  metadata: ExecutiveDecisionRegisterPolicyMetadata,
  status: ExecutiveDecisionRegisterPolicyStatus,
  readiness: ExecutiveDecisionRegisterPolicyReadiness,
  nextPhase: ExecutiveDecisionRegisterPolicyNextPhase,
  evaluate: evaluateExecutiveDecisionRegisterPolicy,
  isAllowed: isExecutiveDecisionRegisterPolicyAllowed,
  isDenied: isExecutiveDecisionRegisterPolicyDenied,
  requiresConfirmation: isExecutiveDecisionRegisterPolicyConfirmationRequired,
  getObligations: getExecutiveDecisionRegisterPolicyObligations,
  verifyRuleCompleteness:
    verifyExecutiveDecisionRegisterPolicyRuleCompleteness,
  statistics: Object.freeze({
    ruleCount: ExecutiveDecisionRegisterPolicyRules.length,
    familyCount: ExecutiveDecisionRegisterPolicyRuleFamilies.length,
    operationCount: ExecutiveDecisionRegisterPolicyOperations.length,
    obligationKindCount: ExecutiveDecisionRegisterPolicyObligationKinds.length,
    openIssueCount: ExecutiveDecisionRegisterPolicyOpenIssues.length,
    principleCount: ExecutiveDecisionRegisterPolicyPrinciples.length,
    decisionCount: ExecutiveDecisionRegisterPolicyDecisions.length,
    contractCount: ExecutiveDecisionRegisterPolicyContracts.length,
  }),
  upstreamDependencies: Object.freeze([
    "RTC-3:4 — Executive Decision Register Validation",
  ]),
  upstreamChain: Object.freeze({
    validation: ExecutiveDecisionRegisterValidation.identity.id,
    model: ExecutiveDecisionRegisterValidation.model.identity.id,
    registry: ExecutiveDecisionRegisterValidation.registry.identity.id,
    foundation:
      ExecutiveDecisionRegisterValidation.foundation.identity.foundationId,
  }),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  evaluatesOnly: true as const,
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
  ownsEvidencePinningDefaults: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  resolvesOpenIssues: false as const,
  importsFoundationDirectly: false as const,
  importsRegistryDirectly: false as const,
  importsModelDirectly: false as const,
  enforcementPhase: false as const,
  importsRtc2: false as const,
  importsRtc1: false as const,
  importsApp8: false as const,
} as const);

export function getExecutiveDecisionRegisterPolicySummary():
  ExecutiveDecisionRegisterPolicySummary {
  return Object.freeze({
    policyId: ExecutiveDecisionRegisterPolicyId,
    version: ExecutiveDecisionRegisterPolicyVersion,
    name: ExecutiveDecisionRegisterPolicyName,
    namespace: ExecutiveDecisionRegisterPolicyNamespace,
    status: ExecutiveDecisionRegisterPolicyStatus,
    readiness: ExecutiveDecisionRegisterPolicyReadiness,
    ruleCount: ExecutiveDecisionRegisterPolicyRules.length,
    operationCount: ExecutiveDecisionRegisterPolicyOperations.length,
    obligationKindCount: ExecutiveDecisionRegisterPolicyObligationKinds.length,
    openIssueCount: ExecutiveDecisionRegisterPolicyOpenIssues.length,
    decisionCount: ExecutiveDecisionRegisterPolicyDecisions.length,
    sourceValidation: "RTC-3:4/ExecutiveDecisionRegisterValidation" as const,
    nextPhase: ExecutiveDecisionRegisterPolicyNextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveDecisionRegisterPolicy = () =>
  ExecutiveDecisionRegisterPolicy;
