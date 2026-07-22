import type { VisualizationPlatformFoundationLifecycleState } from "./visualizationPlatformFoundationTypes.ts";

const lifecycleNames = Object.freeze([
  "Declared", "Registered", "Modeled", "Validated", "Published",
] as const satisfies readonly VisualizationPlatformFoundationLifecycleState[]);

export const VisualizationPlatformFoundationLifecycle = Object.freeze(
  lifecycleNames.map((name, index) => Object.freeze({
    id: `EVE-8:1/Lifecycle/${name}` as const,
    name,
    deterministicOrder: index + 1,
    transitionExecution: false,
    metadataOnly: true,
    immutable: true,
  })),
);
