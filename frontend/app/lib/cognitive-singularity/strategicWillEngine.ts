import { stableSignature } from "../intelligence/shared/dedupe";
import { runtimeStatusRank } from "../institutional-consciousness/unifiedInstitutionalConsciousnessGuards";
import {
  beginStrategicWillEvaluation,
  clampStrategicWillConfidence,
  commitmentStrengthRank,
  endStrategicWillEvaluation,
  shouldEvaluateStrategicWill,
  shouldRetainEnterpriseCommitmentObservation,
  STRATEGIC_WILL_MIN_INSTITUTIONAL_SUBSYSTEMS,
  STRATEGIC_WILL_MIN_STRATEGIC_IDENTITY_OBSERVATIONS,
  STRATEGIC_WILL_MIN_UNIFIED_RUNTIMES,
  willStateRank,
} from "./strategicWillGuards";
import { getStrategicWillStore } from "./strategicWillStore";
import type {
  CommitmentCategory,
  CommitmentStrength,
  CrossSystemCommitmentField,
  DirectionalCommitmentSignal,
  EnterpriseCommitmentObservation,
  EnterpriseStrategicWillSnapshot,
  StrategicWillFragmentationIndicator,
  StrategicWillSummary,
  UnifiedStrategicWillInput,
  UnifiedStrategicWillResult,
  WillState,
} from "./strategicWillTypes";

const DEV_LOG_PREFIX = "[Nexora][StrategicWill]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildWillId(label: string): string {
  return stableSignature(["strategic-will", label]).slice(0, 56);
}

function isRuntimeMature(status: string | undefined): boolean {
  return status === "stable" || status === "recovering" || status === "adaptive";
}

