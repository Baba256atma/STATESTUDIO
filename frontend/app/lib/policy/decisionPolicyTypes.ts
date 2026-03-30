export type DecisionPolicyPosture =
  | "permissive"
  | "guarded"
  | "simulation_first"
  | "compare_first"
  | "approval_gated"
  | "executive_review"
  | "restricted";

export type DecisionPolicyRule = {
  id: string;
  label: string;
  category:
    | "risk"
    | "confidence"
    | "calibration"
    | "team_alignment"
    | "org_memory"
    | "environment"
    | "execution_safety"
    | "evidence_quality";
  summary: string;
  severity?: "low" | "medium" | "high";
};

export type DecisionPolicyEvaluation = {
  rule_id: string;
  label: string;
  passed: boolean;
  impact:
    | "allow"
    | "caution"
    | "simulate_first"
    | "compare_first"
    | "approval_required"
    | "executive_review"
    | "block";
  summary: string;
};

export type DecisionPolicyState = {
  decision_id?: string | null;
  posture: DecisionPolicyPosture;
  active_rules: DecisionPolicyRule[];
  evaluations: DecisionPolicyEvaluation[];
  constraints: string[];
  policy_drivers: string[];
  explanation: string;
  next_steps: string[];
};
