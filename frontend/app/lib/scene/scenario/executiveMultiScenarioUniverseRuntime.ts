/**
 * E2:96 — Multi-scenario universe runtime: registry, deltas, scoring, spatial selection.
 */

import type { TypeCScenarioComparison } from "../../typec/typeCScenarioComparison";
import type { TypeCScenarioDraft } from "../../typec/typeCScenarioDrafts";
import type { TypeCScenarioSimulation } from "../../typec/typeCScenarioSimulation";
import { mergeTimelineSpatialObjectSelection } from "../timeline/spatialTimeIntelligenceRuntime";
import {
  logE296ComparisonStarted,
  logE296ScenarioDelta,
  logE296ScenarioLoaded,
} from "./executiveMultiScenarioUniverseDiagnostics";
import type {
  BuildExecutiveScenarioUniverseInput,
  ExecutiveScenarioComparisonDashboardRow,
  ExecutiveScenarioLayerDelta,
  ExecutiveScenarioObjectDelta,
  ExecutiveScenarioRanking,
  ExecutiveScenarioRelationshipDelta,
  ExecutiveScenarioStrategicRecommendation,
  ExecutiveScenarioUniverseLayer,
  ExecutiveScenarioUniverseState,
  ScenarioChangeClassification,
  ScenarioComparisonMode,
  ScenarioImpactMagnitude,
  ScenarioUniverseLayoutMode,
  ScenarioUniverseObjectSelection,
} from "./executiveMultiScenarioUniverseTypes";

const BASELINE_ID = "baseline";
const LAYER_COLORS = ["#7aa7c7", "#d4a24f", "#8bc48a", "#c49ad4"];

function riskNumeric(level: "low" | "medium" | "high"): number {
  if (level === "high") return 0.88;
  if (level === "medium") return 0.58;
  return 0.28;
}

function inferCostImpact(input: {
  affectedCount: number;
  pathCount: number;
  riskLevel: "low" | "medium" | "high";
}): "low" | "medium" | "high" {
  if (input.riskLevel === "high" || input.affectedCount >= 4) return "high";
  if (input.riskLevel === "medium" || input.pathCount >= 2) return "medium";
  return "low";
}

function inferOpportunityImpact(title: string, riskLevel: "low" | "medium" | "high"): "low" | "medium" | "high" {
  const lower = title.toLowerCase();
  if (lower.includes("growth") || lower.includes("contract") || lower.includes("opportunity")) {
    return riskLevel === "low" ? "high" : "medium";
  }
  return riskLevel === "low" ? "medium" : "low";
}

function magnitudeFromRisk(riskLevel: "low" | "medium" | "high", affectedCount: number): ScenarioImpactMagnitude {
  if (riskLevel === "high" && affectedCount >= 3) return "critical";
  if (riskLevel === "high" || affectedCount >= 3) return "major";
  if (riskLevel === "medium" || affectedCount >= 2) return "moderate";
  return "minor";
}

function computeOverallScore(input: {
  confidence: number;
  riskScore: number;
  costImpact: "low" | "medium" | "high";
  opportunityImpact: "low" | "medium" | "high";
}): number {
  const costPenalty = input.costImpact === "high" ? 0.22 : input.costImpact === "medium" ? 0.12 : 0.04;
  const opportunityBoost =
    input.opportunityImpact === "high" ? 0.18 : input.opportunityImpact === "medium" ? 0.1 : 0.04;
  const resilience = 1 - input.riskScore * 0.55;
  const score = input.confidence * 0.35 + resilience * 0.35 + opportunityBoost - costPenalty;
  return Math.max(0, Math.min(1, Number(score.toFixed(3))));
}

function buildBaselineSimulation(sceneObjectIds: readonly string[]): TypeCScenarioSimulation {
  return {
    scenarioId: BASELINE_ID,
    affectedObjectIds: [],
    propagationPaths: [],
    riskLevel: "low",
    summary: "Current operational baseline without scenario intervention.",
  };
}

function buildBaselineDraft(): TypeCScenarioDraft {
  return {
    id: BASELINE_ID,
    title: "Current Reality",
    description: "Operational baseline before scenario intervention.",
    trigger: "baseline",
    impact: "none",
    confidence: 1,
    relatedObjectIds: [],
    basedOnConnections: [],
  };
}

