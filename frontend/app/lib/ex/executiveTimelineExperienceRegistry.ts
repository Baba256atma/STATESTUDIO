/**
 * EX-3:2 — metadata-only Executive Timeline Experience Registry aggregate.
 *
 * EX-3:1 Foundation is the sole upstream runtime dependency.
 */

import { ExecutiveTimelineExperienceFoundation } from "./executiveTimelineExperienceFoundation.ts";
import {
  ExecutiveTimelineExperienceRegistryAllEntries,
  ExecutiveTimelineExperienceRegistryCatalogues,
  ExecutiveTimelineExperienceRegistryEventTypes,
  ExecutiveTimelineExperienceRegistryInteractionTypes,
  ExecutiveTimelineExperienceRegistryMarkerTypes,
  ExecutiveTimelineExperienceRegistryNavigationModes,
  ExecutiveTimelineExperienceRegistryPlaybackStates,
  ExecutiveTimelineExperienceRegistryReadinessStates,
  ExecutiveTimelineExperienceRegistrySynchronizationModes,
  ExecutiveTimelineExperienceRegistryViewModes,
  lookupExecutiveTimelineExperienceRegistryEntry,
} from "./executiveTimelineExperienceRegistryCatalogues.ts";
import {
  ExecutiveTimelineExperienceRegistryApprovedAliases,
  ExecutiveTimelineExperienceRegistryId,
  ExecutiveTimelineExperienceRegistryIdentity,
  ExecutiveTimelineExperienceRegistryNamespace,
  ExecutiveTimelineExperienceRegistryNextPhase,
  ExecutiveTimelineExperienceRegistryPreviousPhase,
  ExecutiveTimelineExperienceRegistryReadiness,
  ExecutiveTimelineExperienceRegistryStatus,
  ExecutiveTimelineExperienceRegistryVersion,
  assertExecutiveTimelineExperienceRegistryIdentity,
  resolveExecutiveTimelineExperienceRegistryIdentity,
} from "./executiveTimelineExperienceRegistryIdentity.ts";
import { ExecutiveTimelineExperienceRegistryManifest } from "./executiveTimelineExperienceRegistryManifest.ts";
import {
  ExecutiveTimelineExperienceRegistryContracts,
  ExecutiveTimelineExperienceRegistryDecisions,
  ExecutiveTimelineExperienceRegistryMetadata,
} from "./executiveTimelineExperienceRegistryMetadata.ts";
import {
  ExecutiveTimelineExperienceRegistryValidation,
  ExecutiveTimelineExperienceRegistryValidationRules,
} from "./executiveTimelineExperienceRegistryValidation.ts";
import type { ExecutiveTimelineExperienceRegistrySummary } from "./executiveTimelineExperienceRegistryTypes.ts";

export * from "./executiveTimelineExperienceRegistryTypes.ts";
export * from "./executiveTimelineExperienceRegistryIdentity.ts";
export * from "./executiveTimelineExperienceRegistryCatalogues.ts";
export * from "./executiveTimelineExperienceRegistryValidation.ts";
export * from "./executiveTimelineExperienceRegistryMetadata.ts";
export * from "./executiveTimelineExperienceRegistryManifest.ts";

if (
  ExecutiveTimelineExperienceFoundation.readiness !== "ReadyForRegistry"
) {
  throw new Error(
    "EX-3:2 Registry requires Foundation readiness ReadyForRegistry.",
  );
}

if (ExecutiveTimelineExperienceFoundation.status !== "Foundation") {
  throw new Error("EX-3:2 Registry requires Foundation status Foundation.");
}

if (ExecutiveTimelineExperienceRegistryCatalogues.length !== 8) {
  throw new Error("EX-3:2 Registry requires exactly eight catalogues.");
}

if (ExecutiveTimelineExperienceRegistryAllEntries.length !== 65) {
  throw new Error("EX-3:2 Registry requires exactly sixty-five entries.");
}

if (ExecutiveTimelineExperienceRegistryValidationRules.length !== 10) {
  throw new Error("EX-3:2 Registry requires exactly ten validation rules.");
}

