import { stableSignature } from "../intelligence/shared/dedupe";
import { runtimeStatusRank } from "../institutional-consciousness/unifiedInstitutionalConsciousnessGuards";
import {
  beginStrategicCoherenceEvaluation,
  clampStrategicCoherenceConfidence,
  coherenceStateRank,
  coherenceStrengthRank,
  endStrategicCoherenceEvaluation,
  shouldEvaluateStrategicCoherence,
  shouldRetainStrategicCoherenceObservation,
  STRATEGIC_COHERENCE_MIN_INSTITUTIONAL_SUBSYSTEMS,
  STRATEGIC_COHERENCE_MIN_STRATEGIC_WILL_OBSERVATIONS,
  STRATEGIC_COHERENCE_MIN_UNIFIED_RUNTIMES,
} from "./strategicCoherenceGuards";
import { getStrategicCoherenceStore } from "./strategicCoherenceStore";
import type {
  CoherenceCategory,
  CoherenceState,
  CoherenceStrength,
  CrossRuntimeMisalignmentIndicator,
  EnterpriseCoherenceField,
  StrategicCoherenceObservation,
  TotalSystemAlignmentSignal,
  TotalSystemAlignmentSummary,
  UnifiedStrategicCoherenceInput,
  UnifiedStrategicCoherenceResult,
  UnifiedStrategicCoherenceSnapshot,
} from "./strategicCoherenceTypes";

const DEV_LOG_PREFIX = "[Nexora][StrategicCoherence]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildCoherenceId(label: string): string {
  return stableSignature(["strategic-coherence", label]).slice(0, 56);
}

function isRuntimeMature(status: string | undefined): boolean {
  return status === "stable" || status === "recovering" || status === "adaptive";
}

function countActiveUnifiedRuntimes(input: UnifiedStrategicCoherenceInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.temporalSnapshot && isRuntimeMature(input.temporalSnapshot.runtimeStatus)) count += 1;
  if (input.foresightSnapshot && isRuntimeMature(input.foresightSnapshot.runtimeStatus)) count += 1;
  if (input.decisionSnapshot && isRuntimeMature(input.decisionSnapshot.runtimeStatus)) count += 1;
  if (input.unifiedConsensusSnapshot && isRuntimeMature(input.unifiedConsensusSnapshot.runtimeStatus)) {
    count += 1;
  }
  if (
    input.unifiedSelfReflectiveSnapshot &&
    isRuntimeMature(input.unifiedSelfReflectiveSnapshot.runtimeStatus)
  ) {
    count += 1;
  }
  return count;
}

function hasStrategicWillDepth(input: UnifiedStrategicCoherenceInput): boolean {
  const snapshot = input.enterpriseStrategicWillSnapshot;
  if (!snapshot) return false;
  return snapshot.observationCount >= STRATEGIC_COHERENCE_MIN_STRATEGIC_WILL_OBSERVATIONS;
}

function hasUnifiedInstitutionalConsciousnessDepth(input: UnifiedStrategicCoherenceInput): boolean {
  const snapshot = input.unifiedInstitutionalConsciousnessSnapshot;
  if (!snapshot) return false;
  return (
    snapshot.activeSubsystems.length >= STRATEGIC_COHERENCE_MIN_INSTITUTIONAL_SUBSYSTEMS &&
    runtimeStatusRank(snapshot.runtimeStatus) >= runtimeStatusRank("pressured")
  );
}

function hasEnterpriseCognitionDepth(input: UnifiedStrategicCoherenceInput): boolean {
  return Boolean(input.cognitionSnapshot?.signature?.trim());
}

