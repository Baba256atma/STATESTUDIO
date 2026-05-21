import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginCognitiveResilienceEvaluation,
  clampResilienceConfidence,
  COGNITIVE_RESILIENCE_MIN_TRUST_DEPTH,
  COGNITIVE_RESILIENCE_MIN_UNIFIED_LAYERS,
  endCognitiveResilienceEvaluation,
  resilienceStrengthRank,
  shouldEvaluateCognitiveResilience,
  shouldRetainRuntimeResilienceObservation,
  survivabilityStateRank,
} from "./cognitiveResilienceGuards";
import { getCognitiveResilienceStore } from "./cognitiveResilienceStore";
import type {
  CognitiveStressField,
  EnterpriseSurvivabilitySignal,
  ExecutiveCognitiveResilienceInput,
  ExecutiveCognitiveResilienceResult,
  ExecutiveCognitiveResilienceSnapshot,
  ResilienceCategory,
  ResilienceStrength,
  RuntimeResilienceObservation,
  StrategicDurabilityIndicator,
  SurvivabilityState,
  SurvivabilitySummary,
} from "./cognitiveResilienceTypes";

const DEV_LOG_PREFIX = "[Nexora][CognitiveResilience]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildResilienceId(label: string): string {
  return stableSignature(["cognitive-resilience", label]).slice(0, 56);
}

function collectSurvivabilityRisks(input: ExecutiveCognitiveResilienceInput): string[] {
  const fromDrift =
    input.cognitiveDriftSnapshot?.recentReasoningStabilities.flatMap((s) => s.driftRisks) ?? [];
  const fromUncertainty =
    input.cognitiveUncertaintySnapshot?.recentAmbiguityObservations.flatMap((o) => o.cautionRisks) ??
    [];
  const fromTrust =
    input.trustCalibrationSnapshot?.recentTrustAdjustments.flatMap((a) => a.cautionSignals) ?? [];
  const fromIntegrity =
    input.reasoningIntegritySnapshot?.contradictionIndicators.map((i) => i.indicatorLabel) ?? [];
  return Array.from(new Set([...fromDrift, ...fromUncertainty, ...fromTrust, ...fromIntegrity])).slice(
    0,
    6
  );
}

