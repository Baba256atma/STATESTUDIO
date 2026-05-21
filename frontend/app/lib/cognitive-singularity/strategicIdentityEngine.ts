import { stableSignature } from "../intelligence/shared/dedupe";
import { runtimeStatusRank } from "../institutional-consciousness/unifiedInstitutionalConsciousnessGuards";
import {
  beginStrategicIdentityEvaluation,
  clampStrategicIdentityConfidence,
  consistencyLevelRank,
  endStrategicIdentityEvaluation,
  identityStateRank,
  shouldEvaluateStrategicIdentity,
  shouldRetainIdentityAlignmentObservation,
  STRATEGIC_IDENTITY_MIN_INSTITUTIONAL_SUBSYSTEMS,
  STRATEGIC_IDENTITY_MIN_STRATEGIC_INTENT_OBSERVATIONS,
  STRATEGIC_IDENTITY_MIN_UNIFIED_RUNTIMES,
} from "./strategicIdentityGuards";
import { getStrategicIdentityStore } from "./strategicIdentityStore";
import type {
  ConsistencyLevel,
  EnterpriseStrategicIdentityInput,
  EnterpriseStrategicIdentityResult,
  EnterpriseStrategicIdentitySnapshot,
  IdentityAlignmentObservation,
  IdentityCategory,
  IdentityState,
  OrganizationalDriftIndicator,
  OrganizationalSelfConsistencySignal,
  StrategicIdentityField,
  StrategicIdentitySummary,
} from "./strategicIdentityTypes";

const DEV_LOG_PREFIX = "[Nexora][StrategicIdentity]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildIdentityId(label: string): string {
  return stableSignature(["strategic-identity", label]).slice(0, 56);
}

function isRuntimeMature(status: string | undefined): boolean {
  return status === "stable" || status === "recovering" || status === "adaptive";
}

