import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginTrustCalibrationEvaluation,
  clampTrustCalibrationConfidence,
  endTrustCalibrationEvaluation,
  reliabilityStrengthRank,
  shouldEvaluateTrustCalibration,
  shouldRetainStrategicTrustAdjustment,
  TRUST_CALIBRATION_MIN_EXPLAINABILITY_DEPTH,
  TRUST_CALIBRATION_MIN_UNIFIED_LAYERS,
  trustStateRank,
} from "./trustCalibrationGuards";
import { getTrustCalibrationStore } from "./trustCalibrationStore";
import type {
  CognitiveReliabilityIndicator,
  EnterpriseReliabilitySignal,
  ExecutiveTrustCalibrationInput,
  ExecutiveTrustCalibrationResult,
  ExecutiveTrustCalibrationSnapshot,
  OperationalTrustworthinessField,
  ReliabilityStrength,
  StrategicTrustAdjustment,
  TrustCalibrationSummary,
  TrustCategory,
  TrustState,
} from "./trustCalibrationTypes";

const DEV_LOG_PREFIX = "[Nexora][TrustCalibration]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildTrustCalibrationId(label: string): string {
  return stableSignature(["trust-calibration", label]).slice(0, 56);
}

function collectCautionSignals(input: ExecutiveTrustCalibrationInput): string[] {
  const fromUncertainty =
    input.cognitiveUncertaintySnapshot?.recentAmbiguityObservations.flatMap((o) => [
      ...o.cautionRisks,
      ...o.unknownZones.filter((z) => z.includes("visibility") || z.includes("incomplete")),
    ]) ?? [];
  const fromIntegrity =
    input.reasoningIntegritySnapshot?.recentTrustObservations.flatMap((o) =>
      o.integrityRisks.filter(
        (r) =>
          r.includes("visibility") ||
          r.includes("caution") ||
          r.includes("mismatch") ||
          r.includes("volatility")
      )
    ) ?? [];
  const fromExplainability =
    input.explainabilitySnapshot?.recentReasoningTraces.flatMap((t) => t.uncertaintyFactors) ?? [];
  return Array.from(new Set([...fromUncertainty, ...fromIntegrity, ...fromExplainability])).slice(0, 6);
}

