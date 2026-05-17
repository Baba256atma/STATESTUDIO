/**
 * D7:1:3 — Directional propagation graph (consumer-only; no scene mutation).
 */

import type { SceneJson, SceneLoop, SceneObject } from "../sceneTypes.ts";

export interface SimulationPropagationEdge {
  from: string;
  to: string;
  relationType?: string;
  weight?: number;
}

export interface SimulationObjectGraphNode {
  objectId: string;
  dependencies?: string[];
  label?: string;
}

export interface SimulationObjectGraph {
  nodes: Readonly<Record<string, SimulationObjectGraphNode>>;
  edges: readonly SimulationPropagationEdge[];
}

function normalizeId(value: unknown): string {
  return String(value ?? "").trim();
}

function collectObjectIds(objects: SceneObject[] | undefined): string[] {
  if (!Array.isArray(objects)) return [];
  const ids: string[] = [];
  for (let i = 0; i < objects.length; i += 1) {
    const obj = objects[i];
    const id = normalizeId(obj?.id ?? obj?.name ?? `${obj?.type ?? "obj"}:${i}`);
    if (id) ids.push(id);
  }
  return ids;
}

function edgeKey(edge: SimulationPropagationEdge): string {
  return `${edge.from}|${edge.to}|${edge.relationType ?? "depends"}`;
}

/** Build a deterministic directed graph from scene relationships (read-only). */
export function buildSimulationObjectGraphFromScene(
  sceneJson: SceneJson | null | undefined
): SimulationObjectGraph {
  const nodes: Record<string, SimulationObjectGraphNode> = {};
  const edgeMap = new Map<string, SimulationPropagationEdge>();

  const objects = sceneJson?.scene?.objects ?? [];
  const objectIds = collectObjectIds(objects);

  for (let i = 0; i < objects.length; i += 1) {
    const obj = objects[i]!;
    const objectId = normalizeId(obj.id ?? obj.name ?? `${obj.type ?? "obj"}:${i}`);
    if (!objectId) continue;
    const deps = Array.isArray(obj.dependencies)
      ? obj.dependencies.map(normalizeId).filter(Boolean)
      : Array.isArray(obj.semantic?.dependencies)
        ? obj.semantic!.dependencies!.map(normalizeId).filter(Boolean)
        : [];
    nodes[objectId] = {
      objectId,
      dependencies: deps.length ? [...deps].sort() : undefined,
      label: normalizeId(obj.label ?? obj.name) || undefined,
    };
    for (const dep of deps) {
      const edge: SimulationPropagationEdge = {
        from: dep,
        to: objectId,
        relationType: "dependency",
        weight: 1,
      };
      edgeMap.set(edgeKey(edge), edge);
    }
  }

  const relations = (sceneJson as { scene?: { relations?: unknown[] } } | null)?.scene?.relations;
  if (Array.isArray(relations)) {
    for (const rel of relations) {
      const r = rel as Record<string, unknown>;
      const from = normalizeId(r.from ?? r.source);
      const to = normalizeId(r.to ?? r.target);
      if (!from || !to) continue;
      const edge: SimulationPropagationEdge = {
        from,
        to,
        relationType: normalizeId(r.relationType ?? r.type) || "relation",
        weight: Number.isFinite(Number(r.strength)) ? Number(r.strength) : 1,
      };
      edgeMap.set(edgeKey(edge), edge);
    }
  }

  const loops: SceneLoop[] = Array.isArray(sceneJson?.scene?.loops) ? sceneJson!.scene!.loops! : [];
  for (const loop of loops) {
    const loopEdges = Array.isArray(loop?.edges) ? loop.edges : [];
    for (const le of loopEdges) {
      const from = normalizeId(le?.from);
      const to = normalizeId(le?.to);
      if (!from || !to) continue;
      const edge: SimulationPropagationEdge = {
        from,
        to,
        relationType: normalizeId(loop.type) || "loop",
        weight: Number.isFinite(Number(le?.weight)) ? Number(le.weight) : Number(loop.strength ?? 1),
      };
      edgeMap.set(edgeKey(edge), edge);
    }
  }

  for (const id of objectIds) {
    if (!nodes[id]) nodes[id] = { objectId: id };
  }

  const edges = [...edgeMap.values()].sort((a, b) => edgeKey(a).localeCompare(edgeKey(b)));
  return { nodes, edges };
}

/** Outgoing edges from a node (deterministic order). */
export function getOutgoingPropagationEdges(
  graph: SimulationObjectGraph,
  objectId: string
): SimulationPropagationEdge[] {
  const id = normalizeId(objectId);
  return graph.edges.filter((e) => e.from === id);
}

/** Incoming edges to a node (dependency upstream). */
export function getIncomingPropagationEdges(
  graph: SimulationObjectGraph,
  objectId: string
): SimulationPropagationEdge[] {
  const id = normalizeId(objectId);
  return graph.edges.filter((e) => e.to === id);
}

export function reconstructPropagationPath(
  sourceObjectId: string,
  traversedObjectIds: readonly string[],
  totalIntensity: number,
  depth: number
): import("./simulationPropagationTypes.ts").SimulationPropagationPath {
  return {
    sourceObjectId,
    traversedObjectIds: [...traversedObjectIds],
    totalIntensity,
    depth,
  };
}
