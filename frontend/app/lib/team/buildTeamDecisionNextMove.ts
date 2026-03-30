import type { TeamDecisionAlignment, TeamRolePerspective } from "./teamDecisionTypes";

type BuildTeamDecisionNextMoveInput = {
  alignment: TeamDecisionAlignment;
  perspectives: TeamRolePerspective[];
  metaDecision?: any | null;
  compareModel?: any | null;
  confidenceModel?: any | null;
};

function categorizeAction(value: string) {
  const text = String(value ?? "").toLowerCase();
  if (text.includes("simulation")) return "simulate";
  if (text.includes("compare")) return "compare";
  if (text.includes("preview")) return "preview";
  if (text.includes("evidence") || text.includes("assumption") || text.includes("uncertainty")) return "evidence";
  return "act";
}

export function buildTeamDecisionNextMove(input: BuildTeamDecisionNextMoveInput): string {
  if (input.metaDecision?.action_posture === "recommend_more_evidence") {
    return "Gather evidence around the highest-uncertainty assumption before escalation.";
  }
  if (input.alignment.alignment_level === "low" && (input.compareModel?.alternatives?.length ?? 0) > 0) {
    return "Compare the top recommendation against one lower-risk alternative before the team commits.";
  }

  const categories = input.perspectives.map((perspective) => categorizeAction(perspective.suggested_next_action));
  const simulateCount = categories.filter((category) => category === "simulate").length;
  const previewCount = categories.filter((category) => category === "preview").length;
  const compareCount = categories.filter((category) => category === "compare").length;
  const evidenceCount = categories.filter((category) => category === "evidence").length;

  if (simulateCount >= 2 || input.metaDecision?.action_posture === "recommend_simulation") {
    return "Run a simulation before action so the team can align on downstream impact.";
  }
  if (previewCount >= 2 || input.metaDecision?.action_posture === "recommend_safe_preview") {
    return "Approve a safe preview first so operators can test the move without committing the system.";
  }
  if (compareCount >= 2 || input.metaDecision?.action_posture === "recommend_comparison") {
    return "Compare the current recommendation with one meaningful alternative before alignment review closes.";
  }
  if (evidenceCount >= 2 || input.confidenceModel?.level === "low") {
    return "Gather more evidence before action so the team is not forcing confidence beyond the available data.";
  }
  return "Proceed with the shared recommendation, then capture outcome feedback for the whole team.";
}
