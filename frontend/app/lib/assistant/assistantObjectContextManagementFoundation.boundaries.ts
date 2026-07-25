/** ASSISTANT-6:1 — Explicitly prohibited implementation surfaces. */
import type { AssistantObjectContextManagementBoundaryMetadata } from "./assistantObjectContextManagementFoundation.types.ts";

const names = Object.freeze([
  "Runtime",
  "Object Creation",
  "Object Persistence",
  "Context Persistence",
  "Context Synchronization",
  "Object Synchronization",
  "Workflow Execution",
  "Workspace Execution",
  "Recommendation Generation",
  "Decision Generation",
  "LLM Integration",
  "Prompt Execution",
  "AI Reasoning",
  "Database",
  "Cache",
  "Vector Database",
  "API Endpoints",
  "Queue",
  "Event Bus",
  "Networking",
  "UI",
  "Rendering",
  "Authentication",
  "Authorization",
  "Logging",
  "Monitoring",
] as const);

export const AssistantObjectContextManagementFoundationBoundaries:
readonly AssistantObjectContextManagementBoundaryMetadata[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-6:1/Boundary/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    permitted: false,
    metadataOnly: true,
    immutable: true,
  })),
);
