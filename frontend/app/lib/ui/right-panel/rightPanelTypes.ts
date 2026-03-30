export const CANONICAL_RIGHT_PANEL_VIEWS = [
  "strategic_command",
  "dashboard",
  "simulate",
  "compare",
  "decision_lifecycle",
  "strategic_learning",
  "meta_decision",
  "cognitive_style",
  "team_decision",
  "org_memory",
  "decision_governance",
  "decision_policy",
  "executive_approval",
  "risk",
  "fragility",
  "object",
  "timeline",
  "decision_timeline",
  "confidence_calibration",
  "outcome_feedback",
  "pattern_intelligence",
  "collaboration_intelligence",
  "decision_council",
  "scenario_tree",
  "advice",
  "kpi",
  "war_room",
  "conflict",
  "memory",
  "replay",
  "patterns",
  "opponent",
  "collaboration",
  "workspace",
] as const;

export type CanonicalRightPanelView = (typeof CANONICAL_RIGHT_PANEL_VIEWS)[number];
export type RightPanelView = CanonicalRightPanelView | null;

export type RightPanelState = {
  isOpen: boolean;
  view: RightPanelView;
  contextId?: string | null;
  timestamp?: number;
};
