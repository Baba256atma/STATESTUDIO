import type { CanonicalRecommendation } from "./recommendationTypes";
import { extractDecisionRecommendationLine } from "../../panels/buildScenarioExplanationFromDecisionAnalysis";

type BuildCanonicalRecommendationInput = {
  strategicAdvice?: any | null;
  cockpitExecutive?: any | null;
  promptFeedback?: any | null;
  decisionSimulation?: any | null;
  reply?: string | null;
  sourceHint?: CanonicalRecommendation["source"] | null;
  strategic_advice?: any | null;
  executive_summary_surface?: any | null;
  prompt_feedback?: any | null;
  decision_simulation?: any | null;
  ai_reasoning?: any | null;
  decision_analysis?: any | null;
};

function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function confidenceLevel(score: number): CanonicalRecommendation["confidence"]["level"] {
  if (score >= 0.75) return "high";
  if (score >= 0.45) return "medium";
  return "low";
}

function text(value: unknown) {
  return String(value ?? "").trim();
}

function uniqueStrings(values: unknown[]) {
  return Array.from(new Set(values.map((value) => text(value)).filter(Boolean)));
}

export function buildCanonicalRecommendation(
  payload: BuildCanonicalRecommendationInput | any
): CanonicalRecommendation | null {
  const input: BuildCanonicalRecommendationInput =
    payload && typeof payload === "object"
      ? {
          strategicAdvice: payload.strategicAdvice ?? payload.strategic_advice ?? null,
          cockpitExecutive: payload.cockpitExecutive ?? payload.executive_summary_surface ?? null,
          promptFeedback: payload.promptFeedback ?? payload.prompt_feedback ?? null,
          decisionSimulation: payload.decisionSimulation ?? payload.decision_simulation ?? null,
          reply: payload.reply ?? null,
          sourceHint: payload.sourceHint ?? null,
          strategic_advice: payload.strategic_advice ?? null,
          executive_summary_surface: payload.executive_summary_surface ?? null,
          prompt_feedback: payload.prompt_feedback ?? null,
          decision_simulation: payload.decision_simulation ?? null,
          ai_reasoning: payload.ai_reasoning ?? null,
          decision_analysis:
            payload.decision_analysis ??
            (payload.scene && typeof payload.scene === "object" ? (payload.scene as { decision_analysis?: unknown }).decision_analysis : null) ??
            null,
        }
      : {};
  const decisionAnalysisLine = extractDecisionRecommendationLine(input.decision_analysis);
  const daRec = input.decision_analysis?.recommended_action as Record<string, unknown> | null | undefined;
  const primaryAdvice =
    input.strategicAdvice?.primary_recommendation ??
    input.strategicAdvice?.recommended_actions?.[0] ??
    null;
  const action =
    text(daRec?.action) ||
    decisionAnalysisLine ||
    text(primaryAdvice?.action) ||
    text(input.cockpitExecutive?.what_to_do) ||
    text(input.promptFeedback?.advice_feedback?.recommendation) ||
    text(input.decisionSimulation?.recommendation);

  if (!action) return null;

  const bestStrategy = Array.isArray(input.decision_analysis?.strategies) ? input.decision_analysis.strategies[0] : null;
  const daScore =
    bestStrategy && typeof bestStrategy.decision_score === "number" && typeof bestStrategy.risk === "number"
      ? clamp01((Math.tanh(Number(bestStrategy.decision_score)) + 1) / 2 * 0.55 + (1 - Number(bestStrategy.risk)) * 0.45)
      : null;

  let baseScore =
    daScore != null && Number.isFinite(daScore)
      ? daScore
      : Number(
          input.strategicAdvice?.confidence ??
            input.ai_reasoning?.confidence?.score ??
            input.decisionSimulation?.confidence ??
            0.64
        );
  const daPriority = String(daRec?.priority ?? "").toLowerCase();
  if (daScore != null && Number.isFinite(daScore)) {
    if (daPriority === "high") baseScore = Math.min(1, baseScore + 0.05);
    if (daPriority === "low") baseScore = Math.max(0, baseScore - 0.05);
  }
  const score = clamp01(baseScore);

  const recommendedActions = Array.isArray(input.strategicAdvice?.recommended_actions)
    ? input.strategicAdvice.recommended_actions
    : [];
  const alternatives = recommendedActions
    .filter((entry: any) => text(entry?.action) && text(entry?.action) !== action)
    .slice(0, 3)
    .map((entry: any) => ({
      action: text(entry?.action),
      tradeoff: text(entry?.tradeoff) || undefined,
      impact_summary: text(entry?.impact) || undefined,
    }));

  const why =
    text(daRec?.rationale) ||
    text(daRec?.expected_outcome) ||
    (typeof input.decision_analysis?.decision_summary === "string" && text(input.decision_analysis.decision_summary)) ||
    text(input.strategicAdvice?.why) ||
    text(input.cockpitExecutive?.why_it_matters) ||
    text(input.promptFeedback?.advice_feedback?.summary) ||
    text(input.reply) ||
    text(primaryAdvice?.impact) ||
    "This recommendation is the strongest visible move in the current scene.";

  const keyDrivers = uniqueStrings([
    ...(Array.isArray(input.promptFeedback?.risk_feedback?.changed_drivers)
      ? input.promptFeedback.risk_feedback.changed_drivers
      : []),
    ...(Array.isArray(input.promptFeedback?.risk_feedback?.affected_dimensions)
      ? input.promptFeedback.risk_feedback.affected_dimensions
      : []),
  ]);

  const riskSummary =
    text(input.promptFeedback?.risk_feedback?.summary) ||
    text(input.cockpitExecutive?.happened) ||
    undefined;

  const simulationSummary =
    text(input.decisionSimulation?.summary) ||
    text(input.decisionSimulation?.comparisonReady?.summary) ||
    undefined;

  return {
    id:
      text(primaryAdvice?.id) ||
      `recommendation:${action.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
    primary: {
      action,
      ...(Array.isArray(primaryAdvice?.targets) && primaryAdvice.targets.length
        ? { target_ids: uniqueStrings(primaryAdvice.targets) }
        : {}),
      ...(text(primaryAdvice?.impact) || simulationSummary
        ? { impact_summary: text(primaryAdvice?.impact) || simulationSummary }
        : {}),
    },
    alternatives,
    reasoning: {
      why,
      ...(keyDrivers.length ? { key_drivers: keyDrivers } : {}),
      ...(riskSummary ? { risk_summary: riskSummary } : {}),
    },
    confidence: {
      score,
      level: confidenceLevel(score),
    },
    ...(simulationSummary || text(input.decisionSimulation?.scenario_id)
      ? {
          simulation: {
            ...(text(input.decisionSimulation?.scenario_id)
              ? { scenario_id: text(input.decisionSimulation.scenario_id) }
              : {}),
            ...(simulationSummary ? { summary: simulationSummary } : {}),
          },
        }
      : {}),
    source:
      input.sourceHint ??
      (input.decision_analysis
        ? "ai_reasoning"
        : input.decisionSimulation
          ? "simulation"
          : input.strategicAdvice
            ? "ai_reasoning"
            : input.promptFeedback
              ? "generic"
              : "generic"),
    created_at: Date.now(),
  };
}
