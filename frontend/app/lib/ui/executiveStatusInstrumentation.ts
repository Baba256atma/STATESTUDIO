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

export function logExecutiveStatusHudMounted(): void {
  devLogOnce("executive-status-mounted", "[Nexora][ExecutiveStatusMounted]");
}

export function logExecutiveStatusHudUpdated(payload: {
  source: string;
  reason: string;
  snapshot?: Record<string, unknown>;
}): void {
  devLogEvent("[Nexora][ExecutiveStatusUpdated]", payload);
}

export function logExecutiveStatusFrsiRendered(payload: {
  source: string;
  score: number | null;
  trend?: string;
}): void {
  devLogOnce(`executive-status-frsi-${payload.score ?? "none"}`, "[Nexora][FrsiRendered]", payload);
}

export function logExecutiveStatusConfidenceRendered(payload: {
  source: string;
  decision?: string | null;
  analysis?: string | null;
  scenario?: string | null;
}): void {
  devLogOnce(
    `executive-status-confidence-${payload.decision ?? "none"}`,
    "[Nexora][ConfidenceRendered]",
    payload
  );
}

export function logExecutiveStatusReadinessRendered(payload: { source: string; readiness: string }): void {
  devLogOnce(`executive-status-readiness-${payload.readiness}`, "[Nexora][ReadinessRendered]", payload);
}

export function logExecutiveStatusHealthRendered(payload: { source: string; health: string }): void {
  devLogOnce(`executive-status-health-${payload.health}`, "[Nexora][HealthRendered]", payload);
}

export function resetExecutiveStatusInstrumentationForTests(): void {
  loggedKeys.clear();
}
