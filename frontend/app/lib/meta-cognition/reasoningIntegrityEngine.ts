import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginReasoningIntegrityEvaluation,
  clampIntegrityConfidence,
  consistencyStateRank,
  endReasoningIntegrityEvaluation,
  integrityStrengthRank,
  REASONING_INTEGRITY_MIN_META_DEPTH,
  REASONING_INTEGRITY_MIN_UNIFIED_LAYERS,
  shouldEvaluateReasoningIntegrity,
  shouldRetainExecutiveTrustObservation,
} from "./reasoningIntegrityGuards";
import { getReasoningIntegrityStore } from "./reasoningIntegrityStore";
import type {
  CognitiveConsistencySignal,
  ConsistencyState,
  CrossRuntimeAlignment,
  EnterpriseContradictionIndicator,
  ExecutiveTrustObservation,
  IntegrityStrength,
  IntegrityVerificationSummary,
  StrategicReasoningIntegrityInput,
  StrategicReasoningIntegrityResult,
  StrategicReasoningIntegritySnapshot,
  VerificationCategory,
} from "./reasoningIntegrityTypes";

const DEV_LOG_PREFIX = "[Nexora][ReasoningIntegrity]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildIntegrityId(label: string): string {
  return stableSignature(["reasoning-integrity", label]).slice(0, 56);
}

