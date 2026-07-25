/** ASSISTANT-9:7 — Public Certification surface for Freeze consumers. */
import {
  AssistantActionMonitoringControlCertificationCriteria,
} from "./assistantActionMonitoringControlCertificationCriteria.ts";
import { AssistantActionMonitoringControlCertificationGates } from "./assistantActionMonitoringControlCertificationGates.ts";
import {
  AssistantActionMonitoringControlCertificationIdentity,
  AssistantActionMonitoringControlCertificationStructuralMetadata,
} from "./assistantActionMonitoringControlCertificationMetadata.ts";
import { AssistantActionMonitoringControlCertificationPlatform } from "./assistantActionMonitoringControlCertificationPlatform.ts";
import { AssistantActionMonitoringControlCertificationReport } from "./assistantActionMonitoringControlCertificationReport.ts";

export const AssistantActionMonitoringControlCertificationPublic =
  Object.freeze({
    identity: AssistantActionMonitoringControlCertificationIdentity,
    metadata:
      AssistantActionMonitoringControlCertificationStructuralMetadata,
    criteria: AssistantActionMonitoringControlCertificationCriteria,
    gates: AssistantActionMonitoringControlCertificationGates,
    platform: AssistantActionMonitoringControlCertificationPlatform,
    report: AssistantActionMonitoringControlCertificationReport,
    publicApiSurface: Object.freeze([
      "AssistantActionMonitoringControlCertification",
    ]),
    consumer:
      "ASSISTANT-9:8 Executive Action Monitoring & Control Freeze",
    runtimeExports: false,
    services: false,
    factories: false,
    executableCertificationEngine: false,
    metadataOnly: true,
    immutable: true,
  } as const);
