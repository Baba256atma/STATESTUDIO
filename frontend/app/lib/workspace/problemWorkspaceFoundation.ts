/** WS-6:1 — Canonical Problem Workspace Foundation surface for Registry. */
import { ProblemWorkspaceBoundaries } from "./problemWorkspaceBoundaries.ts";
import {
  ProblemWorkspaceCapabilities,
  ProblemWorkspaceResponsibilities,
} from "./problemWorkspaceCapabilities.ts";
import { ProblemWorkspaceContracts } from "./problemWorkspaceContracts.ts";
import { ProblemWorkspaceIdentity } from "./problemWorkspaceIdentity.ts";
import { ProblemWorkspaceLifecycle } from "./problemWorkspaceLifecycle.ts";
import { ProblemWorkspaceTerminology } from "./problemWorkspaceTerminology.ts";

export const ProblemWorkspaceFoundation = Object.freeze({
  identity: ProblemWorkspaceIdentity,
  architecturalPosition: Object.freeze([
    "Executive Home",
    "Goal Workspace",
    "KPI Workspace",
    "Strategy Workspace",
    "Scenario Workspace",
    "Problem Workspace",
    "Decision Workspace",
    "War Room Workspace",
    "Timeline Workspace",
  ]),
  purpose:
    "Provide the executive environment for understanding, structuring, validating, and preparing business problems before downstream decision generation.",
  contracts: ProblemWorkspaceContracts,
  capabilities: ProblemWorkspaceCapabilities,
  responsibilities: ProblemWorkspaceResponsibilities,
  terminology: ProblemWorkspaceTerminology,
  lifecycle: ProblemWorkspaceLifecycle,
  boundaries: ProblemWorkspaceBoundaries,
  inventory: Object.freeze({
    contractCount: ProblemWorkspaceContracts.length,
    capabilityCount: ProblemWorkspaceCapabilities.length,
    responsibilityCount: ProblemWorkspaceResponsibilities.length,
    terminologyCount: ProblemWorkspaceTerminology.length,
    lifecycleStateCount: ProblemWorkspaceLifecycle.length,
    boundaryCount: ProblemWorkspaceBoundaries.length,
  }),
  upstreamDependencies: Object.freeze([]),
  publicApiSurface: Object.freeze(["ProblemWorkspaceFoundation"]),
  readiness: "ReadyForRegistry",
  nextPhase: "WS-6:2 — Problem Workspace Registry",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  orchestration: false,
  reasoning: false,
  aiInference: false,
  persistence: false,
  visualization: false,
  ui: false,
  networking: false,
  execution: false,
  workflow: false,
  stateManagement: false,
  factories: false,
  services: false,
  adapters: false,
  businessLogic: false,
} as const);
