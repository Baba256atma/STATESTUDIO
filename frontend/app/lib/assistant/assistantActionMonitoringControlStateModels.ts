/** ASSISTANT-9:3 — Immutable monitoring state models. */
import { AssistantActionMonitoringControlRegistry } from "./assistantActionMonitoringControlRegistry.ts";
import type { AssistantActionMonitoringControlStateModelMetadata } from "./assistantActionMonitoringControlModelTypes.ts";

const stateNames = Object.freeze([
  "Declared",
  "Registered",
  "MonitoringReady",
  "Observing",
  "Tracking",
  "Evaluating",
  "Controlled",
  "Completed",
  "Archived",
] as const);

const registryReference =
  AssistantActionMonitoringControlRegistry.collections.monitoringStates[0]
    ?.id
  ?? AssistantActionMonitoringControlRegistry.identity.id;

export const AssistantActionMonitoringControlStateModels:
readonly AssistantActionMonitoringControlStateModelMetadata[] = Object.freeze(
  stateNames.map((name, index) => Object.freeze({
    id: `ASSISTANT-9:3/StateModel/${String(index + 1).padStart(2, "0")}`,
    name,
    displayName: name,
    description:
      `Canonical monitoring state model metadata for ${name}.`,
    parentRegistryReference: registryReference,
    order: index + 1,
    transitionsAtRuntime: false,
    version: "1.0.0",
    status: "Canonical",
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
