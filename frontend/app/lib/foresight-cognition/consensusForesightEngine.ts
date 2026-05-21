import { stableSignature } from "../intelligence/shared/dedupe";
import { getAdvisoryForesightStore } from "./advisoryForesightStore";
import { getEarlyWarningStore } from "./earlyWarningStore";
import { getInterventionTimingStore } from "./interventionTimingStore";
import { getPreparednessCognitionStore } from "./preparednessCognitionStore";
import { getPositiveDriftStore } from "./positiveDriftStore";
import { getRiskConstellationStore } from "./riskConstellationStore";
import { getStressSimulationStore } from "./stressSimulationStore";
import type { EnterpriseRecommendationSnapshot } from "./advisoryForesightTypes";
import type { RecommendationCategory } from "./advisoryForesightTypes";
import type { EnterpriseEarlyWarningSnapshot, WarningCategory } from "./earlyWarningTypes";
import type { InterventionWindowSnapshot, TimingCategory } from "./interventionTimingTypes";
import type { EnterprisePreparednessSnapshot, PreparednessCategory } from "./preparednessCognitionTypes";
import type { PositiveTrajectorySnapshot, OpportunityCategory } from "./positiveDriftTypes";
import type { RiskConstellationSnapshot, ConstellationCategory } from "./riskConstellationTypes";
import type { StressSimulationSnapshot, StressCategory } from "./stressSimulationTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import {
  beginConsensusForesightEvaluation,
  confidenceToConsensusLevel,
  endConsensusForesightEvaluation,
  shouldEvaluateConsensusForesight,
  shouldRetainMultiPerspectiveRecommendation,
  strengthRank,
} from "./consensusForesightGuards";
import { getConsensusForesightStore } from "./consensusForesightStore";
import type {
  AdvisoryPerspectiveSignal,
  ConsensusAlignmentScore,
  ConsensusAwarenessSummary,
  ConsensusState,
  ConsensusStrength,
  ExecutiveConsensusForesightInput,
  ExecutiveConsensusForesightResult,
  MultiPerspectiveRecommendation,
  PerspectiveCategory,
  StrategicConsensusSnapshot,
  StrategicDisagreementSignal,
  ThematicFocus,
} from "./consensusForesightTypes";

const DEV_LOG_PREFIX = "[Nexora][ConsensusForesight]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

type PerspectiveStance = "risk_escalation" | "opportunity_growth" | "stabilization" | "neutral";

type PerspectiveContribution = {
  perspective: PerspectiveCategory;
  thematicFocus: ThematicFocus;
  stance: PerspectiveStance;
  confidence: number;
};

function buildConsensusId(thematicFocus: ThematicFocus, state: ConsensusState): string {
  return stableSignature(["strategic-consensus", thematicFocus, state]).slice(0, 56);
}

function mapAdvisoryCategory(category: RecommendationCategory): ThematicFocus {
  switch (category) {
    case "governance_alignment":
    case "strategic_realignment":
      return "governance_stabilization";
    case "escalation_prevention":
      return "escalation_prevention";
    case "resilience_reinforcement":
      return "resilience_reinforcement";
    case "coordination_stabilization":
      return "coordination_alignment";
    case "pressure_reduction":
      return "pressure_reduction";
    case "recovery_acceleration":
      return "recovery_acceleration";
    case "operational_focus":
      return "operational_focus";
    default:
      return "unknown";
  }
}

function mapWarningCategory(category: WarningCategory): ThematicFocus {
  switch (category) {
    case "governance_delay":
      return "governance_stabilization";
    case "escalation_precursor":
      return "escalation_prevention";
    case "operational_pressure":
      return "pressure_reduction";
    case "resilience_erosion":
      return "resilience_reinforcement";
    case "coordination_instability":
      return "coordination_alignment";
    default:
      return "unknown";
  }
}

function mapStressCategory(category: StressCategory): ThematicFocus {
  switch (category) {
    case "governance_overload":
      return "governance_stabilization";
    case "escalation_pressure":
      return "escalation_prevention";
    case "coordination_strain":
      return "coordination_alignment";
    case "resilience_fatigue":
      return "resilience_reinforcement";
    default:
      return "pressure_reduction";
  }
}

