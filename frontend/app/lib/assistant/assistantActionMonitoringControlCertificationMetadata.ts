/** ASSISTANT-9:7 — Certification identity and structural metadata. */
import { AssistantActionMonitoringControlPlatform } from "./assistantActionMonitoringControlPlatform.ts";

export type AssistantActionMonitoringControlCertificationOutcome =
  | "NotCertified"
  | "Certified"
  | "CertifiedWithNotes"
  | "CertificationBlocked";

export const AssistantActionMonitoringControlCertificationIdentity =
  Object.freeze({
    id: "ASSISTANT-9:7/ExecutiveActionMonitoringControlCertification",
    name:
      "Assistant Executive Action Monitoring & Control Certification",
    phaseId: "ASSISTANT-9:7",
    namespace:
      "nexora.assistant.executive-action-monitoring-control.certification",
    version: "1.0.0",
    status: "Certified",
    stage: "ReadyForFreeze",
    readiness: "ReadyForFreeze",
    canonical: true,
    mutable: false,
    sourcePlatform:
      "ASSISTANT-9:6/ExecutiveActionMonitoringControlPlatform",
    ownership: "Nexora Assistant",
    metadataOnly: true,
    immutable: true,
  } as const);

export const AssistantActionMonitoringControlCertificationOutcomes =
  Object.freeze([
    "NotCertified",
    "Certified",
    "CertifiedWithNotes",
    "CertificationBlocked",
  ] as const);

export const AssistantActionMonitoringControlCertificationStructuralMetadata =
  Object.freeze({
    certificationId:
      AssistantActionMonitoringControlCertificationIdentity.id,
    canonicalName:
      AssistantActionMonitoringControlCertificationIdentity.name,
    namespace:
      AssistantActionMonitoringControlCertificationIdentity.namespace,
    version: AssistantActionMonitoringControlCertificationIdentity.version,
    status: AssistantActionMonitoringControlCertificationIdentity.status,
    readiness:
      AssistantActionMonitoringControlCertificationIdentity.readiness,
    platformReference:
      AssistantActionMonitoringControlPlatform.identity.id,
    sourcePlatform: AssistantActionMonitoringControlPlatform.identity,
    outcomes: AssistantActionMonitoringControlCertificationOutcomes,
    requirements: Object.freeze([
      "Immutable",
      "Canonical",
      "Platform-derived",
      "Metadata-only",
      "Deterministic",
      "Versioned",
      "Freeze-ready",
    ]),
    responsibilities: Object.freeze([
      "Platform integrity",
      "Platform composition",
      "Manifest consistency",
      "Validation completeness",
      "Canonical identities",
      "Compatibility",
      "Architectural compliance",
      "Release readiness",
      "Freeze readiness",
    ]),
    metadataOnly: true,
    immutable: true,
  } as const);
