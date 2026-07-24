/** WS-5:4 — Canonical ordered validation categories. */
import type { ScenarioWorkspaceValidationRecord } from "./scenarioWorkspaceValidationIdentity.ts";

const names = Object.freeze([
  "Identity Integrity",
  "Registry Integrity",
  "Model Integrity",
  "Relationship Integrity",
  "Composition Integrity",
  "Scenario Type Integrity",
  "Lifecycle Integrity",
  "Responsibility Integrity",
  "Capability Integrity",
  "Contract Integrity",
  "Boundary Integrity",
  "Dependency Integrity",
  "Ordering Integrity",
  "Immutability Integrity",
  "Readiness Integrity",
] as const);

export const ScenarioWorkspaceValidationCategories = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-5:4/Category/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Validates ${name.toLowerCase()} across declared Scenario Workspace metadata.`,
    validationScope: name,
    sourcePhase: "WS-5:4",
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly (ScenarioWorkspaceValidationRecord & {
    readonly validationScope: string;
    readonly sourcePhase: "WS-5:4";
  })[],
);
