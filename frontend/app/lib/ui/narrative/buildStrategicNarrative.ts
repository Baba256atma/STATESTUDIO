import type { DecisionBrief } from "../../executive/decisionSummaryTypes";

export type StrategicNarrativeResult = {
  narrative: string;
  takeaway?: string | null;
  caution?: string | null;
};

type BuildStrategicNarrativeInput = {
  brief?: DecisionBrief | null;
  scenarioTitle?: string | null;
  focusLabel?: string | null;
};

function joinSentences(parts: Array<string | null | undefined>) {
  return parts
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .join(" ");
}

export function buildStrategicNarrative(input: BuildStrategicNarrativeInput): StrategicNarrativeResult {
  const brief = input.brief;
  if (!brief) {
    return {
      narrative: "",
      takeaway: null,
      caution: null,
    };
  }

  const subject = input.focusLabel?.trim() || brief.summary.primary_object || "the current system";
  const context = brief.stable_system
    ? `${input.scenarioTitle ?? "The current scene"} is operating from a relatively stable position.`
    : `${subject} is carrying the main visible pressure in ${input.scenarioTitle ?? "the current scene"}.`;
  const insight = brief.stable_system
    ? "The most important issue is maintaining control without forcing unnecessary change."
    : `What matters most is ${brief.summary.core_problem.charAt(0).toLowerCase()}${brief.summary.core_problem.slice(1)}`;
  const decision = brief.stable_system
    ? `The right move is to ${brief.recommendation.action_title.toLowerCase()} while keeping the current position under observation.`
    : `The strongest move is to ${brief.recommendation.action_title.toLowerCase()} because ${brief.recommendation.reasoning.charAt(0).toLowerCase()}${brief.recommendation.reasoning.slice(1)}`;
  const consequence = brief.stable_system
    ? "This should preserve stability while keeping leadership ready to respond if the signal changes."
    : `${brief.expected_impact.primary_effect} ${brief.expected_impact.system_change_summary}`;

  const takeaway = brief.stable_system
    ? "maintain discipline and monitor for a meaningful shift before acting."
    : `${brief.recommendation.action_title} is the clearest way to improve control around ${subject}.`;

  const caution =
    brief.summary.risk_level === "critical" || brief.summary.risk_level === "high"
      ? brief.expected_impact.secondary_effects[0] ?? "the current pressure can spread if the decision is delayed."
      : null;

  return {
    narrative: joinSentences([context, insight, decision, consequence]),
    takeaway,
    caution,
  };
}
