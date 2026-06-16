/**
 * SVIE:4:1 — Scenario → scene object link resolver (read-only).
 */

import type { SceneObject } from "../../sceneTypes.ts";
import { readSceneObjectsFromJson } from "./svieRuntimeFoundationResolver.ts";
import type {
  SvieScenarioInput,
  SvieScenarioLinkSnapshot,
  SvieScenarioObjectImpactInput,
  SvieScenarioPredictedChange,
  SvieScenarioPredictedChangeMetric,
  SvieScenarioVisualContext,
  SvieScenarioVisualLink,
} from "./svieScenarioLinkFoundationContract.ts";

function normalizeObjectId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeMetric(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    const normalized = value <= 1 ? value : value / 100;
    return Math.round(Math.min(1, Math.max(0, normalized)) * 1000) / 1000;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    const parsed = Number(trimmed);
    if (Number.isFinite(parsed)) {
      return normalizeMetric(parsed, fallback);
    }
    const lower = trimmed.toLowerCase();
    if (lower === "very_high" || lower === "high") return 0.85;
    if (lower === "moderate" || lower === "medium") return 0.55;
    if (lower === "low") return 0.3;
  }
  return fallback;
}

function buildSceneObjectIndex(sceneJson: unknown): ReadonlyMap<string, SceneObject> {
  const objects = readSceneObjectsFromJson(sceneJson);
  const index = new Map<string, SceneObject>();
  for (const object of objects) {
    const id = normalizeObjectId(object.id);
    if (id) index.set(id, object);
    const name = normalizeObjectId(object.name);
    if (name) index.set(name.toLowerCase(), object);
  }
  return index;
}

function resolveLabelToObjectId(label: string, sceneIndex: ReadonlyMap<string, SceneObject>): string | null {
  const normalized = label.trim().toLowerCase();
  if (!normalized) return null;

  for (const [key, object] of sceneIndex.entries()) {
    const objectId = normalizeObjectId(object.id);
    const objectName = normalizeObjectId(object.name)?.toLowerCase();
    if (key === normalized || objectId?.toLowerCase() === normalized || objectName === normalized) {
      return objectId;
    }
  }
  return null;
}

function buildPredictedChange(
  objectId: string,
  metric: SvieScenarioPredictedChangeMetric,
  before: unknown,
  after: unknown
): SvieScenarioPredictedChange | null {
  const beforeValue = typeof before === "number" && Number.isFinite(before) ? before : undefined;
  const afterValue = typeof after === "number" && Number.isFinite(after) ? after : undefined;
  if (beforeValue === undefined && afterValue === undefined) return null;

  const delta =
    beforeValue !== undefined && afterValue !== undefined
      ? Math.round((afterValue - beforeValue) * 1000) / 1000
      : undefined;

  return Object.freeze({
    objectId,
    metric,
    before: beforeValue,
    after: afterValue,
    delta,
  });
}

export function collectScenarioObjectIds(
  scenario: SvieScenarioInput,
  sceneIndex: ReadonlyMap<string, SceneObject>
): readonly string[] {
  const collected = new Set<string>();

  const idFields = [
    scenario.objectIds,
    scenario.affectedObjectIds,
    scenario.relatedObjectIds,
    scenario.linkedObjectIds,
  ];

  for (const field of idFields) {
    if (!Array.isArray(field)) continue;
    for (const entry of field) {
      const objectId = normalizeObjectId(entry);
      if (!objectId) continue;
      if (sceneIndex.size === 0 || sceneIndex.has(objectId)) {
        collected.add(objectId);
      }
    }
  }

  if (Array.isArray(scenario.linkedLabels)) {
    for (const label of scenario.linkedLabels) {
      const resolved = resolveLabelToObjectId(String(label ?? ""), sceneIndex);
      if (resolved) collected.add(resolved);
    }
  }

  if (Array.isArray(scenario.objectImpacts)) {
    for (const impact of scenario.objectImpacts) {
      const objectId = normalizeObjectId(impact.objectId);
      if (!objectId) continue;
      if (sceneIndex.size === 0 || sceneIndex.has(objectId)) {
        collected.add(objectId);
      }
    }
  }

  if (Array.isArray(scenario.predictedChanges)) {
    for (const change of scenario.predictedChanges) {
      const objectId = normalizeObjectId(change.objectId);
      if (!objectId) continue;
      if (sceneIndex.size === 0 || sceneIndex.has(objectId)) {
        collected.add(objectId);
      }
    }
  }

  return Object.freeze([...collected].sort((left, right) => left.localeCompare(right)));
}

