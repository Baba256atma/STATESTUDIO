/** WS-8:1 — Immutable War Room Workspace Foundation contracts. */
const names = Object.freeze([
  "WarRoomWorkspaceContract",
  "WarRoomIdentityContract",
  "OperationalStatusContract",
  "ExecutiveAlertContract",
  "ExecutiveEventContract",
  "ExecutiveIncidentContract",
  "ExecutiveActivityContract",
  "OperationalMonitoringContract",
  "ExecutiveResponseContract",
  "OperationalCoordinationContract",
  "ExecutiveCollaborationContract",
  "WarRoomWorkspaceFoundationContract",
] as const);

export const WarRoomWorkspaceContracts = Object.freeze(
  names.map((name, index) =>
    Object.freeze({
      id: `WS-8:1/Contract/${String(index + 1).padStart(2, "0")}`,
      name,
      kind: "Architectural Contract",
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
