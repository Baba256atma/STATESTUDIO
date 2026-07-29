/**
 * RTC-1:2 — Executive Context Runtime Registry.
 *
 * Canonical directory of every runtime identity that may participate in an
 * Executive Context. Consumes RTC-1:1 Foundation public surface only.
 * Definitions only — no state, implementation, validation, or rendering.
 *
 * Ownership: owned exclusively by RTC-1:2.
 *
 * Public exports:
 *   ExecutiveContextRuntimeRegistryId
 *   ExecutiveContextRuntimeRegistryVersion
 *   ExecutiveContextRuntimeRegistryName
 *   ExecutiveContextRuntimeRegistryNamespace
 *   ExecutiveContextRuntimeRegistryStatus
 *   ExecutiveContextRuntimeRegistryReadiness
 *   ExecutiveContextRuntimeRegistry
 *   getExecutiveContextRuntimeRegistrySummary()
 */

import { ExecutiveContextRuntimeFoundation } from "./executiveContextRuntimeFoundation.ts";
import { ExecutiveContextRegistry } from "./executiveContextRegistry.ts";
import { ExecutiveObjectRegistry } from "./executiveObjectRegistry.ts";
import { ExecutivePackRegistry } from "./executivePackRegistry.ts";
import {
  ExecutiveAdvisorRegistry,
  ExecutiveCompanyRegistry,
  ExecutiveContextRuntimeRegistryId,
  ExecutiveContextRuntimeRegistryIdentity,
  ExecutiveContextRuntimeRegistryName,
  ExecutiveContextRuntimeRegistryNamespace,
  ExecutiveContextRuntimeRegistryNextPhase,
  ExecutiveContextRuntimeRegistryReadiness,
  ExecutiveContextRuntimeRegistryStatus,
  ExecutiveContextRuntimeRegistryVersion,
  ExecutiveDirectorRegistry,
  ExecutiveJournalRegistry,
  ExecutiveManagerRegistry,
  ExecutiveMetadataRegistry,
  ExecutiveRuntimeRegistryDomains,
  ExecutiveRuntimeRegistryGuarantees,
  ExecutiveRuntimeRegistryMetadata,
  ExecutiveRuntimeRegistryPrinciples,
  ExecutiveRuntimeRegistryProhibitedSurfaces,
  ExecutiveRuntimeRegistryRelationships,
  ExecutiveStageRegistry,
} from "./executiveRuntimeRegistryMetadata.ts";
import { ExecutiveTimelineRegistry } from "./executiveTimelineRegistry.ts";
import { ExecutiveWorkspaceRegistry } from "./executiveWorkspaceRegistry.ts";

export {
  ExecutiveContextRuntimeRegistryId,
  ExecutiveContextRuntimeRegistryName,
  ExecutiveContextRuntimeRegistryNamespace,
  ExecutiveContextRuntimeRegistryReadiness,
  ExecutiveContextRuntimeRegistryStatus,
  ExecutiveContextRuntimeRegistryVersion,
};

const collections = Object.freeze({
  contexts: ExecutiveContextRegistry,
  managers: ExecutiveManagerRegistry,
  companies: ExecutiveCompanyRegistry,
  workspaces: ExecutiveWorkspaceRegistry,
  packs: ExecutivePackRegistry,
  objects: ExecutiveObjectRegistry,
  timelines: ExecutiveTimelineRegistry,
  journals: ExecutiveJournalRegistry,
  advisors: ExecutiveAdvisorRegistry,
  directors: ExecutiveDirectorRegistry,
  stages: ExecutiveStageRegistry,
  metadataCategories: ExecutiveMetadataRegistry,
});

const allEntries = Object.freeze([
  ...collections.contexts,
  ...collections.managers,
  ...collections.companies,
  ...collections.workspaces,
  ...collections.packs,
  ...collections.objects,
  ...collections.timelines,
  ...collections.journals,
  ...collections.advisors,
  ...collections.directors,
  ...collections.stages,
  ...collections.metadataCategories,
]);

/**
 * Canonical immutable Executive Context Runtime Registry aggregate.
 */
