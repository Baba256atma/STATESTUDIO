import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginCognitiveDriftEvaluation,
  clampDriftConfidence,
  COGNITIVE_DRIFT_MIN_INTEGRITY_DEPTH,
  COGNITIVE_DRIFT_MIN_UNIFIED_LAYERS,
  driftSeverityRank,
  endCognitiveDriftEvaluation,
  shouldEvaluateCognitiveDrift,
  shouldRetainStrategicReasoningStability,
  stabilityStateRank,
} from "./cognitiveDriftGuards";
import { getCognitiveDriftStore } from "./cognitiveDriftStore";
import type {
  CognitiveVolatilityIndicator,
  DriftAwarenessSummary,
  DriftCategory,
  DriftSeverity,
  EnterpriseDriftSignal,
  ExecutiveCognitiveDriftInput,
  ExecutiveCognitiveDriftResult,
  ExecutiveCognitiveDriftSnapshot,
  LongHorizonConsistencyField,
  StabilityState,
  StrategicReasoningStability,
} from "./cognitiveDriftTypes";

const DEV_LOG_PREFIX = "[Nexora][CognitiveDrift]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildDriftId(label: string): string {
  return stableSignature(["cognitive-drift", label]).slice(0, 56);
}

function createReasoningStability(
  label: string,
  stabilityState: StabilityState,
  driftSeverity: DriftSeverity,
  driftCategory: DriftCategory,
  summary: string,
  stabilitySignals: string[],
  driftRisks: string[],
  confidence: number,
  now: number
): StrategicReasoningStability {
  return {
    driftId: buildDriftId(label),
    stabilityState,
    driftSeverity,
    driftCategory,
    summary,
    stabilitySignals: Object.freeze(stabilitySignals),
    driftRisks: Object.freeze(driftRisks),
    confidence: clampDriftConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function countActiveUnifiedLayers(input: ExecutiveCognitiveDriftInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.temporalSnapshot && input.temporalSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function buildEnterpriseReasoningStability(
  integritySnapshot: ExecutiveCognitiveDriftInput["reasoningIntegritySnapshot"],
  activeLayers: number,
  now: number
): StrategicReasoningStability | null {
  const trustPosture = integritySnapshot?.awarenessSummary.trustPosture;
  const consistency = integritySnapshot?.awarenessSummary.dominantConsistencyState;
  const strength = integritySnapshot?.awarenessSummary.dominantIntegrityStrength;

  if (!integritySnapshot || integritySnapshot.verificationCount < 1) return null;

  if (
    (consistency === "coherent" || consistency === "verified") &&
    (strength === "strong" || strength === "executive_grade") &&
    activeLayers >= 4
  ) {
    return createReasoningStability(
      "enterprise_reasoning_stability",
      "stable",
      "low",
      "unknown",
      "Enterprise cognition remains largely stable across foresight, orchestration, and governance alignment, with durable strategic coherence across executive cognition layers.",
      [
        "long_horizon_alignment",
        "stable_governance_coherence",
        "consistent_orchestration_patterns",
      ],
      [],
      0.9,
      now
    );
  }

  if (trustPosture === "executive_grade" || trustPosture === "high") {
    return createReasoningStability(
      "enterprise_reasoning_stability",
      "adaptive",
      "monitored",
      "unknown",
      "Enterprise cognition remains largely stable across foresight, orchestration, and governance alignment, with moderate advisory volatility emerging in coordination-related recommendations.",
      [
        "long_horizon_alignment",
        "stable_governance_coherence",
        "consistent_orchestration_patterns",
      ],
      ["coordination_advisory_variability"],
      0.88,
      now
    );
  }

  return null;
}

function buildConfidenceDrift(
  input: ExecutiveCognitiveDriftInput,
  now: number
): StrategicReasoningStability | null {
  const mismatch = input.reasoningIntegritySnapshot?.recentTrustObservations.some((o) =>
    o.integrityRisks.includes("confidence_evidence_mismatch")
  );
  const highConfidence = input.confidenceSnapshot?.recentExecutiveConfidences.some(
    (c) => c.confidenceLevel === "strong" || c.confidenceLevel === "executive_grade"
  );
  const weakEvidence =
    input.governanceSnapshot?.integrityLevel === "weak" ||
    input.governanceSnapshot?.integrityLevel === "moderate" ||
    input.confidenceSnapshot?.coordinationSummary.certaintyPosture === "low";

  if (!mismatch && !(highConfidence && weakEvidence)) return null;

  return createReasoningStability(
    "confidence_drift",
    "fluctuating",
    "elevated",
    "confidence_drift",
    "Confidence arbitration signals are rising while institutional evidence weakens — strategic overconfidence drift detected.",
    ["confidence_arbitration_active"],
    ["confidence_evidence_divergence", "strategic_overconfidence_drift"],
    0.72,
    now
  );
}

function buildOrchestrationDrift(
  sequencingSnapshot: ExecutiveCognitiveDriftInput["sequencingSnapshot"],
  integritySnapshot: ExecutiveCognitiveDriftInput["reasoningIntegritySnapshot"],
  now: number
): StrategicReasoningStability | null {
  const sequencingUnstable =
    sequencingSnapshot?.awarenessSummary.dominantSequencingState === "evolving" ||
    sequencingSnapshot?.awarenessSummary.dominantSequencingState === "unstable";
  const integrityInstability = integritySnapshot?.recentTrustObservations.some((o) =>
    o.integrityRisks.includes("orchestration_instability")
  );

  if (!sequencingUnstable && !integrityInstability) return null;

  return createReasoningStability(
    "orchestration_drift",
    "fluctuating",
    "elevated",
    "orchestration_drift",
    "Adaptive sequencing is changing frequently across orchestration pathways — orchestration drift and sequencing volatility detected.",
    ["adaptive_sequencing_active"],
    ["sequencing_instability", "orchestration_volatility"],
    0.74,
    now
  );
}

function buildForesightDrift(
  input: ExecutiveCognitiveDriftInput,
  now: number
): StrategicReasoningStability | null {
  const foresightConflict = input.reasoningIntegritySnapshot?.recentTrustObservations.some(
    (o) =>
      o.integrityRisks.includes("inconsistency_risk") ||
      o.integrityRisks.includes("orchestration_conflict")
  );
  const foresightEscalation =
    input.foresightSnapshot?.summary.dominantRisk.includes("escalation") ||
    input.foresightSnapshot?.summary.earlyWarningState === "intensifying";
  const growthOrchestration =
    input.decisionSnapshot?.summary.dominantPriority.includes("growth") ||
    input.decisionSnapshot?.summary.dominantPriority.includes("acceleration");

  if (!foresightConflict && !(foresightEscalation && growthOrchestration)) return null;

  return createReasoningStability(
    "foresight_drift",
    "degrading",
    "unstable",
    "foresight_drift",
    "Foresight and decision orchestration are diverging repeatedly — strategic fragmentation and cognition coherence degradation emerging.",
    ["foresight_escalation_signal"],
    ["strategic_fragmentation", "foresight_orchestration_divergence"],
    0.68,
    now
  );
}

function buildAdvisoryInstability(
  metaCognitionSnapshot: ExecutiveCognitiveDriftInput["metaCognitionSnapshot"],
  now: number
): StrategicReasoningStability | null {
  const advisoryRisks =
    metaCognitionSnapshot?.metaCognitiveRisks.filter(
      (r) =>
        r.riskLabel.includes("advisory") ||
        r.riskLabel.includes("coordination") ||
        r.riskLabel.includes("volatility")
    ) ?? [];

  if (advisoryRisks.length < 1) return null;

  return createReasoningStability(
    "advisory_instability",
    "fluctuating",
    "monitored",
    "advisory_instability",
    "Advisory recommendations show increasing variability across similar strategic conditions — reasoning volatility under monitoring.",
    ["meta_cognitive_monitoring"],
    ["coordination_advisory_variability", "recommendation_volatility"],
    0.7,
    now
  );
}

function buildGovernanceInconsistencyDrift(
  governanceCoherenceSnapshot: ExecutiveCognitiveDriftInput["governanceCoherenceSnapshot"],
  governanceSnapshot: ExecutiveCognitiveDriftInput["governanceSnapshot"],
  now: number
): StrategicReasoningStability | null {
  const coherenceWeak =
    governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "low" ||
    governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "moderate";
  const governanceDegraded =
    governanceSnapshot?.governanceStatus === "degraded" ||
    governanceSnapshot?.integrityLevel === "weak";

  if (!coherenceWeak && !governanceDegraded) return null;

  return createReasoningStability(
    "governance_inconsistency",
    "degrading",
    "elevated",
    "governance_inconsistency",
    "Governance coherence is weakening gradually across institutional alignment pathways — institutional drift warning.",
    ["governance_monitoring"],
    ["governance_coherence_degradation", "institutional_drift_warning"],
    0.71,
    now
  );
}

function buildContradictionAmplification(
  integritySnapshot: ExecutiveCognitiveDriftInput["reasoningIntegritySnapshot"],
  now: number
): StrategicReasoningStability | null {
  const contradictions = integritySnapshot?.contradictionIndicators.length ?? 0;
  const contradictoryObs = integritySnapshot?.recentTrustObservations.filter(
    (o) => o.consistencyState === "contradictory" || o.consistencyState === "fragmented"
  ).length ?? 0;

  if (contradictions < 1 && contradictoryObs < 2) return null;

  return createReasoningStability(
    "contradiction_amplification",
    "fragmented",
    contradictoryObs >= 2 ? "critical" : "unstable",
    "strategic_noise",
    "Repeated contradiction emergence across enterprise cognition runtimes — enterprise reasoning volatility and trustworthiness caution required.",
    ["integrity_verification_active"],
    ["repeated_contradiction", "reasoning_volatility", "trustworthiness_caution"],
    0.65,
    now
  );
}

function buildExecutiveGradeDurability(
  stabilities: StrategicReasoningStability[],
  activeLayers: number,
  now: number
): StrategicReasoningStability | null {
  const stableCount = stabilities.filter((s) => s.stabilityState === "stable").length;
  const lowDrift = stabilities.filter(
    (s) => s.driftSeverity === "low" || s.driftSeverity === "monitored"
  ).length;

  if (stableCount < 1 || lowDrift < 2 || activeLayers < 4) return null;

  return createReasoningStability(
    "executive_grade_durability",
    "stable",
    "low",
    "unknown",
    "Long-term subsystem alignment remains stable — executive-grade cognition durability and reasoning stability formation detected.",
    [
      "executive_grade_cognition_durability",
      "long_horizon_stability",
      "cross_runtime_persistence",
    ],
    [],
    0.92,
    now
  );
}

function buildDriftSignal(
  stability: StrategicReasoningStability,
  now: number
): EnterpriseDriftSignal {
  return {
    signalId: stableSignature(["drift-signal", stability.driftId]).slice(0, 48),
    signalLabel: stability.driftCategory.replace(/_/g, " "),
    signalSummary: stability.summary.slice(0, 100),
    linkedCategories: Object.freeze([stability.driftCategory]),
    signalIntensity:
      stability.driftSeverity === "critical" || stability.driftSeverity === "unstable"
        ? "high"
        : stability.driftSeverity === "elevated"
          ? "moderate"
          : "low",
    confidence: stability.confidence,
    generatedAt: now,
  };
}

function buildVolatilityIndicator(
  stability: StrategicReasoningStability,
  now: number
): CognitiveVolatilityIndicator | null {
  if (
    stability.driftSeverity !== "elevated" &&
    stability.driftSeverity !== "unstable" &&
    stability.driftSeverity !== "critical"
  ) {
    return null;
  }
  return {
    indicatorId: stableSignature(["volatility", stability.driftId]).slice(0, 48),
    indicatorLabel: stability.driftCategory.replace(/_/g, " "),
    indicatorSummary: stability.summary.slice(0, 100),
    linkedCategories: Object.freeze([stability.driftCategory]),
    volatilityLevel:
      stability.driftSeverity === "critical"
        ? "critical"
        : stability.driftSeverity === "unstable"
          ? "high"
          : "moderate",
    generatedAt: now,
  };
}

function buildLongHorizonField(
  stability: StrategicReasoningStability,
  now: number
): LongHorizonConsistencyField | null {
  if (!stability.stabilitySignals.includes("long_horizon_alignment")) return null;
  return {
    fieldId: stableSignature(["long-horizon", stability.driftId]).slice(0, 48),
    fieldLabel: "long horizon consistency",
    fieldSummary: stability.summary.slice(0, 80),
    persistenceLevel:
      stability.stabilityState === "stable" && stability.driftSeverity === "low"
        ? "executive_grade"
        : stability.stabilityState === "stable" || stability.stabilityState === "adaptive"
          ? "high"
          : "moderate",
    generatedAt: now,
  };
}

function buildDriftSnapshot(
  organizationId: string,
  stabilities: StrategicReasoningStability[],
  signals: EnterpriseDriftSignal[],
  volatility: CognitiveVolatilityIndicator[],
  fields: LongHorizonConsistencyField[],
  now: number
): ExecutiveCognitiveDriftSnapshot {
  const top = stabilities[0];
  const awarenessSummary: DriftAwarenessSummary = top
    ? {
        dominantStabilityState: top.stabilityState,
        dominantDriftSeverity: top.driftSeverity,
        driftHeadline: top.summary,
        durabilityPosture:
          top.stabilityState === "stable" && top.driftSeverity === "low"
            ? "executive_grade"
            : top.stabilityState === "fragmented" || top.driftSeverity === "critical"
              ? "low"
              : top.stabilityState === "stable" || top.stabilityState === "adaptive"
                ? "high"
                : "moderate",
      }
    : {
        dominantStabilityState: "fragmented",
        dominantDriftSeverity: "monitored",
        driftHeadline:
          "Cognitive drift awareness awaiting sufficient reasoning integrity depth.",
        durabilityPosture: "low",
      };

  const signature = stableSignature([
    "d9-6-3-cognitive-drift-snapshot",
    organizationId,
    stabilities.map((s) => s.driftId),
    awarenessSummary.durabilityPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    stabilityCount: stabilities.length,
    awarenessSummary,
    recentReasoningStabilities: Object.freeze(stabilities.slice(0, 6)),
    driftSignals: Object.freeze(signals.slice(0, 6)),
    volatilityIndicators: Object.freeze(volatility.slice(0, 6)),
    longHorizonConsistencyFields: Object.freeze(fields.slice(0, 6)),
  };
}

export function evaluateExecutiveCognitiveDrift(
  input: ExecutiveCognitiveDriftInput
): ExecutiveCognitiveDriftResult {
  if (!beginCognitiveDriftEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newReasoningStabilities: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getCognitiveDriftStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-6-3-cognitive-drift-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.memorySnapshot?.signature ?? "no-memory",
      input.temporalSnapshot?.signature ?? "no-temporal",
      input.foresightSnapshot?.signature ?? "no-foresight",
      input.decisionSnapshot?.signature ?? "no-decision",
      input.metaCognitionSnapshot?.signature ?? "no-meta-cognition",
      input.reasoningIntegritySnapshot?.signature ?? "no-reasoning-integrity",
      input.confidenceSnapshot?.signature ?? "no-confidence",
      input.governanceCoherenceSnapshot?.signature ?? "no-governance-coherence",
      input.governanceSnapshot?.signature ?? "no-governance",
      input.sequencingSnapshot?.signature ?? "no-sequencing",
    ]);

    if (
      !shouldEvaluateCognitiveDrift(
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
        newReasoningStabilities: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const integrityDepth = input.reasoningIntegritySnapshot?.verificationCount ?? 0;

    if (activeLayers < COGNITIVE_DRIFT_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_drift_monitoring_depth",
        snapshot: prior.snapshots[0] ?? null,
        newReasoningStabilities: 0,
        storeSignature: prior.signature,
      };
    }

    if (integrityDepth < COGNITIVE_DRIFT_MIN_INTEGRITY_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_reasoning_integrity_depth",
        snapshot: prior.snapshots[0] ?? null,
        newReasoningStabilities: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: StrategicReasoningStability[] = [];

    const enterpriseStability = buildEnterpriseReasoningStability(
      input.reasoningIntegritySnapshot,
      activeLayers,
      now
    );
    if (enterpriseStability) candidates.push(enterpriseStability);

    const confidenceDrift = buildConfidenceDrift(input, now);
    if (confidenceDrift) candidates.push(confidenceDrift);

    const orchestrationDrift = buildOrchestrationDrift(
      input.sequencingSnapshot,
      input.reasoningIntegritySnapshot,
      now
    );
    if (orchestrationDrift) candidates.push(orchestrationDrift);

    const foresightDrift = buildForesightDrift(input, now);
    if (foresightDrift) candidates.push(foresightDrift);

    const advisoryInstability = buildAdvisoryInstability(input.metaCognitionSnapshot, now);
    if (advisoryInstability) candidates.push(advisoryInstability);

    const governanceDrift = buildGovernanceInconsistencyDrift(
      input.governanceCoherenceSnapshot,
      input.governanceSnapshot,
      now
    );
    if (governanceDrift) candidates.push(governanceDrift);

    const contradictionAmplification = buildContradictionAmplification(
      input.reasoningIntegritySnapshot,
      now
    );
    if (contradictionAmplification) candidates.push(contradictionAmplification);

    const executiveDurability = buildExecutiveGradeDurability(candidates, activeLayers, now);
    if (executiveDurability) candidates.push(executiveDurability);

    const retained = candidates
      .filter(shouldRetainStrategicReasoningStability)
      .sort(
        (a, b) =>
          stabilityStateRank(b.stabilityState) - stabilityStateRank(a.stabilityState) ||
          driftSeverityRank(a.driftSeverity) - driftSeverityRank(b.driftSeverity) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_stabilities",
        snapshot: prior.snapshots[0] ?? null,
        newReasoningStabilities: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.reasoningStabilities.map((s) => s.driftId));
    const newCount = retained.filter((s) => !priorIds.has(s.driftId)).length;

    const signals = retained.map((s) => buildDriftSignal(s, now));
    const volatility = retained
      .map((s) => buildVolatilityIndicator(s, now))
      .filter((i): i is CognitiveVolatilityIndicator => i !== null);
    const fields = retained
      .map((s) => buildLongHorizonField(s, now))
      .filter((f): f is LongHorizonConsistencyField => f !== null);

    store.upsertReasoningStabilities(retained, now);
    store.upsertDriftSignals(signals, now);
    store.upsertVolatilityIndicators(volatility, now);
    store.upsertLongHorizonConsistencyFields(fields, now);

    const snapshot = buildDriftSnapshot(
      organizationId,
      retained,
      signals,
      volatility,
      fields,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastStabilityState(snapshot.awarenessSummary.dominantStabilityState);

    const finalState = store.getState();
    const priorStability = prior.lastStabilityState;

    if (contradictionAmplification || foresightDrift) {
      devLog("major drift emergence — enterprise reasoning stability monitoring active");
    }

    if (orchestrationDrift) {
      devLog("orchestration instability growth — sequencing drift detected");
    }

    if (executiveDurability || enterpriseStability?.stabilityState === "stable") {
      devLog("reasoning durability stabilization — executive-grade stability formation");
    }

    if (
      priorStability &&
      priorStability !== snapshot.awarenessSummary.dominantStabilityState &&
      (snapshot.awarenessSummary.dominantStabilityState === "fragmented" ||
        snapshot.awarenessSummary.dominantStabilityState === "stable")
    ) {
      devLog(
        `stability posture shift — ${priorStability} → ${snapshot.awarenessSummary.dominantStabilityState}`
      );
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newReasoningStabilities: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endCognitiveDriftEvaluation();
  }
}
