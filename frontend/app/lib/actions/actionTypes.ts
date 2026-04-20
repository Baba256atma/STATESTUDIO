import type { RightPanelView } from "../ui/right-panel/rightPanelTypes";

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
  | "guided_flow";

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

export type NexoraActionIntent =
  | NexoraOpenPanelIntent
  | { kind: "run_simulation" }
  | { kind: "compare_options" }
  | { kind: "open_center_timeline" }
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
  | "continuity_preserved";

export type ActionRouteContinuityHint =
  | "none"
  | "preserved_strong_panel"
  | "escalation"
  /** Same concrete panel view; intent adds section/tab/leftNav (sub-panel drill-in). */
  | "same_view_subnav";

export type ActionRouteExecutionMode =
  | "open_right_panel"
  | "open_center_compare"
  | "open_center_timeline"
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
  panelRequest?: ActionRoutePanelRequest;
  continuityHint: ActionRouteContinuityHint;
};

export type ActionRouteRejected = {
  status: "rejected";
  reason: ActionRouteRejectReason;
  detail?: string;
};

export type ActionRouteResult = ActionRouteOk | ActionRouteRejected;
