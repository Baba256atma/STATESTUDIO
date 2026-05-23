import type {
  ExecutiveReliabilitySnapshot,
  ReliabilityState,
  ReliabilityTrendPoint,
  ReliabilityTrendSummary,
} from "./executiveReliabilityTypes.ts";

const STATE_RANK: Record<ReliabilityState, number> = {
  unstable: 1,
  degraded: 2,
  recovering: 3,
  stable: 4,
};

export function reliabilityStateRank(state: ReliabilityState): number {
  return STATE_RANK[state];
}

export function buildReliabilityTrendSummary(params: {
  current: ReliabilityTrendPoint;
  previousSnapshots?: readonly ExecutiveReliabilitySnapshot[];
}): ReliabilityTrendSummary {
  const previous = [...(params.previousSnapshots ?? [])]
    .sort((a, b) => b.generatedAt - a.generatedAt)
    .slice(0, 4)
    .map((snapshot) => ({
      generatedAt: snapshot.generatedAt,
      trustScore: snapshot.summary.trustScore,
      reliabilityState: snapshot.summary.reliabilityState,
      confidenceLevel: snapshot.summary.confidenceLevel,
    }));
  const points = Object.freeze([params.current, ...previous].sort((a, b) => a.generatedAt - b.generatedAt));
  const prior = previous[0];
  const priorPoint = prior
    ? {
        trustScore: prior.trustScore,
        reliabilityState: prior.reliabilityState,
      }
    : null;
  const trustScoreDelta = priorPoint ? Number((params.current.trustScore - priorPoint.trustScore).toFixed(2)) : 0;
  const confidenceDrift = trustScoreDelta > 0.03 ? "up" : trustScoreDelta < -0.03 ? "down" : "flat";
  const stabilityChanged = priorPoint
    ? priorPoint.reliabilityState !== params.current.reliabilityState
    : false;
  const direction =
    priorPoint && params.current.reliabilityState === "recovering" && reliabilityStateRank(priorPoint.reliabilityState) < 3
      ? "recovering"
      : trustScoreDelta > 0.03
        ? "improving"
        : trustScoreDelta < -0.03
          ? "declining"
          : "flat";

  return {
    direction,
    trustScoreDelta,
    confidenceDrift,
    stabilityChanged,
    points,
  };
}
