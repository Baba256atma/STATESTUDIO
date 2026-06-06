/**
 * Development-only connection runtime stability audit (module-level counters only).
 * AUDIT-REMOVE: delete after stability investigation completes.
 */

import { installDiagnosticConsoleHelper, isDiagnosticEnabled } from "../runtime/diagnosticSwitch.ts";

const WINDOW_MS = 10_000;
const AUDIT_LOG_MIN_INTERVAL_MS = 30_000;

type TimedStamp = { ts: number };

function isAuditEnabled(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  return isDiagnosticEnabled("runtimeAudit");
}

function pushTimed(events: TimedStamp[]): void {
  const now = Date.now();
  events.push({ ts: now });
  while (events.length > 0 && now - events[0]!.ts > WINDOW_MS) {
    events.shift();
  }
}

function countTimed(events: readonly TimedStamp[]): number {
  const now = Date.now();
  return events.filter((event) => now - event.ts <= WINDOW_MS).length;
}

function readMemoryUsedMB(): number | null {
  const memory = (performance as Performance & { memory?: { usedJSHeapSize?: number } }).memory;
  if (!memory || !Number.isFinite(memory.usedJSHeapSize)) return null;
  return Math.round((memory.usedJSHeapSize! / (1024 * 1024)) * 10) / 10;
}

let renderCount = 0;
let lastRenderSignature: string | undefined;
let lastRecordedRenderSignatureForCount = "";
const renderEvents: TimedStamp[] = [];

let topologyRebuildCount = 0;
const topologyRebuildEvents: TimedStamp[] = [];

let connectionLineRebuildCount = 0;
const connectionLineRebuildEvents: TimedStamp[] = [];

let geometryCreatedCount = 0;
let geometryDisposedCount = 0;
let materialCreatedCount = 0;
let materialDisposedCount = 0;

let objectSelectionCount = 0;
const objectSelectionEvents: TimedStamp[] = [];
let firstSelectionMemoryBaselineMb: number | null = null;

let rightPanelWriteCount = 0;
const rightPanelWriteEvents: TimedStamp[] = [];

let hudDriftCount = 0;
const hudDriftEvents: TimedStamp[] = [];

let listenerAddedCount = 0;
let listenerRemovedCount = 0;

export function recordSceneCanvasRender(signature?: string): void {
  if (!isAuditEnabled()) return;
  const sig = signature ?? "";
  if (sig && sig === lastRecordedRenderSignatureForCount) {
    return;
  }
  if (sig) {
    lastRecordedRenderSignatureForCount = sig;
  }
  renderCount += 1;
  pushTimed(renderEvents);
  if (signature) lastRenderSignature = signature;
}

export function recordTopologyRebuild(reason: string): void {
  if (!isAuditEnabled()) return;
  void reason;
  topologyRebuildCount += 1;
  pushTimed(topologyRebuildEvents);
}

export function recordConnectionLineRebuild(reason: string): void {
  if (!isAuditEnabled()) return;
  void reason;
  connectionLineRebuildCount += 1;
  pushTimed(connectionLineRebuildEvents);
}

export function recordGeometryCreated(type: string, id?: string): void {
  if (!isAuditEnabled()) return;
  void type;
  void id;
  geometryCreatedCount += 1;
}

export function recordGeometryDisposed(type: string, id?: string): void {
  if (!isAuditEnabled()) return;
  void type;
  void id;
  geometryDisposedCount += 1;
}

export function recordMaterialCreated(type: string, id?: string): void {
  if (!isAuditEnabled()) return;
  void type;
  void id;
  materialCreatedCount += 1;
}

export function recordMaterialDisposed(type: string, id?: string): void {
  if (!isAuditEnabled()) return;
  void type;
  void id;
  materialDisposedCount += 1;
}

export function recordObjectSelection(objectId: string): void {
  if (!isAuditEnabled()) return;
  void objectId;
  objectSelectionCount += 1;
  pushTimed(objectSelectionEvents);
  const memoryUsedMb = readMemoryUsedMB();
  if (firstSelectionMemoryBaselineMb === null && memoryUsedMb !== null) {
    firstSelectionMemoryBaselineMb = memoryUsedMb;
  }
}

export function recordRightPanelWrite(source: string): void {
  if (!isAuditEnabled()) return;
  void source;
  rightPanelWriteCount += 1;
  pushTimed(rightPanelWriteEvents);
}

