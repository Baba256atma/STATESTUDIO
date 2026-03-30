import type {
  CollaborationAlignment,
  CollaborationInput,
  CollaboratorPerspective,
} from "./collaborationTypes";

type BuildCollaborationAlignmentInput = {
  perspectives: CollaboratorPerspective[];
  inputs: CollaborationInput[];
  teamDecisionState?: any | null;
  governanceState?: any | null;
  approvalWorkflowState?: any | null;
};

function clean(values: unknown[], limit = 4) {
  return Array.from(new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean))).slice(0, limit);
}

export function buildCollaborationAlignment(
  input: BuildCollaborationAlignmentInput
): CollaborationAlignment {
  const preferredActions = clean(input.perspectives.map((perspective) => perspective.preferred_next_action));
  const challengeInputs = input.inputs.filter((entry) => entry.kind === "challenge" || entry.kind === "concern");
  const evidenceRequests = input.inputs.filter((entry) => entry.kind === "evidence_request");
  const escalationNotes = input.inputs.filter((entry) => entry.kind === "escalation_note");

  const agreementPoints = clean([
    ...input.inputs.filter((entry) => entry.kind === "support").map((entry) => entry.summary),
    preferredActions.length === 1 ? `Contributors are converging on ${preferredActions[0]}.` : null,
    input.teamDecisionState?.alignment?.agreement_points?.[0] ?? null,
  ]);

  const disagreementPoints = clean([
    ...challengeInputs.map((entry) => `${entry.user_label}: ${entry.summary}`),
    preferredActions.length > 1 ? "Contributors prefer different next actions." : null,
    input.teamDecisionState?.alignment?.disagreement_points?.[0] ?? null,
  ]);

  const unresolvedQuestions = clean([
    ...evidenceRequests.map((entry) => `${entry.user_label}: ${entry.summary}`),
    ...escalationNotes.map((entry) => `${entry.user_label}: ${entry.summary}`),
    input.governanceState?.approval?.required ? "Approval posture still shapes the next move." : null,
    input.approvalWorkflowState?.required && input.approvalWorkflowState?.status !== "approved"
      ? "Approval is still unresolved."
      : null,
    input.teamDecisionState?.alignment?.unresolved_questions?.[0] ?? null,
  ]);

  const alignmentLevel: CollaborationAlignment["alignment_level"] =
    disagreementPoints.length >= 3 || escalationNotes.length > 0
      ? "low"
      : disagreementPoints.length >= 1 || unresolvedQuestions.length >= 2
        ? "moderate"
        : "high";

  return {
    alignment_level: alignmentLevel,
    agreement_points: agreementPoints,
    disagreement_points: disagreementPoints,
    unresolved_questions: unresolvedQuestions,
  };
}
