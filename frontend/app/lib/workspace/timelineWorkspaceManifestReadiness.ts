/** WS-10:5 — Immutable Manifest readiness declarations. */
import { TimelineWorkspaceValidation } from "./timelineWorkspaceValidation.ts";

export const TimelineWorkspaceManifestReadiness = Object.freeze({
  states: Object.freeze(["ReadyForPlatform", "ManifestPublished"]),
  status: "ReadyForPlatform",
  publicationStatus: "ManifestPublished",
  validationStatus: TimelineWorkspaceValidation.summary.validationStatus,
  architectureCompleteness: "Complete",
  source: TimelineWorkspaceValidation,
  metadataOnly: true,
  immutable: true,
} as const);
