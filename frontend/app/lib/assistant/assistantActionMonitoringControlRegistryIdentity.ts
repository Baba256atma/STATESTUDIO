/** ASSISTANT-9:2 — Canonical Registry identity. */
import type {
  AssistantActionMonitoringControlRegistryReadiness,
  AssistantActionMonitoringControlRegistryStatus,
} from "./assistantActionMonitoringControlRegistryTypes.ts";

export const AssistantActionMonitoringControlRegistryIdentity = Object.freeze({
  id: "ASSISTANT-9:2/ExecutiveActionMonitoringControlRegistry",
  name: "Assistant Executive Action Monitoring & Control Registry",
  phaseId: "ASSISTANT-9:2",
  namespace: "nexora.assistant.executive-action-monitoring-control.registry",
  version: "1.0.0",
  status: "Registry" as AssistantActionMonitoringControlRegistryStatus,
  stage: "ReadyForModel" as AssistantActionMonitoringControlRegistryReadiness,
  readiness: "ReadyForModel" as AssistantActionMonitoringControlRegistryReadiness,
  canonical: true,
  mutable: false,
  sourceFoundation:
    "ASSISTANT-9:1/ExecutiveActionMonitoringControlFoundation",
  metadataOnly: true,
  immutable: true,
} as const);
