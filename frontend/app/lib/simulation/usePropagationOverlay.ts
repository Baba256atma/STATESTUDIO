"use client";

import type { SceneJson, SceneLoop } from "../sceneTypes";
import { usePropagationBridge } from "./usePropagationBridge";
import type { PropagationOverlayState } from "./propagationTypes";

export function usePropagationOverlay(params: {
  sceneJson: SceneJson | null;
  loops?: SceneLoop[] | null;
  selectedObjectId?: string | null;
  propagationPayload?: unknown;
  previewEnabled?: boolean;
}) {
  const {
    sceneJson,
    loops,
    selectedObjectId = null,
    propagationPayload,
    previewEnabled = true,
  } = params;
  const bridge = usePropagationBridge({
    sceneJson,
    loops,
    selectedObjectId,
    propagationPayload,
    previewEnabled,
  });

  return {
    propagationOverlay: bridge.propagationOverlay as PropagationOverlayState | null,
    setPropagationSource: bridge.setPropagationSource,
    clearPropagationOverlay: bridge.clearPropagation,
  };
}
