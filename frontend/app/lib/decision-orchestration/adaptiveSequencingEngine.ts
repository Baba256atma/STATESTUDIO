import { stableSignature } from "../intelligence/shared/dedupe";
import { getPreparednessCognitionStore } from "../foresight-cognition/preparednessCognitionStore";
import { getInterventionTimingStore } from "../foresight-cognition/interventionTimingStore";
import { getUnifiedForesightRuntimeStore } from "../foresight-cognition/unifiedForesightRuntimeStore";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { EnterprisePreparednessSnapshot } from "../foresight-cognition/preparednessCognitionTypes";
import { getOperationalReplayStore } from "../temporal-cognition/operationalReplayStore";
import { getActionDependencyStore } from "./actionDependencyStore";
import { getDecisionOrchestrationStore } from "./decisionOrchestrationStore";
import type { DependencyAwarenessSnapshot } from "./actionDependencyTypes";
import type { ActionCategory, DecisionCoordinationSnapshot } from "./decisionOrchestrationTypes";
import { getPriorityArbitrationStore } from "./priorityArbitrationStore";
import type { MultiObjectiveDecisionSnapshot } from "./priorityArbitrationTypes";
import { getScenarioCoordinationStore } from "./scenarioCoordinationStore";
import type { ScenarioCoordinationSnapshot } from "./scenarioCoordinationTypes";
import {
  adaptationStrengthRank,
  beginAdaptiveSequencingEvaluation,
  confidenceToSequencingLevel,
  endAdaptiveSequencingEvaluation,
  sequencingStateRank,
  shouldEvaluateAdaptiveSequencing,
  shouldRetainAdaptiveDecisionSequence,
} from "./adaptiveSequencingGuards";
import { getAdaptiveSequencingStore } from "./adaptiveSequencingStore";
import type {
  AdaptationCategory,
  AdaptationStrength,
  AdaptiveDecisionSequence,
  AdaptiveDecisionSequencingInput,
  AdaptiveDecisionSequencingResult,
  AdaptiveSequencingSnapshot,
  DynamicResponseEvolution,
  EnterpriseResponseTransition,
  OperationalPriorityShift,
  SequencingAdaptationSignal,
  SequencingAwarenessSummary,
  SequencingState,
  SequencingTransition,
} from "./adaptiveSequencingTypes";

const DEV_LOG_PREFIX = "[Nexora][AdaptiveSequencing]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildSequenceId(label: string): string {
  return stableSignature(["adaptive-sequence", label]).slice(0, 56);
}

