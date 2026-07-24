/** WS-1:4 — Mandatory architectural readiness gates. */
import { WorkspaceModel } from "./workspaceModel.ts";
import type { WorkspaceValidationDescriptor } from "./workspaceValidationTypes.ts";
const names = Object.freeze(["Identity Integrity", "Registry Alignment", "Model Completeness",
  "Relationship Integrity", "Lifecycle Integrity", "Composition Integrity", "Reference Integrity",
  "Boundary Compliance", "Dependency Isolation", "Inventory Integrity", "Immutability Compliance",
  "Runtime Absence", "UI Absence", "Rendering Absence", "Orchestration Absence",
  "Manifest Readiness"] as const);
export const WorkspaceValidationGates = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-1:4/Gate/${String(index + 1).padStart(2, "0")}`, name,
  description: `${name} must pass before Manifest handoff.`, source: WorkspaceModel,
  mandatory: true, outcome: "Pass", metadataOnly: true, immutable: true,
})) satisfies readonly WorkspaceValidationDescriptor[]);

