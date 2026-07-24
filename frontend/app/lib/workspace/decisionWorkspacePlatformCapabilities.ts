/** WS-4:6 — Immutable Platform capabilities. */
import { DecisionWorkspaceManifest } from "./decisionWorkspaceManifest.ts";

const names = Object.freeze([
  "Decision Workspace Composition",
  "Metadata Publication",
  "Canonical Identity Preservation",
  "Public API Publication",
  "Compatibility Declaration",
  "Extension Declaration",
  "Dependency Preservation",
  "Manifest Composition",
  "Certification Readiness",
  "Platform Integrity",
] as const);

export const DecisionWorkspacePlatformCapabilities = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-4:6/Capability/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Declares ${name.toLowerCase()} as Platform metadata.`,
    sourcePhase: "WS-4:5",
    source: DecisionWorkspaceManifest,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
