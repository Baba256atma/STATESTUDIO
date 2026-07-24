/** WS-8:5 — Immutable Manifest readiness declarations. */
import { WarRoomWorkspaceValidation } from "./warRoomWorkspaceValidation.ts";

export const WarRoomWorkspaceManifestReadiness = Object.freeze({
  states: Object.freeze(["ReadyForPlatform", "ManifestPublished"]),
  status: "ReadyForPlatform",
  publicationStatus: "ManifestPublished",
  validationStatus: WarRoomWorkspaceValidation.summary.validationStatus,
  architectureCompleteness: "Complete",
  source: WarRoomWorkspaceValidation,
  metadataOnly: true,
  immutable: true,
} as const);
