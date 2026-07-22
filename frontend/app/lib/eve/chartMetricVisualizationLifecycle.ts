import type { ChartMetricVisualizationLifecycleState } from "./chartMetricVisualizationFoundationTypes.ts";

const states = Object.freeze([
  "Declared", "Structured", "Prepared", "Published", "Retired",
] as const satisfies readonly ChartMetricVisualizationLifecycleState[]);

export const ChartMetricVisualizationLifecycle = Object.freeze(states.map((name, index) =>
  Object.freeze({
    id: `EVE-5:1/Lifecycle/${name}` as const,
    name,
    description: `${name} visualization-readiness metadata.`,
    deterministicOrder: index + 1,
    transitionsProvided: false,
    runtimeManagement: false,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
