import type { ActionRouteResult, CanonicalNexoraAction } from "./actionTypes";

const PREFIX = "[Nexora][ActionRouter]";

function devLog(phase: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const log = globalThis.console?.log;
  if (typeof log === "function") {
    log.call(globalThis.console, `${PREFIX}[${phase}]`, payload);
  }
}

export function traceActionRouterReceived(action: CanonicalNexoraAction): void {
  devLog("Received", {
    actionId: action.actionId,
    source: action.source,
    surface: action.surface,
    intent: action.intent.kind,
    target: action.target ?? null,
  });
}

export function traceActionRouterNormalized(action: CanonicalNexoraAction): void {
  devLog("Normalized", {
    actionId: action.actionId,
    intent: action.intent,
    meta: action.meta ?? null,
  });
}

export function traceActionRouterResolved(action: CanonicalNexoraAction, result: ActionRouteResult): void {
  if (result.status !== "ok") return;
  devLog("Resolved", {
    actionId: action.actionId,
    source: action.source,
    intent: action.intent.kind,
    execution: result.execution,
    panel: result.panelRequest?.view ?? null,
    contextId: result.panelRequest?.contextId ?? null,
    continuity: result.continuityHint,
  });
}

export function traceActionRouterRejected(action: CanonicalNexoraAction, result: ActionRouteResult): void {
  if (result.status !== "rejected") return;
  devLog("Rejected", {
    actionId: action.actionId,
    source: action.source,
    intent: action.intent.kind,
    reason: result.reason,
    detail: result.detail ?? null,
  });
}

export function traceActionRouterContinuity(action: CanonicalNexoraAction, hint: string, extra?: Record<string, unknown>): void {
  devLog("Continuity", {
    actionId: action.actionId,
    hint,
    ...extra,
  });
}

export function traceActionRouterExecuted(
  action: CanonicalNexoraAction,
  detail: { execution: string; outcome: string; extra?: Record<string, unknown> }
): void {
  devLog("Executed", {
    actionId: action.actionId,
    source: action.source,
    surface: action.surface,
    intent: action.intent.kind,
    execution: detail.execution,
    outcome: detail.outcome,
    rawSource: action.meta?.rawSource ?? null,
    ...detail.extra,
  });
}

export function traceActionRouterDispatchMissing(action: CanonicalNexoraAction): void {
  devLog("Rejected", {
    actionId: action.actionId,
    reason: "no_dispatch_registered",
    intent: action.intent.kind,
  });
}
