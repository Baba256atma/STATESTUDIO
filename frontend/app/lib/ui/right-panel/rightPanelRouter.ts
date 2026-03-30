import {
  CANONICAL_RIGHT_PANEL_VIEWS,
  type CanonicalRightPanelView,
  type RightPanelState,
  type RightPanelView,
} from "./rightPanelTypes";

const DASHBOARD_VIEW: CanonicalRightPanelView = "dashboard";
const EXECUTIVE_DASHBOARD_TAB = "executive_dashboard";
const CANONICAL_RIGHT_PANEL_VIEW_SET = new Set<string>(CANONICAL_RIGHT_PANEL_VIEWS);

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
  decision_council: "decision_council",
  council: "decision_council",
  collaboration_intelligence: "collaboration_intelligence",
  risk_flow: "risk",
  risk: "risk",
  fragility: "risk",
  fragility_scan: "risk",
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
  replay: "replay",
  kpi: "kpi",
};

const EXECUTIVE_FAMILY_VIEWS = new Set<CanonicalRightPanelView>([
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
  "decision_timeline",
  "confidence_calibration",
  "outcome_feedback",
  "pattern_intelligence",
  "collaboration_intelligence",
  "decision_council",
  "scenario_tree",
  "kpi",
]);

function warnUnmapped(kind: string, value: string | null | undefined) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[Nexora] Unmapped ${kind}:`, value ?? null);
  }
}

export function isCanonicalRightPanelView(value: unknown): value is CanonicalRightPanelView {
  return typeof value === "string" && CANONICAL_RIGHT_PANEL_VIEW_SET.has(value);
}

export function resolveSafeRightPanelView(input: unknown): CanonicalRightPanelView {
  if (input === "fragility" || input === "fragility_scan") {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora][PanelRouter]", { input, resolvedView: "risk" });
    }
    return "risk";
  }

  if (isCanonicalRightPanelView(input)) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora][PanelRouter]", { input, resolvedView: input });
    }
    return input;
  }

  const normalized = String(input ?? "").trim();
  const resolved =
    (normalized ? LEGACY_TAB_TO_RIGHT_PANEL_VIEW[normalized] : null) ??
    DASHBOARD_VIEW;

  if (process.env.NODE_ENV !== "production") {
    if (!normalized || !LEGACY_TAB_TO_RIGHT_PANEL_VIEW[normalized]) {
      console.warn("[Nexora][PanelRouter] Invalid view received", {
        input,
        resolvedView: resolved,
      });
    } else {
      console.log("[Nexora][PanelRouter]", { input, resolvedView: resolved });
    }
  }

  return resolved;
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
  if (!normalized) return DASHBOARD_VIEW;
  const mapped = LEGACY_TAB_TO_RIGHT_PANEL_VIEW[normalized];
  if (process.env.NODE_ENV !== "production") {
    console.log("[Nexora][ButtonMapping]", {
      input: normalized || null,
      resolvedView: mapped ?? null,
    });
  }
  if (mapped) return mapped;
  warnUnmapped("legacy right-panel tab", normalized);
  return resolveSafeRightPanelView(normalized);
}

export function mapRightPanelViewToLegacyTab(view: RightPanelView): string | null {
  if (!view) return EXECUTIVE_DASHBOARD_TAB;
  if (EXECUTIVE_FAMILY_VIEWS.has(view)) return EXECUTIVE_DASHBOARD_TAB;
  if (view === "risk" || view === "fragility") return "risk_flow";
  if (view === "object") return "object_focus";
  if (view === "advice") return "strategic_advice";
  if (view === "memory") return "memory_insights";
  if (view === "patterns") return "strategic_patterns";
  if (view === "opponent") return "opponent_moves";
  if (view === "timeline" || view === "conflict" || view === "replay" || view === "war_room" || view === "collaboration" || view === "workspace") {
    return view;
  }
  warnUnmapped("right-panel view for legacy tab", view);
  return EXECUTIVE_DASHBOARD_TAB;
}

export function mapRightPanelViewToLegacyInspectorTab(view: RightPanelView): string | null {
  if (!view) return EXECUTIVE_DASHBOARD_TAB;
  if (EXECUTIVE_FAMILY_VIEWS.has(view)) return EXECUTIVE_DASHBOARD_TAB;
  if (view === "risk" || view === "fragility") return "risk_flow";
  if (view === "object") return "object_focus";
  if (view === "advice") return "strategic_advice";
  if (view === "memory") return "memory_insights";
  if (view === "patterns") return "strategic_patterns";
  if (view === "opponent") return "opponent_moves";
  if (view === "timeline" || view === "conflict" || view === "replay" || view === "war_room" || view === "collaboration" || view === "workspace") {
    return view;
  }
  warnUnmapped("right-panel view for inspector tab", view);
  return EXECUTIVE_DASHBOARD_TAB;
}
