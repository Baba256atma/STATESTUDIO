import { stableSignature } from "../intelligence/shared/dedupe";
import { getTemporalConvergenceStore } from "../temporal-cognition/temporalConvergenceStore";
import { getTemporalDriftProjectionStore } from "../temporal-cognition/temporalDriftProjectionStore";
import { getOperationalReplayStore } from "../temporal-cognition/operationalReplayStore";
import { getForesightCognitionStore } from "./foresightCognitionStore";
import { getEarlyWarningStore } from "./earlyWarningStore";
import type { StabilityConvergencePattern } from "../temporal-cognition/temporalConvergenceTypes";
import type { TemporalDriftProjection } from "../temporal-cognition/temporalDriftProjectionTypes";
import type { EnterpriseForesightSnapshot } from "./foresightCognitionTypes";
import type { EnterpriseEarlyWarningSnapshot } from "./earlyWarningTypes";
import type { RiskConstellationSnapshot } from "./riskConstellationTypes";
import type { StrategicAlignmentSnapshot } from "../temporal-cognition/temporalConvergenceTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import {
  beginPositiveDriftEvaluation,
  confidenceToPositiveDriftLevel,
  endPositiveDriftEvaluation,
  shouldEvaluatePositiveDrift,
  shouldRetainStrategicOpportunitySignal,
  strengthRank,
} from "./positiveDriftGuards";
import { getPositiveDriftStore } from "./positiveDriftStore";
import type {
  AdaptiveEvolutionSignal,
  ExecutivePositiveDriftInput,
  ExecutivePositiveDriftResult,
  OpportunityCategory,
  OpportunityStrength,
  OrganizationalGrowthPattern,
  PositiveDriftAwarenessSummary,
  PositiveDriftState,
  PositiveTrajectorySnapshot,
  ResilienceOpportunityField,
  StrategicOpportunitySignal,
} from "./positiveDriftTypes";

const DEV_LOG_PREFIX = "[Nexora][PositiveDrift]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildOpportunityId(category: OpportunityCategory, strength: OpportunityStrength): string {
  return stableSignature(["strategic-opportunity", category, strength]).slice(0, 56);
}

function dedupeOpportunitySignals(signals: string[]): readonly string[] {
  return Object.freeze(Array.from(new Set(signals)).slice(0, 6));
}

