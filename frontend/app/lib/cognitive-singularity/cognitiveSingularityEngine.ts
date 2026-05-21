import { stableSignature } from "../intelligence/shared/dedupe";
import {
  awarenessLevelRank,
  runtimeStatusRank,
} from "../institutional-consciousness/unifiedInstitutionalConsciousnessGuards";
import {
  beginCognitiveSingularityEvaluation,
  clampCognitiveSingularityConfidence,
  cognitionStateRank,
  COGNITIVE_SINGULARITY_MIN_INSTITUTIONAL_SUBSYSTEMS,
  COGNITIVE_SINGULARITY_MIN_UNIFIED_RUNTIMES,
  convergenceStrengthRank,
  endCognitiveSingularityEvaluation,
  shouldEvaluateCognitiveSingularity,
  shouldRetainIntelligenceConvergenceObservation,
} from "./cognitiveSingularityGuards";
import { getCognitiveSingularityStore } from "./cognitiveSingularityStore";
import type {
  CognitionState,
  ConvergenceCategory,
  ConvergenceStrength,
  CrossDomainAwarenessTopology,
  EnterpriseCognitiveSingularityInput,
  EnterpriseCognitiveSingularityResult,
  EnterpriseCognitiveSingularitySnapshot,
  CognitiveSingularitySummary,
  IntelligenceConvergenceObservation,
  StrategicIntelligenceConvergenceSignal,
  UnifiedCognitionField,
} from "./cognitiveSingularityTypes";

const DEV_LOG_PREFIX = "[Nexora][CognitiveSingularity]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildConvergenceId(label: string): string {
  return stableSignature(["cognitive-singularity", label]).slice(0, 56);
}

function isRuntimeMature(status: string | undefined): boolean {
  return status === "stable" || status === "recovering" || status === "adaptive";
}

