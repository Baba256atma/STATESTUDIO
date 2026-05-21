import { stableSignature } from "../intelligence/shared/dedupe";
import { getRiskConstellationStore } from "./riskConstellationStore";
import { getForesightCognitionStore } from "./foresightCognitionStore";
import { getOperationalReplayStore } from "../temporal-cognition/operationalReplayStore";
import { getTemporalDriftProjectionStore } from "../temporal-cognition/temporalDriftProjectionStore";
import type { EnterpriseRiskConstellation } from "./riskConstellationTypes";
import type { TemporalDriftProjection } from "../temporal-cognition/temporalDriftProjectionTypes";
import {
  beginEarlyWarningEvaluation,
  confidenceToEarlyWarningLevel,
  endEarlyWarningEvaluation,
  severityRank,
  shouldEvaluateEarlyWarning,
  shouldRetainPreEscalationSignal,
} from "./earlyWarningGuards";
import { getEarlyWarningStore } from "./earlyWarningStore";
import type {
  EarlyWarningAwarenessSummary,
  EnterpriseEarlyWarningSnapshot,
  EscalationPrecursorField,
  ExecutiveEarlyWarningInput,
  ExecutiveEarlyWarningResult,
  EscalationState,
  OrganizationalWarningPattern,
  PreEscalationSignal,
  StrategicInstabilityIndicator,
  WarningCategory,
  WarningSeverity,
} from "./earlyWarningTypes";
import type { EnterpriseForesightSnapshot } from "./foresightCognitionTypes";
import type { RiskConstellationSnapshot } from "./riskConstellationTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";

const DEV_LOG_PREFIX = "[Nexora][EarlyWarning]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildWarningId(category: WarningCategory, severity: WarningSeverity): string {
  return stableSignature(["pre-escalation-warning", category, severity]).slice(0, 56);
}

function dedupeWarningSignals(signals: string[]): readonly string[] {
  return Object.freeze(Array.from(new Set(signals)).slice(0, 6));
}

