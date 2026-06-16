/**
 * MRP:4D:5 — Timeline scene awareness runtime (read-only).
 */

import { publishTimelineWorkspaceState } from "./timelineWorkspaceStateRuntime.ts";
import {
  DEFAULT_TIMELINE_SCENE_AWARENESS,
  MRP_TIMELINE_SCENE_AWARE_TAG,
  TIMELINE_SCENE_AWARENESS_VERSION,
  type TimelineSceneAwarenessInput,
  type TimelineSceneAwarenessSnapshot,
  type TimelineSceneWriteAttempt,
  type TimelineSceneWriteGuardResult,
} from "./timelineSceneAwarenessContract.ts";
import { resolveTimelineSceneAwareness } from "./timelineSceneAwarenessResolver.ts";

let snapshot: TimelineSceneAwarenessSnapshot = DEFAULT_TIMELINE_SCENE_AWARENESS;
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
  globalThis.console?.debug?.(MRP_TIMELINE_SCENE_AWARE_TAG, detail);
}

function logGuardOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedGuardKeys.has(key)) return;
  loggedGuardKeys.add(key);
  globalThis.console?.debug?.(MRP_TIMELINE_SCENE_AWARE_TAG, detail);
}

export function getTimelineSceneAwarenessSnapshot(): TimelineSceneAwarenessSnapshot {
  return snapshot;
}

export function syncTimelineSceneAwareness(
  input: TimelineSceneAwarenessInput
): TimelineSceneAwarenessSnapshot {
  const nextRevision = revision + 1;
  const next = resolveTimelineSceneAwareness(input, nextRevision);

  if (next.signature === lastSignature) {
    return snapshot;
  }

  revision = nextRevision;
  lastSignature = next.signature;
  snapshot = next;

  publishTimelineWorkspaceState({
    phase: "ready",
    sceneCoverage: next.coverage,
    sceneAwarenessReadOnly: true,
  });

  logSceneAwareOnce(next.signature, {
    action: "scene_awareness_synced",
    readOnly: next.readOnly,
    objectsTracked: next.coverage.objectsTracked,
    objectsWithEvents: next.coverage.objectsWithEvents,
    recentEvents: next.coverage.recentEvents,
  });

  return snapshot;
}

export function guardTimelineSceneWrite(
  attempt: TimelineSceneWriteAttempt
): TimelineSceneWriteGuardResult {
  const result = Object.freeze({
    allowed: false as const,
    reason: `Timeline workspace is read-only for scene capability: ${attempt.capability}`,
    capability: attempt.capability,
    tag: MRP_TIMELINE_SCENE_AWARE_TAG,
  });

  logGuardOnce(`${attempt.capability}:${attempt.source ?? "unknown"}`, {
    action: "scene_write_blocked",
    capability: attempt.capability,
    source: attempt.source ?? null,
  });

  return result;
}

export function assertTimelineSceneReadOnly(value: TimelineSceneAwarenessSnapshot): boolean {
  return value.readOnly === true;
}

export function traceTimelineSceneAwarenessOnce(mountKey?: string | null): void {
  if (!isDev()) return;
  logSceneAwareOnce(`trace:${mountKey ?? "default"}`, {
    action: "scene_awareness_contract_active",
    version: TIMELINE_SCENE_AWARENESS_VERSION,
    readFields: ["selectedObject", "sceneObjects", "workspaceDiagnostics", "eventHistory"],
    mountKey: mountKey ?? null,
  });
}

export function resetTimelineSceneAwarenessRuntimeForTests(): void {
  snapshot = DEFAULT_TIMELINE_SCENE_AWARENESS;
  revision = 0;
  lastSignature = null;
  loggedSyncKeys.clear();
  loggedGuardKeys.clear();
}

/** @internal */
export function getTimelineSceneAwarenessRevisionForTests(): number {
  return revision;
}
