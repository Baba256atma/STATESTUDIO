/**
 * D7:1:5 — Executive-readable branch / future semantics.
 */

import type { ExecutiveScenarioKind } from "./branchingTypes.ts";

export const EXECUTIVE_SCENARIO_KIND_LABELS: Readonly<Record<ExecutiveScenarioKind, string>> = {
  aggressive_recovery: "Aggressive recovery",
  controlled_stabilization: "Controlled stabilization",
  delayed_escalation: "Delayed escalation",
  high_risk_expansion: "High-risk expansion",
  supply_recovery_success: "Supply recovery succeeds",
  partial_recovery_failure: "Partial recovery failure",
  global_crisis_escalation: "Global crisis escalation",
};

export function resolveExecutiveBranchLabel(input: {
  kind?: ExecutiveScenarioKind;
  label?: string;
  divergenceReason?: string;
}): string {
  if (input.kind && EXECUTIVE_SCENARIO_KIND_LABELS[input.kind]) {
    return EXECUTIVE_SCENARIO_KIND_LABELS[input.kind];
  }
  const custom = String(input.label ?? "").trim();
  if (custom) return custom;
  const reason = String(input.divergenceReason ?? "").trim();
  return reason || "Alternative operational future";
}

export function slugifyBranchId(label: string): string {
  return String(label ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
}
