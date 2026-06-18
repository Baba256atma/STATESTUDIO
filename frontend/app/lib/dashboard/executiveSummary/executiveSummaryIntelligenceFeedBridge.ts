import { buildExecutiveSummaryIntelligenceFeed } from "../../intelligence-integration/ExecutiveSummaryIntelligenceFeed.ts";
import type { ExecutiveSummaryIntelligenceFeedBuildInput } from "../../intelligence-integration/executiveSummaryIntelligenceFeedContract.ts";
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

export function attachExecutiveSummaryIntelligenceFeed(
  model: ExecutiveSummarySurfaceModel,
  input: ExecutiveSummaryIntelligenceFeedAttachInput = {}
): ExecutiveSummarySurfaceModel {
  const feed = buildExecutiveSummaryIntelligenceFeed(input);
  if (feed.feedStatus !== "bound") {
    return model;
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

  return Object.freeze({
    ...model,
    cards,
  });
}
