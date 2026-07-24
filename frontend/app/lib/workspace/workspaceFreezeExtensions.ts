/** WS-1:8 — Frozen controlled extension and mutation policy. */
import { WorkspaceCertification } from "./workspaceCertification.ts";
const names = Object.freeze(["New Workspace Types", "Additional Workspace Metadata",
  "Custom Workspace Configuration", "Custom View Declarations", "Custom Action Declarations",
  "Custom Object References", "Custom Timeline References", "Custom Advisor References",
  "Custom Scene References", "Custom Permission References"] as const);
export const WorkspaceFreezeExtensions = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-1:8/Extension/${String(index + 1).padStart(2, "0")}`, name,
  policy: "Future phase or version only", source: WorkspaceCertification,
  state: "Frozen", metadataOnly: true, immutable: true,
})));
export const WorkspaceFreezeMutationPolicy = Object.freeze([
  "Frozen records are immutable", "Existing canonical IDs cannot be changed",
  "Existing keys cannot be reassigned", "Existing semantic meanings cannot be changed",
  "Existing inventories cannot be silently rewritten",
  "Breaking changes require a new major version",
  "Additive compatible extensions require controlled future phases",
  "Public consumers must use the Public Index, not Freeze directly",
] as const);

