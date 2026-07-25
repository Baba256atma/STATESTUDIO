/** ASSISTANT-2:1 — Immutable canonical constants, vocabulary, and scopes. */
import type { AssistantExecutiveMemoryScopeMetadata } from "./assistantExecutiveMemoryFoundation.types.ts";

export const AssistantExecutiveMemoryFoundationConstants = Object.freeze({
  phaseIdentifier: "ASSISTANT-2:1",
  namespace: "nexora.assistant.executive-memory.foundation",
  version: "1.0.0",
  readiness: "ReadyForRegistry",
  foundationStatus: "Foundation",
  canonicalIdentity: "ASSISTANT-2:1/ExecutiveMemoryFoundation",
} as const);

export const AssistantExecutiveMemoryResponsibilities = Object.freeze([
  "Executive Memory",
  "Executive Memory Identity",
  "Memory Context",
  "Memory Session",
  "Memory Scope",
  "Memory Timeline",
  "Memory Snapshot",
  "Memory Reference",
  "Memory Lifecycle",
  "Memory Policy",
  "Memory Boundary",
  "Memory Capability",
] as const);

const scopeNames = Object.freeze([
  "Conversation Memory",
  "Session Memory",
  "Workspace Memory",
  "Executive Memory",
  "Project Memory",
  "Organization Memory",
  "Object Memory",
  "Global Memory",
] as const);

export const AssistantExecutiveMemoryScopes:
readonly AssistantExecutiveMemoryScopeMetadata[] = Object.freeze(
  scopeNames.map((name, index) => Object.freeze({
    id: `ASSISTANT-2:1/Scope/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    conceptualOnly: true,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
