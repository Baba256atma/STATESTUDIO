/**
 * MRP:9:2 — Workspace Recommendation Engine.
 *
 * Evaluates context, ranks recommendations, filters invalid entries.
 * Never launches, navigates, or modifies history/lifecycle.
 */

import {
  getExecutiveWorkspaceEntry,
  validateExecutiveWorkspaceOpenRequest,
} from "../dashboard/executiveWorkspaceRegistryContract.ts";
import { initializeExecutiveWorkspaceRegistry } from "../dashboard/executiveWorkspaceRegistryRuntime.ts";
import { getWorkspaceNavigationSummary } from "../dashboard/executiveWorkspaceNavigationHistoryRuntime.ts";
import type { ExecutiveWorkspaceId } from "../dashboard/executiveWorkspaceRegistryContract.ts";
import {
  compareQuickActionPriority,
  warnWorkspaceRecommendationBrake,
  warnWorkspaceRecommendationStateBrake,
  WORKSPACE_RECOMMENDATION_MAX_COUNT,
  type WorkspaceQuickActionCardView,
  type WorkspaceQuickActionPriority,
  type WorkspaceRecommendationContext,
  type WorkspaceRecommendationStateView,
} from "./workspaceRecommendationContract.ts";

type RecommendationCandidate = Readonly<{
  workspaceId: ExecutiveWorkspaceId;
  title: string;
  description: string;
  reason: string;
  priority: WorkspaceQuickActionPriority;
  score: number;
  signal: string;
}>;

function objectLabel(context: WorkspaceRecommendationContext): string {
  return context.selectedObjectLabel?.trim() || context.selectedObjectId?.trim() || "selected object";
}

function pushCandidate(
  candidates: RecommendationCandidate[],
  candidate: RecommendationCandidate
): void {
  candidates.push(Object.freeze(candidate));
}

