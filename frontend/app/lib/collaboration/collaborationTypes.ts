export type CollaboratorRole =
  | "executive"
  | "manager"
  | "analyst"
  | "operator"
  | "investor"
  | "observer";

export type CollaborationInputKind =
  | "perspective"
  | "concern"
  | "support"
  | "challenge"
  | "approval_note"
  | "escalation_note"
  | "evidence_request";

export type CollaborationInput = {
  id: string;
  timestamp: number;
  user_id: string;
  user_label: string;
  role: CollaboratorRole;
  kind: CollaborationInputKind;
  summary: string;
  related_to?: string | null;
};

export type CollaboratorPerspective = {
  user_id: string;
  user_label: string;
  role: CollaboratorRole;
  priority_points: string[];
  concerns: string[];
  preferred_next_action?: string | null;
};

export type CollaborationAlignment = {
  alignment_level: "high" | "moderate" | "low";
  agreement_points: string[];
  disagreement_points: string[];
  unresolved_questions: string[];
};

export type CollaborationDecisionDelta = {
  changed: boolean;
  summary: string;
  before_summary?: string | null;
  after_summary?: string | null;
};

export type CollaborationState = {
  decision_id?: string | null;
  generated_at: number;
  shared_recommendation: string;
  contributors: CollaboratorPerspective[];
  inputs: CollaborationInput[];
  alignment: CollaborationAlignment;
  decision_delta: CollaborationDecisionDelta;
  next_steps: string[];
};
