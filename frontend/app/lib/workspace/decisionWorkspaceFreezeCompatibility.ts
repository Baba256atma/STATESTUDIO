/** WS-4:8 — Frozen compatible architecture declarations. */
import { DecisionWorkspaceCertification } from "./decisionWorkspaceCertification.ts";

const names = Object.freeze([
  "Workspace Layer Architecture",
  "Canonical Namespace Rules",
  "Foundation Metadata",
  "Registry Metadata",
  "Model Metadata",
  "Validation Metadata",
  "Manifest Metadata",
  "Platform Metadata",
  "Certification Metadata",
] as const);

export const DecisionWorkspaceFreezeCompatibility = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-4:8/Compatibility/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Confirms frozen compatibility with ${name}.`,
    source: DecisionWorkspaceCertification,
    state: "Compatible",
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
