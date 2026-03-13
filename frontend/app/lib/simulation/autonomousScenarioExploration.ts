import {
  buildBaselineKpiStateMap,
  buildBaselineLoopStateMap,
  buildBaselineObjectStateMap,
  buildBaselineRelationStateMap,
  runDomainScenarioSimulation,
  type NexoraScenarioDefinition,
  type NexoraScenarioOutcome,
} from "./domainSimulationScenarioEngine";
import {
  compareBaselineToScenario,
  type NexoraOutcomeComparisonResult,
} from "./outcomeComparisonReplay";
import { EXAMPLE_DOMAIN_RUNTIME_INTEGRATIONS } from "../runtime/domainRuntimeIntegration";

export type NexoraExplorationGoal =
  | "find_fragility"
  | "find_stability"
  | "find_opportunity"
  | "find_pressure_points"
  | "compare_alternatives"
  | "general";

export type NexoraExplorationStrategy =
  | "single_object_perturbation"
  | "multi_object_pressure"
  | "loop_amplification"
  | "constraint_stress"
  | "kpi_stress"
  | "stabilization_intervention"
  | "opportunity_uplift"
  | "mixed";

export interface NexoraExplorationCandidate {
  id: string;
  label: string;
  strategy: NexoraExplorationStrategy;
  goal?: NexoraExplorationGoal;
  targetObjectIds?: string[];
  targetRelationIds?: string[];
  targetLoopIds?: string[];
  targetKpiIds?: string[];
  triggerType?:
    | "object_risk"
    | "object_instability"
    | "relation_bottleneck"
    | "loop_pressure"
    | "kpi_vulnerability"
    | "scenario_hint"
    | "chaos_signal";
  triggerSourceId?: string | null;
  triggerMetric?: number;
  domainHintIds?: string[];
  notes?: string[];
}

export interface NexoraAutonomousScenarioVariant {
  id: string;
  label: string;
  baseCandidateId?: string | null;
  domainId?: string | null;
  scenario: any;
  rationale?: string;
  tags?: string[];
}

export interface NexoraExplorationScore {
  scenarioId: string;
  riskScore?: number;
  instabilityScore?: number;
  kpiImpactScore?: number;
  opportunityScore?: number;
  overallScore?: number;
  dominantDriver?: "risk" | "instability" | "kpi" | "opportunity" | "balanced";
  notes?: string[];
}

export interface NexoraRankedScenario {
  scenarioId: string;
  label: string;
  rank: number;
  goal: NexoraExplorationGoal;
  baseCandidateId?: string | null;
  overallScore: number;
  whyGenerated: string;
  triggerType?: NexoraExplorationCandidate["triggerType"];
  triggerSourceId?: string | null;
  scoreDrivers: Array<{ id: string; label: string; value: number }>;
  mostAffectedObjectId?: string | null;
  mostAffectedKpiId?: string | null;
  comparisonSummary?: string;
  notes?: string[];
}

export interface NexoraExplorationOutputs {
  cockpit: {
    topScenarioIds: string[];
    rankedScenarios: NexoraRankedScenario[];
    summary: string;
  };
  executive: {
    headline: string;
    keySignals: string[];
    recommendations: string[];
  };
  decisionStory: {
    futureStatement: string;
    decisionFocus: string;
  };
  scannerFollowUp: {
    focusObjectIds: string[];
    focusRelationIds: string[];
    focusLoopIds: string[];
    focusKpiIds: string[];
    notes: string[];
  };
}

export interface NexoraAutonomousExplorationResult {
  goal: NexoraExplorationGoal;
  candidates: NexoraExplorationCandidate[];
  scenarios: NexoraAutonomousScenarioVariant[];
  baselineOutcome: NexoraScenarioOutcome;
  outcomes: any[];
  comparisons: NexoraOutcomeComparisonResult[];
  scores: NexoraExplorationScore[];
  topScenarioIds: string[];
  rankedScenarios: NexoraRankedScenario[];
  outputs: NexoraExplorationOutputs;
  summary?: string;
  notes?: string[];
}

type FragilityScanLike = {
  fragilityScore?: number;
  scenarioExplorationHints?: {
    fragileObjectIds?: string[];
    fragileLoopIds?: string[];
    bottleneckRelationIds?: string[];
    vulnerableKpiIds?: string[];
  };
};

function normalizeText(value: string): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function uniq(values: string[]): string[] {
  return Array.from(
    new Set(values.map((value) => normalizeText(String(value ?? ""))).filter(Boolean))
  );
}

function safeNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function severityScore(value?: string | null): number {
  switch (normalizeText(String(value ?? "")).toLowerCase()) {
    case "critical":
      return 1;
    case "high":
      return 0.75;
    case "moderate":
      return 0.5;
    case "low":
      return 0.25;
    default:
      return 0;
  }
}

function sortById<T extends { id?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) =>
    normalizeText(String(a.id ?? "")).localeCompare(normalizeText(String(b.id ?? "")))
  );
}

function buildBaselineOutcome(runtimeModel: any): NexoraScenarioOutcome {
  return {
    scenarioId: "baseline",
    label: "Baseline",
    domainId: runtimeModel?.domainId ?? null,
    objectImpacts: [],
    kpiImpacts: [],
    steps: [],
    snapshots: [
      {
        stepIndex: 0,
        objectStates: buildBaselineObjectStateMap(runtimeModel),
        relationStates: buildBaselineRelationStateMap(runtimeModel),
        loopStates: buildBaselineLoopStateMap(runtimeModel),
        kpiStates: buildBaselineKpiStateMap(runtimeModel),
      },
    ],
    overallRisk: "low",
    summary: "Baseline state before autonomous exploration scenarios.",
    notes: ["Baseline snapshot generated for deterministic exploration comparison."],
  };
}

function normalizeRuntimeContext(runtimeContext?: any): any {
  return {
    chaosLevel: safeNumber(runtimeContext?.chaosLevel, 0.2),
    systemVolatility: safeNumber(runtimeContext?.systemVolatility, 0.3),
    activeScenarioIds: Array.isArray(runtimeContext?.activeScenarioIds)
      ? uniq(runtimeContext.activeScenarioIds.map((value: unknown) => String(value)))
      : [],
    metadata:
      runtimeContext?.metadata && typeof runtimeContext.metadata === "object" && !Array.isArray(runtimeContext.metadata)
        ? { ...runtimeContext.metadata }
        : {},
  };
}

