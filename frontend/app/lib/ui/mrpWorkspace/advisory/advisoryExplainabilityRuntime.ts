/**
 * MRP:5A:4 — Advisory explainability runtime trace hooks.
 */

import {
  ADVISORY_EXPLAINABILITY_PURPOSE,
  MRP_ADVISORY_EXPLAINABILITY_TAG,
} from "./advisoryExplainabilityContract.ts";

const loggedSyncKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logExplainabilityOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedSyncKeys.has(key)) return;
  loggedSyncKeys.add(key);
  globalThis.console?.debug?.(MRP_ADVISORY_EXPLAINABILITY_TAG, detail);
}

export function traceAdvisoryExplainabilityOnce(mountKey?: string | null): void {
  logExplainabilityOnce(`trace:${mountKey ?? "default"}`, {
    action: "advisory_explainability_active",
    mountKey: mountKey ?? null,
    purpose: ADVISORY_EXPLAINABILITY_PURPOSE,
  });
}

export function resetAdvisoryExplainabilityRuntimeForTests(): void {
  loggedSyncKeys.clear();
}
