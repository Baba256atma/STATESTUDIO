import type { ApprovalRequirement } from "./buildApprovalRequirement";
import type { ApprovalDecisionRecord, ApprovalWorkflowState } from "./approvalWorkflowTypes";

type EvaluateApprovalWorkflowInput = {
  decisionId?: string | null;
  requirement: ApprovalRequirement;
  decisions?: ApprovalDecisionRecord[];
};

export function evaluateApprovalWorkflow(
  input: EvaluateApprovalWorkflowInput
): Pick<
  ApprovalWorkflowState,
  | "decision_id"
  | "required"
  | "status"
  | "requested_reviewer_role"
  | "current_owner_role"
  | "reason"
  | "escalation_reason"
  | "allowed_post_approval_actions"
  | "blocked_until_approval_actions"
  | "decisions"
> {
  const decisions = [...(input.decisions ?? [])].sort((a, b) => b.timestamp - a.timestamp);
  const latest = decisions[0] ?? null;

  if (!input.requirement.required) {
    return {
      decision_id: input.decisionId ?? null,
      required: false,
      status: "not_required",
      requested_reviewer_role: null,
      current_owner_role: null,
      reason: input.requirement.reason,
      escalation_reason: null,
      allowed_post_approval_actions: input.requirement.allowed_post_approval_actions,
      blocked_until_approval_actions: [],
      decisions,
    };
  }

  if (!latest) {
    return {
      decision_id: input.decisionId ?? null,
      required: true,
      status: "pending_review",
      requested_reviewer_role: input.requirement.requested_reviewer_role,
      current_owner_role: input.requirement.requested_reviewer_role,
      reason: input.requirement.reason,
      escalation_reason: null,
      allowed_post_approval_actions: input.requirement.allowed_post_approval_actions,
      blocked_until_approval_actions: input.requirement.blocked_until_approval_actions,
      decisions,
    };
  }

  if (latest.decision === "approved") {
    return {
      decision_id: input.decisionId ?? null,
      required: true,
      status: "approved",
      requested_reviewer_role: input.requirement.requested_reviewer_role,
      current_owner_role: latest.actor_role,
      reason: input.requirement.reason,
      escalation_reason: null,
      allowed_post_approval_actions: input.requirement.allowed_post_approval_actions,
      blocked_until_approval_actions: [],
      decisions,
    };
  }

  if (latest.decision === "rejected") {
    return {
      decision_id: input.decisionId ?? null,
      required: true,
      status: "rejected",
      requested_reviewer_role: input.requirement.requested_reviewer_role,
      current_owner_role: latest.actor_role,
      reason: input.requirement.reason,
      escalation_reason: null,
      allowed_post_approval_actions: ["preview", "simulate", "compare", "save"],
      blocked_until_approval_actions: ["apply"],
      decisions,
    };
  }

  return {
    decision_id: input.decisionId ?? null,
    required: true,
    status: "escalated",
    requested_reviewer_role: "executive",
    current_owner_role: "executive",
    reason: input.requirement.reason,
    escalation_reason: latest.note ?? "The decision was escalated for higher-level review.",
    allowed_post_approval_actions: ["preview", "simulate", "compare", "save"],
    blocked_until_approval_actions: ["apply"],
    decisions,
  };
}
