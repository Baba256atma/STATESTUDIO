/** WS-3:3 — Declarative Goal composition metadata. */
import type { GoalWorkspaceModelDescriptor } from "./goalWorkspaceIdentityModel.ts";
import { GoalWorkspaceRegistry } from "./goalWorkspaceRegistry.ts";
const names = Object.freeze(["Workspace Composition", "Goal Composition", "KPI Composition",
  "Ownership Composition", "Timeline Composition", "Metadata Composition",
  "Assumption Composition", "Constraint Composition", "Risk Composition"] as const);
export const GoalWorkspaceCompositionModels = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-3:3/Composition/${String(index + 1).padStart(2, "0")}`, name,
  description: `Declares ${name.toLowerCase()} without execution.`,
  source: GoalWorkspaceRegistry, metadataOnly: true, immutable: true,
})) satisfies readonly GoalWorkspaceModelDescriptor[]);

