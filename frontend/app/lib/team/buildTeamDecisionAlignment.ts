import type { TeamDecisionAlignment, TeamRolePerspective } from "./teamDecisionTypes";

type BuildTeamDecisionAlignmentInput = {
  perspectives: TeamRolePerspective[];
  confidenceModel?: any | null;
  metaDecision?: any | null;
};

type ActionCategory = "simulate" | "compare" | "preview" | "evidence" | "memory" | "act";

function normalize(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function categorizeAction(value: string): ActionCategory {
  const text = value.toLowerCase();
  if (text.includes("simulation")) return "simulate";
  if (text.includes("compare")) return "compare";
  if (text.includes("preview")) return "preview";
  if (text.includes("memory") || text.includes("histor")) return "memory";
  if (text.includes("evidence") || text.includes("assumption") || text.includes("uncertainty")) return "evidence";
  return "act";
}

function prettyCategory(value: ActionCategory) {
  if (value === "simulate") return "simulation";
  if (value === "compare") return "comparison";
  if (value === "preview") return "safe preview";
  if (value === "memory") return "historical review";
  if (value === "evidence") return "more evidence";
  return "action";
}

export function buildTeamDecisionAlignment(input: BuildTeamDecisionAlignmentInput): TeamDecisionAlignment {
  const perspectives = input.perspectives ?? [];
  const categories = perspectives.map((perspective) => categorizeAction(perspective.suggested_next_action));
  const frequency = new Map<ActionCategory, number>();
  categories.forEach((category) => frequency.set(category, (frequency.get(category) ?? 0) + 1));
  const sortedCategories = Array.from(frequency.entries()).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories[0]?.[0] ?? "act";
  const topCount = sortedCategories[0]?.[1] ?? 0;
  const uniqueCount = sortedCategories.length;

  const alignmentLevel: TeamDecisionAlignment["alignment_level"] =
    topCount >= 3 || uniqueCount <= 1
      ? "high"
      : uniqueCount <= 2
        ? "moderate"
        : "low";

  const agreementPoints = [
    topCount >= 2
      ? `${topCount} roles lean toward ${prettyCategory(topCategory)} before escalation.`
      : null,
    input.metaDecision?.selected_strategy
      ? `The team is anchored to a ${String(input.metaDecision.selected_strategy).replace(/_/g, " ")} approach.`
      : null,
    input.confidenceModel?.level
      ? `Current confidence is ${input.confidenceModel.level}, which keeps the shared recommendation stable across roles.`
      : null,
  ]
    .map(normalize)
    .filter(Boolean)
    .slice(0, 3);

  const disagreementPoints = sortedCategories
    .slice(1)
    .map(([category]) => {
      const roles = perspectives
        .filter((perspective) => categorizeAction(perspective.suggested_next_action) === category)
        .map((perspective) => perspective.role.replace(/^\w/, (value) => value.toUpperCase()))
        .join(" and ");
      return `${roles} still prefer ${prettyCategory(category)} over ${prettyCategory(topCategory)}.`;
    })
    .slice(0, 2);

  const unresolvedQuestions = Array.from(
    new Set(
      perspectives
        .flatMap((perspective) => perspective.concerns)
        .map(normalize)
        .filter(Boolean)
    )
  )
    .slice(0, 3)
    .map((item) => (item.endsWith(".") ? item : `${item}.`));

  return {
    alignment_level: alignmentLevel,
    agreement_points: agreementPoints.length
      ? agreementPoints
      : ["The team is still aligning around the current recommendation."],
    disagreement_points: disagreementPoints,
    unresolved_questions: unresolvedQuestions,
  };
}
