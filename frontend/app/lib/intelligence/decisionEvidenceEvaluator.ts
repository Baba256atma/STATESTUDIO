/**
 * This evaluator establishes deterministic evidence quality analysis for Nexora Intelligence.
 *
 * Future D4 systems may use this for:
 * - recommendation ranking
 * - scenario confidence
 * - strategic reasoning
 * - executive trust indicators
 * - adaptive intelligence
 *
 * Boundaries: pure functions only; no `Date.now`; no scene/UI/routing; callers supply reference time.
 */

import { clamp01 } from "./shared/normalization.ts";
import type { DecisionEvidence, DecisionSignal } from "./decisionIntelligenceContracts.ts";
import type { DecisionSourceRef } from "./decisionTypes.ts";

export type DecisionEvidenceSummaryLabel = "insufficient" | "weak" | "partial" | "reliable" | "strong";

export type DecisionEvidenceEvaluationResult = Readonly<{
  readonly overallQuality: number;
  readonly reliability: number;
  readonly freshness: number;
  readonly consistency: number;
  readonly coverage: number;
  readonly conflictScore: number;
  readonly weakEvidence: boolean;
  readonly conflictingEvidence: boolean;
  readonly sparseEvidence: boolean;
  readonly summaryLabel: DecisionEvidenceSummaryLabel;
  readonly warnings: readonly string[];
  readonly evidenceCount: number;
}>;

export type DecisionEvidenceEvaluationInput = Readonly<{
  readonly evidence: readonly DecisionEvidence[];
  readonly signals?: readonly DecisionSignal[] | null;
  /** Epoch ms — caller-provided reference instant for freshness (never read from system clock here). */
  readonly referenceTimeMs: number;
  /** Max age in ms beyond which freshness decays to ~0 (default 14d). */
  readonly maxEvidenceAgeMs?: number;
  /** Target distinct evidence items for “full” coverage (default 3). */
  readonly coverageTargetCount?: number;
}>;

const EVIDENCE_LOG_PREFIX = "[Nexora][DecisionEvidence]";
const MAX_LOG_KEYS = 40;
const recentLogKeys: string[] = [];

function rememberLogKey(key: string): boolean {
  const i = recentLogKeys.indexOf(key);
  if (i >= 0) return false;
  recentLogKeys.push(key);
  if (recentLogKeys.length > MAX_LOG_KEYS) recentLogKeys.shift();
  return true;
}

/** Dev-only optional trace; must be invoked explicitly — deduped, silent in production. */
export function trackDecisionEvidenceEvaluation(result: DecisionEvidenceEvaluationResult): void {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production") return;
  const key = `${result.summaryLabel}|${result.overallQuality.toFixed(3)}|${result.evidenceCount}`;
  if (!rememberLogKey(key)) return;
  if (typeof globalThis !== "undefined" && globalThis.console?.debug) {
    globalThis.console.debug(EVIDENCE_LOG_PREFIX, {
      summaryLabel: result.summaryLabel,
      overallQuality: result.overallQuality,
      dimensions: {
        reliability: result.reliability,
        freshness: result.freshness,
        consistency: result.consistency,
        coverage: result.coverage,
        conflictScore: result.conflictScore,
      },
      flags: {
        weakEvidence: result.weakEvidence,
        conflictingEvidence: result.conflictingEvidence,
        sparseEvidence: result.sparseEvidence,
      },
    });
  }
}

function n01(value: unknown): number {
  return clamp01(value);
}

function parseIsoMs(iso: string | undefined | null): number | null {
  if (iso == null || String(iso).trim() === "") return null;
  const ms = Date.parse(String(iso));
  return Number.isFinite(ms) ? ms : null;
}

