import type { DecisionContext, DecisionPosture, DecisionRecommendation, EvaluatedScenario } from "./decisionAssistantTypes.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0.5;
  return Math.min(1, Math.max(0.2, n));
}

function postureFor(context: DecisionContext, top: EvaluatedScenario): DecisionPosture {
  const risk = context.riskLevel;
  const delta = top.delta;
  if (risk === "critical" || risk === "high") {
    if ((delta.risk ?? 0) <= 0 || (delta.stability ?? 0) > 0) return "stabilize";
    return "protect";
  }
  if ((delta.throughput ?? 0) > 0.1 && risk === "low") return "accelerate";
  if ((delta.cost ?? 0) < -0.05) return "optimize";
  return "optimize";
}

export function buildDecisionRecommendation(
  context: DecisionContext,
  scenarios: EvaluatedScenario[]
): DecisionRecommendation {
  if (!scenarios.length) {
    return {
      posture: "protect",
      recommendedScenarioId: "none",
      primaryAction: "Gather more context before committing capital or reputation.",
      reasonSummary: "No evaluated scenarios available — wait for scanner or user intent.",
      watchouts: ["Incomplete decision context", "Avoid irreversible moves until risk is bounded"],
      alternatives: [],
      confidence: 0.35,
    };
  }

  const top = scenarios[0];
  const posture: DecisionPosture = postureFor(context, top);
  const primaryAction = `${top.title}: ${top.intent}`;
  const reasonSummary = `Top scenario (${top.id}) scores ${Math.round(top.score * 100)}/100 given ${context.riskLevel} risk and current objects/drivers.`;

  const watchouts: string[] = [];
  if (context.riskLevel === "critical") watchouts.push("Fragility is elevated — bias to reversible steps.");
  if (top.projectedEffects.cost && top.projectedEffects.cost > 0.1) watchouts.push("Watch unit economics and cash timing.");
  if (top.projectedEffects.risk && top.projectedEffects.risk > 0.08) watchouts.push("Residual exposure may linger — schedule a recheck.");
  if (watchouts.length === 0) watchouts.push("Monitor execution variance vs. plan for one cycle.");

  const alternatives = scenarios
    .slice(1, 3)
    .map((s) => ({
      scenarioId: s.id,
      whyNotTopChoice:
        s.score + 0.05 < top.score
          ? `Lower composite fit (${Math.round(s.score * 100)} vs ${Math.round(top.score * 100)}).`
          : `Tradeoff profile less aligned with current ${context.riskLevel} posture.`,
    }));

  const confidence = clamp01(top.projectedEffects.confidence * 0.85 + top.score * 0.15);

  return {
    posture,
    recommendedScenarioId: top.id,
    primaryAction,
    reasonSummary,
    watchouts: watchouts.slice(0, 4),
    alternatives,
    confidence,
  };
}
