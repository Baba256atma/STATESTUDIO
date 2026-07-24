/** WS-7:1 — Canonical Decision Workspace Foundation surface. */
import { DecisionWorkspaceV7Boundaries } from "./decisionWorkspaceV7Boundaries.ts";
import {
  DecisionWorkspaceV7Capabilities,
  DecisionWorkspaceV7Responsibilities,
} from "./decisionWorkspaceV7Capabilities.ts";
import { DecisionWorkspaceV7Contracts } from "./decisionWorkspaceV7Contracts.ts";
import { DecisionWorkspaceV7Identity } from "./decisionWorkspaceV7Identity.ts";
import { DecisionWorkspaceV7Lifecycle } from "./decisionWorkspaceV7Lifecycle.ts";
import { DecisionWorkspaceV7Terminology } from "./decisionWorkspaceV7Terminology.ts";

export const DecisionWorkspaceV7Foundation = Object.freeze({
  identity: DecisionWorkspaceV7Identity,
  architecturalPosition: Object.freeze([
    "Executive Home",
    "Goal Workspace",
    "KPI Workspace",
    "Strategy Workspace",
    "Problem Workspace",
    "Decision Workspace",
    "Scenario Workspace",
    "War Room Workspace",
    "Timeline Workspace",
  ]),
  purpose:
    "Provide the executive environment for structuring, evaluating, comparing, selecting, and documenting executive decision options.",
  contracts: DecisionWorkspaceV7Contracts,
  capabilities: DecisionWorkspaceV7Capabilities,
  responsibilities: DecisionWorkspaceV7Responsibilities,
  terminology: DecisionWorkspaceV7Terminology,
  lifecycle: DecisionWorkspaceV7Lifecycle,
  boundaries: DecisionWorkspaceV7Boundaries,
  inventory: Object.freeze({
    contractCount: DecisionWorkspaceV7Contracts.length,
    capabilityCount: DecisionWorkspaceV7Capabilities.length,
    responsibilityCount: DecisionWorkspaceV7Responsibilities.length,
    terminologyCount: DecisionWorkspaceV7Terminology.length,
    lifecycleStateCount: DecisionWorkspaceV7Lifecycle.length,
    boundaryCount: DecisionWorkspaceV7Boundaries.length,
  }),
  upstreamDependencies: Object.freeze([]),
  publicApiSurface: Object.freeze(["DecisionWorkspaceV7Foundation"]),
  status: "ReadyForRegistry",
  readiness: "ReadyForRegistry",
  nextPhase: "WS-7:2 — Decision Workspace Registry",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  orchestration: false,
  aiReasoning: false,
  decisionExecution: false,
  optimization: false,
  persistence: false,
  visualization: false,
  ui: false,
  networking: false,
  workflow: false,
  services: false,
  factories: false,
  stateManagement: false,
  businessLogic: false,
} as const);
