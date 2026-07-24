/** WS-3:1 — Declarative capabilities and executive responsibilities. */
import type { GoalWorkspaceDeclaration } from "./goalWorkspaceIdentity.ts";
const capabilityNames = Object.freeze(["Define Goal", "Edit Goal", "Review Goal", "Archive Goal",
  "Organize Goals", "Assign Owners", "Track Progress", "Manage KPI Links",
  "Manage Dependencies", "Manage Assumptions", "Manage Risks", "Manage Constraints"] as const);
const responsibilityNames = Object.freeze(["Goal Definition", "Goal Organization",
  "Goal Refinement", "Goal Prioritization", "Goal Ownership", "Goal Monitoring",
  "Goal Alignment", "Goal Governance", "Goal Review", "Goal Completion"] as const);
export const GoalWorkspaceCapabilities = Object.freeze(capabilityNames.map((name, index) => Object.freeze({
  id: `WS-3:1/Capability/${String(index + 1).padStart(2, "0")}`, name,
  description: `Declares ${name.toLowerCase()} as a non-executable capability.`,
  executable: false, metadataOnly: true, immutable: true,
})) satisfies readonly GoalWorkspaceDeclaration[]);
export const GoalWorkspaceResponsibilities = Object.freeze(
  responsibilityNames.map((name, index) => Object.freeze({
    id: `WS-3:1/Responsibility/${String(index + 1).padStart(2, "0")}`, name,
    description: `Assigns ${name.toLowerCase()} to the Goal Workspace architecture.`,
    executable: false, metadataOnly: true, immutable: true,
  })) satisfies readonly GoalWorkspaceDeclaration[],
);

