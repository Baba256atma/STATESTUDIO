/** WS-3:5 — Canonically ordered Validation-reachable source references. */
import { GoalWorkspaceValidation } from "./goalWorkspaceValidation.ts";
const sources = Object.freeze([
  GoalWorkspaceValidation.foundation.identity, GoalWorkspaceValidation.registry.identity,
  GoalWorkspaceValidation.model.identity, GoalWorkspaceValidation.identity,
] as const);
const names = Object.freeze(["Goal Workspace Foundation", "Goal Workspace Registry",
  "Goal Workspace Model", "Goal Workspace Validation"] as const);
const readiness = Object.freeze(["ReadyForRegistry", "ReadyForModel",
  "ReadyForValidation", "ReadyForManifest"] as const);
export const GoalWorkspaceManifestSources = Object.freeze(sources.map((source, index) => Object.freeze({
  id: `WS-3:${index + 1}/ManifestSource`, phaseId: `WS-3:${index + 1}`,
  phaseName: names[index], namespace: source.namespace, version: source.version,
  status: source.status, readiness: readiness[index],
  dependencyRole: index === 3 ? "Authoritative Validation Source" : "Validation-Reachable Source",
  manifestInclusionStatus: "Included", source, order: index + 1,
  metadataOnly: true, immutable: true,
})));

