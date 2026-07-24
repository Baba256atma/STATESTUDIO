/** WS-10:5 — Inventories referenced exclusively from validated metadata. */
import { TimelineWorkspaceValidation } from "./timelineWorkspaceValidation.ts";

const foundation = TimelineWorkspaceValidation.foundation;
const registry = TimelineWorkspaceValidation.registry;
const model = TimelineWorkspaceValidation.model;

export const TimelineWorkspaceManifestInventory = Object.freeze({
  foundationInventory: foundation.inventory,
  registryInventory: registry.inventory,
  modelInventory: model.modelRegistry,
  validationInventory: TimelineWorkspaceValidation.summary,
  contractInventory: foundation.contracts,
  capabilityInventory: registry.capabilities,
  responsibilityInventory: registry.responsibilities,
  timelineEventInventory: registry.eventCategories,
  historicalRecordInventory: registry.recordTypes,
  executiveMilestoneInventory: registry.eventCategories,
  workspaceTransitionInventory: registry.transitionTypes,
  timelineGranularityInventory: registry.granularities,
  timelineStatusInventory: registry.statusTypes,
  historicalReferenceInventory: registry.historicalReferenceTypes,
  businessChronologyInventory: model.compositions[5],
  relationshipInventory: model.relationships,
  lifecycleInventory: registry.lifecycle,
  boundaryInventory: registry.boundaries,
  exportInventory: Object.freeze({
    foundation: foundation.publicApiSurface,
    registry: registry.publicApiSurface,
    model: model.publicApiSurface,
    validation: TimelineWorkspaceValidation.publicApiSurface,
  }),
  dependencyInventory: TimelineWorkspaceValidation.upstreamDependencies,
  inventoryTotals: Object.freeze({
    foundation: foundation.inventory,
    registry: registry.inventory,
    model: model.modelRegistry,
    validation: TimelineWorkspaceValidation.summary,
  }),
  source: TimelineWorkspaceValidation,
  canonicalInventoryRule: "Validated References Only",
  duplicatedValues: false,
  manuallyRedefinedTotals: false,
  recalculatedValues: false,
  introducedMetadata: false,
  modifiedMetadata: false,
  metadataOnly: true,
  immutable: true,
} as const);
