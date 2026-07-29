/**
 * RTC-2:6 — Executive Journal Runtime Policy Enforcement.
 *
 * Deterministic enforcement-planning layer over RTC-2:5 Policy.
 * Consumes RTC-2:5 public surface only. Reach validation/model/registry/
 * foundation through the upstream chain. Planning only — never executes.
 *
 * Ownership: owned exclusively by RTC-2:6.
 */

import { ExecutiveJournalRuntimePolicy } from "./executiveJournalRuntimePolicy.ts";
import {
  ExecutiveJournalRuntimeEnforcementContractNames,
  ExecutiveJournalRuntimeEnforcementContracts,
} from "./executiveJournalRuntimeEnforcementContracts.ts";
import {
  ExecutiveJournalRuntimeEnforcementId,
  ExecutiveJournalRuntimeEnforcementIdentity,
  ExecutiveJournalRuntimeEnforcementName,
  ExecutiveJournalRuntimeEnforcementNamespace,
  ExecutiveJournalRuntimeEnforcementNextPhase,
  ExecutiveJournalRuntimeEnforcementReadiness,
  ExecutiveJournalRuntimeEnforcementStatus,
  ExecutiveJournalRuntimeEnforcementVersion,
} from "./executiveJournalRuntimeEnforcementIdentity.ts";
import {
  ExecutiveJournalRuntimeEnforcementLifecycle,
  ExecutiveJournalRuntimeEnforcementStepKinds,
} from "./executiveJournalRuntimeEnforcementLifecycle.ts";
import {
  ExecutiveJournalEnforcementAiMustNot,
  ExecutiveJournalRuntimeEnforcementBoundaries,
  ExecutiveJournalRuntimeEnforcementMetadata,
  ExecutiveJournalRuntimeEnforcementOpenIssues,
  ExecutiveJournalRuntimeEnforcementOwnership,
  ExecutiveJournalRuntimeEnforcementPrinciples,
  ExecutiveJournalRuntimeEnforcementProhibitedSurfaces,
} from "./executiveJournalRuntimeEnforcementMetadata.ts";
import {
  ExecutiveJournalRuntimeEnforcementRules,
  ExecutiveJournalRuntimeObligationStepMapping,
  isExecutiveJournalEnforcementAwaitingConfirmation,
  isExecutiveJournalEnforcementBlocked,
  isExecutiveJournalEnforcementEnforceable,
  planExecutiveJournalRuntimeEnforcement,
  validateExecutiveJournalObligationStepMapping,
} from "./executiveJournalRuntimeEnforcementRules.ts";
import type { ExecutiveJournalRuntimeEnforcementSummary } from "./executiveJournalRuntimeEnforcementTypes.ts";

export {
  ExecutiveJournalRuntimeEnforcementId,
  ExecutiveJournalRuntimeEnforcementIdentity,
  ExecutiveJournalRuntimeEnforcementName,
  ExecutiveJournalRuntimeEnforcementNamespace,
  ExecutiveJournalRuntimeEnforcementNextPhase,
  ExecutiveJournalRuntimeEnforcementReadiness,
  ExecutiveJournalRuntimeEnforcementStatus,
  ExecutiveJournalRuntimeEnforcementVersion,
};

export {
  planExecutiveJournalRuntimeEnforcement,
  isExecutiveJournalEnforcementBlocked,
  isExecutiveJournalEnforcementAwaitingConfirmation,
  isExecutiveJournalEnforcementEnforceable,
  validateExecutiveJournalObligationStepMapping,
  ExecutiveJournalRuntimeObligationStepMapping,
};

if (ExecutiveJournalRuntimePolicy.readiness !== "ReadyForPlatform") {
  throw new Error(
    "RTC-2:6 Enforcement requires RTC-2:5 Policy readiness ReadyForPlatform.",
  );
}

if (
  ExecutiveJournalRuntimePolicy.identity.id
    !== "RTC-2:5/ExecutiveJournalRuntimePolicy"
) {
  throw new Error(
    "RTC-2:6 Enforcement requires the canonical RTC-2:5 Policy aggregate.",
  );
}

if (!validateExecutiveJournalObligationStepMapping()) {
  throw new Error(
    "RTC-2:6 Enforcement requires a complete obligation-to-step mapping.",
  );
}

/**
 * Canonical immutable Executive Journal Runtime Policy Enforcement aggregate.
 */
