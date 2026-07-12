import type { ExecutiveRequestIntentRequestModel as RequestModel } from "./executiveRequestIntentModelTypes.ts";

export const ExecutiveRequestIntentRequestModel = Object.freeze({
  id: "eng-2-model-request", name: "Request & Intent Request Model", kind: "RequestModel",
  description: "Canonical structural metadata for a request owned by the ENG-2 Request & Intent Platform.",
  fields: Object.freeze(["requestId", "category", "priority", "scope", "source", "status", "metadataReference", "contextReference", "classificationReference"]),
  registryReferences: Object.freeze(["category", "priority", "scope", "source", "status", "classification", "context"]),
  namespace: "nexora.engine.executive.request-intent.model", version: "1.0.0", ownerPhase: "ENG-2:3",
  metadataOnly: true, immutable: true,
} as const satisfies RequestModel);
