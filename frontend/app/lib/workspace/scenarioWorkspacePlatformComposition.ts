/** WS-5:6 — Complete Manifest-derived Platform composition. */
import { ScenarioWorkspaceManifest } from "./scenarioWorkspaceManifest.ts";
import { ScenarioWorkspacePlatformIdentity } from "./scenarioWorkspacePlatformIdentity.ts";

export const ScenarioWorkspacePlatformComposition = Object.freeze({
  manifest: ScenarioWorkspaceManifest,
  platformIdentity: ScenarioWorkspacePlatformIdentity,
  workspaceIdentity:
    ScenarioWorkspaceManifest.inventory.identityInventory.workspaceIdentity,
  responsibilities: ScenarioWorkspaceManifest.inventory.responsibilities,
  capabilities: ScenarioWorkspaceManifest.inventory.capabilities,
  scenarioTypes: ScenarioWorkspaceManifest.inventory.scenarioTypes,
  lifecycleStates: ScenarioWorkspaceManifest.inventory.lifecycle,
  contracts: ScenarioWorkspaceManifest.inventory.contracts,
  domainModels: ScenarioWorkspaceManifest.inventory.domainModels,
  relationships: ScenarioWorkspaceManifest.inventory.relationships,
  compositions: ScenarioWorkspaceManifest.inventory.compositions,
  manifestGuarantees: ScenarioWorkspaceManifest.guarantees,
  manifestReadiness: ScenarioWorkspaceManifest.summary,
  publicApiInventory: ScenarioWorkspaceManifest.publicApi,
  source: ScenarioWorkspaceManifest,
  metadataOnly: true,
  immutable: true,
} as const);
