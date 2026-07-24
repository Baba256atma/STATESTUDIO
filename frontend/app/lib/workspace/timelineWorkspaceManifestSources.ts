/** WS-10:5 — Canonical Validation-reachable dependency chain. */
import { TimelineWorkspaceValidation } from "./timelineWorkspaceValidation.ts";

export const TimelineWorkspaceManifestSources = Object.freeze([
  Object.freeze({
    phaseId: "WS-10:1",
    name: "Timeline Workspace Foundation",
    source: TimelineWorkspaceValidation.foundation,
    order: 1,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    phaseId: "WS-10:2",
    name: "Timeline Workspace Registry",
    source: TimelineWorkspaceValidation.registry,
    order: 2,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    phaseId: "WS-10:3",
    name: "Timeline Workspace Model",
    source: TimelineWorkspaceValidation.model,
    order: 3,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    phaseId: "WS-10:4",
    name: "Timeline Workspace Validation",
    source: TimelineWorkspaceValidation,
    order: 4,
    metadataOnly: true,
    immutable: true,
  }),
] as const);
