import type { DirectorRegistryEntry } from "./directorRegistryTypes.ts";

const entries = (
  category: string,
  names: readonly string[],
): readonly DirectorRegistryEntry[] => Object.freeze(names.map((name, index) =>
  Object.freeze({
    id: `DIRECTOR-1:2/${category}/${name}`,
    name,
    description: `Canonical Director ${category} classification for ${name}.`,
    category,
    version: "1.0.0" as const,
    namespace: `nexora.director.registry.${category.toLowerCase()}` as const,
    stability: "Stable" as const,
    deterministicOrder: index + 1,
  }),
));

export const DirectorTimelineTypeRegistry = entries("TimelineType", [
  "Snapshot", "Historical", "Current", "Future", "Simulation", "Comparison",
]);

export const DirectorTimelineScaleTypeRegistry = entries("TimelineScaleType", [
  "Hour", "Day", "Week", "Month", "Quarter", "Year",
]);

export const DirectorTransitionTypeRegistry = entries("TransitionType", [
  "Fade", "Slide", "Zoom", "Focus", "Expand", "Collapse", "Replace", "Highlight",
]);

export const DirectorAnimationInstructionTypeRegistry = entries(
  "AnimationInstructionType",
  ["Appear", "Disappear", "Move", "Rotate", "Scale", "Emphasize", "Pulse", "Blink"],
);

export const DirectorTimelineRegistry = Object.freeze({
  timelineTypes: DirectorTimelineTypeRegistry,
  timelineScaleTypes: DirectorTimelineScaleTypeRegistry,
  transitionTypes: DirectorTransitionTypeRegistry,
  animationInstructionTypes: DirectorAnimationInstructionTypeRegistry,
  metadataOnly: true,
  immutable: true,
} as const);

