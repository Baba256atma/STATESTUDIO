import { severityRank } from "./shared/normalization.ts";

export type ExecutiveSignalVisibility =
  | "primary"
  | "secondary"
  | "contextual"
  | "background";

export type ExecutiveSignalHierarchyInput = {
  id: string;
  sourceType: string;
  severity?: string;
  priority?: string;
  confidence?: number;
  createdAt?: number;
};

export type ExecutiveSignalHierarchyItem = ExecutiveSignalHierarchyInput & {
  visibility: ExecutiveSignalVisibility;
  rankScore: number;
};

function sourceWeight(sourceType: string): number {
  if (sourceType === "alert" || sourceType === "readiness") return 0.34;
  if (sourceType === "monitoring" || sourceType === "drift" || sourceType === "fragility") return 0.26;
  if (sourceType === "recommendation" || sourceType === "intervention") return 0.22;
  if (sourceType === "memory" || sourceType === "narrative") return 0.12;
  return 0.16;
}

function visibilityFromScore(score: number): ExecutiveSignalVisibility {
  if (score >= 0.76) return "primary";
  if (score >= 0.54) return "secondary";
  if (score >= 0.32) return "contextual";
  return "background";
}

export function rankExecutiveSignals(signals: ExecutiveSignalHierarchyInput[]): ExecutiveSignalHierarchyItem[] {
  return signals.map((signal) => {
    const severity = severityRank(signal.severity ?? signal.priority) / 4;
    const confidence = typeof signal.confidence === "number" ? Math.min(1, Math.max(0, signal.confidence)) : 0.5;
    const rankScore = Math.round(Math.min(1, severity * 0.46 + confidence * 0.2 + sourceWeight(signal.sourceType)) * 100) / 100;
    return {
      ...signal,
      rankScore,
      visibility: visibilityFromScore(rankScore),
    };
  }).sort((left, right) => {
    if (right.rankScore !== left.rankScore) return right.rankScore - left.rankScore;
    return left.id.localeCompare(right.id);
  });
}

export function topExecutiveSignals(signals: ExecutiveSignalHierarchyInput[], limit = 3): ExecutiveSignalHierarchyItem[] {
  return rankExecutiveSignals(signals).filter((signal) => signal.visibility !== "background").slice(0, Math.max(0, limit));
}
