import { stableSignature } from "../intelligence/shared/dedupe";
import { getTemporalDriftProjectionStore } from "../temporal-cognition/temporalDriftProjectionStore";
import { getOperationalReplayStore } from "../temporal-cognition/operationalReplayStore";
import { getForesightCognitionStore } from "./foresightCognitionStore";
import { getRiskConstellationStore } from "./riskConstellationStore";
import { getEarlyWarningStore } from "./earlyWarningStore";
import { getPositiveDriftStore } from "./positiveDriftStore";
import { getStressSimulationStore } from "./stressSimulationStore";
import type { TemporalDriftProjection } from "../temporal-cognition/temporalDriftProjectionTypes";
import type { EnterpriseRiskConstellation } from "./riskConstellationTypes";
import type { EnterpriseEarlyWarningSnapshot } from "./earlyWarningTypes";
import type { PositiveTrajectorySnapshot } from "./positiveDriftTypes";
import type { StressSimulationSnapshot } from "./stressSimulationTypes";
import type { RiskConstellationSnapshot } from "./riskConstellationTypes";
import type { EnterpriseForesightSnapshot } from "./foresightCognitionTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import {
  beginInterventionTimingEvaluation,
  confidenceToInterventionTimingLevel,
  endInterventionTimingEvaluation,
  sensitivityRank,
  shouldEvaluateInterventionTiming,
  shouldRetainStrategicInterventionWindow,
} from "./interventionTimingGuards";
import { getInterventionTimingStore } from "./interventionTimingStore";
import type {
  EnterpriseTimingSignal,
  ExecutiveInterventionTimingInput,
  ExecutiveInterventionTimingResult,
  InterventionTimingAwarenessSummary,
  InterventionWindowSnapshot,
  OperationalTimingSensitivity,
  StabilizationOpportunityField,
  StrategicInterventionWindow,
  TimingCategory,
  TimingPressureIndicator,
  TimingSensitivity,
  WindowState,
} from "./interventionTimingTypes";

const DEV_LOG_PREFIX = "[Nexora][InterventionTiming]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildInterventionWindowId(category: TimingCategory, sensitivity: TimingSensitivity): string {
  return stableSignature(["strategic-intervention-window", category, sensitivity]).slice(0, 56);
}

function dedupeTimingSignals(signals: string[]): readonly string[] {
  return Object.freeze(Array.from(new Set(signals)).slice(0, 6));
}

