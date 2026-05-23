import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import { buildExecutiveReadinessIndicators, healthFromScore, indicatorScore, scoreFromHealth } from "./dashboardScoring.ts";
import { buildDashboardTrendSummary } from "./dashboardTrend.ts";
import { generateExecutiveReadinessSummary } from "./executiveSummary.ts";
import { analyzeExecutiveReadinessGaps } from "./gapAnalysis.ts";
import { classifyRuntimeHealthGaps } from "./healthClassification.ts";
import { assessStrategicLaunchReadiness } from "./launchAssessment.ts";
import type {
  ExecutiveDashboardHealthStatus,
  ExecutiveReadinessDashboardInput,
  ExecutiveReadinessDashboardModel,
  RuntimeHealthSurface,
  StrategicLaunchAssessment,
} from "./executiveReadinessDashboardTypes.ts";

function healthWorst(statuses: readonly ExecutiveDashboardHealthStatus[]): ExecutiveDashboardHealthStatus {
  const order: ExecutiveDashboardHealthStatus[] = ["critical", "degraded", "warning", "healthy"];
  return order.find((status) => statuses.includes(status)) ?? "critical";
}

function assessmentFromReadiness(input: ExecutiveReadinessDashboardInput): StrategicLaunchAssessment {
  if (input.readinessSnapshot?.evaluations.mvp.state === "ready") return "pilot_ready";
  if (input.readinessSnapshot?.evaluations.demo.state === "ready") return "demo_ready";
  if (input.readinessSnapshot?.evaluations.mvp.state === "blocked") return "not_ready";
  return "preparation_required";
}

function buildHealthSurface(params: {
  statuses: readonly ExecutiveDashboardHealthStatus[];
  derivedFrom: readonly string[];
}): RuntimeHealthSurface {
  const status = healthWorst(params.statuses);
  const confidence = Number((params.statuses.reduce((sum, item) => sum + scoreFromHealth(item), 0) / params.statuses.length).toFixed(2));
  return {
    status,
    explanation:
      status === "healthy"
        ? "Readiness, trust, stability, and validation signals are healthy."
        : "One or more platform readiness signals require executive attention.",
    derivedFrom: Object.freeze(params.derivedFrom),
    confidence,
  };
}

function healthySignals(input: ExecutiveReadinessDashboardInput): string[] {
  const signals: string[] = [];
  if (input.readinessSnapshot?.evaluations.mvp.state === "ready") signals.push("MVP readiness evidence is ready.");
  if (input.reliabilitySnapshot?.platformBehavingNormally) signals.push("Runtime trust is behaving normally.");
  if (input.interactionSnapshot?.summary.interfaceStable) signals.push("Executive interaction surface is stable.");
  if (input.readinessRegistry?.runtimeHealth.status === "healthy") signals.push("Runtime health surface is healthy.");
  return signals;
}

export function buildExecutiveReadinessDashboard(
  input: ExecutiveReadinessDashboardInput
): ExecutiveReadinessDashboardModel {
  const organizationId = input.organizationId?.trim() || input.readinessRegistry?.organizationId || input.reliabilitySnapshot?.organizationId || "nexora-default";
  const generatedAt = input.now ?? Date.now();
  const indicators = buildExecutiveReadinessIndicators(input);
  const gaps = analyzeExecutiveReadinessGaps(input);
  const classifications = classifyRuntimeHealthGaps(gaps);
  const launchAssessment = assessStrategicLaunchReadiness({ input, indicators, gaps });
  const readinessHealth = healthFromScore(indicatorScore(indicators, "readiness_score"));
  const trustHealth = healthFromScore(indicatorScore(indicators, "trust_score"));
  const stabilityHealth = healthFromScore(indicatorScore(indicators, "stability_score"));
  const validationHealth = healthFromScore(indicatorScore(indicators, "validation_coverage"));
  const operationalReadiness = healthWorst([readinessHealth, trustHealth, stabilityHealth]);
  const healthSurface = buildHealthSurface({
    statuses: [readinessHealth, trustHealth, stabilityHealth, validationHealth],
    derivedFrom: ["readiness_evaluation", "trust_evaluation", "stability_evaluation", "validation_systems", "consistency_systems"],
  });
  const executiveSummary = generateExecutiveReadinessSummary({
    launchAssessment,
    gaps,
    classifications,
    healthySignals: healthySignals(input),
  });
  const trend = buildDashboardTrendSummary({
    generatedAt,
    indicators,
    previousDashboards: input.previousDashboards,
  });
  const sourceSignatures = [
    input.readinessRegistry?.signature,
    input.readinessSnapshot?.signature,
    input.reliabilitySnapshot?.signature,
    input.interactionSnapshot?.signature,
  ].filter((item): item is string => Boolean(item));
  const signature = stableSignature([
    "d10-executive-readiness-dashboard",
    organizationId,
    launchAssessment,
    indicators.map((item) => [item.indicatorId, item.score]),
    gaps.map((item) => item.gapId),
    sourceSignatures,
  ]);

  return {
    dashboardId: stableSignature(["d10-executive-readiness-dashboard", organizationId]).slice(0, 56),
    organizationId,
    generatedAt,
    mvpReadiness: assessmentFromReadiness(input),
    deploymentReadiness: launchAssessment === "production_candidate" ? "production_candidate" : "preparation_required",
    operationalReadiness,
    executiveReadiness: launchAssessment,
    runtimeTrust: trustHealth,
    interactionStability: stabilityHealth,
    validationStatus: validationHealth,
    healthSurface,
    indicators,
    gaps,
    classifications,
    launchAssessment,
    executiveSummary,
    trend,
    sourceSignatures: Object.freeze(sourceSignatures),
    signature,
  };
}