export const ExecutiveContextRuntimeRegistry = Object.freeze({
  identity: ExecutiveContextRuntimeRegistryIdentity,
  foundation: ExecutiveContextRuntimeFoundation,
  metadata: ExecutiveRuntimeRegistryMetadata,
  domains: ExecutiveRuntimeRegistryDomains,
  contexts: ExecutiveContextRegistry,
  managers: ExecutiveManagerRegistry,
  companies: ExecutiveCompanyRegistry,
  workspaces: ExecutiveWorkspaceRegistry,
  packs: ExecutivePackRegistry,
  objects: ExecutiveObjectRegistry,
  timelines: ExecutiveTimelineRegistry,
  journals: ExecutiveJournalRegistry,
  advisors: ExecutiveAdvisorRegistry,
  directors: ExecutiveDirectorRegistry,
  stages: ExecutiveStageRegistry,
  metadataCategories: ExecutiveMetadataRegistry,
  principles: ExecutiveRuntimeRegistryPrinciples,
  guarantees: ExecutiveRuntimeRegistryGuarantees,
  relationships: ExecutiveRuntimeRegistryRelationships,
  prohibitedSurfaces: ExecutiveRuntimeRegistryProhibitedSurfaces,
  entries: allEntries,
  collections,
  statistics: Object.freeze({
    domainCount: ExecutiveRuntimeRegistryDomains.length,
    collectionCount: Object.keys(collections).length,
    entryCount: allEntries.length,
    contextCount: collections.contexts.length,
    managerCount: collections.managers.length,
    companyCount: collections.companies.length,
    workspaceCount: collections.workspaces.length,
    packCount: collections.packs.length,
    objectCount: collections.objects.length,
    timelineCount: collections.timelines.length,
    journalCount: collections.journals.length,
    advisorCount: collections.advisors.length,
    directorCount: collections.directors.length,
    stageCount: collections.stages.length,
    metadataCategoryCount: collections.metadataCategories.length,
    relationshipCount: ExecutiveRuntimeRegistryRelationships.length,
    principleCount: ExecutiveRuntimeRegistryPrinciples.length,
    guaranteeCount: ExecutiveRuntimeRegistryGuarantees.length,
  }),
  upstreamDependencies: Object.freeze([
    "RTC-1:1 — Executive Context Runtime Foundation",
  ]),
  status: ExecutiveContextRuntimeRegistryStatus,
  readiness: ExecutiveContextRuntimeRegistryReadiness,
  nextPhase: ExecutiveContextRuntimeRegistryNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  storesRuntimeValues: false as const,
  holdsActiveContext: false as const,
  executesTransitions: false as const,
  performsValidation: false as const,
  executesLifecycle: false as const,
  modifiesState: false as const,
  communicatesWithUi: false as const,
  renderingBehavior: false as const,
  processesTimeline: false as const,
  businessLogicBehavior: false as const,
  aiReasoningBehavior: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  modelPhase: false as const,
  validationPhase: false as const,
  manifestPhase: false as const,
  platformPhase: false as const,
} as const);

/** Deterministic frozen Registry summary. */
export function getExecutiveContextRuntimeRegistrySummary() {
  return Object.freeze({
    registryId: ExecutiveContextRuntimeRegistryId,
    version: ExecutiveContextRuntimeRegistryVersion,
    name: ExecutiveContextRuntimeRegistryName,
    namespace: ExecutiveContextRuntimeRegistryNamespace,
    status: ExecutiveContextRuntimeRegistryStatus,
    readiness: ExecutiveContextRuntimeRegistryReadiness,
    domainCount: ExecutiveRuntimeRegistryDomains.length,
    entryCount: allEntries.length,
    contextCount: collections.contexts.length,
    workspaceCount: collections.workspaces.length,
    packCount: collections.packs.length,
    objectCount: collections.objects.length,
    timelineCount: collections.timelines.length,
    relationshipCount: ExecutiveRuntimeRegistryRelationships.length,
    nextPhase: ExecutiveContextRuntimeRegistryNextPhase,
    sourceFoundation: ExecutiveContextRuntimeRegistryIdentity.sourceFoundation,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveContextRuntimeRegistry = () =>
  ExecutiveContextRuntimeRegistry;
