/**
 * Stable prep for post-chat success paths (no React, no setState).
 * HomeScreen owns when to call these and applies results locally.
 */

import type { IntentKind } from "../lib/router/intentRouterTypes";
import type { SceneJson } from "../lib/sceneTypes";
import type { UnifiedSceneReaction } from "../lib/scene/unifiedReaction";

export function reactionModeHintFromIntent(
  intent: IntentKind
): "focus" | "risk" | "propagation" | "decision" | null {
  if (intent === "fragility_scan") return "risk";
  if (intent === "simulation_run") return "propagation";
  if (intent === "strategy_advice") return "decision";
  if (intent === "object_focus") return "focus";
  return null;
}

/** Prefer view-model scene replacement when allowed, else incoming payload scene (same precedence as inline HomeScreen). */
export function pickAcceptedChatSceneReplacement(args: {
  allowSceneMutation: boolean;
  viewModelSceneJson: SceneJson | null;
  incomingSceneJson: SceneJson | null;
  shouldReplaceViewModelSceneFromChat: boolean;
  shouldReplaceIncomingSceneFromChat: boolean;
}): SceneJson | null {
  const {
    allowSceneMutation,
    viewModelSceneJson,
    incomingSceneJson,
    shouldReplaceViewModelSceneFromChat,
    shouldReplaceIncomingSceneFromChat,
  } = args;
  if (allowSceneMutation && viewModelSceneJson && shouldReplaceViewModelSceneFromChat) {
    return viewModelSceneJson;
  }
  if (allowSceneMutation && incomingSceneJson && shouldReplaceIncomingSceneFromChat) {
    return incomingSceneJson;
  }
  return null;
}

export function mergeNextObjectSelectionFromUnifiedReaction(
  unifiedChatReaction: UnifiedSceneReaction | null | undefined,
  viewModelNextObjectSelection: unknown
): unknown {
  const hasReactionHighlights =
    unifiedChatReaction &&
    ((Array.isArray(unifiedChatReaction.highlightedObjectIds) &&
      unifiedChatReaction.highlightedObjectIds.length > 0) ||
      unifiedChatReaction.dimUnrelatedObjects ||
      (Array.isArray(unifiedChatReaction.riskSources) && unifiedChatReaction.riskSources.length > 0) ||
      (Array.isArray(unifiedChatReaction.riskTargets) && unifiedChatReaction.riskTargets.length > 0));

  if (!hasReactionHighlights) {
    return viewModelNextObjectSelection;
  }

  return {
    ...(viewModelNextObjectSelection && typeof viewModelNextObjectSelection === "object"
      ? viewModelNextObjectSelection
      : {}),
    highlighted_objects: Array.isArray(unifiedChatReaction.highlightedObjectIds)
      ? unifiedChatReaction.highlightedObjectIds
      : [],
    dim_unrelated_objects: unifiedChatReaction.dimUnrelatedObjects === true,
    risk_sources: Array.isArray(unifiedChatReaction.riskSources) ? unifiedChatReaction.riskSources : [],
    risk_targets: Array.isArray(unifiedChatReaction.riskTargets) ? unifiedChatReaction.riskTargets : [],
  };
}
