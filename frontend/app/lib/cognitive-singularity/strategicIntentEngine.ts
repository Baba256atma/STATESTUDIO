import { stableSignature } from "../intelligence/shared/dedupe";
import { runtimeStatusRank } from "../institutional-consciousness/unifiedInstitutionalConsciousnessGuards";
import {
  alignmentStrengthRank,
  beginStrategicIntentEvaluation,
  clampStrategicIntentConfidence,
  endStrategicIntentEvaluation,
  intentStateRank,
  shouldEvaluateStrategicIntent,
  shouldRetainPurposeAlignmentObservation,
  STRATEGIC_INTENT_MIN_AWARENESS_SYNC_OBSERVATIONS,
  STRATEGIC_INTENT_MIN_INSTITUTIONAL_SUBSYSTEMS,
  STRATEGIC_INTENT_MIN_SINGULARITY_OBSERVATIONS,
  STRATEGIC_INTENT_MIN_UNIFIED_RUNTIMES,
} from "./strategicIntentGuards";
import { getStrategicIntentStore } from "./strategicIntentStore";
import type {
  AlignmentStrength,
  EnterprisePurposeAlignmentSignal,
  IntentCategory,
  IntentState,
  OrganizationalIntentTopology,
  PurposeAlignmentObservation,
  StrategicDirectionField,
  StrategicIntentSummary,
  UnifiedStrategicIntentInput,
  UnifiedStrategicIntentResult,
  UnifiedStrategicIntentSnapshot,
} from "./strategicIntentTypes";

const DEV_LOG_PREFIX = "[Nexora][StrategicIntent]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildIntentId(label: string): string {
  return stableSignature(["strategic-intent", label]).slice(0, 56);
}

function isRuntimeMature(status: string | undefined): boolean {
  return status === "stable" || status === "recovering" || status === "adaptive";
}

