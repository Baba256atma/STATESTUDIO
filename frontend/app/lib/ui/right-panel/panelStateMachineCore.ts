export type PanelSource =
  | "click"
  | "prompt"
  | "effect"
  | "adapter"
  | "system";

export type PanelView =
  | "strategic_command"
  | "dashboard"
  | "simulate"
  | "compare"
  | "decision_lifecycle"
  | "strategic_learning"
  | "meta_decision"
  | "cognitive_style"
  | "team_decision"
  | "org_memory"
  | "decision_governance"
  | "decision_policy"
  | "executive_approval"
  | "explanation"
  | "object"
  | "risk"
  | "fragility"
  | "advice"
  | "timeline"
  | "decision_timeline"
  | "confidence_calibration"
  | "outcome_feedback"
  | "pattern_intelligence"
  | "collaboration_intelligence"
  | "decision_council"
  | "scenario_tree"
  | "kpi"
  | "war_room"
  | "conflict"
  | "memory"
  | "replay"
  | "patterns"
  | "opponent"
  | "collaboration"
  | "workspace"
  | null;

export type PanelFamily =
  | "scene_workspace"
  | "object"
  | "risk"
  | "advice"
  | "timeline"
  | "simulation"
  | "war_room"
  | "executive"
  | "workflow_memory"
  | null;

export type PanelState = {
  currentView: PanelView;
  currentFamily: PanelFamily;
};

export type PanelEvent = {
  source: PanelSource;
  requestedView: PanelView;
  requestedFamily?: PanelFamily;
  renderableViews?: PanelView[];
};

export type PanelResult = {
  finalView: PanelView;
  finalFamily: PanelFamily;
  reason: string;
  fallbackUsed: boolean;
};

export function getPanelFamily(view: PanelView): PanelFamily {
  if (view === "workspace") return "scene_workspace";
  if (view === "object") return "object";
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
  if (view === "simulate" || view === "compare") return "simulation";
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
    view === "collaboration_intelligence" ||
    view === "kpi"
  ) {
    return "executive";
  }
  if (
    view === "memory" ||
    view === "replay" ||
    view === "patterns" ||
    view === "opponent" ||
    view === "collaboration"
  ) {
    return "workflow_memory";
  }
  return null;
}

export function isRenderable(
  view: PanelView,
  renderableViews?: PanelView[]
): boolean {
  if (!renderableViews) {
    return true;
  }

  return renderableViews.includes(view);
}

function buildResult(
  finalView: PanelView,
  reason: string,
  fallbackUsed: boolean,
  event: PanelEvent,
  state: PanelState
): PanelResult {
  const finalFamily = getPanelFamily(finalView);
  const currentFamily = state.currentFamily ?? getPanelFamily(state.currentView);
  const requestedFamily = event.requestedFamily ?? getPanelFamily(event.requestedView);

  if ((globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV !== "production") {
    console.warn("[Nexora][PanelStateMachine]", {
      source: event.source,
      requestedView: event.requestedView,
      requestedFamily,
      currentView: state.currentView,
      currentFamily,
      finalView,
      familyBefore: state.currentFamily ?? getPanelFamily(state.currentView),
      familyAfter: finalFamily,
      reason,
    });
  }

  return {
    finalView,
    finalFamily,
    reason,
    fallbackUsed,
  };
}

export function resolvePanelTransition(
  state: PanelState,
  event: PanelEvent
): PanelResult {
  const requestedView = event.requestedView;
  const requestedFamily = event.requestedFamily ?? getPanelFamily(requestedView);
  const currentView = state.currentView;
  const currentFamily = state.currentFamily ?? getPanelFamily(currentView);
  const requestedRenderable = isRenderable(requestedView, event.renderableViews);
  const currentRenderable = isRenderable(currentView, event.renderableViews);

  if (
    currentFamily === "object" &&
    event.source !== "click" &&
    requestedFamily !== currentFamily &&
    currentView &&
    currentRenderable
  ) {
    return buildResult(
      currentView,
      "preserved_object_family",
      false,
      event,
      state
    );
  }

  if (
    currentFamily === "risk" &&
    event.source !== "click" &&
    requestedFamily !== currentFamily &&
    currentView &&
    currentRenderable
  ) {
    return buildResult(
      currentView,
      "preserved_risk_family",
      false,
      event,
      state
    );
  }

  if (event.source === "click") {
    if (requestedView && requestedRenderable) {
      return buildResult(
        requestedView,
        "click_requested_view_renderable",
        false,
        event,
        state
      );
    }

    if (currentView && currentRenderable) {
      return buildResult(currentView, "click_fallback_current_view", true, event, state);
    }

    return buildResult("workspace", "click_fallback_workspace", true, event, state);
  }

  if (event.source === "prompt") {
    if (currentView && currentRenderable) {
      return buildResult(currentView, "prompt_kept_current_view", false, event, state);
    }

    if (requestedView && requestedRenderable) {
      return buildResult(
        requestedView,
        "prompt_requested_view_renderable",
        false,
        event,
        state
      );
    }

    if (currentView && currentRenderable) {
      return buildResult(currentView, "prompt_fallback_current_view", true, event, state);
    }

    return buildResult("workspace", "prompt_fallback_workspace", true, event, state);
  }

  // click and prompt were handled above; remaining sources preserve the current family when possible.
  if (
    currentFamily &&
    requestedFamily &&
    requestedFamily !== currentFamily &&
    currentView &&
    currentRenderable
  ) {
    return buildResult(
      currentView,
      "preserved_current_family",
      false,
      event,
      state
    );
  }

  if (!requestedView || !requestedRenderable) {
    if (currentView && currentRenderable) {
      return buildResult(currentView, "requested_view_fallback_current_view", true, event, state);
    }

    return buildResult("workspace", "requested_view_not_renderable", true, event, state);
  }

  return buildResult(
    requestedView,
    "requested_view_allowed",
    false,
    event,
    state
  );
}
