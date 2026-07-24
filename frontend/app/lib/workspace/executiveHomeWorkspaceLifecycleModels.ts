/** WS-2:3 — Lifecycle structural metadata sourced by reference. */
import { ExecutiveHomeWorkspaceRegistry } from "./executiveHomeWorkspaceRegistry.ts";
export const ExecutiveHomeWorkspaceLifecycleModels = Object.freeze(
  ExecutiveHomeWorkspaceRegistry.lifecycle.map((source, index, lifecycle) => Object.freeze({
    id: `WS-2:3/LifecycleModel/${source.name}`,
    name: `${source.name} Lifecycle Model`, description: source.description, source,
    allowedPredecessorStates: Object.freeze(index === 0 ? [] : [lifecycle[index - 1]?.name]),
    allowedSuccessorStates: Object.freeze(
      source.name === "Retired" ? [] : [lifecycle[index + 1]?.name],
    ),
    terminalState: source.name === "Retired", archivePolicy: "Declarative",
    restorePolicy: source.name === "Archived" ? "Restorable" : "Canonical",
    retirementPolicy: "Terminal", executesTransitions: false,
    metadataOnly: true, immutable: true,
  })),
);

