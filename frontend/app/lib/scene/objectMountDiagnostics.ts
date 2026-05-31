/**
 * E2:67 — Development-only object mount diagnostics (never on render path).
 */

import {
  recordObjectMount,
  recordObjectUnmount,
  type ObjectRemountTrace,
} from "./objectRemountDetector";
import { getSceneRemountContext } from "./sceneRemountContext";
import { traceObjectRemountIgnored } from "../decision/trace/decisionTraceDiagnostics";
import { shouldSuppressIdleDebugLog } from "../runtime/idleRuntimeStabilityGuard";

const emittedMountKeys = new Set<string>();

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function logMountOnce(key: string, label: string, payload: Record<string, unknown>): void {
  if (!isDev()) return;
  if (emittedMountKeys.has(key)) return;
  emittedMountKeys.add(key);
  globalThis.console?.debug?.(label, payload);
}

export function traceObjectMount(input: {
  objectId: string;
  reactKey: string;
  source: string;
  reason?: string;
}): void {
  if (!isDev()) return;
  const remount = recordObjectMount(input);
  if (shouldSuppressIdleDebugLog(`[Nexora][ObjectMount]:${input.objectId}:${input.reactKey}`)) {
    if (remount) emitObjectRemountDetected(remount);
    return;
  }
  logMountOnce(
    `mount:${input.objectId}:${input.source}`,
    "[Nexora][ObjectMount]",
    {
      ...getSceneRemountContext(),
      objectId: input.objectId,
      reactKey: input.reactKey,
      source: input.source,
      reason: input.reason ?? "initial_mount",
    }
  );
  if (remount) {
    emitObjectRemountDetected(remount);
  }
}

export function traceObjectUnmount(input: {
  objectId: string;
  reactKey: string;
  source: string;
  reason?: string;
}): void {
  if (!isDev()) return;
  recordObjectUnmount(input);
  if (shouldSuppressIdleDebugLog(`[Nexora][ObjectUnmount]:${input.objectId}:${input.reactKey}`)) return;
  logMountOnce(
    `unmount:${input.objectId}:${input.source}:${input.reactKey}`,
    "[Nexora][ObjectUnmount]",
    {
      ...getSceneRemountContext(),
      objectId: input.objectId,
      reactKey: input.reactKey,
      source: input.source,
      reason: input.reason ?? "component_unmount",
    }
  );
}

export function traceObjectIdentityChanged(input: {
  objectId: string;
  previousId: string;
  nextId: string;
  source: string;
}): void {
  if (!isDev()) return;
  logMountOnce(
    `identity:${input.previousId}->${input.nextId}:${input.source}`,
    "[Nexora][ObjectIdentityChanged]",
    input
  );
}

export function traceObjectKeyChanged(input: {
  objectId: string;
  previousKey: string;
  nextKey: string;
  source: string;
}): void {
  if (!isDev()) return;
  globalThis.console?.warn?.("[Nexora][ObjectKeyChanged]", input);
}

export function emitObjectRemountDetected(trace: ObjectRemountTrace): void {
  if (!isDev()) return;
  globalThis.console?.warn?.("[Nexora][ObjectRemountDetected]", trace);
  traceObjectRemountIgnored({
    objectId: trace.objectId,
    reason: "diagnostics_only",
    driftSignature: `${trace.objectId}:${trace.reason}:${trace.elapsedMs}`,
    source: trace.source,
  });
}

export function resetObjectMountDiagnosticsForTests(): void {
  emittedMountKeys.clear();
}
