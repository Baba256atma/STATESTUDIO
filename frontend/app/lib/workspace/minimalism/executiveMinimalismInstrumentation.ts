const loggedKeys = new Set<string>();

function devLogOnce(key: string, event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.(event, payload ?? {});
}

function devLogEvent(event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.(event, payload ?? {});
}

export function logExecutiveMinimalismAudit(payload: Record<string, unknown>): void {
  devLogOnce(
    `audit-${payload.visibleCount ?? 0}-${payload.noiseCount ?? 0}`,
    "[Nexora][MinimalismAudit]",
    payload
  );
}

export function logExecutiveMinimalism(payload: Record<string, unknown>): void {
  devLogEvent("[Nexora][Minimalism]", payload);
}

export function logInformationOwnership(payload: Record<string, unknown>): void {
  devLogOnce(`ownership-${payload.category ?? "unknown"}-${payload.owner ?? "none"}`, "[Nexora][InformationOwnership]", payload);
}

export function logAttentionHierarchy(payload: Record<string, unknown>): void {
  devLogEvent("[Nexora][AttentionHierarchy]", payload);
}

export function logLabelReduction(payload: Record<string, unknown>): void {
  devLogOnce(`label-reduction-${payload.priorityRank ?? 0}-${payload.visible ?? false}`, "[Nexora][LabelReduction]", payload);
}

export function logNoiseRemoved(payload: Record<string, unknown>): void {
  devLogEvent("[Nexora][NoiseRemoved]", payload);
}

export function resetExecutiveMinimalismInstrumentationForTests(): void {
  loggedKeys.clear();
}
