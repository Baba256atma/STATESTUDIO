import { stableSignature } from "../intelligence/shared/dedupe";
import { runtimeStatusRank } from "../institutional-consciousness/unifiedInstitutionalConsciousnessGuards";
import {
  beginFinalStrategicIntegrationEvaluation,
  clampFinalStrategicIntegrationConfidence,
  endFinalStrategicIntegrationEvaluation,
  FINAL_STRATEGIC_INTEGRATION_MIN_INSTITUTIONAL_SUBSYSTEMS,
  FINAL_STRATEGIC_INTEGRATION_MIN_STRATEGIC_RESONANCE_OBSERVATIONS,
  FINAL_STRATEGIC_INTEGRATION_MIN_UNIFIED_RUNTIMES,
  integrationStateRank,
  integrationStrengthRank,
  shouldEvaluateFinalStrategicIntegration,
  shouldRetainStrategicIntegrationObservation,
} from "./finalStrategicIntegrationGuards";
import { getFinalStrategicIntegrationStore } from "./finalStrategicIntegrationStore";
import type {
  EnterpriseCognitiveIntegrationField,
  FinalIntegrationSummary,
  FinalStrategicIntegrationInput,
  FinalStrategicIntegrationResult,
  FinalStrategicIntegrationSnapshot,
  IntegrationCategory,
  IntegrationState,
  IntegrationStrength,
  RuntimeFragmentationIndicator,
  StrategicIntegrationObservation,
  TotalRuntimeConvergenceSignal,
} from "./finalStrategicIntegrationTypes";

const DEV_LOG_PREFIX = "[Nexora][FinalStrategicIntegration]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildIntegrationId(label: string): string {
  return stableSignature(["final-strategic-integration", label]).slice(0, 56);
}

function isRuntimeMature(status: string | undefined): boolean {
  return status === "stable" || status === "recovering" || status === "adaptive";
}

