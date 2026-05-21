import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginDistributedMemorySyncEvaluation,
  clampSyncConfidence,
  continuityStateRank,
  DISTRIBUTED_MEMORY_SYNC_MIN_COLLECTIVE_LEARNING_DEPTH,
  DISTRIBUTED_MEMORY_SYNC_MIN_UNIFIED_LAYERS,
  endDistributedMemorySyncEvaluation,
  shouldEvaluateDistributedMemorySync,
  shouldRetainCollaborativeContinuityObservation,
  synchronizationStrengthRank,
} from "./distributedMemorySyncGuards";
import { getDistributedMemorySyncStore } from "./distributedMemorySyncStore";
import type {
  CollaborativeContinuityObservation,
  ContinuityState,
  DistributedCognitionContinuitySignal,
  DistributedStrategicMemorySyncInput,
  DistributedStrategicMemorySyncResult,
  EnterpriseMemoryDivergenceIndicator,
  MemoryPerspective,
  MemorySynchronizationSummary,
  MultiPerspectiveMemorySnapshot,
  StrategicMemoryAlignmentField,
  SynchronizationCategory,
  SynchronizationStrength,
} from "./distributedMemorySyncTypes";

const DEV_LOG_PREFIX = "[Nexora][DistributedMemorySync]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildSyncId(label: string): string {
  return stableSignature(["distributed-memory-sync", label]).slice(0, 56);
}