function normalizeRuntimeModel(runtimeModel?: any): any {
  return {
    domainId:
      runtimeModel?.domainId === null || runtimeModel?.domainId === undefined
        ? null
        : normalizeText(String(runtimeModel.domainId)),
    objects: Array.isArray(runtimeModel?.objects)
      ? runtimeModel.objects.map((object: any) => ({
          id: normalizeText(object?.id ?? ""),
          label: normalizeText(object?.label ?? object?.id ?? ""),
          coreRole:
            object?.coreRole === null || object?.coreRole === undefined
              ? null
              : normalizeText(String(object.coreRole)),
          activityLevel: safeNumber(object?.activityLevel, 0.5),
          riskLevel: safeNumber(object?.riskLevel, 0.2),
          stabilityLevel: safeNumber(object?.stabilityLevel, 0.8),
          tags: Array.isArray(object?.tags)
            ? uniq(object.tags.map((value: unknown) => String(value)))
            : [],
        }))
      : [],
    relations: Array.isArray(runtimeModel?.relations)
      ? runtimeModel.relations.map((relation: any) => ({
          id: normalizeText(relation?.id ?? ""),
          from: normalizeText(relation?.from ?? ""),
          to: normalizeText(relation?.to ?? ""),
          relationType:
            relation?.relationType === null || relation?.relationType === undefined
              ? null
              : normalizeText(String(relation.relationType)),
          strength: safeNumber(relation?.strength, 0.6),
          volatility: safeNumber(relation?.volatility, 0.3),
          tags: Array.isArray(relation?.tags)
            ? uniq(relation.tags.map((value: unknown) => String(value)))
            : [],
        }))
      : [],
    loops: Array.isArray(runtimeModel?.loops)
      ? runtimeModel.loops.map((loop: any) => ({
          id: normalizeText(loop?.id ?? ""),
          label: normalizeText(loop?.label ?? loop?.id ?? ""),
          loopType:
            loop?.loopType === null || loop?.loopType === undefined
              ? null
              : normalizeText(String(loop.loopType)),
          intensity: safeNumber(loop?.intensity, 0.5),
          stability: safeNumber(loop?.stability, 0.7),
          nodes: Array.isArray(loop?.nodes)
            ? uniq(loop.nodes.map((value: unknown) => String(value)))
            : [],
          tags: Array.isArray(loop?.tags)
            ? uniq(loop.tags.map((value: unknown) => String(value)))
            : [],
        }))
      : [],
    scenarios: Array.isArray(runtimeModel?.scenarios)
      ? runtimeModel.scenarios.map((scenario: any) => ({
          id: normalizeText(scenario?.id ?? ""),
          label: normalizeText(scenario?.label ?? scenario?.id ?? ""),
          severity: normalizeText(scenario?.severity ?? ""),
          tags: Array.isArray(scenario?.tags)
            ? uniq(scenario.tags.map((value: unknown) => String(value)))
            : [],
        }))
      : [],
    kpis: Array.isArray(runtimeModel?.kpis)
      ? runtimeModel.kpis.map((kpi: any) => ({
          id: normalizeText(kpi?.id ?? ""),
          label: normalizeText(kpi?.label ?? kpi?.id ?? ""),
          value: safeNumber(kpi?.value, 0.5),
          trend: normalizeText(kpi?.trend ?? "stable"),
        }))
      : [],
    tags: Array.isArray(runtimeModel?.tags)
      ? uniq(runtimeModel.tags.map((value: unknown) => String(value)))
      : [],
  };
}

function chooseEventTypeForStrategy(
  strategy: NexoraExplorationStrategy,
  goal?: NexoraExplorationGoal
): "shock" | "pressure" | "failure" | "recovery" | "stabilization" | "intervention" | "trend_shift" {
  if (goal === "find_stability") {
    return strategy === "loop_amplification" ? "stabilization" : "recovery";
  }
  if (goal === "find_opportunity") {
    return strategy === "kpi_stress" || strategy === "opportunity_uplift" ? "trend_shift" : "intervention";
  }
  switch (strategy) {
    case "single_object_perturbation":
      return "shock";
    case "multi_object_pressure":
      return "pressure";
    case "loop_amplification":
      return "pressure";
    case "constraint_stress":
      return "failure";
    case "kpi_stress":
      return "trend_shift";
    case "stabilization_intervention":
      return "stabilization";
    case "opportunity_uplift":
      return "intervention";
    case "mixed":
    default:
      return "pressure";
  }
}

function chooseTargetTypeForStrategy(
  candidate: NexoraExplorationCandidate
): "object" | "relation" | "loop" | "kpi" | "system" {
  if ((candidate.targetLoopIds ?? []).length > 0 && candidate.strategy === "loop_amplification") {
    return "loop";
  }
  if ((candidate.targetKpiIds ?? []).length > 0 && candidate.strategy === "kpi_stress") {
    return "kpi";
  }
  if ((candidate.targetRelationIds ?? []).length > 0 && candidate.strategy === "constraint_stress") {
    return "relation";
  }
  if ((candidate.targetObjectIds ?? []).length > 0) {
    return "object";
  }
  return "system";
}

function choosePrimaryTargetId(candidate: NexoraExplorationCandidate): string | null {
  return (
    candidate.targetObjectIds?.[0] ??
    candidate.targetRelationIds?.[0] ??
    candidate.targetLoopIds?.[0] ??
    candidate.targetKpiIds?.[0] ??
    null
  );
}

function candidateIntensityForGoal(goal: NexoraExplorationGoal, runtimeContext?: any): number {
  const chaosBoost = safeNumber(runtimeContext?.chaosLevel, 0.2) * 0.1;
  const volatilityBoost = safeNumber(runtimeContext?.systemVolatility, 0.3) * 0.08;
  switch (goal) {
    case "find_fragility":
    case "find_pressure_points":
      return clampExplorationScore(0.62 + chaosBoost + volatilityBoost);
    case "find_stability":
      return clampExplorationScore(0.52 + volatilityBoost * 0.5);
    case "find_opportunity":
      return clampExplorationScore(0.48 + chaosBoost * 0.3);
    default:
      return clampExplorationScore(0.56 + chaosBoost * 0.5 + volatilityBoost * 0.5);
  }
}

