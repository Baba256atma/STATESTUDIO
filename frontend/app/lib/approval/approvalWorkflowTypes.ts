export type ApprovalStatus =
  | "not_required"
  | "pending_review"
  | "approved"
  | "rejected"
  | "escalated"
  | "expired";

export type ApprovalActorRole =
  | "executive"
  | "manager"
  | "analyst"
  | "operator"
  | "investor"
  | "system_owner";

export type ApprovalDecisionRecord = {
  id: string;
  timestamp: number;
  actor_role: ApprovalActorRole;
  decision: "approved" | "rejected" | "escalated";
  note?: string | null;
};

export type ApprovalWorkflowState = {
  decision_id?: string | null;
  required: boolean;
  status: ApprovalStatus;
  requested_reviewer_role?: ApprovalActorRole | null;
  current_owner_role?: ApprovalActorRole | null;
  reason?: string | null;
  escalation_reason?: string | null;
  allowed_post_approval_actions: string[];
  blocked_until_approval_actions: string[];
  decisions: ApprovalDecisionRecord[];
  explanation: string;
  next_steps: string[];
};
