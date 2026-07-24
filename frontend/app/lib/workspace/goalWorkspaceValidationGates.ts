/** WS-3:4 — Immutable passing readiness gates. */
import { GoalWorkspaceValidationRules } from "./goalWorkspaceValidationRules.ts";
const names = Object.freeze(["Foundation Completeness", "Registry Completeness",
  "Model Completeness", "Identity Uniqueness", "Goal Type Completeness",
  "Lifecycle Completeness", "Responsibility Completeness", "Capability Completeness",
  "Contract Completeness", "Relationship Integrity", "Composition Integrity",
  "Boundary Compliance", "Dependency Compliance", "Immutability",
  "Deterministic Ordering", "Manifest Readiness"] as const);
export const GoalWorkspaceValidationGates = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-3:4/Gate/${String(index + 1).padStart(2, "0")}`, name: `${name} Gate`,
  validationCategory: name, requiredRules: GoalWorkspaceValidationRules,
  expectedOutcome: "Pass", outcome: "Pass", failureSeverity: "Critical",
  readinessImpact: "Blocks ReadyForManifest on failure", order: index + 1,
  metadataOnly: true, immutable: true,
})));

