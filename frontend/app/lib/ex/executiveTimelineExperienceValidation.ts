/**
 * EX-3:4 — metadata-only Executive Timeline Experience Validation aggregate.
 *
 * EX-3:3 Model is the sole upstream runtime dependency.
 */

import { ExecutiveTimelineExperienceModel } from "./executiveTimelineExperienceModel.ts";
import {
  ExecutiveTimelineExperienceValidationApprovedAliases,
  ExecutiveTimelineExperienceValidationId,
  ExecutiveTimelineExperienceValidationIdentity,
  ExecutiveTimelineExperienceValidationNamespace,
  ExecutiveTimelineExperienceValidationNextPhase,
  ExecutiveTimelineExperienceValidationPreviousPhase,
  ExecutiveTimelineExperienceValidationReadiness,
  ExecutiveTimelineExperienceValidationStatus,
  ExecutiveTimelineExperienceValidationVersion,
  assertExecutiveTimelineExperienceValidationIdentity,
  resolveExecutiveTimelineExperienceValidationIdentity,
} from "./executiveTimelineExperienceValidationIdentity.ts";
import { ExecutiveTimelineExperienceValidationEvidence } from "./executiveTimelineExperienceValidationEvidence.ts";
import { ExecutiveTimelineExperienceValidationManifest } from "./executiveTimelineExperienceValidationManifest.ts";
import {
  ExecutiveTimelineExperienceValidationContracts,
  ExecutiveTimelineExperienceValidationDecisions,
  ExecutiveTimelineExperienceValidationMetadata,
} from "./executiveTimelineExperienceValidationMetadata.ts";
import {
  ExecutiveTimelineExperienceValidationCategories,
  ExecutiveTimelineExperienceValidationCategoryCount,
  ExecutiveTimelineExperienceValidationRuleCount,
  ExecutiveTimelineExperienceValidationRules,
} from "./executiveTimelineExperienceValidationRules.ts";
import type { ExecutiveTimelineExperienceValidationSummary } from "./executiveTimelineExperienceValidationTypes.ts";

export * from "./executiveTimelineExperienceValidationTypes.ts";
export * from "./executiveTimelineExperienceValidationIdentity.ts";
export * from "./executiveTimelineExperienceValidationRules.ts";
export * from "./executiveTimelineExperienceValidationEvidence.ts";
export * from "./executiveTimelineExperienceValidationMetadata.ts";
export * from "./executiveTimelineExperienceValidationManifest.ts";

if (ExecutiveTimelineExperienceModel.readiness !== "ReadyForValidation") {
  throw new Error(
    "EX-3:4 Validation requires Model readiness ReadyForValidation.",
  );
}

if (ExecutiveTimelineExperienceModel.status !== "Model") {
  throw new Error("EX-3:4 Validation requires Model status Model.");
}

if (
  ExecutiveTimelineExperienceValidationCategories.length !== 12
  || ExecutiveTimelineExperienceValidationRules.length !== 36
) {
  throw new Error("EX-3:4 Validation catalogue counts are incomplete.");
}

export const ExecutiveTimelineExperienceValidationDependencyDeclaration =
  Object.freeze({
    runtimeDependency: "EX-3:3/ExecutiveTimelineExperienceModel" as const,
    modelOnly: true as const,
    registryAndFoundationReachedThroughModelOnly: true as const,
    dynamicImports: false as const,
    requireCalls: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveTimelineExperienceValidationSummaryValue = Object.freeze({
  identity: ExecutiveTimelineExperienceValidationId,
  namespace: ExecutiveTimelineExperienceValidationNamespace,
  version: ExecutiveTimelineExperienceValidationVersion,
  status: ExecutiveTimelineExperienceValidationStatus,
  readiness: ExecutiveTimelineExperienceValidationReadiness,
  previousPhase: ExecutiveTimelineExperienceValidationPreviousPhase,
  nextPhase: ExecutiveTimelineExperienceValidationNextPhase,
  categoryCount: 12,
  ruleCount: 36,
  modelIdentity: "EX-3:3/ExecutiveTimelineExperienceModel",
  metadataOnly: true,
  deterministic: true,
  sideEffectFree: true,
  manifestCreated: false,
  manifestAuthorized: false,
} as const satisfies ExecutiveTimelineExperienceValidationSummary);

export const getExecutiveTimelineExperienceValidationSummary =
  (): ExecutiveTimelineExperienceValidationSummary =>
    ExecutiveTimelineExperienceValidationSummaryValue;

export const ExecutiveTimelineExperienceValidation = Object.freeze({
  identity: ExecutiveTimelineExperienceValidationIdentity,
  categories: ExecutiveTimelineExperienceValidationCategories,
  rules: ExecutiveTimelineExperienceValidationRules,
  evidence: ExecutiveTimelineExperienceValidationEvidence,
  metadata: ExecutiveTimelineExperienceValidationMetadata,
  manifest: ExecutiveTimelineExperienceValidationManifest,
  contracts: ExecutiveTimelineExperienceValidationContracts,
  decisions: ExecutiveTimelineExperienceValidationDecisions,
  model: ExecutiveTimelineExperienceModel,
  dependencyDeclaration:
    ExecutiveTimelineExperienceValidationDependencyDeclaration,
  getSummary: getExecutiveTimelineExperienceValidationSummary,
  status: ExecutiveTimelineExperienceValidationStatus,
  readiness: ExecutiveTimelineExperienceValidationReadiness,
  aliases: ExecutiveTimelineExperienceValidationApprovedAliases,
  categoryCount: ExecutiveTimelineExperienceValidationCategoryCount,
  ruleCount: ExecutiveTimelineExperienceValidationRuleCount,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  failClosed: true as const,
  sideEffectFree: true as const,
  providerExecution: false as const,
  rtcIntegration: false as const,
  uiRendering: false as const,
  playbackEngine: false as const,
  validationEngine: false as const,
  executableRules: false as const,
  manifestCreated: false as const,
  manifestAuthorized: false as const,
  ex35Created: false as const,
  ex35Authorized: false as const,
});

export {
  assertExecutiveTimelineExperienceValidationIdentity,
  resolveExecutiveTimelineExperienceValidationIdentity,
};
