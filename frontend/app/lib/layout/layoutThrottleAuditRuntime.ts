import { devLogThrottled } from "../runtime/diagnosticThrottle.ts";

type LayoutThrottleCounters = {
  sceneCanvasRendersPreventedByLayoutCache: number;
  safeZoneRecalculationsPrevented: number;
  dockInsetUpdatesPrevented: number;
  timelineLayoutRecalculationsPrevented: number;
  resizeInvalidationsPrevented: number;
};

const counters: LayoutThrottleCounters = {
  sceneCanvasRendersPreventedByLayoutCache: 0,
  safeZoneRecalculationsPrevented: 0,
  dockInsetUpdatesPrevented: 0,
  timelineLayoutRecalculationsPrevented: 0,
  resizeInvalidationsPrevented: 0,
};

const lastSignatures = new Map<string, string>();

function exposeCounters(): void {
  if (typeof globalThis === "undefined") return;
  const record = globalThis as unknown as Record<string, unknown>;
  record.__NEXORA_LAYOUT_THROTTLE_COUNTERS__ = counters;
}

export function stableLayoutSignature(value: unknown): string {
  if (value == null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((entry) => stableLayoutSignature(entry)).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableLayoutSignature(record[key])}`)
    .join(",")}}`;
}

export function dockInsetsSignature(
  insets: { leftDockInsetRatio?: number; rightDockInsetRatio?: number } | null | undefined
): string {
  const left = Number(insets?.leftDockInsetRatio ?? 0);
  const right = Number(insets?.rightDockInsetRatio ?? 0);
  return `${left.toFixed(4)}:${right.toFixed(4)}`;
}

export function recordLayoutThrottleAudit(input: {
  area: "safeZone" | "dockInsets" | "timelineLayout" | "sceneCanvas" | "resize";
  source: string;
  previousSignature?: string | null;
  nextSignature: string;
  prevented: boolean;
  detail?: Record<string, unknown>;
}): void {
  if (input.prevented) {
    if (input.area === "safeZone") counters.safeZoneRecalculationsPrevented += 1;
    if (input.area === "dockInsets") counters.dockInsetUpdatesPrevented += 1;
    if (input.area === "timelineLayout") counters.timelineLayoutRecalculationsPrevented += 1;
    if (input.area === "sceneCanvas") counters.sceneCanvasRendersPreventedByLayoutCache += 1;
    if (input.area === "resize") counters.resizeInvalidationsPrevented += 1;
  }
  exposeCounters();
  if (input.prevented) return;
  devLogThrottled({
    key: `${input.area}:${input.source}:${input.nextSignature}:${input.prevented ? "prevented" : "changed"}`,
    label: "[NEXORA_LAYOUT_THROTTLE_AUDIT]",
    scope: "sceneRenderSource",
    intervalMs: input.prevented ? 30000 : 10000,
    payload: {
      area: input.area,
      source: input.source,
      previousSignature: input.previousSignature ?? null,
      nextSignature: input.nextSignature,
      prevented: input.prevented,
      ...(input.detail ?? {}),
    },
  });
}

export function shouldPreventIdenticalLayoutWork(input: {
  key: string;
  signature: string;
  area: "safeZone" | "dockInsets" | "timelineLayout" | "sceneCanvas" | "resize";
  source: string;
  detail?: Record<string, unknown>;
}): boolean {
  const previousSignature = lastSignatures.get(input.key) ?? null;
  const prevented = previousSignature === input.signature;
  lastSignatures.set(input.key, input.signature);
  recordLayoutThrottleAudit({
    area: input.area,
    source: input.source,
    previousSignature,
    nextSignature: input.signature,
    prevented,
    detail: input.detail,
  });
  return prevented;
}

export function getLayoutThrottleCounters(): Readonly<LayoutThrottleCounters> {
  exposeCounters();
  return counters;
}

export function resetLayoutThrottleAuditForTests(): void {
  counters.sceneCanvasRendersPreventedByLayoutCache = 0;
  counters.safeZoneRecalculationsPrevented = 0;
  counters.dockInsetUpdatesPrevented = 0;
  counters.timelineLayoutRecalculationsPrevented = 0;
  counters.resizeInvalidationsPrevented = 0;
  lastSignatures.clear();
  exposeCounters();
}

exposeCounters();
