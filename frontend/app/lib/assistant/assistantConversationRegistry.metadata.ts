/** ASSISTANT-1:2 — Registry rules, boundaries, and dependency metadata. */
import { AssistantConversationFoundation } from "./assistantConversationFoundation.ts";

export const AssistantConversationRegistryMetadata = Object.freeze({
  sourceFoundation: AssistantConversationFoundation,
  upstreamDependencies: Object.freeze([
    "ASSISTANT-1:1 Conversation Foundation",
  ]),
  rules: Object.freeze([
    "Define Canonical Vocabularies",
    "Contain Immutable Entries",
    "Provide Stable Identifiers",
    "Expose Lookup Metadata",
    "Avoid Implementation Logic",
  ]),
  boundaries: Object.freeze([
    "Conversation Runtime", "Chat Execution", "Prompt Execution",
    "LLM Integration", "Memory", "Workspace Selection", "Object Creation",
    "Engine Reasoning", "DKL Queries", "Director", "EVE", "Runtime Layer",
    "UI", "Database", "API", "Queue", "Event Bus", "Authentication",
    "Logging", "Monitoring",
  ].map((name, index) => Object.freeze({
    id: `ASSISTANT-1:2/Boundary/${String(index + 1).padStart(2, "0")}`,
    name,
    permitted: false,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  }))),
  metadataOnly: true,
  immutable: true,
} as const);
