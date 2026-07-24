/** WS-3:4 — Canonical ordered validation categories. */
import type { GoalWorkspaceValidationRecord } from "./goalWorkspaceValidationIdentity.ts";
const names = Object.freeze(["Identity Integrity", "Registry Integrity", "Model Integrity",
  "Relationship Integrity", "Composition Integrity", "Goal Type Integrity",
  "Lifecycle Integrity", "Responsibility Integrity", "Capability Integrity",
  "Contract Integrity", "Boundary Integrity", "Dependency Integrity", "Ordering Integrity",
  "Immutability Integrity", "Readiness Integrity"] as const);
export const GoalWorkspaceValidationCategories = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-3:4/Category/${String(index + 1).padStart(2, "0")}`, name,
  description: `Validates ${name.toLowerCase()} across declared Goal Workspace metadata.`,
  validationScope: name, sourcePhase: "WS-3:4", order: index + 1,
  metadataOnly: true, immutable: true,
})) satisfies readonly (GoalWorkspaceValidationRecord & {
  readonly validationScope: string; readonly sourcePhase: "WS-3:4";
})[]);

