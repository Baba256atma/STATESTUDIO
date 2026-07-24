/** WS-8:1 — Canonical War Room Workspace Foundation surface. */
import { WarRoomWorkspaceBoundaries } from "./warRoomWorkspaceBoundaries.ts";
import {
  WarRoomWorkspaceCapabilities,
  WarRoomWorkspaceResponsibilities,
} from "./warRoomWorkspaceCapabilities.ts";
import { WarRoomWorkspaceContracts } from "./warRoomWorkspaceContracts.ts";
import { WarRoomWorkspaceIdentity } from "./warRoomWorkspaceIdentity.ts";
import { WarRoomWorkspaceLifecycle } from "./warRoomWorkspaceLifecycle.ts";
import { WarRoomWorkspaceTerminology } from "./warRoomWorkspaceTerminology.ts";

export const WarRoomWorkspaceFoundation = Object.freeze({
  identity: WarRoomWorkspaceIdentity,
  architecturalPosition: Object.freeze([
    "Executive Home",
    "Goal Workspace",
    "KPI Workspace",
    "Strategy Workspace",
    "Problem Workspace",
    "Decision Workspace",
    "Scenario Workspace",
    "War Room Workspace",
    "Value Workspace",
    "Timeline Workspace",
  ]),
  purpose:
    "Provide the executive operational environment for coordinating, supervising, and monitoring the declared execution of executive initiatives.",
  contracts: WarRoomWorkspaceContracts,
  capabilities: WarRoomWorkspaceCapabilities,
  responsibilities: WarRoomWorkspaceResponsibilities,
  terminology: WarRoomWorkspaceTerminology,
  lifecycle: WarRoomWorkspaceLifecycle,
  boundaries: WarRoomWorkspaceBoundaries,
  inventory: Object.freeze({
    contractCount: WarRoomWorkspaceContracts.length,
    capabilityCount: WarRoomWorkspaceCapabilities.length,
    responsibilityCount: WarRoomWorkspaceResponsibilities.length,
    terminologyCount: WarRoomWorkspaceTerminology.length,
    lifecycleStateCount: WarRoomWorkspaceLifecycle.length,
    boundaryCount: WarRoomWorkspaceBoundaries.length,
  }),
  upstreamDependencies: Object.freeze([]),
  publicApiSurface: Object.freeze(["WarRoomWorkspaceFoundation"]),
  status: "ReadyForRegistry",
  readiness: "ReadyForRegistry",
  nextPhase: "WS-8:2 — War Room Workspace Registry",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  orchestration: false,
  aiReasoning: false,
  monitoring: false,
  alertProcessing: false,
  workflowExecution: false,
  persistence: false,
  networking: false,
  rendering: false,
  visualization: false,
  stateManagement: false,
  services: false,
  factories: false,
  businessLogic: false,
} as const);