export function recordHudDrift(reason: string): void {
  if (!isAuditEnabled()) return;
  void reason;
  hudDriftCount += 1;
  pushTimed(hudDriftEvents);
}

export function recordListenerAdded(type: string, source: string): void {
  if (!isAuditEnabled()) return;
  void type;
  void source;
  listenerAddedCount += 1;
}

export function recordListenerRemoved(type: string, source: string): void {
  if (!isAuditEnabled()) return;
  void type;
  void source;
  listenerRemovedCount += 1;
}

export type ConnectionRuntimeStabilitySummary = {
  reason: string;
  renderCount: number;
  renderCountLast10s: number;
  topologyRebuildCount: number;
  topologyRebuildCountLast10s: number;
  connectionLineRebuildCount: number;
  connectionLineRebuildCountLast10s: number;
  geometryCreatedCount: number;
  geometryDisposedCount: number;
  geometryLiveEstimate: number;
  materialCreatedCount: number;
  materialDisposedCount: number;
  materialLiveEstimate: number;
  objectSelectionCount: number;
  rightPanelWriteCount: number;
  rightPanelWriteCountLast10s: number;
  hudDriftCount: number;
  hudDriftCountLast10s: number;
  listenerAddedCount: number;
  listenerRemovedCount: number;
  listenerLiveEstimate: number;
  memoryUsedMB: number | null;
  memoryDeltaSinceFirstSelectionMB: number | null;
  lastRenderSignature?: string;
  possibleRenderLoop: boolean;
  possibleTopologyStorm: boolean;
  possibleConnectionStorm: boolean;
  possibleGeometryLeak: boolean;
  possibleMaterialLeak: boolean;
  possiblePanelWriteStorm: boolean;
  possibleHudDriftStorm: boolean;
  possibleListenerLeak: boolean;
};

export function buildConnectionRuntimeStabilitySummary(reason: string): ConnectionRuntimeStabilitySummary {
  const renderCountLast10s = countTimed(renderEvents);
  const topologyRebuildCountLast10s = countTimed(topologyRebuildEvents);
  const connectionLineRebuildCountLast10s = countTimed(connectionLineRebuildEvents);
  const rightPanelWriteCountLast10s = countTimed(rightPanelWriteEvents);
  const hudDriftCountLast10s = countTimed(hudDriftEvents);
  const geometryLiveEstimate = Math.max(0, geometryCreatedCount - geometryDisposedCount);
  const materialLiveEstimate = Math.max(0, materialCreatedCount - materialDisposedCount);
  const listenerLiveEstimate = Math.max(0, listenerAddedCount - listenerRemovedCount);
  const memoryUsedMB = readMemoryUsedMB();
  const memoryDeltaSinceFirstSelectionMB =
    memoryUsedMB !== null && firstSelectionMemoryBaselineMb !== null
      ? Math.round((memoryUsedMB - firstSelectionMemoryBaselineMb) * 10) / 10
      : null;

  return {
    reason,
    renderCount,
    renderCountLast10s,
    topologyRebuildCount,
    topologyRebuildCountLast10s,
    connectionLineRebuildCount,
    connectionLineRebuildCountLast10s,
    geometryCreatedCount,
    geometryDisposedCount,
    geometryLiveEstimate,
    materialCreatedCount,
    materialDisposedCount,
    materialLiveEstimate,
    objectSelectionCount,
    rightPanelWriteCount,
    rightPanelWriteCountLast10s,
    hudDriftCount,
    hudDriftCountLast10s,
    listenerAddedCount,
    listenerRemovedCount,
    listenerLiveEstimate,
    memoryUsedMB,
    memoryDeltaSinceFirstSelectionMB,
    lastRenderSignature,
    possibleRenderLoop: renderCountLast10s > 60,
    possibleTopologyStorm: topologyRebuildCountLast10s > 10,
    possibleConnectionStorm: connectionLineRebuildCountLast10s > 20,
    possibleGeometryLeak: geometryLiveEstimate > 200,
    possibleMaterialLeak: materialLiveEstimate > 200,
    possiblePanelWriteStorm: rightPanelWriteCountLast10s > 10,
    possibleHudDriftStorm: hudDriftCountLast10s > 10,
    possibleListenerLeak: listenerLiveEstimate > 20,
  };
}

let lastSummarySignature = "";
let lastAuditEmitAt = 0;

