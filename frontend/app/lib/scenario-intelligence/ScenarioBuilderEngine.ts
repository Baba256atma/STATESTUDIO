import { buildScenarioRegistry } from "./ScenarioGenerationRuntime.ts";
import {
  EMPTY_SCENARIO_BLUEPRINT_REGISTRY,
  SCENARIO_BUILDER_DIAGNOSTICS,
  SCENARIO_BUILDER_ENGINE_VERSION,
  type ScenarioBaselineState,
  type ScenarioBlueprint,
  type ScenarioBlueprintRegistry,
  type ScenarioBuilderBuildInput,
  type ScenarioKpiChange,
  type ScenarioObjectChange,
  type ScenarioRelationshipChange,
  type ScenarioRiskChange,
} from "./scenarioBuilderContract.ts";
import type { ScenarioDefinition, ScenarioType } from "./scenarioGenerationContract.ts";

type SceneRecord = Readonly<Record<string, unknown>>;

let latestScenarioBlueprintRegistry: ScenarioBlueprintRegistry = EMPTY_SCENARIO_BLUEPRINT_REGISTRY;

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

function readNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
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

function resolveRelationshipId(record: SceneRecord, index: number): string {
  return readString(record.id) || readString(record.relationshipId) || `relationship:${index + 1}`;
}

function resolveKpiId(record: SceneRecord, index: number): string {
  return readString(record.kpiId) || readString(record.id) || readString(record.key) || `kpi:${index + 1}`;
}

function resolveRiskId(record: SceneRecord, index: number): string {
  return readString(record.riskId) || readString(record.id) || `risk:${index + 1}`;
}

function snapshotRecord(record: SceneRecord): Readonly<Record<string, unknown>> {
  return Object.freeze({ ...record });
}

function statesDiffer(
  baseline: Readonly<Record<string, unknown>>,
  proposed: Readonly<Record<string, unknown>>
): boolean {
  return JSON.stringify(baseline) !== JSON.stringify(proposed);
}

function buildBaselineState(
  objects: readonly unknown[],
  relationships: readonly unknown[],
  kpis: readonly unknown[],
  risks: readonly unknown[]
): ScenarioBaselineState {
  const objectSnapshots = Object.freeze(
    objects.reduce<Record<string, Readonly<Record<string, unknown>>>>((registry, object, index) => {
      const record = asRecord(object);
      if (!record) return registry;
      registry[resolveObjectId(record, index)] = snapshotRecord(record);
      return registry;
    }, {})
  );
  const relationshipSnapshots = Object.freeze(
    relationships.reduce<Record<string, Readonly<Record<string, unknown>>>>(
      (registry, relationship, index) => {
        const record = asRecord(relationship);
        if (!record) return registry;
        registry[resolveRelationshipId(record, index)] = snapshotRecord(record);
        return registry;
      },
      {}
    )
  );
  const kpiSnapshots = Object.freeze(
    kpis.reduce<Record<string, Readonly<Record<string, unknown>>>>((registry, kpi, index) => {
      const record = asRecord(kpi);
      if (!record) return registry;
      registry[resolveKpiId(record, index)] = snapshotRecord(record);
      return registry;
    }, {})
  );
  const riskSnapshots = Object.freeze(
    risks.reduce<Record<string, Readonly<Record<string, unknown>>>>((registry, risk, index) => {
      const record = asRecord(risk);
      if (!record) return registry;
      registry[resolveRiskId(record, index)] = snapshotRecord(record);
      return registry;
    }, {})
  );

  return Object.freeze({
    objectSnapshots,
    relationshipSnapshots,
    kpiSnapshots,
    riskSnapshots,
    objectCount: Object.keys(objectSnapshots).length,
    relationshipCount: Object.keys(relationshipSnapshots).length,
    kpiCount: Object.keys(kpiSnapshots).length,
    riskCount: Object.keys(riskSnapshots).length,
    preserved: true,
  });
}