function countActiveUnifiedRuntimes(input: FinalStrategicIntegrationInput): number {
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

function hasStrategicResonanceDepth(input: FinalStrategicIntegrationInput): boolean {
  const snapshot = input.enterpriseStrategicResonanceSnapshot;
  if (!snapshot) return false;
  return snapshot.observationCount >= FINAL_STRATEGIC_INTEGRATION_MIN_STRATEGIC_RESONANCE_OBSERVATIONS;
}

function hasUnifiedInstitutionalConsciousnessDepth(input: FinalStrategicIntegrationInput): boolean {
  const snapshot = input.unifiedInstitutionalConsciousnessSnapshot;
  if (!snapshot) return false;
  return (
    snapshot.activeSubsystems.length >= FINAL_STRATEGIC_INTEGRATION_MIN_INSTITUTIONAL_SUBSYSTEMS &&
    runtimeStatusRank(snapshot.runtimeStatus) >= runtimeStatusRank("pressured")
  );
}

function hasEnterpriseCognitionDepth(input: FinalStrategicIntegrationInput): boolean {
  return Boolean(input.cognitionSnapshot?.signature?.trim());
}

function createObservation(
  label: string,
  integrationState: IntegrationState,
  integrationStrength: IntegrationStrength,
  integrationCategory: IntegrationCategory,
  summary: string,
  integrationSignals: string[],
  fragmentationRisks: string[],
  confidence: number,
  now: number
): StrategicIntegrationObservation {
  return {
    integrationId: buildIntegrationId(label),
    integrationState,
    integrationStrength,
    integrationCategory,
    summary,
    integrationSignals: Object.freeze(integrationSignals),
    fragmentationRisks: Object.freeze(fragmentationRisks),
    confidence: clampFinalStrategicIntegrationConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildEnterpriseFinalIntegrationBaseline(
  input: FinalStrategicIntegrationInput,
  now: number
): StrategicIntegrationObservation | null {
  const resonanceReady = hasStrategicResonanceDepth(input);
  const institutionalReady = hasUnifiedInstitutionalConsciousnessDepth(input);
  const cognitionReady = hasEnterpriseCognitionDepth(input);
  const runtimesReady =
    countActiveUnifiedRuntimes(input) >= FINAL_STRATEGIC_INTEGRATION_MIN_UNIFIED_RUNTIMES;

  if (!resonanceReady || !institutionalReady || !cognitionReady || !runtimesReady) return null;

  return createObservation(
    "enterprise_final_integration_01",
    "unified",
    "enterprise_grade",
    "runtime_convergence",
    "Enterprise intelligence runtimes are converging into a unified strategic runtime across memory, foresight, decision orchestration, meta-cognition, consensus governance, and institutional awareness.",
    [
      "runtime_convergence",
      "foresight_action_integration",
      "memory_identity_alignment",
      "consensus_governance_coherence",
      "institutional_awareness_support",
    ],
    ["localized_operational_speed_pressure"],
    0.94,
    now
  );
}

function buildRuntimeConvergence(
  input: FinalStrategicIntegrationInput,
  now: number
): StrategicIntegrationObservation | null {
  const runtimesConverged = countActiveUnifiedRuntimes(input) >= 5;
  const singularityReady = (input.cognitiveSingularitySnapshot?.observationCount ?? 0) >= 1;
  const awarenessReady = (input.awarenessSynchronizationSnapshot?.observationCount ?? 0) >= 1;
  const resonanceReady = hasStrategicResonanceDepth(input);

  if (!runtimesConverged || !singularityReady || !awarenessReady || !resonanceReady) return null;

  return createObservation(
    "runtime_convergence",
    "converging",
    "unified",
    "runtime_convergence",
    "Total cognitive runtime convergence advancing — enterprise runtimes synchronize within a bounded final integration field without autonomous runtime authority.",
    ["runtime_convergence", "total_runtime_synchronization", "cross_layer_runtime_alignment"],
    [],
    0.91,
    now
  );
}

function buildForesightActionIntegration(
  input: FinalStrategicIntegrationInput,
  now: number
): StrategicIntegrationObservation | null {
  const foresightReady =
    input.foresightSnapshot?.runtimeStatus === "stable" ||
    input.foresightSnapshot?.runtimeStatus === "recovering";
  const decisionReady =
    input.decisionSnapshot?.runtimeStatus === "stable" ||
    input.decisionSnapshot?.runtimeStatus === "recovering";

  if (!foresightReady || !decisionReady) return null;

  return createObservation(
    "foresight_action_integration",
    "unified",
    "integrated",
    "foresight_action_integration",
    "Foresight and decision orchestration integrate into one executable strategic runtime — anticipatory reasoning connects to operational action pathways.",
    ["foresight_action_integration", "anticipatory_execution_unification"],
    [],
    0.9,
    now
  );
}

function buildMemoryIdentityAlignment(
  input: FinalStrategicIntegrationInput,
  now: number
): StrategicIntegrationObservation | null {
  const memoryReady =
    input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing";
  const identityAligned =
    input.enterpriseStrategicIdentitySnapshot?.strategicIdentitySummary.dominantIdentityState ===
      "self_consistent" ||
    input.enterpriseStrategicIdentitySnapshot?.strategicIdentitySummary.dominantIdentityState ===
      "strategically_integrated";

  if (!memoryReady || !identityAligned) return null;

  return createObservation(
    "memory_identity_alignment",
    "unified",
    "integrated",
    "memory_identity_integration",
    "Institutional memory aligns with enterprise strategic identity — historical cognition supports purpose continuity across the final integration layer.",
    ["memory_identity_alignment", "institutional_identity_continuity"],
    [],
    0.89,
    now
  );
}

function buildConsensusGovernanceCoherence(
  input: FinalStrategicIntegrationInput,
  now: number
): StrategicIntegrationObservation | null {
  const consensusReady = isRuntimeMature(input.unifiedConsensusSnapshot?.runtimeStatus);
  const metaReady =
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "stable" ||
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "recovering" ||
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "adaptive";
  const governanceAligned =
    input.unifiedSelfReflectiveSnapshot?.summary.governanceAlignment === "aligned" ||
    input.unifiedSelfReflectiveSnapshot?.summary.governanceAlignment === "coherent";

  if (!consensusReady || !metaReady || !governanceAligned) return null;

  return createObservation(
    "consensus_governance_coherence",
    "unified",
    "integrated",
    "consensus_governance_integration",
    "Consensus intelligence and meta-cognition governance integrate — distributed executive cognition aligns with trust-calibrated regulation.",
    ["consensus_governance_coherence", "distributed_regulation_integration"],
    [],
    0.9,
    now
  );
}

function buildInstitutionalAwarenessSupport(
  input: FinalStrategicIntegrationInput,
  now: number
): StrategicIntegrationObservation | null {
  const institutionalReady = hasUnifiedInstitutionalConsciousnessDepth(input);
  const awarenessSynced = (input.awarenessSynchronizationSnapshot?.observationCount ?? 0) >= 1;
  const continuitySupported =
    input.unifiedInstitutionalConsciousnessSnapshot?.summary.continuityState === "preserved" ||
    input.unifiedInstitutionalConsciousnessSnapshot?.summary.continuityState === "adaptive";

  if (!institutionalReady || !awarenessSynced || !continuitySupported) return null;

  return createObservation(
    "institutional_awareness_support",
    "converging",
    "integrated",
    "institutional_awareness_integration",
    "Institutional consciousness supports operational awareness synchronization — long-horizon stewardship connects to enterprise runtime integration.",
    ["institutional_awareness_support", "stewardship_awareness_bridge"],
    [],
    0.88,
    now
  );
}

function buildStrategicAlignmentConvergence(
  input: FinalStrategicIntegrationInput,
  now: number
): StrategicIntegrationObservation | null {
  const coherenceAligned =
    input.unifiedStrategicCoherenceSnapshot?.totalSystemAlignmentSummary.dominantCoherenceState ===
      "coherent" ||
    input.unifiedStrategicCoherenceSnapshot?.totalSystemAlignmentSummary.dominantCoherenceState ===
      "fully_aligned";
  const equilibriumBalanced =
    input.enterpriseStrategicEquilibriumSnapshot?.strategicEquilibriumSummary
      .dominantEquilibriumState === "balanced" ||
    input.enterpriseStrategicEquilibriumSnapshot?.strategicEquilibriumSummary
      .dominantEquilibriumState === "strategically_stable";
  const resonanceHarmonic =
    input.enterpriseStrategicResonanceSnapshot?.strategicResonanceSummary.dominantResonanceState ===
      "harmonically_aligned" ||
    input.enterpriseStrategicResonanceSnapshot?.strategicResonanceSummary.dominantResonanceState ===
      "strategically_resonant";

  if (!coherenceAligned || !equilibriumBalanced) return null;

  return createObservation(
    "strategic_alignment_convergence",
    resonanceHarmonic ? "fully_integrated" : "unified",
    resonanceHarmonic ? "enterprise_grade" : "unified",
    "strategic_alignment",
    "Strategic coherence, equilibrium, and resonance layers converge — final integration strengthens enterprise-wide strategic alignment without autonomous control.",
    [
      "strategic_alignment_convergence",
      "coherence_equilibrium_resonance_unification",
    ],
    resonanceHarmonic ? [] : ["partial_resonance_convergence_gap"],
    resonanceHarmonic ? 0.92 : 0.89,
    now
  );
}

function buildOperationalUnification(
  input: FinalStrategicIntegrationInput,
  now: number
): StrategicIntegrationObservation | null {
  const cognitionReady = hasEnterpriseCognitionDepth(input);
  const temporalReady = isRuntimeMature(input.temporalSnapshot?.runtimeStatus);
  const memoryReady =
    input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing";

  if (!cognitionReady || !temporalReady || !memoryReady) return null;

  return createObservation(
    "operational_unification",
    "converging",
    "integrated",
    "operational_unification",
    "Enterprise cognition, temporal intelligence, and institutional memory unify operational awareness — bounded runtime integration without scene mutation.",
    ["operational_unification", "temporal_memory_cognition_bridge"],
    input.operationalTopologyStressed ? ["localized_operational_speed_pressure"] : [],
    0.87,
    now
  );
}

function buildMemoryIdentityDisconnect(
  input: FinalStrategicIntegrationInput,
  now: number
): StrategicIntegrationObservation | null {
  const memoryReady =
    input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing";
  const identityDrifting =
    input.enterpriseStrategicIdentitySnapshot?.strategicIdentitySummary.dominantIdentityState ===
      "drifting" ||
    input.enterpriseStrategicIdentitySnapshot?.strategicIdentitySummary.dominantIdentityState ===
      "partially_consistent";

  if (!memoryReady || !identityDrifting) return null;

  return createObservation(
    "memory_identity_disconnect",
    "partially_integrated",
    "moderate",
    "memory_identity_integration",
    "Institutional memory and strategic identity diverging — memory/identity disconnect mapped within final integration awareness without autonomous correction.",
    ["memory_identity_disconnect", "identity_memory_fragmentation"],
    ["memory_identity_integration_gap", "strategic_purpose_drift_risk"],
    0.85,
    now
  );
}

function buildForesightActionDisconnect(
  input: FinalStrategicIntegrationInput,
  now: number
): StrategicIntegrationObservation | null {
  const foresightReady =
    input.foresightSnapshot?.runtimeStatus === "stable" ||
    input.foresightSnapshot?.runtimeStatus === "recovering";
  const decisionStrained =
    input.decisionSnapshot?.runtimeStatus === "degraded" ||
    input.decisionSnapshot?.runtimeStatus === "unstable";

  if (!foresightReady || !decisionStrained) return null;

  return createObservation(
    "foresight_action_disconnect",
    "partially_integrated",
    "moderate",
    "foresight_action_integration",
    "Foresight disconnects from decision orchestration — anticipatory intelligence and executable action pathways require observational resynchronization.",
    ["foresight_action_disconnect", "anticipatory_execution_gap"],
    ["foresight_action_integration_strain", "critical_strategic_disconnect"],
    0.84,
    now
  );
}

function buildConsensusGovernanceDisconnect(
  input: FinalStrategicIntegrationInput,
  now: number
): StrategicIntegrationObservation | null {
  const metaGovernance =
    input.unifiedSelfReflectiveSnapshot?.summary.governanceAlignment === "aligned" ||
    input.unifiedSelfReflectiveSnapshot?.summary.governanceAlignment === "coherent";
  const consensusFragmented =
    input.unifiedConsensusSnapshot?.runtimeStatus === "fragmented" ||
    input.unifiedConsensusSnapshot?.summary.negotiationState === "fragmented";

  if (!metaGovernance || !consensusFragmented) return null;

  return createObservation(
    "consensus_governance_disconnect",
    "partially_integrated",
    "moderate",
    "consensus_governance_integration",
    "Consensus intelligence disconnects from governance calibration — distributed cognition and meta-regulation require bounded integration review.",
    ["consensus_governance_disconnect", "governance_consensus_divergence"],
    ["consensus_governance_integration_gap"],
    0.83,
    now
  );
}

function buildInstitutionalAwarenessDisconnect(
  input: FinalStrategicIntegrationInput,
  now: number
): StrategicIntegrationObservation | null {
  const institutionalPressured =
    input.unifiedInstitutionalConsciousnessSnapshot?.runtimeStatus === "pressured";
  const awarenessFragmented =
    (input.awarenessSynchronizationSnapshot?.observationCount ?? 0) < 1 ||
    input.awarenessSynchronizationSnapshot?.synchronizationSummary.dominantAwarenessState ===
      "fragmented";

  if (!institutionalPressured && !awarenessFragmented) return null;

  return createObservation(
    "institutional_awareness_disconnect",
    "partially_integrated",
    "moderate",
    "institutional_awareness_integration",
    "Institutional consciousness may disconnect from operational awareness — macro-stewardship and synchronized cognition require integration monitoring.",
    ["institutional_awareness_disconnect", "stewardship_operational_gap"],
    ["institutional_awareness_integration_strain"],
    0.84,
    now
  );
}

function buildRuntimeFragmentation(
  input: FinalStrategicIntegrationInput,
  now: number
): StrategicIntegrationObservation | null {
  const activeRuntimes = countActiveUnifiedRuntimes(input);
  const minRuntimes = FINAL_STRATEGIC_INTEGRATION_MIN_UNIFIED_RUNTIMES;
  const singularityMissing = (input.cognitiveSingularitySnapshot?.observationCount ?? 0) < 1;

  if (activeRuntimes >= minRuntimes + 1 && !singularityMissing) return null;

  return createObservation(
    "runtime_fragmentation",
    "fragmented",
    "weak",
    "runtime_convergence",
    "Total runtime fragmentation detected — enterprise intelligence runtimes not yet converging into one coherent cognitive runtime.",
    ["runtime_fragmentation", "partial_runtime_convergence"],
    ["total_runtime_fragmentation_risk", "cross_runtime_output_divergence"],
    0.82,
    now
  );
}

function buildEnterpriseGradeFinalConvergence(
  input: FinalStrategicIntegrationInput,
  now: number
): StrategicIntegrationObservation | null {
  const resonanceHarmonic =
    input.enterpriseStrategicResonanceSnapshot?.strategicResonanceSummary.dominantResonanceState ===
      "strategically_resonant" ||
    input.enterpriseStrategicResonanceSnapshot?.strategicResonanceSummary.dominantResonanceStrength ===
      "enterprise_grade";
  const coherenceFullyAligned =
    input.unifiedStrategicCoherenceSnapshot?.totalSystemAlignmentSummary.dominantCoherenceState ===
      "fully_aligned";
  const runtimesUnified = countActiveUnifiedRuntimes(input) >= 6;
  const willCommitted =
    input.enterpriseStrategicWillSnapshot?.strategicWillSummary.dominantWillState ===
      "strategically_committed" ||
    input.enterpriseStrategicWillSnapshot?.strategicWillSummary.dominantWillState ===
      "directionally_committed";
  const continuityStable = input.continuityPreserved === true;

  if (!resonanceHarmonic || !coherenceFullyAligned || !runtimesUnified || !willCommitted || !continuityStable) {
    return null;
  }

  return createObservation(
    "enterprise_grade_final_convergence",
    "fully_integrated",
    "enterprise_grade",
    "runtime_convergence",
    "All enterprise intelligence runtimes converge into one stable, coherent, governed, explainable, and strategically aligned cognitive runtime — bounded final integration intelligence, not AGI convergence.",
    [
      "enterprise_grade_final_convergence",
      "total_cognitive_runtime_convergence",
      "final_strategic_integration_complete",
    ],
    [],
    0.93,
    now
  );
}

function buildTotalRuntimeConvergenceSignal(
  observation: StrategicIntegrationObservation,
  now: number
): TotalRuntimeConvergenceSignal {
  return {
    signalId: stableSignature(["total-runtime-convergence-signal", observation.integrationId]).slice(
      0,
      48
    ),
    signalLabel: observation.integrationState.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.integrationCategory]),
    signalIntensity:
      observation.integrationStrength === "enterprise_grade" ||
      observation.integrationStrength === "unified"
        ? "high"
        : "moderate",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildEnterpriseCognitiveIntegrationField(
  observation: StrategicIntegrationObservation,
  now: number
): EnterpriseCognitiveIntegrationField | null {
  if (
    observation.integrationState !== "unified" &&
    observation.integrationState !== "fully_integrated" &&
    observation.integrationState !== "converging"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["enterprise-cognitive-integration-field", observation.integrationId]).slice(
      0,
      48
    ),
    fieldLabel: observation.integrationState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    integrationPosture:
      observation.integrationStrength === "enterprise_grade"
        ? "executive_grade"
        : observation.integrationStrength === "unified" ||
            observation.integrationStrength === "integrated"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.integrationCategory]),
    generatedAt: now,
  };
}

