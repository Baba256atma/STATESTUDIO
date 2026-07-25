/** ASSISTANT-9:5 — Immutable Manifest export metadata surface. */
import { AssistantActionMonitoringControlManifestCompatibility } from "./assistantActionMonitoringControlManifestCompatibility.ts";
import { AssistantActionMonitoringControlManifestInventory } from "./assistantActionMonitoringControlManifestInventory.ts";
import {
  AssistantActionMonitoringControlManifestIdentity,
  AssistantActionMonitoringControlManifestStructuralMetadata,
} from "./assistantActionMonitoringControlManifestMetadata.ts";
import { AssistantActionMonitoringControlManifestReadiness } from "./assistantActionMonitoringControlManifestReadiness.ts";
import { AssistantActionMonitoringControlValidation } from "./assistantActionMonitoringControlValidation.ts";

const platform = AssistantActionMonitoringControlValidation.platform;

export const AssistantActionMonitoringControlManifestExportList =
  Object.freeze([
    "AssistantActionMonitoringControlManifest",
    "AssistantActionMonitoringControlManifestInventory",
    "AssistantActionMonitoringControlManifestStructuralMetadata",
    "AssistantActionMonitoringControlManifestCompatibility",
    "AssistantActionMonitoringControlManifestReadiness",
    "AssistantActionMonitoringControlManifestPublic",
    "AssistantActionMonitoringControlManifestExportList",
  ] as const);

export const AssistantActionMonitoringControlManifestExports =
  Object.freeze({
    identity: AssistantActionMonitoringControlManifestIdentity,
    inventory: AssistantActionMonitoringControlManifestInventory,
    metadata: AssistantActionMonitoringControlManifestStructuralMetadata,
    compatibility: AssistantActionMonitoringControlManifestCompatibility,
    readiness: AssistantActionMonitoringControlManifestReadiness,
    exportList: AssistantActionMonitoringControlManifestExportList,
    platformSummary: Object.freeze({
      supportedCapabilities:
        platform.inventoryTotals.capabilityCount,
      supportedContracts: platform.inventoryTotals.contractCount,
      supportedModels: platform.inventoryTotals.modelKindCount,
      supportedRelationships:
        platform.inventoryTotals.relationshipKindCount,
      validationStatus: platform.validationStatus,
      readiness: AssistantActionMonitoringControlManifestReadiness.readiness,
      manifestVersion:
        AssistantActionMonitoringControlManifestIdentity.version,
    }),
    runtimeExports: false,
    metadataOnly: true,
    immutable: true,
  } as const);
