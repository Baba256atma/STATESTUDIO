/**
 * RTC-3:4 — Executive Decision Register Validation.
 *
 * Pure deterministic validation over the RTC-3:3 model.
 * Consumes RTC-3:3 Model public surface only.
 * Evaluation only — no mutation, repair, UI, network, or clock.
 *
 * Ownership: owned exclusively by RTC-3:4.
 */

import { ExecutiveDecisionRegisterModel } from "./executiveDecisionRegisterModel.ts";
import {
  ExecutiveDecisionRegisterValidationContractNames,
  ExecutiveDecisionRegisterValidationContracts,
  ExecutiveDecisionRegisterValidationRuleFamilies,
} from "./executiveDecisionRegisterValidationContracts.ts";
import {
  ExecutiveDecisionRegisterValidationId,
  ExecutiveDecisionRegisterValidationIdentity,
  ExecutiveDecisionRegisterValidationName,
  ExecutiveDecisionRegisterValidationNamespace,
  ExecutiveDecisionRegisterValidationNextPhase,
  ExecutiveDecisionRegisterValidationReadiness,
  ExecutiveDecisionRegisterValidationStatus,
  ExecutiveDecisionRegisterValidationVersion,
} from "./executiveDecisionRegisterValidationIdentity.ts";
import {
  ExecutiveDecisionRegisterBlockingSeverities,
  ExecutiveDecisionRegisterValidationLifecycle,
  ExecutiveDecisionRegisterValidationSeverities,
  ExecutiveDecisionRegisterValidationSeverityNames,
} from "./executiveDecisionRegisterValidationLifecycle.ts";
import {
  ExecutiveDecisionRegisterValidationAiMustNot,
  ExecutiveDecisionRegisterValidationBoundaries,
  ExecutiveDecisionRegisterValidationDecisions,
  ExecutiveDecisionRegisterValidationMetadata,
  ExecutiveDecisionRegisterValidationOpenIssues,
  ExecutiveDecisionRegisterValidationOwnership,
  ExecutiveDecisionRegisterValidationPrinciples,
  ExecutiveDecisionRegisterValidationProhibitedSurfaces,
  ExecutiveDecisionRegisterValidationUpstreamFoundationDecisions,
  ExecutiveDecisionRegisterValidationUpstreamModelDecisions,
  ExecutiveDecisionRegisterValidationUpstreamRegistryDecisions,
} from "./executiveDecisionRegisterValidationMetadata.ts";
import {
  ExecutiveDecisionRegisterValidationRules,
  isCanonicalDecisionRegisterValidationSubjectKind,
  isExecutiveDecisionRegisterValidationResultValid,
  validateExecutiveDecisionRegisterEntityCollection,
  validateExecutiveDecisionRegisterEntityDescriptor,
  validateExecutiveDecisionRegisterEntityInstance,
  validateExecutiveDecisionRegisterModel,
  validateExecutiveDecisionRegisterRelationships,
  validateExecutiveDecisionRegisterTelemetryDescriptor,
  verifyExecutiveDecisionRegisterValidationRuleCompleteness,
} from "./executiveDecisionRegisterValidationRules.ts";
import type { ExecutiveDecisionRegisterValidationSummary } from "./executiveDecisionRegisterValidationTypes.ts";

export {
  ExecutiveDecisionRegisterValidationId,
  ExecutiveDecisionRegisterValidationIdentity,
  ExecutiveDecisionRegisterValidationName,
  ExecutiveDecisionRegisterValidationNamespace,
  ExecutiveDecisionRegisterValidationNextPhase,
  ExecutiveDecisionRegisterValidationReadiness,
  ExecutiveDecisionRegisterValidationStatus,
  ExecutiveDecisionRegisterValidationVersion,
};

export {
  isCanonicalDecisionRegisterValidationSubjectKind,
  isExecutiveDecisionRegisterValidationResultValid,
  validateExecutiveDecisionRegisterEntityCollection,
  validateExecutiveDecisionRegisterEntityDescriptor,
  validateExecutiveDecisionRegisterEntityInstance,
  validateExecutiveDecisionRegisterModel,
  validateExecutiveDecisionRegisterRelationships,
  validateExecutiveDecisionRegisterTelemetryDescriptor,
  verifyExecutiveDecisionRegisterValidationRuleCompleteness,
};

if (ExecutiveDecisionRegisterModel.readiness !== "ReadyForValidation") {
  throw new Error(
    "RTC-3:4 validation requires RTC-3:3 model readiness ReadyForValidation.",
  );
}

if (
  ExecutiveDecisionRegisterModel.identity.id
    !== "RTC-3:3/ExecutiveDecisionRegisterModel"
) {
  throw new Error(
    "RTC-3:4 validation requires the canonical RTC-3:3 model aggregate.",
  );
}

/**
 * Canonical immutable Executive Decision Register Validation aggregate.
 */
