import { stableSignature } from "../intelligence/shared/dedupe";
import { getPreparednessCognitionStore } from "../foresight-cognition/preparednessCognitionStore";
import type { EnterprisePreparednessSnapshot } from "../foresight-cognition/preparednessCognitionTypes";
import { getUnifiedForesightRuntimeStore } from "../foresight-cognition/unifiedForesightRuntimeStore";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import { getActionDependencyStore } from "./actionDependencyStore";
import { getAdaptiveSequencingStore } from "./adaptiveSequencingStore";
import { getDecisionConfidenceStore } from "./decisionConfidenceStore";
import { getDecisionOrchestrationStore } from "./decisionOrchestrationStore";
import type { ActionCategory, DecisionCoordinationSnapshot } from "./decisionOrchestrationTypes";
import { getInstitutionalAlignmentStore } from "./institutionalAlignmentStore";
import type { GovernanceCoherenceSnapshot } from "./institutionalAlignmentTypes";
import { getInterventionProjectionStore } from "./interventionProjectionStore";
import type { OutcomeProjectionSnapshot } from "./interventionProjectionTypes";
import { getPriorityArbitrationStore } from "./priorityArbitrationStore";
import { getScenarioCoordinationStore } from "./scenarioCoordinationStore";
import {
  beginStabilityOptimizationEvaluation,
  clampOptimizationConfidence,
  endStabilityOptimizationEvaluation,
  optimizationStateRank,
  optimizationStrengthRank,
  shouldEvaluateStabilityOptimization,
  shouldRetainStrategicStabilityOptimization,
} from "./stabilityOptimizationGuards";
import { getStabilityOptimizationStore } from "./stabilityOptimizationStore";
import type {
  AdaptiveResilienceIndicator,
  EnterpriseResiliencePathway,
  OperationalSustainabilitySignal,
  OptimizationCategory,
  OptimizationState,
  OptimizationStrength,
  StabilityOptimizationAwarenessSummary,
  StabilityOptimizationSnapshot,
  StabilityReinforcementRelationship,
  StabilityReinforcementTopology,
  StrategicStabilityOptimization,
  StrategicStabilityOptimizationInput,
  StrategicStabilityOptimizationResult,
} from "./stabilityOptimizationTypes";

const DEV_LOG_PREFIX = "[Nexora][StabilityOptimization]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildOptimizationId(label: string): string {
  return stableSignature(["stability-optimization", label]).slice(0, 56);
}

