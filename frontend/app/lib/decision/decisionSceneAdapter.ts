import type { UnifiedSceneReaction } from "../scene/unifiedReaction.ts";
import type { DecisionContext, DecisionRecommendation, DecisionSceneAction, EvaluatedScenario } from "./decisionAssistantTypes.ts";

export function buildDecisionSceneAction(params: {
  context: DecisionContext;
  recommendation: DecisionRecommendation;
  scenarios: EvaluatedScenario[];
}): DecisionSceneAction {
  const { context, recommendation, scenarios } = params;
  const top = scenarios[0];
  const highlight = new Set<string>();
  if (context.selectedObjectId) highlight.add(context.selectedObjectId);
  (top?.affectedObjectIds ?? []).slice(0, 2).forEach((id) => highlight.add(id));
  context.fragileObjectIds.slice(0, 2).forEach((id) => highlight.add(id));

  const highlightObjectIds = Array.from(highlight).filter(Boolean).slice(0, 3);

  const dim = new Set<string>();
  context.fragileObjectIds.forEach((id) => {
    if (!highlight.has(id)) dim.add(id);
  });
  const dimObjectIds = Array.from(dim).slice(0, 6);

  const focusObjectId =
    context.selectedObjectId && highlightObjectIds.includes(context.selectedObjectId)
      ? context.selectedObjectId
      : highlightObjectIds[0];

  let overlayTone: DecisionSceneAction["overlayTone"] = "stable";
  if (context.riskLevel === "critical") overlayTone = "critical";
  else if (context.riskLevel === "high" || recommendation.posture === "protect") overlayTone = "warning";

  return {
    highlightObjectIds,
    dimObjectIds,
    focusObjectId,
    overlayTone,
  };
}

/** Map assistant scene hints into the existing unified reaction contract (caller applies normalize + scene pipeline). */
export function unifiedReactionFromDecisionSceneAction(
  action: DecisionSceneAction,
  reason: string
): UnifiedSceneReaction {
  const dimUnrelated = action.dimObjectIds.length > 0 && action.highlightObjectIds.length > 0;
  const mode: UnifiedSceneReaction["reactionMode"] =
    action.overlayTone === "critical"
      ? "risk"
      : action.overlayTone === "warning"
        ? "risk"
        : "neutral_acknowledgement";

  return {
    source: "system",
    reason,
    highlightedObjectIds: action.highlightObjectIds,
    riskSources: action.highlightObjectIds.slice(0, 2),
    riskTargets: action.dimObjectIds.slice(0, 4),
    primaryObjectId: action.focusObjectId ?? action.highlightObjectIds[0] ?? null,
    dimUnrelatedObjects: dimUnrelated,
    reactionMode: mode,
    allowFocusMutation: false,
  };
}
