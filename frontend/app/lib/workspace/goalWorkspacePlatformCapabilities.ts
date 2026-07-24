/** WS-3:6 — Immutable Platform capabilities. */
import { GoalWorkspaceManifest } from "./goalWorkspaceManifest.ts";
const names = Object.freeze(["Goal Workspace Composition", "Metadata Publication",
  "Canonical Identity Preservation", "Public API Publication", "Compatibility Declaration",
  "Extension Declaration", "Dependency Preservation", "Manifest Composition",
  "Certification Readiness", "Platform Integrity"] as const);
export const GoalWorkspacePlatformCapabilities = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-3:6/Capability/${String(index + 1).padStart(2, "0")}`, name,
  description: `Declares ${name.toLowerCase()} as Platform metadata.`,
  sourcePhase: "WS-3:5", source: GoalWorkspaceManifest, order: index + 1,
  executable: false, metadataOnly: true, immutable: true,
})));

