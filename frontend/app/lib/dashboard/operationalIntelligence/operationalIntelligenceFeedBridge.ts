import { buildOperationalIntelligenceFeed } from "../../intelligence-integration/OperationalIntelligenceFeed.ts";
import type { OperationalIntelligenceFeedBuildInput } from "../../intelligence-integration/operationalIntelligenceFeedContract.ts";
import type { OperationalIntelligenceFeedView } from "../../intelligence-integration/operationalIntelligenceFeedContract.ts";
import {
  formatOperationalWorkspaceKpiSignals,
  getDashboardCriticalKpis,
  getDashboardKpiSummary,
  getDashboardWarningKpis,
} from "../../kpi/kpiDashboardIntegrationRuntime.ts";
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
  const workspaceSignalsActive = workspaceSummary.totalKpis > 0;

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
        ? workspaceSummary.totalKpis
        : feed.operationalKpiSignals.signalCount || kpiIntelligence.kpiCount,
      recentSummary: workspaceSignalsActive
        ? formatOperationalWorkspaceKpiSignals({
            summary: workspaceSummary,
            criticalKpis: workspaceCriticalKpis,
            warningKpis: workspaceWarningKpis,
          })
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
