import type { ExecutiveAlert } from "./executiveAlertTypes.ts";

function levelRank(level: ExecutiveAlert["level"]): number {
  if (level === "critical") return 4;
  if (level === "urgent") return 3;
  if (level === "attention") return 2;
  return 1;
}

function signature(alert: ExecutiveAlert): string {
  return [
    alert.domainId ?? "",
    alert.title.trim().toLowerCase(),
    alert.relatedObjectIds.slice().sort().join(","),
  ].join("|");
}

export function suppressExecutiveAlerts(params: {
  alerts: ExecutiveAlert[];
  previousAlerts?: ExecutiveAlert[];
  maxAlerts?: number;
}): ExecutiveAlert[] {
  const maxAlerts = params.maxAlerts ?? 5;
  const previousBySignature = new Map((params.previousAlerts ?? []).map((alert) => [signature(alert), alert]));
  const bySignature = new Map<string, ExecutiveAlert>();

  for (const alert of params.alerts) {
    if (alert.level === "info" && (alert.confidence ?? 0) < 0.55) continue;
    const key = signature(alert);
    const previous = previousBySignature.get(key);
    const candidate = previous && levelRank(previous.level) >= levelRank(alert.level)
      ? { ...alert, id: previous.id, title: previous.title, summary: previous.summary }
      : alert;
    const current = bySignature.get(key);
    if (!current || levelRank(candidate.level) > levelRank(current.level) || (candidate.confidence ?? 0) > (current.confidence ?? 0)) {
      bySignature.set(key, candidate);
    }
  }

  return Array.from(bySignature.values())
    .sort((left, right) => {
      if (levelRank(right.level) !== levelRank(left.level)) return levelRank(right.level) - levelRank(left.level);
      if ((right.confidence ?? 0) !== (left.confidence ?? 0)) return (right.confidence ?? 0) - (left.confidence ?? 0);
      return left.id.localeCompare(right.id);
    })
    .slice(0, maxAlerts);
}