function countActiveUnifiedRuntimes(input: EnterpriseCognitiveSingularityInput): number {
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

function hasUnifiedInstitutionalConsciousnessDepth(
  input: EnterpriseCognitiveSingularityInput
): boolean {
  const snapshot = input.unifiedInstitutionalConsciousnessSnapshot;
  if (!snapshot) return false;
  return (
    snapshot.activeSubsystems.length >= COGNITIVE_SINGULARITY_MIN_INSTITUTIONAL_SUBSYSTEMS &&
    runtimeStatusRank(snapshot.runtimeStatus) >= runtimeStatusRank("pressured")
  );
}

function hasEnterpriseCognitionDepth(input: EnterpriseCognitiveSingularityInput): boolean {
  return Boolean(input.cognitionSnapshot?.signature?.trim());
}

function createObservation(
  label: string,
  cognitionState: CognitionState,
  convergenceStrength: ConvergenceStrength,
  convergenceCategory: ConvergenceCategory,
  summary: string,
  convergenceSignals: string[],
  convergenceRisks: string[],
  confidence: number,
  now: number
): IntelligenceConvergenceObservation {
  return {
    convergenceId: buildConvergenceId(label),
    cognitionState,
    convergenceStrength,
    convergenceCategory,
    summary,
    convergenceSignals: Object.freeze(convergenceSignals),
    convergenceRisks: Object.freeze(convergenceRisks),
    confidence: clampCognitiveSingularityConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildEnterpriseStrategicConvergence(
  input: EnterpriseCognitiveSingularityInput,
  now: number
): IntelligenceConvergenceObservation | null {
  const institutionalReady = hasUnifiedInstitutionalConsciousnessDepth(input);
  const cognitionReady = hasEnterpriseCognitionDepth(input);
  const runtimesReady = countActiveUnifiedRuntimes(input) >= COGNITIVE_SINGULARITY_MIN_UNIFIED_RUNTIMES;
  const consensusMature =
    (input.unifiedConsensusSnapshot?.activeSubsystems.length ?? 0) >=
    COGNITIVE_SINGULARITY_MIN_UNIFIED_RUNTIMES;

  if (!institutionalReady || !cognitionReady || !runtimesReady || !consensusMature) return null;

  return createObservation(
    "enterprise_strategic_convergence_01",
    "converging",
    "unified",
    "operational_convergence",
    "Enterprise cognition systems are converging into a synchronized strategic-awareness substrate through aligned foresight, consensus, institutional memory, and operational continuity intelligence.",
    [
      "cross_domain_alignment",
      "strategic_awareness_synchronization",
      "distributed_reasoning_coherence",
      "enterprise_cognition_unification",
    ],
    ["partial_temporal_decision_drift"],
    0.93,
    now
  );
}

function buildStrategicConvergenceReinforcement(
  input: EnterpriseCognitiveSingularityInput,
  now: number
): IntelligenceConvergenceObservation | null {
  const consensusAligned =
    input.unifiedConsensusSnapshot?.runtimeStatus === "stable" ||
    input.unifiedConsensusSnapshot?.runtimeStatus === "recovering";
  const foresightAligned =
    input.foresightSnapshot?.runtimeStatus === "stable" ||
    input.foresightSnapshot?.runtimeStatus === "recovering";
  const consensusCoordinated =
    input.unifiedConsensusSnapshot?.summary.consensusState === "coordinated" ||
    input.unifiedConsensusSnapshot?.summary.consensusState === "collectively_aligned";

  if (!consensusAligned || !foresightAligned || !consensusCoordinated) return null;

  return createObservation(
    "strategic_convergence_reinforcement",
    "converging",
    "synchronized",
    "consensus_convergence",
    "Consensus intelligence aligning with foresight systems — strategic convergence reinforcement strengthens cross-domain awareness without AGI claims.",
    [
      "strategic_convergence_reinforcement",
      "consensus_foresight_alignment",
      "anticipatory_consensus_coherence",
    ],
    [],
    0.9,
    now
  );
}

function buildEnterpriseAwarenessCoherence(
  input: EnterpriseCognitiveSingularityInput,
  now: number
): IntelligenceConvergenceObservation | null {
  const institutionalStable =
    input.unifiedInstitutionalConsciousnessSnapshot?.runtimeStatus === "stable" ||
    input.unifiedInstitutionalConsciousnessSnapshot?.runtimeStatus === "recovering";
  const cognitionConverged = input.cognitionConverged === true || input.continuityPreserved === true;
  const awarenessMature =
    awarenessLevelRank(
      input.unifiedInstitutionalConsciousnessSnapshot?.awarenessLevel ?? "weak"
    ) >= awarenessLevelRank("systemic");

  if (!institutionalStable || !cognitionConverged || !awarenessMature) return null;

  return createObservation(
    "enterprise_awareness_coherence",
    "unified",
    "synchronized",
    "institutional_convergence",
    "Institutional consciousness synchronizing with operational cognition — enterprise-awareness coherence reinforces macro-system preservation awareness.",
    [
      "enterprise_awareness_coherence",
      "institutional_operational_synchronization",
      "macro_awareness_alignment",
    ],
    [],
    0.89,
    now
  );
}

function buildConvergenceInstabilityWarning(
  input: EnterpriseCognitiveSingularityInput,
  now: number
): IntelligenceConvergenceObservation | null {
  const temporalDiverging =
    input.temporalSnapshot?.runtimeStatus === "unstable" ||
    input.temporalSnapshot?.runtimeStatus === "degraded";
  const decisionStrained =
    input.decisionSnapshot?.runtimeStatus === "unstable" ||
    input.decisionSnapshot?.runtimeStatus === "degraded";

  if (!temporalDiverging || !decisionStrained) return null;

  return createObservation(
    "convergence_instability_warning",
    "partially_aligned",
    "moderate",
    "temporal_convergence",
    "Temporal cognition diverging from decision orchestration — convergence instability warning maps bounded cross-domain drift without speculative singularity behavior.",
    [
      "convergence_instability_warning",
      "temporal_decision_divergence",
      "cross_domain_synchronization_strain",
    ],
    ["partial_temporal_decision_drift"],
    0.86,
    now
  );
}

function buildUnifiedCognitionEmergence(
  input: EnterpriseCognitiveSingularityInput,
  now: number
): IntelligenceConvergenceObservation | null {
  const memoryMature =
    input.memorySnapshot?.runtimeStatus === "stable" ||
    input.memorySnapshot?.runtimeStatus === "recovering";
  const consensusLearning =
    input.unifiedConsensusSnapshot?.summary.governanceState === "integrity preserved" ||
    input.unifiedConsensusSnapshot?.summary.governanceState === "coherent";
  const collectiveAligned =
    input.unifiedConsensusSnapshot?.summary.diversityState === "balanced";

  if (!memoryMature || !consensusLearning || !collectiveAligned) return null;

  return createObservation(
    "unified_cognition_emergence",
    "converging",
    "unified",
    "resilience_convergence",
    "Distributed strategic-learning aligning across runtimes — unified cognition emergence reinforces enterprise-wide intelligence coherence.",
    [
      "unified_cognition_emergence",
      "distributed_learning_alignment",
      "institutional_memory_consensus_sync",
    ],
    [],
    0.88,
    now
  );
}

function buildCrossDomainSynchronizationReinforcement(
  input: EnterpriseCognitiveSingularityInput,
  now: number
): IntelligenceConvergenceObservation | null {
  const metaStable =
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "stable" ||
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "recovering";
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
    "cross_domain_synchronization_reinforcement",
    "unified",
    "synchronized",
    "operational_convergence",
    "Meta-cognition stabilizing enterprise-wide reasoning continuity — cross-domain synchronization reinforcement advances strategic intelligence convergence.",
    [
      "cross_domain_synchronization_reinforcement",
      "meta_cognition_stabilization",
      "reasoning_continuity_coherence",
    ],
    governanceAligned ? [] : ["partial_governance_alignment_drift"],
    governanceAligned ? 0.9 : 0.87,
    now
  );
}

function buildEnterpriseStrategicSingularityFormation(
  input: EnterpriseCognitiveSingularityInput,
  now: number
): IntelligenceConvergenceObservation | null {
  const runtimesCoherent = countActiveUnifiedRuntimes(input) >= 6;
  const institutionalCoherent =
    input.unifiedInstitutionalConsciousnessSnapshot?.awarenessLevel === "institutional_grade" ||
    input.unifiedInstitutionalConsciousnessSnapshot?.awarenessLevel === "civilization_scale";
  const stewardshipReinforced =
    input.unifiedInstitutionalConsciousnessSnapshot?.summary.stewardshipState === "reinforced" ||
    input.unifiedInstitutionalConsciousnessSnapshot?.summary.stewardshipState === "protected";
  const notFragmented =
    input.unifiedConsensusSnapshot?.runtimeStatus !== "fragmented" &&
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus !== "degraded";

  if (!runtimesCoherent || !institutionalCoherent || !stewardshipReinforced || !notFragmented) {
    return null;
  }

  return createObservation(
    "enterprise_strategic_singularity_formation",
    "strategically_coherent",
    "enterprise_singularity",
    "stewardship_convergence",
    "Multiple cognition systems converging coherently — enterprise strategic-singularity formation represents bounded intelligence convergence, not autonomous AGI emergence.",
    [
      "enterprise_strategic_singularity_formation",
      "multi_runtime_coherence",
      "strategic_intelligence_convergence",
    ],
    [],
    0.91,
    now
  );
}

function buildConvergenceSignal(
  observation: IntelligenceConvergenceObservation,
  now: number
): StrategicIntelligenceConvergenceSignal {
  return {
    signalId: stableSignature(["strategic-intelligence-convergence-signal", observation.convergenceId]).slice(
      0,
      48
    ),
    signalLabel: observation.cognitionState.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.convergenceCategory]),
    signalIntensity:
      observation.convergenceStrength === "enterprise_singularity" ||
      observation.convergenceStrength === "unified"
        ? "high"
        : "moderate",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildCognitionField(
  observation: IntelligenceConvergenceObservation,
  now: number
): UnifiedCognitionField | null {
  if (
    observation.cognitionState !== "converging" &&
    observation.cognitionState !== "unified" &&
    observation.cognitionState !== "strategically_coherent"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["unified-cognition-field", observation.convergenceId]).slice(0, 48),
    fieldLabel: observation.cognitionState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    coherencePosture:
      observation.convergenceStrength === "enterprise_singularity"
        ? "executive_grade"
        : observation.convergenceStrength === "unified" ||
            observation.convergenceStrength === "synchronized"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.convergenceCategory]),
    generatedAt: now,
  };
}

