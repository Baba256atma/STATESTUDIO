import type { CanonicalRecommendation } from "./recommendationTypes";
import { extractDecisionRecommendationLine } from "../../panels/buildScenarioExplanationFromDecisionAnalysis";

type LooseRecord = Record<string, unknown>;

type BuildCanonicalRecommendationInput = {
  strategicAdvice?: LooseRecord | null;
  cockpitExecutive?: LooseRecord | null;
  promptFeedback?: LooseRecord | null;
  decisionSimulation?: LooseRecord | null;
  reply?: string | null;
  sourceHint?: CanonicalRecommendation["source"] | null;
  strategic_advice?: LooseRecord | null;
  executive_summary_surface?: LooseRecord | null;
  prompt_feedback?: LooseRecord | null;
  decision_simulation?: LooseRecord | null;
  ai_reasoning?: LooseRecord | null;
  decision_analysis?: LooseRecord | null;
  scene?: LooseRecord | null;
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

function asRecord(value: unknown): LooseRecord | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as LooseRecord) : null;
}

function readNestedRecord(record: LooseRecord | null | undefined, key: string): LooseRecord | null {
  return asRecord(record?.[key]);
}

export function buildCanonicalRecommendation(
  payload: BuildCanonicalRecommendationInput | LooseRecord | null | undefined
): CanonicalRecommendation | null {
  const loosePayload = asRecord(payload);
  const input: BuildCanonicalRecommendationInput = loosePayload
    ? {
        strategicAdvice:
          asRecord(loosePayload.strategicAdvice) ?? asRecord(loosePayload.strategic_advice) ?? null,
        cockpitExecutive:
          asRecord(loosePayload.cockpitExecutive) ??
          asRecord(loosePayload.executive_summary_surface) ??
          null,
        promptFeedback:
          asRecord(loosePayload.promptFeedback) ?? asRecord(loosePayload.prompt_feedback) ?? null,
        decisionSimulation:
          asRecord(loosePayload.decisionSimulation) ??
          asRecord(loosePayload.decision_simulation) ??
          null,
        reply: typeof loosePayload.reply === "string" ? loosePayload.reply : null,
        sourceHint:
          typeof loosePayload.sourceHint === "string"
            ? (loosePayload.sourceHint as CanonicalRecommendation["source"])
            : null,
        strategic_advice: asRecord(loosePayload.strategic_advice) ?? null,
        executive_summary_surface: asRecord(loosePayload.executive_summary_surface) ?? null,
        prompt_feedback: asRecord(loosePayload.prompt_feedback) ?? null,
        decision_simulation: asRecord(loosePayload.decision_simulation) ?? null,
        ai_reasoning: asRecord(loosePayload.ai_reasoning) ?? null,
        decision_analysis:
          asRecord(loosePayload.decision_analysis) ??
          readNestedRecord(asRecord(loosePayload.scene), "decision_analysis") ??
          null,
      }
    : {};
  const decisionAnalysisLine = extractDecisionRecommendationLine(input.decision_analysis);
  const daRec = asRecord(input.decision_analysis?.recommended_action);
  const primaryAdvice =
    asRecord(input.strategicAdvice?.primary_recommendation) ??
    (Array.isArray(input.strategicAdvice?.recommended_actions)
      ? asRecord(input.strategicAdvice.recommended_actions[0])
      : null) ??
    null;
  const action =
    text(daRec?.action) ||
    decisionAnalysisLine ||
    text(primaryAdvice?.action) ||
    text(input.cockpitExecutive?.what_to_do) ||
    text(readNestedRecord(input.promptFeedback, "advice_feedback")?.recommendation) ||
    text(input.decisionSimulation?.recommendation);

  if (!action) return null;

  const strategies = Array.isArray(input.decision_analysis?.strategies)
    ? input.decision_analysis.strategies
    : [];
  const bestStrategy = asRecord(strategies[0]);
  const daScore =
    bestStrategy &&
    typeof bestStrategy.decision_score === "number" &&
    typeof bestStrategy.risk === "number"
      ? clamp01(
          ((Math.tanh(Number(bestStrategy.decision_score)) + 1) / 2) * 0.55 +
            (1 - Number(bestStrategy.risk)) * 0.45
        )
      : null;

  const aiReasoningConfidence = readNestedRecord(input.ai_reasoning, "confidence");
  let baseScore =
    daScore != null && Number.isFinite(daScore)
      ? daScore
      : Number(
          input.strategicAdvice?.confidence ??
            aiReasoningConfidence?.score ??
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
    .map((entry) => asRecord(entry))
    .filter((entry): entry is LooseRecord => Boolean(entry && text(entry.action) && text(entry.action) !== action))
    .slice(0, 3)
    .map((entry) => ({
      action: text(entry.action),
      tradeoff: text(entry.tradeoff) || undefined,
      impact_summary: text(entry.impact) || undefined,
    }));

  const why =
    text(daRec?.rationale) ||
    text(daRec?.expected_outcome) ||
    (typeof input.decision_analysis?.decision_summary === "string" && text(input.decision_analysis.decision_summary)) ||
    text(input.strategicAdvice?.why) ||
    text(input.cockpitExecutive?.why_it_matters) ||
    text(readNestedRecord(input.promptFeedback, "advice_feedback")?.summary) ||
    text(input.reply) ||
    text(primaryAdvice?.impact) ||
    "This recommendation is the strongest visible move in the current scene.";

  const riskFeedback = readNestedRecord(input.promptFeedback, "risk_feedback");
  const keyDrivers = uniqueStrings([
    ...(Array.isArray(riskFeedback?.changed_drivers) ? riskFeedback.changed_drivers : []),
    ...(Array.isArray(riskFeedback?.affected_dimensions) ? riskFeedback.affected_dimensions : []),
  ]);

  const riskSummary =
    text(riskFeedback?.summary) ||
    text(input.cockpitExecutive?.happened) ||
    undefined;

  const simulationSummary =
    text(input.decisionSimulation?.summary) ||
    text(readNestedRecord(input.decisionSimulation, "comparisonReady")?.summary) ||
    undefined;

  return {
    id:
      text(primaryAdvice?.id) ||
      `recommendation:${action.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
    primary: {
      action,
      ...(Array.isArray(primaryAdvice?.targets) && primaryAdvice.targets.length
        ? { target_ids: uniqueStrings(primaryAdvice.targets as unknown[]) }
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
              ? { scenario_id: text(input.decisionSimulation?.scenario_id) }
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
