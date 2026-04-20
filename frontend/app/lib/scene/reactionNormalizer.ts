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

/**
 * Adjusts highlight scale and unrelated dimming from base policy using scanner fragility level.
 * Keeps motion bounded (no aggressive jumps).
 */
export function tuneUnifiedReactionForFragilityLevel(
  reaction: UnifiedSceneReaction,
  fragilityLevel: string | null | undefined
): UnifiedSceneReaction {
  const level = String(fragilityLevel ?? "low").trim().toLowerCase();
  let scaleMul = 1;
  let opacityDelta = 0;

  if (level === "critical") {
    scaleMul = 1.07;
    opacityDelta = -0.07;
  } else if (level === "high") {
    scaleMul = 1.042;
    opacityDelta = -0.042;
  } else if (level === "medium" || level === "moderate") {
    scaleMul = 1.018;
    opacityDelta = -0.018;
  } else {
    scaleMul = 0.985;
    opacityDelta = 0.028;
  }

  const nextPrimary =
    typeof reaction.primaryScale === "number"
      ? Math.min(1.28, Math.max(1.02, reaction.primaryScale * scaleMul))
      : reaction.primaryScale;
  const nextSecondary =
    typeof reaction.secondaryScale === "number"
      ? Math.min(1.14, Math.max(1, reaction.secondaryScale * (1 + (scaleMul - 1) * 0.55)))
      : reaction.secondaryScale;
  const nextUnrelatedOpacity =
    typeof reaction.unrelatedOpacity === "number"
      ? Math.max(0.52, Math.min(0.74, reaction.unrelatedOpacity + opacityDelta))
      : reaction.unrelatedOpacity;

  return {
    ...reaction,
    primaryScale: nextPrimary,
    secondaryScale: nextSecondary,
    unrelatedOpacity: nextUnrelatedOpacity,
  };
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
