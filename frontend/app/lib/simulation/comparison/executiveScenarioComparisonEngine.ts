/**
 * D7:1:6 — Executive scenario comparison engine (deterministic, non-mutating).
 */

import type { OperationalTimeline } from "../timeline/timelineTypes.ts";
import type {
  CompareMultipleScenariosInput,
  CompareScenarioTimelinesInput,
  MultiScenarioComparisonResult,
  ScenarioComparison,
  ScenarioComparisonPanelContract,
  ScenarioComparisonResult,
  ScenarioComparisonSnapshot,
  ScenarioRankingEntry,
} from "./scenarioComparisonTypes.ts";
import { guardScenarioComparison, type ComparisonGuardResult } from "./comparisonGuards.ts";
import { logComparisonDev } from "./comparisonDevLog.ts";
import { analyzeScenarioDelta } from "./scenarioDeltaAnalysis.ts";
import {
  analyzeStrategicTradeoffs,
  buildScenarioComparisonMetrics,
} from "./strategicTradeoffAnalysis.ts";
import { buildExecutiveComparisonNarrative } from "./executiveScenarioNarratives.ts";
import {
  extractTimelineMetricProfile,
  type ScenarioMetricProfile,
} from "./scenarioMetricsExtractor.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function comparisonPairKey(a: string, b: string): string {
  return [a, b].sort().join("::");
}

function riskLevel(fragility: number): "low" | "moderate" | "high" | "critical" {
  if (fragility >= 0.75) return "critical";
  if (fragility >= 0.55) return "high";
  if (fragility >= 0.35) return "moderate";
  return "low";
}

export function buildComparisonFingerprint(input: {
  baselineScenarioId: string;
  comparisonScenarioId: string;
  compareAtTick: number;
  baselineTimelineId: string;
  comparisonTimelineId: string;
  metrics: ScenarioComparisonSnapshot["metrics"];
  delta: ScenarioComparisonSnapshot["delta"];
}): string {
  return stableStringify({
    baselineScenarioId: input.baselineScenarioId,
    comparisonScenarioId: input.comparisonScenarioId,
    compareAtTick: input.compareAtTick,
    baselineTimelineId: input.baselineTimelineId,
    comparisonTimelineId: input.comparisonTimelineId,
    metrics: input.metrics,
    changedObjects: input.delta.changedObjects,
    divergenceSeverity: input.delta.divergenceSeverity,
  });
}

export function compareScenarioTimelines(
  input: CompareScenarioTimelinesInput
): ScenarioComparisonResult {
  const guard = guardScenarioComparison(input);
  if (!guard.ok) return { ok: false, guard };

  const compareAtTick = guard.compareAtTick;
  const baselineProfile = extractTimelineMetricProfile(input.baseline, compareAtTick);
  const comparisonProfile = extractTimelineMetricProfile(input.comparison, compareAtTick);
  const metrics = buildScenarioComparisonMetrics(baselineProfile, comparisonProfile);
  const delta = analyzeScenarioDelta({
    baseline: input.baseline,
    comparison: input.comparison,
    compareAtTick,
  });
  const tradeoffs = analyzeStrategicTradeoffs({
    metrics,
    baseline: baselineProfile,
    comparison: comparisonProfile,
  });
  const narrative = buildExecutiveComparisonNarrative({
    baselineScenarioId: input.baselineScenarioId,
    comparisonScenarioId: input.comparisonScenarioId,
    metrics,
    delta,
    tradeoffs,
    baselineProfile,
    comparisonProfile,
  });

  const fingerprint = buildComparisonFingerprint({
    baselineScenarioId: input.baselineScenarioId,
    comparisonScenarioId: input.comparisonScenarioId,
    compareAtTick,
    baselineTimelineId: input.baseline.timelineId,
    comparisonTimelineId: input.comparison.timelineId,
    metrics,
    delta,
  });

  const comparison: ScenarioComparison = {
    comparisonId: `cmp::${input.baselineScenarioId}::${input.comparisonScenarioId}::${compareAtTick}`,
    comparedScenarioIds: [input.baselineScenarioId, input.comparisonScenarioId],
    baselineScenarioId: input.baselineScenarioId,
    comparisonScenarioId: input.comparisonScenarioId,
    createdAt: new Date(Date.UTC(2026, 0, 1) + compareAtTick * 1000).toISOString(),
    compareAtTick,
    summary: narrative.summary,
  };

  const snapshot: ScenarioComparisonSnapshot = Object.freeze({
    comparison: Object.freeze(comparison),
    metrics: Object.freeze({ ...metrics }),
    delta: Object.freeze({
      ...delta,
      changedObjects: Object.freeze([...delta.changedObjects]),
      riskEscalations: Object.freeze([...delta.riskEscalations]),
      recoveryDifferences: Object.freeze([...delta.recoveryDifferences]),
      majorOperationalChanges: Object.freeze([...delta.majorOperationalChanges]),
      propagationPathChanges: Object.freeze([...delta.propagationPathChanges]),
    }),
    tradeoffs: Object.freeze(tradeoffs.map((t) => Object.freeze({ ...t }))),
    narrative: Object.freeze({
      ...narrative,
      bullets: Object.freeze([...narrative.bullets]),
    }),
    baselineTimelineId: input.baseline.timelineId,
    comparisonTimelineId: input.comparison.timelineId,
    compareAtTick,
    fingerprint,
  });

  logComparisonDev("ScenarioComparison", {
    comparisonId: comparison.comparisonId,
    compareAtTick,
    divergenceSeverity: delta.divergenceSeverity,
    fingerprint,
  });

  return { ok: true, snapshot };
}

