import type { ConfidenceLevel } from "../confidence/decisionConfidenceTypes.ts";
import type { StrategicCompressionPriority } from "./strategicCompressionTypes.ts";

function clean(value: string | undefined): string {
  return String(value ?? "").trim() || "operational pressure";
}

export function buildCompressedInsightTitle(params: {
  focus?: string;
  priority: StrategicCompressionPriority;
}): string {
  const focus = clean(params.focus);
  if (params.priority === "critical") return `${focus} is the dominant executive pressure`;
  if (params.priority === "high") return `${focus} is a key executive pressure`;
  if (params.priority === "medium") return `${focus} deserves focused monitoring`;
  return `${focus} remains a lower-level watch item`;
}

export function buildCompressedInsightSummary(params: {
  focus?: string;
  objectCount?: number;
  signalCount?: number;
  priority: StrategicCompressionPriority;
}): string {
  const focus = clean(params.focus);
  const objectCount = params.objectCount ?? 0;
  const signalCount = params.signalCount ?? 0;
  if (params.priority === "critical") {
    return `${focus} is concentrating executive risk across ${objectCount || "multiple"} operational touchpoints.`;
  }
  if (params.priority === "high") {
    return `${focus} remains the clearest strategic pressure across ${signalCount || "several"} connected signals.`;
  }
  if (params.priority === "medium") {
    return `${focus} is visible enough to monitor without expanding executive noise.`;
  }
  return `${focus} is currently compressed into passive monitoring to preserve executive clarity.`;
}

export function buildExecutiveBriefingHeadline(params: {
  topTitle?: string;
  priority: StrategicCompressionPriority;
}): string {
  const title = clean(params.topTitle);
  if (params.priority === "critical") return `${title}.`;
  if (params.priority === "high") return `${title}.`;
  return `Current executive focus: ${title}.`;
}

export function buildExecutiveBriefingFocus(params: {
  focus?: string;
  confidence?: ConfidenceLevel;
}): string {
  const focus = clean(params.focus);
  if (params.confidence === "low") return `Clarify evidence around ${focus}.`;
  return `Keep executive attention on ${focus}.`;
}
