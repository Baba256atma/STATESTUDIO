/** WS-4:5 — Canonically ordered Validation-reachable source references. */
import { DecisionWorkspaceValidation } from "./decisionWorkspaceValidation.ts";

const sources = Object.freeze([
  DecisionWorkspaceValidation.foundation.identity,
  DecisionWorkspaceValidation.registry.identity,
  DecisionWorkspaceValidation.model.identity,
  DecisionWorkspaceValidation.identity,
] as const);

const names = Object.freeze([
  "Decision Workspace Foundation",
  "Decision Workspace Registry",
  "Decision Workspace Model",
  "Decision Workspace Validation",
] as const);

const readiness = Object.freeze([
  "ReadyForRegistry",
  "ReadyForModel",
  "ReadyForValidation",
  "ReadyForManifest",
] as const);

export const DecisionWorkspaceManifestSources = Object.freeze(
  sources.map((source, index) => Object.freeze({
    id: `WS-4:${index + 1}/ManifestSource`,
    phaseId: `WS-4:${index + 1}`,
    phaseName: names[index],
    canonicalIdentifier: source.id,
    namespace: source.namespace,
    version: source.version,
    status: source.status,
    readiness: readiness[index],
    dependencyRole:
      index === 3
        ? "Authoritative Validation Source"
        : "Validation-Reachable Source",
    manifestInclusionStatus: "Included",
    source,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