function buildFragmentationIndicator(
  observation: StrategicIntegrationObservation,
  now: number
): RuntimeFragmentationIndicator | null {
  if (observation.fragmentationRisks.length < 1 && observation.integrationState !== "fragmented") {
    return null;
  }
  return {
    indicatorId: stableSignature(["runtime-fragmentation-indicator", observation.integrationId]).slice(
      0,
      48
    ),
    indicatorLabel: observation.integrationCategory.replace(/_/g, " "),
    indicatorSummary: observation.summary.slice(0, 100),
    fragmentationSeverity:
      observation.fragmentationRisks.length > 1
        ? "high"
        : observation.integrationState === "fragmented" ||
            observation.integrationState === "partially_integrated"
          ? "moderate"
          : "low",
    linkedCategories: Object.freeze([observation.integrationCategory]),
    generatedAt: now,
  };
}

function buildFinalStrategicIntegrationSnapshot(
  organizationId: string,
  observations: StrategicIntegrationObservation[],
  signals: TotalRuntimeConvergenceSignal[],
  fields: EnterpriseCognitiveIntegrationField[],
  indicators: RuntimeFragmentationIndicator[],
  now: number
): FinalStrategicIntegrationSnapshot {
  const top = observations[0];
  const finalIntegrationSummary: FinalIntegrationSummary = top
    ? {
        dominantIntegrationState: top.integrationState,
        dominantIntegrationStrength: top.integrationStrength,
        integrationHeadline: top.summary,
        convergencePosture:
          top.integrationStrength === "enterprise_grade"
            ? "executive_grade"
            : top.integrationStrength === "unified" || top.integrationStrength === "integrated"
              ? "high"
              : top.integrationStrength === "moderate"
                ? "moderate"
                : "low",
      }
    : {
        dominantIntegrationState: "fragmented",
        dominantIntegrationStrength: "weak",
        integrationHeadline:
          "Final strategic integration awaiting sufficient strategic-resonance depth.",
        convergencePosture: "low",
      };

  const signature = stableSignature([
    "d9-9-9-final-strategic-integration-snapshot",
    organizationId,
    observations.map((o) => o.integrationId),
    finalIntegrationSummary.convergencePosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    finalIntegrationSummary,
    recentObservations: Object.freeze(observations.slice(0, 6)),
    totalRuntimeConvergenceSignals: Object.freeze(signals.slice(0, 6)),
    enterpriseCognitiveIntegrationFields: Object.freeze(fields.slice(0, 6)),
    fragmentationIndicators: Object.freeze(indicators.slice(0, 6)),
  };
}

export function evaluateFinalStrategicIntegration(
  input: FinalStrategicIntegrationInput
): FinalStrategicIntegrationResult {
  if (!beginFinalStrategicIntegrationEvaluation()) {
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
    const store = getFinalStrategicIntegrationStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-9-9-final-strategic-integration-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.enterpriseStrategicResonanceSnapshot?.signature ?? "no-strategic-resonance",
      input.enterpriseStrategicEquilibriumSnapshot?.signature ?? "no-strategic-equilibrium",
      input.unifiedStrategicCoherenceSnapshot?.signature ?? "no-strategic-coherence",
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
      !shouldEvaluateFinalStrategicIntegration(
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

    if (!hasStrategicResonanceDepth(input)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_strategic_resonance_depth",
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

    if (activeRuntimes < FINAL_STRATEGIC_INTEGRATION_MIN_UNIFIED_RUNTIMES) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_unified_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: StrategicIntegrationObservation[] = [];

    const baseline = buildEnterpriseFinalIntegrationBaseline(input, now);
    if (baseline) candidates.push(baseline);

    const runtimeConvergence = buildRuntimeConvergence(input, now);
    if (runtimeConvergence) candidates.push(runtimeConvergence);

    const foresightAction = buildForesightActionIntegration(input, now);
    if (foresightAction) candidates.push(foresightAction);

    const memoryIdentity = buildMemoryIdentityAlignment(input, now);
    if (memoryIdentity) candidates.push(memoryIdentity);

    const consensusGovernance = buildConsensusGovernanceCoherence(input, now);
    if (consensusGovernance) candidates.push(consensusGovernance);

    const institutionalAwareness = buildInstitutionalAwarenessSupport(input, now);
    if (institutionalAwareness) candidates.push(institutionalAwareness);

    const strategicAlignment = buildStrategicAlignmentConvergence(input, now);
    if (strategicAlignment) candidates.push(strategicAlignment);

    const operationalUnification = buildOperationalUnification(input, now);
    if (operationalUnification) candidates.push(operationalUnification);

    const memoryDisconnect = buildMemoryIdentityDisconnect(input, now);
    if (memoryDisconnect) candidates.push(memoryDisconnect);

    const foresightDisconnect = buildForesightActionDisconnect(input, now);
    if (foresightDisconnect) candidates.push(foresightDisconnect);

    const consensusDisconnect = buildConsensusGovernanceDisconnect(input, now);
    if (consensusDisconnect) candidates.push(consensusDisconnect);

    const institutionalDisconnect = buildInstitutionalAwarenessDisconnect(input, now);
    if (institutionalDisconnect) candidates.push(institutionalDisconnect);

    const fragmentation = buildRuntimeFragmentation(input, now);
    if (fragmentation) candidates.push(fragmentation);

    const enterpriseGrade = buildEnterpriseGradeFinalConvergence(input, now);
    if (enterpriseGrade) candidates.push(enterpriseGrade);

    const retained = candidates
      .filter(shouldRetainStrategicIntegrationObservation)
      .sort(
        (a, b) =>
          integrationStateRank(b.integrationState) - integrationStateRank(a.integrationState) ||
          integrationStrengthRank(b.integrationStrength) -
            integrationStrengthRank(a.integrationStrength) ||
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

    const priorIds = new Set(prior.observations.map((o) => o.integrationId));
    const newCount = retained.filter((o) => !priorIds.has(o.integrationId)).length;

    const signals = retained.map((o) => buildTotalRuntimeConvergenceSignal(o, now));
    const fields = retained
      .map((o) => buildEnterpriseCognitiveIntegrationField(o, now))
      .filter((f): f is EnterpriseCognitiveIntegrationField => f !== null);
    const indicators = retained
      .map((o) => buildFragmentationIndicator(o, now))
      .filter((i): i is RuntimeFragmentationIndicator => i !== null);

    store.upsertObservations(retained, now);
    store.upsertTotalRuntimeConvergenceSignals(signals, now);
    store.upsertEnterpriseCognitiveIntegrationFields(fields, now);
    store.upsertFragmentationIndicators(indicators, now);

    const snapshot = buildFinalStrategicIntegrationSnapshot(
      organizationId,
      retained,
      signals,
      fields,
      indicators,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastIntegrationState(snapshot.finalIntegrationSummary.dominantIntegrationState);

    const priorState = prior.lastIntegrationState;

    if (baseline || runtimeConvergence || strategicAlignment || enterpriseGrade) {
      devLog("final integration strengthening — total cognitive runtime convergence advancing");
    }

    if (fragmentation || foresightDisconnect || consensusDisconnect || institutionalDisconnect) {
      devLog("total runtime fragmentation — cross-runtime disconnect mapped without autonomous repair");
    }

    if (enterpriseGrade) {
      devLog("enterprise-grade convergence formation — final strategic integration stabilized");
    }

    if (
      foresightDisconnect ||
      memoryDisconnect ||
      consensusDisconnect ||
      institutionalDisconnect
    ) {
      devLog("critical strategic disconnect — bounded integration gap requires observational review");
    }

    if (
      priorState &&
      priorState !== snapshot.finalIntegrationSummary.dominantIntegrationState &&
      (snapshot.finalIntegrationSummary.dominantIntegrationState === "unified" ||
        snapshot.finalIntegrationSummary.dominantIntegrationState === "fully_integrated")
    ) {
      devLog(
        `integration state shift — ${priorState} → ${snapshot.finalIntegrationSummary.dominantIntegrationState}`
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
    endFinalStrategicIntegrationEvaluation();
  }
}
