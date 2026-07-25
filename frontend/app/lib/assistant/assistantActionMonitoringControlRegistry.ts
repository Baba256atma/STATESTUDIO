/** ASSISTANT-9:2 — Canonical Executive Action Monitoring & Control Registry. */
import { AssistantActionMonitoringControlFoundation } from "./assistantActionMonitoringControlFoundation.ts";
import {
  AssistantActionMonitoringControlRegistryCollections,
  AssistantActionMonitoringControlRegistryEntries,
  AssistantActionMonitoringControlRegistryRelationships,
} from "./assistantActionMonitoringControlRegistryEntries.ts";
import { AssistantActionMonitoringControlRegistryIdentity } from "./assistantActionMonitoringControlRegistryIdentity.ts";
import { AssistantActionMonitoringControlRegistryLookup } from "./assistantActionMonitoringControlRegistryLookup.ts";
import {
  AssistantActionMonitoringControlRegistryMetadata,
  AssistantActionMonitoringControlRegistryPolicies,
} from "./assistantActionMonitoringControlRegistryMetadata.ts";
import { AssistantActionMonitoringControlRegistryPublic } from "./assistantActionMonitoringControlRegistryPublic.ts";

export const AssistantActionMonitoringControlRegistry = Object.freeze({
  identity: AssistantActionMonitoringControlRegistryIdentity,
  foundation: AssistantActionMonitoringControlFoundation,
  metadata: AssistantActionMonitoringControlRegistryMetadata,
  collections: AssistantActionMonitoringControlRegistryCollections,
  entries: AssistantActionMonitoringControlRegistryEntries,
  relationships: AssistantActionMonitoringControlRegistryRelationships,
  lookup: AssistantActionMonitoringControlRegistryLookup,
  policies: AssistantActionMonitoringControlRegistryPolicies,
  publicSurface: AssistantActionMonitoringControlRegistryPublic,
  statistics: Object.freeze({
    collectionCount: Object.keys(
      AssistantActionMonitoringControlRegistryCollections,
    ).length,
    entryCount: AssistantActionMonitoringControlRegistryEntries.length,
    relationshipCount:
      AssistantActionMonitoringControlRegistryRelationships.length,
    monitoringDomainCount:
      AssistantActionMonitoringControlRegistryCollections.monitoringDomains
        .length,
    monitoringStateCount:
      AssistantActionMonitoringControlRegistryCollections.monitoringStates
        .length,
    progressStateCount:
      AssistantActionMonitoringControlRegistryCollections.progressStates
        .length,
    policyCount:
      AssistantActionMonitoringControlRegistryCollections.monitoringPolicies
        .length,
    capabilityCount:
      AssistantActionMonitoringControlRegistryCollections.capabilities.length,
  }),
  upstreamDependencies: Object.freeze([
    "ASSISTANT-9:1 Executive Action Monitoring & Control Foundation",
  ]),
  publicApiSurface: Object.freeze([
    "AssistantActionMonitoringControlRegistry",
  ]),
  status: "Registry",
  stage: "ReadyForModel",
  readiness: "ReadyForModel",
  nextPhase: "ASSISTANT-9:3 — Executive Action Monitoring & Control Model",
  canonical: true,
  mutable: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  monitoringRuntime: false,
  controlRuntime: false,
  kpiEvaluation: false,
  alertExecution: false,
  monitoringEngine: false,
  scheduler: false,
  automation: false,
  dashboards: false,
  notifications: false,
  eventProcessing: false,
  services: false,
  factories: false,
  persistence: false,
  apis: false,
  aiReasoning: false,
  ui: false,
  rendering: false,
} as const);
