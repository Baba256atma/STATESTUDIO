/** WS-10:3 — Immutable Timeline Workspace domain model declarations. */
import { TimelineWorkspaceRegistry } from "./timelineWorkspaceRegistry.ts";

const names = Object.freeze([
  "TimelineWorkspaceModel",
  "ExecutiveTimelineModel",
  "TimelineIdentityModel",
  "TimelineEventModel",
  "HistoricalRecordModel",
  "ExecutiveMilestoneModel",
  "WorkspaceTransitionModel",
  "ExecutiveHistoryModel",
  "BusinessChronologyModel",
  "TimelineNavigationModel",
  "HistoricalTraceabilityModel",
  "TimelineLifecycleModel",
  "TimelineReadinessModel",
  "ExecutiveTimelineRepresentationModel",
  "TimelineBoundaryModel",
] as const);

export const TimelineWorkspaceDomainModels = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-10:3/DomainModel/${String(index + 1).padStart(2, "0")}`,
    name,
    kind: "Domain Model",
    source: TimelineWorkspaceRegistry.identity.id,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
