import { devLogThrottled } from "./diagnosticThrottle.ts";

const PAYLOAD_AUDIT_SCOPE = "sceneRenderSource";
const PAYLOAD_FREQUENCY_WINDOW_MS = 10_000;
const PAYLOAD_AUDIT_ENABLED_KEY = "NEXORA_PAYLOAD_AUDIT_ENABLED";
const PAYLOAD_AUDIT_RUN_KEY = "NEXORA_RUN_PAYLOAD_AUDIT";

type PayloadReferenceSnapshot = {
  ref: unknown;
  signature: string;
};

export type PayloadStabilityEntry = {
  payloadName: string;
  referenceChanged: boolean;
  contentChanged: boolean;
  referenceEqual: boolean;
  deepContentEqual: boolean;
  previousSignature: string | null;
  nextSignature: string;
  classification: "initial" | "stable" | "content-changed" | "reference-only changed";
};

type PayloadFrequencyStats = {
  renders: number;
  refChanges: number;
  contentChanges: number;
  referenceOnlyChanges: number;
  downstreamRenders: number;
};

type PayloadFrequencyWindow = {
  windowId: number;
  startedAt: number;
  stats: Record<string, PayloadFrequencyStats>;
  hasPayloadChange: boolean;
  emitted: boolean;
};

type PayloadAuditManualRun = {
  runId: number;
  requestedAt: number;
  expiresAt: number;
  timer: ReturnType<typeof setTimeout> | null;
};

const previousPayloadsByOwner = new Map<string, Record<string, PayloadReferenceSnapshot>>();
const frequencyByOwner = new Map<string, PayloadFrequencyWindow>();
const staticReportKeys = new Set<string>();
const lastPayloadSummarySignatureByKey = new Map<string, string>();
const payloadConsumerByOwner = new Map<string, string>();
const latestSceneJsonEntryByOwner = new Map<string, PayloadStabilityEntry>();
let payloadWindowCounter = 0;
let manualRunCounter = 0;
let manualRun: PayloadAuditManualRun | null = null;
let duplicateSuppressionCount = 0;
let idleSuppressionCount = 0;

function safePrimitive(value: unknown): string {
  if (typeof value === "string") return JSON.stringify(value.length > 160 ? `${value.slice(0, 157)}...` : value);
  if (typeof value === "number" || typeof value === "boolean" || value == null) return JSON.stringify(value);
  if (typeof value === "function") return `[function:${value.name || "anonymous"}]`;
  if (typeof value === "symbol") return `[symbol:${String(value)}]`;
  return String(value);
}

