/** ASSISTANT-6:1 — Immutable capability declarations. */
import type { AssistantObjectContextManagementCapabilityMetadata } from "./assistantObjectContextManagementFoundation.types.ts";

const names = Object.freeze([
  "Executive Object Awareness",
  "Context Awareness",
  "Context Continuity Awareness",
  "Object Relationship Awareness",
  "Multi-Object Awareness",
  "Context Scope Awareness",
  "Cross-Workspace Context Awareness",
  "Object Reference Awareness",
  "Context Governance",
  "Context Traceability",
] as const);

export const AssistantObjectContextManagementFoundationCapabilities:
readonly AssistantObjectContextManagementCapabilityMetadata[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-6:1/Capability/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    implemented: false,
    metadataOnly: true,
    immutable: true,
  })),
);
