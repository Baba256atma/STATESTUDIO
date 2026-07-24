/** WS-8:2 — Immutable operational taxonomy registries. */
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

export const WarRoomWorkspaceTaxonomyRegistry = Object.freeze({
  operationalCategories: register("Category", [
    "Executive Operations",
    "Strategic Operations",
    "Tactical Operations",
    "Business Operations",
    "Project Operations",
    "Manufacturing Operations",
    "Supply Chain Operations",
    "Customer Operations",
    "IT Operations",
    "Financial Operations",
    "Human Resources Operations",
    "Incident Operations",
    "Emergency Operations",
    "Crisis Operations",
    "Executive Coordination",
  ]),
  operationalStatuses: register("Status", [
    "Planned",
    "Preparing",
    "Active",
    "Monitoring",
    "Escalated",
    "Stabilized",
    "Completed",
    "Archived",
  ]),
  alertTypes: register("Alert", [
    "Executive Alert",
    "Operational Alert",
    "KPI Alert",
    "Risk Alert",
    "Resource Alert",
    "Compliance Alert",
    "Financial Alert",
    "Project Alert",
    "Capacity Alert",
    "Emergency Alert",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
