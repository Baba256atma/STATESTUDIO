/** WS-10:2 — Canonical immutable Timeline Workspace Registry identity. */
import { TimelineWorkspaceIdentity } from "./timelineWorkspaceIdentity.ts";

export const TimelineWorkspaceIdentityRegistry = Object.freeze({
  id: "WS-10:2/TimelineWorkspaceRegistry",
  name: "Timeline Workspace Registry",
  phaseId: "WS-10:2",
  workspace: TimelineWorkspaceIdentity.workspace,
  namespace: "nexora.workspace.timeline.registry",
  version: "1.0.0",
  layer: "Workspace Layer",
  status: "ReadyForModel",
  readiness: "ReadyForModel",
  owner: "Nexora Architecture",
  sourcePhase: TimelineWorkspaceIdentity.id,
  stability: "Stable",
  metadataOnly: true,
  immutable: true,
} as const);
