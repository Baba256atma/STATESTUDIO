/**
 * MRP:4C:5 — Risk scene awareness runtime (read-only).
 */

import { publishRiskWorkspaceState } from "./riskWorkspaceStateRuntime.ts";
import {
  DEFAULT_RISK_SCENE_AWARENESS,
  MRP_RISK_SCENE_AWARE_TAG,
  RISK_SCENE_AWARENESS_VERSION,
  type RiskSceneAwarenessInput,
  type RiskSceneAwarenessSnapshot,
  type RiskSceneWriteAttempt,
  type RiskSceneWriteGuardResult,
} from "./riskSceneAwarenessContract.ts";
import {
  resolveRiskSceneAwareness,
} from "./riskSceneAwarenessResolver.ts";

let snapshot: RiskSceneAwarenessSnapshot = DEFAULT_RISK_SCENE_AWARENESS;
let revision = 0;
let lastSignature: string | null = null;
const loggedSyncKeys = new Set<string>();
const loggedGuardKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logSceneAwareOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedSyncKeys.has(key)) return;
  loggedSyncKeys.add(key);
  globalThis.console?.debug?.(MRP_RISK_SCENE_AWARE_TAG, detail);
}

function logGuardOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedGuardKeys.has(key)) return;
  loggedGuardKeys.add(key);
  globalThis.console?.debug?.(MRP_RISK_SCENE_AWARE_TAG, detail);
}

export function getRiskSceneAwarenessSnapshot(): RiskSceneAwarenessSnapshot {
  return snapshot;
}

export function syncRiskSceneAwareness(
  input: RiskSceneAwarenessInput
): RiskSceneAwarenessSnapshot {
  const nextRevision = revision + 1;
  const next = resolveRiskSceneAwareness(input, nextRevision);

  if (next.signature === lastSignature) {
    return snapshot;
  }

  revision = nextRevision;
  lastSignature = next.signature;
  snapshot = next;

  publishRiskWorkspaceState({
    phase: "ready",
    sceneCoverage: next.coverage,
    sceneAwarenessReadOnly: true,
  });

  logSceneAwareOnce(next.signature, {
    action: "scene_awareness_synced",
    readOnly: next.readOnly,
    objectsMonitored: next.coverage.objectsMonitored,
    objectsWithRisk: next.coverage.objectsWithRisk,
    criticalObjects: next.coverage.criticalObjects,
  });

  return snapshot;
}

export function guardRiskSceneWrite(
  attempt: RiskSceneWriteAttempt
): RiskSceneWriteGuardResult {
  const result = Object.freeze({
    allowed: false as const,
    reason: `Risk workspace is read-only for scene capability: ${attempt.capability}`,
    capability: attempt.capability,
    tag: MRP_RISK_SCENE_AWARE_TAG,
  });

  logGuardOnce(`${attempt.capability}:${attempt.source ?? "unknown"}`, {
    action: "scene_write_blocked",
    capability: attempt.capability,
    source: attempt.source ?? null,
  });

  return result;
}

export function assertRiskSceneReadOnly(value: RiskSceneAwarenessSnapshot): boolean {
  return value.readOnly === true;
}

export function traceRiskSceneAwarenessOnce(mountKey?: string | null): void {
  if (!isDev()) return;
  logSceneAwareOnce(`trace:${mountKey ?? "default"}`, {
    action: "scene_awareness_contract_active",
    version: RISK_SCENE_AWARENESS_VERSION,
    readFields: ["selectedObject", "sceneObjects", "workspaceDiagnostics"],
    mountKey: mountKey ?? null,
  });
}

export function resetRiskSceneAwarenessRuntimeForTests(): void {
  snapshot = DEFAULT_RISK_SCENE_AWARENESS;
  revision = 0;
  lastSignature = null;
  loggedSyncKeys.clear();
  loggedGuardKeys.clear();
}

/** @internal */
export function getRiskSceneAwarenessRevisionForTests(): number {
  return revision;
}
