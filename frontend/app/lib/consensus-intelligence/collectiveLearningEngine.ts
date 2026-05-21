import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginCollectiveLearningEvaluation,
  clampLearningConfidence,
  COLLECTIVE_LEARNING_MIN_DIVERSITY_DEPTH,
  COLLECTIVE_LEARNING_MIN_UNIFIED_LAYERS,
  endCollectiveLearningEvaluation,
  evolutionStrengthRank,
  learningStateRank,
  shouldEvaluateCollectiveLearning,
  shouldRetainEnterpriseIntelligenceEvolution,
} from "./collectiveLearningGuards";
import { getCollectiveLearningStore } from "./collectiveLearningStore";
import type {
  CollectiveEvolutionSummary,
  DistributedStrategicLearningSignal,
  EnterpriseIntelligenceEvolution,
  EvolutionStrength,
  ExecutiveCollectiveLearningInput,
  ExecutiveCollectiveLearningResult,
  ExecutiveCollectiveLearningSnapshot,
  LearningCategory,
  LearningState,
  PerspectiveLearningField,
  StrategicMaturityObservation,
} from "./collectiveLearningTypes";

const DEV_LOG_PREFIX = "[Nexora][CollectiveLearning]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildLearningId(label: string): string {
  return stableSignature(["collective-learning", label]).slice(0, 56);
}

