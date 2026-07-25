/** ASSISTANT-2:1 — Immutable capability declarations. */
import type { AssistantExecutiveMemoryCapabilityMetadata } from "./assistantExecutiveMemoryFoundation.types.ts";

const names = Object.freeze([
  "Executive Context Awareness",
  "Conversation Continuity",
  "Session Awareness",
  "Timeline Awareness",
  "Workspace Awareness",
  "Object Awareness",
  "Context Preservation",
  "Reference Tracking",
  "Executive Personalization",
  "Memory Governance",
] as const);

export const AssistantExecutiveMemoryFoundationCapabilities:
readonly AssistantExecutiveMemoryCapabilityMetadata[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-2:1/Capability/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    implemented: false,
    metadataOnly: true,
    immutable: true,
  })),
);
