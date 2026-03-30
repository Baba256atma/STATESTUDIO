import type {
  CouncilConsensus,
  CouncilDebateState,
  CouncilRolePerspective,
} from "./councilTypes";

function dedupe(items: Array<string | null | undefined>, limit = 4): string[] {
  return Array.from(
    new Set(
      items
        .map((item) => String(item ?? "").replace(/\s+/g, " ").trim())
        .filter(Boolean)
    )
  ).slice(0, limit);
}

function actionFamily(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes("simulation") || normalized.includes("simulate")) return "simulation";
  if (normalized.includes("compare")) return "compare";
  if (normalized.includes("evidence")) return "evidence";
  if (normalized.includes("approval") || normalized.includes("review")) return "review";
  if (normalized.includes("preview")) return "preview";
  return "action";
}

export function buildCouncilConsensus(input: {
  rolePerspectives: CouncilRolePerspective[];
  debate: CouncilDebateState;
  recommendationAction: string;
  recommendationWhy: string;
  governanceMode: string;
  approvalStatus: string;
  metaStrategy: string;
}): CouncilConsensus {
  const familyCounts = new Map<string, number>();
  input.rolePerspectives.forEach((item) => {
    const family = actionFamily(item.proposed_action);
    familyCounts.set(family, (familyCounts.get(family) ?? 0) + 1);
  });
  const sortedFamilies = Array.from(familyCounts.entries()).sort((left, right) => right[1] - left[1]);
  const topFamily = sortedFamilies[0]?.[0] ?? "action";
  const topCount = sortedFamilies[0]?.[1] ?? 0;

  const consensusLevel: CouncilConsensus["consensus_level"] =
    input.debate.conflict_points.length === 0 && topCount >= 4
      ? "high"
      : input.debate.conflict_points.length <= 2 && topCount >= 2
        ? "moderate"
        : "low";

  const finalRecommendation =
    input.governanceMode === "blocked"
      ? "Keep the decision in a blocked or preview-only posture until risk and review conditions improve."
      : input.approvalStatus === "pending_review"
        ? "Prepare the recommendation for review before any stronger apply action."
        : topFamily === "simulation" || input.metaStrategy === "simulation_first"
          ? "Run simulation before stronger action on the current recommendation."
          : topFamily === "compare" || input.metaStrategy === "compare_first"
            ? "Compare the current recommendation against one lower-risk alternative before committing."
            : topFamily === "evidence"
              ? "Gather stronger evidence before strengthening the decision posture."
              : input.recommendationAction || "Refine the recommendation before acting.";

  return {
    consensus_level: consensusLevel,
    final_recommendation: finalRecommendation,
    rationale:
      input.recommendationWhy ||
      "The council kept the recommendation aligned with the strongest shared signal across strategy, risk, operations, finance, and skepticism.",
    strongest_support: dedupe([
      input.debate.agreement_points[0],
      input.rolePerspectives[0]?.priorities[0],
      input.rolePerspectives[1]?.priorities[0],
    ]),
    main_reservations: dedupe([
      input.debate.conflict_points[0],
      input.debate.unresolved_questions[0],
      input.rolePerspectives.find((item) => item.role === "skeptic")?.concerns[0],
      input.rolePerspectives.find((item) => item.role === "risk_officer")?.concerns[0],
    ]),
  };
}
