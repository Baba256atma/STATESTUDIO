/** ASSISTANT-9:3 — Public Model surface metadata for Validation consumers. */
import { AssistantActionMonitoringControlModelStructuralMetadata } from "./assistantActionMonitoringControlModelMetadata.ts";
import { AssistantActionMonitoringControlDomainModels } from "./assistantActionMonitoringControlModels.ts";
import { AssistantActionMonitoringControlRelationships } from "./assistantActionMonitoringControlRelationships.ts";
import { AssistantActionMonitoringControlStateModels } from "./assistantActionMonitoringControlStateModels.ts";

export const AssistantActionMonitoringControlModelPublic = Object.freeze({
  identity: AssistantActionMonitoringControlModelStructuralMetadata.identity,
  metadata: AssistantActionMonitoringControlModelStructuralMetadata,
  domainModels: AssistantActionMonitoringControlDomainModels,
  relationships: AssistantActionMonitoringControlRelationships,
  stateModels: AssistantActionMonitoringControlStateModels,
  publicApiSurface: Object.freeze([
    "AssistantActionMonitoringControlModel",
  ]),
  consumer: "ASSISTANT-9:4 Executive Action Monitoring & Control Validation",
  runtimeExports: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
} as const);
