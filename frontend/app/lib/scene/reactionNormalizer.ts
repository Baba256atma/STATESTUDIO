import type { SceneJson, SceneObject } from "../sceneTypes";
import { normalizeUnifiedSceneReaction, type UnifiedSceneReaction } from "./unifiedReaction";

export function normalizeReactionForScene(
  reaction: UnifiedSceneReaction,
  scene: SceneJson | null | undefined
): UnifiedSceneReaction {
  const sceneObjectIds = Array.isArray(scene?.scene?.objects)
    ? scene.scene.objects
        .map((object: SceneObject, idx: number) => String(object?.id ?? object?.name ?? `${object?.type ?? "obj"}:${idx}`))
        .filter(Boolean)
    : [];
  return normalizeUnifiedSceneReaction(reaction, {
    sceneObjectIds,
    maxHighlightedObjectIds: 3,
  });
}

export function buildPanelFocusReaction(params: {
  objectId: string;
  reason?: string | null;
}): UnifiedSceneReaction {
  return normalizeUnifiedSceneReaction({
    source: "button",
    reason: params.reason ?? "Panel requested object focus.",
    highlightedObjectIds: [params.objectId],
    relatedObjectIds: [],
    primaryObjectId: params.objectId,
    dimUnrelatedObjects: false,
    riskSources: [],
    riskTargets: [],
    reactionMode: "focus",
    primaryStrength: 0.56,
    secondaryStrength: 0.24,
    primaryScale: 1.08,
    secondaryScale: 1.02,
    unrelatedScale: 1,
    unrelatedOpacity: 1,
    activeLoopId: null,
    loopSuggestions: [],
    actions: [],
    allowFocusMutation: true,
    sceneJson: null,
  });
}
