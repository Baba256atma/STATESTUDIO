/** WS-6:6 — Explicit non-executable Platform boundaries. */
import { ProblemWorkspaceManifest } from "./problemWorkspaceManifest.ts";

const exclusions = Object.freeze([
  "Problem Detection",
  "Root Cause Analysis",
  "Decision Generation",
  "Scenario Generation",
  "Executive Reasoning",
  "AI Inference",
  "Data Persistence",
  "Rendering",
  "Networking",
  "Workflow Execution",
  "State Management",
  "Services",
  "Factories",
] as const);

export const ProblemWorkspacePlatformBoundaries = Object.freeze(
  exclusions.map((name, index) =>
    Object.freeze({
      id: `WS-6:6/Boundary/${String(index + 1).padStart(2, "0")}`,
      name,
      permitted: false,
      source: ProblemWorkspaceManifest,
      order: index + 1,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
