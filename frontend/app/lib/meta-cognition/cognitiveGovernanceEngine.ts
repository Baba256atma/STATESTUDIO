import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginCognitiveGovernanceEvaluation,
  clampGovernanceConfidence,
  COGNITIVE_GOVERNANCE_MIN_ADAPTATION_DEPTH,
  COGNITIVE_GOVERNANCE_MIN_UNIFIED_LAYERS,
  endCognitiveGovernanceEvaluation,
  governanceStrengthRank,
  regulationStateRank,
  shouldEvaluateCognitiveGovernance,
  shouldRetainCognitiveConstraintObservation,
} from "./cognitiveGovernanceGuards";
import { getCognitiveGovernanceStore } from "./cognitiveGovernanceStore";
import type {
  CognitiveConstraintObservation,
  EnterpriseSelfRegulationSignal,
  ExecutiveCognitiveGovernanceInput,
  ExecutiveCognitiveGovernanceResult,
  ExecutiveCognitiveGovernanceSnapshot,
  GovernanceCategory,
  GovernanceIntegrityField,
  GovernanceStrength,
  RegulationState,
  SelfRegulationSummary,
  StrategicBoundaryIndicator,
} from "./cognitiveGovernanceTypes";

const DEV_LOG_PREFIX = "[Nexora][CognitiveGovernance]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildGovernanceId(label: string): string {
  return stableSignature(["cognitive-governance", label]).slice(0, 56);
}

function collectGovernanceRisks(input: ExecutiveCognitiveGovernanceInput): string[] {
  const fromAdaptation =
    input.cognitiveAdaptationSnapshot?.recentAdaptiveObservations.flatMap(
      (o) => o.stabilizationRisks
    ) ?? [];
  const fromResilience =
    input.cognitiveResilienceSnapshot?.recentResilienceObservations.flatMap(
      (o) => o.survivabilityRisks
    ) ?? [];
  const fromIntegrity =
    input.reasoningIntegritySnapshot?.contradictionIndicators.map(
      (i) => i.indicatorLabel
    ) ?? [];
  return Array.from(new Set([...fromAdaptation, ...fromResilience, ...fromIntegrity])).slice(0, 6);
}

