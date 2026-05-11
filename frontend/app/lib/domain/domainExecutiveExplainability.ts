import type { DomainExecutiveInsight } from "./domainExecutiveIntelligence.ts";

function confidenceLabel(confidence: number): string {
  if (confidence >= 0.75) return "high";
  if (confidence >= 0.5) return "moderate";
  return "limited";
}

export function explainExecutiveInsight(params: {
  insight: DomainExecutiveInsight;
}): string {
  const insight = params.insight;
  const objectCount = insight.relatedObjectIds.length;
  const scenarioCount = insight.relatedScenarioIds?.length ?? 0;
  const signalCount = insight.relatedSignalIds?.length ?? 0;
  return `${insight.title} is ${insight.priority} priority because ${signalCount} risk signal${
    signalCount === 1 ? "" : "s"
  }, ${objectCount} object reference${objectCount === 1 ? "" : "s"}, and ${scenarioCount} scenario option${
    scenarioCount === 1 ? "" : "s"
  } support a ${insight.posture} posture with ${confidenceLabel(insight.confidence)} confidence.`;
}
