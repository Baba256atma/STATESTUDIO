/** WS-1:3 — Lifecycle structural metadata sourced through Registry. */
import { WorkspaceRegistry } from "./workspaceRegistry.ts";

export const WorkspaceLifecycleModels = Object.freeze(
  WorkspaceRegistry.lifecycle.map((source, index, states) => Object.freeze({
    id: `WS-1:3/Lifecycle/${source.name}`,
    name: `${source.name} Lifecycle Model`,
    source,
    allowedPredecessorReferences: Object.freeze(index === 0 ? [] : [states[index - 1]?.id]),
    allowedSuccessorReferences: source.allowedArchitecturalTransitions,
    terminalState: source.name === "Retired",
    reEntryPolicy: source.name === "Archived" ? "Restorable" : "Canonical",
    archivePolicy: "Declarative",
    retirementPolicy: "Terminal",
    executesTransitions: false,
    metadataOnly: true,
    immutable: true,
  })),
);

