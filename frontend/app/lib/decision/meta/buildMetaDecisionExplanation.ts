import type { MetaDecisionState } from "./metaDecisionTypes";

function pretty(value: string) {
  return value.replace(/_/g, "-");
}

export function buildMetaDecisionExplanation(input: {
  selectedStrategy: MetaDecisionState["selected_strategy"];
  evidenceStrength: MetaDecisionState["evidence_strength"];
  uncertaintyLevel: MetaDecisionState["uncertainty_level"];
  topReason?: string | null;
}): string {
  const reason = input.topReason ? ` ${input.topReason}` : "";
  if (input.selectedStrategy === "simulation_first") {
    return `Nexora is using a simulation-first approach because downstream effects matter and uncertainty remains ${input.uncertaintyLevel}.${reason}`;
  }
  if (input.selectedStrategy === "compare_first") {
    return `Nexora is using a compare-first approach because multiple viable paths appear to exist and the trade-offs are material.${reason}`;
  }
  if (input.selectedStrategy === "memory_first") {
    return `Nexora is using a memory-first approach because similar historical decisions appear informative enough to guide the next move.${reason}`;
  }
  if (input.selectedStrategy === "multi_agent_review") {
    return `Nexora is using a multi-agent review approach because the situation remains ambiguous enough that multiple perspectives should shape the decision.${reason}`;
  }
  if (input.selectedStrategy === "evidence_first") {
    return `Nexora is using an evidence-first approach because current evidence strength is ${input.evidenceStrength} and stronger guidance would risk overstating certainty.${reason}`;
  }
  if (input.selectedStrategy === "safe_mode_only") {
    return `Nexora is using a safe-preview posture because recent feedback suggests action should stay low-risk until more evidence is available.${reason}`;
  }
  return `Nexora is using a ${pretty(input.selectedStrategy)} approach because the current case appears familiar enough for a direct recommendation.${reason}`;
}
