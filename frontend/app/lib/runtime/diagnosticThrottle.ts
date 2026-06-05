/**
 * Development-only throttled diagnostic logging.
 */

import { installDiagnosticConsoleHelper, isDiagnosticEnabled } from "./diagnosticSwitch.ts";

export type DiagnosticSeverity = "error" | "warn" | "info" | "debug" | "silent";

type ThrottleEntry = {
  lastAt: number;
  lastSignature: string;
};

const entries = new Map<string, ThrottleEntry>();
let hygieneReadyLogged = false;

const DEMOTED_DIAGNOSTIC_SUFFIXES = [
  "_AUDIT",
  "_REPORT",
  "_DISCOVERY",
  "_REFERENCE_REUSE",
  "_CACHE_REPORT",
  "_DECOUPLED",
  "_SUPPRESSION",
  "_CLASSIFICATION",
];

const RETAINED_WARNING_RULES = [
  "UNEXPECTED_RENDER",
  "AcceptanceGateFailed critical/runtime-expensive",
  "re-entrancy block",
  "activated runtime guard",
  "duplicate bootstrap replacement",
  "semantic sceneJson churn",
];

function isProduction(): boolean {
  return typeof process !== "undefined" && process.env.NODE_ENV === "production";
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function labelContainsAny(label: string, tokens: readonly string[]): boolean {
  return tokens.some((token) => label.includes(token));
}

function isDemotedDiagnosticLabel(label: string): boolean {
  return DEMOTED_DIAGNOSTIC_SUFFIXES.some((suffix) => label.includes(suffix));
}

function inferDiagnosticSeverity(label: string, payload: unknown): DiagnosticSeverity {
  const record = asRecord(payload);
  const text = `${label} ${typeof payload === "string" ? payload : ""}`;
  if (/RangeError|TypeError|Invalid string length|hydration error|ErrorBoundary/i.test(text)) return "error";
  if (label.includes("[E2:100][AcceptanceGateFailedSummary]")) return "info";
  if (label.includes("[E2:100][AcceptanceGateFailed]")) return "debug";
  if (label.includes("REENTRANCY_BLOCK")) return "warn";
  if (label.includes("SIGNATURE_GUARD") && record?.guardActivated === true) return "warn";
  if (label.includes("RENDER_CLASSIFICATION")) {
    return record?.renderClassification === "UNEXPECTED_RENDER" ? "warn" : "info";
  }
  if (label.includes("SCENE_RENDER_SOURCE")) {
    return record?.renderClassification === "UNEXPECTED_RENDER" ? "warn" : "info";
  }
  if (label.includes("LAYOUT_THROTTLE_AUDIT")) {
    return record?.unsafeLoopDetected === true || record?.abnormalGrowth === true ? "warn" : "debug";
  }
  if (labelContainsAny(label, ["FAILED_RUNTIME_GUARD", "DUPLICATE_BOOTSTRAP_REPLACEMENT"])) return "warn";
  if (isDemotedDiagnosticLabel(label)) return "info";
  return "info";
}

function shouldEmitForSeverity(scope: string | undefined, severity: DiagnosticSeverity): boolean {
  if (severity === "silent") return false;
  if (severity === "warn" || severity === "error") return true;
  if (isProduction()) return false;
  return isDiagnosticEnabled(scope);
}

function emitConsole(level: Exclude<DiagnosticSeverity, "silent">, label: string, payload: unknown): void {
  const logger =
    level === "error"
      ? globalThis.console?.error
      : level === "warn"
        ? globalThis.console?.warn
        : level === "info"
          ? globalThis.console?.info
          : globalThis.console?.debug;
  logger?.call(globalThis.console, label, payload);
}

function logConsoleHygieneReady(): void {
  if (hygieneReadyLogged || isProduction()) return;
  hygieneReadyLogged = true;
  globalThis.console?.info?.("[NEXORA_CONSOLE_HYGIENE_READY]", {
    demotedDiagnosticCount: DEMOTED_DIAGNOSTIC_SUFFIXES.length,
    retainedWarningRules: RETAINED_WARNING_RULES,
    productionSilencingEnabled: true,
    throttleEnabled: true,
  });
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
  scope?: string;
  severity?: DiagnosticSeverity;
}): void {
  const severity = input.severity ?? inferDiagnosticSeverity(input.label, input.payload);
  if (!shouldEmitForSeverity(input.scope, severity)) return;
  installDiagnosticConsoleHelper();
  logConsoleHygieneReady();
  const intervalMs = input.intervalMs ?? 5000;
  const signature = stablePayloadSignature(input.payload ?? null);
  const entryKey = `${input.label}::${input.key}`;
  const now = Date.now();
  const previous = entries.get(entryKey);
  if (previous && previous.lastSignature === signature && now - previous.lastAt < intervalMs) {
    return;
  }
  entries.set(entryKey, { lastAt: now, lastSignature: signature });
  if (severity === "silent") return;
  emitConsole(severity, input.label, input.payload ?? { key: input.key });
}

export function resetDiagnosticThrottleForTests(): void {
  entries.clear();
  hygieneReadyLogged = false;
}
