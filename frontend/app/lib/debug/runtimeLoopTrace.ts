/**
 * E2:76 — Runtime loop root-cause trace chain (development diagnostics only).
 * Does not mutate business state.
 */

import { recordLoopObservation, getLoopRootCandidates } from "./runtimeLoopDetector";
import { isIdleRuntimeLocked, shouldSuppressIdleDebugLog } from "../runtime/idleRuntimeStabilityGuard";

export type RuntimeTracePayload = {
  source: string;
  action: string;
  signature: string;
  previousSignature?: string | null;
  nextSignature?: string | null;
  detail?: Record<string, unknown>;
};

export type RuntimeTraceEvent = RuntimeTracePayload & {
  timestamp: number;
  stack: string;
};

type AuditBucket =
  | "writers"
  | "dispatchers"
  | "stateChanges"
  | "sceneWrites"
  | "panelWrites"
  | "selectionEvents"
  | "parityEvents"
  | "contractEvents";

const lastSignatureByCategory = new Map<string, string>();
const auditCounters = new Map<AuditBucket, Map<string, number>>();
const lastSignatureByAuditKey = new Map<string, string>();
const trueRepeatCountByAuditKey = new Map<string, number>();
const emissionCountByAuditKey = new Map<string, number>();
const emittedTraceKeys = new Set<string>();