function candidateWeightForGoal(goal: NexoraExplorationGoal): number {
  switch (goal) {
    case "find_stability":
      return 0.42;
    case "find_opportunity":
      return 0.46;
    case "compare_alternatives":
      return 0.5;
    default:
      return 0.56;
  }
}

export function clampExplorationScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

export function averageExplorationScores(values: number[]): number {
  const valid = (Array.isArray(values) ? values : [])
    .map((value) => clampExplorationScore(Number(value)))
    .filter((value) => Number.isFinite(value));
  if (valid.length === 0) return 0;
  return clampExplorationScore(
    valid.reduce((sum, value) => sum + value, 0) / valid.length
  );
}

export function generateExplorationCandidates(
  args: {
    runtimeModel?: any;
    runtimeContext?: any;
    fragilityScan?: FragilityScanLike | null;
    goal?: NexoraExplorationGoal;
  }
): NexoraExplorationCandidate[] {
  const runtimeModel = normalizeRuntimeModel(args.runtimeModel);
  const runtimeContext = normalizeRuntimeContext(args.runtimeContext);
  const goal = args.goal ?? "general";
  const candidates: NexoraExplorationCandidate[] = [];
  const maxCandidates = 6;

  const sortedObjects = [...runtimeModel.objects].sort((a, b) => {
    const scoreA = a.riskLevel + (1 - a.stabilityLevel);
    const scoreB = b.riskLevel + (1 - b.stabilityLevel);
    return scoreB - scoreA || a.id.localeCompare(b.id);
  });
  const sortedRelations = [...runtimeModel.relations].sort((a, b) => {
    const scoreA = a.volatility + (1 - a.strength);
    const scoreB = b.volatility + (1 - b.strength);
    return scoreB - scoreA || a.id.localeCompare(b.id);
  });
  const sortedLoops = [...runtimeModel.loops].sort((a, b) => {
    const scoreA = a.intensity + (1 - a.stability);
    const scoreB = b.intensity + (1 - b.stability);
    return scoreB - scoreA || a.id.localeCompare(b.id);
  });
  const sortedKpis = [...runtimeModel.kpis].sort((a, b) => {
    const scoreA = 1 - a.value;
    const scoreB = 1 - b.value;
    return scoreB - scoreA || a.id.localeCompare(b.id);
  });
  const sortedStabilizers = [...runtimeModel.objects].sort((a, b) => {
    const scoreA = a.riskLevel * 0.55 + (1 - a.stabilityLevel) * 0.45;
    const scoreB = b.riskLevel * 0.55 + (1 - b.stabilityLevel) * 0.45;
    return scoreB - scoreA || a.id.localeCompare(b.id);
  });
  const scenarioHints = [...runtimeModel.scenarios].sort((a, b) => {
    const scoreA = severityScore(a.severity) + (a.tags.includes(goal) ? 0.15 : 0);
    const scoreB = severityScore(b.severity) + (b.tags.includes(goal) ? 0.15 : 0);
    return scoreB - scoreA || a.id.localeCompare(b.id);
  });
  const fragilityHints = args.fragilityScan?.scenarioExplorationHints ?? {};
  const hintedObjectIds = safeList(fragilityHints.fragileObjectIds);
  const hintedLoopIds = safeList(fragilityHints.fragileLoopIds);
  const hintedRelationIds = safeList(fragilityHints.bottleneckRelationIds);
  const hintedKpiIds = safeList(fragilityHints.vulnerableKpiIds);
  const hintedObject = sortedObjects.find((object) => hintedObjectIds.includes(object.id)) ?? sortedObjects[0];
  const hintedLoop = sortedLoops.find((loop) => hintedLoopIds.includes(loop.id)) ?? sortedLoops[0];
  const hintedRelation = sortedRelations.find((relation) => hintedRelationIds.includes(relation.id)) ?? sortedRelations[0];
  const hintedKpi = sortedKpis.find((kpi) => hintedKpiIds.includes(kpi.id)) ?? sortedKpis[0];

  const pushCandidate = (candidate: NexoraExplorationCandidate | null) => {
    if (!candidate) return;
    if (candidates.some((existing) => existing.id === candidate.id)) return;
    if (candidates.length >= maxCandidates) return;
    candidates.push(candidate);
  };

  if (hintedObject && goal !== "find_stability" && goal !== "find_opportunity") {
    pushCandidate({
      id: `candidate_object_${hintedObject.id}`,
      label: `Perturb ${hintedObject.label || hintedObject.id}`,
      strategy: "single_object_perturbation",
      goal,
      targetObjectIds: [hintedObject.id],
      triggerType: hintedObject.riskLevel >= 1 - hintedObject.stabilityLevel ? "object_risk" : "object_instability",
      triggerSourceId: hintedObject.id,
      triggerMetric: clampExplorationScore(hintedObject.riskLevel + (1 - hintedObject.stabilityLevel)),
      domainHintIds: hintedObject.tags,
      notes: [
        hintedObjectIds.includes(hintedObject.id)
          ? "Derived from platform fragility scanner object hotspot."
          : "Derived from highest combined risk and instability object.",
      ],
    });
  }

  if (sortedObjects.length > 1 && goal !== "find_stability") {
    pushCandidate({
      id: `candidate_pressure_${sortedObjects[0].id}_${sortedObjects[1].id}`,
      label: `Pressure ${sortedObjects[0].label || sortedObjects[0].id} and ${sortedObjects[1].label || sortedObjects[1].id}`,
      strategy: "multi_object_pressure",
      goal,
      targetObjectIds: [sortedObjects[0].id, sortedObjects[1].id],
      triggerType: "object_risk",
      triggerSourceId: `${sortedObjects[0].id},${sortedObjects[1].id}`,
      triggerMetric: clampExplorationScore(
        averageExplorationScores([
          sortedObjects[0].riskLevel + (1 - sortedObjects[0].stabilityLevel),
          sortedObjects[1].riskLevel + (1 - sortedObjects[1].stabilityLevel),
        ])
      ),
      notes: ["Derived from top two exposed objects."],
    });
  }

  if (hintedLoop) {
    pushCandidate({
      id: `candidate_loop_${hintedLoop.id}`,
      label:
        goal === "find_stability" || goal === "find_opportunity"
          ? `Stabilize ${hintedLoop.label || hintedLoop.id}`
          : `Amplify ${hintedLoop.label || hintedLoop.id}`,
      strategy: goal === "find_stability" ? "stabilization_intervention" : "loop_amplification",
      goal,
      targetLoopIds: [hintedLoop.id],
      targetObjectIds: hintedLoop.nodes.slice(0, 3),
      triggerType: "loop_pressure",
      triggerSourceId: hintedLoop.id,
      triggerMetric: clampExplorationScore(hintedLoop.intensity + (1 - hintedLoop.stability)),
      domainHintIds: hintedLoop.tags,
      notes: [
        hintedLoopIds.includes(hintedLoop.id)
          ? "Derived from platform fragility scanner loop hotspot."
          : "Derived from most intense loop.",
      ],
    });
  }

  if (hintedRelation) {
    pushCandidate({
      id: `candidate_relation_${hintedRelation.id}`,
      label:
        goal === "find_stability"
          ? `Stabilize ${hintedRelation.id}`
          : `Stress ${hintedRelation.id}`,
      strategy: goal === "find_stability" ? "stabilization_intervention" : "constraint_stress",
      goal,
      targetRelationIds: [hintedRelation.id],
      targetObjectIds: uniq([hintedRelation.from, hintedRelation.to]),
      triggerType: "relation_bottleneck",
      triggerSourceId: hintedRelation.id,
      triggerMetric: clampExplorationScore(hintedRelation.volatility + (1 - hintedRelation.strength)),
      domainHintIds: hintedRelation.tags,
      notes: [
        hintedRelationIds.includes(hintedRelation.id)
          ? "Derived from platform fragility scanner bottleneck relation."
          : "Derived from most volatile relation.",
      ],
    });
  }

  if (hintedKpi) {
    pushCandidate({
      id: `candidate_kpi_${hintedKpi.id}`,
      label:
        goal === "find_opportunity"
          ? `Lift ${hintedKpi.label || hintedKpi.id}`
          : goal === "find_stability"
            ? `Recover ${hintedKpi.label || hintedKpi.id}`
            : `Stress ${hintedKpi.label || hintedKpi.id}`,
      strategy:
        goal === "find_opportunity"
          ? "opportunity_uplift"
          : goal === "find_stability"
            ? "stabilization_intervention"
            : "kpi_stress",
      goal,
      targetKpiIds: [hintedKpi.id],
      triggerType: "kpi_vulnerability",
      triggerSourceId: hintedKpi.id,
      triggerMetric: clampExplorationScore(1 - hintedKpi.value),
      notes: [
        hintedKpiIds.includes(hintedKpi.id)
          ? "Derived from platform fragility scanner vulnerable KPI hint."
          : "Derived from lowest-value KPI.",
      ],
    });
  }

  if (sortedStabilizers[0] && (goal === "find_stability" || goal === "find_opportunity")) {
    pushCandidate({
      id: `candidate_recovery_${sortedStabilizers[0].id}`,
      label:
        goal === "find_opportunity"
          ? `Unlock ${sortedStabilizers[0].label || sortedStabilizers[0].id}`
          : `Recover ${sortedStabilizers[0].label || sortedStabilizers[0].id}`,
      strategy: goal === "find_opportunity" ? "opportunity_uplift" : "stabilization_intervention",
      goal,
      targetObjectIds: [sortedStabilizers[0].id],
      triggerType: "object_instability",
      triggerSourceId: sortedStabilizers[0].id,
      triggerMetric: clampExplorationScore(
        (1 - sortedStabilizers[0].stabilityLevel) * 0.6 + sortedStabilizers[0].riskLevel * 0.4
      ),
      domainHintIds: sortedStabilizers[0].tags,
      notes: ["Derived from the runtime object most in need of stabilization."],
    });
  }

  if (goal === "find_opportunity") {
    pushCandidate({
      id: "candidate_mixed_opportunity",
      label: "Mixed stabilization and uplift",
      strategy: "mixed",
      goal,
      targetObjectIds: sortedObjects.slice(0, 2).map((object) => object.id),
      targetKpiIds: sortedKpis.slice(0, 1).map((kpi) => kpi.id),
      triggerType: "scenario_hint",
      triggerSourceId: scenarioHints[0]?.id ?? null,
      triggerMetric: clampExplorationScore(
        averageExplorationScores([
          severityScore(scenarioHints[0]?.severity),
          1 - safeNumber(sortedKpis[0]?.value, 0.5),
          safeNumber(runtimeContext.chaosLevel, 0.2),
        ])
      ),
      domainHintIds: uniq([
        ...(scenarioHints[0]?.tags ?? []),
        ...(runtimeModel.tags ?? []),
      ]),
      notes: ["Explores a balanced upside-oriented what-if."],
    });
  }

  if ((goal === "compare_alternatives" || goal === "general") && scenarioHints[0]) {
    pushCandidate({
      id: `candidate_hint_${scenarioHints[0].id}`,
      label: `Compare ${scenarioHints[0].label || scenarioHints[0].id}`,
      strategy: "mixed",
      goal,
      targetObjectIds: sortedObjects.slice(0, 2).map((object) => object.id),
      targetKpiIds: sortedKpis.slice(0, 1).map((kpi) => kpi.id),
      triggerType: "scenario_hint",
      triggerSourceId: scenarioHints[0].id,
      triggerMetric: clampExplorationScore(severityScore(scenarioHints[0].severity)),
      domainHintIds: uniq([...(scenarioHints[0].tags ?? []), ...(runtimeModel.tags ?? [])]),
      notes: ["Derived from the strongest runtime scenario hint."],
    });
  }

  if ((runtimeContext.chaosLevel >= 0.45 || runtimeContext.systemVolatility >= 0.5) && sortedObjects[0]) {
    pushCandidate({
      id: `candidate_chaos_${sortedObjects[0].id}`,
      label: `Test shock absorption around ${sortedObjects[0].label || sortedObjects[0].id}`,
      strategy: goal === "find_stability" ? "stabilization_intervention" : "single_object_perturbation",
      goal,
      targetObjectIds: [sortedObjects[0].id],
      triggerType: "chaos_signal",
      triggerSourceId: sortedObjects[0].id,
      triggerMetric: clampExplorationScore(
        averageExplorationScores([runtimeContext.chaosLevel, runtimeContext.systemVolatility])
      ),
      domainHintIds: uniq([...(sortedObjects[0].tags ?? []), "chaos_aligned"]),
      notes: ["Derived from runtime chaos and volatility context."],
    });
  }

  return sortById(candidates);
}

