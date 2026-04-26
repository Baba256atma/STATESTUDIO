/**
 * Dev-only Decision Assistant telemetry: compact, deduped, no UI / async / routing.
 */

import type { DecisionAssistantOutput } from "./decisionTypes.ts";

export type DecisionAssistantPanelMergeTrace = {
  slice: "advice" | "compare" | "timeline" | "warRoom";
  changed: boolean;
  filledFields: string[];
};

export type DecisionAssistantTelemetryInput = {
  output: DecisionAssistantOutput;
  panelMergeTrace?: DecisionAssistantPanelMergeTrace[];
  sceneApplied?: boolean;
  sceneSkippedReason?: string | null;
};

const MAX_FIELDS_PER_SLICE = 12;

function isEmptyValue(v: unknown): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === "string" && v.trim().length === 0) return true;
  if (Array.isArray(v) && v.length === 0) return true;
  return false;
}

function isMeaningfulValue(v: unknown): boolean {
  return !isEmptyValue(v);
}

/** Top-level panel object for merge diff; non-objects become empty records. */
export function asTopLevelRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

/**
 * Fields that were empty in `before` and gained meaningful values in `after` (top-level keys of `after` only).
 */
export function diffFilledFields(before: Record<string, unknown>, after: Record<string, unknown>): string[] {
  const filled: string[] = [];
  for (const key of Object.keys(after)) {
    if (filled.length >= MAX_FIELDS_PER_SLICE) break;
    if (isEmptyValue(before[key]) && isMeaningfulValue(after[key])) {
      filled.push(key);
    }
  }
  return filled;
}

export function buildPanelMergeTraceFromEnrichment(params: {
  mappedAdvice: unknown;
  mappedCompare: unknown;
  mappedTimeline: unknown;
  mappedWarRoom: unknown;
  mergedAdvice: unknown;
  mergedCompare: unknown;
  mergedTimeline: unknown;
  mergedWarRoom: unknown;
}): DecisionAssistantPanelMergeTrace[] {
  const slices: Array<{
    slice: DecisionAssistantPanelMergeTrace["slice"];
    before: unknown;
    after: unknown;
  }> = [
    { slice: "advice", before: params.mappedAdvice, after: params.mergedAdvice },
    { slice: "compare", before: params.mappedCompare, after: params.mergedCompare },
    { slice: "timeline", before: params.mappedTimeline, after: params.mergedTimeline },
    { slice: "warRoom", before: params.mappedWarRoom, after: params.mergedWarRoom },
  ];
  return slices.map(({ slice, before, after }) => {
    const filledFields = diffFilledFields(asTopLevelRecord(before), asTopLevelRecord(after));
    return { slice, changed: filledFields.length > 0, filledFields };
  });
}

/** Compact stable signature for dedupe (no full panel payloads). */
export function buildDecisionAssistantTelemetrySignature(input: DecisionAssistantTelemetryInput): string {
  const o = input.output;
  const topId = o.scenarios[0]?.id ?? "";
  const recId = o.recommendation.recommendedScenarioId;
  const conf = Number.isFinite(o.recommendation.confidence)
    ? Math.round(o.recommendation.confidence * 100) / 100
    : 0;
  const merge = (input.panelMergeTrace ?? [])
    .map((t) => `${t.slice}:${t.changed ? 1 : 0}:${[...t.filledFields].sort().join(",")}`)
    .join("|");
  const sceneA = input.sceneApplied === true ? 1 : 0;
  const sceneSkip = input.sceneSkippedReason ?? "";
  return [
    o.context.domainId,
    o.context.riskLevel,
    topId,
    recId,
    o.recommendation.posture,
    String(conf),
    merge,
    sceneA,
    sceneSkip,
  ].join("::");
}

export function summarizeDecisionAssistantTelemetry(input: DecisionAssistantTelemetryInput): Record<string, unknown> {
  const o = input.output;
  const traces = input.panelMergeTrace ?? [];
  const filledBySlice: Record<string, string[]> = {};
  for (const t of traces) {
    filledBySlice[t.slice] = t.filledFields;
  }
  return {
    domainId: o.context.domainId,
    riskLevel: o.context.riskLevel,
    topScenarioId: o.scenarios[0]?.id ?? null,
    posture: o.recommendation.posture,
    confidence: Number.isFinite(o.recommendation.confidence)
      ? Math.round(o.recommendation.confidence * 100) / 100
      : o.recommendation.confidence,
    panelSlicesChanged: traces.filter((t) => t.changed).map((t) => t.slice),
    filledFieldsBySlice: filledBySlice,
    sceneApplied: input.sceneApplied === true,
    sceneSkippedReason: input.sceneApplied === true ? null : (input.sceneSkippedReason ?? null),
    highlightCount: o.sceneAction.highlightObjectIds.length,
    focusObjectId: o.sceneAction.focusObjectId ?? null,
  };
}

export function logDecisionAssistantTelemetryOnce(
  input: DecisionAssistantTelemetryInput,
  lastSignatureRef: { current: string | null }
): void {
  if (process.env.NODE_ENV === "production") return;

  const contributed =
    (input.panelMergeTrace?.some((t) => t.changed) ?? false) || input.sceneApplied === true;
  if (!contributed) return;

  const sig = buildDecisionAssistantTelemetrySignature(input);
  if (lastSignatureRef.current === sig) return;
  lastSignatureRef.current = sig;

  const summary = summarizeDecisionAssistantTelemetry(input);
  globalThis.console?.log?.("[Nexora][DecisionAssistant]", summary);
}
