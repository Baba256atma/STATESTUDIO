/** ASSISTANT-1:1 — Explicitly prohibited implementation surfaces. */
import type { AssistantConversationBoundaryMetadata } from "./assistantConversationFoundation.types.ts";

const names = Object.freeze([
  "Runtime",
  "LLM Calls",
  "AI Inference",
  "Prompt Execution",
  "Memory Storage",
  "Context Assembly",
  "Workspace Selection",
  "Object Creation",
  "Decision Making",
  "Recommendation Generation",
  "Scenario Simulation",
  "Director",
  "EVE",
  "Engine",
  "DKL",
  "NEA",
  "SDK",
  "API Endpoints",
  "Database",
  "Queue",
  "Event Bus",
  "Network",
  "UI",
  "Rendering",
  "Authentication",
  "Authorization",
  "Logging",
  "Monitoring",
] as const);

export const AssistantConversationFoundationBoundaries:
readonly AssistantConversationBoundaryMetadata[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-1:1/Boundary/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    permitted: false,
    metadataOnly: true,
    immutable: true,
  })),
);
