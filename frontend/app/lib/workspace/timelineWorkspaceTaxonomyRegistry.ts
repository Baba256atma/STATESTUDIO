/** WS-10:2 — Immutable timeline event and record registries. */
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

export const TimelineWorkspaceTaxonomyRegistry = Object.freeze({
  eventCategories: register("EventCategory", [
    "Executive Event",
    "Goal Event",
    "KPI Event",
    "Strategy Event",
    "Problem Event",
    "Decision Event",
    "Scenario Event",
    "War Room Event",
    "Value Event",
    "Workspace Event",
    "Business Event",
    "Milestone Event",
    "Approval Event",
    "Review Event",
    "System Event",
  ]),
  recordTypes: register("RecordType", [
    "Event",
    "Milestone",
    "Decision",
    "Action",
    "Transition",
    "Review",
    "Approval",
    "Annotation",
    "Snapshot",
    "Reference",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
