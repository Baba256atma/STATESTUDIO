import type { TimelineVisualizationLifecycleState } from "./timelineVisualizationFoundationTypes.ts";

const states: readonly TimelineVisualizationLifecycleState[] = Object.freeze([
  "Declared", "Designed", "Approved", "Frozen", "Released",
]);

export const TimelineVisualizationFoundationLifecycle = Object.freeze({
  states: Object.freeze(states.map((name, index) => Object.freeze({
    id: `EVE-4:1/Lifecycle/${name}`,
    name,
    description: `Declarative lifecycle state: ${name}.`,
    deterministicOrder: index + 1,
    transitionsExecuted: false,
    metadataOnly: true,
    immutable: true,
  }))),
  runtimeLifecycle: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
