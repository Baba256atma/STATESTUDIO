/** WS-6:7 — Exactly 16 immutable non-executable certification gates. */
import { ProblemWorkspaceCertificationCriteria } from "./problemWorkspaceCertificationCriteria.ts";
import { ProblemWorkspacePlatform } from "./problemWorkspacePlatform.ts";

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

export const ProblemWorkspaceCertificationGates = Object.freeze(
  names.map((name, index) =>
    Object.freeze({
      id: `WS-6:7/Gate/${String(index + 1).padStart(2, "0")}`,
      name,
      relatedCriterion: ProblemWorkspaceCertificationCriteria[index],
      declaredState: "Passed",
      source: ProblemWorkspacePlatform,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
