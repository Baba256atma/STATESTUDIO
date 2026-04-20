/**
 * B.19 — Lightweight scenario memory (localStorage, deterministic, no ML).
 */

import type { NexoraAuditRecord } from "../audit/nexoraAuditContract.ts";
import type { NexoraExecutionOutcome } from "../execution/nexoraExecutionOutcome.ts";
import { NEXORA_EXECUTION_OUTCOME_RECORDED } from "../execution/nexoraExecutionOutcome.ts";
import type { NexoraMode } from "../product/nexoraMode.ts";
import { biasGovernanceSignaturePart } from "../quality/nexoraBiasGovernanceContract.ts";
import { adaptiveBiasSignatureSuffix, type NexoraAdaptiveBiasResult } from "../quality/nexoraAdaptiveBiasContract.ts";
import type { NexoraBiasGovernanceResult } from "../quality/nexoraBiasGovernanceContract.ts";
import {
  applyMemorySummaryEnrichment,
  buildScenarioB18Signature,
  buildScenarioVariants,
  fragilityRank,
  normalizeFragilityToken,
  pickRecommendedOption,
  type NexoraScenarioVariant,
} from "./nexoraScenarioBuilder.ts";

const STORAGE_KEY = "nexora.scenarioMemory.v1";
const MAX_ENTRIES = 20;

const VALID_OPTION_IDS = new Set(["conservative", "balanced", "aggressive"]);

const b19AppendLoggedRunIds = new Set<string>();

function emitB19MemoryAppended(runId: string) {
  if (process.env.NODE_ENV === "production") return;
  if (b19AppendLoggedRunIds.has(runId)) return;
  b19AppendLoggedRunIds.add(runId);
  globalThis.console?.debug?.("[Nexora][B19] memory_appended", { runId });
}

export type NexoraScenarioMemoryEntry = {
  runId: string;
  fragilityLevel?: string;
  confidenceTier?: string;
  decisionPosture?: string;
  decisionTradeoff?: string;
  decisionNextMove?: string;
  recommendedOptionId?: string;
  timestamp: number;
  /** B.20 — linked outcome for learning weights in analyzeScenarioMemory */
  executionOutcomeScore?: number;
  executionOutcomeLabel?: "worse" | "same" | "better";
};

export type ScenarioMemoryInsights = {
  similarRuns: number;
  repeatedDecision: boolean;
  dominantRecommendedOption?: string;
  stabilityTrend?: "improving" | "declining" | "stable";
  historicalPatternLabel: "stable" | "mixed" | "risky";
  optionSeenCounts: Record<string, number>;
};

function isValidEntry(x: unknown): x is NexoraScenarioMemoryEntry {
  if (!x || typeof x !== "object") return false;
  const o = x as NexoraScenarioMemoryEntry;
  return typeof o.runId === "string" && Boolean(o.runId.trim()) && typeof o.timestamp === "number" && Number.isFinite(o.timestamp);
}

export function loadScenarioMemory(): NexoraScenarioMemoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v.filter(isValidEntry);
  } catch {
    return [];
  }
}

export function appendScenarioMemory(entry: NexoraScenarioMemoryEntry): void {
  if (typeof window === "undefined") return;
  const all = loadScenarioMemory();
  const prior = all.find((e) => e.runId === entry.runId);
  const prev = all.filter((e) => e.runId !== entry.runId);
  const merged: NexoraScenarioMemoryEntry =
    prior && prior.executionOutcomeLabel != null
      ? {
          ...entry,
          executionOutcomeLabel: prior.executionOutcomeLabel,
          executionOutcomeScore: prior.executionOutcomeScore,
        }
      : entry;
  prev.unshift(merged);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prev.slice(0, MAX_ENTRIES)));
}

