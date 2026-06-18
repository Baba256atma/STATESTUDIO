import { buildExecutiveScenarioSummary } from "./ExecutiveScenarioSummary.ts";
import { buildKpiImpactProfileRegistry } from "./KpiImpactSimulationEngine.ts";
import { buildObjectImpactProfileRegistry } from "./ObjectImpactSimulationEngine.ts";
import { buildRelationshipImpactProfileRegistry } from "./RelationshipImpactSimulationEngine.ts";
import { buildRiskImpactProfileRegistry } from "./RiskImpactSimulationEngine.ts";
import {
  DEFAULT_BASELINE_VS_ALTERNATIVE_PAIR,
  EMPTY_SCENARIO_COMPARISON_FOUNDATION_REGISTRY,
  SCENARIO_COMPARISON_DIAGNOSTICS,
  SCENARIO_COMPARISON_FOUNDATION_VERSION,
  type ScenarioComparisonChangeDirection,
  type ScenarioComparisonDimension,
  type ScenarioComparisonFoundationBuildInput,
  type ScenarioComparisonFoundationRegistry,
  type ScenarioComparisonPair,
  type ScenarioComparisonPairInput,
  type ScenarioComparisonPairKind,
  type ScenarioDifferenceProfile,
} from "./scenarioComparisonFoundationContract.ts";
import type { ExecutiveScenarioSummaryProfile } from "./executiveScenarioSummaryContract.ts";
import type { KpiImpactProfile } from "./kpiImpactSimulationContract.ts";
import type { ObjectImpactProfile } from "./objectImpactSimulationContract.ts";
import type { RelationshipImpactProfile } from "./relationshipImpactSimulationContract.ts";
import type { RiskImpactProfile } from "./riskImpactSimulationContract.ts";

let latestScenarioComparisonFoundationRegistry: ScenarioComparisonFoundationRegistry =
  EMPTY_SCENARIO_COMPARISON_FOUNDATION_REGISTRY;

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function collectSimulationInput(input: ScenarioComparisonFoundationBuildInput) {
  return Object.freeze({
    sceneJson: input.sceneJson,
    objects: input.objects ?? input.sceneObjects,
    relationships: input.relationships,
    kpis: input.kpis,
    sceneObjects: input.sceneObjects,
    dataSourceObjects: input.dataSourceObjects,
    dataSourceKpis: input.dataSourceKpis,
    scenarioIds: input.scenarioIds,
  });
}

function withHistoricalSnapshots(
  simulationInput: ReturnType<typeof collectSimulationInput>,
  historicalSnapshots: ScenarioComparisonFoundationBuildInput["historicalSnapshots"]
) {
  return Object.freeze({
    ...simulationInput,
    historicalSnapshots,
  });
}

function directionForDelta(delta: number): ScenarioComparisonChangeDirection {
  if (delta > 0) return "up";
  if (delta < 0) return "down";
  return "neutral";
}

function comparisonIdForPair(pair: ScenarioComparisonPairInput): string {
  return `comparison:${pair.leftScenarioId}:vs:${pair.rightScenarioId}`;
}

function differenceProfile(
  comparisonId: string,
  dimension: ScenarioComparisonDimension,
  subjectId: string,
  label: string,
  leftScenarioId: string,
  rightScenarioId: string,
  leftValue: number,
  rightValue: number
): ScenarioDifferenceProfile {
  const left = clampScore(leftValue);
  const right = clampScore(rightValue);
  const delta = right - left;
  return Object.freeze({
    differenceId: `difference:${comparisonId}:${dimension}:${subjectId}`,
    comparisonId,
    dimension,
    subjectId,
    label,
    leftScenarioId,
    rightScenarioId,
    leftValue: left,
    rightValue: right,
    delta,
    direction: directionForDelta(delta),
    comparisonReady: true,
  });
}

