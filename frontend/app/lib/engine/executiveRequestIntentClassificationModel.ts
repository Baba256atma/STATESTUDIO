import type { ExecutiveRequestIntentClassificationModel as ClassificationModel } from "./executiveRequestIntentModelTypes.ts";

export const ExecutiveRequestIntentClassificationModel = Object.freeze({
  id: "eng-2-model-classification", name: "Request & Intent Classification Model", kind: "ClassificationModel",
  description: "Architectural representation of approved request classification dimensions without inference.",
  fields: Object.freeze(["classificationId", "dimension", "registryReference"]),
  dimensions: Object.freeze(["business", "operations", "finance", "strategy", "executive", "reporting", "recommendation", "investigation", "simulation"]),
  namespace: "nexora.engine.executive.request-intent.model", version: "1.0.0", ownerPhase: "ENG-2:3",
  metadataOnly: true, immutable: true,
} as const satisfies ClassificationModel);