function countActiveUnifiedRuntimes(input: EnterpriseStrategicIdentityInput): number {
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

function hasStrategicIntentDepth(input: EnterpriseStrategicIdentityInput): boolean {
  const snapshot = input.unifiedStrategicIntentSnapshot;
  if (!snapshot) return false;
  return snapshot.observationCount >= STRATEGIC_IDENTITY_MIN_STRATEGIC_INTENT_OBSERVATIONS;
}

function hasUnifiedInstitutionalConsciousnessDepth(input: EnterpriseStrategicIdentityInput): boolean {
  const snapshot = input.unifiedInstitutionalConsciousnessSnapshot;
  if (!snapshot) return false;
  return (
    snapshot.activeSubsystems.length >= STRATEGIC_IDENTITY_MIN_INSTITUTIONAL_SUBSYSTEMS &&
    runtimeStatusRank(snapshot.runtimeStatus) >= runtimeStatusRank("pressured")
  );
}

function hasEnterpriseCognitionDepth(input: EnterpriseStrategicIdentityInput): boolean {
  return Boolean(input.cognitionSnapshot?.signature?.trim());
}

function createObservation(
  label: string,
  identityState: IdentityState,
  consistencyLevel: ConsistencyLevel,
  identityCategory: IdentityCategory,
  summary: string,
  consistencySignals: string[],
  driftRisks: string[],
  confidence: number,
  now: number
): IdentityAlignmentObservation {
  return {
    identityId: buildIdentityId(label),
    identityState,
    consistencyLevel,
    identityCategory,
    summary,
    consistencySignals: Object.freeze(consistencySignals),
    driftRisks: Object.freeze(driftRisks),
    confidence: clampStrategicIdentityConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildEnterpriseStrategicIdentityBaseline(
  input: EnterpriseStrategicIdentityInput,
  now: number
): IdentityAlignmentObservation | null {
  const intentReady = hasStrategicIntentDepth(input);
  const institutionalReady = hasUnifiedInstitutionalConsciousnessDepth(input);
  const cognitionReady = hasEnterpriseCognitionDepth(input);
  const runtimesReady = countActiveUnifiedRuntimes(input) >= STRATEGIC_IDENTITY_MIN_UNIFIED_RUNTIMES;

  if (!intentReady || !institutionalReady || !cognitionReady || !runtimesReady) return null;

  return createObservation(
    "enterprise_strategic_identity_01",
    "self_consistent",
    "strong",
    "resilience_identity",
    "Enterprise cognition remains strategically consistent with resilience continuity, governance stabilization, and long-horizon operational survivability.",
    [
      "purpose_alignment",
      "governance_consistency",
      "resilience_identity_continuity",
    ],
    ["localized_growth_speed_pressure"],
    0.92,
    now
  );
}

function buildPurposeIdentityAlignment(
  input: EnterpriseStrategicIdentityInput,
  now: number
): IdentityAlignmentObservation | null {
  const intentUnified =
    input.unifiedStrategicIntentSnapshot?.strategicIntentSummary.dominantIntentState ===
      "strategically_unified" ||
    input.unifiedStrategicIntentSnapshot?.strategicIntentSummary.dominantIntentState ===
      "enterprise_purpose_aligned";
  const cognitionAligned = input.cognitionConverged === true || input.continuityPreserved === true;
  const awarenessSynchronized =
    input.awarenessSynchronizationSnapshot?.synchronizationSummary.dominantAwarenessState ===
      "synchronized" ||
    input.awarenessSynchronizationSnapshot?.synchronizationSummary.dominantAwarenessState ===
      "unified" ||
    input.awarenessSynchronizationSnapshot?.synchronizationSummary.dominantAwarenessState ===
      "strategically_coherent";

  if (!intentUnified || !cognitionAligned || !awarenessSynchronized) return null;

  return createObservation(
    "purpose_identity_alignment",
    "self_consistent",
    "aligned",
    "operational_identity",
    "Strategic intent and synchronized awareness reinforce declared enterprise purpose — organizational self-consistency strengthens without inventing ideological values.",
    [
      "purpose_identity_alignment",
      "strategic_intent_coherence",
      "awareness_purpose_synchronization",
    ],
    [],
    0.9,
    now
  );
}

function buildDecisionIdentityDrift(
  input: EnterpriseStrategicIdentityInput,
  now: number
): IdentityAlignmentObservation | null {
  const intentAligned =
    input.unifiedStrategicIntentSnapshot?.strategicIntentSummary.dominantIntentState ===
      "strategically_unified" ||
    input.unifiedStrategicIntentSnapshot?.strategicIntentSummary.dominantIntentState ===
      "directionally_coherent";
  const decisionDrifting =
    input.decisionSnapshot?.runtimeStatus === "degraded" ||
    input.decisionSnapshot?.runtimeStatus === "unstable";

  if (!intentAligned || !decisionDrifting) return null;

  return createObservation(
    "decision_identity_drift",
    "drifting",
    "moderate",
    "operational_identity",
    "Decision orchestration diverging from declared strategic intent — decision identity drift signal maps bounded behavioral inconsistency without autonomous enforcement.",
    ["decision_identity_drift", "operational_behavior_mismatch"],
    ["decision_runtime_identity_drift", "executive_alignment_strain"],
    0.86,
    now
  );
}

function buildGovernanceIdentityCoherence(
  input: EnterpriseStrategicIdentityInput,
  now: number
): IdentityAlignmentObservation | null {
  const consensusCoherent =
    input.unifiedConsensusSnapshot?.summary.governanceState === "integrity preserved" ||
    input.unifiedConsensusSnapshot?.summary.governanceState === "coherent";
  const metaCoherent =
    input.unifiedSelfReflectiveSnapshot?.summary.governanceAlignment === "aligned" ||
    input.unifiedSelfReflectiveSnapshot?.summary.governanceAlignment === "coherent";
  const metaStable =
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "stable" ||
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "recovering" ||
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "adaptive";

  if (!consensusCoherent || !metaCoherent || !metaStable) return null;

  return createObservation(
    "governance_identity_coherence",
    "self_consistent",
    "aligned",
    "governance_identity",
    "Governance identity coherence reinforced across consensus and meta-cognition — executive strategic behavior remains observationally aligned with institutional governance posture.",
    [
      "governance_identity_coherence",
      "consensus_meta_alignment",
      "institutional_governance_consistency",
    ],
    [],
    0.89,
    now
  );
}

function buildResilienceIdentityContinuity(
  input: EnterpriseStrategicIdentityInput,
  now: number
): IdentityAlignmentObservation | null {
  const resilienceDeclared = Boolean(input.resilienceForecastLine?.trim());
  const pathwayStrong =
    input.decisionSnapshot?.summary.resiliencePathway === "strengthening" ||
    input.decisionSnapshot?.summary.resiliencePathway === "forming";
  const memoryContinuity =
    input.memorySnapshot?.summary.strategicMemoryContinuity === "verified" ||
    input.memorySnapshot?.summary.strategicMemoryContinuity === "strong";
  const stewardshipAligned =
    input.unifiedInstitutionalConsciousnessSnapshot?.summary.stewardshipState === "reinforced" ||
    input.unifiedInstitutionalConsciousnessSnapshot?.summary.stewardshipState === "protected";

  if (!resilienceDeclared || !pathwayStrong || !memoryContinuity) return null;

  return createObservation(
    "resilience_identity_continuity",
    "self_consistent",
    "strong",
    "resilience_identity",
    "Resilience identity continuity sustained across memory, decision pathways, and institutional stewardship — long-horizon survivability posture remains cognitively coherent.",
    [
      "resilience_identity_continuity",
      "institutional_memory_resilience_sync",
      stewardshipAligned ? "stewardship_resilience_reinforcement" : "resilience_pathway_alignment",
    ],
    stewardshipAligned ? [] : ["partial_stewardship_alignment_gap"],
    stewardshipAligned ? 0.91 : 0.88,
    now
  );
}

function buildPurposeBehaviorMismatch(
  input: EnterpriseStrategicIdentityInput,
  now: number
): IdentityAlignmentObservation | null {
  const intentPartial =
    input.unifiedStrategicIntentSnapshot?.strategicIntentSummary.dominantIntentState ===
      "partially_aligned" ||
    input.unifiedStrategicIntentSnapshot?.strategicIntentSummary.dominantIntentState ===
      "fragmented";
  const operationalStressed =
    input.operationalTopologyStressed === true || input.fragilityElevated === true;
  const narrativePresent = Boolean(
    input.enterpriseNarrativeLine?.trim() || input.cognitionSnapshot?.organizationalLearningLine?.trim()
  );

  if (!intentPartial || !operationalStressed || !narrativePresent) return null;

  return createObservation(
    "purpose_behavior_mismatch",
    "partially_consistent",
    "moderate",
    "continuity_identity",
    "Purpose and operational behavior signals diverging under topology stress — organizational self-consistency strain mapped without speculative identity generation.",
    ["purpose_behavior_mismatch", "operational_purpose_divergence"],
    ["localized_operational_speed_pressure", "strategic_identity_fragmentation_risk"],
    0.87,
    now
  );
}

function buildStrategicallyIntegratedIdentity(
  input: EnterpriseStrategicIdentityInput,
  now: number
): IdentityAlignmentObservation | null {
  const runtimesCoherent = countActiveUnifiedRuntimes(input) >= 6;
  const intentCoherent =
    input.unifiedStrategicIntentSnapshot?.strategicIntentSummary.dominantIntentState ===
      "enterprise_purpose_aligned" ||
    input.unifiedStrategicIntentSnapshot?.strategicIntentSummary.dominantIntentState ===
      "strategically_unified";
  const singularityCoherent =
    input.cognitiveSingularitySnapshot?.singularitySummary.dominantCognitionState === "unified" ||
    input.cognitiveSingularitySnapshot?.singularitySummary.dominantCognitionState ===
      "strategically_coherent";
  const continuityStable = input.continuityPreserved === true;

  if (!runtimesCoherent || !intentCoherent || !singularityCoherent || !continuityStable) {
    return null;
  }

  return createObservation(
    "strategically_integrated_identity",
    "strategically_integrated",
    "enterprise_grade",
    "resilience_identity",
    "All cognition systems reinforce the same strategic identity posture — enterprise-grade organizational self-consistency represents bounded alignment awareness, not AGI identity emergence.",
    [
      "strategically_integrated_identity",
      "enterprise_self_consistency",
      "multi_runtime_identity_coherence",
    ],
    [],
    0.93,
    now
  );
}

function buildSelfConsistencySignal(
  observation: IdentityAlignmentObservation,
  now: number
): OrganizationalSelfConsistencySignal {
  return {
    signalId: stableSignature(["organizational-self-consistency-signal", observation.identityId]).slice(
      0,
      48
    ),
    signalLabel: observation.identityState.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.identityCategory]),
    signalIntensity:
      observation.consistencyLevel === "enterprise_grade" ||
      observation.consistencyLevel === "strong"
        ? "high"
        : "moderate",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildStrategicIdentityField(
  observation: IdentityAlignmentObservation,
  now: number
): StrategicIdentityField | null {
  if (
    observation.identityState !== "self_consistent" &&
    observation.identityState !== "strategically_integrated"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["strategic-identity-field", observation.identityId]).slice(0, 48),
    fieldLabel: observation.identityState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    consistencyPosture:
      observation.consistencyLevel === "enterprise_grade"
        ? "executive_grade"
        : observation.consistencyLevel === "strong" || observation.consistencyLevel === "aligned"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.identityCategory]),
    generatedAt: now,
  };
}

