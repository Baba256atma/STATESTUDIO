/** ASSISTANT-9:5 — Public Manifest surface for Platform consumers. */
import { AssistantActionMonitoringControlManifestCompatibility } from "./assistantActionMonitoringControlManifestCompatibility.ts";
import {
  AssistantActionMonitoringControlManifestExportList,
  AssistantActionMonitoringControlManifestExports,
} from "./assistantActionMonitoringControlManifestExports.ts";
import { AssistantActionMonitoringControlManifestInventory } from "./assistantActionMonitoringControlManifestInventory.ts";
import {
  AssistantActionMonitoringControlManifestIdentity,
  AssistantActionMonitoringControlManifestStructuralMetadata,
} from "./assistantActionMonitoringControlManifestMetadata.ts";
import { AssistantActionMonitoringControlManifestReadiness } from "./assistantActionMonitoringControlManifestReadiness.ts";

export const AssistantActionMonitoringControlManifestPublic = Object.freeze({
  identity: AssistantActionMonitoringControlManifestIdentity,
  metadata: AssistantActionMonitoringControlManifestStructuralMetadata,
  inventory: AssistantActionMonitoringControlManifestInventory,
  compatibility: AssistantActionMonitoringControlManifestCompatibility,
  readiness: AssistantActionMonitoringControlManifestReadiness,
  exports: AssistantActionMonitoringControlManifestExports,
  exportList: AssistantActionMonitoringControlManifestExportList,
  publicApiSurface: Object.freeze([
    "AssistantActionMonitoringControlManifest",
  ]),
  consumer:
    "ASSISTANT-9:6 Executive Action Monitoring & Control Platform",
  runtimeExports: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
} as const);
