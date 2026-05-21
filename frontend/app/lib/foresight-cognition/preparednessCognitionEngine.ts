import { stableSignature } from "../intelligence/shared/dedupe";
import { getTemporalConvergenceStore } from "../temporal-cognition/temporalConvergenceStore";
import { getTemporalDriftProjectionStore } from "../temporal-cognition/temporalDriftProjectionStore";
import { getOperationalReplayStore } from "../temporal-cognition/operationalReplayStore";
import { getInterventionTimingStore } from "./interventionTimingStore";
import { getStressSimulationStore } from "./stressSimulationStore";
import { getEarlyWarningStore } from "./earlyWarningStore";
import { getPositiveDriftStore } from "./positiveDriftStore";
import type { StabilityConvergencePattern } from "../temporal-cognition/temporalConvergenceTypes";
import type { TemporalDriftProjection } from "../temporal-cognition/temporalDriftProjectionTypes";
import type { InterventionWindowSnapshot } from "./interventionTimingTypes";
import type { StressSimulationSnapshot } from "./stressSimulationTypes";
import type { EnterpriseEarlyWarningSnapshot } from "./earlyWarningTypes";
import type { PositiveTrajectorySnapshot } from "./positiveDriftTypes";
import type { StrategicAlignmentSnapshot } from "../temporal-cognition/temporalConvergenceTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import {
  beginPreparednessCognitionEvaluation,
  confidenceToPreparednessLevel,
  endPreparednessCognitionEvaluation,
  preparednessRank,
  shouldEvaluatePreparednessCognition,
  shouldRetainStrategicReadinessSignal,
} from "./preparednessCognitionGuards";
import { getPreparednessCognitionStore } from "./preparednessCognitionStore";
import type {
  EnterprisePreparednessSnapshot,
  ExecutivePreparednessCognitionInput,
  ExecutivePreparednessCognitionResult,
  OperationalResilienceCapability,
  OrganizationalResponseReadiness,
  PreparednessCategory,
  PreparednessGapIndicator,
  PreparednessLevel,
  ReadinessAwarenessSummary,
  ReadinessState,
  StrategicReadinessSignal,
} from "./preparednessCognitionTypes";

const DEV_LOG_PREFIX = "[Nexora][PreparednessCognition]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildPreparednessId(category: PreparednessCategory, level: PreparednessLevel): string {
  return stableSignature(["strategic-readiness", category, level]).slice(0, 56);
}

function dedupePreparednessSignals(signals: string[]): readonly string[] {
  return Object.freeze(Array.from(new Set(signals)).slice(0, 6));
}