function createTrustObservation(
  label: string,
  consistencyState: ConsistencyState,
  integrityStrength: IntegrityStrength,
  category: VerificationCategory,
  summary: string,
  consistencySignals: string[],
  integrityRisks: string[],
  confidence: number,
  now: number
): ExecutiveTrustObservation {
  return {
    integrityId: buildIntegrityId(label),
    consistencyState,
    integrityStrength,
    verificationCategory: category,
    summary,
    consistencySignals: Object.freeze(consistencySignals),
    integrityRisks: Object.freeze(integrityRisks),
    confidence: clampIntegrityConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function countActiveUnifiedLayers(input: StrategicReasoningIntegrityInput): number {
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

function buildForesightOrchestrationConsistency(
  foresightSnapshot: StrategicReasoningIntegrityInput["foresightSnapshot"],
  decisionSnapshot: StrategicReasoningIntegrityInput["decisionSnapshot"],
  now: number
): ExecutiveTrustObservation | null {
  const foresightOk = runtimeAligned(
    foresightSnapshot?.runtimeStatus,
    foresightSnapshot?.foresightHealth
  );
  const decisionOk = runtimeAligned(
    decisionSnapshot?.runtimeStatus,
    decisionSnapshot?.orchestrationHealth
  );

  if (!foresightOk || !decisionOk) return null;

  return createTrustObservation(
    "foresight_orchestration_consistency",
    "coherent",
    "strong",
    "foresight_consistency",
    "Strategic reasoning remains coherent across foresight, orchestration, institutional memory, and governance alignment, with minor uncertainty in operational visibility.",
    [
      "cross_runtime_alignment",
      "stable_orchestration",
      "foresight_decision_agreement",
    ],
    ["partial_operational_visibility"],
    0.9,
    now
  );
}

function buildConfidenceEvidenceMismatch(
  confidenceSnapshot: StrategicReasoningIntegrityInput["confidenceSnapshot"],
  governanceSnapshot: StrategicReasoningIntegrityInput["governanceSnapshot"],
  metaCognitionSnapshot: StrategicReasoningIntegrityInput["metaCognitionSnapshot"],
  now: number
): ExecutiveTrustObservation | null {
  const highConfidence = confidenceSnapshot?.recentExecutiveConfidences.some(
    (c) => c.confidenceLevel === "strong" || c.confidenceLevel === "executive_grade"
  );
  const weakEvidence =
    governanceSnapshot?.integrityLevel === "weak" ||
    governanceSnapshot?.integrityLevel === "moderate" ||
    confidenceSnapshot?.coordinationSummary.certaintyPosture === "low";
  const metaWarns = metaCognitionSnapshot?.metaCognitiveRisks.some((r) =>
    r.riskLabel.includes("overconfidence")
  );

  if (!highConfidence || (!weakEvidence && !metaWarns)) return null;

  return createTrustObservation(
    "confidence_evidence_mismatch",
    "partially_aligned",
    "monitored",
    "confidence_reliability",
    "Confidence arbitration signals remain elevated while institutional evidence and meta-cognition caution suggest limited evidentiary support — executive trust review is advised.",
    ["confidence_arbitration_active"],
    ["confidence_evidence_mismatch", "trust_warning", "human_review_recommended"],
    0.69,
    now
  );
}

function buildMemoryRecommendationConflict(
  memorySnapshot: StrategicReasoningIntegrityInput["memorySnapshot"],
  decisionSnapshot: StrategicReasoningIntegrityInput["decisionSnapshot"],
  foresightSnapshot: StrategicReasoningIntegrityInput["foresightSnapshot"],
  now: number
): ExecutiveTrustObservation | null {
  const memoryWeak =
    memorySnapshot?.institutionalHealth === "weak" ||
    memorySnapshot?.institutionalHealth === "moderate";
  const escalationForesight =
    foresightSnapshot?.summary.dominantRisk.includes("escalation") ||
    foresightSnapshot?.summary.dominantRisk.includes("pressure") ||
    foresightSnapshot?.summary.earlyWarningState === "intensifying" ||
    foresightSnapshot?.summary.earlyWarningState === "spreading";
  const growthPriority =
    decisionSnapshot?.summary.dominantPriority.includes("growth") ||
    decisionSnapshot?.summary.dominantPriority.includes("acceleration") ||
    decisionSnapshot?.summary.stabilizationFocus.includes("accelerat");

  if (!memoryWeak || !escalationForesight || !growthPriority) return null;

  return createTrustObservation(
    "memory_recommendation_conflict",
    "contradictory",
    "monitored",
    "institutional_alignment",
    "Institutional memory contains strain signals while foresight warns of escalation risk and orchestration prioritizes acceleration — reasoning integrity conflict detected.",
    ["institutional_memory_strain", "foresight_escalation_signal"],
    ["integrity_conflict", "recommendation_contradiction", "executive_caution_required"],
    0.66,
    now
  );
}

function buildSequencingInstabilitySignal(
  sequencingSnapshot: StrategicReasoningIntegrityInput["sequencingSnapshot"],
  now: number
): ExecutiveTrustObservation | null {
  const evolving =
    sequencingSnapshot?.awarenessSummary.dominantSequencingState === "evolving" ||
    sequencingSnapshot?.awarenessSummary.dominantSequencingState === "unstable";
  const frequentShifts =
    (sequencingSnapshot?.responseEvolutions.length ?? 0) >= 2 ||
    (sequencingSnapshot?.responseTransitions.length ?? 0) >= 3;

  if (!evolving || !frequentShifts) return null;

  return createTrustObservation(
    "adaptive_sequencing_instability",
    "fragmented",
    "monitored",
    "orchestration_integrity",
    "Adaptive sequencing is changing excessively across orchestration pathways — operational sequencing integrity may be unstable.",
    ["adaptive_sequencing_active"],
    ["orchestration_instability", "sequencing_volatility", "coordination_uncertainty"],
    0.72,
    now
  );
}

function buildGovernanceCoherenceVerification(
  governanceCoherenceSnapshot: StrategicReasoningIntegrityInput["governanceCoherenceSnapshot"],
  governanceSnapshot: StrategicReasoningIntegrityInput["governanceSnapshot"],
  now: number
): ExecutiveTrustObservation | null {
  const coherenceStable =
    governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "high" ||
    governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "institutional_grade";
  const governanceStable =
    governanceSnapshot?.governanceStatus === "stable" ||
    governanceSnapshot?.integrityLevel === "strong" ||
    governanceSnapshot?.integrityLevel === "verified";

  if (!coherenceStable && !governanceStable) return null;

  return createTrustObservation(
    "governance_coherence_verified",
    "verified",
    "strong",
    "governance_coherence",
    "Governance coherence remains stable across institutional alignment and learning governance pathways — cognition alignment continuity verified.",
    ["verified_governance_coherence", "governance_continuity", "institutional_alignment"],
    [],
    0.88,
    now
  );
}

function buildExecutiveGradeIntegrity(
  observations: ExecutiveTrustObservation[],
  activeLayers: number,
  now: number
): ExecutiveTrustObservation | null {
  const coherent = observations.filter(
    (o) => o.consistencyState === "coherent" || o.consistencyState === "verified"
  ).length;
  if (coherent < 2 || activeLayers < 4) return null;

  return createTrustObservation(
    "executive_grade_integrity",
    "verified",
    "executive_grade",
    "cognition_alignment",
    "Multiple enterprise cognition runtimes support the same strategic conclusion with verified governance coherence and stable orchestration reasoning.",
    [
      "cross_runtime_alignment",
      "stable_orchestration",
      "verified_governance_coherence",
      "confidence_evidence_alignment",
    ],
    [],
    0.92,
    now
  );
}

function buildForesightOrchestrationConflict(
  foresightSnapshot: StrategicReasoningIntegrityInput["foresightSnapshot"],
  decisionSnapshot: StrategicReasoningIntegrityInput["decisionSnapshot"],
  now: number
): ExecutiveTrustObservation | null {
  const escalationRisk =
    foresightSnapshot?.summary.dominantRisk.includes("escalation") ||
    foresightSnapshot?.summary.earlyWarningState === "intensifying";
  const growthOrchestration =
    decisionSnapshot?.summary.orchestrationState === "adaptive" &&
    (decisionSnapshot.summary.dominantPriority.includes("growth") ||
      decisionSnapshot.summary.dominantPriority.includes("speed"));

  if (!escalationRisk || !growthOrchestration) return null;

  return createTrustObservation(
    "foresight_orchestration_conflict",
    "contradictory",
    "weak",
    "orchestration_integrity",
    "Foresight predicts escalation risk while decision orchestration prioritizes growth acceleration — cross-runtime inconsistency risk.",
    ["foresight_escalation_signal"],
    ["inconsistency_risk", "orchestration_conflict", "executive_caution_required"],
    0.64,
    now
  );
}

function buildConsistencySignal(
  observation: ExecutiveTrustObservation,
  now: number
): CognitiveConsistencySignal {
  return {
    signalId: stableSignature(["consistency-signal", observation.integrityId]).slice(0, 48),
    signalLabel: observation.verificationCategory.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.verificationCategory]),
    signalStrength:
      observation.integrityStrength === "executive_grade" ||
      observation.integrityStrength === "strong"
        ? "high"
        : observation.integrityStrength === "stable"
          ? "moderate"
          : "low",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildContradictionIndicator(
  observation: ExecutiveTrustObservation,
  now: number
): EnterpriseContradictionIndicator | null {
  if (
    observation.consistencyState !== "contradictory" &&
    observation.consistencyState !== "fragmented"
  ) {
    return null;
  }
  return {
    indicatorId: stableSignature(["contradiction", observation.integrityId]).slice(0, 48),
    indicatorLabel: observation.integrityRisks[0] ?? "cognitive_contradiction",
    indicatorSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.verificationCategory]),
    contradictionSeverity:
      observation.consistencyState === "contradictory" ? "high" : "moderate",
    generatedAt: now,
  };
}

function buildCrossRuntimeAlignment(
  observation: ExecutiveTrustObservation,
  source: string,
  target: string,
  now: number
): CrossRuntimeAlignment | null {
  if (!observation.consistencySignals.includes("cross_runtime_alignment")) return null;
  return {
    alignmentId: stableSignature([
      "cross-runtime-alignment",
      source,
      target,
      observation.integrityId,
    ]).slice(0, 48),
    sourceRuntime: source,
    targetRuntime: target,
    alignmentSummary: observation.summary.slice(0, 80),
    alignmentStrength: observation.integrityStrength,
    generatedAt: now,
  };
}

function buildIntegritySnapshot(
  organizationId: string,
  observations: ExecutiveTrustObservation[],
  signals: CognitiveConsistencySignal[],
  contradictions: EnterpriseContradictionIndicator[],
  alignments: CrossRuntimeAlignment[],
  now: number
): StrategicReasoningIntegritySnapshot {
  const top = observations[0];
  const awarenessSummary: IntegrityVerificationSummary = top
    ? {
        dominantConsistencyState: top.consistencyState,
        dominantIntegrityStrength: top.integrityStrength,
        verificationHeadline: top.summary,
        trustPosture:
          top.integrityStrength === "executive_grade" && top.consistencyState === "verified"
            ? "executive_grade"
            : top.consistencyState === "contradictory" || top.consistencyState === "fragmented"
              ? "low"
              : top.integrityStrength === "strong"
                ? "high"
                : "moderate",
      }
    : {
        dominantConsistencyState: "fragmented",
        dominantIntegrityStrength: "weak",
        verificationHeadline:
          "Reasoning integrity verification awaiting sufficient enterprise cognition depth.",
        trustPosture: "low",
      };

  const signature = stableSignature([
    "d9-6-2-reasoning-integrity-snapshot",
    organizationId,
    observations.map((o) => o.integrityId),
    awarenessSummary.trustPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    verificationCount: observations.length,
    awarenessSummary,
    recentTrustObservations: Object.freeze(observations.slice(0, 6)),
    consistencySignals: Object.freeze(signals.slice(0, 6)),
    contradictionIndicators: Object.freeze(contradictions.slice(0, 6)),
    crossRuntimeAlignments: Object.freeze(alignments.slice(0, 6)),
  };
}

export function evaluateStrategicReasoningIntegrity(
  input: StrategicReasoningIntegrityInput
): StrategicReasoningIntegrityResult {
  if (!beginReasoningIntegrityEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newTrustObservations: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getReasoningIntegrityStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-6-2-reasoning-integrity-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.memorySnapshot?.signature ?? "no-memory",
      input.temporalSnapshot?.signature ?? "no-temporal",
      input.foresightSnapshot?.signature ?? "no-foresight",
      input.decisionSnapshot?.signature ?? "no-decision",
      input.metaCognitionSnapshot?.signature ?? "no-meta-cognition",
      input.confidenceSnapshot?.signature ?? "no-confidence",
      input.governanceCoherenceSnapshot?.signature ?? "no-governance-coherence",
      input.governanceSnapshot?.signature ?? "no-governance",
      input.sequencingSnapshot?.signature ?? "no-sequencing",
    ]);

    if (
      !shouldEvaluateReasoningIntegrity(
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
        newTrustObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const metaDepth = input.metaCognitionSnapshot?.observationCount ?? 0;

    if (activeLayers < REASONING_INTEGRITY_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_verification_depth",
        snapshot: prior.snapshots[0] ?? null,
        newTrustObservations: 0,
        storeSignature: prior.signature,
      };
    }

    if (metaDepth < REASONING_INTEGRITY_MIN_META_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_meta_cognition_depth",
        snapshot: prior.snapshots[0] ?? null,
        newTrustObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: ExecutiveTrustObservation[] = [];

    const foresightConsistency = buildForesightOrchestrationConsistency(
      input.foresightSnapshot,
      input.decisionSnapshot,
      now
    );
    if (foresightConsistency) candidates.push(foresightConsistency);

    const confidenceMismatch = buildConfidenceEvidenceMismatch(
      input.confidenceSnapshot,
      input.governanceSnapshot,
      input.metaCognitionSnapshot,
      now
    );
    if (confidenceMismatch) candidates.push(confidenceMismatch);

    const memoryConflict = buildMemoryRecommendationConflict(
      input.memorySnapshot,
      input.decisionSnapshot,
      input.foresightSnapshot,
      now
    );
    if (memoryConflict) candidates.push(memoryConflict);

    const sequencingInstability = buildSequencingInstabilitySignal(
      input.sequencingSnapshot,
      now
    );
    if (sequencingInstability) candidates.push(sequencingInstability);

    const governanceVerified = buildGovernanceCoherenceVerification(
      input.governanceCoherenceSnapshot,
      input.governanceSnapshot,
      now
    );
    if (governanceVerified) candidates.push(governanceVerified);

    const foresightConflict = buildForesightOrchestrationConflict(
      input.foresightSnapshot,
      input.decisionSnapshot,
      now
    );
    if (foresightConflict) candidates.push(foresightConflict);

    const executiveGrade = buildExecutiveGradeIntegrity(candidates, activeLayers, now);
    if (executiveGrade) candidates.push(executiveGrade);

    const retained = candidates
      .filter(shouldRetainExecutiveTrustObservation)
      .sort(
        (a, b) =>
          consistencyStateRank(b.consistencyState) - consistencyStateRank(a.consistencyState) ||
          integrityStrengthRank(b.integrityStrength) - integrityStrengthRank(a.integrityStrength) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_verifications",
        snapshot: prior.snapshots[0] ?? null,
        newTrustObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.trustObservations.map((o) => o.integrityId));
    const newCount = retained.filter((o) => !priorIds.has(o.integrityId)).length;

    const signals = retained.map((o) => buildConsistencySignal(o, now));
    const contradictions = retained
      .map((o) => buildContradictionIndicator(o, now))
      .filter((i): i is EnterpriseContradictionIndicator => i !== null);
    const alignments = retained
      .flatMap((o) => [
        buildCrossRuntimeAlignment(o, "foresight", "decision", now),
        buildCrossRuntimeAlignment(o, "institutional_memory", "orchestration", now),
      ])
      .filter((a): a is CrossRuntimeAlignment => a !== null);

    store.upsertTrustObservations(retained, now);
    store.upsertConsistencySignals(signals, now);
    store.upsertContradictionIndicators(contradictions, now);
    store.upsertCrossRuntimeAlignments(alignments, now);

    const snapshot = buildIntegritySnapshot(
      organizationId,
      retained,
      signals,
      contradictions,
      alignments,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();
    const priorTrust = prior.snapshots[0]?.awarenessSummary.trustPosture;

    if (foresightConflict || memoryConflict || contradictions.length > 0) {
      devLog("major contradiction detection — cognitive consistency verification active");
    }

    if (confidenceMismatch) {
      devLog("confidence/evidence mismatch — trust warning emitted");
    }

    if (executiveGrade) {
      devLog("executive-grade consistency formation — cross-runtime integrity verified");
    }

    if (
      priorTrust &&
      priorTrust !== snapshot.awarenessSummary.trustPosture &&
      (snapshot.awarenessSummary.trustPosture === "low" ||
        priorTrust === "low" ||
        snapshot.awarenessSummary.trustPosture === "executive_grade")
    ) {
      devLog(
        `integrity posture shift — ${priorTrust} → ${snapshot.awarenessSummary.trustPosture}`
      );
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newTrustObservations: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endReasoningIntegrityEvaluation();
  }
}
