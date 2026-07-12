import type { RegistryMetadata } from "./executiveRequestIntentRegistryTypes.ts";

const source = (key: string, name: string, description: string) => Object.freeze({
  id: `eng-request-source-${key}`, groupId: "source", key, name, description,
  namespace: "nexora.engine.executive.request-intent.registry", version: "1.0.0",
  status: "Approved", metadataOnly: true, immutable: true,
} as const satisfies RegistryMetadata);

export const ExecutiveRequestSourceRegistry = Object.freeze([
  source("advisor", "Advisor", "Request origin associated with the Advisor boundary."),
  source("api", "API", "Request origin associated with a public API boundary."),
  source("user", "User", "Request origin associated with a user boundary."),
  source("scheduled", "Scheduled", "Request origin associated with future scheduling architecture."),
  source("automation", "Automation", "Request origin associated with future automation architecture."),
  source("integration", "Integration", "Request origin associated with an integration boundary."),
] as const);