function normalizeForSignature(value: unknown, depth = 0, seen = new WeakSet<object>()): unknown {
  if (value == null || typeof value !== "object") return safePrimitive(value);
  if (seen.has(value)) return "[Circular]";
  seen.add(value);

  if (Array.isArray(value)) {
    if (depth >= 4) return `[Array len=${value.length}]`;
    return {
      $type: "array",
      length: value.length,
      sample: value.slice(0, 24).map((entry) => normalizeForSignature(entry, depth + 1, seen)),
    };
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  if (depth >= 4) {
    return {
      $type: "object",
      keyCount: keys.length,
      id: typeof record.id === "string" ? record.id : undefined,
      signature: typeof record.signature === "string" ? record.signature : undefined,
    };
  }

  const normalized: Record<string, unknown> = {
    $type: "object",
    $keyCount: keys.length,
  };
  for (const key of keys.slice(0, 48)) {
    normalized[key] = normalizeForSignature(record[key], depth + 1, seen);
  }
  if (keys.length > 48) normalized.$truncatedKeys = keys.length - 48;
  return normalized;
}

export function buildPayloadContentSignature(value: unknown): string {
  try {
    return JSON.stringify(normalizeForSignature(value)).slice(0, 16_000);
  } catch (error) {
    return `[unserializable:${error instanceof Error ? error.message : String(error)}]`;
  }
}

export type StablePayloadReference<T> = {
  signature: string;
  value: T;
};

export function stabilizePayloadReference<T>(
  previous: StablePayloadReference<T> | null | undefined,
  nextValue: T,
  nextSignature = buildPayloadContentSignature(nextValue)
): StablePayloadReference<T> {
  if (previous?.signature === nextSignature) {
    return previous;
  }
  return {
    signature: nextSignature,
    value: nextValue,
  };
}

export function buildHudPayloadSignature(value: unknown): string {
  return buildPayloadContentSignature(value);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function normalizePropagationPayloadForSignature(value: unknown, depth = 0, seen = new WeakSet<object>()): unknown {
  const record = asRecord(value);
  if (!record) {
    if (Array.isArray(value)) {
      if (depth >= 4) return `[Array len=${value.length}]`;
      return value.map((entry) => normalizePropagationPayloadForSignature(entry, depth + 1, seen));
    }
    return value ?? null;
  }
  if (seen.has(record)) return "[Circular]";
  seen.add(record);

  const volatileKeys = new Set([
    "created_at",
    "createdAt",
    "updated_at",
    "updatedAt",
    "generated_at",
    "generatedAt",
    "timestamp",
    "ts",
    "trace_id",
    "traceId",
    "request_id",
    "requestId",
    "audit_events",
    "decision_trace",
    "trust_provenance",
  ]);
  const propagationRelevantKeys = new Set([
    "propagation",
    "propagation_overlay",
    "propagationOverlay",
    "decision_simulation",
    "simulation",
    "scenario_action",
    "scenarioAction",
    "strategic_advice",
    "strategic_council",
    "object_selection",
    "highlighted_objects",
    "risk_sources",
    "risk_targets",
    "impacted_nodes",
    "links",
    "source_object_id",
    "sourceObjectId",
  ]);

  const keys = Object.keys(record)
    .filter((key) => !volatileKeys.has(key))
    .filter((key) => depth > 0 || propagationRelevantKeys.has(key))
    .sort();
  const normalized: Record<string, unknown> = {};
  for (const key of keys) {
    normalized[key] = normalizePropagationPayloadForSignature(record[key], depth + 1, seen);
  }
  return normalized;
}

export function buildPropagationPayloadSignature(value: unknown): string {
  return buildPayloadContentSignature(normalizePropagationPayloadForSignature(value));
}

function classifyWaste(stats: PayloadFrequencyStats): "HIGH_WASTE" | "MEDIUM_WASTE" | "LOW_WASTE" {
  if (stats.referenceOnlyChanges >= 10 || stats.downstreamRenders >= 10) return "HIGH_WASTE";
  if (stats.referenceOnlyChanges >= 3 || stats.downstreamRenders >= 3) return "MEDIUM_WASTE";
  return "LOW_WASTE";
}

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function globalRecord(): Record<string, unknown> {
  return globalThis as unknown as Record<string, unknown>;
}

function isManualAuditActive(): boolean {
  return Boolean(manualRun && Date.now() <= manualRun.expiresAt);
}

function isPayloadAuditEnabled(): boolean {
  installPayloadAuditManualHelper();
  if (!isDev()) return false;
  return globalRecord()[PAYLOAD_AUDIT_ENABLED_KEY] === true || isManualAuditActive();
}

function resetPayloadAuditWindows(): void {
  frequencyByOwner.clear();
  payloadWindowCounter += 1;
}

function scheduleManualAuditFlush(run: PayloadAuditManualRun): void {
  run.timer = setTimeout(() => {
    if (manualRun?.runId !== run.runId) return;
    flushAllPayloadAuditWindows({ force: true, reason: "manual" });
    manualRun = null;
  }, PAYLOAD_FREQUENCY_WINDOW_MS + 100);
}

function installPayloadAuditManualHelper(): void {
  if (!isDev()) return;
  const record = globalRecord();
  if (typeof record[PAYLOAD_AUDIT_ENABLED_KEY] !== "boolean") {
    record[PAYLOAD_AUDIT_ENABLED_KEY] = false;
  }
  if (typeof record[PAYLOAD_AUDIT_RUN_KEY] === "function") return;
  record[PAYLOAD_AUDIT_RUN_KEY] = () => {
    if (manualRun?.timer) clearTimeout(manualRun.timer);
    resetPayloadAuditWindows();
    const now = Date.now();
    const run: PayloadAuditManualRun = {
      runId: manualRunCounter + 1,
      requestedAt: now,
      expiresAt: now + PAYLOAD_FREQUENCY_WINDOW_MS,
      timer: null,
    };
    manualRunCounter = run.runId;
    manualRun = run;
    scheduleManualAuditFlush(run);
    return {
      enabled: true,
      mode: "manual",
      runId: run.runId,
      windowMs: PAYLOAD_FREQUENCY_WINDOW_MS,
      killSwitchState: record[PAYLOAD_AUDIT_ENABLED_KEY] === true ? "enabled" : "manual-only",
    };
  };
}

function createPayloadWindow(): PayloadFrequencyWindow {
  payloadWindowCounter += 1;
  return {
    windowId: payloadWindowCounter,
    startedAt: Date.now(),
    stats: {},
    hasPayloadChange: false,
    emitted: false,
  };
}

function updateFrequency(owner: string, entries: PayloadStabilityEntry[], consumerRerender: boolean): PayloadFrequencyWindow {
  const now = Date.now();
  let window = frequencyByOwner.get(owner) ?? createPayloadWindow();
  if (window.emitted && now - window.startedAt >= PAYLOAD_FREQUENCY_WINDOW_MS) {
    window = createPayloadWindow();
  }

  for (const entry of entries) {
    const stats = window.stats[entry.payloadName] ?? {
      renders: 0,
      refChanges: 0,
      contentChanges: 0,
      referenceOnlyChanges: 0,
      downstreamRenders: 0,
    };
    stats.renders += 1;
    if (entry.previousSignature != null && entry.referenceChanged) stats.refChanges += 1;
    if (entry.previousSignature != null && entry.contentChanged) stats.contentChanges += 1;
    if (entry.previousSignature != null && entry.referenceChanged && !entry.contentChanged) {
      stats.referenceOnlyChanges += 1;
      if (consumerRerender) stats.downstreamRenders += 1;
    }
    if (entry.previousSignature != null && (entry.referenceChanged || entry.contentChanged)) {
      window.hasPayloadChange = true;
    }
    window.stats[entry.payloadName] = stats;
  }

  frequencyByOwner.set(owner, window);
  return window;
}

function frequencyPayload(owner: string, window: PayloadFrequencyWindow) {
  const elapsedMs = Date.now() - window.startedAt;
  const payloads = Object.entries(window.stats)
    .map(([payloadName, stats]) => ({
      payloadName,
      ...stats,
      wasteClass: classifyWaste(stats),
    }))
    .sort((a, b) => b.downstreamRenders + b.referenceOnlyChanges - (a.downstreamRenders + a.referenceOnlyChanges));

  return {
    owner,
    windowMs: Math.min(PAYLOAD_FREQUENCY_WINDOW_MS, elapsedMs),
    completeWindow: elapsedMs >= PAYLOAD_FREQUENCY_WINDOW_MS,
    payloads,
  };
}

function wasteEntriesForWindow(window: PayloadFrequencyWindow) {
  return Object.entries(window.stats)
    .filter(([, stats]) => stats.referenceOnlyChanges > 0)
    .map(([payloadName, stats]) => ({
      payloadName,
      referenceOnlyChanges: stats.referenceOnlyChanges,
      estimatedRenderCost: stats.downstreamRenders,
      wasteClass: classifyWaste(stats),
    }))
    .sort((a, b) => b.estimatedRenderCost + b.referenceOnlyChanges - (a.estimatedRenderCost + a.referenceOnlyChanges));
}

function rankingForWindow(window: PayloadFrequencyWindow) {
  return Object.entries(window.stats)
    .map(([payloadName, stats]) => ({
      payloadName,
      score: stats.referenceOnlyChanges * 3 + stats.contentChanges * 2 + stats.downstreamRenders,
      ...stats,
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);
}

function emitPayloadAuditLog(label: string, key: string, payload: unknown): boolean {
  const signature = buildPayloadContentSignature(payload);
  const summaryKey = `${label}:${key}`;
  if (lastPayloadSummarySignatureByKey.get(summaryKey) === signature) {
    duplicateSuppressionCount += 1;
    return false;
  }
  lastPayloadSummarySignatureByKey.set(summaryKey, signature);
  devLogThrottled({
    key,
    label,
    scope: PAYLOAD_AUDIT_SCOPE,
    intervalMs: 0,
    payload,
  });
  return true;
}

function emitPayloadAuditReports(owner: string, window: PayloadFrequencyWindow, reason: "window" | "manual"): void {
  if (owner !== "SceneCanvas") return;
  const consumer = payloadConsumerByOwner.get(owner) ?? owner;
  const frequency = frequencyPayload(owner, window);
  const wasteEntries = wasteEntriesForWindow(window);
  const ranking = rankingForWindow(window);
  const sceneJsonEntry = latestSceneJsonEntryByOwner.get(owner);
  const unstablePayloads = Object.values(window.stats).filter((stats) => stats.referenceOnlyChanges > 0).length;
  const unnecessaryReferenceChanges = Object.values(window.stats).reduce(
    (total, stats) => total + stats.referenceOnlyChanges,
    0
  );
  const sceneCanvasRendersCaused = Object.values(window.stats).reduce(
    (total, stats) => total + stats.downstreamRenders,
    0
  );
  const baseKey = `${owner}:window:${window.windowId}`;

  emitPayloadAuditLog("[NEXORA_PAYLOAD_FREQUENCY_AUDIT]", `${baseKey}:frequency`, frequency);

  if (sceneJsonEntry) {
    emitPayloadAuditLog("[NEXORA_SCENEJSON_STABILITY_REPORT]", `${baseKey}:sceneJson`, {
      owner,
      regeneratedEachRender: sceneJsonEntry.referenceChanged && !sceneJsonEntry.contentChanged ? "reference-churn-suspected" : false,
      clonedEachRender: sceneJsonEntry.referenceChanged && !sceneJsonEntry.contentChanged ? "possible" : false,
      derivedEachRender: "see [NEXORA_PAYLOAD_SOURCE_DISCOVERY]",
      memoized: "see [NEXORA_PAYLOAD_SOURCE_DISCOVERY]",
      referenceChanged: sceneJsonEntry.referenceChanged,
      contentChanged: sceneJsonEntry.contentChanged,
      classification: sceneJsonEntry.classification,
    });
  }

  if (wasteEntries.length > 0) {
    emitPayloadAuditLog("[NEXORA_PAYLOAD_WASTE_REPORT]", `${baseKey}:waste`, {
      owner,
      payloads: wasteEntries,
    });
  }

  if (ranking.length > 0) {
    emitPayloadAuditLog("[NEXORA_PAYLOAD_ROOT_CAUSE_RANKING]", `${baseKey}:ranking`, {
      owner,
      ranking: ranking.map((entry, index) => ({
        rank: index + 1,
        payloadName: entry.payloadName,
        score: entry.score,
        refChanges: entry.refChanges,
        contentChanges: entry.contentChanges,
        referenceOnlyChanges: entry.referenceOnlyChanges,
        downstreamRenders: entry.downstreamRenders,
      })),
    });
  }

  emitPayloadAuditLog("[NEXORA_SCENE_PAYLOAD_STABILITY_SUMMARY]", `${baseKey}:summary`, {
    owner,
    mode: reason,
    windowId: window.windowId,
    killSwitchState: globalRecord()[PAYLOAD_AUDIT_ENABLED_KEY] === true ? "enabled" : "manual-only",
    manualTriggerActive: Boolean(manualRun),
    totalUnstablePayloads: unstablePayloads,
    totalUnnecessaryReferenceChanges: unnecessaryReferenceChanges,
    totalSceneCanvasRerendersCausedByPayloadInstability:
      consumer === "SceneCanvas" ? sceneCanvasRendersCaused : null,
    highestRenderCostPayload: ranking[0]?.payloadName ?? null,
    highestWastePayload: wasteEntries[0]?.payloadName ?? null,
    estimatedRenderReductionIfStabilized: consumer === "SceneCanvas" ? sceneCanvasRendersCaused : "see SceneCanvas owner",
    duplicateSuppressionCount,
    idleSuppressionCount,
  });
}

function maybeFlushPayloadAuditWindow(owner: string, window: PayloadFrequencyWindow): void {
  if (window.emitted) return;
  const elapsedMs = Date.now() - window.startedAt;
  if (elapsedMs < PAYLOAD_FREQUENCY_WINDOW_MS) return;
  if (!window.hasPayloadChange) {
    idleSuppressionCount += 1;
    window.emitted = true;
    return;
  }
  emitPayloadAuditReports(owner, window, "window");
  window.emitted = true;
}

function flushAllPayloadAuditWindows(input: { force: boolean; reason: "manual" | "window" }): void {
  for (const [owner, window] of frequencyByOwner.entries()) {
    if (window.emitted) continue;
    if (!window.hasPayloadChange && !input.force) {
      idleSuppressionCount += 1;
      window.emitted = true;
      continue;
    }
    if (!window.hasPayloadChange && input.force) {
      idleSuppressionCount += 1;
      window.emitted = true;
      continue;
    }
    emitPayloadAuditReports(owner, window, input.reason);
    window.emitted = true;
  }
}

export function logPayloadReferenceStability(input: {
  owner: string;
  renderCount?: number | null;
  consumer?: string;
  payloads: Record<string, unknown>;
  signatureBuilders?: Record<string, (value: unknown) => string>;
}): PayloadStabilityEntry[] {
  if (!isPayloadAuditEnabled()) return [];

  const previous = previousPayloadsByOwner.get(input.owner) ?? {};
  const nextSnapshots: Record<string, PayloadReferenceSnapshot> = {};
  const entries = Object.entries(input.payloads).map(([payloadName, value]) => {
    const nextSignature = input.signatureBuilders?.[payloadName]?.(value) ?? buildPayloadContentSignature(value);
    const previousSnapshot = previous[payloadName] ?? null;
    const referenceChanged = previousSnapshot ? previousSnapshot.ref !== value : true;
    const contentChanged = previousSnapshot ? previousSnapshot.signature !== nextSignature : true;
    nextSnapshots[payloadName] = { ref: value, signature: nextSignature };
    return {
      payloadName,
      referenceChanged,
      contentChanged,
      referenceEqual: previousSnapshot ? previousSnapshot.ref === value : false,
      deepContentEqual: previousSnapshot ? previousSnapshot.signature === nextSignature : false,
      previousSignature: previousSnapshot?.signature ?? null,
      nextSignature,
      classification: !previousSnapshot
        ? "initial"
        : contentChanged
          ? "content-changed"
          : referenceChanged
            ? "reference-only changed"
            : "stable",
    } satisfies PayloadStabilityEntry;
  });

  previousPayloadsByOwner.set(input.owner, nextSnapshots);
  payloadConsumerByOwner.set(input.owner, input.consumer ?? input.owner);
  const frequency = updateFrequency(input.owner, entries, input.consumer === "SceneCanvas" || input.consumer === "SceneRenderer");
  const sceneJsonEntry = entries.find((entry) => entry.payloadName === "sceneJson");
  if (sceneJsonEntry) latestSceneJsonEntryByOwner.set(input.owner, sceneJsonEntry);

  maybeFlushPayloadAuditWindow(input.owner, frequency);

  return entries;
}

export function logSceneCanvasPayloadImpact(input: {
  renderCount?: number | null;
  entries: PayloadStabilityEntry[];
  propAliases?: Record<string, string>;
}): void {
  if (!isPayloadAuditEnabled()) return;
  void input;
}

export function logPayloadSourceDiscoveryOnce(input: {
  sources: Array<{
    payloadName: string;
    file: string;
    hookFunction: string;
    ownerComponent: string;
    creationMethod: string;
    useMemoPresent: boolean;
    dependencyList: string[];
  }>;
}): void {
  if (!isPayloadAuditEnabled()) return;
  const key = "payload-source-discovery";
  if (staticReportKeys.has(key)) return;
  staticReportKeys.add(key);
  devLogThrottled({
    key,
    label: "[NEXORA_PAYLOAD_SOURCE_DISCOVERY]",
    scope: PAYLOAD_AUDIT_SCOPE,
    intervalMs: 0,
    payload: { sources: input.sources },
  });
}

export function logPayloadConsumerGraphOnce(input: {
  graph: Array<{
    payloadName: string;
    consumers: string[];
    renderImpact: string;
  }>;
}): void {
  if (!isPayloadAuditEnabled()) return;
  const key = "payload-consumer-graph";
  if (staticReportKeys.has(key)) return;
  staticReportKeys.add(key);
  devLogThrottled({
    key,
    label: "[NEXORA_PAYLOAD_CONSUMER_GRAPH]",
    scope: PAYLOAD_AUDIT_SCOPE,
    intervalMs: 0,
    payload: { graph: input.graph },
  });
}