function countActiveUnifiedLayers(input: ExecutiveCollectiveLearningInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function createEvolution(
  label: string,
  learningState: LearningState,
  evolutionStrength: EvolutionStrength,
  learningCategory: LearningCategory,
  summary: string,
  learningSignals: string[],
  maturityRisks: string[],
  confidence: number,
  now: number
): EnterpriseIntelligenceEvolution {
  return {
    learningId: buildLearningId(label),
    learningState,
    evolutionStrength,
    learningCategory,
    summary,
    learningSignals: Object.freeze(learningSignals),
    maturityRisks: Object.freeze(maturityRisks),
    confidence: clampLearningConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildGovernanceLearningReinforcement(
  input: ExecutiveCollectiveLearningInput,
  now: number
): EnterpriseIntelligenceEvolution | null {
  const governanceStress =
    input.fragilityElevated ||
    input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "moderate" ||
    input.governanceSnapshot?.governanceStatus === "monitored" ||
    input.governanceSnapshot?.governanceStatus === "degraded";
  const governanceWeight =
    input.consensusPrioritySnapshot?.recentWeightings.some(
      (w) => w.weightingCategory === "governance_priority"
    ) ?? false;

  if (!governanceStress && !governanceWeight) return null;

  return createEvolution(
    "governance_learning_reinforcement",
    "evolving",
    "adaptive",
    "governance_learning",
    "Repeated governance instability patterns reinforce governance-learning — enterprise cognition accumulates stabilization discipline from distributed operational experience.",
    ["governance_reinforcement", "governance_learning_accumulation", "institutional_discipline_growth"],
    ["governance_overconcentration_risk"],
    0.86,
    now
  );
}

function buildCounterfactualLearningMaturity(
  input: ExecutiveCollectiveLearningInput,
  now: number
): EnterpriseIntelligenceEvolution | null {
  const debate = input.counterfactualSnapshot;
  const robustDebate =
    (debate?.observationCount ?? 0) >= 2 &&
    debate?.recentDebates.some(
      (d) =>
        d.counterfactualState === "stress_tested" ||
        d.counterfactualState === "strategically_resolved"
    );

  if (!robustDebate) return null;

  return createEvolution(
    "counterfactual_learning_maturity",
    "consolidating",
    "mature",
    "counterfactual_learning",
    "Counterfactual simulations improving robustness — strategic-learning maturity indicates distributed challenge pathways are strengthening collective intelligence.",
    ["counterfactual_resilience_growth", "strategic_learning_maturity", "challenge_path_refinement"],
    [],
    0.88,
    now
  );
}

function buildAntiFragilityCollaborativeGrowth(
  input: ExecutiveCollectiveLearningInput,
  now: number
): EnterpriseIntelligenceEvolution | null {
  const diversity = input.diversitySnapshot;
  const plural =
    diversity?.awarenessSummary.dominantPluralityState === "balanced" ||
    diversity?.awarenessSummary.dominantPluralityState === "resilient" ||
    diversity?.awarenessSummary.dominantPluralityState === "diverse";

  if (!plural) return null;

  return createEvolution(
    "anti_fragility_collaborative_growth",
    "evolving",
    "adaptive",
    "resilience_learning",
    "Stable distributed diversity preserving resilience — collaborative anti-fragility growth reinforces plurality without artificial disagreement amplification.",
    ["collaborative_anti_fragility_growth", "plurality_preservation_learning", "distributed_reasoning_balance"],
    ["partial_operational_speed_underrepresentation"],
    0.87,
    now
  );
}

function buildTrustReliabilityConsolidation(
  input: ExecutiveCollectiveLearningInput,
  now: number
): EnterpriseIntelligenceEvolution | null {
  const reflective = input.unifiedSelfReflectiveSnapshot;
  const trustStable =
    reflective?.summary.trustCalibration === "reliable" ||
    reflective?.summary.trustCalibration === "highly_trustworthy";
  const trustWeight = input.consensusPrioritySnapshot?.recentWeightings.some(
    (w) => w.dominantPerspectives.includes("trust")
  );

  if (!trustStable && !trustWeight) return null;

  return createEvolution(
    "trust_reliability_consolidation",
    "consolidating",
    "mature",
    "trust_learning",
    "Trust-calibration repeatedly stabilizing cognition — reliability-learning consolidation strengthens executive confidence boundaries across distributed runtimes.",
    ["trust_calibration_stabilization", "reliability_learning_consolidation", "confidence_boundary_maturity"],
    [],
    0.85,
    now
  );
}

function buildOrchestrationSequencingEvolution(
  input: ExecutiveCollectiveLearningInput,
  now: number
): EnterpriseIntelligenceEvolution | null {
  const decisionStable = input.decisionSnapshot?.runtimeStatus === "stable";
  const recovery =
    input.unifiedSelfReflectiveSnapshot?.summary.adaptationState === "self_stabilized" ||
    input.unifiedSelfReflectiveSnapshot?.summary.adaptationState === "stabilizing";

  if (!decisionStable || !recovery) return null;

  return createEvolution(
    "orchestration_sequencing_evolution",
    "evolving",
    "adaptive",
    "orchestration_learning",
    "Adaptive orchestration reducing volatility — sequencing-learning evolution refines coordination pathways from accumulated stable-recovery operational patterns.",
    ["adaptive_orchestration_learning", "sequencing_refinement", "coordination_volatility_reduction"],
    [],
    0.84,
    now
  );
}

function buildEnterpriseCollectiveLearning(
  input: ExecutiveCollectiveLearningInput,
  now: number
): EnterpriseIntelligenceEvolution | null {
  const memoryStrong =
    input.memorySnapshot?.runtimeStatus === "stable" ||
    (input.memorySnapshot?.summary.primaryStrategicLesson.trim().length ?? 0) > 0;
  const layersMature =
    (input.collectiveGuidanceSnapshot?.observationCount ?? 0) >= 1 &&
    (input.counterfactualSnapshot?.observationCount ?? 0) >= 1 &&
    (input.diversitySnapshot?.observationCount ?? 0) >= 1;

  if (!memoryStrong || !layersMature) return null;

  return createEvolution(
    "enterprise_collective_learning_01",
    "evolving",
    "adaptive",
    "stabilization_learning",
    "Enterprise strategic cognition is evolving toward stronger resilience-oriented coordination through accumulated governance learning, counterfactual reinforcement, and adaptive orchestration refinement.",
    [
      "governance_reinforcement",
      "distributed_reasoning_maturity",
      "counterfactual_resilience_growth",
      "adaptive_orchestration_learning",
    ],
    ["partial_operational_speed_underrepresentation"],
    0.91,
    now
  );
}

function buildExecutiveGradeCollectiveMaturity(
  input: ExecutiveCollectiveLearningInput,
  now: number
): EnterpriseIntelligenceEvolution | null {
  const runtimesStable =
    input.decisionSnapshot?.runtimeStatus === "stable" &&
    input.foresightSnapshot?.runtimeStatus === "stable" &&
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "stable";
  const diversityResilient =
    input.diversitySnapshot?.awarenessSummary.resiliencePosture === "executive_grade" ||
    input.diversitySnapshot?.awarenessSummary.resiliencePosture === "high";
  const debateMature =
    input.counterfactualSnapshot?.awarenessSummary.robustnessPosture === "executive_grade" ||
    input.counterfactualSnapshot?.awarenessSummary.robustnessPosture === "high";

  if (!runtimesStable || !diversityResilient) return null;

  return createEvolution(
    "executive_grade_collective_maturity",
    debateMature ? "strategically_mature" : "consolidating",
    "enterprise_grade",
    "unknown",
    "Distributed cognition converging intelligently over time — enterprise-grade collective maturity reflects collaborative learning without autonomous architecture mutation.",
    [
      "executive_grade_collective_maturity",
      "distributed_cognition_evolution",
      "collaborative_intelligence_convergence",
    ],
    [],
    0.93,
    now
  );
}

function buildLearningFragilityWarning(
  input: ExecutiveCollectiveLearningInput,
  now: number
): EnterpriseIntelligenceEvolution | null {
  const diversityFragile =
    input.diversitySnapshot?.awarenessSummary.dominantPluralityState === "collapsed" ||
    input.diversitySnapshot?.awarenessSummary.dominantPluralityState === "narrowing";
  const fragmentedLearning =
    input.strategicConsensusSnapshot?.awarenessSummary.dominantConsensusState === "fragmented";

  if (!diversityFragile && !fragmentedLearning) return null;

  return createEvolution(
    "learning_fragility_warning",
    "fragmented",
    "developing",
    "unknown",
    "Learning-fragility emergence — distributed cognition maturation remains uneven with elevated consensus-concentration risk limiting collaborative learning continuity.",
    ["learning_fragility_emergence", "uneven_maturation", "consensus_concentration_risk"],
    ["collaborative_learning_discontinuity", "perspective_loss_risk"],
    0.68,
    now
  );
}

function buildResiliencePriorityLearning(
  input: ExecutiveCollectiveLearningInput,
  now: number
): EnterpriseIntelligenceEvolution | null {
  const survivable =
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "durable" ||
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "survivable";
  const resilienceSignals =
    input.collectiveGuidanceSnapshot?.recentAdvisories.some((a) =>
      a.alignedGuidance.includes("resilience_reinforcement")
    ) ?? false;

  if (!survivable && !resilienceSignals) return null;

  return createEvolution(
    "resilience_priority_learning",
    "emerging",
    "developing",
    "resilience_learning",
    "Stable resilience outcomes reinforce resilience-priority learning — enterprise cognition accumulates survivability-oriented coordination wisdom.",
    ["resilience_priority_reinforcement", "survivability_learning", "stable_outcome_accumulation"],
    [],
    0.83,
    now
  );
}

function buildLearningSignal(
  evolution: EnterpriseIntelligenceEvolution,
  now: number
): DistributedStrategicLearningSignal {
  return {
    signalId: stableSignature(["learning-signal", evolution.learningId]).slice(0, 48),
    signalLabel: evolution.learningState.replace(/_/g, " "),
    signalSummary: evolution.summary.slice(0, 100),
    linkedCategories: Object.freeze([evolution.learningCategory]),
    signalIntensity:
      evolution.evolutionStrength === "enterprise_grade" || evolution.evolutionStrength === "mature"
        ? "high"
        : "moderate",
    confidence: evolution.confidence,
    generatedAt: now,
  };
}

function buildMaturityObservation(
  evolution: EnterpriseIntelligenceEvolution,
  now: number
): StrategicMaturityObservation | null {
  if (
    evolution.learningState !== "consolidating" &&
    evolution.learningState !== "strategically_mature" &&
    evolution.learningState !== "evolving"
  ) {
    return null;
  }
  return {
    observationId: stableSignature(["maturity-observation", evolution.learningId]).slice(0, 48),
    observationLabel: evolution.learningState.replace(/_/g, " "),
    observationSummary: evolution.summary.slice(0, 100),
    maturityPosture:
      evolution.evolutionStrength === "enterprise_grade"
        ? "executive_grade"
        : evolution.evolutionStrength === "mature"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([evolution.learningCategory]),
    generatedAt: now,
  };
}

function buildLearningField(
  evolution: EnterpriseIntelligenceEvolution,
  now: number
): PerspectiveLearningField | null {
  if (evolution.learningState === "fragmented") return null;
  return {
    fieldId: stableSignature(["learning-field", evolution.learningId]).slice(0, 48),
    fieldLabel: evolution.learningState.replace(/_/g, " "),
    fieldSummary: evolution.summary.slice(0, 80),
    learningPosture:
      evolution.evolutionStrength === "enterprise_grade"
        ? "executive_grade"
        : evolution.evolutionStrength === "mature" || evolution.evolutionStrength === "adaptive"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([evolution.learningCategory]),
    generatedAt: now,
  };
}

function buildCollectiveLearningSnapshot(
  organizationId: string,
  evolutions: EnterpriseIntelligenceEvolution[],
  signals: DistributedStrategicLearningSignal[],
  maturity: StrategicMaturityObservation[],
  fields: PerspectiveLearningField[],
  now: number
): ExecutiveCollectiveLearningSnapshot {
  const top = evolutions[0];
  const awarenessSummary: CollectiveEvolutionSummary = top
    ? {
        dominantLearningState: top.learningState,
        dominantEvolutionStrength: top.evolutionStrength,
        evolutionHeadline: top.summary,
        maturationPosture:
          top.evolutionStrength === "enterprise_grade"
            ? "executive_grade"
            : top.evolutionStrength === "mature" || top.evolutionStrength === "adaptive"
              ? "high"
              : top.evolutionStrength === "developing"
                ? "moderate"
                : "low",
      }
    : {
        dominantLearningState: "emerging",
        dominantEvolutionStrength: "weak",
        evolutionHeadline:
          "Enterprise collective strategic learning awaiting sufficient diversity-preservation runtime depth.",
        maturationPosture: "low",
      };

  const signature = stableSignature([
    "d9-7-7-collective-learning-snapshot",
    organizationId,
    evolutions.map((e) => e.learningId),
    awarenessSummary.maturationPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: evolutions.length,
    awarenessSummary,
    recentEvolutions: Object.freeze(evolutions.slice(0, 6)),
    learningSignals: Object.freeze(signals.slice(0, 6)),
    maturityObservations: Object.freeze(maturity.slice(0, 6)),
    learningFields: Object.freeze(fields.slice(0, 6)),
  };
}

export function evaluateExecutiveCollectiveLearning(
  input: ExecutiveCollectiveLearningInput
): ExecutiveCollectiveLearningResult {
  if (!beginCollectiveLearningEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newEvolutions: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getCollectiveLearningStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-7-7-collective-learning-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.strategicConsensusSnapshot?.signature ?? "no-consensus",
      input.conflictResolutionSnapshot?.signature ?? "no-negotiation",
      input.consensusPrioritySnapshot?.signature ?? "no-weighting",
      input.collectiveGuidanceSnapshot?.signature ?? "no-advisory",
      input.counterfactualSnapshot?.signature ?? "no-debate",
      input.diversitySnapshot?.signature ?? "no-diversity",
      input.unifiedSelfReflectiveSnapshot?.signature ?? "no-unified-reflective",
      input.memorySnapshot?.signature ?? "no-memory",
      input.foresightSnapshot?.signature ?? "no-foresight",
      input.decisionSnapshot?.signature ?? "no-decision",
    ]);

    if (
      !shouldEvaluateCollectiveLearning(
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
        newEvolutions: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const diversityDepth = input.diversitySnapshot?.observationCount ?? 0;

    if (activeLayers < COLLECTIVE_LEARNING_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_learning_monitoring_depth",
        snapshot: prior.snapshots[0] ?? null,
        newEvolutions: 0,
        storeSignature: prior.signature,
      };
    }

    if (diversityDepth < COLLECTIVE_LEARNING_MIN_DIVERSITY_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_diversity_depth",
        snapshot: prior.snapshots[0] ?? null,
        newEvolutions: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: EnterpriseIntelligenceEvolution[] = [];

    const collectiveLearning = buildEnterpriseCollectiveLearning(input, now);
    if (collectiveLearning) candidates.push(collectiveLearning);

    const governanceLearning = buildGovernanceLearningReinforcement(input, now);
    if (governanceLearning) candidates.push(governanceLearning);

    const counterfactualMaturity = buildCounterfactualLearningMaturity(input, now);
    if (counterfactualMaturity) candidates.push(counterfactualMaturity);

    const antiFragility = buildAntiFragilityCollaborativeGrowth(input, now);
    if (antiFragility) candidates.push(antiFragility);

    const trustConsolidation = buildTrustReliabilityConsolidation(input, now);
    if (trustConsolidation) candidates.push(trustConsolidation);

    const orchestrationEvolution = buildOrchestrationSequencingEvolution(input, now);
    if (orchestrationEvolution) candidates.push(orchestrationEvolution);

    const executiveMaturity = buildExecutiveGradeCollectiveMaturity(input, now);
    if (executiveMaturity) candidates.push(executiveMaturity);

    const resilienceLearning = buildResiliencePriorityLearning(input, now);
    if (resilienceLearning) candidates.push(resilienceLearning);

    const learningFragility = buildLearningFragilityWarning(input, now);
    if (learningFragility) candidates.push(learningFragility);

    const retained = candidates
      .filter(shouldRetainEnterpriseIntelligenceEvolution)
      .sort(
        (a, b) =>
          learningStateRank(b.learningState) - learningStateRank(a.learningState) ||
          evolutionStrengthRank(b.evolutionStrength) - evolutionStrengthRank(a.evolutionStrength) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_evolutions",
        snapshot: prior.snapshots[0] ?? null,
        newEvolutions: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.evolutions.map((e) => e.learningId));
    const newCount = retained.filter((e) => !priorIds.has(e.learningId)).length;

    const signals = retained.map((e) => buildLearningSignal(e, now));
    const maturity = retained
      .map((e) => buildMaturityObservation(e, now))
      .filter((m): m is StrategicMaturityObservation => m !== null);
    const fields = retained
      .map((e) => buildLearningField(e, now))
      .filter((f): f is PerspectiveLearningField => f !== null);

    store.upsertEvolutions(retained, now);
    store.upsertLearningSignals(signals, now);
    store.upsertMaturityObservations(maturity, now);
    store.upsertLearningFields(fields, now);

    const snapshot = buildCollectiveLearningSnapshot(
      organizationId,
      retained,
      signals,
      maturity,
      fields,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastLearningState(snapshot.awarenessSummary.dominantLearningState);

    const finalState = store.getState();
    const priorLearning = prior.lastLearningState;

    if (collectiveLearning || counterfactualMaturity || executiveMaturity) {
      devLog("strategic-learning maturation — distributed cognition evolution advancing");
    }

    if (learningFragility) {
      devLog("learning-fragility emergence — collaborative maturation remains uneven");
    }

    if (executiveMaturity) {
      devLog("executive-grade collaborative convergence — enterprise collective learning stabilized");
    }

    if (antiFragility || resilienceLearning) {
      devLog("distributed cognition evolution — resilience-oriented learning pathways reinforced");
    }

    if (
      priorLearning &&
      priorLearning !== snapshot.awarenessSummary.dominantLearningState &&
      (snapshot.awarenessSummary.dominantLearningState === "strategically_mature" ||
        snapshot.awarenessSummary.dominantLearningState === "consolidating")
    ) {
      devLog(
        `learning state shift — ${priorLearning} → ${snapshot.awarenessSummary.dominantLearningState}`
      );
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newEvolutions: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endCollectiveLearningEvaluation();
  }
}
