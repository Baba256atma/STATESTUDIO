/** WS-5:3 — Canonical Scenario Workspace Model surface for Validation. */
import { ScenarioWorkspaceCompositionModels } from "./scenarioWorkspaceCompositionModels.ts";
import { ScenarioWorkspaceDomainModels } from "./scenarioWorkspaceDomainModels.ts";
import { ScenarioWorkspaceFoundation } from "./scenarioWorkspaceFoundation.ts";
import { ScenarioWorkspaceIdentityModel } from "./scenarioWorkspaceIdentityModel.ts";
import { ScenarioWorkspaceMetadataModels } from "./scenarioWorkspaceMetadataModels.ts";
import { ScenarioWorkspaceModelRegistry } from "./scenarioWorkspaceModelRegistry.ts";
import { ScenarioWorkspaceRegistry } from "./scenarioWorkspaceRegistry.ts";
import { ScenarioWorkspaceRelationshipModels } from "./scenarioWorkspaceRelationshipModels.ts";

export const ScenarioWorkspaceModel = Object.freeze({
  identity: ScenarioWorkspaceIdentityModel,
  foundation: ScenarioWorkspaceFoundation,
  registry: ScenarioWorkspaceRegistry,
  domainModels: ScenarioWorkspaceDomainModels,
  relationships: ScenarioWorkspaceRelationshipModels,
  compositions: ScenarioWorkspaceCompositionModels,
  metadataModels: ScenarioWorkspaceMetadataModels,
  modelRegistry: ScenarioWorkspaceModelRegistry,
  aggregate: Object.freeze({
    workspace: "Scenario Workspace Model",
    scenarios: "Scenario Model",
    options: "Scenario Option Model",
    branches: "Scenario Branch Model",
    timelines: "Scenario Timeline Model",
    assumptions: "Scenario Assumption Model",
    risks: "Scenario Risk Model",
    constraints: "Scenario Constraint Model",
    outcomes: "Scenario Outcome Model",
    confidence: "Scenario Confidence Model",
    recommendations: "Scenario Recommendation Model",
    metadata: "Scenario Metadata Model",
    metadataOnly: true,
    immutable: true,
  }),
  rules: Object.freeze([
    "Canonical Identity Preservation",
    "Immutable",
    "Deterministic Ordering",
    "Structural Relationships Only",
    "Implementation Independent",
    "No Runtime Behavior",
    "No Mutable State",
    "Serialization Independent",
  ]),
  readiness: "ReadyForValidation",
  nextPhase: "WS-5:4 — Scenario Workspace Validation",
  upstreamDependencies: Object.freeze([
    "WS-5:1 Scenario Workspace Foundation",
    "WS-5:2 Scenario Workspace Registry",
  ]),
  publicApiSurface: Object.freeze(["ScenarioWorkspaceModel"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  simulationEngine: false,
  predictionEngine: false,
  scenarioExecution: false,
  businessLogic: false,
  aiReasoning: false,
  workflowExecution: false,
  persistence: false,
  networking: false,
  ui: false,
} as const);
