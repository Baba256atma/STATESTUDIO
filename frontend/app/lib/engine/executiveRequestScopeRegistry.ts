import type { RegistryMetadata } from "./executiveRequestIntentRegistryTypes.ts";

const scope = (key: string, name: string, description: string) => Object.freeze({
  id: `eng-request-scope-${key}`, groupId: "scope", key, name, description,
  namespace: "nexora.engine.executive.request-intent.registry", version: "1.0.0",
  status: "Approved", metadataOnly: true, immutable: true,
} as const satisfies RegistryMetadata);

export const ExecutiveRequestScopeRegistry = Object.freeze([
  scope("user", "User", "User-level request scope metadata."),
  scope("workspace", "Workspace", "Workspace-level request scope metadata."),
  scope("project", "Project", "Project-level request scope metadata."),
  scope("department", "Department", "Department-level request scope metadata."),
  scope("organization", "Organization", "Organization-level request scope metadata."),
  scope("platform", "Platform", "Platform-level request scope metadata."),
  scope("global", "Global", "Global request scope metadata."),
] as const);
