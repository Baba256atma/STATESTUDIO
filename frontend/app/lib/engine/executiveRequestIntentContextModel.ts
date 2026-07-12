import type { ExecutiveRequestIntentContextModel as ContextModel } from "./executiveRequestIntentModelTypes.ts";

export const ExecutiveRequestIntentContextModel = Object.freeze({
  id: "eng-2-model-context", name: "Request & Intent Context Model", kind: "ContextModel",
  description: "Architectural context-reference metadata without context resolution.",
  fields: Object.freeze(["contextId", "contextType", "contextReference"]),
  contextTypes: Object.freeze(["workspace", "organization", "department", "project", "dashboard", "conversation", "session"]),
  namespace: "nexora.engine.executive.request-intent.model", version: "1.0.0", ownerPhase: "ENG-2:3",
  metadataOnly: true, immutable: true,
} as const satisfies ContextModel);