function createResilienceObservation(
  label: string,
  survivabilityState: SurvivabilityState,
  resilienceStrength: ResilienceStrength,
  resilienceCategory: ResilienceCategory,
  summary: string,
  resilienceSignals: string[],
  survivabilityRisks: string[],
  confidence: number,
  now: number
): RuntimeResilienceObservation {
  return {
    resilienceId: buildResilienceId(label),
    survivabilityState,
    resilienceStrength,
    resilienceCategory,
    summary,
    resilienceSignals: Object.freeze(resilienceSignals),
    survivabilityRisks: Object.freeze(survivabilityRisks),
    confidence: clampResilienceConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function countActiveUnifiedLayers(input: ExecutiveCognitiveResilienceInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.temporalSnapshot && input.temporalSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function buildEnterpriseCognitionSurvivability(
  input: ExecutiveCognitiveResilienceInput,
  survivabilityRisks: string[],
  now: number
): RuntimeResilienceObservation | null {
  const uncertaintyPresent =
    (input.cognitiveUncertaintySnapshot?.ambiguityCount ?? 0) >= 1;
  const integrityCoherent =
    input.reasoningIntegritySnapshot?.awarenessSummary.dominantConsistencyState === "coherent" ||
    input.reasoningIntegritySnapshot?.awarenessSummary.dominantConsistencyState === "verified";
  const driftStable =
    input.cognitiveDriftSnapshot?.awarenessSummary.dominantStabilityState === "stable" ||
    input.cognitiveDriftSnapshot?.awarenessSummary.dominantStabilityState === "adaptive";
  const trustReliable =
    input.trustCalibrationSnapshot?.awarenessSummary.dominantTrustState === "reliable" ||
    input.trustCalibrationSnapshot?.awarenessSummary.dominantTrustState === "highly_trustworthy";

  if (!uncertaintyPresent || !integrityCoherent || !driftStable) return null;

  return createResilienceObservation(
    "enterprise_cognition_survivability",
    survivabilityRisks.length > 0 ? "durable" : "survivable",
    trustReliable ? "resilient" : "stable",
    "unknown",
    survivabilityRisks.length > 0
      ? "Enterprise cognition remains durable under elevated uncertainty and orchestration stress, with strong resilience across reasoning integrity, governance coherence, and trust calibration systems."
      : "Enterprise cognition remains highly survivable under operational stress with durable reasoning integrity and stable trust calibration persistence.",
    [
      "stable_reasoning_under_uncertainty",
      "cross_runtime_durability",
      "governance_resilience",
      "trust_persistence",
    ],
    survivabilityRisks,
    survivabilityRisks.length > 0 ? 0.9 : 0.92,
    now
  );
}

function buildStableReasoningUnderUncertainty(
  input: ExecutiveCognitiveResilienceInput,
  now: number
): RuntimeResilienceObservation | null {
  const uncertaintyElevated =
    (input.cognitiveUncertaintySnapshot?.ambiguityCount ?? 0) >= 2;
  const integrityIntact =
    input.reasoningIntegritySnapshot?.awarenessSummary.dominantConsistencyState !== "fragmented" &&
    input.reasoningIntegritySnapshot?.awarenessSummary.dominantConsistencyState !== "contradictory";
  const metaStable =
    input.metaCognitionSnapshot?.awarenessSummary.dominantIntegrityState !== "fragmented";

  if (!uncertaintyElevated || !integrityIntact || !metaStable) return null;

  return createResilienceObservation(
    "stable_reasoning_under_uncertainty",
    "adaptive",
    "resilient",
    "reasoning_resilience",
    "Enterprise reasoning remains coherent under elevated uncertainty without cognition collapse — strong cognitive resilience under incomplete-information conditions.",
    ["stable_reasoning_under_uncertainty", "integrity_verification_active", "bounded_epistemic_awareness"],
    [],
    0.86,
    now
  );
}

function buildOrchestrationSurvivabilityConcern(
  input: ExecutiveCognitiveResilienceInput,
  now: number
): RuntimeResilienceObservation | null {
  const contradictions = (input.reasoningIntegritySnapshot?.contradictionIndicators.length ?? 0) >= 1;
  const sequencingUnstable =
    input.sequencingSnapshot?.awarenessSummary.dominantSequencingState === "unstable" ||
    input.sequencingSnapshot?.awarenessSummary.dominantSequencingState === "evolving";
  const decisionUnstable =
    input.decisionSnapshot?.runtimeStatus === "unstable" ||
    input.decisionSnapshot?.runtimeStatus === "degraded";

  if (!contradictions || (!sequencingUnstable && !decisionUnstable)) return null;

  return createResilienceObservation(
    "orchestration_survivability_concern",
    "unstable",
    "monitored",
    "orchestration_resilience",
    "Orchestration contradictions are degrading stability — enterprise intelligence survivability concern emerging in decision sequencing pathways.",
    ["adaptive_sequencing_active"],
    [
      "orchestration_instability",
      "survivability_degradation",
      "coordination_contradiction",
    ],
    0.68,
    now
  );
}

function buildEnterpriseGradeResilience(
  input: ExecutiveCognitiveResilienceInput,
  activeLayers: number,
  now: number
): RuntimeResilienceObservation | null {
  const crossAligned = input.reasoningIntegritySnapshot?.recentTrustObservations.some((o) =>
    o.consistencySignals.includes("cross_runtime_alignment")
  );
  const explainable =
    input.explainabilitySnapshot?.awarenessSummary.dominantTransparencyState === "explainable" ||
    input.explainabilitySnapshot?.awarenessSummary.dominantTransparencyState === "fully_transparent";
  const trustExecutive =
    input.trustCalibrationSnapshot?.awarenessSummary.dependabilityPosture === "executive_grade" ||
    input.trustCalibrationSnapshot?.awarenessSummary.dependabilityPosture === "high";

  if (!crossAligned || !explainable || !trustExecutive || activeLayers < 4) return null;

  return createResilienceObservation(
    "enterprise_grade_resilience",
    "survivable",
    "enterprise_grade",
    "runtime_stability",
    "Cross-runtime coherence remains durable under stress — executive-grade enterprise cognition resilience and survivability verified.",
    [
      "cross_runtime_durability",
      "transparent_explainability",
      "trust_calibration_persistence",
      "runtime_stability",
    ],
    [],
    0.94,
    now
  );
}

function buildConfidenceVolatilityUnderStress(
  input: ExecutiveCognitiveResilienceInput,
  now: number
): RuntimeResilienceObservation | null {
  const fragmentedConfidence =
    input.confidenceSnapshot?.coordinationSummary.dominantCertaintyState === "fragmented" ||
    input.confidenceSnapshot?.coordinationSummary.dominantCertaintyState === "uncertain";
  const stressElevated = input.fragilityElevated ?? false;
  const pressureAttention = input.cognitionSnapshot?.pressurePosture === "attention";

  if (!fragmentedConfidence || (!stressElevated && !pressureAttention)) return null;

  return createResilienceObservation(
    "confidence_volatility_under_stress",
    "degraded",
    "fragile",
    "confidence_resilience",
    "Confidence volatility is increasing under operational stress — resilience degradation signal in certainty arbitration pathways.",
    ["confidence_arbitration_active", "pressure_topology_stressed"],
    ["confidence_volatility", "resilience_degradation", "stress_amplification"],
    0.66,
    now
  );
}

function buildAdaptiveSurvivabilityRecovery(
  input: ExecutiveCognitiveResilienceInput,
  now: number
): RuntimeResilienceObservation | null {
  const driftRecovering =
    input.cognitiveDriftSnapshot?.awarenessSummary.dominantStabilityState === "adaptive" ||
    input.cognitiveDriftSnapshot?.awarenessSummary.dominantStabilityState === "stable";
  const priorDegrading =
    input.cognitiveDriftSnapshot?.recentReasoningStabilities.some(
      (s) => s.stabilityState === "degrading" || s.stabilityState === "fragmented"
    ) ?? false;
  const trustImproving =
    input.trustCalibrationSnapshot?.awarenessSummary.dominantTrustState !== "cautious";

  if (!driftRecovering || !priorDegrading || !trustImproving) return null;

  return createResilienceObservation(
    "adaptive_survivability_recovery",
    "adaptive",
    "stable",
    "runtime_stability",
    "Recovery after drift instability detected — adaptive survivability reinforcement as cognition durability stabilizes.",
    ["cognitive_drift_recovery", "trust_calibration_stabilizing", "runtime_durability_stabilization"],
    [],
    0.82,
    now
  );
}

function buildTrustPersistenceDurability(
  input: ExecutiveCognitiveResilienceInput,
  now: number
): RuntimeResilienceObservation | null {
  const trustDurable =
    input.trustCalibrationSnapshot?.awarenessSummary.dominantTrustState === "reliable" ||
    input.trustCalibrationSnapshot?.awarenessSummary.dominantTrustState === "highly_trustworthy";
  const driftNotFragmented =
    input.cognitiveDriftSnapshot?.awarenessSummary.dominantStabilityState !== "fragmented";

  if (!trustDurable || !driftNotFragmented) return null;

  return createResilienceObservation(
    "trust_persistence_durability",
    "durable",
    "resilient",
    "governance_resilience",
    "Stable trust calibration over monitoring cycles indicates durable enterprise cognition survivability across governance and reasoning layers.",
    ["trust_persistence", "governance_resilience", "stable_cognitive_drift"],
    [],
    0.88,
    now
  );
}

function buildSurvivabilityDegradation(
  input: ExecutiveCognitiveResilienceInput,
  survivabilityRisks: string[],
  now: number
): RuntimeResilienceObservation | null {
  const driftFragmented =
    input.cognitiveDriftSnapshot?.awarenessSummary.dominantStabilityState === "fragmented" ||
    input.cognitiveDriftSnapshot?.awarenessSummary.dominantStabilityState === "degrading";
  const trustCautious = input.trustCalibrationSnapshot?.awarenessSummary.dominantTrustState === "cautious";
  const manyRisks = survivabilityRisks.length >= 3;

  if (!driftFragmented && !(trustCautious && manyRisks)) return null;

  return createResilienceObservation(
    "survivability_degradation",
    "degraded",
    "fragile",
    "reasoning_resilience",
    "Repeated drift instability and degraded trust calibration signal cognitive survivability concern — executive monitoring of enterprise intelligence durability required.",
    ["integrity_verification_active"],
    survivabilityRisks.length > 0
      ? survivabilityRisks
      : ["survivability_degradation", "trust_instability", "drift_fragmentation"],
    0.64,
    now
  );
}

function buildStressPropagationResilience(
  input: ExecutiveCognitiveResilienceInput,
  now: number
): RuntimeResilienceObservation | null {
  const stressPropagating =
    input.cognitionSnapshot?.pressurePosture === "attention" ||
    input.cognitionSnapshot?.timelineStrategicEvolutionLine.includes("pressure");
  const reasoningCoherent =
    input.reasoningIntegritySnapshot?.awarenessSummary.dominantConsistencyState === "coherent" ||
    input.reasoningIntegritySnapshot?.awarenessSummary.dominantConsistencyState === "verified";

  if (!stressPropagating || !reasoningCoherent) return null;

  return createResilienceObservation(
    "stress_propagation_resilience",
    "durable",
    "resilient",
    "reasoning_resilience",
    "Stress propagation is increasing while strategic reasoning remains coherent — strong cognitive durability under operational pressure.",
    [
      "pressure_topology_stressed",
      "coherent_reasoning_under_stress",
      "cross_runtime_durability",
    ],
    ["moderate_coordination_volatility"],
    0.85,
    now
  );
}

function buildSurvivabilitySignal(
  observation: RuntimeResilienceObservation,
  now: number
): EnterpriseSurvivabilitySignal {
  return {
    signalId: stableSignature(["survivability-signal", observation.resilienceId]).slice(0, 48),
    signalLabel: observation.resilienceCategory.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.resilienceCategory]),
    signalIntensity:
      observation.resilienceStrength === "enterprise_grade" ||
      observation.resilienceStrength === "resilient"
        ? "high"
        : observation.resilienceStrength === "stable"
          ? "moderate"
          : "low",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildDurabilityIndicator(
  observation: RuntimeResilienceObservation,
  now: number
): StrategicDurabilityIndicator | null {
  if (
    observation.resilienceStrength !== "resilient" &&
    observation.resilienceStrength !== "enterprise_grade" &&
    observation.resilienceStrength !== "stable"
  ) {
    return null;
  }
  return {
    indicatorId: stableSignature(["durability-indicator", observation.resilienceId]).slice(0, 48),
    indicatorLabel: observation.resilienceCategory.replace(/_/g, " "),
    indicatorSummary: observation.summary.slice(0, 80),
    durabilityLevel:
      observation.resilienceStrength === "enterprise_grade" ? "enterprise_grade" : "high",
    linkedCategories: Object.freeze([observation.resilienceCategory]),
    generatedAt: now,
  };
}

function buildCognitiveStressField(
  observation: RuntimeResilienceObservation,
  now: number
): CognitiveStressField | null {
  if (observation.survivabilityRisks.length < 1 && observation.survivabilityState !== "degraded") {
    return null;
  }
  return {
    fieldId: stableSignature(["cognitive-stress", observation.resilienceId]).slice(0, 48),
    fieldLabel: observation.survivabilityRisks[0] ?? "operational_stress",
    fieldSummary: observation.summary.slice(0, 100),
    stressConcentration:
      observation.survivabilityState === "degraded"
        ? "critical"
        : observation.survivabilityRisks.length >= 3
          ? "elevated"
          : "moderate",
    linkedCategories: Object.freeze([observation.resilienceCategory]),
    generatedAt: now,
  };
}

function buildResilienceSnapshot(
  organizationId: string,
  observations: RuntimeResilienceObservation[],
  signals: EnterpriseSurvivabilitySignal[],
  durability: StrategicDurabilityIndicator[],
  stressFields: CognitiveStressField[],
  now: number
): ExecutiveCognitiveResilienceSnapshot {
  const top = observations[0];
  const awarenessSummary: SurvivabilitySummary = top
    ? {
        dominantSurvivabilityState: top.survivabilityState,
        dominantResilienceStrength: top.resilienceStrength,
        survivabilityHeadline: top.summary,
        robustnessPosture:
          top.survivabilityState === "survivable" && top.resilienceStrength === "enterprise_grade"
            ? "enterprise_grade"
            : top.survivabilityState === "degraded"
              ? "low"
              : top.resilienceStrength === "resilient"
                ? "high"
                : "moderate",
      }
    : {
        dominantSurvivabilityState: "unstable",
        dominantResilienceStrength: "fragile",
        survivabilityHeadline:
          "Cognitive resilience monitoring awaiting sufficient trust calibration depth.",
        robustnessPosture: "low",
      };

  const signature = stableSignature([
    "d9-6-7-cognitive-resilience-snapshot",
    organizationId,
    observations.map((o) => o.resilienceId),
    awarenessSummary.robustnessPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    awarenessSummary,
    recentResilienceObservations: Object.freeze(observations.slice(0, 6)),
    survivabilitySignals: Object.freeze(signals.slice(0, 6)),
    durabilityIndicators: Object.freeze(durability.slice(0, 6)),
    cognitiveStressFields: Object.freeze(stressFields.slice(0, 6)),
  };
}

export function evaluateExecutiveCognitiveResilience(
  input: ExecutiveCognitiveResilienceInput
): ExecutiveCognitiveResilienceResult {
  if (!beginCognitiveResilienceEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newResilienceObservations: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getCognitiveResilienceStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-6-7-cognitive-resilience-eval",
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
      input.confidenceSnapshot?.signature ?? "no-confidence",
      input.governanceCoherenceSnapshot?.signature ?? "no-governance-coherence",
      input.governanceSnapshot?.signature ?? "no-governance",
      input.sequencingSnapshot?.signature ?? "no-sequencing",
    ]);

    if (
      !shouldEvaluateCognitiveResilience(
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
        newResilienceObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const trustDepth = input.trustCalibrationSnapshot?.adjustmentCount ?? 0;

    if (activeLayers < COGNITIVE_RESILIENCE_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_resilience_monitoring_depth",
        snapshot: prior.snapshots[0] ?? null,
        newResilienceObservations: 0,
        storeSignature: prior.signature,
      };
    }

    if (trustDepth < COGNITIVE_RESILIENCE_MIN_TRUST_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_trust_calibration_depth",
        snapshot: prior.snapshots[0] ?? null,
        newResilienceObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const survivabilityRisks = collectSurvivabilityRisks(input);
    const candidates: RuntimeResilienceObservation[] = [];

    const enterpriseSurvivability = buildEnterpriseCognitionSurvivability(
      input,
      survivabilityRisks,
      now
    );
    if (enterpriseSurvivability) candidates.push(enterpriseSurvivability);

    const stableUnderUncertainty = buildStableReasoningUnderUncertainty(input, now);
    if (stableUnderUncertainty) candidates.push(stableUnderUncertainty);

    const orchestrationConcern = buildOrchestrationSurvivabilityConcern(input, now);
    if (orchestrationConcern) candidates.push(orchestrationConcern);

    const confidenceVolatility = buildConfidenceVolatilityUnderStress(input, now);
    if (confidenceVolatility) candidates.push(confidenceVolatility);

    const stressResilience = buildStressPropagationResilience(input, now);
    if (stressResilience) candidates.push(stressResilience);

    const trustDurability = buildTrustPersistenceDurability(input, now);
    if (trustDurability) candidates.push(trustDurability);

    const adaptiveRecovery = buildAdaptiveSurvivabilityRecovery(input, now);
    if (adaptiveRecovery) candidates.push(adaptiveRecovery);

    const survivabilityDegradation = buildSurvivabilityDegradation(input, survivabilityRisks, now);
    if (survivabilityDegradation) candidates.push(survivabilityDegradation);

    const executiveGrade = buildEnterpriseGradeResilience(input, activeLayers, now);
    if (executiveGrade) candidates.push(executiveGrade);

    const retained = candidates
      .filter(shouldRetainRuntimeResilienceObservation)
      .sort(
        (a, b) =>
          survivabilityStateRank(b.survivabilityState) -
            survivabilityStateRank(a.survivabilityState) ||
          resilienceStrengthRank(b.resilienceStrength) -
            resilienceStrengthRank(a.resilienceStrength) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_resilience_observations",
        snapshot: prior.snapshots[0] ?? null,
        newResilienceObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.resilienceObservations.map((o) => o.resilienceId));
    const newCount = retained.filter((o) => !priorIds.has(o.resilienceId)).length;

    const signals = retained.map((o) => buildSurvivabilitySignal(o, now));
    const durability = retained
      .map((o) => buildDurabilityIndicator(o, now))
      .filter((i): i is StrategicDurabilityIndicator => i !== null);
    const stressFields = retained
      .map((o) => buildCognitiveStressField(o, now))
      .filter((f): f is CognitiveStressField => f !== null);

    store.upsertResilienceObservations(retained, now);
    store.upsertSurvivabilitySignals(signals, now);
    store.upsertDurabilityIndicators(durability, now);
    store.upsertCognitiveStressFields(stressFields, now);

    const snapshot = buildResilienceSnapshot(
      organizationId,
      retained,
      signals,
      durability,
      stressFields,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastSurvivabilityState(snapshot.awarenessSummary.dominantSurvivabilityState);

    const finalState = store.getState();
    const priorSurvivability = prior.lastSurvivabilityState;

    if (orchestrationConcern || confidenceVolatility) {
      devLog("orchestration stress emergence — survivability monitoring active");
    }

    if (survivabilityDegradation) {
      devLog("survivability degradation — cognitive durability under stress");
    }

    if (adaptiveRecovery || (priorSurvivability === "degraded" && snapshot.awarenessSummary.dominantSurvivabilityState !== "degraded")) {
      devLog("survivability recovery — runtime durability stabilization");
    }

    if (executiveGrade || enterpriseSurvivability?.survivabilityState === "survivable") {
      devLog("enterprise-grade resilience formation — intelligence survivability verified");
    }

    if (
      priorSurvivability &&
      priorSurvivability !== snapshot.awarenessSummary.dominantSurvivabilityState
    ) {
      devLog(
        `survivability state shift — ${priorSurvivability} → ${snapshot.awarenessSummary.dominantSurvivabilityState}`
      );
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newResilienceObservations: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endCognitiveResilienceEvaluation();
  }
}
