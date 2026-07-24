/** WS-8:3 — Canonical War Room Workspace Model identity. */
import { WarRoomWorkspaceFoundation } from "./warRoomWorkspaceFoundation.ts";
import { WarRoomWorkspaceRegistry } from "./warRoomWorkspaceRegistry.ts";

export interface WarRoomWorkspaceModelDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly source: unknown;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const WarRoomWorkspaceIdentityModel = Object.freeze({
  id: "WS-8:3/WarRoomWorkspaceModel",
  name: "War Room Workspace Model",
  phaseId: "WS-8:3",
  namespace: "nexora.workspace.war-room.model",
  version: "1.0.0",
  layer: "Workspace Layer",
  status: "ReadyForValidation",
  readiness: "ReadyForValidation",
  foundationIdentity: WarRoomWorkspaceFoundation.identity,
  registryIdentity: WarRoomWorkspaceRegistry.identity,
  metadataOnly: true,
  immutable: true,
} as const);