export function buildScenarioVariantsFromCandidates(
  args: {
    candidates: NexoraExplorationCandidate[];
    domainId?: string | null;
    runtimeContext?: any;
  }
): NexoraAutonomousScenarioVariant[] {
  return sortById(args.candidates ?? []).map((candidate, index) => {
    const eventType = chooseEventTypeForStrategy(candidate.strategy, candidate.goal);
    const targetType = chooseTargetTypeForStrategy(candidate);
    const targetId = choosePrimaryTargetId(candidate);
    const intensity = candidateIntensityForGoal(candidate.goal ?? "general", args.runtimeContext);
    const weight = candidateWeightForGoal(candidate.goal ?? "general");
    const direction =
      candidate.goal === "find_stability"
        ? "decrease"
        : candidate.goal === "find_opportunity"
          ? "increase"
          : "increase";

    const scenario: NexoraScenarioDefinition = {
      id: `auto_scenario_${index + 1}_${candidate.id}`,
      label: candidate.label,
      domainId: args.domainId ?? null,
      severity:
        candidate.goal === "find_fragility" || candidate.goal === "find_pressure_points"
          ? "high"
          : candidate.goal === "find_opportunity"
            ? "moderate"
            : "moderate",
      tags: uniq([
        candidate.strategy,
        candidate.goal ?? "general",
        ...(candidate.targetObjectIds ?? []),
        ...(candidate.targetLoopIds ?? []),
        ...(candidate.targetKpiIds ?? []),
      ]),
      metadata: {
        source: "autonomous_exploration",
        baseCandidateId: candidate.id,
        triggerType: candidate.triggerType,
        triggerSourceId: candidate.triggerSourceId ?? null,
        triggerMetric: candidate.triggerMetric ?? null,
      },
      events: [
        {
          id: `${candidate.id}_event_primary`,
          label: `${candidate.label} primary event`,
          type: eventType,
          targetType,
          targetId,
          intensity,
          weight,
          direction: direction as "increase" | "decrease",
          tags: uniq([candidate.strategy, candidate.goal ?? "general"]),
          metadata: {
            source: "candidate_translation",
            whyGenerated: candidate.notes?.[0] ?? "",
          },
        },
        ...(candidate.strategy === "multi_object_pressure" &&
        (candidate.targetObjectIds ?? []).length > 1
          ? [
              {
                id: `${candidate.id}_event_secondary`,
                label: `${candidate.label} secondary pressure`,
                type: "pressure" as const,
                targetType: "object" as const,
                targetId: candidate.targetObjectIds?.[1] ?? null,
                intensity: 0.55,
                weight: 0.45,
                direction: "increase" as const,
                tags: uniq(["secondary", candidate.strategy]),
                metadata: {
                  source: "candidate_translation",
                },
              },
            ]
          : []),
      ],
    };

    return {
      id: scenario.id,
      label: scenario.label,
      baseCandidateId: candidate.id,
      domainId: args.domainId ?? null,
      scenario,
      rationale:
        candidate.notes?.[0] ??
        `Generated from ${candidate.triggerType ?? "runtime"} signal ${candidate.triggerSourceId ?? "system"}.`,
      tags: uniq([
        ...(Array.isArray(scenario.tags) ? scenario.tags : []),
        ...(candidate.domainHintIds ?? []),
      ]),
    };
  });
}

