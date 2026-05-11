import {
  CANONICAL_RIGHT_PANEL_VIEWS,
  isProtectedRightPanelView,
  type RightPanelView,
} from "../ui/right-panel/rightPanelTypes";
import type {
  ActionRouteContinuityHint,
  ActionRouteExecutionMode,
  ActionRoutePanelRequest,
  ActionRouteResult,
  ActionRouterContext,
  CanonicalNexoraAction,
  NexoraComponentPanelId,
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
      return {
        status: "ok",
        resolvedIntent: "run_simulation",
        resolvedPanelView: ctx.currentView,
        resolvedObjectTargetId: null,
        execution: "open_center_simulation",
        continuityHint: "none",
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
    case "open_center_execution": {
      return {
        status: "ok",
        resolvedIntent: "open_center_execution",
        resolvedPanelView: ctx.currentView,
        resolvedObjectTargetId: null,
        execution: "open_center_execution",
        centerSurface: intent.surface,
        continuityHint: "none",
      };
    }
    case "open_component_panel": {
      const executionByComponent: Record<NexoraComponentPanelId, ActionRouteExecutionMode> = {
        compare: "open_center_compare",
        timeline: "open_center_timeline",
        confidence_calibration: "open_center_confidence_calibration",
        pattern_intelligence: "open_center_pattern_intelligence",
        strategic_learning: "open_center_strategic_learning",
        decision_strategic: "open_center_decision_strategic",
        decision_lens: "open_center_decision_lens",
        collaboration_intelligence: "open_center_collaboration_intelligence",
        outcome_feedback: "open_center_outcome_feedback",
        decision_memory: "open_center_decision_memory",
        decision_lifecycle: "open_center_decision_lifecycle",
        scenario_tree: "open_center_scenario_tree",
        strategic_command_full: "open_center_strategic_command_full",
        team_decision: "open_center_team_decision",
        decision_council: "open_center_decision_council",
        org_memory: "open_center_org_memory",
        decision_policy: "open_center_decision_policy",
        executive_approval: "open_center_executive_approval",
        decision_governance: "open_center_decision_governance",
      };
      const execution = executionByComponent[intent.component];
      if (!execution) {
        return {
          status: "rejected",
          reason: "unknown_intent",
          detail: `unknown_component:${intent.component}`,
        };
      }
      return {
        status: "ok",
        resolvedIntent: "open_component_panel",
        resolvedPanelView: ctx.currentView,
        resolvedObjectTargetId: null,
        execution,
        continuityHint: "none",
      };
    }
    case "add_domain_object": {
      if (!intent.request?.templateId) {
        return { status: "rejected", reason: "missing_target", detail: "add_domain_object requires templateId" };
      }
      return {
        status: "ok",
        resolvedIntent: "add_domain_object",
        resolvedPanelView: ctx.currentView,
        resolvedObjectTargetId: null,
        execution: "noop",
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
      const rawSource = String(action.meta?.rawSource ?? "actionRouter:focus_object");
      const fromSceneClick = rawSource.includes("scene:");
      const panelRequest: ActionRoutePanelRequest = {
        view,
        contextId: oid,
        /** Align shell rail with Focus (object_focus), not generic Objects (object). */
        legacyTab: "object_focus",
        source: action.source === "panel_cta" ? "cta" : "direct_open",
        rawSource,
        /** Scene re-clicks must still sync rail + Nexora tab (avoid same_view_same_context preserve). */
        preserveIfSameContext: fromSceneClick ? false : undefined,
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
      const hasAliasOrSubnav = Boolean(
        intent.legacyTab?.trim() ||
          intent.leftNav?.trim() ||
          intent.section?.trim() ||
          intent.clickedTab?.trim() ||
          intent.clickedNav?.trim()
      );
      const v = intent.view;
      if (!v && !hasAliasOrSubnav) {
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

      const continuityHint: ActionRouteContinuityHint = v
        ? continuityHintForPanel(ctx, v, intent.contextId ?? null)
        : ("none" as const);

      const sameViewSameContext =
        Boolean(v) &&
        ctx.currentView === v &&
        (ctx.currentContextId ?? null) === (intent.contextId ?? null);

      if (sameViewSameContext && hasAliasOrSubnav) {
        traceActionRouterContinuity(action, "same_view_subnav", {
          view: v,
          section: intent.section ?? null,
          leftNav: intent.leftNav ?? null,
          legacyTab: intent.legacyTab ?? null,
        });
        return {
          status: "rejected",
          reason: "same_view_same_context",
          detail: `open_panel noop:${String(v)}`,
        };
      }
      if (sameViewSameContext && !hasAliasOrSubnav) {
        return {
          status: "rejected",
          reason: "same_view_same_context",
          detail: `open_panel noop:${String(v)}`,
        };
      }

      // Minimal churn guard: refuse a clearly empty canonical view when no aliases (already handled),
      // and soften accidental "null view" opens when a protected panel is active (continuity).
      if (!v && hasAliasOrSubnav && ctx.currentView && isProtectedRightPanelView(ctx.currentView)) {
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
