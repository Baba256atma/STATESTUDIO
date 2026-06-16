/**
 * SVIE:3:2 — Derive causal chains from advisory visual links (read-only).
 */

import type { SceneObject } from "../../sceneTypes.ts";
import type { SvieAdvisoryFindingInput, SvieAdvisoryVisualLink } from "./svieAdvisoryLinkFoundationContract.ts";
import type { SvieCauseChain, SvieCauseChainConnection, SvieCauseChainStep } from "./svieCauseChainVisualizationContract.ts";
import { readSceneObjectsFromJson } from "./svieRuntimeFoundationResolver.ts";
import { buildSvieRiskSnapshot } from "./svieRiskRuntime.ts";

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

function resolveOrderedObjectIds(input: {
  link: SvieAdvisoryVisualLink;
  finding?: SvieAdvisoryFindingInput | null;
  sceneIndex: ReadonlyMap<string, SceneObject>;
  riskScoreByObjectId: ReadonlyMap<string, number>;
}): readonly string[] {
  const explicitSteps = (input.finding as { causeChainSteps?: readonly string[] | null } | null)?.causeChainSteps;
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
    return Object.freeze([...new Set(ordered)]);
  }

  if (Array.isArray(input.finding?.linkedLabels) && input.finding.linkedLabels.length > 0) {
    const ordered: string[] = [];
    for (const label of input.finding.linkedLabels) {
      const resolved = resolveLabelToObjectId(String(label ?? ""), input.sceneIndex);
      if (resolved && input.link.objectIds.includes(resolved)) {
        ordered.push(resolved);
      }
    }
    if (ordered.length > 0) {
      return Object.freeze([...new Set(ordered)]);
    }
  }

  return Object.freeze(
    [...input.link.objectIds].sort((left, right) => {
      const leftScore = input.riskScoreByObjectId.get(left) ?? 0;
      const rightScore = input.riskScoreByObjectId.get(right) ?? 0;
      return leftScore - rightScore || left.localeCompare(right);
    })
  );
}

export function deriveCauseChain(input: {
  link: SvieAdvisoryVisualLink;
  finding?: SvieAdvisoryFindingInput | null;
  sceneJson?: unknown;
}): SvieCauseChain | null {
  if (input.link.objectIds.length === 0) return null;

  const sceneIndex = buildSceneObjectIndex(input.sceneJson);
  const riskSnapshot = buildSvieRiskSnapshot({ sceneJson: input.sceneJson });
  const riskScoreByObjectId = new Map(
    riskSnapshot.objects.map((entry) => [entry.objectId, entry.riskScore] as const)
  );

  const orderedObjectIds = resolveOrderedObjectIds({
    link: input.link,
    finding: input.finding ?? null,
    sceneIndex,
    riskScoreByObjectId,
  });
  if (orderedObjectIds.length === 0) return null;

  const steps: SvieCauseChainStep[] = orderedObjectIds.map((objectId, stepIndex) =>
    Object.freeze({
      stepIndex,
      objectId,
      label: resolveStepLabel(objectId, sceneIndex),
    })
  );

  const connections: SvieCauseChainConnection[] = [];
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
    recommendationId: input.link.recommendationId,
    steps: Object.freeze(steps),
    connections: Object.freeze(connections),
  });
}

export function deriveCauseChains(input: {
  links: readonly SvieAdvisoryVisualLink[];
  findings?: readonly SvieAdvisoryFindingInput[];
  sceneJson?: unknown;
}): readonly SvieCauseChain[] {
  const findingById = new Map(
    (input.findings ?? [])
      .map((finding) => [normalizeObjectId(finding.recommendationId), finding] as const)
      .filter((entry): entry is [string, SvieAdvisoryFindingInput] => Boolean(entry[0]))
  );

  return Object.freeze(
    input.links
      .map((link) =>
        deriveCauseChain({
          link,
          finding: findingById.get(link.recommendationId) ?? null,
          sceneJson: input.sceneJson,
        })
      )
      .filter((chain): chain is SvieCauseChain => chain !== null)
      .sort((left, right) => left.recommendationId.localeCompare(right.recommendationId))
  );
}

export function buildSvieCauseChainSignature(input: {
  links: readonly SvieAdvisoryVisualLink[];
  findings?: readonly SvieAdvisoryFindingInput[];
  sceneJson?: unknown;
}): string {
  const chains = deriveCauseChains(input);
  return `svie:cause-chain:${JSON.stringify(chains)}`;
}