function aggregationDifferences(
  comparisonId: string,
  left: ExecutiveScenarioSummaryProfile,
  right: ExecutiveScenarioSummaryProfile
): ScenarioDifferenceProfile[] {
  const profiles: ScenarioDifferenceProfile[] = [];
  const metrics: ReadonlyArray<{
    dimension: ScenarioComparisonDimension;
    subjectId: string;
    label: string;
    leftValue: number;
    rightValue: number;
  }> = [
    {
      dimension: "composite",
      subjectId: "composite-impact",
      label: "Composite impact score",
      leftValue: left.impactAggregation.compositeImpactScore,
      rightValue: right.impactAggregation.compositeImpactScore,
    },
    {
      dimension: "object",
      subjectId: "average-object-impact",
      label: "Average object impact score",
      leftValue: left.impactAggregation.averageObjectImpactScore,
      rightValue: right.impactAggregation.averageObjectImpactScore,
    },
    {
      dimension: "relationship",
      subjectId: "average-relationship-impact",
      label: "Average relationship impact score",
      leftValue: left.impactAggregation.averageRelationshipImpactScore,
      rightValue: right.impactAggregation.averageRelationshipImpactScore,
    },
    {
      dimension: "kpi",
      subjectId: "average-kpi-impact",
      label: "Average KPI impact score",
      leftValue: left.impactAggregation.averageKpiImpactScore,
      rightValue: right.impactAggregation.averageKpiImpactScore,
    },
    {
      dimension: "risk",
      subjectId: "average-risk-impact",
      label: "Average risk impact score",
      leftValue: left.impactAggregation.averageRiskImpactScore,
      rightValue: right.impactAggregation.averageRiskImpactScore,
    },
  ];

  for (const metric of metrics) {
    profiles.push(
      differenceProfile(
        comparisonId,
        metric.dimension,
        metric.subjectId,
        metric.label,
        left.scenarioId,
        right.scenarioId,
        metric.leftValue,
        metric.rightValue
      )
    );
  }

  const swotMetrics: ReadonlyArray<{
    subjectId: string;
    label: string;
    leftValue: number;
    rightValue: number;
  }> = [
    {
      subjectId: "strength-count",
      label: "Strength count",
      leftValue: left.strengths.length,
      rightValue: right.strengths.length,
    },
    {
      subjectId: "weakness-count",
      label: "Weakness count",
      leftValue: left.weaknesses.length,
      rightValue: right.weaknesses.length,
    },
    {
      subjectId: "opportunity-count",
      label: "Opportunity count",
      leftValue: left.opportunities.length,
      rightValue: right.opportunities.length,
    },
    {
      subjectId: "threat-count",
      label: "Threat count",
      leftValue: left.threats.length,
      rightValue: right.threats.length,
    },
  ];

  for (const metric of swotMetrics) {
    profiles.push(
      differenceProfile(
        comparisonId,
        "swot",
        metric.subjectId,
        metric.label,
        left.scenarioId,
        right.scenarioId,
        metric.leftValue,
        metric.rightValue
      )
    );
  }

  profiles.push(
    differenceProfile(
      comparisonId,
      "actions",
      "recommended-action-count",
      "Recommended action count",
      left.scenarioId,
      right.scenarioId,
      left.recommendedActions.length,
      right.recommendedActions.length
    )
  );

  return profiles;
}

function entityDifferences<T extends { label: string }>(
  comparisonId: string,
  dimension: ScenarioComparisonDimension,
  entityId: string,
  leftScenarioId: string,
  rightScenarioId: string,
  leftProfile: T | undefined,
  rightProfile: T | undefined,
  scoreFor: (profile: T) => number
): ScenarioDifferenceProfile | null {
  if (!leftProfile || !rightProfile) return null;
  return differenceProfile(
    comparisonId,
    dimension,
    entityId,
    leftProfile.label,
    leftScenarioId,
    rightScenarioId,
    scoreFor(leftProfile),
    scoreFor(rightProfile)
  );
}

function objectImpactDifferences(
  comparisonId: string,
  leftScenarioId: string,
  rightScenarioId: string,
  leftProfiles: readonly ObjectImpactProfile[],
  rightProfiles: readonly ObjectImpactProfile[]
): ScenarioDifferenceProfile[] {
  const rightByObjectId = new Map(rightProfiles.map((profile) => [profile.objectId, profile]));
  const profiles: ScenarioDifferenceProfile[] = [];

  for (const leftProfile of leftProfiles) {
    const rightProfile = rightByObjectId.get(leftProfile.objectId);
    const diff = entityDifferences(
      comparisonId,
      "object",
      leftProfile.objectId,
      leftScenarioId,
      rightScenarioId,
      leftProfile,
      rightProfile,
      (profile) => profile.impactResult.compositeImpactScore
    );
    if (diff) profiles.push(diff);
  }

  return profiles;
}