function createOptimization(
  label: string,
  optimizationState: OptimizationState,
  optimizationStrength: OptimizationStrength,
  category: OptimizationCategory,
  summary: string,
  resilienceSignals: string[],
  sustainabilityRisks: string[],
  confidence: number,
  now: number
): StrategicStabilityOptimization {
  return {
    optimizationId: buildOptimizationId(label),
    optimizationState,
    optimizationStrength,
    optimizationCategory: category,
    summary,
    resilienceSignals: Object.freeze(resilienceSignals),
    sustainabilityRisks: Object.freeze(sustainabilityRisks),
    confidence: clampOptimizationConfidence(confidence),
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

function buildGovernancePreparednessResiliencePathway(
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  preparednessSnapshot: EnterprisePreparednessSnapshot | null,
  alignmentSnapshot: GovernanceCoherenceSnapshot | null,
  now: number
): StrategicStabilityOptimization | null {
  const governance = orchestrationIncludes(coordinationSnapshot, "governance_alignment");
  const preparednessReady =
    preparednessSnapshot?.awarenessSummary.enterprisePreparednessPosture === "strong" ||
    preparednessSnapshot?.awarenessSummary.enterprisePreparednessPosture === "resilient";
  const aligned =
    alignmentSnapshot?.alignmentSummary.coherencePosture === "high" ||
    alignmentSnapshot?.alignmentSummary.coherencePosture === "institutional_grade";

  if (!governance || !preparednessReady) return null;

  return createOptimization(
    "governance_preparedness_resilience",
    "resilient",
    "strong",
    "resilience_strengthening",
    "Governance stabilization reinforces preparedness and strengthens long-term resilience through continuity-aligned orchestration pathways.",
    ["governance_continuity", "preparedness_reinforcement", "resilience_strengthening"],
    aligned ? [] : ["governance_delay"],
    0.87,
    now
  );
}

function buildPressureCoordinationSustainability(
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  projectionSnapshot: OutcomeProjectionSnapshot | null,
  now: number
): StrategicStabilityOptimization | null {
  const pressure = orchestrationIncludes(coordinationSnapshot, "pressure_reduction");
  const durabilityProjection = projectionSnapshot?.recentInterventionProjections.some((p) =>
    p.projectedOutcomes.includes("coordination_alignment")
  );

  if (!pressure || !durabilityProjection) return null;

  return createOptimization(
    "pressure_coordination_sustainability",
    "stabilizing",
    "moderate",
    "coordination_sustainability",
    "Pressure reduction improves coordination durability and reinforces operational sustainability across dependent enterprise systems.",
    ["pressure_reduction", "coordination_stability", "operational_balance"],
    [],
    0.84,
    now
  );
}

function buildRecoveryOverloadUnstableWarning(
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  dependencySnapshot: { bottleneckIndicators: readonly { bottleneckCategory: string }[] } | null,
  projectionSnapshot: OutcomeProjectionSnapshot | null,
  now: number
): StrategicStabilityOptimization | null {
  const recovery = orchestrationIncludes(coordinationSnapshot, "recovery_acceleration");
  const overload =
    dependencySnapshot?.bottleneckIndicators.some(
      (b) => b.bottleneckCategory === "coordination_instability"
    ) ?? false;
  const tradeoffProjection = projectionSnapshot?.recentInterventionProjections.some((p) =>
    p.secondaryEffects.includes("coordination_load_increase")
  );

  if (!recovery || (!overload && !tradeoffProjection)) return null;

  return createOptimization(
    "recovery_acceleration_unstable_warning",
    "unstable",
    "moderate",
    "recovery_continuity",
    "Recovery acceleration may improve short-term continuity while overloading coordination systems and weakening long-term resilience sustainability.",
    ["recovery_acceleration"],
    ["coordination_overload", "resilience_fatigue", "execution_speed_constraint"],
    0.68,
    now
  );
}

function buildAdaptiveSequencingContinuityOptimization(
  sequencingSnapshot: { recentAdaptiveSequences: readonly { sequencingState: string }[] } | null,
  continuityPreserved: boolean,
  now: number
): StrategicStabilityOptimization | null {
  const adaptiveSequencing = sequencingSnapshot?.recentAdaptiveSequences.some(
    (s) => s.sequencingState === "adaptive" || s.sequencingState === "evolving"
  );

  if (!adaptiveSequencing || !continuityPreserved) return null;

  return createOptimization(
    "adaptive_sequencing_continuity",
    "adaptive",
    "strong",
    "adaptive_stability",
    "Adaptive sequencing improves operational continuity and supports resilience-oriented orchestration as enterprise conditions evolve.",
    ["adaptive_recovery", "operational_continuity", "coordination_stability"],
    ["timing_sensitivity_increase"],
    0.85,
    now
  );
}

function buildEscalationContainmentAdaptability(
  anticipatorySnapshot: EnterpriseAnticipatorySnapshot | null,
  arbitrationSnapshot: { recentExecutiveArbitrations: readonly { competingPriorities: readonly string[] }[] } | null,
  now: number
): StrategicStabilityOptimization | null {
  const escalationActive =
    anticipatorySnapshot?.summary.earlyWarningState === "emerging" ||
    anticipatorySnapshot?.summary.earlyWarningState === "intensifying";
  const resiliencePriority = arbitrationSnapshot?.recentExecutiveArbitrations.some((a) =>
    a.competingPriorities.includes("resilience")
  );

  if (!escalationActive || !resiliencePriority) return null;

  return createOptimization(
    "escalation_containment_adaptability",
    "sustainable",
    "strong",
    "escalation_resilience",
    "Escalation containment maintains adaptability while forming a sustainable stabilization topology across resilience-oriented pathways.",
    ["escalation_containment", "resilience_strengthening", "adaptive_stability"],
    ["reduced_execution_speed"],
    0.83,
    now
  );
}

function buildEnterpriseResiliencePathwayOptimization(
  coordinationSnapshot: DecisionCoordinationSnapshot | null,
  alignmentSnapshot: GovernanceCoherenceSnapshot | null,
  projectionSnapshot: OutcomeProjectionSnapshot | null,
  sequencingSnapshot: { sequenceCount: number } | null,
  resilienceLine: string,
  now: number
): StrategicStabilityOptimization | null {
  const depth =
    (coordinationSnapshot?.orchestrationCount ?? 0) >= 2 &&
    (alignmentSnapshot?.alignmentCount ?? 0) >= 1 &&
    (projectionSnapshot?.projectionCount ?? 0) >= 1 &&
    (sequencingSnapshot?.sequenceCount ?? 0) >= 1;
  const resilienceGrowth = resilienceLine.includes("strengthen");

  if (!depth) return null;

  return createOptimization(
    "enterprise_resilience_pathway",
    resilienceGrowth ? "sustainable" : "resilient",
    "strong",
    "strategic_sustainability",
    "Governance stabilization, pressure reduction, and adaptive recovery coordination collectively reinforce long-term enterprise resilience and operational sustainability.",
    [
      "governance_continuity",
      "coordination_stability",
      "pressure_reduction",
      "adaptive_recovery",
    ],
    ["execution_speed_constraint"],
    0.9,
    now
  );
}

function buildSustainabilitySignal(
  label: string,
  summary: string,
  categories: OptimizationCategory[],
  level: OperationalSustainabilitySignal["sustainabilityLevel"],
  confidence: number,
  now: number
): OperationalSustainabilitySignal {
  return {
    signalId: stableSignature(["sustainability-signal", label]).slice(0, 48),
    signalLabel: label,
    signalSummary: summary,
    linkedCategories: Object.freeze(categories),
    sustainabilityLevel: level,
    confidence: clampOptimizationConfidence(confidence),
    generatedAt: now,
  };
}

function buildResiliencePathway(
  optimization: StrategicStabilityOptimization,
  now: number
): EnterpriseResiliencePathway {
  return {
    pathwayId: stableSignature(["resilience-pathway", optimization.optimizationId]).slice(0, 48),
    pathwayLabel: optimization.optimizationCategory.replace(/_/g, " "),
    pathwaySummary: optimization.summary.slice(0, 120),
    linkedCategories: Object.freeze([optimization.optimizationCategory]),
    pathwayStrength: optimization.optimizationStrength,
    durability:
      optimization.optimizationState === "sustainable" || optimization.optimizationState === "resilient"
        ? "high"
        : optimization.optimizationState === "stabilizing"
          ? "moderate"
          : "low",
    generatedAt: now,
    lastObservedAt: now,
    occurrenceCount: 1,
  };
}

function buildAdaptiveIndicator(
  label: string,
  summary: string,
  categories: OptimizationCategory[],
  level: AdaptiveResilienceIndicator["adaptabilityLevel"],
  now: number
): AdaptiveResilienceIndicator {
  return {
    indicatorId: stableSignature(["adaptive-resilience", label]).slice(0, 48),
    indicatorLabel: label,
    indicatorSummary: summary,
    linkedCategories: Object.freeze(categories),
    adaptabilityLevel: level,
    generatedAt: now,
  };
}

function buildReinforcementTopology(
  optimizations: StrategicStabilityOptimization[],
  now: number
): StabilityReinforcementTopology | null {
  if (optimizations.length < 2) return null;

  const relationships: StabilityReinforcementRelationship[] = optimizations
    .slice(0, 3)
    .map((o, i, arr) => ({
      relationshipId: stableSignature([
        "stability-reinforcement",
        o.optimizationCategory,
        arr[i + 1]?.optimizationCategory ?? "unknown",
      ]).slice(0, 48),
      source: o.optimizationCategory,
      target: arr[i + 1]?.optimizationCategory ?? ("unknown" as OptimizationCategory),
      reinforcementSummary: o.summary.slice(0, 80),
      reinforcementStrength: o.optimizationStrength,
      generatedAt: now,
    }));

  return {
    topologyId: stableSignature(["stability-reinforcement-topology"]).slice(0, 48),
    topologySummary:
      "Multiple resilience-oriented optimizations form a sustainable stabilization topology reinforcing enterprise durability.",
    reinforcementRelationships: Object.freeze(relationships),
    topologyStrength: optimizations[0]!.optimizationStrength,
    generatedAt: now,
  };
}

function buildStabilityOptimizationSnapshot(
  organizationId: string,
  optimizations: StrategicStabilityOptimization[],
  pathways: EnterpriseResiliencePathway[],
  signals: OperationalSustainabilitySignal[],
  topologies: StabilityReinforcementTopology[],
  indicators: AdaptiveResilienceIndicator[],
  now: number
): StabilityOptimizationSnapshot {
  const top = optimizations[0];
  const awarenessSummary: StabilityOptimizationAwarenessSummary = top
    ? {
        dominantOptimizationState: top.optimizationState,
        dominantOptimizationStrength: top.optimizationStrength,
        optimizationHeadline: top.summary,
        resiliencePosture:
          top.optimizationStrength === "systemic" && top.optimizationState === "sustainable"
            ? "executive_grade"
            : top.optimizationState === "unstable"
              ? "low"
              : top.optimizationState === "resilient" || top.optimizationState === "sustainable"
                ? "high"
                : "moderate",
      }
    : {
        dominantOptimizationState: "unstable",
        dominantOptimizationStrength: "weak",
        optimizationHeadline:
          "Stability optimization awaiting sufficient intervention projection and alignment depth.",
        resiliencePosture: "low",
      };

  const signature = stableSignature([
    "d9-5-9-stability-optimization-snapshot",
    organizationId,
    optimizations.map((o) => o.optimizationId),
    awarenessSummary.resiliencePosture,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    optimizationCount: optimizations.length,
    awarenessSummary,
    recentStabilityOptimizations: Object.freeze(optimizations.slice(0, 6)),
    resiliencePathways: Object.freeze(pathways.slice(0, 6)),
    sustainabilitySignals: Object.freeze(signals.slice(0, 6)),
    reinforcementTopologies: Object.freeze(topologies.slice(0, 4)),
    adaptiveResilienceIndicators: Object.freeze(indicators.slice(0, 6)),
  };
}

export function evaluateStrategicStabilityOptimization(
  input: StrategicStabilityOptimizationInput
): StrategicStabilityOptimizationResult {
  if (!beginStabilityOptimizationEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursion_depth_exceeded",
      snapshot: null,
      newStabilityOptimizations: 0,
      storeSignature: "",
    };
  }

  try {
    const organizationId = input.organizationId.trim() || "nexora-default";
    const now = input.now ?? Date.now();
    const store = getStabilityOptimizationStore(organizationId);
    const prior = store.getState();

    const orchestrationState = getDecisionOrchestrationStore(organizationId).getState();
    const dependencyState = getActionDependencyStore(organizationId).getState();
    const arbitrationState = getPriorityArbitrationStore(organizationId).getState();
    const scenarioState = getScenarioCoordinationStore(organizationId).getState();
    const sequencingState = getAdaptiveSequencingStore(organizationId).getState();
    const confidenceState = getDecisionConfidenceStore(organizationId).getState();
    const alignmentState = getInstitutionalAlignmentStore(organizationId).getState();
    const projectionState = getInterventionProjectionStore(organizationId).getState();
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
    const projectionSnapshot =
      input.projectionSnapshot ?? projectionState.snapshots[0] ?? null;
    const anticipatorySnapshot =
      input.anticipatorySnapshot ?? foresightState.snapshots[0] ?? null;
    const preparednessSnapshot =
      input.preparednessSnapshot ?? preparednessState.snapshots[0] ?? null;

    const evaluationSignature = stableSignature([
      "d9-5-9-stability-optimization-eval",
      organizationId,
      input.cognitionSnapshot?.signature ?? "no-cognition",
      coordinationSnapshot?.signature ?? orchestrationState.signature,
      dependencySnapshot?.signature ?? dependencyState.signature,
      arbitrationSnapshot?.signature ?? arbitrationState.signature,
      scenarioSnapshot?.signature ?? scenarioState.signature,
      sequencingSnapshot?.signature ?? sequencingState.signature,
      confidenceSnapshot?.signature ?? confidenceState.signature,
      alignmentSnapshot?.signature ?? alignmentState.signature,
      projectionSnapshot?.signature ?? projectionState.signature,
      anticipatorySnapshot?.signature ?? foresightState.signature,
      preparednessSnapshot?.signature ?? preparednessState.signature,
    ]);

    if (
      !shouldEvaluateStabilityOptimization(
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
        newStabilityOptimizations: 0,
        storeSignature: prior.signature,
      };
    }

    const optimizationDepth =
      (coordinationSnapshot?.orchestrationCount ?? 0) +
      (dependencySnapshot?.graphCount ?? 0) +
      (arbitrationSnapshot?.arbitrationCount ?? 0) +
      (scenarioSnapshot?.topologyCount ?? 0) +
      (sequencingSnapshot?.sequenceCount ?? 0) +
      (confidenceSnapshot?.confidenceCount ?? 0) +
      (alignmentSnapshot?.alignmentCount ?? 0) +
      (projectionSnapshot?.projectionCount ?? 0);

    if (optimizationDepth < 8) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_optimization_depth",
        snapshot: prior.snapshots[0] ?? null,
        newStabilityOptimizations: 0,
        storeSignature: prior.signature,
      };
    }

    const resilienceLine =
      input.resilienceForecastLine ?? input.cognitionSnapshot?.resilienceForecastLine ?? "";
    const continuityPreserved = input.continuityPreserved ?? true;

    const candidates: StrategicStabilityOptimization[] = [];

    const governancePreparedness = buildGovernancePreparednessResiliencePathway(
      coordinationSnapshot,
      preparednessSnapshot,
      alignmentSnapshot,
      now
    );
    if (governancePreparedness) candidates.push(governancePreparedness);

    const pressureSustainability = buildPressureCoordinationSustainability(
      coordinationSnapshot,
      projectionSnapshot,
      now
    );
    if (pressureSustainability) candidates.push(pressureSustainability);

    const recoveryUnstable = buildRecoveryOverloadUnstableWarning(
      coordinationSnapshot,
      dependencySnapshot,
      projectionSnapshot,
      now
    );
    if (recoveryUnstable) candidates.push(recoveryUnstable);

    const adaptiveContinuity = buildAdaptiveSequencingContinuityOptimization(
      sequencingSnapshot,
      continuityPreserved,
      now
    );
    if (adaptiveContinuity) candidates.push(adaptiveContinuity);

    const escalationAdaptability = buildEscalationContainmentAdaptability(
      anticipatorySnapshot,
      arbitrationSnapshot,
      now
    );
    if (escalationAdaptability) candidates.push(escalationAdaptability);

    const enterprisePathway = buildEnterpriseResiliencePathwayOptimization(
      coordinationSnapshot,
      alignmentSnapshot,
      projectionSnapshot,
      sequencingSnapshot,
      resilienceLine,
      now
    );
    if (enterprisePathway) candidates.push(enterprisePathway);

    const retained = candidates
      .filter(shouldRetainStrategicStabilityOptimization)
      .sort(
        (a, b) =>
          optimizationStateRank(b.optimizationState) - optimizationStateRank(a.optimizationState) ||
          optimizationStrengthRank(b.optimizationStrength) -
            optimizationStrengthRank(a.optimizationStrength) ||
          b.confidence - a.confidence
      )
      .slice(0, 8);

    if (retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "no_retainable_optimizations",
        snapshot: prior.snapshots[0] ?? null,
        newStabilityOptimizations: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.stabilityOptimizations.map((o) => o.optimizationId));
    const newCount = retained.filter((o) => !priorIds.has(o.optimizationId)).length;

    const sustainabilitySignals = retained.map((o) =>
      buildSustainabilitySignal(
        o.optimizationId,
        o.summary.slice(0, 100),
        [o.optimizationCategory],
        o.optimizationState === "sustainable" || o.optimizationState === "resilient"
          ? "high"
          : o.optimizationState === "unstable"
            ? "low"
            : "moderate",
        o.confidence,
        now
      )
    );

    const pathways = retained.map((o) => buildResiliencePathway(o, now));

    const indicators = retained
      .filter((o) => o.optimizationState === "adaptive" || o.optimizationState === "sustainable")
      .map((o) =>
        buildAdaptiveIndicator(
          o.optimizationId,
          o.summary.slice(0, 100),
          [o.optimizationCategory, "adaptive_stability"],
          o.optimizationState === "sustainable" ? "high" : "moderate",
          now
        )
      );

    const topology = buildReinforcementTopology(retained, now);
    const topologies = topology ? [topology] : [];

    store.upsertStabilityOptimizations(retained, now);
    store.upsertResiliencePathways(pathways, now);
    store.upsertSustainabilitySignals(sustainabilitySignals, now);
    store.upsertAdaptiveResilienceIndicators(indicators, now);
    store.upsertReinforcementTopologies(topologies, now);

    const snapshot = buildStabilityOptimizationSnapshot(
      organizationId,
      retained,
      pathways,
      sustainabilitySignals,
      topologies,
      indicators,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (enterprisePathway || topology) {
      devLog("major resilience pathway formation — enterprise stability optimization active");
    }
    if (pressureSustainability || governancePreparedness) {
      devLog("sustainability reinforcement emergence — coordination durability strengthening");
    }
    if (enterprisePathway || adaptiveContinuity) {
      devLog("orchestration durability stabilization — long-term resilience pathways reinforced");
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newStabilityOptimizations: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endStabilityOptimizationEvaluation();
  }
}
