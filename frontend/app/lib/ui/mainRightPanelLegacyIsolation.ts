/**
 * MRP:1:1 — Documents legacy right-panel surfaces isolated from the clean MRP shell.
 *
 * Legacy code remains mounted behind the Dashboard tab via RightPanelHost.
 * Assistant is isolated in MainRightPanelShell and never routes through RightPanelHost.
 */

import type { RightPanelView } from "./right-panel/rightPanelTypes";

/** Legacy router/canonical views — compatibility input only, not MRP tabs. */
export const LEGACY_RIGHT_PANEL_RUNTIME_SURFACES: readonly RightPanelView[] = Object.freeze([
  "strategic_command",
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
  "executive_object",
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
  "scenario_tree",
  "collaboration_intelligence",
  "decision_council",
  "kpi",
  "advice",
  "war_room",
  "conflict",
  "memory",
  "replay",
  "patterns",
  "opponent",
  "collaboration",
  "workspace",
  "input",
]);

export const MRP_CLEAN_TAB_OWNERS = Object.freeze({
  dashboard: "MainRightPanelShell + legacy RightPanelHost (dashboard runtime only)",
  assistant: "MainRightPanelShell + MainRightPanelAssistantPlaceholder",
});

export const MRP_SCENE_NATIVE_SURFACES = Object.freeze([
  "Object Panel",
  "Timeline Panel",
  "Scene Panel",
  "Top Bar",
]);
