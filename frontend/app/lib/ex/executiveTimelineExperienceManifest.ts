/**
 * EX-3:5 — metadata-only Executive Timeline Experience Manifest aggregate.
 *
 * EX-3:4 Validation is the sole upstream runtime dependency.
 */

import { ExecutiveTimelineExperienceValidation } from "./executiveTimelineExperienceValidation.ts";
import {
  ExecutiveTimelineExperienceManifestCapabilities,
  ExecutiveTimelineExperienceManifestCapabilityCount,
} from "./executiveTimelineExperienceManifestCapabilities.ts";
import {
  ExecutiveTimelineExperienceManifestDependencies,
  ExecutiveTimelineExperienceManifestDependencyCount,
  ExecutiveTimelineExperienceManifestDependencySummary,
} from "./executiveTimelineExperienceManifestDependencies.ts";
import {
  ExecutiveTimelineExperienceManifestApprovedAliases,
  ExecutiveTimelineExperienceManifestId,
  ExecutiveTimelineExperienceManifestIdentity,
  ExecutiveTimelineExperienceManifestNamespace,
  ExecutiveTimelineExperienceManifestNextPhase,
  ExecutiveTimelineExperienceManifestPreviousPhase,
  ExecutiveTimelineExperienceManifestReadiness,
  ExecutiveTimelineExperienceManifestStatus,
  ExecutiveTimelineExperienceManifestVersion,
  assertExecutiveTimelineExperienceManifestIdentity,
  resolveExecutiveTimelineExperienceManifestIdentity,
} from "./executiveTimelineExperienceManifestIdentity.ts";
import {
  ExecutiveTimelineExperienceManifestBoundaries,
  ExecutiveTimelineExperienceManifestContracts,
  ExecutiveTimelineExperienceManifestDecisions,
  ExecutiveTimelineExperienceManifestMetadata,
} from "./executiveTimelineExperienceManifestMetadata.ts";
import {
  ExecutiveTimelineExperienceManifestArchitecturalSummary,
  ExecutiveTimelineExperienceManifestSummaryValue,
  ExecutiveTimelineExperienceManifestValidationSummary,
  getExecutiveTimelineExperienceManifestSummary,
} from "./executiveTimelineExperienceManifestSummary.ts";
import type { ExecutiveTimelineExperienceManifestSummary } from "./executiveTimelineExperienceManifestTypes.ts";

export * from "./executiveTimelineExperienceManifestTypes.ts";
export * from "./executiveTimelineExperienceManifestIdentity.ts";
export * from "./executiveTimelineExperienceManifestCapabilities.ts";
export * from "./executiveTimelineExperienceManifestDependencies.ts";
export * from "./executiveTimelineExperienceManifestMetadata.ts";
export * from "./executiveTimelineExperienceManifestSummary.ts";

if (ExecutiveTimelineExperienceValidation.readiness !== "ReadyForManifest") {
  throw new Error(
    "EX-3:5 Manifest requires Validation readiness ReadyForManifest.",
  );
}

if (ExecutiveTimelineExperienceValidation.status !== "Validation") {
  throw new Error("EX-3:5 Manifest requires Validation status Validation.");
}

if (ExecutiveTimelineExperienceManifestCapabilities.length !== 16) {
  throw new Error("EX-3:5 Manifest requires exactly sixteen capabilities.");
}

if (ExecutiveTimelineExperienceManifestDependencies.length !== 4) {
  throw new Error("EX-3:5 Manifest requires exactly four dependency records.");
}

export const ExecutiveTimelineExperienceManifestDependencyDeclaration =
  Object.freeze({
    runtimeDependency: "EX-3:4/ExecutiveTimelineExperienceValidation" as const,
    validationOnly: true as const,
    modelRegistryFoundationReachedThroughValidationOnly: true as const,
    dynamicImports: false as const,
    requireCalls: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveTimelineExperienceManifest = Object.freeze({
  identity: ExecutiveTimelineExperienceManifestIdentity,
  capabilities: ExecutiveTimelineExperienceManifestCapabilities,
  dependencies: ExecutiveTimelineExperienceManifestDependencies,
  dependencySummary: ExecutiveTimelineExperienceManifestDependencySummary,
  metadata: ExecutiveTimelineExperienceManifestMetadata,
  summary: ExecutiveTimelineExperienceManifestSummaryValue,
  validationSummary: ExecutiveTimelineExperienceManifestValidationSummary,
  architecturalSummary: ExecutiveTimelineExperienceManifestArchitecturalSummary,
  contracts: ExecutiveTimelineExperienceManifestContracts,
  decisions: ExecutiveTimelineExperienceManifestDecisions,
  boundaries: ExecutiveTimelineExperienceManifestBoundaries,
  validation: ExecutiveTimelineExperienceValidation,
  dependencyDeclaration:
    ExecutiveTimelineExperienceManifestDependencyDeclaration,
  getSummary: getExecutiveTimelineExperienceManifestSummary,
  status: ExecutiveTimelineExperienceManifestStatus,
  readiness: ExecutiveTimelineExperienceManifestReadiness,
  aliases: ExecutiveTimelineExperienceManifestApprovedAliases,
  capabilityCount: ExecutiveTimelineExperienceManifestCapabilityCount,
  dependencyCount: ExecutiveTimelineExperienceManifestDependencyCount,
  namespace: ExecutiveTimelineExperienceManifestNamespace,
  version: ExecutiveTimelineExperienceManifestVersion,
  previousPhase: ExecutiveTimelineExperienceManifestPreviousPhase,
  nextPhase: ExecutiveTimelineExperienceManifestNextPhase,
  id: ExecutiveTimelineExperienceManifestId,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  failClosed: true as const,
  sideEffectFree: true as const,
  providerExecution: false as const,
  rtcIntegration: false as const,
  uiRendering: false as const,
  playbackEngine: false as const,
  platformCreated: false as const,
  platformAuthorized: false as const,
  ex36Created: false as const,
  ex36Authorized: false as const,
});

export type { ExecutiveTimelineExperienceManifestSummary };

export {
  assertExecutiveTimelineExperienceManifestIdentity,
  resolveExecutiveTimelineExperienceManifestIdentity,
};
