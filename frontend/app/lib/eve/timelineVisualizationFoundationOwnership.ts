import type { TimelineVisualizationBoundaryDeclaration } from "./timelineVisualizationFoundationTypes.ts";

export const TimelineVisualizationFoundationOwnership = Object.freeze({
  owns: Object.freeze([
    "Timeline metadata", "Temporal objects", "Timeline identity", "Timeline hierarchy",
    "Playback intent metadata", "Historical references", "Forecast references",
    "Decision timeline references", "Timeline outputs", "Extension points",
  ] as const),
  doesNotOwn: Object.freeze([
    "Business time semantics", "Scheduling", "Calendars", "Graph analytics",
    "Rendering", "Animation", "Simulation", "Runtime playback",
  ] as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const boundaryNames = Object.freeze([
  "Timeline vs Rendering", "Timeline vs Animation", "Timeline vs Playback Engine",
  "Timeline vs Scheduling", "Timeline vs Business Logic", "Timeline vs Graph Analytics",
  "Timeline vs Executive Reasoning", "Timeline vs Persistence",
  "Timeline vs Networking", "Timeline vs Runtime Execution",
] as const);

export const TimelineVisualizationFoundationBoundaries:
readonly TimelineVisualizationBoundaryDeclaration[] = Object.freeze(
  boundaryNames.map((name, index) => Object.freeze({
    id: `EVE-4:1/Boundary/${name.replaceAll(" ", "")}`,
    name,
    description: `${name} is an explicit architectural separation.`,
    ownership: "Excluded",
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
