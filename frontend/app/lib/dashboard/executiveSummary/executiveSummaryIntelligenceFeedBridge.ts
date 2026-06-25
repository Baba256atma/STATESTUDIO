import { buildExecutiveSummaryIntelligenceFeed } from "../../intelligence-integration/ExecutiveSummaryIntelligenceFeed.ts";
import type { ExecutiveSummaryIntelligenceFeedBuildInput } from "../../intelligence-integration/executiveSummaryIntelligenceFeedContract.ts";
import {
  formatDashboardKpiSummaryPrimary,
  formatDashboardKpiSummarySecondary,
  getDashboardKpiSummary,
} from "../../kpi/kpiDashboardIntegrationRuntime.ts";
import {
  formatDashboardOkrSummaryPrimary,
  formatDashboardOkrSummarySecondary,
  getDashboardOkrSummary,
} from "../../okr/okrDashboardIntegrationRuntime.ts";
import {
  formatDashboardRiskSummaryPrimary,
  formatDashboardRiskSummarySecondary,
  getDashboardRiskSummary,
} from "../../risk/riskDashboardIntegrationRuntime.ts";
import {
  formatWorkspaceScenarioSummaryPrimary,
  formatWorkspaceScenarioSummarySecondary,
  getWorkspaceScenarioWorkspaceSummary,
} from "../../scenario/scenarioWorkspaceIntegrationRuntime.ts";
import type {
  ExecutiveAttentionLevel,
  ExecutiveSummaryCard,
  ExecutiveSummarySurfaceModel,
} from "./executiveSummaryContract.ts";

export type ExecutiveSummaryIntelligenceFeedAttachInput = ExecutiveSummaryIntelligenceFeedBuildInput;

function attentionForHealth(score: number, decliningCount: number): ExecutiveAttentionLevel {
  if (score < 45 || decliningCount > 0) return "attention_required";
  if (score < 70) return "monitor";
  return "stable";
}

function attentionForRisk(riskScore: number): ExecutiveAttentionLevel {
  if (riskScore >= 75) return "attention_required";
  if (riskScore >= 50) return "monitor";
  return "stable";
}

function attentionForKpi(criticalCount: number, decliningCount: number): ExecutiveAttentionLevel {
  if (criticalCount > 0) return "attention_required";
  if (decliningCount > 0) return "monitor";
  return "stable";
}

function attentionForScenario(scenarioCount: number): ExecutiveAttentionLevel {
  if (scenarioCount >= 3) return "monitor";
  if (scenarioCount > 0) return "stable";
  return "unknown";
}

function replaceCard(
  cards: readonly ExecutiveSummaryCard[],
  kind: ExecutiveSummaryCard["kind"],
  next: ExecutiveSummaryCard
): readonly ExecutiveSummaryCard[] {
  return Object.freeze(cards.map((card) => (card.kind === kind ? next : card)));
}

function attentionForWorkspaceKpiSummary(input: {
  criticalCount: number;
  warningCount: number;
}): ExecutiveAttentionLevel {
  if (input.criticalCount > 0) return "attention_required";
  if (input.warningCount > 0) return "monitor";
  return "stable";
}

function attentionForWorkspaceOkrSummary(input: {
  criticalCount: number;
  warningCount: number;
}): ExecutiveAttentionLevel {
  if (input.criticalCount > 0) return "attention_required";
  if (input.warningCount > 0) return "monitor";
  return "stable";
}

function attentionForWorkspaceRiskSummary(input: {
  criticalCount: number;
  highCount: number;
}): ExecutiveAttentionLevel {
  if (input.criticalCount > 0) return "attention_required";
  if (input.highCount > 0) return "monitor";
  return "stable";
}

function attentionForWorkspaceScenarioSummary(input: {
  activeCount: number;
  draftCount: number;
  latestSimulationStatus: string | null;
}): ExecutiveAttentionLevel {
  if (input.activeCount === 0 && input.draftCount > 0) return "monitor";
  if (input.latestSimulationStatus === "completed") return "stable";
  if (input.activeCount > 0) return "stable";
  return "unknown";
}

export function attachWorkspaceScenarioDashboardSummary(
  model: ExecutiveSummarySurfaceModel
): ExecutiveSummarySurfaceModel {
  const summary = getWorkspaceScenarioWorkspaceSummary();
  if (summary.totalScenarios === 0) {
    return model;
  }

  const cards = replaceCard(
    model.cards,
    "executive_attention",
    Object.freeze({
      kind: "executive_attention",
      title: "Scenario Intelligence",
      primaryValue: formatWorkspaceScenarioSummaryPrimary(summary),
      secondaryValue: formatWorkspaceScenarioSummarySecondary(summary),
      attention: attentionForWorkspaceScenarioSummary(summary),
    })
  );

  return Object.freeze({
    ...model,
    cards,
  });
}

