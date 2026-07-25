/** ASSISTANT-9:8 — Frozen public API inventory for Public Index consumers. */
import { AssistantActionMonitoringControlCertification } from "./assistantActionMonitoringControlCertification.ts";
import { ASSISTANT_9_MONITORING_CONTROL_LOCK } from "./assistantActionMonitoringControlFreezeMetadata.ts";

const certification = AssistantActionMonitoringControlCertification;
const platform = certification.platform;

export const AssistantActionMonitoringControlFreezePublicApi = Object.freeze({
  publicApiInventory: Object.freeze(
    platform.publicApiSurface.map((exportName, index) => Object.freeze({
      apiIdentifier:
        `ASSISTANT-9:8/Api/${String(index + 1).padStart(2, "0")}`,
      exportName,
      sourcePhase: platform.identity.id,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    })),
  ),
  exportInventory: Object.freeze([
    "AssistantActionMonitoringControlFreeze",
    "AssistantActionMonitoringControlFreezeLock",
    "AssistantActionMonitoringControlFreezeStructuralMetadata",
    "AssistantActionMonitoringControlFreezeInventory",
    "AssistantActionMonitoringControlFreezeCompatibility",
    "AssistantActionMonitoringControlFreezePlatform",
    "AssistantActionMonitoringControlFreezePublicApi",
  ]),
  namespaceInventory: Object.freeze([
    "Identity",
    "Metadata",
    "Lock",
    "Inventory",
    "Compatibility",
    "Platform",
    "Public API",
    "Release",
  ]),
  consumerEntryDeclaration: Object.freeze({
    file: "assistantActionMonitoringControlPublicIndex.ts",
    declaration:
      "Sole supported Monitoring & Control consumer entry after Public Index.",
    freezeDependency: "assistantActionMonitoringControlFreeze.ts",
    lockIdentifier: ASSISTANT_9_MONITORING_CONTROL_LOCK,
    directArchitecturalImportsPermitted: false,
    metadataOnly: true,
    immutable: true,
  }),
  sourcePlatformPublicApi: platform.publicApiSurface,
  sourceCertification: certification.identity.id,
  metadataOnly: true,
  immutable: true,
} as const);
