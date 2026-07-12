import type { RegistryMetadata } from "./executiveRequestIntentRegistryTypes.ts";

const priority = (key: string, name: string, description: string) => Object.freeze({
  id: `eng-request-priority-${key}`, groupId: "priority", key, name, description,
  namespace: "nexora.engine.executive.request-intent.registry", version: "1.0.0",
  status: "Approved", metadataOnly: true, immutable: true,
} as const satisfies RegistryMetadata);

export const ExecutiveRequestPriorityRegistry = Object.freeze([
  priority("critical", "Critical", "Critical request priority metadata."),
  priority("high", "High", "High request priority metadata."),
  priority("normal", "Normal", "Normal request priority metadata."),
  priority("low", "Low", "Low request priority metadata."),
  priority("informational", "Informational", "Informational request priority metadata."),
] as const);
