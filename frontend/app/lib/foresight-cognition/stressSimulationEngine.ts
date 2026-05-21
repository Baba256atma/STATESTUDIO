import { stableSignature } from "../intelligence/shared/dedupe";
import { getTemporalDriftProjectionStore } from "../temporal-cognition/temporalDriftProjectionStore";
import { getOperationalReplayStore } from "../temporal-cognition/operationalReplayStore";
import { getForesightCognitionStore } from "./foresightCognitionStore";
import { getRiskConstellationStore } from "./riskConstellationStore";
import { getEarlyWarningStore } from "./earlyWarningStore";
import type { TemporalDriftProjection } from "../temporal-cognition/temporalDriftProjectionTypes";
import type { EnterpriseRiskConstellation } from "./riskConstellationTypes";
import type { EnterpriseForesightSnapshot } from "./foresightCognitionTypes";
import type { EnterpriseEarlyWarningSnapshot } from "./earlyWarningTypes";
import type { PositiveTrajectorySnapshot } from "./positiveDriftTypes";
import type { RiskConstellationSnapshot } from "./riskConstellationTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import {
  beginStressSimulationEvaluation,
  confidenceToStressSimulationLevel,
  endStressSimulationEvaluation,
  severityRank,
  shouldEvaluateStressSimulation,
  shouldRetainOperationalStressScenario,
} from "./stressSimulationGuards";
import { getStressSimulationStore } from "./stressSimulationStore";
import type {
  AnticipatoryStrainSignal,
  EnterpriseStressPropagation,
  ExecutiveStressSimulationInput,
  ExecutiveStressSimulationResult,
  OperationalStressScenario,
  OrganizationalPressureField,
  SimulationState,
  StrategicPressureSimulation,
  StressAwarenessSummary,
  StressCategory,
  StressSeverity,
  StressSimulationSnapshot,
} from "./stressSimulationTypes";

const DEV_LOG_PREFIX = "[Nexora][StressSimulation]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildStressScenarioId(category: StressCategory, severity: StressSeverity): string {
  return stableSignature(["operational-stress-scenario", category, severity]).slice(0, 56);
}

function dedupeStressSignals(signals: string[]): readonly string[] {
  return Object.freeze(Array.from(new Set(signals)).slice(0, 6));
}

