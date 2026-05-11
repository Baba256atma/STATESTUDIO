import type { DomainExecutiveInsight, ExecutivePriority } from "./domainExecutiveIntelligence.ts";

export type ExecutivePriorityResult = {
  insightId: string;
  rank: number;
  priority: ExecutivePriority;
  urgencyScore: number;
};

function priorityWeight(priority: ExecutivePriority): number {
  if (priority === "critical") return 100;
  if (priority === "high") return 76;
  if (priority === "medium") return 52;
  return 28;
}

function postureBoost(posture: DomainExecutiveInsight["posture"]): number {
  if (posture === "critical") return 18;
  if (posture === "fragile") return 14;
  if (posture === "cautious") return 9;
  if (posture === "watch") return 4;
  return 0;
}

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, Math.round(Number.isFinite(value) ? value : 0)));
}

export function prioritizeExecutiveInsights(params: {
  insights: DomainExecutiveInsight[];
}): ExecutivePriorityResult[] {
  const insights = Array.isArray(params.insights) ? params.insights : [];
  return insights
    .map((insight) => ({
      insightId: insight.id,
      priority: insight.priority,
      urgencyScore: clampScore(
        priorityWeight(insight.priority) * 0.58 +
          postureBoost(insight.posture) +
          insight.confidence * 20 +
          Math.min(10, insight.relatedObjectIds.length * 3) +
          Math.min(8, (insight.relatedSignalIds?.length ?? 0) * 2)
      ),
    }))
    .sort((left, right) => {
      if (right.urgencyScore !== left.urgencyScore) return right.urgencyScore - left.urgencyScore;
      return left.insightId.localeCompare(right.insightId);
    })
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
}
