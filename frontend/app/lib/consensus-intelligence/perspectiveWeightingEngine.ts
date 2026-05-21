import { stableSignature } from "../intelligence/shared/dedupe";
import type { ExecutiveReasoningPerspective } from "./consensusIntelligenceTypes";
import {
  beginPerspectiveWeightingEvaluation,
  clampWeightingConfidence,
  endPerspectiveWeightingEvaluation,
  PERSPECTIVE_WEIGHTING_MIN_NEGOTIATION_DEPTH,
  PERSPECTIVE_WEIGHTING_MIN_UNIFIED_LAYERS,
  priorityStateRank,
  shouldEvaluatePerspectiveWeighting,
  shouldRetainStrategicPerspectiveWeight,
  weightingStrengthRank,
} from "./perspectiveWeightingGuards";
import { getPerspectiveWeightingStore } from "./perspectiveWeightingStore";
import type {
  AdaptiveInfluenceSignal,
  ConsensusPrioritizationSummary,
  EnterpriseConsensusPrioritySnapshot,
  ExecutiveWeightingField,
  PerspectivePriorityShift,
  PriorityState,
  StrategicPerspectiveWeight,
  StrategicPerspectiveWeightingInput,
  StrategicPerspectiveWeightingResult,
  WeightedPerspectiveInfluence,
  WeightingCategory,
  WeightingStrength,
} from "./perspectiveWeightingTypes";

const DEV_LOG_PREFIX = "[Nexora][PerspectiveWeighting]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildWeightingId(label: string): string {
  return stableSignature(["perspective-weighting", label]).slice(0, 56);
}

