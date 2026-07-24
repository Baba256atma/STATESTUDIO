/** WS-6:4 — Canonical ordered validation categories. */
import type { ProblemWorkspaceValidationRecord } from "./problemWorkspaceValidationIdentity.ts";

const names = Object.freeze([
  "Foundation Integrity",
  "Registry Integrity",
  "Model Integrity",
  "Identity Integrity",
  "Namespace Integrity",
  "Contract Integrity",
  "Capability Integrity",
  "Responsibility Integrity",
  "Lifecycle Integrity",
  "Relationship Integrity",
  "Boundary Integrity",
  "Dependency Integrity",
  "Export Integrity",
  "Metadata Integrity",
  "Architecture Integrity",
  "Workspace Integrity",
] as const);

export const ProblemWorkspaceValidationCategories = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-6:4/Category/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Validates ${name.toLowerCase()} in Problem Workspace metadata.`,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly ProblemWorkspaceValidationRecord[],
);
