import { stableSignature } from "../intelligence/shared/dedupe";
import { getPreparednessCognitionStore } from "../foresight-cognition/preparednessCognitionStore";
import { getInterventionTimingStore } from "../foresight-cognition/interventionTimingStore";
import { getUnifiedForesightRuntimeStore } from "../foresight-cognition/unifiedForesightRuntimeStore";
import { getOperationalReplayStore } from "../temporal-cognition/operationalReplayStore";
import { getDecisionOrchestrationStore } from "./decisionOrchestrationStore";
import type {
  ActionCategory,
  DecisionCoordinationSnapshot,
  OrganizationalResponseDependency,
} from "./decisionOrchestrationTypes";
import {
  beginActionDependencyEvaluation,
  confidenceToDependencyLevel,
  endActionDependencyEvaluation,
  shouldEvaluateActionDependency,
  shouldRetainOperationalCoordinationGraph,
  strengthRank,
} from "./actionDependencyGuards";
import { getActionDependencyStore } from "./actionDependencyStore";
import type {
  CoordinationBottleneckIndicator,
  CoordinationState,
  DependencyAwarenessSnapshot,
  DependencyAwarenessSummary,
  DependencyCategory,
  DependencyStrength,
  EnterpriseDependencyNode,
  OperationalCoordinationGraph,
  ResponseRelationshipSignal,
  StrategicActionDependency,
  StrategicActionDependencyInput,
  StrategicActionDependencyResult,
} from "./actionDependencyTypes";

const DEV_LOG_PREFIX = "[Nexora][ActionDependency]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildGraphId(label: string): string {
  return stableSignature(["coordination-graph", label]).slice(0, 56);
}

function buildDependencyEdge(
  source: ActionCategory,
  target: ActionCategory,
  relationship: DependencyCategory,
  dependencyStrength: DependencyStrength,
  summary: string,
  confidence: number,
  now: number
): StrategicActionDependency {
  return {
    dependencyId: stableSignature(["dependency-edge", source, target, relationship]).slice(0, 48),
    source,
    target,
    relationship,
    dependencyStrength,
    dependencySummary: summary,
    confidence: Number(Math.min(0.94, Math.max(0.5, confidence)).toFixed(2)),
    generatedAt: now,
  };
}

function mapOrchestrationDependencyToCategory(
  dep: OrganizationalResponseDependency
): StrategicActionDependency {
  return {
    dependencyId: dep.dependencyId,
    source: dep.prerequisiteCategory,
    target: dep.dependentCategory,
    relationship: "prerequisite",
    dependencyStrength: dep.sensitivity === "elevated" ? "strong" : "moderate",
    dependencySummary: dep.dependencySummary,
    confidence: 0.78,
    generatedAt: dep.generatedAt,
  };
}

function buildCoreDependencyRelationships(now: number): StrategicActionDependency[] {
  return [
    buildDependencyEdge(
      "governance_alignment",
      "pressure_reduction",
      "prerequisite",
      "strong",
      "Governance alignment is a prerequisite for sustainable pressure reduction across enterprise systems.",
      0.88,
      now
    ),
    buildDependencyEdge(
      "governance_alignment",
      "escalation_prevention",
      "prerequisite",
      "critical",
      "Escalation containment requires governance stabilization before risk reduction actions take effect.",
      0.9,
      now
    ),
    buildDependencyEdge(
      "pressure_reduction",
      "recovery_acceleration",
      "reinforcement",
      "strong",
      "Pressure reduction reinforces recovery acceleration by lowering propagation before resilience actions scale.",
      0.86,
      now
    ),
    buildDependencyEdge(
      "escalation_prevention",
      "coordination_stabilization",
      "acceleration",
      "moderate",
      "Escalation containment accelerates coordination stabilization once spread is contained.",
      0.8,
      now
    ),
    buildDependencyEdge(
      "resilience_reinforcement",
      "recovery_acceleration",
      "synchronization",
      "strong",
      "Recovery acceleration requires synchronized resilience reinforcement support.",
      0.84,
      now
    ),
    buildDependencyEdge(
      "coordination_stabilization",
      "governance_alignment",
      "stabilization",
      "moderate",
      "Coordination stabilization reinforces governance alignment under distributed operational strain.",
      0.76,
      now
    ),
  ];
}