function createReadinessSignal(
  category: PreparednessCategory,
  preparednessLevel: PreparednessLevel,
  readinessState: ReadinessState,
  summary: string,
  preparednessSignals: string[],
  confidence: number,
  now: number
): StrategicReadinessSignal {
  const conf = Number(Math.min(0.92, Math.max(0.5, confidence)).toFixed(2));
  return {
    preparednessId: buildPreparednessId(category, preparednessLevel),
    category,
    preparednessLevel,
    readinessState,
    summary,
    preparednessSignals: dedupePreparednessSignals(preparednessSignals),
    confidence: conf,
    confidenceLevel: confidenceToPreparednessLevel(conf),
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

function buildResilientRecoveryReadiness(
  positiveDrift: PositiveTrajectorySnapshot | null,
  replays: readonly { replayState: string }[],
  projections: readonly TemporalDriftProjection[],
  resilienceForecastLine: string,
  now: number
): StrategicReadinessSignal | null {
  const recovering = replays.filter(
    (r) => r.replayState === "recovering" || r.replayState === "resolved"
  ).length;
  const driftPositive = projections.some(
    (p) =>
      p.trajectoryDirection === "recovering" ||
      p.trajectoryDirection === "stabilizing" ||
      p.trajectoryDirection === "adaptive_growth"
  );
  const opportunity =
    positiveDrift?.awarenessSummary.positiveMomentum === "strong" ||
    positiveDrift?.awarenessSummary.positiveMomentum === "accelerating";
  const forecastPositive =
    resilienceForecastLine.includes("strengthen") || resilienceForecastLine.includes("improv");
  if (recovering < 1 && !driftPositive && !opportunity && !forecastPositive) return null;

  return createReadinessSignal(
    "resilience_capacity",
    recovering >= 2 && opportunity ? "resilient" : "strong",
    opportunity ? "adaptive" : "prepared",
    "The organization demonstrates improving preparedness through resilient recovery consistency, governance stabilization, and adaptive coordination maturity.",
    [
      "improved_recovery_speed",
      "reduced_pressure_spread",
      "governance_alignment",
      "adaptive_coordination",
    ],
    opportunity ? 0.89 : 0.81,
    now
  );
}

function buildGovernanceVulnerabilityGap(
  stress: StressSimulationSnapshot | null,
  earlyWarning: EnterpriseEarlyWarningSnapshot | null,
  intervention: InterventionWindowSnapshot | null,
  pressureStressed: boolean,
  now: number
): StrategicReadinessSignal | null {
  const govStress = stress?.recentOperationalStressScenarios.some(
    (s) => s.category === "governance_overload"
  );
  const govWarning = earlyWarning?.recentPreEscalationSignals.some(
    (s) => s.category === "governance_delay"
  );
  const timingNarrow = intervention?.recentStrategicInterventionWindows.some(
    (w) => w.category === "governance_stabilization" && w.windowState === "narrowing"
  );
  if (!govStress && !govWarning && !timingNarrow) return null;
  if (!pressureStressed && !govStress) return null;

  return createReadinessSignal(
    "governance_readiness",
    govStress && timingNarrow ? "limited" : "weak",
    "vulnerable",
    "Governance instability under operational pressure indicates preparedness vulnerability across oversight and institutional response layers.",
    [
      "governance_instability",
      "oversight_vulnerability",
      "pressure_response_gap",
      "institutional_friction",
    ],
    govStress ? 0.82 : 0.74,
    now
  );
}

function buildCoordinationAdaptabilityGrowth(
  convergence: StrategicAlignmentSnapshot | null,
  positiveDrift: PositiveTrajectorySnapshot | null,
  temporal: EnterpriseTimeIntelligenceSnapshot | null,
  now: number
): StrategicReadinessSignal | null {
  const patterns = convergence?.recentConvergencePatterns ?? [];
  const coordination = hasConvergenceCategory(patterns, [
    "operational_coordination",
    "resilience_alignment",
  ]);
  const driftOpportunity = positiveDrift?.recentStrategicOpportunitySignals.some(
    (s) => s.category === "coordination_improvement"
  );
  const stabilizing =
    temporal?.summary.organizationalEvolutionState === "stabilizing" ||
    temporal?.runtimeStatus === "stable";
  if (!coordination && !driftOpportunity && !stabilizing) return null;

  return createReadinessSignal(
    "coordination_preparedness",
    coordination && driftOpportunity ? "strong" : "moderate",
    stabilizing ? "stabilizing" : "prepared",
    "Coordination stabilization is improving across convergence and positive drift layers, signaling operational adaptability growth.",
    [
      "coordination_stabilization",
      "adaptability_growth",
      "alignment_improvement",
      "synchronization_maturity",
    ],
    coordination ? 0.84 : 0.76,
    now
  );
}

function buildLimitedEscalationResponseReadiness(
  intervention: InterventionWindowSnapshot | null,
  stress: StressSimulationSnapshot | null,
  earlyWarning: EnterpriseEarlyWarningSnapshot | null,
  now: number
): StrategicReadinessSignal | null {
  const missed = intervention?.recentStrategicInterventionWindows.some(
    (w) => w.windowState === "missed"
  );
  const criticalStress =
    stress?.awarenessSummary.anticipatoryPressureRisk === "severe" ||
    stress?.awarenessSummary.anticipatoryPressureRisk === "critical";
  const warningCritical = earlyWarning?.awarenessSummary.preEscalationRisk === "critical";
  const timingCritical = intervention?.awarenessSummary.interventionUrgency === "critical";
  if (!missed && !criticalStress && !warningCritical && !timingCritical) return null;

  return createReadinessSignal(
    "escalation_response",
    missed ? "limited" : "weak",
    missed ? "unprepared" : "vulnerable",
    "Escalation response readiness appears limited as intervention timing urgency intensifies and prevention windows narrow.",
    [
      "escalation_response_slowdown",
      "narrowing_intervention_window",
      "limited_readiness_capability",
      "response_delay_risk",
    ],
    missed ? 0.83 : 0.75,
    now
  );
}

function buildPressureAbsorptionImprovement(
  positiveDrift: PositiveTrajectorySnapshot | null,
  stress: StressSimulationSnapshot | null,
  pressureStressed: boolean,
  now: number
): StrategicReadinessSignal | null {
  if (pressureStressed) return null;
  const absorption =
    positiveDrift?.recentStrategicOpportunitySignals.some(
      (s) => s.category === "operational_stabilization"
    ) ||
    stress?.recentOperationalStressScenarios.some((s) => s.simulationState === "recovering");
  const lowStress = stress?.awarenessSummary.anticipatoryPressureRisk === "low";
  if (!absorption && !lowStress) return null;

  return createReadinessSignal(
    "resilience_capacity",
    absorption ? "strong" : "moderate",
    "prepared",
    "Pressure absorption is strengthening across operational layers, indicating resilience preparedness improvement before next stress cycle.",
    [
      "pressure_absorption_strengthening",
      "resilience_preparedness_improvement",
      "operational_buffer_growth",
    ],
    absorption ? 0.82 : 0.73,
    now
  );
}

function buildInstabilityWithoutAdaptationWeakness(
  earlyWarning: EnterpriseEarlyWarningSnapshot | null,
  stress: StressSimulationSnapshot | null,
  maturity: InstitutionalIntelligenceMaturitySnapshot | null,
  fragilityElevated: boolean,
  now: number
): StrategicReadinessSignal | null {
  const repeatedInstability =
    (earlyWarning?.warningCount ?? 0) >= 2 &&
    (stress?.scenarioCount ?? 0) >= 2;
  const maturityWeak =
    maturity?.dominantEvolutionTrend === "stagnant" ||
    maturity?.dominantEvolutionTrend === "regressing" ||
    maturity?.dominantMaturityLevel === "reactive";
  if (!repeatedInstability && !fragilityElevated) return null;
  if (!maturityWeak && !fragilityElevated) return null;

  return createReadinessSignal(
    "operational_adaptability",
    fragilityElevated && maturityWeak ? "weak" : "limited",
    "vulnerable",
    "Repeated instability without sufficient adaptive maturity signals organizational preparedness weakness across operational response layers.",
    [
      "repeated_instability",
      "adaptation_gap",
      "preparedness_weakness",
      "fragility_persistence",
    ],
    fragilityElevated ? 0.8 : 0.72,
    now
  );
}

function buildRecoveryCapabilityReadiness(
  replays: readonly { replayState: string }[],
  maturity: InstitutionalIntelligenceMaturitySnapshot | null,
  now: number
): StrategicReadinessSignal | null {
  const recovering = replays.some(
    (r) => r.replayState === "recovering" || r.replayState === "resolved"
  );
  const mature =
    maturity?.dominantMaturityLevel === "adaptive" ||
    maturity?.dominantMaturityLevel === "resilient" ||
    maturity?.dominantEvolutionTrend === "improving";
  if (!recovering && !mature) return null;

  return createReadinessSignal(
    "recovery_capability",
    mature && recovering ? "strong" : "moderate",
    recovering ? "prepared" : "stabilizing",
    "Operational recovery preparedness is forming through replay recovery patterns and institutional maturity progression.",
    [
      "recovery_capability",
      "operational_recovery_readiness",
      "maturity_progression",
    ],
    mature ? 0.8 : 0.74,
    now
  );
}

function buildStrategicAlignmentReadiness(
  convergence: StrategicAlignmentSnapshot | null,
  intervention: InterventionWindowSnapshot | null,
  narrativeLine: string,
  now: number
): StrategicReadinessSignal | null {
  const aligned = hasConvergenceCategory(convergence?.recentConvergencePatterns ?? [], [
    "adaptive_alignment",
    "governance_stabilization",
  ]);
  const timingReady = intervention?.recentStrategicInterventionWindows.some(
    (w) => w.windowState === "active" && w.category === "strategic_realignment"
  );
  const narrative =
    narrativeLine.includes("strategic") &&
    (narrativeLine.includes("alignment") || narrativeLine.includes("evolution"));
  if (!aligned && !timingReady && !narrative) return null;

  return createReadinessSignal(
    "strategic_alignment",
    aligned ? "moderate" : "limited",
    "stabilizing",
    "Strategic alignment readiness is stabilizing as convergence and intervention timing signals indicate emerging enterprise response coherence.",
    [
      "strategic_alignment",
      "enterprise_response_coherence",
      "alignment_readiness",
    ],
    aligned ? 0.77 : 0.69,
    now
  );
}

function rankReadinessSignals(signals: StrategicReadinessSignal[]): StrategicReadinessSignal[] {
  return [...signals]
    .sort(
      (a, b) =>
        preparednessRank(b.preparednessLevel) - preparednessRank(a.preparednessLevel) ||
        b.confidence - a.confidence
    )
    .slice(0, 6);
}

function buildResilienceCapabilities(
  signals: StrategicReadinessSignal[],
  now: number
): OperationalResilienceCapability[] {
  return signals
    .filter(
      (s) =>
        s.category === "resilience_capacity" ||
        s.category === "recovery_capability" ||
        s.preparednessLevel === "strong" ||
        s.preparednessLevel === "resilient"
    )
    .slice(0, 4)
    .map((s) => ({
      capabilityId: stableSignature(["resilience-capability", s.preparednessId]).slice(0, 48),
      category: s.category,
      capabilityLabel: `${s.category} capability`,
      capabilitySummary: s.summary.slice(0, 100),
      preparednessLevel: s.preparednessLevel,
      readinessState: s.readinessState,
      confidence: s.confidence,
      generatedAt: now,
    }));
}

function buildGapIndicators(
  signals: StrategicReadinessSignal[],
  now: number
): PreparednessGapIndicator[] {
  return signals
    .filter(
      (s) =>
        s.preparednessLevel === "weak" ||
        s.preparednessLevel === "limited" ||
        s.readinessState === "vulnerable"
    )
    .slice(0, 4)
    .map((s) => ({
      gapId: stableSignature(["preparedness-gap", s.preparednessId]).slice(0, 48),
      category: s.category,
      gapLabel: `${s.category} gap`,
      gapSummary: s.summary.slice(0, 100),
      preparednessLevel: s.preparednessLevel,
      readinessState: s.readinessState,
      generatedAt: now,
    }));
}

function buildResponseReadiness(
  signals: StrategicReadinessSignal[],
  now: number
): OrganizationalResponseReadiness[] {
  return signals.slice(0, 4).map((s) => ({
    readinessId: stableSignature(["response-readiness", s.preparednessId]).slice(0, 48),
    category: s.category,
    readinessLabel: `${s.category} response readiness`,
    responseSummary: s.summary.slice(0, 100),
    preparednessSignals: s.preparednessSignals,
    preparednessLevel: s.preparednessLevel,
    generatedAt: now,
  }));
}

function buildAwarenessSummary(signals: StrategicReadinessSignal[]): ReadinessAwarenessSummary {
  const dominant = signals[0];
  const resilient = signals.filter((s) => s.preparednessLevel === "resilient").length;
  const strong = signals.filter(
    (s) => s.preparednessLevel === "strong" || s.preparednessLevel === "resilient"
  ).length;
  const weak = signals.filter(
    (s) => s.preparednessLevel === "weak" || s.preparednessLevel === "limited"
  ).length;

  const posture: ReadinessAwarenessSummary["enterprisePreparednessPosture"] =
    resilient >= 1
      ? "resilient"
      : strong >= 2
        ? "strong"
        : weak >= 2
          ? "limited"
          : signals.length >= 2
            ? "moderate"
            : "weak";

  return {
    dominantCategory: dominant?.category ?? "unknown",
    dominantPreparednessLevel: dominant?.preparednessLevel ?? "weak",
    dominantReadinessState: dominant?.readinessState ?? "unprepared",
    readinessHeadline: dominant
      ? dominant.summary.slice(0, 140)
      : "Preparedness cognition pending sufficient readiness evaluation depth.",
    enterprisePreparednessPosture: posture,
  };
}

function buildPreparednessSnapshot(
  organizationId: string,
  signals: StrategicReadinessSignal[],
  capabilities: OperationalResilienceCapability[],
  gaps: PreparednessGapIndicator[],
  responseReadiness: OrganizationalResponseReadiness[],
  now: number
): EnterprisePreparednessSnapshot {
  const awarenessSummary = buildAwarenessSummary(signals);
  const signature = stableSignature([
    "d9-4-7-preparedness-snapshot",
    organizationId,
    signals.map((s) => s.preparednessId),
    awarenessSummary.enterprisePreparednessPosture,
    now,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    signalCount: signals.length,
    awarenessSummary,
    recentStrategicReadinessSignals: Object.freeze(signals),
    resilienceCapabilities: Object.freeze(capabilities),
    preparednessGapIndicators: Object.freeze(gaps),
    responseReadiness: Object.freeze(responseReadiness),
  };
}

/**
 * D9:4:7 — Passive enterprise preparedness + strategic readiness awareness evaluation.
 */
export function evaluateEnterprisePreparednessAwareness(
  input: ExecutivePreparednessCognitionInput
): ExecutivePreparednessCognitionResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();
  const store = getPreparednessCognitionStore(organizationId);

  if (!beginPreparednessCognitionEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: store.getState().snapshots[0] ?? null,
      newStrategicReadinessSignals: 0,
      storeSignature: store.getState().signature,
    };
  }

  try {
    const prior = store.getState();
    const interventionState = getInterventionTimingStore(organizationId).getState();
    const stressState = getStressSimulationStore(organizationId).getState();
    const earlyWarningState = getEarlyWarningStore(organizationId).getState();
    const positiveDriftState = getPositiveDriftStore(organizationId).getState();
    const convergenceState = getTemporalConvergenceStore(organizationId).getState();
    const driftState = getTemporalDriftProjectionStore(organizationId).getState();
    const replayState = getOperationalReplayStore(organizationId).getState();

    const interventionSnapshot =
      input.interventionSnapshot ?? interventionState.snapshots[0] ?? null;
    const stressSnapshot = input.stressSnapshot ?? stressState.snapshots[0] ?? null;
    const earlyWarningSnapshot =
      input.earlyWarningSnapshot ?? earlyWarningState.snapshots[0] ?? null;
    const positiveDriftSnapshot =
      input.positiveDriftSnapshot ?? positiveDriftState.snapshots[0] ?? null;
    const convergenceSnapshot =
      input.convergenceSnapshot ?? convergenceState.snapshots[0] ?? null;
    const temporalSnapshot = input.temporalSnapshot ?? null;
    const driftSnapshot = input.driftSnapshot ?? driftState.snapshots[0] ?? null;
    const replaySnapshot = input.replaySnapshot ?? replayState.snapshots[0] ?? null;

    const evaluationSignature = stableSignature([
      "d9-4-7-preparedness-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      interventionSnapshot?.signature ?? interventionState.signature,
      stressSnapshot?.signature ?? stressState.signature,
      earlyWarningSnapshot?.signature ?? earlyWarningState.signature,
      positiveDriftSnapshot?.signature ?? positiveDriftState.signature,
      convergenceSnapshot?.signature ?? convergenceState.signature,
      temporalSnapshot?.signature ?? "no-temporal",
      driftSnapshot?.signature ?? driftState.signature,
      replaySnapshot?.signature ?? replayState.signature,
      input.maturitySnapshot?.signature ?? "no-maturity",
    ]);

    if (
      !shouldEvaluatePreparednessCognition(
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
        newStrategicReadinessSignals: 0,
        storeSignature: prior.signature,
      };
    }

    const preparednessDepth =
      (interventionSnapshot?.windowCount ??
        interventionState.strategicInterventionWindows.length) +
      (stressSnapshot?.scenarioCount ?? stressState.operationalStressScenarios.length) +
      (earlyWarningSnapshot?.warningCount ?? earlyWarningState.preEscalationSignals.length) +
      (positiveDriftSnapshot?.opportunityCount ??
        positiveDriftState.strategicOpportunitySignals.length) +
      (convergenceSnapshot?.convergenceCount ?? convergenceState.patterns.length);

    if (preparednessDepth < 3) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_preparedness_depth",
        snapshot: prior.snapshots[0] ?? null,
        newStrategicReadinessSignals: 0,
        storeSignature: prior.signature,
      };
    }

    const projections = driftSnapshot?.recentProjections ?? driftState.projections;
    const replays = replaySnapshot?.recentReplays ?? replayState.replays;
    const narrativeLine = input.enterpriseNarrativeLine ?? "";
    const resilienceForecastLine = input.resilienceForecastLine ?? "";
    const pressureStressed = input.pressureTopologyStressed ?? false;
    const fragilityElevated = input.fragilityElevated ?? false;

    const candidates: StrategicReadinessSignal[] = [];

    const resilient = buildResilientRecoveryReadiness(
      positiveDriftSnapshot,
      replays,
      projections,
      resilienceForecastLine,
      now
    );
    if (resilient) candidates.push(resilient);

    const governanceGap = buildGovernanceVulnerabilityGap(
      stressSnapshot,
      earlyWarningSnapshot,
      interventionSnapshot,
      pressureStressed,
      now
    );
    if (governanceGap) candidates.push(governanceGap);

    const coordination = buildCoordinationAdaptabilityGrowth(
      convergenceSnapshot,
      positiveDriftSnapshot,
      temporalSnapshot,
      now
    );
    if (coordination) candidates.push(coordination);

    const escalationLimited = buildLimitedEscalationResponseReadiness(
      interventionSnapshot,
      stressSnapshot,
      earlyWarningSnapshot,
      now
    );
    if (escalationLimited) candidates.push(escalationLimited);

    const pressureAbsorption = buildPressureAbsorptionImprovement(
      positiveDriftSnapshot,
      stressSnapshot,
      pressureStressed,
      now
    );
    if (pressureAbsorption) candidates.push(pressureAbsorption);

    const weakness = buildInstabilityWithoutAdaptationWeakness(
      earlyWarningSnapshot,
      stressSnapshot,
      input.maturitySnapshot ?? null,
      fragilityElevated,
      now
    );
    if (weakness) candidates.push(weakness);

    const recovery = buildRecoveryCapabilityReadiness(
      replays,
      input.maturitySnapshot ?? null,
      now
    );
    if (recovery) candidates.push(recovery);

    const strategic = buildStrategicAlignmentReadiness(
      convergenceSnapshot,
      interventionSnapshot,
      narrativeLine,
      now
    );
    if (strategic) candidates.push(strategic);

    const retained = rankReadinessSignals(
      candidates.filter(shouldRetainStrategicReadinessSignal)
    );
    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_readiness_signals",
        snapshot: prior.snapshots[0] ?? null,
        newStrategicReadinessSignals: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.strategicReadinessSignals.map((s) => s.preparednessId));
    const newCount = retained.filter((s) => !priorIds.has(s.preparednessId)).length;

    store.upsertStrategicReadinessSignals(retained, now);

    const capabilities = buildResilienceCapabilities(retained, now);
    store.upsertResilienceCapabilities(capabilities, now);

    const gaps = buildGapIndicators(retained, now);
    store.upsertPreparednessGapIndicators(gaps, now);

    const responseReadiness = buildResponseReadiness(retained, now);
    store.upsertResponseReadiness(responseReadiness, now);

    const snapshot = buildPreparednessSnapshot(
      organizationId,
      retained,
      capabilities,
      gaps,
      responseReadiness,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();
    const priorPosture = prior.snapshots[0]?.awarenessSummary.enterprisePreparednessPosture;

    if (
      resilient &&
      (priorPosture === "weak" ||
        priorPosture === "limited" ||
        snapshot.awarenessSummary.enterprisePreparednessPosture === "strong" ||
        snapshot.awarenessSummary.enterprisePreparednessPosture === "resilient")
    ) {
      devLog(`preparedness improvement — ${snapshot.awarenessSummary.enterprisePreparednessPosture}`);
    }
    if (capabilities.length > 0) {
      devLog(`resilience capability strengthening — ${capabilities[0]!.category}`);
    }
    if (governanceGap || weakness) {
      devLog(`operational vulnerability emergence — ${governanceGap?.category ?? weakness?.category}`);
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newStrategicReadinessSignals: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endPreparednessCognitionEvaluation();
  }
}
