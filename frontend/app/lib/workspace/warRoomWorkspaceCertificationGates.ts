/** WS-8:7 — Exactly 16 immutable non-executable gates. */
import { WarRoomWorkspaceCertificationCriteria } from "./warRoomWorkspaceCertificationCriteria.ts";
import { WarRoomWorkspacePlatform } from "./warRoomWorkspacePlatform.ts";

const names = Object.freeze([
  "Foundation Gate", "Registry Gate", "Model Gate", "Validation Gate",
  "Manifest Gate", "Platform Gate", "Identity Gate", "Namespace Gate",
  "Dependency Gate", "Metadata Gate", "Boundary Gate", "Export Gate",
  "Integrity Gate", "Stability Gate", "Workspace Gate",
  "Freeze Readiness Gate",
] as const);

export const WarRoomWorkspaceCertificationGates = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-8:7/Gate/${String(index + 1).padStart(2, "0")}`,
    name,
    relatedCriterion: WarRoomWorkspaceCertificationCriteria[index],
    declaredState: "Passed",
    source: WarRoomWorkspacePlatform,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
