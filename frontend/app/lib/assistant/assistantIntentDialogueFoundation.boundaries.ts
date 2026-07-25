/** ASSISTANT-3:1 — Explicitly prohibited implementation surfaces. */
import type { AssistantIntentDialogueBoundaryMetadata } from "./assistantIntentDialogueFoundation.types.ts";

const names = Object.freeze([
  "Runtime",
  "Intent Classification",
  "NLP",
  "Natural Language Parsing",
  "LLM Integration",
  "Prompt Execution",
  "AI Reasoning",
  "Conversation Execution",
  "Executive Memory Persistence",
  "Workspace Selection",
  "Object Creation",
  "Recommendation Generation",
  "Decision Making",
  "Scenario Generation",
  "Engine Execution",
  "DKL",
  "Director",
  "EVE",
  "NEA",
  "Runtime Layer",
  "SDK",
  "Database",
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

export const AssistantIntentDialogueFoundationBoundaries:
readonly AssistantIntentDialogueBoundaryMetadata[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-3:1/Boundary/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    permitted: false,
    metadataOnly: true,
    immutable: true,
  })),
);
