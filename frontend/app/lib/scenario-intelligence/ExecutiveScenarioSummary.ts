import { buildObjectImpactProfileRegistry } from "./ObjectImpactSimulationEngine.ts";
import { buildKpiImpactProfileRegistry } from "./KpiImpactSimulationEngine.ts";
import { buildRelationshipImpactProfileRegistry } from "./RelationshipImpactSimulationEngine.ts";
import { buildRiskImpactProfileRegistry } from "./RiskImpactSimulationEngine.ts";
import { buildScenarioRegistry } from "./ScenarioGenerationRuntime.ts";
import {
  EMPTY_EXECUTIVE_SCENARIO_SUMMARY,
  EXEC_SCENARIO_SUMMARY_DIAGNOSTICS,
  EXEC_SCENARIO_SUMMARY_VERSION,
  type ExecutiveScenarioImpactAggregation,
  type ExecutiveScenarioRecommendedAction,
  type ExecutiveScenarioSummary as ExecutiveScenarioSummaryRecord,
  type ExecutiveScenarioSummaryBuildInput,
  type ExecutiveScenarioSummaryProfile,
  type ExecutiveScenarioSwotItem,
} from "./executiveScenarioSummaryContract.ts";
import type { KpiImpactProfile } from "./kpiImpactSimulationContract.ts";
import type { ObjectImpactProfile } from "./objectImpactSimulationContract.ts";
import type { RelationshipImpactProfile } from "./relationshipImpactSimulationContract.ts";
import type { RiskImpactProfile } from "./riskImpactSimulationContract.ts";
import type { ScenarioRegistry, ScenarioType } from "./scenarioGenerationContract.ts";

