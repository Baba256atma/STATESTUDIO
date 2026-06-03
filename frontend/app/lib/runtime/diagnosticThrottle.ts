/**
 * Development-only throttled diagnostic logging.
 */

type ThrottleEntry = {
  lastAt: number;
  lastSignature: string;
};

const entries = new Map<string, ThrottleEntry>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function stablePayloadSignature(payload: unknown): string {
  if (payload == null || typeof payload !== "object") return JSON.stringify(payload);
  if (Array.isArray(payload)) return `[${payload.map((entry) => stablePayloadSignature(entry)).join(",")}]`;
  const record = payload as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stablePayloadSignature(record[key])}`)
    .join(",")}}`;
}

export function devLogThrottled(input: {
  key: string;
  label: string;
  payload?: unknown;
  intervalMs?: number;
}): void {
  if (!isDev()) return;
  const intervalMs = input.intervalMs ?? 5000;
  const signature = stablePayloadSignature(input.payload ?? null);
  const entryKey = `${input.label}::${input.key}`;
  const now = Date.now();
  const previous = entries.get(entryKey);
  if (previous && previous.lastSignature === signature && now - previous.lastAt < intervalMs) {
    return;
  }
  entries.set(entryKey, { lastAt: now, lastSignature: signature });
  globalThis.console?.warn?.(input.label, input.payload ?? { key: input.key });
}

export function resetDiagnosticThrottleForTests(): void {
  entries.clear();
}
