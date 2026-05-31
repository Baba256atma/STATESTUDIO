/**
 * E2:75 — Deduped development diagnostics for fallback / authority stabilization.
 */

const emittedKeys = new Set<string>();

export type PanelActivitySource =
  | "system_fallback"
  | "panel_salvage"
  | "authority_noop"
  | "normal";

let lastPanelActivity: { source: PanelActivitySource; signature: string; at: number } | null = null;
const RECENT_PANEL_ACTIVITY_MS = 500;

function isRecentPanelActivity(at: number): boolean {
  return Date.now() - at <= RECENT_PANEL_ACTIVITY_MS;
}

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function logOnce(key: string, label: string, payload: Record<string, unknown>): void {
  if (!isDev()) return;
  if (emittedKeys.has(key)) return;
  emittedKeys.add(key);
  globalThis.console?.debug?.(label, payload);
}

export function recordPanelActivity(source: PanelActivitySource, signature: string): void {
  lastPanelActivity = { source, signature, at: Date.now() };
}

export function getLastPanelActivitySource(): PanelActivitySource | null {
  if (!lastPanelActivity || !isRecentPanelActivity(lastPanelActivity.at)) return null;
  return lastPanelActivity.source;
}

export function shouldIgnoreRecentSceneParitySource(source: string | null | undefined): boolean {
  if (!source) return false;
  if (!lastPanelActivity || !isRecentPanelActivity(lastPanelActivity.at)) return false;
  return shouldIgnoreSceneParitySource(source);
}

export function shouldIgnoreSceneParitySource(source: string | null | undefined): boolean {
  if (!source) return false;
  const normalized = String(source).toLowerCase();
  return (
    normalized === "system_fallback" ||
    normalized.includes("panel_salvage") ||
    normalized === "authority_noop" ||
    normalized.includes("authority_noop")
  );
}

export function traceFallbackBootstrap(payload: Record<string, unknown>): void {
  logOnce(
    `fallback-bootstrap:${JSON.stringify(payload)}`,
    "[Nexora][FallbackBootstrap]",
    payload
  );
}

export function traceFallbackRejectedStableState(payload: Record<string, unknown>): void {
  logOnce(
    `fallback-rejected:${JSON.stringify(payload)}`,
    "[Nexora][FallbackRejectedStableState]",
    payload
  );
}

export function traceAuthorityNoOpSkipped(payload: Record<string, unknown>): void {
  recordPanelActivity("authority_noop", String(payload.signature ?? JSON.stringify(payload)));
  logOnce(
    `authority-noop:${String(payload.signature ?? JSON.stringify(payload))}`,
    "[Nexora][AuthorityNoOpSkipped]",
    payload
  );
}

export function traceSalvageIgnoredAuthority(payload: Record<string, unknown>): void {
  recordPanelActivity("panel_salvage", String(payload.signature ?? JSON.stringify(payload)));
  logOnce(
    `salvage-ignored:${String(payload.signature ?? JSON.stringify(payload))}`,
    "[Nexora][SalvageIgnoredAuthority]",
    payload
  );
}

export function traceParityIgnoredFallbackSource(payload: Record<string, unknown>): void {
  logOnce(
    `parity-ignored-fallback:${String(payload.source ?? "")}:${String(payload.signature ?? "")}`,
    "[Nexora][ParityIgnoredFallbackSource]",
    payload
  );
}

export function resetFallbackAuthorityDiagnosticsForTests(): void {
  emittedKeys.clear();
  lastPanelActivity = null;
}
