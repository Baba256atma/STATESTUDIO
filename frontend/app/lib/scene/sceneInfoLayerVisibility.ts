/**
 * E2:8 — Canonical scene layer visibility (single source of truth).
 * Layer toggles do not mutate scene contracts; wiring to SceneRenderer comes in later prompts.
 */

export const SCENE_INFO_LAYER_KEYS = [
  "suppliers",
  "facilities",
  "inventory",
  "logistics",
  "markets",
  "events",
] as const;

export type SceneInfoLayerKey = (typeof SCENE_INFO_LAYER_KEYS)[number];

export type SceneInfoLayerVisibility = Record<SceneInfoLayerKey, boolean>;

export const SCENE_INFO_LAYER_LABELS: Record<SceneInfoLayerKey, string> = {
  suppliers: "Suppliers",
  facilities: "Facilities",
  inventory: "Inventory",
  logistics: "Logistics",
  markets: "Markets",
  events: "Events",
};

const DEFAULT_SCENE_INFO_LAYER_VISIBILITY: SceneInfoLayerVisibility = {
  suppliers: true,
  facilities: true,
  inventory: true,
  logistics: true,
  markets: true,
  events: true,
};

let layerVisibilityState: SceneInfoLayerVisibility = { ...DEFAULT_SCENE_INFO_LAYER_VISIBILITY };
const layerVisibilityListeners = new Set<() => void>();

function emitLayerVisibilityChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("nexora:scene-layer-visibility-changed", {
      detail: { visibility: { ...layerVisibilityState } },
    })
  );
}

export function getSceneInfoLayerVisibility(): SceneInfoLayerVisibility {
  return layerVisibilityState;
}

export function subscribeSceneInfoLayerVisibility(listener: () => void): () => void {
  layerVisibilityListeners.add(listener);
  return () => layerVisibilityListeners.delete(listener);
}

function notifyLayerVisibilityListeners(): void {
  layerVisibilityListeners.forEach((listener) => listener());
}

export function setSceneInfoLayerVisibility(key: SceneInfoLayerKey, visible: boolean): void {
  if (layerVisibilityState[key] === visible) return;
  layerVisibilityState = { ...layerVisibilityState, [key]: visible };
  notifyLayerVisibilityListeners();
  emitLayerVisibilityChanged();
}

export function resetSceneInfoLayerVisibilityForTests(): void {
  layerVisibilityState = { ...DEFAULT_SCENE_INFO_LAYER_VISIBILITY };
  layerVisibilityListeners.clear();
}
