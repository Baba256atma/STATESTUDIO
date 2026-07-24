/** WS-4:3 — Canonical Decision Workspace Model surface for Validation. */
import { DecisionWorkspaceCompositionModels } from "./decisionWorkspaceCompositionModels.ts";
import { DecisionWorkspaceDomainModels } from "./decisionWorkspaceDomainModels.ts";
import { DecisionWorkspaceFoundation } from "./decisionWorkspaceFoundation.ts";
import { DecisionWorkspaceIdentityModel } from "./decisionWorkspaceIdentityModel.ts";
import { DecisionWorkspaceMetadataModels } from "./decisionWorkspaceMetadataModels.ts";
import { DecisionWorkspaceModelRegistry } from "./decisionWorkspaceModelRegistry.ts";
import { DecisionWorkspaceRegistry } from "./decisionWorkspaceRegistry.ts";
import { DecisionWorkspaceRelationshipModels } from "./decisionWorkspaceRelationshipModels.ts";

export const DecisionWorkspaceModel = Object.freeze({
  identity: DecisionWorkspaceIdentityModel,
  foundation: DecisionWorkspaceFoundation,
  registry: DecisionWorkspaceRegistry,
  domainModels: DecisionWorkspaceDomainModels,
  relationships: DecisionWorkspaceRelationshipModels,
  compositions: DecisionWorkspaceCompositionModels,
  metadataModels: DecisionWorkspaceMetadataModels,
  modelRegistry: DecisionWorkspaceModelRegistry,
  aggregate: Object.freeze({
    workspace: "Decision Workspace Model",
    decisions: "Decision Model",
    options: "Decision Option Model",
    criteria: "Decision Criteria Model",
    context: "Decision Context Model",
    risks: "Decision Risk Model",
    assumptions: "Decision Assumption Model",
    constraints: "Decision Constraint Model",
    confidence: "Decision Confidence Model",
    owner: "Decision Owner Model",
    outcomes: "Decision Outcome Model",
    metadata: "Decision Metadata Model",
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
  nextPhase: "WS-4:4 — Decision Workspace Validation",
  upstreamDependencies: Object.freeze([
    "WS-4:1 Decision Workspace Foundation",
    "WS-4:2 Decision Workspace Registry",
  ]),
  publicApiSurface: Object.freeze(["DecisionWorkspaceModel"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  businessLogic: false,
  aiReasoning: false,
  workflowExecution: false,
  persistence: false,
  visualization: false,
  networking: false,
  ui: false,
} as const);
