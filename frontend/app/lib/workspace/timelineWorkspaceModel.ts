/** WS-10:3 — Canonical Timeline Workspace Model surface. */
import { TimelineWorkspaceCompositionModels } from "./timelineWorkspaceCompositionModels.ts";
import { TimelineWorkspaceDomainModels } from "./timelineWorkspaceDomainModels.ts";
import { TimelineWorkspaceFoundation } from "./timelineWorkspaceFoundation.ts";
import { TimelineWorkspaceIdentityModel } from "./timelineWorkspaceIdentityModel.ts";
import { TimelineWorkspaceModelRegistry } from "./timelineWorkspaceModelRegistry.ts";
import { TimelineWorkspaceRegistry } from "./timelineWorkspaceRegistry.ts";
import { TimelineWorkspaceRelationshipModels } from "./timelineWorkspaceRelationshipModels.ts";
import { TimelineWorkspaceRepresentationModel } from "./timelineWorkspaceRepresentationModel.ts";

export const TimelineWorkspaceModel = Object.freeze({
  identity: TimelineWorkspaceIdentityModel,
  foundation: TimelineWorkspaceFoundation,
  registry: TimelineWorkspaceRegistry,
  domainModels: TimelineWorkspaceDomainModels,
  relationships: TimelineWorkspaceRelationshipModels,
  compositions: TimelineWorkspaceCompositionModels,
  representation: TimelineWorkspaceRepresentationModel,
  modelRegistry: TimelineWorkspaceModelRegistry,
  rules: Object.freeze([
    "Canonical Identity Preservation",
    "Immutable Metadata",
    "Deterministic Ordering",
    "Structural Relationships Only",
    "Implementation Independent",
    "No Runtime Behavior",
    "No Chronological Processing",
    "Serialization Independent",
  ]),
  upstreamDependencies: Object.freeze([
    "WS-10:1 Timeline Workspace Foundation",
    "WS-10:2 Timeline Workspace Registry",
  ]),
  publicApiSurface: Object.freeze(["TimelineWorkspaceModel"]),
  status: "ReadyForValidation",
  readiness: "ReadyForValidation",
  nextPhase: "WS-10:4 — Timeline Workspace Validation",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  eventPlayback: false,
  timelineNavigation: false,
  chronologicalProcessing: false,
  analytics: false,
  aiReasoning: false,
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
