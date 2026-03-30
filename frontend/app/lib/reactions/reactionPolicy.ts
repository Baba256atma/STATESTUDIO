import type { SceneJson } from "../sceneTypes";
import {
  normalizeUnifiedSceneReaction,
  type UnifiedSceneReaction as CanonicalUnifiedSceneReaction,
} from "../scene/unifiedReaction";

export type NexoraReactionMode =
  | "focus"
  | "risk"
  | "propagation"
  | "decision"
  | "neutral_acknowledgement";

export type NexoraUnifiedReaction = CanonicalUnifiedSceneReaction & {
  relatedObjectIds: string[];
  primaryObjectId: string | null;
  riskSources: string[];
  riskTargets: string[];
  reactionMode: NexoraReactionMode;
  primaryStrength: number;
  secondaryStrength: number;
  primaryScale: number;
  secondaryScale: number;
  unrelatedScale: number;
  unrelatedOpacity: number;
  sceneJson?: SceneJson | null;
};

type ResolveReactionPolicyInput = {
  source: "chat" | "button" | "scanner" | "system";
  reason?: string | null;
  fallbackHighlightText?: string | null;
  highlightedObjectIds?: string[];
  riskSources?: string[];
  riskTargets?: string[];
  reactionModeHint?: NexoraReactionMode | null;
  activeLoopId?: string | null;
  loopSuggestions?: unknown[];
  actions?: unknown[];
  allowFocusMutation?: boolean;
  sceneJson?: SceneJson | null;
};

function uniqueIds(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return Array.from(new Set(values.map((value) => String(value || "").trim()).filter(Boolean)));
}

function resolveReactionMode(input: ResolveReactionPolicyInput, hasRisk: boolean, hasHighlights: boolean): NexoraReactionMode {
  if (input.reactionModeHint) return input.reactionModeHint;
  if (hasRisk && (input.activeLoopId || (Array.isArray(input.loopSuggestions) && input.loopSuggestions.length > 0))) {
    return "propagation";
  }
  if (hasRisk) return "risk";
  if (Array.isArray(input.actions) && input.actions.length > 0) return "decision";
  if (hasHighlights) return "focus";
  return "neutral_acknowledgement";
}

export function resolveUnifiedReactionPolicy(input: ResolveReactionPolicyInput): NexoraUnifiedReaction {
  const highlightedObjectIds = uniqueIds(input.highlightedObjectIds);
  const riskSources = uniqueIds(input.riskSources);
  const riskTargets = uniqueIds(input.riskTargets);
  const combinedIds = Array.from(new Set([...highlightedObjectIds, ...riskSources, ...riskTargets]));
  const hasRisk = riskSources.length > 0 || riskTargets.length > 0;
  const hasHighlights = combinedIds.length > 0;
  const reactionMode = resolveReactionMode(input, hasRisk, hasHighlights);
  const primaryObjectId = riskSources[0] ?? combinedIds[0] ?? null;
  const relatedObjectIds = combinedIds.filter((id) => id !== primaryObjectId).slice(0, 4);

  let primaryScale = 1;
  let secondaryScale = 1;
  let unrelatedScale = 1;
  let unrelatedOpacity = 1;
  let primaryStrength = 0;
  let secondaryStrength = 0;
  let dimUnrelatedObjects = false;

  if (reactionMode === "focus") {
    primaryScale = 1.16;
    secondaryScale = 1.05;
    unrelatedScale = 0.992;
    unrelatedOpacity = 0.62;
    primaryStrength = 0.76;
    secondaryStrength = 0.34;
    dimUnrelatedObjects = !!primaryObjectId;
  } else if (reactionMode === "risk") {
    primaryScale = 1.22;
    secondaryScale = 1.08;
    unrelatedScale = 0.985;
    unrelatedOpacity = 0.56;
    primaryStrength = 0.92;
    secondaryStrength = 0.48;
    dimUnrelatedObjects = !!primaryObjectId;
  } else if (reactionMode === "propagation") {
    primaryScale = 1.18;
    secondaryScale = 1.1;
    unrelatedScale = 0.988;
    unrelatedOpacity = 0.58;
    primaryStrength = 0.82;
    secondaryStrength = 0.56;
    dimUnrelatedObjects = combinedIds.length > 0;
  } else if (reactionMode === "decision") {
    primaryScale = 1.15;
    secondaryScale = 1.06;
    unrelatedScale = 0.99;
    unrelatedOpacity = 0.6;
    primaryStrength = 0.7;
    secondaryStrength = 0.4;
    dimUnrelatedObjects = combinedIds.length > 0;
  } else {
    primaryScale = 1.03;
    secondaryScale = 1;
    unrelatedScale = 1;
    unrelatedOpacity = 1;
    primaryStrength = 0.18;
    secondaryStrength = 0;
    dimUnrelatedObjects = false;
  }

  return normalizeUnifiedSceneReaction({
    source: input.source,
    reason: input.reason ?? null,
    fallbackHighlightText: input.fallbackHighlightText ?? null,
    highlightedObjectIds: primaryObjectId ? [primaryObjectId, ...relatedObjectIds] : [],
    relatedObjectIds,
    primaryObjectId,
    dimUnrelatedObjects,
    riskSources,
    riskTargets,
    reactionMode,
    primaryStrength,
    secondaryStrength,
    primaryScale,
    secondaryScale,
    unrelatedScale,
    unrelatedOpacity,
    activeLoopId: input.activeLoopId ?? null,
    loopSuggestions: Array.isArray(input.loopSuggestions) ? input.loopSuggestions : [],
    actions: Array.isArray(input.actions) ? input.actions : [],
    allowFocusMutation: input.allowFocusMutation === true,
    sceneJson: input.sceneJson ?? null,
  }) as NexoraUnifiedReaction;
}
