import { stableSignature } from "../intelligence/shared/dedupe";
import {
  beginStrategicDebateEvaluation,
  clampDebateConfidence,
  counterfactualStateRank,
  debateStrengthRank,
  endStrategicDebateEvaluation,
  shouldEvaluateStrategicDebate,
  shouldRetainExecutiveStrategicDebate,
  STRATEGIC_DEBATE_MIN_ADVISORY_DEPTH,
  STRATEGIC_DEBATE_MIN_UNIFIED_LAYERS,
} from "./strategicDebateGuards";
import { getStrategicDebateStore } from "./strategicDebateStore";
import type {
  AlternativeStrategyProjection,
  AssumptionStressField,
  CounterfactualReasoningSnapshot,
  CounterfactualState,
  DebateCategory,
  DebateSimulationSummary,
  DebateStrength,
  EnterpriseChallengeSignal,
  ExecutiveStrategicDebate,
  ExecutiveStrategicDebateInput,
  ExecutiveStrategicDebateResult,
} from "./strategicDebateTypes";

const DEV_LOG_PREFIX = "[Nexora][StrategicDebate]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildDebateId(label: string): string {
  return stableSignature(["strategic-debate", label]).slice(0, 56);
}

function countActiveUnifiedLayers(input: ExecutiveStrategicDebateInput): number {
  let count = 0;
  if (input.memorySnapshot && input.memorySnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.foresightSnapshot && input.foresightSnapshot.runtimeStatus !== "initializing") count += 1;
  if (input.decisionSnapshot && input.decisionSnapshot.runtimeStatus !== "initializing") count += 1;
  return count;
}

function hasDominantGovernanceGuidance(input: ExecutiveStrategicDebateInput): boolean {
  return (
    input.collectiveGuidanceSnapshot?.recentAdvisories.some(
      (a) =>
        a.alignedGuidance.includes("governance_stabilization") ||
        a.advisoryCategory === "governance_guidance"
    ) ?? false
  );
}

