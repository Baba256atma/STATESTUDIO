/** WS-6:1 — Explicit prohibited implementation boundaries. */
const concerns = Object.freeze([
  "Problem Solving",
  "Reasoning Execution",
  "AI Inference",
  "Decision Generation",
  "Scenario Generation",
  "Workflow Orchestration",
  "Root Cause Analysis Execution",
  "Impact Calculation",
  "Simulation Execution",
  "UI Rendering",
  "External Communication",
  "Database Access",
  "Data Persistence",
] as const);

export const ProblemWorkspaceBoundaries = Object.freeze(
  concerns.map((prohibitedConcern, index) => Object.freeze({
    id: `WS-6:1/Boundary/${String(index + 1).padStart(2, "0")}`,
    prohibitedConcern,
    implemented: false,
    metadataOnly: true,
    immutable: true,
  })),
);
