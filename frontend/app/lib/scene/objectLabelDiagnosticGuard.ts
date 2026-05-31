/**
 * E2:66 — Development diagnostics for object label resolution.
 * Logging never runs from render paths directly — only from cache miss / guarded emitters.
 */

const emittedLogKeys = new Set<string>();
const executionTimestampsBySignature = new Map<string, number[]>();

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function logOnce(key: string, label: string, payload: Record<string, unknown>): void {
  if (!isDev()) return;
  if (emittedLogKeys.has(key)) return;
  emittedLogKeys.add(key);
  globalThis.console?.debug?.(label, payload);
}

export function shouldEmitObjectLabelDiagnostic(signature: string, payload: Record<string, unknown>): boolean {
  if (!isDev()) return false;
  const key = `${signature}::${JSON.stringify(payload)}`;
  if (emittedLogKeys.has(key)) return false;
  emittedLogKeys.add(key);
  return true;
}

export function trackObjectLabelExecution(signature: string): void {
  if (!isDev()) return;
  const now = Date.now();
  const windowMs = 1000;
  const history = (executionTimestampsBySignature.get(signature) ?? []).filter((t) => now - t < windowMs);
  history.push(now);
  executionTimestampsBySignature.set(signature, history);
  if (history.length > 5) {
    globalThis.console?.warn?.("[Nexora][ObjectLabelLoopDetected]", {
      signature,
      executionsInWindow: history.length,
      windowMs,
      stack: new Error("ObjectLabel loop trace").stack,
    });
    executionTimestampsBySignature.set(signature, [now]);
  }
}

export function traceObjectLabelComputed(namespace: string, signature: string, payload: Record<string, unknown>): void {
  if (!isDev()) return;
  trackObjectLabelExecution(signature);
  logOnce(`computed:${namespace}:${signature}`, "[Nexora][ObjectLabelComputed]", {
    namespace,
    signature,
    ...payload,
  });
}

export function traceObjectLabelCached(namespace: string, signature: string): void {
  if (!isDev()) return;
  logOnce(`cached:${namespace}:${signature}`, "[Nexora][ObjectLabelCached]", { namespace, signature });
}

export function traceObjectLabelSkipped(namespace: string, signature: string, reason: string): void {
  if (!isDev()) return;
  logOnce(`skipped:${namespace}:${signature}:${reason}`, "[Nexora][ObjectLabelSkipped]", {
    namespace,
    signature,
    reason,
  });
}

export function resetObjectLabelDiagnosticGuardForTests(): void {
  emittedLogKeys.clear();
  executionTimestampsBySignature.clear();
}
