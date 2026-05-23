/** E2:22 — Executive status intelligence contract (consume-only). */

import type { ExecutivePrioritySemantic, ExecutiveReadinessPhase } from "./executiveCommandBarTypes";

/** Future-ready snapshot for decision intelligence layers. */
export interface ExecutiveStatusSnapshot {
  frsi?: number;
  confidence?: number;
  readiness?: string;
  health?: string;
  headline?: string;
}

export type ExecutiveStatusSeverity = "normal" | "attention" | "warning" | "critical";

export type ExecutiveStatusChip = {
  id: "risk" | "confidence" | "readiness" | "scenario";
  label: string;
  severity: ExecutiveStatusSeverity;
};

export type ExecutiveStatusHudModel = {
  snapshot: ExecutiveStatusSnapshot;
  frsiScore: number | null;
  frsiTrendLabel: string;
  riskPosture: string;
  readinessLabel: string;
  readinessPhase: ExecutiveReadinessPhase | "unknown";
  confidenceDecision: string | null;
  confidenceAnalysis: string | null;
  confidenceScenario: string | null;
  healthLabel: string;
  scenarioLabel: string | null;
  headline: string;
  chips: ExecutiveStatusChip[];
  severity: ExecutiveStatusSeverity;
};

export type BuildExecutiveStatusHudModelInput = {
  pipelineStatus: import("../../screens/nexoraPipelineStatus").NexoraPipelineStatusUi;
  selectedScenarioTitle?: string | null;
  domainLabel?: string | null;
  scenarioConfidence?: number | null;
};

export function priorityToSeverity(priority: ExecutivePrioritySemantic): ExecutiveStatusSeverity {
  if (priority === "critical") return "critical";
  if (priority === "warning") return "warning";
  if (priority === "attention") return "attention";
  return "normal";
}

export function formatConfidencePercent(score: number | null | undefined): string | null {
  if (typeof score !== "number" || !Number.isFinite(score)) return null;
  const normalized = score <= 1 ? score * 100 : score;
  return `${Math.max(0, Math.min(100, Math.round(normalized)))}%`;
}

export function resolveOperationalHealthLabel(input: {
  readinessPhase: ExecutiveReadinessPhase | "unknown";
  fragilityLevel: BuildExecutiveStatusHudModelInput["pipelineStatus"]["fragilityLevel"];
}): { label: string; severity: ExecutiveStatusSeverity } {
  if (input.readinessPhase === "critical" || input.fragilityLevel === "critical") {
    return { label: "Critical", severity: "critical" };
  }
  if (input.readinessPhase === "needs_attention" || input.fragilityLevel === "high") {
    return { label: "Warning", severity: "warning" };
  }
  if (input.readinessPhase === "monitoring" || input.fragilityLevel === "medium") {
    return { label: "Attention", severity: "attention" };
  }
  if (input.readinessPhase === "ready" && (input.fragilityLevel === "low" || input.fragilityLevel === null)) {
    return { label: "Healthy", severity: "normal" };
  }
  return { label: "Unknown", severity: "attention" };
}
