/** WS-5:1 — Explicit prohibited implementation boundaries. */
const concerns = Object.freeze([
  "Scenario Execution",
  "Simulation Runtime",
  "Forecast Calculation",
  "Prediction Engine",
  "Decision Execution",
  "Task Execution",
  "Planning",
  "Scheduling",
  "Runtime Orchestration",
  "AI Reasoning",
  "Persistence",
  "Networking",
  "Rendering",
  "Visualization",
  "Notifications",
] as const);

export const ScenarioWorkspaceBoundaries = Object.freeze(
  concerns.map((prohibitedConcern, index) => Object.freeze({
    id: `WS-5:1/Boundary/${String(index + 1).padStart(2, "0")}`,
    prohibitedConcern,
    implemented: false,
    metadataOnly: true,
    immutable: true,
  })),
);
