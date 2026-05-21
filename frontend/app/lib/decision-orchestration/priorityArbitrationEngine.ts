import { stableSignature } from "../intelligence/shared/dedupe";
import { getPreparednessCognitionStore } from "../foresight-cognition/preparednessCognitionStore";
import { getInterventionTimingStore } from "../foresight-cognition/interventionTimingStore";
import { getUnifiedForesightRuntimeStore } from "../foresight-cognition/unifiedForesightRuntimeStore";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import { getActionDependencyStore } from "./actionDependencyStore";
import { getDecisionOrchestrationStore } from "./decisionOrchestrationStore";
import type { DependencyAwarenessSnapshot } from "./actionDependencyTypes";
import type { DecisionCoordinationSnapshot } from "./decisionOrchestrationTypes";
import {
  arbitrationStateRank,
  beginPriorityArbitrationEvaluation,
  confidenceToArbitrationLevel,
  endPriorityArbitrationEvaluation,
  shouldEvaluatePriorityArbitration,
  shouldRetainExecutivePriorityArbitration,
} from "./priorityArbitrationGuards";
import { getPriorityArbitrationStore } from "./priorityArbitrationStore";
import type {
  ArbitrationState,
  EnterpriseDecisionTradeoff,
  ExecutivePriorityArbitration,
  MultiObjectiveDecisionSnapshot,
  OperationalBalancingSignal,
  PriorityCategory,
  StrategicPriorityArbitrationInput,
  StrategicPriorityArbitrationResult,
  StrategicPriorityConflict,
  TradeoffAwarenessSummary,
  TradeoffType,
} from "./priorityArbitrationTypes";

const DEV_LOG_PREFIX = "[Nexora][PriorityArbitration]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildArbitrationId(label: string): string {
  return stableSignature(["priority-arbitration", label]).slice(0, 56);
}