function countActiveUnifiedRuntimes(input: UnifiedStrategicWillInput): number {
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

function hasStrategicIdentityDepth(input: UnifiedStrategicWillInput): boolean {
  const snapshot = input.enterpriseStrategicIdentitySnapshot;
  if (!snapshot) return false;
  return snapshot.observationCount >= STRATEGIC_WILL_MIN_STRATEGIC_IDENTITY_OBSERVATIONS;
}

function hasUnifiedInstitutionalConsciousnessDepth(input: UnifiedStrategicWillInput): boolean {
  const snapshot = input.unifiedInstitutionalConsciousnessSnapshot;
  if (!snapshot) return false;
  return (
    snapshot.activeSubsystems.length >= STRATEGIC_WILL_MIN_INSTITUTIONAL_SUBSYSTEMS &&
    runtimeStatusRank(snapshot.runtimeStatus) >= runtimeStatusRank("pressured")
  );
}

function hasEnterpriseCognitionDepth(input: UnifiedStrategicWillInput): boolean {
  return Boolean(input.cognitionSnapshot?.signature?.trim());
}

function createObservation(
  label: string,
  willState: WillState,
  commitmentStrength: CommitmentStrength,
  commitmentCategory: CommitmentCategory,
  summary: string,
  commitmentSignals: string[],
  fragmentationRisks: string[],
  confidence: number,
  now: number
): EnterpriseCommitmentObservation {
  return {
    willId: buildWillId(label),
    willState,
    commitmentStrength,
    commitmentCategory,
    summary,
    commitmentSignals: Object.freeze(commitmentSignals),
    fragmentationRisks: Object.freeze(fragmentationRisks),
    confidence: clampStrategicWillConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildEnterpriseStrategicWillBaseline(
  input: UnifiedStrategicWillInput,
  now: number
): EnterpriseCommitmentObservation | null {
  const identityReady = hasStrategicIdentityDepth(input);
  const institutionalReady = hasUnifiedInstitutionalConsciousnessDepth(input);
  const cognitionReady = hasEnterpriseCognitionDepth(input);
  const runtimesReady = countActiveUnifiedRuntimes(input) >= STRATEGIC_WILL_MIN_UNIFIED_RUNTIMES;

  if (!identityReady || !institutionalReady || !cognitionReady || !runtimesReady) return null;

  return createObservation(
    "enterprise_strategic_will_01",
    "directionally_committed",
    "strongly_committed",
    "resilience_commitment",
    "Enterprise cognition shows strong directional commitment toward resilience continuity, governance stabilization, and long-horizon operational survivability, with some resistance from localized growth-speed pressures.",
    [
      "resilience_commitment",
      "governance_follow_through",
      "continuity_reinforcement",
      "consensus_alignment",
    ],
    ["localized_growth_speed_pressure"],
    0.92,
    now
  );
}

function buildResilienceCommitmentReinforcement(
  input: UnifiedStrategicWillInput,
  now: number
): EnterpriseCommitmentObservation | null {
  const intentAligned =
    input.unifiedStrategicIntentSnapshot?.strategicIntentSummary.dominantIntentState ===
      "strategically_unified" ||
    input.unifiedStrategicIntentSnapshot?.strategicIntentSummary.dominantIntentState ===
      "enterprise_purpose_aligned";
  const resiliencePathway =
    input.decisionSnapshot?.summary.resiliencePathway === "strengthening" ||
    input.decisionSnapshot?.summary.resiliencePathway === "forming";
  const decisionCommitted =
    input.decisionSnapshot?.runtimeStatus === "stable" ||
    input.decisionSnapshot?.runtimeStatus === "recovering";
  const resilienceDeclared = Boolean(input.resilienceForecastLine?.trim());

  if (!intentAligned || !resiliencePathway || !decisionCommitted || !resilienceDeclared) {
    return null;
  }

  return createObservation(
    "resilience_commitment_reinforcement",
    "directionally_committed",
    "committed",
    "resilience_commitment",
    "Decisions repeatedly reinforce resilience intent — strong resilience commitment strengthens cross-system directional follow-through without autonomous execution authority.",
    [
      "resilience_commitment",
      "decision_resilience_follow_through",
      "strategic_intent_execution_alignment",
    ],
    [],
    0.9,
    now
  );
}

function buildGovernanceSpeedFragmentation(
  input: UnifiedStrategicWillInput,
  now: number
): EnterpriseCommitmentObservation | null {
  const governanceIdentityCoherent =
    input.enterpriseStrategicIdentitySnapshot?.strategicIdentitySummary.dominantIdentityState ===
      "self_consistent" ||
    input.enterpriseStrategicIdentitySnapshot?.strategicIdentitySummary.dominantIdentityState ===
      "strategically_integrated";
  const speedPriority =
    input.decisionSnapshot?.summary.dominantPriority === "speed" ||
    input.decisionSnapshot?.summary.stabilizationFocus.toLowerCase().includes("accelerat");
  const operationalStressed =
    input.operationalTopologyStressed === true || input.fragilityElevated === true;

  if (!governanceIdentityCoherent || (!speedPriority && !operationalStressed)) return null;

  return createObservation(
    "governance_speed_fragmentation",
    "partially_committed",
    "moderate",
    "governance_commitment",
    "Governance intent declared but operational signals prioritize speed — commitment fragmentation maps bounded will inconsistency without inventing executive intent.",
    ["governance_speed_fragmentation", "commitment_fragmentation"],
    ["localized_growth_speed_pressure", "governance_follow_through_strain"],
    0.87,
    now
  );
}

function buildDirectionalCommitmentCoherence(
  input: UnifiedStrategicWillInput,
  now: number
): EnterpriseCommitmentObservation | null {
  const consensusCoordinated =
    input.unifiedConsensusSnapshot?.summary.consensusState === "coordinated" ||
    input.unifiedConsensusSnapshot?.summary.consensusState === "collectively_aligned";
  const decisionStable =
    input.decisionSnapshot?.runtimeStatus === "stable" ||
    input.decisionSnapshot?.runtimeStatus === "recovering";
  const continuityCommitted = input.continuityPreserved === true;

  if (!consensusCoordinated || !decisionStable || !continuityCommitted) return null;

  return createObservation(
    "directional_commitment_coherence",
    "directionally_committed",
    "strongly_committed",
    "continuity_commitment",
    "Consensus and decision orchestration support continuity — directional commitment coherence reinforces enterprise execution-intent alignment.",
    [
      "directional_commitment_coherence",
      "consensus_decision_continuity_sync",
      "continuity_reinforcement",
    ],
    [],
    0.91,
    now
  );
}

function buildStewardshipWillConflict(
  input: UnifiedStrategicWillInput,
  now: number
): EnterpriseCommitmentObservation | null {
  const stewardshipCommitted =
    input.unifiedInstitutionalConsciousnessSnapshot?.summary.stewardshipState === "reinforced" ||
    input.unifiedInstitutionalConsciousnessSnapshot?.summary.stewardshipState === "protected";
  const operationalResisting =
    input.operationalTopologyStressed === true || input.fragilityElevated === true;
  const decisionStrained =
    input.decisionSnapshot?.runtimeStatus === "degraded" ||
    input.decisionSnapshot?.runtimeStatus === "unstable";

  if (!stewardshipCommitted || !operationalResisting) return null;

  return createObservation(
    "stewardship_will_conflict",
    "hesitant",
    "moderate",
    "stewardship_commitment",
    "Institutional consciousness supports stewardship but operational priorities resist — will conflict signal maps cross-system directional tension without autonomous enforcement.",
    ["stewardship_will_conflict", "operational_resistance_to_stewardship"],
    [
      "operational_priority_resistance",
      decisionStrained ? "decision_runtime_commitment_strain" : "localized_execution_tension",
    ],
    0.86,
    now
  );
}

function buildEnterpriseGradeStrategicCommitment(
  input: UnifiedStrategicWillInput,
  now: number
): EnterpriseCommitmentObservation | null {
  const runtimesCoherent = countActiveUnifiedRuntimes(input) >= 6;
  const identityIntegrated =
    input.enterpriseStrategicIdentitySnapshot?.strategicIdentitySummary.dominantIdentityState ===
      "strategically_integrated" ||
    input.enterpriseStrategicIdentitySnapshot?.strategicIdentitySummary.dominantIdentityState ===
      "self_consistent";
  const intentCommitted =
    input.unifiedStrategicIntentSnapshot?.strategicIntentSummary.dominantIntentState ===
      "enterprise_purpose_aligned" ||
    input.unifiedStrategicIntentSnapshot?.strategicIntentSummary.dominantIntentState ===
      "strategically_unified";
  const awarenessSynchronized =
    input.awarenessSynchronizationSnapshot?.synchronizationSummary.dominantAwarenessState ===
      "synchronized" ||
    input.awarenessSynchronizationSnapshot?.synchronizationSummary.dominantAwarenessState ===
      "unified";

  if (!runtimesCoherent || !identityIntegrated || !intentCommitted || !awarenessSynchronized) {
    return null;
  }

  return createObservation(
    "enterprise_grade_strategic_commitment",
    "strategically_committed",
    "enterprise_grade",
    "resilience_commitment",
    "Long-horizon cognition patterns reinforce the same strategic direction — enterprise-grade strategic commitment represents bounded directional coherence, not autonomous agency.",
    [
      "enterprise_grade_strategic_commitment",
      "cross_system_will_coherence",
      "long_horizon_directional_durability",
    ],
    [],
    0.93,
    now
  );
}

function buildDirectionalCommitmentSignal(
  observation: EnterpriseCommitmentObservation,
  now: number
): DirectionalCommitmentSignal {
  return {
    signalId: stableSignature(["directional-commitment-signal", observation.willId]).slice(0, 48),
    signalLabel: observation.willState.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.commitmentCategory]),
    signalIntensity:
      observation.commitmentStrength === "enterprise_grade" ||
      observation.commitmentStrength === "strongly_committed"
        ? "high"
        : "moderate",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildCrossSystemCommitmentField(
  observation: EnterpriseCommitmentObservation,
  now: number
): CrossSystemCommitmentField | null {
  if (
    observation.willState !== "directionally_committed" &&
    observation.willState !== "strategically_committed"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["cross-system-commitment-field", observation.willId]).slice(0, 48),
    fieldLabel: observation.willState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    commitmentPosture:
      observation.commitmentStrength === "enterprise_grade"
        ? "executive_grade"
        : observation.commitmentStrength === "strongly_committed" ||
            observation.commitmentStrength === "committed"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.commitmentCategory]),
    generatedAt: now,
  };
}

