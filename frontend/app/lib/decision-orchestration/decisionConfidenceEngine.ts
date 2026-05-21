import { stableSignature } from "../intelligence/shared/dedupe";
import { getConsensusForesightStore } from "../foresight-cognition/consensusForesightStore";
import type { StrategicConsensusSnapshot } from "../foresight-cognition/consensusForesightTypes";
import { getPreparednessCognitionStore } from "../foresight-cognition/preparednessCognitionStore";
import type { EnterprisePreparednessSnapshot } from "../foresight-cognition/preparednessCognitionTypes";
import { getInterventionTimingStore } from "../foresight-cognition/interventionTimingStore";
import type { InterventionWindowSnapshot } from "../foresight-cognition/interventionTimingTypes";
import { getPositiveDriftStore } from "../foresight-cognition/positiveDriftStore";
import { getStressSimulationStore } from "../foresight-cognition/stressSimulationStore";
import { getUnifiedForesightRuntimeStore } from "../foresight-cognition/unifiedForesightRuntimeStore";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import { getActionDependencyStore } from "./actionDependencyStore";
import { getAdaptiveSequencingStore } from "./adaptiveSequencingStore";
import type { AdaptiveSequencingSnapshot } from "./adaptiveSequencingTypes";
import { getDecisionOrchestrationStore } from "./decisionOrchestrationStore";
import type { DependencyAwarenessSnapshot } from "./actionDependencyTypes";
import type { DecisionCoordinationSnapshot } from "./decisionOrchestrationTypes";
import { getPriorityArbitrationStore } from "./priorityArbitrationStore";
import type { MultiObjectiveDecisionSnapshot } from "./priorityArbitrationTypes";
import { getScenarioCoordinationStore } from "./scenarioCoordinationStore";
import type { ScenarioCoordinationSnapshot } from "./scenarioCoordinationTypes";
import {
  beginDecisionConfidenceEvaluation,
  certaintyStateRank,
  clampConfidenceScore,
  confidenceLevelRank,
  endDecisionConfidenceEvaluation,
  scoreToConfidenceLevel,
  shouldEvaluateDecisionConfidence,
  shouldRetainExecutiveDecisionConfidence,
} from "./decisionConfidenceGuards";
import { getDecisionConfidenceStore } from "./decisionConfidenceStore";
import type {
  CertaintyState,
  ConfidenceArbitrationSnapshot,
  ConfidenceCategory,
  ConfidenceCoordinationSummary,
  ConfidenceLevel,
  EnterpriseUncertaintyField,
  ExecutiveDecisionConfidence,
  ExecutiveDecisionConfidenceInput,
  ExecutiveDecisionConfidenceResult,
  OperationalAmbiguityIndicator,
  StrategicCertaintySignal,
} from "./decisionConfidenceTypes";

const DEV_LOG_PREFIX = "[Nexora][DecisionConfidence]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildConfidenceId(label: string): string {
  return stableSignature(["decision-confidence", label]).slice(0, 56);
}

