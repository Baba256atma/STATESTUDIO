/**
 * B.21 — Decision quality over time (deterministic, frontend-only).
 */

import type { NexoraExecutionOutcome } from "../execution/nexoraExecutionOutcome.ts";
import type { NexoraScenarioMemoryEntry } from "../scenario/nexoraScenarioMemory.ts";

const VALID_OPTION_IDS = new Set(["conservative", "balanced", "aggressive"]);
const OPTION_TIE_ORDER = ["aggressive", "balanced", "conservative"] as const;

export type NexoraDecisionQualityReport = {
  score: number;
  qualityTier: "low" | "medium" | "high";
  trend: "improving" | "stable" | "declining";

  successfulRuns: number;
  failedRuns: number;
  totalRatedRuns: number;

  bestPosture?: string;
  weakestPosture?: string;
  dominantRecommendedOption?: string;

  summary: string;
};

const b21LoggedSigs = new Set<string>();

export function emitDecisionQualityReadyDev(signature: string): void {
  if (process.env.NODE_ENV === "production") return;
  if (b21LoggedSigs.has(signature)) return;
  b21LoggedSigs.add(signature);
  globalThis.console?.debug?.("[Nexora][B21] decision_quality_ready", { signature });
}

function postureNorm(p?: string | null): string {
  return String(p ?? "").trim().toLowerCase();
}

function labelToScore(label: NexoraExecutionOutcome["outcomeLabel"]): number {
  if (label === "better") return 1;
  if (label === "worse") return -1;
  return 0;
}

function memoryRowOutcomeScore(
  m: NexoraScenarioMemoryEntry,
  outcomesByRunId: Map<string, NexoraExecutionOutcome>
): number | null {
  if (m.executionOutcomeLabel) {
    return labelToScore(m.executionOutcomeLabel);
  }
  const o = outcomesByRunId.get(m.runId);
  if (!o) return null;
  return o.outcomeScore;
}

function tierFromScore(score: number): NexoraDecisionQualityReport["qualityTier"] {
  if (score >= 0.66) return "high";
  if (score >= 0.34) return "medium";
  return "low";
}

function optionWeightFromScore(score: number): number {
  return (score + 1) / 2;
}

export function buildDecisionQualityInputSignature(
  outcomes: NexoraExecutionOutcome[],
  memory: NexoraScenarioMemoryEntry[]
): string {
  const byRecDesc = [...outcomes].sort((a, b) => b.recordedAt - a.recordedAt);
  const latestO = byRecDesc[0];
  const byTsDesc = [...memory].sort((a, b) => b.timestamp - a.timestamp);
  const latestM = byTsDesc[0];
  const oSig = [...outcomes]
    .sort((a, b) => (a.runId < b.runId ? -1 : a.runId > b.runId ? 1 : 0))
    .map((o) => `${o.runId}:${o.outcomeLabel}`)
    .join("|");
  const mSig = [...memory]
    .sort((a, b) => (a.runId < b.runId ? -1 : a.runId > b.runId ? 1 : 0))
    .map(
      (m) =>
        `${m.runId}:${m.executionOutcomeLabel ?? ""}:${postureNorm(m.decisionPosture)}:${m.recommendedOptionId ?? ""}`
    )
    .join("|");
  return JSON.stringify({
    outcomeCount: outcomes.length,
    latestOutcomeRunId: latestO?.runId ?? null,
    memoryCount: memory.length,
    latestMemoryRunId: latestM?.runId ?? null,
    oSig,
    mSig,
  });
}

