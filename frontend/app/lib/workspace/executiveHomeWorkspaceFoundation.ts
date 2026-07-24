/** WS-2:1 — Canonical Executive Home Foundation surface for Registry. */
import { ExecutiveHomeWorkspaceCapabilities } from "./executiveHomeWorkspaceCapabilities.ts";
import { ExecutiveHomeWorkspaceContracts } from "./executiveHomeWorkspaceContracts.ts";
import { ExecutiveHomeWorkspaceBoundaries } from "./executiveHomeWorkspaceBoundaries.ts";
import type { ExecutiveHomeWorkspaceFoundationIdentity } from "./executiveHomeWorkspaceFoundationTypes.ts";
import { ExecutiveHomeWorkspaceCategories, ExecutiveHomeWorkspaceLifecycle,
  ExecutiveHomeWorkspaceTerminology } from "./executiveHomeWorkspaceLifecycle.ts";
import { ExecutiveHomeWorkspaceResponsibilities } from "./executiveHomeWorkspaceResponsibilities.ts";
import { WorkspacePublicIndex } from "./workspacePublicIndex.ts";

const identity = Object.freeze({
  id: "WS-2:1/ExecutiveHomeWorkspaceFoundation",
  name: "Executive Home Workspace Foundation",
  layer: "Workspace", phase: "2:1", version: "1.0.0",
  status: "ReadyForRegistry",
  namespace: "nexora.workspace.executive-home.foundation",
} as const satisfies ExecutiveHomeWorkspaceFoundationIdentity);

export const ExecutiveHomeWorkspaceFoundation = Object.freeze({
  identity,
  purpose: "The executive starting point of Nexora and launch point for specialized Workspaces.",
  definition: "A unified executive environment for referencing executive information and coordinating Workspace-level interactions.",
  architecture: Object.freeze({
    position: "Manager-facing entry Workspace above the canonical WS-1 architecture.",
    workspaceArchitecture: WorkspacePublicIndex,
    dependencyDirection: Object.freeze(["Manager", "Executive Home Workspace",
      "Workspace Foundation", "Assistant", "Director", "EVE", "Engine", "DKL", "NEA"]),
    downstreamBehaviorImplemented: false, metadataOnly: true, immutable: true,
  }),
  contracts: ExecutiveHomeWorkspaceContracts,
  capabilities: ExecutiveHomeWorkspaceCapabilities,
  responsibilities: ExecutiveHomeWorkspaceResponsibilities,
  lifecycle: ExecutiveHomeWorkspaceLifecycle,
  boundaries: ExecutiveHomeWorkspaceBoundaries,
  categories: ExecutiveHomeWorkspaceCategories,
  terminology: ExecutiveHomeWorkspaceTerminology,
  upstreamDependencies: Object.freeze(["WS-1:9 Workspace Public Index"]),
  publicApiSurface: Object.freeze(["ExecutiveHomeWorkspaceFoundation"]),
  readiness: "ReadyForRegistry",
  nextPhase: "WS-2:2 — Executive Home Workspace Registry",
  metadataOnly: true, immutable: true, deterministic: true,
  runtime: false, ui: false, rendering: false, dashboardImplementation: false,
  navigationRuntime: false, persistence: false, orchestration: false, aiExecution: false,
} as const);