function relationshipImpactDifferences(
  comparisonId: string,
  leftScenarioId: string,
  rightScenarioId: string,
  leftProfiles: readonly RelationshipImpactProfile[],
  rightProfiles: readonly RelationshipImpactProfile[]
): ScenarioDifferenceProfile[] {
  const rightByRelationshipId = new Map(
    rightProfiles.map((profile) => [profile.relationshipId, profile])
  );
  const profiles: ScenarioDifferenceProfile[] = [];

  for (const leftProfile of leftProfiles) {
    const rightProfile = rightByRelationshipId.get(leftProfile.relationshipId);
    const diff = entityDifferences(
      comparisonId,
      "relationship",
      leftProfile.relationshipId,
      leftScenarioId,
      rightScenarioId,
      leftProfile,
      rightProfile,
      (profile) => profile.impactResult.compositeImpactScore
    );
    if (diff) profiles.push(diff);
  }

  return profiles;
}

function kpiImpactDifferences(
  comparisonId: string,
  leftScenarioId: string,
  rightScenarioId: string,
  leftProfiles: readonly KpiImpactProfile[],
  rightProfiles: readonly KpiImpactProfile[]
): ScenarioDifferenceProfile[] {
  const rightByKpiId = new Map(rightProfiles.map((profile) => [profile.kpiId, profile]));
  const profiles: ScenarioDifferenceProfile[] = [];

  for (const leftProfile of leftProfiles) {
    const rightProfile = rightByKpiId.get(leftProfile.kpiId);
    const diff = entityDifferences(
      comparisonId,
      "kpi",
      leftProfile.kpiId,
      leftScenarioId,
      rightScenarioId,
      leftProfile,
      rightProfile,
      (profile) => profile.impactResult.compositeImpactScore
    );
    if (diff) profiles.push(diff);
  }

  return profiles;
}

function riskImpactDifferences(
  comparisonId: string,
  leftScenarioId: string,
  rightScenarioId: string,
  leftProfiles: readonly RiskImpactProfile[],
  rightProfiles: readonly RiskImpactProfile[]
): ScenarioDifferenceProfile[] {
  const rightBySubjectId = new Map(rightProfiles.map((profile) => [profile.subjectId, profile]));
  const profiles: ScenarioDifferenceProfile[] = [];

  for (const leftProfile of leftProfiles) {
    const rightProfile = rightBySubjectId.get(leftProfile.subjectId);
    const diff = entityDifferences(
      comparisonId,
      "risk",
      leftProfile.subjectId,
      leftScenarioId,
      rightScenarioId,
      leftProfile,
      rightProfile,
      (profile) => profile.impactResult.compositeImpactScore
    );
    if (diff) profiles.push(diff);
  }

  return profiles;
}

function netDeltaForProfiles(profiles: readonly ScenarioDifferenceProfile[]): number {
  if (profiles.length === 0) return 0;
  return clampScore(
    profiles.reduce((sum, profile) => sum + profile.delta, 0) / profiles.length
  );
}

function buildComparisonPair(
  pair: ScenarioComparisonPairInput,
  executiveSummary: ReturnType<typeof buildExecutiveScenarioSummary>,
  objectImpactRegistry: ReturnType<typeof buildObjectImpactProfileRegistry>,
  relationshipImpactRegistry: ReturnType<typeof buildRelationshipImpactProfileRegistry>,
  kpiImpactRegistry: ReturnType<typeof buildKpiImpactProfileRegistry>,
  riskImpactRegistry: ReturnType<typeof buildRiskImpactProfileRegistry>
): ScenarioComparisonPair | null {
  const left = executiveSummary.summaryByScenarioId[pair.leftScenarioId];
  const right = executiveSummary.summaryByScenarioId[pair.rightScenarioId];
  if (!left || !right) return null;

  const comparisonId = comparisonIdForPair(pair);
  const differenceProfiles = [
    ...aggregationDifferences(comparisonId, left, right),
    ...objectImpactDifferences(
      comparisonId,
      pair.leftScenarioId,
      pair.rightScenarioId,
      objectImpactRegistry.profilesByScenarioId[pair.leftScenarioId] ?? [],
      objectImpactRegistry.profilesByScenarioId[pair.rightScenarioId] ?? []
    ),
    ...relationshipImpactDifferences(
      comparisonId,
      pair.leftScenarioId,
      pair.rightScenarioId,
      relationshipImpactRegistry.profilesByScenarioId[pair.leftScenarioId] ?? [],
      relationshipImpactRegistry.profilesByScenarioId[pair.rightScenarioId] ?? []
    ),
    ...kpiImpactDifferences(
      comparisonId,
      pair.leftScenarioId,
      pair.rightScenarioId,
      kpiImpactRegistry.profilesByScenarioId[pair.leftScenarioId] ?? [],
      kpiImpactRegistry.profilesByScenarioId[pair.rightScenarioId] ?? []
    ),
    ...riskImpactDifferences(
      comparisonId,
      pair.leftScenarioId,
      pair.rightScenarioId,
      riskImpactRegistry.profilesByScenarioId[pair.leftScenarioId] ?? [],
      riskImpactRegistry.profilesByScenarioId[pair.rightScenarioId] ?? []
    ),
  ];

  return Object.freeze({
    comparisonId,
    pairKind: pair.pairKind,
    leftScenarioId: pair.leftScenarioId,
    rightScenarioId: pair.rightScenarioId,
    leftLabel: left.label,
    rightLabel: right.label,
    leftScenarioType: left.scenarioType,
    rightScenarioType: right.scenarioType,
    differenceProfiles: Object.freeze(differenceProfiles),
    differenceCount: differenceProfiles.length,
    netDelta: netDeltaForProfiles(differenceProfiles),
    comparisonReady: true,
    renderingActive: false,
  });
}

