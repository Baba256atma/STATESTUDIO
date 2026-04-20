/**
 * Phase B.3 — compact visible status for ingestion → scanner → scene (no extra backend logic).
 */

import type { FragilityScanResponse } from "../types/fragilityScanner";

export type NexoraPipelineStatusUi = {
  status: "idle" | "processing" | "ready" | "error";
  source: "ingestion" | "chat" | "scanner" | null;
  signalsCount: number;
  mappedObjectsCount: number;
  fragilityLevel: "low" | "medium" | "high" | "critical" | null;
  summary: string | null;
  /** Phase B.5 — single short system insight (≤60 chars), e.g. truncated scanner summary. */
  insightLine: string | null;
  /** Phase B.7 — compact decision layer (rule-based, no LLM). */
  decisionPosture: string | null;
  decisionTradeoff: string | null;
  decisionNextMove: string | null;
  decisionTone: "cautious" | "steady" | "urgent" | null;
  updatedAt: number | null;
  errorMessage: string | null;
  /** Dev-only: last bridge / ingestion source label */
  lastBridgeSource: string | null;
  /** B.10.e.5 — last multi-source merge stats (HUD peek; cleared on single-source runs). */
  multiSourceSourceCount: number | null;
  multiSourceSuccessfulCount: number | null;
  multiSourceMergedSignalCount: number | null;
  /** B.12 — deterministic trust / validation (no second status system). */
  confidenceScore: number | null;
  confidenceTier: "low" | "medium" | "high" | null;
  validationWarnings: string[];
  trustSummaryLine: string | null;
  /** B.16 — non-null when HUD trust/decision lines were merged from a replay restore (cleared on fresh pipeline commits). */
  replayRestoredRunId: string | null;
};

export function createInitialPipelineStatusUi(): NexoraPipelineStatusUi {
  return {
    status: "idle",
    source: null,
    signalsCount: 0,
    mappedObjectsCount: 0,
    fragilityLevel: null,
    summary: null,
    insightLine: null,
    decisionPosture: null,
    decisionTradeoff: null,
    decisionNextMove: null,
    decisionTone: null,
    updatedAt: null,
    errorMessage: null,
    lastBridgeSource: null,
    multiSourceSourceCount: null,
    multiSourceSuccessfulCount: null,
    multiSourceMergedSignalCount: null,
    confidenceScore: null,
    confidenceTier: null,
    validationWarnings: [],
    trustSummaryLine: null,
    replayRestoredRunId: null,
  };
}

export function buildPipelineStatusSignature(s: NexoraPipelineStatusUi): string {
  return JSON.stringify({
    st: s.status,
    src: s.source,
    sig: s.signalsCount,
    map: s.mappedObjectsCount,
    fr: s.fragilityLevel,
    sum: s.summary ? s.summary.slice(0, 120) : null,
    insight: s.insightLine ? s.insightLine.slice(0, 80) : null,
    dPost: s.decisionPosture ? s.decisionPosture.slice(0, 48) : null,
    dTrade: s.decisionTradeoff ? s.decisionTradeoff.slice(0, 72) : null,
    dNext: s.decisionNextMove ? s.decisionNextMove.slice(0, 72) : null,
    dTone: s.decisionTone,
    err: s.errorMessage,
    bridge: s.lastBridgeSource,
    at: s.updatedAt,
    msSrc: s.multiSourceSourceCount,
    msOk: s.multiSourceSuccessfulCount,
    msMerged: s.multiSourceMergedSignalCount,
    conf: s.confidenceTier,
    confN: s.confidenceScore,
    tw: s.validationWarnings.join("|"),
    tsl: s.trustSummaryLine ? s.trustSummaryLine.slice(0, 120) : null,
    rr: s.replayRestoredRunId,
  });
}

/**
 * B.3 dedupe for React state: skip setState when the snapshot matches the last committed signature.
 * First commit (`lastCommittedSignature === null`) always applies.
 */
export function shouldSkipPipelineStatusCommit(
  next: NexoraPipelineStatusUi,
  lastCommittedSignature: string | null
): boolean {
  if (lastCommittedSignature === null) return false;
  return buildPipelineStatusSignature(next) === lastCommittedSignature;
}

export function normalizeFragilityLevelForUi(raw: string | null | undefined): NexoraPipelineStatusUi["fragilityLevel"] {
  const L = String(raw ?? "").trim().toLowerCase();
  if (!L) return null;
  if (L === "critical") return "critical";
  if (L === "high") return "high";
  if (L === "medium" || L === "moderate") return "medium";
  if (L === "low") return "low";
  return null;
}

/** Distinct scene / mapping targets from scanner output (no duplicate object ids). */
export function countMappedObjectsFromFragilityScan(result: FragilityScanResponse): number {
  const ids = new Set<string>();
  const add = (v: unknown) => {
    const id = String(v ?? "").trim();
    if (id) ids.add(id);
  };
  const p = result.scene_payload;
  if (p) {
    (p.primary_object_ids ?? []).forEach(add);
    (p.affected_object_ids ?? []).forEach(add);
    (p.highlighted_object_ids ?? []).forEach(add);
    (p.objects ?? []).forEach((o) => add(o?.id));
  }
  (result.suggested_objects ?? []).forEach(add);
  return ids.size;
}
