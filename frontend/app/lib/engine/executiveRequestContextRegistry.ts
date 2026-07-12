import type { RegistryMetadata } from "./executiveRequestIntentRegistryTypes.ts";

const context = (key: string, name: string, description: string) => Object.freeze({
  id: `eng-request-context-${key}`, groupId: "context", key, name, description,
  namespace: "nexora.engine.executive.request-intent.registry", version: "1.0.0",
  status: "Approved", metadataOnly: true, immutable: true,
} as const satisfies RegistryMetadata);

export const ExecutiveRequestContextRegistry = Object.freeze([
  context("active-workspace", "Active Workspace", "Reference type for active workspace context metadata."),
  context("active-project", "Active Project", "Reference type for active project context metadata."),
  context("active-dashboard", "Active Dashboard", "Reference type for active dashboard context metadata."),
  context("current-conversation", "Current Conversation", "Reference type for current conversation metadata."),
  context("current-session", "Current Session", "Reference type for current session metadata."),
  context("organization-context", "Organization Context", "Reference type for organization context metadata."),
] as const);