function buildAuditLogSignature(summary: ConnectionRuntimeStabilitySummary): string {
  return JSON.stringify({
    renderCountLast10s: summary.renderCountLast10s,
    topologyRebuildCountLast10s: summary.topologyRebuildCountLast10s,
    connectionLineRebuildCountLast10s: summary.connectionLineRebuildCountLast10s,
    rightPanelWriteCountLast10s: summary.rightPanelWriteCountLast10s,
    hudDriftCountLast10s: summary.hudDriftCountLast10s,
    geometryLiveEstimate: summary.geometryLiveEstimate,
    materialLiveEstimate: summary.materialLiveEstimate,
    objectSelectionCount: summary.objectSelectionCount,
    rightPanelWriteCount: summary.rightPanelWriteCount,
    listenerLiveEstimate: summary.listenerLiveEstimate,
    lastRenderSignature: summary.lastRenderSignature,
    possibleRenderLoop: summary.possibleRenderLoop,
    possibleTopologyStorm: summary.possibleTopologyStorm,
    possibleConnectionStorm: summary.possibleConnectionStorm,
    possibleGeometryLeak: summary.possibleGeometryLeak,
    possibleMaterialLeak: summary.possibleMaterialLeak,
    possiblePanelWriteStorm: summary.possiblePanelWriteStorm,
    possibleHudDriftStorm: summary.possibleHudDriftStorm,
    possibleListenerLeak: summary.possibleListenerLeak,
  });
}

export function emitConnectionRuntimeStabilitySummary(reason: string): ConnectionRuntimeStabilitySummary | null {
  if (!isAuditEnabled()) return null;
  installDiagnosticConsoleHelper();
  const summary = buildConnectionRuntimeStabilitySummary(reason);
  const signature = buildAuditLogSignature(summary);
  const now = Date.now();

  if (signature === lastSummarySignature) {
    return summary;
  }
  if (now - lastAuditEmitAt < AUDIT_LOG_MIN_INTERVAL_MS) {
    return summary;
  }

  lastSummarySignature = signature;
  lastAuditEmitAt = now;
  globalThis.console?.warn?.("[NEXORA_RUNTIME_STABILITY_AUDIT]", summary);
  return summary;
}

let scheduledAuditTimer: ReturnType<typeof setTimeout> | null = null;
let scheduledAuditReason: string | null = null;
let auditScheduleGeneration = 0;

export function cancelScheduledConnectionRuntimeStabilitySummary(): void {
  if (scheduledAuditTimer != null) {
    globalThis.clearTimeout?.(scheduledAuditTimer);
    scheduledAuditTimer = null;
  }
  scheduledAuditReason = null;
}

export function scheduleConnectionRuntimeStabilitySummary(reason: string, delayMs = 1000): void {
  if (!isAuditEnabled()) return;
  if (scheduledAuditTimer != null) {
    globalThis.clearTimeout?.(scheduledAuditTimer);
    scheduledAuditTimer = null;
  }
  scheduledAuditReason = reason;
  const generation = ++auditScheduleGeneration;
  scheduledAuditTimer = globalThis.setTimeout?.(() => {
    scheduledAuditTimer = null;
    if (generation !== auditScheduleGeneration) return;
    emitConnectionRuntimeStabilitySummary(scheduledAuditReason ?? reason);
    scheduledAuditReason = null;
  }, delayMs) as ReturnType<typeof setTimeout> | null;
}

export function resetConnectionRuntimeStabilityAuditForTests(): void {
  cancelScheduledConnectionRuntimeStabilitySummary();
  auditScheduleGeneration = 0;
  renderCount = 0;
  lastRenderSignature = undefined;
  lastRecordedRenderSignatureForCount = "";
  renderEvents.length = 0;
  topologyRebuildCount = 0;
  topologyRebuildEvents.length = 0;
  connectionLineRebuildCount = 0;
  connectionLineRebuildEvents.length = 0;
  geometryCreatedCount = 0;
  geometryDisposedCount = 0;
  materialCreatedCount = 0;
  materialDisposedCount = 0;
  objectSelectionCount = 0;
  objectSelectionEvents.length = 0;
  firstSelectionMemoryBaselineMb = null;
  rightPanelWriteCount = 0;
  rightPanelWriteEvents.length = 0;
  hudDriftCount = 0;
  hudDriftEvents.length = 0;
  listenerAddedCount = 0;
  listenerRemovedCount = 0;
  lastSummarySignature = "";
  lastAuditEmitAt = 0;
}
