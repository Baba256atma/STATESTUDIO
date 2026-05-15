import type { OperationalAlertEvaluationResult, OperationalAlertRecord, OperationalAlertSeverity } from "./alertRuleTypes.ts";
import type { MonitoringPresentationTone } from "./monitoringPresentation.ts";

const MAX_HEADLINE = 140;

export function getOperationalAlertSeverityLabel(severity: OperationalAlertSeverity): string {
  switch (severity) {
    case "critical":
      return "Critical";
    case "high":
      return "High";
    case "warning":
      return "Warning";
    case "info":
    default:
      return "Info";
  }
}

export function getOperationalAlertSeverityTone(severity: OperationalAlertSeverity): MonitoringPresentationTone {
  switch (severity) {
    case "critical":
      return "critical";
    case "high":
      return "negative";
    case "warning":
      return "caution";
    case "info":
    default:
      return "neutral";
  }
}

/** Single-line executive-facing line for HUD / summaries. */
export function getOperationalAlertHeadline(alert: OperationalAlertRecord): string {
  const base = `${alert.title} — ${alert.message}`.replace(/\s+/g, " ").trim();
  if (base.length <= MAX_HEADLINE) return base;
  return `${base.slice(0, MAX_HEADLINE - 1)}…`;
}

export function getOperationalExecutiveAlertTone(
  evaluation: Pick<OperationalAlertEvaluationResult, "criticalAlertCount" | "warningAlertCount">
): MonitoringPresentationTone {
  if (evaluation.criticalAlertCount > 0) return "critical";
  if (evaluation.warningAlertCount > 0) return "caution";
  return "neutral";
}
