import { stableSignature } from "../intelligence/shared/dedupe";
import { getPreparednessCognitionStore } from "./preparednessCognitionStore";
import { getInterventionTimingStore } from "./interventionTimingStore";
import { getStressSimulationStore } from "./stressSimulationStore";
import { getEarlyWarningStore } from "./earlyWarningStore";
import { getPositiveDriftStore } from "./positiveDriftStore";
import { getRiskConstellationStore } from "./riskConstellationStore";
import type { EnterpriseRiskConstellation } from "./riskConstellationTypes";
import type { EnterpriseEarlyWarningSnapshot } from "./earlyWarningTypes";
import type { InterventionWindowSnapshot } from "./interventionTimingTypes";
import type { EnterprisePreparednessSnapshot } from "./preparednessCognitionTypes";
import type { PositiveTrajectorySnapshot } from "./positiveDriftTypes";
import type { StressSimulationSnapshot } from "./stressSimulationTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import {
  beginAdvisoryForesightEvaluation,
  confidenceToGuidanceLevel,
  endAdvisoryForesightEvaluation,
  priorityRank,
  shouldEvaluateAdvisoryForesight,
  shouldRetainExecutiveGuidanceRecommendation,
} from "./advisoryForesightGuards";
import { getAdvisoryForesightStore } from "./advisoryForesightStore";
import type {
  AdvisoryAwarenessSummary,
  AdvisoryPriorityField,
  AdvisoryState,
  EnterpriseRecommendationSnapshot,
  ExecutiveAdvisoryForesightInput,
  ExecutiveAdvisoryForesightResult,
  ExecutiveGuidanceRecommendation,
  OrganizationalFocusSuggestion,
  RecommendationCategory,
  RecommendationPriority,
  StrategicAdvisorySignal,
} from "./advisoryForesightTypes";

const DEV_LOG_PREFIX = "[Nexora][AdvisoryForesight]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildAdvisoryId(category: RecommendationCategory, priority: RecommendationPriority): string {
  return stableSignature(["executive-guidance", category, priority]).slice(0, 56);
}

function dedupeRecommendations(items: string[]): readonly string[] {
  return Object.freeze(Array.from(new Set(items)).slice(0, 6));
}