function createStressScenario(
  category: StressCategory,
  stressSeverity: StressSeverity,
  simulationState: SimulationState,
  summary: string,
  stressSignals: string[],
  confidence: number,
  now: number
): OperationalStressScenario {
  const conf = Number(Math.min(0.92, Math.max(0.5, confidence)).toFixed(2));
  return {
    stressScenarioId: buildStressScenarioId(category, stressSeverity),
    category,
    stressSeverity,
    simulationState,
    summary,
    stressSignals: dedupeStressSignals(stressSignals),
    confidence: conf,
    confidenceLevel: confidenceToStressSimulationLevel(conf),
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

function buildEscalationAmplificationScenario(
  constellationSnapshot: RiskConstellationSnapshot | null,
  earlyWarning: EnterpriseEarlyWarningSnapshot | null,
  fragilityElevated: boolean,
  pressureStressed: boolean,
  now: number
): OperationalStressScenario | null {
  if (!fragilityElevated && !pressureStressed) return null;
  const fragile = hasConstellationCategory(constellationSnapshot?.recentConstellations ?? [], [
    "fragility_cluster",
    "escalation_network",
  ]);
  const preEscalation =
    earlyWarning?.awarenessSummary.preEscalationRisk === "elevated" ||
    earlyWarning?.awarenessSummary.preEscalationRisk === "critical";
  if (!fragile && !preEscalation) return null;

  return createStressScenario(
    "escalation_pressure",
    fragile && pressureStressed ? "severe" : "elevated",
    "destabilizing",
    "Under increased operational pressure, existing fragility and escalation precursors may amplify propagation across dependent systems before full crisis visibility.",
    [
      "pressure_concentration",
      "fragility_amplification",
      "escalation_precursor",
      "dependency_strain",
    ],
    fragile && pressureStressed ? 0.86 : 0.78,
    now
  );
}

function buildGovernanceOverloadScenario(
  constellationSnapshot: RiskConstellationSnapshot | null,
  earlyWarning: EnterpriseEarlyWarningSnapshot | null,
  narrativeLine: string,
  pressureStressed: boolean,
  now: number
): OperationalStressScenario | null {
  const govOverload =
    hasConstellationCategory(constellationSnapshot?.recentConstellations ?? [], [
      "governance_drift",
    ]) ||
    earlyWarning?.recentPreEscalationSignals.some((s) => s.category === "governance_delay");
  const narrativeGov =
    narrativeLine.includes("governance") &&
    (narrativeLine.includes("delay") || narrativeLine.includes("overload"));
  if (!govOverload && !narrativeGov && !pressureStressed) return null;

  return createStressScenario(
    "governance_overload",
    govOverload && pressureStressed ? "elevated" : "moderate",
    "strained",
    "Governance slowdown under higher operational load may intensify oversight delay and institutional friction across correlated enterprise systems.",
    [
      "governance_overload",
      "oversight_delay",
      "institutional_friction",
      "load_intensification",
    ],
    govOverload ? 0.83 : 0.74,
    now
  );
}

function buildResilienceFatigueScenario(
  constellationSnapshot: RiskConstellationSnapshot | null,
  projections: readonly TemporalDriftProjection[],
  replays: readonly { replayState: string }[],
  resilienceForecastLine: string,
  pressureStressed: boolean,
  now: number
): OperationalStressScenario | null {
  const erosion = hasConstellationCategory(constellationSnapshot?.recentConstellations ?? [], [
    "resilience_erosion",
  ]);
  const recoveryDelayed = replays.some(
    (r) => r.replayState !== "recovering" && r.replayState !== "resolved"
  );
  const driftWeak = projections.some(
    (p) => p.trajectoryDirection === "fragile" || p.trajectoryDirection === "stagnating"
  );
  const forecastWeak =
    resilienceForecastLine.includes("weaken") || resilienceForecastLine.includes("fatigue");
  if (!erosion && !recoveryDelayed && !driftWeak && !forecastWeak) return null;
  if (!pressureStressed && !erosion) return null;

  return createStressScenario(
    "resilience_fatigue",
    erosion && recoveryDelayed ? "severe" : "elevated",
    "strained",
    "Recovery delay combined with pressure concentration may produce resilience fatigue under intensified operational conditions before stabilization returns.",
    [
      "recovery_delay",
      "resilience_fatigue",
      "pressure_concentration",
      "operational_bottleneck",
    ],
    erosion ? 0.84 : 0.76,
    now
  );
}

function buildCoordinationStrainPropagation(
  constellationSnapshot: RiskConstellationSnapshot | null,
  earlyWarning: EnterpriseEarlyWarningSnapshot | null,
  pressureStressed: boolean,
  now: number
): OperationalStressScenario | null {
  const coordination = hasConstellationCategory(constellationSnapshot?.recentConstellations ?? [], [
    "coordination_breakdown",
    "fragility_cluster",
  ]);
  const coordinationWarning = earlyWarning?.recentPreEscalationSignals.some(
    (s) => s.category === "coordination_instability"
  );
  if (!coordination && !coordinationWarning && !pressureStressed) return null;

  return createStressScenario(
    "coordination_strain",
    coordination && pressureStressed ? "elevated" : "moderate",
    "destabilizing",
    "Coordination instability under stress may propagate distributed degradation across operational dependencies before escalation becomes organizationally visible.",
    [
      "coordination_strain",
      "distributed_degradation",
      "synchronization_friction",
      "pressure_propagation",
    ],
    coordination ? 0.81 : 0.73,
    now
  );
}

function buildSystemicPressureVulnerability(
  constellationSnapshot: RiskConstellationSnapshot | null,
  temporal: EnterpriseTimeIntelligenceSnapshot | null,
  projections: readonly TemporalDriftProjection[],
  now: number
): OperationalStressScenario | null {
  const systemic =
    constellationSnapshot?.awarenessSummary.distributedRiskLevel === "systemic" ||
    constellationSnapshot?.awarenessSummary.distributedRiskLevel === "elevated";
  const stabilizingWeak = !projections.some((p) => p.trajectoryDirection === "stabilizing");
  const runtimeWeak =
    temporal?.runtimeStatus === "degraded" || temporal?.runtimeStatus === "unstable";
  if (!systemic && !stabilizingWeak && !runtimeWeak) return null;

  return createStressScenario(
    "systemic_pressure",
    systemic ? "critical" : "severe",
    "destabilizing",
    "Reduced stabilization consistency across temporal and constellation layers signals systemic pressure vulnerability under intensified operational load.",
    [
      "stabilization_weakening",
      "systemic_pressure",
      "enterprise_vulnerability",
    ],
    systemic ? 0.85 : 0.77,
    now
  );
}

function buildOperationalBottleneckScenario(
  pressureStressed: boolean,
  temporal: EnterpriseTimeIntelligenceSnapshot | null,
  foresight: EnterpriseForesightSnapshot | null,
  now: number
): OperationalStressScenario | null {
  const bottleneck =
    foresight?.recentEmergingSignals.some((s) => s.category === "operational") ||
    temporal?.summary.organizationalEvolutionState === "fragmenting";
  if (!pressureStressed && !bottleneck && temporal?.summary.resilienceDirection !== "at_risk") {
    return null;
  }

  return createStressScenario(
    "operational_bottleneck",
    pressureStressed ? "elevated" : "moderate",
    "pressured",
    "Operational pressure concentration may form recovery bottlenecks across enterprise layers under sustained load before adaptive capacity compensates.",
    [
      "operational_bottleneck",
      "pressure_topology_stress",
      "recovery_bottleneck",
    ],
    pressureStressed ? 0.8 : 0.71,
    now
  );
}

function buildAdaptiveRecoveryUnderStress(
  positiveDrift: PositiveTrajectorySnapshot | null,
  foresight: EnterpriseForesightSnapshot | null,
  pressureStressed: boolean,
  now: number
): OperationalStressScenario | null {
  if (!pressureStressed) return null;
  const resilient =
    positiveDrift?.awarenessSummary.positiveMomentum === "strong" ||
    positiveDrift?.awarenessSummary.positiveMomentum === "accelerating" ||
    foresight?.awarenessSummary.resilienceEmergence === "strengthening";
  if (!resilient) return null;

  return createStressScenario(
    "operational_bottleneck",
    "moderate",
    "recovering",
    "Strong resilience indicators under elevated pressure suggest adaptive recovery capability may contain strain propagation before destabilization spreads.",
    [
      "adaptive_recovery_capacity",
      "resilience_under_load",
      "contained_strain_response",
    ],
    0.79,
    now
  );
}

function rankStressScenarios(scenarios: OperationalStressScenario[]): OperationalStressScenario[] {
  return [...scenarios]
    .sort(
      (a, b) =>
        severityRank(b.stressSeverity) - severityRank(a.stressSeverity) || b.confidence - a.confidence
    )
    .slice(0, 6);
}

function buildPressureSimulations(
  scenarios: OperationalStressScenario[],
  now: number
): StrategicPressureSimulation[] {
  return scenarios.slice(0, 4).map((s) => ({
    simulationId: stableSignature(["pressure-simulation", s.stressScenarioId]).slice(0, 48),
    category: s.category,
    simulationLabel: `${s.category} pressure simulation`,
    pressureSummary: s.summary.slice(0, 120),
    linkedScenarioIds: Object.freeze([s.stressScenarioId]),
    stressSeverity: s.stressSeverity,
    simulationState: s.simulationState,
    generatedAt: now,
  }));
}

function buildStressPropagations(
  scenarios: OperationalStressScenario[],
  now: number
): EnterpriseStressPropagation[] {
  return scenarios
    .filter(
      (s) =>
        s.simulationState === "destabilizing" ||
        s.category === "coordination_strain" ||
        s.category === "escalation_pressure"
    )
    .slice(0, 3)
    .map((s) => ({
      propagationId: stableSignature(["stress-propagation", s.stressScenarioId]).slice(0, 48),
      category: s.category,
      propagationLabel: `${s.category} propagation`,
      propagationSummary: s.summary.slice(0, 100),
      stressSignals: s.stressSignals,
      simulationState: s.simulationState,
      generatedAt: now,
    }));
}

function buildPressureFields(
  scenarios: OperationalStressScenario[],
  now: number
): OrganizationalPressureField[] {
  return scenarios
    .filter((s) => s.category === "escalation_pressure" || s.category === "systemic_pressure")
    .slice(0, 3)
    .map((s) => ({
      fieldId: stableSignature(["pressure-field", s.stressScenarioId]).slice(0, 48),
      category: s.category,
      fieldLabel: `${s.category} pressure field`,
      pressureSummary: s.summary.slice(0, 100),
      stressSignals: s.stressSignals,
      simulationState: s.simulationState,
      generatedAt: now,
    }));
}

function buildStrainSignals(
  scenarios: OperationalStressScenario[],
  now: number
): AnticipatoryStrainSignal[] {
  return scenarios.slice(0, 4).map((s) => ({
    strainId: stableSignature(["strain-signal", s.stressScenarioId]).slice(0, 48),
    category: s.category,
    strainLabel: `${s.category} strain`,
    strainHint: s.simulationState,
    stressSeverity: s.stressSeverity,
    confidence: s.confidence,
    generatedAt: now,
  }));
}

function buildAwarenessSummary(scenarios: OperationalStressScenario[]): StressAwarenessSummary {
  const dominant = scenarios[0];
  const severe = scenarios.filter(
    (s) => s.stressSeverity === "severe" || s.stressSeverity === "critical"
  ).length;
  const elevated = scenarios.filter(
    (s) => s.stressSeverity === "elevated" || s.stressSeverity === "severe" || s.stressSeverity === "critical"
  ).length;

  return {
    dominantCategory: dominant?.category ?? "unknown",
    dominantStressSeverity: dominant?.stressSeverity ?? "low",
    dominantSimulationState: dominant?.simulationState ?? "stable",
    stressHeadline: dominant
      ? dominant.summary.slice(0, 140)
      : "Stress simulation intelligence pending sufficient anticipatory depth.",
    anticipatoryPressureRisk: severe >= 2
      ? "critical"
      : severe >= 1
        ? "severe"
        : elevated >= 2
          ? "elevated"
          : scenarios.length >= 2
            ? "moderate"
            : "low",
  };
}

function buildStressSimulationSnapshot(
  organizationId: string,
  scenarios: OperationalStressScenario[],
  simulations: StrategicPressureSimulation[],
  propagations: EnterpriseStressPropagation[],
  strainSignals: AnticipatoryStrainSignal[],
  pressureFields: OrganizationalPressureField[],
  now: number
): StressSimulationSnapshot {
  const awarenessSummary = buildAwarenessSummary(scenarios);
  const signature = stableSignature([
    "d9-4-5-stress-simulation-snapshot",
    organizationId,
    scenarios.map((s) => s.stressScenarioId),
    awarenessSummary.anticipatoryPressureRisk,
    now,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    scenarioCount: scenarios.length,
    awarenessSummary,
    recentOperationalStressScenarios: Object.freeze(scenarios),
    pressureSimulations: Object.freeze(simulations),
    stressPropagations: Object.freeze(propagations),
    strainSignals: Object.freeze(strainSignals),
    pressureFields: Object.freeze(pressureFields),
  };
}

/**
 * D9:4:5 — Passive strategic stress awareness + anticipatory operational strain evaluation.
 */
export function evaluateStrategicStressAwareness(
  input: ExecutiveStressSimulationInput
): ExecutiveStressSimulationResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();
  const store = getStressSimulationStore(organizationId);

  if (!beginStressSimulationEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: store.getState().snapshots[0] ?? null,
      newOperationalStressScenarios: 0,
      storeSignature: store.getState().signature,
    };
  }

  try {
    const prior = store.getState();
    const constellationState = getRiskConstellationStore(organizationId).getState();
    const foresightState = getForesightCognitionStore(organizationId).getState();
    const earlyWarningState = getEarlyWarningStore(organizationId).getState();
    const driftState = getTemporalDriftProjectionStore(organizationId).getState();
    const replayState = getOperationalReplayStore(organizationId).getState();

    const constellationSnapshot =
      input.constellationSnapshot ?? constellationState.snapshots[0] ?? null;
    const foresightSnapshot = input.foresightSnapshot ?? foresightState.snapshots[0] ?? null;
    const earlyWarningSnapshot =
      input.earlyWarningSnapshot ?? earlyWarningState.snapshots[0] ?? null;
    const positiveDriftSnapshot = input.positiveDriftSnapshot ?? null;
    const temporalSnapshot = input.temporalSnapshot ?? null;
    const driftSnapshot = input.driftSnapshot ?? driftState.snapshots[0] ?? null;
    const replaySnapshot = input.replaySnapshot ?? replayState.snapshots[0] ?? null;

    const evaluationSignature = stableSignature([
      "d9-4-5-stress-simulation-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      constellationSnapshot?.signature ?? constellationState.signature,
      foresightSnapshot?.signature ?? foresightState.signature,
      earlyWarningSnapshot?.signature ?? earlyWarningState.signature,
      positiveDriftSnapshot?.signature ?? "no-positive-drift",
      temporalSnapshot?.signature ?? "no-temporal",
      driftSnapshot?.signature ?? driftState.signature,
      replaySnapshot?.signature ?? replayState.signature,
      input.memorySnapshot?.signature ?? "no-memory",
    ]);

    if (
      !shouldEvaluateStressSimulation(
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
        newOperationalStressScenarios: 0,
        storeSignature: prior.signature,
      };
    }

    const stressDepth =
      (constellationSnapshot?.constellationCount ?? constellationState.constellations.length) +
      (earlyWarningSnapshot?.warningCount ?? earlyWarningState.preEscalationSignals.length) +
      (foresightSnapshot?.signalCount ?? foresightState.emergingSignals.length) +
      (temporalSnapshot?.activeSubsystems.length ?? 0) +
      (replaySnapshot?.replayCount ?? replayState.replays.length);

    if (stressDepth < 3) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_stress_depth",
        snapshot: prior.snapshots[0] ?? null,
        newOperationalStressScenarios: 0,
        storeSignature: prior.signature,
      };
    }

    const projections = driftSnapshot?.recentProjections ?? driftState.projections;
    const replays = replaySnapshot?.recentReplays ?? replayState.replays;
    const narrativeLine = input.enterpriseNarrativeLine ?? "";
    const resilienceForecastLine = input.resilienceForecastLine ?? "";
    const pressureStressed = input.pressureTopologyStressed ?? false;
    const fragilityElevated = input.fragilityElevated ?? false;

    const candidates: OperationalStressScenario[] = [];

    const escalation = buildEscalationAmplificationScenario(
      constellationSnapshot,
      earlyWarningSnapshot,
      fragilityElevated,
      pressureStressed,
      now
    );
    if (escalation) candidates.push(escalation);

    const governance = buildGovernanceOverloadScenario(
      constellationSnapshot,
      earlyWarningSnapshot,
      narrativeLine,
      pressureStressed,
      now
    );
    if (governance) candidates.push(governance);

    const fatigue = buildResilienceFatigueScenario(
      constellationSnapshot,
      projections,
      replays,
      resilienceForecastLine,
      pressureStressed,
      now
    );
    if (fatigue) candidates.push(fatigue);

    const coordination = buildCoordinationStrainPropagation(
      constellationSnapshot,
      earlyWarningSnapshot,
      pressureStressed,
      now
    );
    if (coordination) candidates.push(coordination);

    const systemic = buildSystemicPressureVulnerability(
      constellationSnapshot,
      temporalSnapshot,
      projections,
      now
    );
    if (systemic) candidates.push(systemic);

    const bottleneck = buildOperationalBottleneckScenario(
      pressureStressed,
      temporalSnapshot,
      foresightSnapshot,
      now
    );
    if (bottleneck) candidates.push(bottleneck);

    const adaptiveRecovery = buildAdaptiveRecoveryUnderStress(
      positiveDriftSnapshot,
      foresightSnapshot,
      pressureStressed,
      now
    );
    if (adaptiveRecovery) candidates.push(adaptiveRecovery);

    const retained = rankStressScenarios(
      candidates.filter(shouldRetainOperationalStressScenario)
    );
    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_stress_scenarios",
        snapshot: prior.snapshots[0] ?? null,
        newOperationalStressScenarios: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.operationalStressScenarios.map((s) => s.stressScenarioId));
    const newCount = retained.filter((s) => !priorIds.has(s.stressScenarioId)).length;

    store.upsertOperationalStressScenarios(retained, now);

    const simulations = buildPressureSimulations(retained, now);
    store.upsertPressureSimulations(simulations, now);

    const propagations = buildStressPropagations(retained, now);
    store.upsertStressPropagations(propagations, now);

    const pressureFields = buildPressureFields(retained, now);
    store.upsertPressureFields(pressureFields, now);

    const strainSignals = buildStrainSignals(retained, now);
    store.upsertStrainSignals(strainSignals, now);

    const snapshot = buildStressSimulationSnapshot(
      organizationId,
      retained,
      simulations,
      propagations,
      strainSignals,
      pressureFields,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (retained.some((s) => s.stressSeverity === "elevated" || s.stressSeverity === "severe")) {
      devLog(`elevated pressure formation — ${snapshot.awarenessSummary.anticipatoryPressureRisk}`);
    }
    if (coordination || escalation) {
      devLog(`stress propagation growth — ${snapshot.awarenessSummary.dominantSimulationState}`);
    }
    if (fatigue) {
      devLog(`resilience fatigue emergence — ${fatigue.stressSeverity}`);
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newOperationalStressScenarios: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endStressSimulationEvaluation();
  }
}