function countActiveUnifiedLayers(input: StrategicPerspectiveWeightingInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function createWeighting(
  label: string,
  priorityState: PriorityState,
  weightingStrength: WeightingStrength,
  weightingCategory: WeightingCategory,
  summary: string,
  dominantPerspectives: WeightedPerspectiveInfluence[],
  reducedPerspectives: WeightedPerspectiveInfluence[],
  weightingSignals: string[],
  confidence: number,
  now: number
): StrategicPerspectiveWeight {
  return {
    weightingId: buildWeightingId(label),
    priorityState,
    weightingStrength,
    weightingCategory,
    summary,
    dominantPerspectives: Object.freeze(dominantPerspectives),
    reducedPerspectives: Object.freeze(reducedPerspectives),
    weightingSignals: Object.freeze(weightingSignals),
    confidence: clampWeightingConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function topPerspectivesByWeight(
  perspectives: readonly ExecutiveReasoningPerspective[],
  minWeight: number
): WeightedPerspectiveInfluence[] {
  return perspectives
    .filter((p) => p.perspectiveWeight >= minWeight)
    .sort((a, b) => b.perspectiveWeight - a.perspectiveWeight)
    .map((p) => p.perspectiveCategory)
    .slice(0, 4);
}

function buildEscalationResilienceGovernancePriority(
  input: StrategicPerspectiveWeightingInput,
  now: number
): StrategicPerspectiveWeight | null {
  const escalation =
    input.fragilityElevated ||
    input.cognitionSnapshot?.pressurePosture === "attention" ||
    input.cognitionSnapshot?.executiveStabilityActive === false;
  const reflective = input.unifiedSelfReflectiveSnapshot;
  const stress =
    reflective?.runtimeStatus === "recovering" ||
    reflective?.summary.uncertaintyPosture === "cautious" ||
    reflective?.summary.uncertaintyPosture === "restricted";

  if (!escalation && !stress) return null;

  return createWeighting(
    "enterprise_priority_shift_01",
    "adaptive",
    "elevated",
    "resilience_priority",
    "Governance and resilience perspectives have gained elevated influence due to rising escalation propagation and increasing pressure across dependent operational systems.",
    ["governance", "resilience"],
    ["operational_speed"],
    ["escalation_pressure_increase", "resilience_priority_adaptation", "governance_influence_reinforcement"],
    0.88,
    now
  );
}

function buildRecoveryOperationalSpeedPriority(
  input: StrategicPerspectiveWeightingInput,
  now: number
): StrategicPerspectiveWeight | null {
  const reflective = input.unifiedSelfReflectiveSnapshot;
  const recovering =
    reflective?.summary.adaptationState === "self_stabilized" ||
    reflective?.summary.adaptationState === "stabilizing" ||
    reflective?.runtimeStatus === "stable";
  const decisionStable = input.decisionSnapshot?.runtimeStatus === "stable";

  if (!recovering || !decisionStable) return null;

  return createWeighting(
    "recovery_operational_speed_priority",
    "shifting",
    "elevated",
    "operational_speed_priority",
    "Stable recovery conditions emerging — operational-speed and coordination perspectives gain strengthened influence for execution acceleration without abandoning stabilization discipline.",
    ["operational_speed", "coordination", "recovery"],
    ["risk"],
    ["recovery_conditions_emerging", "operational_speed_influence_strengthened", "coordination_priority"],
    0.85,
    now
  );
}

function buildUncertaintyTrustExplainabilityPriority(
  input: StrategicPerspectiveWeightingInput,
  now: number
): StrategicPerspectiveWeight | null {
  const reflective = input.unifiedSelfReflectiveSnapshot;
  const uncertainty =
    reflective?.summary.uncertaintyPosture === "cautious" ||
    reflective?.summary.uncertaintyPosture === "restricted" ||
    reflective?.summary.trustCalibration === "calibrating" ||
    reflective?.summary.trustCalibration === "under_review";

  if (!uncertainty) return null;

  return createWeighting(
    "uncertainty_trust_explainability_priority",
    "adaptive",
    "dominant",
    "trust_priority",
    "Governance, resilience, and trust-calibration perspectives have gained elevated influence due to rising uncertainty and increasing escalation propagation across dependent operational systems.",
    ["governance", "resilience", "trust", "explainability"],
    ["operational_speed"],
    ["uncertainty_growth", "trust_calibration_priority", "explainability_weighting"],
    0.9,
    now
  );
}

function buildInstitutionalMemoryGovernancePriority(
  input: StrategicPerspectiveWeightingInput,
  now: number
): StrategicPerspectiveWeight | null {
  const memoryStrong =
    input.memorySnapshot?.runtimeStatus === "stable" ||
    (input.memorySnapshot?.summary.primaryStrategicLesson.trim().length ?? 0) > 0;
  const governanceConcern =
    input.governanceCoherenceSnapshot?.alignmentSummary.coherencePosture === "moderate" ||
    input.governanceSnapshot?.governanceStatus === "monitored" ||
    input.governanceSnapshot?.governanceStatus === "degraded";

  if (!memoryStrong || !governanceConcern) return null;

  return createWeighting(
    "institutional_memory_governance_priority",
    "shifting",
    "moderate",
    "governance_priority",
    "Institutional memory reinforces governance concerns — governance weighting strengthened while preserving distributed perspective diversity.",
    ["governance", "foresight"],
    ["operational_speed"],
    ["institutional_memory_alignment", "governance_weighting_strengthened", "historical_governance_reinforcement"],
    0.84,
    now
  );
}

function buildInfluenceConcentrationWarning(
  input: StrategicPerspectiveWeightingInput,
  now: number
): StrategicPerspectiveWeight | null {
  const perspectives = input.strategicConsensusSnapshot?.reasoningPerspectives ?? [];
  if (perspectives.length < 4) return null;

  const highWeight = perspectives.filter((p) => p.perspectiveWeight >= 0.85);
  const categories = new Set(highWeight.map((p) => p.perspectiveCategory));

  if (categories.size > 2 || highWeight.length < 3) return null;

  const dominant = topPerspectivesByWeight(perspectives, 0.85);
  const reduced = perspectives
    .filter((p) => p.perspectiveWeight < 0.72)
    .map((p) => p.perspectiveCategory)
    .slice(0, 3);

  return createWeighting(
    "weighting_balance_warning",
    "concentrated",
    "moderate",
    "unknown",
    "Multiple perspectives are over-concentrating — weighting-balance warning indicates strategic influence may be narrowing despite retained perspective diversity in consensus records.",
    dominant,
    reduced,
    ["weighting_balance_warning", "influence_concentration", "perspective_over_concentration"],
    0.76,
    now
  );
}

function buildExecutiveGradePrioritizationBalance(
  input: StrategicPerspectiveWeightingInput,
  now: number
): StrategicPerspectiveWeight | null {
  const runtimesStable =
    input.decisionSnapshot?.runtimeStatus === "stable" &&
    input.foresightSnapshot?.runtimeStatus === "stable" &&
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "stable";
  const diversity =
    (input.strategicConsensusSnapshot?.awarenessSummary.perspectiveDiversityPosture ?? "low") !==
    "low";
  const reconciled =
    input.conflictResolutionSnapshot?.awarenessSummary.dominantResolutionState === "reconciled" ||
    input.conflictResolutionSnapshot?.awarenessSummary.dominantResolutionState ===
      "partially_resolved";

  if (!runtimesStable || !diversity) return null;

  const perspectives = input.strategicConsensusSnapshot?.reasoningPerspectives ?? [];
  const dominant = topPerspectivesByWeight(perspectives, 0.78);

  return createWeighting(
    "executive_grade_prioritization_balance",
    reconciled ? "stabilized" : "balanced",
    "executive_grade",
    "stability_priority",
    "Stable distributed cognition maintains executive-grade prioritization balance — perspective influence remains adaptively distributed without permanent minority suppression.",
    dominant.length > 0
      ? dominant
      : (["governance", "resilience", "stability", "coordination"] as WeightedPerspectiveInfluence[]),
    [],
    [
      "executive_grade_prioritization_balance",
      "distributed_influence_balancing",
      "consensus_diversity_preserved",
    ],
    0.93,
    now
  );
}

function buildForesightStabilityPriority(
  input: StrategicPerspectiveWeightingInput,
  now: number
): StrategicPerspectiveWeight | null {
  const foresightStable = input.foresightSnapshot?.runtimeStatus === "stable";
  const focus = input.foresightSnapshot?.summary.recommendedFocus?.trim() ?? "";
  if (!foresightStable || focus.length < 1) return null;

  return createWeighting(
    "foresight_stability_priority",
    "balanced",
    "moderate",
    "foresight_priority",
    "Strategic foresight and stability perspectives maintain moderate elevated weighting under anticipatory alignment with institutional continuity objectives.",
    ["foresight", "stability"],
    [],
    ["foresight_consistency", "stability_weighting", "anticipatory_alignment"],
    0.82,
    now
  );
}

function buildInfluenceSignal(
  weighting: StrategicPerspectiveWeight,
  now: number
): AdaptiveInfluenceSignal {
  return {
    signalId: stableSignature(["influence-signal", weighting.weightingId]).slice(0, 48),
    signalLabel: weighting.priorityState.replace(/_/g, " "),
    signalSummary: weighting.summary.slice(0, 100),
    linkedCategories: Object.freeze([weighting.weightingCategory]),
    signalIntensity:
      weighting.weightingStrength === "executive_grade" || weighting.weightingStrength === "dominant"
        ? "high"
        : "moderate",
    confidence: weighting.confidence,
    generatedAt: now,
  };
}

function buildWeightingField(
  weighting: StrategicPerspectiveWeight,
  now: number
): ExecutiveWeightingField | null {
  if (
    weighting.priorityState !== "adaptive" &&
    weighting.priorityState !== "stabilized" &&
    weighting.priorityState !== "balanced"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["weighting-field", weighting.weightingId]).slice(0, 48),
    fieldLabel: weighting.priorityState.replace(/_/g, " "),
    fieldSummary: weighting.summary.slice(0, 80),
    influencePosture:
      weighting.weightingStrength === "executive_grade"
        ? "executive_grade"
        : weighting.weightingStrength === "dominant" || weighting.weightingStrength === "elevated"
          ? "high"
          : weighting.weightingStrength === "moderate"
            ? "moderate"
            : "low",
    linkedCategories: Object.freeze([weighting.weightingCategory]),
    generatedAt: now,
  };
}

function buildPriorityShift(
  weighting: StrategicPerspectiveWeight,
  priorState: PriorityState | null,
  now: number
): PerspectivePriorityShift | null {
  if (!priorState || priorState === weighting.priorityState) return null;
  return {
    shiftId: stableSignature(["priority-shift", weighting.weightingId, priorState]).slice(0, 48),
    shiftLabel: `${priorState} → ${weighting.priorityState}`,
    shiftSummary: weighting.summary.slice(0, 100),
    fromPriorityState: priorState,
    toPriorityState: weighting.priorityState,
    elevatedPerspectives: weighting.dominantPerspectives,
    deprioritizedPerspectives: weighting.reducedPerspectives,
    generatedAt: now,
  };
}

function buildPrioritySnapshot(
  organizationId: string,
  weightings: StrategicPerspectiveWeight[],
  shifts: PerspectivePriorityShift[],
  signals: AdaptiveInfluenceSignal[],
  fields: ExecutiveWeightingField[],
  now: number
): EnterpriseConsensusPrioritySnapshot {
  const top = weightings[0];
  const awarenessSummary: ConsensusPrioritizationSummary = top
    ? {
        dominantPriorityState: top.priorityState,
        dominantWeightingStrength: top.weightingStrength,
        prioritizationHeadline: top.summary,
        balancePosture:
          top.weightingStrength === "executive_grade"
            ? "executive_grade"
            : top.weightingStrength === "dominant" || top.weightingStrength === "elevated"
              ? "high"
              : top.weightingStrength === "moderate"
                ? "moderate"
                : "low",
      }
    : {
        dominantPriorityState: "balanced",
        dominantWeightingStrength: "weak",
        prioritizationHeadline:
          "Enterprise adaptive consensus prioritization awaiting sufficient negotiation runtime depth.",
        balancePosture: "low",
      };

  const signature = stableSignature([
    "d9-7-3-consensus-priority-snapshot",
    organizationId,
    weightings.map((w) => w.weightingId),
    awarenessSummary.balancePosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: weightings.length,
    awarenessSummary,
    recentWeightings: Object.freeze(weightings.slice(0, 6)),
    priorityShifts: Object.freeze(shifts.slice(0, 6)),
    influenceSignals: Object.freeze(signals.slice(0, 6)),
    weightingFields: Object.freeze(fields.slice(0, 6)),
  };
}

export function evaluateStrategicPerspectiveWeighting(
  input: StrategicPerspectiveWeightingInput
): StrategicPerspectiveWeightingResult {
  if (!beginPerspectiveWeightingEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newWeightings: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getPerspectiveWeightingStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-7-3-perspective-weighting-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.strategicConsensusSnapshot?.signature ?? "no-consensus",
      input.conflictResolutionSnapshot?.signature ?? "no-negotiation",
      input.unifiedSelfReflectiveSnapshot?.signature ?? "no-unified-reflective",
      input.memorySnapshot?.signature ?? "no-memory",
      input.foresightSnapshot?.signature ?? "no-foresight",
      input.decisionSnapshot?.signature ?? "no-decision",
    ]);

    if (
      !shouldEvaluatePerspectiveWeighting(
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
        newWeightings: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const negotiationDepth = input.conflictResolutionSnapshot?.observationCount ?? 0;

    if (activeLayers < PERSPECTIVE_WEIGHTING_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_weighting_monitoring_depth",
        snapshot: prior.snapshots[0] ?? null,
        newWeightings: 0,
        storeSignature: prior.signature,
      };
    }

    if (negotiationDepth < PERSPECTIVE_WEIGHTING_MIN_NEGOTIATION_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_negotiation_depth",
        snapshot: prior.snapshots[0] ?? null,
        newWeightings: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: StrategicPerspectiveWeight[] = [];

    const escalationPriority = buildEscalationResilienceGovernancePriority(input, now);
    if (escalationPriority) candidates.push(escalationPriority);

    const recoverySpeed = buildRecoveryOperationalSpeedPriority(input, now);
    if (recoverySpeed) candidates.push(recoverySpeed);

    const uncertaintyTrust = buildUncertaintyTrustExplainabilityPriority(input, now);
    if (uncertaintyTrust) candidates.push(uncertaintyTrust);

    const memoryGovernance = buildInstitutionalMemoryGovernancePriority(input, now);
    if (memoryGovernance) candidates.push(memoryGovernance);

    const concentrationWarning = buildInfluenceConcentrationWarning(input, now);
    if (concentrationWarning) candidates.push(concentrationWarning);

    const executiveBalance = buildExecutiveGradePrioritizationBalance(input, now);
    if (executiveBalance) candidates.push(executiveBalance);

    const foresightStability = buildForesightStabilityPriority(input, now);
    if (foresightStability) candidates.push(foresightStability);

    const retained = candidates
      .filter(shouldRetainStrategicPerspectiveWeight)
      .sort(
        (a, b) =>
          priorityStateRank(b.priorityState) - priorityStateRank(a.priorityState) ||
          weightingStrengthRank(b.weightingStrength) - weightingStrengthRank(a.weightingStrength) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_weightings",
        snapshot: prior.snapshots[0] ?? null,
        newWeightings: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.weightings.map((w) => w.weightingId));
    const newCount = retained.filter((w) => !priorIds.has(w.weightingId)).length;

    const signals = retained.map((w) => buildInfluenceSignal(w, now));
    const fields = retained
      .map((w) => buildWeightingField(w, now))
      .filter((f): f is ExecutiveWeightingField => f !== null);
    const shifts = retained
      .map((w) => buildPriorityShift(w, prior.lastPriorityState, now))
      .filter((s): s is PerspectivePriorityShift => s !== null);

    store.upsertWeightings(retained, now);
    store.upsertInfluenceSignals(signals, now);
    store.upsertWeightingFields(fields, now);
    store.upsertPriorityShifts(shifts, now);

    const snapshot = buildPrioritySnapshot(organizationId, retained, shifts, signals, fields, now);

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastPriorityState(snapshot.awarenessSummary.dominantPriorityState);

    const finalState = store.getState();
    const priorPriority = prior.lastPriorityState;

    if (escalationPriority || uncertaintyTrust || memoryGovernance) {
      devLog("major weighting shift — strategic perspective influence recalibrated");
    }

    if (concentrationWarning) {
      devLog("strategic weighting imbalance warning — influence concentration detected");
    }

    if (executiveBalance) {
      devLog("executive-grade prioritization stabilization — distributed influence balance maintained");
    }

    if (
      priorPriority &&
      priorPriority !== snapshot.awarenessSummary.dominantPriorityState &&
      (snapshot.awarenessSummary.dominantPriorityState === "stabilized" ||
        snapshot.awarenessSummary.dominantPriorityState === "adaptive")
    ) {
      devLog(
        `priority state shift — ${priorPriority} → ${snapshot.awarenessSummary.dominantPriorityState}`
      );
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newWeightings: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endPerspectiveWeightingEvaluation();
  }
}
