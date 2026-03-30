import type { ApprovalWorkflowState } from "./approvalWorkflowTypes";

export function buildApprovalWorkflowExplanation(
  state: Pick<ApprovalWorkflowState, "required" | "status" | "requested_reviewer_role" | "reason" | "escalation_reason">
): string {
  if (!state.required) {
    return "Approval is not required for the current decision posture, so simulation and review can proceed without a separate reviewer.";
  }
  if (state.status === "pending_review") {
    return `This decision requires ${state.requested_reviewer_role ?? "manager"} approval before apply because ${state.reason?.replace(/\.$/, "") ?? "governance marked it as review-gated"}.`;
  }
  if (state.status === "approved") {
    return `This decision has been approved by ${state.requested_reviewer_role ?? "the assigned reviewer"}, so post-approval actions can proceed.`;
  }
  if (state.status === "rejected") {
    return "This decision was rejected, so stronger action remains blocked until the recommendation is revised or compared against a safer option.";
  }
  if (state.status === "escalated") {
    return `This decision was escalated because ${state.escalation_reason?.replace(/\.$/, "") ?? "higher-level review is still required"}.`;
  }
  return "Approval workflow remains tentative because the current decision context is still incomplete.";
}