function countActiveUnifiedRuntimes(input: UnifiedStrategicIntentInput): number {
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

function hasAwarenessSynchronizationDepth(input: UnifiedStrategicIntentInput): boolean {
  const snapshot = input.awarenessSynchronizationSnapshot;
  if (!snapshot) return false;
  return snapshot.observationCount >= STRATEGIC_INTENT_MIN_AWARENESS_SYNC_OBSERVATIONS;
}

function hasCognitiveSingularityDepth(input: UnifiedStrategicIntentInput): boolean {
  const snapshot = input.cognitiveSingularitySnapshot;
  if (!snapshot) return false;
  return snapshot.observationCount >= STRATEGIC_INTENT_MIN_SINGULARITY_OBSERVATIONS;
}

function hasUnifiedInstitutionalConsciousnessDepth(input: UnifiedStrategicIntentInput): boolean {
  const snapshot = input.unifiedInstitutionalConsciousnessSnapshot;
  if (!snapshot) return false;
  return (
    snapshot.activeSubsystems.length >= STRATEGIC_INTENT_MIN_INSTITUTIONAL_SUBSYSTEMS &&
    runtimeStatusRank(snapshot.runtimeStatus) >= runtimeStatusRank("pressured")
  );
}

function hasEnterpriseCognitionDepth(input: UnifiedStrategicIntentInput): boolean {
  return Boolean(input.cognitionSnapshot?.signature?.trim());
}

function createObservation(
  label: string,
  intentState: IntentState,
  alignmentStrength: AlignmentStrength,
  intentCategory: IntentCategory,
  summary: string,
  alignmentSignals: string[],
  alignmentRisks: string[],
  confidence: number,
  now: number
): PurposeAlignmentObservation {
  return {
    intentId: buildIntentId(label),
    intentState,
    alignmentStrength,
    intentCategory,
    summary,
    alignmentSignals: Object.freeze(alignmentSignals),
    alignmentRisks: Object.freeze(alignmentRisks),
    confidence: clampStrategicIntentConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildEnterprisePurposeAlignment(
  input: UnifiedStrategicIntentInput,
  now: number
): PurposeAlignmentObservation | null {
  const awarenessReady = hasAwarenessSynchronizationDepth(input);
  const singularityReady = hasCognitiveSingularityDepth(input);
  const institutionalReady = hasUnifiedInstitutionalConsciousnessDepth(input);
  const cognitionReady = hasEnterpriseCognitionDepth(input);
  const runtimesReady = countActiveUnifiedRuntimes(input) >= STRATEGIC_INTENT_MIN_UNIFIED_RUNTIMES;

  if (!awarenessReady || !singularityReady || !institutionalReady || !cognitionReady || !runtimesReady) {
    return null;
  }

  return createObservation(
    "enterprise_purpose_alignment_01",
    "strategically_unified",
    "enterprise_grade",
    "resilience_intent",
    "Enterprise cognition systems are converging around a unified strategic direction centered on resilience continuity, governance stabilization, distributed coordination, and long-horizon operational survivability.",
    [
      "cross_domain_directional_coherence",
      "resilience_intent_alignment",
      "executive_purpose_synchronization",
      "strategic_continuity_reinforcement",
    ],
    ["localized_operational_speed_conflict"],
    0.94,
    now
  );
}

function buildStrongStrategicIntentCoherence(
  input: UnifiedStrategicIntentInput,
  now: number
): PurposeAlignmentObservation | null {
  const decisionAligned =
    input.decisionSnapshot?.runtimeStatus === "stable" ||
    input.decisionSnapshot?.runtimeStatus === "recovering";
  const foresightAligned =
    input.foresightSnapshot?.runtimeStatus === "stable" ||
    input.foresightSnapshot?.runtimeStatus === "recovering";
  const resilienceOriented =
    Boolean(input.resilienceForecastLine?.trim()) ||
    input.decisionSnapshot?.summary.resiliencePathway === "strengthening" ||
    input.decisionSnapshot?.summary.resiliencePathway === "forming" ||
    input.decisionSnapshot?.summary.stabilizationFocus.length > 0;
  const orchestrationCoherent =
    input.decisionSnapshot?.summary.orchestrationState === "coordinated" ||
    input.decisionSnapshot?.summary.orchestrationState === "stabilized" ||
    input.decisionSnapshot?.summary.orchestrationState === "adaptive";

  if (!decisionAligned || !foresightAligned || !resilienceOriented || !orchestrationCoherent) {
    return null;
  }

  return createObservation(
    "strong_strategic_intent_coherence",
    "directionally_coherent",
    "aligned",
    "resilience_intent",
    "Decision orchestration aligned with foresight and resilience pathways — strong strategic intent coherence reinforces executive directional continuity.",
    [
      "decision_foresight_resilience_alignment",
      "strategic_intent_coherence",
      "operational_direction_stability",
    ],
    [],
    0.91,
    now
  );
}

function buildPurposeFragmentationWarning(
  input: UnifiedStrategicIntentInput,
  now: number
): PurposeAlignmentObservation | null {
  const operationalStressed =
    input.operationalTopologyStressed === true || input.fragilityElevated === true;
  const continuityStrained = input.continuityPreserved !== true;
  const memoryContinuityStrong =
    input.memorySnapshot?.summary.strategicMemoryContinuity === "verified" ||
    input.memorySnapshot?.summary.strategicMemoryContinuity === "strong";
  const institutionalContinuityPressured =
    input.unifiedInstitutionalConsciousnessSnapshot?.summary.continuityState === "pressured";

  if (!operationalStressed || !memoryContinuityStrong) return null;
  if (!continuityStrained && !institutionalContinuityPressured) return null;

  return createObservation(
    "purpose_fragmentation_warning",
    "partially_aligned",
    "moderate",
    "continuity_intent",
    "Operational optimization signals conflicting with continuity systems — strategic-purpose fragmentation warning maps bounded objective drift without autonomous goal generation.",
    ["operational_continuity_conflict", "strategic_purpose_fragmentation"],
    [
      "localized_operational_speed_conflict",
      continuityStrained ? "continuity_preservation_strain" : "optimization_continuity_tension",
    ],
    0.87,
    now
  );
}

function buildStewardshipPurposeStrengthening(
  input: UnifiedStrategicIntentInput,
  now: number
): PurposeAlignmentObservation | null {
  const stewardshipReinforced =
    input.unifiedInstitutionalConsciousnessSnapshot?.summary.stewardshipState === "reinforced" ||
    input.unifiedInstitutionalConsciousnessSnapshot?.summary.stewardshipState === "protected";
  const continuityAligned =
    input.unifiedInstitutionalConsciousnessSnapshot?.summary.continuityState === "preserved" ||
    input.unifiedInstitutionalConsciousnessSnapshot?.summary.continuityState === "adaptive";
  const institutionalReady = hasUnifiedInstitutionalConsciousnessDepth(input);

  if (!stewardshipReinforced || !continuityAligned || !institutionalReady) return null;

  return createObservation(
    "stewardship_purpose_strengthening",
    "strategically_unified",
    "unified",
    "stewardship_intent",
    "Institutional consciousness reinforcing long-horizon stewardship — enterprise-purpose alignment strengthening advances macro-system strategic continuity.",
    [
      "stewardship_purpose_alignment",
      "long_horizon_continuity_reinforcement",
      "institutional_consciousness_direction",
    ],
    [],
    0.89,
    now
  );
}

function buildConsensusResilienceDirection(
  input: UnifiedStrategicIntentInput,
  now: number
): PurposeAlignmentObservation | null {
  const consensusCoordinated =
    input.unifiedConsensusSnapshot?.summary.consensusState === "coordinated" ||
    input.unifiedConsensusSnapshot?.summary.consensusState === "collectively_aligned";
  const governanceIntegrity =
    input.unifiedConsensusSnapshot?.summary.governanceState === "integrity preserved" ||
    input.unifiedConsensusSnapshot?.summary.governanceState === "coherent";
  const resilienceGovernance =
    input.unifiedConsensusSnapshot?.summary.diversityState === "balanced" ||
    input.unifiedConsensusSnapshot?.summary.diversityState === "preserved";

  if (!consensusCoordinated || !governanceIntegrity || !resilienceGovernance) return null;

  return createObservation(
    "consensus_resilience_direction",
    "strategically_unified",
    "unified",
    "governance_intent",
    "Consensus intelligence converging around shared resilience goals — unified organizational direction strengthens enterprise-purpose synchronization.",
    [
      "consensus_resilience_alignment",
      "unified_organizational_direction",
      "distributed_governance_coherence",
    ],
    [],
    0.9,
    now
  );
}

function buildExecutiveAlignmentInstability(
  input: UnifiedStrategicIntentInput,
  now: number
): PurposeAlignmentObservation | null {
  const metaDegraded = input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "degraded";
  const governanceDrift =
    input.unifiedSelfReflectiveSnapshot?.summary.governanceAlignment === "drifting" ||
    input.unifiedSelfReflectiveSnapshot?.summary.governanceAlignment === "strained";
  const survivabilityUnstable =
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "strained" ||
    input.unifiedSelfReflectiveSnapshot?.summary.survivabilityState === "fragile";

  if (!metaDegraded && !(governanceDrift && survivabilityUnstable)) return null;

  return createObservation(
    "executive_alignment_instability",
    "partially_aligned",
    "moderate",
    "governance_intent",
    "Meta-cognition detecting cross-domain objective drift — executive alignment instability signal maps bounded strategic inconsistency without speculative AGI purpose claims.",
    ["executive_alignment_instability", "cross_domain_objective_drift"],
    ["executive_objective_divergence", "meta_cognition_consistency_strain"],
    0.86,
    now
  );
}

function buildEnterpriseGradePurposeAlignment(
  input: UnifiedStrategicIntentInput,
  now: number
): PurposeAlignmentObservation | null {
  const runtimesCoherent = countActiveUnifiedRuntimes(input) >= 6;
  const awarenessCoherent =
    input.awarenessSynchronizationSnapshot?.synchronizationSummary.dominantAwarenessState ===
      "unified" ||
    input.awarenessSynchronizationSnapshot?.synchronizationSummary.dominantAwarenessState ===
      "strategically_coherent" ||
    input.awarenessSynchronizationSnapshot?.synchronizationSummary.dominantAwarenessState ===
      "synchronized";
  const singularityCoherent =
    input.cognitiveSingularitySnapshot?.singularitySummary.dominantCognitionState === "unified" ||
    input.cognitiveSingularitySnapshot?.singularitySummary.dominantCognitionState ===
      "strategically_coherent" ||
    input.cognitiveSingularitySnapshot?.singularitySummary.dominantCognitionState === "converging";
  const continuityStable = input.continuityPreserved === true || input.cognitionConverged === true;

  if (!runtimesCoherent || !awarenessCoherent || !singularityCoherent || !continuityStable) {
    return null;
  }

  return createObservation(
    "enterprise_grade_purpose_alignment",
    "enterprise_purpose_aligned",
    "enterprise_grade",
    "resilience_intent",
    "All cognition systems reinforcing the same strategic objective — enterprise-grade purpose alignment represents bounded directional coherence, not self-directed autonomous goals.",
    [
      "enterprise_grade_purpose_alignment",
      "multi_runtime_strategic_coherence",
      "organization_wide_intent_synchronization",
    ],
    [],
    0.92,
    now
  );
}

function buildPurposeAlignmentSignal(
  observation: PurposeAlignmentObservation,
  now: number
): EnterprisePurposeAlignmentSignal {
  return {
    signalId: stableSignature(["enterprise-purpose-alignment-signal", observation.intentId]).slice(
      0,
      48
    ),
    signalLabel: observation.intentState.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.intentCategory]),
    signalIntensity:
      observation.alignmentStrength === "enterprise_grade" ||
      observation.alignmentStrength === "unified"
        ? "high"
        : "moderate",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildStrategicDirectionField(
  observation: PurposeAlignmentObservation,
  now: number
): StrategicDirectionField | null {
  if (
    observation.intentState !== "directionally_coherent" &&
    observation.intentState !== "strategically_unified" &&
    observation.intentState !== "enterprise_purpose_aligned"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["strategic-direction-field", observation.intentId]).slice(0, 48),
    fieldLabel: observation.intentState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    directionPosture:
      observation.alignmentStrength === "enterprise_grade"
        ? "executive_grade"
        : observation.alignmentStrength === "unified" || observation.alignmentStrength === "aligned"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.intentCategory]),
    generatedAt: now,
  };
}

