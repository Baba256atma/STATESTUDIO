/** WS-10:3 — Canonical immutable Timeline Workspace Model identity. */
import { TimelineWorkspaceIdentityRegistry } from "./timelineWorkspaceIdentityRegistry.ts";

export const TimelineWorkspaceIdentityModel = Object.freeze({
  id: "WS-10:3/TimelineWorkspaceModel",
  name: "Timeline Workspace Model",
  phaseId: "WS-10:3",
  workspace: TimelineWorkspaceIdentityRegistry.workspace,
  namespace: "nexora.workspace.timeline.model",
  version: "1.0.0",
  layer: "Workspace Layer",
  status: "ReadyForValidation",
  readiness: "ReadyForValidation",
  sourceRegistry: TimelineWorkspaceIdentityRegistry.id,
  metadataOnly: true,
  immutable: true,
} as const);