function shouldChangeEntity(
  scenarioType: ScenarioType,
  entityId: string,
  focusObjectIds: readonly string[],
  index: number,
  total: number
): boolean {
  if (scenarioType === "baseline") return false;
  if (focusObjectIds.includes(entityId)) return true;
  if (scenarioType === "alternative") return index % 2 === 0;
  if (scenarioType === "risk") return index < Math.max(1, Math.ceil(total / 2));
  return index < Math.max(1, Math.ceil(total / 2));
}

function proposeObjectState(
  scenarioType: ScenarioType,
  baselineState: Readonly<Record<string, unknown>>
): Readonly<Record<string, unknown>> {
  if (scenarioType === "baseline") return baselineState;

  const next: Record<string, unknown> = { ...baselineState };
  const status = readString(baselineState.status).toLowerCase();

  if (scenarioType === "alternative") {
    next.status = ["active", "running", "online"].includes(status) ? "paused" : "active";
    next.activityLevel = readScore(baselineState.activityLevel) ?? 55;
  }
  if (scenarioType === "risk") {
    next.risk = "high";
    next.health = clampScore((readScore(baselineState.health) ?? 55) - 20);
    next.status = "degraded";
  }
  if (scenarioType === "opportunity") {
    next.opportunity = "high";
    next.health = clampScore((readScore(baselineState.health) ?? 55) + 15);
    next.confidence = clampScore((readScore(baselineState.confidence) ?? 60) + 10);
  }

  return Object.freeze(next);
}

function proposeRelationshipState(
  scenarioType: ScenarioType,
  baselineState: Readonly<Record<string, unknown>>
): Readonly<Record<string, unknown>> {
  if (scenarioType === "baseline") return baselineState;

  const next: Record<string, unknown> = { ...baselineState };
  if (scenarioType === "alternative") {
    next.confidence = clampScore((readScore(baselineState.confidence) ?? 60) - 15);
    next.status = readString(baselineState.status) || "adjusted";
  }
  if (scenarioType === "risk") {
    next.status = "broken";
    next.confidence = clampScore((readScore(baselineState.confidence) ?? 60) - 25);
  }
  if (scenarioType === "opportunity") {
    next.status = "healthy";
    next.confidence = clampScore((readScore(baselineState.confidence) ?? 60) + 15);
  }
  return Object.freeze(next);
}

function proposeKpiState(
  scenarioType: ScenarioType,
  baselineState: Readonly<Record<string, unknown>>
): Readonly<Record<string, unknown>> {
  if (scenarioType === "baseline") return baselineState;

  const next: Record<string, unknown> = { ...baselineState };
  const value = readNumber(baselineState.value) ?? readNumber(baselineState.current) ?? 50;
  const target = readNumber(baselineState.target) ?? value;

  if (scenarioType === "alternative") {
    next.value = clampScore(value * 0.95);
    next.target = target;
  }
  if (scenarioType === "risk") {
    next.value = clampScore(value * 0.85);
    next.direction = "down";
  }
  if (scenarioType === "opportunity") {
    next.value = clampScore(Math.min(100, value * 1.12));
    next.direction = "up";
  }
  return Object.freeze(next);
}

function proposeRiskState(
  scenarioType: ScenarioType,
  baselineState: Readonly<Record<string, unknown>>
): Readonly<Record<string, unknown>> {
  if (scenarioType === "baseline") return baselineState;

  const next: Record<string, unknown> = { ...baselineState };
  const severity = readScore(baselineState.severity) ?? readScore(baselineState.score) ?? 50;

  if (scenarioType === "alternative") {
    next.severity = clampScore(severity + 8);
  }
  if (scenarioType === "risk") {
    next.severity = clampScore(Math.min(100, severity + 20));
    next.status = "escalated";
  }
  if (scenarioType === "opportunity") {
    next.severity = clampScore(Math.max(0, severity - 15));
    next.status = "mitigated";
  }
  return Object.freeze(next);
}

