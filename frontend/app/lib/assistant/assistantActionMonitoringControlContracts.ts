/** ASSISTANT-9:1 — Immutable monitoring and control contracts. */
import type { AssistantActionMonitoringControlContractMetadata } from "./assistantActionMonitoringControlIdentity.ts";

const declarations = Object.freeze([
  [
    "Executive Action Monitor",
    "Canonical contract for executive action monitoring representation.",
  ],
  [
    "Monitoring Session",
    "Canonical contract for a monitoring session metadata boundary.",
  ],
  [
    "Monitoring State",
    "Canonical contract for descriptive monitoring state classification.",
  ],
  [
    "Monitoring Result",
    "Canonical contract for descriptive monitoring result metadata.",
  ],
  [
    "Control Decision",
    "Canonical contract for control decision metadata representation.",
  ],
  [
    "Alert Definition",
    "Canonical contract for alert definition metadata representation.",
  ],
  [
    "Exception Record",
    "Canonical contract for exception observation record metadata.",
  ],
  [
    "Progress Snapshot",
    "Canonical contract for progress snapshot observation metadata.",
  ],
  [
    "KPI Observation",
    "Canonical contract for KPI observation metadata representation.",
  ],
  [
    "Feedback Record",
    "Canonical contract for monitoring feedback record metadata.",
  ],
  [
    "Monitoring Policy",
    "Canonical contract for monitoring policy metadata representation.",
  ],
  [
    "Monitoring Context",
    "Canonical contract for monitoring context metadata representation.",
  ],
] as const);

export const AssistantActionMonitoringControlContracts:
readonly AssistantActionMonitoringControlContractMetadata[] = Object.freeze(
  declarations.map(([name, description], index) => Object.freeze({
    id: `ASSISTANT-9:1/Contract/${String(index + 1).padStart(2, "0")}`,
    name,
    description,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