let latestExecutiveScenarioSummary: ExecutiveScenarioSummaryRecord = EMPTY_EXECUTIVE_SCENARIO_SUMMARY;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return clampScore(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function swotItem(id: string, label: string, detail: string, score: number): ExecutiveScenarioSwotItem {
  return Object.freeze({ id, label, detail, score: clampScore(score) });
}

function topItems(items: ExecutiveScenarioSwotItem[], limit = 5): readonly ExecutiveScenarioSwotItem[] {
  return Object.freeze(
    [...items].sort((left, right) => right.score - left.score).slice(0, limit)
  );
}

function collectSimulationInput(input: ExecutiveScenarioSummaryBuildInput) {
  return Object.freeze({
    sceneJson: input.sceneJson,
    objects: input.objects ?? input.sceneObjects,
    relationships: input.relationships,
    kpis: input.kpis,
    sceneObjects: input.sceneObjects,
    dataSourceObjects: input.dataSourceObjects,
    dataSourceKpis: input.dataSourceKpis,
    scenarioIds: input.scenarioIds,
    selectedObjectId: input.selectedObjectId,
  });
}

function buildImpactAggregation(
  objectProfiles: readonly ObjectImpactProfile[],
  relationshipProfiles: readonly RelationshipImpactProfile[],
  kpiProfiles: readonly KpiImpactProfile[],
  riskProfiles: readonly RiskImpactProfile[]
): ExecutiveScenarioImpactAggregation {
  const objectScores = objectProfiles.map((profile) => profile.impactResult.compositeImpactScore);
  const relationshipScores = relationshipProfiles.map(
    (profile) => profile.impactResult.compositeImpactScore
  );
  const kpiScores = kpiProfiles.map((profile) => profile.impactResult.compositeImpactScore);
  const riskScores = riskProfiles.map((profile) => profile.impactResult.compositeImpactScore);
  const compositeImpactScore = average([
    ...objectScores,
    ...relationshipScores,
    ...kpiScores,
    ...riskScores,
  ]);

  return Object.freeze({
    objectImpactCount: objectProfiles.length,
    relationshipImpactCount: relationshipProfiles.length,
    kpiImpactCount: kpiProfiles.length,
    riskImpactCount: riskProfiles.length,
    averageObjectImpactScore: average(objectScores),
    averageRelationshipImpactScore: average(relationshipScores),
    averageKpiImpactScore: average(kpiScores),
    averageRiskImpactScore: average(riskScores),
    compositeImpactScore,
  });
}

function buildStrengths(
  scenarioType: ScenarioType,
  objectProfiles: readonly ObjectImpactProfile[],
  relationshipProfiles: readonly RelationshipImpactProfile[],
  kpiProfiles: readonly KpiImpactProfile[],
  riskProfiles: readonly RiskImpactProfile[]
): readonly ExecutiveScenarioSwotItem[] {
  const items: ExecutiveScenarioSwotItem[] = [];

  for (const profile of objectProfiles) {
    const { healthChange, importanceChange } = profile.impactResult;
    if (healthChange.delta > 0) {
      items.push(
        swotItem(
          `strength-object-${profile.objectId}`,
          profile.label,
          `Object health improves by ${healthChange.delta} points.`,
          healthChange.delta + importanceChange.delta
        )
      );
    }
  }

  for (const profile of kpiProfiles) {
    if (profile.impactResult.impactState === "Positive") {
      items.push(
        swotItem(
          `strength-kpi-${profile.kpiId}`,
          profile.label,
          `KPI forecast impact is positive with delta ${profile.impactResult.forecastImpact.forecastDelta}.`,
          profile.impactResult.compositeImpactScore + 10
        )
      );
    }
  }

  for (const profile of relationshipProfiles) {
    if (profile.impactResult.influenceChange.delta > 0) {
      items.push(
        swotItem(
          `strength-relationship-${profile.relationshipId}`,
          profile.label,
          `Relationship influence strengthens by ${profile.impactResult.influenceChange.delta}.`,
          profile.impactResult.influenceChange.delta
        )
      );
    }
  }

  for (const profile of riskProfiles) {
    if (profile.impactResult.riskDecrease.decreaseDetected) {
      items.push(
        swotItem(
          `strength-risk-${profile.subjectId}`,
          profile.label,
          `Risk exposure decreases by ${Math.abs(profile.impactResult.riskDecrease.riskDelta)}.`,
          Math.abs(profile.impactResult.riskDecrease.riskDelta)
        )
      );
    }
  }

  if (scenarioType === "baseline" && items.length === 0) {
    items.push(
      swotItem(
        "strength-baseline-stability",
        "Baseline Stability",
        "Current-state scenario preserves stable executive posture.",
        40
      )
    );
  }

  return topItems(items);
}

function buildWeaknesses(
  objectProfiles: readonly ObjectImpactProfile[],
  relationshipProfiles: readonly RelationshipImpactProfile[],
  kpiProfiles: readonly KpiImpactProfile[],
  riskProfiles: readonly RiskImpactProfile[]
): readonly ExecutiveScenarioSwotItem[] {
  const items: ExecutiveScenarioSwotItem[] = [];

  for (const profile of objectProfiles) {
    if (profile.impactResult.healthChange.delta < 0) {
      items.push(
        swotItem(
          `weakness-object-${profile.objectId}`,
          profile.label,
          `Object health declines by ${Math.abs(profile.impactResult.healthChange.delta)}.`,
          Math.abs(profile.impactResult.healthChange.delta)
        )
      );
    }
  }

  for (const profile of relationshipProfiles) {
    if (profile.impactResult.dependencyChange.delta > 0) {
      items.push(
        swotItem(
          `weakness-relationship-${profile.relationshipId}`,
          profile.label,
          `Dependency exposure increases by ${profile.impactResult.dependencyChange.delta}.`,
          profile.impactResult.dependencyChange.delta
        )
      );
    }
  }

  for (const profile of kpiProfiles) {
    if (profile.impactResult.impactState === "Negative") {
      items.push(
        swotItem(
          `weakness-kpi-${profile.kpiId}`,
          profile.label,
          `KPI forecast impact is negative.`,
          profile.impactResult.compositeImpactScore + 8
        )
      );
    }
  }

  for (const profile of riskProfiles) {
    if (profile.subjectKind !== "propagation" && profile.impactResult.netRiskDelta > 0) {
      items.push(
        swotItem(
          `weakness-risk-${profile.subjectId}`,
          profile.label,
          `Risk score increases by ${profile.impactResult.netRiskDelta}.`,
          profile.impactResult.netRiskDelta
        )
      );
    }
  }

  return topItems(items);
}

function buildOpportunities(
  scenarioType: ScenarioType,
  objectProfiles: readonly ObjectImpactProfile[],
  kpiProfiles: readonly KpiImpactProfile[],
  relationshipProfiles: readonly RelationshipImpactProfile[]
): readonly ExecutiveScenarioSwotItem[] {
  const items: ExecutiveScenarioSwotItem[] = [];

  if (scenarioType === "opportunity") {
    items.push(
      swotItem(
        "opportunity-scenario-posture",
        "Opportunity Scenario",
        "Scenario models upside recovery and growth-oriented adjustments.",
        75
      )
    );
  }

  for (const profile of kpiProfiles) {
    if (profile.impactResult.impactState === "Positive") {
      items.push(
        swotItem(
          `opportunity-kpi-${profile.kpiId}`,
          profile.label,
          `KPI upside projected at ${profile.impactResult.forecastImpact.projectedValue}.`,
          profile.impactResult.compositeImpactScore + 5
        )
      );
    }
  }

  for (const profile of objectProfiles) {
    if (profile.impactResult.importanceChange.delta > 0) {
      items.push(
        swotItem(
          `opportunity-object-${profile.objectId}`,
          profile.label,
          `Object importance can expand by ${profile.impactResult.importanceChange.delta}.`,
          profile.impactResult.importanceChange.delta
        )
      );
    }
  }

  for (const profile of relationshipProfiles) {
    if (profile.impactResult.riskExposureChange.delta < 0) {
      items.push(
        swotItem(
          `opportunity-relationship-${profile.relationshipId}`,
          profile.label,
          `Relationship risk exposure can be reduced.`,
          Math.abs(profile.impactResult.riskExposureChange.delta)
        )
      );
    }
  }

  return topItems(items);
}

function buildThreats(
  scenarioType: ScenarioType,
  objectProfiles: readonly ObjectImpactProfile[],
  kpiProfiles: readonly KpiImpactProfile[],
  riskProfiles: readonly RiskImpactProfile[]
): readonly ExecutiveScenarioSwotItem[] {
  const items: ExecutiveScenarioSwotItem[] = [];

  if (scenarioType === "risk") {
    items.push(
      swotItem(
        "threat-scenario-posture",
        "Risk Scenario",
        "Scenario models downside escalation across the executive graph.",
        80
      )
    );
  }

  for (const profile of riskProfiles) {
    if (profile.impactResult.riskIncrease.increaseDetected) {
      items.push(
        swotItem(
          `threat-risk-${profile.subjectId}`,
          profile.label,
          `Risk increases by ${profile.impactResult.riskIncrease.riskDelta}.`,
          profile.impactResult.riskIncrease.riskDelta + 5
        )
      );
    }
    if (profile.impactResult.riskPropagation.propagationDetected) {
      items.push(
        swotItem(
          `threat-propagation-${profile.subjectId}`,
          profile.label,
          `Risk propagates across ${profile.impactResult.riskPropagation.affectedChainCount} chain(s).`,
          Math.abs(profile.impactResult.riskPropagation.propagationDelta) + 10
        )
      );
    }
  }

  for (const profile of objectProfiles) {
    if (profile.impactResult.trendChange.projectedDirection === "Declining") {
      items.push(
        swotItem(
          `threat-object-trend-${profile.objectId}`,
          profile.label,
          `Object trend shifts to declining under scenario pressure.`,
          profile.impactResult.compositeImpactScore
        )
      );
    }
  }

  for (const profile of kpiProfiles) {
    if (profile.impactResult.impactState === "Negative") {
      items.push(
        swotItem(
          `threat-kpi-${profile.kpiId}`,
          profile.label,
          `KPI downside threatens target attainment.`,
          profile.impactResult.compositeImpactScore + 6
        )
      );
    }
  }

  return topItems(items);
}

function buildRecommendedActions(
  scenarioId: string,
  aggregation: ExecutiveScenarioImpactAggregation,
  threats: readonly ExecutiveScenarioSwotItem[],
  weaknesses: readonly ExecutiveScenarioSwotItem[],
  opportunities: readonly ExecutiveScenarioSwotItem[]
): readonly ExecutiveScenarioRecommendedAction[] {
  const actions: ExecutiveScenarioRecommendedAction[] = [];

  for (const threat of threats.slice(0, 2)) {
    actions.push(
      Object.freeze({
        actionId: `action-${scenarioId}-threat-${threat.id}`,
        priority: threat.score >= 70 ? "immediate" : "prioritize",
        label: `Mitigate ${threat.label}`,
        reason: threat.detail,
      })
    );
  }

  for (const weakness of weaknesses.slice(0, 2)) {
    actions.push(
      Object.freeze({
        actionId: `action-${scenarioId}-weakness-${weakness.id}`,
        priority: weakness.score >= 50 ? "review" : "monitor",
        label: `Address ${weakness.label}`,
        reason: weakness.detail,
      })
    );
  }

  for (const opportunity of opportunities.slice(0, 1)) {
    actions.push(
      Object.freeze({
        actionId: `action-${scenarioId}-opportunity-${opportunity.id}`,
        priority: "review",
        label: `Evaluate ${opportunity.label}`,
        reason: opportunity.detail,
      })
    );
  }

  if (actions.length === 0) {
    actions.push(
      Object.freeze({
        actionId: `action-${scenarioId}-monitor`,
        priority: "monitor",
        label: "Monitor scenario posture",
        reason: `Composite scenario impact score is ${aggregation.compositeImpactScore}.`,
      })
    );
  }

  return Object.freeze(actions);
}

function buildScenarioSummaryProfile(
  scenarioId: string,
  scenarioType: ScenarioType,
  label: string,
  definition: ExecutiveScenarioSummaryProfile["definition"],
  objectProfiles: readonly ObjectImpactProfile[],
  relationshipProfiles: readonly RelationshipImpactProfile[],
  kpiProfiles: readonly KpiImpactProfile[],
  riskProfiles: readonly RiskImpactProfile[]
): ExecutiveScenarioSummaryProfile {
  const impactAggregation = buildImpactAggregation(
    objectProfiles,
    relationshipProfiles,
    kpiProfiles,
    riskProfiles
  );
  const strengths = buildStrengths(
    scenarioType,
    objectProfiles,
    relationshipProfiles,
    kpiProfiles,
    riskProfiles
  );
  const weaknesses = buildWeaknesses(
    objectProfiles,
    relationshipProfiles,
    kpiProfiles,
    riskProfiles
  );
  const opportunities = buildOpportunities(
    scenarioType,
    objectProfiles,
    kpiProfiles,
    relationshipProfiles
  );
  const threats = buildThreats(scenarioType, objectProfiles, kpiProfiles, riskProfiles);
  const recommendedActions = buildRecommendedActions(
    scenarioId,
    impactAggregation,
    threats,
    weaknesses,
    opportunities
  );

  return Object.freeze({
    scenarioId,
    scenarioType,
    label,
    definition,
    impactAggregation,
    strengths,
    weaknesses,
    opportunities,
    threats,
    recommendedActions,
  });
}

function buildExecutiveSummaryText(
  summaries: readonly ExecutiveScenarioSummaryProfile[]
): string {
  if (summaries.length === 0) {
    return "No executive scenario intelligence is available.";
  }
  const highestThreat = summaries
    .flatMap((summary) => summary.threats)
    .sort((left, right) => right.score - left.score)[0];
  const topOpportunity = summaries
    .flatMap((summary) => summary.opportunities)
    .sort((left, right) => right.score - left.score)[0];
  return `Executive scenario intelligence covers ${summaries.length} scenario(s) with aggregated object, relationship, KPI, and risk impacts; top threat: ${highestThreat?.label ?? "none"}; top opportunity: ${topOpportunity?.label ?? "none"}; ${summaries.reduce((sum, summary) => sum + summary.recommendedActions.length, 0)} recommended action(s).`;
}

export function buildExecutiveScenarioSummary(
  input: ExecutiveScenarioSummaryBuildInput = {}
): ExecutiveScenarioSummaryRecord {
  const simulationInput = collectSimulationInput(input);
  const scenarioRegistry =
    input.scenarioRegistry ?? buildScenarioRegistry(simulationInput);
  const objectImpactRegistry =
    input.objectImpactRegistry ?? buildObjectImpactProfileRegistry(simulationInput);
  const relationshipImpactRegistry =
    input.relationshipImpactRegistry ?? buildRelationshipImpactProfileRegistry(simulationInput);
  const kpiImpactRegistry =
    input.kpiImpactRegistry ??
    buildKpiImpactProfileRegistry(
      Object.freeze({
        ...simulationInput,
        historicalSnapshots: input.historicalSnapshots,
      })
    );
  const riskImpactRegistry =
    input.riskImpactRegistry ?? buildRiskImpactProfileRegistry(simulationInput);

  const scenarioIds = input.scenarioIds
    ? scenarioRegistry.definitions.filter((definition) =>
        input.scenarioIds?.includes(definition.scenarioId)
      )
    : scenarioRegistry.definitions;

  if (scenarioIds.length === 0) {
    latestExecutiveScenarioSummary = EMPTY_EXECUTIVE_SCENARIO_SUMMARY;
    return latestExecutiveScenarioSummary;
  }

  const summaries = Object.freeze(
    scenarioIds.map((definition) => {
      const scenarioId = definition.scenarioId;
      return buildScenarioSummaryProfile(
        scenarioId,
        definition.scenarioType,
        definition.label,
        definition,
        objectImpactRegistry.profilesByScenarioId[scenarioId] ?? Object.freeze([]),
        relationshipImpactRegistry.profilesByScenarioId[scenarioId] ?? Object.freeze([]),
        kpiImpactRegistry.profilesByScenarioId[scenarioId] ?? Object.freeze([]),
        riskImpactRegistry.profilesByScenarioId[scenarioId] ?? Object.freeze([])
      );
    })
  );

  const summaryByScenarioId = Object.freeze(
    summaries.reduce<Record<string, ExecutiveScenarioSummaryProfile>>((registry, summary) => {
      registry[summary.scenarioId] = summary;
      return registry;
    }, {})
  );

  latestExecutiveScenarioSummary = Object.freeze({
    version: EXEC_SCENARIO_SUMMARY_VERSION,
    executiveSummary: buildExecutiveSummaryText(summaries),
    scenarioCount: summaries.length,
    summaries,
    summaryByScenarioId,
    readOnly: true,
    sceneMutation: false,
    simulationActive: false,
    diagnostics: EXEC_SCENARIO_SUMMARY_DIAGNOSTICS,
  });

  return latestExecutiveScenarioSummary;
}

export function getExecutiveScenarioSummary(): ExecutiveScenarioSummaryRecord {
  return latestExecutiveScenarioSummary;
}

export function resetExecutiveScenarioSummaryForTests(): void {
  latestExecutiveScenarioSummary = EMPTY_EXECUTIVE_SCENARIO_SUMMARY;
}

export const ExecutiveScenarioSummaryEngine = Object.freeze({
  buildExecutiveScenarioSummary,
  getExecutiveScenarioSummary,
});
