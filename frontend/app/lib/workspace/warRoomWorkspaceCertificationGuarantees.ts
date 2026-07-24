/** WS-8:7 — Immutable declarative Certification guarantees. */
import { WarRoomWorkspacePlatform } from "./warRoomWorkspacePlatform.ts";

const names = Object.freeze([
  "Canonical Architecture Guaranteed", "Stable Metadata Guaranteed",
  "Dependency Chain Guaranteed", "Boundary Preservation Guaranteed",
  "Export Stability Guaranteed", "Freeze Eligibility Guaranteed",
] as const);

export const WarRoomWorkspaceCertificationGuarantees = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-8:7/Guarantee/${String(index + 1).padStart(2, "0")}`,
    name,
    state: "Guaranteed",
    source: WarRoomWorkspacePlatform,
    order: index + 1,
    declarative: true,
    metadataOnly: true,
    immutable: true,
  })),
);
