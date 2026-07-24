/** WS-9:3 — Canonical Value Workspace Model surface. */
import { ValueWorkspaceCompositionModels } from "./valueWorkspaceCompositionModels.ts";
import { ValueWorkspaceDomainModels } from "./valueWorkspaceDomainModels.ts";
import { ValueWorkspaceFoundation } from "./valueWorkspaceFoundation.ts";
import { ValueWorkspaceIdentityModel } from "./valueWorkspaceIdentityModel.ts";
import { ValueWorkspaceModelRegistry } from "./valueWorkspaceModelRegistry.ts";
import { ValueWorkspaceRegistry } from "./valueWorkspaceRegistry.ts";
import { ValueWorkspaceRelationshipModels } from "./valueWorkspaceRelationshipModels.ts";
import { ValueWorkspaceRepresentationModel } from "./valueWorkspaceRepresentationModel.ts";

export const ValueWorkspaceModel = Object.freeze({
  identity: ValueWorkspaceIdentityModel,
  foundation: ValueWorkspaceFoundation,
  registry: ValueWorkspaceRegistry,
  domainModels: ValueWorkspaceDomainModels,
  relationships: ValueWorkspaceRelationshipModels,
  compositions: ValueWorkspaceCompositionModels,
  representation: ValueWorkspaceRepresentationModel,
  modelRegistry: ValueWorkspaceModelRegistry,
  rules: Object.freeze([
    "Canonical Identity Preservation",
    "Immutable Metadata",
    "Deterministic Ordering",
    "Structural Relationships Only",
    "Implementation Independent",
    "No Runtime Behavior",
    "No Calculated Values",
    "Serialization Independent",
  ]),
  upstreamDependencies: Object.freeze([
    "WS-9:1 Value Workspace Foundation",
    "WS-9:2 Value Workspace Registry",
  ]),
  publicApiSurface: Object.freeze(["ValueWorkspaceModel"]),
  status: "ReadyForValidation",
  readiness: "ReadyForValidation",
  nextPhase: "WS-9:4 — Value Workspace Validation",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  roiCalculation: false,
  financialAnalysis: false,
  valueComputation: false,
  aiReasoning: false,
  forecasting: false,
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