function mapTimingCategory(category: TimingCategory): ThematicFocus {
  if (category === "governance_stabilization") return "governance_stabilization";
  if (category === "strategic_realignment") return "governance_stabilization";
  return category as ThematicFocus;
}

function mapOpportunityCategory(category: OpportunityCategory): ThematicFocus {
  switch (category) {
    case "resilience_growth":
      return "resilience_reinforcement";
    case "recovery_acceleration":
      return "recovery_acceleration";
    case "governance_maturation":
      return "governance_stabilization";
    case "coordination_improvement":
      return "coordination_alignment";
    case "operational_stabilization":
      return "operational_focus";
    default:
      return "opportunity_growth";
  }
}

function mapConstellationCategory(category: ConstellationCategory): ThematicFocus {
  switch (category) {
    case "governance_drift":
      return "governance_stabilization";
    case "escalation_network":
      return "escalation_prevention";
    case "resilience_erosion":
      return "resilience_reinforcement";
    case "coordination_breakdown":
      return "coordination_alignment";
    case "operational_pressure_field":
      return "pressure_reduction";
    default:
      return "unknown";
  }
}

function mapPreparednessCategory(category: PreparednessCategory): ThematicFocus {
  switch (category) {
    case "governance_readiness":
      return "governance_stabilization";
    case "escalation_response":
      return "escalation_prevention";
    case "resilience_capacity":
      return "resilience_reinforcement";
    case "coordination_preparedness":
      return "coordination_alignment";
    default:
      return "operational_focus";
  }
}

function collectPerspectiveContributions(params: {
  advisorySnapshot: EnterpriseRecommendationSnapshot | null;
  earlyWarningSnapshot: EnterpriseEarlyWarningSnapshot | null;
  stressSnapshot: StressSimulationSnapshot | null;
  interventionSnapshot: InterventionWindowSnapshot | null;
  positiveDriftSnapshot: PositiveTrajectorySnapshot | null;
  preparednessSnapshot: EnterprisePreparednessSnapshot | null;
  constellationSnapshot: RiskConstellationSnapshot | null;
  temporalSnapshot: EnterpriseTimeIntelligenceSnapshot | null;
  memorySnapshot: InstitutionalLearningSnapshot | null;
}): PerspectiveContribution[] {
  const contributions: PerspectiveContribution[] = [];

  for (const r of params.advisorySnapshot?.recentExecutiveGuidanceRecommendations ?? []) {
    contributions.push({
      perspective: "advisory_recommendation",
      thematicFocus: mapAdvisoryCategory(r.category),
      stance:
        r.category === "resilience_reinforcement" || r.category === "recovery_acceleration"
          ? "opportunity_growth"
          : "stabilization",
      confidence: r.confidence,
    });
  }

  for (const w of params.earlyWarningSnapshot?.recentPreEscalationSignals ?? []) {
    contributions.push({
      perspective: "early_warning",
      thematicFocus: mapWarningCategory(w.category),
      stance: "risk_escalation",
      confidence: w.confidence,
    });
  }

  for (const s of params.stressSnapshot?.recentOperationalStressScenarios ?? []) {
    contributions.push({
      perspective: "stress_simulation",
      thematicFocus: mapStressCategory(s.category),
      stance: s.stressSeverity === "severe" || s.stressSeverity === "critical" ? "risk_escalation" : "stabilization",
      confidence: s.confidence,
    });
  }

  for (const w of params.interventionSnapshot?.recentStrategicInterventionWindows ?? []) {
    contributions.push({
      perspective: "intervention_timing",
      thematicFocus: mapTimingCategory(w.category),
      stance: w.windowState === "narrowing" || w.windowState === "closing" ? "risk_escalation" : "stabilization",
      confidence: w.confidence,
    });
  }

  for (const o of params.positiveDriftSnapshot?.recentStrategicOpportunitySignals ?? []) {
    contributions.push({
      perspective: "positive_drift",
      thematicFocus: mapOpportunityCategory(o.category),
      stance: "opportunity_growth",
      confidence: o.confidence,
    });
  }

  for (const p of params.preparednessSnapshot?.recentStrategicReadinessSignals ?? []) {
    contributions.push({
      perspective: "preparedness",
      thematicFocus: mapPreparednessCategory(p.category),
      stance:
        p.preparednessLevel === "weak" || p.preparednessLevel === "limited"
          ? "risk_escalation"
          : "stabilization",
      confidence: p.confidence,
    });
  }

  if (params.constellationSnapshot) {
    contributions.push({
      perspective: "risk_constellation",
      thematicFocus: mapConstellationCategory(params.constellationSnapshot.awarenessSummary.dominantCategory),
      stance: "risk_escalation",
      confidence: 0.72,
    });
  }

  const resilienceDirection = params.temporalSnapshot?.summary?.resilienceDirection ?? "";
  if (params.temporalSnapshot && resilienceDirection) {
    contributions.push({
      perspective: "temporal_cognition",
      thematicFocus: resilienceDirection.includes("risk")
        ? "resilience_reinforcement"
        : "governance_stabilization",
      stance: resilienceDirection.includes("risk") ? "risk_escalation" : "neutral",
      confidence: 0.68,
    });
  }

  if (params.memorySnapshot?.continuityConcernActive) {
    contributions.push({
      perspective: "institutional_memory",
      thematicFocus: params.memorySnapshot.dominantCategories.includes("governance")
        ? "governance_stabilization"
        : "escalation_prevention",
      stance: "risk_escalation",
      confidence: 0.7,
    });
  }

  return contributions.filter((c) => c.thematicFocus !== "unknown");
}