function createExecutiveConfidence(
  label: string,
  certaintyState: CertaintyState,
  confidenceLevel: ConfidenceLevel,
  category: ConfidenceCategory,
  summary: string,
  confidenceSignals: string[],
  uncertaintySignals: string[],
  confidenceScore: number,
  now: number
): ExecutiveDecisionConfidence {
  const score = clampConfidenceScore(confidenceScore);
  return {
    confidenceId: buildConfidenceId(label),
    certaintyState,
    confidenceLevel: confidenceLevel === "executive_grade" ? "executive_grade" : scoreToConfidenceLevel(score),
    confidenceCategory: category,
    summary,
    confidenceSignals: Object.freeze(confidenceSignals),
    uncertaintySignals: Object.freeze(uncertaintySignals),
    confidenceScore: score,
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildConsensusPreparednessConfidence(
  consensusSnapshot: StrategicConsensusSnapshot | null,
  preparednessSnapshot: EnterprisePreparednessSnapshot | null,
  now: number
): ExecutiveDecisionConfidence | null {
  const aligned =
    consensusSnapshot?.awarenessSummary.dominantConsensusState === "aligned" ||
    consensusSnapshot?.awarenessSummary.dominantConsensusState === "partially_aligned";
  const strongConsensus =
    consensusSnapshot?.awarenessSummary.dominantConsensusStrength === "strong" ||
    consensusSnapshot?.awarenessSummary.dominantConsensusStrength === "executive_grade";
  const preparednessStable =
    preparednessSnapshot?.awarenessSummary.enterprisePreparednessPosture === "strong" ||
    preparednessSnapshot?.awarenessSummary.enterprisePreparednessPosture === "resilient";

  if (!aligned || !strongConsensus || !preparednessStable) return null;

  return createExecutiveConfidence(
    "enterprise_stabilization_confidence",
    "reliable",
    "strong",
    "orchestration",
    "Strategic confidence remains strong for governance stabilization and pressure reduction due to consistent foresight alignment, stable preparedness, and reinforced orchestration pathways.",
    ["consensus_alignment", "stable_preparedness", "timing_consistency", "reinforced_orchestration"],
    ["partial_coordination_visibility"],
    0.89,
    now
  );
}

function buildFragmentedForesightConfidence(
  consensusSnapshot: StrategicConsensusSnapshot | null,
  organizationId: string,
  now: number
): ExecutiveDecisionConfidence | null {
  const fragmented =
    consensusSnapshot?.awarenessSummary.dominantConsensusState === "fragmented" ||
    consensusSnapshot?.awarenessSummary.dominantConsensusState === "conflicted";
  const stressState = getStressSimulationStore(organizationId).getState();
  const positiveState = getPositiveDriftStore(organizationId).getState();
  const layerConflict =
    (stressState.snapshots[0]?.scenarioCount ?? 0) >= 1 &&
    (positiveState.snapshots[0]?.opportunityCount ?? 0) >= 1;

  if (!fragmented && !layerConflict) return null;

  return createExecutiveConfidence(
    "fragmented_foresight_certainty",
    "fragmented",
    "limited",
    "advisory",
    "Conflicting foresight layers produce fragmented recommendation certainty across stress simulation and positive drift perspectives.",
    ["partial_perspective_alignment"],
    ["stress_positive_divergence", "recommendation_fragmentation"],
    0.58,
    now
  );
}

function buildWeakVisibilityUncertainty(
  narrativeLine: string,
  memoryLine: string,
  dependencySnapshot: DependencyAwarenessSnapshot | null,
  now: number
): ExecutiveDecisionConfidence | null {
  const weakVisibility =
    narrativeLine.includes("partial") ||
    narrativeLine.includes("incomplete") ||
    narrativeLine.includes("strain") ||
    memoryLine.includes("limited");
  const graphGaps = (dependencySnapshot?.graphCount ?? 0) >= 1 &&
    (dependencySnapshot?.bottleneckIndicators.length ?? 0) >= 1;

  if (!weakVisibility && !graphGaps) return null;

  return createExecutiveConfidence(
    "elevated_uncertainty_concentration",
    "uncertain",
    "weak",
    "coordination",
    "Weak operational visibility elevates uncertainty concentration across coordination and dependency pathways.",
    ["dependency_topology"],
    ["partial_coordination_visibility", "incomplete_operational_visibility"],
    0.54,
    now
  );
}

function buildReliableOrchestrationConfidence(
  interventionSnapshot: InterventionWindowSnapshot | null,
  resilienceLine: string,
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  now: number
): ExecutiveDecisionConfidence | null {
  const stableTiming = interventionSnapshot?.recentStrategicInterventionWindows.some(
    (w) => w.windowState === "active" || w.windowState === "emerging"
  );
  const resilienceAligned = resilienceLine.includes("strengthen") || resilienceLine.includes("align");
  const orchestrationDepth = (coordinationSnapshot?.orchestrationCount ?? 0) >= 2;

  if (!stableTiming || !resilienceAligned || !orchestrationDepth) return null;

  return createExecutiveConfidence(
    "reliable_orchestration_confidence",
    "reliable",
    "strong",
    "orchestration",
    "Stable intervention timing and resilience alignment support reliable orchestration confidence across enterprise response pathways.",
    ["timing_consistency", "resilience_alignment", "orchestration_depth"],
    [],
    0.86,
    now
  );
}

function buildUnstableEscalationPreparednessConfidence(
  anticipatorySnapshot: EnterpriseAnticipatorySnapshot | null,
  preparednessSnapshot: EnterprisePreparednessSnapshot | null,
  fragilityElevated: boolean,
  now: number
): ExecutiveDecisionConfidence | null {
  const rapidEscalation =
    anticipatorySnapshot?.summary.earlyWarningState === "intensifying" ||
    fragilityElevated;
  const weakPreparedness =
    preparednessSnapshot?.awarenessSummary.enterprisePreparednessPosture === "weak" ||
    preparednessSnapshot?.awarenessSummary.enterprisePreparednessPosture === "limited";

  if (!rapidEscalation || !weakPreparedness) return null;

  return createExecutiveConfidence(
    "unstable_escalation_preparedness",
    "uncertain",
    "limited",
    "escalation",
    "Rapid escalation pressure combined with weak preparedness produces unstable strategic certainty for containment responses.",
    ["early_warning_intensification"],
    ["weak_preparedness", "escalation_ambiguity", "timing_sensitivity_increase"],
    0.61,
    now
  );
}

function buildExecutiveGradeAlignmentConfidence(
  consensusSnapshot: StrategicConsensusSnapshot | null,
  arbitrationSnapshot: MultiObjectiveDecisionSnapshot | null,
  scenarioSnapshot: ScenarioCoordinationSnapshot | null,
  sequencingSnapshot: AdaptiveSequencingSnapshot | null,
  anticipatorySnapshot: EnterpriseAnticipatorySnapshot | null,
  now: number
): ExecutiveDecisionConfidence | null {
  const executiveConsensus =
    consensusSnapshot?.awarenessSummary.advisoryIntegrity === "executive_grade";
  const executiveForesight = anticipatorySnapshot?.foresightHealth === "executive_grade";
  const layerDepth =
    (arbitrationSnapshot?.arbitrationCount ?? 0) >= 2 &&
    (scenarioSnapshot?.topologyCount ?? 0) >= 1 &&
    (sequencingSnapshot?.sequenceCount ?? 0) >= 1;

  if (!executiveConsensus && !executiveForesight) return null;
  if (!layerDepth) return null;

  return createExecutiveConfidence(
    "executive_grade_confidence_alignment",
    "highly_confident",
    "executive_grade",
    "advisory",
    "Multiple orchestration, arbitration, and foresight layers agree consistently, forming executive-grade strategic confidence alignment.",
    [
      "consensus_alignment",
      "foresight_convergence",
      "reinforced_orchestration",
      "arbitration_coherence",
    ],
    [],
    0.92,
    now
  );
}

function buildGovernanceConfidenceArbitration(
  arbitrationSnapshot: MultiObjectiveDecisionSnapshot | null,
  now: number
): ExecutiveDecisionConfidence | null {
  const governanceTension = arbitrationSnapshot?.recentExecutiveArbitrations.some(
    (a) => a.competingPriorities.includes("governance")
  );

  if (!governanceTension) return null;

  return createExecutiveConfidence(
    "governance_confidence_arbitration",
    "stabilizing",
    "moderate",
    "governance",
    "Governance-related priority tensions require confidence arbitration before stabilization sequencing can be treated as highly reliable.",
    ["governance_alignment"],
    ["governance_delay", "execution_constraint"],
    0.72,
    now
  );
}

function buildCertaintySignal(
  label: string,
  summary: string,
  categories: ConfidenceCategory[],
  certaintyState: CertaintyState,
  score: number,
  now: number
): StrategicCertaintySignal {
  return {
    signalId: stableSignature(["certainty-signal", label]).slice(0, 48),
    signalLabel: label,
    signalSummary: summary,
    linkedCategories: Object.freeze(categories),
    certaintyState,
    confidenceScore: clampConfidenceScore(score),
    generatedAt: now,
  };
}

function buildUncertaintyField(
  label: string,
  summary: string,
  concentration: EnterpriseUncertaintyField["uncertaintyConcentration"],
  categories: ConfidenceCategory[],
  now: number
): EnterpriseUncertaintyField {
  return {
    fieldId: stableSignature(["uncertainty-field", label]).slice(0, 48),
    fieldLabel: label,
    fieldSummary: summary,
    uncertaintyConcentration: concentration,
    linkedCategories: Object.freeze(categories),
    generatedAt: now,
  };
}

function buildAmbiguityIndicator(
  label: string,
  summary: string,
  intensity: OperationalAmbiguityIndicator["ambiguityIntensity"],
  categories: ConfidenceCategory[],
  now: number
): OperationalAmbiguityIndicator {
  return {
    indicatorId: stableSignature(["ambiguity-indicator", label]).slice(0, 48),
    indicatorLabel: label,
    ambiguitySummary: summary,
    ambiguityIntensity: intensity,
    linkedCategories: Object.freeze(categories),
    generatedAt: now,
  };
}

function buildConfidenceArbitrationSnapshot(
  organizationId: string,
  confidences: ExecutiveDecisionConfidence[],
  certaintySignals: StrategicCertaintySignal[],
  uncertaintyFields: EnterpriseUncertaintyField[],
  ambiguityIndicators: OperationalAmbiguityIndicator[],
  now: number
): ConfidenceArbitrationSnapshot {
  const top = confidences[0];
  const coordinationSummary: ConfidenceCoordinationSummary = top
    ? {
        dominantCertaintyState: top.certaintyState,
        dominantConfidenceLevel: top.confidenceLevel,
        confidenceHeadline: top.summary,
        certaintyPosture:
          top.confidenceLevel === "executive_grade" && top.certaintyState === "highly_confident"
            ? "executive_grade"
            : top.certaintyState === "uncertain" || top.certaintyState === "fragmented"
              ? "low"
              : top.certaintyState === "reliable" || top.certaintyState === "highly_confident"
                ? "high"
                : "moderate",
      }
    : {
        dominantCertaintyState: "uncertain",
        dominantConfidenceLevel: "weak",
        confidenceHeadline:
          "Decision confidence awaiting sufficient adaptive sequencing and orchestration depth.",
        certaintyPosture: "low",
      };

  const signature = stableSignature([
    "d9-5-6-confidence-arbitration-snapshot",
    organizationId,
    confidences.map((c) => c.confidenceId),
    coordinationSummary.certaintyPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    confidenceCount: confidences.length,
    coordinationSummary,
    recentExecutiveConfidences: Object.freeze(confidences.slice(0, 6)),
    certaintySignals: Object.freeze(certaintySignals.slice(0, 6)),
    uncertaintyFields: Object.freeze(uncertaintyFields.slice(0, 6)),
    ambiguityIndicators: Object.freeze(ambiguityIndicators.slice(0, 6)),
  };
}

export function evaluateExecutiveDecisionConfidence(
  input: ExecutiveDecisionConfidenceInput
): ExecutiveDecisionConfidenceResult {
  if (!beginDecisionConfidenceEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newExecutiveConfidences: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getDecisionConfidenceStore(organizationId);
    const prior = store.getState();

    const orchestrationState = getDecisionOrchestrationStore(organizationId).getState();
    const dependencyState = getActionDependencyStore(organizationId).getState();
    const arbitrationState = getPriorityArbitrationStore(organizationId).getState();
    const scenarioState = getScenarioCoordinationStore(organizationId).getState();
    const sequencingState = getAdaptiveSequencingStore(organizationId).getState();
    const foresightState = getUnifiedForesightRuntimeStore(organizationId).getState();
    const consensusState = getConsensusForesightStore(organizationId).getState();
    const preparednessState = getPreparednessCognitionStore(organizationId).getState();
    const interventionState = getInterventionTimingStore(organizationId).getState();

    const coordinationSnapshot =
      input.coordinationSnapshot ?? orchestrationState.snapshots[0] ?? null;
    const dependencySnapshot =
      input.dependencySnapshot ?? dependencyState.snapshots[0] ?? null;
    const arbitrationSnapshot =
      input.arbitrationSnapshot ?? arbitrationState.snapshots[0] ?? null;
    const scenarioSnapshot =
      input.scenarioSnapshot ?? scenarioState.snapshots[0] ?? null;
    const sequencingSnapshot =
      input.sequencingSnapshot ?? sequencingState.snapshots[0] ?? null;
    const anticipatorySnapshot =
      input.anticipatorySnapshot ?? foresightState.snapshots[0] ?? null;
    const consensusSnapshot =
      input.consensusSnapshot ?? consensusState.snapshots[0] ?? null;
    const preparednessSnapshot =
      input.preparednessSnapshot ?? preparednessState.snapshots[0] ?? null;
    const interventionSnapshot =
      input.interventionSnapshot ?? interventionState.snapshots[0] ?? null;

    const evaluationSignature = stableSignature([
      "d9-5-6-decision-confidence-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      coordinationSnapshot?.signature ?? orchestrationState.signature,
      dependencySnapshot?.signature ?? dependencyState.signature,
      arbitrationSnapshot?.signature ?? arbitrationState.signature,
      scenarioSnapshot?.signature ?? scenarioState.signature,
      sequencingSnapshot?.signature ?? sequencingState.signature,
      anticipatorySnapshot?.signature ?? foresightState.signature,
      consensusSnapshot?.signature ?? consensusState.signature,
      preparednessSnapshot?.signature ?? preparednessState.signature,
      interventionSnapshot?.signature ?? interventionState.signature,
    ]);

    if (
      !shouldEvaluateDecisionConfidence(
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
        newExecutiveConfidences: 0,
        storeSignature: prior.signature,
      };
    }

    const confidenceDepth =
      (coordinationSnapshot?.orchestrationCount ?? 0) +
      (dependencySnapshot?.graphCount ?? 0) +
      (arbitrationSnapshot?.arbitrationCount ?? 0) +
      (scenarioSnapshot?.topologyCount ?? 0) +
      (sequencingSnapshot?.sequenceCount ?? 0);

    if (confidenceDepth < 5) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_confidence_depth",
        snapshot: prior.snapshots[0] ?? null,
        newExecutiveConfidences: 0,
        storeSignature: prior.signature,
      };
    }

    const narrativeLine =
      input.enterpriseNarrativeLine ??
      input.cognitionSnapshot?.organizationalLearningLine ??
      input.cognitionSnapshot?.timelineStrategicEvolutionLine ??
      "";
    const resilienceLine =
      input.resilienceForecastLine ?? input.cognitionSnapshot?.resilienceForecastLine ?? "";
    const memoryLine = input.memorySnapshot?.historicalSummary ?? "";
    const fragilityElevated = input.fragilityElevated ?? false;

    const candidates: ExecutiveDecisionConfidence[] = [];

    const stabilizationConfidence = buildConsensusPreparednessConfidence(
      consensusSnapshot,
      preparednessSnapshot,
      now
    );
    if (stabilizationConfidence) candidates.push(stabilizationConfidence);

    const fragmentedConfidence = buildFragmentedForesightConfidence(
      consensusSnapshot,
      organizationId,
      now
    );
    if (fragmentedConfidence) candidates.push(fragmentedConfidence);

    const visibilityUncertainty = buildWeakVisibilityUncertainty(
      narrativeLine,
      memoryLine,
      dependencySnapshot,
      now
    );
    if (visibilityUncertainty) candidates.push(visibilityUncertainty);

    const reliableOrchestration = buildReliableOrchestrationConfidence(
      interventionSnapshot,
      resilienceLine,
      coordinationSnapshot,
      now
    );
    if (reliableOrchestration) candidates.push(reliableOrchestration);

    const unstableEscalation = buildUnstableEscalationPreparednessConfidence(
      anticipatorySnapshot,
      preparednessSnapshot,
      fragilityElevated,
      now
    );
    if (unstableEscalation) candidates.push(unstableEscalation);

    const executiveGrade = buildExecutiveGradeAlignmentConfidence(
      consensusSnapshot,
      arbitrationSnapshot,
      scenarioSnapshot,
      sequencingSnapshot,
      anticipatorySnapshot,
      now
    );
    if (executiveGrade) candidates.push(executiveGrade);

    const governanceArbitration = buildGovernanceConfidenceArbitration(arbitrationSnapshot, now);
    if (governanceArbitration) candidates.push(governanceArbitration);

    const retained = candidates
      .filter(shouldRetainExecutiveDecisionConfidence)
      .sort(
        (a, b) =>
          certaintyStateRank(b.certaintyState) - certaintyStateRank(a.certaintyState) ||
          confidenceLevelRank(b.confidenceLevel) - confidenceLevelRank(a.confidenceLevel) ||
          b.confidenceScore - a.confidenceScore
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_confidences",
        snapshot: prior.snapshots[0] ?? null,
        newExecutiveConfidences: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.executiveConfidences.map((c) => c.confidenceId));
    const newCount = retained.filter((c) => !priorIds.has(c.confidenceId)).length;

    const certaintySignals = retained.map((c) =>
      buildCertaintySignal(
        c.confidenceId,
        c.summary.slice(0, 100),
        [c.confidenceCategory],
        c.certaintyState,
        c.confidenceScore,
        now
      )
    );

    const uncertaintyFields = retained
      .filter((c) => c.uncertaintySignals.length > 0)
      .map((c) =>
        buildUncertaintyField(
          c.confidenceId,
          c.uncertaintySignals.join("; ").slice(0, 120),
          c.certaintyState === "uncertain" ? "elevated" : "moderate",
          [c.confidenceCategory],
          now
        )
      );

    const ambiguityIndicators = retained
      .filter((c) => c.certaintyState === "fragmented" || c.certaintyState === "uncertain")
      .map((c) =>
        buildAmbiguityIndicator(
          c.confidenceId,
          c.summary.slice(0, 100),
          c.certaintyState === "uncertain" ? "high" : "moderate",
          [c.confidenceCategory],
          now
        )
      );

    store.upsertExecutiveConfidences(retained, now);
    store.upsertCertaintySignals(certaintySignals, now);
    store.upsertUncertaintyFields(uncertaintyFields, now);
    store.upsertAmbiguityIndicators(ambiguityIndicators, now);

    const snapshot = buildConfidenceArbitrationSnapshot(
      organizationId,
      retained,
      certaintySignals,
      uncertaintyFields,
      ambiguityIndicators,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (executiveGrade) {
      devLog("executive-grade confidence formation — multi-layer certainty alignment");
    }
    if (fragmentedConfidence || unstableEscalation || visibilityUncertainty) {
      devLog("strategic uncertainty escalation — confidence arbitration tension active");
    }
    if (reliableOrchestration || stabilizationConfidence) {
      devLog("orchestration reliability shift — stabilized confidence pathway observed");
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newExecutiveConfidences: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endDecisionConfidenceEvaluation();
  }
}
