/** WS-8:6 — Immutable workspace compatibility declarations. */
import { WarRoomWorkspaceManifest } from "./warRoomWorkspaceManifest.ts";

const names = Object.freeze([
  "Executive Home Workspace", "Goal Workspace", "KPI Workspace",
  "Strategy Workspace", "Problem Workspace", "Decision Workspace",
  "Scenario Workspace", "Value Workspace", "Timeline Workspace",
] as const);

export const WarRoomWorkspacePlatformCompatibility = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-8:6/Compatibility/${String(index + 1).padStart(2, "0")}`,
    name,
    state: "Compatible",
    runtimeInteraction: false,
    source: WarRoomWorkspaceManifest,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
