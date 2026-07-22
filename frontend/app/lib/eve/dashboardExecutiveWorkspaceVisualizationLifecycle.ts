import type { DashboardExecutiveWorkspaceLifecycleState } from "./dashboardExecutiveWorkspaceVisualizationFoundationTypes.ts";

const lifecycleStates = Object.freeze([
  "Declared", "Structured", "Prepared", "Published", "Retired",
] as const satisfies readonly DashboardExecutiveWorkspaceLifecycleState[]);

export const DashboardExecutiveWorkspaceVisualizationLifecycle = Object.freeze(
  lifecycleStates.map((name, index) => Object.freeze({
    id: `EVE-6:1/Lifecycle/${name}` as const,
    name,
    description: `${name} workspace-visualization readiness metadata.`,
    deterministicOrder: index + 1,
    transitionsProvided: false,
    stateMachineProvided: false,
    metadataOnly: true,
    immutable: true,
  })),
);
