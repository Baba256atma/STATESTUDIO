/** WS-6:3 — Canonical Problem Workspace Model surface for Validation. */
import { ProblemWorkspaceCompositionModels } from "./problemWorkspaceCompositionModels.ts";
import { ProblemWorkspaceDomainModels } from "./problemWorkspaceDomainModels.ts";
import { ProblemWorkspaceFoundation } from "./problemWorkspaceFoundation.ts";
import { ProblemWorkspaceIdentityModel } from "./problemWorkspaceIdentityModel.ts";
import { ProblemWorkspaceModelRegistry } from "./problemWorkspaceModelRegistry.ts";
import { ProblemWorkspaceRegistry } from "./problemWorkspaceRegistry.ts";
import { ProblemWorkspaceRelationshipModels } from "./problemWorkspaceRelationshipModels.ts";
import { ProblemWorkspaceRepresentationModel } from "./problemWorkspaceRepresentationModel.ts";

export const ProblemWorkspaceModel = Object.freeze({
  identity: ProblemWorkspaceIdentityModel,
  foundation: ProblemWorkspaceFoundation,
  registry: ProblemWorkspaceRegistry,
  domainModels: ProblemWorkspaceDomainModels,
  relationships: ProblemWorkspaceRelationshipModels,
  compositions: ProblemWorkspaceCompositionModels,
  representation: ProblemWorkspaceRepresentationModel,
  modelRegistry: ProblemWorkspaceModelRegistry,
  rules: Object.freeze([
    "Canonical Identity Preservation",
    "Immutable Metadata",
    "Deterministic Ordering",
    "Structural Relationships Only",
    "Implementation Independent",
    "No Runtime Behavior",
    "No Mutable State",
    "Serialization Independent",
  ]),
  upstreamDependencies: Object.freeze([
    "WS-6:1 Problem Workspace Foundation",
    "WS-6:2 Problem Workspace Registry",
  ]),
  publicApiSurface: Object.freeze(["ProblemWorkspaceModel"]),
  readiness: "ReadyForValidation",
  nextPhase: "WS-6:4 — Problem Workspace Validation",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  analysis: false,
  solving: false,
  prediction: false,
  prioritization: false,
  aiReasoning: false,
  workflow: false,
  persistence: false,
  rendering: false,
  services: false,
  orchestration: false,
  stateManagement: false,
  businessLogic: false,
} as const);
