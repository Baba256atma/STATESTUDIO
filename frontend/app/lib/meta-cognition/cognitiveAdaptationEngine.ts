import { stableSignature } from "../intelligence/shared/dedupe";
import {
  adaptationStrengthRank,
  beginCognitiveAdaptationEvaluation,
  clampAdaptationConfidence,
  COGNITIVE_ADAPTATION_MIN_RESILIENCE_DEPTH,
  COGNITIVE_ADAPTATION_MIN_UNIFIED_LAYERS,
  endCognitiveAdaptationEvaluation,
  shouldEvaluateCognitiveAdaptation,
  shouldRetainAdaptiveReasoningObservation,
  stabilizationStateRank,
} from "./cognitiveAdaptationGuards";
import { getCognitiveAdaptationStore } from "./cognitiveAdaptationStore";
import type {
  AdaptationCategory,
  AdaptationStrength,
  AdaptiveReasoningObservation,
  EnterpriseSelfStabilizationSignal,
  ExecutiveCognitiveAdaptationInput,
  ExecutiveCognitiveAdaptationResult,
  ExecutiveCognitiveAdaptationSnapshot,
  RuntimeBalanceField,
  SelfStabilizationSummary,
  StabilizationState,
  StrategicAdaptationIndicator,
} from "./cognitiveAdaptationTypes";

const DEV_LOG_PREFIX = "[Nexora][CognitiveAdaptation]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildAdaptationId(label: string): string {
  return stableSignature(["cognitive-adaptation", label]).slice(0, 56);
}

function collectStabilizationRisks(input: ExecutiveCognitiveAdaptationInput): string[] {
  const fromResilience =
    input.cognitiveResilienceSnapshot?.recentResilienceObservations.flatMap(
      (o) => o.survivabilityRisks
    ) ?? [];
  const fromUncertainty =
    input.cognitiveUncertaintySnapshot?.recentAmbiguityObservations.flatMap((o) => o.cautionRisks) ??
    [];
  const fromDrift =
    input.cognitiveDriftSnapshot?.recentReasoningStabilities.flatMap((s) => s.driftRisks) ?? [];
  return Array.from(new Set([...fromResilience, ...fromUncertainty, ...fromDrift])).slice(0, 6);
}