export function clearScenarioMemory(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

/** Compact deterministic fingerprint so B.18 signature can refresh when scenario memory changes (B.19). */
export function fingerprintScenarioMemory(memory: readonly NexoraScenarioMemoryEntry[]): string {
  let acc = memory.length >>> 0;
  for (let i = 0; i < memory.length; i++) {
    const e = memory[i]!;
    acc = ((acc * 131) ^ e.timestamp) >>> 0;
    const id = e.runId;
    for (let j = 0; j < id.length; j++) {
      acc = ((acc * 131) ^ id.charCodeAt(j)) >>> 0;
    }
  }
  return acc.toString(16);
}

function postureKey(p?: string | null): string {
  return String(p ?? "").trim().toLowerCase();
}

/**
 * Deterministic pattern read from prior memory rows vs current audit (no randomness).
 */
export function analyzeScenarioMemory(
  memory: readonly NexoraScenarioMemoryEntry[],
  currentAudit: NexoraAuditRecord
): ScenarioMemoryInsights {
  const currentFrag = normalizeFragilityToken(currentAudit.scanner.fragilityLevel);
  const currentPosture = postureKey(currentAudit.decision?.posture);

  const similarRuns = memory.filter(
    (e) => normalizeFragilityToken(e.fragilityLevel) === currentFrag && e.runId !== currentAudit.runId
  ).length;

  const postureMatches = currentPosture
    ? memory.filter((e) => postureKey(e.decisionPosture) === currentPosture && postureKey(e.decisionPosture).length > 0)
        .length
    : 0;
  const repeatedDecision = currentPosture.length > 0 && postureMatches >= 2;

  const counts: Record<string, number> = { conservative: 0, balanced: 0, aggressive: 0 };
  for (const e of memory) {
    const id = String(e.recommendedOptionId ?? "").trim();
    if (!VALID_OPTION_IDS.has(id)) continue;
    let w = 1;
    if (e.executionOutcomeLabel === "worse") w = 0;
    else if (e.executionOutcomeLabel === "better") w = 2;
    counts[id] = (counts[id] ?? 0) + w;
  }

  const ORDER = ["aggressive", "balanced", "conservative"] as const;
  let bestCount = 0;
  for (const id of ORDER) {
    bestCount = Math.max(bestCount, counts[id] ?? 0);
  }
  let dominant: string | undefined;
  if (bestCount > 0) {
    const tied = ORDER.filter((id) => (counts[id] ?? 0) === bestCount);
    dominant = [...tied].sort()[0];
  }

  const chronological = [...memory].sort((a, b) => a.timestamp - b.timestamp);
  let stabilityTrend: ScenarioMemoryInsights["stabilityTrend"] = "stable";
  if (chronological.length >= 4) {
    const mid = Math.floor(chronological.length / 2);
    const first = chronological.slice(0, mid);
    const second = chronological.slice(mid);
    const avg = (arr: NexoraScenarioMemoryEntry[]) => {
      if (!arr.length) return 1;
      let s = 0;
      for (const e of arr) {
        s += fragilityRank(normalizeFragilityToken(e.fragilityLevel));
      }
      return s / arr.length;
    };
    const a0 = avg(first);
    const a1 = avg(second);
    if (a1 < a0 - 0.25) stabilityTrend = "improving";
    else if (a1 > a0 + 0.25) stabilityTrend = "declining";
    else stabilityTrend = "stable";
  }

  const risky =
    stabilityTrend === "declining" || (repeatedDecision && similarRuns >= 2);
  const stable = similarRuns >= 3 && stabilityTrend !== "declining" && !risky;
  const historicalPatternLabel: ScenarioMemoryInsights["historicalPatternLabel"] = risky
    ? "risky"
    : stable
      ? "stable"
      : "mixed";

  const insights: ScenarioMemoryInsights = {
    similarRuns,
    repeatedDecision,
    dominantRecommendedOption: dominant,
    stabilityTrend,
    historicalPatternLabel,
    optionSeenCounts: counts,
  };

  return insights;
}

export function emitScenarioMemoryAppendedDev(runId: string): void {
  emitB19MemoryAppended(runId);
}

/** Merge B.20 outcome into the scenario-memory row for this run (creates minimal row if missing). */
export function mergeExecutionOutcomeIntoScenarioMemory(outcome: NexoraExecutionOutcome): void {
  if (typeof window === "undefined") return;
  const all = loadScenarioMemory();
  const idx = all.findIndex((e) => e.runId === outcome.runId);
  if (idx >= 0) {
    const next = [...all];
    const cur = next[idx]!;
    next[idx] = {
      ...cur,
      executionOutcomeScore: outcome.outcomeScore,
      executionOutcomeLabel: outcome.outcomeLabel,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, MAX_ENTRIES)));
    return;
  }
  appendScenarioMemory({
    runId: outcome.runId,
    fragilityLevel: outcome.actualFragilityLevel,
    timestamp: outcome.recordedAt,
    executionOutcomeScore: outcome.outcomeScore,
    executionOutcomeLabel: outcome.outcomeLabel,
  });
}

