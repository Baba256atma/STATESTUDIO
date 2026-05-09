import { addTypeCObjectToScene } from "./typeCObjectActions.ts";
import { TYPE_C_CORE_OBJECT_ID, buildTypeCCoreObject } from "./typeCSceneBootstrap.ts";
import type { SceneJson, SceneLoop, SceneLoopEdge, SceneObject } from "../sceneTypes.ts";

const TYPE_C_LINK_LOOP_ID = "typec_core_links";

function normalizeLabel(label: string): string {
  return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function objectLabel(object: SceneObject): string {
  return String(object.label ?? object.name ?? object.id ?? "").trim();
}

function objectIdForLabel(label: string): string {
  return `typec_${normalizeLabel(label)}`;
}

function sceneObjects(scene: SceneJson | null | undefined): SceneObject[] {
  return Array.isArray(scene?.scene?.objects) ? scene.scene.objects : [];
}

function sceneLoops(scene: SceneJson | null | undefined): SceneLoop[] {
  return Array.isArray(scene?.scene?.loops) ? scene.scene.loops : [];
}

function uniqueValidLabels(labels: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const raw of labels) {
    const label = String(raw ?? "").trim();
    const key = normalizeLabel(label);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(label);
  }

  return result;
}

function findObjectIdByLabel(scene: SceneJson, label: string): string | null {
  const normalized = normalizeLabel(label);
  const expectedId = objectIdForLabel(label);
  const found = sceneObjects(scene).find((object) => {
    const id = String(object.id ?? "");
    return id === expectedId || normalizeLabel(objectLabel(object)) === normalized;
  });
  return found?.id ? String(found.id) : null;
}

function hasEdge(loops: SceneLoop[], from: string, to: string): boolean {
  return loops.some((loop) => Array.isArray(loop.edges) && loop.edges.some((edge) => edge.from === from && edge.to === to));
}

function addEdgeToLoops(
  loops: SceneLoop[],
  edge: SceneLoopEdge,
  logKey: "[Nexora][TypeC][EdgeAdded]" | "[Nexora][TypeC][ChainEdgeAdded]"
): { loops: SceneLoop[]; added: boolean } {
  if (hasEdge(loops, edge.from, edge.to)) return { loops, added: false };

  const linkLoopIndex = loops.findIndex((loop) => loop.id === TYPE_C_LINK_LOOP_ID);
  const linkLoop: SceneLoop = {
    id: TYPE_C_LINK_LOOP_ID,
    type: "stability_balance",
    label: "Type-C Core Links",
    status: "active",
    severity: 0.2,
    edges: [edge],
  };
  const nextLoops =
    linkLoopIndex >= 0
      ? loops.map((loop, index) => index === linkLoopIndex ? { ...loop, edges: [...(loop.edges ?? []), edge] } : loop)
      : [...loops, linkLoop];

  if (process.env.NODE_ENV !== "production") console.log(logKey, { from: edge.from, to: edge.to });
  return { loops: nextLoops, added: true };
}

function ensureCoreObjectForModeling(scene: SceneJson): SceneJson {
  if (sceneObjects(scene).some((object) => String(object.id ?? "") === TYPE_C_CORE_OBJECT_ID)) return scene;

  return {
    ...scene,
    meta: { ...(scene.meta ?? {}), mode: "type_c" },
    scene: {
      ...scene.scene,
      objects: [...sceneObjects(scene), buildTypeCCoreObject()],
      loops: sceneLoops(scene),
    },
    state_vector: scene.state_vector ?? {},
  };
}

function ensureCoreEdge(scene: SceneJson, objectId: string): SceneJson {
  if (!objectId || objectId === TYPE_C_CORE_OBJECT_ID) return scene;
  const objects = sceneObjects(scene);
  const hasCore = objects.some((object) => String(object.id ?? "") === TYPE_C_CORE_OBJECT_ID);
  const hasTarget = objects.some((object) => String(object.id ?? "") === objectId);
  if (!hasCore || !hasTarget) return scene;

  const edge = {
    from: TYPE_C_CORE_OBJECT_ID,
    to: objectId,
    weight: 0.55,
    kind: "type_c_relation",
    label: "core relation",
    polarity: "positive",
  };
  const result = addEdgeToLoops(sceneLoops(scene), edge, "[Nexora][TypeC][EdgeAdded]");
  if (!result.added) return scene;

  return {
    ...scene,
    scene: {
      ...scene.scene,
      loops: result.loops,
    },
  };
}

function ensureChainEdge(scene: SceneJson, from: string, to: string): SceneJson {
  if (!from || !to || from === to) return scene;
  const objects = sceneObjects(scene);
  const hasFrom = objects.some((object) => String(object.id ?? "") === from);
  const hasTo = objects.some((object) => String(object.id ?? "") === to);
  if (!hasFrom || !hasTo) return scene;

  const edge = {
    from,
    to,
    weight: 0.62,
    kind: "type_c_flow",
    label: "system flow",
    polarity: "positive",
  };
  const result = addEdgeToLoops(sceneLoops(scene), edge, "[Nexora][TypeC][ChainEdgeAdded]");
  if (!result.added) return scene;

  return {
    ...scene,
    scene: {
      ...scene.scene,
      loops: result.loops,
    },
  };
}

export function addTypeCSystemModelToScene(scene: SceneJson, labels: string[]): SceneJson {
  const validLabels = uniqueValidLabels(labels);
  if (validLabels.length === 0) return scene;

  let next = ensureCoreObjectForModeling(scene);
  if (validLabels.length < 2) {
    const withObject = addTypeCObjectToScene(next, { label: validLabels[0] });
    const objectId = findObjectIdByLabel(withObject, validLabels[0]);
    next = objectId ? ensureCoreEdge(withObject, objectId) : withObject;
    return next;
  }

  for (const label of validLabels) {
    next = addTypeCObjectToScene(next, { label });
    const objectId = findObjectIdByLabel(next, label);
    if (objectId) next = ensureCoreEdge(next, objectId);
  }

  for (let index = 0; index < validLabels.length - 1; index += 1) {
    const from = findObjectIdByLabel(next, validLabels[index]);
    const to = findObjectIdByLabel(next, validLabels[index + 1]);
    if (from && to) next = ensureChainEdge(next, from, to);
  }

  if (next === scene) {
    if (process.env.NODE_ENV !== "production") console.log("[Nexora][TypeC][SystemModelSkippedDuplicate]", { labels: validLabels });
    return scene;
  }

  if (process.env.NODE_ENV !== "production") console.log("[Nexora][TypeC][SystemModelAdded]", { labels: validLabels });
  return {
    ...next,
    meta: { ...(next.meta ?? {}), mode: "type_c" },
  };
}
