import type { UnifiedSceneReaction } from "./unifiedReaction";

type ApplySceneFromChatInput = {
  insight: string;
  actions: Array<{ title: string; impact: "high" | "medium" | "low"; confidence: number }>;
  intent: "explain" | "analyze" | "decide" | "open_panel" | "ask_context";
  routing: { target_engine: string; target_panel: string };
  candidateObjectIds?: string[];
};

export function applySceneFromChat(input: ApplySceneFromChatInput): UnifiedSceneReaction {
  const candidates = Array.isArray(input.candidateObjectIds)
    ? Array.from(new Set(input.candidateObjectIds.map((v) => String(v ?? "").trim()).filter(Boolean)))
    : [];
  const highlightedObjectIds = candidates.slice(0, 3);
  const primaryObjectId = highlightedObjectIds[0] ?? null;
  const reason = `${input.intent}:${input.routing.target_engine}:${input.routing.target_panel}`;

  return {
    source: "chat",
    reason,
    fallbackHighlightText: input.insight,
    highlightedObjectIds,
    primaryObjectId,
    relatedObjectIds: highlightedObjectIds.slice(1),
    dimUnrelatedObjects: highlightedObjectIds.length > 0,
    reactionMode:
      input.intent === "decide"
        ? "decision"
        : input.intent === "analyze"
          ? "risk"
          : input.intent === "open_panel"
            ? "neutral_acknowledgement"
            : "focus",
    allowFocusMutation: highlightedObjectIds.length > 0,
    actions: input.actions.slice(0, 3),
  };
}

