export type CouncilRole =
  | "strategist"
  | "risk_officer"
  | "operator"
  | "financial_reviewer"
  | "skeptic";

export type CouncilRolePerspective = {
  role: CouncilRole;
  headline: string;
  priorities: string[];
  concerns: string[];
  proposed_action: string;
  confidence_note?: string | null;
};

export type CouncilDebateState = {
  agreement_points: string[];
  conflict_points: string[];
  unresolved_questions: string[];
};

export type CouncilConsensus = {
  consensus_level: "high" | "moderate" | "low";
  final_recommendation: string;
  rationale: string;
  strongest_support: string[];
  main_reservations: string[];
};

export type AutonomousDecisionCouncilState = {
  decision_id?: string | null;
  generated_at: number;
  explanation: string;
  role_perspectives: CouncilRolePerspective[];
  debate: CouncilDebateState;
  consensus: CouncilConsensus;
  next_steps: string[];
};
