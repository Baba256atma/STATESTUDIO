/** WS-7:4 — Canonical Decision Workspace Validation surface. */
import { DecisionWorkspaceV7Foundation } from "./decisionWorkspaceV7Foundation.ts";
import { DecisionWorkspaceV7Model } from "./decisionWorkspaceV7Model.ts";
import { DecisionWorkspaceV7Registry } from "./decisionWorkspaceV7Registry.ts";
import { DecisionWorkspaceV7ValidationCategories } from "./decisionWorkspaceV7ValidationCategories.ts";
import { DecisionWorkspaceV7ValidationGates } from "./decisionWorkspaceV7ValidationGates.ts";
import { DecisionWorkspaceV7ValidationIdentity } from "./decisionWorkspaceV7ValidationIdentity.ts";
import { DecisionWorkspaceV7ValidationOutcomes } from "./decisionWorkspaceV7ValidationOutcomes.ts";
import { DecisionWorkspaceV7ValidationRules } from "./decisionWorkspaceV7ValidationRules.ts";
import { DecisionWorkspaceV7ValidationTargets } from "./decisionWorkspaceV7ValidationTargets.ts";

const guaranteeNames = Object.freeze([
  "Immutable Architecture",
  "Stable Identities",
  "Metadata Completeness",
  "Canonical Naming",
  "Dependency Integrity",
  "Relationship Integrity",
  "Boundary Compliance",
  "ReadyForManifest Eligibility",
] as const);

export const DecisionWorkspaceV7Validation = Object.freeze({
  identity: DecisionWorkspaceV7ValidationIdentity,
  foundation: DecisionWorkspaceV7Foundation,
  registry: DecisionWorkspaceV7Registry,
  model: DecisionWorkspaceV7Model,
  categories: DecisionWorkspaceV7ValidationCategories,
  targets: DecisionWorkspaceV7ValidationTargets,
  rules: DecisionWorkspaceV7ValidationRules,
  outcomes: DecisionWorkspaceV7ValidationOutcomes,
  gates: DecisionWorkspaceV7ValidationGates,
  guarantees: Object.freeze(
    guaranteeNames.map((name, index) =>
      Object.freeze({
        id: `WS-7:4/Guarantee/${String(index + 1).padStart(2, "0")}`,
        name,
        state: "Guaranteed",
        order: index + 1,
        declarative: true,
        metadataOnly: true,
        immutable: true,
      }),
    ),
  ),
  summary: Object.freeze({
    validationStatus: "Pass",
    readiness: "ReadyForManifest",
    categoryCount: DecisionWorkspaceV7ValidationCategories.length,
    targetCount: DecisionWorkspaceV7ValidationTargets.length,
    ruleCount: DecisionWorkspaceV7ValidationRules.length,
    outcomeCount: DecisionWorkspaceV7ValidationOutcomes.length,
    gateCount: DecisionWorkspaceV7ValidationGates.length,
    dependencyVerification: Object.freeze([
      "WS-7:1 Decision Workspace Foundation",
      "WS-7:2 Decision Workspace Registry",
      "WS-7:3 Decision Workspace Model",
    ]),
  }),
  upstreamDependencies: Object.freeze([
    "WS-7:1 Decision Workspace Foundation",
    "WS-7:2 Decision Workspace Registry",
    "WS-7:3 Decision Workspace Model",
  ]),
  publicApiSurface: Object.freeze(["DecisionWorkspaceV7Validation"]),
  status: "ReadyForManifest",
  readiness: "ReadyForManifest",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  executableValidators: false,
  runtime: false,
  businessDecisionValidation: false,
  aiReasoning: false,
  decisionGeneration: false,
  decisionExecution: false,
  optimization: false,
  scoring: false,
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