function createDebate(
  label: string,
  counterfactualState: CounterfactualState,
  debateStrength: DebateStrength,
  debateCategory: DebateCategory,
  summary: string,
  challengedAssumptions: string[],
  reinforcedStrategies: string[],
  counterfactualSignals: string[],
  confidence: number,
  now: number
): ExecutiveStrategicDebate {
  return {
    debateId: buildDebateId(label),
    counterfactualState,
    debateStrength,
    debateCategory,
    summary,
    challengedAssumptions: Object.freeze(challengedAssumptions),
    reinforcedStrategies: Object.freeze(reinforcedStrategies),
    counterfactualSignals: Object.freeze(counterfactualSignals),
    confidence: clampDebateConfidence(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildAccelerationPriorityAlternative(
  input: ExecutiveStrategicDebateInput,
  now: number
): ExecutiveStrategicDebate | null {
  if (!hasDominantGovernanceGuidance(input)) return null;

  return createDebate(
    "enterprise_counterfactual_acceleration_alternative",
    "simulated",
    "moderate",
    "governance_vs_acceleration",
    "Counterfactual debate simulates acceleration-priority alternative — aggressive operational acceleration would increase escalation propagation unless coordination capacity remains stable under governance constraints.",
    ["governance_stabilization_is_optimal", "containment_can_be_delayed"],
    ["governance_stabilization", "adaptive_escalation_containment"],
    ["acceleration_priority_simulation", "dominant_assumption_challenge", "orchestration_reversal_explored"],
    0.84,
    now
  );
}

function buildResilienceSpeedDebate(
  input: ExecutiveStrategicDebateInput,
  now: number
): ExecutiveStrategicDebate | null {
  const speedConflict =
    input.conflictResolutionSnapshot?.recentNegotiations.some(
      (n) => n.negotiationCategory === "governance_vs_speed"
    ) ||
    input.strategicConsensusSnapshot?.recentConsensusRecords.some((r) =>
      r.divergentPerspectives.includes("operational_speed")
    );

  if (!speedConflict) return null;

  return createDebate(
    "enterprise_counterfactual_stress_test_01",
    "stress_tested",
    "strong",
    "resilience_vs_speed",
    "Counterfactual analysis suggests aggressive operational acceleration would increase escalation propagation and coordination instability, reinforcing governance stabilization and adaptive containment strategies.",
    ["rapid_execution_improves_recovery", "coordination_capacity_remains_stable"],
    ["governance_stabilization", "adaptive_escalation_containment"],
    ["institutional_memory_contradiction", "stress_propagation_growth", "resilience_degradation_risk"],
    0.9,
    now
  );
}

function buildInstitutionalMemoryAssumptionFragility(
  input: ExecutiveStrategicDebateInput,
  now: number
): ExecutiveStrategicDebate | null {
  const memoryStrong =
    input.memorySnapshot?.runtimeStatus === "stable" ||
    (input.memorySnapshot?.summary.primaryStrategicLesson.trim().length ?? 0) > 0;
  const optimizationPressure =
    input.collectiveGuidanceSnapshot?.recentAdvisories.some((a) =>
      a.moderatedGuidance.includes("operational_acceleration")
    ) ?? false;

  if (!memoryStrong || !optimizationPressure) return null;

  return createDebate(
    "institutional_memory_assumption_fragility",
    "contested",
    "moderate",
    "continuity_vs_optimization",
    "Institutional memory contradicts aggressive optimization assumptions — assumption fragility warning indicates historically validated containment pathways may outperform short-term acceleration.",
    ["aggressive_optimization_improves_outcomes", "short_term_acceleration_is_safe"],
    ["adaptive_escalation_containment", "resilience_reinforcement"],
    ["institutional_memory_contradiction", "assumption_fragility_warning", "historical_validation_challenge"],
    0.82,
    now
  );
}

function buildEscalationSpreadReinforcement(
  input: ExecutiveStrategicDebateInput,
  now: number
): ExecutiveStrategicDebate | null {
  const escalation =
    input.fragilityElevated ||
    input.cognitionSnapshot?.pressurePosture === "attention" ||
    input.cognitionSnapshot?.executiveStabilityActive === false;

  if (!escalation) return null;

  return createDebate(
    "counterfactual_escalation_spread",
    "stress_tested",
    "strong",
    "containment_vs_adaptation",
    "Counterfactual escalation spread worsens under delayed containment — stress-tested simulation reinforces stabilization and adaptive escalation containment before acceleration pathways.",
    ["escalation_can_be_tolerated_temporarily", "adaptation_outpaces_containment"],
    ["governance_stabilization", "adaptive_escalation_containment", "resilience_reinforcement"],
    ["stress_propagation_growth", "escalation_spread_worsening", "stabilization_reinforced"],
    0.88,
    now
  );
}

function buildAlternativeOrchestrationChallenge(
  input: ExecutiveStrategicDebateInput,
  now: number
): ExecutiveStrategicDebate | null {
  const reflective = input.unifiedSelfReflectiveSnapshot;
  const survivable =
    reflective?.summary.survivabilityState === "durable" ||
    reflective?.summary.survivabilityState === "survivable";
  const alternativeRecovery =
    reflective?.summary.adaptationState === "self_stabilized" &&
    input.decisionSnapshot?.runtimeStatus === "stable";

  if (!survivable || !alternativeRecovery) return null;

  return createDebate(
    "alternative_orchestration_survivability",
    "simulated",
    "moderate",
    "stabilization_vs_growth",
    "Alternative orchestration sequencing improves survivability in counterfactual simulation — dominant-strategy challenge signal questions whether growth-oriented acceleration precedes resilience reinforcement.",
    ["growth_precedes_resilience", "orchestration_sequence_is_fixed"],
    ["resilience_reinforcement", "recovery_acceleration"],
    ["dominant_strategy_challenge", "survivability_improvement_pathway", "orchestration_sequence_reversal"],
    0.85,
    now
  );
}

function buildExecutiveGradeRobustness(
  input: ExecutiveStrategicDebateInput,
  now: number
): ExecutiveStrategicDebate | null {
  const runtimesStable =
    input.decisionSnapshot?.runtimeStatus === "stable" &&
    input.foresightSnapshot?.runtimeStatus === "stable" &&
    input.unifiedSelfReflectiveSnapshot?.runtimeStatus === "stable";
  const advisoryAligned =
    input.collectiveGuidanceSnapshot?.awarenessSummary.collectivePosture === "executive_grade" ||
    input.collectiveGuidanceSnapshot?.awarenessSummary.collectivePosture === "high";
  const weightingBalanced =
    input.consensusPrioritySnapshot?.awarenessSummary.balancePosture === "executive_grade" ||
    input.consensusPrioritySnapshot?.awarenessSummary.balancePosture === "high";

  if (!runtimesStable || !advisoryAligned) return null;

  return createDebate(
    "executive_grade_strategic_robustness",
    weightingBalanced ? "strategically_resolved" : "stress_tested",
    "executive_grade",
    "caution_vs_execution",
    "Multiple counterfactual paths converge — executive-grade strategic robustness indicates distributed challenge cognition reinforces dominant guidance without autonomous execution authority.",
    [],
    [
      "governance_stabilization",
      "adaptive_escalation_containment",
      "resilience_reinforcement",
      "orchestration_coordination",
    ],
    ["executive_grade_debate_convergence", "strategic_robustness_reinforcement", "counterfactual_alignment"],
    0.93,
    now
  );
}

function buildTrustVsAggressionDebate(
  input: ExecutiveStrategicDebateInput,
  now: number
): ExecutiveStrategicDebate | null {
  const reflective = input.unifiedSelfReflectiveSnapshot;
  const trustModerating =
    reflective?.summary.trustCalibration === "calibrating" ||
    reflective?.summary.trustCalibration === "under_review";
  const aggressiveGuidance = input.collectiveGuidanceSnapshot?.recentAdvisories.some((a) =>
    a.moderatedGuidance.includes("operational_acceleration")
  );

  if (!trustModerating || !aggressiveGuidance) return null;

  return createDebate(
    "trust_vs_aggression_debate",
    "contested",
    "strong",
    "trust_vs_aggression",
    "Trust-calibration moderates aggressive orchestration in counterfactual debate — adaptive strategic balance reduces confidence amplification while preserving challenge pathways.",
    ["confidence_amplification_is_safe", "aggressive_orchestration_improves_speed"],
    ["trust_calibration_balance", "governance_stabilization"],
    ["trust_calibration_balance", "confidence_moderation_challenge", "adaptive_strategic_balance"],
    0.86,
    now
  );
}

function buildAlternativeProjection(
  debate: ExecutiveStrategicDebate,
  now: number
): AlternativeStrategyProjection {
  return {
    projectionId: stableSignature(["alternative-projection", debate.debateId]).slice(0, 48),
    projectionLabel: debate.debateCategory.replace(/_/g, " "),
    projectionSummary: debate.summary.slice(0, 100),
    primaryCategory: debate.debateCategory,
    survivabilityPosture:
      debate.debateStrength === "executive_grade"
        ? "executive_grade"
        : debate.debateStrength === "strong"
          ? "high"
          : debate.debateStrength === "moderate"
            ? "moderate"
            : "low",
    generatedAt: now,
  };
}

function buildChallengeSignal(
  debate: ExecutiveStrategicDebate,
  now: number
): EnterpriseChallengeSignal {
  return {
    signalId: stableSignature(["challenge-signal", debate.debateId]).slice(0, 48),
    signalLabel: debate.counterfactualState.replace(/_/g, " "),
    signalSummary: debate.summary.slice(0, 100),
    linkedCategories: Object.freeze([debate.debateCategory]),
    signalIntensity:
      debate.debateStrength === "executive_grade" || debate.debateStrength === "strong"
        ? "high"
        : "moderate",
    confidence: debate.confidence,
    generatedAt: now,
  };
}

function buildAssumptionStressField(
  debate: ExecutiveStrategicDebate,
  now: number
): AssumptionStressField | null {
  if (debate.challengedAssumptions.length < 1) return null;
  return {
    fieldId: stableSignature(["assumption-stress-field", debate.debateId]).slice(0, 48),
    fieldLabel: debate.counterfactualState.replace(/_/g, " "),
    fieldSummary: debate.summary.slice(0, 80),
    stressPosture:
      debate.debateStrength === "executive_grade"
        ? "executive_grade"
        : debate.debateStrength === "strong"
          ? "high"
          : debate.debateStrength === "moderate"
            ? "moderate"
            : "low",
    linkedCategories: Object.freeze([debate.debateCategory]),
    generatedAt: now,
  };
}

function buildCounterfactualSnapshot(
  organizationId: string,
  debates: ExecutiveStrategicDebate[],
  projections: AlternativeStrategyProjection[],
  signals: EnterpriseChallengeSignal[],
  fields: AssumptionStressField[],
  now: number
): CounterfactualReasoningSnapshot {
  const top = debates[0];
  const awarenessSummary: DebateSimulationSummary = top
    ? {
        dominantCounterfactualState: top.counterfactualState,
        dominantDebateStrength: top.debateStrength,
        debateHeadline: top.summary,
        robustnessPosture:
          top.debateStrength === "executive_grade"
            ? "executive_grade"
            : top.debateStrength === "strong"
              ? "high"
              : top.debateStrength === "moderate"
                ? "moderate"
                : "low",
      }
    : {
        dominantCounterfactualState: "exploratory",
        dominantDebateStrength: "weak",
        debateHeadline:
          "Enterprise counterfactual reasoning awaiting sufficient distributed advisory runtime depth.",
        robustnessPosture: "low",
      };

  const signature = stableSignature([
    "d9-7-5-counterfactual-reasoning-snapshot",
    organizationId,
    debates.map((d) => d.debateId),
    awarenessSummary.robustnessPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    observationCount: debates.length,
    awarenessSummary,
    recentDebates: Object.freeze(debates.slice(0, 6)),
    alternativeProjections: Object.freeze(projections.slice(0, 6)),
    challengeSignals: Object.freeze(signals.slice(0, 6)),
    assumptionStressFields: Object.freeze(fields.slice(0, 6)),
  };
}

export function evaluateExecutiveStrategicDebate(
  input: ExecutiveStrategicDebateInput
): ExecutiveStrategicDebateResult {
  if (!beginStrategicDebateEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newDebates: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getStrategicDebateStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-7-5-strategic-debate-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      input.strategicConsensusSnapshot?.signature ?? "no-consensus",
      input.conflictResolutionSnapshot?.signature ?? "no-negotiation",
      input.consensusPrioritySnapshot?.signature ?? "no-weighting",
      input.collectiveGuidanceSnapshot?.signature ?? "no-advisory",
      input.unifiedSelfReflectiveSnapshot?.signature ?? "no-unified-reflective",
      input.memorySnapshot?.signature ?? "no-memory",
      input.foresightSnapshot?.signature ?? "no-foresight",
      input.decisionSnapshot?.signature ?? "no-decision",
    ]);

    if (
      !shouldEvaluateStrategicDebate(
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
        newDebates: 0,
        storeSignature: prior.signature,
      };
    }

    const activeLayers = countActiveUnifiedLayers(input);
    const advisoryDepth = input.collectiveGuidanceSnapshot?.observationCount ?? 0;

    if (activeLayers < STRATEGIC_DEBATE_MIN_UNIFIED_LAYERS) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_debate_monitoring_depth",
        snapshot: prior.snapshots[0] ?? null,
        newDebates: 0,
        storeSignature: prior.signature,
      };
    }

    if (advisoryDepth < STRATEGIC_DEBATE_MIN_ADVISORY_DEPTH) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_advisory_depth",
        snapshot: prior.snapshots[0] ?? null,
        newDebates: 0,
        storeSignature: prior.signature,
      };
    }

    const candidates: ExecutiveStrategicDebate[] = [];

    const accelerationAlt = buildAccelerationPriorityAlternative(input, now);
    if (accelerationAlt) candidates.push(accelerationAlt);

    const resilienceSpeed = buildResilienceSpeedDebate(input, now);
    if (resilienceSpeed) candidates.push(resilienceSpeed);

    const memoryFragility = buildInstitutionalMemoryAssumptionFragility(input, now);
    if (memoryFragility) candidates.push(memoryFragility);

    const escalationReinforcement = buildEscalationSpreadReinforcement(input, now);
    if (escalationReinforcement) candidates.push(escalationReinforcement);

    const orchestrationChallenge = buildAlternativeOrchestrationChallenge(input, now);
    if (orchestrationChallenge) candidates.push(orchestrationChallenge);

    const executiveRobustness = buildExecutiveGradeRobustness(input, now);
    if (executiveRobustness) candidates.push(executiveRobustness);

    const trustAggression = buildTrustVsAggressionDebate(input, now);
    if (trustAggression) candidates.push(trustAggression);

    const retained = candidates
      .filter(shouldRetainExecutiveStrategicDebate)
      .sort(
        (a, b) =>
          counterfactualStateRank(b.counterfactualState) -
            counterfactualStateRank(a.counterfactualState) ||
          debateStrengthRank(b.debateStrength) - debateStrengthRank(a.debateStrength) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_debates",
        snapshot: prior.snapshots[0] ?? null,
        newDebates: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.debates.map((d) => d.debateId));
    const newCount = retained.filter((d) => !priorIds.has(d.debateId)).length;

    const projections = retained.map((d) => buildAlternativeProjection(d, now));
    const signals = retained.map((d) => buildChallengeSignal(d, now));
    const fields = retained
      .map((d) => buildAssumptionStressField(d, now))
      .filter((f): f is AssumptionStressField => f !== null);

    store.upsertDebates(retained, now);
    store.upsertAlternativeProjections(projections, now);
    store.upsertChallengeSignals(signals, now);
    store.upsertAssumptionStressFields(fields, now);

    const snapshot = buildCounterfactualSnapshot(
      organizationId,
      retained,
      projections,
      signals,
      fields,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastCounterfactualState(snapshot.awarenessSummary.dominantCounterfactualState);

    const finalState = store.getState();
    const priorState = prior.lastCounterfactualState;

    if (accelerationAlt || orchestrationChallenge || memoryFragility) {
      devLog("major counterfactual divergence — alternative strategic pathways simulated");
    }

    if (memoryFragility) {
      devLog("assumption-fragility emergence — dominant recommendation assumptions challenged");
    }

    if (executiveRobustness || escalationReinforcement) {
      devLog("strategic robustness reinforcement — counterfactual stress-testing aligned with guidance");
    }

    if (executiveRobustness) {
      devLog("executive-grade debate convergence — distributed challenge cognition stabilized");
    }

    if (
      priorState &&
      priorState !== snapshot.awarenessSummary.dominantCounterfactualState &&
      (snapshot.awarenessSummary.dominantCounterfactualState === "strategically_resolved" ||
        snapshot.awarenessSummary.dominantCounterfactualState === "stress_tested")
    ) {
      devLog(
        `counterfactual state shift — ${priorState} → ${snapshot.awarenessSummary.dominantCounterfactualState}`
      );
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newDebates: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endStrategicDebateEvaluation();
  }
}
