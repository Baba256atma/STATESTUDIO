/** ASSISTANT-9:2 — Registry structural metadata and registry policies. */
import { AssistantActionMonitoringControlFoundation } from "./assistantActionMonitoringControlFoundation.ts";
import {
  AssistantActionMonitoringControlRegistryCollections,
  AssistantActionMonitoringControlRegistryEntries,
  AssistantActionMonitoringControlRegistryRelationships,
} from "./assistantActionMonitoringControlRegistryEntries.ts";
import { AssistantActionMonitoringControlRegistryIdentity } from "./assistantActionMonitoringControlRegistryIdentity.ts";

export const AssistantActionMonitoringControlRegistryPolicies = Object.freeze([
  "Immutable",
  "Deterministic",
  "Metadata-only",
  "Versioned",
  "Canonical",
  "Foundation-derived",
  "Model-ready",
] as const);

export const AssistantActionMonitoringControlRegistryMetadata = Object.freeze({
  identity: AssistantActionMonitoringControlRegistryIdentity,
  namespace: AssistantActionMonitoringControlRegistryIdentity.namespace,
  ownership: "Nexora Assistant",
  version: AssistantActionMonitoringControlRegistryIdentity.version,
  releaseState: "Registry",
  readiness: AssistantActionMonitoringControlRegistryIdentity.readiness,
  sourceFoundation: AssistantActionMonitoringControlFoundation.identity,
  policies: AssistantActionMonitoringControlRegistryPolicies,
  compatibility: Object.freeze({
    foundationCompatible: true,
    modelCompatible: true,
    freezeCompatible: true,
    publicIndexCompatible: true,
  }),
  statistics: Object.freeze({
    collectionCount: Object.keys(
      AssistantActionMonitoringControlRegistryCollections,
    ).length,
    entryCount: AssistantActionMonitoringControlRegistryEntries.length,
    relationshipCount:
      AssistantActionMonitoringControlRegistryRelationships.length,
    policyCount: AssistantActionMonitoringControlRegistryPolicies.length,
  }),
  metadataOnly: true,
  immutable: true,
} as const);
