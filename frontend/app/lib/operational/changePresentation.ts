import type {
  OperationalChangeRecord,
  OperationalChangeSeverity,
  OperationalChangeSummary,
  OperationalChangeType,
} from "./changeDetectionTypes.ts";
import type { MonitoringPresentationTone } from "./monitoringPresentation.ts";

const CHANGE_LABELS: Record<OperationalChangeType, string> = {
  new_signal: "New signal",
  resolved_signal: "Resolved signal",
  severity_increase: "Severity increased",
  severity_decrease: "Severity decreased",
  trend_change: "Trend shift",
  status_change: "Status shift",
  object_added: "Object entered risk set",
  object_removed: "Object left risk set",
  stable: "Stable signal",
};

function isOperationalChangeType(value: string): value is OperationalChangeType {
  return value in CHANGE_LABELS;
}

/** Human-readable label for a change type; unknown values fall back safely. */
export function getOperationalChangeLabel(changeType: OperationalChangeType | string): string {
  const raw = typeof changeType === "string" ? changeType.trim() : String(changeType);
  if (!raw) return "Operational update";
  if (isOperationalChangeType(raw)) return CHANGE_LABELS[raw];
  return "Operational update";
}

/** Maps change-record severity to presentation tone tokens (no JSX). */
export function getOperationalChangeTone(changeSeverity: OperationalChangeSeverity | string): MonitoringPresentationTone {
  const s = typeof changeSeverity === "string" ? changeSeverity.trim().toLowerCase() : changeSeverity;
  switch (s) {
    case "critical":
      return "critical";
    case "high":
      return "negative";
    case "medium":
      return "caution";
    case "low":
      return "neutral";
    default:
      return "neutral";
  }
}

/**
 * Aggregate tone for the change summary (degradation vs recovery vs stable vs attention).
 */
export function getOperationalChangeSummaryTone(summary: OperationalChangeSummary): MonitoringPresentationTone {
  const { totalChanges, criticalChanges, worseningCount, improvingCount } = summary;
  if (totalChanges === 0 && criticalChanges === 0) return "neutral";
  if (criticalChanges > 0) return "critical";
  if (worseningCount > improvingCount) return "negative";
  if (improvingCount > worseningCount) return "positive";
  if (worseningCount === improvingCount && worseningCount > 0) return "caution";
  return "neutral";
}

export function truncateOperationalText(text: string, maxChars: number): string {
  const t = typeof text === "string" ? text.trim() : "";
  if (!t) return "";
  const n = Math.max(8, Math.floor(maxChars));
  if (t.length <= n) return t;
  return `${t.slice(0, Math.max(1, n - 1))}…`;
}

/** One-line executive signal derived deterministically from the summary (no LLM). */
export function getOperationalExecutiveSignal(summary: OperationalChangeSummary): string {
  if (summary.totalChanges === 0 && summary.criticalChanges === 0) {
    return "Operational delta stable — no material changes since last observation.";
  }
  const parts: string[] = [];
  if (summary.criticalChanges > 0) parts.push(`${summary.criticalChanges} critical`);
  if (summary.worseningCount > 0) parts.push(`${summary.worseningCount} worsening`);
  if (summary.improvingCount > 0) parts.push(`${summary.improvingCount} improving`);
  if (summary.stableCount > 0) parts.push(`${summary.stableCount} stable`);
  if (summary.topChange?.objectId) {
    parts.push(`focus ${summary.topChange.objectId}`);
  } else if (summary.topChange) {
    parts.push(truncateOperationalText(summary.topChange.message, 56));
  }
  const joined = parts.join(" · ");
  if (joined) return truncateOperationalText(joined, 160);
  return truncateOperationalText(summary.executiveSummary, 160);
}

/** Compact headline for the top change row (object-aware, truncated). */
export function formatOperationalTopChangeLine(
  top: OperationalChangeRecord | undefined,
  maxChars: number
): string {
  if (!top) return "";
  const label = getOperationalChangeLabel(top.type);
  const obj = top.objectId ? ` · ${top.objectId}` : "";
  const msg = truncateOperationalText(top.message.trim(), 56);
  return truncateOperationalText(`${label}${obj} — ${msg}`, maxChars);
}
