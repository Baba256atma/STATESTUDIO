
import {
  CANONICAL_RIGHT_PANEL_VIEWS,
  type CanonicalRightPanelView,
  type RightPanelState,
  type RightPanelView,
} from "./rightPanelTypes";
import {
  isRightPanelActionIntent,
  resolveRightPanelAction as resolvePanelActionIntent,
} from "./panelActionRouter";

const EXECUTIVE_DASHBOARD_TAB = "executive_dashboard";
const CANONICAL_RIGHT_PANEL_VIEW_SET = new Set<string>(CANONICAL_RIGHT_PANEL_VIEWS);
const PROTECTED_VIEWS = new Set<RightPanelView>([
  "timeline",
  "advice",
  "war_room",
  "simulate",
  "compare",
]);

export const RIGHT_PANEL_LEFT_NAV_KEYS = [
  "scene_group",
  "strategy_group",
  "risk_group",
  "workflow_group",
  "executive_group",
] as const;

export type RightPanelLeftNavKey = (typeof RIGHT_PANEL_LEFT_NAV_KEYS)[number];

export const RIGHT_PANEL_SHELL_SECTIONS = [
  "scene",
  "objects",
  "kpi",
  "risk",
  "loops",
  "timeline",
  "conflict",
  "explanation",
  "focus",
  "memory",
  "risk_flow",
  "replay",
  "advice",
  "opponent",
  "patterns",
  "executive",
  "war_room",
  "collaboration",
  "workspace",
] as const;

export type RightPanelShellSection = (typeof RIGHT_PANEL_SHELL_SECTIONS)[number];

export const RIGHT_PANEL_RAIL_TABS = [
  "scene",
  "object",
  "timeline",
  "conflict",
  "explanation",
  "object_focus",
  "memory_insights",
  "risk_flow",
  "fragility_scan",
  "replay",
  "strategic_advice",
  "opponent_moves",
  "strategic_patterns",
  "executive_dashboard",
  "war_room",
  "collaboration",
  "workspace",
  "simulate",
  "compare",
  "decision_timeline",
  "confidence_calibration",
  "outcome_feedback",
  "pattern_intelligence",
  "scenario_tree",
  "strategic_command",
  "decision_lifecycle",
  "strategic_learning",
  "meta_decision",
  "cognitive_style",
  "team_decision",
  "org_memory",
  "decision_governance",
  "decision_policy",
  "executive_approval",
  "decision_council",
  "collaboration_intelligence",
  "kpi",
] as const;

export type RightPanelRailTab = (typeof RIGHT_PANEL_RAIL_TABS)[number];

export type CanonicalRouteResolution = {
  resolvedView: RightPanelView;
  legacyTab: string | null;
  shellSection: RightPanelShellSection | null;
  fallbackReason: string | null;
};

const LEGACY_TAB_TO_RIGHT_PANEL_VIEW: Record<string, CanonicalRightPanelView> = {
  strategic_command: "strategic_command",
  executive_dashboard: "dashboard",
  dashboard: "dashboard",
  scene: "workspace",
  scene_focus: "workspace",
  simulate: "simulate",
  simulation: "simulate",
  run_simulation: "simulate",
  risk_simulation: "simulate",
  compare: "compare",
  decision_lifecycle: "decision_lifecycle",
  strategic_learning: "strategic_learning",
  meta_decision: "meta_decision",
  cognitive_style: "cognitive_style",
  team_decision: "team_decision",
  org_memory: "org_memory",
  decision_governance: "decision_governance",
  governance: "decision_governance",
  decision_policy: "decision_policy",
  policy: "decision_policy",
  open_policy: "decision_policy",
  decisionPolicy: "decision_policy",
  executive_approval: "executive_approval",
  approval: "executive_approval",
  open_approval: "executive_approval",
  decision_council: "decision_council",
  council: "decision_council",
  collaboration_intelligence: "collaboration_intelligence",
  risk_flow: "risk",
  risk: "risk",
  fragility: "fragility",
  fragility_scan: "fragility",
  object_focus: "object",
  object: "object",
  strategic_advice: "advice",
  advice: "advice",
  recommendation: "advice",
  memory_insights: "memory",
  memory: "memory",
  strategic_patterns: "patterns",
  patterns: "patterns",
  opponent_moves: "opponent",
  opponent: "opponent",
  war_room: "war_room",
  workspace: "workspace",
  collaboration: "collaboration",
  timeline: "timeline",
  decision_timeline: "decision_timeline",
  confidence_calibration: "confidence_calibration",
  outcome_feedback: "outcome_feedback",
  pattern_intelligence: "pattern_intelligence",
  scenario_tree: "scenario_tree",
  conflict: "conflict",
  explanation: "explanation",
  replay: "replay",
  kpi: "kpi",
};

