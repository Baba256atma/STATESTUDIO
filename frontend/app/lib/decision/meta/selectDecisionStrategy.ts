import type { DecisionStrategyScore, DecisionStrategyType, MetaDecisionState } from "./metaDecisionTypes";

export function selectDecisionStrategy(input: {
  strategyScores: DecisionStrategyScore[];
  evidenceStrength: MetaDecisionState["evidence_strength"];
  uncertaintyLevel: MetaDecisionState["uncertainty_level"];
}): Pick<MetaDecisionState, "selected_strategy" | "action_posture"> & {
  topStrategies: DecisionStrategyScore[];
} {
  const topStrategies = input.strategyScores.slice(0, 3);
  const best = topStrategies[0]?.strategy ?? "evidence_first";
  const closeSecond =
    topStrategies[1] && topStrategies[0]
      ? topStrategies[0].score - topStrategies[1].score < 0.08
      : false;

  let selected: DecisionStrategyType = best;
  if (input.evidenceStrength === "weak") {
    selected = best === "safe_mode_only" ? "safe_mode_only" : "evidence_first";
  } else if (input.uncertaintyLevel === "high" && best === "direct_recommendation") {
    selected = closeSecond ? topStrategies[1]?.strategy ?? "simulation_first" : "simulation_first";
  } else if (closeSecond && best === "direct_recommendation" && input.uncertaintyLevel !== "low") {
    selected = topStrategies[1]?.strategy ?? best;
  }

  const actionPosture: MetaDecisionState["action_posture"] =
    selected === "simulation_first"
      ? "recommend_simulation"
      : selected === "compare_first"
        ? "recommend_comparison"
        : selected === "evidence_first"
          ? "recommend_more_evidence"
          : selected === "safe_mode_only"
            ? "recommend_safe_preview"
            : "recommend_action";

  return {
    selected_strategy: selected,
    action_posture: actionPosture,
    topStrategies,
  };
}
