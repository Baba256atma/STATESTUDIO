/** WS-10:1 — Immutable Timeline Workspace architectural contracts. */
const names = Object.freeze([
  "TimelineWorkspaceContract",
  "TimelineIdentityContract",
  "TimelineEventContract",
  "HistoricalRecordContract",
  "ExecutiveMilestoneContract",
  "WorkspaceTransitionContract",
  "ExecutiveHistoryContract",
  "BusinessChronologyContract",
  "TimelineNavigationContract",
  "HistoricalTraceabilityContract",
  "TimelineBoundaryContract",
  "TimelineWorkspaceFoundationContract",
] as const);

export const TimelineWorkspaceContracts = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-10:1/Contract/${String(index + 1).padStart(2, "0")}`,
    name,
    kind: "Architectural Contract",
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
