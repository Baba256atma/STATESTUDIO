import { stableSignature } from "../intelligence/shared/dedupe";
import { getForesightCognitionStore } from "./foresightCognitionStore";
import { getTemporalConvergenceStore } from "../temporal-cognition/temporalConvergenceStore";
import { getTemporalDriftProjectionStore } from "../temporal-cognition/temporalDriftProjectionStore";
import type { EmergingStrategicSignal } from "./foresightCognitionTypes";
import type { StabilityConvergencePattern } from "../temporal-cognition/temporalConvergenceTypes";
import type { TemporalDriftProjection } from "../temporal-cognition/temporalDriftProjectionTypes";
import {
  beginRiskConstellationEvaluation,
  confidenceToConstellationLevel,
  correlationRank,
  endRiskConstellationEvaluation,
  shouldEvaluateRiskConstellation,
  shouldRetainRiskConstellation,
} from "./riskConstellationGuards";
import { getRiskConstellationStore } from "./riskConstellationStore";
import type {
  ConstellationCategory,
  ConstellationState,
  CorrelationStrength,
  DistributedInstabilityPattern,
  EnterpriseRiskConstellation,
  MultiSignalPressureCluster,
  RiskConstellationAwarenessSummary,
  RiskConstellationSnapshot,
  StrategicRiskEmergence,
  WeakSignalCorrelation,
  WeakSignalCorrelationInput,
  WeakSignalCorrelationResult,
} from "./riskConstellationTypes";
import type { EnterpriseForesightSnapshot } from "./foresightCognitionTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";

const DEV_LOG_PREFIX = "[Nexora][RiskConstellation]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildConstellationId(category: ConstellationCategory, strength: CorrelationStrength): string {
  return stableSignature(["enterprise-risk-constellation", category, strength]).slice(0, 56);
}

function dedupeCorrelatedSignals(signals: string[]): readonly string[] {
  return Object.freeze(Array.from(new Set(signals)).slice(0, 6));
}

function hasSignalKeyword(signals: readonly EmergingStrategicSignal[], keywords: string[]): boolean {
  return signals.some((s) =>
    keywords.some(
      (k) =>
        s.weakSignals.some((w) => w.includes(k)) ||
        s.category.includes(k) ||
        s.summary.toLowerCase().includes(k)
    )
  );
}

function collectLinkedIds(signals: readonly EmergingStrategicSignal[]): readonly string[] {
  return Object.freeze(signals.map((s) => s.foresightId).slice(0, 6));
}

