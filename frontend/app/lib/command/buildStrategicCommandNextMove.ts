import type { StrategicCommandPriority } from "./strategicCommandTypes";

export function buildStrategicCommandNextMove(input: {
  priority: StrategicCommandPriority;
  governanceMode?: string | null;
  approvalStatus?: string | null;
  councilReservation?: string | null;
  collaborationSignal?: string | null;
  teamSignal?: string | null;
  recommendationAction: string;
}): { next_move: string; reason: string } {
  switch (input.priority) {
    case "simulate":
      return {
        next_move: "Run simulation before stronger action.",
        reason: "Simulation is the fastest way to validate the current recommendation under uncertainty.",
      };
    case "compare":
      return {
        next_move: "Compare the current recommendation against one lower-risk alternative.",
        reason: "Trade-offs remain open enough that comparison should happen before commitment.",
      };
    case "approve":
      return {
        next_move: "Request executive approval after confirming the current evidence package.",
        reason: "Approval is the main blocker rather than additional analysis.",
      };
    case "review":
      return {
        next_move: "Review policy, governance, and cross-role disagreement before stronger action.",
        reason: input.collaborationSignal || input.teamSignal || "Control posture remains more restrictive than the recommendation alone.",
      };
    case "investigate":
      return {
        next_move: "Gather stronger evidence on the highest-uncertainty assumption.",
        reason: input.councilReservation || "Confidence and calibration signals still need reinforcement.",
      };
    case "escalate":
      return {
        next_move: "Escalate the decision for executive review.",
        reason: "Current reservations and control posture require higher-level review.",
      };
    case "stabilize":
      return {
        next_move: "Stay in safe preview mode while stabilizing the most exposed risk.",
        reason: input.councilReservation || "The system favors a safer posture before escalation.",
      };
    case "act":
    default:
      return {
        next_move: `Act on the recommendation in safe mode: ${input.recommendationAction}`,
        reason: "The current decision stack is stable enough to move forward under controlled execution.",
      };
  }
}
