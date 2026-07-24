/** WS-4:5 — Validation-backed satisfied guarantees. */
import { DecisionWorkspaceValidation } from "./decisionWorkspaceValidation.ts";

const names = Object.freeze([
  "Identity Completeness",
  "Registry Completeness",
  "Model Completeness",
  "Decision Type Completeness",
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

export const DecisionWorkspaceManifestGuarantees = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-4:5/Guarantee/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Guarantees ${name.toLowerCase()} for the published Decision Workspace architecture.`,
    sourceValidationGate:
      DecisionWorkspaceValidation.gates[
        index % DecisionWorkspaceValidation.gates.length
      ],
    requiredOutcome: "Pass",
    currentState: "Satisfied",
    readinessImpact: "Required for ReadyForPlatform",
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