function classifyObjectDelta(input: {
  objectId: string;
  inBaseline: boolean;
  inScenario: boolean;
  scenarioRisk: "low" | "medium" | "high";
}): ExecutiveScenarioObjectDelta {
  let classification: ScenarioChangeClassification = "unchanged";
  if (!input.inBaseline && input.inScenario) classification = "added";
  else if (input.inBaseline && !input.inScenario) classification = "removed";
  else if (input.inScenario) classification = input.scenarioRisk === "low" ? "improved" : "degraded";

  return {
    objectId: input.objectId,
    classification,
    magnitude: magnitudeFromRisk(input.scenarioRisk, input.inScenario ? 1 : 0),
    baselineState: input.inBaseline ? "present" : "absent",
    scenarioState: input.inScenario ? input.scenarioRisk : "absent",
  };
}

export function computeScenarioLayerDelta(input: {
  scenarioId: string;
  simulation: TypeCScenarioSimulation;
  baselineAffectedIds: readonly string[];
  baselinePaths: readonly { from: string; to: string }[];
}): ExecutiveScenarioLayerDelta {
  const objectIds = new Set([
    ...input.baselineAffectedIds,
    ...input.simulation.affectedObjectIds,
  ]);
  const objectDeltas: ExecutiveScenarioObjectDelta[] = [...objectIds].map((objectId) =>
    classifyObjectDelta({
      objectId,
      inBaseline: input.baselineAffectedIds.includes(objectId),
      inScenario: input.simulation.affectedObjectIds.includes(objectId),
      scenarioRisk: input.simulation.riskLevel,
    })
  );

  const baselineEdgeKeys = new Set(input.baselinePaths.map((edge) => `${edge.from}->${edge.to}`));
  const relationshipDeltas: ExecutiveScenarioRelationshipDelta[] = input.simulation.propagationPaths.map((path) => ({
    sourceId: path.from,
    targetId: path.to,
    classification: baselineEdgeKeys.has(`${path.from}->${path.to}`) ? "modified" : "added",
    strength: path.intensity,
  }));

  const metricChanges = [
    {
      metricId: "affected_objects",
      label: "Affected Objects",
      delta: input.simulation.affectedObjectIds.length - input.baselineAffectedIds.length,
      direction:
        input.simulation.affectedObjectIds.length > input.baselineAffectedIds.length
          ? ("up" as const)
          : input.simulation.affectedObjectIds.length < input.baselineAffectedIds.length
            ? ("down" as const)
            : ("neutral" as const),
    },
    {
      metricId: "propagation_paths",
      label: "Propagation Paths",
      delta: input.simulation.propagationPaths.length - input.baselinePaths.length,
      direction:
        input.simulation.propagationPaths.length > input.baselinePaths.length
          ? ("up" as const)
          : input.simulation.propagationPaths.length < input.baselinePaths.length
            ? ("down" as const)
            : ("neutral" as const),
    },
  ];

  const delta: ExecutiveScenarioLayerDelta = {
    scenarioId: input.scenarioId,
    objectDeltas,
    relationshipDeltas,
    metricChanges,
    divergenceStepIndex:
      input.simulation.propagationPaths.length > 0 ? Math.max(0, input.simulation.propagationPaths.length - 1) : null,
  };

  logE296ScenarioDelta(`${input.scenarioId}:${objectDeltas.length}:${relationshipDeltas.length}`, {
    scenarioId: input.scenarioId,
    objectDeltaCount: objectDeltas.length,
    relationshipDeltaCount: relationshipDeltas.length,
  });

  return delta;
}

function buildRankings(
  comparison: TypeCScenarioComparison,
  layers: readonly ExecutiveScenarioUniverseLayer[]
): ExecutiveScenarioRanking[] {
  const alternatives = layers.filter((layer) => layer.metadata.role === "alternative");
  const ranked = [...alternatives].sort(
    (left, right) => right.metadata.overallScore - left.metadata.overallScore
  );

  return ranked.map((layer, index) => {
    const row = comparison.rows.find((entry) => entry.scenarioId === layer.metadata.id);
    const tradeOff = {
      gain: layer.metadata.opportunityImpact === "high" ? 0.82 : layer.metadata.opportunityImpact === "medium" ? 0.58 : 0.34,
      cost: layer.metadata.costImpact === "high" ? 0.78 : layer.metadata.costImpact === "medium" ? 0.52 : 0.24,
      risk: layer.metadata.riskScore,
      confidence: layer.metadata.confidence,
      resilience: 1 - layer.metadata.riskScore * 0.65,
    };
    const recommendationLevel =
      comparison.bestOptionId === layer.metadata.id
        ? ("recommended" as const)
        : comparison.highestRiskScenarioId === layer.metadata.id
          ? ("risky" as const)
          : ("acceptable" as const);

    return {
      scenarioId: layer.metadata.id,
      title: layer.metadata.title,
      rank: index + 1,
      overallScore: layer.metadata.overallScore,
      tradeOff,
      recommendationLevel,
    };
  });
}