function countActiveUnifiedLayers(input: DistributedStrategicMemorySyncInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function perspectiveWeight(
  input: DistributedStrategicMemorySyncInput,
  category: MemoryPerspective
): number {
  const consensus = input.strategicConsensusSnapshot?.reasoningPerspectives.find(
    (p) => p.perspectiveCategory === category
  );
  return consensus?.perspectiveWeight ?? 0;
}

function createObservation(
  label: string,
  continuityState: ContinuityState,
  synchronizationStrength: SynchronizationStrength,
  synchronizationCategory: SynchronizationCategory,
  summary: string,
  synchronizedPerspectives: MemoryPerspective[],
  fragmentedPerspectives: MemoryPerspective[],
  synchronizationSignals: string[],
  confidence: number,
  now: number
): CollaborativeContinuityObservation {
  return {
    synchronizationId: buildSyncId(label),
    continuityState,
    synchronizationStrength,
    synchronizationCategory,
    summary,
    synchronizedPerspectives: Object.freeze(synchronizedPerspectives),
    fragmentedPerspectives: Object.freeze(fragmentedPerspectives),
    synchronizationSignals: Object.freeze(synchronizationSignals),
    confidence: clampSyncConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildEnterpriseDistributedMemoryAlignment(
  input: DistributedStrategicMemorySyncInput,
  now: number
): CollaborativeContinuityObservation | null {
  const memoryStrong =
    input.memorySnapshot?.runtimeStatus === "stable" ||
    (input.memorySnapshot?.summary.primaryStrategicLesson.trim().length ?? 0) > 0;
  const learningDepth = input.collectiveLearningSnapshot?.observationCount ?? 0;
  const stackMature =
    (input.collectiveGuidanceSnapshot?.observationCount ?? 0) >= 1 &&
    (input.counterfactualSnapshot?.observationCount ?? 0) >= 1 &&
    learningDepth >= 1;

  if (!memoryStrong || !stackMature) return null;

  const speedWeight = perspectiveWeight(input, "operational_speed");
  const govWeight = perspectiveWeight(input, "governance");
  const synchronized: MemoryPerspective[] = ["governance", "resilience", "counterfactual"];
  const fragmented: MemoryPerspective[] =
    speedWeight >= 0.75 && govWeight < 0.55 ? ["operational_speed"] : [];

  return createObservation(
    "enterprise_distributed_memory_alignment_01",
    fragmented.length > 0 ? "synchronized" : "continuous",
    fragmented.length > 0 ? "synchronized" : "enterprise_grade",
    "stabilization_memory",
    "Distributed enterprise cognition maintains strong strategic-memory continuity across governance, resilience, and counterfactual learning systems, though operational-speed historical alignment remains partially fragmented.",
    synchronized,
    fragmented,
    [
      "institutional_memory_alignment",
      "distributed_learning_continuity",
      "historical_coherence_preservation",
    ],
    0.91,
    now
  );
}

function buildGovernanceResilienceMemoryAlignment(
  input: DistributedStrategicMemorySyncInput,
  now: number
): CollaborativeContinuityObservation | null {
  const govWeight = perspectiveWeight(input, "governance");
  const resWeight = perspectiveWeight(input, "resilience");
  const coherence =
    input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "high" ||
    input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "institutional_grade" ||
    input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "moderate";

  if (govWeight < 0.5 || resWeight < 0.5) return null;
  if (!coherence && !input.continuityPreserved) return null;

  return createObservation(
    "governance_resilience_memory_alignment",
    "synchronized",
    "synchronized",
    "governance_memory",
    "Governance and resilience perspectives share aligned strategic history — strong synchronization continuity preserves escalation and survivability lessons across distributed cognition.",
    ["governance", "resilience"],
    [],
    [
      "governance_resilience_alignment",
      "shared_escalation_history",
      "survivability_memory_continuity",
    ],
    0.89,
    now
  );
}

function buildOperationalSpeedMemoryDivergence(
  input: DistributedStrategicMemorySyncInput,
  now: number
): CollaborativeContinuityObservation | null {
  const speedPriority =
    input.consensusPrioritySnapshot?.recentWeightings.some(
      (w) => w.weightingCategory === "operational_speed_priority"
    ) ?? false;
  const speedWeight = perspectiveWeight(input, "operational_speed");
  const govWeight = perspectiveWeight(input, "governance");
  const historyIgnored =
    speedPriority &&
    speedWeight >= 0.72 &&
    govWeight < 0.55 &&
    (input.fragilityElevated || input.governanceSnapshot?.governanceStatus === "monitored");

  if (!historyIgnored) return null;

  return createObservation(
    "operational_speed_memory_divergence",
    "drifting",
    "partial",
    "orchestration_memory",
    "Operational-speed perspective may be ignoring historical coordination fragility — memory-divergence warning indicates distributed strategic continuity weakening for speed-priority pathways.",
    ["governance", "resilience"],
    ["operational_speed"],
    [
      "memory_divergence_warning",
      "historical_coordination_fragility_ignored",
      "speed_priority_desynchronization",
    ],
    0.78,
    now
  );
}

function buildInstitutionalMemoryContinuityStrengthening(
  input: DistributedStrategicMemorySyncInput,
  now: number
): CollaborativeContinuityObservation | null {
  const lesson =
    input.memorySnapshot?.summary.primaryStrategicLesson.trim() ?? "";
  const learningReinforced =
    (input.collectiveLearningSnapshot?.observationCount ?? 0) >= 1 &&
    input.collectiveLearningSnapshot?.recentEvolutions.some((e) =>
      e.learningSignals.includes("distributed_reasoning_maturity")
    );

  if (lesson.length < 8 && !learningReinforced) return null;

  return createObservation(
    "institutional_memory_continuity_strengthening",
    "aligned",
    "stable",
    "stabilization_memory",
    "Institutional memory reinforcing distributed learning — collaborative continuity strengthening aligns enterprise history with accumulated multi-perspective operational experience.",
    ["governance", "resilience", "trust"],
    [],
    [
      "institutional_memory_reinforcement",
      "collaborative_continuity_strengthening",
      "learning_history_alignment",
    ],
    0.86,
    now
  );
}

function buildCounterfactualMemoryDurability(
  input: DistributedStrategicMemorySyncInput,
  now: number
): CollaborativeContinuityObservation | null {
  const debate = input.counterfactualSnapshot;
  const durable =
    (debate?.observationCount ?? 0) >= 2 &&
    debate?.recentDebates.some(
      (d) =>
        d.counterfactualState === "stress_tested" ||
        d.counterfactualState === "strategically_resolved"
    );

  if (!durable) return null;

  return createObservation(
    "counterfactual_memory_durability",
    "aligned",
    "stable",
    "counterfactual_memory",
    "Counterfactual learning persisting across perspectives — strategic-memory durability indicates challenge pathways preserve historical robustness without erasing perspective-specific lessons.",
    ["counterfactual", "governance", "resilience"],
    [],
    [
      "counterfactual_memory_durability",
      "strategic_challenge_continuity",
      "historical_robustness_preservation",
    ],
    0.87,
    now
  );
}

function buildEnterpriseGradeMemorySynchronization(
  input: DistributedStrategicMemorySyncInput,
  now: number
): CollaborativeContinuityObservation | null {
  const runtimesStable =
    input.memorySnapshot?.runtimeStatus === "stable" &&
    input.decisionSnapshot?.runtimeStatus === "stable" &&
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "stable";
  const learningMature =
    input.collectiveLearningSnapshot?.awarenessSummary.maturationPosture === "high" ||
    input.collectiveLearningSnapshot?.awarenessSummary.maturationPosture === "executive_grade";
  const diversityStable =
    input.diversitySnapshot?.awarenessSummary.dominantPluralityState === "balanced" ||
    input.diversitySnapshot?.awarenessSummary.dominantPluralityState === "resilient";

  if (!runtimesStable || !learningMature) return null;

  return createObservation(
    "enterprise_grade_memory_synchronization",
    diversityStable ? "continuous" : "synchronized",
    "enterprise_grade",
    "unknown",
    "Distributed cognition preserving operational history coherently — enterprise-grade synchronization reflects collaborative memory alignment without autonomous memory rewriting.",
    ["governance", "resilience", "counterfactual", "trust", "foresight"],
    diversityStable ? [] : (["operational_speed"] as MemoryPerspective[]),
    [
      "enterprise_grade_memory_synchronization",
      "distributed_cognition_continuity",
      "operational_history_coherence",
    ],
    0.93,
    now
  );
}

function buildCognitionFragmentationConcern(
  input: DistributedStrategicMemorySyncInput,
  now: number
): CollaborativeContinuityObservation | null {
  const diversityFragile =
    input.diversitySnapshot?.awarenessSummary.dominantPluralityState === "collapsed" ||
    input.diversitySnapshot?.awarenessSummary.dominantPluralityState === "narrowing";
  const learningFragmented =
    input.collectiveLearningSnapshot?.awarenessSummary.dominantLearningState === "fragmented";
  const memoryWeak = input.memorySnapshot?.runtimeStatus === "initializing";

  if (!diversityFragile && !learningFragmented && !memoryWeak) return null;

  return createObservation(
    "cognition_fragmentation_concern",
    "fragmented",
    "weak",
    "unknown",
    "Perspective continuity degrading over time — cognition-fragmentation concern indicates distributed strategic-memory synchronization weakening across evolving operational conditions.",
    [],
    ["governance", "resilience", "operational_speed", "counterfactual"],
    [
      "cognition_fragmentation_emergence",
      "continuity_degradation",
      "memory_synchronization_weakening",
    ],
    0.67,
    now
  );
}

function buildContinuitySignal(
  observation: CollaborativeContinuityObservation,
  now: number
): DistributedCognitionContinuitySignal {
  return {
    signalId: stableSignature(["continuity-signal", observation.synchronizationId]).slice(0, 48),
    signalLabel: observation.continuityState.replace(/_/g, " "),
    signalSummary: observation.summary.slice(0, 100),
    linkedCategories: Object.freeze([observation.synchronizationCategory]),
    signalIntensity:
      observation.synchronizationStrength === "enterprise_grade" ||
      observation.synchronizationStrength === "synchronized"
        ? "high"
        : "moderate",
    confidence: observation.confidence,
    generatedAt: now,
  };
}

function buildDivergenceIndicator(
  observation: CollaborativeContinuityObservation,
  now: number
): EnterpriseMemoryDivergenceIndicator | null {
  if (observation.fragmentedPerspectives.length < 1) return null;
  return {
    indicatorId: stableSignature(["divergence-indicator", observation.synchronizationId]).slice(0, 48),
    indicatorLabel: "memory divergence",
    indicatorSummary: observation.summary.slice(0, 100),
    divergencePosture:
      observation.continuityState === "fragmented"
        ? "high"
        : observation.continuityState === "drifting"
          ? "moderate"
          : "low",
    linkedPerspectives: observation.fragmentedPerspectives,
    generatedAt: now,
  };
}

function buildAlignmentField(
  observation: CollaborativeContinuityObservation,
  now: number
): StrategicMemoryAlignmentField | null {
  if (observation.synchronizedPerspectives.length < 1) return null;
  if (observation.continuityState === "fragmented") return null;
  return {
    fieldId: stableSignature(["alignment-field", observation.synchronizationId]).slice(0, 48),
    fieldLabel: observation.continuityState.replace(/_/g, " "),
    fieldSummary: observation.summary.slice(0, 80),
    alignmentPosture:
      observation.synchronizationStrength === "enterprise_grade"
        ? "executive_grade"
        : observation.synchronizationStrength === "synchronized" ||
            observation.synchronizationStrength === "stable"
          ? "high"
          : "moderate",
    linkedCategories: Object.freeze([observation.synchronizationCategory]),
    generatedAt: now,
  };
}

function buildMemorySyncSnapshot(
  organizationId: string,
  observations: CollaborativeContinuityObservation[],
  signals: DistributedCognitionContinuitySignal[],
  divergence: EnterpriseMemoryDivergenceIndicator[],
  fields: StrategicMemoryAlignmentField[],
  now: number
): MultiPerspectiveMemorySnapshot {
  const top = observations[0];
  const awarenessSummary: MemorySynchronizationSummary = top
    ? {
        dominantContinuityState: top.continuityState,
        dominantSynchronizationStrength: top.synchronizationStrength,
        continuityHeadline: top.summary,
        coherencePosture:
          top.synchronizationStrength === "enterprise_grade"
            ? "executive_grade"
            : top.synchronizationStrength === "synchronized" || top.synchronizationStrength === "stable"
              ? "high"
              : top.synchronizationStrength === "partial"
                ? "moderate"
                : "low",
      }
    : {
        dominantContinuityState: "drifting",
        dominantSynchronizationStrength: "weak",
        continuityHeadline:
          "Enterprise distributed memory synchronization awaiting sufficient collective-learning runtime depth.",
        coherencePosture: "low",
      };

  const signature = stableSignature([
    "d9-7-8-memory-sync-snapshot",
    organizationId,
    observations.map((o) => o.synchronizationId),
    awarenessSummary.coherencePosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: observations.length,
    awarenessSummary,
    recentObservations: Object.freeze(observations.slice(0, 6)),
    continuitySignals: Object.freeze(signals.slice(0, 6)),
    divergenceIndicators: Object.freeze(divergence.slice(0, 6)),
    alignmentFields: Object.freeze(fields.slice(0, 6)),
  };
}

export function evaluateDistributedStrategicMemorySynchronization(
  input: DistributedStrategicMemorySyncInput
): DistributedStrategicMemorySyncResult {
  if (!beginDistributedMemorySyncEvaluation()) {
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
    const store = getDistributedMemorySyncStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-7-8-distributed-memory-sync-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.strategicConsensusSnapshot?.signature ?? "no-consensus",
      input.conflictResolutionSnapshot?.signature ?? "no-negotiation",
      input.consensusPrioritySnapshot?.signature ?? "no-weighting",
      input.collectiveGuidanceSnapshot?.signature ?? "no-advisory",
      input.counterfactualSnapshot?.signature ?? "no-debate",
      input.diversitySnapshot?.signature ?? "no-diversity",
      input.collectiveLearningSnapshot?.signature ?? "no-collective-learning",
      input.unifiedSelfReflectiveSnapshot?.signature ?? "no-unified-reflective",
      input.memorySnapshot?.signature ?? "no-memory",
      input.foresightSnapshot?.signature ?? "no-foresight",
      input.decisionSnapshot?.signature ?? "no-decision",
    ]);

    if (
      !shouldEvaluateDistributedMemorySync(
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

    const activeLayers = countActiveUnifiedLayers(input);
    const collectiveLearningDepth = input.collectiveLearningSnapshot?.observationCount ?? 0;

    if (activeLayers < DISTRIBUTED_MEMORY_SYNC_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_continuity_monitoring_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    if (collectiveLearningDepth < DISTRIBUTED_MEMORY_SYNC_MIN_COLLECTIVE_LEARNING_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_collective_learning_depth",
        snapshot: prior.snapshots[0] ?? null,
        newObservations: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: CollaborativeContinuityObservation[] = [];

    const primaryAlignment = buildEnterpriseDistributedMemoryAlignment(input, now);
    if (primaryAlignment) candidates.push(primaryAlignment);

    const govResAlignment = buildGovernanceResilienceMemoryAlignment(input, now);
    if (govResAlignment) candidates.push(govResAlignment);

    const speedDivergence = buildOperationalSpeedMemoryDivergence(input, now);
    if (speedDivergence) candidates.push(speedDivergence);

    const institutionalContinuity = buildInstitutionalMemoryContinuityStrengthening(input, now);
    if (institutionalContinuity) candidates.push(institutionalContinuity);

    const counterfactualDurability = buildCounterfactualMemoryDurability(input, now);
    if (counterfactualDurability) candidates.push(counterfactualDurability);

    const enterpriseGradeSync = buildEnterpriseGradeMemorySynchronization(input, now);
    if (enterpriseGradeSync) candidates.push(enterpriseGradeSync);

    const fragmentationConcern = buildCognitionFragmentationConcern(input, now);
    if (fragmentationConcern) candidates.push(fragmentationConcern);

    const retained = candidates
      .filter(shouldRetainCollaborativeContinuityObservation)
      .sort(
        (a, b) =>
          continuityStateRank(b.continuityState) - continuityStateRank(a.continuityState) ||
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

    const signals = retained.map((o) => buildContinuitySignal(o, now));
    const divergence = retained
      .map((o) => buildDivergenceIndicator(o, now))
      .filter((d): d is EnterpriseMemoryDivergenceIndicator => d !== null);
    const fields = retained
      .map((o) => buildAlignmentField(o, now))
      .filter((f): f is StrategicMemoryAlignmentField => f !== null);

    store.upsertObservations(retained, now);
    store.upsertContinuitySignals(signals, now);
    store.upsertDivergenceIndicators(divergence, now);
    store.upsertAlignmentFields(fields, now);

    const snapshot = buildMemorySyncSnapshot(
      organizationId,
      retained,
      signals,
      divergence,
      fields,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastContinuityState(snapshot.awarenessSummary.dominantContinuityState);

    const finalState = store.getState();
    const priorContinuity = prior.lastContinuityState;

    if (primaryAlignment || institutionalContinuity || counterfactualDurability) {
      devLog("distributed continuity stabilization — strategic-memory alignment advancing");
    }

    if (speedDivergence) {
      devLog("synchronization degradation — operational-speed historical alignment fragmented");
    }

    if (enterpriseGradeSync) {
      devLog("enterprise-grade memory alignment — distributed cognition continuity stabilized");
    }

    if (fragmentationConcern) {
      devLog("cognition-fragmentation emergence — collaborative memory continuity uneven");
    }

    if (
      priorContinuity &&
      priorContinuity !== snapshot.awarenessSummary.dominantContinuityState &&
      (snapshot.awarenessSummary.dominantContinuityState === "synchronized" ||
        snapshot.awarenessSummary.dominantContinuityState === "continuous")
    ) {
      devLog(
        `synchronization recovery — ${priorContinuity} → ${snapshot.awarenessSummary.dominantContinuityState}`
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
    endDistributedMemorySyncEvaluation();
  }
}