function createPreEscalationSignal(
  category: WarningCategory,
  warningSeverity: WarningSeverity,
  escalationState: EscalationState,
  summary: string,
  warningSignals: string[],
  confidence: number,
  now: number
): PreEscalationSignal {
  const conf = Number(Math.min(0.92, Math.max(0.5, confidence)).toFixed(2));
  return {
    warningId: buildWarningId(category, warningSeverity),
    category,
    warningSeverity,
    escalationState,
    summary,
    warningSignals: dedupeWarningSignals(warningSignals),
    confidence: conf,
    confidenceLevel: confidenceToEarlyWarningLevel(conf),
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

function buildEscalationPrecursorWarning(
  constellationSnapshot: RiskConstellationSnapshot | null,
  foresight: EnterpriseForesightSnapshot | null,
  pressureStressed: boolean,
  now: number
): PreEscalationSignal | null {
  const escalationConstellation =
    hasConstellationCategory(constellationSnapshot?.recentConstellations ?? [], [
      "escalation_network",
      "operational_pressure_field",
      "fragility_cluster",
    ]) ||
    foresight?.awarenessSummary.preEscalationRisk === "elevated" ||
    foresight?.awarenessSummary.preEscalationRisk === "moderate";
  if (!escalationConstellation && !pressureStressed) return null;

  return createPreEscalationSignal(
    "escalation_precursor",
    pressureStressed && escalationConstellation ? "elevated" : "moderate",
    "emerging",
    "Operational pressure concentration and coordination instability are gradually intensifying across dependent systems, suggesting increasing escalation potential.",
    [
      "pressure_accumulation",
      "coordination_degradation",
      "escalation_precursor",
      "dependency_instability",
    ],
    pressureStressed ? 0.87 : 0.78,
    now
  );
}

function buildGovernanceSlowdownWarning(
  constellationSnapshot: RiskConstellationSnapshot | null,
  narrativeLine: string,
  continuityPreserved: boolean,
  now: number
): PreEscalationSignal | null {
  const govDrift = hasConstellationCategory(constellationSnapshot?.recentConstellations ?? [], [
    "governance_drift",
  ]);
  const narrativeGov =
    narrativeLine.includes("governance") &&
    (narrativeLine.includes("delay") || narrativeLine.includes("slowdown"));
  if (!govDrift && continuityPreserved && !narrativeGov) return null;

  return createPreEscalationSignal(
    "governance_delay",
    govDrift ? "elevated" : "moderate",
    "intensifying",
    "Governance slowdown indicators are emerging across correlated systems, signaling organizational instability before escalation spreads.",
    [
      "governance_slowdown",
      "oversight_delay",
      "institutional_friction",
    ],
    govDrift ? 0.82 : 0.72,
    now
  );
}

function buildResilienceErosionWarning(
  constellationSnapshot: RiskConstellationSnapshot | null,
  projections: readonly TemporalDriftProjection[],
  resilienceForecastLine: string,
  replays: readonly { replayState: string }[],
  now: number
): PreEscalationSignal | null {
  const erosion = hasConstellationCategory(constellationSnapshot?.recentConstellations ?? [], [
    "resilience_erosion",
  ]);
  const driftWeak = projections.some(
    (p) => p.trajectoryDirection === "fragile" || p.trajectoryDirection === "stagnating"
  );
  const recoveryDelayed = replays.some(
    (r) => r.replayState !== "recovering" && r.replayState !== "resolved"
  );
  const forecastWeak =
    resilienceForecastLine.includes("weaken") || resilienceForecastLine.includes("risk");
  if (!erosion && !driftWeak && !recoveryDelayed && !forecastWeak) return null;

  return createPreEscalationSignal(
    "resilience_erosion",
    erosion && recoveryDelayed ? "elevated" : "moderate",
    "emerging",
    "Recovery delays are increasing gradually while resilience indicators weaken, forming a pre-escalation erosion warning across operational horizons.",
    [
      "recovery_delay_growth",
      "resilience_erosion",
      "operational_fatigue",
    ],
    erosion ? 0.84 : 0.74,
    now
  );
}

function buildFragilityAccumulationAlert(
  foresight: EnterpriseForesightSnapshot | null,
  fragilityElevated: boolean,
  memoryConcern: boolean,
  now: number
): PreEscalationSignal | null {
  const fragile =
    fragilityElevated ||
    memoryConcern ||
    foresight?.awarenessSummary.resilienceEmergence === "weakening" ||
    foresight?.recentEmergingSignals.some((s) => s.category === "fragility");
  if (!fragile) return null;

  return createPreEscalationSignal(
    "fragility_accumulation",
    fragilityElevated ? "elevated" : "moderate",
    "intensifying",
    "Repeated operational friction and fragility accumulation are intensifying, indicating vulnerability buildup before visible crisis formation.",
    [
      "fragility_intensification",
      "operational_friction_growth",
      "weak_signal_accumulation",
    ],
    fragilityElevated ? 0.83 : 0.75,
    now
  );
}

function buildPreEscalationInstabilityTrend(
  constellationSnapshot: RiskConstellationSnapshot | null,
  projections: readonly TemporalDriftProjection[],
  distributedRiskElevated: boolean,
  now: number
): PreEscalationSignal | null {
  const spreading = hasConstellationCategory(constellationSnapshot?.recentConstellations ?? [], [
    "escalation_network",
    "systemic_instability",
  ]);
  const propagating = projections.some(
    (p) => p.trajectoryDirection === "unstable" || p.trajectoryDirection === "degrading"
  );
  if (!spreading && !propagating && !distributedRiskElevated) return null;

  return createPreEscalationSignal(
    "escalation_precursor",
    distributedRiskElevated ? "critical" : "elevated",
    "spreading",
    "Escalation propagation is spreading slowly across correlated weak-signal clusters, indicating a pre-escalation instability trend.",
    [
      "escalation_propagation",
      "pressure_spread",
      "instability_momentum",
    ],
    distributedRiskElevated ? 0.88 : 0.8,
    now
  );
}

function buildSystemicVulnerabilityWarning(
  constellationSnapshot: RiskConstellationSnapshot | null,
  temporal: EnterpriseTimeIntelligenceSnapshot | null,
  convergenceWeak: boolean,
  now: number
): PreEscalationSignal | null {
  const systemic =
    constellationSnapshot?.awarenessSummary.distributedRiskLevel === "systemic" ||
    constellationSnapshot?.awarenessSummary.distributedRiskLevel === "elevated";
  const runtimeWeak =
    temporal?.runtimeStatus === "degraded" || temporal?.runtimeStatus === "unstable";
  if (!systemic && !runtimeWeak && !convergenceWeak) return null;

  return createPreEscalationSignal(
    "systemic_instability",
    systemic ? "critical" : "elevated",
    "unstable",
    "Stabilization is weakening over time across temporal and constellation layers, signaling systemic operational vulnerability before escalation becomes visible.",
    [
      "stabilization_weakening",
      "systemic_vulnerability",
      "enterprise_instability",
    ],
    systemic ? 0.86 : 0.77,
    now
  );
}

function buildCoordinationInstabilityWarning(
  constellationSnapshot: RiskConstellationSnapshot | null,
  now: number
): PreEscalationSignal | null {
  const coordination = hasConstellationCategory(constellationSnapshot?.recentConstellations ?? [], [
    "coordination_breakdown",
    "fragility_cluster",
  ]);
  if (!coordination) return null;

  return createPreEscalationSignal(
    "coordination_instability",
    "moderate",
    "intensifying",
    "Coordination degradation patterns are correlating with pressure buildup, forming distributed operational warning formations across enterprise dependencies.",
    [
      "coordination_instability",
      "dependency_degradation",
      "synchronization_friction",
    ],
    0.79,
    now
  );
}

function buildOperationalPressureWarning(
  pressureStressed: boolean,
  temporal: EnterpriseTimeIntelligenceSnapshot | null,
  now: number
): PreEscalationSignal | null {
  if (!pressureStressed && temporal?.summary.resilienceDirection !== "at_risk") return null;

  return createPreEscalationSignal(
    "operational_pressure",
    pressureStressed ? "elevated" : "moderate",
    "emerging",
    "Operational pressure fields are intensifying across enterprise layers, elevating pre-escalation awareness for executive intervention planning.",
    [
      "operational_pressure",
      "pressure_topology_stress",
      "executive_attention_signal",
    ],
    pressureStressed ? 0.81 : 0.7,
    now
  );
}

function rankPreEscalationSignals(signals: PreEscalationSignal[]): PreEscalationSignal[] {
  return [...signals]
    .sort(
      (a, b) =>
        severityRank(b.warningSeverity) - severityRank(a.warningSeverity) ||
        b.confidence - a.confidence
    )
    .slice(0, 6);
}

function buildWarningPatterns(
  signals: PreEscalationSignal[],
  now: number
): OrganizationalWarningPattern[] {
  return signals.slice(0, 4).map((s) => ({
    patternId: stableSignature(["warning-pattern", s.warningId]).slice(0, 48),
    category: s.category,
    patternLabel: `${s.category} warning pattern`,
    patternSummary: s.summary.slice(0, 120),
    linkedWarningIds: Object.freeze([s.warningId]),
    warningSeverity: s.warningSeverity,
    generatedAt: now,
  }));
}

function buildPrecursorFields(
  signals: PreEscalationSignal[],
  now: number
): EscalationPrecursorField[] {
  return signals
    .filter((s) => s.category === "escalation_precursor" || s.escalationState === "spreading")
    .slice(0, 3)
    .map((s) => ({
      fieldId: stableSignature(["precursor-field", s.warningId]).slice(0, 48),
      category: s.category,
      fieldLabel: `${s.category} precursor field`,
      precursorSummary: s.summary.slice(0, 100),
      warningSignals: s.warningSignals,
      escalationState: s.escalationState,
      generatedAt: now,
    }));
}

function buildInstabilityIndicators(
  signals: PreEscalationSignal[],
  now: number
): StrategicInstabilityIndicator[] {
  return signals.slice(0, 4).map((s) => ({
    indicatorId: stableSignature(["instability-indicator", s.warningId]).slice(0, 48),
    category: s.category,
    indicatorLabel: `${s.category} instability`,
    instabilityHint: s.escalationState,
    warningSeverity: s.warningSeverity,
    confidence: s.confidence,
    generatedAt: now,
  }));
}

function buildAwarenessSummary(signals: PreEscalationSignal[]): EarlyWarningAwarenessSummary {
  const dominant = signals[0];
  const critical = signals.some((s) => s.warningSeverity === "critical");
  const elevated = signals.filter(
    (s) => s.warningSeverity === "elevated" || s.warningSeverity === "critical"
  ).length;

  return {
    dominantCategory: dominant?.category ?? "unknown",
    dominantWarningSeverity: dominant?.warningSeverity ?? "low",
    dominantEscalationState: dominant?.escalationState ?? "dormant",
    warningHeadline: dominant
      ? dominant.summary.slice(0, 140)
      : "Early warning intelligence pending sufficient precursor depth.",
    preEscalationRisk: critical
      ? "critical"
      : elevated >= 2
        ? "elevated"
        : signals.length >= 2
          ? "moderate"
          : "low",
  };
}

function buildEarlyWarningSnapshot(
  organizationId: string,
  signals: PreEscalationSignal[],
  patterns: OrganizationalWarningPattern[],
  fields: EscalationPrecursorField[],
  indicators: StrategicInstabilityIndicator[],
  now: number
): EnterpriseEarlyWarningSnapshot {
  const awarenessSummary = buildAwarenessSummary(signals);
  const signature = stableSignature([
    "d9-4-3-early-warning-snapshot",
    organizationId,
    signals.map((s) => s.warningId),
    awarenessSummary.preEscalationRisk,
    now,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    warningCount: signals.length,
    awarenessSummary,
    recentPreEscalationSignals: Object.freeze(signals),
    warningPatterns: Object.freeze(patterns),
    precursorFields: Object.freeze(fields),
    instabilityIndicators: Object.freeze(indicators),
  };
}

/**
 * D9:4:3 — Passive executive pre-escalation + early warning intelligence evaluation.
 */
export function evaluateExecutiveEarlyWarningIntelligence(
  input: ExecutiveEarlyWarningInput
): ExecutiveEarlyWarningResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();
  const store = getEarlyWarningStore(organizationId);

  if (!beginEarlyWarningEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: store.getState().snapshots[0] ?? null,
      newPreEscalationSignals: 0,
      storeSignature: store.getState().signature,
    };
  }

  try {
    const prior = store.getState();
    const constellationState = getRiskConstellationStore(organizationId).getState();
    const foresightState = getForesightCognitionStore(organizationId).getState();
    const driftState = getTemporalDriftProjectionStore(organizationId).getState();
    const replayState = getOperationalReplayStore(organizationId).getState();

    const constellationSnapshot =
      input.constellationSnapshot ?? constellationState.snapshots[0] ?? null;
    const foresightSnapshot = input.foresightSnapshot ?? foresightState.snapshots[0] ?? null;
    const temporalSnapshot = input.temporalSnapshot ?? null;
    const driftSnapshot = input.driftSnapshot ?? driftState.snapshots[0] ?? null;
    const replaySnapshot = input.replaySnapshot ?? replayState.snapshots[0] ?? null;

    const evaluationSignature = stableSignature([
      "d9-4-3-early-warning-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      constellationSnapshot?.signature ?? constellationState.signature,
      foresightSnapshot?.signature ?? foresightState.signature,
      temporalSnapshot?.signature ?? "no-temporal",
      driftSnapshot?.signature ?? driftState.signature,
      replaySnapshot?.signature ?? replayState.signature,
      input.memorySnapshot?.signature ?? "no-memory",
    ]);

    if (
      !shouldEvaluateEarlyWarning(
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
        newPreEscalationSignals: 0,
        storeSignature: prior.signature,
      };
    }

    const warningDepth =
      (constellationSnapshot?.constellationCount ?? constellationState.constellations.length) +
      (foresightSnapshot?.signalCount ?? foresightState.emergingSignals.length) +
      (temporalSnapshot?.activeSubsystems.length ?? 0) +
      (replaySnapshot?.replayCount ?? replayState.replays.length);

    if (warningDepth < 3) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_warning_depth",
        snapshot: prior.snapshots[0] ?? null,
        newPreEscalationSignals: 0,
        storeSignature: prior.signature,
      };
    }

    const projections = driftSnapshot?.recentProjections ?? driftState.projections;
    const replays = replaySnapshot?.recentReplays ?? replayState.replays;
    const narrativeLine = input.enterpriseNarrativeLine ?? "";
    const resilienceForecastLine = input.resilienceForecastLine ?? "";
    const memoryConcern = input.memorySnapshot?.continuityConcernActive ?? false;
    const distributedRiskElevated =
      constellationSnapshot?.awarenessSummary.distributedRiskLevel === "systemic" ||
      constellationSnapshot?.awarenessSummary.distributedRiskLevel === "elevated";
    const convergenceWeak = !projections.some((p) => p.trajectoryDirection === "stabilizing");

    const candidates: PreEscalationSignal[] = [];

    const escalationPrecursor = buildEscalationPrecursorWarning(
      constellationSnapshot,
      foresightSnapshot,
      input.pressureTopologyStressed ?? false,
      now
    );
    if (escalationPrecursor) candidates.push(escalationPrecursor);

    const governance = buildGovernanceSlowdownWarning(
      constellationSnapshot,
      narrativeLine,
      input.continuityPreserved ?? true,
      now
    );
    if (governance) candidates.push(governance);

    const resilience = buildResilienceErosionWarning(
      constellationSnapshot,
      projections,
      resilienceForecastLine,
      replays,
      now
    );
    if (resilience) candidates.push(resilience);

    const fragility = buildFragilityAccumulationAlert(
      foresightSnapshot,
      input.fragilityElevated ?? false,
      memoryConcern,
      now
    );
    if (fragility) candidates.push(fragility);

    const instabilityTrend = buildPreEscalationInstabilityTrend(
      constellationSnapshot,
      projections,
      distributedRiskElevated,
      now
    );
    if (instabilityTrend) candidates.push(instabilityTrend);

    const systemic = buildSystemicVulnerabilityWarning(
      constellationSnapshot,
      temporalSnapshot,
      convergenceWeak,
      now
    );
    if (systemic) candidates.push(systemic);

    const coordination = buildCoordinationInstabilityWarning(constellationSnapshot, now);
    if (coordination) candidates.push(coordination);

    const pressure = buildOperationalPressureWarning(
      input.pressureTopologyStressed ?? false,
      temporalSnapshot,
      now
    );
    if (pressure) candidates.push(pressure);

    const retained = rankPreEscalationSignals(candidates.filter(shouldRetainPreEscalationSignal));
    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_warnings",
        snapshot: prior.snapshots[0] ?? null,
        newPreEscalationSignals: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.preEscalationSignals.map((s) => s.warningId));
    const newCount = retained.filter((s) => !priorIds.has(s.warningId)).length;

    store.upsertPreEscalationSignals(retained, now);

    const patterns = buildWarningPatterns(retained, now);
    store.upsertWarningPatterns(patterns, now);

    const fields = buildPrecursorFields(retained, now);
    store.upsertPrecursorFields(fields, now);

    const indicators = buildInstabilityIndicators(retained, now);
    store.upsertInstabilityIndicators(indicators, now);

    const snapshot = buildEarlyWarningSnapshot(
      organizationId,
      retained,
      patterns,
      fields,
      indicators,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (retained.some((s) => s.warningSeverity === "elevated" || s.warningSeverity === "critical")) {
      devLog(`elevated warning emergence — ${snapshot.awarenessSummary.preEscalationRisk}`);
    }
    if (instabilityTrend || escalationPrecursor) {
      devLog(`escalation precursor formation — ${snapshot.awarenessSummary.dominantEscalationState}`);
    }
    if (
      prior.snapshots[0]?.awarenessSummary.dominantEscalationState !==
      snapshot.awarenessSummary.dominantEscalationState
    ) {
      devLog(`instability intensification — ${snapshot.awarenessSummary.dominantEscalationState}`);
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newPreEscalationSignals: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endEarlyWarningEvaluation();
  }
}
