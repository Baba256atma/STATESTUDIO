/** WS-8:7 — Dependency and architectural compliance declarations. */
import { WarRoomWorkspacePlatform } from "./warRoomWorkspacePlatform.ts";

export const WarRoomWorkspaceCertificationDependencyVerification =
  Object.freeze({
    canonicalChain: WarRoomWorkspacePlatform.composition.canonicalDependencyChain,
    platform: WarRoomWorkspacePlatform,
    directDependency: "WS-8:6 War Room Workspace Platform",
    downstreamReferences: Object.freeze([]),
    state: "Verified",
    metadataOnly: true,
    immutable: true,
  } as const);

const exclusions = Object.freeze([
  "Runtime", "Engine Logic", "Director Logic", "EVE Logic", "DKL Logic",
  "NEA Logic", "EIL Logic", "SDK Logic", "UI Logic", "Persistence",
  "Networking", "Rendering", "Orchestration", "Live Monitoring",
  "Event Processing", "Incident Management", "Services", "Factories",
] as const);

export const WarRoomWorkspaceCertificationCompliance = Object.freeze(
  exclusions.map((name, index) => Object.freeze({
    id: `WS-8:7/Compliance/${String(index + 1).padStart(2, "0")}`,
    name: `No ${name}`,
    present: false,
    source: WarRoomWorkspacePlatform,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