function buildIntentTopology(
  observation: PurposeAlignmentObservation,
  now: number
): OrganizationalIntentTopology | null {
  if (observation.alignmentRisks.length < 1 && observation.intentState !== "fragmented") {
    return null;
  }
  return {
    topologyId: stableSignature(["organizational-intent-topology", observation.intentId]).slice(
      0,
      48
    ),
    topologyLabel: observation.intentCategory.replace(/_/g, " "),
    topologySummary: observation.summary.slice(0, 100),
    alignmentPosture:
      observation.alignmentRisks.length > 1
        ? "high"
        : observation.intentState === "partially_aligned"
          ? "moderate"
          : "low",
    linkedCategories: Object.freeze([observation.intentCategory]),
    generatedAt: now,
  };
}

function buildStrategicIntentSnapshot(
  organizationId: string,
  observations: PurposeAlignmentObservation[],
  signals: EnterprisePurposeAlignmentSignal[],
  fields: StrategicDirectionField[],
  topologies: OrganizationalIntentTopology[],
  now: number
): UnifiedStrategicIntentSnapshot {
  const top = observations[0];
  const strategicIntentSummary: StrategicIntentSummary = top
    ? {
        dominantIntentState: top.intentState,
        dominantAlignmentStrength: top.alignmentStrength,
        intentHeadline: top.summary,
        alignmentPosture:
          top.alignmentStrength === "enterprise_grade"
            ? "executive_grade"
            : top.alignmentStrength === "unified" || top.alignmentStrength === "aligned"
              ? "high"
              : top.alignmentStrength === "moderate"
                ? "moderate"
                : "low",
      }
    : {
        dominantIntentState: "fragmented",
        dominantAlignmentStrength: "weak",
        intentHeadline:
          "Strategic intent awaiting sufficient awareness-synchronization convergence depth.",
        alignmentPosture: "low",
      };

  const signature = stableSignature([
    "d9-9-3-strategic-intent-snapshot",
    organizationId,
    observations.map((o) => o.intentId),
    strategicIntentSummary.alignmentPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    strategicIntentSummary,
    recentObservations: Object.freeze(observations.slice(0, 6)),
    purposeAlignmentSignals: Object.freeze(signals.slice(0, 6)),
    strategicDirectionFields: Object.freeze(fields.slice(0, 6)),
    intentTopologies: Object.freeze(topologies.slice(0, 6)),
  };
}

export function evaluateUnifiedStrategicIntent(
  input: UnifiedStrategicIntentInput
): UnifiedStrategicIntentResult {
  if (!beginStrategicIntentEvaluation()) {
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
    const store = getStrategicIntentStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-9-3-strategic-intent-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
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
      !shouldEvaluateStrategicIntent(
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

    if (!hasAwarenessSynchronizationDepth(input)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_awareness_synchronization_depth",
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

    if (activeRuntimes < STRATEGIC_INTENT_MIN_UNIFIED_RUNTIMES) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_unified_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: PurposeAlignmentObservation[] = [];

    const baselineAlignment = buildEnterprisePurposeAlignment(input, now);
    if (baselineAlignment) candidates.push(baselineAlignment);

    const intentCoherence = buildStrongStrategicIntentCoherence(input, now);
    if (intentCoherence) candidates.push(intentCoherence);

    const fragmentationWarning = buildPurposeFragmentationWarning(input, now);
    if (fragmentationWarning) candidates.push(fragmentationWarning);

    const stewardshipStrengthening = buildStewardshipPurposeStrengthening(input, now);
    if (stewardshipStrengthening) candidates.push(stewardshipStrengthening);

    const consensusDirection = buildConsensusResilienceDirection(input, now);
    if (consensusDirection) candidates.push(consensusDirection);

    const alignmentInstability = buildExecutiveAlignmentInstability(input, now);
    if (alignmentInstability) candidates.push(alignmentInstability);

    const enterpriseGradeAlignment = buildEnterpriseGradePurposeAlignment(input, now);
    if (enterpriseGradeAlignment) candidates.push(enterpriseGradeAlignment);

    const retained = candidates
      .filter(shouldRetainPurposeAlignmentObservation)
      .sort(
        (a, b) =>
          intentStateRank(b.intentState) - intentStateRank(a.intentState) ||
          alignmentStrengthRank(b.alignmentStrength) - alignmentStrengthRank(a.alignmentStrength) ||
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

    const priorIds = new Set(prior.observations.map((o) => o.intentId));
    const newCount = retained.filter((o) => !priorIds.has(o.intentId)).length;

    const signals = retained.map((o) => buildPurposeAlignmentSignal(o, now));
    const fields = retained
      .map((o) => buildStrategicDirectionField(o, now))
      .filter((f): f is StrategicDirectionField => f !== null);
    const topologies = retained
      .map((o) => buildIntentTopology(o, now))
      .filter((t): t is OrganizationalIntentTopology => t !== null);

    store.upsertObservations(retained, now);
    store.upsertPurposeAlignmentSignals(signals, now);
    store.upsertStrategicDirectionFields(fields, now);
    store.upsertIntentTopologies(topologies, now);

    const snapshot = buildStrategicIntentSnapshot(
      organizationId,
      retained,
      signals,
      fields,
      topologies,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastIntentState(snapshot.strategicIntentSummary.dominantIntentState);

    const priorState = prior.lastIntentState;

    if (baselineAlignment || intentCoherence || enterpriseGradeAlignment) {
      devLog("strategic-purpose convergence — unified enterprise-direction alignment advancing");
    }

    if (fragmentationWarning || alignmentInstability) {
      devLog("enterprise-direction fragmentation — bounded strategic drift mapped");
    }

    if (enterpriseGradeAlignment || stewardshipStrengthening) {
      devLog("executive alignment stabilization — organization-wide purpose coherence reinforced");
    }

    if (fragmentationWarning || alignmentInstability) {
      devLog("operational-purpose drift — localized objective tension requires bounded resynchronization");
    }

    if (
      priorState &&
      priorState !== snapshot.strategicIntentSummary.dominantIntentState &&
      (snapshot.strategicIntentSummary.dominantIntentState === "strategically_unified" ||
        snapshot.strategicIntentSummary.dominantIntentState === "enterprise_purpose_aligned")
    ) {
      devLog(
        `intent state shift — ${priorState} → ${snapshot.strategicIntentSummary.dominantIntentState}`
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
    endStrategicIntentEvaluation();
  }
}
