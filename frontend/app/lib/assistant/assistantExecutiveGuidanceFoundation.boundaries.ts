/** ASSISTANT-4:1 — Explicitly prohibited implementation surfaces. */
import type { AssistantExecutiveGuidanceBoundaryMetadata } from "./assistantExecutiveGuidanceFoundation.types.ts";

const names = Object.freeze([
  "Runtime",
  "Recommendation Generation",
  "Decision Generation",
  "Coaching Generation",
  "Scenario Generation",
  "Action Planning",
  "Workflow Execution",
  "LLM Integration",
  "Prompt Execution",
  "AI Reasoning",
  "Conversation Execution",
  "Intent Classification",
  "Workspace Orchestration",
  "Object Creation",
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

export const AssistantExecutiveGuidanceFoundationBoundaries:
readonly AssistantExecutiveGuidanceBoundaryMetadata[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-4:1/Boundary/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    permitted: false,
    metadataOnly: true,
    immutable: true,
  })),
);