function createArbitration(
  label: string,
  arbitrationState: ArbitrationState,
  tradeoffType: TradeoffType,
  summary: string,
  competingPriorities: PriorityCategory[],
  balancingSignals: string[],
  confidence: number,
  now: number
): ExecutivePriorityArbitration {
  const conf = Number(Math.min(0.94, Math.max(0.5, confidence)).toFixed(2));
  return {
    arbitrationId: buildArbitrationId(label),
    arbitrationState,
    tradeoffType,
    summary,
    competingPriorities: Object.freeze(competingPriorities),
    balancingSignals: Object.freeze(balancingSignals),
    confidence: conf,
    confidenceLevel: confidenceToArbitrationLevel(conf),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildResilienceSpeedTradeoff(
  anticipatorySnapshot: EnterpriseAnticipatorySnapshot | null,
  pressureStressed: boolean,
  fragilityElevated: boolean,
  now: number
): ExecutivePriorityArbitration | null {
  const escalationActive =
    anticipatorySnapshot?.summary.earlyWarningState === "emerging" ||
    anticipatorySnapshot?.summary.earlyWarningState === "intensifying" ||
    fragilityElevated;

  if (!escalationActive && !pressureStressed) return null;

  return createArbitration(
    "resilience_speed_tradeoff",
    "tension",
    "conflicting",
    "Operational speed objectives currently conflict with resilience stabilization requirements as escalation pressure continues to spread across dependent systems.",
    ["operational_speed", "resilience", "stabilization"],
    ["pressure_growth", "execution_constraint", "coordination_load"],
    0.88,
    now
  );
}

function buildGovernanceAdaptabilityTension(
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  resilienceLine: string,
  now: number
): ExecutivePriorityArbitration | null {
  const governanceHeavy = coordinationSnapshot?.recentStrategicOrchestrations.some((o) =>
    o.actionSequence.includes("governance_alignment")
  );
  const growthSignal = resilienceLine.includes("strengthen") || resilienceLine.includes("growth");

  if (!governanceHeavy) return null;

  return createArbitration(
    "governance_adaptability_tension",
    "constrained",
    "competing",
    "Governance reinforcement objectives compete with adaptability requirements as stabilization sequencing narrows execution flexibility.",
    ["governance", "adaptability", "strategic_alignment"],
    ["governance_delay", "execution_constraint"],
    growthSignal ? 0.84 : 0.8,
    now
  );
}

function buildPressureRecoveryReinforcing(
  anticipatorySnapshot: { summary: { recommendedFocus: string } } | null,
  now: number
): ExecutivePriorityArbitration | null {
  const pressureFocus =
    anticipatorySnapshot?.summary.recommendedFocus.includes("pressure") ||
    anticipatorySnapshot?.summary.recommendedFocus.includes("stabilization");

  if (!pressureFocus) return null;

  return createArbitration(
    "pressure_recovery_reinforcing",
    "aligned",
    "reinforcing",
    "Pressure reduction objectives reinforce long-term recovery by lowering propagation before resilience scaling actions accelerate.",
    ["stabilization", "recovery", "resilience"],
    ["pressure_reduction", "recovery_window"],
    0.82,
    now
  );
}

function buildRecoveryCoordinationConstraint(
  interventionSnapshot: { recentStrategicInterventionWindows: readonly { windowState: string }[] } | null,
  dependencySnapshot: DependencyAwarenessSnapshot | null,
  now: number
): ExecutivePriorityArbitration | null {
  const rapidRecovery = interventionSnapshot?.recentStrategicInterventionWindows.some(
    (w) => w.windowState === "active" || w.windowState === "narrowing"
  );
  const coordinationStress =
    dependencySnapshot?.bottleneckIndicators.some(
      (b) => b.bottleneckCategory === "coordination_instability"
    ) ?? false;

  if (!rapidRecovery || !coordinationStress) return null;

  return createArbitration(
    "recovery_coordination_constraint",
    "constrained",
    "constraining",
    "Rapid recovery prioritization increases coordination stress across dependent operational systems.",
    ["recovery", "coordination", "operational_speed"],
    ["coordination_load", "execution_constraint"],
    0.81,
    now
  );
}

function buildContinuityStabilizationTension(
  continuityPreserved: boolean,
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  now: number
): ExecutivePriorityArbitration | null {
  const stabilizationActive = coordinationSnapshot?.recentStrategicOrchestrations.some(
    (o) =>
      o.actionSequence.includes("governance_alignment") ||
      o.actionSequence.includes("coordination_stabilization")
  );

  if (continuityPreserved || !stabilizationActive) return null;

  return createArbitration(
    "continuity_stabilization_tension",
    "unstable",
    "conflicting",
    "Operational continuity preservation conflicts with intensive stabilization effort under disrupted institutional continuity.",
    ["stabilization", "coordination", "strategic_alignment"],
    ["continuity_disruption", "coordination_load"],
    0.79,
    now
  );
}

function buildGrowthResilienceBalancing(
  anticipatorySnapshot: { summary: { dominantOpportunity: string } } | null,
  fragilityElevated: boolean,
  now: number
): ExecutivePriorityArbitration | null {
  const growthOpportunity =
    anticipatorySnapshot?.summary.dominantOpportunity.includes("growth") ||
    anticipatorySnapshot?.summary.dominantOpportunity.includes("strengthening") ||
    anticipatorySnapshot?.summary.dominantOpportunity.includes("opportunity");

  if (!growthOpportunity || !fragilityElevated) return null;

  return createArbitration(
    "growth_resilience_balancing",
    "balanced",
    "balancing",
    "Growth acceleration signals require balancing against resilience stability as fragility remains elevated across foresight layers.",
    ["growth", "resilience", "adaptability"],
    ["fragility_persistence", "opportunity_emergence"],
    0.8,
    now
  );
}

function buildExecutiveGradeBalancing(
  dependencySnapshot: DependencyAwarenessSnapshot | null,
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  now: number
): ExecutivePriorityArbitration | null {
  const complexGraph =
    (dependencySnapshot?.graphCount ?? 0) >= 1 &&
    (coordinationSnapshot?.orchestrationCount ?? 0) >= 2;

  if (!complexGraph) return null;

  return createArbitration(
    "executive_multi_objective_balancing",
    "balanced",
    "balancing",
    "Multiple orchestration and dependency layers indicate executive-grade multi-objective balancing across resilience, governance, and recovery priorities.",
    ["resilience", "governance", "recovery", "coordination", "strategic_alignment"],
    ["dependency_topology", "orchestration_depth", "foresight_convergence"],
    0.9,
    now
  );
}

function buildPriorityConflict(
  priorityA: PriorityCategory,
  priorityB: PriorityCategory,
  summary: string,
  tensionLevel: StrategicPriorityConflict["tensionLevel"],
  now: number
): StrategicPriorityConflict {
  return {
    conflictId: stableSignature(["priority-conflict", priorityA, priorityB]).slice(0, 48),
    priorityA,
    priorityB,
    conflictSummary: summary,
    tensionLevel,
    generatedAt: now,
  };
}

function buildDecisionTradeoff(
  tradeoffType: TradeoffType,
  priorityA: PriorityCategory,
  priorityB: PriorityCategory,
  summary: string,
  intensity: EnterpriseDecisionTradeoff["tradeoffIntensity"],
  now: number
): EnterpriseDecisionTradeoff {
  return {
    tradeoffId: stableSignature(["decision-tradeoff", priorityA, priorityB, tradeoffType]).slice(0, 48),
    tradeoffType,
    priorityA,
    priorityB,
    tradeoffSummary: summary,
    tradeoffIntensity: intensity,
    generatedAt: now,
  };
}

function buildBalancingSignal(
  label: string,
  summary: string,
  priorities: PriorityCategory[],
  requirement: OperationalBalancingSignal["balancingRequirement"],
  confidence: number,
  now: number
): OperationalBalancingSignal {
  return {
    signalId: stableSignature(["balancing-signal", label]).slice(0, 48),
    signalLabel: label,
    signalSummary: summary,
    linkedPriorities: Object.freeze(priorities),
    balancingRequirement: requirement,
    confidence,
    generatedAt: now,
  };
}

function buildMultiObjectiveSnapshot(
  organizationId: string,
  arbitrations: ExecutivePriorityArbitration[],
  conflicts: StrategicPriorityConflict[],
  tradeoffs: EnterpriseDecisionTradeoff[],
  signals: OperationalBalancingSignal[],
  now: number
): MultiObjectiveDecisionSnapshot {
  const top = arbitrations[0];
  const awarenessSummary: TradeoffAwarenessSummary = top
    ? {
        dominantArbitrationState: top.arbitrationState,
        dominantTradeoffType: top.tradeoffType,
        arbitrationHeadline: top.summary,
        balancingPosture:
          top.confidence >= 0.88 && top.arbitrationState === "balanced"
            ? "executive_grade"
            : top.arbitrationState === "tension" || top.arbitrationState === "unstable"
              ? "high"
              : top.arbitrationState === "constrained"
                ? "moderate"
                : "low",
      }
    : {
        dominantArbitrationState: "aligned",
        dominantTradeoffType: "reinforcing",
        arbitrationHeadline: "Priority arbitration awaiting sufficient orchestration and dependency depth.",
        balancingPosture: "low",
      };

  const signature = stableSignature([
    "d9-5-3-multi-objective-snapshot",
    organizationId,
    arbitrations.map((a) => a.arbitrationId),
    awarenessSummary.balancingPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    arbitrationCount: arbitrations.length,
    awarenessSummary,
    recentExecutiveArbitrations: Object.freeze(arbitrations.slice(0, 6)),
    priorityConflicts: Object.freeze(conflicts.slice(0, 6)),
    decisionTradeoffs: Object.freeze(tradeoffs.slice(0, 6)),
    balancingSignals: Object.freeze(signals.slice(0, 6)),
  };
}

export function evaluateStrategicPriorityArbitration(
  input: StrategicPriorityArbitrationInput
): StrategicPriorityArbitrationResult {
  if (!beginPriorityArbitrationEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newExecutiveArbitrations: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getPriorityArbitrationStore(organizationId);
    const prior = store.getState();

    const orchestrationState = getDecisionOrchestrationStore(organizationId).getState();
    const dependencyState = getActionDependencyStore(organizationId).getState();
    const foresightState = getUnifiedForesightRuntimeStore(organizationId).getState();
    const preparednessState = getPreparednessCognitionStore(organizationId).getState();
    const interventionState = getInterventionTimingStore(organizationId).getState();

    const coordinationSnapshot =
      input.coordinationSnapshot ?? orchestrationState.snapshots[0] ?? null;
    const dependencySnapshot =
      input.dependencySnapshot ?? dependencyState.snapshots[0] ?? null;
    const anticipatorySnapshot =
      input.anticipatorySnapshot ?? foresightState.snapshots[0] ?? null;
    const preparednessSnapshot =
      input.preparednessSnapshot ?? preparednessState.snapshots[0] ?? null;
    const interventionSnapshot =
      input.interventionSnapshot ?? interventionState.snapshots[0] ?? null;

    const evaluationSignature = stableSignature([
      "d9-5-3-arbitration-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      coordinationSnapshot?.signature ?? orchestrationState.signature,
      dependencySnapshot?.signature ?? dependencyState.signature,
      anticipatorySnapshot?.signature ?? foresightState.signature,
      preparednessSnapshot?.signature ?? preparednessState.signature,
      interventionSnapshot?.signature ?? interventionState.signature,
    ]);

    if (
      !shouldEvaluatePriorityArbitration(
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
        newExecutiveArbitrations: 0,
        storeSignature: prior.signature,
      };
    }

    const arbitrationDepth =
      (coordinationSnapshot?.orchestrationCount ?? 0) +
      (dependencySnapshot?.graphCount ?? 0) +
      dependencyState.coordinationGraphs.length;

    if (arbitrationDepth < 2) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_arbitration_depth",
        snapshot: prior.snapshots[0] ?? null,
        newExecutiveArbitrations: 0,
        storeSignature: prior.signature,
      };
    }

    const narrativeLine =
      input.enterpriseNarrativeLine ??
      input.cognitionSnapshot?.organizationalLearningLine ??
      input.cognitionSnapshot?.timelineStrategicEvolutionLine ??
      "";
    const resilienceLine = input.resilienceForecastLine ?? input.cognitionSnapshot?.resilienceForecastLine ?? "";
    const pressureStressed = input.pressureTopologyStressed ?? false;
    const fragilityElevated = input.fragilityElevated ?? false;
    const continuityPreserved = input.continuityPreserved ?? true;

    const candidates: ExecutivePriorityArbitration[] = [];

    const resilienceSpeed = buildResilienceSpeedTradeoff(
      anticipatorySnapshot,
      pressureStressed,
      fragilityElevated,
      now
    );
    if (resilienceSpeed) candidates.push(resilienceSpeed);

    const governanceAdaptability = buildGovernanceAdaptabilityTension(
      coordinationSnapshot,
      resilienceLine,
      now
    );
    if (governanceAdaptability) candidates.push(governanceAdaptability);

    const pressureRecovery = buildPressureRecoveryReinforcing(anticipatorySnapshot, now);
    if (pressureRecovery) candidates.push(pressureRecovery);

    const recoveryConstraint = buildRecoveryCoordinationConstraint(
      interventionSnapshot,
      dependencySnapshot,
      now
    );
    if (recoveryConstraint) candidates.push(recoveryConstraint);

    const continuityTension = buildContinuityStabilizationTension(
      continuityPreserved,
      coordinationSnapshot,
      now
    );
    if (continuityTension) candidates.push(continuityTension);

    const growthBalance = buildGrowthResilienceBalancing(
      anticipatorySnapshot,
      fragilityElevated,
      now
    );
    if (growthBalance) candidates.push(growthBalance);

    const executiveGrade = buildExecutiveGradeBalancing(
      dependencySnapshot,
      coordinationSnapshot,
      now
    );
    if (executiveGrade) candidates.push(executiveGrade);

    if (narrativeLine.includes("coordination strain")) {
      candidates.push(
        createArbitration(
          "coordination_execution_balancing",
          "tension",
          "balancing",
          "Coordination objectives require balancing against execution-speed priorities under sustained operational strain.",
          ["coordination", "operational_speed", "stabilization"],
          ["coordination_load"],
          0.77,
          now
        )
      );
    }

    const retained = candidates
      .filter(shouldRetainExecutivePriorityArbitration)
      .sort(
        (a, b) =>
          arbitrationStateRank(b.arbitrationState) - arbitrationStateRank(a.arbitrationState) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_arbitrations",
        snapshot: prior.snapshots[0] ?? null,
        newExecutiveArbitrations: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.executiveArbitrations.map((a) => a.arbitrationId));
    const newCount = retained.filter((a) => !priorIds.has(a.arbitrationId)).length;

    const conflicts: StrategicPriorityConflict[] = [];
    const tradeoffs: EnterpriseDecisionTradeoff[] = [];

    if (resilienceSpeed) {
      conflicts.push(
        buildPriorityConflict(
          "resilience",
          "operational_speed",
          resilienceSpeed.summary,
          "elevated",
          now
        )
      );
      tradeoffs.push(
        buildDecisionTradeoff(
          "conflicting",
          "resilience",
          "operational_speed",
          resilienceSpeed.summary,
          "high",
          now
        )
      );
    }

    if (governanceAdaptability) {
      tradeoffs.push(
        buildDecisionTradeoff(
          "competing",
          "governance",
          "adaptability",
          governanceAdaptability.summary,
          "moderate",
          now
        )
      );
    }

    if (pressureRecovery) {
      tradeoffs.push(
        buildDecisionTradeoff(
          "reinforcing",
          "stabilization",
          "recovery",
          pressureRecovery.summary,
          "moderate",
          now
        )
      );
    }

    const balancingSignals: OperationalBalancingSignal[] = retained.map((a) =>
      buildBalancingSignal(
        a.arbitrationId,
        a.summary.slice(0, 120),
        [...a.competingPriorities],
        a.arbitrationState === "balanced" ? "align" : a.arbitrationState === "tension" ? "rebalance" : "constrain",
        a.confidence,
        now
      )
    );

    store.upsertExecutiveArbitrations(retained, now);
    store.upsertPriorityConflicts(conflicts, now);
    store.upsertDecisionTradeoffs(tradeoffs, now);
    store.upsertBalancingSignals(balancingSignals, now);

    const snapshot = buildMultiObjectiveSnapshot(
      organizationId,
      retained,
      conflicts,
      tradeoffs,
      balancingSignals,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (retained.some((a) => a.tradeoffType === "conflicting" && a.confidence >= 0.85)) {
      devLog("major tradeoff emergence — resilience and speed tension");
    }
    if (retained.some((a) => a.arbitrationState === "tension" || a.arbitrationState === "unstable")) {
      devLog("strategic balancing tension — multi-objective arbitration active");
    }
    if (executiveGrade) {
      devLog("executive-grade arbitration formation — enterprise balancing posture");
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newExecutiveArbitrations: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endPriorityArbitrationEvaluation();
  }
}