const RIGHT_PANEL_VIEW_TO_LEGACY_TAB: Record<CanonicalRightPanelView, string> = {
  strategic_command: "strategic_command",
  dashboard: EXECUTIVE_DASHBOARD_TAB,
  simulate: "simulate",
  compare: "compare",
  decision_lifecycle: "decision_lifecycle",
  strategic_learning: "strategic_learning",
  meta_decision: "meta_decision",
  cognitive_style: "cognitive_style",
  team_decision: "team_decision",
  org_memory: "org_memory",
  decision_governance: "decision_governance",
  decision_policy: "decision_policy",
  executive_approval: "executive_approval",
  explanation: "explanation",
  risk: "risk_flow",
  fragility: "fragility_scan",
  object: "object_focus",
  timeline: "timeline",
  decision_timeline: "decision_timeline",
  confidence_calibration: "confidence_calibration",
  outcome_feedback: "outcome_feedback",
  pattern_intelligence: "pattern_intelligence",
  collaboration_intelligence: "collaboration_intelligence",
  decision_council: "decision_council",
  scenario_tree: "scenario_tree",
  advice: "strategic_advice",
  kpi: "kpi",
  war_room: "war_room",
  conflict: "conflict",
  memory: "memory_insights",
  replay: "replay",
  patterns: "strategic_patterns",
  opponent: "opponent_moves",
  collaboration: "collaboration",
  workspace: "workspace",
};

const RIGHT_PANEL_LEFT_NAV_TO_ROUTE: Record<
  RightPanelLeftNavKey,
  { resolvedView: CanonicalRightPanelView; legacyTab: string; shellSection: RightPanelShellSection }
> = {
  scene_group: {
    resolvedView: "workspace",
    legacyTab: "scene",
    shellSection: "scene",
  },
  strategy_group: {
    resolvedView: "simulate",
    legacyTab: "simulate",
    shellSection: "timeline",
  },
  risk_group: {
    resolvedView: "explanation",
    legacyTab: "explanation",
    shellSection: "explanation",
  },
  workflow_group: {
    resolvedView: "workspace",
    legacyTab: "workspace",
    shellSection: "workspace",
  },
  executive_group: {
    resolvedView: "dashboard",
    legacyTab: "executive_dashboard",
    shellSection: "executive",
  },
};

const RIGHT_PANEL_RAIL_TAB_TO_ROUTE: Record<
  RightPanelRailTab,
  { resolvedView: CanonicalRightPanelView; shellSection: RightPanelShellSection }
