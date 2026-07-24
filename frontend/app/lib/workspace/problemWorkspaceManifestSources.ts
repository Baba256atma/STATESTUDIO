/** WS-6:5 — Canonical Validation-reachable dependency chain. */
import { ProblemWorkspaceValidation } from "./problemWorkspaceValidation.ts";

export const ProblemWorkspaceManifestSources = Object.freeze([
  Object.freeze({
    phaseId: "WS-6:1",
    name: "Problem Workspace Foundation",
    identity: ProblemWorkspaceValidation.foundation.identity,
    source: ProblemWorkspaceValidation.foundation,
    order: 1,
    dependencyRole: "Validation-Reachable Source",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    phaseId: "WS-6:2",
    name: "Problem Workspace Registry",
    identity: ProblemWorkspaceValidation.registry.identity,
    source: ProblemWorkspaceValidation.registry,
    order: 2,
    dependencyRole: "Validation-Reachable Source",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    phaseId: "WS-6:3",
    name: "Problem Workspace Model",
    identity: ProblemWorkspaceValidation.model.identity,
    source: ProblemWorkspaceValidation.model,
    order: 3,
    dependencyRole: "Validation-Reachable Source",
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    phaseId: "WS-6:4",
    name: "Problem Workspace Validation",
    identity: ProblemWorkspaceValidation.identity,
    source: ProblemWorkspaceValidation,
    order: 4,
    dependencyRole: "Authoritative Validated Source",
    metadataOnly: true,
    immutable: true,
  }),
] as const);
