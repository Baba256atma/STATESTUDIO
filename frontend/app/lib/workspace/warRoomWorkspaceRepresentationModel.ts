/** WS-8:3 — Canonical executive War Room representation. */
import { WarRoomWorkspaceRegistry } from "./warRoomWorkspaceRegistry.ts";

const fieldNames = Object.freeze([
  "Identity",
  "Title",
  "Description",
  "Operational Category",
  "Operational Status",
  "Active Alerts",
  "Active Events",
  "Active Incidents",
  "Coordination References",
  "Monitoring References",
  "Response References",
  "Collaboration References",
  "Lifecycle",
  "Readiness",
  "Metadata",
] as const);

export const WarRoomWorkspaceRepresentationModel = Object.freeze({
  id: "WS-8:3/ExecutiveWarRoomRepresentationModel",
  name: "ExecutiveWarRoomRepresentationModel",
  fields: Object.freeze(
    fieldNames.map((name, index) =>
      Object.freeze({
        id:
          `WS-8:3/RepresentationField/${String(index + 1).padStart(2, "0")}`,
        name,
        order: index + 1,
        runtimeValue: false,
        computed: false,
        metadataOnly: true,
        immutable: true,
      }),
    ),
  ),
  source: WarRoomWorkspaceRegistry,
  runtimeValues: false,
  computedValues: false,
  metadataOnly: true,
  immutable: true,
} as const);
