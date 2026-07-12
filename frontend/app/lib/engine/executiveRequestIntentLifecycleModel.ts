import type { ExecutiveRequestIntentLifecycleModel as LifecycleModel } from "./executiveRequestIntentModelTypes.ts";

export const ExecutiveRequestIntentLifecycleModel = Object.freeze({
  id: "eng-2-model-lifecycle", name: "Request & Intent Lifecycle Model", kind: "LifecycleModel",
  description: "Approved lifecycle-stage metadata without lifecycle execution.",
  fields: Object.freeze(["lifecycleId", "requestReference", "stage"]),
  stages: Object.freeze(["Registered", "Classified", "Prepared", "Planned", "Completed", "Archived"]),
  namespace: "nexora.engine.executive.request-intent.model", version: "1.0.0", ownerPhase: "ENG-2:3",
  metadataOnly: true, immutable: true,
} as const satisfies LifecycleModel);
