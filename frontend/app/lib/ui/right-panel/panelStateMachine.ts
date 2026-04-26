import type { RightPanelView } from "./rightPanelTypes";

export type RightPanelFamily =
  | "scene"
  | "object"
  | "risk"
  | "advice"
  | "timeline"
  | "simulate"
  | "war_room"
  | "executive"
  | "workflow"
  | "collaboration";

export type PanelStateMachineEvent =
  | "explicit_left_nav_click"
  | "explicit_right_rail_click"
  | "explicit_panel_button_click"
  | "guided_prompt_resolution"
  | "chat_intent_resolution"
  | "effect_reconcile"
  | "adapter_sync"
  | "host_fallback";

export type PanelTransitionInput = {
  sourceEvent: PanelStateMachineEvent;
  requestedView: RightPanelView;
  currentView: RightPanelView;
  requestedLegacyTab?: string | null;
  currentLegacyTab?: string | null;
  requestedFamily?: RightPanelFamily | null;
  currentFamily?: RightPanelFamily | null;
  preservedView?: RightPanelView;
  preservedFamily?: RightPanelFamily | null;
  fallbackView?: RightPanelView;
  contextId?: string | null;
  currentContextId?: string | null;
  renderableFamilies?: Iterable<RightPanelFamily> | null;
};

export type PanelTransitionResult = {
  allowed: boolean;
  blocked: boolean;
  noOp: boolean;
  familyPreserved: boolean;
  fallbackApplied: boolean;
  requestedFamily: RightPanelFamily | null;
  currentFamily: RightPanelFamily | null;
  finalView: RightPanelView;
  finalFamily: RightPanelFamily | null;
  reason: string;
};

const EXPLICIT_EVENTS = new Set<PanelStateMachineEvent>([
  "explicit_left_nav_click",
  "explicit_right_rail_click",
  "explicit_panel_button_click",
]);

const STRONG_PRESERVATION_FAMILIES = new Set<RightPanelFamily>(["object", "risk"]);

function normalizeRenderableFamilies(
  families: Iterable<RightPanelFamily> | null | undefined
): Set<RightPanelFamily> {
  return new Set(families ?? []);
}

function isExplicitEvent(event: PanelStateMachineEvent): boolean {
  return EXPLICIT_EVENTS.has(event);
}

function canRenderFamily(family: RightPanelFamily | null, renderableFamilies: Set<RightPanelFamily>): boolean {
  if (!family) return false;
  if (renderableFamilies.size === 0) return true;
  return renderableFamilies.has(family);
}

function shouldPreserveFamily(
  sourceEvent: PanelStateMachineEvent,
  preserveFamily: RightPanelFamily | null,
  requestedFamily: RightPanelFamily | null,
  renderableFamilies: Set<RightPanelFamily>
): boolean {
  if (isExplicitEvent(sourceEvent)) return false;
  if (!preserveFamily || !requestedFamily) return false;
  if (!STRONG_PRESERVATION_FAMILIES.has(preserveFamily)) return false;
  if (!canRenderFamily(preserveFamily, renderableFamilies)) return false;
  return requestedFamily !== preserveFamily;
}

export function resolveRightPanelFamily(
  view: RightPanelView,
  preferredLegacyTab: string | null = null
): RightPanelFamily | null {
  if (!view) {
    return null;
  }
  if (view === "input") return "scene";
  if (view === "workspace") {
    if (preferredLegacyTab === "scene") return "scene";
    return "workflow";
  }
  if (view === "object" || view === "object_focus") return "object";
  if (view === "risk" || view === "fragility" || view === "conflict" || view === "explanation") return "risk";
  if (view === "advice") return "advice";
  if (
    view === "timeline" ||
    view === "decision_timeline" ||
    view === "confidence_calibration" ||
    view === "outcome_feedback" ||
    view === "pattern_intelligence" ||
    view === "scenario_tree"
  ) {
    return "timeline";
  }
  if (view === "simulate" || view === "compare") return "simulate";
  if (view === "war_room") return "war_room";
  if (
    view === "dashboard" ||
    view === "strategic_command" ||
    view === "decision_lifecycle" ||
    view === "strategic_learning" ||
    view === "meta_decision" ||
    view === "cognitive_style" ||
    view === "team_decision" ||
    view === "org_memory" ||
    view === "decision_governance" ||
    view === "decision_policy" ||
    view === "executive_approval" ||
    view === "decision_council" ||
    view === "kpi"
  ) {
    return "executive";
  }
  if (view === "collaboration") return "collaboration";
  if (view === "memory" || view === "replay" || view === "patterns" || view === "opponent") {
    return "workflow";
  }
  return null;
}

