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
  "explanation",
  "risk",
  "fragility",
  "object",
  "object_focus",
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
  /** Primary entry: describe situation, attach context (no backend wiring yet). */
  "input",
] as const;

export const PROTECTED_RIGHT_PANEL_VIEWS = [
  "timeline",
  "advice",
  "war_room",
  "simulate",
  "compare",
] as const;

export type CanonicalRightPanelView = (typeof CANONICAL_RIGHT_PANEL_VIEWS)[number];
export type ProtectedRightPanelView = (typeof PROTECTED_RIGHT_PANEL_VIEWS)[number];
export type RightPanelView = CanonicalRightPanelView | null;
export type CenterExecutionSurface =
  | "compare"
  | "timeline"
  | "analysis"
  | "simulation"
  | "workspace"
  | "object_inspection";

export function isProtectedRightPanelView(
  view: RightPanelView
): view is ProtectedRightPanelView {
  return !!view && (PROTECTED_RIGHT_PANEL_VIEWS as readonly string[]).includes(view);
}

export type RightPanelState = {
  isOpen: boolean;
  view: RightPanelView;
  contextId?: string | null;
  timestamp?: number;
};
