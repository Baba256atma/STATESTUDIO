/** WS-9:6 — Explicit non-executable Platform boundaries. */
import { ValueWorkspaceManifest } from "./valueWorkspaceManifest.ts";

const names = Object.freeze([
  "Business Value Calculation",
  "ROI Calculation",
  "Financial Analysis",
  "Forecasting",
  "AI Reasoning",
  "Workflow Execution",
  "Data Persistence",
  "Rendering",
  "Networking",
  "State Management",
  "Services",
  "Factories",
] as const);

export const ValueWorkspacePlatformBoundaries = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-9:6/Boundary/${String(index + 1).padStart(2, "0")}`,
    name,
    permitted: false,
    source: ValueWorkspaceManifest,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