function collectSignalCandidates(context: WorkspaceRecommendationContext): RecommendationCandidate[] {
  const candidates: RecommendationCandidate[] = [];
  const label = objectLabel(context);
  const hasObject = Boolean(context.selectedObjectId?.trim());

  const isRisk =
    context.objectSignal === "risk" ||
    context.objectImpact === "critical" ||
    context.objectImpact === "high" ||
    context.systemSignals?.includes("risk_elevated");

  if (isRisk && hasObject) {
    pushCandidate(candidates, {
      workspaceId: "war_room",
      title: "Review War Room",
      description: `Operational coordination may help assess ${label}.`,
      reason: "Risk or high-impact object requires executive coordination.",
      priority: "critical",
      score: 95,
      signal: "risk_object",
    });
    pushCandidate(candidates, {
      workspaceId: "analyze",
      title: "Analyze this object",
      description: `Deep analysis may clarify exposure for ${label}.`,
      reason: "Risk object selected — analysis recommended.",
      priority: "high",
      score: 85,
      signal: "risk_object",
    });
  }

  if (context.kpiDecline || context.systemSignals?.includes("kpi_decline")) {
    pushCandidate(candidates, {
      workspaceId: "analyze",
      title: "Analyze this object",
      description: "Operational KPI movement may warrant object-level review.",
      reason: "KPI decline detected in dashboard context.",
      priority: "high",
      score: 80,
      signal: "kpi_decline",
    });
    pushCandidate(candidates, {
      workspaceId: "scenario",
      title: "Open Scenario Workspace",
      description: "Explore scenario paths before committing to a response.",
      reason: "KPI change may benefit from scenario exploration.",
      priority: "normal",
      score: 65,
      signal: "kpi_decline",
    });
  }

  if (context.scenarioConflict || context.systemSignals?.includes("scenario_conflict")) {
    pushCandidate(candidates, {
      workspaceId: "compare",
      title: "Compare alternatives",
      description: "Side-by-side comparison may resolve conflicting scenario paths.",
      reason: "Scenario conflict detected.",
      priority: "high",
      score: 88,
      signal: "scenario_conflict",
    });
    pushCandidate(candidates, {
      workspaceId: "war_room",
      title: "Review War Room",
      description: "Coordinate stakeholders when scenario paths diverge.",
      reason: "Scenario conflict may require war room coordination.",
      priority: "high",
      score: 82,
      signal: "scenario_conflict",
    });
  }

  if (
    context.timelineAnomaly ||
    context.timelineActive ||
    context.objectSignal === "timeline" ||
    context.systemSignals?.includes("timeline_anomaly")
  ) {
    pushCandidate(candidates, {
      workspaceId: "analyze",
      title: "Investigate Timeline Event",
      description: "Timeline context may connect to object-level signals.",
      reason: "Timeline activity or anomaly in context.",
      priority: context.timelineAnomaly ? "high" : "normal",
      score: context.timelineAnomaly ? 78 : 60,
      signal: "timeline_context",
    });
    pushCandidate(candidates, {
      workspaceId: "scenario",
      title: "Open Scenario Workspace",
      description: "Project forward from the current timeline position.",
      reason: "Timeline context supports scenario exploration.",
      priority: "normal",
      score: 58,
      signal: "timeline_context",
    });
  }

  if (context.objectSignal === "scenario" && hasObject) {
    pushCandidate(candidates, {
      workspaceId: "scenario",
      title: "Open Scenario Workspace",
      description: `Explore branching paths for ${label}.`,
      reason: "Scenario-related object selected.",
      priority: "high",
      score: 75,
      signal: "scenario_object",
    });
    pushCandidate(candidates, {
      workspaceId: "compare",
      title: "Compare alternatives",
      description: "Evaluate scenario branches against current baseline.",
      reason: "Scenario object may benefit from comparison.",
      priority: "normal",
      score: 68,
      signal: "scenario_object",
    });
  }

  if (
    hasObject &&
    context.objectConfidence !== null &&
    context.objectConfidence !== undefined &&
    context.objectConfidence < 0.5
  ) {
    pushCandidate(candidates, {
      workspaceId: "analyze",
      title: "Analyze this object",
      description: `Confidence is reduced for ${label} — verify assumptions.`,
      reason: "Object confidence score below threshold.",
      priority: "high",
      score: 72,
      signal: "low_confidence",
    });
  }

  if (hasObject && candidates.length === 0) {
    pushCandidate(candidates, {
      workspaceId: "analyze",
      title: "Analyze this object",
      description: `Start structured review of ${label}.`,
      reason: "Object selected — analysis is a sensible first step.",
      priority: "normal",
      score: 50,
      signal: "object_selected",
    });
    pushCandidate(candidates, {
      workspaceId: "focus",
      title: "Focus on this object",
      description: `Isolate ${label} for executive attention.`,
      reason: "Object selected — focus workspace available.",
      priority: "low",
      score: 40,
      signal: "object_selected",
    });
  }

  if (!hasObject) {
    const navigation = getWorkspaceNavigationSummary();
    const recentId = navigation.previousWorkspaceId;
    if (recentId && recentId !== "overview") {
      const recentEntry = getExecutiveWorkspaceEntry(recentId);
      if (recentEntry?.availability === "available") {
        pushCandidate(candidates, {
          workspaceId: recentId,
          title: `Return to ${recentEntry.name}`,
          description: "Continue from your previous executive workspace.",
          reason: "Recent workspace available in navigation history.",
          priority: "low",
          score: 30,
          signal: "recent_workspace",
        });
      }
    }
  }

  return candidates;
}

function dedupeCandidates(
  candidates: readonly RecommendationCandidate[]
): RecommendationCandidate[] {
  const bestByWorkspace = new Map<ExecutiveWorkspaceId, RecommendationCandidate>();

  for (const candidate of candidates) {
    const existing = bestByWorkspace.get(candidate.workspaceId);
    if (!existing || candidate.score > existing.score) {
      bestByWorkspace.set(candidate.workspaceId, candidate);
    }
  }

  return [...bestByWorkspace.values()];
}