function createAdaptiveObservation(
  label: string,
  stabilizationState: StabilizationState,
  adaptationStrength: AdaptationStrength,
  adaptationCategory: AdaptationCategory,
  summary: string,
  adaptationSignals: string[],
  stabilizationRisks: string[],
  confidence: number,
  now: number
): AdaptiveReasoningObservation {
  return {
    adaptationId: buildAdaptationId(label),
    stabilizationState,
    adaptationStrength,
    adaptationCategory,
    summary,
    adaptationSignals: Object.freeze(adaptationSignals),
    stabilizationRisks: Object.freeze(stabilizationRisks),
    confidence: clampAdaptationConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function countActiveUnifiedLayers(input: ExecutiveCognitiveAdaptationInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.temporalSnapshot && input.temporalSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function buildEnterpriseSelfStabilization(
  input: ExecutiveCognitiveAdaptationInput,
  stabilizationRisks: string[],
  now: number
): AdaptiveReasoningObservation | null {
  const uncertaintyPresent = (input.cognitiveUncertaintySnapshot?.ambiguityCount ?? 0) >= 1;
  const governanceCoherent =
    input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "high" ||
    input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "institutional_grade";
  const trustCalibrated =
    input.trustCalibrationSnapshot?.awarenessSummary.dominantTrustState === "reliable" ||
    input.trustCalibrationSnapshot?.awarenessSummary.dominantTrustState === "conditionally_reliable" ||
    input.trustCalibrationSnapshot?.awarenessSummary.dominantTrustState === "highly_trustworthy";
  const explainabilityActive = (input.explainabilitySnapshot?.traceCount ?? 0) >= 1;
  const resilienceDurable =
    input.cognitiveResilienceSnapshot?.awarenessSummary.dominantSurvivabilityState === "durable" ||
    input.cognitiveResilienceSnapshot?.awarenessSummary.dominantSurvivabilityState === "adaptive";

  if (!uncertaintyPresent || !explainabilityActive || !resilienceDurable) return null;

  return createAdaptiveObservation(
    "enterprise_self_stabilization",
    stabilizationRisks.length > 0 ? "stabilizing" : "self_stabilized",
    governanceCoherent && trustCalibrated ? "strong" : "moderate",
    "unknown",
    "Enterprise cognition is adaptively stabilizing under elevated uncertainty through strengthened governance coherence, trust recalibration, and explainability reinforcement.",
    [
      "confidence_rebalancing",
      "governance_reinforcement",
      "trust_stabilization",
      "explainability_alignment",
    ],
    stabilizationRisks,
    stabilizationRisks.length > 0 ? 0.9 : 0.92,
    now
  );
}

function buildConfidenceRebalancing(
  input: ExecutiveCognitiveAdaptationInput,
  now: number
): AdaptiveReasoningObservation | null {
  const highConfidence = input.confidenceSnapshot?.recentExecutiveConfidences.some(
    (c) => c.confidenceLevel === "strong" || c.confidenceLevel === "executive_grade"
  );
  const uncertaintyElevated =
    (input.cognitiveUncertaintySnapshot?.ambiguityCount ?? 0) >= 1 ||
    input.cognitiveUncertaintySnapshot?.awarenessSummary.dominantCautionPosture === "moderated";
  const trustModerated =
    input.trustCalibrationSnapshot?.awarenessSummary.dominantTrustState === "monitored" ||
    input.trustCalibrationSnapshot?.awarenessSummary.dominantTrustState === "cautious";

  if (!highConfidence || (!uncertaintyElevated && !trustModerated)) return null;

  return createAdaptiveObservation(
    "confidence_rebalancing",
    "balancing",
    "moderate",
    "confidence_rebalancing",
    "Rising uncertainty is triggering adaptive trust balancing — confidence amplification is moderated to preserve strategic coherence under incomplete-information conditions.",
    ["confidence_rebalancing", "adaptive_trust_balancing", "uncertainty_response_balancing"],
    ["premature_confidence_amplification"],
    0.81,
    now
  );
}

function buildGovernanceReinforcementAdaptation(
  input: ExecutiveCognitiveAdaptationInput,
  now: number
): AdaptiveReasoningObservation | null {
  const governanceStrong =
    input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "high" ||
    input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "institutional_grade";
  const orchestrationStress =
    input.sequencingSnapshot?.awarenessSummary.dominantSequencingState === "evolving" ||
    input.sequencingSnapshot?.awarenessSummary.dominantSequencingState === "unstable" ||
    input.decisionSnapshot?.runtimeStatus === "unstable";

  if (!governanceStrong || !orchestrationStress) return null;

  return createAdaptiveObservation(
    "governance_reinforcement_adaptation",
    "stabilizing",
    "strong",
    "governance_reinforcement",
    "Governance coherence is reinforcing orchestration stability — enterprise cognition adaptively prioritizes governance-preserving stabilization under operational volatility.",
    ["governance_reinforcement", "orchestration_stabilization", "governance_preservation"],
    ["orchestration_volatility"],
    0.87,
    now
  );
}

function buildUncertaintyAdaptation(
  input: ExecutiveCognitiveAdaptationInput,
  now: number
): AdaptiveReasoningObservation | null {
  const ambiguityCount = input.cognitiveUncertaintySnapshot?.ambiguityCount ?? 0;
  const integrityIntact =
    input.reasoningIntegritySnapshot?.awarenessSummary.dominantConsistencyState !== "fragmented" &&
    input.reasoningIntegritySnapshot?.awarenessSummary.dominantConsistencyState !== "contradictory";

  if (ambiguityCount < 2 || !integrityIntact) return null;

  return createAdaptiveObservation(
    "uncertainty_adaptation",
    "adaptive",
    "strong",
    "uncertainty_adaptation",
    "Elevated uncertainty is met with adaptive reasoning preservation — strategic coherence maintained through bounded epistemic awareness and caution-calibrated outputs.",
    ["uncertainty_adaptation", "bounded_epistemic_awareness", "strategic_coherence_preservation"],
    [],
    0.85,
    now
  );
}

function buildExplainabilityAlignmentAdaptation(
  input: ExecutiveCognitiveAdaptationInput,
  now: number
): AdaptiveReasoningObservation | null {
  const driftElevated =
    input.cognitiveDriftSnapshot?.awarenessSummary.dominantDriftSeverity === "elevated" ||
    input.cognitiveDriftSnapshot?.awarenessSummary.dominantDriftSeverity === "unstable" ||
    input.cognitiveDriftSnapshot?.awarenessSummary.dominantStabilityState === "fluctuating";
  const explainabilityStrong =
    (input.explainabilitySnapshot?.traceCount ?? 0) >= 2 ||
    input.explainabilitySnapshot?.awarenessSummary.dominantTransparencyState === "explainable";

  if (!driftElevated || !explainabilityStrong) return null;

  return createAdaptiveObservation(
    "explainability_alignment_adaptation",
    "balancing",
    "moderate",
    "explainability_alignment",
    "Drift detection is increasing explainability weighting — strategic self-stabilization through transparent reasoning pathway reinforcement.",
    ["explainability_alignment", "drift_awareness_reinforcement", "transparent_reasoning_weighting"],
    ["reasoning_volatility"],
    0.83,
    now
  );
}

function buildOrchestrationStabilizationAdaptation(
  input: ExecutiveCognitiveAdaptationInput,
  now: number
): AdaptiveReasoningObservation | null {
  const sequencingUnstable =
    input.sequencingSnapshot?.awarenessSummary.dominantSequencingState === "unstable" ||
    input.sequencingSnapshot?.awarenessSummary.dominantSequencingState === "evolving";
  const stabilizationPriority =
    input.decisionSnapshot?.summary.stabilizationFocus.includes("stabil") ||
    input.decisionSnapshot?.summary.dominantPriority.includes("stabil");

  if (!sequencingUnstable || !stabilizationPriority) return null;

  return createAdaptiveObservation(
    "orchestration_stabilization_adaptation",
    "stabilizing",
    "strong",
    "orchestration_stabilization",
    "Orchestration volatility is triggering stabilization prioritization — adaptive sequencing responses rebalance enterprise decision pathways toward durable coordination.",
    ["orchestration_stabilization", "stabilization_prioritization", "coordination_rebalancing"],
    ["sequencing_instability"],
    0.84,
    now
  );
}

function buildTrustRecalibrationAdaptation(
  input: ExecutiveCognitiveAdaptationInput,
  now: number
): AdaptiveReasoningObservation | null {
  const trustRecovery =
    input.trustCalibrationSnapshot?.recentTrustAdjustments.some((a) =>
      a.cautionSignals.includes("overtrust_warning")
    ) ?? false;
  const resilienceRecovery = input.cognitiveResilienceSnapshot?.recentResilienceObservations.some(
    (o) => o.resilienceSignals.includes("cognitive_drift_recovery")
  );
  const trustImproving =
    input.trustCalibrationSnapshot?.awarenessSummary.dominantTrustState === "reliable" ||
    input.trustCalibrationSnapshot?.awarenessSummary.dominantTrustState === "conditionally_reliable";

  if (!trustImproving || (!trustRecovery && !resilienceRecovery)) return null;

  return createAdaptiveObservation(
    "trust_recalibration_adaptation",
    "adaptive",
    "moderate",
    "trust_recalibration",
    "Trust recalibration patterns are stabilizing enterprise cognition — adaptive balancing restores dependability after prior overtrust or instability conditions.",
    ["trust_recalibration", "trust_stabilization", "dependability_restoration"],
    [],
    0.82,
    now
  );
}

function buildResiliencePreservationAdaptation(
  input: ExecutiveCognitiveAdaptationInput,
  now: number
): AdaptiveReasoningObservation | null {
  const survivabilityDurable =
    input.cognitiveResilienceSnapshot?.awarenessSummary.dominantSurvivabilityState === "durable" ||
    input.cognitiveResilienceSnapshot?.awarenessSummary.dominantSurvivabilityState === "survivable";
  const stressUnderControl =
    input.cognitiveResilienceSnapshot?.awarenessSummary.robustnessPosture === "high" ||
    input.cognitiveResilienceSnapshot?.awarenessSummary.robustnessPosture === "enterprise_grade";

  if (!survivabilityDurable || !stressUnderControl) return null;

  return createAdaptiveObservation(
    "resilience_preservation_adaptation",
    "self_stabilized",
    "strong",
    "resilience_preservation",
    "Stable resilience under operational stress indicates enterprise-grade adaptation durability — cognition preserves survivability while maintaining strategic balance.",
    ["resilience_preservation", "stress_tolerance", "adaptive_resilience_continuity"],
    [],
    0.89,
    now
  );
}

function buildCautionReinforcementAdaptation(
  input: ExecutiveCognitiveAdaptationInput,
  now: number
): AdaptiveReasoningObservation | null {
  const contradictions = (input.reasoningIntegritySnapshot?.contradictionIndicators.length ?? 0) >= 1;
  const cautionEscalation =
    input.cognitiveUncertaintySnapshot?.awarenessSummary.dominantCautionPosture === "cautious" ||
    input.cognitiveUncertaintySnapshot?.awarenessSummary.dominantCautionPosture === "restricted";

  if (!contradictions || !cautionEscalation) return null;

  return createAdaptiveObservation(
    "caution_reinforcement_adaptation",
    "reactive",
    "moderate",
    "uncertainty_adaptation",
    "Contradiction growth is triggering caution reinforcement — adaptive reasoning preservation prevents overconfident conclusions under conflicting enterprise signals.",
    ["caution_reinforcement", "adaptive_reasoning_preservation", "contradiction_awareness"],
    ["reasoning_contradiction", "coordination_uncertainty"],
    0.74,
    now
  );
}

function buildRepeatedRecoveryStabilization(
  input: ExecutiveCognitiveAdaptationInput,
  now: number
): AdaptiveReasoningObservation | null {
  const recoverySignals =
    input.cognitiveResilienceSnapshot?.recentResilienceObservations.filter(
      (o) =>
        o.resilienceSignals.includes("cognitive_drift_recovery") ||
        o.survivabilityState === "adaptive"
    ).length ?? 0;
  const driftWasUnstable =
    input.cognitiveDriftSnapshot?.recentReasoningStabilities.some(
      (s) => s.stabilityState === "degrading" || s.stabilityState === "fluctuating"
    ) ?? false;

  if (recoverySignals < 1 || !driftWasUnstable) return null;

  return createAdaptiveObservation(
    "repeated_recovery_stabilization",
    "self_stabilized",
    "strong",
    "resilience_preservation",
    "Repeated recovery after instability demonstrates strong self-stabilization intelligence — enterprise cognition regains balance through adaptive resilience cycles.",
    ["recovery_after_instability", "self_stabilization_intelligence", "runtime_balance_restoration"],
    [],
    0.88,
    now
  );
}

function buildEnterpriseGradeAdaptation(
  observations: AdaptiveReasoningObservation[],
  activeLayers: number,
  now: number
): AdaptiveReasoningObservation | null {
  const strongCount = observations.filter(
    (o) => o.adaptationStrength === "strong" || o.adaptationStrength === "enterprise_grade"
  ).length;
  const stabilizing = observations.filter(
    (o) => o.stabilizationState === "stabilizing" || o.stabilizationState === "self_stabilized"
  ).length;

  if (strongCount < 3 || stabilizing < 2 || activeLayers < 4) return null;

  return createAdaptiveObservation(
    "enterprise_grade_adaptation",
    "self_stabilized",
    "enterprise_grade",
    "unknown",
    "Multiple stabilization pathways remain active under stress — executive-grade adaptive self-stabilization with durable strategic coherence preservation.",
    [
      "enterprise_grade_adaptation",
      "multi_pathway_stabilization",
      "strategic_coherence_preservation",
      "runtime_balance_consistency",
    ],
    [],
    0.93,
    now
  );
}

function buildStabilizationSignal(
  observation: AdaptiveReasoningObservation,
  now: number
): EnterpriseSelfStabilizationSignal {
  return {
    signalId: stableSignature(["stabilization-signal", observation.adaptationId]).slice(0, 48),
    signalLabel: observation.adaptationCategory.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.adaptationCategory]),
    signalIntensity:
      observation.adaptationStrength === "enterprise_grade" ||
      observation.adaptationStrength === "strong"
        ? "high"
        : "moderate",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildAdaptationIndicator(
  observation: AdaptiveReasoningObservation,
  now: number
): StrategicAdaptationIndicator | null {
  if (
    observation.adaptationStrength !== "strong" &&
    observation.adaptationStrength !== "enterprise_grade"
  ) {
    return null;
  }
  return {
    indicatorId: stableSignature(["adaptation-indicator", observation.adaptationId]).slice(0, 48),
    indicatorLabel: observation.adaptationCategory.replace(/_/g, " "),
    indicatorSummary: observation.summary.slice(0, 80),
    adaptationLevel:
      observation.adaptationStrength === "enterprise_grade" ? "enterprise_grade" : "high",
    linkedCategories: Object.freeze([observation.adaptationCategory]),
    generatedAt: now,
  };
}

function buildRuntimeBalanceField(
  observation: AdaptiveReasoningObservation,
  now: number
): RuntimeBalanceField | null {
  if (
    observation.stabilizationState !== "balancing" &&
    observation.stabilizationState !== "stabilizing" &&
    observation.stabilizationState !== "self_stabilized"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["runtime-balance", observation.adaptationId]).slice(0, 48),
    fieldLabel: observation.stabilizationState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    balancePosture:
      observation.stabilizationState === "self_stabilized"
        ? "enterprise_grade"
        : observation.adaptationStrength === "strong"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.adaptationCategory]),
    generatedAt: now,
  };
}

