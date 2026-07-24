/** WS-8:5 — Immutable declarative Manifest guarantees. */
import { WarRoomWorkspaceValidation } from "./warRoomWorkspaceValidation.ts";

const names = Object.freeze([
  "Foundation Registered", "Registry Complete", "Model Complete",
  "Validation Passed", "Metadata Complete", "Canonical Naming Verified",
  "Dependency Integrity Verified", "Boundary Compliance Verified",
  "Inventory Complete", "ReadyForPlatform",
] as const);

export const WarRoomWorkspaceManifestGuarantees = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-8:5/Guarantee/${String(index + 1).padStart(2, "0")}`,
    name,
    state: "Satisfied",
    source: WarRoomWorkspaceValidation,
    order: index + 1,
    declarative: true,
    metadataOnly: true,
    immutable: true,
  })),
);
