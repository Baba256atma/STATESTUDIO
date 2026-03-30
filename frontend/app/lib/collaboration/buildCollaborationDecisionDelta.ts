import type {
  CollaborationDecisionDelta,
  CollaborationInput,
  CollaboratorPerspective,
} from "./collaborationTypes";

type BuildCollaborationDecisionDeltaInput = {
  sharedRecommendation: string;
  inputs: CollaborationInput[];
  perspectives: CollaboratorPerspective[];
  teamDecisionState?: any | null;
  governanceState?: any | null;
  approvalWorkflowState?: any | null;
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

export function buildCollaborationDecisionDelta(
  input: BuildCollaborationDecisionDeltaInput
): CollaborationDecisionDelta {
  const beforeSummary =
    clean(input.teamDecisionState?.team_next_move) ||
    clean(input.sharedRecommendation) ||
    "No shared decision baseline is available.";
  const strongestSignal =
    input.inputs.find((entry) => entry.kind === "escalation_note") ??
    input.inputs.find((entry) => entry.kind === "evidence_request") ??
    input.inputs.find((entry) => entry.kind === "challenge") ??
    null;
  const afterSummary =
    strongestSignal?.summary ??
    clean(input.perspectives[0]?.preferred_next_action) ??
    beforeSummary;

  const changed =
    Boolean(strongestSignal) ||
    input.governanceState?.approval?.required ||
    (input.approvalWorkflowState?.required && input.approvalWorkflowState?.status !== "approved");

  return {
    changed,
    before_summary: beforeSummary,
    after_summary: afterSummary,
    summary: changed
      ? `Collaboration changed the posture from "${beforeSummary}" toward "${afterSummary}".`
      : "Collaboration reinforced the current recommendation without changing the shared posture.",
  };
}
