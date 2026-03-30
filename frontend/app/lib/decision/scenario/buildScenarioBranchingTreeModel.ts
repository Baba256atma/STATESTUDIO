import type { DecisionExecutionResult } from "../../executive/decisionExecutionTypes";
import type { DecisionMemoryEntry } from "../memory/decisionMemoryTypes";
import type { CanonicalRecommendation } from "../recommendation/recommendationTypes";
import { buildComparePanelModel } from "../recommendation/buildComparePanelModel";
import { buildDecisionTimelineModel } from "../timeline/buildDecisionTimelineModel";

export type ScenarioBranchNode = {
  id: string;
  title: string;
  summary: string;
  type: "current" | "recommended" | "alternative" | "outcome";
  parentId?: string | null;
  impact_summary?: string | null;
  tradeoff_summary?: string | null;
  confidence_level?: "low" | "medium" | "high" | null;
  status?: "recommended" | "viable" | "risky" | "unknown";
  target_ids?: string[];
  impact_items?: Array<{
    label: string;
    direction?: "up" | "down" | "neutral";
    value?: string;
  }>;
  replay_ref?: {
    memory_entry_id?: string | null;
    scenario_id?: string | null;
  };
};

export type ScenarioBranchingTreeModel = {
  root: ScenarioBranchNode;
  branches: ScenarioBranchNode[];
  compareAvailable: boolean;
  memoryLinked: boolean;
  recommendedBranchId?: string | null;
};

type BuildScenarioBranchingTreeModelInput = {
  responseData?: any | null;
  canonicalRecommendation?: CanonicalRecommendation | null;
  decisionResult?: DecisionExecutionResult | null;
  strategicAdvice?: any | null;
  memoryEntries?: DecisionMemoryEntry[];
};

function text(value: unknown) {
  return String(value ?? "").trim();
}

function uniqueStrings(values: unknown[]) {
  return Array.from(new Set(values.map((value) => text(value)).filter(Boolean)));
}

function firstText(...values: unknown[]) {
  for (const value of values) {
    const next = text(value);
    if (next) return next;
  }
  return "";
}

function matchMemoryEntry(
  entries: DecisionMemoryEntry[],
  action: string,
  scenarioId?: string | null
) {
  const normalizedAction = text(action).toLowerCase();
  const normalizedScenarioId = text(scenarioId).toLowerCase();
  return (
    entries.find((entry) => text(entry.recommendation_action).toLowerCase() === normalizedAction) ??
    entries.find((entry) => normalizedScenarioId && text(entry.snapshot_ref?.scenario_id).toLowerCase() === normalizedScenarioId) ??
    null
  );
}

