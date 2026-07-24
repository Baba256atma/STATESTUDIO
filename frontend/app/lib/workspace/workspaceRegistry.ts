/**
 * WS-1:2 — Canonical Workspace Registry surface for the Model phase.
 */

import { WorkspaceFoundation } from "./workspaceFoundation.ts";
import { WorkspaceBoundaryRegistry } from "./workspaceBoundaryRegistry.ts";
import { WorkspaceCapabilityRegistry } from "./workspaceCapabilityRegistry.ts";
import { WorkspaceLifecycleRegistry } from "./workspaceLifecycleRegistry.ts";
import { WorkspaceResponsibilityRegistry } from "./workspaceResponsibilityRegistry.ts";
import type { WorkspaceRegistryIdentity, WorkspaceRegistryRecord } from "./workspaceRegistryTypes.ts";
import { WorkspaceTypeRegistry } from "./workspaceTypeRegistry.ts";

const Identity = Object.freeze({
  id: "WS-1:2/WorkspaceRegistry",
  name: "Workspace Registry",
  layer: "Workspace",
  phase: "1:2",
  version: "1.0.0",
  status: "ReadyForModel",
  namespace: "nexora.workspace.registry",
} as const satisfies WorkspaceRegistryIdentity);

const WorkspaceContractRegistry = Object.freeze(
  WorkspaceFoundation.contracts.map((source) => Object.freeze({
    id: source.id.replace("WS-1:1/Contract/", "WS-1:2/Contract/"),
    key: `contract-${source.id.split("/").at(-1) ?? source.id}`,
    name: source.name,
    description: source.description,
    registryCategory: "Contract",
    sourcePhase: "WS-1:1",
    source,
    stability: "Stable",
    version: "1.0.0",
    ownership: "Workspace",
    extensionPolicy: "Additive",
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly WorkspaceRegistryRecord[],
);

const WorkspaceTerminologyRegistry = Object.freeze(
  WorkspaceFoundation.terminology.map((source, index) => Object.freeze({
    id: `WS-1:2/Terminology/${String(index + 1).padStart(2, "0")}`,
    key: `terminology-${source.toLowerCase().replaceAll(" ", "-")}`,
    name: source,
    description: `Registers ${source} as canonical Workspace terminology.`,
    registryCategory: "Terminology",
    sourcePhase: "WS-1:1",
    source,
    stability: "Stable",
    version: "1.0.0",
    ownership: "Workspace",
    extensionPolicy: "Additive",
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly WorkspaceRegistryRecord[],
);

const Inventory = Object.freeze({
  workspaceTypeCount: WorkspaceTypeRegistry.length,
  contractCount: WorkspaceContractRegistry.length,
  capabilityCount: WorkspaceCapabilityRegistry.length,
  responsibilityCount: WorkspaceResponsibilityRegistry.length,
  lifecycleCount: WorkspaceLifecycleRegistry.length,
  boundaryCount: WorkspaceBoundaryRegistry.length,
  terminologyCount: WorkspaceTerminologyRegistry.length,
  collectionCount: 7,
  version: "1.0.0",
  derivedFromFoundation: true,
} as const);

export const WorkspaceRegistry = Object.freeze({
  identity: Identity,
  types: WorkspaceTypeRegistry,
  contracts: WorkspaceContractRegistry,
  capabilities: WorkspaceCapabilityRegistry,
  responsibilities: WorkspaceResponsibilityRegistry,
  lifecycle: WorkspaceLifecycleRegistry,
  boundaries: WorkspaceBoundaryRegistry,
  terminology: WorkspaceTerminologyRegistry,
  inventory: Inventory,
  foundation: WorkspaceFoundation,
  readiness: "ReadyForModel",
  nextPhase: "WS-1:3 — Workspace Model",
  upstreamDependencies: Object.freeze(["WS-1:1 Workspace Foundation"]),
  publicApiSurface: Object.freeze(["WorkspaceRegistry"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeExecution: false,
  uiImplementation: false,
  rendering: false,
  navigationBehavior: false,
  persistence: false,
  stateMutation: false,
  workflowExecution: false,
  orchestration: false,
} as const);
