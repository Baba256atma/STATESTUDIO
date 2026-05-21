import { stableSignature } from "../intelligence/shared/dedupe";
import { runtimeStatusRank } from "../institutional-consciousness/unifiedInstitutionalConsciousnessGuards";
import {
  beginStrategicResonanceEvaluation,
  clampStrategicResonanceConfidence,
  endStrategicResonanceEvaluation,
  resonanceStateRank,
  resonanceStrengthRank,
  shouldEvaluateStrategicResonance,
  shouldRetainStrategicResonanceObservation,
  STRATEGIC_RESONANCE_MIN_INSTITUTIONAL_SUBSYSTEMS,
  STRATEGIC_RESONANCE_MIN_STRATEGIC_EQUILIBRIUM_OBSERVATIONS,
  STRATEGIC_RESONANCE_MIN_UNIFIED_RUNTIMES,
} from "./strategicResonanceGuards";
import { getStrategicResonanceStore } from "./strategicResonanceStore";
import type {
  CrossSystemResonanceSignal,
  EnterpriseStrategicResonanceSnapshot,
  HarmonicAlignmentField,
  ResonanceAmplificationIndicator,
  ResonanceCategory,
  ResonanceState,
  ResonanceStrength,
  StrategicReinforcementObservation,
  StrategicResonanceSummary,
  UnifiedStrategicResonanceInput,
  UnifiedStrategicResonanceResult,
} from "./strategicResonanceTypes";

const DEV_LOG_PREFIX = "[Nexora][StrategicResonance]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildResonanceId(label: string): string {
  return stableSignature(["strategic-resonance", label]).slice(0, 56);
}

function isRuntimeMature(status: string | undefined): boolean {
  return status === "stable" || status === "recovering" || status === "adaptive";
}