export function buildScenarioBranchingTreeModel(
  input: BuildScenarioBranchingTreeModelInput
): ScenarioBranchingTreeModel {
  const responseData = input.responseData ?? null;
  const canonicalRecommendation =
    input.canonicalRecommendation ?? responseData?.canonical_recommendation ?? null;
  const compareModel = buildComparePanelModel({
    canonicalRecommendation,
    decisionResult: input.decisionResult ?? null,
    strategicAdvice: input.strategicAdvice ?? responseData?.strategic_advice ?? null,
    responseData,
  });
  const timeline = buildDecisionTimelineModel({
    responseData,
    canonicalRecommendation,
    decisionResult: input.decisionResult ?? null,
    strategicAdvice: input.strategicAdvice ?? responseData?.strategic_advice ?? null,
  });
  const memoryEntries = input.memoryEntries ?? [];

  const root: ScenarioBranchNode = {
    id: "current_state",
    title: "Current State",
    summary: firstText(
      timeline.stages.find((stage) => stage.id === "before")?.summary,
      responseData?.executive_summary_surface?.happened,
      responseData?.analysis_summary,
      "Current-state summary unavailable. Run an analysis to build a decision tree."
    ),
    type: "current",
    impact_summary: text(responseData?.risk_propagation?.summary) || null,
    impact_items:
      timeline.stages.find((stage) => stage.id === "before")?.impactItems?.slice(0, 3) ??
      [],
    status: "unknown",
  };

  const recommendedScenarioId =
    text(canonicalRecommendation?.simulation?.scenario_id) ||
    text(responseData?.decision_simulation?.scenario?.id) ||
    null;
  const recommendedMemory = matchMemoryEntry(
    memoryEntries,
    canonicalRecommendation?.primary.action ?? compareModel.recommendedOption?.title ?? "",
    recommendedScenarioId
  );

  const recommendedBranch: ScenarioBranchNode | null =
    canonicalRecommendation || compareModel.recommendedOption
      ? {
          id: canonicalRecommendation?.id ?? compareModel.recommendedOption?.id ?? "recommended_branch",
          parentId: root.id,
          title:
            canonicalRecommendation?.primary.action ??
            compareModel.recommendedOption?.title ??
            "Recommended path",
          summary:
            text(canonicalRecommendation?.reasoning.why) ||
            text(compareModel.reasoningWhy) ||
            text(compareModel.compareSummary) ||
            "Nexora recommends this path as the strongest visible move.",
          type: "recommended",
          impact_summary:
            text(canonicalRecommendation?.primary.impact_summary) ||
            text(compareModel.recommendedOption?.impact_summary) ||
            text(timeline.stages.find((stage) => stage.id === "after")?.summary) ||
            null,
          tradeoff_summary:
            text(compareModel.tradeoffs[0]) ||
            text(compareModel.recommendedOption?.tradeoff) ||
            null,
          confidence_level:
            canonicalRecommendation?.confidence.level ??
            compareModel.recommendedOption?.confidence_level ??
            "medium",
          status: "recommended",
          target_ids: uniqueStrings([
            ...(canonicalRecommendation?.primary.target_ids ?? []),
            ...(compareModel.recommendedOption?.target_ids ?? []),
            ...(input.decisionResult?.simulation_result?.affected_objects ?? []),
          ]).slice(0, 6),
          impact_items:
            timeline.stages.find((stage) => stage.id === "after")?.impactItems?.slice(0, 4) ??
            [],
          replay_ref:
            recommendedMemory || recommendedScenarioId
              ? {
                  memory_entry_id: recommendedMemory?.id ?? null,
                  scenario_id: recommendedScenarioId ?? null,
                }
              : undefined,
        }
      : null;

  const alternativeBranches = compareModel.alternatives.slice(0, 2).map((alternative, index) => {
    const matchingMemory = matchMemoryEntry(memoryEntries, alternative.title, null);
    return {
      id: alternative.id || `alternative_branch_${index}`,
      parentId: root.id,
      title: alternative.title || `Alternative ${index + 1}`,
      summary:
        text(alternative.summary) ||
        text(alternative.impact_summary) ||
        "Alternative future available for comparison.",
      type: "alternative" as const,
      impact_summary: text(alternative.impact_summary) || null,
      tradeoff_summary: text(alternative.tradeoff) || null,
      confidence_level: alternative.confidence_level ?? "medium",
      status: alternative.tradeoff ? "risky" : "viable",
      target_ids: alternative.target_ids ?? [],
      impact_items: [
        text(alternative.impact_summary)
          ? {
              label: "Expected effect",
              direction: "neutral" as const,
              value: text(alternative.impact_summary),
            }
          : null,
        text(alternative.tradeoff)
          ? {
              label: "Trade-off",
              direction: "down" as const,
              value: text(alternative.tradeoff),
            }
          : null,
      ].filter(Boolean) as ScenarioBranchNode["impact_items"],
      replay_ref: matchingMemory
        ? {
            memory_entry_id: matchingMemory.id,
            scenario_id: matchingMemory.snapshot_ref?.scenario_id ?? null,
          }
        : undefined,
    };
  });

  return {
    root,
    branches: [recommendedBranch, ...alternativeBranches].filter(Boolean) as ScenarioBranchNode[],
    compareAvailable: Boolean(compareModel.alternatives.length),
    memoryLinked: Boolean(recommendedMemory || alternativeBranches.some((branch) => branch.replay_ref?.memory_entry_id)),
    recommendedBranchId: recommendedBranch?.id ?? null,
  };
}
