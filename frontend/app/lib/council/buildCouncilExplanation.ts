import type { AutonomousDecisionCouncilState } from "./councilTypes";

function prettify(value: string) {
  return value.replace(/_/g, " ");
}

export function buildCouncilExplanation(
  state: Pick<AutonomousDecisionCouncilState, "consensus" | "debate">
): string {
  const level = prettify(state.consensus.consensus_level);
  const reservation = state.consensus.main_reservations[0] ?? state.debate.unresolved_questions[0];
  return reservation
    ? `Nexora's internal council reached ${level} consensus on the current recommendation. The board aligns on ${state.consensus.final_recommendation.toLowerCase()}, while still tracking ${reservation.toLowerCase()}.`
    : `Nexora's internal council reached ${level} consensus on the current recommendation and found no major unresolved reservation before the next step.`;
}
