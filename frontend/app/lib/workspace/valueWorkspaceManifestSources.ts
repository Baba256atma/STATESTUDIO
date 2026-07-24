/** WS-9:5 — Canonical Validation-reachable dependency chain. */
import { ValueWorkspaceValidation } from "./valueWorkspaceValidation.ts";

export const ValueWorkspaceManifestSources = Object.freeze([
  Object.freeze({
    phaseId: "WS-9:1",
    name: "Value Workspace Foundation",
    source: ValueWorkspaceValidation.foundation,
    order: 1,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    phaseId: "WS-9:2",
    name: "Value Workspace Registry",
    source: ValueWorkspaceValidation.registry,
    order: 2,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    phaseId: "WS-9:3",
    name: "Value Workspace Model",
    source: ValueWorkspaceValidation.model,
    order: 3,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    phaseId: "WS-9:4",
    name: "Value Workspace Validation",
    source: ValueWorkspaceValidation,
    order: 4,
    metadataOnly: true,
    immutable: true,
  }),
] as const);