let appStartedAt = Date.now();
let auditSummaryEmitted = false;
let auditTimerStarted = false;

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function captureStack(skipFrames = 3): string {
  const stack = new Error().stack ?? "";
  return stack
    .split("\n")
    .slice(skipFrames, skipFrames + 6)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

function resolveCaller(stack: string): string {
  const first = stack.split("\n")[0] ?? "unknown";
  const match = first.match(/at\s+(?:async\s+)?(?:Object\.)?([^(\s]+)/);
  return match?.[1] ?? first;
}

export function computeChangedFields(
  previousSignature: string | null | undefined,
  nextSignature: string | null | undefined
): string[] {
  if (!previousSignature || !nextSignature) return previousSignature === nextSignature ? [] : ["all"];
  if (previousSignature === nextSignature) return [];
  try {
    const prev = JSON.parse(previousSignature) as Record<string, unknown>;
    const next = JSON.parse(nextSignature) as Record<string, unknown>;
    const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
    const changed: string[] = [];
    keys.forEach((key) => {
      if (JSON.stringify(prev[key]) !== JSON.stringify(next[key])) {
        changed.push(key);
      }
    });
    return changed.length > 0 ? changed : ["unknown"];
  } catch {
    return ["unparseable"];
  }
}

function bumpAudit(bucket: AuditBucket, key: string, signature: string): void {
  const previousSignature = lastSignatureByAuditKey.get(key);
  const nextEmissionCount = (emissionCountByAuditKey.get(key) ?? 0) + 1;
  emissionCountByAuditKey.set(key, nextEmissionCount);

  if (previousSignature === signature) {
    trueRepeatCountByAuditKey.set(key, (trueRepeatCountByAuditKey.get(key) ?? 1) + 1);
  } else {
    lastSignatureByAuditKey.set(key, signature);
    if (!trueRepeatCountByAuditKey.has(key)) {
      trueRepeatCountByAuditKey.set(key, 1);
    }
  }

  const bucketMap = auditCounters.get(bucket) ?? new Map<string, number>();
  bucketMap.set(key, nextEmissionCount);
  auditCounters.set(bucket, bucketMap);
}

export type LoopAuditRepeatingEntry = {
  key: string;
  writer: string;
  source: string;
  action: string;
  count: number;
  emissionCount: number;
  lastSignature: string | null;
};

function buildRepeatingAuditEntries(
  bucket: AuditBucket,
  minCount = 2,
  limit = 8
): LoopAuditRepeatingEntry[] {
  const keysForBucket = new Set<string>();
  for (const [key, count] of trueRepeatCountByAuditKey.entries()) {
    if (count < minCount) continue;
    const emissionCount = emissionCountByAuditKey.get(key) ?? 0;
    if (emissionCount < minCount) continue;
    if ((auditCounters.get(bucket)?.get(key) ?? 0) < minCount) continue;
    keysForBucket.add(key);
  }

  return Array.from(keysForBucket)
    .map((key) => {
      const { source, action } = parseWriterKey(key);
      return {
        key,
        writer: source,
        source,
        action,
        count: trueRepeatCountByAuditKey.get(key) ?? 0,
        emissionCount: emissionCountByAuditKey.get(key) ?? 0,
        lastSignature: lastSignatureByAuditKey.get(key) ?? null,
      };
    })
    .sort((a, b) => b.count - a.count || b.emissionCount - a.emissionCount)
    .slice(0, limit);
}

function buildTopAuditEntries(
  bucket: AuditBucket,
  limit = 8
): LoopAuditRepeatingEntry[] {
  return topEntries(bucket, limit).map((entry) => {
    const { source, action } = parseWriterKey(entry.key);
    return {
      key: entry.key,
      writer: source,
      source,
      action,
      count: trueRepeatCountByAuditKey.get(entry.key) ?? entry.count,
      emissionCount: emissionCountByAuditKey.get(entry.key) ?? entry.count,
      lastSignature: lastSignatureByAuditKey.get(entry.key) ?? null,
    };
  });
}

function topEntries(bucket: AuditBucket, limit = 8): Array<{ key: string; count: number }> {
  const bucketMap = auditCounters.get(bucket);
  if (!bucketMap) return [];
  return Array.from(bucketMap.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function repeatingEntries(
  bucket: AuditBucket,
  minCount = 2,
  limit = 8
): LoopAuditRepeatingEntry[] {
  return buildRepeatingAuditEntries(bucket, minCount, limit);
}

function parseWriterKey(key: string): { source: string; action: string } {
  const [source = "unknown", action = "unknown"] = key.split("::");
  return { source, action };
}

function emitTrace(
  label: string,
  category: string,
  bucket: AuditBucket,
  payload: RuntimeTracePayload,
  options?: { logEveryTime?: boolean }
): RuntimeTraceEvent {
  const timestamp = Date.now();
  const stack = captureStack();
  const caller = resolveCaller(stack);
  const categoryPreviousSignature = lastSignatureByCategory.get(category) ?? null;
  const nextSignature = payload.nextSignature ?? payload.signature;
  const payloadPreviousSignature =
    payload.previousSignature ?? categoryPreviousSignature ?? null;
  const explicitStableWrite =
    payload.previousSignature != null && payload.previousSignature === nextSignature;
  const signatureChanged =
    !explicitStableWrite && categoryPreviousSignature !== nextSignature;
  const event: RuntimeTraceEvent = {
    ...payload,
    previousSignature: payloadPreviousSignature,
    nextSignature,
    timestamp,
    stack,
    detail: {
      ...(payload.detail ?? {}),
      caller,
      signatureChanged,
    },
  };

  if (isDev()) {
    const dedupeKey = `${label}:${payload.source}:${payload.action}:${nextSignature}`;
    const shouldLog =
      signatureChanged && (options?.logEveryTime || !emittedTraceKeys.has(dedupeKey));
    if (shouldLog) {
      emittedTraceKeys.add(dedupeKey);
      globalThis.console?.debug?.(label, event);
    }
    if (signatureChanged) {
      recordLoopObservation(payload.source, payload.action, nextSignature, timestamp);
      const auditKey = `${payload.source}::${payload.action}`;
      bumpAudit(bucket, auditKey, nextSignature);
      if (bucket === "stateChanges") {
        bumpAudit("writers", auditKey, nextSignature);
      }
      lastSignatureByCategory.set(category, nextSignature);
      scheduleLoopAuditSummary();
    }
  }

  return event;
}

function scheduleLoopAuditSummary(): void {
  if (!isDev() || auditTimerStarted) return;
  auditTimerStarted = true;
  globalThis.setTimeout(() => {
    emitLoopAuditSummary();
  }, 30_000);
}

export function emitLoopAuditSummary(force = false): void {
  if (!isDev()) return;
  if (auditSummaryEmitted && !force) return;
  if (!force && shouldSuppressIdleDebugLog("[Nexora][LoopAuditSummary]")) return;
  auditSummaryEmitted = true;

  const repeatThreshold = 2;
  const repeatingWriters = repeatingEntries("writers", repeatThreshold);
  const repeatingSceneWrites = repeatingEntries("sceneWrites", repeatThreshold);

  globalThis.console?.warn?.("[Nexora][LoopAuditSummary]", {
    idleMs: Date.now() - appStartedAt,
    idleRuntimeLocked: isIdleRuntimeLocked(),
    repeatThreshold,
    hasRepeatingWriters: repeatingWriters.length > 0,
    hasRepeatingSceneWrites: repeatingSceneWrites.length > 0,
    topRepeatingWriters: repeatingWriters,
    topRepeatingDispatchers: repeatingEntries("dispatchers", repeatThreshold),
    topRepeatingStateChanges: repeatingEntries("stateChanges", repeatThreshold),
    topRepeatingSceneWrites: repeatingSceneWrites,
    topRepeatingPanelWrites: repeatingEntries("panelWrites", repeatThreshold),
    topRepeatingSelectionEvents: repeatingEntries("selectionEvents", repeatThreshold),
    topRepeatingParityEvents: repeatingEntries("parityEvents", repeatThreshold),
    topRepeatingContractEvents: repeatingEntries("contractEvents", repeatThreshold),
    topWriters: buildTopAuditEntries("writers"),
    topSceneWrites: buildTopAuditEntries("sceneWrites"),
    rootWriterCandidates: getLoopRootCandidates(),
  });
}

export function traceRuntimeWrite(payload: RuntimeTracePayload): RuntimeTraceEvent {
  return emitTrace("[Nexora][Trace][RuntimeWrite]", "runtime-write", "writers", payload);
}

export function traceRuntimeDispatch(payload: RuntimeTracePayload): RuntimeTraceEvent {
  return emitTrace("[Nexora][Trace][RuntimeDispatch]", "runtime-dispatch", "dispatchers", payload);
}

export function traceRuntimeParity(input: {
  source: string;
  action: string;
  reason: string;
  caller?: string;
  previousSceneSignature: string | null;
  nextSceneSignature: string;
  changedFields?: string[];
  detail?: Record<string, unknown>;
}): RuntimeTraceEvent {
  const changedFields =
    input.changedFields ??
    computeChangedFields(input.previousSceneSignature, input.nextSceneSignature);
  return emitTrace(
    "[Nexora][Trace][SceneParity]",
    "scene-parity",
    "parityEvents",
    {
      source: input.source,
      action: input.action,
      signature: input.nextSceneSignature,
      previousSignature: input.previousSceneSignature,
      nextSignature: input.nextSceneSignature,
      detail: {
        reason: input.reason,
        caller: input.caller ?? input.source,
        changedFields,
        ...(input.detail ?? {}),
      },
    },
    { logEveryTime: changedFields.length > 0 }
  );
}

export function traceRuntimeSelection(input: {
  caller: string;
  objectId?: string | null;
  previousSelection: string | null;
  nextSelection: string;
  sameSelectionReapply?: boolean;
  detail?: Record<string, unknown>;
}): RuntimeTraceEvent {
  const sameSelectionReapply =
    input.sameSelectionReapply ??
    (input.previousSelection != null && input.previousSelection === input.nextSelection);
  return emitTrace(
    "[Nexora][Trace][Selection]",
    "selection",
    "selectionEvents",
    {
      source: input.caller,
      action: sameSelectionReapply ? "same_selection_reapply" : "selection_change",
      signature: input.nextSelection,
      previousSignature: input.previousSelection,
      nextSignature: input.nextSelection,
      detail: {
        caller: input.caller,
        objectId: input.objectId ?? null,
        sameSelectionReapply,
        ...(input.detail ?? {}),
      },
    },
    { logEveryTime: true }
  );
}

export function traceRuntimeSceneWrite(input: {
  writer: string;
  reason: string;
  sceneSignature: string;
  previousSceneSignature?: string | null;
  changedObjects?: string[];
  duplicateAttempt?: boolean;
  detail?: Record<string, unknown>;
}): RuntimeTraceEvent {
  return emitTrace(
    "[Nexora][Trace][SceneWrite]",
    "scene-write",
    "sceneWrites",
    {
      source: input.writer,
      action: input.duplicateAttempt ? "duplicate_scene_write" : "scene_write",
      signature: input.sceneSignature,
      previousSignature: input.previousSceneSignature ?? null,
      nextSignature: input.sceneSignature,
      detail: {
        writer: input.writer,
        reason: input.reason,
        changedObjects: input.changedObjects ?? [],
        duplicateAttempt: Boolean(input.duplicateAttempt),
        ...(input.detail ?? {}),
      },
    },
    { logEveryTime: true }
  );
}

export function traceRuntimeRightPanel(input: {
  caller: string;
  previousPanel: string | null;
  nextPanel: string | null;
  contextId?: string | null;
  signature: string;
  previousSignature?: string | null;
  dashboardToDashboard?: boolean;
  detail?: Record<string, unknown>;
}): RuntimeTraceEvent {
  const dashboardToDashboard =
    input.dashboardToDashboard ??
    (input.previousPanel === "dashboard" && input.nextPanel === "dashboard");
  return emitTrace(
    "[Nexora][Trace][RightPanel]",
    "right-panel",
    "panelWrites",
    {
      source: input.caller,
      action: dashboardToDashboard ? "dashboard_to_dashboard" : "panel_write",
      signature: input.signature,
      previousSignature: input.previousSignature ?? null,
      nextSignature: input.signature,
      detail: {
        caller: input.caller,
        previousPanel: input.previousPanel,
        nextPanel: input.nextPanel,
        contextId: input.contextId ?? null,
        dashboardToDashboard,
        ...(input.detail ?? {}),
      },
    },
    { logEveryTime: true }
  );
}

export function traceRuntimeContract(input: {
  source: string;
  action: string;
  contractSignature: string;
  previousContractSignature?: string | null;
  changedFields?: string[];
  salvageReason?: string | null;
  repeatedSalvage?: boolean;
  detail?: Record<string, unknown>;
}): RuntimeTraceEvent {
  const changedFields =
    input.changedFields ??
    computeChangedFields(input.previousContractSignature ?? null, input.contractSignature);
  const repeatedSalvage =
    input.repeatedSalvage ??
    (input.previousContractSignature != null &&
      input.previousContractSignature === input.contractSignature &&
      input.action.includes("salvage"));
  return emitTrace(
    "[Nexora][Trace][Contract]",
    "contract",
    "contractEvents",
    {
      source: input.source,
      action: input.action,
      signature: input.contractSignature,
      previousSignature: input.previousContractSignature ?? null,
      nextSignature: input.contractSignature,
      detail: {
        contractSignature: input.contractSignature,
        changedFields,
        salvageReason: input.salvageReason ?? null,
        repeatedSalvage,
        ...(input.detail ?? {}),
      },
    },
    { logEveryTime: true }
  );
}

export function traceRuntimeWorkspaceEmptyPayload(input: {
  caller: string;
  payload: unknown;
  sceneCount: number;
  objectCount: number;
  hydrationState?: string | null;
  detail?: Record<string, unknown>;
}): RuntimeTraceEvent {
  const signature = JSON.stringify({
    caller: input.caller,
    sceneCount: input.sceneCount,
    objectCount: input.objectCount,
    hydrationState: input.hydrationState ?? null,
  });
  return emitTrace(
    "[Nexora][Trace][WorkspaceEmptyPayload]",
    "workspace-empty",
    "sceneWrites",
    {
      source: input.caller,
      action: "workspace_empty_payload_after_hydration",
      signature,
      detail: {
        caller: input.caller,
        payload: input.payload,
        sceneCount: input.sceneCount,
        objectCount: input.objectCount,
        hydrationState: input.hydrationState ?? null,
        ...(input.detail ?? {}),
      },
    },
    { logEveryTime: true }
  );
}

export function resetRuntimeLoopTraceForTests(): void {
  lastSignatureByCategory.clear();
  auditCounters.clear();
  lastSignatureByAuditKey.clear();
  trueRepeatCountByAuditKey.clear();
  emissionCountByAuditKey.clear();
  emittedTraceKeys.clear();
  appStartedAt = Date.now();
  auditSummaryEmitted = false;
  auditTimerStarted = false;
}

export function getRuntimeLoopAuditCounters(): Readonly<Record<string, ReadonlyArray<{ key: string; count: number }>>> {
  return {
    writers: topEntries("writers", 100),
    dispatchers: topEntries("dispatchers", 100),
    stateChanges: topEntries("stateChanges", 100),
    sceneWrites: topEntries("sceneWrites", 100),
    panelWrites: topEntries("panelWrites", 100),
    selectionEvents: topEntries("selectionEvents", 100),
    parityEvents: topEntries("parityEvents", 100),
    contractEvents: topEntries("contractEvents", 100),
  };
}

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  (window as unknown as { __NEXORA_LOOP_AUDIT__?: () => void }).__NEXORA_LOOP_AUDIT__ = () =>
    emitLoopAuditSummary(true);
}
