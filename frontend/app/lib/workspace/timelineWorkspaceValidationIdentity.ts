/** WS-10:4 — Canonical immutable Timeline Workspace Validation identity. */
import { TimelineWorkspaceIdentityModel } from "./timelineWorkspaceIdentityModel.ts";

export const TimelineWorkspaceValidationIdentity = Object.freeze({
  id: "WS-10:4/TimelineWorkspaceValidation",
  name: "Timeline Workspace Validation",
  phaseId: "WS-10:4",
  workspace: TimelineWorkspaceIdentityModel.workspace,
  namespace: "nexora.workspace.timeline.validation",
  version: "1.0.0",
  layer: "Workspace Layer",
  status: "ReadyForManifest",
  readiness: "ReadyForManifest",
  sourceModel: TimelineWorkspaceIdentityModel.id,
  metadataOnly: true,
  immutable: true,
} as const);