export function evaluateAutonomousScenarioOutcomes(
  args: {
    runtimeModel?: any;
    scenarios: NexoraAutonomousScenarioVariant[];
  }
): any[] {
  const runtimeModel = normalizeRuntimeModel(args.runtimeModel);
  return (args.scenarios ?? []).map((variant) =>
    runDomainScenarioSimulation({
      runtimeModel,
      scenario: variant.scenario,
    })
  );
}

export function compareAutonomousScenarioOutcomes(args: {
  baselineOutcome: NexoraScenarioOutcome;
  outcomes: NexoraScenarioOutcome[];
}): NexoraOutcomeComparisonResult[] {
  return (args.outcomes ?? []).map((outcome) =>
    compareBaselineToScenario({
      baselineOutcome: args.baselineOutcome,
      scenarioOutcome: outcome,
    })
  );
}

export function scoreScenarioRisk(
  outcome: any
): number {
  const overallRiskScore = severityScore(outcome?.overallRisk ?? null);
  const objectRiskScore = averageExplorationScores(
    (Array.isArray(outcome?.objectImpacts) ? outcome.objectImpacts : []).map((impact: any) =>
      safeNumber(impact?.afterRisk, 0)
    )
  );
  const negativeKpiScore = averageExplorationScores(
    (Array.isArray(outcome?.kpiImpacts) ? outcome.kpiImpacts : []).map((impact: any) =>
      Math.max(0, -safeNumber(impact?.delta, 0))
    )
  );
  return clampExplorationScore(
    overallRiskScore * 0.5 + objectRiskScore * 0.3 + negativeKpiScore * 0.2
  );
}