function buildFragmentationIndicator(
  observation: EnterpriseCommitmentObservation,
  now: number
): StrategicWillFragmentationIndicator | null {
  if (observation.fragmentationRisks.length < 1 && observation.willState !== "fragmented") {
    return null;
  }
  return {
    indicatorId: stableSignature(["strategic-will-fragmentation-indicator", observation.willId]).slice(
      0,
      48
    ),
    indicatorLabel: observation.commitmentCategory.replace(/_/g, " "),
    indicatorSummary: observation.summary.slice(0, 100),
    fragmentationSeverity:
      observation.fragmentationRisks.length > 1
        ? "high"
        : observation.willState === "hesitant" || observation.willState === "partially_committed"
          ? "moderate"
          : "low",
    linkedCategories: Object.freeze([observation.commitmentCategory]),
    generatedAt: now,
  };
}

function buildStrategicWillSnapshot(
  organizationId: string,
  observations: EnterpriseCommitmentObservation[],
  signals: DirectionalCommitmentSignal[],
  fields: CrossSystemCommitmentField[],
  indicators: StrategicWillFragmentationIndicator[],
  now: number
): EnterpriseStrategicWillSnapshot {
  const top = observations[0];
  const strategicWillSummary: StrategicWillSummary = top
    ? {
        dominantWillState: top.willState,
        dominantCommitmentStrength: top.commitmentStrength,
        willHeadline: top.summary,
        commitmentPosture:
          top.commitmentStrength === "enterprise_grade"
            ? "executive_grade"
            : top.commitmentStrength === "strongly_committed" ||
                top.commitmentStrength === "committed"
              ? "high"
              : top.commitmentStrength === "moderate"
                ? "moderate"
                : "low",
      }
    : {
        dominantWillState: "fragmented",
        dominantCommitmentStrength: "weak",
        willHeadline: "Strategic will awaiting sufficient strategic-identity coherence depth.",
        commitmentPosture: "low",
      };

  const signature = stableSignature([
    "d9-9-5-strategic-will-snapshot",
    organizationId,
    observations.map((o) => o.willId),
    strategicWillSummary.commitmentPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    strategicWillSummary,
    recentObservations: Object.freeze(observations.slice(0, 6)),
    directionalCommitmentSignals: Object.freeze(signals.slice(0, 6)),
    crossSystemCommitmentFields: Object.freeze(fields.slice(0, 6)),
    fragmentationIndicators: Object.freeze(indicators.slice(0, 6)),
  };
}

export function evaluateUnifiedStrategicWill(
  input: UnifiedStrategicWillInput
): UnifiedStrategicWillResult {
  if (!beginStrategicWillEvaluation()) {
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
    const store = getStrategicWillStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-9-5-strategic-will-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
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
      !shouldEvaluateStrategicWill(
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

    if (!hasStrategicIdentityDepth(input)) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_strategic_identity_depth",
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

    if (activeRuntimes < STRATEGIC_WILL_MIN_UNIFIED_RUNTIMES) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_unified_runtime_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: EnterpriseCommitmentObservation[] = [];

    const baseline = buildEnterpriseStrategicWillBaseline(input, now);
    if (baseline) candidates.push(baseline);

    const resilienceReinforcement = buildResilienceCommitmentReinforcement(input, now);
    if (resilienceReinforcement) candidates.push(resilienceReinforcement);

    const governanceFragmentation = buildGovernanceSpeedFragmentation(input, now);
    if (governanceFragmentation) candidates.push(governanceFragmentation);

    const commitmentCoherence = buildDirectionalCommitmentCoherence(input, now);
    if (commitmentCoherence) candidates.push(commitmentCoherence);

    const stewardshipConflict = buildStewardshipWillConflict(input, now);
    if (stewardshipConflict) candidates.push(stewardshipConflict);

    const enterpriseGradeCommitment = buildEnterpriseGradeStrategicCommitment(input, now);
    if (enterpriseGradeCommitment) candidates.push(enterpriseGradeCommitment);

    const retained = candidates
      .filter(shouldRetainEnterpriseCommitmentObservation)
      .sort(
        (a, b) =>
          willStateRank(b.willState) - willStateRank(a.willState) ||
          commitmentStrengthRank(b.commitmentStrength) -
            commitmentStrengthRank(a.commitmentStrength) ||
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

    const priorIds = new Set(prior.observations.map((o) => o.willId));
    const newCount = retained.filter((o) => !priorIds.has(o.willId)).length;

    const signals = retained.map((o) => buildDirectionalCommitmentSignal(o, now));
    const fields = retained
      .map((o) => buildCrossSystemCommitmentField(o, now))
      .filter((f): f is CrossSystemCommitmentField => f !== null);
    const indicators = retained
      .map((o) => buildFragmentationIndicator(o, now))
      .filter((i): i is StrategicWillFragmentationIndicator => i !== null);

    store.upsertObservations(retained, now);
    store.upsertDirectionalCommitmentSignals(signals, now);
    store.upsertCrossSystemCommitmentFields(fields, now);
    store.upsertFragmentationIndicators(indicators, now);

    const snapshot = buildStrategicWillSnapshot(
      organizationId,
      retained,
      signals,
      fields,
      indicators,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastWillState(snapshot.strategicWillSummary.dominantWillState);

    const priorState = prior.lastWillState;

    if (baseline || resilienceReinforcement || commitmentCoherence) {
      devLog("commitment strengthening — cross-system directional follow-through advancing");
    }

    if (governanceFragmentation || stewardshipConflict) {
      devLog("strategic-will fragmentation — bounded commitment inconsistency mapped");
    }

    if (enterpriseGradeCommitment) {
      devLog("enterprise-grade commitment formation — organization-wide strategic will coherence stabilized");
    }

    if (governanceFragmentation || stewardshipConflict) {
      devLog("directional resistance detection — localized operational tension requires bounded resynchronization");
    }

    if (
      priorState &&
      priorState !== snapshot.strategicWillSummary.dominantWillState &&
      (snapshot.strategicWillSummary.dominantWillState === "directionally_committed" ||
        snapshot.strategicWillSummary.dominantWillState === "strategically_committed")
    ) {
      devLog(
        `will state shift — ${priorState} → ${snapshot.strategicWillSummary.dominantWillState}`
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
    endStrategicWillEvaluation();
  }
}
