/** WS-1:5 — Named compatibility and controlled extension declarations. */
import { WorkspaceValidation } from "./workspaceValidation.ts";
const compatibilityNames = Object.freeze(["Assistant", "Director", "EVE", "Engine", "DKL", "NEA",
  "Integration Runtime", "Future Workspace Modules", "Future Workspace UI",
  "Future Workspace Runtime"] as const);
const extensionNames = Object.freeze(["New Workspace Types", "Custom Workspace Metadata",
  "Custom Workspace Views", "Custom Object References", "Custom Timeline References",
  "Custom Advisor References", "Custom Scene References", "Custom Action Declarations",
  "Custom Configuration", "Custom Permission References"] as const);
export const WorkspaceManifestCompatibility = Object.freeze(compatibilityNames.map((name, index) => Object.freeze({
  id: `WS-1:5/Compatibility/${String(index + 1).padStart(2, "0")}`, name,
  description: `Declares architecture-only compatibility with ${name}.`,
  source: WorkspaceValidation, status: "Compatible", metadataOnly: true, immutable: true,
})));
export const WorkspaceManifestExtensions = Object.freeze(extensionNames.map((name, index) => Object.freeze({
  id: `WS-1:5/Extension/${String(index + 1).padStart(2, "0")}`, name,
  description: `${name} requires canonical identity, boundaries, and validation.`,
  source: WorkspaceValidation, status: "Controlled", metadataOnly: true, immutable: true,
})));

