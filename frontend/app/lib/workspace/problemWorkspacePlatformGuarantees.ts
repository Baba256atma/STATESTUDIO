/** WS-6:6 — Immutable declarative Platform guarantees. */
import { ProblemWorkspaceManifest } from "./problemWorkspaceManifest.ts";

const names = Object.freeze([
  "Foundation Available",
  "Registry Available",
  "Model Available",
  "Validation Available",
  "Manifest Available",
  "Dependency Chain Preserved",
  "Canonical Naming Preserved",
  "Immutable Architecture",
  "Stable Public Composition",
  "Metadata Complete",
  "ReadyForCertification",
] as const);

export const ProblemWorkspacePlatformGuarantees = Object.freeze(
  names.map((name, index) =>
    Object.freeze({
      id: `WS-6:6/Guarantee/${String(index + 1).padStart(2, "0")}`,
      name,
      state: "Satisfied",
      source: ProblemWorkspaceManifest,
      order: index + 1,
      declarative: true,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
