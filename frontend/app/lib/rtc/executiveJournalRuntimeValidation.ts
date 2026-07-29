/**
 * RTC-2:4 — Executive Journal Runtime Validation.
 *
 * Pure deterministic validation over the RTC-2:3 model.
 * Consumes RTC-2:3 Model public surface only.
 * Evaluation only — no mutation, repair, UI, network, or clock.
 *
 * Ownership: owned exclusively by RTC-2:4.
 *
 * Public exports:
 *   ExecutiveJournalRuntimeValidationId
 *   ExecutiveJournalRuntimeValidationVersion
 *   ExecutiveJournalRuntimeValidationName
 *   ExecutiveJournalRuntimeValidationNamespace
 *   ExecutiveJournalRuntimeValidationStatus
 *   ExecutiveJournalRuntimeValidationReadiness
 *   ExecutiveJournalRuntimeValidation
 *   validateExecutiveJournalRuntimeModel()
 *   getExecutiveJournalRuntimeValidationSummary()
 */

import { ExecutiveJournalRuntimeModel } from "./executiveJournalRuntimeModel.ts";
import {
  ExecutiveJournalRuntimeValidationContractNames,
  ExecutiveJournalRuntimeValidationContracts,
  ExecutiveJournalRuntimeValidationRuleFamilies,
} from "./executiveJournalRuntimeValidationContracts.ts";
import {
  ExecutiveJournalRuntimeValidationId,
  ExecutiveJournalRuntimeValidationIdentity,
  ExecutiveJournalRuntimeValidationName,
  ExecutiveJournalRuntimeValidationNamespace,
  ExecutiveJournalRuntimeValidationNextPhase,
  ExecutiveJournalRuntimeValidationReadiness,
  ExecutiveJournalRuntimeValidationStatus,
  ExecutiveJournalRuntimeValidationVersion,
} from "./executiveJournalRuntimeValidationIdentity.ts";
import {
  ExecutiveJournalRuntimeBlockingSeverities,
  ExecutiveJournalRuntimeValidationLifecycle,
  ExecutiveJournalRuntimeValidationSeverities,
  ExecutiveJournalRuntimeValidationSeverityNames,
} from "./executiveJournalRuntimeValidationLifecycle.ts";
import {
  ExecutiveJournalValidationAiMustNot,
  ExecutiveJournalRuntimeValidationBoundaries,
  ExecutiveJournalRuntimeValidationMetadata,
  ExecutiveJournalRuntimeValidationOpenIssues,
  ExecutiveJournalRuntimeValidationOwnership,
  ExecutiveJournalRuntimeValidationPrinciples,
  ExecutiveJournalRuntimeValidationProhibitedSurfaces,
} from "./executiveJournalRuntimeValidationMetadata.ts";
import {
  isExecutiveJournalValidationResultValid,
  validateExecutiveJournalEntityCollection,
  validateExecutiveJournalEntityDescriptor,
  validateExecutiveJournalEntityInstance,
  validateExecutiveJournalRelationships,
  validateExecutiveJournalRuntimeModel,
  validateExecutiveJournalTelemetryDescriptor,
  ExecutiveJournalRuntimeValidationRules,
} from "./executiveJournalRuntimeValidationRules.ts";
import type { ExecutiveJournalRuntimeValidationSummary } from "./executiveJournalRuntimeValidationTypes.ts";

export {
  ExecutiveJournalRuntimeValidationId,
  ExecutiveJournalRuntimeValidationIdentity,
  ExecutiveJournalRuntimeValidationName,
  ExecutiveJournalRuntimeValidationNamespace,
  ExecutiveJournalRuntimeValidationNextPhase,
  ExecutiveJournalRuntimeValidationReadiness,
  ExecutiveJournalRuntimeValidationStatus,
  ExecutiveJournalRuntimeValidationVersion,
};

