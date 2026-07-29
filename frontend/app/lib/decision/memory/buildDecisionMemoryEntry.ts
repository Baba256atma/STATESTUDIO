import { buildCanonicalRecommendation } from "../recommendation/buildCanonicalRecommendation";
import { buildDecisionTimeline } from "../../governance/buildDecisionTimeline";
import type { DecisionMemoryEntry } from "./decisionMemoryTypes";
import type { CanonicalRecommendation } from "../recommendation/recommendationTypes";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function readCanonicalRecommendation(value: unknown): CanonicalRecommendation | null {
  return value && typeof value === "object" ? (value as CanonicalRecommendation) : null;
}

type BuildDecisionMemoryEntryInput = {
  responseData?: Record<string, unknown> | null;
  prompt?: string | null;
  workspaceId?: string | null;
  projectId?: string | null;
};

function text(value: unknown) {
  return String(value ?? "").trim();
}

function uniqueStrings(values: unknown[]) {
  return Array.from(new Set(values.map((value) => text(value)).filter(Boolean)));
}

function buildTitle(action: string, situation: string) {
  if (action) return action;
  if (situation) return situation.length > 72 ? `${situation.slice(0, 69)}...` : situation;
  return "Decision snapshot";
}

export function buildDecisionMemoryEntry(input: BuildDecisionMemoryEntryInput): DecisionMemoryEntry | null {
  const responseData = input.responseData ?? null;
  if (!responseData || typeof responseData !== "object") return null;

  const canonicalRecommendation =
    readCanonicalRecommendation(responseData.canonical_recommendation) ??
    buildCanonicalRecommendation(responseData);
  const decisionSimulation = asRecord(responseData.decision_simulation);
  const executiveSummary = asRecord(responseData.executive_summary_surface);
  const compare = asRecord(responseData.decision_comparison) ?? asRecord(responseData.comparison);
  const replay = asRecord(responseData.decision_replay) ?? asRecord(responseData.replay);
  const riskPropagation = asRecord(responseData.risk_propagation);
  const objectSelection = asRecord(responseData.object_selection);
  const decisionResultRecord = asRecord(responseData.decisionResult);

  const situationSummary =
    text(executiveSummary?.happened) ||
    text(responseData.analysis_summary) ||
    text(riskPropagation?.summary) ||
    "";
  const recommendationAction = text(canonicalRecommendation?.primary?.action);
  const recommendationSummary =
    text(canonicalRecommendation?.reasoning?.why) ||
    text(executiveSummary?.what_to_do) ||
    "";
  const impactSummary =
    text(canonicalRecommendation?.primary?.impact_summary) ||
    text(asRecord(decisionSimulation?.impact)?.summary) ||
    text(decisionSimulation?.summary) ||
    "";
  const compareSummary =
    text(compare?.summary) ||
    (Array.isArray(compare?.options) && compare.options.length
      ? `Compared ${compare.options.length} options.`
      : Array.isArray(decisionResultRecord?.comparison) && decisionResultRecord.comparison.length
      ? `Compared ${decisionResultRecord.comparison.length} options.`
      : "");

  const alternativeActions = uniqueStrings([
    ...(Array.isArray(canonicalRecommendation?.alternatives)
      ? canonicalRecommendation.alternatives.map((entry: { action?: string }) => entry.action)
      : []),
    ...(Array.isArray(compare?.options)
      ? compare.options.map((entry) => {
          const record = asRecord(entry);
          return record?.title ?? record?.action;
        })
      : []),
  ]).slice(0, 3);

  const targetIds = uniqueStrings([
    ...(Array.isArray(canonicalRecommendation?.primary?.target_ids) ? canonicalRecommendation.primary.target_ids : []),
    ...(Array.isArray(decisionSimulation?.affected_objects) ? decisionSimulation.affected_objects : []),
    ...(Array.isArray(objectSelection?.highlighted_objects) ? objectSelection.highlighted_objects : []),
  ]).slice(0, 6);

  const hasMeaningfulContext =
    Boolean(recommendationAction) ||
    Boolean(impactSummary) ||
    Boolean(compareSummary) ||
    Boolean(situationSummary) ||
    Boolean(decisionSimulation) ||
    Boolean(replay);

  if (!hasMeaningfulContext) return null;

  let timelineEvents: ReturnType<typeof buildDecisionTimeline> | null = null;

  try {
    timelineEvents = buildDecisionTimeline({
      responseData,
      canonicalRecommendation,
      memoryEntries: [],
      prompt: input.prompt ?? null,
    }).slice(-6);
  } catch (error) {
    timelineEvents = null;
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Nexora] buildDecisionTimeline failed in buildDecisionMemoryEntry", error);
    }
  }

  const createdAt = Date.now();
  const title = buildTitle(recommendationAction, situationSummary);
  const source: DecisionMemoryEntry["source"] = decisionSimulation
    ? "simulation"
    : recommendationAction
    ? "chat"
    : responseData?.scanner_result
    ? "scanner"
    : "system";

  return {
    id: `decision_memory:${createdAt}:${title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
    created_at: createdAt,
    workspace_id: input.workspaceId ?? null,
    project_id: input.projectId ?? null,
    title,
    prompt: text(input.prompt) || null,
    situation_summary: situationSummary || null,
    recommendation_summary: recommendationSummary || null,
    recommendation_action: recommendationAction || null,
    recommendation_confidence: canonicalRecommendation
      ? {
          score: canonicalRecommendation.confidence.score,
          level: canonicalRecommendation.confidence.level,
        }
      : undefined,
    impact_summary: impactSummary || null,
    compare_summary: compareSummary || null,
    target_ids: targetIds,
    alternative_actions: alternativeActions,
    snapshot_ref:
      text(canonicalRecommendation?.simulation?.scenario_id) ||
      text(asRecord(decisionSimulation?.scenario)?.id) ||
      text(replay?.id)
        ? {
            scenario_id:
              text(canonicalRecommendation?.simulation?.scenario_id) ||
              text(asRecord(decisionSimulation?.scenario)?.id) ||
              null,
            replay_id: text(replay?.id) || null,
          }
        : undefined,
    timeline_events: timelineEvents ?? [],
    source,
  };
}
