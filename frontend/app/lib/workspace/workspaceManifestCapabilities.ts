/** WS-1:5 — Architecture capabilities, not implementations. */
import { WorkspaceValidation } from "./workspaceValidation.ts";
const names = Object.freeze(["Workspace Identity Declaration", "Workspace Type Declaration",
  "Workspace Objective Declaration", "Workspace Context Declaration",
  "Workspace Composition Declaration", "Workspace Lifecycle Declaration",
  "Workspace Object Hosting Reference", "Workspace Timeline Reference",
  "Workspace Advisor Reference", "Workspace Scene Reference", "Workspace Navigation Reference",
  "Workspace Action Surface Declaration", "Workspace Permission Awareness",
  "Workspace Configuration Declaration", "Workspace Collaboration Readiness"] as const);
export const WorkspaceManifestCapabilities = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-1:5/Capability/${String(index + 1).padStart(2, "0")}`, name,
  description: `Guarantees ${name.toLowerCase()} as architecture metadata.`,
  source: WorkspaceValidation, status: "Satisfied", metadataOnly: true, immutable: true,
})));

