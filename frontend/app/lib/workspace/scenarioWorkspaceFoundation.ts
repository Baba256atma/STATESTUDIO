/** WS-5:1 — Canonical Scenario Workspace Foundation surface for Registry. */
import { ScenarioWorkspaceBoundaries } from "./scenarioWorkspaceBoundaries.ts";
import {
  ScenarioWorkspaceCapabilities,
  ScenarioWorkspaceResponsibilities,
} from "./scenarioWorkspaceCapabilities.ts";
import { ScenarioWorkspaceContracts } from "./scenarioWorkspaceContracts.ts";
import { ScenarioWorkspaceIdentity } from "./scenarioWorkspaceIdentity.ts";
import { ScenarioWorkspaceLifecycle } from "./scenarioWorkspaceLifecycle.ts";
import { ScenarioWorkspaceScenarioTypes } from "./scenarioWorkspaceScenarioTypes.ts";

export const ScenarioWorkspaceFoundation = Object.freeze({
  identity: ScenarioWorkspaceIdentity,
  purpose: "Provide the executive context for defining, comparing, and evaluating possible business futures before execution.",
  executiveQuestions: Object.freeze([
    "What future scenarios should be evaluated?",
    "What assumptions define each scenario?",
    "Which decisions influence the scenario?",
    "What risks affect the scenario?",
    "Which scenario best supports our goals?",
    "What outcomes are expected?",
    "How confident are we in each scenario?",
    "Which scenario should proceed to execution?",
  ]),
  contracts: ScenarioWorkspaceContracts,
  capabilities: ScenarioWorkspaceCapabilities,
  responsibilities: ScenarioWorkspaceResponsibilities,
  scenarioTypes: ScenarioWorkspaceScenarioTypes,
  lifecycle: ScenarioWorkspaceLifecycle,
  boundaries: ScenarioWorkspaceBoundaries,
  inventory: Object.freeze({
    contractCount: ScenarioWorkspaceContracts.length,
    capabilityCount: ScenarioWorkspaceCapabilities.length,
    responsibilityCount: ScenarioWorkspaceResponsibilities.length,
    scenarioTypeCount: ScenarioWorkspaceScenarioTypes.length,
    lifecycleStateCount: ScenarioWorkspaceLifecycle.length,
    boundaryCount: ScenarioWorkspaceBoundaries.length,
  }),
  foundationRules: Object.freeze([
    "Preserve canonical identities",
    "Be immutable",
    "Preserve deterministic ordering",
    "Remain implementation-independent",
    "Contain metadata only",
    "Expose no runtime behavior",
    "Contain no mutable state",
  ]),
  upstreamDependencies: Object.freeze([]),
  publicApiSurface: Object.freeze(["ScenarioWorkspaceFoundation"]),
  readiness: "ReadyForRegistry",
  nextPhase: "WS-5:2 — Scenario Workspace Registry",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  simulationEngine: false,
  predictionEngine: false,
  scenarioExecution: false,
  businessLogic: false,
  persistence: false,
  ui: false,
  aiBehavior: false,
  orchestration: false,
  networking: false,
  rendering: false,
} as const);
