import { stableSignature } from "../intelligence/shared/dedupe";
import type { StrategicConsensusRecord } from "./consensusIntelligenceTypes";
import {
  beginDistributedAdvisoryEvaluation,
  clampAdvisoryConfidence,
  coordinationStateRank,
  DISTRIBUTED_ADVISORY_MIN_UNIFIED_LAYERS,
  DISTRIBUTED_ADVISORY_MIN_WEIGHTING_DEPTH,
  endDistributedAdvisoryEvaluation,
  guidanceStrengthRank,
  shouldEvaluateDistributedAdvisory,
  shouldRetainDistributedExecutiveAdvisory,
} from "./distributedAdvisoryGuards";
import { getDistributedAdvisoryStore } from "./distributedAdvisoryStore";
import type {
  AdvisoryCategory,
  AdvisoryCoordinationSignal,
  CollectiveStrategicGuidanceSnapshot,
  CoordinationState,
  DistributedAdvisorySummary,
  DistributedExecutiveAdvisory,
  DistributedExecutiveAdvisoryInput,
  DistributedExecutiveAdvisoryResult,
  EnterpriseRecommendationConsensus,
  GuidanceStrength,
  StrategicGuidanceField,
} from "./distributedAdvisoryTypes";

const DEV_LOG_PREFIX = "[Nexora][DistributedAdvisory]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildAdvisoryId(label: string): string {
  return stableSignature(["distributed-advisory", label]).slice(0, 56);
}