function groupByTheme(
  contributions: PerspectiveContribution[]
): Map<ThematicFocus, PerspectiveContribution[]> {
  const grouped = new Map<ThematicFocus, PerspectiveContribution[]>();
  for (const c of contributions) {
    const list = grouped.get(c.thematicFocus) ?? [];
    list.push(c);
    grouped.set(c.thematicFocus, list);
  }
  return grouped;
}

function deriveConsensusState(
  supporters: PerspectiveContribution[],
  dissenters: PerspectiveCategory[]
): ConsensusState {
  if (dissenters.length >= 2) return "conflicted";
  if (dissenters.length === 1 && supporters.length >= 2) return "partially_aligned";
  if (supporters.length >= 3) return "aligned";
  if (supporters.length === 2) return "partially_aligned";
  if (supporters.length === 1) return "inconclusive";
  return "fragmented";
}

function deriveConsensusStrength(
  supporterCount: number,
  avgConfidence: number,
  state: ConsensusState
): ConsensusStrength {
  if (state === "conflicted" || state === "fragmented") return "weak";
  if (supporterCount >= 4 && avgConfidence >= 0.78) return "executive_grade";
  if (supporterCount >= 3 && avgConfidence >= 0.65) return "strong";
  if (supporterCount >= 2) return "moderate";
  return "weak";
}