function buildCoordinationBottleneckIndicators(
  narrativeLine: string,
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  preparednessWeak: boolean,
  now: number
): CoordinationBottleneckIndicator[] {
  const indicators: CoordinationBottleneckIndicator[] = [];

  if (
    narrativeLine.includes("coordination strain") ||
    narrativeLine.includes("coordination instability")
  ) {
    indicators.push({
      indicatorId: stableSignature(["bottleneck", "coordination_instability"]).slice(0, 48),
      bottleneckCategory: "coordination_instability",
      indicatorLabel: "coordination instability",
      bottleneckSummary:
        "Coordination instability blocks stabilization sequencing until governance and pressure actions align.",
      severity: "elevated",
      generatedAt: now,
    });
  }

  if (preparednessWeak) {
    indicators.push({
      indicatorId: stableSignature(["bottleneck", "governance_readiness"]).slice(0, 48),
      bottleneckCategory: "governance_alignment",
      indicatorLabel: "preparedness constraint",
      bottleneckSummary:
        "Weak preparedness constrains orchestration throughput for escalation and recovery dependencies.",
      severity: "moderate",
      generatedAt: now,
    });
  }

  const criticalOrchestration = coordinationSnapshot?.recentStrategicOrchestrations.find(
    (o) => o.actionPriority === "critical"
  );
  if (criticalOrchestration) {
    indicators.push({
      indicatorId: stableSignature(["bottleneck", "critical_orchestration"]).slice(0, 48),
      bottleneckCategory: "escalation_prevention",
      indicatorLabel: "escalation spread bottleneck",
      bottleneckSummary: criticalOrchestration.summary.slice(0, 140),
      severity: "critical",
      generatedAt: now,
    });
  }

  return indicators;
}

function inferCoordinationState(
  relationshipCount: number,
  bottleneckCount: number,
  hubInbound: number
): CoordinationState {
  if (bottleneckCount >= 2) return "constrained";
  if (hubInbound >= 3) return "dependent";
  if (relationshipCount >= 4) return "synchronized";
  if (relationshipCount >= 2) return "linked";
  return "isolated";
}

function inferGraphStrength(
  relationships: StrategicActionDependency[],
  bottleneckCount: number
): DependencyStrength {
  const criticalEdges = relationships.filter((r) => r.dependencyStrength === "critical").length;
  if (criticalEdges >= 2 || bottleneckCount >= 2) return "critical";
  if (relationships.filter((r) => r.dependencyStrength === "strong").length >= 3) return "strong";
  if (relationships.length >= 4) return "moderate";
  return "weak";
}

function buildDependencyNodes(
  relationships: StrategicActionDependency[],
  now: number
): EnterpriseDependencyNode[] {
  const inbound = new Map<ActionCategory, number>();
  const outbound = new Map<ActionCategory, number>();

  for (const edge of relationships) {
    outbound.set(edge.source, (outbound.get(edge.source) ?? 0) + 1);
    inbound.set(edge.target, (inbound.get(edge.target) ?? 0) + 1);
  }

  const categories = new Set<ActionCategory>([
    ...inbound.keys(),
    ...outbound.keys(),
  ]);

  return Array.from(categories).map((category) => {
    const inCount = inbound.get(category) ?? 0;
    const outCount = outbound.get(category) ?? 0;
    const criticality: DependencyStrength =
      inCount >= 3 ? "critical" : inCount >= 2 ? "strong" : inCount >= 1 ? "moderate" : "weak";

    return {
      nodeId: stableSignature(["dependency-node", category]).slice(0, 48),
      category,
      nodeLabel: category.replace(/_/g, " "),
      inboundCount: inCount,
      outboundCount: outCount,
      criticality,
      generatedAt: now,
    };
  });
}