function createObservation(
  label: string,
  coherenceState: CoherenceState,
  coherenceStrength: CoherenceStrength,
  coherenceCategory: CoherenceCategory,
  summary: string,
  coherenceSignals: string[],
  misalignmentRisks: string[],
  confidence: number,
  now: number
): StrategicCoherenceObservation {
  return {
    coherenceId: buildCoherenceId(label),
    coherenceState,
    coherenceStrength,
    coherenceCategory,
    summary,
    coherenceSignals: Object.freeze(coherenceSignals),
    misalignmentRisks: Object.freeze(misalignmentRisks),
    confidence: clampStrategicCoherenceConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildEnterpriseTotalSystemCoherenceBaseline(
  input: UnifiedStrategicCoherenceInput,
  now: number
): StrategicCoherenceObservation | null {
  const willReady = hasStrategicWillDepth(input);
  const institutionalReady = hasUnifiedInstitutionalConsciousnessDepth(input);
  const cognitionReady = hasEnterpriseCognitionDepth(input);
  const runtimesReady = countActiveUnifiedRuntimes(input) >= STRATEGIC_COHERENCE_MIN_UNIFIED_RUNTIMES;

  if (!willReady || !institutionalReady || !cognitionReady || !runtimesReady) return null;

  return createObservation(
    "enterprise_total_system_coherence_01",
    "coherent",
    "unified",
    "intent_identity_will_coherence",
    "Enterprise intelligence runtimes remain strategically coherent across foresight, decision orchestration, meta-cognition, consensus intelligence, institutional consciousness, and strategic intent/identity/will alignment.",
    [
      "cross_runtime_alignment",
      "foresight_decision_consistency",
      "intent_identity_will_coherence",
      "meta_cognition_validation",
      "institutional_consciousness_support",
    ],
    ["localized_operational_speed_pressure"],
    0.94,
    now
  );
}

function buildCrossRuntimeAlignment(
  input: UnifiedStrategicCoherenceInput,
  now: number
): StrategicCoherenceObservation | null {
  const runtimesAligned = countActiveUnifiedRuntimes(input) >= 5;
  const singularityReady =
    (input.cognitiveSingularitySnapshot?.observationCount ?? 0) >= 1;
  const awarenessReady =
    (input.awarenessSynchronizationSnapshot?.observationCount ?? 0) >= 1;

  if (!runtimesAligned || !singularityReady || !awarenessReady) return null;

  return createObservation(
    "cross_runtime_alignment",
    "coherent",
    "aligned",
    "operational_coherence",
    "Cross-runtime strategic alignment reinforced — enterprise cognition runtimes synchronize within a unified strategic coherence field.",
    ["cross_runtime_alignment", "total_system_runtime_synchronization"],
    [],
    0.9,
    now
  );
}

function buildForesightDecisionConsistency(
  input: UnifiedStrategicCoherenceInput,
  now: number
): StrategicCoherenceObservation | null {
  const foresightAligned =
    input.foresightSnapshot?.runtimeStatus === "stable" ||
    input.foresightSnapshot?.runtimeStatus === "recovering";
  const decisionAligned =
    input.decisionSnapshot?.runtimeStatus === "stable" ||
    input.decisionSnapshot?.runtimeStatus === "recovering";

  if (!foresightAligned || !decisionAligned) return null;

  return createObservation(
    "foresight_decision_consistency",
    "coherent",
    "aligned",
    "foresight_coherence",
    "Foresight agrees with decision orchestration — foresight-decision consistency strengthens total-system strategic coherence.",
    ["foresight_decision_consistency", "anticipatory_orchestration_alignment"],
    [],
    0.91,
    now
  );
}

function buildIntentIdentityWillCoherence(
  input: UnifiedStrategicCoherenceInput,
  now: number
): StrategicCoherenceObservation | null {
  const intentCoherent =
    input.unifiedStrategicIntentSnapshot?.strategicIntentSummary.dominantIntentState ===
      "strategically_unified" ||
    input.unifiedStrategicIntentSnapshot?.strategicIntentSummary.dominantIntentState ===
      "enterprise_purpose_aligned";
  const identityCoherent =
    input.enterpriseStrategicIdentitySnapshot?.strategicIdentitySummary.dominantIdentityState ===
      "self_consistent" ||
    input.enterpriseStrategicIdentitySnapshot?.strategicIdentitySummary.dominantIdentityState ===
      "strategically_integrated";
  const willCoherent =
    input.enterpriseStrategicWillSnapshot?.strategicWillSummary.dominantWillState ===
      "directionally_committed" ||
    input.enterpriseStrategicWillSnapshot?.strategicWillSummary.dominantWillState ===
      "strategically_committed";

  if (!intentCoherent || !identityCoherent || !willCoherent) return null;

  return createObservation(
    "intent_identity_will_coherence",
    "coherent",
    "unified",
    "intent_identity_will_coherence",
    "Strategic intent, identity, and will remain aligned — intent/identity/will coherence reinforces enterprise-wide strategic field unity.",
    [
      "intent_identity_will_coherence",
      "purpose_identity_commitment_alignment",
      "strategic_layer_synchronization",
    ],
    [],
    0.92,
    now
  );
}

function buildMetaCognitionValidation(
  input: UnifiedStrategicCoherenceInput,
  now: number
): StrategicCoherenceObservation | null {
  const metaStable =
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "stable" ||
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "recovering" ||
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "adaptive";
  const governanceValidated =
    input.unifiedSelfReflectiveSnapshot?.summary.governanceAlignment === "aligned" ||
    input.unifiedSelfReflectiveSnapshot?.summary.governanceAlignment === "coherent";
  const survivabilityDurable =
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "stable" ||
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "durable" ||
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "survivable";

  if (!metaStable || !governanceValidated || !survivabilityDurable) return null;

  return createObservation(
    "meta_cognition_validation",
    "coherent",
    "aligned",
    "meta_cognition_coherence",
    "Meta-cognition validates confidence and trust across runtimes — executive reasoning continuity supports total-system alignment.",
    ["meta_cognition_validation", "governance_trust_coherence"],
    [],
    0.89,
    now
  );
}

function buildInstitutionalConsciousnessSupport(
  input: UnifiedStrategicCoherenceInput,
  now: number
): StrategicCoherenceObservation | null {
  const institutionalReady = hasUnifiedInstitutionalConsciousnessDepth(input);
  const continuitySupported =
    input.unifiedInstitutionalConsciousnessSnapshot?.summary.continuityState === "preserved" ||
    input.unifiedInstitutionalConsciousnessSnapshot?.summary.continuityState === "adaptive";
  const stewardshipSupported =
    input.unifiedInstitutionalConsciousnessSnapshot?.summary.stewardshipState === "reinforced" ||
    input.unifiedInstitutionalConsciousnessSnapshot?.summary.stewardshipState === "protected";

  if (!institutionalReady || !continuitySupported) return null;

  return createObservation(
    "institutional_consciousness_support",
    "coherent",
    "aligned",
    "institutional_consciousness_coherence",
    "Institutional consciousness supports long-horizon continuity — macro-system awareness reinforces total-system strategic coherence.",
    [
      "institutional_consciousness_support",
      stewardshipSupported ? "stewardship_continuity_reinforcement" : "continuity_alignment",
    ],
    stewardshipSupported ? [] : ["partial_stewardship_support_gap"],
    stewardshipSupported ? 0.9 : 0.87,
    now
  );
}

function buildForesightDecisionMisalignment(
  input: UnifiedStrategicCoherenceInput,
  now: number
): StrategicCoherenceObservation | null {
  const foresightAligned =
    input.foresightSnapshot?.runtimeStatus === "stable" ||
    input.foresightSnapshot?.runtimeStatus === "recovering";
  const decisionStrained =
    input.decisionSnapshot?.runtimeStatus === "degraded" ||
    input.decisionSnapshot?.runtimeStatus === "unstable";

  if (!foresightAligned || !decisionStrained) return null;

  return createObservation(
    "foresight_decision_misalignment",
    "drifting",
    "moderate",
    "decision_coherence",
    "Foresight and decision orchestration diverging — cross-runtime misalignment warning maps strategic drift without autonomous correction.",
    ["foresight_decision_misalignment", "cross_runtime_strategic_drift"],
    ["foresight_decision_runtime_divergence", "total_system_alignment_strain"],
    0.86,
    now
  );
}

function buildIntentIdentityWillMismatch(
  input: UnifiedStrategicCoherenceInput,
  now: number
): StrategicCoherenceObservation | null {
  const intentPartial =
    input.unifiedStrategicIntentSnapshot?.strategicIntentSummary.dominantIntentState ===
      "partially_aligned" ||
    input.unifiedStrategicIntentSnapshot?.strategicIntentSummary.dominantIntentState === "fragmented";
  const identityDrifting =
    input.enterpriseStrategicIdentitySnapshot?.strategicIdentitySummary.dominantIdentityState ===
      "drifting" ||
    input.enterpriseStrategicIdentitySnapshot?.strategicIdentitySummary.dominantIdentityState ===
      "partially_consistent";
  const willHesitant =
    input.enterpriseStrategicWillSnapshot?.strategicWillSummary.dominantWillState === "hesitant" ||
    input.enterpriseStrategicWillSnapshot?.strategicWillSummary.dominantWillState ===
      "partially_committed";

  if (!intentPartial && !identityDrifting && !willHesitant) return null;

  return createObservation(
    "intent_identity_will_mismatch",
    "partially_aligned",
    "moderate",
    "intent_identity_will_coherence",
    "Strategic intent, identity, and will layers show partial divergence — intent/identity/will mismatch signal preserves bounded coherence awareness.",
    ["intent_identity_will_mismatch", "strategic_layer_divergence"],
    ["localized_operational_speed_pressure", "strategic_coherence_fragmentation_risk"],
    0.87,
    now
  );
}

function buildEnterpriseGradeTotalAlignment(
  input: UnifiedStrategicCoherenceInput,
  now: number
): StrategicCoherenceObservation | null {
  const runtimesCoherent = countActiveUnifiedRuntimes(input) >= 6;
  const willCommitted =
    input.enterpriseStrategicWillSnapshot?.strategicWillSummary.dominantWillState ===
      "strategically_committed" ||
    input.enterpriseStrategicWillSnapshot?.strategicWillSummary.dominantCommitmentStrength ===
      "enterprise_grade";
  const singularityCoherent =
    input.cognitiveSingularitySnapshot?.singularitySummary.dominantCognitionState === "unified" ||
    input.cognitiveSingularitySnapshot?.singularitySummary.dominantCognitionState ===
      "strategically_coherent";
  const continuityStable = input.continuityPreserved === true;

  if (!runtimesCoherent || !willCommitted || !singularityCoherent || !continuityStable) {
    return null;
  }

  return createObservation(
    "enterprise_grade_total_alignment",
    "fully_aligned",
    "enterprise_grade",
    "intent_identity_will_coherence",
    "All enterprise intelligence systems align into one coherent strategic field — enterprise-grade total-system alignment represents bounded coherence intelligence, not AGI emergence.",
    [
      "enterprise_grade_total_alignment",
      "total_system_strategic_coherence",
      "unified_intelligence_field",
    ],
    [],
    0.93,
    now
  );
}

function buildTotalSystemAlignmentSignal(
  observation: StrategicCoherenceObservation,
  now: number
): TotalSystemAlignmentSignal {
  return {
    signalId: stableSignature(["total-system-alignment-signal", observation.coherenceId]).slice(
      0,
      48
    ),
    signalLabel: observation.coherenceState.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.coherenceCategory]),
    signalIntensity:
      observation.coherenceStrength === "enterprise_grade" ||
      observation.coherenceStrength === "unified"
        ? "high"
        : "moderate",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildEnterpriseCoherenceField(
  observation: StrategicCoherenceObservation,
  now: number
): EnterpriseCoherenceField | null {
  if (observation.coherenceState !== "coherent" && observation.coherenceState !== "fully_aligned") {
    return null;
  }
  return {
    fieldId: stableSignature(["enterprise-coherence-field", observation.coherenceId]).slice(0, 48),
    fieldLabel: observation.coherenceState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    alignmentPosture:
      observation.coherenceStrength === "enterprise_grade"
        ? "executive_grade"
        : observation.coherenceStrength === "unified" || observation.coherenceStrength === "aligned"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.coherenceCategory]),
    generatedAt: now,
  };
}