function buildObjectChanges(
  definition: ScenarioDefinition,
  baselineState: ScenarioBaselineState
): readonly ScenarioObjectChange[] {
  const entries = Object.entries(baselineState.objectSnapshots);
  const changes = entries
    .map(([objectId, snapshot], index) => {
      if (!shouldChangeEntity(definition.scenarioType, objectId, definition.focusObjectIds, index, entries.length)) {
        return null;
      }
      const proposedState = proposeObjectState(definition.scenarioType, snapshot);
      if (!statesDiffer(snapshot, proposedState)) return null;
      return Object.freeze({
        changeId: `object-change:${definition.scenarioId}:${objectId}`,
        changeKind: "object" as const,
        objectId,
        label: readString(snapshot.label) || readString(snapshot.name) || objectId,
        baselineState: snapshot,
        proposedState,
        executable: true as const,
        applied: false as const,
      });
    })
    .filter((change) => change != null) as ScenarioObjectChange[];

  return Object.freeze(changes);
}

function buildRelationshipChanges(
  definition: ScenarioDefinition,
  baselineState: ScenarioBaselineState
): readonly ScenarioRelationshipChange[] {
  const entries = Object.entries(baselineState.relationshipSnapshots);
  const changes = entries
    .map(([relationshipId, snapshot], index) => {
      if (!shouldChangeEntity(definition.scenarioType, relationshipId, definition.focusObjectIds, index, entries.length)) {
        return null;
      }
      const proposedState = proposeRelationshipState(definition.scenarioType, snapshot);
      if (!statesDiffer(snapshot, proposedState)) return null;
      const sourceId = readString(snapshot.sourceId) || readString(snapshot.from) || relationshipId;
      const targetId = readString(snapshot.targetId) || readString(snapshot.to) || relationshipId;
      return Object.freeze({
        changeId: `relationship-change:${definition.scenarioId}:${relationshipId}`,
        changeKind: "relationship" as const,
        relationshipId,
        sourceId,
        targetId,
        baselineState: snapshot,
        proposedState,
        executable: true as const,
        applied: false as const,
      });
    })
    .filter((change) => change != null) as ScenarioRelationshipChange[];

  return Object.freeze(changes);
}

function buildKpiChanges(
  definition: ScenarioDefinition,
  baselineState: ScenarioBaselineState
): readonly ScenarioKpiChange[] {
  const entries = Object.entries(baselineState.kpiSnapshots);
  const changes = entries
    .map(([kpiId, snapshot], index) => {
      if (!shouldChangeEntity(definition.scenarioType, kpiId, definition.focusObjectIds, index, entries.length)) {
        return null;
      }
      const proposedState = proposeKpiState(definition.scenarioType, snapshot);
      if (!statesDiffer(snapshot, proposedState)) return null;
      return Object.freeze({
        changeId: `kpi-change:${definition.scenarioId}:${kpiId}`,
        changeKind: "kpi" as const,
        kpiId,
        label: readString(snapshot.label) || readString(snapshot.name) || kpiId,
        baselineState: snapshot,
        proposedState,
        executable: true as const,
        applied: false as const,
      });
    })
    .filter((change) => change != null) as ScenarioKpiChange[];

  return Object.freeze(changes);
}

function buildRiskChanges(
  definition: ScenarioDefinition,
  baselineState: ScenarioBaselineState
): readonly ScenarioRiskChange[] {
  const entries = Object.entries(baselineState.riskSnapshots);
  const changes = entries
    .map(([riskId, snapshot], index) => {
      if (!shouldChangeEntity(definition.scenarioType, riskId, definition.focusObjectIds, index, entries.length)) {
        return null;
      }
      const proposedState = proposeRiskState(definition.scenarioType, snapshot);
      if (!statesDiffer(snapshot, proposedState)) return null;
      return Object.freeze({
        changeId: `risk-change:${definition.scenarioId}:${riskId}`,
        changeKind: "risk" as const,
        riskId,
        label: readString(snapshot.label) || readString(snapshot.name) || riskId,
        baselineState: snapshot,
        proposedState,
        executable: true as const,
        applied: false as const,
      });
    })
    .filter((change) => change != null) as ScenarioRiskChange[];

  return Object.freeze(changes);
}

