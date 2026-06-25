import { buildOperationalIntelligenceFeed } from "../../intelligence-integration/OperationalIntelligenceFeed.ts";
import type { OperationalIntelligenceFeedBuildInput } from "../../intelligence-integration/operationalIntelligenceFeedContract.ts";
import type { OperationalIntelligenceFeedView } from "../../intelligence-integration/operationalIntelligenceFeedContract.ts";
import {
  formatOperationalWorkspaceKpiSignals,
  getDashboardCriticalKpis,
  getDashboardKpiSummary,
  getDashboardWarningKpis,
} from "../../kpi/kpiDashboardIntegrationRuntime.ts";
import {
  formatOperationalWorkspaceOkrSignals,
  getDashboardCriticalObjectives,
  getDashboardOkrSummary,
  getDashboardWarningObjectives,
} from "../../okr/okrDashboardIntegrationRuntime.ts";
import {
  formatOperationalWorkspaceRiskSignals,
  getDashboardCriticalRisks,
  getDashboardExposedObjects,
  getDashboardHighRisks,
  getDashboardRiskSummary,
} from "../../risk/riskDashboardIntegrationRuntime.ts";
import {
  formatOperationalWorkspaceScenarioSignals,
  getWorkspaceScenarioWorkspaceSummary,
} from "../../scenario/scenarioWorkspaceIntegrationRuntime.ts";
import type {
  OperationalHealthLevel,
  OperationalIntelligenceSurfaceModel,
  OperationalPressureLevel,
} from "./operationalIntelligenceContract.ts";
import type { ImpactDirection } from "../dashboardVisualSignalContract.ts";

export type OperationalIntelligenceFeedAttachInput = OperationalIntelligenceFeedBuildInput;

export type OperationalIntelligenceSurfaceModelWithFeed = OperationalIntelligenceSurfaceModel &
  Readonly<{
    intelligenceFeed: OperationalIntelligenceFeedView | null;
  }>;

function healthLevelFromScore(score: number): OperationalHealthLevel {
  if (score < 40) return "critical";
  if (score < 55) return "degraded";
  if (score < 75) return "watch";
  return "healthy";
}

function pressureLevelFromScore(score: number): OperationalPressureLevel {
  if (score >= 75) return "critical";
  if (score >= 55) return "high";
  if (score >= 35) return "moderate";
  return "low";
}

function trendFromCounts(
  improving: number,
  declining: number
): ImpactDirection {
  if (declining > improving) return "deteriorating";
  if (improving > declining) return "improving";
  return "stable";
}

