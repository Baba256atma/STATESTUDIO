import type { CollaborationAlignment, CollaborationInput } from "./collaborationTypes";

type BuildCollaborationNextStepsInput = {
  alignment: CollaborationAlignment;
  inputs: CollaborationInput[];
  teamDecisionState?: any | null;
  governanceState?: any | null;
  approvalWorkflowState?: any | null;
};

function clean(values: unknown[], limit = 4) {
  return Array.from(new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean))).slice(0, limit);
}

export function buildCollaborationNextSteps(
  input: BuildCollaborationNextStepsInput
): string[] {
  const evidenceRequested = input.inputs.some((entry) => entry.kind === "evidence_request");
  const escalationNoted = input.inputs.some((entry) => entry.kind === "escalation_note");

  return clean([
    evidenceRequested ? "Gather stronger evidence for the top unresolved question." : null,
    input.alignment.alignment_level === "low"
      ? "Resolve the main disagreement before stronger action."
      : null,
    input.teamDecisionState?.team_next_move ?? null,
    input.governanceState?.next_steps?.[0] ?? null,
    input.approvalWorkflowState?.next_steps?.[0] ?? null,
    escalationNoted ? "Escalate this decision for higher-level review." : null,
    "Return to the shared decision once the next structured input is captured.",
  ]);
}
