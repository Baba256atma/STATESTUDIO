/** ASSISTANT-4:1 — Immutable capability declarations. */
import type { AssistantExecutiveGuidanceCapabilityMetadata } from "./assistantExecutiveGuidanceFoundation.types.ts";

const names = Object.freeze([
  "Executive Guidance Awareness",
  "Strategic Guidance Awareness",
  "Decision Preparation Awareness",
  "Planning Guidance Awareness",
  "Clarification Guidance Awareness",
  "Executive Coaching Awareness",
  "Contextual Guidance Awareness",
  "Continuous Guidance Awareness",
  "Guidance Governance",
  "Guidance Traceability",
] as const);

export const AssistantExecutiveGuidanceFoundationCapabilities:
readonly AssistantExecutiveGuidanceCapabilityMetadata[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-4:1/Capability/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    implemented: false,
    metadataOnly: true,
    immutable: true,
  })),
);
