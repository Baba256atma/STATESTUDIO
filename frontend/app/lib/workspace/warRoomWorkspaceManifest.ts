/** WS-8:5 — Canonical War Room Workspace Manifest surface. */
import { WarRoomWorkspaceManifestGuarantees } from "./warRoomWorkspaceManifestGuarantees.ts";
import { WarRoomWorkspaceManifestIdentity } from "./warRoomWorkspaceManifestIdentity.ts";
import { WarRoomWorkspaceManifestInventory } from "./warRoomWorkspaceManifestInventory.ts";
import { WarRoomWorkspaceManifestPublicApi } from "./warRoomWorkspaceManifestPublicApi.ts";
import { WarRoomWorkspaceManifestReadiness } from "./warRoomWorkspaceManifestReadiness.ts";
import { WarRoomWorkspaceManifestSources } from "./warRoomWorkspaceManifestSources.ts";
import { WarRoomWorkspaceValidation } from "./warRoomWorkspaceValidation.ts";

export const WarRoomWorkspaceManifest = Object.freeze({
  identity: WarRoomWorkspaceManifestIdentity,
  validation: WarRoomWorkspaceValidation,
  sources: WarRoomWorkspaceManifestSources,
  inventory: WarRoomWorkspaceManifestInventory,
  guarantees: WarRoomWorkspaceManifestGuarantees,
  readinessDeclaration: WarRoomWorkspaceManifestReadiness,
  publicApi: WarRoomWorkspaceManifestPublicApi,
  summary: Object.freeze({
    workspaceIdentity: WarRoomWorkspaceValidation.foundation.identity,
    phaseIdentity: WarRoomWorkspaceManifestIdentity.phaseId,
    canonicalId: WarRoomWorkspaceManifestIdentity.id,
    namespace: WarRoomWorkspaceManifestIdentity.namespace,
    version: WarRoomWorkspaceManifestIdentity.version,
    layer: WarRoomWorkspaceManifestIdentity.layer,
    status: "ReadyForPlatform",
    readiness: "ReadyForPlatform",
    architectureCompleteness: "Complete",
    inventoryTotals: WarRoomWorkspaceManifestInventory.inventoryTotals,
  }),
  dependencyChain: WarRoomWorkspaceManifestSources,
  upstreamDependencies: Object.freeze([
    "WS-8:4 War Room Workspace Validation",
  ]),
  publicApiSurface: Object.freeze(["WarRoomWorkspaceManifest"]),
  canonicalInventoryRuleSatisfied: true,
  status: "ReadyForPlatform",
  readiness: "ReadyForPlatform",
  publicationStatus: "ManifestPublished",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  inventoryCalculators: false,
  validationEngine: false,
  liveMonitoring: false,
  workflowOrchestration: false,
  aiReasoning: false,
  eventProcessing: false,
  incidentManagement: false,
  persistence: false,
  networking: false,
  rendering: false,
  visualization: false,
  stateManagement: false,
  services: false,
  factories: false,
  businessLogic: false,
} as const);
