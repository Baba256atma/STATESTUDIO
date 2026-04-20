/**
 * Dev-only guard rails: deterministic checks + debug emission only.
 * Does not block execution, mutate product state, or auto-correct behavior.
 */

import { emitDebugEvent, shouldEmitSelfDebug } from "./debugEmit";
import type { DebugEvent } from "./debugEventTypes";
import type { DebugLayer } from "./debugEventTypes";
import { resolveRightPanelRailRoute } from "../ui/right-panel/rightPanelRouter";

export type GuardRailsTrigger =
  | "panel_resolve"
  | "scene_update"
  | "chat_response"
  | "contract_check"
  | "subtab_resolve";

export type GuardRailsState = {
  trigger: GuardRailsTrigger;
  /** Optional chat / scene correlation for event scans */
  correlationId?: string | null;
  panel?: {
    decisionKind?: string;
    requestedView?: string | null;
    resolvedView?: string | null;
    /** When the caller can compute it safely; omitted skips that guard */
    hasRenderableMergedData?: boolean | null;
  };
  scene?: {
    overwriteBlocked?: boolean;
    /** True when reaction carried scene JSON but replacement was disallowed */
    sceneJsonWhileDisallowed?: boolean;
  };
  subtab?: {
    eventTab?: string | null;
    resolvedNextView?: string | null;
  };
  chat?: {
    chatCorrelationId?: string | null;
  };
};

export type GuardAlert = {
  guardType: string;
  severity: "warning" | "critical";
  message: string;
  layer: DebugLayer;
  suggestion: string;
};

const PANEL_FLICKER_MS = 160;
const CONTRACT_FAIL_WINDOW_MS = 45_000;
const CONTRACT_FAIL_WARN_COUNT = 3;
const NOOP_WARN_COUNT = 2;

function pushUnique(out: GuardAlert[], alert: GuardAlert): void {
  if (out.some((x) => x.guardType === alert.guardType && x.message === alert.message)) return;
  out.push(alert);
}

function eventsForCorrelation(events: DebugEvent[], c: string | null | undefined): DebugEvent[] {
  if (!c) return events;
  return events.filter((e) => {
    const m = e.metadata?.chatCorrelationId;
    if (typeof m === "string" && m === c) return true;
    if (typeof e.correlationId === "string" && e.correlationId === c) return true;
    return false;
  });
}

function guardPanelFromState(state: GuardRailsState, out: GuardAlert[]): void {
  const p = state.panel;
  if (!p) return;
  if (p.decisionKind === "open" && p.resolvedView && p.hasRenderableMergedData === false) {
    pushUnique(out, {
      guardType: "panel_resolved_no_renderable_data",
      severity: "warning",
      message: "Panel resolved to an open view but merged / visible data looks empty for that family.",
      layer: "panel",
      suggestion: "Trace `buildPanelResolvedData` / contract path for this view before blaming the host.",
    });
  }
  if (p.decisionKind === "open" && p.requestedView && p.resolvedView && p.requestedView !== p.resolvedView) {
    pushUnique(out, {
      guardType: "panel_requested_vs_resolved_view",
      severity: "warning",
      message: `Panel open requested ${p.requestedView} but controller resolved ${p.resolvedView}.`,
      layer: "router",
      suggestion: "Confirm preserve rules, safe-view fallback, and click-intent lock — not every remap is a bug.",
    });
  }
}

function guardPanelFromEvents(events: DebugEvent[], out: GuardAlert[]): void {
  const resolved = events.filter((e) => e.type === "panel_resolved" && e.metadata?.decisionKind === "open");
  if (resolved.length >= 2) {
    const a = resolved[resolved.length - 2];
    const b = resolved[resolved.length - 1];
    const dt = b.timestamp - a.timestamp;
    if (dt >= 0 && dt < PANEL_FLICKER_MS) {
      pushUnique(out, {
        guardType: "panel_switch_flicker_risk",
        severity: "warning",
        message: `Two panel opens resolved within ${dt}ms — risk of flicker or racing transitions.`,
        layer: "panel",
        suggestion: "Inspect rapid `panel_requested` / `panel_resolved` pairs and any synchronous reopen paths.",
      });
    }
  }
}

function guardSubtab(state: GuardRailsState, out: GuardAlert[]): void {
  if (state.trigger !== "subtab_resolve" || !state.subtab) return;
  const { eventTab, resolvedNextView } = state.subtab;
  if (eventTab == null || eventTab === "") return;
  const route = resolveRightPanelRailRoute(eventTab);
  if (!route) {
    pushUnique(out, {
      guardType: "subtab_invalid_tab_mapping",
      severity: "critical",
      message: `Subtab event tab ${String(eventTab)} did not resolve through the rail router.`,
      layer: "router",
      suggestion: "Check `resolveRightPanelRailRoute` and tab config in `NexoraShell` for typos or missing routes.",
    });
    return;
  }
  if (resolvedNextView && route.resolvedView && route.resolvedView !== resolvedNextView) {
    pushUnique(out, {
      guardType: "subtab_resolved_view_mismatch",
      severity: "warning",
      message: `Subtab route expected ${route.resolvedView} but shell resolved nextView ${resolvedNextView}.`,
      layer: "shell",
      suggestion: "Compare `setInspectorSection` / `nexora:open-right-panel` ordering with the clicked subtab route.",
    });
  }
}

