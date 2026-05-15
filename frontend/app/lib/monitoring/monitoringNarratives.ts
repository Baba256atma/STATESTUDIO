import type { MonitoringLifecycle, MonitoringStatus, MonitoringTrend } from "./executiveMonitoringTypes.ts";

function cleanFocus(value: string | undefined): string {
  const trimmed = String(value ?? "").trim();
  return trimmed || "operational pressure";
}

export function buildMonitoringTitle(params: {
  status: MonitoringStatus;
  focus?: string;
}): string {
  const focus = cleanFocus(params.focus);
  if (params.status === "critical") return `${focus} requires executive monitoring`;
  if (params.status === "elevated") return `${focus} remains elevated`;
  if (params.status === "watch") return `${focus} needs continued watch`;
  return `${focus} is stabilizing`;
}

export function buildMonitoringSummary(params: {
  status: MonitoringStatus;
  trend?: MonitoringTrend;
  focus?: string;
}): string {
  const focus = cleanFocus(params.focus);
  if (params.status === "critical") {
    return `${focus} remains a critical operational pressure and should stay visible to executive monitoring.`;
  }
  if (params.status === "elevated") {
    return `${focus} remains unresolved and continues to require calm executive attention.`;
  }
  if (params.trend === "improving") {
    return `${focus} is showing recovery signals, but continued monitoring is still useful.`;
  }
  if (params.trend === "volatile") {
    return `${focus} is moving unevenly and should be monitored for renewed escalation.`;
  }
  return `${focus} is within watch range and should be reviewed as conditions change.`;
}

export function buildMonitoringAttention(params: {
  status: MonitoringStatus;
  trend?: MonitoringTrend;
  focus?: string;
}): string {
  const focus = cleanFocus(params.focus);
  if (params.status === "critical") return `Keep ${focus} in active executive review.`;
  if (params.status === "elevated") return `Continue monitoring ${focus} for escalation.`;
  if (params.trend === "improving") return `Track whether ${focus} continues to stabilize.`;
  return `Maintain visibility into ${focus}.`;
}

export function describeMonitoringLifecycle(lifecycle: MonitoringLifecycle): string {
  if (lifecycle === "persistent") return "Pressure has persisted across recent operating context.";
  if (lifecycle === "active") return "Pressure is active and deserves current executive attention.";
  if (lifecycle === "recovering") return "Pressure is easing but should remain visible.";
  if (lifecycle === "resolved") return "Pressure is currently stable enough for passive monitoring.";
  return "Pressure is emerging and should be watched before it expands.";
}
