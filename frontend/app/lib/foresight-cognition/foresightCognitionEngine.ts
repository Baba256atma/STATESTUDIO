import { stableSignature } from "../intelligence/shared/dedupe";
import { getTemporalDriftProjectionStore } from "../temporal-cognition/temporalDriftProjectionStore";
import { getTemporalConvergenceStore } from "../temporal-cognition/temporalConvergenceStore";
import { getMultiTimelineStore } from "../temporal-cognition/multiTimelineStore";
import {
  beginForesightCognitionEvaluation,
  confidenceToForesightLevel,
  emergenceRank,
  endForesightCognitionEvaluation,
  shouldEvaluateForesightCognition,
  shouldRetainEmergingSignal,
} from "./foresightCognitionGuards";
import { getForesightCognitionStore } from "./foresightCognitionStore";
import type { TemporalDriftProjection } from "../temporal-cognition/temporalDriftProjectionTypes";
import type { StabilityConvergencePattern } from "../temporal-cognition/temporalConvergenceTypes";
import type { OrganizationalTimelineBranch } from "../temporal-cognition/multiTimelineTypes";
import type {
  AnticipatoryOperationalPattern,
  EmergingStrategicSignal,
  EmergenceLevel,
  EnterpriseForesightSnapshot,
  ExecutiveStrategicForesightInput,
  ExecutiveStrategicForesightResult,
  ForesightAwarenessSummary,
  ForesightCategory,
  ForesightState,
  OrganizationalFutureIndicator,
  StrategicPressureEmergence,
  WeakSignalDetection,
} from "./foresightCognitionTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";

const DEV_LOG_PREFIX = "[Nexora][ForesightCognition]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildForesightId(category: ForesightCategory, level: EmergenceLevel): string {
  return stableSignature(["emerging-strategic-signal", category, level]).slice(0, 56);
}

function dedupeWeakSignals(signals: string[]): readonly string[] {
  return Object.freeze(Array.from(new Set(signals)).slice(0, 6));
}

