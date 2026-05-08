import { ENABLE_DEBUG_LOGS } from "../../lib/featureFlags";

export type PsychLogLevel = "error" | "event" | "debug" | "trace";

const DEDUPE_MS = 5000;
const lastLogByKey = new Map<string, number>();

function isTraceEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem("sycho_trace_logs") === "true";
  } catch {
    return false;
  }
}

function shouldLog(level: PsychLogLevel): boolean {
  if (level === "error") return true;
  if (level === "event") return process.env.NODE_ENV !== "production";
  if (level === "debug") return ENABLE_DEBUG_LOGS;
  return ENABLE_DEBUG_LOGS && isTraceEnabled();
}

function stableStringify(value: unknown): string {
  if (value == null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(",")}}`;
}

export function psychLog(level: PsychLogLevel, key: string, payload?: Record<string, unknown>): void {
  if (!shouldLog(level)) return;

  const dedupeKey = `${level}:${key}:${stableStringify(payload ?? {})}`;
  const now = Date.now();
  const last = lastLogByKey.get(dedupeKey) ?? 0;
  if (now - last < DEDUPE_MS) return;
  lastLogByKey.set(dedupeKey, now);

  const message = `[Sycho]${key}`;
  if (level === "error") console.error(message, payload ?? {});
  else console.log(message, payload ?? {});
}

export const psychLogger = {
  error: (key: string, payload?: Record<string, unknown>) => psychLog("error", key, payload),
  event: (key: string, payload?: Record<string, unknown>) => psychLog("event", key, payload),
  debug: (key: string, payload?: Record<string, unknown>) => psychLog("debug", key, payload),
  trace: (key: string, payload?: Record<string, unknown>) => psychLog("trace", key, payload),
};
