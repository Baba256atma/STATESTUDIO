import type { SceneJson } from "../sceneTypes";

export type UnifiedSceneReaction = {
  source: "chat" | "button" | "scanner" | "system";
  reason?: string | null;
  fallbackHighlightText?: string | null;

  highlightedObjectIds: string[];
  relatedObjectIds?: string[];
  primaryObjectId?: string | null;
  dimUnrelatedObjects: boolean;

  riskSources?: string[];
  riskTargets?: string[];
  reactionMode?: "focus" | "risk" | "propagation" | "decision" | "neutral_acknowledgement";
  primaryStrength?: number;
  secondaryStrength?: number;
  primaryScale?: number;
  secondaryScale?: number;
  unrelatedScale?: number;
  unrelatedOpacity?: number;

  activeLoopId?: string | null;
  loopSuggestions?: unknown[];
  actions?: unknown[];
  allowFocusMutation?: boolean;
  sceneJson?: SceneJson | null;
};

function uniqueIds(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return Array.from(new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean)));
}

export function hasForcedSceneUpdate(
  payload: unknown,
  incomingScene?: SceneJson | null | undefined
): boolean {
  const candidate = payload as {
    force_scene_update?: boolean;
    scene_update?: boolean;
    scene_json?: SceneJson | null;
  } | null;
  return (
    candidate?.force_scene_update === true ||
    candidate?.scene_update === true ||
    candidate?.scene_json?.meta?.force_scene_update === true ||
    candidate?.scene_json?.meta?.scene_update === true ||
    incomingScene?.meta?.force_scene_update === true ||
    incomingScene?.meta?.scene_update === true
  );
}

export function normalizeUnifiedSceneReaction(
  reaction: UnifiedSceneReaction,
  options?: {
    sceneObjectIds?: string[];
    maxHighlightedObjectIds?: number;
  }
): UnifiedSceneReaction {
  const sceneObjectIdSet = options?.sceneObjectIds?.length ? new Set(options.sceneObjectIds.map(String)) : null;
  const filterSceneIds = (values: unknown): string[] => {
    const ids = uniqueIds(values);
    if (!sceneObjectIdSet) return ids;
    return ids.filter((id) => sceneObjectIdSet.has(id));
  };

  const maxHighlightedObjectIds = Math.max(1, Math.min(5, Number(options?.maxHighlightedObjectIds ?? 3)));
  const highlightedObjectIds = filterSceneIds(reaction.highlightedObjectIds);
  const riskSources = filterSceneIds(reaction.riskSources);
  const riskTargets = filterSceneIds(reaction.riskTargets);
  const preferredPrimaryId = reaction.primaryObjectId ? String(reaction.primaryObjectId).trim() : "";
  const primaryObjectId =
    (preferredPrimaryId && (!sceneObjectIdSet || sceneObjectIdSet.has(preferredPrimaryId)) && preferredPrimaryId) ||
    riskSources[0] ||
    highlightedObjectIds[0] ||
    null;

  const relatedObjectIds = filterSceneIds([
    ...(Array.isArray(reaction.relatedObjectIds) ? reaction.relatedObjectIds : []),
    ...highlightedObjectIds.filter((id) => id !== primaryObjectId),
    ...riskTargets.filter((id) => id !== primaryObjectId),
  ]).slice(0, Math.max(0, maxHighlightedObjectIds - (primaryObjectId ? 1 : 0)));

  const nextHighlightedObjectIds = primaryObjectId
    ? [primaryObjectId, ...relatedObjectIds].slice(0, maxHighlightedObjectIds)
    : highlightedObjectIds.slice(0, maxHighlightedObjectIds);

  const hasStableFocus = nextHighlightedObjectIds.length > 0 && !!primaryObjectId;
  const dimUnrelatedObjects = reaction.dimUnrelatedObjects === true && hasStableFocus;
  const unrelatedOpacity = dimUnrelatedObjects
    ? Math.max(0.52, Math.min(0.74, Number(reaction.unrelatedOpacity ?? 0.58)))
    : 1;
  const unrelatedScale = dimUnrelatedObjects
    ? Math.max(0.985, Math.min(1, Number(reaction.unrelatedScale ?? 0.992)))
    : 1;

  return {
    ...reaction,
    highlightedObjectIds: nextHighlightedObjectIds,
    relatedObjectIds,
    primaryObjectId,
    dimUnrelatedObjects,
    riskSources,
    riskTargets,
    unrelatedOpacity,
    unrelatedScale,
    allowFocusMutation: reaction.allowFocusMutation === true && hasStableFocus,
    sceneJson: hasForcedSceneUpdate(reaction, reaction.sceneJson) ? reaction.sceneJson ?? null : null,
  };
}
