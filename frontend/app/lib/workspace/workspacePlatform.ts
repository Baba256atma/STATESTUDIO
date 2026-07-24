/** WS-1:6 — Canonical Platform surface for Certification. */
import { WorkspaceManifest } from "./workspaceManifest.ts";
import { WorkspacePlatformCapabilities } from "./workspacePlatformCapabilities.ts";
import { WorkspacePlatformCompatibility } from "./workspacePlatformCompatibility.ts";
import { WorkspacePlatformComposition } from "./workspacePlatformComposition.ts";
import { WorkspacePlatformGuarantees } from "./workspacePlatformGuarantees.ts";
import { WorkspacePlatformInventory, WorkspacePlatformReadiness } from "./workspacePlatformReadiness.ts";
export const WorkspacePlatform = Object.freeze({
  identity: Object.freeze({ id: "WS-1:6/WorkspacePlatform", name: "Workspace Platform",
    layer: "Workspace", phase: "1:6", version: "1.0.0", status: "ReadyForCertification",
    namespace: "nexora.workspace.platform" }),
  manifest: WorkspaceManifest, composition: WorkspacePlatformComposition,
  capabilities: WorkspacePlatformCapabilities, guarantees: WorkspacePlatformGuarantees,
  compatibility: WorkspacePlatformCompatibility, extensions: WorkspaceManifest.extensions,
  inventory: WorkspacePlatformInventory, readiness: WorkspacePlatformReadiness,
  certificationHandoff: "WS-1:7 Workspace Certification",
  upstreamDependencies: Object.freeze(["WS-1:5 Workspace Manifest"]),
  publicApiSurface: Object.freeze(["WorkspacePlatform"]),
  metadataOnly: true, immutable: true, runtime: false, ui: false, rendering: false,
  navigationExecution: false, workflowExecution: false, orchestration: false,
} as const);