export const ExecutiveJournalRuntimeEnforcement = Object.freeze({
  identity: ExecutiveJournalRuntimeEnforcementIdentity,
  policy: ExecutiveJournalRuntimePolicy,
  validation: ExecutiveJournalRuntimePolicy.validation,
  model: ExecutiveJournalRuntimePolicy.model,
  registry: ExecutiveJournalRuntimePolicy.registry,
  foundation: ExecutiveJournalRuntimePolicy.foundation,
  lifecycle: ExecutiveJournalRuntimeEnforcementLifecycle,
  contracts: ExecutiveJournalRuntimeEnforcementContracts,
  contractNames: ExecutiveJournalRuntimeEnforcementContractNames,
  rules: ExecutiveJournalRuntimeEnforcementRules,
  stepKinds: ExecutiveJournalRuntimeEnforcementStepKinds,
  obligationStepMapping: ExecutiveJournalRuntimeObligationStepMapping,
  principles: ExecutiveJournalRuntimeEnforcementPrinciples,
  openIssues: ExecutiveJournalRuntimeEnforcementOpenIssues,
  ownership: ExecutiveJournalRuntimeEnforcementOwnership,
  boundaries: ExecutiveJournalRuntimeEnforcementBoundaries,
  prohibitedSurfaces: ExecutiveJournalRuntimeEnforcementProhibitedSurfaces,
  aiMustNot: ExecutiveJournalEnforcementAiMustNot,
  metadata: ExecutiveJournalRuntimeEnforcementMetadata,
  status: ExecutiveJournalRuntimeEnforcementStatus,
  readiness: ExecutiveJournalRuntimeEnforcementReadiness,
  nextPhase: ExecutiveJournalRuntimeEnforcementNextPhase,
  plan: planExecutiveJournalRuntimeEnforcement,
  isBlocked: isExecutiveJournalEnforcementBlocked,
  isAwaitingConfirmation: isExecutiveJournalEnforcementAwaitingConfirmation,
  isEnforceable: isExecutiveJournalEnforcementEnforceable,
  validateObligationMapping: validateExecutiveJournalObligationStepMapping,
  statistics: Object.freeze({
    ruleCount: ExecutiveJournalRuntimeEnforcementRules.length,
    contractCount: ExecutiveJournalRuntimeEnforcementContracts.length,
    stepKindCount: ExecutiveJournalRuntimeEnforcementStepKinds.length,
    obligationMappingCount: Object.keys(
      ExecutiveJournalRuntimeObligationStepMapping,
    ).length,
    openIssueCount: ExecutiveJournalRuntimeEnforcementOpenIssues.length,
    principleCount: ExecutiveJournalRuntimeEnforcementPrinciples.length,
  }),
  upstreamDependencies: Object.freeze([
    "RTC-2:5 — Executive Journal Runtime Policy",
  ]),
  upstreamChain: Object.freeze({
    policy: ExecutiveJournalRuntimePolicy.identity.id,
    validation: ExecutiveJournalRuntimePolicy.validation.identity.id,
    model: ExecutiveJournalRuntimePolicy.model.identity.id,
    registry: ExecutiveJournalRuntimePolicy.registry.identity.id,
    foundation:
      ExecutiveJournalRuntimePolicy.foundation.identity.foundationId,
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
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  resolvesOpenIssues: false as const,
  importsPolicyOnly: true as const,
  platformPhase: false as const,
} as const);

export function getExecutiveJournalRuntimeEnforcementSummary():
  ExecutiveJournalRuntimeEnforcementSummary {
  return Object.freeze({
    enforcementId: ExecutiveJournalRuntimeEnforcementId,
    version: ExecutiveJournalRuntimeEnforcementVersion,
    name: ExecutiveJournalRuntimeEnforcementName,
    namespace: ExecutiveJournalRuntimeEnforcementNamespace,
    status: ExecutiveJournalRuntimeEnforcementStatus,
    readiness: ExecutiveJournalRuntimeEnforcementReadiness,
    stepKindCount: ExecutiveJournalRuntimeEnforcementStepKinds.length,
    obligationMappingCount: Object.keys(
      ExecutiveJournalRuntimeObligationStepMapping,
    ).length,
    openIssueCount: ExecutiveJournalRuntimeEnforcementOpenIssues.length,
    sourcePolicy: "RTC-2:5/ExecutiveJournalRuntimePolicy" as const,
    nextPhase: ExecutiveJournalRuntimeEnforcementNextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveJournalRuntimeEnforcement = () =>
  ExecutiveJournalRuntimeEnforcement;
