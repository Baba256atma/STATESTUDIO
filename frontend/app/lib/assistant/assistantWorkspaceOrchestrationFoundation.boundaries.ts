/** ASSISTANT-5:1 — Explicitly prohibited implementation surfaces. */
import type { AssistantWorkspaceOrchestrationBoundaryMetadata } from "./assistantWorkspaceOrchestrationFoundation.types.ts";

const names = Object.freeze([
  "Runtime",
  "Workspace Execution",
  "Workspace Switching",
  "Workspace Routing",
  "Scheduling",
  "Workflow Execution",
  "Recommendation Generation",
  "Decision Generation",
  "LLM Integration",
  "Prompt Execution",
  "AI Reasoning",
  "Conversation Execution",
  "Intent Classification",
  "Executive Memory Persistence",
  "Runtime Layer",
  "SDK",
  "Database",
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

export const AssistantWorkspaceOrchestrationFoundationBoundaries:
readonly AssistantWorkspaceOrchestrationBoundaryMetadata[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-5:1/Boundary/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    permitted: false,
    metadataOnly: true,
    immutable: true,
  })),
);
