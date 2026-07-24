/** WS-5:6 — Immutable Platform capabilities. */
import { ScenarioWorkspaceManifest } from "./scenarioWorkspaceManifest.ts";

const names = Object.freeze([
  "Scenario Workspace Composition",
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

export const ScenarioWorkspacePlatformCapabilities = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-5:6/Capability/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Declares ${name.toLowerCase()} as Platform metadata.`,
    sourcePhase: "WS-5:5",
    source: ScenarioWorkspaceManifest,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
