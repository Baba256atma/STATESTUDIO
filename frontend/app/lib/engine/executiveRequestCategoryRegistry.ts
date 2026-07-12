import type { RegistryMetadata } from "./executiveRequestIntentRegistryTypes.ts";

const category = (key: string, name: string, description: string) => Object.freeze({
  id: `eng-request-category-${key}`, groupId: "category", key, name, description,
  namespace: "nexora.engine.executive.request-intent.registry", version: "1.0.0",
  status: "Approved", metadataOnly: true, immutable: true,
} as const satisfies RegistryMetadata);

export const ExecutiveRequestCategoryRegistry = Object.freeze([
  category("analysis", "Analysis", "Requests associated with analytical architecture."),
  category("planning", "Planning", "Requests associated with planning architecture."),
  category("monitoring", "Monitoring", "Requests associated with monitoring architecture."),
  category("reporting", "Reporting", "Requests associated with reporting architecture."),
  category("recommendation", "Recommendation", "Requests associated with recommendation architecture."),
  category("investigation", "Investigation", "Requests associated with investigation architecture."),
  category("navigation", "Navigation", "Requests associated with navigation architecture."),
  category("explanation", "Explanation", "Requests associated with explanation architecture."),
  category("simulation", "Simulation", "Requests associated with simulation architecture."),
  category("administration", "Administration", "Requests associated with administrative architecture."),
] as const);