> = {
  scene: { resolvedView: "workspace", shellSection: "scene" },
  object: { resolvedView: "object", shellSection: "objects" },
  timeline: { resolvedView: "timeline", shellSection: "timeline" },
  conflict: { resolvedView: "conflict", shellSection: "conflict" },
  explanation: { resolvedView: "explanation", shellSection: "explanation" },
  object_focus: { resolvedView: "object", shellSection: "focus" },
  memory_insights: { resolvedView: "memory", shellSection: "memory" },
  risk_flow: { resolvedView: "risk", shellSection: "risk_flow" },
  fragility_scan: { resolvedView: "fragility", shellSection: "risk" },
  replay: { resolvedView: "replay", shellSection: "replay" },
  strategic_advice: { resolvedView: "advice", shellSection: "advice" },
  opponent_moves: { resolvedView: "opponent", shellSection: "opponent" },
  strategic_patterns: { resolvedView: "patterns", shellSection: "patterns" },
  executive_dashboard: { resolvedView: "dashboard", shellSection: "executive" },
  war_room: { resolvedView: "war_room", shellSection: "war_room" },
  collaboration: { resolvedView: "collaboration", shellSection: "collaboration" },
  workspace: { resolvedView: "workspace", shellSection: "workspace" },
  simulate: { resolvedView: "simulate", shellSection: "timeline" },
  compare: { resolvedView: "compare", shellSection: "timeline" },
  decision_timeline: { resolvedView: "decision_timeline", shellSection: "timeline" },
  confidence_calibration: { resolvedView: "confidence_calibration", shellSection: "timeline" },
  outcome_feedback: { resolvedView: "outcome_feedback", shellSection: "timeline" },
  pattern_intelligence: { resolvedView: "pattern_intelligence", shellSection: "timeline" },
  scenario_tree: { resolvedView: "scenario_tree", shellSection: "timeline" },
  strategic_command: { resolvedView: "strategic_command", shellSection: "executive" },
  decision_lifecycle: { resolvedView: "decision_lifecycle", shellSection: "executive" },
  strategic_learning: { resolvedView: "strategic_learning", shellSection: "executive" },
  meta_decision: { resolvedView: "meta_decision", shellSection: "executive" },
  cognitive_style: { resolvedView: "cognitive_style", shellSection: "executive" },
  team_decision: { resolvedView: "team_decision", shellSection: "executive" },
  org_memory: { resolvedView: "org_memory", shellSection: "executive" },
  decision_governance: { resolvedView: "decision_governance", shellSection: "executive" },
  decision_policy: { resolvedView: "decision_policy", shellSection: "executive" },
  executive_approval: { resolvedView: "executive_approval", shellSection: "executive" },
  decision_council: { resolvedView: "decision_council", shellSection: "executive" },
  collaboration_intelligence: { resolvedView: "collaboration_intelligence", shellSection: "executive" },
  kpi: { resolvedView: "kpi", shellSection: "kpi" },
};

const RIGHT_PANEL_VIEW_TO_SHELL_SECTION: Record<CanonicalRightPanelView, RightPanelShellSection> = {
  strategic_command: "executive",
  dashboard: "executive",
  simulate: "timeline",
  compare: "timeline",
  decision_lifecycle: "executive",
  strategic_learning: "executive",
  meta_decision: "executive",
  cognitive_style: "executive",
  team_decision: "executive",
  org_memory: "executive",
  decision_governance: "executive",
  decision_policy: "executive",
  executive_approval: "executive",
  explanation: "explanation",
  risk: "risk_flow",
  fragility: "risk",
  object: "focus",
  timeline: "timeline",
  decision_timeline: "timeline",
  confidence_calibration: "timeline",
  outcome_feedback: "timeline",
  pattern_intelligence: "timeline",
  collaboration_intelligence: "executive",
  decision_council: "executive",
  scenario_tree: "timeline",
  advice: "advice",
  kpi: "kpi",
  war_room: "war_room",
  conflict: "conflict",
  memory: "memory",
  replay: "replay",
  patterns: "patterns",
  opponent: "opponent",
  collaboration: "collaboration",
  workspace: "workspace",
};

