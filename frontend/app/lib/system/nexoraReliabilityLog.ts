/**
 * B.26 — Deduped structured dev logs for reliability passes.
 */

const seen = new Set<string>();

function key(kind: string, part: string): string {
  return `${kind}::${part}`;
}

function emitOnce(k: string, fn: () => void): void {
  if (process.env.NODE_ENV === "production") return;
  if (seen.has(k)) return;
  seen.add(k);
  fn();
}

/** Clears dedupe map (e.g. for tests). */
export function resetNexoraReliabilityLogDedupe(): void {
  seen.clear();
}

export function emitNexoraB26HealthCheck(payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  let signature = "";
  try {
    signature = JSON.stringify(payload);
  } catch {
    signature = String(payload);
  }
  const k = key("health_check", signature);
  if (seen.has(k)) return;
  seen.add(k);
  globalThis.console?.debug?.("[Nexora][B26] health_check", payload);
}

export function emitNexoraB26ApiError(endpoint: string, code: string): void {
  const k = key("api_err", `${endpoint}::${code}`);
  emitOnce(k, () => globalThis.console?.debug?.("[Nexora][B26] api_error", { endpoint, code }));
}

export function emitNexoraB26RetryAttempt(endpoint: string): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.debug?.("[Nexora][B26] retry_attempt", { endpoint });
}
