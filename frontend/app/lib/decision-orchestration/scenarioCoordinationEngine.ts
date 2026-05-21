import { stableSignature } from "../intelligence/shared/dedupe";
import { getUnifiedForesightRuntimeStore } from "../foresight-cognition/unifiedForesightRuntimeStore";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import { getActionDependencyStore } from "./actionDependencyStore";
import { getDecisionOrchestrationStore } from "./decisionOrchestrationStore";
import type { DependencyAwarenessSnapshot } from "./actionDependencyTypes";
import type { ActionCategory, DecisionCoordinationSnapshot } from "./decisionOrchestrationTypes";
import { getPriorityArbitrationStore } from "./priorityArbitrationStore";
import type { MultiObjectiveDecisionSnapshot } from "./priorityArbitrationTypes";
import {
  beginScenarioCoordinationEvaluation,
  confidenceToCoordinationLevel,
  coordinationStrengthRank,
  endScenarioCoordinationEvaluation,
  shouldEvaluateScenarioCoordination,
  shouldRetainEnterpriseResponseTopology,
  topologyStateRank,
} from "./scenarioCoordinationGuards";
import { getScenarioCoordinationStore } from "./scenarioCoordinationStore";
import type {
  CoordinationStrength,
  EnterpriseResponseTopology,
  ExecutiveScenarioCoordinationInput,
  ExecutiveScenarioCoordinationResult,
  OperationalInteractionField,
  ResponseReinforcementSignal,
  ResponseScenarioId,
  ScenarioCoordinationRelationship,
  ScenarioCoordinationSnapshot,
  StrategicResponseScenario,
  ScenarioRelationshipCategory,
  TopologyAwarenessSummary,
  TopologyState,
} from "./scenarioCoordinationTypes";

const DEV_LOG_PREFIX = "[Nexora][ScenarioCoordination]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildTopologyId(label: string): string {
  return stableSignature(["scenario-topology", label]).slice(0, 56);
}

function buildRelationship(
  source: ResponseScenarioId,
  target: ResponseScenarioId,
  relationship: ScenarioRelationshipCategory,
  strength: CoordinationStrength,
  summary: string,
  confidence: number,
  now: number
): ScenarioCoordinationRelationship {
  return {
    relationshipId: stableSignature(["scenario-rel", source, target, relationship]).slice(0, 48),
    source,
    target,
    relationship,
    coordinationStrength: strength,
    relationshipSummary: summary,
    confidence,
    generatedAt: now,
  };
}

