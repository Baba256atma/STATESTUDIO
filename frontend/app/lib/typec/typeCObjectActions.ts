import { TYPE_C_CORE_OBJECT_ID } from "./typeCSceneBootstrap.ts";
import type { SceneJson, SceneLoop, SceneLoopEdge, SceneObject } from "../sceneTypes.ts";

export type TypeCObjectInput = {
  label: string;
  role?: string;
  prompt?: string;
};

const TYPE_C_LINK_LOOP_ID = "typec_core_links";

function normalizeLabel(label: string): string {
  return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function objectLabel(object: SceneObject): string {
  return String(object.label ?? object.name ?? object.id ?? "").trim();
}

function sceneObjects(scene: SceneJson | null | undefined): SceneObject[] {
  return Array.isArray(scene?.scene?.objects) ? scene.scene.objects : [];
}

function sceneLoops(scene: SceneJson | null | undefined): SceneLoop[] {
  return Array.isArray(scene?.scene?.loops) ? scene.scene.loops : [];
}

export function buildTypeCObject(input: TypeCObjectInput): SceneObject {
  const normalized = normalizeLabel(input.label);
  const id = `typec_${normalized || "object"}`;
  const label = input.label.trim() || "Type-C Object";
  const role = input.role?.trim() || "node";

  return {
    id,
    label,
    name: label,
    type: "box",
    role,
    position: [2.2, 0, 0],
    color: "#f8fafc",
    scale: 0.9,
    emphasis: 0.46,
    tags: ["type_c", role],
    semantic: {
      canonical_name: normalized || id,
      display_label: label,
      role,
      category: "type_c",
      type: "type_c_object",
    },
    meta: {
      type: "type_c_object",
      prompt: input.prompt?.slice(0, 240),
    },
  };
}

function hasObjectWithNormalizedLabel(objects: SceneObject[], label: string): boolean {
  const normalized = normalizeLabel(label);
  return objects.some((object) => normalizeLabel(objectLabel(object)) === normalized || String(object.id ?? "") === `typec_${normalized}`);
}

function hasEdge(loops: SceneLoop[], from: string, to: string): boolean {
  return loops.some((loop) => Array.isArray(loop.edges) && loop.edges.some((edge) => edge.from === from && edge.to === to));
}

function addEdgeToLoops(loops: SceneLoop[], edge: SceneLoopEdge): { loops: SceneLoop[]; added: boolean } {
  if (hasEdge(loops, edge.from, edge.to)) return { loops, added: false };

  const linkLoopIndex = loops.findIndex((loop) => loop.id === TYPE_C_LINK_LOOP_ID);
  if (linkLoopIndex >= 0) {
    return {
      added: true,
      loops: loops.map((loop, index) => index === linkLoopIndex ? { ...loop, edges: [...(loop.edges ?? []), edge] } : loop),
    };
  }

  return {
    added: true,
    loops: [
      ...loops,
      {
        id: TYPE_C_LINK_LOOP_ID,
        type: "stability_balance",
        label: "Type-C Core Links",
        status: "active",
        severity: 0.2,
        edges: [edge],
      },
    ],
  };
}

export function addTypeCObjectToScene(scene: SceneJson, objectInput: TypeCObjectInput): SceneJson {
  const label = objectInput.label.trim();
  if (!label) return scene;

  const objects = sceneObjects(scene);
  if (hasObjectWithNormalizedLabel(objects, label)) {
    if (process.env.NODE_ENV !== "production") console.log("[Nexora][TypeC][ObjectSkippedDuplicate]", { label });
    return scene;
  }

  const nextObject = buildTypeCObject(objectInput);
  const nextObjects = [...objects, nextObject];
  const hasCore = nextObjects.some((object) => object.id === TYPE_C_CORE_OBJECT_ID);
  let nextLoops = sceneLoops(scene);

  if (hasCore) {
    const edge = {
      from: TYPE_C_CORE_OBJECT_ID,
      to: nextObject.id,
      weight: 0.55,
      kind: "type_c_relation",
      label: "core relation",
      polarity: "positive",
    };
    const result = addEdgeToLoops(nextLoops, edge);
    nextLoops = result.loops;
    if (result.added && process.env.NODE_ENV !== "production") console.log("[Nexora][TypeC][EdgeAdded]", { from: edge.from, to: edge.to });
  }

  if (process.env.NODE_ENV !== "production") console.log("[Nexora][TypeC][ObjectAdded]", { id: nextObject.id, label });

  return {
    ...scene,
    meta: { ...(scene.meta ?? {}), mode: "type_c" },
    scene: {
      ...scene.scene,
      objects: nextObjects,
      loops: nextLoops,
    },
  };
}
