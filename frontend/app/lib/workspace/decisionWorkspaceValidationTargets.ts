/** WS-4:4 — Canonical source-linked validation targets. */
import { DecisionWorkspaceFoundation } from "./decisionWorkspaceFoundation.ts";
import { DecisionWorkspaceModel } from "./decisionWorkspaceModel.ts";
import { DecisionWorkspaceRegistry } from "./decisionWorkspaceRegistry.ts";

const definitions = Object.freeze([
  ["Decision Workspace Foundation", DecisionWorkspaceFoundation],
  ["Decision Workspace Registry", DecisionWorkspaceRegistry],
  ["Decision Workspace Model", DecisionWorkspaceModel],
  ["Workspace Identity", DecisionWorkspaceFoundation.identity],
  ["Responsibility Registry", DecisionWorkspaceRegistry.responsibilities],
  ["Capability Registry", DecisionWorkspaceRegistry.capabilities],
  ["Decision Type Registry", DecisionWorkspaceRegistry.decisionTypes],
  ["Lifecycle Registry", DecisionWorkspaceRegistry.lifecycle],
  ["Contract Registry", DecisionWorkspaceRegistry.contracts],
  ["Domain Model Registry", DecisionWorkspaceModel.domainModels],
  ["Relationship Model Registry", DecisionWorkspaceModel.relationships],
  ["Composition Model Registry", DecisionWorkspaceModel.compositions],
  ["Metadata Model Registry", DecisionWorkspaceModel.metadataModels],
  ["Workspace Boundaries", DecisionWorkspaceRegistry.boundaries],
  ["Dependency Declarations", DecisionWorkspaceModel.upstreamDependencies],
  ["Readiness Declarations", DecisionWorkspaceModel.identity],
] as const);

export const DecisionWorkspaceValidationTargets = Object.freeze(
  definitions.map(([name, source], index) => Object.freeze({
    id: `WS-4:4/Target/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `References ${name} as canonical validation input.`,
    source,
    sourceIdentity:
      "id" in source ? source.id : `WS-4:4/TargetSource/${index + 1}`,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
