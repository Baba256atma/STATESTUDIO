/** WS-8:5 — Canonical Validation-reachable dependency chain. */
import { WarRoomWorkspaceValidation } from "./warRoomWorkspaceValidation.ts";

export const WarRoomWorkspaceManifestSources = Object.freeze([
  Object.freeze({
    phaseId: "WS-8:1",
    name: "War Room Workspace Foundation",
    source: WarRoomWorkspaceValidation.foundation,
    order: 1,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    phaseId: "WS-8:2",
    name: "War Room Workspace Registry",
    source: WarRoomWorkspaceValidation.registry,
    order: 2,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    phaseId: "WS-8:3",
    name: "War Room Workspace Model",
    source: WarRoomWorkspaceValidation.model,
    order: 3,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    phaseId: "WS-8:4",
    name: "War Room Workspace Validation",
    source: WarRoomWorkspaceValidation,
    order: 4,
    metadataOnly: true,
    immutable: true,
  }),
] as const);
