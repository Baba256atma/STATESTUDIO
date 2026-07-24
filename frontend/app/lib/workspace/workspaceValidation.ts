/** WS-1:4 — Canonical metadata-only Validation surface for Manifest. */
import { WorkspaceModel } from "./workspaceModel.ts";
import { WorkspaceValidationCategories } from "./workspaceValidationCategories.ts";
import { WorkspaceValidationGates } from "./workspaceValidationGates.ts";
import { WorkspaceValidationInventory } from "./workspaceValidationInventory.ts";
import { WorkspaceValidationOutcomes, WorkspaceValidationResultModels,
  WorkspaceValidationSeverities } from "./workspaceValidationOutcomes.ts";
import { WorkspaceValidationRules } from "./workspaceValidationRules.ts";
export const WorkspaceValidation = Object.freeze({
  identity: Object.freeze({ id: "WS-1:4/WorkspaceValidation", name: "Workspace Validation",
    layer: "Workspace", phase: "1:4", version: "1.0.0", status: "ReadyForManifest",
    namespace: "nexora.workspace.validation" }),
  model: WorkspaceModel, categories: WorkspaceValidationCategories, rules: WorkspaceValidationRules,
  gates: WorkspaceValidationGates, outcomes: WorkspaceValidationOutcomes,
  severities: WorkspaceValidationSeverities, resultModels: WorkspaceValidationResultModels,
  report: Object.freeze({ outcome: "Pass", mandatoryGatesPassed: true,
    findingCount: 0, readiness: "ReadyForManifest", immutable: true }),
  inventory: WorkspaceValidationInventory, readiness: "ReadyForManifest",
  upstreamDependencies: Object.freeze(["WS-1:3 Workspace Model"]),
  publicApiSurface: Object.freeze(["WorkspaceValidation"]),
  metadataOnly: true, immutable: true, deterministic: true, synchronous: true,
  runtimeValidation: false, externalSideEffects: false, uiValidation: false,
} as const);

