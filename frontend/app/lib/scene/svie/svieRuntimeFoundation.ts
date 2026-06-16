/**
 * SVIE:1:1 — Scene Visual Intelligence Engine foundation runtime.
 *
 * Read-only visual metadata for scene objects. No dashboard, route, workspace,
 * assistant, or scene topology writes.
 */

import {
  DEFAULT_SVIE_RUNTIME_SNAPSHOT,
  SVIE_RUNTIME_BRAKE_LOG,
  SVIE_RUNTIME_FOUNDATION_TAG,
  SVIE_RUNTIME_FOUNDATION_VERSION,
  SVIE_RUNTIME_READY_LOG,
  type SvieForbiddenWriteDomain,
  type SvieRuntimeBuildInput,
  type SvieRuntimeSnapshot,
  type SvieWriteGuardAttempt,
  type SvieWriteGuardResult,
} from "./svieRuntimeFoundationContract.ts";
import { resolveSvieRuntimeSnapshot } from "./svieRuntimeFoundationResolver.ts";

let runtimeInitialized = false;
let runtimeReadyLogged = false;
let snapshot: SvieRuntimeSnapshot = DEFAULT_SVIE_RUNTIME_SNAPSHOT;

const loggedBrakes = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logRuntimeReadyOnce(): void {
  if (!isDev() || runtimeReadyLogged) return;
  runtimeReadyLogged = true;
  globalThis.console?.debug?.(SVIE_RUNTIME_READY_LOG, {
    tag: SVIE_RUNTIME_FOUNDATION_TAG,
    version: SVIE_RUNTIME_FOUNDATION_VERSION,
    readOnly: true,
  });
}

function logBrakeOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.(SVIE_RUNTIME_BRAKE_LOG, detail);
}

export function initializeSvieRuntime(): Readonly<{
  initialized: true;
  version: typeof SVIE_RUNTIME_FOUNDATION_VERSION;
  readOnly: true;
}> {
  runtimeInitialized = true;
  logRuntimeReadyOnce();
  return Object.freeze({
    initialized: true,
    version: SVIE_RUNTIME_FOUNDATION_VERSION,
    readOnly: true,
  });
}

export function isSvieRuntimeInitialized(): boolean {
  return runtimeInitialized;
}

export function getSvieRuntimeSnapshot(): SvieRuntimeSnapshot {
  if (!runtimeInitialized) {
    initializeSvieRuntime();
  }
  return snapshot;
}

export function buildSvieRuntimeSnapshot(input: SvieRuntimeBuildInput = {}): SvieRuntimeSnapshot {
  if (!runtimeInitialized) {
    initializeSvieRuntime();
  }

  const next = resolveSvieRuntimeSnapshot(input, Date.now());
  snapshot = Object.freeze({
    objects: next.objects,
    generatedAt: next.generatedAt,
  });
  return snapshot;
}

function guardForbiddenWrite(
  domain: SvieForbiddenWriteDomain,
  attempt: SvieWriteGuardAttempt
): SvieWriteGuardResult {
  const action = typeof attempt.action === "string" ? attempt.action.trim() : "unknown";
  const source = typeof attempt.source === "string" ? attempt.source.trim() : "unknown";
  const reason = `SVIE is read-only and cannot perform ${domain} writes (${action}).`;

  logBrakeOnce(`${domain}:${action}:${source}`, {
    message: reason,
    domain,
    action,
    source,
  });

  return Object.freeze({
    allowed: false,
    domain,
    reason,
  });
}

export function guardSvieDashboardWrite(
  attempt: Omit<SvieWriteGuardAttempt, "domain"> = {}
): SvieWriteGuardResult {
  return guardForbiddenWrite("dashboard", { ...attempt, domain: "dashboard" });
}

export function guardSvieRouteWrite(
  attempt: Omit<SvieWriteGuardAttempt, "domain"> = {}
): SvieWriteGuardResult {
  return guardForbiddenWrite("route", { ...attempt, domain: "route" });
}

export function guardSvieWorkspaceWrite(
  attempt: Omit<SvieWriteGuardAttempt, "domain"> = {}
): SvieWriteGuardResult {
  return guardForbiddenWrite("workspace", { ...attempt, domain: "workspace" });
}

export function resetSvieRuntimeFoundationForTests(): void {
  runtimeInitialized = false;
  runtimeReadyLogged = false;
  snapshot = DEFAULT_SVIE_RUNTIME_SNAPSHOT;
  loggedBrakes.clear();
}
