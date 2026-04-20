import {
  CANONICAL_RIGHT_PANEL_VIEWS,
  isProtectedRightPanelView,
  type RightPanelView,
} from "../ui/right-panel/rightPanelTypes";
import type {
  ActionRouteContinuityHint,
  ActionRoutePanelRequest,
  ActionRouteResult,
  ActionRouterContext,
  CanonicalNexoraAction,
  NexoraOpenPanelIntent,
} from "./actionTypes";
import { traceActionRouterContinuity } from "./actionTrace";

function isCanonicalPanelView(v: string | null | undefined): v is Exclude<RightPanelView, null> {
  return !!v && (CANONICAL_RIGHT_PANEL_VIEWS as readonly string[]).includes(v);
}

function panelOpenSourceFromIntent(intent: NexoraOpenPanelIntent): string {
  if (intent.leftNav?.trim()) return "left_nav";
  if (intent.section?.trim()) return "inspector_section";
  if (intent.legacyTab?.trim()) return "legacy_alias";
  return "direct_open";
}

function continuityHintForPanel(
  ctx: ActionRouterContext,
  nextView: RightPanelView,
  nextContextId: string | null | undefined
): ActionRouteContinuityHint {
  if (ctx.currentView && isProtectedRightPanelView(ctx.currentView) && ctx.currentView === nextView) {
    const sameContext = (ctx.currentContextId ?? null) === (nextContextId ?? null);
    if (sameContext) return "preserved_strong_panel";
  }
  return "none";
}

/**
 * Resolves a canonical action to a structured route result.
 * Does not mutate scene or panel state — callers apply results via existing gateways.
 */
export function resolveActionRoute(action: CanonicalNexoraAction, ctx: ActionRouterContext): ActionRouteResult {
  const intent = action.intent;

  switch (intent.kind) {
    case "noop": {
      return { status: "rejected", reason: "unknown_intent", detail: intent.reason ?? "noop" };
    }
    case "run_simulation": {
      const view: Exclude<RightPanelView, null> = "simulate";
      const panelRequest: ActionRoutePanelRequest = {
        view,
        contextId: null,
        source: "cta",
        rawSource: action.meta?.rawSource ?? "actionRouter:run_simulation",
      };
      return {
        status: "ok",
        resolvedIntent: "run_simulation",
        resolvedPanelView: view,
        resolvedObjectTargetId: null,
        execution: "open_right_panel",
        panelRequest,
        continuityHint: continuityHintForPanel(ctx, view, null),
      };
    }
    case "compare_options": {
      return {
        status: "ok",
        resolvedIntent: "compare_options",
        resolvedPanelView: ctx.currentView,
        resolvedObjectTargetId: null,
        execution: "open_center_compare",
        continuityHint: "none",
      };
    }
    case "open_center_timeline": {
      return {
        status: "ok",
        resolvedIntent: "open_center_timeline",
        resolvedPanelView: ctx.currentView,
        resolvedObjectTargetId: null,
        execution: "open_center_timeline",
        continuityHint: "none",
      };
    }
    case "start_demo": {
      return {
        status: "ok",
        resolvedIntent: "start_demo",
        resolvedPanelView: ctx.currentView,
        resolvedObjectTargetId: null,
        execution: "start_investor_demo",
        continuityHint: "none",
      };
    }
    case "focus_object": {
      const oid = typeof intent.objectId === "string" ? intent.objectId.trim() : "";
      if (!oid) {
        return { status: "rejected", reason: "missing_target", detail: "focus_object requires objectId" };
      }
      const view: Exclude<RightPanelView, null> = "object";
      const panelRequest: ActionRoutePanelRequest = {
        view,
        contextId: oid,
        source: action.source === "panel_cta" ? "cta" : "direct_open",
        rawSource: action.meta?.rawSource ?? "actionRouter:focus_object",
      };
      return {
        status: "ok",
        resolvedIntent: "focus_object",
        resolvedPanelView: view,
        resolvedObjectTargetId: oid,
        execution: "open_right_panel",
        panelRequest,
        continuityHint: continuityHintForPanel(ctx, view, oid),
      };
    }
    case "open_panel": {
      const hasAlias = Boolean(
        intent.legacyTab?.trim() || intent.leftNav?.trim() || intent.section?.trim()
      );
      const v = intent.view;
      if (!v && !hasAlias) {
        return { status: "rejected", reason: "invalid_empty_route", detail: "open_panel missing view and aliases" };
      }
      if (v && !isCanonicalPanelView(v)) {
        return { status: "rejected", reason: "guard_rejected", detail: `unknown_panel_view:${String(v)}` };
      }

      const panelSource = panelOpenSourceFromIntent(intent);
      const panelRequest: ActionRoutePanelRequest = {
        view: v,
        contextId: intent.contextId ?? null,
        source: panelSource,
        rawSource: action.meta?.rawSource ?? "actionRouter:open_panel",
        legacyTab: intent.legacyTab ?? null,
        leftNav: intent.leftNav ?? null,
        section: intent.section ?? null,
        clickedTab: intent.clickedTab ?? null,
        clickedNav: intent.clickedNav ?? null,
        preserveIfSameContext: intent.preserveIfSameContext,
        allowAutoOverride: intent.allowAutoOverride,
      };

      let continuityHint: ActionRouteContinuityHint = v
        ? continuityHintForPanel(ctx, v, intent.contextId ?? null)
        : ("none" as const);

      if (v && ctx.currentView === v && hasAlias) {
        continuityHint = "same_view_subnav";
        traceActionRouterContinuity(action, "same_view_subnav", {
          view: v,
          section: intent.section ?? null,
          leftNav: intent.leftNav ?? null,
          legacyTab: intent.legacyTab ?? null,
        });
      }

      // Minimal churn guard: refuse a clearly empty canonical view when no aliases (already handled),
      // and soften accidental "null view" opens when a protected panel is active (continuity).
      if (!v && hasAlias && ctx.currentView && isProtectedRightPanelView(ctx.currentView)) {
        traceActionRouterContinuity(action, "alias_open_with_protected_current", {
          currentView: ctx.currentView,
          panelSource,
        });
      }

      return {
        status: "ok",
        resolvedIntent: "open_panel",
        resolvedPanelView: v ?? ctx.currentView,
        resolvedObjectTargetId: null,
        execution: "open_right_panel",
        panelRequest,
        continuityHint,
      };
    }
  }
}
