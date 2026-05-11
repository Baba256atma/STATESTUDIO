import type { DomainExecutiveInsight, ExecutiveDecisionPosture } from "./domainExecutiveIntelligence.ts";

function postureWeight(posture: ExecutiveDecisionPosture): number {
  if (posture === "critical") return 5;
  if (posture === "fragile") return 4;
  if (posture === "cautious") return 3;
  if (posture === "watch") return 2;
  return 1;
}

export function buildExecutiveBriefing(params: {
  insights: DomainExecutiveInsight[];
}): string {
  const insights = Array.isArray(params.insights) ? params.insights : [];
  if (!insights.length) {
    return "No executive intelligence is available yet. Add domain structure, risk signals, or scenarios before briefing.";
  }

  const top = [...insights].sort((left, right) => {
    const postureDelta = postureWeight(right.posture) - postureWeight(left.posture);
    if (postureDelta !== 0) return postureDelta;
    return right.confidence - left.confidence;
  })[0];
  const action = top.recommendedActions[0] ?? "continue monitoring";
  const scenarioLine = top.relatedScenarioIds?.length
    ? "Mitigation scenarios are available for review."
    : "No strong mitigation scenario is attached yet.";
  return `${top.summary} Recommended action: ${action}. ${scenarioLine}`;
}
