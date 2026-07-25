/** ASSISTANT-9:7 — Certification platform summary derived from Platform. */
import { AssistantActionMonitoringControlPlatform } from "./assistantActionMonitoringControlPlatform.ts";
import {
  AssistantActionMonitoringControlCertificationCriteria,
} from "./assistantActionMonitoringControlCertificationCriteria.ts";
import { AssistantActionMonitoringControlCertificationGates } from "./assistantActionMonitoringControlCertificationGates.ts";
import {
  AssistantActionMonitoringControlCertificationIdentity,
  AssistantActionMonitoringControlCertificationStructuralMetadata,
} from "./assistantActionMonitoringControlCertificationMetadata.ts";

export const AssistantActionMonitoringControlCertificationPlatform =
  Object.freeze({
    identity: AssistantActionMonitoringControlCertificationIdentity,
    sourcePlatform: AssistantActionMonitoringControlPlatform.identity,
    totalCertificationCriteria:
      AssistantActionMonitoringControlCertificationCriteria.length,
    totalCertificationGates:
      AssistantActionMonitoringControlCertificationGates.length,
    certificationStatus: "Certified",
    certificationVersion:
      AssistantActionMonitoringControlCertificationIdentity.version,
    freezeReadiness: "ReadyForFreeze",
    releaseReadiness: "ReadyForRelease",
    platformGuaranteeCount:
      AssistantActionMonitoringControlPlatform.statistics
        .platformGuaranteeCount,
    platformCompatibilityCount:
      AssistantActionMonitoringControlPlatform.statistics.compatibilityCount,
    platformInventoryTotals:
      AssistantActionMonitoringControlPlatform.inventory.totals,
    metadata:
      AssistantActionMonitoringControlCertificationStructuralMetadata,
    metadataOnly: true,
    immutable: true,
  } as const);
