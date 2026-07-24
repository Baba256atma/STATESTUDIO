/** WS-3:1 — Immutable Goal Workspace architectural contracts. */
import type { GoalWorkspaceDeclaration } from "./goalWorkspaceIdentity.ts";
const names = Object.freeze(["Goal Workspace", "Goal Object", "Goal Collection", "Goal State",
  "Goal Context", "Goal Ownership", "Goal KPI Mapping", "Goal Timeline", "Goal Assumption",
  "Goal Constraint", "Goal Risk", "Goal Metadata"] as const);
export const GoalWorkspaceContracts = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-3:1/Contract/${String(index + 1).padStart(2, "0")}`, name,
  description: `Declares the canonical ${name} metadata contract.`,
  executable: false, metadataOnly: true, immutable: true,
})) satisfies readonly GoalWorkspaceDeclaration[]);