function createSequence(
  label: string,
  sequencingState: SequencingState,
  adaptationStrength: AdaptationStrength,
  adaptationCategory: AdaptationCategory,
  summary: string,
  transitions: SequencingTransition[],
  adaptationSignals: string[],
  confidence: number,
  now: number
): AdaptiveDecisionSequence {
  const conf = Number(Math.min(0.94, Math.max(0.5, confidence)).toFixed(2));
  return {
    adaptiveSequenceId: buildSequenceId(label),
    sequencingState,
    adaptationStrength,
    adaptationCategory,
    summary,
    sequencingTransitions: Object.freeze(transitions),
    adaptationSignals: Object.freeze(adaptationSignals),
    confidence: conf,
    confidenceLevel: confidenceToSequencingLevel(conf),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function orchestrationIncludes(
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  category: ActionCategory
): boolean {
  return (
    coordinationSnapshot?.recentStrategicOrchestrations.some((o) =>
      o.actionSequence.includes(category)
    ) ?? false
  );
}

function buildEscalationReprioritizationSequence(
  anticipatorySnapshot: EnterpriseAnticipatorySnapshot | null,
  pressureStressed: boolean,
  fragilityElevated: boolean,
  now: number
): AdaptiveDecisionSequence | null {
  const escalationRising =
    anticipatorySnapshot?.summary.earlyWarningState === "emerging" ||
    anticipatorySnapshot?.summary.earlyWarningState === "intensifying" ||
    fragilityElevated;

  if (!escalationRising && !pressureStressed) return null;

  return createSequence(
    "escalation_containment_reprioritized",
    "adaptive",
    "strong",
    "escalation_shift",
    "Operational sequencing has adapted toward earlier escalation containment due to increasing pressure propagation across dependent systems.",
    [
      { previous: "pressure_reduction", current: "escalation_prevention" },
      { previous: "recovery_acceleration", current: "governance_alignment" },
    ],
    ["pressure_growth", "coordination_instability", "timing_sensitivity_increase"],
    0.89,
    now
  );
}

function buildResilienceReprioritizationSequence(
  anticipatorySnapshot: EnterpriseAnticipatorySnapshot | null,
  resilienceLine: string,
  now: number
): AdaptiveDecisionSequence | null {
  const recoveryImproving =
    anticipatorySnapshot?.summary.dominantOpportunity.includes("recovery") ||
    anticipatorySnapshot?.summary.dominantOpportunity.includes("strengthening") ||
    resilienceLine.includes("strengthen");

  if (!recoveryImproving) return null;

  return createSequence(
    "resilience_reinforcement_resequenced",
    "evolving",
    "moderate",
    "resilience_reprioritization",
    "Recovery stabilization improvement has resequenced resilience reinforcement to follow containment and governance alignment.",
    [
      { previous: "resilience_reinforcement", current: "recovery_acceleration" },
      { previous: "recovery_acceleration", current: "resilience_reinforcement" },
    ],
    ["recovery_window", "stabilization_opportunity"],
    0.82,
    now
  );
}

function buildGovernanceTransitionSequence(
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  arbitrationSnapshot: MultiObjectiveDecisionSnapshot | null,
  now: number
): AdaptiveDecisionSequence | null {
  const governanceTension = arbitrationSnapshot?.recentExecutiveArbitrations.some(
    (a) => a.competingPriorities.includes("governance")
  );
  const governancePresent = orchestrationIncludes(coordinationSnapshot, "governance_alignment");

  if (!governanceTension || governancePresent) return null;

  return createSequence(
    "governance_coordination_elevated",
    "adaptive",
    "strong",
    "governance_transition",
    "Governance alignment weakening has elevated governance coordination earlier in the operational sequencing pathway.",
    [{ previous: "pressure_reduction", current: "governance_alignment" }],
    ["governance_delay", "execution_constraint"],
    0.84,
    now
  );
}

function buildPressureRecoveryForwardSequence(
  anticipatorySnapshot: EnterpriseAnticipatorySnapshot | null,
  preparednessSnapshot: EnterprisePreparednessSnapshot | null,
  now: number
): AdaptiveDecisionSequence | null {
  const pressureFocus =
    anticipatorySnapshot?.summary.recommendedFocus.includes("pressure") ||
    anticipatorySnapshot?.summary.recommendedFocus.includes("stabilization");
  const preparednessReady =
    preparednessSnapshot?.awarenessSummary.enterprisePreparednessPosture === "strong" ||
    preparednessSnapshot?.awarenessSummary.enterprisePreparednessPosture === "resilient" ||
    (preparednessSnapshot?.recentStrategicReadinessSignals.length ?? 0) >= 1;

  if (!pressureFocus || !preparednessReady) return null;

  return createSequence(
    "recovery_acceleration_forward",
    "evolving",
    "moderate",
    "pressure_response_shift",
    "Pressure reduction succeeding has moved recovery acceleration forward in enterprise response sequencing.",
    [{ previous: "pressure_reduction", current: "recovery_acceleration" }],
    ["pressure_reduction", "preparedness_readiness"],
    0.83,
    now
  );
}

function buildCoordinationResequencingSequence(
  dependencySnapshot: DependencyAwarenessSnapshot | null,
  scenarioSnapshot: ScenarioCoordinationSnapshot | null,
  narrativeLine: string,
  now: number
): AdaptiveDecisionSequence | null {
  const coordinationStress =
    dependencySnapshot?.bottleneckIndicators.some(
      (b) => b.bottleneckCategory === "coordination_instability"
    ) ?? false;
  const topologyConstrained = scenarioSnapshot?.recentResponseTopologies.some(
    (t) => t.topologyState === "constrained"
  );
  const strainSignal = narrativeLine.includes("coordination strain");

  if (!coordinationStress && !topologyConstrained && !strainSignal) return null;

  return createSequence(
    "orchestration_resequencing_triggered",
    "unstable",
    "strong",
    "coordination_realignment",
    "Coordination instability spreading has triggered orchestration resequencing across stabilization and governance pathways.",
    [
      { previous: "recovery_acceleration", current: "coordination_stabilization" },
      { previous: "governance_alignment", current: "coordination_stabilization" },
    ],
    ["coordination_instability", "coordination_load"],
    0.86,
    now
  );
}

function buildDynamicResponseEvolutionSequence(
  arbitrationSnapshot: MultiObjectiveDecisionSnapshot | null,
  scenarioSnapshot: ScenarioCoordinationSnapshot | null,
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  now: number
): AdaptiveDecisionSequence | null {
  const multiShift =
    (arbitrationSnapshot?.arbitrationCount ?? 0) >= 2 &&
    (scenarioSnapshot?.topologyCount ?? 0) >= 1 &&
    (coordinationSnapshot?.orchestrationCount ?? 0) >= 2;

  if (!multiShift) return null;

  return createSequence(
    "enterprise_dynamic_stabilization",
    "adaptive",
    "systemic",
    "stabilization_reordering",
    "Multiple enterprise priorities shifting simultaneously indicate dynamic response evolution across stabilization, governance, and recovery sequencing.",
    [
      { previous: "pressure_reduction", current: "escalation_prevention" },
      { previous: "recovery_acceleration", current: "governance_alignment" },
      { previous: "governance_alignment", current: "coordination_stabilization" },
    ],
    ["pressure_growth", "orchestration_depth", "foresight_convergence"],
    0.91,
    now
  );
}

function buildResponseTransition(
  category: AdaptationCategory,
  summary: string,
  transitions: SequencingTransition[],
  sensitivity: EnterpriseResponseTransition["transitionSensitivity"],
  now: number
): EnterpriseResponseTransition {
  return {
    transitionId: stableSignature(["response-transition", category]).slice(0, 48),
    adaptationCategory: category,
    transitionSummary: summary,
    sequencingTransitions: Object.freeze(transitions),
    transitionSensitivity: sensitivity,
    generatedAt: now,
  };
}

function buildPriorityShift(
  category: AdaptationCategory,
  previous: ActionCategory,
  current: ActionCategory,
  summary: string,
  intensity: OperationalPriorityShift["shiftIntensity"],
  now: number
): OperationalPriorityShift {
  return {
    shiftId: stableSignature(["priority-shift", previous, current, category]).slice(0, 48),
    adaptationCategory: category,
    previousPriority: previous,
    currentPriority: current,
    shiftSummary: summary,
    shiftIntensity: intensity,
    generatedAt: now,
  };
}

function buildAdaptationSignal(
  label: string,
  summary: string,
  categories: ActionCategory[],
  strength: AdaptationStrength,
  confidence: number,
  now: number
): SequencingAdaptationSignal {
  return {
    signalId: stableSignature(["adaptation-signal", label]).slice(0, 48),
    signalLabel: label,
    signalSummary: summary,
    linkedCategories: Object.freeze(categories),
    adaptationStrength: strength,
    confidence,
    generatedAt: now,
  };
}

function buildDynamicEvolution(
  sequence: AdaptiveDecisionSequence,
  now: number
): DynamicResponseEvolution {
  return {
    evolutionId: stableSignature(["dynamic-evolution", sequence.adaptiveSequenceId]).slice(0, 48),
    sequencingState: sequence.sequencingState,
    adaptationStrength: sequence.adaptationStrength,
    evolutionSummary: sequence.summary,
    linkedSequences: Object.freeze([sequence.adaptiveSequenceId]),
    evolutionConsistency:
      sequence.sequencingState === "adaptive" || sequence.adaptationStrength === "systemic"
        ? "high"
        : sequence.sequencingState === "evolving"
          ? "moderate"
          : "low",
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildAdaptiveSequencingSnapshot(
  organizationId: string,
  sequences: AdaptiveDecisionSequence[],
  evolutions: DynamicResponseEvolution[],
  transitions: EnterpriseResponseTransition[],
  shifts: OperationalPriorityShift[],
  signals: SequencingAdaptationSignal[],
  now: number
): AdaptiveSequencingSnapshot {
  const top = sequences[0];
  const awarenessSummary: SequencingAwarenessSummary = top
    ? {
        dominantSequencingState: top.sequencingState,
        dominantAdaptationStrength: top.adaptationStrength,
        sequencingHeadline: top.summary,
        adaptationPosture:
          top.adaptationStrength === "systemic" && top.sequencingState === "adaptive"
            ? "executive_grade"
            : top.sequencingState === "unstable" || top.sequencingState === "adaptive"
              ? "high"
              : top.sequencingState === "evolving"
                ? "moderate"
                : "low",
      }
    : {
        dominantSequencingState: "static",
        dominantAdaptationStrength: "weak",
        sequencingHeadline:
          "Adaptive sequencing awaiting sufficient scenario coordination and arbitration depth.",
        adaptationPosture: "low",
      };

  const signature = stableSignature([
    "d9-5-5-adaptive-sequencing-snapshot",
    organizationId,
    sequences.map((s) => s.adaptiveSequenceId),
    awarenessSummary.adaptationPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    sequenceCount: sequences.length,
    awarenessSummary,
    recentAdaptiveSequences: Object.freeze(sequences.slice(0, 6)),
    responseEvolutions: Object.freeze(evolutions.slice(0, 6)),
    responseTransitions: Object.freeze(transitions.slice(0, 6)),
    priorityShifts: Object.freeze(shifts.slice(0, 6)),
    adaptationSignals: Object.freeze(signals.slice(0, 6)),
  };
}

export function evaluateAdaptiveDecisionSequencing(
  input: AdaptiveDecisionSequencingInput
): AdaptiveDecisionSequencingResult {
  if (!beginAdaptiveSequencingEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newAdaptiveSequences: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getAdaptiveSequencingStore(organizationId);
    const prior = store.getState();

    const orchestrationState = getDecisionOrchestrationStore(organizationId).getState();
    const dependencyState = getActionDependencyStore(organizationId).getState();
    const arbitrationState = getPriorityArbitrationStore(organizationId).getState();
    const scenarioState = getScenarioCoordinationStore(organizationId).getState();
    const foresightState = getUnifiedForesightRuntimeStore(organizationId).getState();
    const preparednessState = getPreparednessCognitionStore(organizationId).getState();
    const interventionState = getInterventionTimingStore(organizationId).getState();
    const replayState = getOperationalReplayStore(organizationId).getState();

    const coordinationSnapshot =
      input.coordinationSnapshot ?? orchestrationState.snapshots[0] ?? null;
    const dependencySnapshot =
      input.dependencySnapshot ?? dependencyState.snapshots[0] ?? null;
    const arbitrationSnapshot =
      input.arbitrationSnapshot ?? arbitrationState.snapshots[0] ?? null;
    const scenarioSnapshot =
      input.scenarioSnapshot ?? scenarioState.snapshots[0] ?? null;
    const anticipatorySnapshot =
      input.anticipatorySnapshot ?? foresightState.snapshots[0] ?? null;
    const preparednessSnapshot =
      input.preparednessSnapshot ?? preparednessState.snapshots[0] ?? null;
    const interventionSnapshot =
      input.interventionSnapshot ?? interventionState.snapshots[0] ?? null;
    const replaySnapshot = input.replaySnapshot ?? replayState.snapshots[0] ?? null;

    const evaluationSignature = stableSignature([
      "d9-5-5-adaptive-sequencing-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      coordinationSnapshot?.signature ?? orchestrationState.signature,
      dependencySnapshot?.signature ?? dependencyState.signature,
      arbitrationSnapshot?.signature ?? arbitrationState.signature,
      scenarioSnapshot?.signature ?? scenarioState.signature,
      anticipatorySnapshot?.signature ?? foresightState.signature,
      preparednessSnapshot?.signature ?? preparednessState.signature,
      interventionSnapshot?.signature ?? interventionState.signature,
      replaySnapshot?.signature ?? replayState.signature,
    ]);

    if (
      !shouldEvaluateAdaptiveSequencing(
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
        newAdaptiveSequences: 0,
        storeSignature: prior.signature,
      };
    }

    const adaptationDepth =
      (coordinationSnapshot?.orchestrationCount ?? 0) +
      (dependencySnapshot?.graphCount ?? 0) +
      (arbitrationSnapshot?.arbitrationCount ?? 0) +
      (scenarioSnapshot?.topologyCount ?? 0);

    if (adaptationDepth < 4) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_adaptation_depth",
        snapshot: prior.snapshots[0] ?? null,
        newAdaptiveSequences: 0,
        storeSignature: prior.signature,
      };
    }

    const narrativeLine =
      input.enterpriseNarrativeLine ??
      input.cognitionSnapshot?.organizationalLearningLine ??
      input.cognitionSnapshot?.timelineStrategicEvolutionLine ??
      "";
    const resilienceLine =
      input.resilienceForecastLine ?? input.cognitionSnapshot?.resilienceForecastLine ?? "";
    const pressureStressed = input.pressureTopologyStressed ?? false;
    const fragilityElevated = input.fragilityElevated ?? false;

    const candidates: AdaptiveDecisionSequence[] = [];

    const escalationReprioritized = buildEscalationReprioritizationSequence(
      anticipatorySnapshot,
      pressureStressed,
      fragilityElevated,
      now
    );
    if (escalationReprioritized) candidates.push(escalationReprioritized);

    const resilienceReprioritized = buildResilienceReprioritizationSequence(
      anticipatorySnapshot,
      resilienceLine,
      now
    );
    if (resilienceReprioritized) candidates.push(resilienceReprioritized);

    const governanceTransition = buildGovernanceTransitionSequence(
      coordinationSnapshot,
      arbitrationSnapshot,
      now
    );
    if (governanceTransition) candidates.push(governanceTransition);

    const recoveryForward = buildPressureRecoveryForwardSequence(
      anticipatorySnapshot,
      preparednessSnapshot,
      now
    );
    if (recoveryForward) candidates.push(recoveryForward);

    const coordinationResequencing = buildCoordinationResequencingSequence(
      dependencySnapshot,
      scenarioSnapshot,
      narrativeLine,
      now
    );
    if (coordinationResequencing) candidates.push(coordinationResequencing);

    const dynamicEvolution = buildDynamicResponseEvolutionSequence(
      arbitrationSnapshot,
      scenarioSnapshot,
      coordinationSnapshot,
      now
    );
    if (dynamicEvolution) candidates.push(dynamicEvolution);

    if (interventionSnapshot?.recentStrategicInterventionWindows.some(
      (w) => w.windowState === "narrowing"
    )) {
      candidates.push(
        createSequence(
          "intervention_timing_resequence",
          "evolving",
          "moderate",
          "recovery_resequencing",
          "Narrowing intervention windows require recovery sequencing adaptation before operational fatigue accumulates.",
          [{ previous: "governance_alignment", current: "recovery_acceleration" }],
          ["timing_sensitivity_increase"],
          0.78,
          now
        )
      );
    }

    if (
      (replaySnapshot?.replayCount ?? 0) >= 1 &&
      replaySnapshot?.recentReplays.some(
        (r) => r.replayCategory === "coordination" || r.replayCategory === "operational"
      )
    ) {
      candidates.push(
        createSequence(
          "replay_informed_resequencing",
          "evolving",
          "moderate",
          "coordination_realignment",
          "Operational replay cognition indicates prior sequencing patterns require adaptive realignment under current conditions.",
          [{ previous: "coordination_stabilization", current: "governance_alignment" }],
          ["replay_pattern_alignment"],
          0.76,
          now
        )
      );
    }

    const retained = candidates
      .filter(shouldRetainAdaptiveDecisionSequence)
      .sort(
        (a, b) =>
          sequencingStateRank(b.sequencingState) - sequencingStateRank(a.sequencingState) ||
          adaptationStrengthRank(b.adaptationStrength) -
            adaptationStrengthRank(a.adaptationStrength) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_sequences",
        snapshot: prior.snapshots[0] ?? null,
        newAdaptiveSequences: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.adaptiveSequences.map((s) => s.adaptiveSequenceId));
    const newCount = retained.filter((s) => !priorIds.has(s.adaptiveSequenceId)).length;

    const transitions: EnterpriseResponseTransition[] = retained.map((s) =>
      buildResponseTransition(
        s.adaptationCategory,
        s.summary.slice(0, 120),
        [...s.sequencingTransitions],
        s.sequencingState === "unstable" ? "elevated" : "moderate",
        now
      )
    );

    const shifts: OperationalPriorityShift[] = retained.flatMap((s) =>
      s.sequencingTransitions.map((t) =>
        buildPriorityShift(
          s.adaptationCategory,
          t.previous,
          t.current,
          s.summary.slice(0, 100),
          s.adaptationStrength === "strong" || s.adaptationStrength === "systemic"
            ? "high"
            : "moderate",
          now
        )
      )
    ).slice(0, 10);

    const adaptationSignals = retained.map((s) =>
      buildAdaptationSignal(
        s.adaptiveSequenceId,
        s.summary.slice(0, 100),
        s.sequencingTransitions.flatMap((t) => [t.previous, t.current]).slice(0, 4),
        s.adaptationStrength,
        s.confidence,
        now
      )
    );

    const evolutions = retained.map((s) => buildDynamicEvolution(s, now));

    store.upsertAdaptiveSequences(retained, now);
    store.upsertResponseEvolutions(evolutions, now);
    store.upsertResponseTransitions(transitions, now);
    store.upsertPriorityShifts(shifts, now);
    store.upsertAdaptationSignals(adaptationSignals, now);

    const snapshot = buildAdaptiveSequencingSnapshot(
      organizationId,
      retained,
      evolutions,
      transitions,
      shifts,
      adaptationSignals,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (retained.some((s) => s.sequencingState === "adaptive" && s.confidence >= 0.85)) {
      devLog("major sequencing adaptation — enterprise response ordering evolved");
    }
    if (retained.some((s) => s.sequencingTransitions.length >= 2)) {
      devLog("orchestration transition shifts — multi-path sequencing realignment");
    }
    if (dynamicEvolution) {
      devLog("response evolution restructuring — dynamic stabilization sequencing active");
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newAdaptiveSequences: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endAdaptiveSequencingEvaluation();
  }
}
