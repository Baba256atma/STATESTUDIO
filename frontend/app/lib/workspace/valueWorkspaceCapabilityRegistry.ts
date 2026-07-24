/** WS-9:2 — Foundation-derived immutable capability registry. */
import { ValueWorkspaceCapabilities } from "./valueWorkspaceCapabilities.ts";

export const ValueWorkspaceCapabilityRegistry = Object.freeze(
  ValueWorkspaceCapabilities.map((source, index) => Object.freeze({
    id: `WS-9:2/Capability/${String(index + 1).padStart(2, "0")}`,
    key: `capability-${String(index + 1).padStart(2, "0")}`,
    name: source.name,
    group: "WorkspaceCapability",
    source,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
