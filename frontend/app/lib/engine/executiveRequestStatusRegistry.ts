import type { RegistryMetadata } from "./executiveRequestIntentRegistryTypes.ts";

const status = (key: string, name: string, description: string) => Object.freeze({
  id: `eng-request-status-${key}`, groupId: "status", key, name, description,
  namespace: "nexora.engine.executive.request-intent.registry", version: "1.0.0",
  status: "Approved", metadataOnly: true, immutable: true,
} as const satisfies RegistryMetadata);

export const ExecutiveRequestStatusRegistry = Object.freeze([
  status("registered", "Registered", "Request registration lifecycle metadata."),
  status("classified", "Classified", "Request classification lifecycle metadata."),
  status("prepared", "Prepared", "Request preparation lifecycle metadata."),
  status("planned", "Planned", "Request planning lifecycle metadata."),
  status("completed", "Completed", "Request completion lifecycle metadata."),
  status("archived", "Archived", "Request archival lifecycle metadata."),
] as const);