function countActiveUnifiedRuntimes(input: UnifiedStrategicResonanceInput): number {
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

function hasStrategicEquilibriumDepth(input: UnifiedStrategicResonanceInput): boolean {
  const snapshot = input.enterpriseStrategicEquilibriumSnapshot;
  if (!snapshot) return false;
  return snapshot.observationCount >= STRATEGIC_RESONANCE_MIN_STRATEGIC_EQUILIBRIUM_OBSERVATIONS;
}

function hasUnifiedInstitutionalConsciousnessDepth(input: UnifiedStrategicResonanceInput): boolean {
  const snapshot = input.unifiedInstitutionalConsciousnessSnapshot;
  if (!snapshot) return false;
  return (
    snapshot.activeSubsystems.length >= STRATEGIC_RESONANCE_MIN_INSTITUTIONAL_SUBSYSTEMS &&
    runtimeStatusRank(snapshot.runtimeStatus) >= runtimeStatusRank("pressured")
  );
}

function hasEnterpriseCognitionDepth(input: UnifiedStrategicResonanceInput): boolean {
  return Boolean(input.cognitionSnapshot?.signature?.trim());
}

function createObservation(
  label: string,
  resonanceState: ResonanceState,
  resonanceStrength: ResonanceStrength,
  resonanceCategory: ResonanceCategory,
  summary: string,
  resonanceSignals: string[],
  amplificationRisks: string[],
  confidence: number,
  now: number
): StrategicReinforcementObservation {
  return {
    resonanceId: buildResonanceId(label),
    resonanceState,
    resonanceStrength,
    resonanceCategory,
    summary,
    resonanceSignals: Object.freeze(resonanceSignals),
    amplificationRisks: Object.freeze(amplificationRisks),
    confidence: clampStrategicResonanceConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildEnterpriseStrategicResonanceBaseline(
  input: UnifiedStrategicResonanceInput,
  now: number
): StrategicReinforcementObservation | null {
  const equilibriumReady = hasStrategicEquilibriumDepth(input);
  const institutionalReady = hasUnifiedInstitutionalConsciousnessDepth(input);
  const cognitionReady = hasEnterpriseCognitionDepth(input);
  const runtimesReady = countActiveUnifiedRuntimes(input) >= STRATEGIC_RESONANCE_MIN_UNIFIED_RUNTIMES;

  if (!equilibriumReady || !institutionalReady || !cognitionReady || !runtimesReady) return null;

  return createObservation(
    "enterprise_strategic_resonance_01",
    "harmonically_aligned",
    "harmonic",
    "resilience_resonance",
    "Enterprise cognition systems are mutually reinforcing resilience continuity, governance stabilization, trust calibration, and long-horizon stewardship without unsafe amplification.",
    [
      "memory_foresight_resonance",
      "foresight_decision_alignment",
      "intent_identity_will_reinforcement",
      "consensus_meta_stability",
    ],
    ["minor_consensus_overreinforcement"],
    0.94,
    now
  );
}

function buildMemoryForesightResonance(
  input: UnifiedStrategicResonanceInput,
  now: number
): StrategicReinforcementObservation | null {
  const memoryReady =
    input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing";
  const foresightReady =
    input.foresightSnapshot?.runtimeStatus === "stable" ||
    input.foresightSnapshot?.runtimeStatus === "recovering";
  const narrativeLinked = Boolean(input.enterpriseNarrativeLine?.trim());

  if (!memoryReady || !foresightReady) return null;

  return createObservation(
    "memory_foresight_resonance",
    "reinforcing",
    "reinforcing",
    "memory_foresight_resonance",
    "Institutional memory supports foresight — historical cognition reinforces anticipatory strategic pathways without autonomous amplification.",
    [
      "memory_foresight_resonance",
      narrativeLinked ? "narrative_memory_foresight_link" : "institutional_memory_foresight_support",
    ],
    [],
    0.9,
    now
  );
}

function buildForesightDecisionAlignment(
  input: UnifiedStrategicResonanceInput,
  now: number
): StrategicReinforcementObservation | null {
  const foresightReady =
    input.foresightSnapshot?.runtimeStatus === "stable" ||
    input.foresightSnapshot?.runtimeStatus === "recovering";
  const decisionReady =
    input.decisionSnapshot?.runtimeStatus === "stable" ||
    input.decisionSnapshot?.runtimeStatus === "recovering";

  if (!foresightReady || !decisionReady) return null;

  return createObservation(
    "foresight_decision_alignment",
    "harmonically_aligned",
    "harmonic",
    "foresight_decision_resonance",
    "Foresight supports decision orchestration — anticipatory reasoning and executable action reinforce one another within bounded harmonic alignment.",
    ["foresight_decision_alignment", "anticipatory_orchestration_reinforcement"],
    [],
    0.91,
    now
  );
}

function buildIntentIdentityWillReinforcement(
  input: UnifiedStrategicResonanceInput,
  now: number
): StrategicReinforcementObservation | null {
  const intentAligned =
    input.unifiedStrategicIntentSnapshot?.strategicIntentSummary.dominantIntentState ===
      "strategically_unified" ||
    input.unifiedStrategicIntentSnapshot?.strategicIntentSummary.dominantIntentState ===
      "enterprise_purpose_aligned";
  const identityAligned =
    input.enterpriseStrategicIdentitySnapshot?.strategicIdentitySummary.dominantIdentityState ===
      "self_consistent" ||
    input.enterpriseStrategicIdentitySnapshot?.strategicIdentitySummary.dominantIdentityState ===
      "strategically_integrated";
  const willCommitted =
    input.enterpriseStrategicWillSnapshot?.strategicWillSummary.dominantWillState ===
      "directionally_committed" ||
    input.enterpriseStrategicWillSnapshot?.strategicWillSummary.dominantWillState ===
      "strategically_committed";

  if (!intentAligned || !identityAligned || !willCommitted) return null;

  return createObservation(
    "intent_identity_will_reinforcement",
    "harmonically_aligned",
    "harmonic",
    "intent_identity_will_resonance",
    "Strategic intent, identity, and will mutually reinforce executive direction — harmonic alignment across purpose, self-consistency, and commitment.",
    [
      "intent_identity_will_reinforcement",
      "purpose_identity_commitment_harmony",
    ],
    [],
    0.92,
    now
  );
}

function buildConsensusMetaStability(
  input: UnifiedStrategicResonanceInput,
  now: number
): StrategicReinforcementObservation | null {
  const consensusReady = isRuntimeMature(input.unifiedConsensusSnapshot?.runtimeStatus);
  const metaReady =
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "stable" ||
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "recovering" ||
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "adaptive";
  const governanceStable =
    input.unifiedSelfReflectiveSnapshot?.summary.governanceAlignment === "aligned" ||
    input.unifiedSelfReflectiveSnapshot?.summary.governanceAlignment === "coherent";
  const diversityPreserved =
    input.unifiedConsensusSnapshot?.summary.diversityState.includes("preserved") ||
    input.unifiedConsensusSnapshot?.summary.diversityState.includes("balanced") ||
    input.unifiedConsensusSnapshot?.summary.diversityState.includes("stable");

  if (!consensusReady || !metaReady || !governanceStable) return null;

  return createObservation(
    "consensus_meta_stability",
    "reinforcing",
    diversityPreserved ? "harmonic" : "reinforcing",
    "consensus_meta_resonance",
    "Consensus intelligence and meta-cognition reinforce trust calibration and diversity preservation — cross-system stability without speculative harmonic claims.",
    ["consensus_meta_stability", "governance_trust_reinforcement"],
    diversityPreserved ? [] : ["minor_consensus_overreinforcement"],
    diversityPreserved ? 0.9 : 0.87,
    now
  );
}

function buildInstitutionalConsciousnessResonance(
  input: UnifiedStrategicResonanceInput,
  now: number
): StrategicReinforcementObservation | null {
  const institutionalReady = hasUnifiedInstitutionalConsciousnessDepth(input);
  const continuitySupported =
    input.unifiedInstitutionalConsciousnessSnapshot?.summary.continuityState === "preserved" ||
    input.unifiedInstitutionalConsciousnessSnapshot?.summary.continuityState === "adaptive";
  const singularityReady = (input.cognitiveSingularitySnapshot?.observationCount ?? 0) >= 1;

  if (!institutionalReady || !continuitySupported || !singularityReady) return null;

  return createObservation(
    "institutional_consciousness_resonance",
    "reinforcing",
    "reinforcing",
    "institutional_consciousness_resonance",
    "Institutional consciousness supports long-horizon continuity — macro-awareness reinforces enterprise cognition singularity without autonomous control.",
    [
      "institutional_consciousness_resonance",
      "long_horizon_stewardship_reinforcement",
    ],
    [],
    0.89,
    now
  );
}

function buildGovernanceResonance(
  input: UnifiedStrategicResonanceInput,
  now: number
): StrategicReinforcementObservation | null {
  const metaGovernance =
    input.unifiedSelfReflectiveSnapshot?.summary.governanceAlignment === "aligned" ||
    input.unifiedSelfReflectiveSnapshot?.summary.governanceAlignment === "coherent";
  const consensusGovernance =
    input.unifiedConsensusSnapshot?.summary.governanceState === "stable" ||
    input.unifiedConsensusSnapshot?.summary.governanceState === "governed" ||
    input.unifiedConsensusSnapshot?.summary.governanceState === "aligned";

  if (!metaGovernance || !consensusGovernance) return null;

  return createObservation(
    "governance_resonance",
    "reinforcing",
    "reinforcing",
    "governance_resonance",
    "Governance pathways reinforce across meta-cognition and consensus intelligence — executive regulation and distributed cognition harmonize observational awareness.",
    ["governance_resonance", "distributed_regulation_alignment"],
    [],
    0.88,
    now
  );
}

function buildResilienceResonance(
  input: UnifiedStrategicResonanceInput,
  now: number
): StrategicReinforcementObservation | null {
  const continuity = input.continuityPreserved === true;
  const equilibriumBalanced =
    input.enterpriseStrategicEquilibriumSnapshot?.strategicEquilibriumSummary
      .dominantEquilibriumState === "balanced" ||
    input.enterpriseStrategicEquilibriumSnapshot?.strategicEquilibriumSummary
      .dominantEquilibriumState === "strategically_stable";
  const memoryActive =
    input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing";

  if (!continuity || !memoryActive) return null;

  return createObservation(
    "resilience_resonance",
    equilibriumBalanced ? "harmonically_aligned" : "reinforcing",
    "reinforcing",
    "resilience_resonance",
    "Resilience continuity reinforces institutional memory and equilibrium posture — survivability signals strengthen cross-system reinforcement safely.",
    ["resilience_resonance", "continuity_memory_reinforcement"],
    equilibriumBalanced ? [] : ["localized_resilience_equilibrium_tension"],
    equilibriumBalanced ? 0.9 : 0.86,
    now
  );
}

function buildUnsafeOverconfidenceAmplification(
  input: UnifiedStrategicResonanceInput,
  now: number
): StrategicReinforcementObservation | null {
  const overconfident =
    input.unifiedSelfReflectiveSnapshot?.summary.trustCalibration === "elevated" ||
    input.unifiedSelfReflectiveSnapshot?.summary.trustCalibration === "overcalibrated";
  const uncertaintyLow =
    input.unifiedSelfReflectiveSnapshot?.summary.uncertaintyPosture === "suppressed" ||
    input.unifiedSelfReflectiveSnapshot?.summary.uncertaintyPosture === "minimized";
  const coherenceStrong =
    input.unifiedStrategicCoherenceSnapshot?.totalSystemAlignmentSummary.dominantCoherenceStrength ===
      "unified" ||
    input.unifiedStrategicCoherenceSnapshot?.totalSystemAlignmentSummary.dominantCoherenceStrength ===
      "enterprise_grade";

  if (!overconfident || !uncertaintyLow) return null;

  return createObservation(
    "unsafe_overconfidence_amplification",
    "unstable",
    "moderate",
    "consensus_meta_resonance",
    "Overconfidence may amplify weak signals — trust calibration drift requires observational dampening awareness without autonomous correction.",
    ["unsafe_overconfidence_amplification", "trust_signal_amplification_risk"],
    [
      "overconfidence_spread_risk",
      coherenceStrong ? "coherence_overtrust_reinforcement" : "localized_trust_amplification",
    ],
    0.84,
    now
  );
}

function buildConsensusOverreinforcement(
  input: UnifiedStrategicResonanceInput,
  now: number
): StrategicReinforcementObservation | null {
  const consensusStable = isRuntimeMature(input.unifiedConsensusSnapshot?.runtimeStatus);
  const diversityWeak =
    input.unifiedConsensusSnapshot?.summary.diversityState.includes("weak") ||
    input.unifiedConsensusSnapshot?.summary.diversityState.includes("low");
  const negotiationCompressed =
    input.unifiedConsensusSnapshot?.summary.negotiationState === "compressed" ||
    input.unifiedConsensusSnapshot?.summary.negotiationState === "converged";

  if (!consensusStable || (!diversityWeak && !negotiationCompressed)) return null;

  return createObservation(
    "consensus_overreinforcement",
    "unstable",
    "moderate",
    "consensus_meta_resonance",
    "Consensus may over-reinforce agreement — groupthink amplification risk mapped within bounded resonance intelligence, not mystical harmonics.",
    ["consensus_overreinforcement", "agreement_amplification_loop"],
    ["minor_consensus_overreinforcement", "perspective_compression_risk"],
    0.83,
    now
  );
}

function buildDestructiveAssumptionLoop(
  input: UnifiedStrategicResonanceInput,
  now: number
): StrategicReinforcementObservation | null {
  const foresightConfident =
    input.foresightSnapshot?.runtimeStatus === "stable" ||
    input.foresightSnapshot?.runtimeStatus === "recovering";
  const decisionStrained =
    input.decisionSnapshot?.runtimeStatus === "degraded" ||
    input.decisionSnapshot?.runtimeStatus === "unstable";
  const willOvercommitted =
    input.enterpriseStrategicWillSnapshot?.strategicWillSummary.dominantWillState ===
      "strategically_committed" &&
    input.enterpriseStrategicWillSnapshot?.strategicWillSummary.dominantCommitmentStrength ===
      "enterprise_grade";

  if (!foresightConfident || !decisionStrained) return null;

  return createObservation(
    "destructive_assumption_loop",
    "dissonant",
    "weak",
    "foresight_decision_resonance",
    "Decision loops may reinforce flawed assumptions — foresight-decision dissonance prevents unsafe cross-system amplification without scene mutation.",
    ["destructive_assumption_loop", "foresight_decision_dissonance"],
    [
      "bad_assumption_reinforcement_risk",
      willOvercommitted ? "commitment_amplification_under_strain" : "execution_assumption_drift",
    ],
    0.82,
    now
  );
}

function buildStrategicDissonance(
  input: UnifiedStrategicResonanceInput,
  now: number
): StrategicReinforcementObservation | null {
  const equilibriumImbalanced =
    input.enterpriseStrategicEquilibriumSnapshot?.strategicEquilibriumSummary
      .dominantEquilibriumState === "imbalanced" ||
    input.enterpriseStrategicEquilibriumSnapshot?.strategicEquilibriumSummary
      .dominantEquilibriumState === "unstable";
  const coherenceDrifting =
    input.unifiedStrategicCoherenceSnapshot?.totalSystemAlignmentSummary.dominantCoherenceState ===
      "drifting" ||
    input.unifiedStrategicCoherenceSnapshot?.totalSystemAlignmentSummary.dominantCoherenceState ===
      "partially_aligned";

  if (!equilibriumImbalanced && !coherenceDrifting) return null;

  return createObservation(
    "strategic_dissonance",
    "dissonant",
    "moderate",
    "unknown",
    "Strategic dissonance emerging — equilibrium imbalance and coherence drift reduce cross-system reinforcement quality.",
    ["strategic_dissonance", "harmonic_alignment_degradation"],
    ["cross_system_reinforcement_strain", "executive_direction_fragmentation_risk"],
    0.85,
    now
  );
}

function buildEnterpriseGradeHarmonicResonance(
  input: UnifiedStrategicResonanceInput,
  now: number
): StrategicReinforcementObservation | null {
  const equilibriumStable =
    input.enterpriseStrategicEquilibriumSnapshot?.strategicEquilibriumSummary
      .dominantEquilibriumState === "strategically_stable" ||
    input.enterpriseStrategicEquilibriumSnapshot?.strategicEquilibriumSummary
      .dominantBalanceStrength === "enterprise_grade";
  const coherenceAligned =
    input.unifiedStrategicCoherenceSnapshot?.totalSystemAlignmentSummary.dominantCoherenceState ===
      "coherent" ||
    input.unifiedStrategicCoherenceSnapshot?.totalSystemAlignmentSummary.dominantCoherenceState ===
      "fully_aligned";
  const runtimesHarmonic = countActiveUnifiedRuntimes(input) >= 5;
  const awarenessSynced = (input.awarenessSynchronizationSnapshot?.observationCount ?? 0) >= 1;

  if (!equilibriumStable || !coherenceAligned || !runtimesHarmonic || !awarenessSynced) {
    return null;
  }

  return createObservation(
    "enterprise_grade_harmonic_resonance",
    "strategically_resonant",
    "enterprise_grade",
    "institutional_consciousness_resonance",
    "Enterprise cognition systems reinforce one another in a stable, mutually strengthening strategic pattern — bounded harmonic alignment intelligence, not AGI emergence.",
    [
      "enterprise_grade_harmonic_resonance",
      "cross_system_strategic_reinforcement",
      "harmonic_alignment_formation",
    ],
    [],
    0.93,
    now
  );
}

function buildCrossSystemResonanceSignal(
  observation: StrategicReinforcementObservation,
  now: number
): CrossSystemResonanceSignal {
  return {
    signalId: stableSignature(["cross-system-resonance-signal", observation.resonanceId]).slice(
      0,
      48
    ),
    signalLabel: observation.resonanceState.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.resonanceCategory]),
    signalIntensity:
      observation.resonanceStrength === "enterprise_grade" ||
      observation.resonanceStrength === "harmonic"
        ? "high"
        : "moderate",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildHarmonicAlignmentField(
  observation: StrategicReinforcementObservation,
  now: number
): HarmonicAlignmentField | null {
  if (
    observation.resonanceState !== "harmonically_aligned" &&
    observation.resonanceState !== "strategically_resonant"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["harmonic-alignment-field", observation.resonanceId]).slice(0, 48),
    fieldLabel: observation.resonanceState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    harmonicPosture:
      observation.resonanceStrength === "enterprise_grade"
        ? "executive_grade"
        : observation.resonanceStrength === "harmonic" ||
            observation.resonanceStrength === "reinforcing"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.resonanceCategory]),
    generatedAt: now,
  };
}

