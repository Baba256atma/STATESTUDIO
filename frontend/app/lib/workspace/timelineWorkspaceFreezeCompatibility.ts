/** WS-10:8 — Immutable workspace compatibility declarations. */
import { TimelineWorkspaceCertification } from "./timelineWorkspaceCertification.ts";

const names = Object.freeze([
  "Executive Home Workspace",
  "Goal Workspace",
  "KPI Workspace",
  "Strategy Workspace",
  "Problem Workspace",
  "Decision Workspace",
  "Scenario Workspace",
  "War Room Workspace",
  "Value Workspace",
] as const);

export const TimelineWorkspaceFreezeCompatibility = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-10:8/Compatibility/${String(index + 1).padStart(2, "0")}`,
    name,
    state: "Compatible",
    runtimeInteraction: false,
    source: TimelineWorkspaceCertification,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
