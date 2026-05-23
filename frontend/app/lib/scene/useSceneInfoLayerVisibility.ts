"use client";

import { useSyncExternalStore } from "react";

import {
  getSceneInfoLayerVisibility,
  subscribeSceneInfoLayerVisibility,
  type SceneInfoLayerVisibility,
} from "./sceneInfoLayerVisibility";

export function useSceneInfoLayerVisibility(): SceneInfoLayerVisibility {
  return useSyncExternalStore(subscribeSceneInfoLayerVisibility, getSceneInfoLayerVisibility, getSceneInfoLayerVisibility);
}
