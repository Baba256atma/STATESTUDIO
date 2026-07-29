/**
 * RTC-2:5 — Executive Journal Runtime Policy.
 *
 * Closed deterministic policy layer over RTC-2:4 Validation.
 * Consumes RTC-2:4 public surface only. Reach model/registry/foundation
 * through the upstream chain. Evaluation only — no authn, live registry,
 * network, clock, or UI.
 *
 * Ownership: owned exclusively by RTC-2:5.
 */

import { ExecutiveJournalRuntimeValidation } from "./executiveJournalRuntimeValidation.ts";
import {
  ExecutiveJournalRuntimePolicyContractNames,
  ExecutiveJournalRuntimePolicyContracts,
  ExecutiveJournalRuntimePolicyRuleFamilies,
} from "./executiveJournalRuntimePolicyContracts.ts";
import {
  ExecutiveJournalRuntimePolicyId,
  ExecutiveJournalRuntimePolicyIdentity,
  ExecutiveJournalRuntimePolicyName,
  ExecutiveJournalRuntimePolicyNamespace,
  ExecutiveJournalRuntimePolicyNextPhase,
  ExecutiveJournalRuntimePolicyReadiness,
  ExecutiveJournalRuntimePolicyStatus,
  ExecutiveJournalRuntimePolicyVersion,
} from "./executiveJournalRuntimePolicyIdentity.ts";
import {
  ExecutiveJournalRuntimePolicyLifecycle,
  ExecutiveJournalRuntimePolicyObligationKinds,
  ExecutiveJournalRuntimePolicyOperations,
} from "./executiveJournalRuntimePolicyLifecycle.ts";
import {
  ExecutiveJournalPolicyAiMustNot,
  ExecutiveJournalRuntimePolicyBoundaries,
  ExecutiveJournalRuntimePolicyMetadata,
  ExecutiveJournalRuntimePolicyOpenIssues,
  ExecutiveJournalRuntimePolicyOwnership,
  ExecutiveJournalRuntimePolicyPrinciples,
  ExecutiveJournalRuntimePolicyProhibitedSurfaces,
} from "./executiveJournalRuntimePolicyMetadata.ts";
import {
  evaluateExecutiveJournalRuntimePolicy,
  isExecutiveJournalPolicyAllowed,
  isExecutiveJournalPolicyConfirmationRequired,
  isExecutiveJournalPolicyDenied,
  validateExecutiveJournalPolicyRuleCatalogue,
  ExecutiveJournalRuntimePolicyRules,
} from "./executiveJournalRuntimePolicyRules.ts";
import type { ExecutiveJournalRuntimePolicySummary } from "./executiveJournalRuntimePolicyTypes.ts";

export {
  ExecutiveJournalRuntimePolicyId,
  ExecutiveJournalRuntimePolicyIdentity,
  ExecutiveJournalRuntimePolicyName,
  ExecutiveJournalRuntimePolicyNamespace,
  ExecutiveJournalRuntimePolicyNextPhase,
  ExecutiveJournalRuntimePolicyReadiness,
  ExecutiveJournalRuntimePolicyStatus,
  ExecutiveJournalRuntimePolicyVersion,
};

export {
  evaluateExecutiveJournalRuntimePolicy,
  isExecutiveJournalPolicyAllowed,
  isExecutiveJournalPolicyConfirmationRequired,
  isExecutiveJournalPolicyDenied,
  validateExecutiveJournalPolicyRuleCatalogue,
};

if (ExecutiveJournalRuntimeValidation.readiness !== "ReadyForManifest") {
  throw new Error(
    "RTC-2:5 Policy requires RTC-2:4 Validation readiness ReadyForManifest.",
  );
}

if (
  ExecutiveJournalRuntimeValidation.identity.id
    !== "RTC-2:4/ExecutiveJournalRuntimeValidation"
) {
  throw new Error(
    "RTC-2:5 Policy requires the canonical RTC-2:4 Validation aggregate.",
  );
}

/**
 * Canonical immutable Executive Journal Runtime Policy aggregate.
 */