function createOpportunitySignal(
  category: OpportunityCategory,
  opportunityStrength: OpportunityStrength,
  positiveDriftState: PositiveDriftState,
  summary: string,
  opportunitySignals: string[],
  confidence: number,
  now: number
): StrategicOpportunitySignal {
  const conf = Number(Math.min(0.92, Math.max(0.5, confidence)).toFixed(2));
  return {
    opportunityId: buildOpportunityId(category, opportunityStrength),
    category,
    opportunityStrength,
    positiveDriftState,
    summary,
    opportunitySignals: dedupeOpportunitySignals(opportunitySignals),
    confidence: conf,
    confidenceLevel: confidenceToPositiveDriftLevel(conf),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function hasConvergenceCategory(
  patterns: readonly StabilityConvergencePattern[],
  categories: string[]
): boolean {
  return patterns.some((p) => categories.includes(p.category));
}

function buildResilienceOpportunityEmergence(
  foresight: EnterpriseForesightSnapshot | null,
  convergence: StrategicAlignmentSnapshot | null,
  projections: readonly TemporalDriftProjection[],
  earlyWarning: EnterpriseEarlyWarningSnapshot | null,
  now: number
): StrategicOpportunitySignal | null {
  const patterns = convergence?.recentConvergencePatterns ?? [];
  const resilient =
    foresight?.awarenessSummary.resilienceEmergence === "strengthening" ||
    hasConvergenceCategory(patterns, ["resilience_alignment", "recovery_synchronization"]);
  const stabilizing = projections.some(
    (p) =>
      p.trajectoryDirection === "stabilizing" ||
      p.trajectoryDirection === "recovering" ||
      p.trajectoryDirection === "adaptive_growth"
  );
  const escalationReduced =
    earlyWarning?.awarenessSummary.preEscalationRisk === "low" ||
    hasConvergenceCategory(patterns, ["escalation_decay", "fragility_reduction"]);
  if (!resilient && !stabilizing && !escalationReduced) return null;

  return createOpportunitySignal(
    "resilience_growth",
    resilient && stabilizing ? "strong" : "moderate",
    "strengthening",
    "Operational resilience and governance coordination are improving steadily across enterprise systems, suggesting emerging long-term stabilization opportunity.",
    [
      "reduced_escalation_spread",
      "improved_recovery_speed",
      "resilience_strengthening",
      "coordination_stabilization",
    ],
    resilient ? 0.88 : 0.78,
    now
  );
}

function buildRecoveryAccelerationOpportunity(
  replays: readonly { replayState: string }[],
  projections: readonly TemporalDriftProjection[],
  resilienceForecastLine: string,
  now: number
): StrategicOpportunitySignal | null {
  const recovering = replays.some(
    (r) => r.replayState === "recovering" || r.replayState === "resolved"
  );
  const accelerating = projections.some(
    (p) => p.trajectoryDirection === "recovering" || p.trajectoryDirection === "adaptive_growth"
  );
  const forecastPositive =
    resilienceForecastLine.includes("strengthen") || resilienceForecastLine.includes("improv");
  if (!recovering && !accelerating && !forecastPositive) return null;

  return createOpportunitySignal(
    "recovery_acceleration",
    recovering && accelerating ? "accelerating" : "moderate",
    "accelerating",
    "Faster operational recovery patterns are emerging across replay and drift layers, indicating adaptive stabilization growth before full institutionalization.",
    [
      "recovery_acceleration",
      "adaptive_stabilization",
      "operational_recovery_momentum",
    ],
    accelerating ? 0.86 : 0.76,
    now
  );
}

function buildGovernanceMaturationOpportunity(
  convergence: StrategicAlignmentSnapshot | null,
  narrativeLine: string,
  continuityPreserved: boolean,
  now: number
): StrategicOpportunitySignal | null {
  const patterns = convergence?.recentConvergencePatterns ?? [];
  const govMaturation = hasConvergenceCategory(patterns, [
    "governance_stabilization",
    "adaptive_alignment",
  ]);
  const narrativePositive =
    narrativeLine.includes("governance") &&
    (narrativeLine.includes("maturation") ||
      narrativeLine.includes("improv") ||
      narrativeLine.includes("coordination"));
  if (!govMaturation && (!narrativePositive || !continuityPreserved)) return null;

  return createOpportunitySignal(
    "governance_maturation",
    govMaturation ? "strong" : "moderate",
    "institutionalizing",
    "Governance coordination is improving steadily across correlated systems, signaling strategic governance maturation and oversight alignment opportunity.",
    [
      "governance_alignment",
      "oversight_maturation",
      "coordination_improvement",
    ],
    govMaturation ? 0.85 : 0.74,
    now
  );
}

function buildPressureWeakeningOpportunity(
  pressureStressed: boolean,
  constellation: RiskConstellationSnapshot | null,
  convergence: StrategicAlignmentSnapshot | null,
  now: number
): StrategicOpportunitySignal | null {
  if (pressureStressed) return null;
  const patterns = convergence?.recentConvergencePatterns ?? [];
  const decay =
    hasConvergenceCategory(patterns, ["escalation_decay"]) ||
    constellation?.awarenessSummary.distributedRiskLevel === "low";
  if (!decay && constellation?.awarenessSummary.distributedRiskLevel !== "moderate") return null;

  return createOpportunitySignal(
    "operational_stabilization",
    decay ? "strong" : "moderate",
    "stabilizing",
    "Pressure propagation is weakening across operational dependencies while risk distribution remains contained, indicating operational resilience strengthening.",
    [
      "pressure_propagation_weakening",
      "operational_resilience_strengthening",
      "contained_risk_distribution",
    ],
    decay ? 0.84 : 0.73,
    now
  );
}

function buildAdaptiveEvolutionOpportunity(
  maturity: InstitutionalIntelligenceMaturitySnapshot | null,
  foresight: EnterpriseForesightSnapshot | null,
  memoryLearningLine: string,
  now: number
): StrategicOpportunitySignal | null {
  const trend = maturity?.recentSnapshots[0]?.evolutionTrend;
  const level = maturity?.recentSnapshots[0]?.maturityLevel;
  const improving = trend === "improving" || trend === "accelerating";
  const mature =
    level === "adaptive" || level === "resilient" || level === "strategically_mature";
  const learningPositive =
    memoryLearningLine.includes("learning") &&
    (memoryLearningLine.includes("improv") || memoryLearningLine.includes("matur"));
  const foresightResilience = foresight?.recentEmergingSignals.some(
    (s) => s.category === "resilience" && s.foresightState === "stabilizing"
  );
  if (!improving && !mature && !learningPositive && !foresightResilience) return null;

  return createOpportunitySignal(
    "adaptive_alignment",
    improving && mature ? "accelerating" : "moderate",
    "institutionalizing",
    "Institutional maturity is increasing gradually while adaptive foresight signals align, indicating enterprise adaptive evolution opportunity.",
    [
      "institutional_maturity_growth",
      "adaptive_evolution",
      "organizational_learning_alignment",
    ],
    improving ? 0.87 : 0.77,
    now
  );
}

function buildCoordinationAlignmentOpportunity(
  convergence: StrategicAlignmentSnapshot | null,
  temporal: EnterpriseTimeIntelligenceSnapshot | null,
  now: number
): StrategicOpportunitySignal | null {
  const patterns = convergence?.recentConvergencePatterns ?? [];
  const coordination = hasConvergenceCategory(patterns, [
    "operational_coordination",
    "resilience_alignment",
  ]);
  const runtimeStable =
    temporal?.runtimeStatus === "stable" || temporal?.runtimeStatus === "recovering";
  if (!coordination && !runtimeStable) return null;

  return createOpportunitySignal(
    "coordination_improvement",
    coordination && runtimeStable ? "strong" : "moderate",
    "strengthening",
    "Coordination synchronization is strengthening across temporal and convergence layers, forming an organizational alignment opportunity.",
    [
      "coordination_synchronization",
      "alignment_strengthening",
      "enterprise_coordination_growth",
    ],
    coordination ? 0.83 : 0.75,
    now
  );
}

function buildStrategicStrengtheningOpportunity(
  foresight: EnterpriseForesightSnapshot | null,
  temporal: EnterpriseTimeIntelligenceSnapshot | null,
  narrativeLine: string,
  now: number
): StrategicOpportunitySignal | null {
  const strategicSignal = foresight?.recentEmergingSignals.some(
    (s) => s.category === "strategic" || s.category === "coordination"
  );
  const evolutionPositive =
    temporal?.summary.organizationalEvolutionState === "stabilizing" ||
    temporal?.summary.organizationalEvolutionState === "institutionalizing";
  const narrativeStrategic =
    narrativeLine.includes("strategic") &&
    (narrativeLine.includes("strengthen") || narrativeLine.includes("alignment"));
  if (!strategicSignal && !evolutionPositive && !narrativeStrategic) return null;

  return createOpportunitySignal(
    "strategic_strengthening",
    evolutionPositive ? "strong" : "moderate",
    "emerging",
    "Strategic alignment and enterprise evolution signals indicate positive momentum forming across anticipatory cognition horizons.",
    [
      "strategic_alignment",
      "positive_evolution_momentum",
      "enterprise_strengthening",
    ],
    evolutionPositive ? 0.82 : 0.72,
    now
  );
}

function rankOpportunitySignals(signals: StrategicOpportunitySignal[]): StrategicOpportunitySignal[] {
  return [...signals]
    .sort(
      (a, b) =>
        strengthRank(b.opportunityStrength) - strengthRank(a.opportunityStrength) ||
        b.confidence - a.confidence
    )
    .slice(0, 6);
}

function buildGrowthPatterns(
  signals: StrategicOpportunitySignal[],
  now: number
): OrganizationalGrowthPattern[] {
  return signals.slice(0, 4).map((s) => ({
    patternId: stableSignature(["growth-pattern", s.opportunityId]).slice(0, 48),
    category: s.category,
    patternLabel: `${s.category} growth pattern`,
    patternSummary: s.summary.slice(0, 120),
    linkedOpportunityIds: Object.freeze([s.opportunityId]),
    opportunityStrength: s.opportunityStrength,
    generatedAt: now,
  }));
}

function buildResilienceFields(
  signals: StrategicOpportunitySignal[],
  now: number
): ResilienceOpportunityField[] {
  return signals
    .filter(
      (s) =>
        s.category === "resilience_growth" ||
        s.category === "recovery_acceleration" ||
        s.positiveDriftState === "strengthening"
    )
    .slice(0, 3)
    .map((s) => ({
      fieldId: stableSignature(["resilience-field", s.opportunityId]).slice(0, 48),
      category: s.category,
      fieldLabel: `${s.category} opportunity field`,
      opportunitySummary: s.summary.slice(0, 100),
      opportunitySignals: s.opportunitySignals,
      positiveDriftState: s.positiveDriftState,
      generatedAt: now,
    }));
}

function buildAdaptiveEvolutionSignals(
  signals: StrategicOpportunitySignal[],
  now: number
): AdaptiveEvolutionSignal[] {
  return signals.slice(0, 4).map((s) => ({
    signalId: stableSignature(["adaptive-evolution", s.opportunityId]).slice(0, 48),
    category: s.category,
    evolutionLabel: `${s.category} evolution`,
    evolutionHint: s.positiveDriftState,
    opportunityStrength: s.opportunityStrength,
    confidence: s.confidence,
    generatedAt: now,
  }));
}

function buildAwarenessSummary(
  signals: StrategicOpportunitySignal[]
): PositiveDriftAwarenessSummary {
  const dominant = signals[0];
  const accelerating = signals.filter((s) => s.opportunityStrength === "accelerating").length;
  const strong = signals.filter(
    (s) => s.opportunityStrength === "strong" || s.opportunityStrength === "accelerating"
  ).length;

  return {
    dominantCategory: dominant?.category ?? "unknown",
    dominantOpportunityStrength: dominant?.opportunityStrength ?? "weak",
    dominantPositiveDriftState: dominant?.positiveDriftState ?? "emerging",
    opportunityHeadline: dominant
      ? dominant.summary.slice(0, 140)
      : "Positive drift intelligence pending sufficient opportunity depth.",
    positiveMomentum: accelerating >= 2
      ? "accelerating"
      : strong >= 2
        ? "strong"
        : signals.length >= 2
          ? "moderate"
          : "low",
  };
}

function buildPositiveTrajectorySnapshot(
  organizationId: string,
  signals: StrategicOpportunitySignal[],
  patterns: OrganizationalGrowthPattern[],
  fields: ResilienceOpportunityField[],
  evolutionSignals: AdaptiveEvolutionSignal[],
  now: number
): PositiveTrajectorySnapshot {
  const awarenessSummary = buildAwarenessSummary(signals);
  const signature = stableSignature([
    "d9-4-4-positive-drift-snapshot",
    organizationId,
    signals.map((s) => s.opportunityId),
    awarenessSummary.positiveMomentum,
    now,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    opportunityCount: signals.length,
    awarenessSummary,
    recentStrategicOpportunitySignals: Object.freeze(signals),
    growthPatterns: Object.freeze(patterns),
    resilienceOpportunityFields: Object.freeze(fields),
    adaptiveEvolutionSignals: Object.freeze(evolutionSignals),
  };
}

/**
 * D9:4:4 — Passive strategic opportunity emergence + positive drift evaluation.
 */
export function evaluateStrategicOpportunityEmergence(
  input: ExecutivePositiveDriftInput
): ExecutivePositiveDriftResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();
  const store = getPositiveDriftStore(organizationId);

  if (!beginPositiveDriftEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: store.getState().snapshots[0] ?? null,
      newStrategicOpportunitySignals: 0,
      storeSignature: store.getState().signature,
    };
  }

  try {
    const prior = store.getState();
    const foresightState = getForesightCognitionStore(organizationId).getState();
    const convergenceState = getTemporalConvergenceStore(organizationId).getState();
    const driftState = getTemporalDriftProjectionStore(organizationId).getState();
    const replayState = getOperationalReplayStore(organizationId).getState();
    const earlyWarningState = getEarlyWarningStore(organizationId).getState();

    const foresightSnapshot = input.foresightSnapshot ?? foresightState.snapshots[0] ?? null;
    const convergenceSnapshot =
      input.convergenceSnapshot ?? convergenceState.snapshots[0] ?? null;
    const driftSnapshot = input.driftSnapshot ?? driftState.snapshots[0] ?? null;
    const replaySnapshot = input.replaySnapshot ?? replayState.snapshots[0] ?? null;
    const earlyWarningSnapshot =
      input.earlyWarningSnapshot ?? earlyWarningState.snapshots[0] ?? null;
    const temporalSnapshot = input.temporalSnapshot ?? null;
    const constellationSnapshot = input.constellationSnapshot ?? null;

    const evaluationSignature = stableSignature([
      "d9-4-4-positive-drift-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      foresightSnapshot?.signature ?? foresightState.signature,
      convergenceSnapshot?.signature ?? convergenceState.signature,
      driftSnapshot?.signature ?? driftState.signature,
      replaySnapshot?.signature ?? replayState.signature,
      earlyWarningSnapshot?.signature ?? earlyWarningState.signature,
      temporalSnapshot?.signature ?? "no-temporal",
      input.maturitySnapshot?.signature ?? "no-maturity",
    ]);

    if (
      !shouldEvaluatePositiveDrift(
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
        newStrategicOpportunitySignals: 0,
        storeSignature: prior.signature,
      };
    }

    const opportunityDepth =
      (foresightSnapshot?.signalCount ?? foresightState.emergingSignals.length) +
      (convergenceSnapshot?.convergenceCount ?? convergenceState.patterns.length) +
      (temporalSnapshot?.activeSubsystems.length ?? 0) +
      (input.maturitySnapshot?.recentSnapshots.length ?? 0) +
      (driftSnapshot?.projectionCount ?? driftState.projections.length);

    if (opportunityDepth < 3) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_opportunity_depth",
        snapshot: prior.snapshots[0] ?? null,
        newStrategicOpportunitySignals: 0,
        storeSignature: prior.signature,
      };
    }

    const projections = driftSnapshot?.recentProjections ?? driftState.projections;
    const replays = replaySnapshot?.recentReplays ?? replayState.replays;
    const narrativeLine = input.enterpriseNarrativeLine ?? "";
    const resilienceForecastLine = input.resilienceForecastLine ?? "";
    const learningLine = input.cognitionSnapshot?.organizationalLearningLine ?? narrativeLine;
    const retainOptions = {
      fragilityElevated: input.fragilityElevated ?? false,
      pressureStressed: input.pressureTopologyStressed ?? false,
    };

    const candidates: StrategicOpportunitySignal[] = [];

    const resilience = buildResilienceOpportunityEmergence(
      foresightSnapshot,
      convergenceSnapshot,
      projections,
      earlyWarningSnapshot,
      now
    );
    if (resilience) candidates.push(resilience);

    const recovery = buildRecoveryAccelerationOpportunity(
      replays,
      projections,
      resilienceForecastLine,
      now
    );
    if (recovery) candidates.push(recovery);

    const governance = buildGovernanceMaturationOpportunity(
      convergenceSnapshot,
      narrativeLine,
      input.continuityPreserved ?? true,
      now
    );
    if (governance) candidates.push(governance);

    const pressure = buildPressureWeakeningOpportunity(
      input.pressureTopologyStressed ?? false,
      constellationSnapshot,
      convergenceSnapshot,
      now
    );
    if (pressure) candidates.push(pressure);

    const evolution = buildAdaptiveEvolutionOpportunity(
      input.maturitySnapshot ?? null,
      foresightSnapshot,
      learningLine,
      now
    );
    if (evolution) candidates.push(evolution);

    const coordination = buildCoordinationAlignmentOpportunity(convergenceSnapshot, temporalSnapshot, now);
    if (coordination) candidates.push(coordination);

    const strategic = buildStrategicStrengtheningOpportunity(
      foresightSnapshot,
      temporalSnapshot,
      narrativeLine,
      now
    );
    if (strategic) candidates.push(strategic);

    const retained = rankOpportunitySignals(
      candidates.filter((s) => shouldRetainStrategicOpportunitySignal(s, retainOptions))
    );
    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_opportunities",
        snapshot: prior.snapshots[0] ?? null,
        newStrategicOpportunitySignals: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.strategicOpportunitySignals.map((s) => s.opportunityId));
    const newCount = retained.filter((s) => !priorIds.has(s.opportunityId)).length;

    store.upsertStrategicOpportunitySignals(retained, now);

    const patterns = buildGrowthPatterns(retained, now);
    store.upsertGrowthPatterns(patterns, now);

    const fields = buildResilienceFields(retained, now);
    store.upsertResilienceOpportunityFields(fields, now);

    const evolutionSignals = buildAdaptiveEvolutionSignals(retained, now);
    store.upsertAdaptiveEvolutionSignals(evolutionSignals, now);

    const snapshot = buildPositiveTrajectorySnapshot(
      organizationId,
      retained,
      patterns,
      fields,
      evolutionSignals,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (resilience || recovery) {
      devLog(`resilience opportunity emergence — ${snapshot.awarenessSummary.positiveMomentum}`);
    }
    if (pressure || coordination) {
      devLog(`stabilization acceleration — ${snapshot.awarenessSummary.dominantPositiveDriftState}`);
    }
    if (governance) {
      devLog(`governance maturation growth — ${governance.opportunityStrength}`);
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newStrategicOpportunitySignals: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endPositiveDriftEvaluation();
  }
}
