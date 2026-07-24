/** WS-9:1 — Explicitly excluded Value Workspace behavior. */
const names = Object.freeze([
  "ROI Calculation",
  "Financial Value Calculation",
  "Business Value Calculation",
  "Analytics Execution",
  "Report Generation",
  "AI Reasoning",
  "Workflow Execution",
  "Data Persistence",
  "UI Rendering",
  "External Communication",
] as const);

export const ValueWorkspaceBoundaries = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-9:1/Boundary/${String(index + 1).padStart(2, "0")}`,
    name,
    implemented: false,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
