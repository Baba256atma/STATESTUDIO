import type { NexoraMode } from "./nexoraTypeCMode.ts";
import { getNexoraMode } from "./nexoraTypeCMode.ts";
import type { SceneJson, SceneLoop, SceneObject } from "../sceneTypes.ts";

export const TYPE_C_CORE_OBJECT_ID = "nexora_core";

function sceneObjects(scene: SceneJson | null | undefined): SceneObject[] {
  return Array.isArray(scene?.scene?.objects) ? scene.scene.objects : [];
}

export function hasTypeCCoreObject(scene: SceneJson | null | undefined): boolean {
  return sceneObjects(scene).some((object) => String(object?.id ?? "") === TYPE_C_CORE_OBJECT_ID);
}

export function buildTypeCCoreObject(): SceneObject {
  return {
    id: TYPE_C_CORE_OBJECT_ID,
    label: "Nexora Core",
    name: "Nexora Core",
    type: "sphere",
    role: "core",
    position: [0, 0, 0],
    color: "#38bdf8",
    scale: 1.08,
    emphasis: 0.72,
    tags: ["type_c", "core"],
    semantic: {
      canonical_name: "nexora_core",
      display_label: "Nexora Core",
      role: "core",
      category: "type_c",
      type: "type_c_core",
    },
    meta: {
      type: "type_c_core",
    },
  };
}

function createEmptyTypeCScene(): SceneJson {
  return {
    meta: { mode: "type_c" },
    state_vector: {},
    scene: {
      camera: { pos: [0, 3, 8], lookAt: [0, 0, 0], autoFrame: true },
      objects: [],
      loops: [],
      active_loop: null,
      loops_suggestions: [],
    },
  };
}

export function ensureTypeCCoreObject(
  scene: SceneJson | null | undefined,
  mode: NexoraMode = getNexoraMode()
): SceneJson | null {
  if (mode !== "type_c") return scene ?? null;

  const base = scene ?? createEmptyTypeCScene();
  const objects = sceneObjects(base);
  if (objects.length > 0) return base;

  return {
    ...base,
    meta: { ...(base.meta ?? {}), mode: "type_c" },
    scene: {
      ...base.scene,
      objects: [buildTypeCCoreObject()],
      loops: Array.isArray(base.scene?.loops) ? ([...base.scene.loops] as SceneLoop[]) : [],
    },
    state_vector: base.state_vector ?? {},
  };
}
