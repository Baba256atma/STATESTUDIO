/** WS-8:2 — Immutable event and incident registries. */
import { WarRoomWorkspaceFoundation } from "./warRoomWorkspaceFoundation.ts";

const register = (
  group: string,
  names: readonly string[],
) => Object.freeze(
  names.map((name, index) =>
    Object.freeze({
      id: `WS-8:2/${group}/${String(index + 1).padStart(2, "0")}`,
      key: `${group.toLowerCase()}-${String(index + 1).padStart(2, "0")}`,
      name,
      group,
      source: WarRoomWorkspaceFoundation,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

export const WarRoomWorkspaceEventIncidentRegistry = Object.freeze({
  eventTypes: register("Event", [
    "Executive Event",
    "Business Event",
    "Operational Event",
    "Decision Event",
    "Incident Event",
    "Milestone Event",
    "Approval Event",
    "Escalation Event",
    "Recovery Event",
    "Completion Event",
  ]),
  incidentTypes: register("Incident", [
    "Production Incident",
    "Financial Incident",
    "Customer Incident",
    "Technology Incident",
    "Security Incident",
    "Quality Incident",
    "Resource Incident",
    "Compliance Incident",
    "Operational Incident",
    "Executive Incident",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
