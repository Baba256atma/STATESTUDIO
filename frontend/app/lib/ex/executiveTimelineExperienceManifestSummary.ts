/** EX-3:5 immutable Manifest summary publication. */

import { ExecutiveTimelineExperienceValidation } from "./executiveTimelineExperienceValidation.ts";
import { ExecutiveTimelineExperienceManifestCapabilityCount } from "./executiveTimelineExperienceManifestCapabilities.ts";
import { ExecutiveTimelineExperienceManifestDependencyCount } from "./executiveTimelineExperienceManifestDependencies.ts";
import {
  ExecutiveTimelineExperienceManifestId,
  ExecutiveTimelineExperienceManifestNamespace,
  ExecutiveTimelineExperienceManifestNextPhase,
  ExecutiveTimelineExperienceManifestPreviousPhase,
  ExecutiveTimelineExperienceManifestReadiness,
  ExecutiveTimelineExperienceManifestStatus,
  ExecutiveTimelineExperienceManifestVersion,
} from "./executiveTimelineExperienceManifestIdentity.ts";
import { ExecutiveTimelineExperienceManifestBoundaries } from "./executiveTimelineExperienceManifestMetadata.ts";
import type { ExecutiveTimelineExperienceManifestSummary } from "./executiveTimelineExperienceManifestTypes.ts";

export const ExecutiveTimelineExperienceManifestSummaryValue = Object.freeze({
  identity: ExecutiveTimelineExperienceManifestId,
  namespace: ExecutiveTimelineExperienceManifestNamespace,
  version: ExecutiveTimelineExperienceManifestVersion,
  status: ExecutiveTimelineExperienceManifestStatus,
  readiness: ExecutiveTimelineExperienceManifestReadiness,
  previousPhase: ExecutiveTimelineExperienceManifestPreviousPhase,
  nextPhase: ExecutiveTimelineExperienceManifestNextPhase,
  upstreamDependency: "EX-3:4/ExecutiveTimelineExperienceValidation",
  capabilityCount: 16,
  dependencyCount: 4,
  validationCategoryCount: 12,
  validationRuleCount: 36,
  metadataOnly: true,
  deterministic: true,
  sideEffectFree: true,
  platformCreated: false,
  platformAuthorized: false,
} as const satisfies ExecutiveTimelineExperienceManifestSummary);

export const ExecutiveTimelineExperienceManifestArchitecturalSummary =
  Object.freeze({
    architecturalLayer: "Executive Experience (EX)" as const,
    module: "Executive Timeline Experience" as const,
    metadataOnly: true as const,
    deterministic: true as const,
    sideEffectFree: true as const,
    boundaries: ExecutiveTimelineExperienceManifestBoundaries,
    capabilityCount: ExecutiveTimelineExperienceManifestCapabilityCount,
    dependencyCount: ExecutiveTimelineExperienceManifestDependencyCount,
    validationIdentity: ExecutiveTimelineExperienceValidation.identity.id,
    validationReadiness: ExecutiveTimelineExperienceValidation.readiness,
    validationCategoryCount:
      ExecutiveTimelineExperienceValidation.categoryCount,
    validationRuleCount: ExecutiveTimelineExperienceValidation.ruleCount,
    immutable: true as const,
  });

export const ExecutiveTimelineExperienceManifestValidationSummary =
  Object.freeze({
    validationIdentity: ExecutiveTimelineExperienceValidation.identity.id,
    validationStatus: ExecutiveTimelineExperienceValidation.status,
    validationReadiness: ExecutiveTimelineExperienceValidation.readiness,
    categoryCount: ExecutiveTimelineExperienceValidation.categoryCount,
    ruleCount: ExecutiveTimelineExperienceValidation.ruleCount,
    evidence: ExecutiveTimelineExperienceValidation.evidence,
    summary: ExecutiveTimelineExperienceValidation.getSummary(),
    metadataOnly: true as const,
    immutable: true as const,
  });

export const getExecutiveTimelineExperienceManifestSummary =
  (): ExecutiveTimelineExperienceManifestSummary =>
    ExecutiveTimelineExperienceManifestSummaryValue;
