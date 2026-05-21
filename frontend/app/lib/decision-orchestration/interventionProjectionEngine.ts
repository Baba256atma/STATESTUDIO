import { stableSignature } from "../intelligence/shared/dedupe";
import { getPreparednessCognitionStore } from "../foresight-cognition/preparednessCognitionStore";
import type { EnterprisePreparednessSnapshot } from "../foresight-cognition/preparednessCognitionTypes";
import { getUnifiedForesightRuntimeStore } from "../foresight-cognition/unifiedForesightRuntimeStore";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import { getActionDependencyStore } from "./actionDependencyStore";
import { getAdaptiveSequencingStore } from "./adaptiveSequencingStore";
import { getDecisionConfidenceStore } from "./decisionConfidenceStore";
import type { ConfidenceArbitrationSnapshot } from "./decisionConfidenceTypes";
import { getDecisionOrchestrationStore } from "./decisionOrchestrationStore";
import type { ActionCategory, DecisionCoordinationSnapshot } from "./decisionOrchestrationTypes";
import { getInstitutionalAlignmentStore } from "./institutionalAlignmentStore";
import type { GovernanceCoherenceSnapshot } from "./institutionalAlignmentTypes";
import { getPriorityArbitrationStore } from "./priorityArbitrationStore";
import type { MultiObjectiveDecisionSnapshot } from "./priorityArbitrationTypes";
import { getScenarioCoordinationStore } from "./scenarioCoordinationStore";
import type { ScenarioCoordinationSnapshot } from "./scenarioCoordinationTypes";
import {
  beginInterventionProjectionEvaluation,
  clampProjectionConfidence,
  endInterventionProjectionEvaluation,
  projectionStateRank,
  projectionStrengthRank,
  shouldEvaluateInterventionProjection,
  shouldRetainStrategicInterventionProjection,
} from "./interventionProjectionGuards";
import { getInterventionProjectionStore } from "./interventionProjectionStore";
import type {
  EnterpriseOutcomeSimulation,
  InterventionEffectRelationship,
  InterventionEffectTopology,
  OperationalConsequenceSignal,
  OutcomeProjectionAwarenessSummary,
  OutcomeProjectionSnapshot,
  ProjectionCategory,
  ProjectionState,
  ProjectionStrength,
  ResponseEvolutionProjection,
  StrategicInterventionProjection,
  StrategicInterventionProjectionInput,
  StrategicInterventionProjectionResult,
} from "./interventionProjectionTypes";

const DEV_LOG_PREFIX = "[Nexora][InterventionProjection]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildProjectionId(label: string): string {
  return stableSignature(["intervention-projection", label]).slice(0, 56);
}