export function derivePredictedChangesFromImpacts(
  impacts: readonly SvieScenarioObjectImpactInput[]
): readonly SvieScenarioPredictedChange[] {
  const changes: SvieScenarioPredictedChange[] = [];

  for (const impact of impacts) {
    const objectId = normalizeObjectId(impact.objectId);
    if (!objectId) continue;

    const riskChange = buildPredictedChange(objectId, "risk", impact.beforeRisk, impact.afterRisk);
    if (riskChange) changes.push(riskChange);

    const activityChange = buildPredictedChange(
      objectId,
      "activity",
      impact.beforeActivity,
      impact.afterActivity
    );
    if (activityChange) changes.push(activityChange);

    const stabilityChange = buildPredictedChange(
      objectId,
      "stability",
      impact.beforeStability,
      impact.afterStability
    );
    if (stabilityChange) changes.push(stabilityChange);
  }

  return Object.freeze(
    changes.sort(
      (left, right) =>
        left.objectId.localeCompare(right.objectId) || left.metric.localeCompare(right.metric)
    )
  );
}

export function collectScenarioPredictedChanges(
  scenario: SvieScenarioInput,
  sceneIndex: ReadonlyMap<string, SceneObject>
): readonly SvieScenarioPredictedChange[] {
  if (Array.isArray(scenario.predictedChanges) && scenario.predictedChanges.length > 0) {
    const changes: SvieScenarioPredictedChange[] = [];
    for (const change of scenario.predictedChanges) {
      const objectId = normalizeObjectId(change.objectId);
      if (!objectId) continue;
      if (sceneIndex.size > 0 && !sceneIndex.has(objectId)) continue;
      changes.push(
        Object.freeze({
          objectId,
          metric: change.metric,
          before: change.before,
          after: change.after,
          delta: change.delta,
        })
      );
    }
    return Object.freeze(
      changes.sort(
        (left, right) =>
          left.objectId.localeCompare(right.objectId) || left.metric.localeCompare(right.metric)
      )
    );
  }

  if (Array.isArray(scenario.objectImpacts) && scenario.objectImpacts.length > 0) {
    const validImpacts = scenario.objectImpacts.filter((impact) => {
      const objectId = normalizeObjectId(impact.objectId);
      return objectId && (sceneIndex.size === 0 || sceneIndex.has(objectId));
    });
    return derivePredictedChangesFromImpacts(validImpacts);
  }

  return Object.freeze([]);
}

export function buildScenarioVisualLink(
  scenario: SvieScenarioInput,
  sceneIndex: ReadonlyMap<string, SceneObject>
): SvieScenarioVisualLink | null {
  const scenarioId = normalizeObjectId(scenario.scenarioId);
  if (!scenarioId) return null;

  const objectIds = collectScenarioObjectIds(scenario, sceneIndex);
  const predictedChanges = collectScenarioPredictedChanges(scenario, sceneIndex);

  return Object.freeze({
    scenarioId,
    objectIds,
    predictedChanges,
    confidence: normalizeMetric(scenario.confidence, 0),
  });
}

