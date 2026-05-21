import { stableSignature } from "../intelligence/shared/dedupe";
import { getCausalDependencyStore } from "./causalDependencyStore";
import type { OperationalCausalChain } from "./causalDependencyTypes";
import { getOperationalReplayStore } from "./operationalReplayStore";
import type { OperationalReplaySequence } from "./operationalReplayTypes";
import {
  beginTemporalDriftEvaluation,
  confidenceToTrajectoryLevel,
  endTemporalDriftEvaluation,
  shouldEvaluateTemporalDrift,
  shouldRetainDriftProjection,
} from "./temporalDriftProjectionGuards";
import { getTemporalDriftProjectionStore } from "./temporalDriftProjectionStore";
import { getTemporalCognitionStore } from "./temporalCognitionStore";
import type {
  EnterpriseTrajectorySignal,
  OperationalDriftForecast,
  OrganizationalFutureDirection,
  ProjectionCategory,
  StrategicEvolutionTrend,
  TemporalDriftProjection,
  TemporalDriftProjectionInput,
  TemporalDriftProjectionResult,
  TemporalDriftSnapshot,
  TrajectoryDirection,
  TrendStrength,
} from "./temporalDriftProjectionTypes";
import type {
  EnterpriseTemporalSnapshot,
  StrategicTimelineSequence,
} from "./temporalCognitionTypes";

const DEV_LOG_PREFIX = "[Nexora][TemporalDriftProjection]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildProjectionId(category: ProjectionCategory, direction: TrajectoryDirection): string {
  return stableSignature(["temporal-drift-projection", category, direction]).slice(0, 56);
}

function countCategorySignals(
  events: readonly { category: string }[],
  category: string
): number {
  return events.filter((e) => e.category === category).length;
}

function buildAdaptiveGrowthProjection(
  replays: readonly OperationalReplaySequence[],
  maturityTrend: string | undefined,
  now: number
): TemporalDriftProjection | null {
  const recoveryReplay = replays.find(
    (r) => r.replayCategory === "resilience" || r.replayCategory === "recovery"
  );
  const resolved = replays.some((r) => r.replayState === "resolved" || r.replayState === "recovering");
  const improving = maturityTrend === "improving" || maturityTrend === "accelerating";

  if (!recoveryReplay && !resolved && !improving) return null;

  const trendStrength: TrendStrength =
    maturityTrend === "accelerating" ? "accelerating" : recoveryReplay ? "strong" : "moderate";
  const confidence = Number(Math.min(0.94, 0.8 + (improving ? 0.06 : 0)).toFixed(2));

  return {
    projectionId: buildProjectionId("resilience", "adaptive_growth"),
    category: "resilience",
    trajectoryDirection: "adaptive_growth",
    trendStrength,
    summary:
      "Operational resilience and governance stabilization patterns indicate gradual organizational adaptation and improved recovery consistency.",
    supportingSignals: Object.freeze([
      "reduced_escalation_frequency",
      "improved_pressure_absorption",
      "faster_operational_recovery",
    ]),
    confidence,
    confidenceLevel: confidenceToTrajectoryLevel(confidence),
    generatedAt: now,
    lastObservedAt: recoveryReplay?.lastObservedAt ?? now,
    occurrenceCount: 1,
  };
}