export {
  isExecutiveJournalValidationResultValid,
  validateExecutiveJournalEntityCollection,
  validateExecutiveJournalEntityDescriptor,
  validateExecutiveJournalEntityInstance,
  validateExecutiveJournalRelationships,
  validateExecutiveJournalRuntimeModel,
  validateExecutiveJournalTelemetryDescriptor,
};

/**
 * Canonical immutable Executive Journal Runtime Validation aggregate.
 */
export const ExecutiveJournalRuntimeValidation = Object.freeze({
  identity: ExecutiveJournalRuntimeValidationIdentity,
  model: ExecutiveJournalRuntimeModel,
  lifecycle: ExecutiveJournalRuntimeValidationLifecycle,
  contracts: ExecutiveJournalRuntimeValidationContracts,
  contractNames: ExecutiveJournalRuntimeValidationContractNames,
  families: ExecutiveJournalRuntimeValidationRuleFamilies,
  rules: ExecutiveJournalRuntimeValidationRules,
  severities: ExecutiveJournalRuntimeValidationSeverities,
  severityNames: ExecutiveJournalRuntimeValidationSeverityNames,
  blockingSeverities: ExecutiveJournalRuntimeBlockingSeverities,
  principles: ExecutiveJournalRuntimeValidationPrinciples,
  openIssues: ExecutiveJournalRuntimeValidationOpenIssues,
  ownership: ExecutiveJournalRuntimeValidationOwnership,
  boundaries: ExecutiveJournalRuntimeValidationBoundaries,
  prohibitedSurfaces: ExecutiveJournalRuntimeValidationProhibitedSurfaces,
  aiMustNot: ExecutiveJournalValidationAiMustNot,
  metadata: ExecutiveJournalRuntimeValidationMetadata,
  status: ExecutiveJournalRuntimeValidationStatus,
  readiness: ExecutiveJournalRuntimeValidationReadiness,
  nextPhase: ExecutiveJournalRuntimeValidationNextPhase,
  validateModel: validateExecutiveJournalRuntimeModel,
  validateEntityInstance: validateExecutiveJournalEntityInstance,
  validateEntityCollection: validateExecutiveJournalEntityCollection,
  validateRelationships: validateExecutiveJournalRelationships,
  validateTelemetry: validateExecutiveJournalTelemetryDescriptor,
  isValid: isExecutiveJournalValidationResultValid,
  statistics: Object.freeze({
    ruleCount: ExecutiveJournalRuntimeValidationRules.length,
    familyCount: ExecutiveJournalRuntimeValidationRuleFamilies.length,
    severityCount: ExecutiveJournalRuntimeValidationSeverities.length,
    openIssueCount: ExecutiveJournalRuntimeValidationOpenIssues.length,
    principleCount: ExecutiveJournalRuntimeValidationPrinciples.length,
    contractCount: ExecutiveJournalRuntimeValidationContracts.length,
  }),
  upstreamDependencies: Object.freeze([
    "RTC-2:3 — Executive Journal Runtime Model",
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
  manifestPhase: false as const,
  platformPhase: false as const,
} as const);

/** Deterministic frozen Validation summary. */
export function getExecutiveJournalRuntimeValidationSummary():
  ExecutiveJournalRuntimeValidationSummary {
  return Object.freeze({
    validationId: ExecutiveJournalRuntimeValidationId,
    version: ExecutiveJournalRuntimeValidationVersion,
    name: ExecutiveJournalRuntimeValidationName,
    namespace: ExecutiveJournalRuntimeValidationNamespace,
    status: ExecutiveJournalRuntimeValidationStatus,
    readiness: ExecutiveJournalRuntimeValidationReadiness,
    ruleCount: ExecutiveJournalRuntimeValidationRules.length,
    familyCount: ExecutiveJournalRuntimeValidationRuleFamilies.length,
    openIssueCount: ExecutiveJournalRuntimeValidationOpenIssues.length,
    sourceModel: "RTC-2:3/ExecutiveJournalRuntimeModel" as const,
    nextPhase: ExecutiveJournalRuntimeValidationNextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveJournalRuntimeValidation = () =>
  ExecutiveJournalRuntimeValidation;
