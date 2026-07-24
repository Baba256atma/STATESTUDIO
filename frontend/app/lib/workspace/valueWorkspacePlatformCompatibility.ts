/** WS-9:6 — Immutable workspace compatibility declarations. */
import { ValueWorkspaceManifest } from "./valueWorkspaceManifest.ts";

const names = Object.freeze([
  "Executive Home Workspace",
  "Goal Workspace",
  "KPI Workspace",
  "Strategy Workspace",
  "Problem Workspace",
  "Decision Workspace",
  "Scenario Workspace",
  "War Room Workspace",
  "Timeline Workspace",
] as const);

export const ValueWorkspacePlatformCompatibility = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-9:6/Compatibility/${String(index + 1).padStart(2, "0")}`,
    name,
    state: "Compatible",
    runtimeInteraction: false,
    source: ValueWorkspaceManifest,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