function buildDegradingProjection(
  events: readonly { category: string }[],
  fragilityElevated: boolean,
  sequences: readonly StrategicTimelineSequence[],
  now: number
): TemporalDriftProjection | null {
  const fragilityCount = countCategorySignals(events, "fragility");
  const escalating = sequences.some(
    (s) => s.timelineState === "escalating" || s.sequenceType === "cascading"
  );

  if (fragilityCount < 1 && !fragilityElevated && !escalating) return null;

  const increasing = fragilityCount >= 2 || fragilityElevated;
  if (!increasing) return null;

  const confidence = fragilityElevated ? 0.84 : 0.76;
  return {
    projectionId: buildProjectionId("fragility", "degrading"),
    category: "fragility",
    trajectoryDirection: "degrading",
    trendStrength: fragilityCount >= 2 ? "strong" : "moderate",
    summary:
      "Increasing fragility signals across temporal chronology indicate a degrading organizational trajectory with accumulating operational vulnerability.",
    supportingSignals: Object.freeze([
      "fragility_accumulation",
      "pressure_concentration",
      "coordination_stress",
    ]),
    confidence,
    confidenceLevel: confidenceToTrajectoryLevel(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildUnstableProjection(
  chains: readonly OperationalCausalChain[],
  sequences: readonly StrategicTimelineSequence[],
  now: number
): TemporalDriftProjection | null {
  const cascading =
    chains.some(
      (c) => c.propagationType === "cascading" || c.dependencyStrength === "systemic"
    ) || sequences.some((s) => s.sequenceType === "cascading");
  const escalationHeavy = countCategorySignals(
    sequences.map((s) => ({ category: s.category })),
    "escalation"
  );

  if (!cascading && escalationHeavy < 1) return null;

  const confidence = cascading ? 0.88 : 0.78;
  return {
    projectionId: buildProjectionId("escalation", "unstable"),
    category: "escalation",
    trajectoryDirection: "unstable",
    trendStrength: cascading ? "accelerating" : "strong",
    summary:
      "Persistent escalation concentration and cascading dependency propagation indicate an unstable operational direction.",
    supportingSignals: Object.freeze([
      "escalation_concentration",
      "cascading_propagation",
      "coordination_instability",
    ]),
    confidence,
    confidenceLevel: confidenceToTrajectoryLevel(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildStabilizingProjection(
  chains: readonly OperationalCausalChain[],
  continuityPreserved: boolean,
  now: number
): TemporalDriftProjection | null {
  const governanceChain = chains.find((c) => c.category === "governance");
  if (!governanceChain && continuityPreserved) return null;

  const confidence = governanceChain?.confidence ?? (continuityPreserved ? 0.72 : 0.8);
  return {
    projectionId: buildProjectionId("governance", "stabilizing"),
    category: "governance",
    trajectoryDirection: "stabilizing",
    trendStrength: governanceChain ? "strong" : "moderate",
    summary:
      "Governance stabilization consistency across causal and temporal layers suggests a stabilizing organizational trajectory.",
    supportingSignals: Object.freeze([
      "governance_alignment",
      "pressure_containment",
      "executive_stability",
    ]),
    confidence,
    confidenceLevel: confidenceToTrajectoryLevel(confidence),
    generatedAt: now,
    lastObservedAt: governanceChain?.lastObservedAt ?? now,
    occurrenceCount: 1,
  };
}

function buildRecoveringProjection(
  temporalSnapshot: EnterpriseTemporalSnapshot | null,
  replays: readonly OperationalReplaySequence[],
  now: number
): TemporalDriftProjection | null {
  const recoveringTimeline = temporalSnapshot?.dominantTimelineState === "recovering";
  const recoveringReplay = replays.some((r) => r.replayState === "recovering" || r.replayState === "resolved");
  const pressureReduced =
    temporalSnapshot?.dominantCategories.includes("recovery") ||
    temporalSnapshot?.dominantCategories.includes("resilience");

  if (!recoveringTimeline && !recoveringReplay && !pressureReduced) return null;

  const confidence = recoveringReplay ? 0.85 : 0.74;
  return {
    projectionId: buildProjectionId("resilience", "recovering"),
    category: "resilience",
    trajectoryDirection: "recovering",
    trendStrength: recoveringReplay ? "strong" : "moderate",
    summary:
      "Reduced operational pressure spread and recovery replay progression indicate a recovering organizational direction.",
    supportingSignals: Object.freeze([
      "pressure_reduction",
      "recovery_acceleration",
      "resilience_strengthening",
    ]),
    confidence,
    confidenceLevel: confidenceToTrajectoryLevel(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildFragileDriftProjection(
  replays: readonly OperationalReplaySequence[],
  sequences: readonly StrategicTimelineSequence[],
  now: number
): TemporalDriftProjection | null {
  const cyclical = sequences.some((s) => s.sequenceType === "cyclical" || s.sequenceType === "recurring");
  const unresolved = replays.some(
    (r) => r.replayState === "propagating" || r.replayState === "destabilizing"
  );

  if (!cyclical && !unresolved) return null;

  const confidence = 0.8;
  return {
    projectionId: buildProjectionId("operational", "fragile"),
    category: "operational",
    trajectoryDirection: "fragile",
    trendStrength: cyclical ? "accelerating" : "moderate",
    summary:
      "Repeated unresolved degradation and cyclical instability patterns project fragile organizational drift without sustained stabilization.",
    supportingSignals: Object.freeze([
      "cyclical_degradation",
      "unresolved_instability",
      "recurring_pressure",
    ]),
    confidence,
    confidenceLevel: confidenceToTrajectoryLevel(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildStagnatingProjection(
  maturityTrend: string | undefined,
  projectionCount: number,
  now: number
): TemporalDriftProjection | null {
  if (maturityTrend !== "stagnant" && maturityTrend !== "inconsistent" && projectionCount >= 2) {
    return null;
  }
  if (maturityTrend !== "stagnant") return null;

  const confidence = 0.68;
  return {
    projectionId: buildProjectionId("strategic", "stagnating"),
    category: "strategic",
    trajectoryDirection: "stagnating",
    trendStrength: "weak",
    summary:
      "Institutional maturity stagnation suggests limited operational evolution momentum across the enterprise trajectory horizon.",
    supportingSignals: Object.freeze(["maturity_stagnation", "limited_adaptation"]),
    confidence,
    confidenceLevel: confidenceToTrajectoryLevel(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildTrajectorySignals(
  projections: TemporalDriftProjection[],
  now: number
): EnterpriseTrajectorySignal[] {
  return projections.slice(0, 4).map((p) => ({
    signalId: stableSignature(["trajectory-signal", p.projectionId]).slice(0, 48),
    category: p.category,
    trajectoryDirection: p.trajectoryDirection,
    trendStrength: p.trendStrength,
    summary: p.summary.slice(0, 160),
    confidence: p.confidence,
    generatedAt: now,
  }));
}

function buildFutureDirections(
  projections: TemporalDriftProjection[],
  now: number
): OrganizationalFutureDirection[] {
  const dominant = projections[0];
  if (!dominant) return [];

  return [
    {
      directionId: stableSignature(["future-direction", dominant.projectionId]).slice(0, 48),
      trajectoryDirection: dominant.trajectoryDirection,
      dominantCategory: dominant.category,
      directionSummary: dominant.summary.slice(0, 180),
      projectionIds: Object.freeze(projections.slice(0, 4).map((p) => p.projectionId)),
      generatedAt: now,
    },
  ];
}

function buildEvolutionTrends(
  projections: TemporalDriftProjection[],
  now: number
): StrategicEvolutionTrend[] {
  return projections.slice(0, 4).map((p) => ({
    trendId: stableSignature(["evolution-trend", p.projectionId]).slice(0, 48),
    category: p.category,
    trajectoryDirection: p.trajectoryDirection,
    trendStrength: p.trendStrength,
    evolutionSummary: p.summary.slice(0, 160),
    linkedProjectionIds: Object.freeze([p.projectionId]),
    generatedAt: now,
  }));
}

function buildDriftForecasts(
  projections: TemporalDriftProjection[],
  now: number
): OperationalDriftForecast[] {
  return projections.slice(0, 4).map((p) => ({
    forecastId: stableSignature(["drift-forecast", p.projectionId]).slice(0, 48),
    category: p.category,
    trajectoryDirection: p.trajectoryDirection,
    driftSummary: p.summary.slice(0, 160),
    momentumSignals: p.supportingSignals,
    generatedAt: now,
  }));
}

function buildDriftSnapshot(
  organizationId: string,
  projections: TemporalDriftProjection[],
  signals: EnterpriseTrajectorySignal[],
  directions: OrganizationalFutureDirection[],
  trends: StrategicEvolutionTrend[],
  forecasts: OperationalDriftForecast[],
  now: number
): TemporalDriftSnapshot {
  const dominant = projections[0];
  const signature = stableSignature([
    "d9-3-4-drift-snapshot",
    organizationId,
    projections.length,
    dominant?.projectionId ?? "none",
    dominant?.trajectoryDirection ?? "stagnating",
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    projectionCount: projections.length,
    trajectorySummary:
      dominant?.summary ??
      "Enterprise future trajectory awareness awaiting sufficient temporal cognition depth.",
    dominantDirection: dominant?.trajectoryDirection ?? "stagnating",
    dominantCategory: dominant?.category ?? "unknown",
    dominantTrendStrength: dominant?.trendStrength ?? "weak",
    recentProjections: Object.freeze(projections.slice(0, 6)),
    trajectorySignals: Object.freeze(signals),
    futureDirections: Object.freeze(directions),
    evolutionTrends: Object.freeze(trends),
    driftForecasts: Object.freeze(forecasts),
  };
}

function rankProjections(projections: TemporalDriftProjection[]): TemporalDriftProjection[] {
  const order: TrajectoryDirection[] = [
    "adaptive_growth",
    "recovering",
    "stabilizing",
    "stagnating",
    "fragile",
    "degrading",
    "unstable",
  ];
  return [...projections].sort((a, b) => {
    const dirDiff = order.indexOf(a.trajectoryDirection) - order.indexOf(b.trajectoryDirection);
    if (dirDiff !== 0) return dirDiff;
    return b.confidence - a.confidence;
  });
}

export function evaluateTemporalDriftProjection(
  input: TemporalDriftProjectionInput
): TemporalDriftProjectionResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();

  if (!beginTemporalDriftEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursive_drift_guard",
      snapshot: null,
      newProjections: 0,
      storeSignature: "",
    };
  }

  try {
    const store = getTemporalDriftProjectionStore(organizationId);
    const prior = store.getState();
    const temporalState = getTemporalCognitionStore(organizationId).getState();
    const causalState = getCausalDependencyStore(organizationId).getState();
    const replayState = getOperationalReplayStore(organizationId).getState();
    const temporalSnapshot = input.temporalSnapshot ?? temporalState.snapshots[0] ?? null;
    const causalSnapshot = input.causalSnapshot ?? causalState.snapshots[0] ?? null;
    const replaySnapshot = input.replaySnapshot ?? replayState.snapshots[0] ?? null;
    const maturitySnapshot = input.maturitySnapshot ?? null;

    const evaluationSignature = stableSignature([
      "d9-3-4-drift-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      temporalSnapshot?.signature ?? temporalState.signature,
      causalSnapshot?.signature ?? causalState.signature,
      replaySnapshot?.signature ?? replayState.signature,
      maturitySnapshot?.signature ?? "no-maturity",
      input.fragilityElevated ? "fragile" : "stable",
    ]);

    if (
      !shouldEvaluateTemporalDrift(
        organizationId,
        evaluationSignature,
        prior.lastEvaluationSignature,
        now
      )
    ) {
      return {
        evaluated: false,
        skipped: true,
        reason: "paced_or_unchanged",
        snapshot: prior.snapshots[0] ?? null,
        newProjections: 0,
        storeSignature: prior.signature,
      };
    }

    const events = temporalSnapshot?.recentEvents ?? temporalState.events;
    const sequences = temporalSnapshot?.recentSequences ?? temporalState.sequences;
    const chains = causalSnapshot?.recentChains ?? causalState.chains;
    const replays = replaySnapshot?.recentReplays ?? replayState.replays;

    const depth =
      events.length + sequences.length + chains.length + replays.length;

    if (depth < 3) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_trajectory_depth",
        snapshot: prior.snapshots[0] ?? null,
        newProjections: 0,
        storeSignature: prior.signature,
      };
    }

    const maturityTrend = maturitySnapshot?.dominantEvolutionTrend;
    const candidates: TemporalDriftProjection[] = [];

    const adaptive = buildAdaptiveGrowthProjection(replays, maturityTrend, now);
    if (adaptive) candidates.push(adaptive);

    const degrading = buildDegradingProjection(
      events,
      input.fragilityElevated ?? false,
      sequences,
      now
    );
    if (degrading) candidates.push(degrading);

    const unstable = buildUnstableProjection(chains, sequences, now);
    if (unstable) candidates.push(unstable);

    const stabilizing = buildStabilizingProjection(
      chains,
      input.continuityPreserved !== false,
      now
    );
    if (stabilizing) candidates.push(stabilizing);

    const recovering = buildRecoveringProjection(temporalSnapshot, replays, now);
    if (recovering) candidates.push(recovering);

    const fragile = buildFragileDriftProjection(replays, sequences, now);
    if (fragile) candidates.push(fragile);

    const stagnating = buildStagnatingProjection(maturityTrend, candidates.length, now);
    if (stagnating) candidates.push(stagnating);

    const retained = rankProjections(candidates.filter(shouldRetainDriftProjection));
    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_projections",
        snapshot: prior.snapshots[0] ?? null,
        newProjections: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.projections.map((p) => p.projectionId));
    const newCount = retained.filter((p) => !priorIds.has(p.projectionId)).length;

    store.upsertProjections(retained, now);

    const signals = buildTrajectorySignals(retained, now);
    store.upsertSignals(signals, now);

    const directions = buildFutureDirections(retained, now);
    store.upsertFutureDirections(directions, now);

    const trends = buildEvolutionTrends(retained, now);
    store.upsertEvolutionTrends(trends, now);

    const forecasts = buildDriftForecasts(retained, now);
    store.upsertForecasts(forecasts, now);

    const snapshot = buildDriftSnapshot(
      organizationId,
      retained,
      signals,
      directions,
      trends,
      forecasts,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();
    const priorDirection = prior.snapshots[0]?.dominantDirection;
    const newDirection = snapshot.dominantDirection;

    if (priorDirection && priorDirection !== newDirection) {
      devLog(`trajectory transition — ${priorDirection} → ${newDirection}`);
    }
    if (adaptive) {
      devLog(`resilience growth — ${adaptive.summary.slice(0, 72)}`);
    }
    if (unstable || degrading) {
      devLog(`instability trend — ${(unstable ?? degrading)!.trajectoryDirection}`);
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newProjections: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endTemporalDriftEvaluation();
  }
}
