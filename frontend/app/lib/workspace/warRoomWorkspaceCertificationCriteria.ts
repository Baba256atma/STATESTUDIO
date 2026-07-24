/** WS-8:7 — Exactly 18 immutable Certification criteria. */
import { WarRoomWorkspacePlatform } from "./warRoomWorkspacePlatform.ts";

const names = Object.freeze([
  "Foundation Complete", "Registry Complete", "Model Complete",
  "Validation Complete", "Manifest Complete", "Platform Complete",
  "Canonical Identity Verified", "Namespace Verified", "Version Verified",
  "Dependency Integrity Verified", "Metadata Completeness Verified",
  "Capability Publication Verified", "Responsibility Publication Verified",
  "Boundary Compliance Verified", "Export Stability Verified",
  "Immutable Architecture Verified", "Workspace Integrity Verified",
  "ReadyForFreeze",
] as const);

export const WarRoomWorkspaceCertificationCriteria = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-8:7/Criterion/${String(index + 1).padStart(2, "0")}`,
    name,
    expectedState: "Satisfied",
    declaredState: "Satisfied",
    evidence: WarRoomWorkspacePlatform,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