function enrichSnapshot(
  model: OperationalIntelligenceSurfaceModel,
  feed: OperationalIntelligenceFeedView
): OperationalIntelligenceSurfaceModel["snapshot"] {
  const { objectIntelligence, relationshipIntelligence, kpiIntelligence } = feed.snapshot;
  const workspaceSummary = getDashboardKpiSummary();
  const workspaceCriticalKpis = getDashboardCriticalKpis(workspaceSummary.workspaceId);
  const workspaceWarningKpis = getDashboardWarningKpis(workspaceSummary.workspaceId);
  const workspaceKpiSignalsActive = workspaceSummary.totalKpis > 0;
  const okrSummary = getDashboardOkrSummary(workspaceSummary.workspaceId);
  const workspaceCriticalObjectives = getDashboardCriticalObjectives(okrSummary.workspaceId);
  const workspaceWarningObjectives = getDashboardWarningObjectives(okrSummary.workspaceId);
  const workspaceOkrSignalsActive = okrSummary.totalObjectives > 0;
  const riskSummary = getDashboardRiskSummary(workspaceSummary.workspaceId);
  const workspaceCriticalRisks = getDashboardCriticalRisks(riskSummary.workspaceId);
  const workspaceHighRisks = getDashboardHighRisks(riskSummary.workspaceId);
  const workspaceExposedObjects = getDashboardExposedObjects(riskSummary.workspaceId);
  const workspaceRiskSignalsActive = riskSummary.totalRisks > 0;
  const scenarioSummary = getWorkspaceScenarioWorkspaceSummary(workspaceSummary.workspaceId);
  const workspaceScenarioSignalsActive = scenarioSummary.totalScenarios > 0;
  const workspaceSignalsActive =
    workspaceKpiSignalsActive ||
    workspaceOkrSignalsActive ||
    workspaceRiskSignalsActive ||
    workspaceScenarioSignalsActive;

  const recentSummaryParts = [
    workspaceKpiSignalsActive
      ? formatOperationalWorkspaceKpiSignals({
          summary: workspaceSummary,
          criticalKpis: workspaceCriticalKpis,
          warningKpis: workspaceWarningKpis,
        })
      : null,
    workspaceOkrSignalsActive
      ? formatOperationalWorkspaceOkrSignals({
          summary: okrSummary,
          criticalObjectives: workspaceCriticalObjectives,
          warningObjectives: workspaceWarningObjectives,
        })
      : null,
    workspaceRiskSignalsActive
      ? formatOperationalWorkspaceRiskSignals({
          summary: riskSummary,
          criticalRisks: workspaceCriticalRisks,
          highRisks: workspaceHighRisks,
          exposedObjects: workspaceExposedObjects,
        })
      : null,
    workspaceScenarioSignalsActive
      ? formatOperationalWorkspaceScenarioSignals({ summary: scenarioSummary })
      : null,
  ].filter(Boolean) as string[];

  return Object.freeze({
    health: Object.freeze({
      status: feed.objectHealth.primaryValue,
      level: healthLevelFromScore(objectIntelligence.averageHealthScore),
      trend: trendFromCounts(objectIntelligence.improvingCount, objectIntelligence.decliningCount),
      confidence:
        objectIntelligence.averageConfidenceScore >= 70
          ? "high"
          : objectIntelligence.averageConfidenceScore >= 45
            ? "moderate"
            : "low",
    }),
    activeObjects: Object.freeze({
      objectsInScene: objectIntelligence.objectCount,
      selectedObject: feed.objectTrend.primaryValue,
      requiringAttention: objectIntelligence.recommendedAttention.length,
      recentlyUpdated: objectIntelligence.improvingCount + objectIntelligence.decliningCount,
      summary: feed.objectTrend.secondaryValue,
    }),
    signals: Object.freeze({
      signalCount: workspaceSignalsActive
        ? workspaceSummary.totalKpis +
          okrSummary.totalObjectives +
          riskSummary.totalRisks +
          scenarioSummary.totalScenarios
        : feed.operationalKpiSignals.signalCount || kpiIntelligence.kpiCount,
      recentSummary:
        recentSummaryParts.length > 0
          ? recentSummaryParts.join(" · ")
          : feed.operationalKpiSignals.primaryValue,
      activityTrend: trendFromCounts(
        kpiIntelligence.topPerformingKpis.length,
        kpiIntelligence.topDecliningKpis.length
      ),
    }),
    pressure: Object.freeze({
      level: pressureLevelFromScore(relationshipIntelligence.averageRiskExposureScore),
      trend: trendFromCounts(
        relationshipIntelligence.topInfluencers.length,
        relationshipIntelligence.topRisks.length
      ),
      attentionStatus: feed.relationshipHealth.primaryValue,
    }),
    demandImpact: model.snapshot.demandImpact,
  });
}

export function attachOperationalIntelligenceFeed(
  model: OperationalIntelligenceSurfaceModel,
  input: OperationalIntelligenceFeedAttachInput = {}
): OperationalIntelligenceSurfaceModelWithFeed {
  const feed = buildOperationalIntelligenceFeed(input);

  if (feed.feedStatus !== "bound") {
    return Object.freeze({
      ...model,
      intelligenceFeed: null,
    });
  }

  return Object.freeze({
    ...model,
    snapshot: enrichSnapshot(model, feed),
    intelligenceFeed: feed,
  });
}