function createConstellation(
  category: ConstellationCategory,
  constellationState: ConstellationState,
  correlationStrength: CorrelationStrength,
  summary: string,
  correlatedSignals: string[],
  linkedSignalIds: readonly string[],
  confidence: number,
  now: number
): EnterpriseRiskConstellation {
  const conf = Number(Math.min(0.92, Math.max(0.5, confidence)).toFixed(2));
  return {
    constellationId: buildConstellationId(category, correlationStrength),
    category,
    constellationState,
    correlationStrength,
    summary,
    correlatedSignals: dedupeCorrelatedSignals(correlatedSignals),
    linkedSignalIds,
    confidence: conf,
    confidenceLevel: confidenceToConstellationLevel(conf),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildOperationalInstabilityCluster(
  emergingSignals: readonly EmergingStrategicSignal[],
  now: number
): EnterpriseRiskConstellation | null {
  const fragility = hasSignalKeyword(emergingSignals, ["fragility", "pressure_growth", "coordination"]);
  const coordination = hasSignalKeyword(emergingSignals, ["coordination", "degradation", "operational"]);
  if (!fragility || !coordination) return null;

  const linked = emergingSignals.filter(
    (s) => s.category === "fragility" || s.category === "operational" || s.category === "coordination"
  );

  return createConstellation(
    "fragility_cluster",
    "accumulating",
    linked.length >= 2 ? "strong" : "moderate",
    "Multiple weak operational signals are converging into an emerging fragility constellation characterized by governance delay, coordination degradation, and pressure accumulation.",
    [
      "slow_fragility_growth",
      "coordination_degradation",
      "pressure_concentration",
      "operational_instability",
    ],
    collectLinkedIds(linked),
    linked.length >= 2 ? 0.85 : 0.76,
    now
  );
}

function buildEscalationPrecursorConstellation(
  emergingSignals: readonly EmergingStrategicSignal[],
  pressureStressed: boolean,
  now: number
): EnterpriseRiskConstellation | null {
  const governance = hasSignalKeyword(emergingSignals, ["governance", "oversight", "delay"]);
  const escalation = hasSignalKeyword(emergingSignals, ["escalation", "pressure", "precursor"]);
  if ((!governance || !escalation) && !pressureStressed) return null;

  const linked = emergingSignals.filter(
    (s) => s.category === "governance" || s.category === "escalation" || s.category === "strategic"
  );

  return createConstellation(
    "escalation_network",
    "converging",
    pressureStressed && escalation ? "strong" : "moderate",
    "Governance delay and pressure accumulation are correlating into an escalation precursor constellation across distributed operational dependencies.",
    [
      "governance_instability",
      "pressure_concentration",
      "escalation_precursor",
      "dependency_propagation",
    ],
    collectLinkedIds(linked),
    pressureStressed ? 0.84 : 0.74,
    now
  );
}

function buildResilienceErosionFormation(
  emergingSignals: readonly EmergingStrategicSignal[],
  projections: readonly TemporalDriftProjection[],
  now: number
): EnterpriseRiskConstellation | null {
  const recovery = hasSignalKeyword(emergingSignals, ["recovery", "resilience", "weakening", "deterioration"]);
  const escalation = hasSignalKeyword(emergingSignals, ["escalation", "pressure", "fragility"]);
  const driftWeak = projections.some(
    (p) => p.trajectoryDirection === "fragile" || p.trajectoryDirection === "stagnating"
  );
  if ((!recovery || !escalation) && !driftWeak) return null;

  const linked = emergingSignals.filter(
    (s) => s.category === "recovery" || s.category === "resilience" || s.category === "escalation"
  );

  return createConstellation(
    "resilience_erosion",
    "intensifying",
    recovery && escalation ? "strong" : "moderate",
    "Recovery weakening combined with persistent escalation signals forms a resilience erosion constellation indicating distributed deterioration before crisis visibility.",
    [
      "recovery_weakening",
      "escalation_persistence",
      "resilience_erosion",
      "slow_operational_decline",
    ],
    collectLinkedIds(linked),
    recovery && escalation ? 0.83 : 0.72,
    now
  );
}

function buildDistributedInstabilityNetwork(
  emergingSignals: readonly EmergingStrategicSignal[],
  pressureStressed: boolean,
  temporal: EnterpriseTimeIntelligenceSnapshot | null,
  now: number
): EnterpriseRiskConstellation | null {
  const pressure = hasSignalKeyword(emergingSignals, ["pressure", "concentration", "spread"]);
  const operational = hasSignalKeyword(emergingSignals, ["operational", "degradation", "shift"]);
  const shifting = temporal?.summary.temporalContinuity === "shifting";
  if ((!pressure && !pressureStressed) || !operational) return null;

  const linked = emergingSignals.filter(
    (s) => s.category === "operational" || s.category === "escalation" || s.category === "strategic"
  );

  return createConstellation(
    "operational_pressure_field",
    shifting ? "destabilizing" : "accumulating",
    pressureStressed ? "systemic" : "strong",
    "Pressure spread across connected systems is forming a distributed instability network with correlated weak-signal propagation.",
    [
      "pressure_spread",
      "distributed_instability",
      "cross_system_propagation",
      "operational_pressure_field",
    ],
    collectLinkedIds(linked),
    pressureStressed ? 0.86 : 0.78,
    now
  );
}

function buildSystemicFragilityConvergence(
  convergence: readonly StabilityConvergencePattern[],
  emergingSignals: readonly EmergingStrategicSignal[],
  temporal: EnterpriseTimeIntelligenceSnapshot | null,
  now: number
): EnterpriseRiskConstellation | null {
  const destabilizing =
    temporal?.runtimeStatus === "unstable" ||
    temporal?.runtimeStatus === "degraded" ||
    temporal?.summary.organizationalEvolutionState === "fragmenting";
  const weakConvergence = !convergence.some(
    (p) => p.category === "governance_stabilization" || p.category === "escalation_decay"
  );
  const multiFragile = emergingSignals.filter(
    (s) => s.category === "fragility" || s.foresightState === "intensifying"
  ).length;
  if (!destabilizing && !weakConvergence && multiFragile < 2) return null;

  const linked = emergingSignals.filter(
    (s) => s.foresightState === "accumulating" || s.foresightState === "intensifying"
  );

  return createConstellation(
    "systemic_instability",
    "destabilizing",
    destabilizing && multiFragile >= 2 ? "systemic" : "strong",
    "Reduced stabilization consistency across convergence and foresight layers indicates systemic fragility convergence forming across enterprise operational horizons.",
    [
      "systemic_fragility",
      "stabilization_inconsistency",
      "distributed_convergence",
      "enterprise_instability",
    ],
    collectLinkedIds(linked),
    destabilizing ? 0.87 : 0.79,
    now
  );
}

function buildGovernanceDriftConstellation(
  emergingSignals: readonly EmergingStrategicSignal[],
  continuityPreserved: boolean,
  now: number
): EnterpriseRiskConstellation | null {
  const governance = hasSignalKeyword(emergingSignals, ["governance", "oversight", "delay"]);
  const strategic = hasSignalKeyword(emergingSignals, ["strategic", "pressure", "accumulation"]);
  if (!governance || (!strategic && continuityPreserved)) return null;

  const linked = emergingSignals.filter(
    (s) => s.category === "governance" || s.category === "strategic"
  );

  return createConstellation(
    "governance_drift",
    "emerging",
    governance && strategic ? "moderate" : "weak",
    "Governance degradation signals are correlating with strategic pressure accumulation, indicating emerging governance drift across institutional layers.",
    [
      "governance_drift",
      "oversight_fragmentation",
      "strategic_pressure_accumulation",
    ],
    collectLinkedIds(linked),
    0.74,
    now
  );
}

function buildCoordinationBreakdownCluster(
  emergingSignals: readonly EmergingStrategicSignal[],
  now: number
): EnterpriseRiskConstellation | null {
  const coordination = hasSignalKeyword(emergingSignals, ["coordination", "synchronization", "degradation"]);
  const fragility = hasSignalKeyword(emergingSignals, ["fragility", "instability"]);
  if (!coordination || !fragility) return null;

  const linked = emergingSignals.filter(
    (s) => s.weakSignals.some((w) => w.includes("coordination")) || s.category === "fragility"
  );

  return createConstellation(
    "coordination_breakdown",
    "converging",
    "moderate",
    "Fragility growth combined with coordination degradation correlates into an operational instability cluster across dependent enterprise systems.",
    [
      "coordination_breakdown",
      "slow_fragility_growth",
      "dependency_degradation",
    ],
    collectLinkedIds(linked),
    0.77,
    now
  );
}

function buildStructuralInstabilityField(
  foresight: EnterpriseForesightSnapshot | null,
  emergingSignals: readonly EmergingStrategicSignal[],
  preEscalationElevated: boolean,
  now: number
): EnterpriseRiskConstellation | null {
  const recurrence =
    (foresight?.awarenessSummary.preEscalationRisk === "elevated" ||
      foresight?.awarenessSummary.preEscalationRisk === "moderate") &&
    emergingSignals.length >= 2;
  const escalationSignals = emergingSignals.filter((s) => s.category === "escalation").length;
  if (!recurrence && escalationSignals < 1 && !preEscalationElevated) return null;

  const linked = emergingSignals.filter(
    (s) => s.category === "escalation" || s.category === "fragility"
  );

  return createConstellation(
    "systemic_instability",
    "accumulating",
    preEscalationElevated ? "strong" : "moderate",
    "Cross-period weak escalation recurrence is correlating into an emerging structural instability field across anticipatory enterprise horizons.",
    [
      "escalation_recurrence",
      "structural_instability",
      "weak_signal_convergence",
      "pre_crisis_formation",
    ],
    collectLinkedIds(linked),
    preEscalationElevated ? 0.82 : 0.73,
    now
  );
}

function rankConstellations(
  constellations: EnterpriseRiskConstellation[]
): EnterpriseRiskConstellation[] {
  return [...constellations]
    .sort(
      (a, b) =>
        correlationRank(b.correlationStrength) - correlationRank(a.correlationStrength) ||
        b.confidence - a.confidence
    )
    .slice(0, 6);
}

function buildWeakSignalCorrelations(
  constellations: EnterpriseRiskConstellation[],
  now: number
): WeakSignalCorrelation[] {
  return constellations.slice(0, 4).map((c) => ({
    correlationId: stableSignature(["weak-signal-correlation", c.constellationId]).slice(0, 48),
    category: c.category,
    correlationStrength: c.correlationStrength,
    correlationSummary: c.summary.slice(0, 120),
    signalLabels: c.correlatedSignals,
    linkedConstellationIds: Object.freeze([c.constellationId]),
    confidence: c.confidence,
    generatedAt: now,
  }));
}

function buildInstabilityPatterns(
  constellations: EnterpriseRiskConstellation[],
  now: number
): DistributedInstabilityPattern[] {
  return constellations.slice(0, 3).map((c) => ({
    patternId: stableSignature(["instability-pattern", c.constellationId]).slice(0, 48),
    category: c.category,
    patternLabel: `${c.category} pattern`,
    instabilitySummary: c.summary.slice(0, 120),
    constellationIds: Object.freeze([c.constellationId]),
    generatedAt: now,
  }));
}

function buildStrategicRiskEmergences(
  constellations: EnterpriseRiskConstellation[],
  now: number
): StrategicRiskEmergence[] {
  return constellations
    .filter((c) => c.correlationStrength === "strong" || c.correlationStrength === "systemic")
    .slice(0, 3)
    .map((c) => ({
      emergenceId: stableSignature(["strategic-risk-emergence", c.constellationId]).slice(0, 48),
      category: c.category,
      riskSummary: c.summary.slice(0, 120),
      emergenceSignals: c.correlatedSignals,
      correlationStrength: c.correlationStrength,
      generatedAt: now,
    }));
}

function buildPressureClusters(
  constellations: EnterpriseRiskConstellation[],
  now: number
): MultiSignalPressureCluster[] {
  return constellations
    .filter(
      (c) =>
        c.category === "operational_pressure_field" ||
        c.category === "escalation_network" ||
        c.category === "fragility_cluster"
    )
    .slice(0, 3)
    .map((c) => ({
      clusterId: stableSignature(["pressure-cluster", c.constellationId]).slice(0, 48),
      category: c.category,
      clusterLabel: `${c.category} cluster`,
      pressureSummary: c.summary.slice(0, 100),
      pressureSignals: c.correlatedSignals,
      constellationState: c.constellationState,
      generatedAt: now,
    }));
}

function buildAwarenessSummary(
  constellations: EnterpriseRiskConstellation[]
): RiskConstellationAwarenessSummary {
  const dominant = constellations[0];
  const systemic = constellations.some((c) => c.correlationStrength === "systemic");
  const strong = constellations.filter(
    (c) => c.correlationStrength === "strong" || c.correlationStrength === "systemic"
  ).length;

  return {
    dominantCategory: dominant?.category ?? "unknown",
    dominantCorrelationStrength: dominant?.correlationStrength ?? "weak",
    dominantConstellationState: dominant?.constellationState ?? "emerging",
    constellationHeadline: dominant
      ? dominant.summary.slice(0, 140)
      : "Risk constellation awareness pending correlated weak-signal depth.",
    distributedRiskLevel: systemic
      ? "systemic"
      : strong >= 2
        ? "elevated"
        : constellations.length >= 2
          ? "moderate"
          : "low",
  };
}

function buildConstellationSnapshot(
  organizationId: string,
  constellations: EnterpriseRiskConstellation[],
  correlations: WeakSignalCorrelation[],
  patterns: DistributedInstabilityPattern[],
  emergences: StrategicRiskEmergence[],
  clusters: MultiSignalPressureCluster[],
  now: number
): RiskConstellationSnapshot {
  const awarenessSummary = buildAwarenessSummary(constellations);
  const signature = stableSignature([
    "d9-4-2-risk-constellation-snapshot",
    organizationId,
    constellations.map((c) => c.constellationId),
    awarenessSummary.distributedRiskLevel,
    now,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    constellationCount: constellations.length,
    awarenessSummary,
    recentConstellations: Object.freeze(constellations),
    weakSignalCorrelations: Object.freeze(correlations),
    instabilityPatterns: Object.freeze(patterns),
    strategicRiskEmergences: Object.freeze(emergences),
    pressureClusters: Object.freeze(clusters),
  };
}

/**
 * D9:4:2 — Passive weak signal correlation + enterprise risk constellation evaluation.
 */
export function evaluateWeakSignalCorrelation(
  input: WeakSignalCorrelationInput
): WeakSignalCorrelationResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();
  const store = getRiskConstellationStore(organizationId);

  if (!beginRiskConstellationEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: store.getState().snapshots[0] ?? null,
      newConstellations: 0,
      storeSignature: store.getState().signature,
    };
  }

  try {
    const prior = store.getState();
    const foresightState = getForesightCognitionStore(organizationId).getState();
    const driftState = getTemporalDriftProjectionStore(organizationId).getState();
    const convergenceState = getTemporalConvergenceStore(organizationId).getState();

    const foresightSnapshot = input.foresightSnapshot ?? foresightState.snapshots[0] ?? null;
    const temporalSnapshot = input.temporalSnapshot ?? null;
    const driftSnapshot = input.driftSnapshot ?? driftState.snapshots[0] ?? null;
    const convergenceSnapshot =
      input.convergenceSnapshot ?? convergenceState.snapshots[0] ?? null;

    const evaluationSignature = stableSignature([
      "d9-4-2-constellation-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      foresightSnapshot?.signature ?? foresightState.signature,
      temporalSnapshot?.signature ?? "no-temporal",
      driftSnapshot?.signature ?? driftState.signature,
      convergenceSnapshot?.signature ?? convergenceState.signature,
      input.memorySnapshot?.signature ?? "no-memory",
    ]);

    if (
      !shouldEvaluateRiskConstellation(
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
        newConstellations: 0,
        storeSignature: prior.signature,
      };
    }

    const emergingSignals =
      foresightSnapshot?.recentEmergingSignals ?? foresightState.emergingSignals;

    const correlationDepth =
      emergingSignals.length +
      (foresightSnapshot?.signalCount ?? 0) +
      (temporalSnapshot?.activeSubsystems.length ?? 0) +
      (driftSnapshot?.projectionCount ?? driftState.projections.length);

    if (correlationDepth < 3 || emergingSignals.length < 2) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_correlation_depth",
        snapshot: prior.snapshots[0] ?? null,
        newConstellations: 0,
        storeSignature: prior.signature,
      };
    }

    const projections = driftSnapshot?.recentProjections ?? driftState.projections;
    const convergence =
      convergenceSnapshot?.recentConvergencePatterns ?? convergenceState.patterns;
    const preEscalationElevated =
      foresightSnapshot?.awarenessSummary.preEscalationRisk === "elevated";

    const candidates: EnterpriseRiskConstellation[] = [];

    const instabilityCluster = buildOperationalInstabilityCluster(emergingSignals, now);
    if (instabilityCluster) candidates.push(instabilityCluster);

    const escalationNetwork = buildEscalationPrecursorConstellation(
      emergingSignals,
      input.pressureTopologyStressed ?? false,
      now
    );
    if (escalationNetwork) candidates.push(escalationNetwork);

    const resilienceErosion = buildResilienceErosionFormation(emergingSignals, projections, now);
    if (resilienceErosion) candidates.push(resilienceErosion);

    const pressureNetwork = buildDistributedInstabilityNetwork(
      emergingSignals,
      input.pressureTopologyStressed ?? false,
      temporalSnapshot,
      now
    );
    if (pressureNetwork) candidates.push(pressureNetwork);

    const systemic = buildSystemicFragilityConvergence(
      convergence,
      emergingSignals,
      temporalSnapshot,
      now
    );
    if (systemic) candidates.push(systemic);

    const governanceDrift = buildGovernanceDriftConstellation(
      emergingSignals,
      input.continuityPreserved ?? true,
      now
    );
    if (governanceDrift) candidates.push(governanceDrift);

    const coordinationBreakdown = buildCoordinationBreakdownCluster(emergingSignals, now);
    if (coordinationBreakdown) candidates.push(coordinationBreakdown);

    const structuralField = buildStructuralInstabilityField(
      foresightSnapshot,
      emergingSignals,
      preEscalationElevated,
      now
    );
    if (structuralField) candidates.push(structuralField);

    const retained = rankConstellations(candidates.filter(shouldRetainRiskConstellation));
    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_constellations",
        snapshot: prior.snapshots[0] ?? null,
        newConstellations: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.constellations.map((c) => c.constellationId));
    const newCount = retained.filter((c) => !priorIds.has(c.constellationId)).length;

    store.upsertConstellations(retained, now);

    const correlations = buildWeakSignalCorrelations(retained, now);
    store.upsertCorrelations(correlations, now);

    const patterns = buildInstabilityPatterns(retained, now);
    store.upsertInstabilityPatterns(patterns, now);

    const emergences = buildStrategicRiskEmergences(retained, now);
    store.upsertStrategicRiskEmergences(emergences, now);

    const clusters = buildPressureClusters(retained, now);
    store.upsertPressureClusters(clusters, now);

    const snapshot = buildConstellationSnapshot(
      organizationId,
      retained,
      correlations,
      patterns,
      emergences,
      clusters,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (retained.some((c) => c.correlationStrength === "systemic")) {
      devLog(`systemic instability emergence — ${snapshot.awarenessSummary.distributedRiskLevel}`);
    }
    if (instabilityCluster && instabilityCluster.correlationStrength !== "weak") {
      devLog(`major constellation formation — ${instabilityCluster.category}`);
    }
    if (
      prior.snapshots[0]?.awarenessSummary.distributedRiskLevel !==
      snapshot.awarenessSummary.distributedRiskLevel
    ) {
      devLog(`distributed risk convergence — ${snapshot.awarenessSummary.distributedRiskLevel}`);
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newConstellations: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endRiskConstellationEvaluation();
  }
}