function buildAdaptationSnapshot(
  organizationId: string,
  observations: AdaptiveReasoningObservation[],
  signals: EnterpriseSelfStabilizationSignal[],
  indicators: StrategicAdaptationIndicator[],
  balanceFields: RuntimeBalanceField[],
  now: number
): ExecutiveCognitiveAdaptationSnapshot {
  const top = observations[0];
  const awarenessSummary: SelfStabilizationSummary = top
    ? {
        dominantStabilizationState: top.stabilizationState,
        dominantAdaptationStrength: top.adaptationStrength,
        stabilizationHeadline: top.summary,
        balancePosture:
          top.stabilizationState === "self_stabilized" &&
          top.adaptationStrength === "enterprise_grade"
            ? "enterprise_grade"
            : top.stabilizationState === "reactive"
              ? "low"
              : top.adaptationStrength === "strong"
                ? "high"
                : "moderate",
      }
    : {
        dominantStabilizationState: "reactive",
        dominantAdaptationStrength: "weak",
        stabilizationHeadline:
          "Cognitive adaptation awareness awaiting sufficient resilience monitoring depth.",
        balancePosture: "low",
      };

  const signature = stableSignature([
    "d9-6-8-cognitive-adaptation-snapshot",
    organizationId,
    observations.map((o) => o.adaptationId),
    awarenessSummary.balancePosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    awarenessSummary,
    recentAdaptiveObservations: Object.freeze(observations.slice(0, 6)),
    selfStabilizationSignals: Object.freeze(signals.slice(0, 6)),
    adaptationIndicators: Object.freeze(indicators.slice(0, 6)),
    runtimeBalanceFields: Object.freeze(balanceFields.slice(0, 6)),
  };
}

export function evaluateExecutiveCognitiveAdaptation(
  input: ExecutiveCognitiveAdaptationInput
): ExecutiveCognitiveAdaptationResult {
  if (!beginCognitiveAdaptationEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newAdaptiveObservations: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getCognitiveAdaptationStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-6-8-cognitive-adaptation-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.memorySnapshot?.signature ?? "no-memory",
      input.temporalSnapshot?.signature ?? "no-temporal",
      input.foresightSnapshot?.signature ?? "no-foresight",
      input.decisionSnapshot?.signature ?? "no-decision",
      input.metaCognitionSnapshot?.signature ?? "no-meta-cognition",
      input.reasoningIntegritySnapshot?.signature ?? "no-reasoning-integrity",
      input.cognitiveDriftSnapshot?.signature ?? "no-cognitive-drift",
      input.cognitiveUncertaintySnapshot?.signature ?? "no-cognitive-uncertainty",
      input.explainabilitySnapshot?.signature ?? "no-explainability",
      input.trustCalibrationSnapshot?.signature ?? "no-trust-calibration",
      input.cognitiveResilienceSnapshot?.signature ?? "no-cognitive-resilience",
      input.confidenceSnapshot?.signature ?? "no-confidence",
      input.governanceCoherenceSnapshot?.signature ?? "no-governance-coherence",
      input.governanceSnapshot?.signature ?? "no-governance",
      input.sequencingSnapshot?.signature ?? "no-sequencing",
    ]);

    if (
      !shouldEvaluateCognitiveAdaptation(
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
        newAdaptiveObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const resilienceDepth = input.cognitiveResilienceSnapshot?.observationCount ?? 0;

    if (activeLayers < COGNITIVE_ADAPTATION_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_adaptation_monitoring_depth",
        snapshot: prior.snapshots[0] ?? null,
        newAdaptiveObservations: 0,
        storeSignature: prior.signature,
      };
    }

    if (resilienceDepth < COGNITIVE_ADAPTATION_MIN_RESILIENCE_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_resilience_depth",
        snapshot: prior.snapshots[0] ?? null,
        newAdaptiveObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const stabilizationRisks = collectStabilizationRisks(input);
    const candidates: AdaptiveReasoningObservation[] = [];

    const selfStabilization = buildEnterpriseSelfStabilization(input, stabilizationRisks, now);
    if (selfStabilization) candidates.push(selfStabilization);

    const confidenceRebalancing = buildConfidenceRebalancing(input, now);
    if (confidenceRebalancing) candidates.push(confidenceRebalancing);

    const governanceReinforcement = buildGovernanceReinforcementAdaptation(input, now);
    if (governanceReinforcement) candidates.push(governanceReinforcement);

    const uncertaintyAdaptation = buildUncertaintyAdaptation(input, now);
    if (uncertaintyAdaptation) candidates.push(uncertaintyAdaptation);

    const explainabilityAlignment = buildExplainabilityAlignmentAdaptation(input, now);
    if (explainabilityAlignment) candidates.push(explainabilityAlignment);

    const orchestrationStabilization = buildOrchestrationStabilizationAdaptation(input, now);
    if (orchestrationStabilization) candidates.push(orchestrationStabilization);

    const trustRecalibration = buildTrustRecalibrationAdaptation(input, now);
    if (trustRecalibration) candidates.push(trustRecalibration);

    const resiliencePreservation = buildResiliencePreservationAdaptation(input, now);
    if (resiliencePreservation) candidates.push(resiliencePreservation);

    const cautionReinforcement = buildCautionReinforcementAdaptation(input, now);
    if (cautionReinforcement) candidates.push(cautionReinforcement);

    const repeatedRecovery = buildRepeatedRecoveryStabilization(input, now);
    if (repeatedRecovery) candidates.push(repeatedRecovery);

    const executiveGrade = buildEnterpriseGradeAdaptation(candidates, activeLayers, now);
    if (executiveGrade) candidates.push(executiveGrade);

    const retained = candidates
      .filter(shouldRetainAdaptiveReasoningObservation)
      .sort(
        (a, b) =>
          stabilizationStateRank(b.stabilizationState) -
            stabilizationStateRank(a.stabilizationState) ||
          adaptationStrengthRank(b.adaptationStrength) -
            adaptationStrengthRank(a.adaptationStrength) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_adaptive_observations",
        snapshot: prior.snapshots[0] ?? null,
        newAdaptiveObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.adaptiveObservations.map((o) => o.adaptationId));
    const newCount = retained.filter((o) => !priorIds.has(o.adaptationId)).length;

    const signals = retained.map((o) => buildStabilizationSignal(o, now));
    const indicators = retained
      .map((o) => buildAdaptationIndicator(o, now))
      .filter((i): i is StrategicAdaptationIndicator => i !== null);
    const balanceFields = retained
      .map((o) => buildRuntimeBalanceField(o, now))
      .filter((f): f is RuntimeBalanceField => f !== null);

    store.upsertAdaptiveObservations(retained, now);
    store.upsertSelfStabilizationSignals(signals, now);
    store.upsertAdaptationIndicators(indicators, now);
    store.upsertRuntimeBalanceFields(balanceFields, now);

    const snapshot = buildAdaptationSnapshot(
      organizationId,
      retained,
      signals,
      indicators,
      balanceFields,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastStabilizationState(snapshot.awarenessSummary.dominantStabilizationState);

    const finalState = store.getState();
    const priorStabilization = prior.lastStabilizationState;

    if (selfStabilization || governanceReinforcement) {
      devLog("adaptation stabilization emergence — self-stabilization pathways active");
    }

    if (confidenceRebalancing || trustRecalibration) {
      devLog("trust-balancing behavior — adaptive confidence rebalancing detected");
    }

    if (governanceReinforcement) {
      devLog("governance reinforcement adaptation — stabilization via coherence reinforcement");
    }

    if (executiveGrade || selfStabilization?.stabilizationState === "self_stabilized") {
      devLog("enterprise-grade stabilization formation — cognitive balance verified");
    }

    if (
      priorStabilization &&
      priorStabilization !== snapshot.awarenessSummary.dominantStabilizationState &&
      (snapshot.awarenessSummary.dominantStabilizationState === "self_stabilized" ||
        priorStabilization === "reactive")
    ) {
      devLog(
        `stabilization state shift — ${priorStabilization} → ${snapshot.awarenessSummary.dominantStabilizationState}`
      );
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newAdaptiveObservations: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endCognitiveAdaptationEvaluation();
  }
}
