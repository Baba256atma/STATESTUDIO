/** WS-3:3 — Canonical Goal Workspace Model surface for Validation. */
import { GoalWorkspaceCompositionModels } from "./goalWorkspaceCompositionModels.ts";
import { GoalWorkspaceDomainModels } from "./goalWorkspaceDomainModels.ts";
import { GoalWorkspaceFoundation } from "./goalWorkspaceFoundation.ts";
import { GoalWorkspaceIdentityModel } from "./goalWorkspaceIdentityModel.ts";
import { GoalWorkspaceMetadataModels } from "./goalWorkspaceMetadataModels.ts";
import { GoalWorkspaceModelRegistry } from "./goalWorkspaceModelRegistry.ts";
import { GoalWorkspaceRegistry } from "./goalWorkspaceRegistry.ts";
import { GoalWorkspaceRelationshipModels } from "./goalWorkspaceRelationshipModels.ts";

export const GoalWorkspaceModel = Object.freeze({
  identity: GoalWorkspaceIdentityModel,
  foundation: GoalWorkspaceFoundation,
  registry: GoalWorkspaceRegistry,
  domainModels: GoalWorkspaceDomainModels,
  relationships: GoalWorkspaceRelationshipModels,
  compositions: GoalWorkspaceCompositionModels,
  metadataModels: GoalWorkspaceMetadataModels,
  modelRegistry: GoalWorkspaceModelRegistry,
  aggregate: Object.freeze({
    workspace: "Goal Workspace Model", goals: "Goal Collection Model",
    context: "Goal Context Model", ownership: "Goal Ownership Model",
    kpis: "Goal KPI Model", timeline: "Goal Timeline Model",
    assumptions: "Goal Assumption Model", constraints: "Goal Constraint Model",
    risks: "Goal Risk Model", metadata: "Goal Metadata Model",
    state: "Goal State Model", metadataOnly: true, immutable: true,
  }),
  rules: Object.freeze(["Immutable", "Canonical Identity Preservation",
    "Deterministic Ordering", "Structural Relationships Only",
    "Implementation Independent", "No Runtime Behavior", "Serialization Independent"]),
  readiness: "ReadyForValidation",
  nextPhase: "WS-3:4 — Goal Workspace Validation",
  upstreamDependencies: Object.freeze([
    "WS-3:1 Goal Workspace Foundation", "WS-3:2 Goal Workspace Registry",
  ]),
  publicApiSurface: Object.freeze(["GoalWorkspaceModel"]),
  metadataOnly: true, immutable: true, deterministic: true,
  runtime: false, businessLogic: false, aiReasoning: false, planning: false,
  scheduling: false, persistence: false, visualization: false, networking: false, ui: false,
} as const);

