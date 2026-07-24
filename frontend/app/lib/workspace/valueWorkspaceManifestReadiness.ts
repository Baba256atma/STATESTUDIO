/** WS-9:5 — Immutable Manifest readiness declarations. */
import { ValueWorkspaceValidation } from "./valueWorkspaceValidation.ts";

export const ValueWorkspaceManifestReadiness = Object.freeze({
  states: Object.freeze(["ReadyForPlatform", "ManifestPublished"]),
  status: "ReadyForPlatform",
  publicationStatus: "ManifestPublished",
  validationStatus: ValueWorkspaceValidation.summary.validationStatus,
  architectureCompleteness: "Complete",
  source: ValueWorkspaceValidation,
  metadataOnly: true,
  immutable: true,
} as const);
