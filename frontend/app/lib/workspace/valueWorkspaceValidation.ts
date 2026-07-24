/** WS-9:4 — Canonical Value Workspace Validation surface. */
import { ValueWorkspaceFoundation } from "./valueWorkspaceFoundation.ts";
import { ValueWorkspaceModel } from "./valueWorkspaceModel.ts";
import { ValueWorkspaceRegistry } from "./valueWorkspaceRegistry.ts";
import { ValueWorkspaceValidationCategories } from "./valueWorkspaceValidationCategories.ts";
import { ValueWorkspaceValidationGates } from "./valueWorkspaceValidationGates.ts";
import { ValueWorkspaceValidationIdentity } from "./valueWorkspaceValidationIdentity.ts";
import { ValueWorkspaceValidationOutcomes } from "./valueWorkspaceValidationOutcomes.ts";
import { ValueWorkspaceValidationRules } from "./valueWorkspaceValidationRules.ts";
import { ValueWorkspaceValidationTargets } from "./valueWorkspaceValidationTargets.ts";

const guarantees = Object.freeze([
  "Immutable Architecture",
  "Stable Identities",
  "Metadata Completeness",
  "Canonical Naming",
  "Dependency Integrity",
  "Relationship Integrity",
  "Boundary Compliance",
  "ReadyForManifest Eligibility",
].map((name, index) => Object.freeze({
  id: `WS-9:4/Guarantee/${String(index + 1).padStart(2, "0")}`,
  name,
  state: "Guaranteed",
  order: index + 1,
  declarative: true,
  metadataOnly: true,
  immutable: true,
})));

export const ValueWorkspaceValidation = Object.freeze({
  identity: ValueWorkspaceValidationIdentity,
  foundation: ValueWorkspaceFoundation,
  registry: ValueWorkspaceRegistry,
  model: ValueWorkspaceModel,
  categories: ValueWorkspaceValidationCategories,
  targets: ValueWorkspaceValidationTargets,
  rules: ValueWorkspaceValidationRules,
  outcomes: ValueWorkspaceValidationOutcomes,
  gates: ValueWorkspaceValidationGates,
  guarantees,
  summary: Object.freeze({
    validationStatus: "Pass",
    readiness: "ReadyForManifest",
    categoryCount: ValueWorkspaceValidationCategories.length,
    targetCount: ValueWorkspaceValidationTargets.length,
    ruleCount: ValueWorkspaceValidationRules.length,
    outcomeCount: ValueWorkspaceValidationOutcomes.length,
    gateCount: ValueWorkspaceValidationGates.length,
  }),
  upstreamDependencies: Object.freeze([
    "WS-9:1 Value Workspace Foundation",
    "WS-9:2 Value Workspace Registry",
    "WS-9:3 Value Workspace Model",
  ]),
  publicApiSurface: Object.freeze(["ValueWorkspaceValidation"]),
  status: "ReadyForManifest",
  readiness: "ReadyForManifest",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  executableValidators: false,
  runtime: false,
  roiCalculation: false,
  businessValueCalculation: false,
  financialAnalysis: false,
  aiReasoning: false,
  forecasting: false,
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
