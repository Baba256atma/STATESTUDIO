import type { CanonicalNexoraAction, NexoraComponentPanelId } from "../actions/actionTypes";
import { normalizeCompareOptions, normalizeOpenCenterTimeline, normalizeOpenComponentPanel } from "../actions/actionNormalizer";

export type ComponentPanelActionName = "compare" | "timeline" | NexoraComponentPanelId;

export type OpenComponentPanelContext = {
  contextId?: string | null;
  rawTarget?: string | null;
  normalizedTarget?: string | null;
  requestedFamily?: string | null;
  resolvedFamily?: string | null;
  destinationSurface: "right_panel" | "component_panel";
  source?: string | null;
  caller?: string | null;
  reason?: string | null;
};

export function logComponentRouteAudit(payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.debug?.("[Nexora][ComponentRouteAudit]", payload);
}

export function logComponentRouteBlocked(payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.warn?.("[Nexora][ComponentRouteBlocked]", payload);
}

const FULL_COMPONENT_BY_PANEL_VIEW: Partial<Record<string, NexoraComponentPanelId>> = {
  team_decision: "team_decision",
  decision_council: "decision_council",
  org_memory: "org_memory",
  decision_policy: "decision_policy",
  executive_approval: "executive_approval",
  decision_governance: "decision_governance",
  confidence_calibration: "confidence_calibration",
  pattern_intelligence: "pattern_intelligence",
  strategic_learning: "strategic_learning",
  meta_decision: "decision_strategic",
  cognitive_style: "decision_lens",
  collaboration_intelligence: "collaboration_intelligence",
  outcome_feedback: "outcome_feedback",
  memory: "decision_memory",
  scenario_tree: "scenario_tree",
  strategic_command: "strategic_command_full",
};

/** Full-workflow views that must use the center workspace, not the right rail. */
export function rightPanelViewRequiresCenterWorkspace(view: string | null | undefined): boolean {
  const v = String(view ?? "").trim().toLowerCase();
  return v in FULL_COMPONENT_BY_PANEL_VIEW;
}

export function mapRightPanelViewToCenterComponentId(
  view: string | null | undefined
): NexoraComponentPanelId | null {
  const v = String(view ?? "").trim().toLowerCase();
  return FULL_COMPONENT_BY_PANEL_VIEW[v] ?? null;
}

export type ResolveComponentPanelResult =
  | { ok: true; action: CanonicalNexoraAction }
  | { ok: false; reason: string };

/**
 * Maps a product action name to a canonical center-workspace action.
 * Does not mutate panel state — caller dispatches via {@link registerNexoraActionDispatch}.
 */
export function resolveComponentPanelFromAction(
  actionName: ComponentPanelActionName,
  ctx: OpenComponentPanelContext
): ResolveComponentPanelResult {
  const caller = ctx.caller ?? actionName;
  const rawTarget = ctx.rawTarget ?? actionName;

  let action: CanonicalNexoraAction;
  switch (actionName) {
    case "compare":
      action = normalizeCompareOptions({
        rawSource: `componentPanelFromAction:${caller}`,
        surface: "center_overlay",
        source: "panel_cta",
      });
      break;
    case "timeline":
      action = normalizeOpenCenterTimeline({
        rawSource: `componentPanelFromAction:${caller}`,
        surface: "center_overlay",
        source: "panel_cta",
      });
      break;
    case "strategic_command_full":
      action = normalizeOpenComponentPanel({
        component: "strategic_command_full",
        rawSource: `componentPanelFromAction:${caller}`,
        surface: "center_overlay",
        source: "panel_cta",
      });
      break;
    default:
      action = normalizeOpenComponentPanel({
        component: actionName as NexoraComponentPanelId,
        rawSource: `componentPanelFromAction:${caller}`,
        surface: "center_overlay",
        source: "panel_cta",
      });
  }

  logComponentRouteAudit({
    source: ctx.source ?? "panel_cta",
    rawTarget,
    normalizedTarget: actionName,
    requestedFamily: ctx.requestedFamily ?? null,
    resolvedFamily: ctx.resolvedFamily ?? "EXE",
    destinationSurface: ctx.destinationSurface,
    reason: ctx.reason ?? `open_component:${actionName}`,
    caller,
    contextId: ctx.contextId ?? null,
  });

  return { ok: true, action };
}
