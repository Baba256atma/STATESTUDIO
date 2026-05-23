import type {
  BuildExecutiveCommandBarModelInput,
  ExecutiveCommandBarDecisionStatus,
  ExecutiveCommandBarFrsiStatus,
  ExecutiveCommandBarModel,
  ExecutiveCommandBarReadinessStatus,
  ExecutiveCommandBarScenarioStatus,
  ExecutiveDecisionStatusPhase,
  ExecutiveFrsiTrend,
  ExecutivePrioritySemantic,
  ExecutiveReadinessPhase,
  ExecutiveScenarioStatePhase,
} from "./executiveCommandBarTypes";
import {
  EXECUTIVE_COMMAND_BAR_ACTIONS,
  formatExecutiveDecisionStatusLabel,
  formatExecutiveFrsiTrendLabel,
  formatExecutiveReadinessLabel,
} from "./executiveCommandBarTypes";

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function fragilityScore(level: BuildExecutiveCommandBarModelInput["pipelineStatus"]["fragilityLevel"]): number | null {
  switch (level) {
    case "critical":
      return 88;
    case "high":
      return 72;
    case "medium":
      return 55;
    case "low":
      return 32;
    default:
      return null;
  }
}

function fragilityLabel(level: BuildExecutiveCommandBarModelInput["pipelineStatus"]["fragilityLevel"]): string {
  switch (level) {
    case "critical":
      return "Critical Risk";
    case "high":
      return "High Risk";
    case "medium":
      return "Moderate Risk";
    case "low":
      return "Low Risk";
    default:
      return "Assessing";
  }
}

function resolveFrsiTrend(
  pipelineStatus: BuildExecutiveCommandBarModelInput["pipelineStatus"]
): { trend: ExecutiveFrsiTrend; priority: ExecutivePrioritySemantic } {
  if (pipelineStatus.decisionTone === "urgent" || pipelineStatus.fragilityLevel === "critical") {
    return { trend: "increasing", priority: "critical" };
  }
  if (pipelineStatus.decisionTone === "cautious" || pipelineStatus.fragilityLevel === "high") {
    return { trend: "increasing", priority: "warning" };
  }
  if (pipelineStatus.fragilityLevel === "low") {
    return { trend: "decreasing", priority: "normal" };
  }
  return { trend: "stable", priority: "attention" };
}

function buildFrsiStatus(input: BuildExecutiveCommandBarModelInput): ExecutiveCommandBarFrsiStatus {
  const derivedScore =
    fragilityScore(input.pipelineStatus.fragilityLevel) ??
    (typeof input.pipelineStatus.confidenceScore === "number"
      ? clampScore((1 - input.pipelineStatus.confidenceScore) * 100)
      : null);
  const { trend, priority } = resolveFrsiTrend(input.pipelineStatus);
  return {
    score: derivedScore,
    fragilityLabel: fragilityLabel(input.pipelineStatus.fragilityLevel),
    trend,
    trendLabel: formatExecutiveFrsiTrendLabel(trend),
    priority,
  };
}

function inferScenarioState(name: string): { phase: ExecutiveScenarioStatePhase; label: string } {
  const normalized = name.toLowerCase();
  if (normalized.includes("recovery")) return { phase: "recovery", label: "Recovery Plan" };
  if (normalized.includes("surge") || normalized.includes("demand")) return { phase: "surge", label: "Demand Surge" };
  if (normalized.includes("delay") || normalized.includes("supplier")) return { phase: "active", label: "Active" };
  if (normalized.includes("baseline")) return { phase: "baseline", label: "Baseline" };
  return { phase: "review", label: "Under Review" };
}

function buildScenarioStatus(input: BuildExecutiveCommandBarModelInput): ExecutiveCommandBarScenarioStatus {
  const name =
    input.selectedScenarioTitle?.trim() ||
    input.scenarioName?.trim() ||
    input.scenarioStateLabel?.trim() ||
    input.domainLabel?.trim() ||
    "Baseline Scenario";
  const inferred = inferScenarioState(name);
  const stateLabel = input.scenarioStateLabel?.trim() || inferred.label;
  const priority: ExecutivePrioritySemantic =
    inferred.phase === "surge" || inferred.phase === "active" ? "attention" : "normal";
  return {
    name,
    stateLabel,
    statePhase: inferred.phase,
    priority,
  };
}

function inferDecisionPhase(input: BuildExecutiveCommandBarModelInput): ExecutiveDecisionStatusPhase {
  if (input.decisionPhaseOverride) return input.decisionPhaseOverride;
  const posture = String(input.pipelineStatus.decisionPosture ?? "").toLowerCase();
  if (!posture) {
    return input.pipelineStatus.status === "processing" ? "under_review" : "pending";
  }
  if (posture.includes("approve")) return "approved";
  if (posture.includes("reject")) return "rejected";
  if (posture.includes("execut")) return "executed";
  if (posture.includes("review")) return "under_review";
  if (posture.includes("recommend") || posture.includes("priorit")) return "recommended";
  return "recommended";
}

function buildDecisionStatus(input: BuildExecutiveCommandBarModelInput): ExecutiveCommandBarDecisionStatus {
  const phase = inferDecisionPhase(input);
  const priority: ExecutivePrioritySemantic =
    phase === "rejected" || phase === "pending"
      ? "attention"
      : phase === "recommended"
        ? "normal"
        : "normal";
  return {
    phase,
    label: formatExecutiveDecisionStatusLabel(phase),
    priority,
  };
}

function buildReadinessStatus(input: BuildExecutiveCommandBarModelInput): ExecutiveCommandBarReadinessStatus {
  if (input.readinessOverride) {
    return {
      phase: input.readinessOverride,
      label: formatExecutiveReadinessLabel(input.readinessOverride),
      priority:
        input.readinessOverride === "critical"
          ? "critical"
          : input.readinessOverride === "needs_attention"
            ? "warning"
            : input.readinessOverride === "ready"
              ? "normal"
              : "attention",
    };
  }

  const level = input.pipelineStatus.fragilityLevel;
  const status = input.pipelineStatus.status;
  if (status === "error" || level === "critical") {
    return { phase: "critical", label: formatExecutiveReadinessLabel("critical"), priority: "critical" };
  }
  if (status === "processing" || level === "high") {
    return {
      phase: "needs_attention",
      label: formatExecutiveReadinessLabel("needs_attention"),
      priority: "warning",
    };
  }
  if (status === "ready" && (level === "medium" || level === "low")) {
    return { phase: "ready", label: formatExecutiveReadinessLabel("ready"), priority: "normal" };
  }
  return { phase: "monitoring", label: formatExecutiveReadinessLabel("monitoring"), priority: "attention" };
}

function buildMiniInsight(input: BuildExecutiveCommandBarModelInput): string | null {
  const line =
    input.pipelineStatus.insightLine?.trim() ||
    input.pipelineStatus.summary?.trim() ||
    input.pipelineStatus.decisionNextMove?.trim() ||
    null;
  if (!line) return null;
  return line.length > 120 ? `${line.slice(0, 119)}…` : line;
}

export function buildExecutiveCommandBarModel(input: BuildExecutiveCommandBarModelInput): ExecutiveCommandBarModel {
  return {
    frsi: buildFrsiStatus(input),
    scenario: buildScenarioStatus(input),
    decision: buildDecisionStatus(input),
    readiness: buildReadinessStatus(input),
    miniInsight: buildMiniInsight(input),
    actions: EXECUTIVE_COMMAND_BAR_ACTIONS.map((action) => action.id),
  };
}
