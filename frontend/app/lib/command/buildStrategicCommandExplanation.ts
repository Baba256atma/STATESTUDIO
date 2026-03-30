import type { StrategicCommandState } from "./strategicCommandTypes";

function prettify(value: string) {
  return value.replace(/_/g, " ");
}

export function buildStrategicCommandExplanation(
  state: Pick<
    StrategicCommandState,
    "priority" | "priority_reason" | "next_move" | "alerts" | "review_flags"
  >
): string {
  const topAlert = state.alerts[0]?.summary;
  const topFlag = state.review_flags[0];
  return topAlert || topFlag
    ? `Nexora is prioritizing ${prettify(state.priority)} because ${state.priority_reason.toLowerCase()} ${topAlert ?? topFlag}. The recommended next move is to ${state.next_move.charAt(0).toLowerCase()}${state.next_move.slice(1)}`
    : `Nexora is prioritizing ${prettify(state.priority)} because ${state.priority_reason.toLowerCase()} The recommended next move is to ${state.next_move.charAt(0).toLowerCase()}${state.next_move.slice(1)}`;
}