function inferredSourceTrust01(ref: DecisionSourceRef, explicit?: number): number {
  if (explicit != null && Number.isFinite(explicit)) return n01(explicit);
  switch (ref.kind) {
    case "scenario":
      return 0.72;
    case "manual":
      return 0.64;
    case "memory":
      return 0.58;
    case "ingestion":
      return 0.55;
    case "panel":
      return 0.5;
    case "adapter":
      return 0.52;
    case "system":
    default:
      return 0.46;
  }
}

function dedupeEvidence(evidence: readonly DecisionEvidence[]): readonly DecisionEvidence[] {
  const seen = new Set<string>();
  const out: DecisionEvidence[] = [];
  for (const e of evidence) {
    const id = String(e.id ?? "").trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(e);
  }
  return out;
}

function mean(values: readonly number[]): number {
  if (values.length === 0) return 0;
  let s = 0;
  for (const v of values) s += n01(v);
  return n01(s / values.length);
}

function stdDev01(values: readonly number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  let acc = 0;
  for (const v of values) {
    const d = n01(v) - m;
    acc += d * d;
  }
  return n01(Math.sqrt(acc / values.length));
}

function signalsById(signals: readonly DecisionSignal[] | null | undefined): ReadonlyMap<string, readonly DecisionSignal[]> {
  const m = new Map<string, DecisionSignal[]>();
  if (signals == null) return m;
  for (const s of signals) {
    const id = String(s.id ?? "").trim();
    if (!id) continue;
    const arr = m.get(id) ?? [];
    arr.push(s);
    m.set(id, arr);
  }
  return m;
}

