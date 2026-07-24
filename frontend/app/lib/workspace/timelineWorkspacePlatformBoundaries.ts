/** WS-10:6 — Explicit non-executable Platform boundaries. */
import { TimelineWorkspaceManifest } from "./timelineWorkspaceManifest.ts";

const names = Object.freeze([
  "Timeline Playback",
  "Historical Record Execution",
  "Chronological Processing",
  "Event Execution",
  "AI Reasoning",
  "Workflow Execution",
  "Data Persistence",
  "Rendering",
  "Networking",
  "State Management",
  "Services",
  "Factories",
] as const);

export const TimelineWorkspacePlatformBoundaries = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-10:6/Boundary/${String(index + 1).padStart(2, "0")}`,
    name,
    permitted: false,
    source: TimelineWorkspaceManifest,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
