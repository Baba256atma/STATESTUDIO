/** WS-3:6 — Complete Manifest-derived Platform composition. */
import { GoalWorkspaceManifest } from "./goalWorkspaceManifest.ts";
export const GoalWorkspacePlatformComposition = Object.freeze({
  manifest: GoalWorkspaceManifest,
  workspaceIdentity: GoalWorkspaceManifest.inventory.identities[0],
  responsibilities: GoalWorkspaceManifest.inventory.responsibilities,
  capabilities: GoalWorkspaceManifest.inventory.capabilities,
  goalTypes: GoalWorkspaceManifest.inventory.goalTypes,
  lifecycleStates: GoalWorkspaceManifest.inventory.lifecycle,
  contracts: GoalWorkspaceManifest.inventory.contracts,
  domainModels: GoalWorkspaceManifest.inventory.domainModels,
  relationships: GoalWorkspaceManifest.inventory.relationships,
  compositions: GoalWorkspaceManifest.inventory.compositions,
  manifestGuarantees: GoalWorkspaceManifest.guarantees,
  manifestReadiness: GoalWorkspaceManifest.summary,
  publicApiInventory: GoalWorkspaceManifest.publicApi,
  source: GoalWorkspaceManifest, metadataOnly: true, immutable: true,
} as const);

