import { buildExecutiveCommandBarModel } from "./buildExecutiveCommandBarModel";
import type {
  BuildExecutiveStatusHudModelInput,
  ExecutiveStatusChip,
  ExecutiveStatusHudModel,
  ExecutiveStatusSnapshot,
} from "./executiveStatusTypes";
import {
  formatConfidencePercent,
  priorityToSeverity,
  resolveOperationalHealthLabel,
} from "./executiveStatusTypes";

function oneLineHeadline(value: string | null | undefined, fallback: string): string {
  const line = value?.replace(/\s+/g, " ").trim();
  if (!line) return fallback;
  return line.length > 96 ? `${line.slice(0, 95)}…` : line;
}

function buildHeadline(input: BuildExecutiveStatusHudModelInput, commandBarMiniInsight: string | null): string {
  return oneLineHeadline(
    commandBarMiniInsight ??
      input.pipelineStatus.insightLine ??
      input.pipelineStatus.trustSummaryLine ??
      input.pipelineStatus.summary,
    "Executive situational awareness initializing."
  );
}

function buildConfidenceAnalysisLabel(
  confidenceScore: number | null,
  confidenceTier: BuildExecutiveStatusHudModelInput["pipelineStatus"]["confidenceTier"]
): string | null {
  const percent = formatConfidencePercent(confidenceScore);
  if (percent) return percent;
  if (!confidenceTier) return null;
  return confidenceTier.charAt(0).toUpperCase() + confidenceTier.slice(1);
}

/** Aggregates existing pipeline + command bar status into the E2:22 HUD model. */
export function buildExecutiveStatusHudModel(input: BuildExecutiveStatusHudModelInput): ExecutiveStatusHudModel {
  const commandBar = buildExecutiveCommandBarModel({
    pipelineStatus: input.pipelineStatus,
    selectedScenarioTitle: input.selectedScenarioTitle,
    domainLabel: input.domainLabel,
    scenarioName: input.domainLabel,
  });

  const health = resolveOperationalHealthLabel({
    readinessPhase: commandBar.readiness.phase,
    fragilityLevel: input.pipelineStatus.fragilityLevel,
  });

  const confidenceDecision = formatConfidencePercent(input.pipelineStatus.confidenceScore);
  const confidenceAnalysis = buildConfidenceAnalysisLabel(
    input.pipelineStatus.confidenceScore,
    input.pipelineStatus.confidenceTier
  );
  const confidenceScenario = formatConfidencePercent(input.scenarioConfidence);

  const headline = buildHeadline(input, commandBar.miniInsight);
  const scenarioLabel = commandBar.scenario.name?.trim() || null;

  const chips: ExecutiveStatusChip[] = [
    {
      id: "risk",
      label: commandBar.frsi.fragilityLabel,
      severity: priorityToSeverity(commandBar.frsi.priority),
    },
    {
      id: "confidence",
      label: confidenceDecision ? `Confidence ${confidenceDecision}` : "Confidence Unknown",
      severity: confidenceDecision ? priorityToSeverity("normal") : "attention",
    },
    {
      id: "readiness",
      label: commandBar.readiness.label,
      severity: priorityToSeverity(commandBar.readiness.priority),
    },
    {
      id: "scenario",
      label: scenarioLabel ?? "Scenario Pending",
      severity: priorityToSeverity(commandBar.scenario.priority),
    },
  ];

  const snapshot: ExecutiveStatusSnapshot = {
    frsi: commandBar.frsi.score ?? undefined,
    confidence: typeof input.pipelineStatus.confidenceScore === "number"
      ? Math.round(
          (input.pipelineStatus.confidenceScore <= 1
            ? input.pipelineStatus.confidenceScore
            : input.pipelineStatus.confidenceScore / 100) * 100
        )
      : undefined,
    readiness: commandBar.readiness.label,
    health: health.label,
    headline,
  };

  const severity = [commandBar.frsi.priority, commandBar.readiness.priority, health.severity].includes("critical")
    ? "critical"
    : [commandBar.frsi.priority, commandBar.readiness.priority, health.severity].includes("warning")
      ? "warning"
      : [commandBar.frsi.priority, commandBar.readiness.priority, health.severity].includes("attention")
        ? "attention"
        : "normal";

  return {
    snapshot,
    frsiScore: commandBar.frsi.score,
    frsiTrendLabel: commandBar.frsi.trendLabel,
    riskPosture: commandBar.frsi.fragilityLabel,
    readinessLabel: commandBar.readiness.label,
    readinessPhase: commandBar.readiness.phase,
    confidenceDecision,
    confidenceAnalysis,
    confidenceScenario,
    healthLabel: health.label,
    scenarioLabel,
    headline,
    chips,
    severity,
  };
}
