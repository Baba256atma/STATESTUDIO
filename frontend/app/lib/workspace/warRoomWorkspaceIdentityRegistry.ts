/** WS-8:2 — Canonical War Room Workspace Registry identity. */
import { WarRoomWorkspaceFoundation } from "./warRoomWorkspaceFoundation.ts";

export const WarRoomWorkspaceIdentityRegistry = Object.freeze({
  id: "WS-8:2/WarRoomWorkspaceRegistry",
  key: "war-room-workspace-registry",
  name: "War Room Workspace Registry",
  phaseId: "WS-8:2",
  namespace: "nexora.workspace.war-room.registry",
  version: "1.0.0",
  layer: "Workspace Layer",
  status: "ReadyForModel",
  readiness: "ReadyForModel",
  source: WarRoomWorkspaceFoundation.identity,
  metadataOnly: true,
  immutable: true,
} as const);
