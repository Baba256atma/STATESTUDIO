/** WS-7:5 — Immutable Manifest readiness declarations. */
import { DecisionWorkspaceV7Validation } from "./decisionWorkspaceV7Validation.ts";

export const DecisionWorkspaceV7ManifestReadiness = Object.freeze({
  states: Object.freeze(["ReadyForPlatform", "ManifestPublished"]),
  status: "ReadyForPlatform",
  publicationStatus: "ManifestPublished",
  validationStatus: DecisionWorkspaceV7Validation.summary.validationStatus,
  architectureCompleteness: "Complete",
  source: DecisionWorkspaceV7Validation,
  metadataOnly: true,
  immutable: true,
} as const);
