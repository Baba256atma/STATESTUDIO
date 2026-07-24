/** WS-4:4 — Canonical ordered validation categories. */
import type { DecisionWorkspaceValidationRecord } from "./decisionWorkspaceValidationIdentity.ts";

const names = Object.freeze([
  "Identity Integrity",
  "Registry Integrity",
  "Model Integrity",
  "Relationship Integrity",
  "Composition Integrity",
  "Decision Type Integrity",
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

export const DecisionWorkspaceValidationCategories = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-4:4/Category/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Validates ${name.toLowerCase()} across declared Decision Workspace metadata.`,
    validationScope: name,
    sourcePhase: "WS-4:4",
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly (DecisionWorkspaceValidationRecord & {
    readonly validationScope: string;
    readonly sourcePhase: "WS-4:4";
  })[],
);