const RIGHT_PANEL_VIEW_TO_HOST_ID: Record<CanonicalRightPanelView, string> = {
  strategic_command: "nexora-inspector-exec-host",
  dashboard: "nexora-inspector-exec-host",
  simulate: "nexora-inspector-timeline-host",
  compare: "nexora-inspector-timeline-host",
  decision_lifecycle: "nexora-inspector-exec-host",
  strategic_learning: "nexora-inspector-exec-host",
  meta_decision: "nexora-inspector-exec-host",
  cognitive_style: "nexora-inspector-exec-host",
  team_decision: "nexora-inspector-exec-host",
  org_memory: "nexora-inspector-exec-host",
  decision_governance: "nexora-inspector-exec-host",
  decision_policy: "nexora-inspector-exec-host",
  executive_approval: "nexora-inspector-exec-host",
  explanation: "nexora-inspector-riskflow-host",
  risk: "nexora-inspector-riskflow-host",
  fragility: "nexora-inspector-riskflow-host",
  object: "nexora-inspector-focus-host",
  timeline: "nexora-inspector-timeline-host",
  decision_timeline: "nexora-inspector-timeline-host",
  confidence_calibration: "nexora-inspector-timeline-host",
  outcome_feedback: "nexora-inspector-timeline-host",
  pattern_intelligence: "nexora-inspector-timeline-host",
  collaboration_intelligence: "nexora-inspector-exec-host",
  decision_council: "nexora-inspector-exec-host",
  scenario_tree: "nexora-inspector-timeline-host",
  advice: "nexora-inspector-advice-host",
  kpi: "nexora-inspector-exec-host",
  war_room: "nexora-inspector-warroom-host",
  conflict: "nexora-inspector-conflict-host",
  memory: "nexora-inspector-memory-host",
  replay: "nexora-inspector-replay-host",
  patterns: "nexora-inspector-patterns-host",
  opponent: "nexora-inspector-opponent-host",
  collaboration: "nexora-inspector-collab-host",
  workspace: "nexora-inspector-workspace-host",
};