export function attachWorkspaceRiskDashboardSummary(
  model: ExecutiveSummarySurfaceModel
): ExecutiveSummarySurfaceModel {
  const summary = getDashboardRiskSummary();
  if (summary.totalRisks === 0) {
    return model;
  }

  const cards = replaceCard(
    model.cards,
    "active_objects",
    Object.freeze({
      kind: "active_objects",
      title: "Risk Intelligence",
      primaryValue: formatDashboardRiskSummaryPrimary(summary),
      secondaryValue: formatDashboardRiskSummarySecondary(summary),
      attention: attentionForWorkspaceRiskSummary(summary),
    })
  );

  return Object.freeze({
    ...model,
    cards,
  });
}

export function attachWorkspaceOkrDashboardSummary(
  model: ExecutiveSummarySurfaceModel
): ExecutiveSummarySurfaceModel {
  const summary = getDashboardOkrSummary();
  if (summary.totalObjectives === 0) {
    return model;
  }

  const cards = replaceCard(
    model.cards,
    "executive_attention",
    Object.freeze({
      kind: "executive_attention",
      title: "OKR Intelligence",
      primaryValue: formatDashboardOkrSummaryPrimary(summary),
      secondaryValue: formatDashboardOkrSummarySecondary(summary),
      attention: attentionForWorkspaceOkrSummary(summary),
    })
  );

  return Object.freeze({
    ...model,
    cards,
  });
}

export function attachWorkspaceKpiDashboardSummary(
  model: ExecutiveSummarySurfaceModel
): ExecutiveSummarySurfaceModel {
  const summary = getDashboardKpiSummary();
  if (summary.totalKpis === 0) {
    return model;
  }

  const cards = replaceCard(
    model.cards,
    "active_signals",
    Object.freeze({
      kind: "active_signals",
      title: "KPI Intelligence",
      primaryValue: formatDashboardKpiSummaryPrimary(summary),
      secondaryValue: formatDashboardKpiSummarySecondary(summary),
      attention: attentionForWorkspaceKpiSummary(summary),
    })
  );

  return Object.freeze({
    ...model,
    cards,
  });
}

export function attachExecutiveSummaryIntelligenceFeed(
  model: ExecutiveSummarySurfaceModel,
  input: ExecutiveSummaryIntelligenceFeedAttachInput = {}
): ExecutiveSummarySurfaceModel {
  const feed = buildExecutiveSummaryIntelligenceFeed(input);
  if (feed.feedStatus !== "bound") {
    return attachWorkspaceScenarioDashboardSummary(
      attachWorkspaceRiskDashboardSummary(
        attachWorkspaceOkrDashboardSummary(attachWorkspaceKpiDashboardSummary(model))
      )
    );
  }

  const { objectIntelligence, riskIntelligence, kpiIntelligence, scenarioIntelligence } = feed.snapshot;

  let cards = model.cards;
  cards = replaceCard(
    cards,
    "system_status",
    Object.freeze({
      kind: "system_status",
      title: feed.topHealthSignals.title,
      primaryValue: feed.topHealthSignals.primaryValue,
      secondaryValue: feed.topHealthSignals.secondaryValue,
      attention: attentionForHealth(
        objectIntelligence.averageHealthScore,
        objectIntelligence.decliningCount
      ),
    })
  );
  cards = replaceCard(
    cards,
    "active_objects",
    Object.freeze({
      kind: "active_objects",
      title: feed.topRisks.title,
      primaryValue: feed.topRisks.primaryValue,
      secondaryValue: feed.topRisks.secondaryValue,
      attention: attentionForRisk(riskIntelligence.propagationScore),
    })
  );
  cards = replaceCard(
    cards,
    "active_signals",
    Object.freeze({
      kind: "active_signals",
      title: feed.topKpiSignals.title,
      primaryValue: feed.topKpiSignals.primaryValue,
      secondaryValue: feed.topKpiSignals.secondaryValue,
      attention: attentionForKpi(
        kpiIntelligence.topCriticalKpis.length,
        kpiIntelligence.topDecliningKpis.length
      ),
    })
  );
  cards = replaceCard(
    cards,
    "executive_attention",
    Object.freeze({
      kind: "executive_attention",
      title: feed.topScenarioSignals.title,
      primaryValue: feed.topScenarioSignals.primaryValue,
      secondaryValue: feed.topScenarioSignals.secondaryValue,
      attention: attentionForScenario(scenarioIntelligence.scenarioCount),
    })
  );

  return attachWorkspaceScenarioDashboardSummary(
    attachWorkspaceRiskDashboardSummary(
      attachWorkspaceOkrDashboardSummary(
        attachWorkspaceKpiDashboardSummary(
          Object.freeze({
            ...model,
            cards,
          })
        )
      )
    )
  );
}
