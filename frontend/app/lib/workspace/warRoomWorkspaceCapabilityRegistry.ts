/** WS-8:2 — Foundation-derived immutable capability registry. */
import { WarRoomWorkspaceFoundation } from "./warRoomWorkspaceFoundation.ts";

export const WarRoomWorkspaceCapabilityRegistry = Object.freeze(
  WarRoomWorkspaceFoundation.capabilities.map((source, index) =>
    Object.freeze({
      id: `WS-8:2/Capability/${String(index + 1).padStart(2, "0")}`,
      key: `capability-${String(index + 1).padStart(2, "0")}`,
      name: source.name,
      group: "Workspace Capability",
      source,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