function buildScenarioBlueprint(
  definition: ScenarioDefinition,
  baselineState: ScenarioBaselineState
): ScenarioBlueprint {
  const objectChanges = buildObjectChanges(definition, baselineState);
  const relationshipChanges = buildRelationshipChanges(definition, baselineState);
  const kpiChanges = buildKpiChanges(definition, baselineState);
  const riskChanges = buildRiskChanges(definition, baselineState);
  const changeCount =
    objectChanges.length +
    relationshipChanges.length +
    kpiChanges.length +
    riskChanges.length;

  return Object.freeze({
    blueprintId: `blueprint:${definition.scenarioId}`,
    scenarioId: definition.scenarioId,
    scenarioType: definition.scenarioType,
    label: definition.label,
    definition,
    baselineState,
    objectChanges,
    relationshipChanges,
    kpiChanges,
    riskChanges,
    changeCount,
    executable: true,
    executionActive: false,
    sceneMutation: false,
  });
}

export function buildScenarioBlueprintRegistry(
  input: ScenarioBuilderBuildInput = {}
): ScenarioBlueprintRegistry {
  const objects = input.objects ?? readSceneObjects(input.sceneJson);
  const relationships = input.relationships ?? readSceneRelationships(input.sceneJson);
  const kpis = input.kpis ?? readSceneKpis(input.sceneJson);
  const risks = input.risks ?? readSceneRisks(input.sceneJson);
  const baselineState = buildBaselineState(objects, relationships, kpis, risks);
  const scenarioRegistry =
    input.scenarioRegistry ??
    buildScenarioRegistry({
      sceneJson: input.sceneJson,
      objects,
      relationships,
      kpis,
      risks,
      selectedObjectId: input.selectedObjectId,
    });

  const scenarioIds = input.scenarioIds
    ? new Set(input.scenarioIds)
    : null;
  const definitions = scenarioRegistry.definitions.filter((definition) =>
    scenarioIds ? scenarioIds.has(definition.scenarioId) : true
  );

  const blueprints = Object.freeze(
    definitions.map((definition) => buildScenarioBlueprint(definition, baselineState))
  );
  const blueprintById = Object.freeze(
    blueprints.reduce<Record<string, ScenarioBlueprint>>((registry, blueprint) => {
      registry[blueprint.blueprintId] = blueprint;
      return registry;
    }, {})
  );
  const blueprintByScenarioId = Object.freeze(
    blueprints.reduce<Record<string, ScenarioBlueprint>>((registry, blueprint) => {
      registry[blueprint.scenarioId] = blueprint;
      return registry;
    }, {})
  );

  latestScenarioBlueprintRegistry = Object.freeze({
    version: SCENARIO_BUILDER_ENGINE_VERSION,
    blueprints,
    blueprintById,
    blueprintByScenarioId,
    blueprintCount: blueprints.length,
    readOnly: true,
    sceneMutation: false,
    executionActive: false,
    diagnostics: SCENARIO_BUILDER_DIAGNOSTICS,
  });

  return latestScenarioBlueprintRegistry;
}

export function getScenarioBlueprintRegistry(): ScenarioBlueprintRegistry {
  return latestScenarioBlueprintRegistry;
}

export function resetScenarioBuilderEngineForTests(): void {
  latestScenarioBlueprintRegistry = EMPTY_SCENARIO_BLUEPRINT_REGISTRY;
}

export const ScenarioBuilderEngine = Object.freeze({
  buildScenarioBlueprintRegistry,
  getScenarioBlueprintRegistry,
});
