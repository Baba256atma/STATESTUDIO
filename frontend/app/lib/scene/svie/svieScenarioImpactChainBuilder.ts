/**
 * SVIE:4:4 — Build scenario impact propagation chains (read-only).
 */

import type { SceneObject } from "../../sceneTypes.ts";
import type { SvieScenarioInput, SvieScenarioVisualLink } from "./svieScenarioLinkFoundationContract.ts";
import { readSceneObjectsFromJson } from "./svieRuntimeFoundationResolver.ts";
import type {
  SvieScenarioImpactChain,
  SvieScenarioImpactChainConnection,
  SvieScenarioImpactChainStep,
} from "./svieScenarioImpactChainContract.ts";

function normalizeObjectId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
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

function resolveStepLabel(objectId: string, sceneIndex: ReadonlyMap<string, SceneObject>): string {
  const object = sceneIndex.get(objectId);
  const name = normalizeObjectId(object?.name);
  return name ?? objectId;
}

function uniqueOrderedObjectIds(objectIds: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const objectId of objectIds) {
    if (seen.has(objectId)) continue;
    seen.add(objectId);
    ordered.push(objectId);
  }
  return Object.freeze(ordered);
}

function resolveOrderedObjectIds(input: {
  link: SvieScenarioVisualLink;
  scenario?: SvieScenarioInput | null;
  sceneIndex: ReadonlyMap<string, SceneObject>;
}): readonly string[] {
  const scenario = input.scenario as
    | (SvieScenarioInput & {
        scenarioImpactSteps?: readonly string[] | null;
        propagationSteps?: readonly string[] | null;
        impactChainSteps?: readonly string[] | null;
      })
    | null
    | undefined;

  const explicitSteps =
    scenario?.scenarioImpactSteps ?? scenario?.propagationSteps ?? scenario?.impactChainSteps;
  if (Array.isArray(explicitSteps) && explicitSteps.length > 0) {
    const ordered: string[] = [];
    for (const step of explicitSteps) {
      const asId = normalizeObjectId(step);
      if (asId && input.link.objectIds.includes(asId)) {
        ordered.push(asId);
        continue;
      }
      const resolved = resolveLabelToObjectId(String(step ?? ""), input.sceneIndex);
      if (resolved && input.link.objectIds.includes(resolved)) {
        ordered.push(resolved);
      }
    }
    if (ordered.length > 0) return uniqueOrderedObjectIds(ordered);
  }

  if (Array.isArray(input.scenario?.linkedLabels) && input.scenario.linkedLabels.length > 0) {
    const ordered: string[] = [];
    for (const label of input.scenario.linkedLabels) {
      const resolved = resolveLabelToObjectId(String(label ?? ""), input.sceneIndex);
      if (resolved && input.link.objectIds.includes(resolved)) {
        ordered.push(resolved);
      }
    }
    if (ordered.length > 0) return uniqueOrderedObjectIds(ordered);
  }

  const byChangeStrength = [...input.link.objectIds].sort((left, right) => {
    const leftChanges = input.link.predictedChanges.filter((change) => change.objectId === left).length;
    const rightChanges = input.link.predictedChanges.filter((change) => change.objectId === right).length;
    return rightChanges - leftChanges || left.localeCompare(right);
  });

  return Object.freeze(byChangeStrength);
}

export function buildScenarioImpactChain(input: {
  link: SvieScenarioVisualLink;
  scenario?: SvieScenarioInput | null;
  sceneJson?: unknown;
}): SvieScenarioImpactChain | null {
  if (input.link.objectIds.length === 0) return null;

  const sceneIndex = buildSceneObjectIndex(input.sceneJson);
  const orderedObjectIds = resolveOrderedObjectIds({
    link: input.link,
    scenario: input.scenario ?? null,
    sceneIndex,
  });
  if (orderedObjectIds.length === 0) return null;

  const steps: SvieScenarioImpactChainStep[] = orderedObjectIds.map((objectId, stepIndex) =>
    Object.freeze({
      stepIndex,
      objectId,
      label: resolveStepLabel(objectId, sceneIndex),
      changeCount: input.link.predictedChanges.filter((change) => change.objectId === objectId).length,
    })
  );

  const connections: SvieScenarioImpactChainConnection[] = [];
  for (let index = 1; index < steps.length; index += 1) {
    const previous = steps[index - 1];
    const current = steps[index];
    if (!previous || !current) continue;
    connections.push(
      Object.freeze({
        stepIndex: index,
        fromObjectId: previous.objectId,
        toObjectId: current.objectId,
      })
    );
  }

  return Object.freeze({
    scenarioId: input.link.scenarioId,
    steps: Object.freeze(steps),
    connections: Object.freeze(connections),
    confidence: input.link.confidence,
  });
}

export function buildScenarioImpactChains(input: {
  links: readonly SvieScenarioVisualLink[];
  scenarios?: readonly SvieScenarioInput[];
  sceneJson?: unknown;
}): readonly SvieScenarioImpactChain[] {
  const scenarioById = new Map(
    (input.scenarios ?? [])
      .map((scenario) => [normalizeObjectId(scenario.scenarioId), scenario] as const)
      .filter((entry): entry is [string, SvieScenarioInput] => Boolean(entry[0]))
  );

  return Object.freeze(
    input.links
      .map((link) =>
        buildScenarioImpactChain({
          link,
          scenario: scenarioById.get(link.scenarioId) ?? null,
          sceneJson: input.sceneJson,
        })
      )
      .filter((chain): chain is SvieScenarioImpactChain => chain !== null)
      .sort((left, right) => left.scenarioId.localeCompare(right.scenarioId))
  );
}

export function buildSvieScenarioImpactChainSignature(input: {
  links: readonly SvieScenarioVisualLink[];
  scenarios?: readonly SvieScenarioInput[];
  sceneJson?: unknown;
}): string {
  const chains = buildScenarioImpactChains(input);
  return `svie:scenario-impact-chain:${JSON.stringify(chains)}`;
}
