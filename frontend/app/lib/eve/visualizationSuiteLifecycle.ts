import type { VisualizationSuiteFoundationLifecycleState } from "./visualizationSuiteFoundationTypes.ts";

const lifecycleNames = Object.freeze([
  "Declared", "Registered", "Modeled", "Validated", "Published",
] as const satisfies readonly VisualizationSuiteFoundationLifecycleState[]);

export const VisualizationSuiteFoundationLifecycle = Object.freeze(
  lifecycleNames.map((name, index) => Object.freeze({
    id: `EVE-9:1/Lifecycle/${name}` as const,
    name,
    deterministicOrder: index + 1,
    transitionExecution: false,
    metadataOnly: true,
    immutable: true,
  })),
);
