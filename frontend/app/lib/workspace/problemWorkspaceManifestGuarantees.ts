/** WS-6:5 — Immutable validated Manifest guarantees. */
import { ProblemWorkspaceValidation } from "./problemWorkspaceValidation.ts";

const names = Object.freeze([
  "Foundation Registered",
  "Registry Complete",
  "Model Complete",
  "Validation Passed",
  "Metadata Complete",
  "Canonical Naming Verified",
  "Dependencies Verified",
  "Boundaries Preserved",
  "Inventory Complete",
  "ReadyForPlatform",
] as const);

export const ProblemWorkspaceManifestGuarantees = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-6:5/Guarantee/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Declares ${name.toLowerCase()} for the published architecture.`,
    source: ProblemWorkspaceValidation,
    state: "Satisfied",
    order: index + 1,
    declarative: true,
    metadataOnly: true,
    immutable: true,
  })),
);
