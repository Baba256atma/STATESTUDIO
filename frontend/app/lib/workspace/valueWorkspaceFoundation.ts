/** WS-9:1 — Canonical Value Workspace Foundation surface. */
import { ValueWorkspaceBoundaries } from "./valueWorkspaceBoundaries.ts";
import {
  ValueWorkspaceCapabilities,
  ValueWorkspaceResponsibilities,
} from "./valueWorkspaceCapabilities.ts";
import { ValueWorkspaceContracts } from "./valueWorkspaceContracts.ts";
import { ValueWorkspaceIdentity } from "./valueWorkspaceIdentity.ts";
import { ValueWorkspaceLifecycle } from "./valueWorkspaceLifecycle.ts";
import { ValueWorkspaceTerminology } from "./valueWorkspaceTerminology.ts";

export const ValueWorkspaceFoundation = Object.freeze({
  identity: ValueWorkspaceIdentity,
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
    "Provide the executive environment for representing, organizing, and preparing executive business value information.",
  contracts: ValueWorkspaceContracts,
  capabilities: ValueWorkspaceCapabilities,
  responsibilities: ValueWorkspaceResponsibilities,
  terminology: ValueWorkspaceTerminology,
  lifecycle: ValueWorkspaceLifecycle,
  boundaries: ValueWorkspaceBoundaries,
  inventory: Object.freeze({
    contractCount: ValueWorkspaceContracts.length,
    capabilityCount: ValueWorkspaceCapabilities.length,
    responsibilityCount: ValueWorkspaceResponsibilities.length,
    terminologyCount: ValueWorkspaceTerminology.length,
    lifecycleStateCount: ValueWorkspaceLifecycle.length,
    boundaryCount: ValueWorkspaceBoundaries.length,
  }),
  upstreamDependencies: Object.freeze([]),
  publicApiSurface: Object.freeze(["ValueWorkspaceFoundation"]),
  status: "ReadyForRegistry",
  readiness: "ReadyForRegistry",
  nextPhase: "WS-9:2 — Value Workspace Registry",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  valueCalculation: false,
  roiCalculation: false,
  financialAnalysis: false,
  analytics: false,
  aiReasoning: false,
  orchestration: false,
  persistence: false,
  networking: false,
  rendering: false,
  visualization: false,
  workflowExecution: false,
  stateManagement: false,
  services: false,
  factories: false,
  businessLogic: false,
} as const);
