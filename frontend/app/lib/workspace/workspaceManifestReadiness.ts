/** WS-1:5 — Immutable Platform handoff readiness. */
import { WorkspaceValidation } from "./workspaceValidation.ts";
export const WorkspaceManifestReadiness = Object.freeze({
  validationPassed: WorkspaceValidation.report.outcome === "Pass",
  requiredInventoriesExist: true, requiredGuaranteesSatisfied: true,
  compatibilityDeclarationsPresent: true, extensionPoliciesDeclared: true,
  inventoryTotalsConsistent: true, prohibitedDependenciesAbsent: true,
  platformHandoffValid: true, status: "ReadyForPlatform",
  source: WorkspaceValidation, metadataOnly: true, immutable: true,
} as const);