function buildRecommendation(
  comparison: TypeCScenarioComparison,
  rankings: readonly ExecutiveScenarioRanking[]
): ExecutiveScenarioStrategicRecommendation | null {
  const best = rankings.find((entry) => entry.scenarioId === comparison.bestOptionId) ?? rankings[0];
  if (!best) return null;
  const risky = rankings.find((entry) => entry.scenarioId === comparison.highestRiskScenarioId);
  return {
    recommendedScenarioId: best.scenarioId,
    recommendedTitle: best.title,
    reasoning: `${best.title} balances confidence (${Math.round(best.tradeOff.confidence * 100)}%) with manageable risk exposure.`,
    tradeoffSummary: risky
      ? `Recommended over ${risky.title}, which carries higher structural risk.`
      : comparison.summary,
    confidence: best.tradeOff.confidence,
  };
}

export function resolveComparisonMode(layerCount: number): ScenarioComparisonMode {
  if (layerCount >= 4) return "triple";
  if (layerCount >= 3) return "dual";
  return "single";
}

export function buildExecutiveScenarioUniverse(
  input: BuildExecutiveScenarioUniverseInput
): ExecutiveScenarioUniverseState {
  const draftById = new Map(input.drafts.map((draft) => [draft.id, draft]));
  const simulationById = new Map(input.simulations.map((simulation) => [simulation.scenarioId, simulation]));
  const baselineSimulation = buildBaselineSimulation(input.sceneObjectIds ?? []);
  const baselineDraft = buildBaselineDraft();

  const layers: ExecutiveScenarioUniverseLayer[] = [
    {
      metadata: {
        id: BASELINE_ID,
        title: baselineDraft.title,
        description: baselineDraft.description,
        confidence: 1,
        riskScore: 0.12,
        costImpact: "low",
        opportunityImpact: "medium",
        timelineLength: 1,
        role: "baseline",
        rank: null,
        overallScore: 0.72,
        riskLevel: "low",
      },
      simulation: baselineSimulation,
      draft: baselineDraft,
      delta: null,
      visible: true,
      ghostProjection: false,
      colorToken: LAYER_COLORS[0]!,
    },
  ];

  input.comparison.rows.forEach((row, index) => {
    const draft = draftById.get(row.scenarioId) ?? null;
    const simulation = simulationById.get(row.scenarioId) ?? null;
    if (!simulation) return;
    const confidence = row.confidence;
    const riskScore = riskNumeric(row.riskLevel);
    const costImpact = inferCostImpact({
      affectedCount: row.affectedCount,
      pathCount: row.pathCount,
      riskLevel: row.riskLevel,
    });
    const opportunityImpact = inferOpportunityImpact(row.title, row.riskLevel);
    const overallScore = computeOverallScore({ confidence, riskScore, costImpact, opportunityImpact });
    const delta = computeScenarioLayerDelta({
      scenarioId: row.scenarioId,
      simulation,
      baselineAffectedIds: baselineSimulation.affectedObjectIds,
      baselinePaths: baselineSimulation.propagationPaths,
    });

    layers.push({
      metadata: {
        id: row.scenarioId,
        title: row.title,
        description: draft?.description ?? row.tradeoff,
        confidence,
        riskScore,
        costImpact,
        opportunityImpact,
        timelineLength: Math.max(1, simulation.propagationPaths.length + 1),
        role: "alternative",
        rank: null,
        overallScore,
        riskLevel: row.riskLevel,
      },
      simulation,
      draft,
      delta,
      visible: true,
      ghostProjection: false,
      colorToken: LAYER_COLORS[(index + 1) % LAYER_COLORS.length]!,
    });
  });

  const rankings = buildRankings(input.comparison, layers);
  rankings.forEach((entry) => {
    const layer = layers.find((candidate) => candidate.metadata.id === entry.scenarioId);
    if (layer) layer.metadata.rank = entry.rank;
  });

  const recommendation = buildRecommendation(input.comparison, rankings);
  const activeScenarioId = recommendation?.recommendedScenarioId ?? layers[1]?.metadata.id ?? BASELINE_ID;
  const visibleLayerIds = layers.filter((layer) => layer.visible).map((layer) => layer.metadata.id);
  const comparisonMode = resolveComparisonMode(layers.length);
  const divergencePoints = layers
    .filter((layer) => layer.delta?.divergenceStepIndex != null && layer.metadata.role === "alternative")
    .map((layer) => ({
      stepIndex: layer.delta!.divergenceStepIndex!,
      scenarioId: layer.metadata.id,
      label: `${layer.metadata.title} diverges`,
    }));

  const signature = [
    input.comparison.id,
    layers.map((layer) => layer.metadata.id).join("|"),
    activeScenarioId,
    comparisonMode,
  ].join("::");

  logE296ScenarioLoaded(signature, {
    layerCount: layers.length,
    comparisonId: input.comparison.id,
    activeScenarioId,
  });
  logE296ComparisonStarted(signature, {
    comparisonMode,
    scenarioIds: input.comparison.scenarioIds,
    recommendedScenarioId: recommendation?.recommendedScenarioId ?? null,
  });

  return {
    signature,
    comparisonId: input.comparison.id,
    comparisonMode,
    layoutMode: "ghost",
    baselineScenarioId: BASELINE_ID,
    activeScenarioId,
    visibleLayerIds,
    layers,
    rankings,
    recommendation,
    comparisonSummary: input.comparison.summary,
    comparisonActive: layers.length > 1,
    divergencePoints,
  };
}

