/** WS-4:6 — Complete Manifest-derived Platform composition. */
import { DecisionWorkspaceManifest } from "./decisionWorkspaceManifest.ts";
import { DecisionWorkspacePlatformIdentity } from "./decisionWorkspacePlatformIdentity.ts";

export const DecisionWorkspacePlatformComposition = Object.freeze({
  manifest: DecisionWorkspaceManifest,
  platformIdentity: DecisionWorkspacePlatformIdentity,
  workspaceIdentity:
    DecisionWorkspaceManifest.inventory.identityInventory.workspaceIdentity,
  responsibilities: DecisionWorkspaceManifest.inventory.responsibilities,
  capabilities: DecisionWorkspaceManifest.inventory.capabilities,
  decisionTypes: DecisionWorkspaceManifest.inventory.decisionTypes,
  lifecycleStates: DecisionWorkspaceManifest.inventory.lifecycle,
  contracts: DecisionWorkspaceManifest.inventory.contracts,
  domainModels: DecisionWorkspaceManifest.inventory.domainModels,
  relationships: DecisionWorkspaceManifest.inventory.relationships,
  compositions: DecisionWorkspaceManifest.inventory.compositions,
  manifestGuarantees: DecisionWorkspaceManifest.guarantees,
  manifestReadiness: DecisionWorkspaceManifest.summary,
  publicApiInventory: DecisionWorkspaceManifest.publicApi,
  source: DecisionWorkspaceManifest,
  metadataOnly: true,
  immutable: true,
} as const);