function numericSignalValue(value: DecisionSignal["value"]): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "string") {
    const t = value.trim();
    if (t === "") return null;
    const n = Number(t);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** Trust × strength × linked-signal stability (confidence weights when present). */
export function calculateEvidenceReliability(
  evidence: readonly DecisionEvidence[],
  signals: readonly DecisionSignal[] | null | undefined
): number {
  const rows = dedupeEvidence(evidence);
  if (rows.length === 0) return 0;
  const sigMap = signalsById(signals);
  const trustStrength: number[] = [];
  for (const e of rows) {
    const trust = inferredSourceTrust01(e.sourceRef, e.sourceTrust01);
    const str = n01(e.strength01);
    let linkStability = 0.55;
    const linked = e.linkedSignalIds;
    if (linked.length > 0) {
      const weights: number[] = [];
      for (const lid of linked) {
        const list = sigMap.get(String(lid).trim());
        if (list == null || list.length === 0) continue;
        for (const s of list) {
          weights.push(n01(s.confidenceWeight01 ?? 0.55));
        }
      }
      if (weights.length > 0) linkStability = mean(weights);
    }
    trustStrength.push(n01(trust * 0.55 + str * 0.3 + linkStability * 0.15));
  }
  return n01(mean(trustStrength));
}

export function calculateEvidenceFreshness(
  evidence: readonly DecisionEvidence[],
  referenceTimeMs: number,
  maxAgeMs: number = 1000 * 60 * 60 * 24 * 14
): number {
  const rows = dedupeEvidence(evidence);
  if (rows.length === 0) return 0;
  const ref = Number.isFinite(referenceTimeMs) ? referenceTimeMs : 0;
  const maxAge = Math.max(1, Math.floor(maxAgeMs));
  const scores: number[] = [];
  let unknown = 0;
  for (const e of rows) {
    const ms = parseIsoMs(e.recordedAt);
    if (ms == null) {
      unknown += 1;
      scores.push(0.42);
      continue;
    }
    const age = Math.max(0, ref - ms);
    const f = n01(1 - Math.min(1, age / maxAge));
    scores.push(f);
  }
  const base = mean(scores);
  const unknownPenalty = unknown > 0 ? n01(1 - (unknown / rows.length) * 0.12) : 1;
  return n01(base * unknownPenalty);
}

export function calculateEvidenceConsistency(
  evidence: readonly DecisionEvidence[],
  signals: readonly DecisionSignal[] | null | undefined
): number {
  const rows = dedupeEvidence(evidence);
  if (rows.length === 0) return 0;
  const strengths = rows.map((e) => n01(e.strength01));
  const spread = stdDev01(strengths);
  let c = n01(1 - spread * 1.15);

  const sigMap = signalsById(signals);
  const valueBySignal = new Map<string, number[]>();
  for (const e of rows) {
    for (const lid of e.linkedSignalIds) {
      const list = sigMap.get(String(lid).trim());
      if (list == null) continue;
      for (const s of list) {
        const nv = numericSignalValue(s.value);
        if (nv == null) continue;
        const k = String(lid).trim();
        const arr = valueBySignal.get(k) ?? [];
        arr.push(n01(nv));
        valueBySignal.set(k, arr);
      }
    }
  }
  let conflictPairs = 0;
  for (const [, vals] of valueBySignal) {
    if (vals.length < 2) continue;
    const spreadV = stdDev01(vals);
    if (spreadV > 0.18) conflictPairs += 1;
  }
  c = n01(c * (1 - Math.min(0.45, conflictPairs * 0.12)));
  return c;
}

export function calculateEvidenceCoverage(
  evidence: readonly DecisionEvidence[],
  coverageTargetCount: number = 3
): number {
  const rows = dedupeEvidence(evidence);
  const target = Math.max(1, Math.floor(coverageTargetCount));
  const countScore = n01(rows.length / target);
  const kinds = new Set<string>();
  for (const e of rows) {
    kinds.add(e.sourceRef.kind);
  }
  const breadth = n01(kinds.size / 5);
  return n01(countScore * 0.72 + breadth * 0.28);
}

export function calculateEvidenceConflictScore(
  evidence: readonly DecisionEvidence[],
  signals: readonly DecisionSignal[] | null | undefined
): number {
  const rows = dedupeEvidence(evidence);
  if (rows.length === 0) return 0;
  const strengths = rows.map((e) => n01(e.strength01));
  const spread = stdDev01(strengths);
  let conflict = n01(spread * 0.85);

  const sigMap = signalsById(signals);
  const valueBySignal = new Map<string, number[]>();
  for (const e of rows) {
    for (const lid of e.linkedSignalIds) {
      const list = sigMap.get(String(lid).trim());
      if (list == null) continue;
      for (const s of list) {
        const nv = numericSignalValue(s.value);
        if (nv == null) continue;
        const k = String(lid).trim();
        const arr = valueBySignal.get(k) ?? [];
        arr.push(n01(nv));
        valueBySignal.set(k, arr);
      }
    }
  }
  for (const [, vals] of valueBySignal) {
    if (vals.length < 2) continue;
    conflict = Math.max(conflict, stdDev01(vals));
  }

  const trustVals = rows.map((e) => inferredSourceTrust01(e.sourceRef, e.sourceTrust01));
  conflict = Math.max(conflict, stdDev01(trustVals) * 0.65);
  return n01(conflict);
}

const QUALITY_W = Object.freeze({
  reliability: 0.28,
  freshness: 0.18,
  consistency: 0.22,
  coverage: 0.17,
  antiConflict: 0.15,
} as const);

export function calculateEvidenceQuality(
  reliability: number,
  freshness: number,
  consistency: number,
  coverage: number,
  conflictScore: number
): number {
  const w = QUALITY_W;
  const anti = n01(1 - n01(conflictScore));
  return n01(
    n01(reliability) * w.reliability +
      n01(freshness) * w.freshness +
      n01(consistency) * w.consistency +
      n01(coverage) * w.coverage +
      anti * w.antiConflict
  );
}

export function detectWeakEvidence(evidence: readonly DecisionEvidence[], reliability: number): boolean {
  const rows = dedupeEvidence(evidence);
  if (rows.length === 0) return true;
  const minStrength = Math.min(...rows.map((e) => n01(e.strength01)));
  return minStrength < 0.28 || n01(reliability) < 0.32;
}

export function detectConflictingEvidence(conflictScore: number): boolean {
  return n01(conflictScore) >= 0.38;
}

export function detectSparseEvidence(evidence: readonly DecisionEvidence[], coverage: number): boolean {
  const rows = dedupeEvidence(evidence);
  return rows.length < 2 || n01(coverage) < 0.38;
}

export function evidenceSummaryLabelFromQuality(overallQuality: number, evidenceCount: number): DecisionEvidenceSummaryLabel {
  const q = n01(overallQuality);
  if (evidenceCount === 0 || q < 0.12) return "insufficient";
  if (q < 0.32) return "weak";
  if (q < 0.52) return "partial";
  if (q < 0.76) return "reliable";
  return "strong";
}

function buildWarnings(input: {
  readonly evidenceCount: number;
  readonly weakEvidence: boolean;
  readonly conflictingEvidence: boolean;
  readonly sparseEvidence: boolean;
  readonly conflictScore: number;
  readonly freshness: number;
}): readonly string[] {
  const w: string[] = [];
  if (input.evidenceCount === 0) w.push("no_evidence_slices");
  if (input.sparseEvidence) w.push("sparse_evidence");
  if (input.weakEvidence) w.push("weak_evidence_strength_or_trust");
  if (input.conflictingEvidence) w.push("conflicting_signals_or_strength_dispersion");
  if (input.evidenceCount > 0 && input.freshness < 0.35) w.push("stale_or_time_unbounded_evidence");
  if (input.conflictScore > 0.55) w.push("high_evidence_conflict");
  return w.sort((a, b) => a.localeCompare(b));
}

export function evaluateDecisionEvidence(input: DecisionEvidenceEvaluationInput): DecisionEvidenceEvaluationResult {
  const rows = dedupeEvidence(input.evidence);
  const evidenceCount = rows.length;
  const signals = input.signals ?? undefined;
  const refMs = Number.isFinite(input.referenceTimeMs) ? input.referenceTimeMs : 0;
  const maxAge = input.maxEvidenceAgeMs ?? 1000 * 60 * 60 * 24 * 14;
  const target = input.coverageTargetCount ?? 3;

  if (evidenceCount === 0) {
    const weakEvidence = true;
    const sparseEvidence = true;
    const conflictingEvidence = false;
    const warnings = buildWarnings({
      evidenceCount: 0,
      weakEvidence,
      conflictingEvidence,
      sparseEvidence,
      conflictScore: 0,
      freshness: 0,
    });
    return {
      overallQuality: 0,
      reliability: 0,
      freshness: 0,
      consistency: 0,
      coverage: 0,
      conflictScore: 0,
      weakEvidence,
      conflictingEvidence,
      sparseEvidence,
      summaryLabel: "insufficient",
      warnings,
      evidenceCount: 0,
    };
  }

  const reliability = calculateEvidenceReliability(rows, signals);
  const freshness = calculateEvidenceFreshness(rows, refMs, maxAge);
  const consistency = calculateEvidenceConsistency(rows, signals);
  const coverage = calculateEvidenceCoverage(rows, target);
  const conflictScore = calculateEvidenceConflictScore(rows, signals);
  const overallQuality = calculateEvidenceQuality(reliability, freshness, consistency, coverage, conflictScore);

  const weakEvidence = detectWeakEvidence(rows, reliability);
  const conflictingEvidence = detectConflictingEvidence(conflictScore);
  const sparseEvidence = detectSparseEvidence(rows, coverage);
  const summaryLabel = evidenceSummaryLabelFromQuality(overallQuality, evidenceCount);
  const warnings = buildWarnings({
    evidenceCount,
    weakEvidence,
    conflictingEvidence,
    sparseEvidence,
    conflictScore,
    freshness,
  });

  return {
    overallQuality,
    reliability,
    freshness,
    consistency,
    coverage,
    conflictScore,
    weakEvidence,
    conflictingEvidence,
    sparseEvidence,
    summaryLabel,
    warnings,
    evidenceCount,
  };
}