export function buildScenarioComparisonDashboard(
  state: ExecutiveScenarioUniverseState
): ExecutiveScenarioComparisonDashboardRow[] {
  return state.layers.map((layer) => ({
    scenarioId: layer.metadata.id,
    title: layer.metadata.title,
    riskScore: layer.metadata.riskScore,
    costImpact: layer.metadata.costImpact,
    opportunityImpact: layer.metadata.opportunityImpact,
    confidence: layer.metadata.confidence,
    overallScore: layer.metadata.overallScore,
    rank: layer.metadata.rank,
    active: layer.metadata.id === state.activeScenarioId,
    visible: layer.visible,
  }));
}

export function resolveUniverseObjectSelection(input: {
  state: ExecutiveScenarioUniverseState;
  layoutMode?: ScenarioUniverseLayoutMode;
}): ScenarioUniverseObjectSelection | null {
  if (!input.state.comparisonActive) return null;

  const visibleLayers = input.state.layers.filter(
    (layer) => layer.visible && layer.metadata.id !== input.state.baselineScenarioId
  );
  if (visibleLayers.length === 0) return null;

  const activeLayer =
    visibleLayers.find((layer) => layer.metadata.id === input.state.activeScenarioId) ?? visibleLayers[0]!;
  const ghostLayers = visibleLayers.filter((layer) => layer.metadata.id !== activeLayer.metadata.id);

  let selection: ScenarioUniverseObjectSelection = {
    highlighted_objects: [...(activeLayer.simulation?.affectedObjectIds ?? [])],
    risk_sources: activeLayer.simulation?.propagationPaths.map((path) => path.from) ?? [],
    risk_targets: activeLayer.simulation?.propagationPaths.map((path) => path.to) ?? [],
    dim_unrelated_objects: input.layoutMode !== "overlay",
  };

  for (const layer of ghostLayers) {
    selection = mergeTimelineSpatialObjectSelection(selection, {
      highlighted_objects: layer.simulation?.affectedObjectIds ?? [],
      risk_sources: layer.simulation?.propagationPaths.slice(0, 1).map((path) => path.from) ?? [],
      risk_targets: layer.simulation?.propagationPaths.slice(0, 1).map((path) => path.to) ?? [],
      dim_unrelated_objects: false,
    }) ?? selection;
  }

  return selection;
}

export function resolveActiveUniverseSimulation(
  state: ExecutiveScenarioUniverseState | null
): TypeCScenarioSimulation | null {
  if (!state?.comparisonActive) return null;
  const layer = state.layers.find((entry) => entry.metadata.id === state.activeScenarioId);
  return layer?.simulation ?? null;
}

export function resolveGhostUniverseLayers(
  state: ExecutiveScenarioUniverseState | null
): ExecutiveScenarioUniverseLayer[] {
  if (!state?.comparisonActive || state.layoutMode === "overlay") return [];
  return state.layers.filter(
    (layer) =>
      layer.visible &&
      layer.metadata.id !== state.activeScenarioId &&
      layer.metadata.role === "alternative"
  );
}

export const EXECUTIVE_SCENARIO_BASELINE_ID = BASELINE_ID;
