import { rankExecutiveSignals } from "../intelligence/executiveSignalHierarchy.ts";
import { dedupeByStableKey, stableSignalKey } from "../intelligence/shared/dedupe.ts";
import { clamp01, normalizeSeverity, severityRank, uniqueStrings } from "../intelligence/shared/normalization.ts";

export type ExecutiveUxSignalLevel =
  | "immediate_focus"
  | "strategic_context"
  | "supporting_intelligence";

export type ExecutiveUxSignal = {
  id: string;
  title?: string;
  summary?: string;
  sourceType: string;
  severity?: string;
  priority?: string;
  confidence?: number;
  relatedObjectIds?: string[];
  relatedScenarioIds?: string[];
  recommendedFocus?: string;
  createdAt?: number;
};

export type ExecutiveUxHierarchyItem = ExecutiveUxSignal & {
  level: ExecutiveUxSignalLevel;
  rankScore: number;
  displayOrder: number;
};

function levelFromRankScore(score: number): ExecutiveUxSignalLevel {
  if (score >= 0.72) return "immediate_focus";
  if (score >= 0.44) return "strategic_context";
  return "supporting_intelligence";
}

function normalizeSignal(signal: ExecutiveUxSignal): ExecutiveUxSignal {
  return {
    ...signal,
    severity: normalizeSeverity(signal.severity ?? signal.priority),
    confidence: clamp01(signal.confidence ?? 0.5),
    relatedObjectIds: uniqueStrings(signal.relatedObjectIds ?? []),
    relatedScenarioIds: uniqueStrings(signal.relatedScenarioIds ?? []),
  };
}

export function classifyExecutiveUxSignal(signal: ExecutiveUxSignal): ExecutiveUxHierarchyItem {
  const normalized = normalizeSignal(signal);
  const ranked = rankExecutiveSignals([normalized])[0];
  const severityBoost = severityRank(normalized.severity) >= 4 ? 0.04 : 0;
  const rankScore = clamp01((ranked?.rankScore ?? 0.24) + severityBoost);
  return {
    ...normalized,
    level: levelFromRankScore(rankScore),
    rankScore,
    displayOrder: 0,
  };
}

export function rankExecutiveUxSignals(signals: ExecutiveUxSignal[]): ExecutiveUxHierarchyItem[] {
  const deduped = dedupeByStableKey(signals.map(normalizeSignal), (signal) =>
    stableSignalKey({
      type: `${signal.sourceType}:${signal.severity ?? signal.priority ?? "low"}`,
      sourceId: signal.id,
      relatedObjectIds: signal.relatedObjectIds,
    })
  );

  return deduped
    .map(classifyExecutiveUxSignal)
    .sort((left, right) => {
      if (right.rankScore !== left.rankScore) return right.rankScore - left.rankScore;
      if ((right.createdAt ?? 0) !== (left.createdAt ?? 0)) return (right.createdAt ?? 0) - (left.createdAt ?? 0);
      return left.id.localeCompare(right.id);
    })
    .map((signal, index) => ({
      ...signal,
      displayOrder: index + 1,
    }));
}

export function selectPrimaryExecutiveFocus(signals: ExecutiveUxSignal[]): ExecutiveUxHierarchyItem | null {
  return rankExecutiveUxSignals(signals).find((signal) => signal.level === "immediate_focus") ?? null;
}

export function countCompressedSignals(signals: ExecutiveUxSignal[], rankedSignals: ExecutiveUxHierarchyItem[]): number {
  return Math.max(0, signals.length - rankedSignals.length);
}
