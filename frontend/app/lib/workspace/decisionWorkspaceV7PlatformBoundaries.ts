/** WS-7:6 — Explicit non-executable Platform boundaries. */
import { DecisionWorkspaceV7Manifest } from "./decisionWorkspaceV7Manifest.ts";

const names = Object.freeze([
  "Decision Generation",
  "Decision Execution",
  "Decision Optimization",
  "Decision Ranking",
  "AI Reasoning",
  "Root Cause Analysis",
  "Scenario Simulation",
  "Workflow Execution",
  "Data Persistence",
  "Rendering",
  "Networking",
  "State Management",
  "Services",
  "Factories",
] as const);

export const DecisionWorkspaceV7PlatformBoundaries = Object.freeze(
  names.map((name, index) =>
    Object.freeze({
      id: `WS-7:6/Boundary/${String(index + 1).padStart(2, "0")}`,
      name,
      permitted: false,
      source: DecisionWorkspaceV7Manifest,
      order: index + 1,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