function buildAmplificationIndicator(
  observation: StrategicReinforcementObservation,
  now: number
): ResonanceAmplificationIndicator | null {
  if (observation.amplificationRisks.length < 1 && observation.resonanceState !== "dissonant") {
    return null;
  }
  return {
    indicatorId: stableSignature(["resonance-amplification-indicator", observation.resonanceId]).slice(
      0,
      48
    ),
    indicatorLabel: observation.resonanceCategory.replace(/_/g, " "),
    indicatorSummary: observation.summary.slice(0, 100),
    amplificationSeverity:
      observation.amplificationRisks.length > 1
        ? "high"
        : observation.resonanceState === "dissonant" || observation.resonanceState === "unstable"
          ? "moderate"
          : "low",
    linkedCategories: Object.freeze([observation.resonanceCategory]),
    generatedAt: now,
  };
}

function buildStrategicResonanceSnapshot(
  organizationId: string,
  observations: StrategicReinforcementObservation[],
  signals: CrossSystemResonanceSignal[],
  fields: HarmonicAlignmentField[],
  indicators: ResonanceAmplificationIndicator[],
  now: number
): EnterpriseStrategicResonanceSnapshot {
  const top = observations[0];
  const strategicResonanceSummary: StrategicResonanceSummary = top
    ? {
        dominantResonanceState: top.resonanceState,
        dominantResonanceStrength: top.resonanceStrength,
        resonanceHeadline: top.summary,
        harmonicPosture:
          top.resonanceStrength === "enterprise_grade"
            ? "executive_grade"
            : top.resonanceStrength === "harmonic" || top.resonanceStrength === "reinforcing"
              ? "high"
              : top.resonanceStrength === "moderate"
                ? "moderate"
                : "low",
      }
    : {
        dominantResonanceState: "dissonant",
        dominantResonanceStrength: "weak",
        resonanceHeadline:
          "Strategic resonance awaiting sufficient strategic-equilibrium depth.",
        harmonicPosture: "low",
      };

  const signature = stableSignature([
    "d9-9-8-strategic-resonance-snapshot",
    organizationId,
    observations.map((o) => o.resonanceId),
    strategicResonanceSummary.harmonicPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    strategicResonanceSummary,
    recentObservations: Object.freeze(observations.slice(0, 6)),
    crossSystemResonanceSignals: Object.freeze(signals.slice(0, 6)),
    harmonicAlignmentFields: Object.freeze(fields.slice(0, 6)),
    amplificationIndicators: Object.freeze(indicators.slice(0, 6)),
  };
}

export function evaluateUnifiedStrategicResonance(
  input: UnifiedStrategicResonanceInput
): UnifiedStrategicResonanceResult {
  if (!beginStrategicResonanceEvaluation()) {
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
    const store = getStrategicResonanceStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-9-8-strategic-resonance-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
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
      !shouldEvaluateStrategicResonance(
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

    if (!hasStrategicEquilibriumDepth(input)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_strategic_equilibrium_depth",
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

    if (activeRuntimes < STRATEGIC_RESONANCE_MIN_UNIFIED_RUNTIMES) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_unified_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: StrategicReinforcementObservation[] = [];

    const baseline = buildEnterpriseStrategicResonanceBaseline(input, now);
    if (baseline) candidates.push(baseline);

    const memoryForesight = buildMemoryForesightResonance(input, now);
    if (memoryForesight) candidates.push(memoryForesight);

    const foresightDecision = buildForesightDecisionAlignment(input, now);
    if (foresightDecision) candidates.push(foresightDecision);

    const intentIdentityWill = buildIntentIdentityWillReinforcement(input, now);
    if (intentIdentityWill) candidates.push(intentIdentityWill);

    const consensusMeta = buildConsensusMetaStability(input, now);
    if (consensusMeta) candidates.push(consensusMeta);

    const institutional = buildInstitutionalConsciousnessResonance(input, now);
    if (institutional) candidates.push(institutional);

    const governance = buildGovernanceResonance(input, now);
    if (governance) candidates.push(governance);

    const resilience = buildResilienceResonance(input, now);
    if (resilience) candidates.push(resilience);

    const overconfidence = buildUnsafeOverconfidenceAmplification(input, now);
    if (overconfidence) candidates.push(overconfidence);

    const overreinforcement = buildConsensusOverreinforcement(input, now);
    if (overreinforcement) candidates.push(overreinforcement);

    const assumptionLoop = buildDestructiveAssumptionLoop(input, now);
    if (assumptionLoop) candidates.push(assumptionLoop);

    const dissonance = buildStrategicDissonance(input, now);
    if (dissonance) candidates.push(dissonance);

    const enterpriseGrade = buildEnterpriseGradeHarmonicResonance(input, now);
    if (enterpriseGrade) candidates.push(enterpriseGrade);

    const retained = candidates
      .filter(shouldRetainStrategicResonanceObservation)
      .sort(
        (a, b) =>
          resonanceStateRank(b.resonanceState) - resonanceStateRank(a.resonanceState) ||
          resonanceStrengthRank(b.resonanceStrength) - resonanceStrengthRank(a.resonanceStrength) ||
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

    const priorIds = new Set(prior.observations.map((o) => o.resonanceId));
    const newCount = retained.filter((o) => !priorIds.has(o.resonanceId)).length;

    const signals = retained.map((o) => buildCrossSystemResonanceSignal(o, now));
    const fields = retained
      .map((o) => buildHarmonicAlignmentField(o, now))
      .filter((f): f is HarmonicAlignmentField => f !== null);
    const indicators = retained
      .map((o) => buildAmplificationIndicator(o, now))
      .filter((i): i is ResonanceAmplificationIndicator => i !== null);

    store.upsertObservations(retained, now);
    store.upsertCrossSystemResonanceSignals(signals, now);
    store.upsertHarmonicAlignmentFields(fields, now);
    store.upsertAmplificationIndicators(indicators, now);

    const snapshot = buildStrategicResonanceSnapshot(
      organizationId,
      retained,
      signals,
      fields,
      indicators,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastResonanceState(snapshot.strategicResonanceSummary.dominantResonanceState);

    const priorState = prior.lastResonanceState;

    if (baseline || memoryForesight || foresightDecision || enterpriseGrade) {
      devLog("resonance strengthening — cross-system strategic reinforcement advancing");
    }

    if (overconfidence || overreinforcement || assumptionLoop) {
      devLog("unsafe amplification detection — reinforcement risk mapped without autonomous dampening");
    }

    if (enterpriseGrade) {
      devLog("harmonic alignment formation — enterprise strategic resonance stabilized");
    }

    if (dissonance || assumptionLoop) {
      devLog("strategic dissonance emergence — harmonic alignment degradation requires observational review");
    }

    if (
      priorState &&
      priorState !== snapshot.strategicResonanceSummary.dominantResonanceState &&
      (snapshot.strategicResonanceSummary.dominantResonanceState === "harmonically_aligned" ||
        snapshot.strategicResonanceSummary.dominantResonanceState === "strategically_resonant")
    ) {
      devLog(
        `harmonic state shift — ${priorState} → ${snapshot.strategicResonanceSummary.dominantResonanceState}`
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
    endStrategicResonanceEvaluation();
  }
}
