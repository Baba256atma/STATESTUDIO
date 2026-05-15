import type { OperationalMonitoringStatus, OperationalTrend } from "./monitoringTypes.ts";

export type MonitoringPresentationTone = "neutral" | "positive" | "caution" | "negative" | "critical";

const STATUS_LABELS: Record<OperationalMonitoringStatus, string> = {
  idle: "Idle",
  watching: "Watching",
  degraded: "Degraded",
  critical: "Critical",
  recovering: "Recovering",
  unknown: "Unknown",
};

const TREND_LABELS: Record<OperationalTrend, string> = {
  improving: "Improving",
  stable: "Stable",
  degrading: "Degrading",
  volatile: "Volatile",
  unknown: "Unknown",
};

function isOperationalMonitoringStatus(value: string): value is OperationalMonitoringStatus {
  return (
    value === "idle" ||
    value === "watching" ||
    value === "degraded" ||
    value === "critical" ||
    value === "recovering" ||
    value === "unknown"
  );
}

function isOperationalTrend(value: string): value is OperationalTrend {
  return value === "improving" || value === "stable" || value === "degrading" || value === "volatile" || value === "unknown";
}

export function getMonitoringStatusLabel(status: OperationalMonitoringStatus | string): string {
  const key = typeof status === "string" ? status.trim() : "";
  if (!key || !isOperationalMonitoringStatus(key)) return "Unknown";
  return STATUS_LABELS[key];
}

export function getMonitoringTrendLabel(trend: OperationalTrend | string): string {
  const key = typeof trend === "string" ? trend.trim() : "";
  if (!key || !isOperationalTrend(key)) return "Unknown";
  return TREND_LABELS[key];
}

export function getMonitoringStatusTone(status: OperationalMonitoringStatus | string): MonitoringPresentationTone {
  const key = typeof status === "string" ? status.trim() : "";
  if (!key || !isOperationalMonitoringStatus(key)) return "neutral";
  switch (key) {
    case "idle":
    case "unknown":
      return "neutral";
    case "watching":
      return "caution";
    case "degraded":
      return "negative";
    case "critical":
      return "critical";
    case "recovering":
      return "positive";
    default:
      return "neutral";
  }
}

export function getMonitoringTrendTone(trend: OperationalTrend | string): MonitoringPresentationTone {
  const key = typeof trend === "string" ? trend.trim() : "";
  if (!key || !isOperationalTrend(key)) return "neutral";
  switch (key) {
    case "improving":
      return "positive";
    case "stable":
    case "unknown":
      return "neutral";
    case "degrading":
      return "negative";
    case "volatile":
      return "caution";
    default:
      return "neutral";
  }
}
