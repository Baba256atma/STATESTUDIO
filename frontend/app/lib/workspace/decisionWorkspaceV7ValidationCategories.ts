/** WS-7:4 — Canonical ordered validation categories. */
import type { DecisionWorkspaceV7ValidationRecord } from "./decisionWorkspaceV7ValidationIdentity.ts";

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
  "Dependency Integrity",
  "Boundary Integrity",
  "Export Integrity",
  "Metadata Integrity",
  "Architecture Integrity",
  "Workspace Integrity",
] as const);

export const DecisionWorkspaceV7ValidationCategories = Object.freeze(
  names.map((name, index) =>
    Object.freeze({
      id: `WS-7:4/Category/${String(index + 1).padStart(2, "0")}`,
      name,
      description:
        `Validates ${name.toLowerCase()} in Decision Workspace metadata.`,
      order: index + 1,
      metadataOnly: true,
      immutable: true,
    }),
  ) satisfies readonly DecisionWorkspaceV7ValidationRecord[],
);
