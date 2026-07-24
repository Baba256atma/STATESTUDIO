/** WS-10:1 — Explicitly excluded Timeline Workspace behavior. */
const names = Object.freeze([
  "Timeline Event Replay",
  "Chronological Data Processing",
  "Analytics",
  "Workflow Execution",
  "AI Reasoning",
  "Report Generation",
  "Data Persistence",
  "UI Rendering",
  "External Communication",
] as const);

export const TimelineWorkspaceBoundaries = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-10:1/Boundary/${String(index + 1).padStart(2, "0")}`,
    name,
    implemented: false,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