function createConstraintObservation(
  label: string,
  regulationState: RegulationState,
  governanceStrength: GovernanceStrength,
  governanceCategory: GovernanceCategory,
  summary: string,
  governanceSignals: string[],
  governanceRisks: string[],
  confidence: number,
  now: number
): CognitiveConstraintObservation {
  return {
    governanceId: buildGovernanceId(label),
    regulationState,
    governanceStrength,
    governanceCategory,
    summary,
    governanceSignals: Object.freeze(governanceSignals),
    governanceRisks: Object.freeze(governanceRisks),
    confidence: clampGovernanceConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function countActiveUnifiedLayers(input: ExecutiveCognitiveGovernanceInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.temporalSnapshot && input.temporalSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function buildEnterpriseCognitiveGovernance(
  input: ExecutiveCognitiveGovernanceInput,
  governanceRisks: string[],
  now: number
): CognitiveConstraintObservation | null {
  const uncertaintyPresent = (input.cognitiveUncertaintySnapshot?.ambiguityCount ?? 0) >= 1;
  const trustStable =
    input.trustCalibrationSnapshot?.awarenessSummary.dominantTrustState === "reliable" ||
    input.trustCalibrationSnapshot?.awarenessSummary.dominantTrustState === "conditionally_reliable" ||
    input.trustCalibrationSnapshot?.awarenessSummary.dominantTrustState === "highly_trustworthy";
  const explainabilityActive = (input.explainabilitySnapshot?.traceCount ?? 0) >= 1;
  const adaptationActive = (input.cognitiveAdaptationSnapshot?.observationCount ?? 0) >= 1;

  if (!uncertaintyPresent || !explainabilityActive || !adaptationActive) return null;

  return createConstraintObservation(
    "enterprise_cognitive_governance",
    governanceRisks.length > 0 ? "stabilized" : "self_regulated",
    trustStable ? "governed" : "stable",
    "unknown",
    "Enterprise cognition remains strategically governed under elevated uncertainty through stable trust calibration, explainability reinforcement, and orchestration-boundary preservation.",
    [
      "confidence_constraint_alignment",
      "trust_stabilization",
      "explainability_preservation",
      "strategic_caution_reinforcement",
    ],
    governanceRisks,
    governanceRisks.length > 0 ? 0.91 : 0.93,
    now
  );
}

function buildConfidenceGovernanceWarning(
  input: ExecutiveCognitiveGovernanceInput,
  now: number
): CognitiveConstraintObservation | null {
  const highConfidence = input.confidenceSnapshot?.recentExecutiveConfidences.some(
    (c) => c.confidenceLevel === "strong" || c.confidenceLevel === "executive_grade"
  );
  const weakEvidence =
    input.reasoningIntegritySnapshot?.awarenessSummary.dominantConsistencyState === "partially_aligned" ||
    input.reasoningIntegritySnapshot?.awarenessSummary.dominantConsistencyState === "fragmented" ||
    input.reasoningIntegritySnapshot?.recentTrustObservations.some((o) =>
      o.integrityRisks.includes("confidence_evidence_mismatch")
    );
  const fragmentedCertainty =
    input.confidenceSnapshot?.coordinationSummary.dominantCertaintyState === "fragmented" ||
    input.confidenceSnapshot?.coordinationSummary.certaintyPosture === "low";

  if (!highConfidence || (!weakEvidence && !fragmentedCertainty)) return null;

  return createConstraintObservation(
    "confidence_governance_warning",
    "constrained",
    "monitored",
    "confidence_governance",
    "High confidence with weak evidentiary alignment triggers confidence governance warning — strategic reasoning boundaries require moderated amplification.",
    ["confidence_governance_warning", "weak_evidence_alignment", "confidence_constraint_alignment"],
    ["overconfidence_escalation", "premature_confidence_amplification"],
    0.76,
    now
  );
}

function buildSelfRegulationEscalation(
  input: ExecutiveCognitiveGovernanceInput,
  now: number
): CognitiveConstraintObservation | null {
  const contradictions = (input.reasoningIntegritySnapshot?.contradictionIndicators.length ?? 0) >= 1;
  const sequencingUnstable =
    input.sequencingSnapshot?.awarenessSummary.dominantSequencingState === "unstable" ||
    input.sequencingSnapshot?.awarenessSummary.dominantSequencingState === "evolving";
  const driftUnstable =
    input.cognitiveDriftSnapshot?.awarenessSummary.dominantStabilityState === "fluctuating" ||
    input.cognitiveDriftSnapshot?.awarenessSummary.dominantDriftSeverity === "unstable";

  if (!contradictions || (!sequencingUnstable && !driftUnstable)) return null;

  return createConstraintObservation(
    "self_regulation_escalation",
    "constrained",
    "monitored",
    "orchestration_governance",
    "Contradictory runtime conclusions are increasing instability — cognition-boundary escalation and self-regulation concern detected across orchestration pathways.",
    ["cognition_boundary_escalation", "self_regulation_concern", "orchestration_instability_growth"],
    ["reasoning_contradiction", "orchestration_instability"],
    0.74,
    now
  );
}

function buildGovernedCognitionStability(
  input: ExecutiveCognitiveGovernanceInput,
  now: number
): CognitiveConstraintObservation | null {
  const explainabilityStrong =
    (input.explainabilitySnapshot?.traceCount ?? 0) >= 2 ||
    input.explainabilitySnapshot?.awarenessSummary.dominantTransparencyState === "explainable";
  const trustAligned =
    input.trustCalibrationSnapshot?.awarenessSummary.dominantTrustState === "reliable" ||
    input.trustCalibrationSnapshot?.awarenessSummary.dominantTrustState === "highly_trustworthy";
  const integrityVerified =
    input.reasoningIntegritySnapshot?.awarenessSummary.dominantConsistencyState === "verified" ||
    input.reasoningIntegritySnapshot?.awarenessSummary.dominantConsistencyState === "coherent";

  if (!explainabilityStrong || !trustAligned || !integrityVerified) return null;

  return createConstraintObservation(
    "governed_cognition_stability",
    "stabilized",
    "governed",
    "explainability_governance",
    "Strong explainability with aligned trust calibration indicates governed cognition stability — enterprise reasoning boundaries remain operationally trustworthy.",
    ["governed_cognition_stability", "explainability_preservation", "trust_governance_coherence"],
    [],
    0.88,
    now
  );
}

function buildStrategicCautionReinforcement(
  input: ExecutiveCognitiveGovernanceInput,
  now: number
): CognitiveConstraintObservation | null {
  const ambiguityCount = input.cognitiveUncertaintySnapshot?.ambiguityCount ?? 0;
  const cautionEscalation =
    input.cognitiveUncertaintySnapshot?.awarenessSummary.dominantCautionPosture === "cautious" ||
    input.cognitiveUncertaintySnapshot?.awarenessSummary.dominantCautionPosture === "restricted";
  const propagationRisk = ambiguityCount >= 3;

  if (!propagationRisk || !cautionEscalation) return null;

  return createConstraintObservation(
    "strategic_caution_reinforcement",
    "monitored",
    "stable",
    "uncertainty_governance",
    "Excessive uncertainty propagation requires strategic caution reinforcement — bounded epistemic governance preserves executive safety alignment.",
    ["strategic_caution_reinforcement", "uncertainty_governance", "bounded_epistemic_governance"],
    ["excessive_uncertainty_amplification"],
    0.82,
    now
  );
}

function buildOrchestrationGovernanceDiscipline(
  input: ExecutiveCognitiveGovernanceInput,
  now: number
): CognitiveConstraintObservation | null {
  const sequencingStable =
    input.sequencingSnapshot?.awarenessSummary.dominantSequencingState === "stabilized" ||
    input.sequencingSnapshot?.awarenessSummary.dominantSequencingState === "adaptive";
  const decisionStable = input.decisionSnapshot?.runtimeStatus === "stable";
  const pressurePresent = input.fragilityElevated ?? false;

  if (!sequencingStable || !decisionStable || !pressurePresent) return null;

  return createConstraintObservation(
    "orchestration_governance_discipline",
    "self_regulated",
    "enterprise_grade",
    "orchestration_governance",
    "Stable orchestration under operational pressure demonstrates enterprise-grade governance resilience — cognition discipline preserved across decision pathways.",
    ["orchestration_discipline", "enterprise_grade_governance_resilience", "runtime_boundary_stability"],
    [],
    0.9,
    now
  );
}

function buildSpeculationRiskRegulation(
  input: ExecutiveCognitiveGovernanceInput,
  now: number
): CognitiveConstraintObservation | null {
  const foresightSpeculative =
    input.foresightSnapshot?.runtimeStatus === "unstable" ||
    input.foresightSnapshot?.summary.recommendedFocus.toLowerCase().includes("specul");
  const decisionVolatile = input.decisionSnapshot?.runtimeStatus === "unstable";
  const adaptationReactive =
    input.cognitiveAdaptationSnapshot?.awarenessSummary.dominantStabilizationState === "reactive";

  if (!foresightSpeculative && !decisionVolatile) return null;
  if (!adaptationReactive && !decisionVolatile) return null;

  return createConstraintObservation(
    "speculation_risk_regulation",
    "monitored",
    "monitored",
    "foresight_governance",
    "Strategic speculation risk is elevating — foresight and decision runtimes require governance-boundary monitoring to prevent overconfident forward projections.",
    ["speculation_risk_regulation", "foresight_boundary_monitoring", "strategic_speculation_awareness"],
    ["moderate_speculation_growth", "forward_projection_risk"],
    0.78,
    now
  );
}

function buildTrustGovernanceCoherence(
  input: ExecutiveCognitiveGovernanceInput,
  now: number
): CognitiveConstraintObservation | null {
  const trustWeakened =
    input.trustCalibrationSnapshot?.awarenessSummary.dominantTrustState === "cautious" ||
    input.trustCalibrationSnapshot?.awarenessSummary.dominantTrustState === "monitored";
  const governanceWeak =
    input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "low" ||
    input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "moderate";

  if (!trustWeakened || !governanceWeak) return null;

  return createConstraintObservation(
    "trust_governance_coherence_warning",
    "constrained",
    "monitored",
    "trust_governance",
    "Weakened trust-governance coherence detected — enterprise cognition requires trust-preserving control and governance integrity reinforcement.",
    ["trust_governance_coherence", "governance_integrity_reinforcement", "trust_preservation_control"],
    ["trust_fragmentation", "governance_integrity_weakness"],
    0.75,
    now
  );
}

function buildExplainabilityIntegrityConcern(
  input: ExecutiveCognitiveGovernanceInput,
  now: number
): CognitiveConstraintObservation | null {
  const explainabilityWeak =
    (input.explainabilitySnapshot?.traceCount ?? 0) < 1 ||
    input.explainabilitySnapshot?.awarenessSummary.dominantTransparencyState === "partial";
  const driftElevated =
    input.cognitiveDriftSnapshot?.awarenessSummary.dominantDriftSeverity === "elevated" ||
    input.cognitiveDriftSnapshot?.awarenessSummary.dominantDriftSeverity === "unstable";

  if (!explainabilityWeak || !driftElevated) return null;

  return createConstraintObservation(
    "explainability_integrity_concern",
    "monitored",
    "monitored",
    "explainability_governance",
    "Degraded explainability integrity under elevated drift — reasoning transparency boundaries require reinforcement before executive conclusions propagate.",
    ["explainability_integrity_concern", "reasoning_transparency_boundary", "drift_awareness_governance"],
    ["reasoning_volatility", "transparency_degradation"],
    0.77,
    now
  );
}

function buildAdaptiveSelfRegulationIntelligence(
  input: ExecutiveCognitiveGovernanceInput,
  now: number
): CognitiveConstraintObservation | null {
  const selfStabilized =
    input.cognitiveAdaptationSnapshot?.awarenessSummary.dominantStabilizationState === "self_stabilized" ||
    input.cognitiveAdaptationSnapshot?.awarenessSummary.dominantStabilizationState === "stabilizing";
  const coherencePreserved =
    input.reasoningIntegritySnapshot?.awarenessSummary.dominantConsistencyState !== "contradictory" &&
    input.reasoningIntegritySnapshot?.awarenessSummary.dominantConsistencyState !== "fragmented";
  const resilienceDurable =
    input.cognitiveResilienceSnapshot?.awarenessSummary.dominantSurvivabilityState === "durable" ||
    input.cognitiveResilienceSnapshot?.awarenessSummary.dominantSurvivabilityState === "survivable";

  if (!selfStabilized || !coherencePreserved || !resilienceDurable) return null;

  return createConstraintObservation(
    "adaptive_self_regulation_intelligence",
    "self_regulated",
    "governed",
    "resilience_governance",
    "Adaptive stabilization is preserving strategic coherence — strong self-regulation intelligence indicates enterprise cognition regains disciplined balance under stress.",
    ["adaptive_self_regulation", "strategic_coherence_preservation", "cognition_discipline_stabilization"],
    [],
    0.87,
    now
  );
}

function buildOrchestrationLoopConcern(
  input: ExecutiveCognitiveGovernanceInput,
  now: number
): CognitiveConstraintObservation | null {
  const sequencingEvolving =
    input.sequencingSnapshot?.awarenessSummary.dominantSequencingState === "evolving";
  const metaFragile =
    input.metaCognitionSnapshot?.awarenessSummary.dominantIntegrityState === "fragmented" ||
    input.metaCognitionSnapshot?.awarenessSummary.dominantIntegrityState === "uncertain";

  if (!sequencingEvolving || !metaFragile) return null;

  return createConstraintObservation(
    "orchestration_loop_concern",
    "monitored",
    "monitored",
    "orchestration_governance",
    "Unstable orchestration loops detected alongside meta-cognitive fragility — self-regulation monitoring prioritizes sequencing-boundary discipline.",
    ["orchestration_loop_concern", "sequencing_boundary_discipline", "meta_cognitive_fragility_awareness"],
    ["sequencing_instability"],
    0.73,
    now
  );
}

function buildEnterpriseGradeSelfRegulation(
  observations: CognitiveConstraintObservation[],
  activeLayers: number,
  now: number
): CognitiveConstraintObservation | null {
  const governedCount = observations.filter(
    (o) => o.governanceStrength === "governed" || o.governanceStrength === "enterprise_grade"
  ).length;
  const selfRegulated = observations.filter(
    (o) => o.regulationState === "self_regulated" || o.regulationState === "stabilized"
  ).length;

  if (governedCount < 3 || selfRegulated < 2 || activeLayers < 4) return null;

  return createConstraintObservation(
    "enterprise_grade_self_regulation",
    "self_regulated",
    "enterprise_grade",
    "unknown",
    "Multiple governance pathways remain active under complexity — executive-grade strategic self-regulation with durable integrity preservation.",
    [
      "enterprise_grade_self_regulation",
      "multi_pathway_governance",
      "strategic_integrity_preservation",
      "operational_trust_preservation",
    ],
    [],
    0.93,
    now
  );
}

function buildSelfRegulationSignal(
  observation: CognitiveConstraintObservation,
  now: number
): EnterpriseSelfRegulationSignal {
  return {
    signalId: stableSignature(["self-regulation-signal", observation.governanceId]).slice(0, 48),
    signalLabel: observation.governanceCategory.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.governanceCategory]),
    signalIntensity:
      observation.governanceStrength === "enterprise_grade" ||
      observation.governanceStrength === "governed"
        ? "high"
        : "moderate",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildBoundaryIndicator(
  observation: CognitiveConstraintObservation,
  now: number
): StrategicBoundaryIndicator | null {
  if (
    observation.governanceStrength !== "governed" &&
    observation.governanceStrength !== "enterprise_grade" &&
    observation.regulationState !== "constrained"
  ) {
    return null;
  }
  return {
    indicatorId: stableSignature(["boundary-indicator", observation.governanceId]).slice(0, 48),
    indicatorLabel: observation.governanceCategory.replace(/_/g, " "),
    indicatorSummary: observation.summary.slice(0, 80),
    boundaryLevel:
      observation.governanceStrength === "enterprise_grade"
        ? "enterprise_grade"
        : observation.regulationState === "constrained"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.governanceCategory]),
    generatedAt: now,
  };
}

function buildGovernanceIntegrityField(
  observation: CognitiveConstraintObservation,
  now: number
): GovernanceIntegrityField | null {
  if (
    observation.regulationState !== "stabilized" &&
    observation.regulationState !== "self_regulated"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["governance-integrity", observation.governanceId]).slice(0, 48),
    fieldLabel: observation.regulationState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    integrityPosture:
      observation.regulationState === "self_regulated" &&
      observation.governanceStrength === "enterprise_grade"
        ? "enterprise_grade"
        : observation.governanceStrength === "governed"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.governanceCategory]),
    generatedAt: now,
  };
}

