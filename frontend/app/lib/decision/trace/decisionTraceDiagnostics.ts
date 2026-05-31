/**
 * E2:72 — Development diagnostics for decision trace memoization.
 */

const emittedKeys = new Set<string>();

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function logOnce(key: string, label: string, payload: Record<string, unknown>): void {
  if (!isDev()) return;
  if (emittedKeys.has(key)) return;
  emittedKeys.add(key);
  globalThis.console?.debug?.(label, payload);
}

export function traceDecisionTraceComputed(payload: Record<string, unknown>): void {
  logOnce(`computed:${String(payload.signature ?? "")}`, "[Nexora][DecisionTraceComputed]", payload);
}

export function traceDecisionTraceCached(payload: Record<string, unknown>): void {
  logOnce(`cached:${String(payload.signature ?? "")}`, "[Nexora][DecisionTraceCached]", payload);
}

export function traceDecisionTraceSkipped(payload: Record<string, unknown>): void {
  logOnce(`skipped:${String(payload.signature ?? "")}:${String(payload.reason ?? "")}`, "[Nexora][DecisionTraceSkipped]", payload);
}

export function traceObjectRemountIgnored(payload: Record<string, unknown>): void {
  logOnce(
    `remount-ignored:${String(payload.objectId ?? "")}:${String(payload.driftSignature ?? payload.reason ?? "")}`,
    "[Nexora][ObjectRemountIgnored]",
    payload
  );
}

export function traceParityIgnoredDiagnosticEvent(payload: Record<string, unknown>): void {
  logOnce(
    `parity-ignored:${String(payload.reason ?? "")}:${String(payload.signature ?? "")}`,
    "[Nexora][ParityIgnoredDiagnosticEvent]",
    payload
  );
}

export function tracePanelWriteSkippedTraceNoOp(payload: Record<string, unknown>): void {
  logOnce(
    `panel-trace-noop:${String(payload.signature ?? "")}`,
    "[Nexora][PanelWriteSkippedTraceNoOp]",
    payload
  );
}

export function resetDecisionTraceDiagnosticsForTests(): void {
  emittedKeys.clear();
}
