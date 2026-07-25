/** ASSISTANT-9:1 — Immutable monitoring lifecycle metadata. */
import type { AssistantActionMonitoringControlLifecycleMetadata } from "./assistantActionMonitoringControlIdentity.ts";

const lifecycleNames = Object.freeze([
  "Declared",
  "Registered",
  "MonitoringReady",
  "Observing",
  "Evaluating",
  "Controlled",
  "Completed",
  "Archived",
] as const);

export const AssistantActionMonitoringControlLifecycle:
readonly AssistantActionMonitoringControlLifecycleMetadata[] = Object.freeze(
  lifecycleNames.map((name, index) => Object.freeze({
    id: `ASSISTANT-9:1/Lifecycle/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    transitionsAtRuntime: false,
    metadataOnly: true,
    immutable: true,
  })),
);
