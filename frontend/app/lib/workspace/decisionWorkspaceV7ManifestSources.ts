/** WS-7:5 — Canonical Validation-reachable dependency chain. */
import { DecisionWorkspaceV7Validation } from "./decisionWorkspaceV7Validation.ts";

export const DecisionWorkspaceV7ManifestSources = Object.freeze([
  Object.freeze({
    phaseId: "WS-7:1",
    name: "Decision Workspace Foundation",
    identity: DecisionWorkspaceV7Validation.foundation.identity,
    source: DecisionWorkspaceV7Validation.foundation,
    order: 1,
    dependencyRole: "Validation-Reachable Source",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    phaseId: "WS-7:2",
    name: "Decision Workspace Registry",
    identity: DecisionWorkspaceV7Validation.registry.identity,
    source: DecisionWorkspaceV7Validation.registry,
    order: 2,
    dependencyRole: "Validation-Reachable Source",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    phaseId: "WS-7:3",
    name: "Decision Workspace Model",
    identity: DecisionWorkspaceV7Validation.model.identity,
    source: DecisionWorkspaceV7Validation.model,
    order: 3,
    dependencyRole: "Validation-Reachable Source",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    phaseId: "WS-7:4",
    name: "Decision Workspace Validation",
    identity: DecisionWorkspaceV7Validation.identity,
    source: DecisionWorkspaceV7Validation,
    order: 4,
    dependencyRole: "Authoritative Validated Source",
    metadataOnly: true,
    immutable: true,
  }),
] as const);
