/**
 * Phase 4:5 — Scenario Intelligence aggregation.
 * Consumes operational, risk, and timeline snapshots — normalized inputs only.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { ImpactDirection } from "../dashboardVisualSignalContract.ts";
import { getDashboardSurfaceVisualBundle } from "../dashboardSurfaceVisualRegistry.ts";
import { getOperationalIntelligenceSnapshotForExecutiveSummary } from "../operationalIntelligence/operationalIntelligenceRuntime.ts";
import { getRiskIntelligenceSnapshotForExecutiveSummary } from "../riskIntelligence/riskIntelligenceRuntime.ts";
import { getTimelineIntelligenceSnapshotForExecutiveSummary } from "../timelineIntelligence/timelineIntelligenceRuntime.ts";
import {
  type ExpectedImpactCard,
  type ExpectedImpactLevel,
  type InvestigationPathEntry,
  type InvestigationPathsCard,
  type ScenarioComparisonContract,
  type ScenarioConfidenceCard,
  type ScenarioConfidenceLevel,
  type ScenarioContextSource,
  type ScenarioId,
  type ScenarioIntelligenceAggregationInput,
  type ScenarioIntelligenceSnapshot,
  type ScenarioIntelligenceSurfaceModel,
  type ScenarioPortfolioCard,
  type ScenarioPortfolioEntry,
  type TradeoffAnalysisCard,
  type TradeoffEntry,
  type WarRoomEscalationContract,
  CANONICAL_SCENARIO_INTELLIGENCE_OWNER,
  CANONICAL_SCENARIO_INTELLIGENCE_SURFACE_ID,
} from "./scenarioIntelligenceContract.ts";
import {
  reportExpectedImpact,
  reportInvestigationPath,
  reportScenarioConfidence,
  reportScenarioIntelligence,
  reportScenarioIntelligenceSurface,
  reportScenarioPortfolio,
  reportTradeoffAnalysis,
} from "./scenarioIntelligenceLogging.ts";

const CONFIDENCE_LABEL: Readonly<Record<ScenarioConfidenceLevel, string>> = Object.freeze({
  low: "Low Confidence",
  moderate: "Moderate Confidence",
  high: "High Confidence",
});

const IMPACT_LABEL: Readonly<Record<ExpectedImpactLevel, string>> = Object.freeze({
  low: "Low Impact",
  moderate: "Moderate Impact",
  high: "High Impact",
  transformational: "Transformational Impact",
});

const TRADEOFF_LABEL: Readonly<Record<TradeoffEntry["axis"], string>> = Object.freeze({
  cost_vs_speed: "Cost vs Speed",
  risk_vs_reward: "Risk vs Reward",
  short_term_vs_long_term: "Short-Term vs Long-Term",
  stability_vs_growth: "Stability vs Growth",
});

function collectContextSources(input: ScenarioIntelligenceAggregationInput): readonly ScenarioContextSource[] {
  const sources: ScenarioContextSource[] = ["operational", "risk", "timeline", "dashboard"];
  if (input.dashboardContext === "overview" || input.dashboardContext === "scenario") {
    sources.push("executive_summary");
  }
  return Object.freeze([...new Set(sources)]);
}

function resolveConfidence(
  context: DashboardContext,
  riskConfidence: string,
  timelineMomentum: string
): ScenarioConfidenceLevel {
  if (context === "scenario" && riskConfidence === "high") return "high";
  if (context === "war_room" || timelineMomentum === "blocked") return "low";
  if (riskConfidence === "low" || timelineMomentum === "slowing") return "low";
  if (riskConfidence === "high" && timelineMomentum === "accelerating") return "high";
  return "moderate";
}

function resolveExpectedImpact(
  context: DashboardContext,
  riskExposure: string,
  timelinePressure: string
): ExpectedImpactLevel {
  if (context === "war_room" || riskExposure === "critical") return "transformational";
  if (riskExposure === "high" || timelinePressure === "critical") return "high";
  if (riskExposure === "moderate" || timelinePressure === "high") return "moderate";
  return "low";
}

function buildPortfolio(
  context: DashboardContext,
  visualScores: readonly number[]
): ScenarioPortfolioCard {
  const labels: Readonly<Record<ScenarioId, string>> = Object.freeze({
    scenario_a: "Scenario A",
    scenario_b: "Scenario B",
    scenario_c: "Scenario C",
    additional: "Additional Scenarios",
  });
  const summaries: Readonly<Record<ScenarioId, string>> = Object.freeze({
    scenario_a: "Accelerated path with elevated risk exposure",
    scenario_b: "Balanced path with moderate tradeoffs",
    scenario_c: "Conservative path with extended timeline",
    additional: "Exploratory branches under review",
  });

  const ids: readonly ScenarioId[] = ["scenario_a", "scenario_b", "scenario_c", "additional"];
  const scenarios: ScenarioPortfolioEntry[] = ids.map((id, index) => {
    const score = visualScores[index] ?? 0.6;
    return Object.freeze({
      id,
      label: labels[id],
      summary: summaries[id],
      score,
      active: context === "scenario" ? index < 3 : index === 1,
    });
  });

  const activeCount = scenarios.filter((entry) => entry.active).length;
  const preferred = [...scenarios].sort((left, right) => right.score - left.score)[0];

  return Object.freeze({
    activeCount,
    totalCount: scenarios.length,
    scenarios: Object.freeze(scenarios),
    comparisonEntryPoint:
      context === "scenario"
        ? `Compare ${preferred?.label ?? "Scenario B"} against alternatives`
        : "Open scenario context to compare strategic paths",
  });
}

function buildTradeoffs(
  riskMomentum: string,
  timelineMomentum: string,
  demandDirection: string
): TradeoffAnalysisCard {
  const tradeoffs: TradeoffEntry[] = [
    Object.freeze({
      axis: "cost_vs_speed",
      label: TRADEOFF_LABEL.cost_vs_speed,
      indicator: timelineMomentum === "accelerating" ? "Higher Speed ↓ Higher Cost" : "Lower Cost ↓ Longer Timeline",
      summary:
        timelineMomentum === "accelerating"
          ? "Accelerated path compresses delivery at cost premium"
          : "Conservative pacing preserves budget headroom",
    }),
    Object.freeze({
      axis: "risk_vs_reward",
      label: TRADEOFF_LABEL.risk_vs_reward,
      indicator: riskMomentum === "worsening" ? "Higher Reward ↓ Higher Risk" : "Lower Risk ↓ Moderate Reward",
      summary:
        riskMomentum === "worsening"
          ? "Upside potential paired with elevated exposure"
          : "Risk containment limits upside capture",
    }),
    Object.freeze({
      axis: "short_term_vs_long_term",
      label: TRADEOFF_LABEL.short_term_vs_long_term,
      indicator: demandDirection === "growing" ? "Short-Term Gain ↓ Long-Term Stability" : "Long-Term Stability ↑ Near-Term Delay",
      summary:
        demandDirection === "growing"
          ? "Near-term pressure may defer structural investments"
          : "Long-horizon positioning prioritized over immediate gains",
    }),
    Object.freeze({
      axis: "stability_vs_growth",
      label: TRADEOFF_LABEL.stability_vs_growth,
      indicator: timelineMomentum === "blocked" ? "Stability ↑ Growth Constrained" : "Growth ↑ Stability Tradeoff",
      summary:
        timelineMomentum === "blocked"
          ? "Operational stability preserved; growth paths constrained"
          : "Growth-oriented scenarios introduce operational variability",
    }),
  ];

  return Object.freeze({
    tradeoffs: Object.freeze(tradeoffs),
    summary: "Competing objectives require executive path selection",
  });
}

function buildInvestigationPaths(
  context: DashboardContext,
  riskAttention: string,
  decisionWindow: string,
  confidence: ScenarioConfidenceLevel
): InvestigationPathsCard {
  const paths: InvestigationPathEntry[] = [];

  if (confidence === "low") {
    paths.push(
      Object.freeze({
        kind: "gather_more_data",
        label: "Gather More Data",
        priority: "high",
      })
    );
    paths.push(
      Object.freeze({
        kind: "review_assumptions",
        label: "Review Assumptions",
        priority: "high",
      })
    );
  } else {
    paths.push(
      Object.freeze({
        kind: "review_assumptions",
        label: "Review Assumptions",
        priority: "moderate",
      })
    );
    paths.push(
      Object.freeze({
        kind: "analyze_dependencies",
        label: "Analyze Dependencies",
        priority: "moderate",
      })
    );
  }

  if (riskAttention === "immediate_attention" || decisionWindow === "missed") {
    paths.push(
      Object.freeze({
        kind: "escalate_to_war_room",
        label: "Escalate To War Room",
        priority: "high",
      })
    );
  } else if (context === "scenario") {
    paths.push(
      Object.freeze({
        kind: "gather_more_data",
        label: "Gather More Data",
        priority: "low",
      })
    );
  }

  return Object.freeze({
    paths: Object.freeze(paths),
    summary: "Investigation paths guide executive reasoning — not automated decisions",
  });
}

function buildComparisonContract(
  context: DashboardContext,
  portfolio: ScenarioPortfolioCard
): ScenarioComparisonContract {
  const ranked = [...portfolio.scenarios].sort((left, right) => right.score - left.score);
  const top = ranked[0];
  const second = ranked[1];
  const third = ranked[2];

  if (context === "scenario" && top && second && third) {
    return Object.freeze({
      comparisonId: "scenario_a_vs_b_vs_c",
      mode: "triple",
      scenarioIds: Object.freeze([top.id, second.id, third.id]),
      summary: `${top.label} vs ${second.label} vs ${third.label}`,
      preferredScenarioId: top.id,
    });
  }

  const pairA = top?.id ?? "scenario_a";
  const pairB = second?.id ?? "scenario_b";
  return Object.freeze({
    comparisonId: "scenario_a_vs_b",
    mode: "pair",
    scenarioIds: Object.freeze([pairA, pairB]),
    summary: `${portfolio.scenarios.find((s) => s.id === pairA)?.label ?? "Scenario A"} vs ${portfolio.scenarios.find((s) => s.id === pairB)?.label ?? "Scenario B"}`,
    preferredScenarioId: top?.id ?? null,
  });
}

function buildWarRoomEscalation(
  context: DashboardContext,
  riskAttention: string,
  preferredScenarioId: ScenarioId | null
): WarRoomEscalationContract {
  const ready =
    riskAttention === "immediate_attention" || riskAttention === "investigate";
  return Object.freeze({
    escalationId: "escalate_scenario_to_war_room",
    sourceScenarioId: preferredScenarioId ?? "scenario_b",
    targetContext: "war_room",
    readiness: ready ? "ready" : context === "scenario" ? "pending_review" : "not_ready",
    summary: ready
      ? "Escalate Scenario → War Room Context"
      : "War Room escalation available after executive review",
  });
}

export function aggregateScenarioIntelligence(
  input: ScenarioIntelligenceAggregationInput
): ScenarioIntelligenceSurfaceModel {
  const feedInput = {
    dashboardContext: input.dashboardContext,
    normalizedContext: input.normalizedContext,
    selectedObjectId: input.selectedObjectId,
    selectedObjectLabel: input.selectedObjectLabel,
    timelineActive: input.timelineActive,
    objectsInScene: input.objectsInScene,
  };

  const operational = getOperationalIntelligenceSnapshotForExecutiveSummary({
    ...feedInput,
    signalCount: undefined,
  });
  const risk = getRiskIntelligenceSnapshotForExecutiveSummary(feedInput);
  const timeline = getTimelineIntelligenceSnapshotForExecutiveSummary(feedInput);

  const visualBundle = getDashboardSurfaceVisualBundle(CANONICAL_SCENARIO_INTELLIGENCE_SURFACE_ID);
  const scoreChart = visualBundle.microCharts.find(
    (chart) => chart.kind === "micro_bar" && chart.label === "Scenario Scores"
  );
  const visualScores =
    scoreChart?.kind === "micro_bar"
      ? scoreChart.values
      : ([0.72, 0.84, 0.68, 0.59] as const);

  const confidenceLevel = resolveConfidence(
    input.dashboardContext,
    risk.confidence.level,
    timeline.momentum.level
  );
  const impactLevel = resolveExpectedImpact(
    input.dashboardContext,
    risk.exposure.level,
    timeline.milestonePressure.level
  );

  const confidenceTrend: ImpactDirection =
    confidenceLevel === "high" ? "improving" : confidenceLevel === "low" ? "deteriorating" : "stable";
  const impactTrend: ImpactDirection =
    impactLevel === "transformational" || impactLevel === "high"
      ? "deteriorating"
      : impactLevel === "low"
        ? "improving"
        : "stable";

  const portfolio = buildPortfolio(input.dashboardContext, visualScores);
  const tradeoffs = buildTradeoffs(
    risk.momentum.momentum,
    timeline.momentum.level,
    operational.demandImpact.direction
  );
  const investigationPaths = buildInvestigationPaths(
    input.dashboardContext,
    risk.executiveAttention.status,
    timeline.decisionWindows.status,
    confidenceLevel
  );
  const comparisonContract = buildComparisonContract(input.dashboardContext, portfolio);

  const confidence: ScenarioConfidenceCard = Object.freeze({
    level: confidenceLevel,
    label: CONFIDENCE_LABEL[confidenceLevel],
    trend: confidenceTrend,
    summary:
      confidenceLevel === "high"
        ? "Scenario assumptions supported by converging intelligence signals"
        : confidenceLevel === "low"
          ? "Uncertainty elevated — assumptions require executive validation"
          : "Moderate evidence supports scenario comparison",
  });

  const expectedImpact: ExpectedImpactCard = Object.freeze({
    level: impactLevel,
    label: IMPACT_LABEL[impactLevel],
    trend: impactTrend,
    summary:
      impactLevel === "transformational"
        ? "Selected paths may reshape operational and risk posture"
        : impactLevel === "high"
          ? "Consequences span multiple intelligence domains"
          : "Impact contained within current planning horizon",
  });

  const warRoomEscalation = buildWarRoomEscalation(
    input.dashboardContext,
    risk.executiveAttention.status,
    comparisonContract.preferredScenarioId
  );

  const snapshot: ScenarioIntelligenceSnapshot = Object.freeze({
    portfolio,
    confidence,
    expectedImpact,
    tradeoffs,
    investigationPaths,
    comparisonContract,
    warRoomEscalation,
  });

  const model: ScenarioIntelligenceSurfaceModel = Object.freeze({
    surfaceId: CANONICAL_SCENARIO_INTELLIGENCE_SURFACE_ID,
    owner: CANONICAL_SCENARIO_INTELLIGENCE_OWNER,
    headline: "What could happen next?",
    snapshot,
    visualBundle,
    contextSources: collectContextSources(input),
  });

  reportScenarioIntelligence({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    version: "4.5.0",
    riskExposure: risk.exposure.level,
    timelineMomentum: timeline.momentum.level,
  });
  reportScenarioPortfolio(snapshot.portfolio);
  reportScenarioConfidence(snapshot.confidence);
  reportExpectedImpact(snapshot.expectedImpact);
  reportTradeoffAnalysis(snapshot.tradeoffs);
  reportInvestigationPath(snapshot.investigationPaths);
  reportScenarioIntelligenceSurface(model);

  return model;
}