function createTrustAdjustment(
  label: string,
  trustState: TrustState,
  reliabilityStrength: ReliabilityStrength,
  trustCategory: TrustCategory,
  summary: string,
  reliabilitySignals: string[],
  cautionSignals: string[],
  confidence: number,
  now: number
): StrategicTrustAdjustment {
  return {
    trustCalibrationId: buildTrustCalibrationId(label),
    trustState,
    reliabilityStrength,
    trustCategory,
    summary,
    reliabilitySignals: Object.freeze(reliabilitySignals),
    cautionSignals: Object.freeze(cautionSignals),
    confidence: clampTrustCalibrationConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function countActiveUnifiedLayers(input: ExecutiveTrustCalibrationInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.temporalSnapshot && input.temporalSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function runtimeAligned(
  status: string | undefined,
  health?: string
): boolean {
  return (
    status === "stable" ||
    status === "recovering" ||
    health === "strong" ||
    health === "executive_grade"
  );
}

function buildEnterpriseReliabilityAssessment(
  input: ExecutiveTrustCalibrationInput,
  cautionSignals: string[],
  now: number
): StrategicTrustAdjustment | null {
  const memoryStrong =
    input.memorySnapshot?.institutionalHealth === "strong" ||
    input.memorySnapshot?.institutionalHealth === "verified";
  const foresightOk = runtimeAligned(
    input.foresightSnapshot?.runtimeStatus,
    input.foresightSnapshot?.foresightHealth
  );
  const decisionOk = runtimeAligned(
    input.decisionSnapshot?.runtimeStatus,
    input.decisionSnapshot?.orchestrationHealth
  );
  const governanceCoherent =
    input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "high" ||
    input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "institutional_grade";
  const driftStable =
    input.cognitiveDriftSnapshot?.awarenessSummary.dominantStabilityState === "stable" ||
    input.cognitiveDriftSnapshot?.awarenessSummary.dominantStabilityState === "adaptive";
  const integrityStrong =
    input.reasoningIntegritySnapshot?.awarenessSummary.trustPosture === "high" ||
    input.reasoningIntegritySnapshot?.awarenessSummary.trustPosture === "executive_grade";

  if (!memoryStrong || !foresightOk || !decisionOk || !driftStable) return null;

  return createTrustAdjustment(
    "enterprise_reliability_assessment",
    cautionSignals.length > 0 ? "reliable" : "highly_trustworthy",
    integrityStrong && governanceCoherent ? "strong" : "moderate",
    "unknown",
    cautionSignals.length > 0
      ? "Enterprise strategic cognition remains highly reliable across foresight, institutional memory, governance coherence, and orchestration stability, with moderate caution required for coordination visibility gaps."
      : "Enterprise strategic cognition remains highly reliable across foresight, institutional memory, governance coherence, and orchestration stability with durable cross-runtime dependability.",
    [
      "cross_runtime_alignment",
      "stable_reasoning_integrity",
      "institutional_memory_support",
      governanceCoherent ? "governance_consistency" : "governance_monitoring",
    ],
    cautionSignals,
    cautionSignals.length > 0 ? 0.91 : 0.93,
    now
  );
}

function buildVisibilityCautionAdjustment(
  cautionSignals: string[],
  now: number
): StrategicTrustAdjustment | null {
  const visibilityCaution = cautionSignals.some(
    (s) => s.includes("visibility") || s.includes("incomplete") || s.includes("coordination")
  );
  if (!visibilityCaution) return null;

  return createTrustAdjustment(
    "visibility_caution_adjustment",
    "monitored",
    "moderate",
    "advisory_reliability",
    "Weak operational visibility requires executive caution — advisory and coordination outputs should be weighted below foresight and governance signals until visibility improves.",
    ["meta_cognition_monitoring", "uncertainty_topology_mapped"],
    cautionSignals.filter((s) => s.includes("visibility") || s.includes("coordination")).slice(0, 3),
    0.76,
    now
  );
}

function buildExecutiveGradeTrustworthiness(
  input: ExecutiveTrustCalibrationInput,
  activeLayers: number,
  now: number
): StrategicTrustAdjustment | null {
  const integrityVerified =
    input.reasoningIntegritySnapshot?.awarenessSummary.dominantConsistencyState === "verified" ||
    input.reasoningIntegritySnapshot?.awarenessSummary.dominantConsistencyState === "coherent";
  const explainable =
    input.explainabilitySnapshot?.awarenessSummary.dominantTransparencyState === "explainable" ||
    input.explainabilitySnapshot?.awarenessSummary.dominantTransparencyState === "fully_transparent";
  const alignedObservations =
    input.reasoningIntegritySnapshot?.recentTrustObservations.filter(
      (o) => o.consistencySignals.includes("cross_runtime_alignment")
    ).length ?? 0;

  if (!integrityVerified || !explainable || alignedObservations < 1 || activeLayers < 4) return null;

  return createTrustAdjustment(
    "executive_grade_trustworthiness",
    "highly_trustworthy",
    "executive_grade",
    "unknown",
    "Repeated cross-runtime consistency, verified reasoning integrity, and transparent explainability collectively indicate executive-grade enterprise cognition trustworthiness.",
    [
      "cross_runtime_alignment",
      "verified_reasoning_integrity",
      "transparent_explainability",
      "stable_cognitive_drift",
    ],
    [],
    0.94,
    now
  );
}

function buildOvertrustWarning(
  input: ExecutiveTrustCalibrationInput,
  now: number
): StrategicTrustAdjustment | null {
  const highConfidence = input.confidenceSnapshot?.recentExecutiveConfidences.some(
    (c) => c.confidenceLevel === "strong" || c.confidenceLevel === "executive_grade"
  );
  const fragmentedEvidence =
    input.confidenceSnapshot?.coordinationSummary.dominantCertaintyState === "fragmented" ||
    input.confidenceSnapshot?.coordinationSummary.dominantCertaintyState === "uncertain" ||
    input.confidenceSnapshot?.coordinationSummary.certaintyPosture === "low";
  const mismatch = input.reasoningIntegritySnapshot?.recentTrustObservations.some((o) =>
    o.integrityRisks.includes("confidence_evidence_mismatch")
  );

  if (!highConfidence || (!fragmentedEvidence && !mismatch)) return null;

  return createTrustAdjustment(
    "overtrust_warning",
    "cautious",
    "limited",
    "confidence_reliability",
    "High confidence with fragmented or weak evidentiary support — overtrust warning: executive reliance on outputs should remain moderated until evidence quality improves.",
    ["confidence_arbitration_active"],
    ["overtrust_warning", "weak_evidence_alignment", "fragmented_certainty"],
    0.68,
    now
  );
}

function buildGovernanceReliabilityReduction(
  input: ExecutiveTrustCalibrationInput,
  now: number
): StrategicTrustAdjustment | null {
  const coherenceWeak =
    input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "low" ||
    input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "moderate";
  const governanceDegraded =
    input.governanceSnapshot?.governanceStatus === "degraded" ||
    input.governanceSnapshot?.governanceStatus === "unstable" ||
    input.governanceSnapshot?.integrityLevel === "weak";
  const driftDegrading =
    input.cognitiveDriftSnapshot?.awarenessSummary.dominantStabilityState === "degrading" ||
    input.cognitiveDriftSnapshot?.awarenessSummary.dominantStabilityState === "fragmented";

  if (!coherenceWeak && !governanceDegraded && !driftDegrading) return null;

  return createTrustAdjustment(
    "governance_reliability_reduction",
    "monitored",
    "limited",
    "governance_reliability",
    "Governance coherence degradation reduces enterprise cognition reliability — governance-aligned recommendations require additional validation.",
    ["governance_coherence_monitoring"],
    ["governance_reliability_reduction", "coherence_degradation"],
    0.7,
    now
  );
}

function buildMemoryDependabilityWeighting(
  input: ExecutiveTrustCalibrationInput,
  now: number
): StrategicTrustAdjustment | null {
  const memoryStrong =
    input.memorySnapshot?.institutionalHealth === "strong" ||
    input.memorySnapshot?.institutionalHealth === "verified";
  const decisionAligned =
    input.decisionSnapshot?.summary.institutionalAlignment === "coherent" ||
    input.decisionSnapshot?.summary.institutionalAlignment === "aligning";

  if (!memoryStrong || !decisionAligned) return null;

  return createTrustAdjustment(
    "memory_dependability_weighting",
    "conditionally_reliable",
    "strong",
    "memory_reliability",
    "Stable institutional-memory reinforcement strengthens dependability weighting for strategic recommendations supported by historical enterprise evidence.",
    ["institutional_memory_support", "memory_alignment", "stable_advisory_direction"],
    [],
    0.88,
    now
  );
}

function buildOrchestrationLowReliability(
  input: ExecutiveTrustCalibrationInput,
  now: number
): StrategicTrustAdjustment | null {
  const sequencingUnstable =
    input.sequencingSnapshot?.awarenessSummary.dominantSequencingState === "evolving" ||
    input.sequencingSnapshot?.awarenessSummary.dominantSequencingState === "unstable";
  const decisionUnstable =
    input.decisionSnapshot?.runtimeStatus === "unstable" ||
    input.decisionSnapshot?.runtimeStatus === "degraded";

  if (!sequencingUnstable && !decisionUnstable) return null;

  return createTrustAdjustment(
    "orchestration_low_reliability",
    "cautious",
    "weak",
    "orchestration_reliability",
    "Unstable orchestration and adaptive sequencing volatility reduce operational dependability — orchestration pathways should be treated with elevated executive caution.",
    ["adaptive_sequencing_active"],
    ["orchestration_instability", "sequencing_volatility", "low_orchestration_dependability"],
    0.67,
    now
  );
}

function buildForesightReliabilityCalibration(
  input: ExecutiveTrustCalibrationInput,
  now: number
): StrategicTrustAdjustment | null {
  const foresightStable = runtimeAligned(
    input.foresightSnapshot?.runtimeStatus,
    input.foresightSnapshot?.foresightHealth
  );
  const foresightAligned = input.reasoningIntegritySnapshot?.recentTrustObservations.some((o) =>
    o.consistencySignals.includes("foresight_decision_agreement")
  );

  if (!foresightStable) return null;

  return createTrustAdjustment(
    "foresight_reliability_calibration",
    foresightAligned ? "reliable" : "conditionally_reliable",
    foresightAligned ? "strong" : "moderate",
    "foresight_reliability",
    foresightAligned
      ? "Foresight runtime remains reliable with aligned decision orchestration and stable anticipatory signal coherence."
      : "Foresight runtime is stable but requires conditional trust pending stronger cross-runtime alignment confirmation.",
    foresightAligned
      ? ["foresight_decision_agreement", "early_warning_alignment"]
      : ["foresight_runtime_stable"],
    foresightAligned ? [] : ["alignment_confirmation_pending"],
    0.84,
    now
  );
}

function buildTemporalReliabilityCalibration(
  input: ExecutiveTrustCalibrationInput,
  now: number
): StrategicTrustAdjustment | null {
  const temporalDegraded =
    input.temporalSnapshot?.runtimeStatus === "degraded" ||
    input.temporalSnapshot?.runtimeStatus === "unstable";

  if (!temporalDegraded) return null;

  return createTrustAdjustment(
    "temporal_reliability_calibration",
    "monitored",
    "limited",
    "temporal_reliability",
    "Temporal cognition degradation reduces timeline-dependability trust — time-based strategic continuity signals require caution.",
    ["temporal_cognition_active"],
    ["temporal_reliability_reduction", "timeline_uncertainty"],
    0.72,
    now
  );
}

function buildReliabilitySignal(
  adjustment: StrategicTrustAdjustment,
  now: number
): EnterpriseReliabilitySignal {
  return {
    signalId: stableSignature(["reliability-signal", adjustment.trustCalibrationId]).slice(0, 48),
    signalLabel: adjustment.trustCategory.replace(/_/g, " "),
    signalSummary: adjustment.summary.slice(0, 100),
    linkedCategories: Object.freeze([adjustment.trustCategory]),
    signalStrength:
      adjustment.reliabilityStrength === "executive_grade" ||
      adjustment.reliabilityStrength === "strong"
        ? "high"
        : adjustment.reliabilityStrength === "moderate"
          ? "moderate"
          : "low",
    confidence: adjustment.confidence,
    generatedAt: now,
  };
}

function buildTrustworthinessField(
  adjustment: StrategicTrustAdjustment,
  now: number
): OperationalTrustworthinessField | null {
  if (
    adjustment.reliabilityStrength !== "strong" &&
    adjustment.reliabilityStrength !== "executive_grade"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["trustworthiness-field", adjustment.trustCalibrationId]).slice(0, 48),
    fieldLabel: adjustment.trustCategory.replace(/_/g, " "),
    fieldSummary: adjustment.summary.slice(0, 80),
    trustworthinessLevel:
      adjustment.reliabilityStrength === "executive_grade" ? "executive_grade" : "high",
    linkedCategories: Object.freeze([adjustment.trustCategory]),
    generatedAt: now,
  };
}

function buildReliabilityIndicator(
  adjustment: StrategicTrustAdjustment,
  now: number
): CognitiveReliabilityIndicator | null {
  if (adjustment.cautionSignals.length < 1 && adjustment.trustState !== "cautious") return null;
  return {
    indicatorId: stableSignature(["reliability-indicator", adjustment.trustCalibrationId]).slice(
      0,
      48
    ),
    indicatorLabel: adjustment.cautionSignals[0] ?? adjustment.trustState,
    indicatorSummary: adjustment.summary.slice(0, 100),
    reliabilityPosture:
      adjustment.trustState === "cautious"
        ? "degraded"
        : adjustment.cautionSignals.length > 0
          ? "stable"
          : "strengthening",
    linkedCategories: Object.freeze([adjustment.trustCategory]),
    generatedAt: now,
  };
}

function buildCalibrationSnapshot(
  organizationId: string,
  adjustments: StrategicTrustAdjustment[],
  signals: EnterpriseReliabilitySignal[],
  fields: OperationalTrustworthinessField[],
  indicators: CognitiveReliabilityIndicator[],
  now: number
): ExecutiveTrustCalibrationSnapshot {
  const top = adjustments[0];
  const awarenessSummary: TrustCalibrationSummary = top
    ? {
        dominantTrustState: top.trustState,
        dominantReliabilityStrength: top.reliabilityStrength,
        calibrationHeadline: top.summary,
        dependabilityPosture:
          top.trustState === "highly_trustworthy" && top.reliabilityStrength === "executive_grade"
            ? "executive_grade"
            : top.trustState === "cautious"
              ? "low"
              : top.reliabilityStrength === "strong"
                ? "high"
                : "moderate",
      }
    : {
        dominantTrustState: "monitored",
        dominantReliabilityStrength: "weak",
        calibrationHeadline:
          "Trust calibration awaiting sufficient explainability and cognition depth.",
        dependabilityPosture: "low",
      };

  const signature = stableSignature([
    "d9-6-6-trust-calibration-snapshot",
    organizationId,
    adjustments.map((a) => a.trustCalibrationId),
    awarenessSummary.dependabilityPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    adjustmentCount: adjustments.length,
    awarenessSummary,
    recentTrustAdjustments: Object.freeze(adjustments.slice(0, 6)),
    reliabilitySignals: Object.freeze(signals.slice(0, 6)),
    trustworthinessFields: Object.freeze(fields.slice(0, 6)),
    reliabilityIndicators: Object.freeze(indicators.slice(0, 6)),
  };
}

export function evaluateExecutiveTrustCalibration(
  input: ExecutiveTrustCalibrationInput
): ExecutiveTrustCalibrationResult {
  if (!beginTrustCalibrationEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newTrustAdjustments: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getTrustCalibrationStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-6-6-trust-calibration-eval",
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
      input.confidenceSnapshot?.signature ?? "no-confidence",
      input.governanceCoherenceSnapshot?.signature ?? "no-governance-coherence",
      input.governanceSnapshot?.signature ?? "no-governance",
      input.sequencingSnapshot?.signature ?? "no-sequencing",
    ]);

    if (
      !shouldEvaluateTrustCalibration(
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
        newTrustAdjustments: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const explainabilityDepth = input.explainabilitySnapshot?.traceCount ?? 0;

    if (activeLayers < TRUST_CALIBRATION_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_trust_calibration_depth",
        snapshot: prior.snapshots[0] ?? null,
        newTrustAdjustments: 0,
        storeSignature: prior.signature,
      };
    }

    if (explainabilityDepth < TRUST_CALIBRATION_MIN_EXPLAINABILITY_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_explainability_depth",
        snapshot: prior.snapshots[0] ?? null,
        newTrustAdjustments: 0,
        storeSignature: prior.signature,
      };
    }

    const cautionSignals = collectCautionSignals(input);
    const candidates: StrategicTrustAdjustment[] = [];

    const enterpriseReliability = buildEnterpriseReliabilityAssessment(input, cautionSignals, now);
    if (enterpriseReliability) candidates.push(enterpriseReliability);

    const visibilityCaution = buildVisibilityCautionAdjustment(cautionSignals, now);
    if (visibilityCaution) candidates.push(visibilityCaution);

    const overtrust = buildOvertrustWarning(input, now);
    if (overtrust) candidates.push(overtrust);

    const governanceReduction = buildGovernanceReliabilityReduction(input, now);
    if (governanceReduction) candidates.push(governanceReduction);

    const memoryDependability = buildMemoryDependabilityWeighting(input, now);
    if (memoryDependability) candidates.push(memoryDependability);

    const orchestrationLow = buildOrchestrationLowReliability(input, now);
    if (orchestrationLow) candidates.push(orchestrationLow);

    const foresightReliability = buildForesightReliabilityCalibration(input, now);
    if (foresightReliability) candidates.push(foresightReliability);

    const temporalReliability = buildTemporalReliabilityCalibration(input, now);
    if (temporalReliability) candidates.push(temporalReliability);

    const executiveGrade = buildExecutiveGradeTrustworthiness(input, activeLayers, now);
    if (executiveGrade) candidates.push(executiveGrade);

    const retained = candidates
      .filter(shouldRetainStrategicTrustAdjustment)
      .sort(
        (a, b) =>
          trustStateRank(b.trustState) - trustStateRank(a.trustState) ||
          reliabilityStrengthRank(b.reliabilityStrength) -
            reliabilityStrengthRank(a.reliabilityStrength) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_trust_adjustments",
        snapshot: prior.snapshots[0] ?? null,
        newTrustAdjustments: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.trustAdjustments.map((a) => a.trustCalibrationId));
    const newCount = retained.filter((a) => !priorIds.has(a.trustCalibrationId)).length;

    const signals = retained.map((a) => buildReliabilitySignal(a, now));
    const fields = retained
      .map((a) => buildTrustworthinessField(a, now))
      .filter((f): f is OperationalTrustworthinessField => f !== null);
    const indicators = retained
      .map((a) => buildReliabilityIndicator(a, now))
      .filter((i): i is CognitiveReliabilityIndicator => i !== null);

    store.upsertTrustAdjustments(retained, now);
    store.upsertReliabilitySignals(signals, now);
    store.upsertTrustworthinessFields(fields, now);
    store.upsertReliabilityIndicators(indicators, now);

    const snapshot = buildCalibrationSnapshot(
      organizationId,
      retained,
      signals,
      fields,
      indicators,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastTrustState(snapshot.awarenessSummary.dominantTrustState);

    const finalState = store.getState();
    const priorTrust = prior.lastTrustState;

    if (overtrust) {
      devLog("overtrust warning — confidence exceeds evidentiary support");
    }

    if (orchestrationLow || governanceReduction) {
      devLog("reliability degradation — executive caution calibration active");
    }

    if (executiveGrade || enterpriseReliability?.trustState === "highly_trustworthy") {
      devLog("executive-grade trust formation — cross-runtime dependability verified");
    }

    if (
      priorTrust &&
      priorTrust !== snapshot.awarenessSummary.dominantTrustState &&
      (snapshot.awarenessSummary.dominantTrustState === "cautious" ||
        snapshot.awarenessSummary.dominantTrustState === "highly_trustworthy")
    ) {
      devLog(
        `trust state shift — ${priorTrust} → ${snapshot.awarenessSummary.dominantTrustState}`
      );
    }

    if (
      priorTrust === "cautious" &&
      snapshot.awarenessSummary.dominantTrustState !== "cautious" &&
      snapshot.awarenessSummary.dominantTrustState !== "monitored"
    ) {
      devLog("reliability recovery — trust calibration posture improved");
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newTrustAdjustments: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endTrustCalibrationEvaluation();
  }
}
