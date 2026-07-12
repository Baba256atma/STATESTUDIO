import type { ExecutiveRequestIntentMetadataDescriptor } from "./executiveRequestIntentTypes.ts";

export const ExecutiveRequestIntentMetadata = Object.freeze({
  moduleId: "ENG-2:1",
  version: "1.0.0",
  phase: "Executive Request & Intent Foundation",
  layer: "ExecutiveEngine",
  namespace: "nexora.engine.executive.request-intent.foundation",
  description: "Canonical metadata-only foundation for representing and registering executive requests and intent.",
  stability: "Foundation",
  releaseStatus: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveRequestIntentMetadataDescriptor);
