/** WS-5:4 — Immutable passing readiness gates. */
import { ScenarioWorkspaceValidationRules } from "./scenarioWorkspaceValidationRules.ts";

const names = Object.freeze([
  "Foundation Completeness",
  "Registry Completeness",
  "Model Completeness",
  "Identity Integrity",
  "Scenario Type Completeness",
  "Lifecycle Completeness",
  "Responsibility Completeness",
  "Capability Completeness",
  "Contract Completeness",
  "Relationship Integrity",
  "Boundary Compliance",
  "Dependency Compliance",
  "Immutability",
  "Ordering Integrity",
  "Manifest Readiness",
] as const);

export const ScenarioWorkspaceValidationGates = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-5:4/Gate/${String(index + 1).padStart(2, "0")}`,
    name: `${name} Gate`,
    validationCategory: name,
    requiredRules: ScenarioWorkspaceValidationRules,
    expectedOutcome: "Pass",
    outcome: "Pass",
    failureSeverity: "Critical",
    readinessImpact: "Blocks ReadyForManifest on failure",
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
