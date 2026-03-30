import type { CouncilDebateState, CouncilRolePerspective } from "./councilTypes";

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

export function buildCouncilDebateState(input: {
  rolePerspectives: CouncilRolePerspective[];
  recommendationAction: string;
  teamSignal?: string | null;
  collaborationSignal?: string | null;
  governanceMode?: string | null;
}): CouncilDebateState {
  const perspectives = input.rolePerspectives;
  const families = Array.from(new Set(perspectives.map((item) => actionFamily(item.proposed_action))));
  const commonConcern = dedupe(perspectives.flatMap((item) => item.concerns), 6);
  const commonPriority = dedupe(perspectives.flatMap((item) => item.priorities), 6);

  return {
    agreement_points: dedupe([
      input.recommendationAction ? `The council remains anchored to ${input.recommendationAction}.` : null,
      commonPriority[0],
      input.governanceMode && input.governanceMode !== "simulation_allowed"
        ? `The council agrees current controls matter: ${input.governanceMode.replace(/_/g, " ")}.`
        : "The council agrees the decision should stay explainable and controlled.",
    ]),
    conflict_points: dedupe([
      families.length > 1
        ? `Roles split between ${families.map((family) => family.replace(/_/g, " ")).join(", ")} as the next move.`
        : null,
      perspectives.find((item) => item.role === "strategist")?.proposed_action !==
      perspectives.find((item) => item.role === "operator")?.proposed_action
        ? "Strategic momentum and operational caution are not fully aligned yet."
        : null,
      commonConcern[0],
    ]),
    unresolved_questions: dedupe([
      input.teamSignal,
      input.collaborationSignal,
      commonConcern[1],
      families.includes("evidence") ? "Is current evidence strong enough for a stronger action posture?" : null,
    ]),
  };
}