export function scoreScenarioInstability(
  outcome: any
): number {
  const changedObjects = (Array.isArray(outcome?.objectImpacts) ? outcome.objectImpacts : []).filter(
    (impact: any) =>
      Math.abs(safeNumber(impact?.afterRisk, 0) - safeNumber(impact?.beforeRisk, 0)) > 0.1 ||
      Math.abs(safeNumber(impact?.afterStability, 0) - safeNumber(impact?.beforeStability, 0)) > 0.1
  );
  const instabilitySpread = changedObjects.length / Math.max(1, (outcome?.objectImpacts ?? []).length || 1);
  const instabilityDepth = averageExplorationScores(
    changedObjects.map((impact: any) =>
      Math.abs(safeNumber(impact?.afterStability, 0) - safeNumber(impact?.beforeStability, 0))
    )
  );
  return clampExplorationScore(instabilitySpread * 0.55 + instabilityDepth * 0.45);
}

export function scoreScenarioKpiImpact(
  outcome: any
): number {
  const negativeDeltas = (Array.isArray(outcome?.kpiImpacts) ? outcome.kpiImpacts : [])
    .map((impact: any) => Math.max(0, -safeNumber(impact?.delta, 0)));
  return averageExplorationScores(negativeDeltas);
}

export function scoreScenarioOpportunity(
  outcome: any
): number {
  const positiveDeltas = (Array.isArray(outcome?.kpiImpacts) ? outcome.kpiImpacts : [])
    .map((impact: any) => Math.max(0, safeNumber(impact?.delta, 0)));
  const stabilizingObjectScore = averageExplorationScores(
    (Array.isArray(outcome?.objectImpacts) ? outcome.objectImpacts : []).map((impact: any) =>
      Math.max(0, safeNumber(impact?.afterStability, 0) - safeNumber(impact?.beforeStability, 0))
    )
  );
  return clampExplorationScore(
    averageExplorationScores(positiveDeltas) * 0.65 + stabilizingObjectScore * 0.35
  );
}

export function buildExplorationScore(
  args: {
    scenarioId: string;
    outcome: any;
    goal?: NexoraExplorationGoal;
  }
): NexoraExplorationScore {
  const goal = args.goal ?? "general";
  const riskScore = scoreScenarioRisk(args.outcome);
  const instabilityScore = scoreScenarioInstability(args.outcome);
  const kpiImpactScore = scoreScenarioKpiImpact(args.outcome);
  const opportunityScore = scoreScenarioOpportunity(args.outcome);

  let overallScore = 0;
  let dominantDriver: NexoraExplorationScore["dominantDriver"] = "balanced";
  switch (goal) {
    case "find_fragility":
      overallScore = riskScore * 0.4 + instabilityScore * 0.35 + kpiImpactScore * 0.25;
      dominantDriver = riskScore >= instabilityScore ? "risk" : "instability";
      break;
    case "find_stability":
      overallScore =
        (1 - instabilityScore) * 0.45 +
        (1 - riskScore) * 0.35 +
        opportunityScore * 0.2;
      dominantDriver = opportunityScore >= riskScore ? "opportunity" : "instability";
      break;
    case "find_opportunity":
      overallScore = opportunityScore * 0.5 + (1 - riskScore) * 0.25 + (1 - instabilityScore) * 0.25;
      dominantDriver = "opportunity";
      break;
    case "find_pressure_points":
      overallScore = riskScore * 0.45 + kpiImpactScore * 0.35 + instabilityScore * 0.2;
      dominantDriver = kpiImpactScore >= riskScore ? "kpi" : "risk";
      break;
    case "compare_alternatives":
      overallScore =
        riskScore * 0.25 +
        instabilityScore * 0.25 +
        kpiImpactScore * 0.25 +
        opportunityScore * 0.25;
      dominantDriver = "balanced";
      break;
    case "general":
    default:
      overallScore =
        riskScore * 0.3 +
        instabilityScore * 0.3 +
        kpiImpactScore * 0.2 +
        opportunityScore * 0.2;
      dominantDriver = riskScore >= opportunityScore ? "risk" : "opportunity";
      break;
  }

  return {
    scenarioId: normalizeText(args.scenarioId),
    riskScore,
    instabilityScore,
    kpiImpactScore,
    opportunityScore,
    overallScore: clampExplorationScore(overallScore),
    dominantDriver,
    notes: [`Scored for goal: ${goal}.`],
  };
}

function findMostAffectedObjectId(outcome: any): string | null {
  return (
    [...(Array.isArray(outcome?.objectImpacts) ? outcome.objectImpacts : [])]
      .sort((a: any, b: any) => {
        const scoreA =
          Math.abs(safeNumber(a?.afterRisk, 0) - safeNumber(a?.beforeRisk, 0)) +
          Math.abs(safeNumber(a?.afterStability, 0) - safeNumber(a?.beforeStability, 0));
        const scoreB =
          Math.abs(safeNumber(b?.afterRisk, 0) - safeNumber(b?.beforeRisk, 0)) +
          Math.abs(safeNumber(b?.afterStability, 0) - safeNumber(b?.beforeStability, 0));
        return scoreB - scoreA || String(a?.objectId ?? "").localeCompare(String(b?.objectId ?? ""));
      })[0]?.objectId ?? null
  );
}

function findMostAffectedKpiId(outcome: any): string | null {
  return (
    [...(Array.isArray(outcome?.kpiImpacts) ? outcome.kpiImpacts : [])]
      .sort((a: any, b: any) => {
        const scoreA = Math.abs(safeNumber(a?.delta, 0));
        const scoreB = Math.abs(safeNumber(b?.delta, 0));
        return scoreB - scoreA || String(a?.id ?? "").localeCompare(String(b?.id ?? ""));
      })[0]?.id ?? null
  );
}

function buildScoreDrivers(score: NexoraExplorationScore): Array<{ id: string; label: string; value: number }> {
  return [
    { id: "risk", label: "Risk", value: clampExplorationScore(safeNumber(score.riskScore, 0)) },
    { id: "instability", label: "Instability", value: clampExplorationScore(safeNumber(score.instabilityScore, 0)) },
    { id: "kpi", label: "KPI Stress", value: clampExplorationScore(safeNumber(score.kpiImpactScore, 0)) },
    { id: "opportunity", label: "Opportunity", value: clampExplorationScore(safeNumber(score.opportunityScore, 0)) },
  ].sort((a, b) => b.value - a.value || a.id.localeCompare(b.id));
}

