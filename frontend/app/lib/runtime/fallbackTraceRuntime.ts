/**
 * E2:75 — One-shot fallback caller trace (development only).
 */

const tracedSignatures = new Set<string>();

export type FallbackTraceInput = {
  caller: string;
  reason?: string | null;
  requestedView?: string | null;
  requestedPanel?: string | null;
  selectedObjectId?: string | null;
  contextId?: string | null;
  authoritySource?: string | null;
};

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

export function traceFallbackRequest(input: FallbackTraceInput): void {
  if (!isDev()) return;

  const signature = JSON.stringify({
    caller: input.caller,
    reason: input.reason ?? null,
    requestedView: input.requestedView ?? null,
    requestedPanel: input.requestedPanel ?? input.requestedView ?? null,
    selectedObjectId: input.selectedObjectId ?? null,
    contextId: input.contextId ?? null,
    authoritySource: input.authoritySource ?? "system_fallback",
  });

  if (tracedSignatures.has(signature)) return;
  tracedSignatures.add(signature);

  globalThis.console?.debug?.("[Nexora][FallbackTrace]", {
    caller: input.caller,
    reason: input.reason ?? null,
    requestedView: input.requestedView ?? null,
    requestedPanel: input.requestedPanel ?? input.requestedView ?? null,
    selectedObjectId: input.selectedObjectId ?? null,
    contextId: input.contextId ?? null,
    authoritySource: input.authoritySource ?? "system_fallback",
    signature,
  });
}

export function resetFallbackTraceRuntimeForTests(): void {
  tracedSignatures.clear();
}
