/** WS-5:5 — Canonically ordered Validation-reachable source references. */
import { ScenarioWorkspaceValidation } from "./scenarioWorkspaceValidation.ts";

const sources = Object.freeze([
  ScenarioWorkspaceValidation.foundation.identity,
  ScenarioWorkspaceValidation.registry.identity,
  ScenarioWorkspaceValidation.model.identity,
  ScenarioWorkspaceValidation.identity,
] as const);

const names = Object.freeze([
  "Scenario Workspace Foundation",
  "Scenario Workspace Registry",
  "Scenario Workspace Model",
  "Scenario Workspace Validation",
] as const);

const readiness = Object.freeze([
  "ReadyForRegistry",
  "ReadyForModel",
  "ReadyForValidation",
  "ReadyForManifest",
] as const);

export const ScenarioWorkspaceManifestSources = Object.freeze(
  sources.map((source, index) => Object.freeze({
    id: `WS-5:${index + 1}/ManifestSource`,
    phaseId: `WS-5:${index + 1}`,
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