function buildGovernanceSnapshot(
  organizationId: string,
  observations: CognitiveConstraintObservation[],
  signals: EnterpriseSelfRegulationSignal[],
  indicators: StrategicBoundaryIndicator[],
  integrityFields: GovernanceIntegrityField[],
  now: number
): ExecutiveCognitiveGovernanceSnapshot {
  const top = observations[0];
  const awarenessSummary: SelfRegulationSummary = top
    ? {
        dominantRegulationState: top.regulationState,
        dominantGovernanceStrength: top.governanceStrength,
        regulationHeadline: top.summary,
        integrityPosture:
          top.regulationState === "self_regulated" &&
          top.governanceStrength === "enterprise_grade"
            ? "enterprise_grade"
            : top.regulationState === "unrestricted"
              ? "low"
              : top.governanceStrength === "governed"
                ? "high"
                : "moderate",
      }
    : {
        dominantRegulationState: "unrestricted",
        dominantGovernanceStrength: "weak",
        regulationHeadline:
          "Cognitive governance awareness awaiting sufficient adaptation monitoring depth.",
        integrityPosture: "low",
      };

  const signature = stableSignature([
    "d9-6-9-cognitive-governance-snapshot",
    organizationId,
    observations.map((o) => o.governanceId),
    awarenessSummary.integrityPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    awarenessSummary,
    recentConstraintObservations: Object.freeze(observations.slice(0, 6)),
    selfRegulationSignals: Object.freeze(signals.slice(0, 6)),
    boundaryIndicators: Object.freeze(indicators.slice(0, 6)),
    governanceIntegrityFields: Object.freeze(integrityFields.slice(0, 6)),
  };
}

export function evaluateExecutiveCognitiveGovernance(
  input: ExecutiveCognitiveGovernanceInput
): ExecutiveCognitiveGovernanceResult {
  if (!beginCognitiveGovernanceEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newConstraintObservations: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getCognitiveGovernanceStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-6-9-cognitive-governance-eval",
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
      input.cognitiveAdaptationSnapshot?.signature ?? "no-cognitive-adaptation",
      input.confidenceSnapshot?.signature ?? "no-confidence",
      input.governanceCoherenceSnapshot?.signature ?? "no-governance-coherence",
      input.governanceSnapshot?.signature ?? "no-governance",
      input.sequencingSnapshot?.signature ?? "no-sequencing",
    ]);

    if (
      !shouldEvaluateCognitiveGovernance(
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
        newConstraintObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const adaptationDepth = input.cognitiveAdaptationSnapshot?.observationCount ?? 0;

    if (activeLayers < COGNITIVE_GOVERNANCE_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_governance_monitoring_depth",
        snapshot: prior.snapshots[0] ?? null,
        newConstraintObservations: 0,
        storeSignature: prior.signature,
      };
    }

    if (adaptationDepth < COGNITIVE_GOVERNANCE_MIN_ADAPTATION_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_adaptation_depth",
        snapshot: prior.snapshots[0] ?? null,
        newConstraintObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const governanceRisks = collectGovernanceRisks(input);
    const candidates: CognitiveConstraintObservation[] = [];

    const enterpriseGovernance = buildEnterpriseCognitiveGovernance(input, governanceRisks, now);
    if (enterpriseGovernance) candidates.push(enterpriseGovernance);

    const confidenceWarning = buildConfidenceGovernanceWarning(input, now);
    if (confidenceWarning) candidates.push(confidenceWarning);

    const selfRegulationEscalation = buildSelfRegulationEscalation(input, now);
    if (selfRegulationEscalation) candidates.push(selfRegulationEscalation);

    const governedStability = buildGovernedCognitionStability(input, now);
    if (governedStability) candidates.push(governedStability);

    const cautionReinforcement = buildStrategicCautionReinforcement(input, now);
    if (cautionReinforcement) candidates.push(cautionReinforcement);

    const orchestrationDiscipline = buildOrchestrationGovernanceDiscipline(input, now);
    if (orchestrationDiscipline) candidates.push(orchestrationDiscipline);

    const speculationRegulation = buildSpeculationRiskRegulation(input, now);
    if (speculationRegulation) candidates.push(speculationRegulation);

    const trustCoherence = buildTrustGovernanceCoherence(input, now);
    if (trustCoherence) candidates.push(trustCoherence);

    const explainabilityConcern = buildExplainabilityIntegrityConcern(input, now);
    if (explainabilityConcern) candidates.push(explainabilityConcern);

    const adaptiveSelfRegulation = buildAdaptiveSelfRegulationIntelligence(input, now);
    if (adaptiveSelfRegulation) candidates.push(adaptiveSelfRegulation);

    const orchestrationLoop = buildOrchestrationLoopConcern(input, now);
    if (orchestrationLoop) candidates.push(orchestrationLoop);

    const enterpriseGrade = buildEnterpriseGradeSelfRegulation(candidates, activeLayers, now);
    if (enterpriseGrade) candidates.push(enterpriseGrade);

    const retained = candidates
      .filter(shouldRetainCognitiveConstraintObservation)
      .sort(
        (a, b) =>
          regulationStateRank(b.regulationState) - regulationStateRank(a.regulationState) ||
          governanceStrengthRank(b.governanceStrength) -
            governanceStrengthRank(a.governanceStrength) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_constraint_observations",
        snapshot: prior.snapshots[0] ?? null,
        newConstraintObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.constraintObservations.map((o) => o.governanceId));
    const newCount = retained.filter((o) => !priorIds.has(o.governanceId)).length;

    const signals = retained.map((o) => buildSelfRegulationSignal(o, now));
    const indicators = retained
      .map((o) => buildBoundaryIndicator(o, now))
      .filter((i): i is StrategicBoundaryIndicator => i !== null);
    const integrityFields = retained
      .map((o) => buildGovernanceIntegrityField(o, now))
      .filter((f): f is GovernanceIntegrityField => f !== null);

    store.upsertConstraintObservations(retained, now);
    store.upsertSelfRegulationSignals(signals, now);
    store.upsertBoundaryIndicators(indicators, now);
    store.upsertGovernanceIntegrityFields(integrityFields, now);

    const snapshot = buildGovernanceSnapshot(
      organizationId,
      retained,
      signals,
      indicators,
      integrityFields,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastRegulationState(snapshot.awarenessSummary.dominantRegulationState);

    const finalState = store.getState();
    const priorRegulation = prior.lastRegulationState;

    if (confidenceWarning || trustCoherence) {
      devLog("governance degradation — confidence or trust-boundary concern detected");
    }

    if (selfRegulationEscalation || orchestrationLoop) {
      devLog("strategic-boundary escalation — cognition-boundary monitoring elevated");
    }

    if (enterpriseGrade || enterpriseGovernance?.regulationState === "self_regulated") {
      devLog("enterprise-grade self-regulation formation — governed cognition verified");
    }

    if (
      priorRegulation &&
      priorRegulation !== snapshot.awarenessSummary.dominantRegulationState &&
      (snapshot.awarenessSummary.dominantRegulationState === "self_regulated" ||
        snapshot.awarenessSummary.dominantRegulationState === "stabilized" ||
        priorRegulation === "unrestricted")
    ) {
      devLog(
        `cognition-discipline stabilization — ${priorRegulation} → ${snapshot.awarenessSummary.dominantRegulationState}`
      );
    }

    if (
      priorRegulation &&
      priorRegulation !== snapshot.awarenessSummary.dominantRegulationState &&
      (priorRegulation === "self_regulated" || priorRegulation === "stabilized") &&
      (snapshot.awarenessSummary.dominantRegulationState === "constrained" ||
        snapshot.awarenessSummary.dominantRegulationState === "monitored")
    ) {
      devLog("governance recovery cycle — regulation posture tightening under stress");
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newConstraintObservations: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endCognitiveGovernanceEvaluation();
  }
}
