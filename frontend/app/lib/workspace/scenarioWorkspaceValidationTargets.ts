/** WS-5:4 — Canonical source-linked validation targets. */
import { ScenarioWorkspaceFoundation } from "./scenarioWorkspaceFoundation.ts";
import { ScenarioWorkspaceModel } from "./scenarioWorkspaceModel.ts";
import { ScenarioWorkspaceRegistry } from "./scenarioWorkspaceRegistry.ts";

const definitions = Object.freeze([
  ["Scenario Workspace Foundation", ScenarioWorkspaceFoundation],
  ["Scenario Workspace Registry", ScenarioWorkspaceRegistry],
  ["Scenario Workspace Model", ScenarioWorkspaceModel],
  ["Workspace Identity", ScenarioWorkspaceFoundation.identity],
  ["Responsibility Registry", ScenarioWorkspaceRegistry.responsibilities],
  ["Capability Registry", ScenarioWorkspaceRegistry.capabilities],
  ["Scenario Type Registry", ScenarioWorkspaceRegistry.scenarioTypes],
  ["Lifecycle Registry", ScenarioWorkspaceRegistry.lifecycle],
  ["Contract Registry", ScenarioWorkspaceRegistry.contracts],
  ["Domain Model Registry", ScenarioWorkspaceModel.domainModels],
  ["Relationship Model Registry", ScenarioWorkspaceModel.relationships],
  ["Composition Model Registry", ScenarioWorkspaceModel.compositions],
  ["Metadata Model Registry", ScenarioWorkspaceModel.metadataModels],
  ["Workspace Boundaries", ScenarioWorkspaceRegistry.boundaries],
  ["Dependency Declarations", ScenarioWorkspaceModel.upstreamDependencies],
  ["Readiness Declarations", ScenarioWorkspaceModel.identity],
] as const);

export const ScenarioWorkspaceValidationTargets = Object.freeze(
  definitions.map(([name, source], index) => Object.freeze({
    id: `WS-5:4/Target/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `References ${name} as canonical validation input.`,
    source,
    sourceIdentity:
      "id" in source ? source.id : `WS-5:4/TargetSource/${index + 1}`,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
