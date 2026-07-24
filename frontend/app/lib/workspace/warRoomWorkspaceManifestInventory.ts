/** WS-8:5 — Inventories referenced exclusively from validated metadata. */
import { WarRoomWorkspaceValidation } from "./warRoomWorkspaceValidation.ts";

const foundation = WarRoomWorkspaceValidation.foundation;
const registry = WarRoomWorkspaceValidation.registry;
const model = WarRoomWorkspaceValidation.model;

export const WarRoomWorkspaceManifestInventory = Object.freeze({
  foundationInventory: foundation.inventory,
  registryInventory: registry.inventory,
  modelInventory: model.modelRegistry,
  validationInventory: WarRoomWorkspaceValidation.summary,
  contractInventory: foundation.contracts,
  capabilityInventory: registry.capabilities,
  responsibilityInventory: registry.responsibilities,
  operationalCategoryInventory: registry.taxonomy.operationalCategories,
  operationalStatusInventory: registry.taxonomy.operationalStatuses,
  alertTypeInventory: registry.taxonomy.alertTypes,
  eventTypeInventory: registry.events,
  incidentTypeInventory: registry.incidents,
  coordinationTypeInventory: registry.coordination,
  monitoringDomainInventory: registry.monitoringDomains,
  relationshipInventory: model.relationships,
  lifecycleInventory: registry.lifecycle,
  boundaryInventory: registry.boundaries,
  exportInventory: Object.freeze({
    foundation: foundation.publicApiSurface,
    registry: registry.publicApiSurface,
    model: model.publicApiSurface,
    validation: WarRoomWorkspaceValidation.publicApiSurface,
  }),
  dependencyInventory: WarRoomWorkspaceValidation.upstreamDependencies,
  inventoryTotals: Object.freeze({
    foundation: foundation.inventory,
    registry: registry.inventory,
    model: model.modelRegistry,
    validation: WarRoomWorkspaceValidation.summary,
  }),
  source: WarRoomWorkspaceValidation,
  canonicalInventoryRule: "Validated References Only",
  duplicatedValues: false,
  manuallyRedefinedTotals: false,
  recalculatedValues: false,
  introducedMetadata: false,
  modifiedMetadata: false,
  metadataOnly: true,
  immutable: true,
} as const);
