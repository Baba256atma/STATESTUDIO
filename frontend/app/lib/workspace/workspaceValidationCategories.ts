/** WS-1:4 — Canonical validation categories. */
import { WorkspaceModel } from "./workspaceModel.ts";
const names = Object.freeze(["Identity", "Metadata", "Type", "Objective", "Context", "Scope",
  "Lifecycle", "Composition", "Object Collection", "Timeline Reference", "Advisor Reference",
  "Scene Reference", "Navigation Reference", "Layout Reference", "Action Surface",
  "Session Reference", "Permissions", "Configuration", "Capabilities", "Responsibilities",
  "Boundaries", "Relationships", "Inventory Integrity", "Dependency Integrity"] as const);
export const WorkspaceValidationCategories = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-1:4/Category/${String(index + 1).padStart(2, "0")}`, name,
  description: `Validates ${name} architecture metadata.`, source: WorkspaceModel,
  mandatory: true, outcome: "Pass", metadataOnly: true, immutable: true,
})));

