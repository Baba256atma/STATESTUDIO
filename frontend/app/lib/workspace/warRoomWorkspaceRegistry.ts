/** WS-8:2 — Canonical War Room Workspace Registry surface. */
import { WarRoomWorkspaceCapabilityRegistry } from "./warRoomWorkspaceCapabilityRegistry.ts";
import { WarRoomWorkspaceCoordinationRegistry } from "./warRoomWorkspaceCoordinationRegistry.ts";
import { WarRoomWorkspaceEventIncidentRegistry } from "./warRoomWorkspaceEventIncidentRegistry.ts";
import { WarRoomWorkspaceFoundation } from "./warRoomWorkspaceFoundation.ts";
import { WarRoomWorkspaceGovernanceRegistry } from "./warRoomWorkspaceGovernanceRegistry.ts";
import { WarRoomWorkspaceIdentityRegistry } from "./warRoomWorkspaceIdentityRegistry.ts";
import { WarRoomWorkspaceTaxonomyRegistry } from "./warRoomWorkspaceTaxonomyRegistry.ts";

export const WarRoomWorkspaceRegistry = Object.freeze({
  identity: WarRoomWorkspaceIdentityRegistry,
  foundation: WarRoomWorkspaceFoundation,
  taxonomy: WarRoomWorkspaceTaxonomyRegistry,
  events: WarRoomWorkspaceEventIncidentRegistry.eventTypes,
  incidents: WarRoomWorkspaceEventIncidentRegistry.incidentTypes,
  coordination: WarRoomWorkspaceCoordinationRegistry.coordinationTypes,
  monitoringDomains: WarRoomWorkspaceCoordinationRegistry.monitoringDomains,
  capabilities: WarRoomWorkspaceCapabilityRegistry,
  responsibilities: WarRoomWorkspaceGovernanceRegistry.responsibilities,
  lifecycle: WarRoomWorkspaceGovernanceRegistry.lifecycle,
  boundaries: WarRoomWorkspaceGovernanceRegistry.boundaries,
  inventory: Object.freeze({
    categoryCount:
      WarRoomWorkspaceTaxonomyRegistry.operationalCategories.length,
    statusCount:
      WarRoomWorkspaceTaxonomyRegistry.operationalStatuses.length,
    alertTypeCount: WarRoomWorkspaceTaxonomyRegistry.alertTypes.length,
    eventTypeCount: WarRoomWorkspaceEventIncidentRegistry.eventTypes.length,
    incidentTypeCount:
      WarRoomWorkspaceEventIncidentRegistry.incidentTypes.length,
    coordinationTypeCount:
      WarRoomWorkspaceCoordinationRegistry.coordinationTypes.length,
    monitoringDomainCount:
      WarRoomWorkspaceCoordinationRegistry.monitoringDomains.length,
    capabilityCount: WarRoomWorkspaceCapabilityRegistry.length,
    responsibilityCount:
      WarRoomWorkspaceGovernanceRegistry.responsibilities.length,
    lifecycleCount: WarRoomWorkspaceGovernanceRegistry.lifecycle.length,
    boundaryCount: WarRoomWorkspaceGovernanceRegistry.boundaries.length,
  }),
  upstreamDependencies: Object.freeze([
    "WS-8:1 War Room Workspace Foundation",
  ]),
  publicApiSurface: Object.freeze(["WarRoomWorkspaceRegistry"]),
  status: "ReadyForModel",
  readiness: "ReadyForModel",
  nextPhase: "WS-8:3 — War Room Workspace Model",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  aiReasoning: false,
  liveMonitoring: false,
  workflowExecution: false,
  orchestration: false,
  persistence: false,
  networking: false,
  rendering: false,
  visualization: false,
  stateManagement: false,
  services: false,
  factories: false,
  businessLogic: false,
} as const);