function buildStabilizationCoordinationGraph(
  relationships: StrategicActionDependency[],
  bottlenecks: CoordinationBottleneckIndicator[],
  now: number
): OperationalCoordinationGraph | null {
  if (relationships.length < 2) return null;

  const bottleneckLabels = bottlenecks.map((b) =>
    b.bottleneckCategory === "coordination_instability"
      ? "coordination_instability"
      : String(b.bottleneckCategory)
  );

  const hubInbound = buildDependencyNodes(relationships, now).find(
    (n) => n.category === "governance_alignment"
  )?.inboundCount ?? 0;

  const coordinationState = inferCoordinationState(
    relationships.length,
    bottlenecks.length,
    hubInbound
  );
  const dependencyStrength = inferGraphStrength(relationships, bottlenecks.length);
  const confidence = Number(
    Math.min(0.94, 0.72 + relationships.length * 0.04 - bottlenecks.length * 0.03).toFixed(2)
  );

  return {
    dependencyGraphId: buildGraphId("enterprise_stabilization_graph"),
    coordinationState,
    dependencyStrength,
    summary:
      "Governance stabilization acts as a critical coordination dependency for escalation containment, pressure reduction, and recovery acceleration.",
    dependencyRelationships: Object.freeze(relationships),
    bottlenecks: Object.freeze(bottleneckLabels.slice(0, 4)),
    confidence,
    confidenceLevel: confidenceToDependencyLevel(confidence),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildBlockingGraph(
  bottlenecks: CoordinationBottleneckIndicator[],
  now: number
): OperationalCoordinationGraph | null {
  if (bottlenecks.length === 0) return null;

  const blockingEdge = buildDependencyEdge(
    "coordination_stabilization",
    "governance_alignment",
    "blocking",
    "strong",
    "Coordination instability blocks stabilization until governance alignment dependencies resolve.",
    0.82,
    now
  );

  return {
    dependencyGraphId: buildGraphId("coordination_bottleneck_graph"),
    coordinationState: "constrained",
    dependencyStrength: "strong",
    summary:
      "Operational coordination friction creates blocking dependencies that delay stabilization and recovery sequencing.",
    dependencyRelationships: Object.freeze([blockingEdge]),
    bottlenecks: Object.freeze(
      bottlenecks.map((b) =>
        b.bottleneckCategory === "coordination_instability"
          ? "coordination_instability"
          : String(b.bottleneckCategory)
      )
    ),
    confidence: 0.8,
    confidenceLevel: confidenceToDependencyLevel(0.8),
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildRelationshipSignals(
  relationships: StrategicActionDependency[],
  now: number
): ResponseRelationshipSignal[] {
  return relationships.slice(0, 8).map((edge) => ({
    signalId: stableSignature(["relationship-signal", edge.dependencyId]).slice(0, 48),
    source: edge.source,
    target: edge.target,
    relationship: edge.relationship,
    signalLabel: `${edge.relationship} relationship`,
    signalSummary: edge.dependencySummary,
    dependencyStrength: edge.dependencyStrength,
    confidence: edge.confidence,
    generatedAt: now,
  }));
}

function buildDependencyAwarenessSnapshot(
  organizationId: string,
  graphs: OperationalCoordinationGraph[],
  nodes: EnterpriseDependencyNode[],
  signals: ResponseRelationshipSignal[],
  bottlenecks: CoordinationBottleneckIndicator[],
  now: number
): DependencyAwarenessSnapshot {
  const top = graphs[0];
  const awarenessSummary: DependencyAwarenessSnapshot["awarenessSummary"] = top
    ? {
        dominantCoordinationState: top.coordinationState,
        dominantDependencyStrength: top.dependencyStrength,
        dependencyHeadline: top.summary,
        graphComplexity:
          top.dependencyRelationships.length >= 5
            ? top.dependencyStrength === "critical"
              ? "executive_grade"
              : "high"
            : top.dependencyRelationships.length >= 3
              ? "moderate"
              : "low",
      }
    : {
        dominantCoordinationState: "isolated",
        dominantDependencyStrength: "weak",
        dependencyHeadline: "Dependency intelligence awaiting sufficient orchestration depth.",
        graphComplexity: "low",
      };

  const signature = stableSignature([
    "d9-5-2-dependency-snapshot",
    organizationId,
    graphs.map((g) => g.dependencyGraphId),
    awarenessSummary.graphComplexity,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    graphCount: graphs.length,
    awarenessSummary,
    recentCoordinationGraphs: Object.freeze(graphs.slice(0, 6)),
    dependencyNodes: Object.freeze(nodes.slice(0, 10)),
    relationshipSignals: Object.freeze(signals.slice(0, 8)),
    bottleneckIndicators: Object.freeze(bottlenecks.slice(0, 6)),
  };
}

export function evaluateStrategicActionDependencies(
  input: StrategicActionDependencyInput
): StrategicActionDependencyResult {
  if (!beginActionDependencyEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newCoordinationGraphs: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getActionDependencyStore(organizationId);
    const prior = store.getState();

    const orchestrationState = getDecisionOrchestrationStore(organizationId).getState();
    const foresightState = getUnifiedForesightRuntimeStore(organizationId).getState();
    const preparednessState = getPreparednessCognitionStore(organizationId).getState();
    const interventionState = getInterventionTimingStore(organizationId).getState();
    const replayState = getOperationalReplayStore(organizationId).getState();

    const coordinationSnapshot =
      input.coordinationSnapshot ?? orchestrationState.snapshots[0] ?? null;
    const anticipatorySnapshot =
      input.anticipatorySnapshot ?? foresightState.snapshots[0] ?? null;
    const preparednessSnapshot =
      input.preparednessSnapshot ?? preparednessState.snapshots[0] ?? null;
    const interventionSnapshot =
      input.interventionSnapshot ?? interventionState.snapshots[0] ?? null;
    const replaySnapshot = input.replaySnapshot ?? replayState.snapshots[0] ?? null;

    const evaluationSignature = stableSignature([
      "d9-5-2-dependency-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      coordinationSnapshot?.signature ?? orchestrationState.signature,
      anticipatorySnapshot?.signature ?? foresightState.signature,
      preparednessSnapshot?.signature ?? preparednessState.signature,
      interventionSnapshot?.signature ?? interventionState.signature,
      replaySnapshot?.signature ?? replayState.signature,
    ]);

    if (
      !shouldEvaluateActionDependency(
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
        newCoordinationGraphs: 0,
        storeSignature: prior.signature,
      };
    }

    const dependencyDepth =
      (coordinationSnapshot?.orchestrationCount ?? 0) +
      (orchestrationState.strategicOrchestrations.length) +
      (orchestrationState.responseDependencies.length);

    if (dependencyDepth < 2) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_dependency_depth",
        snapshot: prior.snapshots[0] ?? null,
        newCoordinationGraphs: 0,
        storeSignature: prior.signature,
      };
    }

    const narrativeLine =
      input.enterpriseNarrativeLine ??
      input.cognitionSnapshot?.organizationalLearningLine ??
      input.cognitionSnapshot?.timelineStrategicEvolutionLine ??
      "";
    const preparednessWeak =
      preparednessSnapshot?.awarenessSummary.enterprisePreparednessPosture === "weak" ||
      preparednessSnapshot?.awarenessSummary.enterprisePreparednessPosture === "limited";

    const relationships: StrategicActionDependency[] = [
      ...buildCoreDependencyRelationships(now),
      ...(coordinationSnapshot?.responseDependencies ?? orchestrationState.responseDependencies).map(
        mapOrchestrationDependencyToCategory
      ),
    ];

    const dedupedRelationships = Array.from(
      new Map(relationships.map((r) => [r.dependencyId, r])).values()
    );

    const bottlenecks = buildCoordinationBottleneckIndicators(
      narrativeLine,
      coordinationSnapshot,
      preparednessWeak,
      now
    );

    if (
      interventionSnapshot?.recentStrategicInterventionWindows.some(
        (w) => w.windowState === "narrowing" || w.windowState === "closing"
      )
    ) {
      dedupedRelationships.push(
        buildDependencyEdge(
          "governance_alignment",
          "operational_realignment",
          "prerequisite",
          "strong",
          "Narrowing intervention timing increases prerequisite dependency on governance-aligned operational focus.",
          0.81,
          now
        )
      );
    }

    if (replaySnapshot && replaySnapshot.replayCount >= 2) {
      dedupedRelationships.push(
        buildDependencyEdge(
          "escalation_prevention",
          "pressure_reduction",
          "acceleration",
          "moderate",
          "Operational replay patterns indicate escalation containment accelerates subsequent pressure reduction.",
          0.77,
          now
        )
      );
    }

    const resilienceLine = input.resilienceForecastLine ?? "";
    if (resilienceLine.includes("strengthen")) {
      dedupedRelationships.push(
        buildDependencyEdge(
          "operational_realignment",
          "resilience_reinforcement",
          "reinforcement",
          "moderate",
          "Strong resilience forecast reinforces operational realignment before resilience scaling actions.",
          0.75,
          now
        )
      );
    }

    const finalRelationships = dedupedRelationships.slice(0, 12);
    const nodes = buildDependencyNodes(finalRelationships, now);
    const signals = buildRelationshipSignals(finalRelationships, now);

    const candidates: OperationalCoordinationGraph[] = [];
    const stabilization = buildStabilizationCoordinationGraph(
      finalRelationships,
      bottlenecks,
      now
    );
    if (stabilization) candidates.push(stabilization);

    const blocking = buildBlockingGraph(bottlenecks, now);
    if (blocking && bottlenecks.some((b) => b.bottleneckCategory === "coordination_instability")) {
      candidates.push(blocking);
    }

    const retained = candidates
      .filter(shouldRetainOperationalCoordinationGraph)
      .sort(
        (a, b) =>
          strengthRank(b.dependencyStrength) - strengthRank(a.dependencyStrength) ||
          b.confidence - a.confidence
      )
      .slice(0, 6);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_coordination_graphs",
        snapshot: prior.snapshots[0] ?? null,
        newCoordinationGraphs: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.coordinationGraphs.map((g) => g.dependencyGraphId));
    const newCount = retained.filter((g) => !priorIds.has(g.dependencyGraphId)).length;

    store.upsertCoordinationGraphs(retained, now);
    store.upsertDependencyNodes(nodes, now);
    store.upsertRelationshipSignals(signals, now);
    if (bottlenecks.length > 0) {
      store.upsertBottleneckIndicators(bottlenecks, now);
    }

    const snapshot = buildDependencyAwarenessSnapshot(
      organizationId,
      retained,
      nodes,
      signals,
      bottlenecks,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (retained.some((g) => g.dependencyStrength === "critical")) {
      devLog("critical dependency formation — enterprise stabilization graph");
    }
    if (bottlenecks.length > 0) {
      devLog(`bottleneck emergence — ${bottlenecks[0]!.bottleneckCategory}`);
    }
    if (retained.some((g) => g.coordinationState === "synchronized" || g.coordinationState === "dependent")) {
      devLog("coordination graph stabilization — dependency topology coherent");
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newCoordinationGraphs: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endActionDependencyEvaluation();
  }
}
