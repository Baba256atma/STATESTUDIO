/**
 * MRP:4:11 — Operational scene awareness runtime (read-only).
 */

import type { OperationalObjectContext } from "./operationalObjectContextContract.ts";
import {
  OPERATIONAL_SCENE_AWARE_TAG,
  DEFAULT_OPERATIONAL_SCENE_AWARENESS,
  type OperationalSceneAwarenessInput,
  type OperationalSceneAwarenessSnapshot,
  type OperationalSceneWriteAttempt,
  type OperationalSceneWriteGuardResult,
} from "./operationalSceneAwarenessContract.ts";
import {
  buildOperationalSceneAwarenessSignature,
  mapOperationalObjectContextToSceneAwareness,
  resolveOperationalSceneAwareness,
} from "./operationalSceneAwarenessResolver.ts";

let snapshot: OperationalSceneAwarenessSnapshot = DEFAULT_OPERATIONAL_SCENE_AWARENESS;
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
  globalThis.console?.debug?.(OPERATIONAL_SCENE_AWARE_TAG, detail);
}

function logGuardOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedGuardKeys.has(key)) return;
  loggedGuardKeys.add(key);
  globalThis.console?.debug?.(OPERATIONAL_SCENE_AWARE_TAG, detail);
}

export function getOperationalSceneAwarenessSnapshot(): OperationalSceneAwarenessSnapshot {
  return snapshot;
}

export function syncOperationalSceneAwareness(
  input: OperationalSceneAwarenessInput
): OperationalSceneAwarenessSnapshot {
  const nextRevision = revision + 1;
  const next = resolveOperationalSceneAwareness(input, nextRevision);

  if (next.signature === lastSignature) {
    return snapshot;
  }

  revision = nextRevision;
  lastSignature = next.signature;
  snapshot = next;

  logSceneAwareOnce(next.signature, {
    action: "scene_awareness_synced",
    hasSelection: next.hasSelection,
    selectedObject: next.selectedObject,
    readOnly: next.readOnly,
  });

  return snapshot;
}

export function syncOperationalSceneAwarenessFromObjectContext(
  objectContext: OperationalObjectContext
): OperationalSceneAwarenessSnapshot {
  const nextRevision = revision + 1;
  const next = mapOperationalObjectContextToSceneAwareness(objectContext, nextRevision);

  if (next.signature === lastSignature) {
    return snapshot;
  }

  revision = nextRevision;
  lastSignature = next.signature;
  snapshot = next;

  logSceneAwareOnce(next.signature, {
    action: "scene_awareness_synced_from_object_context",
    hasSelection: next.hasSelection,
    selectedObject: next.selectedObject,
    readOnly: next.readOnly,
  });

  return snapshot;
}

export function guardOperationalSceneWrite(
  attempt: OperationalSceneWriteAttempt
): OperationalSceneWriteGuardResult {
  const result = Object.freeze({
    allowed: false as const,
    reason: `Operational workspace is read-only for scene capability: ${attempt.capability}`,
    capability: attempt.capability,
    tag: OPERATIONAL_SCENE_AWARE_TAG,
  });

  logGuardOnce(`${attempt.capability}:${attempt.source ?? "unknown"}`, {
    action: "scene_write_blocked",
    capability: attempt.capability,
    source: attempt.source ?? null,
  });

  return result;
}

export function assertOperationalSceneReadOnly(
  value: OperationalSceneAwarenessSnapshot
): boolean {
  return value.readOnly === true;
}

export function traceOperationalSceneAwarenessOnce(mountKey?: string | null): void {
  if (!isDev()) return;
  logSceneAwareOnce(`trace:${mountKey ?? "default"}`, {
    action: "scene_awareness_contract_active",
    version: "4.11.0",
    readFields: ["selectedObject", "objectStatus", "objectPriority", "objectActivity"],
    mountKey: mountKey ?? null,
  });
}

export function resetOperationalSceneAwarenessRuntimeForTests(): void {
  snapshot = DEFAULT_OPERATIONAL_SCENE_AWARENESS;
  revision = 0;
  lastSignature = null;
  loggedSyncKeys.clear();
  loggedGuardKeys.clear();
}

/** @internal */
export function getOperationalSceneAwarenessRevisionForTests(): number {
  return revision;
}

/** @internal */
export function buildOperationalSceneAwarenessSignatureForTests(
  value: OperationalSceneAwarenessSnapshot
): string {
  return buildOperationalSceneAwarenessSignature(value);
}
