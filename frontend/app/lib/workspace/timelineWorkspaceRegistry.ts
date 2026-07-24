/** WS-10:2 — Canonical Timeline Workspace Registry surface. */
import { TimelineWorkspaceCapabilityRegistry } from "./timelineWorkspaceCapabilityRegistry.ts";
import { TimelineWorkspaceFoundation } from "./timelineWorkspaceFoundation.ts";
import { TimelineWorkspaceGovernanceRegistry } from "./timelineWorkspaceGovernanceRegistry.ts";
import { TimelineWorkspaceIdentityRegistry } from "./timelineWorkspaceIdentityRegistry.ts";
import { TimelineWorkspaceReferenceRegistry } from "./timelineWorkspaceReferenceRegistry.ts";
import { TimelineWorkspaceTaxonomyRegistry } from "./timelineWorkspaceTaxonomyRegistry.ts";
import { TimelineWorkspaceTransitionRegistry } from "./timelineWorkspaceTransitionRegistry.ts";

export const TimelineWorkspaceRegistry = Object.freeze({
  identity: TimelineWorkspaceIdentityRegistry,
  foundation: TimelineWorkspaceFoundation,
  eventCategories: TimelineWorkspaceTaxonomyRegistry.eventCategories,
  recordTypes: TimelineWorkspaceTaxonomyRegistry.recordTypes,
  transitionTypes: TimelineWorkspaceTransitionRegistry.transitionTypes,
  granularities: TimelineWorkspaceTransitionRegistry.granularities,
  statusTypes: TimelineWorkspaceReferenceRegistry.statusTypes,
  historicalReferenceTypes:
    TimelineWorkspaceReferenceRegistry.historicalReferenceTypes,
  capabilities: TimelineWorkspaceCapabilityRegistry,
  responsibilities: TimelineWorkspaceGovernanceRegistry.responsibilities,
  lifecycle: TimelineWorkspaceGovernanceRegistry.lifecycle,
  boundaries: TimelineWorkspaceGovernanceRegistry.boundaries,
  inventory: Object.freeze({
    eventCategoryCount:
      TimelineWorkspaceTaxonomyRegistry.eventCategories.length,
    recordTypeCount: TimelineWorkspaceTaxonomyRegistry.recordTypes.length,
    transitionTypeCount:
      TimelineWorkspaceTransitionRegistry.transitionTypes.length,
    granularityCount: TimelineWorkspaceTransitionRegistry.granularities.length,
    statusTypeCount: TimelineWorkspaceReferenceRegistry.statusTypes.length,
    historicalReferenceTypeCount:
      TimelineWorkspaceReferenceRegistry.historicalReferenceTypes.length,
    capabilityCount: TimelineWorkspaceCapabilityRegistry.length,
    responsibilityCount:
      TimelineWorkspaceGovernanceRegistry.responsibilities.length,
    lifecycleCount: TimelineWorkspaceGovernanceRegistry.lifecycle.length,
    boundaryCount: TimelineWorkspaceGovernanceRegistry.boundaries.length,
  }),
  upstreamDependencies: Object.freeze([
    "WS-10:1 Timeline Workspace Foundation",
  ]),
  publicApiSurface: Object.freeze(["TimelineWorkspaceRegistry"]),
  status: "ReadyForModel",
  readiness: "ReadyForModel",
  nextPhase: "WS-10:3 — Timeline Workspace Model",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  eventPlayback: false,
  chronologicalProcessing: false,
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
