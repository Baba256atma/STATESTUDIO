/** WS-2:5 — Canonical Manifest surface for Platform. */
import { ExecutiveHomeWorkspaceManifestCapabilities } from "./executiveHomeWorkspaceManifestCapabilities.ts";
import { ExecutiveHomeWorkspaceManifestCompatibility,
  ExecutiveHomeWorkspaceManifestExtensions } from "./executiveHomeWorkspaceManifestCompatibility.ts";
import { ExecutiveHomeWorkspaceManifestGuarantees } from "./executiveHomeWorkspaceManifestGuarantees.ts";
import { ExecutiveHomeWorkspaceManifestInventory } from "./executiveHomeWorkspaceManifestInventory.ts";
import { ExecutiveHomeWorkspaceManifestReadiness } from "./executiveHomeWorkspaceManifestReadiness.ts";
import { ExecutiveHomeWorkspaceValidation } from "./executiveHomeWorkspaceValidation.ts";

export const ExecutiveHomeWorkspaceManifest = Object.freeze({
  identity: Object.freeze({
    id: "WS-2:5/ExecutiveHomeWorkspaceManifest",
    name: "Executive Home Workspace Manifest", layer: "Workspace", phase: "2:5",
    version: "1.0.0", status: "ReadyForPlatform",
    namespace: "nexora.workspace.executive-home.manifest",
    stability: "Stable", sourcePhase: "WS-2:4", ownership: "Executive Home Workspace",
  }),
  validation: ExecutiveHomeWorkspaceValidation,
  inventory: ExecutiveHomeWorkspaceManifestInventory,
  capabilities: ExecutiveHomeWorkspaceManifestCapabilities,
  guarantees: ExecutiveHomeWorkspaceManifestGuarantees,
  compatibility: ExecutiveHomeWorkspaceManifestCompatibility,
  extensions: ExecutiveHomeWorkspaceManifestExtensions,
  readiness: ExecutiveHomeWorkspaceManifestReadiness,
  platformHandoff: "WS-2:6 Executive Home Workspace Platform",
  upstreamDependencies: Object.freeze(["WS-2:4 Executive Home Workspace Validation"]),
  publicApiSurface: Object.freeze(["ExecutiveHomeWorkspaceManifest"]),
  metadataOnly: true, immutable: true, deterministic: true,
  runtime: false, dashboardImplementation: false, widgets: false, ui: false,
  rendering: false, navigationRuntime: false, recommendationEngine: false,
  notificationDelivery: false, persistence: false, aiBehavior: false,
} as const);

