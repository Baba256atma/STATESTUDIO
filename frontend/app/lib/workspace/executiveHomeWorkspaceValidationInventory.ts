/** WS-2:4 — Dynamically derived validation inventory. */
import { ExecutiveHomeWorkspaceModel } from "./executiveHomeWorkspaceModel.ts";
import { ExecutiveHomeWorkspaceValidationCategories } from "./executiveHomeWorkspaceValidationCategories.ts";
import { ExecutiveHomeWorkspaceValidationGates } from "./executiveHomeWorkspaceValidationGates.ts";
import { ExecutiveHomeWorkspaceValidationOutcomes,
  ExecutiveHomeWorkspaceValidationResultModels,
  ExecutiveHomeWorkspaceValidationSeverities } from "./executiveHomeWorkspaceValidationOutcomes.ts";
import { ExecutiveHomeWorkspaceValidationRules } from "./executiveHomeWorkspaceValidationRules.ts";
export const ExecutiveHomeWorkspaceValidationInventory = Object.freeze({
  modelInventory: ExecutiveHomeWorkspaceModel.inventory,
  categoryCount: ExecutiveHomeWorkspaceValidationCategories.length,
  ruleCount: ExecutiveHomeWorkspaceValidationRules.length,
  gateCount: ExecutiveHomeWorkspaceValidationGates.length,
  outcomeCount: ExecutiveHomeWorkspaceValidationOutcomes.length,
  severityCount: ExecutiveHomeWorkspaceValidationSeverities.length,
  resultModelCount: ExecutiveHomeWorkspaceValidationResultModels.length,
  totalValidationEntryCount: ExecutiveHomeWorkspaceValidationCategories.length
    + ExecutiveHomeWorkspaceValidationRules.length
    + ExecutiveHomeWorkspaceValidationGates.length
    + ExecutiveHomeWorkspaceValidationOutcomes.length
    + ExecutiveHomeWorkspaceValidationSeverities.length
    + ExecutiveHomeWorkspaceValidationResultModels.length,
  source: ExecutiveHomeWorkspaceModel, derived: true, deterministic: true, immutable: true,
} as const);

