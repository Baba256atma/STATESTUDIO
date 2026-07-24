/** WS-7:3 — Canonical Decision Workspace Model surface. */
import { DecisionWorkspaceV7CompositionModels } from "./decisionWorkspaceV7CompositionModels.ts";
import { DecisionWorkspaceV7DomainModels } from "./decisionWorkspaceV7DomainModels.ts";
import { DecisionWorkspaceV7Foundation } from "./decisionWorkspaceV7Foundation.ts";
import { DecisionWorkspaceV7IdentityModel } from "./decisionWorkspaceV7IdentityModel.ts";
import { DecisionWorkspaceV7ModelRegistry } from "./decisionWorkspaceV7ModelRegistry.ts";
import { DecisionWorkspaceV7Registry } from "./decisionWorkspaceV7Registry.ts";
import { DecisionWorkspaceV7RelationshipModels } from "./decisionWorkspaceV7RelationshipModels.ts";
import { DecisionWorkspaceV7RepresentationModel } from "./decisionWorkspaceV7RepresentationModel.ts";

export const DecisionWorkspaceV7Model = Object.freeze({
  identity: DecisionWorkspaceV7IdentityModel,
  foundation: DecisionWorkspaceV7Foundation,
  registry: DecisionWorkspaceV7Registry,
  domainModels: DecisionWorkspaceV7DomainModels,
  relationships: DecisionWorkspaceV7RelationshipModels,
  compositions: DecisionWorkspaceV7CompositionModels,
  representation: DecisionWorkspaceV7RepresentationModel,
  modelRegistry: DecisionWorkspaceV7ModelRegistry,
  rules: Object.freeze([
    "Canonical Identity Preservation",
    "Immutable Metadata",
    "Deterministic Ordering",
    "Structural Relationships Only",
    "Implementation Independent",
    "No Runtime Behavior",
    "No Ranking Or Scoring",
    "Serialization Independent",
  ]),
  upstreamDependencies: Object.freeze([
    "WS-7:1 Decision Workspace Foundation",
    "WS-7:2 Decision Workspace Registry",
  ]),
  publicApiSurface: Object.freeze(["DecisionWorkspaceV7Model"]),
  status: "ReadyForValidation",
  readiness: "ReadyForValidation",
  nextPhase: "WS-7:4 — Decision Workspace Validation",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  aiReasoning: false,
  decisionGeneration: false,
  evaluation: false,
  ranking: false,
  recommendation: false,
  approval: false,
  rejection: false,
  execution: false,
  optimization: false,
  scoring: false,
  workflowExecution: false,
  persistence: false,
  networking: false,
  rendering: false,
  visualization: false,
  stateManagement: false,
  services: false,
  factories: false,
  businessLogic: false,
} as const);
