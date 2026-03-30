import type { ApprovalWorkflowState } from "./approvalWorkflowTypes";

export function buildApprovalWorkflowNextSteps(
  state: Pick<ApprovalWorkflowState, "required" | "status" | "requested_reviewer_role" | "blocked_until_approval_actions">
): string[] {
  if (!state.required) {
    return [
      "Use simulation or safe preview to validate the decision further.",
      "Capture outcome evidence after action so approval is not needed unnecessarily next time.",
    ];
  }
  if (state.status === "pending_review") {
    return [
      `Request ${state.requested_reviewer_role ?? "manager"} review.`,
      "Run simulation before submitting if more evidence is still needed.",
      "Wait for approval before apply.",
    ];
  }
  if (state.status === "approved") {
    return [
      "Proceed with the approved action path.",
      "Capture outcome feedback after execution so the approval decision remains traceable.",
    ];
  }
  if (state.status === "rejected") {
    return [
      "Rework the recommendation or compare against a lower-risk alternative.",
      "Do not apply until the reviewer concern has been addressed.",
    ];
  }
  if (state.status === "escalated") {
    return [
      "Route the decision to executive review.",
      "Keep apply blocked while escalation is unresolved.",
      "Use preview or simulation to reduce remaining uncertainty.",
    ];
  }
  return [
    "Keep the decision in review until a clearer approval posture is available.",
  ];
}
