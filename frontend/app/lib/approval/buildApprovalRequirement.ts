import type { ApprovalActorRole } from "./approvalWorkflowTypes";

export type ApprovalRequirement = {
  required: boolean;
  requested_reviewer_role: ApprovalActorRole | null;
  reason: string | null;
  allowed_post_approval_actions: string[];
  blocked_until_approval_actions: string[];
};

type BuildApprovalRequirementInput = {
  governanceState?: any | null;
  decisionExecutionIntent?: any | null;
  teamDecisionState?: any | null;
  orgMemoryState?: any | null;
  metaDecisionState?: any | null;
  policyState?: any | null;
};

export function buildApprovalRequirement(
  input: BuildApprovalRequirementInput
): ApprovalRequirement {
  const governance = input.governanceState;
  const requiredByGovernance =
    governance?.approval?.required ||
    governance?.mode === "approval_required" ||
    governance?.mode === "executive_review_required";
  const reviewer =
    (input.policyState?.posture === "executive_review"
      ? "executive"
      : governance?.approval?.approver_role) ??
    (governance?.mode === "executive_review_required" ? "executive" : null);
  const blockedUntilApproval = governance?.blocked_actions?.includes("apply")
    ? []
    : ["apply"];
  const orgWarning = Boolean(input.orgMemoryState?.recurring_failures?.length);
  const lowAlignment = input.teamDecisionState?.alignment?.alignment_level === "low";
  const requireForApply = Boolean(
    input.decisionExecutionIntent?.action &&
      (
        requiredByGovernance ||
        input.policyState?.posture === "approval_gated" ||
        input.policyState?.posture === "executive_review" ||
        lowAlignment ||
        orgWarning ||
        input.metaDecisionState?.action_posture === "recommend_more_evidence"
      )
  );

  return {
    required: requireForApply,
    requested_reviewer_role:
      (requireForApply ? reviewer ?? "manager" : null) as ApprovalActorRole | null,
    reason:
      requireForApply
        ? governance?.approval?.reason ??
          (input.policyState?.posture === "executive_review"
            ? "This decision needs executive review before apply."
            : input.policyState?.posture === "approval_gated"
              ? "This decision needs approval before stronger action."
              : null) ??
          (governance?.mode === "executive_review_required"
            ? "This decision needs executive review before apply."
            : "This decision needs approval before stronger action.")
        : null,
    allowed_post_approval_actions: requireForApply
      ? ["apply", ...(governance?.allowed_actions ?? []).filter((action: string) => action !== "apply")]
      : governance?.allowed_actions ?? ["preview", "simulate", "compare", "save"],
    blocked_until_approval_actions: requireForApply
      ? blockedUntilApproval
      : [],
  };
}
