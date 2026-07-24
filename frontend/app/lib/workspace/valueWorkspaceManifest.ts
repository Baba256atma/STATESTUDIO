/** WS-9:5 — Canonical Value Workspace Manifest surface. */
import { ValueWorkspaceManifestGuarantees } from "./valueWorkspaceManifestGuarantees.ts";
import { ValueWorkspaceManifestIdentity } from "./valueWorkspaceManifestIdentity.ts";
import { ValueWorkspaceManifestInventory } from "./valueWorkspaceManifestInventory.ts";
import { ValueWorkspaceManifestPublicApi } from "./valueWorkspaceManifestPublicApi.ts";
import { ValueWorkspaceManifestReadiness } from "./valueWorkspaceManifestReadiness.ts";
import { ValueWorkspaceManifestSources } from "./valueWorkspaceManifestSources.ts";
import { ValueWorkspaceValidation } from "./valueWorkspaceValidation.ts";

export const ValueWorkspaceManifest = Object.freeze({
  identity: ValueWorkspaceManifestIdentity,
  validation: ValueWorkspaceValidation,
  sources: ValueWorkspaceManifestSources,
  inventory: ValueWorkspaceManifestInventory,
  guarantees: ValueWorkspaceManifestGuarantees,
  readinessDeclaration: ValueWorkspaceManifestReadiness,
  publicApi: ValueWorkspaceManifestPublicApi,
  summary: Object.freeze({
    workspaceIdentity: ValueWorkspaceValidation.foundation.identity,
    phaseIdentity: ValueWorkspaceManifestIdentity.phaseId,
    canonicalId: ValueWorkspaceManifestIdentity.id,
    namespace: ValueWorkspaceManifestIdentity.namespace,
    version: ValueWorkspaceManifestIdentity.version,
    layer: ValueWorkspaceManifestIdentity.layer,
    status: "ReadyForPlatform",
    readiness: "ReadyForPlatform",
    architectureCompleteness: "Complete",
    inventoryTotals: ValueWorkspaceManifestInventory.inventoryTotals,
  }),
  dependencyChain: ValueWorkspaceManifestSources,
  upstreamDependencies: Object.freeze([
    "WS-9:4 Value Workspace Validation",
  ]),
  publicApiSurface: Object.freeze(["ValueWorkspaceManifest"]),
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
  businessValueCalculation: false,
  roiCalculation: false,
  financialAnalysis: false,
  forecasting: false,
  aiReasoning: false,
  workflowExecution: false,
  persistence: false,
  networking: false,
  rendering: false,
  visualization: false,
  stateManagement: false,
  services: false,
  factories: false,
  businessLogic: false,
} as const);
