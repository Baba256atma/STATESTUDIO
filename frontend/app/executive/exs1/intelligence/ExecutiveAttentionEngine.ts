/**
 * Phase B — Attention rules from configurable metadata (no business math).
 */

import type { ExecutiveRuntimeEventType } from "../runtime/ExecutiveRuntimeEvents";
import type { ExecutiveSignalSeverity } from "./ExecutiveSignalTypes";

export type AttentionRule = {
  readonly eventType: ExecutiveRuntimeEventType;
  readonly severity: ExecutiveSignalSeverity;
  readonly deservesAttention: boolean;
};

/** Configurable metadata rules — not calculated thresholds. */
export const ATTENTION_RULES: readonly AttentionRule[] = Object.freeze([
  { eventType: "DecisionApproved", severity: "High", deservesAttention: true },
  { eventType: "ExecutionStarted", severity: "High", deservesAttention: true },
  { eventType: "SnapshotCreated", severity: "High", deservesAttention: true },
  { eventType: "MonitoringUpdated", severity: "Medium", deservesAttention: true },
  { eventType: "ScenarioSelected", severity: "Medium", deservesAttention: true },
  { eventType: "ScenarioUpdated", severity: "Medium", deservesAttention: true },
  { eventType: "ModeChanged", severity: "Medium", deservesAttention: true },
  { eventType: "PackSelected", severity: "Medium", deservesAttention: false },
  { eventType: "ObjectSelected", severity: "Low", deservesAttention: false },
  { eventType: "TimelineMoved", severity: "Low", deservesAttention: false },
  { eventType: "DataSourceSelected", severity: "Medium", deservesAttention: true },
  { eventType: "DataUpdated", severity: "Medium", deservesAttention: true },
  { eventType: "SimulationCompleted", severity: "High", deservesAttention: true },
  { eventType: "DecisionUpdated", severity: "Medium", deservesAttention: true },
  { eventType: "ExecutionUpdated", severity: "Medium", deservesAttention: true },
]);

export function resolveAttention(
  eventType: ExecutiveRuntimeEventType,
): AttentionRule {
  return (
    ATTENTION_RULES.find((r) => r.eventType === eventType) ?? {
      eventType,
      severity: "Low",
      deservesAttention: false,
    }
  );
}
