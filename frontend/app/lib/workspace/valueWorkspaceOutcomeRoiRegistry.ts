/** WS-9:2 — Immutable outcome and ROI type registries. */
import { ValueWorkspaceFoundation } from "./valueWorkspaceFoundation.ts";

const register = (group: string, names: readonly string[]) => Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-9:2/${group}/${String(index + 1).padStart(2, "0")}`,
    key: `${group.toLowerCase()}-${String(index + 1).padStart(2, "0")}`,
    name,
    group,
    source: ValueWorkspaceFoundation.identity.id,
    order: index + 1,
    calculated: false,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const ValueWorkspaceOutcomeRoiRegistry = Object.freeze({
  outcomeTypes: register("OutcomeType", [
    "Achieved",
    "Expected",
    "Forecast",
    "Target",
    "Realized",
    "Deferred",
    "Partial",
    "NotAchieved",
  ]),
  roiTypes: register("RoiType", [
    "Financial ROI",
    "Operational ROI",
    "Strategic ROI",
    "Customer ROI",
    "Project ROI",
    "Portfolio ROI",
    "Executive ROI",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
