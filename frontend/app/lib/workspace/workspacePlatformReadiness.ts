/** WS-1:6 — Derived inventory and Certification readiness. */
import { WorkspaceManifest } from "./workspaceManifest.ts";
import { WorkspacePlatformCapabilities } from "./workspacePlatformCapabilities.ts";
import { WorkspacePlatformCompatibility } from "./workspacePlatformCompatibility.ts";
import { WorkspacePlatformGuarantees } from "./workspacePlatformGuarantees.ts";
const inventory = WorkspaceManifest.inventory;
export const WorkspacePlatformInventory = Object.freeze({
  workspaceTypeCount: inventory.workspaceTypes.length, contractCount: inventory.contracts.length,
  capabilityCount: inventory.capabilities.length, responsibilityCount: inventory.responsibilities.length,
  lifecycleCount: inventory.lifecycle.length, boundaryCount: inventory.boundaries.length,
  terminologyCount: inventory.terminology.length, domainModelCount: inventory.domainModels.length,
  relationshipCount: inventory.relationships.length, compositionCount: inventory.compositions.length,
  validationCategoryCount: inventory.validationCategories.length,
  validationRuleCount: inventory.validationRules.length, validationGateCount: inventory.validationGates.length,
  guaranteeCount: WorkspacePlatformGuarantees.length,
  compatibilityCount: WorkspacePlatformCompatibility.length,
  extensionCount: WorkspaceManifest.extensions.length,
  platformCapabilityCount: WorkspacePlatformCapabilities.length,
  source: WorkspaceManifest, derived: true, immutable: true,
} as const);
export const WorkspacePlatformReadiness = Object.freeze({
  status: "ReadyForCertification", manifestReady: WorkspaceManifest.readiness.platformHandoffValid,
  inventory: WorkspacePlatformInventory, certificationTarget: "WS-1:7 Workspace Certification",
  metadataOnly: true, immutable: true,
} as const);

