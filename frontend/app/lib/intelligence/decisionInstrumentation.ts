/**
 * Decision Intelligence — dev-only diagnostics (D4 foundation).
 *
 * Purpose: QA hooks for confidence, reasoning, and contract validation without prod noise.
 * Future role: wire to automated tests, trace exporters, or local inspectors.
 * Boundaries: no state mutation beyond fixed-size in-memory dedupe keys; production is always silent.
 */

const P_INTEL = "[Nexora][DecisionIntelligence]";
const P_CONF = "[Nexora][DecisionConfidence]";
const P_REASON = "[Nexora][DecisionReasoning]";

const MAX_KEYS = 48;
const recentKeys: string[] = [];

function remember(key: string): boolean {
  const i = recentKeys.indexOf(key);
  if (i >= 0) return false;
  recentKeys.push(key);
  if (recentKeys.length > MAX_KEYS) recentKeys.shift();
  return true;
}

function devLog(prefix: string, message: string, meta?: Readonly<Record<string, string>>): void {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production") return;
  const key = `${prefix}|${message}|${meta ? JSON.stringify(meta) : ""}`;
  if (!remember(key)) return;
  if (typeof globalThis !== "undefined" && globalThis.console?.debug) {
    globalThis.console.debug(prefix, message, meta ?? {});
  }
}

export function logDecisionIntelligenceDev(
  message: string,
  meta?: Readonly<Record<string, string>>
): void {
  devLog(P_INTEL, message, meta);
}

export function logDecisionConfidenceDev(
  message: string,
  meta?: Readonly<Record<string, string>>
): void {
  devLog(P_CONF, message, meta);
}

export function logDecisionReasoningDev(
  message: string,
  meta?: Readonly<Record<string, string>>
): void {
  devLog(P_REASON, message, meta);
}
