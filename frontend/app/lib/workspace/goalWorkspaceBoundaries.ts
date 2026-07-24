/** WS-3:1 — Explicit prohibited implementation boundaries. */
const concerns = Object.freeze(["Goal Execution", "Planning", "Scheduling", "Task Management",
  "Decision Making", "Scenario Simulation", "Runtime Orchestration", "AI Reasoning",
  "Persistence", "Networking", "Rendering", "Visualization", "Analytics",
  "Notifications"] as const);
export const GoalWorkspaceBoundaries = Object.freeze(concerns.map((prohibitedConcern, index) => Object.freeze({
  id: `WS-3:1/Boundary/${String(index + 1).padStart(2, "0")}`,
  prohibitedConcern, implemented: false, metadataOnly: true, immutable: true,
})));

