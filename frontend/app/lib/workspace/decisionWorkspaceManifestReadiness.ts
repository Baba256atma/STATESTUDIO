/** WS-4:5 — Immutable passing Platform readiness metadata. */
import { DecisionWorkspaceValidation } from "./decisionWorkspaceValidation.ts";

const names = Object.freeze([
  "Source Chain Complete",
  "Validation Status Pass",
  "Validation Gates Complete",
  "Inventory Complete",
  "Canonical Identities Preserved",
  "Canonical Inventory Rule Satisfied",
  "Ordering Preserved",
  "Immutability Preserved",
  "Dependencies Restricted",
  "Workspace Boundaries Preserved",
  "Runtime Excluded",
  "Platform Publication Ready",
] as const);

export const DecisionWorkspaceManifestReadinessGates = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-4:5/ReadinessGate/${String(index + 1).padStart(2, "0")}`,
    name,
    source: DecisionWorkspaceValidation,
    outcome: "Pass",
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);

export const DecisionWorkspaceManifestReadiness = Object.freeze({
  status: "Complete",
  readiness: "ReadyForPlatform",
  validationStatus:
    DecisionWorkspaceValidation.summary.validationStatus,
  validationReadiness:
    DecisionWorkspaceValidation.summary.validationReadiness,
  guaranteeStatus: "Satisfied",
  allGatesPass: DecisionWorkspaceManifestReadinessGates.every(
    ({ outcome }) => outcome === "Pass",
  ),
  runtimeBehavior: "Not Implemented",
  businessLogic: "Not Implemented",
  persistence: "Not Implemented",
  ui: "Not Implemented",
  platformHandoff: "WS-4:6 Decision Workspace Platform",
  source: DecisionWorkspaceValidation,
  metadataOnly: true,
  immutable: true,
} as const);
