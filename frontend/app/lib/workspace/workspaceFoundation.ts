/**
 * WS-1:1 — Canonical Workspace Foundation surface for Registry.
 */

import { WorkspaceFoundationBoundaries } from "./workspaceFoundationBoundaries.ts";
import { WorkspaceFoundationCapabilities } from "./workspaceFoundationCapabilities.ts";
import { WorkspaceFoundationContracts } from "./workspaceFoundationContracts.ts";
import { WorkspaceFoundationCategories, WorkspaceFoundationLifecycle } from "./workspaceFoundationLifecycle.ts";
import { WorkspaceFoundationResponsibilities } from "./workspaceFoundationResponsibilities.ts";
import type { WorkspaceFoundationIdentity } from "./workspaceFoundationTypes.ts";

const Identity = Object.freeze({
  id: "WS-1:1/WorkspaceFoundation",
  name: "Workspace Foundation",
  layer: "Workspace",
  phase: "1:1",
  version: "1.0.0",
  status: "ReadyForRegistry",
} as const satisfies WorkspaceFoundationIdentity);

const Terminology = Object.freeze([
  "Workspace",
  "Workspace Session",
  "Workspace Context",
  "Workspace State",
  "Workspace Object",
  "Workspace Collection",
  "Workspace Layout",
  "Workspace View",
  "Workspace Action",
  "Workspace Toolbar",
  "Workspace Timeline",
  "Workspace Advisor",
  "Workspace Scene",
  "Workspace Navigation",
  "Workspace Configuration",
  "Workspace Boundary",
  "Workspace Capability",
  "Workspace Responsibility",
] as const);

export const WorkspaceFoundation = Object.freeze({
  identity: Identity,
  definition: "A bounded executive working environment dedicated to a specific management objective.",
  architecture: Object.freeze({
    position: "Executive interaction layer between the Manager and Nexora.",
    dependencyDirection: Object.freeze([
      "Manager",
      "Workspace Layer",
      "Assistant",
      "Director",
      "EVE",
      "Engine",
      "DKL",
      "NEA",
      "Integration Runtime",
    ]),
    lowerLayerBehaviorImplemented: false,
    metadataOnly: true,
    immutable: true,
  }),
  contracts: WorkspaceFoundationContracts,
  capabilities: WorkspaceFoundationCapabilities,
  responsibilities: WorkspaceFoundationResponsibilities,
  lifecycle: WorkspaceFoundationLifecycle,
  boundaries: WorkspaceFoundationBoundaries,
  categories: WorkspaceFoundationCategories,
  terminology: Terminology,
  publicApiSurface: Object.freeze(["WorkspaceFoundation"]),
  nextPhase: "WS-1:2 — Workspace Registry",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeExecution: false,
  uiImplementation: false,
  rendering: false,
  navigationLogic: false,
  stateManagement: false,
  orchestration: false,
  artificialIntelligenceExecution: false,
} as const);
