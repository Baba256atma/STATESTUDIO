/** WS-8:3 — Canonical War Room Workspace Model surface. */
import { WarRoomWorkspaceCompositionModels } from "./warRoomWorkspaceCompositionModels.ts";
import { WarRoomWorkspaceDomainModels } from "./warRoomWorkspaceDomainModels.ts";
import { WarRoomWorkspaceFoundation } from "./warRoomWorkspaceFoundation.ts";
import { WarRoomWorkspaceIdentityModel } from "./warRoomWorkspaceIdentityModel.ts";
import { WarRoomWorkspaceModelRegistry } from "./warRoomWorkspaceModelRegistry.ts";
import { WarRoomWorkspaceRegistry } from "./warRoomWorkspaceRegistry.ts";
import { WarRoomWorkspaceRelationshipModels } from "./warRoomWorkspaceRelationshipModels.ts";
import { WarRoomWorkspaceRepresentationModel } from "./warRoomWorkspaceRepresentationModel.ts";

export const WarRoomWorkspaceModel = Object.freeze({
  identity: WarRoomWorkspaceIdentityModel,
  foundation: WarRoomWorkspaceFoundation,
  registry: WarRoomWorkspaceRegistry,
  domainModels: WarRoomWorkspaceDomainModels,
  relationships: WarRoomWorkspaceRelationshipModels,
  compositions: WarRoomWorkspaceCompositionModels,
  representation: WarRoomWorkspaceRepresentationModel,
  modelRegistry: WarRoomWorkspaceModelRegistry,
  rules: Object.freeze([
    "Canonical Identity Preservation",
    "Immutable Metadata",
    "Deterministic Ordering",
    "Structural Relationships Only",
    "Implementation Independent",
    "No Runtime Behavior",
    "No Live State",
    "Serialization Independent",
  ]),
  upstreamDependencies: Object.freeze([
    "WS-8:1 War Room Workspace Foundation",
    "WS-8:2 War Room Workspace Registry",
  ]),
  publicApiSurface: Object.freeze(["WarRoomWorkspaceModel"]),
  status: "ReadyForValidation",
  readiness: "ReadyForValidation",
  nextPhase: "WS-8:4 — War Room Workspace Validation",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  liveMonitoring: false,
  aiReasoning: false,
  workflowOrchestration: false,
  eventProcessing: false,
  alertGeneration: false,
  incidentProcessing: false,
  persistence: false,
  networking: false,
  rendering: false,
  visualization: false,
  stateManagement: false,
  services: false,
  factories: false,
  businessLogic: false,
} as const);
