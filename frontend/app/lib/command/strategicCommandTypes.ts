import type { RightPanelView } from "../ui/right-panel/rightPanelTypes";

export type StrategicCommandPriority =
  | "stabilize"
  | "simulate"
  | "compare"
  | "review"
  | "approve"
  | "investigate"
  | "escalate"
  | "act";

export type StrategicCommandAlert = {
  id: string;
  level: "info" | "warning" | "critical";
  title: string;
  summary: string;
  source:
    | "recommendation"
    | "confidence"
    | "calibration"
    | "governance"
    | "approval"
    | "team"
    | "collaboration"
    | "org_memory"
    | "council"
    | "simulation";
};

export type StrategicCommandRoutingHint = {
  label: string;
  target_view: Extract<
    RightPanelView,
    | "dashboard"
    | "simulate"
    | "compare"
    | "timeline"
    | "risk"
    | "fragility"
    | "object"
    | "war_room"
    | "collaboration"
    | "team_decision"
    | "collaboration_intelligence"
    | "decision_governance"
    | "executive_approval"
    | "decision_policy"
    | "decision_council"
    | "org_memory"
    | "strategic_learning"
    | "decision_lifecycle"
  >;
  reason: string;
};

export type StrategicCommandState = {
  generated_at: number;
  headline: string;
  summary: string;
  priority: StrategicCommandPriority;
  priority_reason: string;
  alerts: StrategicCommandAlert[];
  command_recommendation: string;
  command_confidence_note?: string | null;
  command_governance_note?: string | null;
  command_approval_note?: string | null;
  next_move: string;
  next_move_reason: string;
  routing_hints: StrategicCommandRoutingHint[];
  review_flags: string[];
  explanation: string;
};
