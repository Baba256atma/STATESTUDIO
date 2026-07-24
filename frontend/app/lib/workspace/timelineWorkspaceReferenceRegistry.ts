/** WS-10:2 — Immutable status and historical reference registries. */
import { TimelineWorkspaceFoundation } from "./timelineWorkspaceFoundation.ts";

const register = (group: string, names: readonly string[]) => Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-10:2/${group}/${String(index + 1).padStart(2, "0")}`,
    key: `${group.toLowerCase()}-${String(index + 1).padStart(2, "0")}`,
    name,
    group,
    source: TimelineWorkspaceFoundation.identity.id,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const TimelineWorkspaceReferenceRegistry = Object.freeze({
  statusTypes: register("StatusType", [
    "Recorded", "Verified", "Reviewed", "Published", "Archived",
  ]),
  historicalReferenceTypes: register("HistoricalReferenceType", [
    "Goal Reference",
    "KPI Reference",
    "Strategy Reference",
    "Problem Reference",
    "Decision Reference",
    "Scenario Reference",
    "War Room Reference",
    "Value Reference",
    "Business Object Reference",
    "Executive Reference",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