function buildDriftIndicator(
  observation: IdentityAlignmentObservation,
  now: number
): OrganizationalDriftIndicator | null {
  if (observation.driftRisks.length < 1 && observation.identityState !== "drifting") {
    return null;
  }
  return {
    indicatorId: stableSignature(["organizational-drift-indicator", observation.identityId]).slice(
      0,
      48
    ),
    indicatorLabel: observation.identityCategory.replace(/_/g, " "),
    indicatorSummary: observation.summary.slice(0, 100),
    driftSeverity:
      observation.driftRisks.length > 1
        ? "high"
        : observation.identityState === "drifting"
          ? "moderate"
          : "low",
    linkedCategories: Object.freeze([observation.identityCategory]),
    generatedAt: now,
  };
}

function buildStrategicIdentitySnapshot(
  organizationId: string,
  observations: IdentityAlignmentObservation[],
  signals: OrganizationalSelfConsistencySignal[],
  fields: StrategicIdentityField[],
  indicators: OrganizationalDriftIndicator[],
  now: number
): EnterpriseStrategicIdentitySnapshot {
  const top = observations[0];
  const strategicIdentitySummary: StrategicIdentitySummary = top
    ? {
        dominantIdentityState: top.identityState,
        dominantConsistencyLevel: top.consistencyLevel,
        identityHeadline: top.summary,
        consistencyPosture:
          top.consistencyLevel === "enterprise_grade"
            ? "executive_grade"
            : top.consistencyLevel === "strong" || top.consistencyLevel === "aligned"
              ? "high"
              : top.consistencyLevel === "moderate"
                ? "moderate"
                : "low",
      }
    : {
        dominantIdentityState: "fragmented",
        dominantConsistencyLevel: "weak",
        identityHeadline:
          "Strategic identity awaiting sufficient strategic-intent alignment depth.",
        consistencyPosture: "low",
      };

  const signature = stableSignature([
    "d9-9-4-strategic-identity-snapshot",
    organizationId,
    observations.map((o) => o.identityId),
    strategicIdentitySummary.consistencyPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    strategicIdentitySummary,
    recentObservations: Object.freeze(observations.slice(0, 6)),
    selfConsistencySignals: Object.freeze(signals.slice(0, 6)),
    strategicIdentityFields: Object.freeze(fields.slice(0, 6)),
    driftIndicators: Object.freeze(indicators.slice(0, 6)),
  };
}

export function evaluateEnterpriseStrategicIdentity(
  input: EnterpriseStrategicIdentityInput
): EnterpriseStrategicIdentityResult {
  if (!beginStrategicIdentityEvaluation()) {
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
    const store = getStrategicIdentityStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-9-4-strategic-identity-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
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
      !shouldEvaluateStrategicIdentity(
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

    if (!hasStrategicIntentDepth(input)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_strategic_intent_depth",
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

    if (activeRuntimes < STRATEGIC_IDENTITY_MIN_UNIFIED_RUNTIMES) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_unified_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: IdentityAlignmentObservation[] = [];

    const baseline = buildEnterpriseStrategicIdentityBaseline(input, now);
    if (baseline) candidates.push(baseline);

    const purposeAlignment = buildPurposeIdentityAlignment(input, now);
    if (purposeAlignment) candidates.push(purposeAlignment);

    const decisionDrift = buildDecisionIdentityDrift(input, now);
    if (decisionDrift) candidates.push(decisionDrift);

    const governanceCoherence = buildGovernanceIdentityCoherence(input, now);
    if (governanceCoherence) candidates.push(governanceCoherence);

    const resilienceContinuity = buildResilienceIdentityContinuity(input, now);
    if (resilienceContinuity) candidates.push(resilienceContinuity);

    const behaviorMismatch = buildPurposeBehaviorMismatch(input, now);
    if (behaviorMismatch) candidates.push(behaviorMismatch);

    const integratedIdentity = buildStrategicallyIntegratedIdentity(input, now);
    if (integratedIdentity) candidates.push(integratedIdentity);

    const retained = candidates
      .filter(shouldRetainIdentityAlignmentObservation)
      .sort(
        (a, b) =>
          identityStateRank(b.identityState) - identityStateRank(a.identityState) ||
          consistencyLevelRank(b.consistencyLevel) - consistencyLevelRank(a.consistencyLevel) ||
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

    const priorIds = new Set(prior.observations.map((o) => o.identityId));
    const newCount = retained.filter((o) => !priorIds.has(o.identityId)).length;

    const signals = retained.map((o) => buildSelfConsistencySignal(o, now));
    const fields = retained
      .map((o) => buildStrategicIdentityField(o, now))
      .filter((f): f is StrategicIdentityField => f !== null);
    const indicators = retained
      .map((o) => buildDriftIndicator(o, now))
      .filter((i): i is OrganizationalDriftIndicator => i !== null);

    store.upsertObservations(retained, now);
    store.upsertSelfConsistencySignals(signals, now);
    store.upsertStrategicIdentityFields(fields, now);
    store.upsertDriftIndicators(indicators, now);

    const snapshot = buildStrategicIdentitySnapshot(
      organizationId,
      retained,
      signals,
      fields,
      indicators,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastIdentityState(snapshot.strategicIdentitySummary.dominantIdentityState);

    const priorState = prior.lastIdentityState;

    if (baseline || purposeAlignment || integratedIdentity) {
      devLog("strategic-purpose convergence — organizational self-consistency awareness advancing");
    }

    if (decisionDrift || behaviorMismatch) {
      devLog("enterprise-direction fragmentation — bounded strategic identity drift mapped");
    }

    if (governanceCoherence || integratedIdentity) {
      devLog("executive alignment stabilization — strategic identity coherence reinforced");
    }

    if (decisionDrift || behaviorMismatch) {
      devLog("operational-purpose drift — localized behavior tension requires bounded resynchronization");
    }

    if (
      priorState &&
      priorState !== snapshot.strategicIdentitySummary.dominantIdentityState &&
      (snapshot.strategicIdentitySummary.dominantIdentityState === "self_consistent" ||
        snapshot.strategicIdentitySummary.dominantIdentityState === "strategically_integrated")
    ) {
      devLog(
        `identity state shift — ${priorState} → ${snapshot.strategicIdentitySummary.dominantIdentityState}`
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
    endStrategicIdentityEvaluation();
  }
}