function buildRankingFromSnapshots(
  snapshots: readonly ScenarioComparisonSnapshot[]
): ScenarioRankingEntry[] {
  const scores = new Map<string, { safer: number; riskier: number; stable: number; recovery: number }>();

  for (const snap of snapshots) {
    const baseId = snap.comparison.baselineScenarioId;
    const cmpId = snap.comparison.comparisonScenarioId;
    if (!scores.has(baseId)) scores.set(baseId, { safer: 0, riskier: 0, stable: 0, recovery: 0 });
    if (!scores.has(cmpId)) scores.set(cmpId, { safer: 0, riskier: 0, stable: 0, recovery: 0 });

    const base = scores.get(baseId)!;
    const cmp = scores.get(cmpId)!;

    if (snap.narrative.saferPath === "baseline") base.safer += 1;
    else if (snap.narrative.saferPath === "comparison") cmp.safer += 1;

    if (snap.narrative.riskierPath === "baseline") base.riskier += 1;
    else if (snap.narrative.riskierPath === "comparison") cmp.riskier += 1;

    if (snap.narrative.stabilityWinner === "baseline") base.stable += 1;
    else if (snap.narrative.stabilityWinner === "comparison") cmp.stable += 1;

    if (snap.narrative.recoveryWinner === "baseline") base.recovery += 1;
    else if (snap.narrative.recoveryWinner === "comparison") cmp.recovery += 1;
  }

  const ranking: ScenarioRankingEntry[] = [];
  let rank = 1;
  const bySafer = [...scores.entries()].sort((a, b) => b[1].safer - a[1].safer || a[0].localeCompare(b[0]));
  for (const [scenarioId, s] of bySafer) {
    if (s.safer <= 0) continue;
    ranking.push({
      scenarioId,
      rank: rank++,
      category: "safer",
      score: s.safer,
      reason: "Aggregated safer-path signals across pairwise comparisons.",
    });
  }
  for (const [scenarioId, s] of [...scores.entries()].sort((a, b) => b[1].recovery - a[1].recovery)) {
    if (s.recovery <= 0) continue;
    ranking.push({
      scenarioId,
      rank: rank++,
      category: "recovery_potential",
      score: s.recovery,
      reason: "Strongest recovery potential across compared futures.",
    });
  }
  return ranking;
}