function guardScene(state: GuardRailsState, out: GuardAlert[]): void {
  const s = state.scene;
  if (!s) return;
  if (s.overwriteBlocked || s.sceneJsonWhileDisallowed) {
    pushUnique(out, {
      guardType: "scene_overwrite_without_permission",
      severity: "warning",
      message: "Scene carried replacement-style payload while this apply path disallowed overwrite.",
      layer: "scene",
      suggestion: "Verify `allowSceneReplacement` / `sceneReplacement` options on this reaction source.",
    });
  }
}

function guardChat(events: DebugEvent[], state: GuardRailsState, out: GuardAlert[]): void {
  const tail = events.slice(-80);
  const noopN = tail.filter((e) => e.type === "chat_noop_result").length;
  if (noopN >= NOOP_WARN_COUNT) {
    pushUnique(out, {
      guardType: "chat_repeated_noop",
      severity: "warning",
      message: `Several chat_noop_result events in recent history (${noopN}).`,
      layer: "chat",
      suggestion: "Compare intent vs `chat_action_extracted` and backend availability for those turns.",
    });
  }

  const c = state.chat?.chatCorrelationId ?? state.correlationId;
  if (!c) return;
  const chain = eventsForCorrelation(tail, c);
  const intent = chain.find((e) => e.type === "chat_intent_detected");
  const extracted = chain.find((e) => e.type === "chat_action_extracted");
  if (!intent || !extracted) return;

  const shouldCallBackend = intent.metadata?.shouldCallBackend === true;
  const shouldAffectPanels = intent.metadata?.shouldAffectPanels === true;
  const shouldAffectScene = intent.metadata?.shouldAffectScene === true;
  const wantsWork = shouldCallBackend || shouldAffectPanels || shouldAffectScene;

  const hasBackendPayload = extracted.metadata?.hasBackendPayload === true;
  const hasLocalActions = extracted.metadata?.hasLocalActions === true;
  const ok = extracted.metadata?.ok !== false;
  const executedSteps = extracted.metadata?.executedSteps;
  const stepCount = Array.isArray(executedSteps) ? executedSteps.length : null;

  if (wantsWork && ok && !hasBackendPayload && !hasLocalActions && (stepCount === null || stepCount === 0)) {
    pushUnique(out, {
      guardType: "chat_intent_without_extracted_action",
      severity: "warning",
      message: "Intent expected actionable work, but execution extracted no backend/local payload and no steps.",
      layer: "intent",
      suggestion: "Inspect `executeNexoraAction` branches and soft-failure paths for this correlation.",
    });
  }
}

function guardContract(events: DebugEvent[], state: GuardRailsState, out: GuardAlert[]): void {
  if (state.trigger !== "contract_check") return;
  const last = events.length > 0 ? events[events.length - 1] : null;
  if (last?.type === "contract_validation_failed") {
    pushUnique(out, {
      guardType: "contract_invalid_panel_payload",
      severity: "warning",
      message: "Panel shared data failed schema validation; salvage kept the rail alive but may hide bad shapes.",
      layer: "contract",
      suggestion: "Inspect `[Nexora][PanelContractInvalid]` / slice rejects for this response before tuning the host.",
    });
  }
  const now = Date.now();
  const recentFails = events.filter(
    (e) =>
      e.type === "contract_validation_failed" &&
      typeof e.timestamp === "number" &&
      now - e.timestamp <= CONTRACT_FAIL_WINDOW_MS
  );
  if (recentFails.length >= CONTRACT_FAIL_WARN_COUNT) {
    pushUnique(out, {
      guardType: "contract_schema_fallback_churn",
      severity: "critical",
      message: `Many contract_validation_failed events in the last ${CONTRACT_FAIL_WINDOW_MS / 1000}s (${recentFails.length}).`,
      layer: "contract",
      suggestion: "Review adapter output vs `panelDataContract` — repeated salvage hides systemic shape drift.",
    });
  }
}

/**
 * Run deterministic guard checks. Pure aside from reading `lastEvents`; does not emit.
 */
export function runGuardChecks(currentState: GuardRailsState, lastEvents: DebugEvent[]): GuardAlert[] {
  const out: GuardAlert[] = [];
  const t = currentState.trigger;
  if (t === "panel_resolve" || t === "scene_update" || t === "chat_response") {
    guardPanelFromEvents(lastEvents, out);
  }
  if (t === "panel_resolve") {
    guardPanelFromState(currentState, out);
  }
  if (t === "subtab_resolve") {
    guardSubtab(currentState, out);
  }
  if (t === "scene_update") {
    guardScene(currentState, out);
  }
  if (t === "chat_response") {
    guardChat(lastEvents, currentState, out);
  }
  if (t === "contract_check") {
    guardContract(lastEvents, currentState, out);
  }
  return out;
}

/** Emit dev-only `guard_warning` / `guard_critical` events. No-op in production. */
export function emitGuardRailAlerts(alerts: GuardAlert[]): void {
  if (!shouldEmitSelfDebug() || alerts.length === 0) return;
  for (const a of alerts) {
    emitDebugEvent({
      type: a.severity === "critical" ? "guard_critical" : "guard_warning",
      layer: a.layer,
      origin: "system",
      source: "GuardRails",
      status: a.severity === "critical" ? "error" : "warn",
      message: a.message,
      metadata: {
        guardType: a.guardType,
        suggestion: a.suggestion,
        severity: a.severity,
      },
    });
  }
}
