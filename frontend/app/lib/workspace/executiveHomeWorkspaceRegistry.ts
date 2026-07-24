/** WS-2:2 — Canonical Executive Home Registry surface for Model. */
import { ExecutiveHomeWorkspaceBoundaryRegistry } from "./executiveHomeWorkspaceBoundaryRegistry.ts";
import { ExecutiveHomeWorkspaceCapabilityRegistry } from "./executiveHomeWorkspaceCapabilityRegistry.ts";
import { ExecutiveHomeWorkspaceCategoryRegistry } from "./executiveHomeWorkspaceCategoryRegistry.ts";
import { ExecutiveHomeWorkspaceFoundation } from "./executiveHomeWorkspaceFoundation.ts";
import { ExecutiveHomeWorkspaceLifecycleRegistry } from "./executiveHomeWorkspaceLifecycleRegistry.ts";
import { ExecutiveHomeWorkspaceResponsibilityRegistry } from "./executiveHomeWorkspaceResponsibilityRegistry.ts";
import type { ExecutiveHomeRegistryIdentity, ExecutiveHomeRegistryRecord } from "./executiveHomeWorkspaceRegistryTypes.ts";

const identity = Object.freeze({
  id: "WS-2:2/ExecutiveHomeWorkspaceRegistry", name: "Executive Home Workspace Registry",
  layer: "Workspace", phase: "2:2", version: "1.0.0", status: "ReadyForModel",
  namespace: "nexora.workspace.executive-home.registry",
} as const satisfies ExecutiveHomeRegistryIdentity);

const contracts = Object.freeze(ExecutiveHomeWorkspaceFoundation.contracts.map((source, index) => Object.freeze({
  id: `WS-2:2/Contract/${String(index + 1).padStart(2, "0")}`,
  key: `contract-${String(index + 1).padStart(2, "0")}`, name: source.name,
  description: source.description, registryCategory: "Contract",
  sourcePhase: "WS-2:1", source, version: "1.0.0", stability: "Stable",
  ownership: "Executive Home Workspace", extensionPolicy: "Additive",
  metadataOnly: true, immutable: true,
})) satisfies readonly ExecutiveHomeRegistryRecord[]);

const terminology = Object.freeze(ExecutiveHomeWorkspaceFoundation.terminology.map((source, index) => Object.freeze({
  id: `WS-2:2/Terminology/${String(index + 1).padStart(2, "0")}`,
  key: `terminology-${String(index + 1).padStart(2, "0")}`, name: source,
  description: `Registers ${source} as canonical terminology.`,
  registryCategory: "Terminology", sourcePhase: "WS-2:1", source,
  version: "1.0.0", stability: "Stable", ownership: "Executive Home Workspace",
  extensionPolicy: "Additive", metadataOnly: true, immutable: true,
})) satisfies readonly ExecutiveHomeRegistryRecord[]);

const inventory = Object.freeze({
  categoryCount: ExecutiveHomeWorkspaceCategoryRegistry.length,
  contractCount: contracts.length,
  capabilityCount: ExecutiveHomeWorkspaceCapabilityRegistry.length,
  responsibilityCount: ExecutiveHomeWorkspaceResponsibilityRegistry.length,
  lifecycleCount: ExecutiveHomeWorkspaceLifecycleRegistry.length,
  boundaryCount: ExecutiveHomeWorkspaceBoundaryRegistry.length,
  terminologyCount: terminology.length,
  collectionCount: 7, derivedFromFoundation: true, deterministic: true, immutable: true,
} as const);

export const ExecutiveHomeWorkspaceRegistry = Object.freeze({
  identity, foundation: ExecutiveHomeWorkspaceFoundation,
  categories: ExecutiveHomeWorkspaceCategoryRegistry, contracts,
  capabilities: ExecutiveHomeWorkspaceCapabilityRegistry,
  responsibilities: ExecutiveHomeWorkspaceResponsibilityRegistry,
  lifecycle: ExecutiveHomeWorkspaceLifecycleRegistry,
  boundaries: ExecutiveHomeWorkspaceBoundaryRegistry, terminology, inventory,
  readiness: "ReadyForModel", nextPhase: "WS-2:3 — Executive Home Workspace Model",
  upstreamDependencies: Object.freeze(["WS-2:1 Executive Home Workspace Foundation"]),
  publicApiSurface: Object.freeze(["ExecutiveHomeWorkspaceRegistry"]),
  metadataOnly: true, immutable: true, deterministic: true,
  runtime: false, dashboardImplementation: false, widgets: false, ui: false,
  rendering: false, navigationBehavior: false, persistence: false,
  stateMutation: false, workflowExecution: false, aiExecution: false,
} as const);

