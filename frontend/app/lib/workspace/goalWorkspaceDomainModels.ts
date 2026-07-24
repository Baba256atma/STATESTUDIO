/** WS-3:3 — Canonical Goal domain models. */
import type { GoalWorkspaceModelDescriptor } from "./goalWorkspaceIdentityModel.ts";
import { GoalWorkspaceRegistry } from "./goalWorkspaceRegistry.ts";
const names = Object.freeze(["Goal Workspace Model", "Goal Model", "Goal Collection Model",
  "Goal Context Model", "Goal Ownership Model", "Goal KPI Model", "Goal Timeline Model",
  "Goal Assumption Model", "Goal Constraint Model", "Goal Risk Model", "Goal Metadata Model",
  "Goal State Model"] as const);
export const GoalWorkspaceDomainModels = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-3:3/DomainModel/${String(index + 1).padStart(2, "0")}`, name,
  description: `Defines the structural ${name} metadata.`,
  source: GoalWorkspaceRegistry, metadataOnly: true, immutable: true,
})) satisfies readonly GoalWorkspaceModelDescriptor[]);