export const ExecutiveDecisionRegisterValidation = Object.freeze({
  identity: ExecutiveDecisionRegisterValidationIdentity,
  model: ExecutiveDecisionRegisterModel,
  registry: ExecutiveDecisionRegisterModel.registry,
  foundationEntry: ExecutiveDecisionRegisterModel.foundationEntry,
  foundation: ExecutiveDecisionRegisterModel.foundation,
  lifecycle: ExecutiveDecisionRegisterValidationLifecycle,
  contracts: ExecutiveDecisionRegisterValidationContracts,
  contractNames: ExecutiveDecisionRegisterValidationContractNames,
  families: ExecutiveDecisionRegisterValidationRuleFamilies,
  rules: ExecutiveDecisionRegisterValidationRules,
  severities: ExecutiveDecisionRegisterValidationSeverities,
  severityNames: ExecutiveDecisionRegisterValidationSeverityNames,
  blockingSeverities: ExecutiveDecisionRegisterBlockingSeverities,
  principles: ExecutiveDecisionRegisterValidationPrinciples,
  decisions: ExecutiveDecisionRegisterValidationDecisions,
  upstreamFoundationDecisions:
    ExecutiveDecisionRegisterValidationUpstreamFoundationDecisions,
  upstreamRegistryDecisions:
    ExecutiveDecisionRegisterValidationUpstreamRegistryDecisions,
  upstreamModelDecisions:
    ExecutiveDecisionRegisterValidationUpstreamModelDecisions,
  openIssues: ExecutiveDecisionRegisterValidationOpenIssues,
  ownership: ExecutiveDecisionRegisterValidationOwnership,
  boundaries: ExecutiveDecisionRegisterValidationBoundaries,
  prohibitedSurfaces: ExecutiveDecisionRegisterValidationProhibitedSurfaces,
  aiMustNot: ExecutiveDecisionRegisterValidationAiMustNot,
  metadata: ExecutiveDecisionRegisterValidationMetadata,
  status: ExecutiveDecisionRegisterValidationStatus,
  readiness: ExecutiveDecisionRegisterValidationReadiness,
  nextPhase: ExecutiveDecisionRegisterValidationNextPhase,
  validateModel: validateExecutiveDecisionRegisterModel,
  validateEntityInstance: validateExecutiveDecisionRegisterEntityInstance,
  validateEntityCollection: validateExecutiveDecisionRegisterEntityCollection,
  validateRelationships: validateExecutiveDecisionRegisterRelationships,
  validateTelemetry: validateExecutiveDecisionRegisterTelemetryDescriptor,
  verifyRuleCompleteness:
    verifyExecutiveDecisionRegisterValidationRuleCompleteness,
  isValid: isExecutiveDecisionRegisterValidationResultValid,
  isCanonicalSubjectKind: isCanonicalDecisionRegisterValidationSubjectKind,
  statistics: Object.freeze({
    ruleCount: ExecutiveDecisionRegisterValidationRules.length,
    familyCount: ExecutiveDecisionRegisterValidationRuleFamilies.length,
    severityCount: ExecutiveDecisionRegisterValidationSeverities.length,
    openIssueCount: ExecutiveDecisionRegisterValidationOpenIssues.length,
    principleCount: ExecutiveDecisionRegisterValidationPrinciples.length,
    contractCount: ExecutiveDecisionRegisterValidationContracts.length,
    decisionCount: ExecutiveDecisionRegisterValidationDecisions.length,
  }),
  upstreamDependencies: Object.freeze([
    "RTC-3:3 — Executive Decision Register Model",
  ]),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  evaluatesOnly: true as const,
  pureEvaluation: true as const,
  mutatesInputs: false as const,
  repairsInputs: false as const,
  usesSystemClock: false as const,
  usesNetwork: false as const,
  usesRandomness: false as const,
  activatesContexts: false as const,
  modifiesRuntimeState: false as const,
  renderingBehavior: false as const,
  invokesAi: false as const,
  accessesDatabases: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  resolvesOpenIssues: false as const,
  importsFoundationDirectly: false as const,
  importsRegistryDirectly: false as const,
  selectsLiveAuthorityRegistry: false as const,
  policyPhase: false as const,
  platformPhase: false as const,
  importsRtc2: false as const,
  importsRtc1: false as const,
  importsApp8: false as const,
} as const);

/** Deterministic frozen Validation summary. */
export function getExecutiveDecisionRegisterValidationSummary():
  ExecutiveDecisionRegisterValidationSummary {
  return Object.freeze({
    validationId: ExecutiveDecisionRegisterValidationId,
    version: ExecutiveDecisionRegisterValidationVersion,
    name: ExecutiveDecisionRegisterValidationName,
    namespace: ExecutiveDecisionRegisterValidationNamespace,
    status: ExecutiveDecisionRegisterValidationStatus,
    readiness: ExecutiveDecisionRegisterValidationReadiness,
    ruleCount: ExecutiveDecisionRegisterValidationRules.length,
    familyCount: ExecutiveDecisionRegisterValidationRuleFamilies.length,
    openIssueCount: ExecutiveDecisionRegisterValidationOpenIssues.length,
    sourceModel: "RTC-3:3/ExecutiveDecisionRegisterModel" as const,
    nextPhase: ExecutiveDecisionRegisterValidationNextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveDecisionRegisterValidation = () =>
  ExecutiveDecisionRegisterValidation;