function createEmergingSignal(
  category: ForesightCategory,
  emergenceLevel: EmergenceLevel,
  foresightState: ForesightState,
  summary: string,
  weakSignals: string[],
  confidence: number,
  now: number
): EmergingStrategicSignal {
  const conf = Number(Math.min(0.92, Math.max(0.5, confidence)).toFixed(2));
  return {
    foresightId: buildForesightId(category, emergenceLevel),
    category,
    emergenceLevel,
    foresightState,
    summary,
    weakSignals: dedupeWeakSignals(weakSignals),
    confidence: conf,
    confidenceLevel: confidenceToForesightLevel(conf),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildEmergingFragilitySignal(
  temporal: EnterpriseTimeIntelligenceSnapshot | null,
  projections: readonly TemporalDriftProjection[],
  fragilityElevated: boolean,
  memoryConcern: boolean,
  now: number
): EmergingStrategicSignal | null {
  const degrading = projections.some(
    (p) => p.trajectoryDirection === "degrading" || p.trajectoryDirection === "unstable"
  );
  const fragileHorizon =
    temporal?.summary.longHorizonSignal.includes("fragility") ||
    temporal?.summary.resilienceDirection === "at_risk";
  if (!fragilityElevated && !degrading && !memoryConcern && !fragileHorizon) return null;

  return createEmergingSignal(
    "fragility",
    fragilityElevated && degrading ? "strengthening" : "developing",
    "accumulating",
    "Operational fragility indicators are gradually strengthening across dependent coordination systems, suggesting emerging escalation potential.",
    [
      "pressure_growth",
      "coordination_degradation",
      "slow_fragility_accumulation",
    ],
    fragilityElevated && degrading ? 0.84 : 0.76,
    now
  );
}

function buildGovernanceConcernSignal(
  temporal: EnterpriseTimeIntelligenceSnapshot | null,
  convergence: readonly StabilityConvergencePattern[],
  continuityPreserved: boolean,
  narrativeLine: string,
  now: number
): EmergingStrategicSignal | null {
  const govDrift = convergence.some(
    (p) => p.category === "governance_stabilization" && p.alignmentState === "emerging"
  );
  const unstableRuntime =
    temporal?.runtimeStatus === "degraded" || temporal?.runtimeStatus === "unstable";
  const narrativeGov =
    narrativeLine.includes("governance") && narrativeLine.includes("delay");
  if (!govDrift && continuityPreserved && !unstableRuntime && !narrativeGov) return null;

  return createEmergingSignal(
    "governance",
    unstableRuntime ? "strengthening" : "developing",
    "accumulating",
    "Governance coordination signals indicate emerging instability drift with accumulating oversight delays across operational layers.",
    [
      "governance_delay_growth",
      "oversight_fragmentation",
      "anticipatory_governance_concern",
    ],
    unstableRuntime ? 0.8 : 0.72,
    now
  );
}

function buildResilienceDeteriorationSignal(
  temporal: EnterpriseTimeIntelligenceSnapshot | null,
  projections: readonly TemporalDriftProjection[],
  resilienceForecastLine: string,
  now: number
): EmergingStrategicSignal | null {
  const weakening =
    temporal?.summary.resilienceDirection === "at_risk" ||
    projections.some((p) => p.trajectoryDirection === "fragile" || p.trajectoryDirection === "stagnating");
  const forecastWeak =
    resilienceForecastLine.includes("risk") ||
    resilienceForecastLine.includes("weaken") ||
    resilienceForecastLine.includes("declin");
  if (!weakening && !forecastWeak) return null;

  return createEmergingSignal(
    "recovery",
    weakening && forecastWeak ? "strengthening" : "developing",
    "intensifying",
    "Recovery and resilience indicators are gradually weakening, suggesting emerging deterioration before full operational impact materializes.",
    [
      "recovery_weakening",
      "resilience_deterioration",
      "slow_operational_decline",
    ],
    weakening ? 0.81 : 0.73,
    now
  );
}

function buildEscalationPrecursorSignal(
  projections: readonly TemporalDriftProjection[],
  branches: readonly OrganizationalTimelineBranch[],
  pressureStressed: boolean,
  now: number
): EmergingStrategicSignal | null {
  const escalating =
    projections.some(
      (p) => p.trajectoryDirection === "unstable" || p.trajectoryDirection === "degrading"
    ) ||
    branches.some((b) => b.branchType === "escalation" || b.branchType === "systemic_fragility");
  if (!escalating && !pressureStressed) return null;

  return createEmergingSignal(
    "escalation",
    pressureStressed && escalating ? "significant" : "developing",
    "accumulating",
    "Pressure concentration is slowly spreading across operational dependencies, indicating an emerging escalation trajectory before visible crisis formation.",
    [
      "pressure_concentration",
      "escalation_precursor",
      "dependency_propagation",
    ],
    escalating ? 0.83 : 0.74,
    now
  );
}

function buildAdaptiveResilienceEmergence(
  convergence: readonly StabilityConvergencePattern[],
  temporal: EnterpriseTimeIntelligenceSnapshot | null,
  maturityTrend: string | undefined,
  now: number
): EmergingStrategicSignal | null {
  const resilient =
    convergence.some(
      (p) =>
        p.category === "resilience_alignment" ||
        p.category === "recovery_synchronization" ||
        p.category === "escalation_decay"
    );
  const strengthening = temporal?.summary.resilienceDirection === "strengthening";
  const improving = maturityTrend === "improving" || maturityTrend === "accelerating";
  if (!resilient && !strengthening && !improving) return null;

  return createEmergingSignal(
    "resilience",
    resilient && improving ? "significant" : "strengthening",
    "stabilizing",
    "Operational coordination and convergence signals indicate adaptive resilience emergence strengthening steadily across anticipatory horizons.",
    [
      "coordination_improvement",
      "resilience_emergence",
      "adaptive_strengthening",
    ],
    resilient ? 0.86 : 0.78,
    now
  );
}

function buildStabilizingEnterpriseSignal(
  convergence: readonly StabilityConvergencePattern[],
  temporal: EnterpriseTimeIntelligenceSnapshot | null,
  now: number
): EmergingStrategicSignal | null {
  const decay = convergence.some((p) => p.category === "escalation_decay");
  const stable =
    temporal?.runtimeStatus === "stable" || temporal?.runtimeStatus === "recovering";
  if (!decay && !stable) return null;

  return createEmergingSignal(
    "operational",
    decay && stable ? "significant" : "developing",
    "dissipating",
    "Escalation frequency is slowly decreasing while temporal runtime stabilizes, indicating dissipating enterprise pressure across operational horizons.",
    [
      "escalation_frequency_decline",
      "pressure_decay",
      "stabilizing_trajectory",
    ],
    decay ? 0.85 : 0.76,
    now
  );
}

function buildOperationalDegradationSignal(
  temporal: EnterpriseTimeIntelligenceSnapshot | null,
  projections: readonly TemporalDriftProjection[],
  now: number
): EmergingStrategicSignal | null {
  const stagnating = projections.some((p) => p.trajectoryDirection === "stagnating");
  const evolving = temporal?.summary.organizationalEvolutionState === "fragmenting";
  if (!stagnating && !evolving) return null;

  return createEmergingSignal(
    "operational",
    evolving ? "strengthening" : "developing",
    "emerging",
    "Slow-moving operational deterioration tendencies are emerging across drift and evolution layers before full degradation becomes visible.",
    [
      "operational_degradation",
      "stagnation_drift",
      "slow_deterioration",
    ],
    evolving ? 0.79 : 0.71,
    now
  );
}

function buildStrategicPressureAccumulation(
  temporal: EnterpriseTimeIntelligenceSnapshot | null,
  pressureStressed: boolean,
  memoryCount: number,
  now: number
): EmergingStrategicSignal | null {
  const accumulating =
    temporal?.summary.temporalContinuity === "shifting" ||
    temporal?.summary.organizationalEvolutionState === "emerging";
  if (!accumulating && !pressureStressed && memoryCount < 3) return null;

  return createEmergingSignal(
    "strategic",
    pressureStressed ? "strengthening" : "developing",
    "accumulating",
    "Strategic operational pressures are accumulating across institutional memory and temporal continuity layers, forming anticipatory enterprise conditions.",
    [
      "strategic_pressure_accumulation",
      "continuity_shift",
      "emerging_conditions",
    ],
    pressureStressed ? 0.8 : 0.72,
    now
  );
}

function rankEmergingSignals(signals: EmergingStrategicSignal[]): EmergingStrategicSignal[] {
  return [...signals]
    .sort(
      (a, b) =>
        emergenceRank(b.emergenceLevel) - emergenceRank(a.emergenceLevel) ||
        b.confidence - a.confidence
    )
    .slice(0, 6);
}

function buildWeakSignalDetections(
  signals: EmergingStrategicSignal[],
  now: number
): WeakSignalDetection[] {
  return signals.slice(0, 4).map((s) => ({
    detectionId: stableSignature(["weak-signal", s.foresightId]).slice(0, 48),
    category: s.category,
    signalLabel: `${s.category} weak signal`,
    signalSummary: s.summary.slice(0, 100),
    emergenceLevel: s.emergenceLevel,
    confidence: s.confidence,
    generatedAt: now,
  }));
}

function buildAnticipatoryPatterns(
  signals: EmergingStrategicSignal[],
  now: number
): AnticipatoryOperationalPattern[] {
  return signals.slice(0, 3).map((s) => ({
    patternId: stableSignature(["anticipatory-pattern", s.foresightId]).slice(0, 48),
    category: s.category,
    patternLabel: `${s.category} anticipatory pattern`,
    patternSummary: s.summary.slice(0, 120),
    linkedForesightIds: Object.freeze([s.foresightId]),
    emergenceLevel: s.emergenceLevel,
    generatedAt: now,
  }));
}

function buildPressureEmergences(
  signals: EmergingStrategicSignal[],
  now: number
): StrategicPressureEmergence[] {
  return signals
    .filter((s) => s.category === "escalation" || s.category === "strategic" || s.category === "fragility")
    .slice(0, 3)
    .map((s) => ({
      emergenceId: stableSignature(["pressure-emergence", s.foresightId]).slice(0, 48),
      category: s.category,
      pressureSummary: s.summary.slice(0, 120),
      pressureSignals: s.weakSignals,
      emergenceLevel: s.emergenceLevel,
      generatedAt: now,
    }));
}

function buildFutureIndicators(
  signals: EmergingStrategicSignal[],
  now: number
): OrganizationalFutureIndicator[] {
  return signals.slice(0, 4).map((s) => ({
    indicatorId: stableSignature(["future-indicator", s.foresightId]).slice(0, 48),
    category: s.category,
    indicatorLabel: `${s.category} future indicator`,
    trajectoryHint: s.foresightState,
    foresightState: s.foresightState,
    confidence: s.confidence,
    generatedAt: now,
  }));
}

function buildAwarenessSummary(signals: EmergingStrategicSignal[]): ForesightAwarenessSummary {
  const dominant = signals[0];
  const escalationRisk = signals.some(
    (s) =>
      (s.category === "escalation" || s.category === "fragility") &&
      (s.emergenceLevel === "strengthening" || s.emergenceLevel === "significant")
  );
  const resiliencePositive = signals.some(
    (s) => s.category === "resilience" && s.foresightState === "stabilizing"
  );

  return {
    dominantCategory: dominant?.category ?? "unknown",
    dominantEmergenceLevel: dominant?.emergenceLevel ?? "weak",
    dominantForesightState: dominant?.foresightState ?? "emerging",
    anticipatoryHeadline: dominant
      ? dominant.summary.slice(0, 140)
      : "Anticipatory foresight awareness pending sufficient signal depth.",
    preEscalationRisk: escalationRisk ? "elevated" : signals.length >= 2 ? "moderate" : "low",
    resilienceEmergence: resiliencePositive
      ? "strengthening"
      : signals.some((s) => s.category === "recovery" && s.foresightState === "intensifying")
        ? "weakening"
        : "neutral",
  };
}

function buildForesightSnapshot(
  organizationId: string,
  signals: EmergingStrategicSignal[],
  weakDetections: WeakSignalDetection[],
  patterns: AnticipatoryOperationalPattern[],
  pressures: StrategicPressureEmergence[],
  indicators: OrganizationalFutureIndicator[],
  now: number
): EnterpriseForesightSnapshot {
  const awarenessSummary = buildAwarenessSummary(signals);
  const signature = stableSignature([
    "d9-4-1-enterprise-foresight",
    organizationId,
    signals.map((s) => s.foresightId),
    awarenessSummary.preEscalationRisk,
    now,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    signalCount: signals.length,
    awarenessSummary,
    recentEmergingSignals: Object.freeze(signals),
    weakSignalDetections: Object.freeze(weakDetections),
    anticipatoryPatterns: Object.freeze(patterns),
    pressureEmergences: Object.freeze(pressures),
    futureIndicators: Object.freeze(indicators),
  };
}

/**
 * D9:4:1 — Passive executive strategic foresight + anticipatory cognition evaluation.
 */
export function evaluateExecutiveStrategicForesight(
  input: ExecutiveStrategicForesightInput
): ExecutiveStrategicForesightResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();
  const store = getForesightCognitionStore(organizationId);

  if (!beginForesightCognitionEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: store.getState().snapshots[0] ?? null,
      newEmergingSignals: 0,
      storeSignature: store.getState().signature,
    };
  }

  try {
    const prior = store.getState();
    const driftState = getTemporalDriftProjectionStore(organizationId).getState();
    const convergenceState = getTemporalConvergenceStore(organizationId).getState();
    const multiState = getMultiTimelineStore(organizationId).getState();

    const temporalSnapshot = input.temporalSnapshot ?? null;
    const driftSnapshot = input.driftSnapshot ?? driftState.snapshots[0] ?? null;
    const convergenceSnapshot =
      input.convergenceSnapshot ?? convergenceState.snapshots[0] ?? null;
    const divergenceSnapshot = input.divergenceSnapshot ?? multiState.snapshots[0] ?? null;

    const evaluationSignature = stableSignature([
      "d9-4-1-foresight-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      temporalSnapshot?.signature ?? "no-temporal",
      driftSnapshot?.signature ?? driftState.signature,
      convergenceSnapshot?.signature ?? convergenceState.signature,
      divergenceSnapshot?.signature ?? multiState.signature,
      input.memorySnapshot?.signature ?? "no-memory",
      input.maturitySnapshot?.signature ?? "no-maturity",
      input.resilienceForecastLine ?? "no-forecast",
    ]);

    if (
      !shouldEvaluateForesightCognition(
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
        newEmergingSignals: 0,
        storeSignature: prior.signature,
      };
    }

    const anticipatoryDepth =
      (temporalSnapshot?.activeSubsystems.length ?? 0) +
      (driftSnapshot?.projectionCount ?? driftState.projections.length) +
      (convergenceSnapshot?.convergenceCount ?? convergenceState.patterns.length) +
      (divergenceSnapshot?.branchCount ?? multiState.branches.length) +
      (input.memorySnapshot?.memoryCount ?? 0);

    if (anticipatoryDepth < 5) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_anticipatory_depth",
        snapshot: prior.snapshots[0] ?? null,
        newEmergingSignals: 0,
        storeSignature: prior.signature,
      };
    }

    const projections = driftSnapshot?.recentProjections ?? driftState.projections;
    const convergence =
      convergenceSnapshot?.recentConvergencePatterns ?? convergenceState.patterns;
    const branches = divergenceSnapshot?.timelineBranches ?? multiState.branches;
    const maturityTrend = input.maturitySnapshot?.dominantEvolutionTrend;
    const narrativeLine = input.enterpriseNarrativeLine ?? "";
    const resilienceForecastLine = input.resilienceForecastLine ?? "";
    const memoryConcern = input.memorySnapshot?.continuityConcernActive ?? false;

    const candidates: EmergingStrategicSignal[] = [];

    const fragility = buildEmergingFragilitySignal(
      temporalSnapshot,
      projections,
      input.fragilityElevated ?? false,
      memoryConcern,
      now
    );
    if (fragility) candidates.push(fragility);

    const governance = buildGovernanceConcernSignal(
      temporalSnapshot,
      convergence,
      input.continuityPreserved ?? true,
      narrativeLine,
      now
    );
    if (governance) candidates.push(governance);

    const resilienceDecay = buildResilienceDeteriorationSignal(
      temporalSnapshot,
      projections,
      resilienceForecastLine,
      now
    );
    if (resilienceDecay) candidates.push(resilienceDecay);

    const escalation = buildEscalationPrecursorSignal(
      projections,
      branches,
      input.pressureTopologyStressed ?? false,
      now
    );
    if (escalation) candidates.push(escalation);

    const resilienceEmergence = buildAdaptiveResilienceEmergence(
      convergence,
      temporalSnapshot,
      maturityTrend,
      now
    );
    if (resilienceEmergence) candidates.push(resilienceEmergence);

    const stabilizing = buildStabilizingEnterpriseSignal(convergence, temporalSnapshot, now);
    if (stabilizing) candidates.push(stabilizing);

    const degradation = buildOperationalDegradationSignal(temporalSnapshot, projections, now);
    if (degradation) candidates.push(degradation);

    const strategicPressure = buildStrategicPressureAccumulation(
      temporalSnapshot,
      input.pressureTopologyStressed ?? false,
      input.memorySnapshot?.memoryCount ?? 0,
      now
    );
    if (strategicPressure) candidates.push(strategicPressure);

    const retained = rankEmergingSignals(candidates.filter(shouldRetainEmergingSignal));
    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_emerging_signals",
        snapshot: prior.snapshots[0] ?? null,
        newEmergingSignals: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.emergingSignals.map((s) => s.foresightId));
    const newCount = retained.filter((s) => !priorIds.has(s.foresightId)).length;

    store.upsertEmergingSignals(retained, now);

    const weakDetections = buildWeakSignalDetections(retained, now);
    store.upsertWeakSignalDetections(weakDetections, now);

    const patterns = buildAnticipatoryPatterns(retained, now);
    store.upsertAnticipatoryPatterns(patterns, now);

    const pressures = buildPressureEmergences(retained, now);
    store.upsertPressureEmergences(pressures, now);

    const indicators = buildFutureIndicators(retained, now);
    store.upsertFutureIndicators(indicators, now);

    const snapshot = buildForesightSnapshot(
      organizationId,
      retained,
      weakDetections,
      patterns,
      pressures,
      indicators,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (fragility && fragility.emergenceLevel !== "weak") {
      devLog(`emerging instability — ${fragility.weakSignals[0]}`);
    }
    if (resilienceEmergence) {
      devLog(`resilience strengthening emergence — ${resilienceEmergence.emergenceLevel}`);
    }
    if (
      prior.snapshots[0]?.awarenessSummary.dominantForesightState !==
      snapshot.awarenessSummary.dominantForesightState
    ) {
      devLog(
        `anticipatory transition — ${snapshot.awarenessSummary.dominantForesightState} (${snapshot.awarenessSummary.preEscalationRisk} risk)`
      );
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newEmergingSignals: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endForesightCognitionEvaluation();
  }
}
