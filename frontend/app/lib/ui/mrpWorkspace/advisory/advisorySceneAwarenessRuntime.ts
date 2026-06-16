/**
 * MRP:5A:2 — Advisory scene awareness runtime (read-only, no scene writes).
 */

import {
  DEFAULT_ADVISORY_SCENE_AWARENESS,
  MRP_ADVISORY_SCENE_AWARE_TAG,
  type AdvisorySceneWriteAttempt,
  type AdvisorySceneWriteGuardResult,
} from "./advisorySceneAwarenessContract.ts";

const loggedGuardKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logGuardOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedGuardKeys.has(key)) return;
  loggedGuardKeys.add(key);
  globalThis.console?.debug?.(MRP_ADVISORY_SCENE_AWARE_TAG, detail);
}

export function guardAdvisorySceneWrite(
  attempt: AdvisorySceneWriteAttempt
): AdvisorySceneWriteGuardResult {
  logGuardOnce(`${attempt.capability}:${attempt.source ?? "unknown"}`, {
    action: "scene_write_blocked",
    capability: attempt.capability,
    source: attempt.source ?? null,
  });

  return Object.freeze({
    allowed: false,
    tag: MRP_ADVISORY_SCENE_AWARE_TAG,
    reason: "Advisory workspace must not write to the scene — recommendation surfaces are read-only.",
    capability: attempt.capability,
  });
}

export function getAdvisorySceneAwarenessSnapshot() {
  return DEFAULT_ADVISORY_SCENE_AWARENESS;
}

export function traceAdvisorySceneAwarenessOnce(mountKey?: string | null): void {
  logGuardOnce(`trace:${mountKey ?? "default"}`, {
    action: "advisory_scene_awareness_active",
    mountKey: mountKey ?? null,
    sceneWritesAllowed: false,
  });
}

export function resetAdvisorySceneAwarenessRuntimeForTests(): void {
  loggedGuardKeys.clear();
}
