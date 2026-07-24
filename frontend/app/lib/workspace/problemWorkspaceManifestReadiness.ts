/** WS-6:5 — Immutable Manifest publication readiness. */
import { ProblemWorkspaceValidation } from "./problemWorkspaceValidation.ts";

export const ProblemWorkspaceManifestReadiness = Object.freeze({
  readiness: Object.freeze([
    "ReadyForPlatform",
    "ManifestPublished",
  ] as const),
  status: "ReadyForPlatform",
  publicationStatus: "ManifestPublished",
  validationStatus:
    ProblemWorkspaceValidation.summary.validationStatus,
  architectureCompleteness: "Complete",
  source: ProblemWorkspaceValidation,
  runtimeExecution: false,
  metadataOnly: true,
  immutable: true,
} as const);
