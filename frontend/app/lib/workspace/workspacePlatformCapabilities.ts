/** WS-1:6 — Metadata discovery capabilities. */
import { WorkspaceManifest } from "./workspaceManifest.ts";
const names = Object.freeze(["Workspace Architecture Discovery", "Workspace Type Discovery",
  "Workspace Contract Discovery", "Workspace Capability Discovery",
  "Workspace Responsibility Discovery", "Workspace Lifecycle Discovery",
  "Workspace Boundary Discovery", "Workspace Model Discovery",
  "Workspace Relationship Discovery", "Workspace Validation Discovery",
  "Workspace Guarantee Discovery", "Workspace Compatibility Discovery",
  "Workspace Extension Discovery", "Workspace Inventory Discovery",
  "Certification Readiness Inspection"] as const);
export const WorkspacePlatformCapabilities = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-1:6/Capability/${String(index + 1).padStart(2, "0")}`, name,
  description: `${name} provides immutable metadata access only.`,
  source: WorkspaceManifest, metadataOnly: true, immutable: true,
})));

