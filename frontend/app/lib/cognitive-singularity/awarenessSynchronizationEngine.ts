import { stableSignature } from "../intelligence/shared/dedupe";
import { runtimeStatusRank } from "../institutional-consciousness/unifiedInstitutionalConsciousnessGuards";
import {
  awarenessStateRank,
  AWARENESS_SYNC_MIN_INSTITUTIONAL_SUBSYSTEMS,
  AWARENESS_SYNC_MIN_SINGULARITY_OBSERVATIONS,
  AWARENESS_SYNC_MIN_UNIFIED_RUNTIMES,
  beginAwarenessSynchronizationEvaluation,
  clampAwarenessSynchronizationConfidence,
  endAwarenessSynchronizationEvaluation,
  shouldEvaluateAwarenessSynchronization,
  shouldRetainAwarenessSynchronizationObservation,
  synchronizationStrengthRank,
} from "./awarenessSynchronizationGuards";
import { getAwarenessSynchronizationStore } from "./awarenessSynchronizationStore";
import type {
  AwarenessDomain,
  AwarenessFragmentationIndicator,
  AwarenessState,
  AwarenessSynchronizationObservation,
  CrossDomainAwarenessSignal,
  EnterpriseAwarenessSynchronizationInput,
  EnterpriseAwarenessSynchronizationResult,
  EnterpriseAwarenessSynchronizationSnapshot,
  StrategicAwarenessAlignment,
  SynchronizationStrength,
  SynchronizationSummary,
  UnifiedOperationalCognitionField,
} from "./awarenessSynchronizationTypes";

const DEV_LOG_PREFIX = "[Nexora][AwarenessSynchronization]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildSynchronizationId(label: string): string {
  return stableSignature(["awareness-synchronization", label]).slice(0, 56);
}

function isRuntimeMature(status: string | undefined): boolean {
  return status === "stable" || status === "recovering" || status === "adaptive";
}