function warnUnmapped(kind: string, value: string | null | undefined) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[Nexora] Unmapped ${kind}:`, value ?? null);
  }
}

export function isCanonicalRightPanelView(value: unknown): value is CanonicalRightPanelView {
  return typeof value === "string" && CANONICAL_RIGHT_PANEL_VIEW_SET.has(value);
}

export function isValidRightPanelView(value: unknown): value is CanonicalRightPanelView {
  return isCanonicalRightPanelView(value);
}

export function isRightPanelLeftNavKey(value: unknown): value is RightPanelLeftNavKey {
  return typeof value === "string" && RIGHT_PANEL_LEFT_NAV_KEYS.includes(value as RightPanelLeftNavKey);
}

export function isRightPanelRailTab(value: unknown): value is RightPanelRailTab {
  return typeof value === "string" && RIGHT_PANEL_RAIL_TABS.includes(value as RightPanelRailTab);
}

export function resolveRightPanelAction(actionId: string): {
  targetView: RightPanelView | null;
  error?: string;
} {
  if (!isRightPanelActionIntent(actionId)) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Router][INVALID_ACTION]", { actionId });
    }
    return { targetView: null, error: "UNMAPPED_ACTION" };
  }

  const resolution = resolvePanelActionIntent(actionId, null);
  if (!isValidRightPanelView(resolution.targetView)) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Router][INVALID_ACTION_TARGET_VIEW]", {
        actionId,
        targetView: resolution.targetView,
        expectedViewType: "RightPanelView",
      });
    }
    return { targetView: null, error: "INVALID_TARGET_VIEW" };
  }

  return { targetView: resolution.targetView };
}

export function resolveSafeRightPanelView(
  view: any,
  source: "direct_open" | "legacy_alias" | "action_intent" | "unknown" = "unknown"
): RightPanelView | null {
  const normalized = typeof view === "string" ? view.trim() : view;

  if (!normalized || typeof normalized !== "string") {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Router][INVALID_VIEW_EMPTY]", {
        view,
        source,
      });
    }
    return null;
  }

  if (isValidRightPanelView(normalized)) {
    return normalized;
  }

  const mappedLegacyView = LEGACY_TAB_TO_RIGHT_PANEL_VIEW[normalized];
  if (mappedLegacyView && isValidRightPanelView(mappedLegacyView)) {
    return mappedLegacyView;
  }

  if (source === "legacy_alias") {
    warnUnmapped("legacy right-panel tab", normalized);
    return null;
  }

  if (process.env.NODE_ENV !== "production") {
    console.error("[Router][INVALID_VIEW]", {
      view: normalized,
      source,
      aliasMapped: Boolean(mappedLegacyView),
    });
  }
  return null;
}

function buildRouteResolution(
  resolvedView: CanonicalRightPanelView,
  legacyTab: string | null,
  shellSection: RightPanelShellSection | null,
  fallbackReason: string | null = null
): CanonicalRouteResolution {
  return {
    resolvedView,
    legacyTab,
    shellSection,
    fallbackReason,
  };
}

export function resolveRightPanelLeftNavRoute(
  navKey: string | null | undefined
): CanonicalRouteResolution | null {
  if (!isRightPanelLeftNavKey(navKey)) {
    return null;
  }
  const route = RIGHT_PANEL_LEFT_NAV_TO_ROUTE[navKey];
  return buildRouteResolution(route.resolvedView, route.legacyTab, route.shellSection);
}

export function resolveRightPanelRailRoute(
  legacyTab: string | null | undefined
): CanonicalRouteResolution | null {
  if (!isRightPanelRailTab(legacyTab)) {
    return null;
  }
  const route = RIGHT_PANEL_RAIL_TAB_TO_ROUTE[legacyTab];
  return buildRouteResolution(route.resolvedView, legacyTab, route.shellSection);
}

export function resolveRightPanelLegacyTabForView(
  view: RightPanelView,
  preferredLegacyTab: string | null = null
): string | null {
  if (!view) {
    return null;
  }
  const normalizedPreferred =
    typeof preferredLegacyTab === "string" && preferredLegacyTab.trim().length > 0
      ? preferredLegacyTab.trim()
      : null;
  if (
    normalizedPreferred &&
    LEGACY_TAB_TO_RIGHT_PANEL_VIEW[normalizedPreferred] === view
  ) {
    return normalizedPreferred;
  }
  // For object/risk families, prefer the base legacy tab unless a more specific tab was explicitly selected by the user.
  if (view === "object") {
    return normalizedPreferred === "object_focus" ? "object_focus" : "object";
  }
  if (view === "risk") {
    return normalizedPreferred === "risk_flow" ? "risk_flow" : "risk";
  }
  return RIGHT_PANEL_VIEW_TO_LEGACY_TAB[view] ?? null;
}

export function resolveRightPanelShellSectionForView(
  view: RightPanelView,
  preferredLegacyTab: string | null = null
): RightPanelShellSection | null {
  if (!view) {
    return null;
  }
  const preferredRoute = resolveRightPanelRailRoute(preferredLegacyTab);
  if (preferredRoute?.resolvedView === view) {
    return preferredRoute.shellSection;
  }
  return RIGHT_PANEL_VIEW_TO_SHELL_SECTION[view] ?? null;
}

export function resolveRightPanelInspectorHostId(
  view: RightPanelView,
  preferredLegacyTab: string | null = null
): string | null {
  if (!view) {
    return null;
  }
  if (preferredLegacyTab === "scene" || preferredLegacyTab === "object" || preferredLegacyTab === "object_focus") {
    return null;
  }
  return RIGHT_PANEL_VIEW_TO_HOST_ID[view] ?? null;
}

export function resolveCanonicalRightPanelRoute(args: {
  requestedView?: unknown;
  legacyTab?: string | null;
  leftNav?: string | null;
}): CanonicalRouteResolution | null {
  const safeRequestedView =
    typeof args.requestedView === "string" && args.requestedView.trim().length > 0
      ? resolveSafeRightPanelView(args.requestedView, "direct_open")
      : null;

  if (safeRequestedView && PROTECTED_VIEWS.has(safeRequestedView)) {
    return buildRouteResolution(
      safeRequestedView,
      resolveRightPanelLegacyTabForView(safeRequestedView),
      resolveRightPanelShellSectionForView(safeRequestedView),
      null
    );
  }

  const railRoute = resolveRightPanelRailRoute(args.legacyTab);
  if (railRoute) {
    return railRoute;
  }

  const leftNavRoute = resolveRightPanelLeftNavRoute(args.leftNav);
  if (leftNavRoute) {
    return leftNavRoute;
  }

  if (safeRequestedView) {
    return buildRouteResolution(
      safeRequestedView,
      resolveRightPanelLegacyTabForView(safeRequestedView),
      resolveRightPanelShellSectionForView(safeRequestedView),
      null
    );
  }

  return null;
}

export function createClosedRightPanelState(): RightPanelState {
  return {
    isOpen: false,
    view: null,
    contextId: null,
    timestamp: Date.now(),
  };
}

export function createOpenRightPanelState(
  view: RightPanelView,
  contextId: string | null = null,
  timestamp: number = Date.now()
): RightPanelState {
  return {
    isOpen: true,
    view,
    contextId,
    timestamp,
  };
}

export function closeRightPanel(prev: RightPanelState): RightPanelState {
  return {
    ...prev,
    isOpen: false,
    timestamp: Date.now(),
  };
}

export function toggleRightPanel(
  prev: RightPanelState,
  view: RightPanelView,
  contextId: string | null = null
): RightPanelState {
  const sameTarget =
    prev.isOpen &&
    prev.view === view &&
    (prev.contextId ?? null) === contextId;

  if (sameTarget) {
    return closeRightPanel(prev);
  }

  return createOpenRightPanelState(view, contextId);
}

export function mapLegacyTabToRightPanelView(tab: string | null | undefined): RightPanelView {
  const normalized = String(tab ?? "").trim();
  if (!normalized) return null;

  const mapped = LEGACY_TAB_TO_RIGHT_PANEL_VIEW[normalized];
  if (process.env.NODE_ENV !== "production") {
    console.log("[Nexora][ButtonMapping]", {
      input: normalized || null,
      resolvedView: mapped ?? null,
    });
  }

  if (mapped) return mapped;
  warnUnmapped("legacy right-panel tab", normalized);
  return resolveSafeRightPanelView(normalized, "legacy_alias");
}

export function mapRightPanelViewToLegacyTab(view: RightPanelView): string | null {
  if (!view) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Router][UNMAPPED_VIEW_TO_LEGACY_TAB]", {
        currentView: view,
        mappedLegacyTab: null,
        reason: "No right-panel view is active.",
      });
    }
    return null;
  }

  const mapped = RIGHT_PANEL_VIEW_TO_LEGACY_TAB[view];
  if (mapped) {
    return mapped;
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn("[Router][UNMAPPED_VIEW_TO_LEGACY_TAB]", {
      currentView: view,
      mappedLegacyTab: null,
      reason: "No explicit legacy tab mapping exists for this panel view.",
    });
  }
  return null;
}

export function mapRightPanelViewToLegacyInspectorTab(view: RightPanelView): string | null {
  if (!view) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Router][UNMAPPED_VIEW_TO_INSPECTOR_TAB]", {
        currentView: view,
        mappedLegacyTab: null,
        reason: "No right-panel view is active.",
      });
    }
    return null;
  }

  const mapped = RIGHT_PANEL_VIEW_TO_LEGACY_TAB[view];
  if (mapped) {
    return mapped;
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn("[Router][UNMAPPED_VIEW_TO_INSPECTOR_TAB]", {
      currentView: view,
      mappedLegacyTab: null,
      reason: "No explicit inspector tab mapping exists for this panel view.",
    });
  }
  return null;
}
