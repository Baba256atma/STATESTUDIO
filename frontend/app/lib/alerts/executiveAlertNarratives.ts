import type { ExecutiveAlertLevel } from "./executiveAlertTypes.ts";

function clean(value: string | undefined): string {
  return String(value ?? "").trim() || "operational pressure";
}

export function buildExecutiveAlertTitle(params: {
  level: ExecutiveAlertLevel;
  focus?: string;
}): string {
  const focus = clean(params.focus);
  if (params.level === "critical") return `${focus} requires executive attention`;
  if (params.level === "urgent") return `${focus} crossed an executive attention threshold`;
  if (params.level === "attention") return `${focus} deserves executive attention`;
  return `${focus} remains visible for monitoring`;
}

export function buildExecutiveAlertSummary(params: {
  level: ExecutiveAlertLevel;
  focus?: string;
}): string {
  const focus = clean(params.focus);
  if (params.level === "critical") {
    return `${focus} is creating critical operational exposure and should remain in active executive view.`;
  }
  if (params.level === "urgent") {
    return `${focus} has escalated enough to warrant disciplined executive review.`;
  }
  if (params.level === "attention") {
    return `${focus} is elevated but can be handled through calm strategic monitoring.`;
  }
  return `${focus} is informational and should stay passive unless conditions change.`;
}

export function buildExecutiveAlertRationale(params: {
  level: ExecutiveAlertLevel;
  reason?: string;
}): string {
  const reason = clean(params.reason);
  if (params.level === "critical" || params.level === "urgent") return `Escalation is based on ${reason}.`;
  return `Visibility is based on ${reason}.`;
}

export function buildRecommendedAlertAttention(params: {
  level: ExecutiveAlertLevel;
  focus?: string;
}): string {
  const focus = clean(params.focus);
  if (params.level === "critical") return `Keep ${focus} in active executive review.`;
  if (params.level === "urgent") return `Review ${focus} before it expands further.`;
  if (params.level === "attention") return `Monitor ${focus} for sustained escalation.`;
  return `Keep ${focus} as passive context.`;
}