/** Subscribe to B.20 custom events (idempotent merge into B.19 store). */
export function installNexoraExecutionOutcomeBridge(): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (ev: Event) => {
    const detail = (ev as CustomEvent<NexoraExecutionOutcome>).detail;
    if (!detail?.runId) return;
    mergeExecutionOutcomeIntoScenarioMemory(detail);
  };
  window.addEventListener(NEXORA_EXECUTION_OUTCOME_RECORDED, handler as EventListener);
  return () => window.removeEventListener(NEXORA_EXECUTION_OUTCOME_RECORDED, handler as EventListener);
}

export type NexoraB18ResolveInput = {
  audit: NexoraAuditRecord;
  trust: { confidenceTier?: string | null; summary?: string | null };
  decision?: { posture?: string; tradeoff?: string; nextMove?: string };
  memory: readonly NexoraScenarioMemoryEntry[];
  /** B.22 / B.23 — governed adaptive bias for pick (secondary to fragility). */
  adaptiveBias?: NexoraAdaptiveBiasResult | null;
  /** B.23 — governance snapshot for signature + UI. */
  biasGovernance?: NexoraBiasGovernanceResult | null;
  /** B.23 — strong band allows slightly wider preferred fragility vs balanced. */
  adaptiveBiasStrengthBand?: "soft" | "strong";
  /** B.24 — operator mode (Adaptive vs Pure); affects signature only, not ingestion. */
  nexoraOperatorMode?: NexoraMode;
};

/**
 * Single entry point for B.18 + B.19 scenario resolution (deterministic; used by panel resolver + memory append).
 */
export function resolveNexoraB18WithMemory(input: NexoraB18ResolveInput): {
  variants: NexoraScenarioVariant[];
  recommendedOptionId: string | null;
  signature: string;
  insights: ScenarioMemoryInsights;
} {
  const insights = analyzeScenarioMemory(input.memory, input.audit);
  const raw = buildScenarioVariants(input.audit, input.trust, input.decision);
  const variants = applyMemorySummaryEnrichment(raw, insights);
  const recommendedOptionId = pickRecommendedOption(variants, insights, input.adaptiveBias ?? null, {
    biasStrengthBand: input.adaptiveBiasStrengthBand ?? "soft",
  });
  const tier = String(input.trust.confidenceTier ?? input.audit.trust.confidenceTier ?? "none");
  const baseSig = buildScenarioB18Signature(input.audit, tier);
  const opMode = input.nexoraOperatorMode ?? "adaptive";
  const signature = `${baseSig}|m${fingerprintScenarioMemory(input.memory)}${adaptiveBiasSignatureSuffix(input.adaptiveBias ?? null)}${biasGovernanceSignaturePart(input.biasGovernance ?? null, opMode)}`;
  return { variants, recommendedOptionId, signature, insights };
}
