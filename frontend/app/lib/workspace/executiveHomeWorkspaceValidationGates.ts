/** WS-2:4 — Mandatory architectural readiness gates. */
import { ExecutiveHomeWorkspaceModel } from "./executiveHomeWorkspaceModel.ts";
import type { ExecutiveHomeValidationDescriptor } from "./executiveHomeWorkspaceValidationTypes.ts";
const names = Object.freeze(["Identity Integrity", "Registry Traceability", "Model Integrity",
  "Executive Overview Integrity", "Dashboard Reference Integrity", "Workspace Launcher Integrity",
  "Executive Card Integrity", "Recommendation Integrity", "Notification Integrity",
  "Relationship Integrity", "Composition Integrity", "Lifecycle Integrity",
  "Boundary Compliance", "Dependency Isolation", "Inventory Integrity",
  "Immutability Compliance", "Runtime Absence", "UI Absence", "Rendering Absence",
  "Manifest Readiness"] as const);
export const ExecutiveHomeWorkspaceValidationGates = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-2:4/Gate/${String(index + 1).padStart(2, "0")}`, name,
  description: `${name} must pass before Manifest handoff.`,
  source: ExecutiveHomeWorkspaceModel, severity: "Critical", mandatory: true,
  outcome: "Pass", metadataOnly: true, immutable: true,
})) satisfies readonly ExecutiveHomeValidationDescriptor[]);

