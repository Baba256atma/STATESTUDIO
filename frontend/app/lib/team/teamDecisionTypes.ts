export type TeamDecisionRole =
  | "executive"
  | "analyst"
  | "operator"
  | "investor";

export type TeamRolePerspective = {
  role: TeamDecisionRole;
  headline: string;
  priorities: string[];
  concerns: string[];
  suggested_next_action: string;
  confidence_note?: string | null;
};

export type TeamDecisionAlignment = {
  alignment_level: "high" | "moderate" | "low";
  agreement_points: string[];
  disagreement_points: string[];
  unresolved_questions: string[];
};

export type TeamDecisionState = {
  decision_id: string;
  generated_at: number;
  shared_recommendation: string;
  shared_summary: string;
  role_perspectives: TeamRolePerspective[];
  alignment: TeamDecisionAlignment;
  team_next_move: string;
  escalation_needed: boolean;
};