export function evaluateDecisionQuality(input: {
  outcomes: NexoraExecutionOutcome[];
  memory: NexoraScenarioMemoryEntry[];
}): NexoraDecisionQualityReport {
  const outcomes = input.outcomes;
  const memory = input.memory;

  const totalRatedRuns = outcomes.length;
  let successfulRuns = 0;
  let failedRuns = 0;
  for (const o of outcomes) {
    if (o.outcomeLabel === "better") successfulRuns += 1;
    else if (o.outcomeLabel === "worse") failedRuns += 1;
  }

  let score = 0.5;
  if (totalRatedRuns > 0) {
    const sum = outcomes.reduce((acc, o) => acc + o.outcomeScore, 0);
    const avg = sum / totalRatedRuns;
    score = (avg + 1) / 2;
  }

  const qualityTier = tierFromScore(score);

  let trend: NexoraDecisionQualityReport["trend"] = "stable";
  if (totalRatedRuns >= 3) {
    const chron = [...outcomes].sort((a, b) => a.recordedAt - b.recordedAt).slice(-5);
    const mid = Math.floor(chron.length / 2);
    const older = chron.slice(0, mid);
    const newer = chron.slice(mid);
    const avg = (xs: NexoraExecutionOutcome[]) =>
      xs.length ? xs.reduce((s, o) => s + o.outcomeScore, 0) / xs.length : 0;
    const d = avg(newer) - avg(older);
    if (d > 0.25) trend = "improving";
    else if (d < -0.25) trend = "declining";
    else trend = "stable";
  }

  const outcomesByRunId = new Map<string, NexoraExecutionOutcome>();
  for (const o of outcomes) {
    outcomesByRunId.set(o.runId, o);
  }

  type PostureAgg = { scores: number[]; display: string };
  const postureGroups = new Map<string, PostureAgg>();
  for (const m of memory) {
    const pk = postureNorm(m.decisionPosture);
    if (!pk) continue;
    const sc = memoryRowOutcomeScore(m, outcomesByRunId);
    if (sc === null) continue;
    let g = postureGroups.get(pk);
    if (!g) {
      g = { scores: [], display: String(m.decisionPosture).trim() || pk };
      postureGroups.set(pk, g);
    }
    g.scores.push(sc);
    if (g.display.length === 0 && m.decisionPosture?.trim()) {
      g.display = m.decisionPosture.trim();
    }
  }

  let bestPosture: string | undefined;
  let weakestPosture: string | undefined;
  if (postureGroups.size > 0) {
    const rows = [...postureGroups.entries()].map(([key, agg]) => ({
      key,
      display: agg.display,
      avg: agg.scores.reduce((s, x) => s + x, 0) / agg.scores.length,
      n: agg.scores.length,
    }));
    rows.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
    let best = rows[0]!;
    let weak = rows[0]!;
    for (const r of rows) {
      if (r.avg > best.avg || (r.avg === best.avg && r.key < best.key)) best = r;
      if (r.avg < weak.avg || (r.avg === weak.avg && r.key < weak.key)) weak = r;
    }
    bestPosture = best.display;
    if (rows.length >= 2 && weak.key !== best.key) {
      weakestPosture = weak.display;
    }
  }

  const optionWeights: Record<string, number> = { conservative: 0, balanced: 0, aggressive: 0 };
  for (const m of memory) {
    const id = String(m.recommendedOptionId ?? "").trim();
    if (!VALID_OPTION_IDS.has(id)) continue;
    const sc = memoryRowOutcomeScore(m, outcomesByRunId);
    const w = sc === null ? 0.5 : optionWeightFromScore(sc);
    optionWeights[id] = (optionWeights[id] ?? 0) + w;
  }
  let dominantRecommendedOption: string | undefined;
  let bestW = -1;
  for (const id of OPTION_TIE_ORDER) {
    const w = optionWeights[id] ?? 0;
    if (w > bestW) {
      bestW = w;
      dominantRecommendedOption = id;
    }
  }
  if (bestW <= 0) {
    dominantRecommendedOption = undefined;
  }

  let summary: string;
  if (totalRatedRuns === 0) {
    summary = "Not enough rated execution outcomes yet.";
  } else {
    const parts: string[] = [];
    if (trend === "improving") {
      parts.push("Recent decision outcomes are improving.");
    } else if (trend === "declining") {
      parts.push("Recent decision outcomes are declining.");
    } else {
      parts.push("Recent decision outcomes are steady or mixed.");
    }
    if (bestPosture && weakestPosture) {
      parts.push(`${bestPosture} leads; ${weakestPosture} lags on average.`);
    } else if (bestPosture) {
      parts.push(`Best posture so far: ${bestPosture}.`);
    }
    if (dominantRecommendedOption) {
      parts.push(`Historically weighted pick: ${dominantRecommendedOption}.`);
    }
    summary = parts.join(" ");
  }

  return {
    score,
    qualityTier,
    trend,
    successfulRuns,
    failedRuns,
    totalRatedRuns,
    bestPosture,
    weakestPosture,
    dominantRecommendedOption,
    summary,
  };
}
