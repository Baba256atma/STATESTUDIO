import type { ExecutiveRequestIntentIntentModel as IntentModel } from "./executiveRequestIntentModelTypes.ts";

export const ExecutiveRequestIntentIntentModel = Object.freeze({
  id: "eng-2-model-intent", name: "Request & Intent Intent Model", kind: "IntentModel",
  description: "Canonical structural metadata for intent owned by the ENG-2 Request & Intent Platform.",
  fields: Object.freeze(["intentId", "intentType", "registryReference", "classificationReference", "description", "ownershipMetadata"]),
  ownership: Object.freeze({ genericConceptOwner: "ENG-1", specializedModelOwner: "ENG-2" }),
  namespace: "nexora.engine.executive.request-intent.model", version: "1.0.0", ownerPhase: "ENG-2:3",
  metadataOnly: true, immutable: true,
} as const satisfies IntentModel);
