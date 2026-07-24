/** WS-8:2 — Foundation-derived governance registries. */
import { WarRoomWorkspaceFoundation } from "./warRoomWorkspaceFoundation.ts";

const register = (
  group: string,
  records: readonly ({ readonly name: string } | string)[],
) => Object.freeze(
  records.map((source, index) => {
    const name = typeof source === "string" ? source : source.name;
    return Object.freeze({
      id: `WS-8:2/${group}/${String(index + 1).padStart(2, "0")}`,
      key: `${group.toLowerCase()}-${String(index + 1).padStart(2, "0")}`,
      name,
      group,
      source,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    });
  }),
);

export const WarRoomWorkspaceGovernanceRegistry = Object.freeze({
  responsibilities: register(
    "Responsibility",
    WarRoomWorkspaceFoundation.responsibilities,
  ),
  lifecycle: register("Lifecycle", WarRoomWorkspaceFoundation.lifecycle),
  boundaries: register("Boundary", WarRoomWorkspaceFoundation.boundaries),
  metadataOnly: true,
  immutable: true,
} as const);
