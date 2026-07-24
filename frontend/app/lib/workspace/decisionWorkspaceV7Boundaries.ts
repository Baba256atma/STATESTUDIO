/** WS-7:1 — Explicitly excluded Decision Workspace behavior. */
const names = Object.freeze([
  "Decision Execution",
  "Decision Optimization",
  "AI Reasoning",
  "Scenario Simulation",
  "Root Cause Analysis",
  "ROI Calculation",
  "Risk Calculation",
  "Workflow Execution",
  "Process Orchestration",
  "Data Persistence",
  "UI Rendering",
  "External Communication",
] as const);

export const DecisionWorkspaceV7Boundaries = Object.freeze(
  names.map((name, index) =>
    Object.freeze({
      id: `WS-7:1/Boundary/${String(index + 1).padStart(2, "0")}`,
      name,
      implemented: false,
      order: index + 1,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