export function buildRankedScenarios(args: {
  goal: NexoraExplorationGoal;
  candidates: NexoraExplorationCandidate[];
  scenarios: NexoraAutonomousScenarioVariant[];
  outcomes: NexoraScenarioOutcome[];
  comparisons: NexoraOutcomeComparisonResult[];
  scores: NexoraExplorationScore[];
  limit?: number;
}): NexoraRankedScenario[] {
  const candidatesById = new Map((args.candidates ?? []).map((candidate) => [candidate.id, candidate]));
  const scenarioById = new Map((args.scenarios ?? []).map((scenario) => [scenario.id, scenario]));
  const outcomeById = new Map((args.outcomes ?? []).map((outcome) => [String(outcome?.scenarioId ?? ""), outcome]));
  const comparisonById = new Map((args.comparisons ?? []).map((comparison) => [String(comparison?.rightScenarioId ?? ""), comparison]));

  return [...(args.scores ?? [])]
    .sort((a, b) => {
      const scoreDelta = safeNumber(b.overallScore, 0) - safeNumber(a.overallScore, 0);
      if (scoreDelta !== 0) return scoreDelta;
      return a.scenarioId.localeCompare(b.scenarioId);
    })
    .slice(0, Math.max(1, Math.floor(safeNumber(args.limit, 3))))
    .map((score, index) => {
      const scenario = scenarioById.get(score.scenarioId);
      const candidate = scenario?.baseCandidateId ? candidatesById.get(scenario.baseCandidateId) : undefined;
      const outcome = outcomeById.get(score.scenarioId);
      const comparison = comparisonById.get(score.scenarioId);
      return {
        scenarioId: score.scenarioId,
        label: scenario?.label ?? score.scenarioId,
        rank: index + 1,
        goal: args.goal,
        baseCandidateId: scenario?.baseCandidateId ?? null,
        overallScore: clampExplorationScore(safeNumber(score.overallScore, 0)),
        whyGenerated:
          scenario?.rationale ??
          candidate?.notes?.[0] ??
          "Generated from deterministic runtime exploration logic.",
        triggerType: candidate?.triggerType,
        triggerSourceId: candidate?.triggerSourceId ?? null,
        scoreDrivers: buildScoreDrivers(score).slice(0, 3),
        mostAffectedObjectId: findMostAffectedObjectId(outcome),
        mostAffectedKpiId: findMostAffectedKpiId(outcome),
        comparisonSummary: comparison?.summary,
        notes: uniq([
          ...(candidate?.notes ?? []),
          ...(score.notes ?? []),
          ...(comparison?.notes ?? []),
        ]),
      };
    });
}

export function rankTopScenarioIds(
  scores: NexoraExplorationScore[],
  limit = 3
): string[] {
  const safeLimit = Math.max(0, Math.floor(safeNumber(limit, 3)));
  return [...(scores ?? [])]
    .sort((a, b) => {
      const scoreDelta = safeNumber(b.overallScore, 0) - safeNumber(a.overallScore, 0);
      if (scoreDelta !== 0) return scoreDelta;
      return a.scenarioId.localeCompare(b.scenarioId);
    })
    .slice(0, safeLimit)
    .map((score) => score.scenarioId);
}

export function buildAutonomousExplorationSummary(
  args: {
    goal: NexoraExplorationGoal;
    rankedScenarios: NexoraRankedScenario[];
  }
): string {
  const topScenario = args.rankedScenarios[0];
  if (!topScenario) {
    return `Autonomous exploration for ${args.goal} found no ranked scenarios.`;
  }
  const focusText =
    args.goal === "find_opportunity" || args.goal === "find_stability"
      ? "best stabilizing path"
      : "most exposed path";
  return `Autonomous exploration for ${args.goal} ranked ${args.rankedScenarios.length} scenario variant(s); ${focusText}: ${topScenario.label} (${topScenario.overallScore.toFixed(2)}).`;
}

export function buildExplorationOutputs(args: {
  goal: NexoraExplorationGoal;
  rankedScenarios: NexoraRankedScenario[];
  summary: string;
  candidates: NexoraExplorationCandidate[];
}): NexoraExplorationOutputs {
  const top = args.rankedScenarios[0];
  const focusObjectIds = uniq(args.rankedScenarios.flatMap((scenario) => (scenario.mostAffectedObjectId ? [scenario.mostAffectedObjectId] : [])));
  const focusKpiIds = uniq(args.rankedScenarios.flatMap((scenario) => (scenario.mostAffectedKpiId ? [scenario.mostAffectedKpiId] : [])));
  const candidateMap = new Map((args.candidates ?? []).map((candidate) => [candidate.id, candidate]));
  const focusRelationIds = uniq(
    args.rankedScenarios.flatMap((scenario) => {
      const candidate = scenario.baseCandidateId ? candidateMap.get(scenario.baseCandidateId) : undefined;
      return candidate?.targetRelationIds ?? [];
    })
  );
  const focusLoopIds = uniq(
    args.rankedScenarios.flatMap((scenario) => {
      const candidate = scenario.baseCandidateId ? candidateMap.get(scenario.baseCandidateId) : undefined;
      return candidate?.targetLoopIds ?? [];
    })
  );

  return {
    cockpit: {
      topScenarioIds: args.rankedScenarios.map((scenario) => scenario.scenarioId),
      rankedScenarios: args.rankedScenarios,
      summary: args.summary,
    },
    executive: {
      headline: top
        ? `${top.label} is the leading ${args.goal.replace(/_/g, " ")} scenario.`
        : "No leading exploration scenario was identified.",
      keySignals: args.rankedScenarios.slice(0, 3).map((scenario) => {
        const driver = scenario.scoreDrivers[0];
        return driver
          ? `${scenario.label} ranks #${scenario.rank} because ${driver.label.toLowerCase()} scored ${driver.value.toFixed(2)}.`
          : `${scenario.label} ranks #${scenario.rank}.`;
      }),
      recommendations: args.rankedScenarios.slice(0, 3).map((scenario) => {
        const target = scenario.mostAffectedObjectId ?? scenario.mostAffectedKpiId ?? scenario.triggerSourceId ?? "the leading driver";
        if (args.goal === "find_opportunity" || args.goal === "find_stability") {
          return `Test the stabilizing intervention around ${target}.`;
        }
        return `Stress-test and monitor ${target} before the path intensifies.`;
      }),
    },
    decisionStory: {
      futureStatement: top?.comparisonSummary
        ? top.comparisonSummary
        : top
          ? `If the current runtime posture holds, ${top.label} is the most plausible ${args.goal.replace(/_/g, " ")} path.`
          : "The explored futures remain inconclusive.",
      decisionFocus: top
        ? `Decision focus: act on ${top.mostAffectedObjectId ?? top.mostAffectedKpiId ?? top.triggerSourceId ?? top.label}.`
        : "Decision focus: gather additional runtime signals.",
    },
    scannerFollowUp: {
      focusObjectIds,
      focusRelationIds,
      focusLoopIds,
      focusKpiIds,
      notes: args.rankedScenarios.slice(0, 3).map(
        (scenario) => `${scenario.label}: triggered by ${scenario.triggerType ?? "runtime"} signal ${scenario.triggerSourceId ?? "system"}.`
      ),
    },
  };
}