if (!ExecutiveTimelineExperienceRegistryValidation.allPassed) {
  throw new Error("EX-3:2 Registry validation must all Pass.");
}

export const ExecutiveTimelineExperienceRegistryDependencyDeclaration =
  Object.freeze({
    runtimeDependency:
      "EX-3:1/ExecutiveTimelineExperienceFoundation" as const,
    foundationOnly: true as const,
    dynamicImports: false as const,
    requireCalls: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveTimelineExperienceRegistrySummaryValue = Object.freeze({
  identity: ExecutiveTimelineExperienceRegistryId,
  namespace: ExecutiveTimelineExperienceRegistryNamespace,
  version: ExecutiveTimelineExperienceRegistryVersion,
  status: ExecutiveTimelineExperienceRegistryStatus,
  readiness: ExecutiveTimelineExperienceRegistryReadiness,
  previousPhase: ExecutiveTimelineExperienceRegistryPreviousPhase,
  nextPhase: ExecutiveTimelineExperienceRegistryNextPhase,
  catalogueCount: 8,
  totalRegisteredEntries: 65,
  validationRuleCount: 10,
  foundationIdentity: "EX-3:1/ExecutiveTimelineExperienceFoundation",
  metadataOnly: true,
  deterministic: true,
  sideEffectFree: true,
  modelCreated: false,
  modelAuthorized: false,
} as const satisfies ExecutiveTimelineExperienceRegistrySummary);

export const getExecutiveTimelineExperienceRegistrySummary =
  (): ExecutiveTimelineExperienceRegistrySummary =>
    ExecutiveTimelineExperienceRegistrySummaryValue;

export const ExecutiveTimelineExperienceRegistry = Object.freeze({
  identity: ExecutiveTimelineExperienceRegistryIdentity,
  catalogues: ExecutiveTimelineExperienceRegistryCatalogues,
  eventTypes: ExecutiveTimelineExperienceRegistryEventTypes,
  navigationModes: ExecutiveTimelineExperienceRegistryNavigationModes,
  markerTypes: ExecutiveTimelineExperienceRegistryMarkerTypes,
  playbackStates: ExecutiveTimelineExperienceRegistryPlaybackStates,
  synchronizationModes:
    ExecutiveTimelineExperienceRegistrySynchronizationModes,
  viewModes: ExecutiveTimelineExperienceRegistryViewModes,
  interactionTypes: ExecutiveTimelineExperienceRegistryInteractionTypes,
  readinessStates: ExecutiveTimelineExperienceRegistryReadinessStates,
  allEntries: ExecutiveTimelineExperienceRegistryAllEntries,
  lookup: lookupExecutiveTimelineExperienceRegistryEntry,
  validation: ExecutiveTimelineExperienceRegistryValidation,
  validationRules: ExecutiveTimelineExperienceRegistryValidationRules,
  manifest: ExecutiveTimelineExperienceRegistryManifest,
  metadata: ExecutiveTimelineExperienceRegistryMetadata,
  contracts: ExecutiveTimelineExperienceRegistryContracts,
  decisions: ExecutiveTimelineExperienceRegistryDecisions,
  foundation: ExecutiveTimelineExperienceFoundation,
  dependencyDeclaration:
    ExecutiveTimelineExperienceRegistryDependencyDeclaration,
  getSummary: getExecutiveTimelineExperienceRegistrySummary,
  status: ExecutiveTimelineExperienceRegistryStatus,
  readiness: ExecutiveTimelineExperienceRegistryReadiness,
  aliases: ExecutiveTimelineExperienceRegistryApprovedAliases,
  metadataOnly: true as const,
  deterministic: true as const,
  immutable: true as const,
  failClosed: true as const,
  sideEffectFree: true as const,
  providerExecution: false as const,
  rtcIntegration: false as const,
  uiRendering: false as const,
  modelCreated: false as const,
  modelAuthorized: false as const,
  ex33Created: false as const,
  ex33Authorized: false as const,
});

export {
  assertExecutiveTimelineExperienceRegistryIdentity,
  resolveExecutiveTimelineExperienceRegistryIdentity,
};
