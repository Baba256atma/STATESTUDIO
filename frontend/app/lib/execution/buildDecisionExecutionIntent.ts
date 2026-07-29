import type { CompareOption } from "../decision/recommendation/buildComparePanelModel";
import type { CanonicalRecommendation } from "../decision/recommendation/recommendationTypes";
import type { DecisionExecutionIntent } from "./decisionExecutionIntent";

type BuildDecisionExecutionIntentInput = {
  source: DecisionExecutionIntent["source"];
  canonicalRecommendation?: CanonicalRecommendation | null;
  compareOption?: CompareOption | null;
  targetIds?: string[] | null;
  action?: string | null;
  impactSummary?: string | null;
  confidence?: number | null;
  responseData?: unknown;
  decisionResult?: unknown;
};

function text(value: unknown) {
  return String(value ?? "").trim();
}

function uniqueStrings(values: unknown[]) {
  return Array.from(new Set(values.map((value) => text(value)).filter(Boolean)));
}

function mapConfidence(level?: CompareOption["confidence_level"] | null) {
  if (level === "high") return 0.84;
  if (level === "medium") return 0.64;
  if (level === "low") return 0.38;
  return null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

export function buildDecisionExecutionIntent(
  input: BuildDecisionExecutionIntentInput
): DecisionExecutionIntent | null {
  const recommendation = input.canonicalRecommendation ?? null;
  const option = input.compareOption ?? null;
  const decisionResult = asRecord(input.decisionResult);
  const simulationResult = asRecord(decisionResult?.simulation_result);
  const responseData = asRecord(input.responseData);
  const decisionComparison = asRecord(responseData?.decision_comparison);
  const action =
    text(input.action) ||
    text(option?.title) ||
    text(recommendation?.primary?.action);

  if (!action) return null;

  const targetIds = uniqueStrings([
    ...(input.targetIds ?? []),
    ...(option?.target_ids ?? []),
    ...(recommendation?.primary?.target_ids ?? []),
    ...(Array.isArray(simulationResult?.affected_objects)
      ? simulationResult.affected_objects
      : []),
  ]).slice(0, 8);

  const confidence =
    typeof input.confidence === "number"
      ? input.confidence
      : typeof recommendation?.confidence?.score === "number"
        ? recommendation.confidence.score
        : mapConfidence(option?.confidence_level);

  const impactSummary =
    text(input.impactSummary) ||
    text(option?.impact_summary) ||
    text(recommendation?.primary?.impact_summary) ||
    text(recommendation?.simulation?.summary) ||
    null;

  return {
    id: `intent:${input.source}:${action.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
    action,
    source: input.source,
    target_ids: targetIds,
    confidence: confidence ?? null,
    impact_summary: impactSummary,
    compare_ready: Boolean(
      (recommendation?.alternatives?.length ?? 0) > 0 ||
        (Array.isArray(decisionResult?.comparison) && decisionResult.comparison.length > 0) ||
        (Array.isArray(decisionComparison?.options) && decisionComparison.options.length > 0)
    ),
    simulation_ready: Boolean(
      recommendation ||
        responseData?.decision_simulation ||
        simulationResult
    ),
    safe_mode: true,
  };
}