export function resolveRightPanelFamilyFromSection(section: string | null | undefined): RightPanelFamily | null {
  if (!section) return null;
  if (section === "input") return "scene";
  if (section === "scene" || section === "workspace") return "scene";
  if (section === "objects" || section === "focus") return "object";
  if (
    section === "risk" ||
    section === "risk_flow" ||
    section === "fragility" ||
    section === "conflict" ||
    section === "explanation"
  ) {
    return "risk";
  }
  if (section === "advice") return "advice";
  if (section === "timeline") return "timeline";
  if (section === "war_room") return "war_room";
  if (section === "executive") return "executive";
  if (section === "collaboration") return "collaboration";
  return null;
}

export function resolvePanelTransition(input: PanelTransitionInput): PanelTransitionResult {
  const renderableFamilies = normalizeRenderableFamilies(input.renderableFamilies);
  const requestedFamily =
    input.requestedFamily ?? resolveRightPanelFamily(input.requestedView, input.requestedLegacyTab ?? null);
  const currentFamily =
    input.currentFamily ?? resolveRightPanelFamily(input.currentView, input.currentLegacyTab ?? null);
  const preservedFamily =
    input.preservedFamily ?? resolveRightPanelFamily(input.preservedView ?? null, input.currentLegacyTab ?? null);
  const preserveView = input.preservedView ?? input.currentView;

  if (!input.requestedView) {
    return {
      allowed: false,
      blocked: true,
      noOp: false,
      familyPreserved: false,
      fallbackApplied: false,
      requestedFamily,
      currentFamily,
      finalView: input.currentView,
      finalFamily: currentFamily,
      reason: "invalid_requested_view",
    };
  }

  if (
    input.requestedView === input.currentView &&
    (input.contextId ?? null) === (input.currentContextId ?? null)
  ) {
    return {
      allowed: true,
      blocked: false,
      noOp: true,
      familyPreserved: false,
      fallbackApplied: false,
      requestedFamily,
      currentFamily,
      finalView: input.currentView,
      finalFamily: currentFamily,
      reason: "no_op_same_state",
    };
  }

  const activePreserveFamily = preservedFamily ?? currentFamily;
  if (shouldPreserveFamily(input.sourceEvent, activePreserveFamily, requestedFamily, renderableFamilies)) {
    return {
      allowed: false,
      blocked: true,
      noOp: false,
      familyPreserved: true,
      fallbackApplied: false,
      requestedFamily,
      currentFamily,
      finalView: preserveView,
      finalFamily: activePreserveFamily,
      reason: "preserved_family_beats_automatic_override",
    };
  }

  if (requestedFamily && !canRenderFamily(requestedFamily, renderableFamilies)) {
    const fallbackFamily = resolveRightPanelFamily(input.fallbackView ?? null, input.currentLegacyTab ?? null);
    if (input.fallbackView && canRenderFamily(fallbackFamily, renderableFamilies)) {
      return {
        allowed: true,
        blocked: false,
        noOp: false,
        familyPreserved: false,
        fallbackApplied: true,
        requestedFamily,
        currentFamily,
        finalView: input.fallbackView,
        finalFamily: fallbackFamily,
        reason: "requested_family_not_renderable",
      };
    }

    if (activePreserveFamily && canRenderFamily(activePreserveFamily, renderableFamilies)) {
      return {
        allowed: false,
        blocked: true,
        noOp: false,
        familyPreserved: true,
        fallbackApplied: false,
        requestedFamily,
        currentFamily,
        finalView: preserveView,
        finalFamily: activePreserveFamily,
        reason: "requested_family_not_renderable_preserved_current",
      };
    }
  }

  return {
    allowed: true,
    blocked: false,
    noOp: false,
    familyPreserved: false,
    fallbackApplied: false,
    requestedFamily,
    currentFamily,
    finalView: input.requestedView,
    finalFamily: requestedFamily,
    reason: isExplicitEvent(input.sourceEvent) ? "explicit_transition_allowed" : "automatic_transition_allowed",
  };
}
