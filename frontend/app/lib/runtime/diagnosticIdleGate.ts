import { installDiagnosticConsoleHelper, isDiagnosticEnabled } from "./diagnosticSwitch.ts";

type DiagnosticLogLevel = "debug" | "info" | "warn" | "error";

type SignatureGateOptions = {
  cooldownMs?: number;
  scope?: string;
};

const lastSignatureByLabel = new Map<string, string>();
const lastEmittedAtByLabel = new Map<string, number>();
const permanentKeys = new Set<string>();

export function stableDiagnosticSignature(value: unknown): string {
  if (value == null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((entry) => stableDiagnosticSignature(entry)).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableDiagnosticSignature(record[key])}`)
    .join(",")}}`;
}

export function shouldEmitDiagnosticOnSignatureChange(
  label: string,
  signature: string,
  options?: SignatureGateOptions
): boolean {
  if (!isDiagnosticEnabled(options?.scope)) return false;
  installDiagnosticConsoleHelper();
  const previousSignature = lastSignatureByLabel.get(label);
  if (previousSignature === signature) return false;

  const now = Date.now();
  const lastEmittedAt = lastEmittedAtByLabel.get(label) ?? 0;
  if (options?.cooldownMs && previousSignature !== undefined && now - lastEmittedAt < options.cooldownMs) {
    return false;
  }

  lastSignatureByLabel.set(label, signature);
  lastEmittedAtByLabel.set(label, now);
  return true;
}

export function shouldEmitDiagnosticOncePermanent(label: string, signature: string): boolean {
  if (!isDiagnosticEnabled()) return false;
  installDiagnosticConsoleHelper();
  const key = `${label}:${signature}`;
  if (permanentKeys.has(key)) return false;
  permanentKeys.add(key);
  lastSignatureByLabel.set(label, signature);
  lastEmittedAtByLabel.set(label, Date.now());
  return true;
}

export function devLogOnSignatureChange(
  label: string,
  signature: string,
  payload: Record<string, unknown>,
  level: DiagnosticLogLevel = "debug",
  options?: SignatureGateOptions
): void {
  if (!shouldEmitDiagnosticOnSignatureChange(label, signature, options)) return;
  globalThis.console?.[level]?.(label, payload);
}

export function devLogOncePermanent(
  label: string,
  signature: string,
  payload: Record<string, unknown>,
  level: DiagnosticLogLevel = "debug"
): void {
  if (!shouldEmitDiagnosticOncePermanent(label, signature)) return;
  globalThis.console?.[level]?.(label, payload);
}

export function resetDiagnosticIdleGateForTests(): void {
  lastSignatureByLabel.clear();
  lastEmittedAtByLabel.clear();
  permanentKeys.clear();
}
