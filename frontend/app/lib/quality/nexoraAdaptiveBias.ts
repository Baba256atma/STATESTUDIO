/**
 * B.22 — Controlled adaptive bias from quality + memory + outcomes (deterministic).
 */

import type { NexoraAdaptiveBiasResult } from "./nexoraAdaptiveBiasContract.ts";
import type { NexoraDecisionQualityReport } from "./nexoraDecisionQuality.ts";
import type { NexoraExecutionOutcome } from "../execution/nexoraExecutionOutcome.ts";
import type { NexoraScenarioMemoryEntry } from "../scenario/nexoraScenarioMemory.ts";

export type { NexoraAdaptiveBiasResult } from "./nexoraAdaptiveBiasContract.ts";
export { adaptiveBiasSignatureSuffix } from "./nexoraAdaptiveBiasContract.ts";

const VALID_OPTIONS = new Set(["conservative", "balanced", "aggressive"]);
const OPTION_ORDER = ["aggressive", "balanced", "conservative"] as const;

const b22Logged = new Set<string>();

export function emitAdaptiveBiasReadyDev(key: string): void {
  if (process.env.NODE_ENV === "production") return;
  if (b22Logged.has(key)) return;
  b22Logged.add(key);
  globalThis.console?.debug?.("[Nexora][B22] adaptive_bias_ready", { key });
}

/** Dedupe key: quality signature + dominant option + weakest posture (+ discouraged option for stability). */
export function buildAdaptiveBiasDevLogKey(qualitySignature: string, bias: NexoraAdaptiveBiasResult | null): string {
  if (!bias) return `${qualitySignature}|bias:null`;
  return `${qualitySignature}|dom:${bias.preferredOptionId ?? "-"}|wp:${bias.discouragedPosture ?? "-"}|do:${bias.discouragedOptionId ?? "-"}`;
}

function labelToScore(label: NexoraExecutionOutcome["outcomeLabel"]): number {
  if (label === "better") return 1;
  if (label === "worse") return -1;
  return 0;
}

function memoryRowScore(m: NexoraScenarioMemoryEntry, byRun: Map<string, NexoraExecutionOutcome>): number | null {
  if (m.executionOutcomeLabel) return labelToScore(m.executionOutcomeLabel);
  const o = byRun.get(m.runId);
  if (!o) return null;
  return o.outcomeScore;
}

/** Same weighting as B.19 `analyzeScenarioMemory` for option tallies. */
function memoryWeightedDominant(memory: readonly NexoraScenarioMemoryEntry[]): string | undefined {
  const counts: Record<string, number> = { conservative: 0, balanced: 0, aggressive: 0 };
  for (const e of memory) {
    const id = String(e.recommendedOptionId ?? "").trim();
    if (!VALID_OPTIONS.has(id)) continue;
    let w = 1;
    if (e.executionOutcomeLabel === "worse") w = 0;
    else if (e.executionOutcomeLabel === "better") w = 2;
    counts[id] = (counts[id] ?? 0) + w;
  }
  let best = 0;
  for (const id of OPTION_ORDER) best = Math.max(best, counts[id] ?? 0);
  if (best <= 0) return undefined;
  const tied = OPTION_ORDER.filter((id) => (counts[id] ?? 0) === best);
  return [...tied].sort()[0];
}

function preferredOptionConflict(
  preferred: string,
  memory: readonly NexoraScenarioMemoryEntry[],
  outcomesByRunId: Map<string, NexoraExecutionOutcome>
): boolean {
  let sum = 0;
  let n = 0;
  for (const m of memory) {
    if (String(m.recommendedOptionId ?? "").trim() !== preferred) continue;
    const sc = memoryRowScore(m, outcomesByRunId);
    if (sc === null) continue;
    sum += sc;
    n += 1;
  }
  return n >= 2 && sum / n < -0.01;
}