function resolveComparisonPairs(
  input: ScenarioComparisonFoundationBuildInput
): readonly ScenarioComparisonPairInput[] {
  if (input.comparisonPairs && input.comparisonPairs.length > 0) {
    return Object.freeze([...input.comparisonPairs]);
  }
  return Object.freeze([DEFAULT_BASELINE_VS_ALTERNATIVE_PAIR]);
}

function byId<T extends { comparisonId?: string; differenceId?: string }>(
  items: readonly T[],
  key: "comparisonId" | "differenceId"
): Readonly<Record<string, T>> {
  return Object.freeze(
    items.reduce<Record<string, T>>((registry, item) => {
      const id = item[key];
      if (id) registry[id] = item;
      return registry;
    }, {})
  );
}

export function buildScenarioComparisonFoundationRegistry(
  input: ScenarioComparisonFoundationBuildInput = {}
): ScenarioComparisonFoundationRegistry {
  const simulationInput = collectSimulationInput(input);
  const kpiBuildInput = withHistoricalSnapshots(simulationInput, input.historicalSnapshots);
  const executiveScenarioSummary =
    input.executiveScenarioSummary ?? buildExecutiveScenarioSummary(kpiBuildInput);
  const objectImpactRegistry =
    input.objectImpactRegistry ?? buildObjectImpactProfileRegistry(simulationInput);
  const relationshipImpactRegistry =
    input.relationshipImpactRegistry ?? buildRelationshipImpactProfileRegistry(simulationInput);
  const kpiImpactRegistry =
    input.kpiImpactRegistry ?? buildKpiImpactProfileRegistry(kpiBuildInput);
  const riskImpactRegistry =
    input.riskImpactRegistry ?? buildRiskImpactProfileRegistry(kpiBuildInput);

  const pairs = resolveComparisonPairs(input)
    .map((pair) =>
      buildComparisonPair(
        pair,
        executiveScenarioSummary,
        objectImpactRegistry,
        relationshipImpactRegistry,
        kpiImpactRegistry,
        riskImpactRegistry
      )
    )
    .filter((pair): pair is ScenarioComparisonPair => pair !== null);

  const differenceProfiles = Object.freeze(pairs.flatMap((pair) => [...pair.differenceProfiles]));

  const registry = Object.freeze({
    version: SCENARIO_COMPARISON_FOUNDATION_VERSION,
    pairs: Object.freeze(pairs),
    pairById: byId(pairs, "comparisonId"),
    differenceProfiles,
    differenceById: byId(differenceProfiles, "differenceId"),
    pairCount: pairs.length,
    differenceCount: differenceProfiles.length,
    executiveScenarioSummary,
    foundationOnly: true as const,
    comparisonActive: false as const,
    renderingActive: false as const,
    visualRendering: false as const,
    readOnly: true as const,
    sceneMutation: false as const,
    simulationActive: false as const,
    diagnostics: SCENARIO_COMPARISON_DIAGNOSTICS,
  });

  latestScenarioComparisonFoundationRegistry = registry;
  return registry;
}

export function getScenarioComparisonFoundationRegistry(): ScenarioComparisonFoundationRegistry {
  return latestScenarioComparisonFoundationRegistry;
}

export function resetScenarioComparisonFoundationForTests(): void {
  latestScenarioComparisonFoundationRegistry = EMPTY_SCENARIO_COMPARISON_FOUNDATION_REGISTRY;
}

export const ScenarioComparisonFoundation = Object.freeze({
  buildScenarioComparisonFoundationRegistry,
  getScenarioComparisonFoundationRegistry,
  resetScenarioComparisonFoundationForTests,
});

export type { ScenarioComparisonPairKind };