export function buildScenarioComparisonPanelContract(input: {
  snapshots: readonly ScenarioComparisonSnapshot[];
  scenarioProfiles: Readonly<Record<string, { timelineId: string; label: string; profile: ScenarioMetricProfile }>>;
  compareAtTick: number;
  viewHint?: ScenarioComparisonPanelContract["viewHint"];
}): ScenarioComparisonPanelContract {
  const first = input.snapshots[0];
  const comparisonId =
    first?.comparison.comparisonId ?? `cmp::multi::${input.compareAtTick}`;

  const scenarios = Object.entries(input.scenarioProfiles)
    .map(([scenarioId, row]) => ({
      scenarioId,
      timelineId: row.timelineId,
      label: row.label,
      headline:
        input.snapshots.find(
          (s) =>
            s.comparison.baselineScenarioId === scenarioId ||
            s.comparison.comparisonScenarioId === scenarioId
        )?.narrative.headline ?? "Scenario under comparison.",
      fragilityScore: row.profile.fragility,
      confidenceScore: row.profile.confidence,
      recoveryScore: row.profile.recoveryPotential,
      riskLevel: riskLevel(row.profile.fragility),
    }))
    .sort((a, b) => a.scenarioId.localeCompare(b.scenarioId));

  const tradeoffs = input.snapshots.flatMap((s) => [...s.tradeoffs]);
  const narratives = input.snapshots.map((s) => s.narrative.headline);

  return Object.freeze({
    comparisonId,
    compareAtTick: input.compareAtTick,
    scenarios: Object.freeze(scenarios),
    ranking: Object.freeze(buildRankingFromSnapshots(input.snapshots)),
    tradeoffs: Object.freeze(tradeoffs),
    narratives: Object.freeze(narratives),
    viewHint: input.viewHint ?? (input.snapshots.length > 2 ? "ranking" : "side_by_side"),
  });
}

export function compareMultipleScenarios(
  input: CompareMultipleScenariosInput
): MultiScenarioComparisonResult | { ok: false; guard: ComparisonGuardResult } {
  const seenPairs = new Set<string>();
  const snapshots: ScenarioComparisonSnapshot[] = [];
  const scenarioProfiles: Record<
    string,
    { timelineId: string; label: string; profile: ScenarioMetricProfile }
  > = {};

  const baselineId = "baseline";
  scenarioProfiles[baselineId] = {
    timelineId: input.baseline.timelineId,
    label: baselineId,
    profile: extractTimelineMetricProfile(
      input.baseline,
      input.compareAtTick ?? Math.min(input.baseline.currentTick, input.comparisons[0]?.timeline.currentTick ?? 0)
    ),
  };

  for (const item of input.comparisons) {
    const pairKey = comparisonPairKey(baselineId, item.scenarioId);
    if (seenPairs.has(pairKey)) {
      return {
        ok: false,
        guard: {
          ok: false,
          code: "recursive_comparison",
          message: `Duplicate comparison pair: ${pairKey}`,
        },
      };
    }
    seenPairs.add(pairKey);

    const result = compareScenarioTimelines({
      baseline: input.baseline,
      comparison: item.timeline,
      baselineScenarioId: baselineId,
      comparisonScenarioId: item.scenarioId,
      compareAtTick: input.compareAtTick,
      forest: input.forest,
    });
    if (!result.ok) return { ok: false, guard: result.guard };
    snapshots.push(result.snapshot);

    scenarioProfiles[item.scenarioId] = {
      timelineId: item.timeline.timelineId,
      label: item.scenarioId,
      profile: extractTimelineMetricProfile(
        item.timeline,
        result.snapshot.compareAtTick
      ),
    };
  }

  const compareAtTick = snapshots[0]?.compareAtTick ?? 0;
  const panelContract = buildScenarioComparisonPanelContract({
    snapshots,
    scenarioProfiles,
    compareAtTick,
  });

  const fingerprint = stableStringify({
    compareAtTick,
    snapshots: snapshots.map((s) => s.fingerprint),
  });

  return {
    comparisons: Object.freeze(snapshots),
    panelContract,
    fingerprint,
  };
}

/** Read-only: returns frozen snapshots without altering source timelines. */
export function freezeComparisonSnapshot(
  snapshot: ScenarioComparisonSnapshot
): ScenarioComparisonSnapshot {
  return Object.freeze({
    ...snapshot,
    comparison: Object.freeze({ ...snapshot.comparison }),
    metrics: Object.freeze({ ...snapshot.metrics }),
    delta: Object.freeze({
      ...snapshot.delta,
      changedObjects: Object.freeze([...snapshot.delta.changedObjects]),
      riskEscalations: Object.freeze([...snapshot.delta.riskEscalations]),
      recoveryDifferences: Object.freeze([...snapshot.delta.recoveryDifferences]),
      majorOperationalChanges: Object.freeze([...snapshot.delta.majorOperationalChanges]),
      propagationPathChanges: Object.freeze([...snapshot.delta.propagationPathChanges]),
    }),
    tradeoffs: Object.freeze(snapshot.tradeoffs.map((t) => Object.freeze({ ...t }))),
    narrative: Object.freeze({
      ...snapshot.narrative,
      bullets: Object.freeze([...snapshot.narrative.bullets]),
    }),
  });
}
