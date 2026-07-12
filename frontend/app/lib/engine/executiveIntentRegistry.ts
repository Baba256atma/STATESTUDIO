import type { RegistryMetadata } from "./executiveRequestIntentRegistryTypes.ts";

const intent = (key: string, name: string, description: string) => Object.freeze({
  id: `eng-request-intent-${key}`, groupId: "intent", key, name, description,
  namespace: "nexora.engine.executive.request-intent.registry", version: "1.0.0",
  status: "Approved", metadataOnly: true, immutable: true,
} as const satisfies RegistryMetadata);

export const ExecutiveIntentRegistry = Object.freeze([
  intent("understand", "Understand", "Intent to understand declared executive information."),
  intent("explain", "Explain", "Intent to obtain an architectural explanation."),
  intent("compare", "Compare", "Intent to compare declared executive concepts."),
  intent("predict", "Predict", "Intent associated with future prediction capabilities."),
  intent("recommend", "Recommend", "Intent associated with recommendation capabilities."),
  intent("optimize", "Optimize", "Intent associated with future optimization capabilities."),
  intent("monitor", "Monitor", "Intent associated with monitoring capabilities."),
  intent("summarize", "Summarize", "Intent associated with summary capabilities."),
  intent("validate", "Validate", "Intent associated with validation capabilities."),
  intent("explore", "Explore", "Intent associated with exploratory capabilities."),
] as const);
