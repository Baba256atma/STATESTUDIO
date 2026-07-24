/** WS-1:6 — Manifest-backed Platform guarantees. */
import { WorkspaceManifest } from "./workspaceManifest.ts";
const names = Object.freeze(["Single Canonical Platform Identity", "Manifest-Derived Architecture",
  "Deterministic Public Composition", "Immutable Platform Surface",
  "Complete Architectural Traceability", "Stable Workspace Vocabulary",
  "Stable Workspace Model Structure", "Stable Lifecycle Definition", "Stable Boundary Definition",
  "Stable Compatibility Declaration", "Stable Extension Policy", "No Duplicated Inventory",
  "No Runtime Behavior", "No UI Implementation", "No Rendering Implementation",
  "No Orchestration Implementation", "Certification Readiness"] as const);
export const WorkspacePlatformGuarantees = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-1:6/Guarantee/${String(index + 1).padStart(2, "0")}`, name,
  description: `${name} is guaranteed through the Workspace Manifest.`,
  source: WorkspaceManifest, metadataOnly: true, immutable: true,
})));

