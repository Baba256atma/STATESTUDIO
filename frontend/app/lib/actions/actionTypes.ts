import type { CenterExecutionSurface, RightPanelView } from "../ui/right-panel/rightPanelTypes";

/** Who initiated the action (product-facing taxonomy). */
export type NexoraActionSource =
  | "chat"
  | "topbar"
  | "panel_cta"
  | "scanner"
  | "demo"
  | "system"
  | "left_nav"
  | "guided";

/** Where the gesture occurred (may match source or be more specific). */
export type NexoraActionSurface =
  | NexoraActionSource
  | "event_bus"
  | "center_overlay"
  | "legacy_shell"
  | "sub_panel"
  | "decision_flow"
  | "guided_flow"
  | "scene";

export type NexoraOpenPanelIntent = {
  kind: "open_panel";
  view: RightPanelView;
  contextId?: string | null;
  legacyTab?: string | null;
  leftNav?: string | null;
  section?: string | null;
  clickedTab?: string | null;
  clickedNav?: string | null;
  preserveIfSameContext?: boolean;
  allowAutoOverride?: boolean;
};

/** Center workspace full surfaces (right rail stays preview/summary only). */
export type NexoraComponentPanelId =
  | "compare"
  | "timeline"
  | "confidence_calibration"
  | "pattern_intelligence"
  | "strategic_learning"
  | "decision_strategic"
  | "decision_lens"
  | "collaboration_intelligence"
  | "outcome_feedback"
  | "decision_memory"
  | "decision_lifecycle"
  | "scenario_tree"
  | "strategic_command_full"
  | "team_decision"
  | "decision_council"
  | "org_memory"
  | "decision_policy"
  | "executive_approval"
  | "decision_governance";

export type NexoraActionIntent =
  | NexoraOpenPanelIntent
  | { kind: "run_simulation" }
  | { kind: "compare_options" }
  | { kind: "open_center_timeline" }
  | { kind: "open_center_execution"; surface: CenterExecutionSurface }
  /** Opens the named component surface in the center workspace (canonical panel controller path). */
  | { kind: "open_component_panel"; component: NexoraComponentPanelId }
  | { kind: "focus_object"; objectId: string | null }
  | { kind: "start_demo" }
  | { kind: "noop"; reason?: string };

/**
 * Canonical envelope for UI-triggered Nexora actions (Pass 1).
 * Keep payloads small; extend in later passes if needed.
 */
export type CanonicalNexoraAction = {
  actionId: string;
  source: NexoraActionSource;
  surface: NexoraActionSurface;
  intent: NexoraActionIntent;
  target?: { type: "panel" | "object" | "center" | "none"; id?: string | null };
  payload?: Record<string, unknown>;
  meta?: { rawSource?: string | null; timestamp?: number };
};

export type ActionRouterContext = {
  currentView: RightPanelView;
  currentContextId: string | null;
};

export type ActionRouteRejectReason =
  | "missing_target"
  | "unknown_intent"
  | "invalid_empty_route"
  | "guard_rejected"
  | "same_view_same_context"
  | "continuity_preserved";

export type ActionRouteContinuityHint =
  | "none"
  | "preserved_strong_panel"
  | "escalation"
  /** Same concrete panel view; intent adds section/tab/leftNav (sub-panel drill-in). */
  | "same_view_subnav";

export type ActionRouteExecutionMode =
  | "open_right_panel"
  | "open_center_simulation"
  | "open_center_compare"
  | "open_center_timeline"
  | "open_center_execution"
  | "open_center_strategic_command_full"
  | "open_center_team_decision"
  | "open_center_decision_council"
  | "open_center_org_memory"
  | "open_center_decision_policy"
  | "open_center_executive_approval"
  | "open_center_decision_governance"
  | "open_center_confidence_calibration"
  | "open_center_pattern_intelligence"
  | "open_center_strategic_learning"
  | "open_center_decision_strategic"
  | "open_center_decision_lens"
  | "open_center_collaboration_intelligence"
  | "open_center_outcome_feedback"
  | "open_center_decision_memory"
  | "open_center_decision_lifecycle"
  | "open_center_scenario_tree"
  | "start_investor_demo"
  | "noop";

export type ActionRoutePanelRequest = {
  view: RightPanelView;
  contextId?: string | null;
  source: string;
  rawSource?: string | null;
  legacyTab?: string | null;
  leftNav?: string | null;
  section?: string | null;
  clickedTab?: string | null;
  clickedNav?: string | null;
  preserveIfSameContext?: boolean;
  allowAutoOverride?: boolean;
};

export type ActionRouteOk = {
  status: "ok";
  resolvedIntent: NexoraActionIntent["kind"];
  resolvedPanelView: RightPanelView;
  resolvedObjectTargetId: string | null;
  execution: ActionRouteExecutionMode;
  centerSurface?: CenterExecutionSurface | null;
  panelRequest?: ActionRoutePanelRequest;
  continuityHint: ActionRouteContinuityHint;
};

export type ActionRouteRejected = {
  status: "rejected";
  reason: ActionRouteRejectReason;
  detail?: string;
};

export type ActionRouteResult = ActionRouteOk | ActionRouteRejected;