function buildAwarenessTopology(
  observation: IntelligenceConvergenceObservation,
  now: number
): CrossDomainAwarenessTopology | null {
  if (observation.convergenceRisks.length < 1 && observation.convergenceStrength === "weak") {
    return null;
  }
  return {
    topologyId: stableSignature(["cross-domain-awareness-topology", observation.convergenceId]).slice(
      0,
      48
    ),
    topologyLabel: observation.convergenceCategory.replace(/_/g, " "),
    topologySummary: observation.summary.slice(0, 100),
    alignmentPosture:
      observation.convergenceRisks.length > 0
        ? "high"
        : observation.cognitionState === "unified" ||
            observation.cognitionState === "strategically_coherent"
          ? "moderate"
          : "low",
    linkedCategories: Object.freeze([observation.convergenceCategory]),
    generatedAt: now,
  };
}

function buildSingularitySnapshot(
  organizationId: string,
  observations: IntelligenceConvergenceObservation[],
  signals: StrategicIntelligenceConvergenceSignal[],
  fields: UnifiedCognitionField[],
  topologies: CrossDomainAwarenessTopology[],
  now: number
): EnterpriseCognitiveSingularitySnapshot {
  const top = observations[0];
  const singularitySummary: CognitiveSingularitySummary = top
    ? {
        dominantCognitionState: top.cognitionState,
        dominantConvergenceStrength: top.convergenceStrength,
        singularityHeadline: top.summary,
        convergencePosture:
          top.convergenceStrength === "enterprise_singularity"
            ? "executive_grade"
            : top.convergenceStrength === "unified" || top.convergenceStrength === "synchronized"
              ? "high"
              : top.convergenceStrength === "moderate"
                ? "moderate"
                : "low",
      }
    : {
        dominantCognitionState: "fragmented",
        dominantConvergenceStrength: "weak",
        singularityHeadline:
          "Cognitive singularity awaiting sufficient unified institutional-consciousness depth.",
        convergencePosture: "low",
      };

  const signature = stableSignature([
    "d9-9-1-cognitive-singularity-snapshot",
    organizationId,
    observations.map((o) => o.convergenceId),
    singularitySummary.convergencePosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    singularitySummary,
    recentObservations: Object.freeze(observations.slice(0, 6)),
    convergenceSignals: Object.freeze(signals.slice(0, 6)),
    cognitionFields: Object.freeze(fields.slice(0, 6)),
    awarenessTopologies: Object.freeze(topologies.slice(0, 6)),
  };
}

export function evaluateEnterpriseCognitiveSingularity(
  input: EnterpriseCognitiveSingularityInput
): EnterpriseCognitiveSingularityResult {
  if (!beginCognitiveSingularityEvaluation()) {
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
    const store = getCognitiveSingularityStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-9-1-cognitive-singularity-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.unifiedInstitutionalConsciousnessSnapshot?.signature ?? "no-institutional",
      input.unifiedConsensusSnapshot?.signature ?? "no-consensus",
      input.unifiedSelfReflectiveSnapshot?.signature ?? "no-meta",
      input.memorySnapshot?.signature ?? "no-memory",
      input.temporalSnapshot?.signature ?? "no-temporal",
      input.foresightSnapshot?.signature ?? "no-foresight",
      input.decisionSnapshot?.signature ?? "no-decision",
    ]);

    if (
      !shouldEvaluateCognitiveSingularity(
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

    if (activeRuntimes < COGNITIVE_SINGULARITY_MIN_UNIFIED_RUNTIMES) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_unified_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: IntelligenceConvergenceObservation[] = [];

    const strategicConvergence = buildEnterpriseStrategicConvergence(input, now);
    if (strategicConvergence) candidates.push(strategicConvergence);

    const convergenceReinforcement = buildStrategicConvergenceReinforcement(input, now);
    if (convergenceReinforcement) candidates.push(convergenceReinforcement);

    const awarenessCoherence = buildEnterpriseAwarenessCoherence(input, now);
    if (awarenessCoherence) candidates.push(awarenessCoherence);

    const instabilityWarning = buildConvergenceInstabilityWarning(input, now);
    if (instabilityWarning) candidates.push(instabilityWarning);

    const cognitionEmergence = buildUnifiedCognitionEmergence(input, now);
    if (cognitionEmergence) candidates.push(cognitionEmergence);

    const syncReinforcement = buildCrossDomainSynchronizationReinforcement(input, now);
    if (syncReinforcement) candidates.push(syncReinforcement);

    const singularityFormation = buildEnterpriseStrategicSingularityFormation(input, now);
    if (singularityFormation) candidates.push(singularityFormation);

    const retained = candidates
      .filter(shouldRetainIntelligenceConvergenceObservation)
      .sort(
        (a, b) =>
          cognitionStateRank(b.cognitionState) - cognitionStateRank(a.cognitionState) ||
          convergenceStrengthRank(b.convergenceStrength) -
            convergenceStrengthRank(a.convergenceStrength) ||
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

    const priorIds = new Set(prior.observations.map((o) => o.convergenceId));
    const newCount = retained.filter((o) => !priorIds.has(o.convergenceId)).length;

    const signals = retained.map((o) => buildConvergenceSignal(o, now));
    const fields = retained
      .map((o) => buildCognitionField(o, now))
      .filter((f): f is UnifiedCognitionField => f !== null);
    const topologies = retained
      .map((o) => buildAwarenessTopology(o, now))
      .filter((t): t is CrossDomainAwarenessTopology => t !== null);

    store.upsertObservations(retained, now);
    store.upsertConvergenceSignals(signals, now);
    store.upsertCognitionFields(fields, now);
    store.upsertAwarenessTopologies(topologies, now);

    const snapshot = buildSingularitySnapshot(
      organizationId,
      retained,
      signals,
      fields,
      topologies,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastCognitionState(snapshot.singularitySummary.dominantCognitionState);

    const finalState = store.getState();
    const priorState = prior.lastCognitionState;

    if (strategicConvergence || singularityFormation || cognitionEmergence) {
      devLog("convergence stabilization — enterprise strategic-awareness substrate advancing");
    }

    if (convergenceReinforcement || syncReinforcement || awarenessCoherence) {
      devLog("cross-domain synchronization emergence — unified cognition layers aligning");
    }

    if (awarenessCoherence || singularityFormation) {
      devLog("enterprise-awareness coherence formation — institutional and operational cognition synchronized");
    }

    if (instabilityWarning) {
      devLog("cognition fragmentation detection — bounded cross-domain drift mapped");
    }

    if (
      priorState &&
      priorState !== snapshot.singularitySummary.dominantCognitionState &&
      (snapshot.singularitySummary.dominantCognitionState === "unified" ||
        snapshot.singularitySummary.dominantCognitionState === "strategically_coherent")
    ) {
      devLog(
        `convergence state shift — ${priorState} → ${snapshot.singularitySummary.dominantCognitionState}`
      );
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newObservations: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endCognitiveSingularityEvaluation();
  }
}