export function resolveScenarioVisualContext(
  scenario: SvieScenarioInput,
  sceneIndex: ReadonlyMap<string, SceneObject>
): SvieScenarioVisualContext | null {
  const link = buildScenarioVisualLink(scenario, sceneIndex);
  if (!link) return null;

  const label = normalizeObjectId(scenario.label) ?? undefined;
  const simulationSource = normalizeObjectId(scenario.simulationSource) ?? undefined;

  return Object.freeze({
    scenarioId: link.scenarioId,
    label,
    link,
    simulationSource,
  });
}

export function buildSvieScenarioLinkSignature(input: {
  scenarios: readonly SvieScenarioInput[];
  sceneJson?: unknown;
}): string {
  const sceneObjects = readSceneObjectsFromJson(input.sceneJson);
  const scenarioSignature = input.scenarios
    .map((scenario) =>
      JSON.stringify({
        scenarioId: scenario.scenarioId,
        objectIds: scenario.objectIds ?? null,
        affectedObjectIds: scenario.affectedObjectIds ?? null,
        relatedObjectIds: scenario.relatedObjectIds ?? null,
        linkedObjectIds: scenario.linkedObjectIds ?? null,
        linkedLabels: scenario.linkedLabels ?? null,
        predictedChanges: scenario.predictedChanges ?? null,
        objectImpacts: scenario.objectImpacts ?? null,
        confidence: scenario.confidence ?? null,
        simulationSource: scenario.simulationSource ?? null,
      })
    )
    .join("|");
  const sceneSignature = sceneObjects.map((object) => normalizeObjectId(object.id)).join(",");
  return `svie:scenario-link:${scenarioSignature}:${sceneSignature}`;
}

export function resolveSvieScenarioLinkSnapshot(
  input: {
    scenarios?: readonly SvieScenarioInput[];
    sceneJson?: unknown;
  },
  generatedAt: number
): SvieScenarioLinkSnapshot {
  const scenarios = Array.isArray(input.scenarios) ? input.scenarios : [];
  const sceneIndex = buildSceneObjectIndex(input.sceneJson);
  const linkByScenarioId: Record<string, SvieScenarioVisualLink> = {};
  const contextByScenarioId: Record<string, SvieScenarioVisualContext> = {};

  for (const scenario of scenarios) {
    const context = resolveScenarioVisualContext(scenario, sceneIndex);
    if (!context) continue;
    linkByScenarioId[context.scenarioId] = context.link;
    contextByScenarioId[context.scenarioId] = context;
  }

  const links = Object.freeze(
    Object.values(linkByScenarioId).sort((left, right) => left.scenarioId.localeCompare(right.scenarioId))
  );
  const contexts = Object.freeze(
    Object.values(contextByScenarioId).sort((left, right) => left.scenarioId.localeCompare(right.scenarioId))
  );

  return Object.freeze({
    links,
    linkByScenarioId: Object.freeze(linkByScenarioId),
    contexts,
    contextByScenarioId: Object.freeze(contextByScenarioId),
    generatedAt,
    signature: buildSvieScenarioLinkSignature({ scenarios, sceneJson: input.sceneJson }),
  });
}

export function readScenariosFromSceneJson(sceneJson: unknown): readonly SvieScenarioInput[] {
  const payload = sceneJson as
    | {
        svie?: {
          scenarios?: readonly SvieScenarioInput[];
          scenarioLinks?: readonly SvieScenarioInput[];
          scenarioOutcomes?: readonly SvieScenarioInput[];
        };
        scenario_links?: readonly SvieScenarioInput[];
        scenario_outcomes?: readonly SvieScenarioInput[];
      }
    | null
    | undefined;

  const scenarios =
    payload?.svie?.scenarios ??
    payload?.svie?.scenarioLinks ??
    payload?.svie?.scenarioOutcomes ??
    payload?.scenario_links ??
    payload?.scenario_outcomes;

  return Array.isArray(scenarios) ? Object.freeze([...scenarios]) : Object.freeze([]);
}
