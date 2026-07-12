import type { ExecutiveRequestIntentMetadataModel as MetadataModel } from "./executiveRequestIntentModelTypes.ts";

export const ExecutiveRequestIntentMetadataModel = Object.freeze({
  id: "eng-2-model-metadata", name: "Request & Intent Metadata Model", kind: "MetadataModel",
  description: "Canonical architectural metadata representation for ENG-2 request and intent models.",
  fields: Object.freeze(["identifier", "version", "namespace", "ownerPhase", "architecturalStability", "releaseStatus"]),
  architecturalStability: "Foundation", releaseStatus: "Draft",
  namespace: "nexora.engine.executive.request-intent.model", version: "1.0.0", ownerPhase: "ENG-2:3",
  metadataOnly: true, immutable: true,
} as const satisfies MetadataModel);
