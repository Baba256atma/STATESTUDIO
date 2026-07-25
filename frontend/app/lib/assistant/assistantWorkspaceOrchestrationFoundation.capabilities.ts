/** ASSISTANT-5:1 — Immutable capability declarations. */
import type { AssistantWorkspaceOrchestrationCapabilityMetadata } from "./assistantWorkspaceOrchestrationFoundation.types.ts";

const names = Object.freeze([
  "Workspace Awareness",
  "Workspace Coordination Awareness",
  "Workspace Transition Awareness",
  "Context Continuity Awareness",
  "Cross-Workspace Awareness",
  "Workspace Selection Awareness",
  "Executive Flow Awareness",
  "Multi-Workspace Awareness",
  "Workspace Governance",
  "Workspace Traceability",
] as const);

export const AssistantWorkspaceOrchestrationFoundationCapabilities:
readonly AssistantWorkspaceOrchestrationCapabilityMetadata[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-5:1/Capability/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    implemented: false,
    metadataOnly: true,
    immutable: true,
  })),
);
