/** WS-1:5 — Canonical Manifest surface for Platform. */
import { WorkspaceManifestCapabilities } from "./workspaceManifestCapabilities.ts";
import { WorkspaceManifestCompatibility, WorkspaceManifestExtensions } from "./workspaceManifestCompatibility.ts";
import { WorkspaceManifestGuarantees } from "./workspaceManifestGuarantees.ts";
import { WorkspaceManifestInventory } from "./workspaceManifestInventory.ts";
import { WorkspaceManifestReadiness } from "./workspaceManifestReadiness.ts";
import { WorkspaceValidation } from "./workspaceValidation.ts";
export const WorkspaceManifest = Object.freeze({
  identity: Object.freeze({ id: "WS-1:5/WorkspaceManifest", name: "Workspace Manifest",
    layer: "Workspace", phase: "1:5", version: "1.0.0", status: "ReadyForPlatform",
    namespace: "nexora.workspace.manifest", sourcePhase: "WS-1:4",
    ownership: "Workspace", stability: "Stable" }),
  validation: WorkspaceValidation, inventory: WorkspaceManifestInventory,
  capabilities: WorkspaceManifestCapabilities, guarantees: WorkspaceManifestGuarantees,
  compatibility: WorkspaceManifestCompatibility, extensions: WorkspaceManifestExtensions,
  readiness: WorkspaceManifestReadiness, platformHandoff: "WS-1:6 Workspace Platform",
  upstreamDependencies: Object.freeze(["WS-1:4 Workspace Validation"]),
  publicApiSurface: Object.freeze(["WorkspaceManifest"]),
  metadataOnly: true, immutable: true, runtime: false, ui: false, rendering: false,
  stateManagement: false, persistence: false, orchestration: false,
} as const);