function isWorkspaceLaunchable(workspaceId: ExecutiveWorkspaceId): boolean {
  const entry = getExecutiveWorkspaceEntry(workspaceId);
  return (
    entry.availability === "available" &&
    entry.objectPanelAction !== null &&
    entry.dashboardMode !== null
  );
}

function validateRecommendationCandidate(input: {
  candidate: RecommendationCandidate;
  context: WorkspaceRecommendationContext;
  activeWorkspaceId: ExecutiveWorkspaceId | null;
}): WorkspaceQuickActionCardView | null {
  const { candidate, context, activeWorkspaceId } = input;

  if (activeWorkspaceId === candidate.workspaceId) {
    warnWorkspaceRecommendationStateBrake("Active workspace filtered.", {
      workspaceId: candidate.workspaceId,
    });
    return null;
  }

  if (!isWorkspaceLaunchable(candidate.workspaceId)) {
    warnWorkspaceRecommendationBrake("Unavailable workspace filtered.", {
      workspaceId: candidate.workspaceId,
    });
    return null;
  }

  const registryValidation = validateExecutiveWorkspaceOpenRequest({
    workspaceId: candidate.workspaceId,
  });
  if (!registryValidation.valid) {
    warnWorkspaceRecommendationBrake("Registry rejected recommendation.", {
      workspaceId: candidate.workspaceId,
      reason: registryValidation.reason,
    });
    return null;
  }

  const requiresObject = Boolean(getExecutiveWorkspaceEntry(candidate.workspaceId).objectPanelAction);
  const hasObject = Boolean(context.selectedObjectId?.trim());
  const launchable = !requiresObject || hasObject;

  const entry = getExecutiveWorkspaceEntry(candidate.workspaceId);

  return Object.freeze({
    id: `${candidate.signal}:${candidate.workspaceId}`,
    title: candidate.title,
    description: candidate.description,
    suggestedWorkspaceId: candidate.workspaceId,
    suggestedWorkspaceName: entry.name,
    reason: candidate.reason,
    priority: candidate.priority,
    launchable,
    signal: candidate.signal,
  });
}

function buildContextSignature(context: WorkspaceRecommendationContext): string {
  return [
    context.selectedObjectId ?? "",
    context.objectSignal ?? "",
    context.objectImpact ?? "",
    String(context.objectConfidence ?? ""),
    context.activeWorkspaceId ?? "",
    String(context.timelineActive ?? false),
    String(context.scenarioConflict ?? false),
    String(context.kpiDecline ?? false),
    String(context.timelineAnomaly ?? false),
    (context.systemSignals ?? []).join(","),
  ].join("|");
}

export function evaluateWorkspaceRecommendations(
  context: WorkspaceRecommendationContext = {}
): WorkspaceRecommendationStateView {
  initializeExecutiveWorkspaceRegistry();

  const navigation = getWorkspaceNavigationSummary();
  const activeWorkspaceId =
    context.activeWorkspaceId ?? navigation.currentWorkspaceId ?? null;

  const rawCandidates = collectSignalCandidates(context);
  const deduped = dedupeCandidates(rawCandidates);

  deduped.sort((a, b) => {
    const priorityDelta = compareQuickActionPriority(a.priority, b.priority);
    if (priorityDelta !== 0) return priorityDelta;
    return b.score - a.score;
  });

  const recommendations: WorkspaceQuickActionCardView[] = [];
  const seenIds = new Set<string>();

  for (const candidate of deduped) {
    if (recommendations.length >= WORKSPACE_RECOMMENDATION_MAX_COUNT) break;

    const card = validateRecommendationCandidate({
      candidate,
      context,
      activeWorkspaceId,
    });
    if (!card) continue;

    if (seenIds.has(card.id)) {
      warnWorkspaceRecommendationBrake("Duplicate recommendation filtered.", { id: card.id });
      continue;
    }
    seenIds.add(card.id);
    recommendations.push(card);
  }

  return Object.freeze({
    recommendations: Object.freeze(recommendations),
    contextSignature: buildContextSignature({ ...context, activeWorkspaceId }),
    evaluatedAt: Date.now(),
    source: "workspace_recommendation_engine",
  });
}