export function runAutonomousScenarioExploration(
  args: {
    runtimeModel?: any;
    runtimeContext?: any;
    fragilityScan?: FragilityScanLike | null;
    goal?: NexoraExplorationGoal;
    domainId?: string | null;
  }
): NexoraAutonomousExplorationResult {
  const goal = args.goal ?? "general";
  const runtimeModel = normalizeRuntimeModel(args.runtimeModel);
  const baselineOutcome = buildBaselineOutcome(runtimeModel);
  const candidates = generateExplorationCandidates({
    runtimeModel,
    runtimeContext: args.runtimeContext,
    fragilityScan: args.fragilityScan,
    goal,
  });
  const scenarios = buildScenarioVariantsFromCandidates({
    candidates,
    domainId: args.domainId ?? runtimeModel.domainId ?? null,
    runtimeContext: args.runtimeContext,
  });
  const outcomes = evaluateAutonomousScenarioOutcomes({
    runtimeModel,
    scenarios,
  });
  const comparisons = compareAutonomousScenarioOutcomes({
    baselineOutcome,
    outcomes,
  });
  const scores = scenarios.map((scenario, index) =>
    buildExplorationScore({
      scenarioId: scenario.id,
      outcome: outcomes[index],
      goal,
    })
  );
  const topScenarioIds = rankTopScenarioIds(scores, 3);
  const rankedScenarios = buildRankedScenarios({
    goal,
    candidates,
    scenarios,
    outcomes,
    comparisons,
    scores,
    limit: 3,
  });
  const summary = buildAutonomousExplorationSummary({
    goal,
    rankedScenarios,
  });
  const outputs = buildExplorationOutputs({
    goal,
    rankedScenarios,
    summary,
    candidates,
  });

  return {
    goal,
    candidates,
    scenarios,
    baselineOutcome,
    outcomes,
    comparisons,
    scores,
    topScenarioIds,
    rankedScenarios,
    outputs,
    summary,
    notes: [
      `Generated ${candidates.length} exploration candidate(s).`,
      `Evaluated ${outcomes.length} scenario variant(s).`,
      ...(args.fragilityScan ? ["Exploration candidate generation incorporated platform fragility scanner hints."] : []),
      "Simulation execution reused the domain scenario simulation engine.",
    ],
  };
}

const BUSINESS_RUNTIME = EXAMPLE_DOMAIN_RUNTIME_INTEGRATIONS.business.runtimeModel;
const FINANCE_RUNTIME = EXAMPLE_DOMAIN_RUNTIME_INTEGRATIONS.finance.runtimeModel;
const DEVOPS_RUNTIME = EXAMPLE_DOMAIN_RUNTIME_INTEGRATIONS.devops.runtimeModel;
const STRATEGY_RUNTIME = EXAMPLE_DOMAIN_RUNTIME_INTEGRATIONS.strategy.runtimeModel;

export const EXAMPLE_AUTONOMOUS_EXPLORATIONS = {
  business: {
    fragility: runAutonomousScenarioExploration({
      runtimeModel: BUSINESS_RUNTIME,
      domainId: "business",
      goal: "find_fragility",
    }),
    opportunity: runAutonomousScenarioExploration({
      runtimeModel: BUSINESS_RUNTIME,
      domainId: "business",
      goal: "find_opportunity",
    }),
    pressure: runAutonomousScenarioExploration({
      runtimeModel: BUSINESS_RUNTIME,
      domainId: "business",
      goal: "find_pressure_points",
    }),
  },
  finance: {
    fragility: runAutonomousScenarioExploration({
      runtimeModel: FINANCE_RUNTIME,
      domainId: "finance",
      goal: "find_fragility",
    }),
    opportunity: runAutonomousScenarioExploration({
      runtimeModel: FINANCE_RUNTIME,
      domainId: "finance",
      goal: "find_opportunity",
    }),
    pressure: runAutonomousScenarioExploration({
      runtimeModel: FINANCE_RUNTIME,
      domainId: "finance",
      goal: "find_pressure_points",
    }),
  },
  devops: {
    fragility: runAutonomousScenarioExploration({
      runtimeModel: DEVOPS_RUNTIME,
      domainId: "devops",
      goal: "find_fragility",
    }),
    opportunity: runAutonomousScenarioExploration({
      runtimeModel: DEVOPS_RUNTIME,
      domainId: "devops",
      goal: "find_opportunity",
    }),
    pressure: runAutonomousScenarioExploration({
      runtimeModel: DEVOPS_RUNTIME,
      domainId: "devops",
      goal: "find_pressure_points",
    }),
  },
  strategy: {
    fragility: runAutonomousScenarioExploration({
      runtimeModel: STRATEGY_RUNTIME,
      domainId: "strategy",
      goal: "find_fragility",
    }),
    opportunity: runAutonomousScenarioExploration({
      runtimeModel: STRATEGY_RUNTIME,
      domainId: "strategy",
      goal: "find_opportunity",
    }),
    pressure: runAutonomousScenarioExploration({
      runtimeModel: STRATEGY_RUNTIME,
      domainId: "strategy",
      goal: "find_pressure_points",
    }),
  },
};
