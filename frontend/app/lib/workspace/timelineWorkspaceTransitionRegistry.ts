/** WS-10:2 — Immutable transition and granularity registries. */
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

export const TimelineWorkspaceTransitionRegistry = Object.freeze({
  transitionTypes: register("TransitionType", [
    "Executive Home → Goal",
    "Goal → KPI",
    "KPI → Strategy",
    "Strategy → Problem",
    "Problem → Decision",
    "Decision → Scenario",
    "Scenario → War Room",
    "War Room → Value",
    "Value → Timeline",
    "Workspace Switch",
  ]),
  granularities: register("Granularity", [
    "Year", "Quarter", "Month", "Week", "Day", "Hour", "Minute", "Second",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