function createTopology(
  label: string,
  topologyState: TopologyState,
  coordinationStrength: CoordinationStrength,
  summary: string,
  relationships: ScenarioCoordinationRelationship[],
  coordinationRisks: string[],
  confidence: number,
  now: number
): EnterpriseResponseTopology {
  const conf = Number(Math.min(0.94, Math.max(0.5, confidence)).toFixed(2));
  return {
    topologyId: buildTopologyId(label),
    topologyState,
    coordinationStrength,
    summary,
    interactionRelationships: Object.freeze(relationships),
    coordinationRisks: Object.freeze(coordinationRisks),
    confidence: conf,
    confidenceLevel: confidenceToCoordinationLevel(conf),
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

function buildGovernancePressureStabilizingTopology(
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  now: number
): EnterpriseResponseTopology | null {
  const governance = orchestrationIncludes(coordinationSnapshot, "governance_alignment");
  const pressure = orchestrationIncludes(coordinationSnapshot, "pressure_reduction");

  if (!governance || !pressure) return null;

  const relationships = [
    buildRelationship(
      "governance_alignment",
      "pressure_reduction",
      "stabilizing",
      "strong",
      "Governance stabilization reinforces pressure reduction by aligning containment before propagation spreads.",
      0.88,
      now
    ),
    buildRelationship(
      "pressure_reduction",
      "coordination_stabilization",
      "reinforcing",
      "moderate",
      "Pressure reduction unlocks coordination stabilization pathways across dependent operational systems.",
      0.84,
      now
    ),
  ];

  return createTopology(
    "governance_pressure_stabilizing",
    "interconnected",
    "strong",
    "Governance stabilization, pressure reduction, and recovery coordination form a strongly interconnected response topology that reinforces enterprise resilience stabilization.",
    relationships,
    [],
    0.9,
    now
  );
}

function buildRecoveryCoordinationConstraintTopology(
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  dependencySnapshot: DependencyAwarenessSnapshot | null,
  now: number
): EnterpriseResponseTopology | null {
  const recovery = orchestrationIncludes(coordinationSnapshot, "recovery_acceleration");
  const coordinationStress =
    dependencySnapshot?.bottleneckIndicators.some(
      (b) => b.bottleneckCategory === "coordination_instability"
    ) ?? false;

  if (!recovery || !coordinationStress) return null;

  const relationships = [
    buildRelationship(
      "recovery_acceleration",
      "coordination_stabilization",
      "constraining",
      "strong",
      "Recovery acceleration overloads coordination systems as dependent pathways synchronize under elevated load.",
      0.86,
      now
    ),
  ];

  return createTopology(
    "recovery_coordination_constraint",
    "constrained",
    "strong",
    "Rapid recovery acceleration constrains coordination capacity while operational instability remains elevated across response pathways.",
    relationships,
    ["coordination_overload"],
    0.87,
    now
  );
}

function buildPressurePreparednessReinforcingTopology(
  anticipatorySnapshot: EnterpriseAnticipatorySnapshot | null,
  arbitrationSnapshot: MultiObjectiveDecisionSnapshot | null,
  now: number
): EnterpriseResponseTopology | null {
  const pressureFocus =
    anticipatorySnapshot?.summary.recommendedFocus.includes("pressure") ||
    anticipatorySnapshot?.summary.recommendedFocus.includes("stabilization");
  const reinforcingArbitration = arbitrationSnapshot?.recentExecutiveArbitrations.some(
    (a) => a.tradeoffType === "reinforcing"
  );

  if (!pressureFocus && !reinforcingArbitration) return null;

  const relationships = [
    buildRelationship(
      "pressure_reduction",
      "resilience_reinforcement",
      "reinforcing",
      "moderate",
      "Pressure reduction improves preparedness by lowering propagation before resilience reinforcement scales.",
      0.83,
      now
    ),
    buildRelationship(
      "resilience_reinforcement",
      "recovery_acceleration",
      "adaptive",
      "moderate",
      "Preparedness reinforcement creates an adaptive pathway toward recovery acceleration when intervention windows remain open.",
      0.8,
      now
    ),
  ];

  return createTopology(
    "pressure_preparedness_reinforcing",
    "coordinated",
    "moderate",
    "Pressure reduction and preparedness reinforcement form an adaptive reinforcing pathway that improves intervention timing effectiveness.",
    relationships,
    [],
    0.85,
    now
  );
}

function buildEscalationGovernanceDependentTopology(
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  anticipatorySnapshot: EnterpriseAnticipatorySnapshot | null,
  now: number
): EnterpriseResponseTopology | null {
  const escalation =
    anticipatorySnapshot?.summary.earlyWarningState === "emerging" ||
    anticipatorySnapshot?.summary.earlyWarningState === "intensifying";
  const governance = orchestrationIncludes(coordinationSnapshot, "governance_alignment");
  const containment = orchestrationIncludes(coordinationSnapshot, "escalation_prevention");

  if (!escalation || !governance) return null;

  const relationships = [
    buildRelationship(
      "escalation_prevention",
      "governance_alignment",
      "dependent",
      "strong",
      "Escalation containment depends on governance alignment before stabilization can propagate across operational systems.",
      0.89,
      now
    ),
  ];

  if (containment) {
    relationships.push(
      buildRelationship(
        "governance_alignment",
        "escalation_prevention",
        "stabilizing",
        "moderate",
        "Governance alignment stabilizes escalation containment sequencing across enterprise response pathways.",
        0.82,
        now
      )
    );
  }

  return createTopology(
    "escalation_governance_dependent",
    "linked",
    "strong",
    "Escalation containment and governance alignment form a dependent topology structure requiring coordinated sequencing before stabilization propagates.",
    relationships,
    ["governance_delay"],
    0.88,
    now
  );
}

function buildSystemicResilienceReinforcementTopology(
  dependencySnapshot: DependencyAwarenessSnapshot | null,
  arbitrationSnapshot: MultiObjectiveDecisionSnapshot | null,
  now: number
): EnterpriseResponseTopology | null {
  const graphDepth = dependencySnapshot?.graphCount ?? 0;
  const arbitrationDepth = arbitrationSnapshot?.arbitrationCount ?? 0;

  if (graphDepth < 1 || arbitrationDepth < 2) return null;

  const relationships = [
    buildRelationship(
      "resilience_reinforcement",
      "governance_alignment",
      "reinforcing",
      "systemic",
      "Multiple response paths amplify resilience through governance-aligned reinforcement across dependency topology.",
      0.91,
      now
    ),
    buildRelationship(
      "governance_alignment",
      "coordination_stabilization",
      "reinforcing",
      "strong",
      "Governance and coordination stabilization mutually reinforce systemic resilience posture.",
      0.88,
      now
    ),
    buildRelationship(
      "coordination_stabilization",
      "resilience_reinforcement",
      "amplifying",
      "systemic",
      "Coordination stabilization amplifies resilience reinforcement across interconnected operational pathways.",
      0.9,
      now
    ),
  ];

  return createTopology(
    "systemic_resilience_reinforcement",
    "interconnected",
    "systemic",
    "Multiple response paths form systemic reinforcement topology amplifying enterprise resilience across governance and coordination layers.",
    relationships,
    [],
    0.92,
    now
  );
}

function buildStabilizationOverloadConflictTopology(
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  dependencySnapshot: DependencyAwarenessSnapshot | null,
  narrativeLine: string,
  now: number
): EnterpriseResponseTopology | null {
  const stabilizationCount =
    coordinationSnapshot?.recentStrategicOrchestrations.filter(
      (o) =>
        o.actionSequence.includes("governance_alignment") ||
        o.actionSequence.includes("coordination_stabilization")
    ).length ?? 0;
  const overload =
    stabilizationCount >= 2 &&
    (dependencySnapshot?.bottleneckIndicators.length ?? 0) >= 1;
  const strainSignal = narrativeLine.includes("coordination strain");

  if (!overload && !strainSignal) return null;

  const relationships = [
    buildRelationship(
      "governance_alignment",
      "coordination_stabilization",
      "conflicting",
      "moderate",
      "Competing stabilization actions create orchestration conflict as coordination capacity saturates.",
      0.81,
      now
    ),
  ];

  return createTopology(
    "stabilization_overload_conflict",
    "constrained",
    "moderate",
    "Competing stabilization pathways generate orchestration conflict signals as coordination systems approach overload.",
    relationships,
    ["coordination_overload", "orchestration_conflict"],
    0.8,
    now
  );
}

function buildStrategicScenario(
  category: ResponseScenarioId,
  label: string,
  summary: string,
  role: StrategicResponseScenario["coordinationRole"],
  confidence: number,
  now: number
): StrategicResponseScenario {
  return {
    scenarioId: stableSignature(["strategic-scenario", category]).slice(0, 48),
    scenarioCategory: category,
    scenarioLabel: label,
    scenarioSummary: summary,
    coordinationRole: role,
    confidence,
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildInteractionField(
  label: string,
  summary: string,
  scenarios: ResponseScenarioId[],
  intensity: OperationalInteractionField["interactionIntensity"],
  now: number
): OperationalInteractionField {
  return {
    fieldId: stableSignature(["interaction-field", label]).slice(0, 48),
    fieldLabel: label,
    fieldSummary: summary,
    linkedScenarios: Object.freeze(scenarios),
    interactionIntensity: intensity,
    generatedAt: now,
  };
}

function buildReinforcementSignal(
  label: string,
  summary: string,
  scenarios: ResponseScenarioId[],
  strength: CoordinationStrength,
  confidence: number,
  now: number
): ResponseReinforcementSignal {
  return {
    signalId: stableSignature(["reinforcement-signal", label]).slice(0, 48),
    signalLabel: label,
    signalSummary: summary,
    linkedScenarios: Object.freeze(scenarios),
    reinforcementStrength: strength,
    confidence,
    generatedAt: now,
  };
}

function buildScenarioCoordinationSnapshot(
  organizationId: string,
  topologies: EnterpriseResponseTopology[],
  scenarios: StrategicResponseScenario[],
  fields: OperationalInteractionField[],
  signals: ResponseReinforcementSignal[],
  now: number
): ScenarioCoordinationSnapshot {
  const top = topologies[0];
  const awarenessSummary: TopologyAwarenessSummary = top
    ? {
        dominantTopologyState: top.topologyState,
        dominantCoordinationStrength: top.coordinationStrength,
        topologyHeadline: top.summary,
        coordinationPosture:
          top.coordinationStrength === "systemic" && top.topologyState === "interconnected"
            ? "executive_grade"
            : top.topologyState === "constrained" || top.coordinationRisks.length > 0
              ? "high"
              : top.topologyState === "coordinated" || top.topologyState === "linked"
                ? "moderate"
                : "low",
      }
    : {
        dominantTopologyState: "isolated",
        dominantCoordinationStrength: "weak",
        topologyHeadline:
          "Scenario coordination awaiting sufficient arbitration and dependency topology depth.",
        coordinationPosture: "low",
      };

  const signature = stableSignature([
    "d9-5-4-scenario-coordination-snapshot",
    organizationId,
    topologies.map((t) => t.topologyId),
    awarenessSummary.coordinationPosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    topologyCount: topologies.length,
    awarenessSummary,
    recentResponseTopologies: Object.freeze(topologies.slice(0, 6)),
    strategicResponseScenarios: Object.freeze(scenarios.slice(0, 8)),
    interactionFields: Object.freeze(fields.slice(0, 6)),
    reinforcementSignals: Object.freeze(signals.slice(0, 6)),
  };
}

export function evaluateExecutiveScenarioCoordination(
  input: ExecutiveScenarioCoordinationInput
): ExecutiveScenarioCoordinationResult {
  if (!beginScenarioCoordinationEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newResponseTopologies: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getScenarioCoordinationStore(organizationId);
    const prior = store.getState();

    const orchestrationState = getDecisionOrchestrationStore(organizationId).getState();
    const dependencyState = getActionDependencyStore(organizationId).getState();
    const arbitrationState = getPriorityArbitrationStore(organizationId).getState();
    const foresightState = getUnifiedForesightRuntimeStore(organizationId).getState();

    const coordinationSnapshot =
      input.coordinationSnapshot ?? orchestrationState.snapshots[0] ?? null;
    const dependencySnapshot =
      input.dependencySnapshot ?? dependencyState.snapshots[0] ?? null;
    const arbitrationSnapshot =
      input.arbitrationSnapshot ?? arbitrationState.snapshots[0] ?? null;
    const anticipatorySnapshot =
      input.anticipatorySnapshot ?? foresightState.snapshots[0] ?? null;

    const evaluationSignature = stableSignature([
      "d9-5-4-scenario-coordination-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      coordinationSnapshot?.signature ?? orchestrationState.signature,
      dependencySnapshot?.signature ?? dependencyState.signature,
      arbitrationSnapshot?.signature ?? arbitrationState.signature,
      anticipatorySnapshot?.signature ?? foresightState.signature,
    ]);

    if (
      !shouldEvaluateScenarioCoordination(
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
        newResponseTopologies: 0,
        storeSignature: prior.signature,
      };
    }

    const topologyDepth =
      (coordinationSnapshot?.orchestrationCount ?? 0) +
      (dependencySnapshot?.graphCount ?? 0) +
      (arbitrationSnapshot?.arbitrationCount ?? 0);

    if (topologyDepth < 3) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_topology_depth",
        snapshot: prior.snapshots[0] ?? null,
        newResponseTopologies: 0,
        storeSignature: prior.signature,
      };
    }

    const narrativeLine =
      input.enterpriseNarrativeLine ??
      input.cognitionSnapshot?.organizationalLearningLine ??
      input.cognitionSnapshot?.timelineStrategicEvolutionLine ??
      "";

    const candidates: EnterpriseResponseTopology[] = [];

    const governancePressure = buildGovernancePressureStabilizingTopology(
      coordinationSnapshot,
      now
    );
    if (governancePressure) candidates.push(governancePressure);

    const recoveryConstraint = buildRecoveryCoordinationConstraintTopology(
      coordinationSnapshot,
      dependencySnapshot,
      now
    );
    if (recoveryConstraint) candidates.push(recoveryConstraint);

    const pressurePreparedness = buildPressurePreparednessReinforcingTopology(
      anticipatorySnapshot,
      arbitrationSnapshot,
      now
    );
    if (pressurePreparedness) candidates.push(pressurePreparedness);

    const escalationGovernance = buildEscalationGovernanceDependentTopology(
      coordinationSnapshot,
      anticipatorySnapshot,
      now
    );
    if (escalationGovernance) candidates.push(escalationGovernance);

    const systemicResilience = buildSystemicResilienceReinforcementTopology(
      dependencySnapshot,
      arbitrationSnapshot,
      now
    );
    if (systemicResilience) candidates.push(systemicResilience);

    const stabilizationConflict = buildStabilizationOverloadConflictTopology(
      coordinationSnapshot,
      dependencySnapshot,
      narrativeLine,
      now
    );
    if (stabilizationConflict) candidates.push(stabilizationConflict);

    const retained = candidates
      .filter(shouldRetainEnterpriseResponseTopology)
      .sort(
        (a, b) =>
          topologyStateRank(b.topologyState) - topologyStateRank(a.topologyState) ||
          coordinationStrengthRank(b.coordinationStrength) -
            coordinationStrengthRank(a.coordinationStrength) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_topologies",
        snapshot: prior.snapshots[0] ?? null,
        newResponseTopologies: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.responseTopologies.map((t) => t.topologyId));
    const newCount = retained.filter((t) => !priorIds.has(t.topologyId)).length;

    const scenarios: StrategicResponseScenario[] = [];
    for (const topology of retained) {
      for (const rel of topology.interactionRelationships) {
        if (!scenarios.some((s) => s.scenarioCategory === rel.source)) {
          scenarios.push(
            buildStrategicScenario(
              rel.source,
              String(rel.source).replace(/_/g, " "),
              rel.relationshipSummary.slice(0, 100),
              topology.topologyState === "interconnected" ? "primary" : "supporting",
              rel.confidence,
              now
            )
          );
        }
        if (!scenarios.some((s) => s.scenarioCategory === rel.target)) {
          scenarios.push(
            buildStrategicScenario(
              rel.target,
              String(rel.target).replace(/_/g, " "),
              rel.relationshipSummary.slice(0, 100),
              "supporting",
              rel.confidence,
              now
            )
          );
        }
      }
    }

    const interactionFields = retained.map((t) =>
      buildInteractionField(
        t.topologyId,
        t.summary.slice(0, 120),
        t.interactionRelationships.flatMap((r) => [r.source, r.target]).slice(0, 4),
        t.topologyState === "interconnected" ? "high" : t.topologyState === "constrained" ? "moderate" : "low",
        now
      )
    );

    const reinforcementSignals = retained
      .filter((t) => t.interactionRelationships.some((r) => r.relationship === "reinforcing"))
      .map((t) =>
        buildReinforcementSignal(
          t.topologyId,
          t.summary.slice(0, 100),
          t.interactionRelationships.map((r) => r.source).slice(0, 3),
          t.coordinationStrength,
          t.confidence,
          now
        )
      );

    store.upsertResponseTopologies(retained, now);
    store.upsertStrategicScenarios(scenarios, now);
    store.upsertInteractionFields(interactionFields, now);
    store.upsertReinforcementSignals(reinforcementSignals, now);

    const snapshot = buildScenarioCoordinationSnapshot(
      organizationId,
      retained,
      scenarios,
      interactionFields,
      reinforcementSignals,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (retained.some((t) => t.topologyState === "interconnected")) {
      devLog("major topology formation — enterprise response coordination network");
    }
    if (systemicResilience) {
      devLog("systemic reinforcement emergence — multi-path resilience amplification");
    }
    if (stabilizationConflict || recoveryConstraint) {
      devLog("orchestration conflict detection — constrained response topology active");
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newResponseTopologies: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endScenarioCoordinationEvaluation();
  }
}
