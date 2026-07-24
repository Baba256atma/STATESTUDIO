/** WS-4:1 — Explicit prohibited implementation boundaries. */
const concerns = Object.freeze([
  "Decision Execution",
  "Task Execution",
  "Planning",
  "Scheduling",
  "Scenario Simulation",
  "Workflow Execution",
  "Runtime Orchestration",
  "AI Reasoning",
  "Persistence",
  "Networking",
  "Rendering",
  "Visualization",
  "Analytics Execution",
  "Notifications",
] as const);

export const DecisionWorkspaceBoundaries = Object.freeze(
  concerns.map((prohibitedConcern, index) => Object.freeze({
    id: `WS-4:1/Boundary/${String(index + 1).padStart(2, "0")}`,
    prohibitedConcern,
    implemented: false,
    metadataOnly: true,
    immutable: true,
  })),
);
