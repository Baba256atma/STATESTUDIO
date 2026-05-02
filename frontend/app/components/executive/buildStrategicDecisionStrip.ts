import type { StrategicCommandAlert, StrategicCommandPriority, StrategicCommandState } from "../../lib/command/strategicCommandTypes";

export type StrategicDecisionStripOverrides = {
  decision_label?: string | null;
  recommended_action?: string | null;
  confidence_level?: string | null;
  risk_level?: "low" | "medium" | "high" | null;
  /** When set, replaces derived `key_alerts` for strip risk signal only (full list stays on parent). */
  key_alerts?: StrategicCommandAlert[] | null;
};

export type DecisionStripModel = {
  decision: string;
  action: string;
  confidence: string;
  riskTag: "low" | "medium" | "high" | null;
  impactHint: string | null;
  /** For dev log / debugging */
  source: "command_state" | "overrides";
};

const ANALYSIS_TONE = /trade-?offs?\s+remain|partially\s+reconstructed|context\s+is\s+still|still\s+forming|limited\s+visibility|material\s+uncertainty/i;

function clampLine(s: string, max: number) {
  const t = String(s ?? "").trim().replace(/\s+/g, " ");
  if (!t) return "";
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

function priorityDefaultHeadline(p: StrategicCommandPriority): string {
  switch (p) {
    case "compare":
      return "Compare before commitment";
    case "simulate":
      return "Validate outcome before acting";
    case "approve":
      return "Approval required to proceed";
    case "review":
      return "Review posture before next step";
    case "investigate":
      return "Investigate root cause first";
    case "escalate":
      return "Escalate — decision risk is elevated";
    case "stabilize":
      return "Stabilize execution path";
    case "act":
      return "Execute the recommended move";
    default:
      return "Decide next move";
  }
}

function priorityDefaultAction(p: StrategicCommandPriority, nextMove: string): string {
  const nm = clampLine(nextMove, 120);
  if (nm) return nm;
  switch (p) {
    case "compare":
      return "Run comparison across options";
    case "simulate":
      return "Run comparison simulation";
    case "approve":
      return "Clear approval dependency";
    default:
      return "Take the recommended executive step";
  }
}

function decisiveConfidence(s: StrategicCommandState): string {
  const raw = String(s.command_confidence_note ?? "").trim();
  if (!raw || ANALYSIS_TONE.test(raw) || /still\s+limited|forming/i.test(raw)) {
    if (s.priority === "compare") return "Medium — compare before you commit";
    if (s.priority === "simulate") return "Medium — simulation will raise confidence";
    if (s.priority === "approve") return "Low — approval is gating execution";
    if (s.priority === "review" || s.priority === "investigate") return "Medium — validate facts first";
    return "Medium — one execution step reduces uncertainty";
  }
  return clampLine(raw.replace(/\.+$/, ""), 96);
}

function riskFromAlerts(alerts: StrategicCommandAlert[]): "low" | "medium" | "high" | null {
  if (!alerts.length) return "low";
  if (alerts.some((a) => a.level === "critical")) return "high";
  if (alerts.some((a) => a.level === "warning")) return "medium";
  return "low";
}

function decisiveHeadline(s: StrategicCommandState, override: string | null | undefined): string {
  if (override && override.trim()) return clampLine(override, 140);
  const h = String(s.headline ?? "").trim();
  if (h && !ANALYSIS_TONE.test(h)) return clampLine(h, 140);
  return priorityDefaultHeadline(s.priority);
}

function decisiveAction(s: StrategicCommandState, override: string | null | undefined): string {
  if (override && override.trim()) return clampLine(override, 160);
  return priorityDefaultAction(s.priority, s.next_move);
}

function impactHintFromState(s: StrategicCommandState): string | null {
  const frag = clampLine(s.summary, 100);
  if (frag && !ANALYSIS_TONE.test(frag)) return frag;
  const rec = clampLine(s.command_recommendation, 100);
  if (rec && !ANALYSIS_TONE.test(rec)) return rec;
  if (s.priority === "compare") return "Comparison required before decision";
  if (s.priority === "simulate") return "Outcome path needs validation";
  return "No critical risk — proceed when ready";
}

/** Builds Type-C decision strip fields with decisive fallbacks (no panel routing changes). */
export function buildStrategicDecisionStrip(
  s: StrategicCommandState,
  overrides?: StrategicDecisionStripOverrides | null
): DecisionStripModel {
  const hasOverrides = Boolean(
    overrides?.decision_label?.trim() ||
      overrides?.recommended_action?.trim() ||
      overrides?.confidence_level?.trim() ||
      overrides?.risk_level ||
      (overrides?.key_alerts && overrides.key_alerts.length > 0)
  );

  const alertPool = overrides?.key_alerts?.length ? overrides.key_alerts : s.alerts;
  const riskTag = overrides?.risk_level ?? riskFromAlerts(alertPool);

  return {
    decision: decisiveHeadline(s, overrides?.decision_label),
    action: decisiveAction(s, overrides?.recommended_action),
    confidence: overrides?.confidence_level?.trim()
      ? clampLine(overrides.confidence_level, 96)
      : decisiveConfidence(s),
    riskTag,
    impactHint: impactHintFromState(s),
    source: hasOverrides ? "overrides" : "command_state",
  };
}

export function sortAlertsBySeverity(alerts: StrategicCommandAlert[]): StrategicCommandAlert[] {
  const rank: Record<StrategicCommandAlert["level"], number> = { critical: 0, warning: 1, info: 2 };
  return [...alerts].sort((a, b) => rank[a.level] - rank[b.level]);
}
