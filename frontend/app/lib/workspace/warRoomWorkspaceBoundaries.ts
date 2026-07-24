/** WS-8:1 — Explicitly excluded War Room behavior. */
const names = Object.freeze([
  "Operations Execution",
  "Workflow Execution",
  "System Orchestration",
  "Live System Monitoring",
  "Alert Processing",
  "Incident Response Execution",
  "AI Reasoning",
  "Decision Generation",
  "Scenario Simulation",
  "Data Persistence",
  "UI Rendering",
  "External Communication",
] as const);

export const WarRoomWorkspaceBoundaries = Object.freeze(
  names.map((name, index) =>
    Object.freeze({
      id: `WS-8:1/Boundary/${String(index + 1).padStart(2, "0")}`,
      name,
      implemented: false,
      order: index + 1,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
