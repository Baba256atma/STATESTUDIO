/** WS-9:7 — Exactly 16 immutable non-executable gates. */
import { ValueWorkspaceCertificationCriteria } from "./valueWorkspaceCertificationCriteria.ts";
import { ValueWorkspacePlatform } from "./valueWorkspacePlatform.ts";

const names = Object.freeze([
  "Foundation Gate",
  "Registry Gate",
  "Model Gate",
  "Validation Gate",
  "Manifest Gate",
  "Platform Gate",
  "Identity Gate",
  "Namespace Gate",
  "Dependency Gate",
  "Metadata Gate",
  "Boundary Gate",
  "Export Gate",
  "Integrity Gate",
  "Stability Gate",
  "Workspace Gate",
  "Freeze Readiness Gate",
] as const);

export const ValueWorkspaceCertificationGates = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-9:7/Gate/${String(index + 1).padStart(2, "0")}`,
    name,
    relatedCriterion: ValueWorkspaceCertificationCriteria[index],
    declaredState: "Passed",
    source: ValueWorkspacePlatform,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
