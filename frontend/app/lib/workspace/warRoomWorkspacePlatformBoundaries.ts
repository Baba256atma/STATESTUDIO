/** WS-8:6 — Explicit non-executable Platform boundaries. */
import { WarRoomWorkspaceManifest } from "./warRoomWorkspaceManifest.ts";

const names = Object.freeze([
  "Live Monitoring", "Event Processing", "Incident Management",
  "Workflow Orchestration", "AI Reasoning", "Decision Generation",
  "Scenario Simulation", "Data Persistence", "Rendering", "Networking",
  "State Management", "Services", "Factories",
] as const);

export const WarRoomWorkspacePlatformBoundaries = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-8:6/Boundary/${String(index + 1).padStart(2, "0")}`,
    name,
    permitted: false,
    source: WarRoomWorkspaceManifest,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
