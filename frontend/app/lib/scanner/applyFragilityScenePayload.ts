import type { SceneJson, SceneObject } from "../sceneTypes";
import type { FragilityScenePayload } from "../../types/fragilityScanner";

const DEFAULT_OBJECT_TYPE_BY_ID: Record<string, string> = {
  obj_inventory: "inventory",
  obj_delivery: "delivery",
  obj_risk_zone: "risk_zone",
  obj_supplier: "supplier",
  obj_buffer: "buffer",
  obj_bottleneck: "bottleneck",
};

function clampUnit(value: number | undefined): number | undefined {
  if (typeof value !== "number" || Number.isNaN(value)) return undefined;
  return Math.max(0, Math.min(1, value));
}

function prettyLabel(id: string): string {
  return id
    .replace(/^obj_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function buildFallbackObject(id: string, reason?: string, emphasis?: number): SceneObject {
  return {
    id,
    label: prettyLabel(id),
    type: DEFAULT_OBJECT_TYPE_BY_ID[id] ?? "scanner_focus",
    emphasis,
    scanner_reason: reason,
    tags: ["scanner_focus"],
  };
}

export function applyFragilityScenePayload(
  payload: FragilityScenePayload | null | undefined,
  currentScene: SceneJson | null
): SceneJson | null {
  if (!payload) return currentScene;

  const baseScene: SceneJson =
    currentScene ?? {
      meta: { version: "fragility-scan", generated_at: new Date().toISOString() },
      domain_model: { mode: "business" },
      state_vector: {},
      scene: {
        objects: [],
      },
    };

  const existingObjects = Array.isArray(baseScene.scene.objects) ? baseScene.scene.objects : [];
  const objectMap = new Map<string, SceneObject>(
    existingObjects.map((object) => [String(object.id), { ...object }])
  );

  for (const item of payload.objects ?? []) {
    if (!item?.id) continue;
    const nextEmphasis = clampUnit(item.emphasis);
    const current = objectMap.get(item.id);
    if (current) {
      objectMap.set(item.id, {
        ...current,
        emphasis:
          typeof current.emphasis === "number" && typeof nextEmphasis === "number"
            ? Math.max(current.emphasis, nextEmphasis)
            : nextEmphasis ?? current.emphasis,
        scanner_reason: item.reason ?? current.scanner_reason,
        scanner_highlighted: true,
      });
      continue;
    }
    objectMap.set(item.id, buildFallbackObject(item.id, item.reason, nextEmphasis));
  }

  const nextStateVector = {
    ...(baseScene.state_vector ?? {}),
    ...(typeof payload.state_vector?.fragility_score === "number"
      ? { fragility_score: payload.state_vector.fragility_score }
      : {}),
  };

  return {
    ...baseScene,
    meta: {
      ...(baseScene.meta ?? {}),
      scanner_active: true,
    },
    state_vector: nextStateVector,
    scene: {
      ...baseScene.scene,
      objects: Array.from(objectMap.values()),
      scanner_overlay: payload.scanner_overlay ?? baseScene.scene.scanner_overlay,
      scanner_highlights: payload.highlights ?? [],
      scanner_focus: payload.suggested_focus ?? [],
      scanner_state_vector: payload.state_vector ?? {},
    },
  };
}
