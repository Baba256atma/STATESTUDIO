/**
 * MRP:10:4 — Executive Intelligence Briefing runtime.
 *
 * Read-only projection from existing workspace recommendation engine.
 * No reasoning, no analysis execution, no state ownership.
 */

import { getExecutiveWorkspaceEntry } from "../executiveWorkspaceRegistryContract.ts";
import type { ExecutiveWorkspaceId } from "../executiveWorkspaceRegistryContract.ts";
import { evaluateWorkspaceRecommendations } from "../../workspaces/workspaceRecommendationEngine.ts";
import type {
  WorkspaceQuickActionCardView,
  WorkspaceQuickActionPriority,
  WorkspaceRecommendationContext,
} from "../../workspaces/workspaceRecommendationContract.ts";
import {
  EXECUTIVE_BRIEFING_MAX_DISPLAY,
  type ExecutiveBriefingView,
  type ExecutiveIntelligenceBriefingView,
  type ExecutiveRecommendationActionKind,
  type ExecutiveRecommendationCardView,
  type ExecutiveRecommendationConfidence,
  type ExecutiveRecommendationType,
} from "./executiveBriefingContract.ts";

const WORKSPACE_ACTION_LABELS: Readonly<Partial<Record<ExecutiveWorkspaceId, string>>> =
  Object.freeze({
    analyze: "Open Analyze Mode",
    compare: "Open Compare Mode",
    scenario: "Open Scenario Mode",
    war_room: "Open War Room Mode",
    focus: "Focus Object",
  });

function resolveRecommendationType(
  signal: string,
  priority: WorkspaceQuickActionPriority
): ExecutiveRecommendationType {
  if (signal.includes("risk") || priority === "critical") return "risk";
  if (signal.includes("kpi") || signal.includes("conflict")) return "attention";
  if (signal.includes("scenario") && !signal.includes("conflict")) return "opportunity";
  if (signal.includes("timeline")) return "insight";
  if (signal.includes("recent") || signal.includes("low_confidence")) return "follow_up";
  if (signal.includes("object_selected")) return "insight";
  return "attention";
}

function resolveConfidence(priority: WorkspaceQuickActionPriority): ExecutiveRecommendationConfidence {
  if (priority === "critical" || priority === "high") return "high";
  if (priority === "normal") return "medium";
  return "low";
}

function resolveActionLabel(workspaceId: ExecutiveWorkspaceId): string {
  return WORKSPACE_ACTION_LABELS[workspaceId] ?? `Open ${getExecutiveWorkspaceEntry(workspaceId).name}`;
}

function projectRecommendationCard(
  card: WorkspaceQuickActionCardView
): ExecutiveRecommendationCardView {
  const recommendationType = resolveRecommendationType(card.signal, card.priority);
  const confidence = resolveConfidence(card.priority);

  return Object.freeze({
    id: card.id,
    title: card.title,
    summary: card.description,
    recommendationType,
    confidence,
    suggestedActionLabel: resolveActionLabel(card.suggestedWorkspaceId),
    suggestedWorkspaceId: card.suggestedWorkspaceId,
    actionKind: "workspace_launch",
    launchable: card.launchable,
    sourceSignal: card.signal,
  });
}

function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? `1 ${singular}` : `${count} ${plural}`;
}

function buildBriefingNarrative(
  recommendations: readonly ExecutiveRecommendationCardView[]
): ExecutiveIntelligenceBriefingView {
  const attentionCount = recommendations.filter((entry) => entry.recommendationType === "attention").length;
  const opportunityCount = recommendations.filter((entry) => entry.recommendationType === "opportunity").length;
  const riskCount = recommendations.filter((entry) => entry.recommendationType === "risk").length;
  const insightCount = recommendations.filter((entry) => entry.recommendationType === "insight").length;
  const followUpCount = recommendations.filter((entry) => entry.recommendationType === "follow_up").length;
  const totalCount = recommendations.length;

  if (totalCount === 0) {
    return Object.freeze({
      narrative: "System operating normally. No recommendations require attention.",
      totalCount: 0,
      attentionCount: 0,
      opportunityCount: 0,
      riskCount: 0,
      insightCount: 0,
      followUpCount: 0,
      isNominal: true,
    });
  }

  const parts: string[] = [];
  if (riskCount > 0) parts.push(pluralize(riskCount, "operational risk", "operational risks"));
  if (attentionCount > 0) parts.push(pluralize(attentionCount, "attention item", "attention items"));
  if (opportunityCount > 0) parts.push(pluralize(opportunityCount, "opportunity", "opportunities"));
  if (insightCount > 0) parts.push(pluralize(insightCount, "insight", "insights"));
  if (followUpCount > 0) parts.push(pluralize(followUpCount, "follow-up action", "follow-up actions"));

  const detail =
    parts.length > 0
      ? `${parts.slice(0, 2).join(" and ")} were identified.`
      : "Review the items below.";

  const narrative = `${totalCount} item${totalCount === 1 ? "" : "s"} require attention today. ${detail}`;

  return Object.freeze({
    narrative,
    totalCount,
    attentionCount,
    opportunityCount,
    riskCount,
    insightCount,
    followUpCount,
    isNominal: false,
  });
}

export function buildExecutiveBriefingView(
  context: WorkspaceRecommendationContext = {}
): ExecutiveBriefingView {
  const recommendationState = evaluateWorkspaceRecommendations(context);

  const recommendations = recommendationState.recommendations
    .slice(0, EXECUTIVE_BRIEFING_MAX_DISPLAY)
    .map(projectRecommendationCard);

  const briefing = buildBriefingNarrative(recommendations);

  return Object.freeze({
    briefing,
    recommendations: Object.freeze(recommendations),
    evaluatedAt: recommendationState.evaluatedAt,
    source: "executive_briefing_layer",
  });
}

export function resolveExecutiveRecommendationAction(
  card: ExecutiveRecommendationCardView
): Readonly<{
  actionKind: ExecutiveRecommendationActionKind;
  workspaceId: ExecutiveWorkspaceId | null;
}> {
  return Object.freeze({
    actionKind: card.actionKind,
    workspaceId: card.suggestedWorkspaceId,
  });
}
