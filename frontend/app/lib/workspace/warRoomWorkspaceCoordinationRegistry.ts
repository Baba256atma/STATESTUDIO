/** WS-8:2 — Immutable coordination and monitoring declarations. */
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
      liveMonitoring: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

export const WarRoomWorkspaceCoordinationRegistry = Object.freeze({
  coordinationTypes: register("Coordination", [
    "Executive Coordination",
    "Cross-Team Coordination",
    "Department Coordination",
    "Project Coordination",
    "Crisis Coordination",
    "Operational Coordination",
    "Stakeholder Coordination",
  ]),
  monitoringDomains: register("Monitoring", [
    "Goals",
    "KPIs",
    "Projects",
    "Decisions",
    "Scenarios",
    "Risks",
    "Resources",
    "Operations",
    "Teams",
    "Business Objects",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
