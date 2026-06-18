import {
  EMPTY_SCENARIO_REGISTRY,
  SCENARIO_GENERATION_DIAGNOSTICS,
  SCENARIO_GENERATION_RUNTIME_VERSION,
  SCENARIO_SUPPORTED_TYPES,
  SCENARIO_TYPE_LABELS,
  type ScenarioDefinition,
  type ScenarioGenerationBuildInput,
  type ScenarioImpact,
  type ScenarioImpactArea,
  type ScenarioRegistry,
  type ScenarioResult,
  type ScenarioType,
} from "./scenarioGenerationContract.ts";

type SceneRecord = Readonly<Record<string, unknown>>;

let latestScenarioRegistry: ScenarioRegistry = EMPTY_SCENARIO_REGISTRY;

const SCENARIO_DESCRIPTIONS: Readonly<Record<ScenarioType, string>> = Object.freeze({
  baseline: "Current-state trajectory derived from read-only scene intelligence.",
  alternative: "Alternate operating path with adjusted assumptions and dependencies.",
  risk: "Downside escalation path driven by elevated risk and dependency exposure.",
  opportunity: "Upside path highlighting recoverable capacity and growth signals.",
});

function asRecord(value: unknown): SceneRecord | null {
  return value && typeof value === "object" ? (value as SceneRecord) : null;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readSceneObjects(sceneJson: unknown): readonly unknown[] {
  const objects = (sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects;
  return Array.isArray(objects) ? objects : [];
}

function readSceneRelationships(sceneJson: unknown): readonly unknown[] {
  const relationships = (sceneJson as { scene?: { relationships?: unknown[] } } | null)?.scene
    ?.relationships;
  return Array.isArray(relationships) ? relationships : [];
}

function readSceneKpis(sceneJson: unknown): readonly unknown[] {
  const scene = (sceneJson as { scene?: Record<string, unknown> } | null)?.scene;
  if (!scene) return [];
  if (Array.isArray(scene.kpis)) return scene.kpis;
  if (Array.isArray(scene.metrics)) return scene.metrics;
  return [];
}

function readSceneRisks(sceneJson: unknown): readonly unknown[] {
  const risks = (sceneJson as { scene?: { risks?: unknown[] } } | null)?.scene?.risks;
  return Array.isArray(risks) ? risks : [];
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function readScore(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value >= 0 && value <= 1 ? clampScore(value * 100) : clampScore(value);
  }
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "critical" || normalized === "high") return 85;
  if (normalized === "medium" || normalized === "warning" || normalized === "moderate") return 60;
  if (normalized === "low") return 30;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return null;
  return parsed >= 0 && parsed <= 1 ? clampScore(parsed * 100) : clampScore(parsed);
}

function resolveObjectId(record: SceneRecord, index: number): string {
  return readString(record.id) || readString(record.objectId) || `object:${index + 1}`;
}

function resolveKpiId(record: SceneRecord, index: number): string {
  return readString(record.kpiId) || readString(record.id) || readString(record.key) || `kpi:${index + 1}`;
}

function objectRiskScore(record: SceneRecord): number {
  return (
    readScore(record.risk) ??
    readScore(record.riskScore) ??
    readScore(record.impact) ??
    readScore(metadata(record).risk) ??
    40
  );
}

function objectOpportunityScore(record: SceneRecord): number {
  return (
    readScore(record.opportunity) ??
    readScore(record.confidence) ??
    readScore(record.health) ??
    readScore(metadata(record).opportunity) ??
    50
  );
}

function metadata(record: SceneRecord): SceneRecord {
  return asRecord(record.metadata) ?? Object.freeze({});
}

function collectObjectIds(objects: readonly unknown[]): readonly string[] {
  return Object.freeze(
    objects
      .map((object, index) => {
        const record = asRecord(object);
        return record ? resolveObjectId(record, index) : null;
      })
      .filter((objectId): objectId is string => Boolean(objectId))
  );
}

function collectKpiIds(kpis: readonly unknown[]): readonly string[] {
  return Object.freeze(
    kpis
      .map((kpi, index) => {
        const record = asRecord(kpi);
        return record ? resolveKpiId(record, index) : null;
      })
      .filter((kpiId): kpiId is string => Boolean(kpiId))
  );
}

function resolveFocusObjectIds(
  objectIds: readonly string[],
  selectedObjectId: string | null | undefined
): readonly string[] {
  if (selectedObjectId && objectIds.includes(selectedObjectId)) {
    return Object.freeze([selectedObjectId]);
  }
  if (objectIds.length > 0) return Object.freeze([objectIds[0]]);
  return Object.freeze([]);
}

function averageScore(scores: readonly number[]): number {
  if (scores.length === 0) return 50;
  return clampScore(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function scenarioIdForType(scenarioType: ScenarioType): string {
  return `scenario:${scenarioType}`;
}

function impactAreasForType(
  scenarioType: ScenarioType,
  hasRelationships: boolean,
  hasKpis: boolean,
  hasRisks: boolean
): readonly ScenarioImpactArea[] {
  const areas: ScenarioImpactArea[] = ["objects", "operations"];
  if (hasRelationships) areas.push("relationships");
  if (hasKpis) areas.push("kpis");
  if (hasRisks || scenarioType === "risk") areas.push("risk");
  return Object.freeze(areas);
}

function impactedObjectsForType(
  scenarioType: ScenarioType,
  objects: readonly unknown[],
  objectIds: readonly string[]
): readonly string[] {
  if (objectIds.length === 0) return Object.freeze([]);

  if (scenarioType === "baseline" || scenarioType === "alternative") {
    return objectIds;
  }

  const ranked = objects
    .map((object, index) => {
      const record = asRecord(object);
      if (!record) return null;
      const objectId = resolveObjectId(record, index);
      const score =
        scenarioType === "risk" ? objectRiskScore(record) : objectOpportunityScore(record);
      return Object.freeze({ objectId, score });
    })
    .filter((entry): entry is Readonly<{ objectId: string; score: number }> => entry != null)
    .sort((left, right) => right.score - left.score);

  if (ranked.length === 0) return objectIds;
  const selected = ranked.slice(0, Math.max(1, Math.ceil(ranked.length / 2))).map((row) => row.objectId);
  return Object.freeze(selected);
}

function impactedKpisForType(
  scenarioType: ScenarioType,
  kpiIds: readonly string[]
): readonly string[] {
  if (kpiIds.length === 0) return Object.freeze([]);
  if (scenarioType === "baseline") return kpiIds;
  if (scenarioType === "alternative") {
    return Object.freeze(kpiIds.slice(0, Math.max(1, Math.ceil(kpiIds.length / 2))));
  }
  return kpiIds;
}

function baselineScoreForType(
  scenarioType: ScenarioType,
  objects: readonly unknown[],
  risks: readonly unknown[]
): number {
  const objectScores = objects
    .map((object) => asRecord(object))
    .filter((record): record is SceneRecord => record != null)
    .map((record) => {
      if (scenarioType === "risk") return objectRiskScore(record);
      if (scenarioType === "opportunity") return objectOpportunityScore(record);
      return readScore(record.health) ?? readScore(record.confidence) ?? 55;
    });

  const riskScores = risks
    .map((risk) => asRecord(risk))
    .filter((record): record is SceneRecord => record != null)
    .map((record) => readScore(record.severity) ?? readScore(record.score) ?? 50);

  if (scenarioType === "risk") {
    return averageScore([...objectScores, ...riskScores]);
  }
  if (scenarioType === "opportunity") {
    return averageScore(objectScores.length > 0 ? objectScores : [65]);
  }
  return averageScore(objectScores.length > 0 ? objectScores : [50]);
}

function severityForType(scenarioType: ScenarioType, baselineScore: number): number {
  if (scenarioType === "risk") return clampScore(Math.max(baselineScore, 70));
  if (scenarioType === "opportunity") return clampScore(100 - baselineScore);
  if (scenarioType === "alternative") return clampScore(Math.abs(55 - baselineScore) + 35);
  return clampScore(100 - baselineScore);
}

function confidenceForType(
  scenarioType: ScenarioType,
  objectCount: number,
  kpiCount: number
): number {
  const coverage = clampScore(objectCount * 12 + kpiCount * 8 + 40);
  if (scenarioType === "baseline") return clampScore(coverage + 10);
  if (scenarioType === "risk") return clampScore(coverage);
  if (scenarioType === "opportunity") return clampScore(coverage - 5);
  return clampScore(coverage - 8);
}

function summaryForType(
  scenarioType: ScenarioType,
  focusObjectIds: readonly string[],
  impactedObjectCount: number,
  impactedKpiCount: number
): string {
  const focusLabel =
    focusObjectIds.length > 0 ? `focus ${focusObjectIds.join(", ")}` : "enterprise-wide scope";
  if (scenarioType === "baseline") {
    return `Baseline scenario ready for ${focusLabel} across ${impactedObjectCount} objects and ${impactedKpiCount} KPIs.`;
  }
  if (scenarioType === "alternative") {
    return `Alternative scenario prepared with alternate assumptions for ${focusLabel}.`;
  }
  if (scenarioType === "risk") {
    return `Risk scenario highlights downside exposure across ${impactedObjectCount} impacted objects.`;
  }
  return `Opportunity scenario surfaces upside potential across ${impactedKpiCount} KPI signals.`;
}

function buildAssumptions(
  scenarioType: ScenarioType,
  focusObjectIds: readonly string[],
  objectCount: number,
  relationshipCount: number,
  riskCount: number
): Readonly<Record<string, unknown>> {
  return Object.freeze({
    scenarioType,
    focusObjectIds: Object.freeze([...focusObjectIds]),
    objectCount,
    relationshipCount,
    riskCount,
    readOnly: true,
    simulationActive: false,
  });
}

function createScenarioDefinition(
  scenarioType: ScenarioType,
  focusObjectIds: readonly string[],
  objectCount: number,
  relationshipCount: number,
  riskCount: number
): ScenarioDefinition {
  const scenarioId = scenarioIdForType(scenarioType);
  return Object.freeze({
    scenarioId,
    label: SCENARIO_TYPE_LABELS[scenarioType],
    scenarioType,
    description: SCENARIO_DESCRIPTIONS[scenarioType],
    assumptions: buildAssumptions(scenarioType, focusObjectIds, objectCount, relationshipCount, riskCount),
    focusObjectIds,
    foundationOnly: true,
    generationActive: false,
  });
}

function createScenarioImpact(
  definition: ScenarioDefinition,
  objects: readonly unknown[],
  objectIds: readonly string[],
  kpiIds: readonly string[],
  relationships: readonly unknown[],
  risks: readonly unknown[]
): ScenarioImpact {
  const impactedObjectIds = impactedObjectsForType(definition.scenarioType, objects, objectIds);
  const impactedKpiIds = impactedKpisForType(definition.scenarioType, kpiIds);
  const baselineScore = baselineScoreForType(definition.scenarioType, objects, risks);

  return Object.freeze({
    scenarioId: definition.scenarioId,
    scenarioType: definition.scenarioType,
    impactedObjectIds,
    impactedKpiIds,
    impactAreas: impactAreasForType(
      definition.scenarioType,
      relationships.length > 0,
      kpiIds.length > 0,
      risks.length > 0
    ),
    baselineScore,
    projectedScore: null,
    severity: severityForType(definition.scenarioType, baselineScore),
    confidence: confidenceForType(definition.scenarioType, objectIds.length, kpiIds.length),
    impactReady: true,
  });
}

function createScenarioResult(definition: ScenarioDefinition, impact: ScenarioImpact): ScenarioResult {
  return Object.freeze({
    scenarioId: definition.scenarioId,
    scenarioType: definition.scenarioType,
    label: definition.label,
    summary: summaryForType(
      definition.scenarioType,
      definition.focusObjectIds,
      impact.impactedObjectIds.length,
      impact.impactedKpiIds.length
    ),
    outcomeScore: null,
    definition,
    impact,
    evaluationReady: true,
    simulationActive: false,
  });
}

function buildCanonicalScenarioBundle(
  input: ScenarioGenerationBuildInput
): Readonly<{
  definitions: readonly ScenarioDefinition[];
  impacts: readonly ScenarioImpact[];
  results: readonly ScenarioResult[];
}> {
  const objects = input.objects ?? readSceneObjects(input.sceneJson);
  const relationships = input.relationships ?? readSceneRelationships(input.sceneJson);
  const kpis = input.kpis ?? readSceneKpis(input.sceneJson);
  const risks = input.risks ?? readSceneRisks(input.sceneJson);
  const objectIds = collectObjectIds(objects);
  const kpiIds = collectKpiIds(kpis);
  const focusObjectIds = resolveFocusObjectIds(objectIds, input.selectedObjectId);

  const definitions = Object.freeze(
    SCENARIO_SUPPORTED_TYPES.map((scenarioType) =>
      createScenarioDefinition(
        scenarioType,
        focusObjectIds,
        objectIds.length,
        relationships.length,
        risks.length
      )
    )
  );

  const impacts = Object.freeze(
    definitions.map((definition) =>
      createScenarioImpact(definition, objects, objectIds, kpiIds, relationships, risks)
    )
  );

  const results = Object.freeze(
    definitions.map((definition, index) => createScenarioResult(definition, impacts[index]))
  );

  return Object.freeze({ definitions, impacts, results });
}

export function buildScenarioRegistry(input: ScenarioGenerationBuildInput = {}): ScenarioRegistry {
  const customDefinitions = input.scenarioDefinitions ?? [];
  const bundle =
    customDefinitions.length > 0
      ? (() => {
          const impacts = Object.freeze(
            customDefinitions.map((definition) =>
              createScenarioImpact(definition, [], [], [], [], [])
            )
          );
          return Object.freeze({
            definitions: Object.freeze([...customDefinitions]),
            impacts,
            results: Object.freeze(
              customDefinitions.map((definition, index) =>
                createScenarioResult(definition, impacts[index])
              )
            ),
          });
        })()
      : buildCanonicalScenarioBundle(input);

  const definitionById = Object.freeze(
    bundle.definitions.reduce<Record<string, ScenarioDefinition>>((registry, definition) => {
      registry[definition.scenarioId] = definition;
      return registry;
    }, {})
  );
  const resultById = Object.freeze(
    bundle.results.reduce<Record<string, ScenarioResult>>((registry, result) => {
      registry[result.scenarioId] = result;
      return registry;
    }, {})
  );

  latestScenarioRegistry = Object.freeze({
    version: SCENARIO_GENERATION_RUNTIME_VERSION,
    definitions: bundle.definitions,
    impacts: bundle.impacts,
    results: bundle.results,
    definitionById,
    resultById,
    scenarioCount: bundle.definitions.length,
    supportedScenarioTypes: SCENARIO_SUPPORTED_TYPES,
    readOnly: true,
    sceneMutation: false,
    visualRendering: false,
    mrpMutation: false,
    generationActive: false,
    diagnostics: SCENARIO_GENERATION_DIAGNOSTICS,
  });

  return latestScenarioRegistry;
}

export function getScenarioRegistry(): ScenarioRegistry {
  return latestScenarioRegistry;
}

export function resetScenarioGenerationRuntimeForTests(): void {
  latestScenarioRegistry = EMPTY_SCENARIO_REGISTRY;
}

export const ScenarioGenerationRuntime = Object.freeze({
  buildScenarioRegistry,
  getScenarioRegistry,
});
