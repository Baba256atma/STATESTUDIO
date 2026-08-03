/** EX-3:4 immutable Validation manifest. */

import { ExecutiveTimelineExperienceModel } from "./executiveTimelineExperienceModel.ts";
import {
  ExecutiveTimelineExperienceValidationId,
  ExecutiveTimelineExperienceValidationIdentity,
  ExecutiveTimelineExperienceValidationNamespace,
  ExecutiveTimelineExperienceValidationNextPhase,
  ExecutiveTimelineExperienceValidationPreviousPhase,
  ExecutiveTimelineExperienceValidationReadiness,
  ExecutiveTimelineExperienceValidationStatus,
  ExecutiveTimelineExperienceValidationVersion,
} from "./executiveTimelineExperienceValidationIdentity.ts";
import {
  ExecutiveTimelineExperienceValidationCategoryCount,
  ExecutiveTimelineExperienceValidationCategories,
  ExecutiveTimelineExperienceValidationRuleCount,
  ExecutiveTimelineExperienceValidationRules,
} from "./executiveTimelineExperienceValidationRules.ts";

export const ExecutiveTimelineExperienceValidationManifest = Object.freeze({
  manifestId: "EX-3:4/ExecutiveTimelineExperienceValidationManifest" as const,
  identity: ExecutiveTimelineExperienceValidationIdentity,
  validationIdentity: ExecutiveTimelineExperienceValidationId,
  namespace: ExecutiveTimelineExperienceValidationNamespace,
  version: ExecutiveTimelineExperienceValidationVersion,
  status: ExecutiveTimelineExperienceValidationStatus,
  readiness: ExecutiveTimelineExperienceValidationReadiness,
  previousPhase: ExecutiveTimelineExperienceValidationPreviousPhase,
  nextPhase: ExecutiveTimelineExperienceValidationNextPhase,
  upstreamDependency: "EX-3:3/ExecutiveTimelineExperienceModel" as const,
  upstreamModelReference: ExecutiveTimelineExperienceModel.identity.id,
  ruleCount: ExecutiveTimelineExperienceValidationRuleCount,
  categoryCount: ExecutiveTimelineExperienceValidationCategoryCount,
  validationSummary: Object.freeze({
    categoryNames: ExecutiveTimelineExperienceValidationCategories.map(
      (category) => category.name,
    ),
    ruleIds: ExecutiveTimelineExperienceValidationRules.map(
      (rule) => rule.ruleId,
    ),
    modelIdentity: ExecutiveTimelineExperienceModel.identity.id,
    modelReadiness: ExecutiveTimelineExperienceModel.readiness,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  dependency: Object.freeze({
    model: ExecutiveTimelineExperienceModel,
    modelIdentity: ExecutiveTimelineExperienceModel.identity.id,
    modelReadiness: ExecutiveTimelineExperienceModel.readiness,
    runtimeDependency: "EX-3:3/ExecutiveTimelineExperienceModel" as const,
  }),
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
});
