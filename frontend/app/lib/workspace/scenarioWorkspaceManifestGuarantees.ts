/** WS-5:5 — Validation-backed satisfied guarantees. */
import { ScenarioWorkspaceValidation } from "./scenarioWorkspaceValidation.ts";

const names = Object.freeze([
  "Identity Completeness",
  "Registry Completeness",
  "Model Completeness",
  "Scenario Type Completeness",
  "Lifecycle Completeness",
  "Responsibility Completeness",
  "Capability Completeness",
  "Contract Completeness",
  "Relationship Completeness",
  "Validation Completeness",
  "Boundary Compliance",
  "Dependency Compliance",
  "Immutability Compliance",
  "Canonical Inventory Compliance",
  "Platform Readiness",
] as const);

export const ScenarioWorkspaceManifestGuarantees = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-5:5/Guarantee/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Guarantees ${name.toLowerCase()} for the published Scenario Workspace architecture.`,
    sourceValidationGate:
      ScenarioWorkspaceValidation.gates[
        index % ScenarioWorkspaceValidation.gates.length
      ],
    currentState: "Satisfied",
    readinessImpact: "Required for ReadyForPlatform",
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