function createInterventionWindow(
  category: TimingCategory,
  timingSensitivity: TimingSensitivity,
  windowState: WindowState,
  summary: string,
  timingSignals: string[],
  confidence: number,
  now: number
): StrategicInterventionWindow {
  const conf = Number(Math.min(0.92, Math.max(0.5, confidence)).toFixed(2));
  return {
    interventionWindowId: buildInterventionWindowId(category, timingSensitivity),
    category,
    timingSensitivity,
    windowState,
    summary,
    timingSignals: dedupeTimingSignals(timingSignals),
    confidence: conf,
    confidenceLevel: confidenceToInterventionTimingLevel(conf),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function hasConstellationCategory(
  constellations: readonly EnterpriseRiskConstellation[],
  categories: string[]
): boolean {
  return constellations.some((c) => categories.includes(c.category));
}

function buildEscalationPreventionWindow(
  constellationSnapshot: RiskConstellationSnapshot | null,
  earlyWarning: EnterpriseEarlyWarningSnapshot | null,
  stress: StressSimulationSnapshot | null,
  now: number
): StrategicInterventionWindow | null {
  const systemic =
    constellationSnapshot?.awarenessSummary.distributedRiskLevel === "systemic";
  if (systemic) return null;

  const localized =
    earlyWarning?.awarenessSummary.preEscalationRisk === "moderate" ||
    earlyWarning?.awarenessSummary.preEscalationRisk === "elevated" ||
    hasConstellationCategory(constellationSnapshot?.recentConstellations ?? [], [
      "escalation_network",
      "fragility_cluster",
    ]);
  const stressLocalized = stress?.awarenessSummary.anticipatoryPressureRisk !== "critical";
  if (!localized && !stressLocalized) return null;

  return createInterventionWindow(
    "escalation_prevention",
    localized ? "high" : "moderate",
    "active",
    "Escalation remains localized across correlated systems, indicating an active intervention window before pressure propagation widens.",
    [
      "localized_escalation",
      "pressure_growth",
      "coordination_instability",
      "pre_escalation_containment",
    ],
    localized ? 0.86 : 0.76,
    now
  );
}

function buildGovernanceStabilizationWindow(
  earlyWarning: EnterpriseEarlyWarningSnapshot | null,
  stress: StressSimulationSnapshot | null,
  narrativeLine: string,
  now: number
): StrategicInterventionWindow | null {
  const govDelay = earlyWarning?.recentPreEscalationSignals.some(
    (s) => s.category === "governance_delay"
  );
  const govOverload = stress?.recentOperationalStressScenarios.some(
    (s) => s.category === "governance_overload"
  );
  const narrativeGov =
    narrativeLine.includes("governance") &&
    (narrativeLine.includes("delay") || narrativeLine.includes("degradation"));
  if (!govDelay && !govOverload && !narrativeGov) return null;

  return createInterventionWindow(
    "governance_stabilization",
    govDelay && govOverload ? "high" : "moderate",
    govOverload ? "narrowing" : "active",
    "Governance stabilization opportunity remains active but is narrowing as pressure propagation accelerates across dependent operational systems.",
    [
      "pressure_growth",
      "coordination_instability",
      "localized_escalation",
      "governance_delay",
    ],
    govDelay ? 0.86 : 0.78,
    now
  );
}

function buildResilienceReinforcementWindow(
  positiveDrift: PositiveTrajectorySnapshot | null,
  replays: readonly { replayState: string }[],
  projections: readonly TemporalDriftProjection[],
  resilienceForecastLine: string,
  now: number
): StrategicInterventionWindow | null {
  const recovering = replays.some(
    (r) => r.replayState === "recovering" || r.replayState === "resolved"
  );
  const driftPositive = projections.some(
    (p) => p.trajectoryDirection === "recovering" || p.trajectoryDirection === "stabilizing"
  );
  const opportunity =
    positiveDrift?.awarenessSummary.positiveMomentum === "strong" ||
    positiveDrift?.awarenessSummary.positiveMomentum === "accelerating";
  const forecastPositive =
    resilienceForecastLine.includes("strengthen") || resilienceForecastLine.includes("improv");
  if (!recovering && !driftPositive && !opportunity && !forecastPositive) return null;

  return createInterventionWindow(
    "resilience_reinforcement",
    opportunity && recovering ? "high" : "moderate",
    "active",
    "Recovery improvement under supportive conditions indicates a resilience reinforcement opportunity while intervention effectiveness remains elevated.",
    [
      "recovery_improvement",
      "resilience_reinforcement",
      "adaptive_support_window",
      "stabilization_momentum",
    ],
    opportunity ? 0.85 : 0.77,
    now
  );
}

function buildPressureReductionCriticalWindow(
  stress: StressSimulationSnapshot | null,
  earlyWarning: EnterpriseEarlyWarningSnapshot | null,
  pressureStressed: boolean,
  projections: readonly TemporalDriftProjection[],
  now: number
): StrategicInterventionWindow | null {
  const spreading = projections.some(
    (p) => p.trajectoryDirection === "unstable" || p.trajectoryDirection === "degrading"
  );
  const criticalStress =
    stress?.awarenessSummary.anticipatoryPressureRisk === "severe" ||
    stress?.awarenessSummary.anticipatoryPressureRisk === "critical";
  const warningElevated =
    earlyWarning?.awarenessSummary.preEscalationRisk === "elevated" ||
    earlyWarning?.awarenessSummary.preEscalationRisk === "critical";
  if (!pressureStressed && !spreading && !criticalStress) return null;
  if (!warningElevated && !criticalStress && !spreading) return null;

  return createInterventionWindow(
    "pressure_reduction",
    criticalStress || spreading ? "critical" : "high",
    spreading ? "narrowing" : "active",
    "Pressure spread is increasing rapidly across operational layers, creating critical timing sensitivity for pressure reduction before escalation timing accelerates.",
    [
      "pressure_spread_acceleration",
      "escalation_timing_acceleration",
      "critical_timing_sensitivity",
      "operational_strain_growth",
    ],
    criticalStress ? 0.88 : 0.81,
    now
  );
}

function buildCoordinationAlignmentWindow(
  positiveDrift: PositiveTrajectorySnapshot | null,
  temporal: EnterpriseTimeIntelligenceSnapshot | null,
  stress: StressSimulationSnapshot | null,
  now: number
): StrategicInterventionWindow | null {
  const stabilizing =
    temporal?.runtimeStatus === "stable" ||
    temporal?.runtimeStatus === "recovering" ||
    temporal?.summary.organizationalEvolutionState === "stabilizing";
  const coordinationOpportunity = positiveDrift?.recentStrategicOpportunitySignals.some(
    (s) => s.category === "coordination_improvement"
  );
  const strainContained = !stress?.recentOperationalStressScenarios.some(
    (s) => s.simulationState === "destabilizing" && s.category === "coordination_strain"
  );
  if (!stabilizing && !coordinationOpportunity) return null;
  if (!strainContained && !coordinationOpportunity) return null;

  return createInterventionWindow(
    "coordination_alignment",
    coordinationOpportunity && stabilizing ? "high" : "moderate",
    "active",
    "Coordination stabilizing early across enterprise systems suggests high intervention effectiveness for alignment before distributed degradation forms.",
    [
      "coordination_stabilization",
      "early_alignment_window",
      "intervention_effectiveness",
      "synchronization_recovery",
    ],
    coordinationOpportunity ? 0.84 : 0.75,
    now
  );
}

function buildRecoveryAccelerationWindow(
  positiveDrift: PositiveTrajectorySnapshot | null,
  replays: readonly { replayState: string }[],
  now: number
): StrategicInterventionWindow | null {
  const recoveryOpportunity = positiveDrift?.recentStrategicOpportunitySignals.some(
    (s) => s.category === "recovery_acceleration"
  );
  const replayRecovering = replays.some((r) => r.replayState === "recovering");
  if (!recoveryOpportunity && !replayRecovering) return null;

  return createInterventionWindow(
    "recovery_acceleration",
    recoveryOpportunity ? "high" : "moderate",
    "emerging",
    "Adaptive recovery acceleration opportunity is emerging while operational replay patterns show improving recovery velocity.",
    [
      "recovery_acceleration",
      "adaptive_recovery_timing",
      "operational_recovery_window",
    ],
    recoveryOpportunity ? 0.83 : 0.74,
    now
  );
}

function buildMissedPreventionWindow(
  constellationSnapshot: RiskConstellationSnapshot | null,
  stress: StressSimulationSnapshot | null,
  earlyWarning: EnterpriseEarlyWarningSnapshot | null,
  now: number
): StrategicInterventionWindow | null {
  const systemic =
    constellationSnapshot?.awarenessSummary.distributedRiskLevel === "systemic";
  const criticalWarning = earlyWarning?.awarenessSummary.preEscalationRisk === "critical";
  const criticalStress = stress?.awarenessSummary.anticipatoryPressureRisk === "critical";
  if (!systemic && !criticalWarning && !criticalStress) return null;

  return createInterventionWindow(
    "escalation_prevention",
    "critical",
    "missed",
    "Escalation has become systemic across enterprise layers, indicating the primary prevention window may already be missed while containment timing remains sensitive.",
    [
      "systemic_escalation",
      "missed_prevention_window",
      "containment_timing_only",
      "distributed_instability",
    ],
    systemic ? 0.87 : 0.8,
    now
  );
}

function buildStrategicRealignmentWindow(
  foresight: EnterpriseForesightSnapshot | null,
  positiveDrift: PositiveTrajectorySnapshot | null,
  narrativeLine: string,
  now: number
): StrategicInterventionWindow | null {
  const strategic =
    foresight?.recentEmergingSignals.some(
      (s) => s.category === "strategic" || s.category === "coordination"
    ) ||
    positiveDrift?.recentStrategicOpportunitySignals.some(
      (s) => s.category === "strategic_strengthening"
    );
  const narrativeStrategic =
    narrativeLine.includes("strategic") &&
    (narrativeLine.includes("alignment") || narrativeLine.includes("evolution"));
  if (!strategic && !narrativeStrategic) return null;

  return createInterventionWindow(
    "strategic_realignment",
    strategic ? "moderate" : "low",
    "emerging",
    "Strategic realignment timing is emerging as enterprise evolution signals align, offering an early response window before opportunity decay accelerates.",
    [
      "strategic_realignment",
      "evolution_alignment",
      "early_response_window",
    ],
    strategic ? 0.76 : 0.68,
    now
  );
}

function rankInterventionWindows(
  windows: StrategicInterventionWindow[]
): StrategicInterventionWindow[] {
  return [...windows]
    .sort(
      (a, b) =>
        sensitivityRank(b.timingSensitivity) - sensitivityRank(a.timingSensitivity) ||
        b.confidence - a.confidence
    )
    .slice(0, 6);
}

function buildTimingSignals(
  windows: StrategicInterventionWindow[],
  now: number
): EnterpriseTimingSignal[] {
  return windows.slice(0, 4).map((w) => ({
    signalId: stableSignature(["timing-signal", w.interventionWindowId]).slice(0, 48),
    category: w.category,
    signalLabel: `${w.category} timing signal`,
    signalSummary: w.summary.slice(0, 100),
    timingSensitivity: w.timingSensitivity,
    windowState: w.windowState,
    confidence: w.confidence,
    generatedAt: now,
  }));
}

function buildTimingSensitivities(
  windows: StrategicInterventionWindow[],
  now: number
): OperationalTimingSensitivity[] {
  return windows
    .filter((w) => w.timingSensitivity === "high" || w.timingSensitivity === "critical")
    .slice(0, 4)
    .map((w) => ({
      sensitivityId: stableSignature(["timing-sensitivity", w.interventionWindowId]).slice(0, 48),
      category: w.category,
      sensitivityLabel: `${w.category} sensitivity`,
      sensitivityHint: w.windowState,
      timingSensitivity: w.timingSensitivity,
      windowState: w.windowState,
      generatedAt: now,
    }));
}

function buildStabilizationFields(
  windows: StrategicInterventionWindow[],
  now: number
): StabilizationOpportunityField[] {
  return windows
    .filter(
      (w) =>
        w.category === "governance_stabilization" ||
        w.category === "coordination_alignment" ||
        w.windowState === "active"
    )
    .slice(0, 3)
    .map((w) => ({
      fieldId: stableSignature(["stabilization-field", w.interventionWindowId]).slice(0, 48),
      category: w.category,
      fieldLabel: `${w.category} stabilization field`,
      opportunitySummary: w.summary.slice(0, 100),
      timingSignals: w.timingSignals,
      windowState: w.windowState,
      generatedAt: now,
    }));
}

function buildTimingPressureIndicators(
  windows: StrategicInterventionWindow[],
  now: number
): TimingPressureIndicator[] {
  return windows
    .filter((w) => w.category === "pressure_reduction" || w.timingSensitivity === "critical")
    .slice(0, 4)
    .map((w) => ({
      indicatorId: stableSignature(["timing-pressure", w.interventionWindowId]).slice(0, 48),
      category: w.category,
      indicatorLabel: `${w.category} pressure indicator`,
      pressureHint: w.windowState,
      timingSensitivity: w.timingSensitivity,
      confidence: w.confidence,
      generatedAt: now,
    }));
}

function buildAwarenessSummary(
  windows: StrategicInterventionWindow[]
): InterventionTimingAwarenessSummary {
  const dominant = windows[0];
  const critical = windows.filter((w) => w.timingSensitivity === "critical").length;
  const high = windows.filter(
    (w) => w.timingSensitivity === "high" || w.timingSensitivity === "critical"
  ).length;
  const narrowing = windows.filter((w) => w.windowState === "narrowing").length;

  return {
    dominantCategory: dominant?.category ?? "unknown",
    dominantTimingSensitivity: dominant?.timingSensitivity ?? "low",
    dominantWindowState: dominant?.windowState ?? "emerging",
    timingHeadline: dominant
      ? dominant.summary.slice(0, 140)
      : "Intervention timing intelligence pending sufficient anticipatory depth.",
    interventionUrgency: critical >= 2
      ? "critical"
      : critical >= 1 || narrowing >= 2
        ? "high"
        : high >= 2
          ? "high"
          : windows.length >= 2
            ? "moderate"
            : "low",
  };
}

function buildInterventionWindowSnapshot(
  organizationId: string,
  windows: StrategicInterventionWindow[],
  signals: EnterpriseTimingSignal[],
  sensitivities: OperationalTimingSensitivity[],
  fields: StabilizationOpportunityField[],
  indicators: TimingPressureIndicator[],
  now: number
): InterventionWindowSnapshot {
  const awarenessSummary = buildAwarenessSummary(windows);
  const signature = stableSignature([
    "d9-4-6-intervention-timing-snapshot",
    organizationId,
    windows.map((w) => w.interventionWindowId),
    awarenessSummary.interventionUrgency,
    now,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    windowCount: windows.length,
    awarenessSummary,
    recentStrategicInterventionWindows: Object.freeze(windows),
    timingSignals: Object.freeze(signals),
    timingSensitivities: Object.freeze(sensitivities),
    stabilizationOpportunityFields: Object.freeze(fields),
    timingPressureIndicators: Object.freeze(indicators),
  };
}

/**
 * D9:4:6 — Passive strategic intervention timing + enterprise timing intelligence evaluation.
 */
export function evaluateStrategicInterventionTiming(
  input: ExecutiveInterventionTimingInput
): ExecutiveInterventionTimingResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();
  const store = getInterventionTimingStore(organizationId);

  if (!beginInterventionTimingEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: store.getState().snapshots[0] ?? null,
      newStrategicInterventionWindows: 0,
      storeSignature: store.getState().signature,
    };
  }

  try {
    const prior = store.getState();
    const constellationState = getRiskConstellationStore(organizationId).getState();
    const foresightState = getForesightCognitionStore(organizationId).getState();
    const earlyWarningState = getEarlyWarningStore(organizationId).getState();
    const positiveDriftState = getPositiveDriftStore(organizationId).getState();
    const stressState = getStressSimulationStore(organizationId).getState();
    const driftState = getTemporalDriftProjectionStore(organizationId).getState();
    const replayState = getOperationalReplayStore(organizationId).getState();

    const constellationSnapshot =
      input.constellationSnapshot ?? constellationState.snapshots[0] ?? null;
    const foresightSnapshot = input.foresightSnapshot ?? foresightState.snapshots[0] ?? null;
    const earlyWarningSnapshot =
      input.earlyWarningSnapshot ?? earlyWarningState.snapshots[0] ?? null;
    const positiveDriftSnapshot =
      input.positiveDriftSnapshot ?? positiveDriftState.snapshots[0] ?? null;
    const stressSnapshot = input.stressSnapshot ?? stressState.snapshots[0] ?? null;
    const temporalSnapshot = input.temporalSnapshot ?? null;
    const driftSnapshot = input.driftSnapshot ?? driftState.snapshots[0] ?? null;
    const replaySnapshot = input.replaySnapshot ?? replayState.snapshots[0] ?? null;

    const evaluationSignature = stableSignature([
      "d9-4-6-intervention-timing-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      constellationSnapshot?.signature ?? constellationState.signature,
      foresightSnapshot?.signature ?? foresightState.signature,
      earlyWarningSnapshot?.signature ?? earlyWarningState.signature,
      positiveDriftSnapshot?.signature ?? positiveDriftState.signature,
      stressSnapshot?.signature ?? stressState.signature,
      temporalSnapshot?.signature ?? "no-temporal",
      driftSnapshot?.signature ?? driftState.signature,
      replaySnapshot?.signature ?? replayState.signature,
      input.memorySnapshot?.signature ?? "no-memory",
    ]);

    if (
      !shouldEvaluateInterventionTiming(
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
        newStrategicInterventionWindows: 0,
        storeSignature: prior.signature,
      };
    }

    const timingDepth =
      (stressSnapshot?.scenarioCount ?? stressState.operationalStressScenarios.length) +
      (earlyWarningSnapshot?.warningCount ?? earlyWarningState.preEscalationSignals.length) +
      (positiveDriftSnapshot?.opportunityCount ??
        positiveDriftState.strategicOpportunitySignals.length) +
      (constellationSnapshot?.constellationCount ?? constellationState.constellations.length) +
      (foresightSnapshot?.signalCount ?? foresightState.emergingSignals.length);

    if (timingDepth < 3) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_timing_depth",
        snapshot: prior.snapshots[0] ?? null,
        newStrategicInterventionWindows: 0,
        storeSignature: prior.signature,
      };
    }

    const projections = driftSnapshot?.recentProjections ?? driftState.projections;
    const replays = replaySnapshot?.recentReplays ?? replayState.replays;
    const narrativeLine = input.enterpriseNarrativeLine ?? "";
    const resilienceForecastLine = input.resilienceForecastLine ?? "";
    const pressureStressed = input.pressureTopologyStressed ?? false;

    const candidates: StrategicInterventionWindow[] = [];

    const missed = buildMissedPreventionWindow(
      constellationSnapshot,
      stressSnapshot,
      earlyWarningSnapshot,
      now
    );
    if (missed) candidates.push(missed);

    const escalation = buildEscalationPreventionWindow(
      constellationSnapshot,
      earlyWarningSnapshot,
      stressSnapshot,
      now
    );
    if (escalation && !missed) candidates.push(escalation);

    const governance = buildGovernanceStabilizationWindow(
      earlyWarningSnapshot,
      stressSnapshot,
      narrativeLine,
      now
    );
    if (governance) candidates.push(governance);

    const resilience = buildResilienceReinforcementWindow(
      positiveDriftSnapshot,
      replays,
      projections,
      resilienceForecastLine,
      now
    );
    if (resilience) candidates.push(resilience);

    const pressure = buildPressureReductionCriticalWindow(
      stressSnapshot,
      earlyWarningSnapshot,
      pressureStressed,
      projections,
      now
    );
    if (pressure) candidates.push(pressure);

    const coordination = buildCoordinationAlignmentWindow(
      positiveDriftSnapshot,
      temporalSnapshot,
      stressSnapshot,
      now
    );
    if (coordination) candidates.push(coordination);

    const recovery = buildRecoveryAccelerationWindow(positiveDriftSnapshot, replays, now);
    if (recovery) candidates.push(recovery);

    const realignment = buildStrategicRealignmentWindow(
      foresightSnapshot,
      positiveDriftSnapshot,
      narrativeLine,
      now
    );
    if (realignment) candidates.push(realignment);

    const retained = rankInterventionWindows(
      candidates.filter(shouldRetainStrategicInterventionWindow)
    );
    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_intervention_windows",
        snapshot: prior.snapshots[0] ?? null,
        newStrategicInterventionWindows: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.strategicInterventionWindows.map((w) => w.interventionWindowId));
    const newCount = retained.filter((w) => !priorIds.has(w.interventionWindowId)).length;

    store.upsertStrategicInterventionWindows(retained, now);

    const signals = buildTimingSignals(retained, now);
    store.upsertTimingSignals(signals, now);

    const sensitivities = buildTimingSensitivities(retained, now);
    store.upsertTimingSensitivities(sensitivities, now);

    const fields = buildStabilizationFields(retained, now);
    store.upsertStabilizationOpportunityFields(fields, now);

    const indicators = buildTimingPressureIndicators(retained, now);
    store.upsertTimingPressureIndicators(indicators, now);

    const snapshot = buildInterventionWindowSnapshot(
      organizationId,
      retained,
      signals,
      sensitivities,
      fields,
      indicators,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (retained.some((w) => w.windowState === "narrowing" || w.windowState === "closing")) {
      devLog(`narrowing intervention window — ${snapshot.awarenessSummary.dominantWindowState}`);
    }
    if (pressure || missed) {
      devLog(`escalation timing acceleration — ${snapshot.awarenessSummary.interventionUrgency}`);
    }
    if (governance || coordination || fields.length > 0) {
      devLog(`stabilization opportunity emergence — ${governance?.category ?? coordination?.category ?? "stabilization"}`);
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newStrategicInterventionWindows: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endInterventionTimingEvaluation();
  }
}
