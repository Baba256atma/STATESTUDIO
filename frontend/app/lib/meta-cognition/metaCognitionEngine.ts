import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginMetaCognitionEvaluation,
  clampMetaCognitionConfidence,
  cognitionHealthRank,
  endMetaCognitionEvaluation,
  integrityStateRank,
  META_COGNITION_MIN_UNIFIED_LAYERS,
  shouldEvaluateMetaCognition,
  shouldRetainReasoningIntegrityObservation,
} from "./metaCognitionGuards";
import { getMetaCognitionStore } from "./metaCognitionStore";
import type {
  CognitionCategory,
  CognitionHealth,
  CognitionQualitySignal,
  ExecutiveMetaCognitionInput,
  ExecutiveMetaCognitionResult,
  IntegrityState,
  MetaCognitionAwarenessSummary,
  MetaCognitiveRisk,
  MetaCognitionRuntimeSnapshot,
  ReasoningIntegrityObservation,
  SelfReflectionSummary,
  StrategicCognitionHealth,
} from "./metaCognitionTypes";

const DEV_LOG_PREFIX = "[Nexora][MetaCognition]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildMetaCognitionId(label: string): string {
  return stableSignature(["meta-cognition", label]).slice(0, 56);
}

function createObservation(
  label: string,
  cognitionHealth: CognitionHealth,
  integrityState: IntegrityState,
  category: CognitionCategory,
  summary: string,
  qualitySignals: string[],
  risks: string[],
  confidence: number,
  now: number
): ReasoningIntegrityObservation {
  return {
    metaCognitionId: buildMetaCognitionId(label),
    cognitionHealth,
    integrityState,
    cognitionCategory: category,
    summary,
    qualitySignals: Object.freeze(qualitySignals),
    risks: Object.freeze(risks),
    confidence: clampMetaCognitionConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function countActiveUnifiedLayers(input: ExecutiveMetaCognitionInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.temporalSnapshot && input.temporalSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function buildCrossLayerAlignmentObservation(
  foresightSnapshot: ExecutiveMetaCognitionInput["foresightSnapshot"],
  decisionSnapshot: ExecutiveMetaCognitionInput["decisionSnapshot"],
  memorySnapshot: ExecutiveMetaCognitionInput["memorySnapshot"],
  now: number
): ReasoningIntegrityObservation | null {
  const foresightOk =
    foresightSnapshot?.runtimeStatus === "stable" ||
    foresightSnapshot?.runtimeStatus === "recovering" ||
    foresightSnapshot?.foresightHealth === "strong" ||
    foresightSnapshot?.foresightHealth === "executive_grade";
  const decisionOk =
    decisionSnapshot?.runtimeStatus === "stable" ||
    decisionSnapshot?.runtimeStatus === "recovering" ||
    decisionSnapshot?.orchestrationHealth === "strong" ||
    decisionSnapshot?.orchestrationHealth === "executive_grade";
  const memoryAligned =
    memorySnapshot?.runtimeStatus === "stable" ||
    memorySnapshot?.runtimeStatus === "recovering" ||
    memorySnapshot?.institutionalHealth === "strong" ||
    memorySnapshot?.institutionalHealth === "verified";

  if (!foresightOk || !decisionOk) return null;

  return createObservation(
    "cross_layer_alignment_reliability",
    memoryAligned ? "strong" : "stable",
    "coherent",
    "decision_orchestration",
    "Nexora's current strategic reasoning remains coherent across foresight, institutional memory, and decision orchestration, with minor uncertainty in coordination visibility.",
    ["cross_layer_alignment", "foresight_decision_agreement", memoryAligned ? "memory_support" : "memory_forming"],
    memoryAligned ? ["partial_coordination_visibility"] : ["memory_alignment_pending"],
    memoryAligned ? 0.87 : 0.82,
    now
  );
}

function buildOverconfidenceWarning(
  confidenceSnapshot: ExecutiveMetaCognitionInput["confidenceSnapshot"],
  governanceSnapshot: ExecutiveMetaCognitionInput["governanceSnapshot"],
  now: number
): ReasoningIntegrityObservation | null {
  const highConfidence = confidenceSnapshot?.recentExecutiveConfidences.some(
    (c) => c.confidenceLevel === "strong" || c.confidenceLevel === "executive_grade"
  );
  const weakEvidence =
    governanceSnapshot?.integrityLevel === "weak" ||
    governanceSnapshot?.integrityLevel === "moderate" ||
    confidenceSnapshot?.coordinationSummary.certaintyPosture === "low";

  if (!highConfidence || !weakEvidence) return null;

  return createObservation(
    "overconfidence_evidence_mismatch",
    "monitored",
    "uncertain",
    "confidence",
    "Confidence signals appear elevated while underlying governance evidence and certainty posture remain limited — executive caution is advised before trusting outputs.",
    ["confidence_arbitration_active"],
    ["overconfidence_warning", "weak_evidence_alignment", "human_review_recommended"],
    0.68,
    now
  );
}

function buildTemporalAdvisoryInconsistency(
  temporalSnapshot: ExecutiveMetaCognitionInput["temporalSnapshot"],
  foresightSnapshot: ExecutiveMetaCognitionInput["foresightSnapshot"],
  advisoryLine: string,
  now: number
): ReasoningIntegrityObservation | null {
  const temporalStressed =
    temporalSnapshot?.runtimeStatus === "degraded" || temporalSnapshot?.runtimeStatus === "unstable";
  const foresightRecommendsStabilization =
    foresightSnapshot?.summary.recommendedFocus.includes("stabilization") ||
    foresightSnapshot?.summary.recommendedFocus.includes("pressure reduction");
  const advisoryAccelerating =
    advisoryLine.includes("accelerat") || advisoryLine.includes("expansion");

  if (!temporalStressed || !advisoryAccelerating || foresightRecommendsStabilization) return null;

  return createObservation(
    "temporal_advisory_inconsistency",
    "monitored",
    "fragmented",
    "temporal_cognition",
    "Temporal cognition signals stress while advisory direction suggests acceleration — cross-layer reasoning inconsistency detected.",
    ["temporal_pressure_detected"],
    ["reasoning_inconsistency", "advisory_temporal_conflict"],
    0.71,
    now
  );
}

function buildMemorySupportIntegrity(
  memorySnapshot: ExecutiveMetaCognitionInput["memorySnapshot"],
  decisionSnapshot: ExecutiveMetaCognitionInput["decisionSnapshot"],
  now: number
): ReasoningIntegrityObservation | null {
  const memoryStrong =
    memorySnapshot?.institutionalHealth === "strong" ||
    memorySnapshot?.institutionalHealth === "verified";
  const decisionCoherent =
    decisionSnapshot?.summary.institutionalAlignment === "coherent" ||
    decisionSnapshot?.summary.institutionalAlignment === "aligning";

  if (!memoryStrong || !decisionCoherent) return null;

  return createObservation(
    "institutional_memory_support",
    "strong",
    "reliable",
    "institutional_memory",
    "Institutional memory supports the current strategic recommendation trajectory and reinforces decision-orchestration coherence.",
    ["memory_support", "stable_advisory_direction", "institutional_alignment"],
    [],
    0.86,
    now
  );
}

function buildAdvisoryDriftWarning(
  cognitionSnapshot: ExecutiveMetaCognitionInput["cognitionSnapshot"],
  now: number
): ReasoningIntegrityObservation | null {
  const evolutionLine = cognitionSnapshot?.timelineStrategicEvolutionLine ?? "";
  const learningLine = cognitionSnapshot?.organizationalLearningLine ?? "";
  const driftSignals =
    (evolutionLine.includes("shift") || evolutionLine.includes("change")) &&
    (learningLine.includes("strain") || learningLine.includes("recurrence"));

  if (!driftSignals) return null;

  return createObservation(
    "unstable_advisory_drift",
    "monitored",
    "fragmented",
    "enterprise_cognition",
    "Frequent strategic evolution and recurring organizational strain suggest unstable advisory drift — outputs may shift before stabilization.",
    ["pattern_recurrence_detected"],
    ["unstable_advisory_drift", "recommendation_volatility"],
    0.7,
    now
  );
}

function buildFragmentedCognitionObservation(
  foresightSnapshot: ExecutiveMetaCognitionInput["foresightSnapshot"],
  temporalSnapshot: ExecutiveMetaCognitionInput["temporalSnapshot"],
  decisionSnapshot: ExecutiveMetaCognitionInput["decisionSnapshot"],
  confidenceSnapshot: ExecutiveMetaCognitionInput["confidenceSnapshot"],
  now: number
): ReasoningIntegrityObservation | null {
  const statuses = [
    foresightSnapshot?.runtimeStatus,
    temporalSnapshot?.runtimeStatus,
    decisionSnapshot?.runtimeStatus,
  ].filter(Boolean);
  const degraded = statuses.filter((s) => s === "degraded" || s === "unstable").length;
  const fragmentedConfidence =
    confidenceSnapshot?.coordinationSummary.dominantCertaintyState === "fragmented" ||
    confidenceSnapshot?.coordinationSummary.dominantCertaintyState === "uncertain";

  if (degraded < 2 && !fragmentedConfidence) return null;

  return createObservation(
    "fragmented_cognition_state",
    "weak",
    "fragmented",
    "enterprise_cognition",
    "Multiple cognition subsystems present contradictory or degraded states — strategic reasoning integrity is fragmented until alignment improves.",
    ["subsystem_visibility"],
    ["cross_layer_contradiction", "degraded_runtime_states", "executive_caution_required"],
    0.62,
    now
  );
}

function buildExecutiveGradeCoherence(
  observations: ReasoningIntegrityObservation[],
  now: number
): ReasoningIntegrityObservation | null {
  const aligned = observations.filter(
    (o) => o.integrityState === "coherent" || o.integrityState === "reliable"
  ).length;
  if (aligned < 2) return null;

  return createObservation(
    "executive_grade_coherence",
    "executive_grade",
    "verified",
    "governance",
    "Cross-layer cognition alignment, memory support, and stable advisory direction collectively indicate executive-grade reasoning coherence.",
    ["cross_layer_alignment", "stable_advisory_direction", "governance_coherence"],
    [],
    0.91,
    now
  );
}

function buildQualitySignal(
  observation: ReasoningIntegrityObservation,
  now: number
): CognitionQualitySignal {
  return {
    signalId: stableSignature(["cognition-quality", observation.metaCognitionId]).slice(0, 48),
    signalLabel: observation.cognitionCategory.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.cognitionCategory]),
    signalStrength:
      observation.cognitionHealth === "executive_grade" || observation.cognitionHealth === "strong"
        ? "high"
        : observation.cognitionHealth === "stable"
          ? "moderate"
          : "low",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildRisk(observation: ReasoningIntegrityObservation, now: number): MetaCognitiveRisk | null {
  if (observation.risks.length === 0) return null;
  return {
    riskId: stableSignature(["meta-cognitive-risk", observation.metaCognitionId]).slice(0, 48),
    riskLabel: observation.risks[0]!,
    riskSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.cognitionCategory]),
    riskSeverity: observation.risks.includes("overconfidence_warning")
      ? "high"
      : observation.integrityState === "fragmented"
        ? "moderate"
        : "low",
    generatedAt: now,
  };
}

function buildStrategicCognitionHealth(
  observations: ReasoningIntegrityObservation[],
  activeLayers: number,
  now: number
): StrategicCognitionHealth {
  const top = observations[0];
  return {
    healthId: stableSignature(["strategic-cognition-health", top?.metaCognitionId ?? "none"]).slice(
      0,
      48
    ),
    cognitionHealth: top?.cognitionHealth ?? "weak",
    integrityState: top?.integrityState ?? "uncertain",
    healthSummary:
      top?.summary ??
      "Meta-cognition awaiting sufficient unified enterprise cognition depth for self-reflective evaluation.",
    crossLayerAlignment:
      activeLayers >= 4 && top?.integrityState === "coherent"
        ? "executive_grade"
        : activeLayers >= 3
          ? "high"
          : "moderate",
    confidenceReliability:
      observations.some((o) => o.risks.includes("overconfidence_warning"))
        ? "low"
        : top?.cognitionHealth === "strong" || top?.cognitionHealth === "executive_grade"
          ? "high"
          : "moderate",
    generatedAt: now,
  };
}

function buildSelfReflection(
  observations: ReasoningIntegrityObservation[],
  now: number
): SelfReflectionSummary {
  const hasRisk = observations.some((o) => o.risks.length > 0);
  const top = observations[0];
  return {
    summaryId: stableSignature(["self-reflection", top?.metaCognitionId ?? "pending"]).slice(0, 48),
    reflectionHeadline:
      top?.summary ??
      "Nexora is establishing self-reflective cognition awareness across enterprise intelligence layers.",
    reflectionSubline: hasRisk
      ? "Executive caution recommended before high-confidence operational decisions."
      : "Current cognition outputs appear internally coherent with bounded uncertainty.",
    cautionLevel: hasRisk
      ? observations.some((o) => o.risks.includes("overconfidence_warning"))
        ? "elevated"
        : "moderate"
      : "low",
    generatedAt: now,
  };
}

function buildMetaCognitionRuntimeSnapshot(
  organizationId: string,
  observations: ReasoningIntegrityObservation[],
  signals: CognitionQualitySignal[],
  risks: MetaCognitiveRisk[],
  health: StrategicCognitionHealth,
  reflections: SelfReflectionSummary[],
  now: number
): MetaCognitionRuntimeSnapshot {
  const top = observations[0];
  const awarenessSummary: MetaCognitionAwarenessSummary = top
    ? {
        dominantCognitionHealth: top.cognitionHealth,
        dominantIntegrityState: top.integrityState,
        metaCognitionHeadline: top.summary,
        reflectionPosture:
          top.cognitionHealth === "executive_grade"
            ? "executive_grade"
            : top.cognitionHealth === "weak" || top.integrityState === "fragmented"
              ? "low"
              : top.cognitionHealth === "strong"
                ? "high"
                : "moderate",
      }
    : {
        dominantCognitionHealth: "weak",
        dominantIntegrityState: "uncertain",
        metaCognitionHeadline:
          "Meta-cognition awaiting unified enterprise cognition layers for self-reflective evaluation.",
        reflectionPosture: "low",
      };

  const signature = stableSignature([
    "d9-6-1-meta-cognition-snapshot",
    organizationId,
    observations.map((o) => o.metaCognitionId),
    awarenessSummary.dominantCognitionHealth,
    awarenessSummary.dominantIntegrityState,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    awarenessSummary,
    recentIntegrityObservations: Object.freeze(observations.slice(0, 6)),
    cognitionQualitySignals: Object.freeze(signals.slice(0, 6)),
    metaCognitiveRisks: Object.freeze(risks.slice(0, 6)),
    strategicCognitionHealth: health,
    selfReflectionSummaries: Object.freeze(reflections.slice(0, 4)),
  };
}

export function evaluateExecutiveMetaCognition(
  input: ExecutiveMetaCognitionInput
): ExecutiveMetaCognitionResult {
  if (!beginMetaCognitionEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newIntegrityObservations: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getMetaCognitionStore(organizationId);
    const prior = store.getState();

    const memorySnapshot = input.memorySnapshot ?? null;
    const temporalSnapshot = input.temporalSnapshot ?? null;
    const foresightSnapshot = input.foresightSnapshot ?? null;
    const decisionSnapshot = input.decisionSnapshot ?? null;
    const confidenceSnapshot = input.confidenceSnapshot ?? null;
    const governanceSnapshot = input.governanceSnapshot ?? null;

    const evaluationSignature = stableSignature([
      "d9-6-1-meta-cognition-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      memorySnapshot?.signature ?? "no-memory",
      temporalSnapshot?.signature ?? "no-temporal",
      foresightSnapshot?.signature ?? "no-foresight",
      decisionSnapshot?.signature ?? "no-decision",
      confidenceSnapshot?.signature ?? "no-confidence",
      governanceSnapshot?.signature ?? "no-governance",
    ]);

    if (
      !shouldEvaluateMetaCognition(
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
        newIntegrityObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    if (activeLayers < META_COGNITION_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_cognition_depth",
        snapshot: prior.snapshots[0] ?? null,
        newIntegrityObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const advisoryLine =
      input.advisoryLine ??
      input.foresightSnapshot?.summary.recommendedFocus ??
      input.cognitionSnapshot?.timelineStrategicEvolutionLine ??
      "";

    const candidates: ReasoningIntegrityObservation[] = [];

    const crossLayer = buildCrossLayerAlignmentObservation(
      foresightSnapshot,
      decisionSnapshot,
      memorySnapshot,
      now
    );
    if (crossLayer) candidates.push(crossLayer);

    const overconfidence = buildOverconfidenceWarning(confidenceSnapshot, governanceSnapshot, now);
    if (overconfidence) candidates.push(overconfidence);

    const temporalConflict = buildTemporalAdvisoryInconsistency(
      temporalSnapshot,
      foresightSnapshot,
      advisoryLine,
      now
    );
    if (temporalConflict) candidates.push(temporalConflict);

    const memorySupport = buildMemorySupportIntegrity(memorySnapshot, decisionSnapshot, now);
    if (memorySupport) candidates.push(memorySupport);

    const advisoryDrift = buildAdvisoryDriftWarning(input.cognitionSnapshot ?? null, now);
    if (advisoryDrift) candidates.push(advisoryDrift);

    const fragmented = buildFragmentedCognitionObservation(
      foresightSnapshot,
      temporalSnapshot,
      decisionSnapshot,
      confidenceSnapshot,
      now
    );
    if (fragmented) candidates.push(fragmented);

    const executiveGrade = buildExecutiveGradeCoherence(candidates, now);
    if (executiveGrade) candidates.push(executiveGrade);

    const retained = candidates
      .filter(shouldRetainReasoningIntegrityObservation)
      .sort(
        (a, b) =>
          cognitionHealthRank(b.cognitionHealth) - cognitionHealthRank(a.cognitionHealth) ||
          integrityStateRank(b.integrityState) - integrityStateRank(a.integrityState) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_observations",
        snapshot: prior.snapshots[0] ?? null,
        newIntegrityObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.integrityObservations.map((o) => o.metaCognitionId));
    const newCount = retained.filter((o) => !priorIds.has(o.metaCognitionId)).length;

    const signals = retained.map((o) => buildQualitySignal(o, now));
    const risks = retained
      .map((o) => buildRisk(o, now))
      .filter((r): r is MetaCognitiveRisk => r !== null);
    const health = buildStrategicCognitionHealth(retained, activeLayers, now);
    const reflections = [buildSelfReflection(retained, now)];

    store.upsertIntegrityObservations(retained, now);
    store.upsertCognitionQualitySignals(signals, now);
    store.upsertMetaCognitiveRisks(risks, now);
    store.upsertStrategicCognitionHealthRecords([health], now);
    store.upsertSelfReflectionSummaries(reflections, now);

    const snapshot = buildMetaCognitionRuntimeSnapshot(
      organizationId,
      retained,
      signals,
      risks,
      health,
      reflections,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();
    const priorHealth = prior.snapshots[0]?.awarenessSummary.dominantCognitionHealth;

    if (priorHealth && priorHealth !== snapshot.awarenessSummary.dominantCognitionHealth) {
      devLog(
        `cognition health — ${priorHealth} → ${snapshot.awarenessSummary.dominantCognitionHealth}`
      );
    }

    if (overconfidence || temporalConflict || fragmented) {
      devLog("major inconsistency detection — self-reflective caution signals active");
    }

    if (overconfidence) {
      devLog("overconfidence warning — confidence exceeds evidence alignment");
    }

    if (executiveGrade) {
      devLog("executive-grade coherence formation — cross-layer cognition alignment strong");
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newIntegrityObservations: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endMetaCognitionEvaluation();
  }
}
