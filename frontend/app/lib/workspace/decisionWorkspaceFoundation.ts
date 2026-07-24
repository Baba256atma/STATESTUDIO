/** WS-4:1 — Canonical Decision Workspace Foundation surface for Registry. */
import { DecisionWorkspaceBoundaries } from "./decisionWorkspaceBoundaries.ts";
import {
  DecisionWorkspaceCapabilities,
  DecisionWorkspaceResponsibilities,
} from "./decisionWorkspaceCapabilities.ts";
import { DecisionWorkspaceContracts } from "./decisionWorkspaceContracts.ts";
import { DecisionWorkspaceDecisionTypes } from "./decisionWorkspaceDecisionTypes.ts";
import { DecisionWorkspaceIdentity } from "./decisionWorkspaceIdentity.ts";
import { DecisionWorkspaceLifecycle } from "./decisionWorkspaceLifecycle.ts";

export const DecisionWorkspaceFoundation = Object.freeze({
  identity: DecisionWorkspaceIdentity,
  purpose: "Provide the executive context for evaluating alternatives, understanding decision criteria, and recording governed decisions before execution.",
  executiveQuestions: Object.freeze([
    "What decision must be made?",
    "What alternatives are available?",
    "Which option best supports the current goals?",
    "What are the risks of each option?",
    "Which assumptions influence the decision?",
    "Which constraints limit the decision?",
    "Who owns the decision?",
    "How confident are we in the selected option?",
  ]),
  contracts: DecisionWorkspaceContracts,
  capabilities: DecisionWorkspaceCapabilities,
  responsibilities: DecisionWorkspaceResponsibilities,
  decisionTypes: DecisionWorkspaceDecisionTypes,
  lifecycle: DecisionWorkspaceLifecycle,
  boundaries: DecisionWorkspaceBoundaries,
  inventory: Object.freeze({
    contractCount: DecisionWorkspaceContracts.length,
    capabilityCount: DecisionWorkspaceCapabilities.length,
    responsibilityCount: DecisionWorkspaceResponsibilities.length,
    decisionTypeCount: DecisionWorkspaceDecisionTypes.length,
    lifecycleStateCount: DecisionWorkspaceLifecycle.length,
    boundaryCount: DecisionWorkspaceBoundaries.length,
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
  publicApiSurface: Object.freeze(["DecisionWorkspaceFoundation"]),
  readiness: "ReadyForRegistry",
  nextPhase: "WS-4:2 — Decision Workspace Registry",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  ui: false,
  persistence: false,
  aiReasoning: false,
  orchestration: false,
  businessLogic: false,
  decisionExecution: false,
  planning: false,
  scheduling: false,
  rendering: false,
} as const);
