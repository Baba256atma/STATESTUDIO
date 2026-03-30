export type DecisionTimelineEvent = {
  id: string;
  timestamp: number;
  type:
    | "prompt"
    | "reasoning"
    | "multi_agent"
    | "simulation"
    | "comparison"
    | "recommendation"
    | "action"
    | "memory_saved"
    | "strategic_command_state_generated"
    | "confidence_calibrated"
    | "outcome_feedback_captured"
    | "decision_strategy_selected"
    | "cognitive_style_selected"
    | "team_decision_review_generated"
    | "collaboration_input_added"
    | "collaboration_alignment_updated"
    | "collaboration_decision_delta_detected"
    | "autonomous_council_review_generated"
    | "council_consensus_updated"
    | "org_memory_considered"
    | "decision_policy_evaluated"
    | "decision_governance_evaluated"
    | "approval_required"
    | "approval_approved"
    | "approval_rejected"
    | "approval_escalated";
  title: string;
  summary: string;
  source:
    | "user"
    | "ai_reasoning"
    | "multi_agent"
    | "simulation_engine"
    | "recommendation_engine";
  confidence?: number;
  related_ids?: string[];
  why?: string[];
  signals?: string[];
  uncertainty?: string[];
  provenance_ref_id?: string;
};

export type DecisionTimelineViewEvent = DecisionTimelineEvent & {
  sourceLabel: string;
  confidenceLabel?: string | null;
};
