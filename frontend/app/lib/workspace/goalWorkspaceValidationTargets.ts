/** WS-3:4 — Canonical source-linked validation targets. */
import { GoalWorkspaceFoundation } from "./goalWorkspaceFoundation.ts";
import { GoalWorkspaceModel } from "./goalWorkspaceModel.ts";
import { GoalWorkspaceRegistry } from "./goalWorkspaceRegistry.ts";
const definitions = Object.freeze([
  ["Goal Workspace Foundation", GoalWorkspaceFoundation],
  ["Goal Workspace Registry", GoalWorkspaceRegistry],
  ["Goal Workspace Model", GoalWorkspaceModel],
  ["Workspace Identity", GoalWorkspaceFoundation.identity],
  ["Responsibility Registry", GoalWorkspaceRegistry.responsibilities],
  ["Capability Registry", GoalWorkspaceRegistry.capabilities],
  ["Goal Type Registry", GoalWorkspaceRegistry.goalTypes],
  ["Lifecycle Registry", GoalWorkspaceRegistry.lifecycle],
  ["Contract Registry", GoalWorkspaceRegistry.contracts],
  ["Domain Model Registry", GoalWorkspaceModel.domainModels],
  ["Relationship Model Registry", GoalWorkspaceModel.relationships],
  ["Composition Model Registry", GoalWorkspaceModel.compositions],
  ["Metadata Model Registry", GoalWorkspaceModel.metadataModels],
  ["Workspace Boundaries", GoalWorkspaceRegistry.boundaries],
  ["Dependency Declarations", GoalWorkspaceModel.upstreamDependencies],
  ["Readiness Declarations", GoalWorkspaceModel.identity],
] as const);
export const GoalWorkspaceValidationTargets = Object.freeze(definitions.map(
  ([name, source], index) => Object.freeze({
    id: `WS-3:4/Target/${String(index + 1).padStart(2, "0")}`, name,
    description: `References ${name} as canonical validation input.`,
    source, sourceIdentity: "id" in source ? source.id : `WS-3:4/TargetSource/${index + 1}`,
    order: index + 1, metadataOnly: true, immutable: true,
  }),
));

