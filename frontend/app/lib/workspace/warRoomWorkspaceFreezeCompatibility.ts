/** WS-8:8 — Immutable workspace compatibility declarations. */
import { WarRoomWorkspaceCertification } from "./warRoomWorkspaceCertification.ts";

const names = Object.freeze([
  "Executive Home Workspace", "Goal Workspace", "KPI Workspace",
  "Strategy Workspace", "Problem Workspace", "Decision Workspace",
  "Scenario Workspace", "Value Workspace", "Timeline Workspace",
] as const);

export const WarRoomWorkspaceFreezeCompatibility = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-8:8/Compatibility/${String(index + 1).padStart(2, "0")}`,
    name,
    state: "Compatible",
    runtimeInteraction: false,
    source: WarRoomWorkspaceCertification,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
