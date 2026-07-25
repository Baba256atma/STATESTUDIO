/** ASSISTANT-2:1 — Explicitly prohibited implementation surfaces. */
import type { AssistantExecutiveMemoryBoundaryMetadata } from "./assistantExecutiveMemoryFoundation.types.ts";

const names = Object.freeze([
  "Runtime Memory",
  "Memory Persistence",
  "Database",
  "Vector Database",
  "Embeddings",
  "Semantic Search",
  "Retrieval",
  "Context Injection",
  "LLM Integration",
  "Prompt Execution",
  "AI Reasoning",
  "Workspace Execution",
  "Object Creation",
  "Engine Execution",
  "DKL",
  "Director",
  "EVE",
  "NEA",
  "Runtime Layer",
  "SDK",
  "API Endpoints",
  "Networking",
  "Queue",
  "Event Bus",
  "UI",
  "Rendering",
  "Authentication",
  "Authorization",
  "Logging",
  "Monitoring",
] as const);

export const AssistantExecutiveMemoryFoundationBoundaries:
readonly AssistantExecutiveMemoryBoundaryMetadata[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-2:1/Boundary/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    permitted: false,
    metadataOnly: true,
    immutable: true,
  })),
);
