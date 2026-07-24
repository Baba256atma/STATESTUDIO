/** WS-8:3 — Canonical immutable War Room domain models. */
import type { WarRoomWorkspaceModelDescriptor } from "./warRoomWorkspaceIdentityModel.ts";
import { WarRoomWorkspaceRegistry } from "./warRoomWorkspaceRegistry.ts";

const names = Object.freeze([
  "WarRoomWorkspaceModel",
  "ExecutiveWarRoomModel",
  "WarRoomIdentityModel",
  "OperationalStatusModel",
  "ExecutiveAlertModel",
  "ExecutiveEventModel",
  "ExecutiveIncidentModel",
  "ExecutiveActivityModel",
  "OperationalCoordinationModel",
  "ExecutiveResponseModel",
  "ExecutiveMonitoringModel",
  "ExecutiveCollaborationModel",
  "WarRoomLifecycleModel",
  "WarRoomReadinessModel",
  "ExecutiveWarRoomRepresentationModel",
] as const);

export const WarRoomWorkspaceDomainModels = Object.freeze(
  names.map((name, index) =>
    Object.freeze({
      id: `WS-8:3/DomainModel/${String(index + 1).padStart(2, "0")}`,
      name,
      description: `Defines the structural ${name} metadata.`,
      source: WarRoomWorkspaceRegistry,
      metadataOnly: true,
      immutable: true,
    }),
  ) satisfies readonly WarRoomWorkspaceModelDescriptor[],
);
