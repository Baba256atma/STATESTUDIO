/** WS-1:4 — Dynamically derived validation inventory. */
import { WorkspaceValidationCategories } from "./workspaceValidationCategories.ts";
import { WorkspaceValidationGates } from "./workspaceValidationGates.ts";
import { WorkspaceValidationOutcomes, WorkspaceValidationResultModels,
  WorkspaceValidationSeverities } from "./workspaceValidationOutcomes.ts";
import { WorkspaceValidationRules } from "./workspaceValidationRules.ts";
export const WorkspaceValidationInventory = Object.freeze({
  categoryCount: WorkspaceValidationCategories.length, ruleCount: WorkspaceValidationRules.length,
  gateCount: WorkspaceValidationGates.length, outcomeCount: WorkspaceValidationOutcomes.length,
  severityCount: WorkspaceValidationSeverities.length,
  resultModelCount: WorkspaceValidationResultModels.length,
  totalCount: WorkspaceValidationCategories.length + WorkspaceValidationRules.length
    + WorkspaceValidationGates.length + WorkspaceValidationOutcomes.length
    + WorkspaceValidationSeverities.length + WorkspaceValidationResultModels.length,
  derived: true, immutable: true,
} as const);