function findDiscouragedOptionFromMemory(
  memory: readonly NexoraScenarioMemoryEntry[],
  outcomesByRunId: Map<string, NexoraExecutionOutcome>
): string | undefined {
  const byOpt: Record<string, { sum: number; n: number }> = {};
  for (const m of memory) {
    const id = String(m.recommendedOptionId ?? "").trim();
    if (!VALID_OPTIONS.has(id)) continue;
    const sc = memoryRowScore(m, outcomesByRunId);
    if (sc === null) continue;
    if (!byOpt[id]) byOpt[id] = { sum: 0, n: 0 };
    byOpt[id]!.sum += sc;
    byOpt[id]!.n += 1;
  }
  type Row = { id: string; avg: number; n: number };
  const rows: Row[] = Object.entries(byOpt)
    .map(([id, v]) => ({ id, avg: v.sum / v.n, n: v.n }))
    .filter((r) => r.n >= 2 && r.avg < 0);
  if (!rows.length) return undefined;
  rows.sort((a, b) => (a.avg !== b.avg ? a.avg - b.avg : a.id.localeCompare(b.id)));
  return rows[0]!.id;
}

function capLabel(id: string): string {
  return id ? id.charAt(0).toUpperCase() + id.slice(1) : id;
}

export function buildAdaptiveBias(input: {
  quality: NexoraDecisionQualityReport | null;
  memory: NexoraScenarioMemoryEntry[];
  outcomes: NexoraExecutionOutcome[];
}): NexoraAdaptiveBiasResult {
  const quality = input.quality;
  const memory = input.memory;
  const outcomes = input.outcomes;

  const weakEvidence = (): NexoraAdaptiveBiasResult => ({
    confidence: "low",
    summary: "Adaptive bias is weak due to limited evidence.",
  });

  if (!quality) {
    return weakEvidence();
  }

  const rated = quality.totalRatedRuns;
  if (rated < 3) {
    return weakEvidence();
  }

  if (quality.qualityTier === "low") {
    return {
      confidence: "low",
      summary: "Adaptive bias is weak due to low decision quality tier.",
    };
  }

  const outcomesByRunId = new Map<string, NexoraExecutionOutcome>();
  for (const o of outcomes) outcomesByRunId.set(o.runId, o);

  const memDom = memoryWeightedDominant(memory);
  const qDom = quality.dominantRecommendedOption;
  const optionConflict = Boolean(memDom && qDom && memDom !== qDom);

  let preferredOptionId: string | undefined =
    qDom && VALID_OPTIONS.has(qDom) && quality.qualityTier !== "low" ? qDom : undefined;

  if (preferredOptionId && preferredOptionConflict(preferredOptionId, memory, outcomesByRunId)) {
    preferredOptionId = undefined;
  }
  if (optionConflict) {
    preferredOptionId = undefined;
  }

  const discouragedOptionId = findDiscouragedOptionFromMemory(memory, outcomesByRunId);

  const preferredPosture = quality.bestPosture?.trim() || undefined;
  const discouragedPosture = quality.weakestPosture?.trim() || undefined;

  const hasOptionNudge = Boolean(preferredOptionId || discouragedOptionId);
  const hasPostureOnly = Boolean(!hasOptionNudge && (preferredPosture || discouragedPosture));

  if (!hasOptionNudge && !hasPostureOnly) {
    return {
      confidence: "low",
      summary: "Adaptive bias is weak due to limited evidence.",
    };
  }

  let confidence: "medium" | "high" =
    quality.qualityTier === "high" && rated >= 5 && !optionConflict ? "high" : "medium";
  if (optionConflict && hasOptionNudge) {
    confidence = "medium";
  }

  let summary: string | null = null;
  if (preferredOptionId) {
    summary = `${capLabel(preferredOptionId)} scenarios performed best in recent runs.`;
  }
  if (discouragedOptionId) {
    const line = `${capLabel(discouragedOptionId)} paths underperformed historically.`;
    summary = summary ? `${summary} ${line}` : line;
  }
  if (!summary && discouragedPosture) {
    summary = `${discouragedPosture} posture is de-emphasized because outcomes were weaker.`;
  } else if (!summary && preferredPosture) {
    summary = `${preferredPosture} posture aligns with stronger historical outcomes.`;
  }

  return {
    preferredOptionId,
    discouragedOptionId,
    preferredPosture,
    discouragedPosture,
    confidence,
    summary,
  };
}