function buildMultiPerspectiveRecommendation(
  thematicFocus: ThematicFocus,
  contributions: PerspectiveContribution[],
  disagreements: PerspectiveCategory[],
  summary: string,
  now: number
): MultiPerspectiveRecommendation | null {
  const byTheme = contributions.filter((c) => c.thematicFocus === thematicFocus);
  if (byTheme.length < 2) return null;

  const supportingPerspectives = Object.freeze(
    Array.from(new Set(byTheme.map((c) => c.perspective))).slice(0, 8)
  ) as readonly PerspectiveCategory[];

  const avgConfidence =
    byTheme.reduce((sum, c) => sum + c.confidence, 0) / Math.max(1, byTheme.length);
  const consensusState = deriveConsensusState(byTheme, disagreements);
  const consensusStrength = deriveConsensusStrength(
    supportingPerspectives.length,
    avgConfidence,
    consensusState
  );
  const confidence = Number(Math.min(0.94, Math.max(0.5, avgConfidence + supportingPerspectives.length * 0.04)).toFixed(2));

  return {
    consensusId: buildConsensusId(thematicFocus, consensusState),
    thematicFocus,
    consensusState,
    consensusStrength,
    summary,
    supportingPerspectives,
    disagreements: Object.freeze(disagreements),
    confidence,
    confidenceLevel: confidenceToConsensusLevel(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildGovernanceStabilizationConsensus(
  contributions: PerspectiveContribution[],
  now: number
): MultiPerspectiveRecommendation | null {
  const theme: ThematicFocus = "governance_stabilization";
  const related = contributions.filter((c) => c.thematicFocus === theme);
  const riskSupporters = related.filter((c) => c.stance !== "opportunity_growth");
  if (riskSupporters.length < 2) return null;

  const perspectives = Array.from(new Set(riskSupporters.map((c) => c.perspective)));
  if (
    !perspectives.includes("early_warning") &&
    !perspectives.includes("stress_simulation") &&
    !perspectives.includes("advisory_recommendation") &&
    perspectives.length < 2
  ) {
    return null;
  }

  return buildMultiPerspectiveRecommendation(
    theme,
    contributions,
    [],
    "Multiple foresight layers converge on governance stabilization as the highest-value strategic focus due to pressure growth, escalation precursors, and narrowing intervention timing.",
    now
  );
}

function buildPressureRiskConsensus(
  contributions: PerspectiveContribution[],
  now: number
): MultiPerspectiveRecommendation | null {
  const themes: ThematicFocus[] = ["escalation_prevention", "pressure_reduction"];
  for (const theme of themes) {
    const hasRisk = contributions.some(
      (c) =>
        c.thematicFocus === theme &&
        (c.perspective === "risk_constellation" || c.perspective === "stress_simulation")
    );
    const hasWarning = contributions.some(
      (c) => c.thematicFocus === theme && c.perspective === "early_warning"
    );
    if (hasRisk && hasWarning) {
      return buildMultiPerspectiveRecommendation(
        theme,
        contributions,
        [],
        `Risk constellation and stress simulation align with early warning on ${theme.replace(/_/g, " ")}.`,
        now
      );
    }
  }
  return null;
}

function buildResilienceTensionDisagreement(
  contributions: PerspectiveContribution[],
  now: number
): { recommendation: MultiPerspectiveRecommendation | null; disagreement: StrategicDisagreementSignal | null } {
  const positive = contributions.filter(
    (c) => c.perspective === "positive_drift" && c.stance === "opportunity_growth"
  );
  const warning = contributions.filter(
    (c) =>
      c.perspective === "early_warning" &&
      (c.thematicFocus === "resilience_reinforcement" || c.thematicFocus === "escalation_prevention")
  );

  if (positive.length === 0 || warning.length === 0) {
    return { recommendation: null, disagreement: null };
  }

  const disagreement: StrategicDisagreementSignal = {
    disagreementId: stableSignature(["disagreement", "positive_drift", "early_warning"]).slice(0, 48),
    thematicFocus: "resilience_reinforcement",
    perspectiveA: "positive_drift",
    perspectiveB: "early_warning",
    disagreementSummary:
      "Positive drift signals improving resilience while early warning detects escalation precursors — strategic tension requires executive review.",
    tensionLevel: "elevated",
    generatedAt: now,
  };

  const recommendation = buildMultiPerspectiveRecommendation(
    "resilience_reinforcement",
    contributions,
    ["positive_drift", "early_warning"],
    "Strategic perspectives conflict: opportunity emergence contrasts with pre-escalation warning signals on resilience trajectory.",
    now
  );

  if (recommendation) {
    return {
      recommendation: {
        ...recommendation,
        consensusState: "conflicted",
        consensusStrength: "moderate",
      },
      disagreement,
    };
  }

  return { recommendation: null, disagreement };
}

function buildPreparednessStressConcern(
  preparednessSnapshot: EnterprisePreparednessSnapshot | null,
  stressSnapshot: StressSimulationSnapshot | null,
  contributions: PerspectiveContribution[],
  now: number
): MultiPerspectiveRecommendation | null {
  const weakPreparedness =
    preparednessSnapshot?.awarenessSummary.enterprisePreparednessPosture === "weak" ||
    preparednessSnapshot?.awarenessSummary.enterprisePreparednessPosture === "limited";
  const severeStress = (stressSnapshot?.recentOperationalStressScenarios ?? []).some(
    (s) => s.stressSeverity === "severe" || s.stressSeverity === "critical"
  );

  if (!weakPreparedness || !severeStress) return null;

  return buildMultiPerspectiveRecommendation(
    "operational_focus",
    contributions,
    [],
    "Preparedness cognition remains weak while stress simulation identifies severe pressure — elevated executive concern on response readiness.",
    now
  );
}

function buildHistoricalConsensusSupport(
  memorySnapshot: InstitutionalLearningSnapshot | null,
  temporalSnapshot: EnterpriseTimeIntelligenceSnapshot | null,
  contributions: PerspectiveContribution[],
  now: number
): MultiPerspectiveRecommendation | null {
  if (!memorySnapshot?.continuityConcernActive || !temporalSnapshot) return null;
  const temporalRisk = temporalSnapshot.summary?.resilienceDirection?.includes("risk") ?? false;
  if (!temporalRisk) return null;

  return buildMultiPerspectiveRecommendation(
    "governance_stabilization",
    contributions,
    [],
    "Temporal cognition and institutional memory confirm a recurring governance-pressure pattern with continuity concern active.",
    now
  );
}

function buildAlignmentScores(
  grouped: Map<ThematicFocus, PerspectiveContribution[]>,
  now: number
): ConsensusAlignmentScore[] {
  const scores: ConsensusAlignmentScore[] = [];
  for (const [thematicFocus, list] of grouped) {
    if (list.length < 2) continue;
    const stances = new Set(list.map((c) => c.stance));
    const supportingCount = list.filter((c) => c.stance !== "opportunity_growth").length;
    const dissentingCount = list.length - supportingCount;
    const alignmentScore = Number(
      Math.min(0.95, supportingCount / Math.max(1, list.length)).toFixed(2)
    );
    scores.push({
      scoreId: stableSignature(["alignment", thematicFocus]).slice(0, 48),
      thematicFocus,
      alignmentScore,
      supportingCount,
      dissentingCount,
      consensusState: stances.size > 1 ? "partially_aligned" : "aligned",
      generatedAt: now,
    });
  }
  return scores.sort((a, b) => b.alignmentScore - a.alignmentScore).slice(0, 6);
}

function buildPerspectiveSignals(
  contributions: PerspectiveContribution[],
  now: number
): AdvisoryPerspectiveSignal[] {
  return contributions.slice(0, 10).map((c, index) => ({
    signalId: stableSignature(["perspective", c.perspective, c.thematicFocus, index]).slice(0, 48),
    perspective: c.perspective,
    thematicFocus: c.thematicFocus,
    perspectiveSummary: `${c.perspective} contributes ${c.stance} signal toward ${c.thematicFocus}.`,
    stance: c.stance,
    confidence: c.confidence,
    generatedAt: now,
  }));
}

function buildAwarenessSummary(
  recommendations: MultiPerspectiveRecommendation[]
): ConsensusAwarenessSummary {
  const ranked = [...recommendations].sort(
    (a, b) => strengthRank(b.consensusStrength) - strengthRank(a.consensusStrength) || b.confidence - a.confidence
  );
  const top = ranked[0];
  if (!top) {
    return {
      dominantThematicFocus: "unknown",
      dominantConsensusState: "inconclusive",
      dominantConsensusStrength: "weak",
      consensusHeadline: "Insufficient multi-perspective depth for strategic consensus awareness.",
      advisoryIntegrity: "low",
    };
  }

  const advisoryIntegrity: ConsensusAwarenessSummary["advisoryIntegrity"] =
    top.consensusStrength === "executive_grade"
      ? "executive_grade"
      : top.consensusStrength === "strong"
        ? "strong"
        : top.consensusStrength === "moderate"
          ? "moderate"
          : "low";

  return {
    dominantThematicFocus: top.thematicFocus,
    dominantConsensusState: top.consensusState,
    dominantConsensusStrength: top.consensusStrength,
    consensusHeadline: top.summary,
    advisoryIntegrity,
  };
}

function buildConsensusSnapshot(
  organizationId: string,
  recommendations: MultiPerspectiveRecommendation[],
  perspectiveSignals: AdvisoryPerspectiveSignal[],
  alignmentScores: ConsensusAlignmentScore[],
  disagreementSignals: StrategicDisagreementSignal[],
  now: number
): StrategicConsensusSnapshot {
  const awarenessSummary = buildAwarenessSummary(recommendations);
  const signature = stableSignature([
    "d9-4-9-consensus-snapshot",
    organizationId,
    recommendations.map((r) => r.consensusId),
    awarenessSummary.dominantConsensusState,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    consensusCount: recommendations.length,
    awarenessSummary,
    recentMultiPerspectiveRecommendations: Object.freeze(recommendations.slice(0, 6)),
    perspectiveSignals: Object.freeze(perspectiveSignals),
    alignmentScores: Object.freeze(alignmentScores),
    disagreementSignals: Object.freeze(disagreementSignals),
  };
}

export function evaluateStrategicConsensusForesight(
  input: ExecutiveConsensusForesightInput
): ExecutiveConsensusForesightResult {
  if (!beginConsensusForesightEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newMultiPerspectiveRecommendations: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getConsensusForesightStore(organizationId);
    const prior = store.getState();

    const advisoryState = getAdvisoryForesightStore(organizationId).getState();
    const earlyWarningState = getEarlyWarningStore(organizationId).getState();
    const stressState = getStressSimulationStore(organizationId).getState();
    const interventionState = getInterventionTimingStore(organizationId).getState();
    const positiveDriftState = getPositiveDriftStore(organizationId).getState();
    const preparednessState = getPreparednessCognitionStore(organizationId).getState();
    const constellationState = getRiskConstellationStore(organizationId).getState();

    const advisorySnapshot =
      input.advisorySnapshot ?? advisoryState.snapshots[0] ?? null;
    const earlyWarningSnapshot =
      input.earlyWarningSnapshot ?? earlyWarningState.snapshots[0] ?? null;
    const stressSnapshot = input.stressSnapshot ?? stressState.snapshots[0] ?? null;
    const interventionSnapshot =
      input.interventionSnapshot ?? interventionState.snapshots[0] ?? null;
    const positiveDriftSnapshot =
      input.positiveDriftSnapshot ?? positiveDriftState.snapshots[0] ?? null;
    const preparednessSnapshot =
      input.preparednessSnapshot ?? preparednessState.snapshots[0] ?? null;
    const constellationSnapshot =
      input.constellationSnapshot ?? constellationState.snapshots[0] ?? null;
    const temporalSnapshot = input.temporalSnapshot ?? null;
    const memorySnapshot = input.memorySnapshot ?? null;

    const evaluationSignature = stableSignature([
      "d9-4-9-consensus-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      advisorySnapshot?.signature ?? advisoryState.signature,
      earlyWarningSnapshot?.signature ?? earlyWarningState.signature,
      stressSnapshot?.signature ?? stressState.signature,
      interventionSnapshot?.signature ?? interventionState.signature,
      positiveDriftSnapshot?.signature ?? positiveDriftState.signature,
      preparednessSnapshot?.signature ?? preparednessState.signature,
      constellationSnapshot?.signature ?? constellationState.signature,
      temporalSnapshot?.signature ?? "no-temporal",
      memorySnapshot?.signature ?? "no-memory",
    ]);

    if (
      !shouldEvaluateConsensusForesight(
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
        newMultiPerspectiveRecommendations: 0,
        storeSignature: prior.signature,
      };
    }

    const consensusDepth =
      (advisorySnapshot?.recentExecutiveGuidanceRecommendations.length ??
        advisoryState.executiveGuidanceRecommendations.length) +
      (earlyWarningSnapshot?.warningCount ?? earlyWarningState.preEscalationSignals.length) +
      (stressSnapshot?.scenarioCount ?? stressState.operationalStressScenarios.length) +
      (interventionSnapshot?.windowCount ?? interventionState.strategicInterventionWindows.length) +
      (positiveDriftSnapshot?.opportunityCount ?? positiveDriftState.strategicOpportunitySignals.length);

    if (consensusDepth < 3) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_consensus_depth",
        snapshot: prior.snapshots[0] ?? null,
        newMultiPerspectiveRecommendations: 0,
        storeSignature: prior.signature,
      };
    }

    const contributions = collectPerspectiveContributions({
      advisorySnapshot,
      earlyWarningSnapshot,
      stressSnapshot,
      interventionSnapshot,
      positiveDriftSnapshot,
      preparednessSnapshot,
      constellationSnapshot,
      temporalSnapshot,
      memorySnapshot,
    });

    if (contributions.length < 3) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_perspective_signals",
        snapshot: prior.snapshots[0] ?? null,
        newMultiPerspectiveRecommendations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: MultiPerspectiveRecommendation[] = [];
    const disagreements: StrategicDisagreementSignal[] = [];

    const governance = buildGovernanceStabilizationConsensus(contributions, now);
    if (governance) candidates.push(governance);

    const pressureRisk = buildPressureRiskConsensus(contributions, now);
    if (pressureRisk) candidates.push(pressureRisk);

    const tension = buildResilienceTensionDisagreement(contributions, now);
    if (tension.recommendation) candidates.push(tension.recommendation);
    if (tension.disagreement) disagreements.push(tension.disagreement);

    const preparednessConcern = buildPreparednessStressConcern(
      preparednessSnapshot,
      stressSnapshot,
      contributions,
      now
    );
    if (preparednessConcern) candidates.push(preparednessConcern);

    const historical = buildHistoricalConsensusSupport(
      memorySnapshot,
      temporalSnapshot,
      contributions,
      now
    );
    if (historical) candidates.push(historical);

    const grouped = groupByTheme(contributions);
    for (const [theme, list] of grouped) {
      if (list.length >= 3 && !candidates.some((c) => c.thematicFocus === theme)) {
        const rec = buildMultiPerspectiveRecommendation(
          theme,
          contributions,
          [],
          `Multi-perspective foresight alignment detected across ${list.length} intelligence layers on ${theme.replace(/_/g, " ")}.`,
          now
        );
        if (rec) candidates.push(rec);
      }
    }

    const retained = candidates
      .filter(shouldRetainMultiPerspectiveRecommendation)
      .sort(
        (a, b) =>
          strengthRank(b.consensusStrength) - strengthRank(a.consensusStrength) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_consensus",
        snapshot: prior.snapshots[0] ?? null,
        newMultiPerspectiveRecommendations: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.multiPerspectiveRecommendations.map((r) => r.consensusId));
    const newCount = retained.filter((r) => !priorIds.has(r.consensusId)).length;

    store.upsertMultiPerspectiveRecommendations(retained, now);

    const perspectiveSignals = buildPerspectiveSignals(contributions, now);
    store.upsertPerspectiveSignals(perspectiveSignals, now);

    const alignmentScores = buildAlignmentScores(grouped, now);
    store.upsertAlignmentScores(alignmentScores, now);

    if (disagreements.length > 0) {
      store.upsertDisagreementSignals(disagreements, now);
    }

    const snapshot = buildConsensusSnapshot(
      organizationId,
      retained,
      perspectiveSignals,
      alignmentScores,
      disagreements,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (retained.some((r) => r.consensusStrength === "executive_grade")) {
      devLog(`executive-grade consensus formation — ${snapshot.awarenessSummary.dominantThematicFocus}`);
    }
    if (disagreements.length > 0) {
      devLog(`major strategic disagreement — ${disagreements[0]!.thematicFocus}`);
    }
    if (snapshot.awarenessSummary.dominantConsensusState === "fragmented") {
      devLog("fragmented advisory state detected across foresight perspectives");
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newMultiPerspectiveRecommendations: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endConsensusForesightEvaluation();
  }
}
