import type { DecisionSceneAction } from "../decision/decisionAssistantTypes";
import { unifiedReactionFromDecisionSceneAction } from "../decision/decisionSceneAdapter";
import type { UnifiedSceneReaction } from "./unifiedReaction";

/** Panel-safe scene hints: only consumed by HomeScreen’s intent drain (never writes scene JSON directly). */
export type SceneIntent = { type: "assistant_scene"; payload: DecisionSceneAction };

export function buildSceneReactionFromIntent(intent: SceneIntent): UnifiedSceneReaction | null {
  if (intent.type !== "assistant_scene") return null;
  return unifiedReactionFromDecisionSceneAction(intent.payload, "intent_pipeline");
}