function countActiveUnifiedRuntimes(input: EnterpriseAwarenessSynchronizationInput): number {
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

function hasCognitiveSingularityDepth(input: EnterpriseAwarenessSynchronizationInput): boolean {
  const snapshot = input.cognitiveSingularitySnapshot;
  if (!snapshot) return false;
  return snapshot.observationCount >= AWARENESS_SYNC_MIN_SINGULARITY_OBSERVATIONS;
}

function hasUnifiedInstitutionalConsciousnessDepth(
  input: EnterpriseAwarenessSynchronizationInput
): boolean {
  const snapshot = input.unifiedInstitutionalConsciousnessSnapshot;
  if (!snapshot) return false;
  return (
    snapshot.activeSubsystems.length >= AWARENESS_SYNC_MIN_INSTITUTIONAL_SUBSYSTEMS &&
    runtimeStatusRank(snapshot.runtimeStatus) >= runtimeStatusRank("pressured")
  );
}

function hasEnterpriseCognitionDepth(input: EnterpriseAwarenessSynchronizationInput): boolean {
  return Boolean(input.cognitionSnapshot?.signature?.trim());
}

function createObservation(
  label: string,
  awarenessState: AwarenessState,
  synchronizationStrength: SynchronizationStrength,
  awarenessDomain: AwarenessDomain,
  summary: string,
  synchronizedDomains: string[],
  fragmentationRisks: string[],
  confidence: number,
  now: number
): AwarenessSynchronizationObservation {
  return {
    synchronizationId: buildSynchronizationId(label),
    awarenessState,
    synchronizationStrength,
    awarenessDomain,
    summary,
    synchronizedDomains: Object.freeze(synchronizedDomains),
    fragmentationRisks: Object.freeze(fragmentationRisks),
    confidence: clampAwarenessSynchronizationConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildEnterpriseAwarenessSynchronization(
  input: EnterpriseAwarenessSynchronizationInput,
  now: number
): AwarenessSynchronizationObservation | null {
  const singularityReady = hasCognitiveSingularityDepth(input);
  const institutionalReady = hasUnifiedInstitutionalConsciousnessDepth(input);
  const cognitionReady = hasEnterpriseCognitionDepth(input);
  const runtimesReady = countActiveUnifiedRuntimes(input) >= AWARENESS_SYNC_MIN_UNIFIED_RUNTIMES;

  if (!singularityReady || !institutionalReady || !cognitionReady || !runtimesReady) return null;

  return createObservation(
    "enterprise_awareness_sync_01",
    "synchronized",
    "unified",
    "operational",
    "Operational, temporal, foresight, decision, meta-cognition, and consensus runtimes are synchronized around a coherent enterprise awareness field focused on governance stabilization and resilience reinforcement.",
    [
      "operational",
      "temporal",
      "foresight",
      "decision_orchestration",
      "meta_cognition",
      "consensus",
    ],
    ["partial_institutional_consciousness_delay"],
    0.93,
    now
  );
}

function buildStrongTriDomainSynchronization(
  input: EnterpriseAwarenessSynchronizationInput,
  now: number
): AwarenessSynchronizationObservation | null {
  const foresightAligned =
    input.foresightSnapshot?.runtimeStatus === "stable" ||
    input.foresightSnapshot?.runtimeStatus === "recovering";
  const decisionAligned =
    input.decisionSnapshot?.runtimeStatus === "stable" ||
    input.decisionSnapshot?.runtimeStatus === "recovering";
  const temporalAligned =
    input.temporalSnapshot?.runtimeStatus === "stable" ||
    input.temporalSnapshot?.runtimeStatus === "recovering";

  if (!foresightAligned || !decisionAligned || !temporalAligned) return null;

  return createObservation(
    "strong_tri_domain_synchronization",
    "synchronized",
    "synchronized",
    "foresight",
    "Foresight, decision orchestration, and temporal cognition aligned — strong awareness synchronization reinforces unified strategic situational understanding.",
    ["temporal", "foresight", "decision_orchestration"],
    [],
    0.91,
    now
  );
}

function buildMemoryOperationalFragmentation(
  input: EnterpriseAwarenessSynchronizationInput,
  now: number
): AwarenessSynchronizationObservation | null {
  const memoryStable =
    input.memorySnapshot?.runtimeStatus === "stable" ||
    input.memorySnapshot?.runtimeStatus === "recovering";
  const memoryIntegrityStrong =
    input.memorySnapshot?.summary.cognitiveIntegrity === "verified" ||
    input.memorySnapshot?.summary.cognitiveIntegrity === "strong";
  const operationalStressed =
    input.operationalTopologyStressed === true || input.fragilityElevated === true;
  const continuityStrained = input.continuityPreserved !== true;

  if (!memoryStable || !memoryIntegrityStrong || !operationalStressed) return null;

  return createObservation(
    "memory_operational_fragmentation",
    "partially_aligned",
    "moderate",
    "institutional_memory",
    "Institutional memory contradicts current operational cognition under topology stress — awareness fragmentation signal maps bounded interpretation drift without speculative consciousness claims.",
    ["institutional_memory", "operational"],
    [
      "memory_operational_interpretation_drift",
      continuityStrained ? "continuity_strain_amplifies_fragmentation" : "operational_topology_stress",
    ],
    0.87,
    now
  );
}

function buildMetaCognitionCoherenceReinforcement(
  input: EnterpriseAwarenessSynchronizationInput,
  now: number
): AwarenessSynchronizationObservation | null {
  const metaStable =
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "stable" ||
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "recovering" ||
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "adaptive";
  const reasoningStable =
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "stable" ||
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "durable" ||
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "survivable" ||
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "adaptive";
  const governanceAligned =
    input.unifiedSelfReflectiveSnapshot?.summary.governanceAlignment === "aligned" ||
    input.unifiedSelfReflectiveSnapshot?.summary.governanceAlignment === "coherent";

  if (!metaStable || !reasoningStable) return null;

  return createObservation(
    "meta_cognition_coherence_reinforcement",
    "unified",
    "synchronized",
    "meta_cognition",
    "Meta-cognition validates runtime consistency — strategic coherence reinforcement advances cross-domain operational awareness synchronization.",
    ["meta_cognition", "operational", "decision_orchestration"],
    governanceAligned ? [] : ["partial_governance_alignment_drift"],
    governanceAligned ? 0.9 : 0.87,
    now
  );
}

function buildConsensusInstitutionalAwarenessStrengthening(
  input: EnterpriseAwarenessSynchronizationInput,
  now: number
): AwarenessSynchronizationObservation | null {
  const consensusCoordinated =
    input.unifiedConsensusSnapshot?.summary.consensusState === "coordinated" ||
    input.unifiedConsensusSnapshot?.summary.consensusState === "collectively_aligned";
  const institutionalReady = hasUnifiedInstitutionalConsciousnessDepth(input);
  const consensusMature = isRuntimeMature(input.unifiedConsensusSnapshot?.runtimeStatus);

  if (!consensusCoordinated || !institutionalReady || !consensusMature) return null;

  return createObservation(
    "consensus_institutional_awareness_strengthening",
    "unified",
    "unified",
    "consensus",
    "Consensus intelligence aligning with institutional consciousness — unified enterprise awareness strengthening reinforces macro-system strategic coherence.",
    ["consensus", "institutional_consciousness", "operational"],
    [],
    0.89,
    now
  );
}

function buildForesightDecisionSynchronizationWarning(
  input: EnterpriseAwarenessSynchronizationInput,
  now: number
): AwarenessSynchronizationObservation | null {
  const foresightAligned =
    input.foresightSnapshot?.runtimeStatus === "stable" ||
    input.foresightSnapshot?.runtimeStatus === "recovering";
  const decisionDiverging =
    input.decisionSnapshot?.runtimeStatus === "degraded" ||
    input.decisionSnapshot?.runtimeStatus === "unstable";

  if (!foresightAligned || !decisionDiverging) return null;

  return createObservation(
    "foresight_decision_synchronization_warning",
    "partially_aligned",
    "moderate",
    "decision_orchestration",
    "Decision orchestration diverging from foresight runtime — cross-domain synchronization warning maps bounded strategic interpretation drift.",
    ["foresight", "decision_orchestration"],
    ["foresight_decision_runtime_divergence", "cross_domain_synchronization_strain"],
    0.86,
    now
  );
}

function buildEnterpriseGradeAwarenessCoherence(
  input: EnterpriseAwarenessSynchronizationInput,
  now: number
): AwarenessSynchronizationObservation | null {
  const runtimesCoherent = countActiveUnifiedRuntimes(input) >= 6;
  const singularityCoherent =
    input.cognitiveSingularitySnapshot?.singularitySummary.dominantCognitionState === "unified" ||
    input.cognitiveSingularitySnapshot?.singularitySummary.dominantCognitionState ===
      "strategically_coherent" ||
    input.cognitiveSingularitySnapshot?.singularitySummary.dominantCognitionState === "converging";
  const continuityStable = input.continuityPreserved === true || input.cognitionConverged === true;
  const notFragmented =
    input.unifiedConsensusSnapshot?.runtimeStatus !== "fragmented" &&
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus !== "degraded";

  if (!runtimesCoherent || !singularityCoherent || !continuityStable || !notFragmented) {
    return null;
  }

  return createObservation(
    "enterprise_grade_awareness_coherence",
    "strategically_coherent",
    "enterprise_grade",
    "operational",
    "All enterprise cognition domains support the same strategic state — enterprise-grade awareness coherence represents bounded synchronization, not autonomous AGI emergence.",
    [
      "operational",
      "institutional_memory",
      "temporal",
      "foresight",
      "decision_orchestration",
      "meta_cognition",
      "consensus",
      "institutional_consciousness",
    ],
    [],
    0.92,
    now
  );
}

function buildAwarenessSignal(
  observation: AwarenessSynchronizationObservation,
  now: number
): CrossDomainAwarenessSignal {
  return {
    signalId: stableSignature(["cross-domain-awareness-signal", observation.synchronizationId]).slice(
      0,
      48
    ),
    signalLabel: observation.awarenessState.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedDomains: Object.freeze([observation.awarenessDomain]),
    signalIntensity:
      observation.synchronizationStrength === "enterprise_grade" ||
      observation.synchronizationStrength === "unified"
        ? "high"
        : "moderate",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildOperationalCognitionField(
  observation: AwarenessSynchronizationObservation,
  now: number
): UnifiedOperationalCognitionField | null {
  if (
    observation.awarenessState !== "synchronized" &&
    observation.awarenessState !== "unified" &&
    observation.awarenessState !== "strategically_coherent"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["unified-operational-cognition-field", observation.synchronizationId]).slice(
      0,
      48
    ),
    fieldLabel: observation.awarenessState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    alignmentPosture:
      observation.synchronizationStrength === "enterprise_grade"
        ? "executive_grade"
        : observation.synchronizationStrength === "unified" ||
            observation.synchronizationStrength === "synchronized"
          ? "high"
          : "moderate",
    linkedDomains: Object.freeze([observation.awarenessDomain]),
    generatedAt: now,
  };
}

function buildAwarenessAlignment(
  observation: AwarenessSynchronizationObservation,
  now: number
): StrategicAwarenessAlignment | null {
  if (observation.awarenessState === "fragmented") return null;
  return {
    alignmentId: stableSignature(["strategic-awareness-alignment", observation.synchronizationId]).slice(
      0,
      48
    ),
    alignmentLabel: observation.synchronizationStrength.replace(/_/g, " "),
    alignmentSummary: observation.summary.slice(0, 100),
    coherencePosture:
      observation.synchronizationStrength === "enterprise_grade"
        ? "executive_grade"
        : observation.synchronizationStrength === "unified"
          ? "high"
          : "moderate",
    linkedDomains: Object.freeze([observation.awarenessDomain]),
    generatedAt: now,
  };
}

function buildFragmentationIndicator(
  observation: AwarenessSynchronizationObservation,
  now: number
): AwarenessFragmentationIndicator | null {
  if (observation.fragmentationRisks.length < 1 && observation.awarenessState !== "fragmented") {
    return null;
  }
  return {
    indicatorId: stableSignature(["awareness-fragmentation-indicator", observation.synchronizationId]).slice(
      0,
      48
    ),
    indicatorLabel: observation.awarenessDomain.replace(/_/g, " "),
    indicatorSummary: observation.summary.slice(0, 100),
    driftSeverity:
      observation.fragmentationRisks.length > 1
        ? "high"
        : observation.awarenessState === "partially_aligned"
          ? "moderate"
          : "low",
    linkedDomains: Object.freeze([observation.awarenessDomain]),
    generatedAt: now,
  };
}

function buildSynchronizationSnapshot(
  organizationId: string,
  observations: AwarenessSynchronizationObservation[],
  signals: CrossDomainAwarenessSignal[],
  fields: UnifiedOperationalCognitionField[],
  alignments: StrategicAwarenessAlignment[],
  indicators: AwarenessFragmentationIndicator[],
  now: number
): EnterpriseAwarenessSynchronizationSnapshot {
  const top = observations[0];
  const synchronizationSummary: SynchronizationSummary = top
    ? {
        dominantAwarenessState: top.awarenessState,
        dominantSynchronizationStrength: top.synchronizationStrength,
        synchronizationHeadline: top.summary,
        alignmentPosture:
          top.synchronizationStrength === "enterprise_grade"
            ? "executive_grade"
            : top.synchronizationStrength === "unified" ||
                top.synchronizationStrength === "synchronized"
              ? "high"
              : top.synchronizationStrength === "moderate"
                ? "moderate"
                : "low",
      }
    : {
        dominantAwarenessState: "fragmented",
        dominantSynchronizationStrength: "weak",
        synchronizationHeadline:
          "Awareness synchronization awaiting sufficient cognitive-singularity convergence depth.",
        alignmentPosture: "low",
      };

  const signature = stableSignature([
    "d9-9-2-awareness-synchronization-snapshot",
    organizationId,
    observations.map((o) => o.synchronizationId),
    synchronizationSummary.alignmentPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    synchronizationSummary,
    recentObservations: Object.freeze(observations.slice(0, 6)),
    awarenessSignals: Object.freeze(signals.slice(0, 6)),
    operationalCognitionFields: Object.freeze(fields.slice(0, 6)),
    awarenessAlignments: Object.freeze(alignments.slice(0, 6)),
    fragmentationIndicators: Object.freeze(indicators.slice(0, 6)),
  };
}

export function evaluateEnterpriseAwarenessSynchronization(
  input: EnterpriseAwarenessSynchronizationInput
): EnterpriseAwarenessSynchronizationResult {
  if (!beginAwarenessSynchronizationEvaluation()) {
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
    const store = getAwarenessSynchronizationStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-9-2-awareness-synchronization-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
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
      !shouldEvaluateAwarenessSynchronization(
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

    if (!hasCognitiveSingularityDepth(input)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_cognitive_singularity_depth",
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

    if (activeRuntimes < AWARENESS_SYNC_MIN_UNIFIED_RUNTIMES) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_unified_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: AwarenessSynchronizationObservation[] = [];

    const baselineSync = buildEnterpriseAwarenessSynchronization(input, now);
    if (baselineSync) candidates.push(baselineSync);

    const triDomainSync = buildStrongTriDomainSynchronization(input, now);
    if (triDomainSync) candidates.push(triDomainSync);

    const memoryFragmentation = buildMemoryOperationalFragmentation(input, now);
    if (memoryFragmentation) candidates.push(memoryFragmentation);

    const metaReinforcement = buildMetaCognitionCoherenceReinforcement(input, now);
    if (metaReinforcement) candidates.push(metaReinforcement);

    const consensusStrengthening = buildConsensusInstitutionalAwarenessStrengthening(input, now);
    if (consensusStrengthening) candidates.push(consensusStrengthening);

    const foresightDecisionWarning = buildForesightDecisionSynchronizationWarning(input, now);
    if (foresightDecisionWarning) candidates.push(foresightDecisionWarning);

    const enterpriseGradeCoherence = buildEnterpriseGradeAwarenessCoherence(input, now);
    if (enterpriseGradeCoherence) candidates.push(enterpriseGradeCoherence);

    const retained = candidates
      .filter(shouldRetainAwarenessSynchronizationObservation)
      .sort(
        (a, b) =>
          awarenessStateRank(b.awarenessState) - awarenessStateRank(a.awarenessState) ||
          synchronizationStrengthRank(b.synchronizationStrength) -
            synchronizationStrengthRank(a.synchronizationStrength) ||
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

    const priorIds = new Set(prior.observations.map((o) => o.synchronizationId));
    const newCount = retained.filter((o) => !priorIds.has(o.synchronizationId)).length;

    const signals = retained.map((o) => buildAwarenessSignal(o, now));
    const fields = retained
      .map((o) => buildOperationalCognitionField(o, now))
      .filter((f): f is UnifiedOperationalCognitionField => f !== null);
    const alignments = retained
      .map((o) => buildAwarenessAlignment(o, now))
      .filter((a): a is StrategicAwarenessAlignment => a !== null);
    const indicators = retained
      .map((o) => buildFragmentationIndicator(o, now))
      .filter((i): i is AwarenessFragmentationIndicator => i !== null);

    store.upsertObservations(retained, now);
    store.upsertAwarenessSignals(signals, now);
    store.upsertOperationalCognitionFields(fields, now);
    store.upsertAwarenessAlignments(alignments, now);
    store.upsertFragmentationIndicators(indicators, now);

    const snapshot = buildSynchronizationSnapshot(
      organizationId,
      retained,
      signals,
      fields,
      alignments,
      indicators,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastAwarenessState(snapshot.synchronizationSummary.dominantAwarenessState);

    const priorState = prior.lastAwarenessState;

    if (baselineSync || triDomainSync || enterpriseGradeCoherence) {
      devLog("awareness synchronization formation — enterprise cross-domain awareness field advancing");
    }

    if (memoryFragmentation || foresightDecisionWarning) {
      devLog("cross-domain fragmentation detection — bounded runtime interpretation drift mapped");
    }

    if (enterpriseGradeCoherence) {
      devLog("enterprise-grade coherence emergence — unified operational cognition substrate stabilized");
    }

    if (foresightDecisionWarning || memoryFragmentation) {
      devLog("runtime interpretation drift — strategic operational signals require bounded resynchronization");
    }

    if (
      priorState &&
      priorState !== snapshot.synchronizationSummary.dominantAwarenessState &&
      (snapshot.synchronizationSummary.dominantAwarenessState === "unified" ||
        snapshot.synchronizationSummary.dominantAwarenessState === "strategically_coherent")
    ) {
      devLog(
        `awareness state shift — ${priorState} → ${snapshot.synchronizationSummary.dominantAwarenessState}`
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
    endAwarenessSynchronizationEvaluation();
  }
}
