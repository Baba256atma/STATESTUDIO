/** ASSISTANT-9:5 — Manifest identity and structural metadata. */
import { AssistantActionMonitoringControlValidation } from "./assistantActionMonitoringControlValidation.ts";

export const AssistantActionMonitoringControlManifestIdentity =
  Object.freeze({
    id: "ASSISTANT-9:5/ExecutiveActionMonitoringControlManifest",
    name: "Assistant Executive Action Monitoring & Control Manifest",
    phaseId: "ASSISTANT-9:5",
    namespace:
      "nexora.assistant.executive-action-monitoring-control.manifest",
    version: "1.0.0",
    status: "Manifest",
    stage: "ReadyForPlatform",
    readiness: "ReadyForPlatform",
    canonical: true,
    mutable: false,
    sourceValidation:
      "ASSISTANT-9:4/ExecutiveActionMonitoringControlValidation",
    inventoryVersion: "1.0.0",
    compatibilityVersion: "1.0.0",
    ownership: "Nexora Assistant",
    metadataOnly: true,
    immutable: true,
  } as const);

export const AssistantActionMonitoringControlManifestStructuralMetadata =
  Object.freeze({
    manifestId: AssistantActionMonitoringControlManifestIdentity.id,
    canonicalName: AssistantActionMonitoringControlManifestIdentity.name,
    namespace: AssistantActionMonitoringControlManifestIdentity.namespace,
    version: AssistantActionMonitoringControlManifestIdentity.version,
    status: AssistantActionMonitoringControlManifestIdentity.status,
    readiness: AssistantActionMonitoringControlManifestIdentity.readiness,
    sourceValidationReference:
      AssistantActionMonitoringControlManifestIdentity.sourceValidation,
    inventoryVersion:
      AssistantActionMonitoringControlManifestIdentity.inventoryVersion,
    compatibilityVersion:
      AssistantActionMonitoringControlManifestIdentity.compatibilityVersion,
    sourceValidation:
      AssistantActionMonitoringControlValidation.identity,
    sourceValidationPlatform:
      AssistantActionMonitoringControlValidation.platform,
    requirements: Object.freeze([
      "Immutable",
      "Canonical",
      "Validation-derived",
      "Metadata-only",
      "Deterministic",
      "Versioned",
      "Platform-ready",
    ]),
    canonicalInventoryRule: "Validation Platform References Only",
    metadataOnly: true,
    immutable: true,
  } as const);
