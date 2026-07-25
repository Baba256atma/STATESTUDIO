/** ASSISTANT-9:3 — Model identity and structural metadata. */
import { AssistantActionMonitoringControlRegistry } from "./assistantActionMonitoringControlRegistry.ts";

export const AssistantActionMonitoringControlModelIdentity = Object.freeze({
  id: "ASSISTANT-9:3/ExecutiveActionMonitoringControlModel",
  name: "Assistant Executive Action Monitoring & Control Model",
  phaseId: "ASSISTANT-9:3",
  namespace: "nexora.assistant.executive-action-monitoring-control.model",
  version: "1.0.0",
  status: "Model",
  stage: "ReadyForValidation",
  readiness: "ReadyForValidation",
  canonical: true,
  mutable: false,
  sourceRegistry:
    "ASSISTANT-9:2/ExecutiveActionMonitoringControlRegistry",
  ownership: "Nexora Assistant",
  metadataOnly: true,
  immutable: true,
} as const);

export const AssistantActionMonitoringControlModelRequirements =
  Object.freeze([
    "Immutable",
    "Canonical",
    "Registry-derived",
    "Deterministic",
    "Metadata-only",
    "Versioned",
    "Validation-ready",
  ] as const);

export const AssistantActionMonitoringControlModelStructuralMetadata =
  Object.freeze({
    identity: AssistantActionMonitoringControlModelIdentity,
    namespace: AssistantActionMonitoringControlModelIdentity.namespace,
    version: AssistantActionMonitoringControlModelIdentity.version,
    ownership: "Nexora Assistant",
    readiness: AssistantActionMonitoringControlModelIdentity.readiness,
    sourceRegistry: AssistantActionMonitoringControlRegistry.identity,
    requirements: AssistantActionMonitoringControlModelRequirements,
    responsibilities: Object.freeze([
      "Executive Action Monitoring",
      "Monitoring Sessions",
      "Monitoring Results",
      "Progress Tracking",
      "KPI Observations",
      "Goal Observations",
      "Risk Observations",
      "Alerts",
      "Exceptions",
      "Control Decisions",
      "Feedback",
      "Monitoring Context",
    ]),
    compatibility: Object.freeze({
      registryCompatible: true,
      foundationCompatible: true,
      validationCompatible: true,
      freezeCompatible: true,
    }),
    defaultPolicyReference:
      AssistantActionMonitoringControlRegistry.collections
        .monitoringPolicies[0]?.id
      ?? AssistantActionMonitoringControlRegistry.identity.id,
    metadataOnly: true,
    immutable: true,
  } as const);
