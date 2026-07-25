/** ASSISTANT-9:1 — Immutable monitoring and control capabilities. */
import type { AssistantActionMonitoringControlCapabilityMetadata } from "./assistantActionMonitoringControlIdentity.ts";

const declarations = Object.freeze([
  [
    "Action Monitoring",
    "Architectural awareness of executive action monitoring contracts.",
  ],
  [
    "Progress Tracking",
    "Architectural awareness of monitoring progress observation metadata.",
  ],
  [
    "KPI Observation",
    "Architectural awareness of KPI observation metadata contracts.",
  ],
  [
    "Goal Observation",
    "Architectural awareness of goal observation metadata contracts.",
  ],
  [
    "Risk Observation",
    "Architectural awareness of risk observation metadata contracts.",
  ],
  [
    "Alert Detection",
    "Architectural awareness of alert definition metadata contracts.",
  ],
  [
    "Exception Observation",
    "Architectural awareness of exception observation metadata contracts.",
  ],
  [
    "Monitoring Aggregation",
    "Architectural awareness of monitoring aggregation metadata contracts.",
  ],
  [
    "Feedback Collection",
    "Architectural awareness of monitoring feedback metadata contracts.",
  ],
  [
    "Executive Status Reporting",
    "Architectural awareness of executive status reporting metadata.",
  ],
  [
    "Monitoring Snapshot Generation",
    "Architectural awareness of monitoring snapshot metadata contracts.",
  ],
  [
    "Monitoring Metadata Publication",
    "Architectural awareness of monitoring metadata publication contracts.",
  ],
] as const);

export const AssistantActionMonitoringControlCapabilities:
readonly AssistantActionMonitoringControlCapabilityMetadata[] = Object.freeze(
  declarations.map(([name, description], index) => Object.freeze({
    id: `ASSISTANT-9:1/Capability/${String(index + 1).padStart(2, "0")}`,
    name,
    description,
    order: index + 1,
    implemented: false,
    metadataOnly: true,
    immutable: true,
  })),
);