function createProjection(
  label: string,
  projectionState: ProjectionState,
  projectionStrength: ProjectionStrength,
  category: ProjectionCategory,
  summary: string,
  projectedOutcomes: string[],
  secondaryEffects: string[],
  confidence: number,
  now: number
): StrategicInterventionProjection {
  return {
    projectionId: buildProjectionId(label),
    projectionState,
    projectionStrength,
    projectionCategory: category,
    summary,
    projectedOutcomes: Object.freeze(projectedOutcomes),
    secondaryEffects: Object.freeze(secondaryEffects),
    confidence: clampProjectionConfidence(confidence),
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

function buildGovernanceStabilizationProjection(
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  alignmentSnapshot: GovernanceCoherenceSnapshot | null,
  now: number
): StrategicInterventionProjection | null {
  const governance = orchestrationIncludes(coordinationSnapshot, "governance_alignment");
  const pressure = orchestrationIncludes(coordinationSnapshot, "pressure_reduction");
  const coherent =
    alignmentSnapshot?.alignmentSummary.coherencePosture === "high" ||
    alignmentSnapshot?.alignmentSummary.coherencePosture === "institutional_grade";

  if (!governance || !pressure) return null;

  return createProjection(
    "enterprise_stabilization_projection",
    "probable",
    "strong",
    "governance_stabilization",
    "Governance stabilization and pressure reduction are likely to reinforce resilience consistency and reduce escalation propagation across dependent systems over time.",
    [
      "reduced_escalation_spread",
      "improved_preparedness",
      "stabilized_recovery",
      "coordination_alignment",
    ],
    ["reduced_execution_speed"],
    coherent ? 0.9 : 0.88,
    now
  );
}

function buildRecoveryCoordinationTradeoffProjection(
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  dependencySnapshot: { bottleneckIndicators: readonly { bottleneckCategory: string }[] } | null,
  now: number
): StrategicInterventionProjection | null {
  const recovery = orchestrationIncludes(coordinationSnapshot, "recovery_acceleration");
  const coordinationStress =
    dependencySnapshot?.bottleneckIndicators.some(
      (b) => b.bottleneckCategory === "coordination_instability"
    ) ?? false;

  if (!recovery || !coordinationStress) return null;

  return createProjection(
    "recovery_coordination_tradeoff",
    "emerging",
    "strong",
    "operational_tradeoff",
    "Recovery acceleration is projected to improve continuity while increasing coordination load across dependent operational pathways.",
    ["improved_continuity", "recovery_acceleration"],
    ["coordination_load_increase", "execution_constraint"],
    0.84,
    now
  );
}

function buildPressurePreparednessProjection(
  anticipatorySnapshot: EnterpriseAnticipatorySnapshot | null,
  preparednessSnapshot: EnterprisePreparednessSnapshot | null,
  now: number
): StrategicInterventionProjection | null {
  const pressureFocus =
    anticipatorySnapshot?.summary.recommendedFocus.includes("pressure") ||
    anticipatorySnapshot?.summary.recommendedFocus.includes("stabilization");
  const preparednessReady =
    preparednessSnapshot?.awarenessSummary.enterprisePreparednessPosture === "strong" ||
    preparednessSnapshot?.awarenessSummary.enterprisePreparednessPosture === "resilient" ||
    (preparednessSnapshot?.recentStrategicReadinessSignals.length ?? 0) >= 1;

  if (!pressureFocus || !preparednessReady) return null;

  return createProjection(
    "pressure_preparedness_resilience",
    "probable",
    "moderate",
    "pressure_reduction",
    "Pressure reduction is projected to strengthen resilience reinforcement and improve intervention timing flexibility before fatigue accumulates.",
    ["resilience_growth", "improved_preparedness", "reduced_escalation_spread"],
    [],
    0.83,
    now
  );
}

function buildEscalationContainmentSpeedTradeoff(
  arbitrationSnapshot: MultiObjectiveDecisionSnapshot | null,
  anticipatorySnapshot: EnterpriseAnticipatorySnapshot | null,
  now: number
): StrategicInterventionProjection | null {
  const escalationActive =
    anticipatorySnapshot?.summary.earlyWarningState === "emerging" ||
    anticipatorySnapshot?.summary.earlyWarningState === "intensifying";
  const speedTension = arbitrationSnapshot?.recentExecutiveArbitrations.some(
    (a) => a.competingPriorities.includes("operational_speed")
  );

  if (!escalationActive || !speedTension) return null;

  return createProjection(
    "escalation_containment_speed_balance",
    "stabilizing",
    "moderate",
    "escalation_reduction",
    "Escalation containment is projected to reduce propagation while introducing strategic balancing consequences for operational execution speed.",
    ["reduced_escalation_spread", "governance_stabilization"],
    ["reduced_execution_speed", "execution_constraint"],
    0.8,
    now
  );
}

function buildCoordinationRecoveryTrajectory(
  scenarioSnapshot: ScenarioCoordinationSnapshot | null,
  resilienceLine: string,
  now: number
): StrategicInterventionProjection | null {
  const reinforcing = scenarioSnapshot?.recentResponseTopologies.some((t) =>
    t.interactionRelationships.some(
      (r) => r.relationship === "reinforcing" || r.relationship === "stabilizing"
    )
  );
  const resilienceGrowth = resilienceLine.includes("strengthen");

  if (!reinforcing || !resilienceGrowth) return null;

  return createProjection(
    "coordination_recovery_resilience_trajectory",
    "stabilizing",
    "strong",
    "coordination_shift",
    "Coordination reinforcement is projected to stabilize recovery pathways and sustain adaptive resilience trajectory across interconnected response topologies.",
    ["coordination_alignment", "stabilized_recovery", "resilience_growth"],
    [],
    0.85,
    now
  );
}

function buildSystemicContinuityProjection(
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  alignmentSnapshot: GovernanceCoherenceSnapshot | null,
  confidenceSnapshot: ConfidenceArbitrationSnapshot | null,
  continuityPreserved: boolean,
  now: number
): StrategicInterventionProjection | null {
  const depth = (coordinationSnapshot?.orchestrationCount ?? 0) >= 2;
  const aligned =
    alignmentSnapshot?.recentPolicyAlignments.some(
      (a) => a.coherenceState === "coherent" || a.coherenceState === "institutionally_aligned"
    ) ?? false;
  const reliableConfidence =
    confidenceSnapshot?.coordinationSummary.certaintyPosture === "high" ||
    confidenceSnapshot?.coordinationSummary.certaintyPosture === "executive_grade";

  if (!depth || !continuityPreserved || (!aligned && !reliableConfidence)) return null;

  return createProjection(
    "systemic_continuity_stabilization",
    "probable",
    "systemic",
    "strategic_realignment",
    "Multiple intervention pathways are projected to improve enterprise continuity through systemic stabilization across governance, resilience, and coordination layers.",
    [
      "operational_continuity_improvement",
      "governance_stabilization",
      "resilience_growth",
      "coordination_alignment",
    ],
    [],
    0.91,
    now
  );
}

function buildConsequenceSignal(
  label: string,
  summary: string,
  categories: ProjectionCategory[],
  intensity: OperationalConsequenceSignal["consequenceIntensity"],
  confidence: number,
  now: number
): OperationalConsequenceSignal {
  return {
    signalId: stableSignature(["consequence-signal", label]).slice(0, 48),
    signalLabel: label,
    signalSummary: summary,
    linkedCategories: Object.freeze(categories),
    consequenceIntensity: intensity,
    confidence: clampProjectionConfidence(confidence),
    generatedAt: now,
  };
}

function buildEvolutionProjection(
  label: string,
  summary: string,
  trajectory: string,
  categories: ProjectionCategory[],
  phase: ResponseEvolutionProjection["evolutionPhase"],
  now: number
): ResponseEvolutionProjection {
  return {
    evolutionId: stableSignature(["evolution-projection", label]).slice(0, 48),
    evolutionSummary: summary,
    trajectoryLabel: trajectory,
    linkedCategories: Object.freeze(categories),
    evolutionPhase: phase,
    generatedAt: now,
  };
}

function buildEffectTopology(
  label: string,
  summary: string,
  relationships: InterventionEffectRelationship[],
  strength: ProjectionStrength,
  now: number
): InterventionEffectTopology {
  return {
    topologyId: stableSignature(["effect-topology", label]).slice(0, 48),
    topologySummary: summary,
    effectRelationships: Object.freeze(relationships),
    topologyStrength: strength,
    generatedAt: now,
  };
}

function buildOutcomeSimulation(
  projection: StrategicInterventionProjection,
  now: number
): EnterpriseOutcomeSimulation {
  return {
    simulationId: stableSignature(["outcome-simulation", projection.projectionId]).slice(0, 48),
    projectionState: projection.projectionState,
    projectionStrength: projection.projectionStrength,
    simulationSummary: projection.summary,
    linkedProjections: Object.freeze([projection.projectionId]),
    outcomeConsistency:
      projection.projectionState === "probable" && projection.projectionStrength !== "weak"
        ? "high"
        : projection.projectionState === "uncertain"
          ? "low"
          : "moderate",
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildOutcomeProjectionSnapshot(
  organizationId: string,
  projections: StrategicInterventionProjection[],
  simulations: EnterpriseOutcomeSimulation[],
  signals: OperationalConsequenceSignal[],
  evolutions: ResponseEvolutionProjection[],
  topologies: InterventionEffectTopology[],
  now: number
): OutcomeProjectionSnapshot {
  const top = projections[0];
  const awarenessSummary: OutcomeProjectionAwarenessSummary = top
    ? {
        dominantProjectionState: top.projectionState,
        dominantProjectionStrength: top.projectionStrength,
        projectionHeadline: top.summary,
        projectionPosture:
          top.projectionStrength === "systemic" && top.projectionState === "probable"
            ? "executive_grade"
            : top.projectionState === "uncertain"
              ? "low"
              : top.projectionState === "probable" || top.projectionState === "stabilizing"
                ? "high"
                : "moderate",
      }
    : {
        dominantProjectionState: "hypothetical",
        dominantProjectionStrength: "weak",
        projectionHeadline:
          "Intervention projection awaiting sufficient alignment and orchestration depth.",
        projectionPosture: "low",
      };

  const signature = stableSignature([
    "d9-5-8-outcome-projection-snapshot",
    organizationId,
    projections.map((p) => p.projectionId),
    awarenessSummary.projectionPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    projectionCount: projections.length,
    awarenessSummary,
    recentInterventionProjections: Object.freeze(projections.slice(0, 6)),
    outcomeSimulations: Object.freeze(simulations.slice(0, 6)),
    consequenceSignals: Object.freeze(signals.slice(0, 6)),
    evolutionProjections: Object.freeze(evolutions.slice(0, 6)),
    effectTopologies: Object.freeze(topologies.slice(0, 4)),
  };
}

export function evaluateStrategicInterventionProjection(
  input: StrategicInterventionProjectionInput
): StrategicInterventionProjectionResult {
  if (!beginInterventionProjectionEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newInterventionProjections: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getInterventionProjectionStore(organizationId);
    const prior = store.getState();

    const orchestrationState = getDecisionOrchestrationStore(organizationId).getState();
    const dependencyState = getActionDependencyStore(organizationId).getState();
    const arbitrationState = getPriorityArbitrationStore(organizationId).getState();
    const scenarioState = getScenarioCoordinationStore(organizationId).getState();
    const sequencingState = getAdaptiveSequencingStore(organizationId).getState();
    const confidenceState = getDecisionConfidenceStore(organizationId).getState();
    const alignmentState = getInstitutionalAlignmentStore(organizationId).getState();
    const foresightState = getUnifiedForesightRuntimeStore(organizationId).getState();
    const preparednessState = getPreparednessCognitionStore(organizationId).getState();

    const coordinationSnapshot =
      input.coordinationSnapshot ?? orchestrationState.snapshots[0] ?? null;
    const dependencySnapshot =
      input.dependencySnapshot ?? dependencyState.snapshots[0] ?? null;
    const arbitrationSnapshot =
      input.arbitrationSnapshot ?? arbitrationState.snapshots[0] ?? null;
    const scenarioSnapshot =
      input.scenarioSnapshot ?? scenarioState.snapshots[0] ?? null;
    const sequencingSnapshot =
      input.sequencingSnapshot ?? sequencingState.snapshots[0] ?? null;
    const confidenceSnapshot =
      input.confidenceSnapshot ?? confidenceState.snapshots[0] ?? null;
    const alignmentSnapshot =
      input.alignmentSnapshot ?? alignmentState.snapshots[0] ?? null;
    const anticipatorySnapshot =
      input.anticipatorySnapshot ?? foresightState.snapshots[0] ?? null;
    const preparednessSnapshot =
      input.preparednessSnapshot ?? preparednessState.snapshots[0] ?? null;

    const evaluationSignature = stableSignature([
      "d9-5-8-intervention-projection-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      coordinationSnapshot?.signature ?? orchestrationState.signature,
      dependencySnapshot?.signature ?? dependencyState.signature,
      arbitrationSnapshot?.signature ?? arbitrationState.signature,
      scenarioSnapshot?.signature ?? scenarioState.signature,
      sequencingSnapshot?.signature ?? sequencingState.signature,
      confidenceSnapshot?.signature ?? confidenceState.signature,
      alignmentSnapshot?.signature ?? alignmentState.signature,
      anticipatorySnapshot?.signature ?? foresightState.signature,
      preparednessSnapshot?.signature ?? preparednessState.signature,
      input.replaySnapshot?.signature ?? "no-replay",
    ]);

    if (
      !shouldEvaluateInterventionProjection(
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
        newInterventionProjections: 0,
        storeSignature: prior.signature,
      };
    }

    const projectionDepth =
      (coordinationSnapshot?.orchestrationCount ?? 0) +
      (dependencySnapshot?.graphCount ?? 0) +
      (arbitrationSnapshot?.arbitrationCount ?? 0) +
      (scenarioSnapshot?.topologyCount ?? 0) +
      (sequencingSnapshot?.sequenceCount ?? 0) +
      (confidenceSnapshot?.confidenceCount ?? 0) +
      (alignmentSnapshot?.alignmentCount ?? 0);

    if (projectionDepth < 7) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_projection_depth",
        snapshot: prior.snapshots[0] ?? null,
        newInterventionProjections: 0,
        storeSignature: prior.signature,
      };
    }

    const resilienceLine =
      input.resilienceForecastLine ?? input.cognitionSnapshot?.resilienceForecastLine ?? "";
    const continuityPreserved = input.continuityPreserved ?? true;

    const candidates: StrategicInterventionProjection[] = [];

    const stabilizationProjection = buildGovernanceStabilizationProjection(
      coordinationSnapshot,
      alignmentSnapshot,
      now
    );
    if (stabilizationProjection) candidates.push(stabilizationProjection);

    const recoveryTradeoff = buildRecoveryCoordinationTradeoffProjection(
      coordinationSnapshot,
      dependencySnapshot,
      now
    );
    if (recoveryTradeoff) candidates.push(recoveryTradeoff);

    const pressurePreparedness = buildPressurePreparednessProjection(
      anticipatorySnapshot,
      preparednessSnapshot,
      now
    );
    if (pressurePreparedness) candidates.push(pressurePreparedness);

    const escalationTradeoff = buildEscalationContainmentSpeedTradeoff(
      arbitrationSnapshot,
      anticipatorySnapshot,
      now
    );
    if (escalationTradeoff) candidates.push(escalationTradeoff);

    const coordinationTrajectory = buildCoordinationRecoveryTrajectory(
      scenarioSnapshot,
      resilienceLine,
      now
    );
    if (coordinationTrajectory) candidates.push(coordinationTrajectory);

    const systemicContinuity = buildSystemicContinuityProjection(
      coordinationSnapshot,
      alignmentSnapshot,
      confidenceSnapshot,
      continuityPreserved,
      now
    );
    if (systemicContinuity) candidates.push(systemicContinuity);

    if (
      sequencingSnapshot?.recentAdaptiveSequences.some(
        (s) => s.sequencingState === "adaptive" || s.sequencingState === "evolving"
      )
    ) {
      candidates.push(
        createProjection(
          "adaptive_sequencing_outcome_shift",
          "emerging",
          "moderate",
          "strategic_realignment",
          "Adaptive sequencing shifts are projected to reshape orchestration outcomes as enterprise conditions evolve.",
          ["orchestration_pathway_shift", "coordination_alignment"],
          ["timing_sensitivity_increase"],
          0.77,
          now
        )
      );
    }

    const retained = candidates
      .filter(shouldRetainStrategicInterventionProjection)
      .sort(
        (a, b) =>
          projectionStateRank(b.projectionState) - projectionStateRank(a.projectionState) ||
          projectionStrengthRank(b.projectionStrength) -
            projectionStrengthRank(a.projectionStrength) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_projections",
        snapshot: prior.snapshots[0] ?? null,
        newInterventionProjections: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.interventionProjections.map((p) => p.projectionId));
    const newCount = retained.filter((p) => !priorIds.has(p.projectionId)).length;

    const consequenceSignals = retained.map((p) =>
      buildConsequenceSignal(
        p.projectionId,
        p.summary.slice(0, 100),
        [p.projectionCategory],
        p.secondaryEffects.length > 0 ? "moderate" : "low",
        p.confidence,
        now
      )
    );

    const evolutionProjections = retained.map((p) =>
      buildEvolutionProjection(
        p.projectionId,
        p.summary.slice(0, 100),
        p.projectionState === "probable" ? "stabilizing_trajectory" : "emerging_trajectory",
        [p.projectionCategory],
        p.projectionState === "probable" || p.projectionState === "stabilizing"
          ? "stabilizing"
          : "propagating",
        now
      )
    );

    const effectTopologies =
      retained.length >= 2
        ? [
            buildEffectTopology(
              "intervention_effect_network",
              "Interconnected intervention effects form a deterministic consequence topology across orchestration pathways.",
              retained.slice(0, 3).map((p, i, arr) => ({
                relationshipId: stableSignature([
                  "effect-rel",
                  p.projectionCategory,
                  arr[i + 1]?.projectionCategory ?? "unknown",
                ]).slice(0, 48),
                source: p.projectionCategory,
                target: arr[i + 1]?.projectionCategory ?? ("unknown" as ProjectionCategory),
                effectSummary: p.summary.slice(0, 80),
                effectStrength: p.projectionStrength,
                generatedAt: now,
              })),
              retained[0]!.projectionStrength,
              now
            ),
          ]
        : [];

    const simulations = retained.map((p) => buildOutcomeSimulation(p, now));

    store.upsertInterventionProjections(retained, now);
    store.upsertOutcomeSimulations(simulations, now);
    store.upsertConsequenceSignals(consequenceSignals, now);
    store.upsertEvolutionProjections(evolutionProjections, now);
    store.upsertEffectTopologies(effectTopologies, now);

    const snapshot = buildOutcomeProjectionSnapshot(
      organizationId,
      retained,
      simulations,
      consequenceSignals,
      evolutionProjections,
      effectTopologies,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (stabilizationProjection || systemicContinuity) {
      devLog("major outcome projection formation — enterprise stabilization consequence pathway");
    }
    if (recoveryTradeoff || escalationTradeoff) {
      devLog("operational tradeoff projection — secondary orchestration effects detected");
    }
    if (stabilizationProjection) {
      devLog("stabilization consequence emergence — governance-pressure outcome reinforcement");
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newInterventionProjections: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endInterventionProjectionEvaluation();
  }
}