function countActiveUnifiedLayers(input: DistributedExecutiveAdvisoryInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function hasConsensusSignal(records: readonly StrategicConsensusRecord[], signal: string): boolean {
  return records.some((r) => r.consensusSignals.includes(signal));
}

function createAdvisory(
  label: string,
  coordinationState: CoordinationState,
  guidanceStrength: GuidanceStrength,
  advisoryCategory: AdvisoryCategory,
  summary: string,
  alignedGuidance: string[],
  moderatedGuidance: string[],
  advisorySignals: string[],
  confidence: number,
  now: number
): DistributedExecutiveAdvisory {
  return {
    advisoryId: buildAdvisoryId(label),
    coordinationState,
    guidanceStrength,
    advisoryCategory,
    summary,
    alignedGuidance: Object.freeze(alignedGuidance),
    moderatedGuidance: Object.freeze(moderatedGuidance),
    advisorySignals: Object.freeze(advisorySignals),
    confidence: clampAdvisoryConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildCollectiveStabilizationGuidance(
  input: DistributedExecutiveAdvisoryInput,
  now: number
): DistributedExecutiveAdvisory | null {
  const consensus = input.strategicConsensusSnapshot;
  if (!consensus) return null;

  const records = consensus.recentConsensusRecords;
  const govResilience =
    hasConsensusSignal(records, "governance_resilience_alignment") ||
    records.some(
      (r) =>
        r.alignedPerspectives.includes("governance") &&
        r.alignedPerspectives.includes("resilience")
    );
  const weightingElevates =
    input.consensusPrioritySnapshot?.recentWeightings.some(
      (w) =>
        w.weightingCategory === "resilience_priority" ||
        w.weightingCategory === "governance_priority"
    ) ?? false;

  if (!govResilience && !weightingElevates) return null;

  return createAdvisory(
    "enterprise_collective_guidance_01",
    "coordinated",
    "strong",
    "governance_guidance",
    "Distributed enterprise cognition recommends governance stabilization, adaptive escalation containment, and resilience reinforcement while moderating operational acceleration under elevated uncertainty conditions.",
    ["governance_stabilization", "resilience_reinforcement", "adaptive_containment"],
    ["operational_acceleration"],
    ["governance_resilience_alignment", "collective_stabilization", "cross_runtime_alignment"],
    0.91,
    now
  );
}

function buildBalancedOperationalAdvisory(
  input: DistributedExecutiveAdvisoryInput,
  now: number
): DistributedExecutiveAdvisory | null {
  const negotiation = input.conflictResolutionSnapshot;
  const speedConflict =
    negotiation?.recentNegotiations.some((n) => n.negotiationCategory === "governance_vs_speed") ||
    input.strategicConsensusSnapshot?.recentConsensusRecords.some((r) =>
      r.divergentPerspectives.includes("operational_speed")
    );

  if (!speedConflict) return null;

  return createAdvisory(
    "balanced_operational_advisory",
    "partially_aligned",
    "moderate",
    "operational_guidance",
    "Operational speed partially conflicts with caution systems — balanced advisory synthesis recommends selective acceleration within governance-bounded sequencing and stabilization guardrails.",
    ["governance_stabilization", "adaptive_containment"],
    ["operational_acceleration"],
    ["balanced_advisory_synthesis", "orchestration_disagreement", "adaptive_tradeoff_balance"],
    0.86,
    now
  );
}

function buildInstitutionalMemoryResilienceGuidance(
  input: DistributedExecutiveAdvisoryInput,
  now: number
): DistributedExecutiveAdvisory | null {
  const memoryStrong =
    input.memorySnapshot?.runtimeStatus === "stable" ||
    (input.memorySnapshot?.summary.primaryStrategicLesson.trim().length ?? 0) > 0;
  const memorySupport =
    input.strategicConsensusSnapshot &&
    hasConsensusSignal(
      input.strategicConsensusSnapshot.recentConsensusRecords,
      "institutional_memory_support"
    );

  if (!memoryStrong || !memorySupport) return null;

  return createAdvisory(
    "institutional_memory_resilience_guidance",
    "converging",
    "strong",
    "resilience_guidance",
    "Institutional memory reinforces resilience recommendations — elevated resilience guidance weighting supports historically validated containment and recovery pathways.",
    ["resilience_reinforcement", "adaptive_containment", "recovery_acceleration"],
    [],
    ["institutional_memory_support", "resilience_guidance_elevation", "historical_validation"],
    0.88,
    now
  );
}

function buildExecutiveGradeRecommendationCoordination(
  input: DistributedExecutiveAdvisoryInput,
  now: number
): DistributedExecutiveAdvisory | null {
  const runtimesStable =
    input.decisionSnapshot?.runtimeStatus === "stable" &&
    input.foresightSnapshot?.runtimeStatus === "stable" &&
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "stable";
  const crossAligned =
    input.strategicConsensusSnapshot &&
    (hasConsensusSignal(
      input.strategicConsensusSnapshot.recentConsensusRecords,
      "cross_runtime_alignment"
    ) ||
      hasConsensusSignal(
        input.strategicConsensusSnapshot.recentConsensusRecords,
        "executive_grade_alignment"
      ));
  const weightingBalanced =
    input.consensusPrioritySnapshot?.awarenessSummary.balancePosture === "executive_grade" ||
    input.consensusPrioritySnapshot?.awarenessSummary.balancePosture === "high";

  if (!runtimesStable || !crossAligned) return null;

  return createAdvisory(
    "executive_grade_recommendation_coordination",
    weightingBalanced ? "collectively_aligned" : "converging",
    "executive_grade",
    "orchestration_guidance",
    "Multiple enterprise runtimes converge consistently — executive-grade recommendation coordination synthesizes balanced multi-perspective guidance without autonomous execution authority.",
    [
      "governance_stabilization",
      "resilience_reinforcement",
      "orchestration_coordination",
      "foresight_alignment",
    ],
    [],
    ["cross_runtime_alignment", "executive_grade_recommendation_coordination", "collective_convergence"],
    0.93,
    now
  );
}

function buildFragmentedAdvisoryWarning(
  input: DistributedExecutiveAdvisoryInput,
  now: number
): DistributedExecutiveAdvisory | null {
  const consensus = input.strategicConsensusSnapshot;
  const fragmented =
    consensus?.awarenessSummary.dominantConsensusState === "fragmented" ||
    consensus?.awarenessSummary.dominantConsensusState === "divergent";
  const negotiationUnresolved =
    input.conflictResolutionSnapshot?.awarenessSummary.dominantResolutionState === "unresolved" ||
    input.conflictResolutionSnapshot?.awarenessSummary.dominantResolutionState === "contested";

  if (!fragmented && !negotiationUnresolved) return null;

  return createAdvisory(
    "unstable_advisory_warning",
    "fragmented",
    "weak",
    "unknown",
    "Distributed perspectives remain fragmented — unstable advisory warning indicates collective strategic guidance cannot yet stabilize without additional coordination signals.",
    [],
    ["operational_acceleration", "recovery_acceleration"],
    ["unstable_advisory_warning", "recommendation_fragmentation", "perspective_incompatibility"],
    0.64,
    now
  );
}

function buildTrustModeratedOrchestrationGuidance(
  input: DistributedExecutiveAdvisoryInput,
  now: number
): DistributedExecutiveAdvisory | null {
  const reflective = input.unifiedSelfReflectiveSnapshot;
  const trustModerating =
    reflective?.summary.trustCalibration === "calibrating" ||
    reflective?.summary.trustCalibration === "under_review" ||
    reflective?.summary.uncertaintyPosture === "cautious";
  const speedElevated = input.consensusPrioritySnapshot?.recentWeightings.some(
    (w) => w.weightingCategory === "operational_speed_priority"
  );

  if (!trustModerating) return null;

  return createAdvisory(
    "trust_moderated_orchestration_guidance",
    "coordinated",
    "strong",
    "trust_guidance",
    "Trust-calibration moderates aggressive orchestration — adaptive strategic guidance balance reduces confidence amplification while preserving coordinated stabilization recommendations.",
    ["governance_stabilization", "adaptive_containment", "trust_calibration_balance"],
    speedElevated ? ["operational_acceleration"] : [],
    ["trust_calibration_balance", "adaptive_strategic_guidance", "confidence_moderation"],
    0.87,
    now
  );
}

function buildRecoveryOrchestrationGuidance(
  input: DistributedExecutiveAdvisoryInput,
  now: number
): DistributedExecutiveAdvisory | null {
  const reflective = input.unifiedSelfReflectiveSnapshot;
  const recovering =
    reflective?.summary.adaptationState === "self_stabilized" ||
    reflective?.summary.adaptationState === "stabilizing";
  const decisionStable = input.decisionSnapshot?.runtimeStatus === "stable";

  if (!recovering || !decisionStable) return null;

  return createAdvisory(
    "recovery_orchestration_guidance",
    "coordinated",
    "moderate",
    "recovery_guidance",
    "Operational recovery conditions support coordinated orchestration guidance — selective execution acceleration remains bounded by governance and resilience advisory alignment.",
    ["recovery_acceleration", "orchestration_coordination"],
    ["risk_escalation"],
    ["recovery_conditions_emerging", "orchestration_guidance", "bounded_acceleration"],
    0.83,
    now
  );
}

function buildRecommendationConsensus(
  advisory: DistributedExecutiveAdvisory,
  now: number
): EnterpriseRecommendationConsensus {
  return {
    consensusId: stableSignature(["recommendation-consensus", advisory.advisoryId]).slice(0, 48),
    consensusLabel: advisory.coordinationState.replace(/_/g, " "),
    consensusSummary: advisory.summary.slice(0, 100),
    coordinationState: advisory.coordinationState,
    linkedCategories: Object.freeze([advisory.advisoryCategory]),
    confidence: advisory.confidence,
    generatedAt: now,
  };
}

function buildCoordinationSignal(
  advisory: DistributedExecutiveAdvisory,
  now: number
): AdvisoryCoordinationSignal {
  return {
    signalId: stableSignature(["advisory-coordination-signal", advisory.advisoryId]).slice(0, 48),
    signalLabel: advisory.coordinationState.replace(/_/g, " "),
    signalSummary: advisory.summary.slice(0, 100),
    linkedCategories: Object.freeze([advisory.advisoryCategory]),
    signalIntensity:
      advisory.guidanceStrength === "executive_grade" || advisory.guidanceStrength === "strong"
        ? "high"
        : "moderate",
    confidence: advisory.confidence,
    generatedAt: now,
  };
}

function buildGuidanceField(
  advisory: DistributedExecutiveAdvisory,
  now: number
): StrategicGuidanceField | null {
  if (
    advisory.coordinationState !== "coordinated" &&
    advisory.coordinationState !== "converging" &&
    advisory.coordinationState !== "collectively_aligned"
  ) {
    return null;
  }
  return {
    fieldId: stableSignature(["guidance-field", advisory.advisoryId]).slice(0, 48),
    fieldLabel: advisory.coordinationState.replace(/_/g, " "),
    fieldSummary: advisory.summary.slice(0, 80),
    guidancePosture:
      advisory.guidanceStrength === "executive_grade"
        ? "executive_grade"
        : advisory.guidanceStrength === "strong"
          ? "high"
          : advisory.guidanceStrength === "moderate"
            ? "moderate"
            : "low",
    linkedCategories: Object.freeze([advisory.advisoryCategory]),
    generatedAt: now,
  };
}

function buildCollectiveGuidanceSnapshot(
  organizationId: string,
  advisories: DistributedExecutiveAdvisory[],
  consensusRecords: EnterpriseRecommendationConsensus[],
  signals: AdvisoryCoordinationSignal[],
  fields: StrategicGuidanceField[],
  now: number
): CollectiveStrategicGuidanceSnapshot {
  const top = advisories[0];
  const awarenessSummary: DistributedAdvisorySummary = top
    ? {
        dominantCoordinationState: top.coordinationState,
        dominantGuidanceStrength: top.guidanceStrength,
        advisoryHeadline: top.summary,
        collectivePosture:
          top.guidanceStrength === "executive_grade"
            ? "executive_grade"
            : top.guidanceStrength === "strong"
              ? "high"
              : top.guidanceStrength === "moderate"
                ? "moderate"
                : "low",
      }
    : {
        dominantCoordinationState: "fragmented",
        dominantGuidanceStrength: "weak",
        advisoryHeadline:
          "Enterprise collective strategic guidance awaiting sufficient perspective-weighting runtime depth.",
        collectivePosture: "low",
      };

  const signature = stableSignature([
    "d9-7-4-collective-guidance-snapshot",
    organizationId,
    advisories.map((a) => a.advisoryId),
    awarenessSummary.collectivePosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: advisories.length,
    awarenessSummary,
    recentAdvisories: Object.freeze(advisories.slice(0, 6)),
    recommendationConsensus: Object.freeze(consensusRecords.slice(0, 6)),
    coordinationSignals: Object.freeze(signals.slice(0, 6)),
    guidanceFields: Object.freeze(fields.slice(0, 6)),
  };
}

export function evaluateDistributedExecutiveAdvisory(
  input: DistributedExecutiveAdvisoryInput
): DistributedExecutiveAdvisoryResult {
  if (!beginDistributedAdvisoryEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newAdvisories: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getDistributedAdvisoryStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-7-4-distributed-advisory-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.strategicConsensusSnapshot?.signature ?? "no-consensus",
      input.conflictResolutionSnapshot?.signature ?? "no-negotiation",
      input.consensusPrioritySnapshot?.signature ?? "no-weighting",
      input.unifiedSelfReflectiveSnapshot?.signature ?? "no-unified-reflective",
      input.memorySnapshot?.signature ?? "no-memory",
      input.foresightSnapshot?.signature ?? "no-foresight",
      input.decisionSnapshot?.signature ?? "no-decision",
    ]);

    if (
      !shouldEvaluateDistributedAdvisory(
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
        newAdvisories: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const weightingDepth = input.consensusPrioritySnapshot?.observationCount ?? 0;

    if (activeLayers < DISTRIBUTED_ADVISORY_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_advisory_monitoring_depth",
        snapshot: prior.snapshots[0] ?? null,
        newAdvisories: 0,
        storeSignature: prior.signature,
      };
    }

    if (weightingDepth < DISTRIBUTED_ADVISORY_MIN_WEIGHTING_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_weighting_depth",
        snapshot: prior.snapshots[0] ?? null,
        newAdvisories: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: DistributedExecutiveAdvisory[] = [];

    const collectiveStabilization = buildCollectiveStabilizationGuidance(input, now);
    if (collectiveStabilization) candidates.push(collectiveStabilization);

    const balancedOperational = buildBalancedOperationalAdvisory(input, now);
    if (balancedOperational) candidates.push(balancedOperational);

    const memoryResilience = buildInstitutionalMemoryResilienceGuidance(input, now);
    if (memoryResilience) candidates.push(memoryResilience);

    const executiveCoordination = buildExecutiveGradeRecommendationCoordination(input, now);
    if (executiveCoordination) candidates.push(executiveCoordination);

    const fragmentedWarning = buildFragmentedAdvisoryWarning(input, now);
    if (fragmentedWarning) candidates.push(fragmentedWarning);

    const trustModerated = buildTrustModeratedOrchestrationGuidance(input, now);
    if (trustModerated) candidates.push(trustModerated);

    const recoveryGuidance = buildRecoveryOrchestrationGuidance(input, now);
    if (recoveryGuidance) candidates.push(recoveryGuidance);

    const retained = candidates
      .filter(shouldRetainDistributedExecutiveAdvisory)
      .sort(
        (a, b) =>
          coordinationStateRank(b.coordinationState) - coordinationStateRank(a.coordinationState) ||
          guidanceStrengthRank(b.guidanceStrength) - guidanceStrengthRank(a.guidanceStrength) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_advisories",
        snapshot: prior.snapshots[0] ?? null,
        newAdvisories: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.advisories.map((a) => a.advisoryId));
    const newCount = retained.filter((a) => !priorIds.has(a.advisoryId)).length;

    const consensusRecords = retained.map((a) => buildRecommendationConsensus(a, now));
    const signals = retained.map((a) => buildCoordinationSignal(a, now));
    const fields = retained
      .map((a) => buildGuidanceField(a, now))
      .filter((f): f is StrategicGuidanceField => f !== null);

    store.upsertAdvisories(retained, now);
    store.upsertRecommendationConsensus(consensusRecords, now);
    store.upsertCoordinationSignals(signals, now);
    store.upsertGuidanceFields(fields, now);

    const snapshot = buildCollectiveGuidanceSnapshot(
      organizationId,
      retained,
      consensusRecords,
      signals,
      fields,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastCoordinationState(snapshot.awarenessSummary.dominantCoordinationState);

    const finalState = store.getState();
    const priorCoordination = prior.lastCoordinationState;

    if (collectiveStabilization || executiveCoordination || memoryResilience) {
      devLog("major advisory convergence formation — collective guidance pathways emerging");
    }

    if (fragmentedWarning) {
      devLog("recommendation fragmentation emergence — distributed advisory coordination stalled");
    }

    if (executiveCoordination) {
      devLog("executive-grade guidance stabilization — coordinated recommendation synthesis aligned");
    }

    if (balancedOperational && trustModerated) {
      devLog("collective-guidance conflict escalation — moderated operational tension detected");
    }

    if (
      priorCoordination &&
      priorCoordination !== snapshot.awarenessSummary.dominantCoordinationState &&
      (snapshot.awarenessSummary.dominantCoordinationState === "collectively_aligned" ||
        snapshot.awarenessSummary.dominantCoordinationState === "coordinated")
    ) {
      devLog(
        `coordination state shift — ${priorCoordination} → ${snapshot.awarenessSummary.dominantCoordinationState}`
      );
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newAdvisories: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endDistributedAdvisoryEvaluation();
  }
}
