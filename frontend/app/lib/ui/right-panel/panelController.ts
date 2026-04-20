import {
  closeRightPanel,
  createOpenRightPanelState,
  resolveCanonicalRightPanelRoute,
  resolveSafeRightPanelView,
} from "./rightPanelRouter";
import type { RightPanelView } from "./rightPanelTypes";
import type {
  PanelControllerContext,
  PanelDecision,
  PanelOpenSource,
  PanelRequestIntent,
} from "./panelControllerTypes";

const CLICK_INTENT_LOCK_TTL_MS = 4000;

function toRouterSource(
  source: PanelOpenSource
): "direct_open" | "legacy_alias" | "action_intent" | "unknown" {
  if (source === "legacy_alias") return "legacy_alias";
  if (source === "action_intent") return "action_intent";
  if (
    source === "direct_open" ||
    source === "guided_prompt" ||
    source === "left_nav" ||
    source === "inspector_section" ||
    source === "cta"
  ) {
    return "direct_open";
  }
  return "unknown";
}

function isAutomaticPanelSource(source: PanelOpenSource): boolean {
  return source === "effect_auto" || source === "adapter_auto";
}

function shouldBlockLegacyPanelSync(args: {
  source: PanelOpenSource;
  currentView: RightPanelView;
  attemptedView: RightPanelView;
  hasMeaningfulObjectContext: boolean;
}) {
  if (args.source !== "legacy_alias" && args.source !== "inspector_section") {
    return false;
  }
  if (args.currentView !== "object") return false;
  if (args.attemptedView === "object") return false;
  return args.hasMeaningfulObjectContext;
}

function resolveRequestedView(request: PanelRequestIntent): RightPanelView {
  const route = resolveCanonicalRightPanelRoute({
    requestedView: request.requestedView,
    legacyTab: request.legacyTab ?? null,
    leftNav: request.leftNav ?? null,
  });
  if (route?.resolvedView) {
    return route.resolvedView;
  }
  if (!request.requestedView) {
    return null;
  }
  return resolveSafeRightPanelView(
    request.requestedView,
    toRouterSource(request.source)
  );
}

function traceDecision(
  request: PanelRequestIntent,
  context: PanelControllerContext,
  result: PanelDecision
) {
  if (process.env.NODE_ENV !== "production") {
    console.log("[Nexora][PanelController]", {
      requestedView: request.requestedView,
      source: request.source,
      rawSource: request.rawSource ?? null,
      contextId: request.contextId ?? null,
      currentView: context.currentPanelState?.view ?? null,
      decision: result.kind,
      reason: result.reason,
      nextView: result.nextState?.view ?? null,
    });
  }
}

export function resolvePanelDecision(
  request: PanelRequestIntent,
  context: PanelControllerContext
): PanelDecision {
  if (request.close) {
    const result: PanelDecision = {
      kind: "close",
      nextState: closeRightPanel(context.currentPanelState),
      reason: "close_requested",
      normalizedSource: request.source,
      resolvedView: null,
    };
    traceDecision(request, context, result);
    return result;
  }

  const resolvedView = resolveRequestedView(request);
  const nextContextId = request.contextId ?? null;
  const currentState = context.currentPanelState;

  if (!resolvedView) {
    const result: PanelDecision = {
      kind: "block",
      nextState: currentState,
      reason: "resolve_safe_view_failed",
      normalizedSource: request.source,
      resolvedView: null,
    };
    traceDecision(request, context, result);
    return result;
  }

  if (
    shouldBlockLegacyPanelSync({
      source: request.source,
      currentView: currentState.view ?? null,
      attemptedView: resolvedView,
      hasMeaningfulObjectContext: context.hasMeaningfulObjectContext === true,
    })
  ) {
    const result: PanelDecision = {
      kind: "block",
      nextState: currentState,
      reason: "meaningful_object_panel_preserved",
      normalizedSource: request.source,
      resolvedView,
    };
    traceDecision(request, context, result);
    return result;
  }

  const lock = context.clickIntentLock;
  const lockIsFresh =
    Boolean(lock) && context.now - (lock?.timestamp ?? 0) <= CLICK_INTENT_LOCK_TTL_MS;
  if (
    isAutomaticPanelSource(request.source) &&
    request.allowAutoOverride !== true &&
    lockIsFresh &&
    lock?.view &&
    lock.view !== resolvedView
  ) {
    const result: PanelDecision = {
      kind: "block",
      nextState: currentState,
      reason: "click_intent_lock_preserved",
      normalizedSource: request.source,
      resolvedView,
    };
    traceDecision(request, context, result);
    return result;
  }

  if (
    request.preserveIfSameContext !== false &&
    currentState.view === resolvedView &&
    (currentState.contextId ?? null) === nextContextId
  ) {
    const result: PanelDecision = {
      kind: "preserve",
      nextState: currentState,
      reason: "same_view_same_context",
      normalizedSource: request.source,
      resolvedView,
    };
    traceDecision(request, context, result);
    return result;
  }

  const result: PanelDecision = {
    kind: "open",
    nextState: createOpenRightPanelState(resolvedView, nextContextId, context.now),
    reason: "panel_open_applied",
    normalizedSource: request.source,
    resolvedView,
  };
  traceDecision(request, context, result);
  return result;
}