export const ExecutiveJournalRuntimePolicy = Object.freeze({
  identity: ExecutiveJournalRuntimePolicyIdentity,
  validation: ExecutiveJournalRuntimeValidation,
  model: ExecutiveJournalRuntimeValidation.model,
  registry: ExecutiveJournalRuntimeValidation.model.registry,
  foundation: ExecutiveJournalRuntimeValidation.model.foundation,
  lifecycle: ExecutiveJournalRuntimePolicyLifecycle,
  contracts: ExecutiveJournalRuntimePolicyContracts,
  contractNames: ExecutiveJournalRuntimePolicyContractNames,
  families: ExecutiveJournalRuntimePolicyRuleFamilies,
  rules: ExecutiveJournalRuntimePolicyRules,
  operations: ExecutiveJournalRuntimePolicyOperations,
  obligationKinds: ExecutiveJournalRuntimePolicyObligationKinds,
  principles: ExecutiveJournalRuntimePolicyPrinciples,
  openIssues: ExecutiveJournalRuntimePolicyOpenIssues,
  ownership: ExecutiveJournalRuntimePolicyOwnership,
  boundaries: ExecutiveJournalRuntimePolicyBoundaries,
  prohibitedSurfaces: ExecutiveJournalRuntimePolicyProhibitedSurfaces,
  aiMustNot: ExecutiveJournalPolicyAiMustNot,
  metadata: ExecutiveJournalRuntimePolicyMetadata,
  status: ExecutiveJournalRuntimePolicyStatus,
  readiness: ExecutiveJournalRuntimePolicyReadiness,
  nextPhase: ExecutiveJournalRuntimePolicyNextPhase,
  evaluate: evaluateExecutiveJournalRuntimePolicy,
  isAllowed: isExecutiveJournalPolicyAllowed,
  isDenied: isExecutiveJournalPolicyDenied,
  requiresConfirmation: isExecutiveJournalPolicyConfirmationRequired,
  validateRuleCatalogue: validateExecutiveJournalPolicyRuleCatalogue,
  statistics: Object.freeze({
    ruleCount: ExecutiveJournalRuntimePolicyRules.length,
    familyCount: ExecutiveJournalRuntimePolicyRuleFamilies.length,
    operationCount: ExecutiveJournalRuntimePolicyOperations.length,
    obligationKindCount: ExecutiveJournalRuntimePolicyObligationKinds.length,
    openIssueCount: ExecutiveJournalRuntimePolicyOpenIssues.length,
    principleCount: ExecutiveJournalRuntimePolicyPrinciples.length,
  }),
  upstreamDependencies: Object.freeze([
    "RTC-2:4 — Executive Journal Runtime Validation",
  ]),
  upstreamChain: Object.freeze({
    validation: ExecutiveJournalRuntimeValidation.identity.id,
    model: ExecutiveJournalRuntimeValidation.model.identity.id,
    registry: ExecutiveJournalRuntimeValidation.model.registry.identity.id,
    foundation:
      ExecutiveJournalRuntimeValidation.model.foundation.identity.foundationId,
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
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  resolvesOpenIssues: false as const,
  importsFoundationDirectly: false as const,
  platformPhase: false as const,
} as const);

export function getExecutiveJournalRuntimePolicySummary():
  ExecutiveJournalRuntimePolicySummary {
  return Object.freeze({
    policyId: ExecutiveJournalRuntimePolicyId,
    version: ExecutiveJournalRuntimePolicyVersion,
    name: ExecutiveJournalRuntimePolicyName,
    namespace: ExecutiveJournalRuntimePolicyNamespace,
    status: ExecutiveJournalRuntimePolicyStatus,
    readiness: ExecutiveJournalRuntimePolicyReadiness,
    ruleCount: ExecutiveJournalRuntimePolicyRules.length,
    operationCount: ExecutiveJournalRuntimePolicyOperations.length,
    obligationKindCount: ExecutiveJournalRuntimePolicyObligationKinds.length,
    openIssueCount: ExecutiveJournalRuntimePolicyOpenIssues.length,
    sourceValidation: "RTC-2:4/ExecutiveJournalRuntimeValidation" as const,
    nextPhase: ExecutiveJournalRuntimePolicyNextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveJournalRuntimePolicy = () =>
  ExecutiveJournalRuntimePolicy;
