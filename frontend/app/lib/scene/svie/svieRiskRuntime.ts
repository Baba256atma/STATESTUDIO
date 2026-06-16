/**
 * SVIE:2:1 — Risk intelligence runtime.
 *
 * Read-only risk visualization metadata for scene objects. No scene, routing,
 * workspace, or MRP writes.
 */

import {
  guardSvieDashboardWrite,
  guardSvieRouteWrite,
  guardSvieWorkspaceWrite,
  initializeSvieRuntime,
} from "./svieRuntimeFoundation.ts";
import {
  DEFAULT_SVIE_RISK_SNAPSHOT,
  SVIE_RISK_RUNTIME_LOG,
  SVIE_RISK_RUNTIME_TAG,
  SVIE_RISK_RUNTIME_VERSION,
  type SvieRiskForbiddenWriteDomain,
  type SvieRiskRuntimeBuildInput,
  type SvieRiskSnapshot,
  type SvieRiskWriteGuardAttempt,
  type SvieRiskWriteGuardResult,
} from "./svieRiskRuntimeContract.ts";
import { resolveSvieRiskSnapshot } from "./svieRiskRuntimeResolver.ts";

let runtimeInitialized = false;
let snapshot: SvieRiskSnapshot = DEFAULT_SVIE_RISK_SNAPSHOT;

const loggedBrakes = new Set<string>();
const loggedRiskSnapshots = new Set<number>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logRiskRuntimeOnce(next: SvieRiskSnapshot): void {
  if (!isDev() || loggedRiskSnapshots.has(next.generatedAt)) return;
  loggedRiskSnapshots.add(next.generatedAt);

  const counts = Object.freeze({
    low: next.objects.filter((entry) => entry.riskLevel === "low").length,
    medium: next.objects.filter((entry) => entry.riskLevel === "medium").length,
    high: next.objects.filter((entry) => entry.riskLevel === "high").length,
    critical: next.objects.filter((entry) => entry.riskLevel === "critical").length,
  });

  globalThis.console?.debug?.(SVIE_RISK_RUNTIME_LOG, {
    tag: SVIE_RISK_RUNTIME_TAG,
    version: SVIE_RISK_RUNTIME_VERSION,
    objectCount: next.objects.length,
    ...counts,
  });
}

function logBrakeOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[SVIE][Brake]", detail);
}

export function initializeSvieRiskRuntime(): Readonly<{
  initialized: true;
  version: typeof SVIE_RISK_RUNTIME_VERSION;
  readOnly: true;
}> {
  initializeSvieRuntime();
  runtimeInitialized = true;
  return Object.freeze({
    initialized: true,
    version: SVIE_RISK_RUNTIME_VERSION,
    readOnly: true,
  });
}

export function isSvieRiskRuntimeInitialized(): boolean {
  return runtimeInitialized;
}

export function getSvieRiskSnapshot(): SvieRiskSnapshot {
  if (!runtimeInitialized) {
    initializeSvieRiskRuntime();
  }
  return snapshot;
}

export function buildSvieRiskSnapshot(input: SvieRiskRuntimeBuildInput = {}): SvieRiskSnapshot {
  if (!runtimeInitialized) {
    initializeSvieRiskRuntime();
  }

  const next = resolveSvieRiskSnapshot(input, Date.now());
  snapshot = Object.freeze({
    objects: next.objects,
    generatedAt: next.generatedAt,
  });
  logRiskRuntimeOnce(snapshot);
  return snapshot;
}

function guardForbiddenWrite(
  domain: SvieRiskForbiddenWriteDomain,
  attempt: SvieRiskWriteGuardAttempt
): SvieRiskWriteGuardResult {
  const action = typeof attempt.action === "string" ? attempt.action.trim() : "unknown";
  const source = typeof attempt.source === "string" ? attempt.source.trim() : "unknown";
  const reason = `SVIE risk runtime is read-only and cannot perform ${domain} writes (${action}).`;

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

export function guardSvieRiskSceneWrite(
  attempt: Omit<SvieRiskWriteGuardAttempt, "domain"> = {}
): SvieRiskWriteGuardResult {
  return guardForbiddenWrite("scene", { ...attempt, domain: "scene" });
}

export function guardSvieRiskRouteWrite(
  attempt: Omit<SvieRiskWriteGuardAttempt, "domain"> = {}
): SvieRiskWriteGuardResult {
  const foundation = guardSvieRouteWrite({ action: attempt.action, source: attempt.source });
  return Object.freeze({
    allowed: false,
    domain: "route",
    reason: foundation.reason,
  });
}

export function guardSvieRiskWorkspaceWrite(
  attempt: Omit<SvieRiskWriteGuardAttempt, "domain"> = {}
): SvieRiskWriteGuardResult {
  const foundation = guardSvieWorkspaceWrite({ action: attempt.action, source: attempt.source });
  return Object.freeze({
    allowed: false,
    domain: "workspace",
    reason: foundation.reason,
  });
}

export function guardSvieRiskDashboardWrite(
  attempt: Omit<SvieRiskWriteGuardAttempt, "domain"> = {}
): SvieRiskWriteGuardResult {
  const foundation = guardSvieDashboardWrite({ action: attempt.action, source: attempt.source });
  return Object.freeze({
    allowed: false,
    domain: "dashboard",
    reason: foundation.reason,
  });
}

export function resetSvieRiskRuntimeForTests(): void {
  runtimeInitialized = false;
  snapshot = DEFAULT_SVIE_RISK_SNAPSHOT;
  loggedBrakes.clear();
  loggedRiskSnapshots.clear();
}