function buildMisalignmentIndicator(
  observation: StrategicCoherenceObservation,
  now: number
): CrossRuntimeMisalignmentIndicator | null {
  if (observation.misalignmentRisks.length < 1 && observation.coherenceState !== "drifting") {
    return null;
  }
  return {
    indicatorId: stableSignature(["cross-runtime-misalignment-indicator", observation.coherenceId]).slice(
      0,
      48
    ),
    indicatorLabel: observation.coherenceCategory.replace(/_/g, " "),
    indicatorSummary: observation.summary.slice(0, 100),
    misalignmentSeverity:
      observation.misalignmentRisks.length > 1
        ? "high"
        : observation.coherenceState === "drifting" || observation.coherenceState === "partially_aligned"
          ? "moderate"
          : "low",
    linkedCategories: Object.freeze([observation.coherenceCategory]),
    generatedAt: now,
  };
}

function buildStrategicCoherenceSnapshot(
  organizationId: string,
  observations: StrategicCoherenceObservation[],
  signals: TotalSystemAlignmentSignal[],
  fields: EnterpriseCoherenceField[],
  indicators: CrossRuntimeMisalignmentIndicator[],
  now: number
): UnifiedStrategicCoherenceSnapshot {
  const top = observations[0];
  const totalSystemAlignmentSummary: TotalSystemAlignmentSummary = top
    ? {
        dominantCoherenceState: top.coherenceState,
        dominantCoherenceStrength: top.coherenceStrength,
        coherenceHeadline: top.summary,
        alignmentPosture:
          top.coherenceStrength === "enterprise_grade"
            ? "executive_grade"
            : top.coherenceStrength === "unified" || top.coherenceStrength === "aligned"
              ? "high"
              : top.coherenceStrength === "moderate"
                ? "moderate"
                : "low",
      }
    : {
        dominantCoherenceState: "fragmented",
        dominantCoherenceStrength: "weak",
        coherenceHeadline:
          "Strategic coherence awaiting sufficient strategic-will commitment depth.",
        alignmentPosture: "low",
      };

  const signature = stableSignature([
    "d9-9-6-strategic-coherence-snapshot",
    organizationId,
    observations.map((o) => o.coherenceId),
    totalSystemAlignmentSummary.alignmentPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    totalSystemAlignmentSummary,
    recentObservations: Object.freeze(observations.slice(0, 6)),
    totalSystemAlignmentSignals: Object.freeze(signals.slice(0, 6)),
    enterpriseCoherenceFields: Object.freeze(fields.slice(0, 6)),
    misalignmentIndicators: Object.freeze(indicators.slice(0, 6)),
  };
}

export function evaluateUnifiedStrategicCoherence(
  input: UnifiedStrategicCoherenceInput
): UnifiedStrategicCoherenceResult {
  if (!beginStrategicCoherenceEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newObservations: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getStrategicCoherenceStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-9-6-strategic-coherence-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.enterpriseStrategicWillSnapshot?.signature ?? "no-strategic-will",
      input.enterpriseStrategicIdentitySnapshot?.signature ?? "no-strategic-identity",
      input.unifiedStrategicIntentSnapshot?.signature ?? "no-strategic-intent",
      input.awarenessSynchronizationSnapshot?.signature ?? "no-awareness-sync",
      input.cognitiveSingularitySnapshot?.signature ?? "no-singularity",
      input.unifiedInstitutionalConsciousnessSnapshot?.signature ?? "no-institutional",
      input.unifiedConsensusSnapshot?.signature ?? "no-consensus",
      input.unifiedSelfReflectiveSnapshot?.signature ?? "no-meta",
      input.memorySnapshot?.signature ?? "no-memory",
      input.temporalSnapshot?.signature ?? "no-temporal",
      input.foresightSnapshot?.signature ?? "no-foresight",
      input.decisionSnapshot?.signature ?? "no-decision",
    ]);

    if (
      !shouldEvaluateStrategicCoherence(
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
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    if (!hasStrategicWillDepth(input)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_strategic_will_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    if (!hasUnifiedInstitutionalConsciousnessDepth(input)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_institutional_consciousness_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const activeRuntimes = countActiveUnifiedRuntimes(input);

    if (activeRuntimes < STRATEGIC_COHERENCE_MIN_UNIFIED_RUNTIMES) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_unified_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: StrategicCoherenceObservation[] = [];

    const baseline = buildEnterpriseTotalSystemCoherenceBaseline(input, now);
    if (baseline) candidates.push(baseline);

    const crossRuntime = buildCrossRuntimeAlignment(input, now);
    if (crossRuntime) candidates.push(crossRuntime);

    const foresightDecision = buildForesightDecisionConsistency(input, now);
    if (foresightDecision) candidates.push(foresightDecision);

    const intentIdentityWill = buildIntentIdentityWillCoherence(input, now);
    if (intentIdentityWill) candidates.push(intentIdentityWill);

    const metaValidation = buildMetaCognitionValidation(input, now);
    if (metaValidation) candidates.push(metaValidation);

    const institutionalSupport = buildInstitutionalConsciousnessSupport(input, now);
    if (institutionalSupport) candidates.push(institutionalSupport);

    const foresightMisalignment = buildForesightDecisionMisalignment(input, now);
    if (foresightMisalignment) candidates.push(foresightMisalignment);

    const layerMismatch = buildIntentIdentityWillMismatch(input, now);
    if (layerMismatch) candidates.push(layerMismatch);

    const enterpriseGrade = buildEnterpriseGradeTotalAlignment(input, now);
    if (enterpriseGrade) candidates.push(enterpriseGrade);

    const retained = candidates
      .filter(shouldRetainStrategicCoherenceObservation)
      .sort(
        (a, b) =>
          coherenceStateRank(b.coherenceState) - coherenceStateRank(a.coherenceState) ||
          coherenceStrengthRank(b.coherenceStrength) - coherenceStrengthRank(a.coherenceStrength) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_observations",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.observations.map((o) => o.coherenceId));
    const newCount = retained.filter((o) => !priorIds.has(o.coherenceId)).length;

    const signals = retained.map((o) => buildTotalSystemAlignmentSignal(o, now));
    const fields = retained
      .map((o) => buildEnterpriseCoherenceField(o, now))
      .filter((f): f is EnterpriseCoherenceField => f !== null);
    const indicators = retained
      .map((o) => buildMisalignmentIndicator(o, now))
      .filter((i): i is CrossRuntimeMisalignmentIndicator => i !== null);

    store.upsertObservations(retained, now);
    store.upsertTotalSystemAlignmentSignals(signals, now);
    store.upsertEnterpriseCoherenceFields(fields, now);
    store.upsertMisalignmentIndicators(indicators, now);

    const snapshot = buildStrategicCoherenceSnapshot(
      organizationId,
      retained,
      signals,
      fields,
      indicators,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastCoherenceState(snapshot.totalSystemAlignmentSummary.dominantCoherenceState);

    const priorState = prior.lastCoherenceState;

    if (baseline || crossRuntime || intentIdentityWill || enterpriseGrade) {
      devLog("coherence strengthening — total-system strategic field advancing");
    }

    if (foresightMisalignment || layerMismatch) {
      devLog("total-system misalignment — cross-runtime strategic drift mapped");
    }

    if (enterpriseGrade) {
      devLog("enterprise-grade alignment formation — unified intelligence field stabilized");
    }

    if (foresightMisalignment || layerMismatch) {
      devLog("strategic drift detection — bounded misalignment requires observational resynchronization");
    }

    if (
      priorState &&
      priorState !== snapshot.totalSystemAlignmentSummary.dominantCoherenceState &&
      (snapshot.totalSystemAlignmentSummary.dominantCoherenceState === "coherent" ||
        snapshot.totalSystemAlignmentSummary.dominantCoherenceState === "fully_aligned")
    ) {
      devLog(
        `coherence state shift — ${priorState} → ${snapshot.totalSystemAlignmentSummary.dominantCoherenceState}`
      );
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newObservations: newCount,
      storeSignature: store.getState().signature,
    };
  } finally {
    endStrategicCoherenceEvaluation();
  }
}