function createGuidanceRecommendation(
  category: RecommendationCategory,
  recommendationPriority: RecommendationPriority,
  advisoryState: AdvisoryState,
  summary: string,
  recommendations: string[],
  confidence: number,
  now: number
): ExecutiveGuidanceRecommendation {
  const conf = Number(Math.min(0.92, Math.max(0.5, confidence)).toFixed(2));
  return {
    advisoryId: buildAdvisoryId(category, recommendationPriority),
    category,
    recommendationPriority,
    advisoryState,
    summary,
    recommendations: dedupeRecommendations(recommendations),
    confidence: conf,
    confidenceLevel: confidenceToGuidanceLevel(conf),
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

function buildEscalationPreventionGuidance(
  earlyWarning: EnterpriseEarlyWarningSnapshot | null,
  stress: StressSimulationSnapshot | null,
  intervention: InterventionWindowSnapshot | null,
  pressureStressed: boolean,
  now: number
): ExecutiveGuidanceRecommendation | null {
  const escalating =
    earlyWarning?.awarenessSummary.preEscalationRisk === "elevated" ||
    earlyWarning?.awarenessSummary.preEscalationRisk === "critical" ||
    stress?.awarenessSummary.anticipatoryPressureRisk === "severe" ||
    stress?.awarenessSummary.anticipatoryPressureRisk === "critical";
  const timingUrgent =
    intervention?.awarenessSummary.interventionUrgency === "high" ||
    intervention?.awarenessSummary.interventionUrgency === "critical";
  if (!escalating && !pressureStressed && !timingUrgent) return null;

  return createGuidanceRecommendation(
    "escalation_prevention",
    escalating && timingUrgent ? "critical" : "elevated",
    timingUrgent ? "urgent" : "actionable",
    "Escalation pressure is increasing across correlated systems; earlier containment and localized intervention may reduce propagation risk.",
    [
      "contain_escalation_spread",
      "prioritize_localized_intervention",
      "monitor_pressure_topology",
      "strengthen_escalation_response_readiness",
    ],
    escalating ? 0.87 : 0.78,
    now
  );
}

function buildResilienceReinforcementGuidance(
  positiveDrift: PositiveTrajectorySnapshot | null,
  preparedness: EnterprisePreparednessSnapshot | null,
  resilienceForecastLine: string,
  now: number
): ExecutiveGuidanceRecommendation | null {
  const recovering =
    positiveDrift?.recentStrategicOpportunitySignals.some(
      (s) => s.category === "recovery_acceleration" || s.category === "resilience_growth"
    ) ||
    preparedness?.recentStrategicReadinessSignals.some(
      (s) => s.category === "resilience_capacity" && s.readinessState === "prepared"
    );
  const forecastPositive =
    resilienceForecastLine.includes("strengthen") || resilienceForecastLine.includes("improv");
  if (!recovering && !forecastPositive) return null;

  return createGuidanceRecommendation(
    "resilience_reinforcement",
    recovering ? "elevated" : "moderate",
    "stabilizing",
    "Recovery is improving under stabilization conditions; reinforcing resilience coordination may strengthen long-term operational preparedness.",
    [
      "reinforce_recovery_coordination",
      "sustain_resilience_momentum",
      "strengthen_adaptive_capacity",
      "preserve_stabilization_gains",
    ],
    recovering ? 0.86 : 0.76,
    now
  );
}

function buildGovernanceAlignmentAdvisory(
  earlyWarning: EnterpriseEarlyWarningSnapshot | null,
  stress: StressSimulationSnapshot | null,
  preparedness: EnterprisePreparednessSnapshot | null,
  narrativeLine: string,
  now: number
): ExecutiveGuidanceRecommendation | null {
  const govInstability =
    earlyWarning?.recentPreEscalationSignals.some((s) => s.category === "governance_delay") ||
    stress?.recentOperationalStressScenarios.some((s) => s.category === "governance_overload") ||
    preparedness?.preparednessGapIndicators.some((g) => g.category === "governance_readiness");
  const narrativeGov =
    narrativeLine.includes("governance") &&
    (narrativeLine.includes("delay") || narrativeLine.includes("instability"));
  if (!govInstability && !narrativeGov) return null;

  return createGuidanceRecommendation(
    "governance_alignment",
    govInstability ? "elevated" : "moderate",
    "actionable",
    "Operational stabilization may improve through earlier governance coordination and oversight alignment across dependent systems.",
    [
      "strengthen_governance_alignment",
      "reduce_oversight_delay",
      "align_institutional_oversight",
      "coordinate_governance_response",
    ],
    govInstability ? 0.85 : 0.75,
    now
  );
}

function buildCoordinationStabilizationGuidance(
  stress: StressSimulationSnapshot | null,
  earlyWarning: EnterpriseEarlyWarningSnapshot | null,
  constellationSnapshot: { recentConstellations: readonly EnterpriseRiskConstellation[] } | null,
  now: number
): ExecutiveGuidanceRecommendation | null {
  const coordinationStrain =
    stress?.recentOperationalStressScenarios.some((s) => s.category === "coordination_strain") ||
    earlyWarning?.recentPreEscalationSignals.some((s) => s.category === "coordination_instability") ||
    hasConstellationCategory(constellationSnapshot?.recentConstellations ?? [], [
      "coordination_breakdown",
      "fragility_cluster",
    ]);
  if (!coordinationStrain) return null;

  return createGuidanceRecommendation(
    "coordination_stabilization",
    "elevated",
    "actionable",
    "Coordination degradation is spreading across operational dependencies; operational alignment focus may reduce synchronization friction before systemic degradation forms.",
    [
      "stabilize_coordination_dependencies",
      "reduce_synchronization_friction",
      "align_operational_handoffs",
      "reinforce_cross_system_coordination",
    ],
    0.84,
    now
  );
}

function buildPressureReductionStabilizationFocus(
  stress: StressSimulationSnapshot | null,
  intervention: InterventionWindowSnapshot | null,
  pressureStressed: boolean,
  now: number
): ExecutiveGuidanceRecommendation | null {
  if (!pressureStressed && stress?.awarenessSummary.anticipatoryPressureRisk !== "elevated") {
    return null;
  }
  const narrowing = intervention?.recentStrategicInterventionWindows.some(
    (w) => w.category === "pressure_reduction" || w.windowState === "narrowing"
  );

  return createGuidanceRecommendation(
    "pressure_reduction",
    pressureStressed ? "elevated" : "moderate",
    narrowing ? "urgent" : "actionable",
    "Operational stabilization may improve through earlier governance coordination and pressure concentration reduction across dependent systems.",
    [
      "strengthen_governance_alignment",
      "reduce_operational_pressure_spread",
      "reinforce_recovery_coordination",
      "focus_stabilization_effort",
    ],
    pressureStressed ? 0.86 : 0.77,
    now
  );
}

function buildAdaptiveGrowthOpportunityGuidance(
  positiveDrift: PositiveTrajectorySnapshot | null,
  preparedness: EnterprisePreparednessSnapshot | null,
  now: number
): ExecutiveGuidanceRecommendation | null {
  const positive =
    positiveDrift?.awarenessSummary.positiveMomentum === "strong" ||
    positiveDrift?.awarenessSummary.positiveMomentum === "accelerating" ||
    preparedness?.awarenessSummary.enterprisePreparednessPosture === "strong" ||
    preparedness?.awarenessSummary.enterprisePreparednessPosture === "resilient";
  if (!positive) return null;

  return createGuidanceRecommendation(
    "strategic_realignment",
    "moderate",
    "relevant",
    "Positive organizational drift is strengthening; adaptive enterprise strengthening paths may be pursued while stabilization gains remain active.",
    [
      "pursue_adaptive_growth_opportunity",
      "preserve_positive_momentum",
      "align_strategic_strengthening",
      "reinforce_institutional_learning",
    ],
    0.8,
    now
  );
}

function buildOperationalFocusGuidance(
  intervention: InterventionWindowSnapshot | null,
  temporal: EnterpriseTimeIntelligenceSnapshot | null,
  now: number
): ExecutiveGuidanceRecommendation | null {
  const focusNeeded =
    intervention?.recentStrategicInterventionWindows.some(
      (w) => w.windowState === "active" || w.windowState === "narrowing"
    ) ||
    temporal?.summary.resilienceDirection === "at_risk" ||
    temporal?.runtimeStatus === "degraded";
  if (!focusNeeded) return null;

  return createGuidanceRecommendation(
    "operational_focus",
    "moderate",
    "relevant",
    "Executive operational focus may benefit from prioritizing active intervention windows and resilience-sensitive subsystems before opportunity decay accelerates.",
    [
      "prioritize_active_intervention_windows",
      "focus_resilience_sensitive_systems",
      "sequence_stabilization_actions",
    ],
    0.74,
    now
  );
}

function buildRecoveryAccelerationAdvisory(
  positiveDrift: PositiveTrajectorySnapshot | null,
  intervention: InterventionWindowSnapshot | null,
  now: number
): ExecutiveGuidanceRecommendation | null {
  const recoveryWindow = intervention?.recentStrategicInterventionWindows.some(
    (w) => w.category === "recovery_acceleration" || w.category === "resilience_reinforcement"
  );
  const opportunity = positiveDrift?.recentStrategicOpportunitySignals.some(
    (s) => s.category === "recovery_acceleration"
  );
  if (!recoveryWindow && !opportunity) return null;

  return createGuidanceRecommendation(
    "recovery_acceleration",
    opportunity ? "elevated" : "moderate",
    "actionable",
    "Recovery acceleration opportunity is emerging; reinforcing recovery coordination while intervention timing remains favorable may improve operational preparedness.",
    [
      "accelerate_recovery_coordination",
      "reinforce_recovery_momentum",
      "align_recovery_intervention_timing",
    ],
    opportunity ? 0.83 : 0.75,
    now
  );
}

function rankGuidanceRecommendations(
  recommendations: ExecutiveGuidanceRecommendation[]
): ExecutiveGuidanceRecommendation[] {
  return [...recommendations]
    .sort(
      (a, b) =>
        priorityRank(b.recommendationPriority) - priorityRank(a.recommendationPriority) ||
        b.confidence - a.confidence
    )
    .slice(0, 6);
}

function buildStrategicAdvisorySignals(
  recommendations: ExecutiveGuidanceRecommendation[],
  now: number
): StrategicAdvisorySignal[] {
  return recommendations.slice(0, 4).map((r) => ({
    signalId: stableSignature(["advisory-signal", r.advisoryId]).slice(0, 48),
    category: r.category,
    signalLabel: `${r.category} advisory signal`,
    signalSummary: r.summary.slice(0, 100),
    recommendationPriority: r.recommendationPriority,
    advisoryState: r.advisoryState,
    confidence: r.confidence,
    generatedAt: now,
  }));
}

function buildFocusSuggestions(
  recommendations: ExecutiveGuidanceRecommendation[],
  now: number
): OrganizationalFocusSuggestion[] {
  return recommendations.slice(0, 4).map((r) => ({
    suggestionId: stableSignature(["focus-suggestion", r.advisoryId]).slice(0, 48),
    category: r.category,
    focusLabel: `${r.category} focus`,
    focusSummary: r.summary.slice(0, 120),
    linkedAdvisoryIds: Object.freeze([r.advisoryId]),
    recommendationPriority: r.recommendationPriority,
    generatedAt: now,
  }));
}

function buildPriorityFields(
  recommendations: ExecutiveGuidanceRecommendation[],
  now: number
): AdvisoryPriorityField[] {
  return recommendations
    .filter(
      (r) =>
        r.recommendationPriority === "elevated" ||
        r.recommendationPriority === "critical" ||
        r.advisoryState === "urgent"
    )
    .slice(0, 3)
    .map((r) => ({
      fieldId: stableSignature(["advisory-priority-field", r.advisoryId]).slice(0, 48),
      category: r.category,
      fieldLabel: `${r.category} priority field`,
      prioritySummary: r.summary.slice(0, 100),
      recommendations: r.recommendations,
      advisoryState: r.advisoryState,
      generatedAt: now,
    }));
}

function buildAwarenessSummary(
  recommendations: ExecutiveGuidanceRecommendation[]
): AdvisoryAwarenessSummary {
  const dominant = recommendations[0];
  const critical = recommendations.filter((r) => r.recommendationPriority === "critical").length;
  const elevated = recommendations.filter(
    (r) => r.recommendationPriority === "elevated" || r.recommendationPriority === "critical"
  ).length;

  return {
    dominantCategory: dominant?.category ?? "unknown",
    dominantRecommendationPriority: dominant?.recommendationPriority ?? "informational",
    dominantAdvisoryState: dominant?.advisoryState ?? "emerging",
    advisoryHeadline: dominant
      ? dominant.summary.slice(0, 140)
      : "Advisory foresight pending sufficient recommendation synthesis depth.",
    guidanceUrgency: critical >= 1
      ? "critical"
      : elevated >= 2
        ? "elevated"
        : recommendations.length >= 2
          ? "moderate"
          : "low",
  };
}

function buildRecommendationSnapshot(
  organizationId: string,
  recommendations: ExecutiveGuidanceRecommendation[],
  signals: StrategicAdvisorySignal[],
  focusSuggestions: OrganizationalFocusSuggestion[],
  priorityFields: AdvisoryPriorityField[],
  now: number
): EnterpriseRecommendationSnapshot {
  const awarenessSummary = buildAwarenessSummary(recommendations);
  const signature = stableSignature([
    "d9-4-8-advisory-snapshot",
    organizationId,
    recommendations.map((r) => r.advisoryId),
    awarenessSummary.guidanceUrgency,
    now,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    recommendationCount: recommendations.length,
    awarenessSummary,
    recentExecutiveGuidanceRecommendations: Object.freeze(recommendations),
    strategicAdvisorySignals: Object.freeze(signals),
    organizationalFocusSuggestions: Object.freeze(focusSuggestions),
    advisoryPriorityFields: Object.freeze(priorityFields),
  };
}

/**
 * D9:4:8 — Passive strategic executive advisory + enterprise guidance recommendation synthesis.
 */
export function evaluateStrategicExecutiveAdvisory(
  input: ExecutiveAdvisoryForesightInput
): ExecutiveAdvisoryForesightResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();
  const store = getAdvisoryForesightStore(organizationId);

  if (!beginAdvisoryForesightEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: store.getState().snapshots[0] ?? null,
      newExecutiveGuidanceRecommendations: 0,
      storeSignature: store.getState().signature,
    };
  }

  try {
    const prior = store.getState();
    const preparednessState = getPreparednessCognitionStore(organizationId).getState();
    const interventionState = getInterventionTimingStore(organizationId).getState();
    const stressState = getStressSimulationStore(organizationId).getState();
    const earlyWarningState = getEarlyWarningStore(organizationId).getState();
    const positiveDriftState = getPositiveDriftStore(organizationId).getState();
    const constellationState = getRiskConstellationStore(organizationId).getState();

    const preparednessSnapshot =
      input.preparednessSnapshot ?? preparednessState.snapshots[0] ?? null;
    const interventionSnapshot =
      input.interventionSnapshot ?? interventionState.snapshots[0] ?? null;
    const stressSnapshot = input.stressSnapshot ?? stressState.snapshots[0] ?? null;
    const earlyWarningSnapshot =
      input.earlyWarningSnapshot ?? earlyWarningState.snapshots[0] ?? null;
    const positiveDriftSnapshot =
      input.positiveDriftSnapshot ?? positiveDriftState.snapshots[0] ?? null;
    const constellationSnapshot =
      input.constellationSnapshot ?? constellationState.snapshots[0] ?? null;
    const temporalSnapshot = input.temporalSnapshot ?? null;

    const evaluationSignature = stableSignature([
      "d9-4-8-advisory-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      preparednessSnapshot?.signature ?? preparednessState.signature,
      interventionSnapshot?.signature ?? interventionState.signature,
      stressSnapshot?.signature ?? stressState.signature,
      earlyWarningSnapshot?.signature ?? earlyWarningState.signature,
      positiveDriftSnapshot?.signature ?? positiveDriftState.signature,
      constellationSnapshot?.signature ?? constellationState.signature,
      temporalSnapshot?.signature ?? "no-temporal",
      input.convergenceSnapshot?.signature ?? "no-convergence",
      input.memorySnapshot?.signature ?? "no-memory",
    ]);

    if (
      !shouldEvaluateAdvisoryForesight(
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
        newExecutiveGuidanceRecommendations: 0,
        storeSignature: prior.signature,
      };
    }

    const advisoryDepth =
      (preparednessSnapshot?.signalCount ??
        preparednessState.strategicReadinessSignals.length) +
      (interventionSnapshot?.windowCount ??
        interventionState.strategicInterventionWindows.length) +
      (stressSnapshot?.scenarioCount ?? stressState.operationalStressScenarios.length) +
      (earlyWarningSnapshot?.warningCount ?? earlyWarningState.preEscalationSignals.length) +
      (positiveDriftSnapshot?.opportunityCount ??
        positiveDriftState.strategicOpportunitySignals.length);

    if (advisoryDepth < 3) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_advisory_depth",
        snapshot: prior.snapshots[0] ?? null,
        newExecutiveGuidanceRecommendations: 0,
        storeSignature: prior.signature,
      };
    }

    const narrativeLine = input.enterpriseNarrativeLine ?? "";
    const resilienceForecastLine = input.resilienceForecastLine ?? "";
    const pressureStressed = input.pressureTopologyStressed ?? false;

    const candidates: ExecutiveGuidanceRecommendation[] = [];

    const escalation = buildEscalationPreventionGuidance(
      earlyWarningSnapshot,
      stressSnapshot,
      interventionSnapshot,
      pressureStressed,
      now
    );
    if (escalation) candidates.push(escalation);

    const resilience = buildResilienceReinforcementGuidance(
      positiveDriftSnapshot,
      preparednessSnapshot,
      resilienceForecastLine,
      now
    );
    if (resilience) candidates.push(resilience);

    const governance = buildGovernanceAlignmentAdvisory(
      earlyWarningSnapshot,
      stressSnapshot,
      preparednessSnapshot,
      narrativeLine,
      now
    );
    if (governance) candidates.push(governance);

    const coordination = buildCoordinationStabilizationGuidance(
      stressSnapshot,
      earlyWarningSnapshot,
      constellationSnapshot,
      now
    );
    if (coordination) candidates.push(coordination);

    const pressure = buildPressureReductionStabilizationFocus(
      stressSnapshot,
      interventionSnapshot,
      pressureStressed,
      now
    );
    if (pressure) candidates.push(pressure);

    const adaptive = buildAdaptiveGrowthOpportunityGuidance(
      positiveDriftSnapshot,
      preparednessSnapshot,
      now
    );
    if (adaptive) candidates.push(adaptive);

    const focus = buildOperationalFocusGuidance(interventionSnapshot, temporalSnapshot, now);
    if (focus) candidates.push(focus);

    const recovery = buildRecoveryAccelerationAdvisory(positiveDriftSnapshot, interventionSnapshot, now);
    if (recovery) candidates.push(recovery);

    const retained = rankGuidanceRecommendations(
      candidates.filter(shouldRetainExecutiveGuidanceRecommendation)
    );
    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_recommendations",
        snapshot: prior.snapshots[0] ?? null,
        newExecutiveGuidanceRecommendations: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.executiveGuidanceRecommendations.map((r) => r.advisoryId));
    const newCount = retained.filter((r) => !priorIds.has(r.advisoryId)).length;

    store.upsertExecutiveGuidanceRecommendations(retained, now);

    const signals = buildStrategicAdvisorySignals(retained, now);
    store.upsertStrategicAdvisorySignals(signals, now);

    const focusSuggestions = buildFocusSuggestions(retained, now);
    store.upsertOrganizationalFocusSuggestions(focusSuggestions, now);

    const priorityFields = buildPriorityFields(retained, now);
    store.upsertAdvisoryPriorityFields(priorityFields, now);

    const snapshot = buildRecommendationSnapshot(
      organizationId,
      retained,
      signals,
      focusSuggestions,
      priorityFields,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (retained.some((r) => r.recommendationPriority === "elevated" || r.recommendationPriority === "critical")) {
      devLog(`major advisory generation — ${snapshot.awarenessSummary.guidanceUrgency}`);
    }
    if (pressure || governance) {
      devLog(`stabilization recommendation emergence — ${pressure?.category ?? governance?.category}`);
    }
    if (resilience) {
      devLog(`resilience reinforcement guidance — ${resilience.recommendationPriority}`);
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newExecutiveGuidanceRecommendations: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endAdvisoryForesightEvaluation();
  }
}
