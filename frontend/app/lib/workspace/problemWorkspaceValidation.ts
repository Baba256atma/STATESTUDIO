/** WS-6:4 — Canonical Validation metadata surface for Manifest. */
import { ProblemWorkspaceFoundation } from "./problemWorkspaceFoundation.ts";
import { ProblemWorkspaceModel } from "./problemWorkspaceModel.ts";
import { ProblemWorkspaceRegistry } from "./problemWorkspaceRegistry.ts";
import { ProblemWorkspaceValidationCategories } from "./problemWorkspaceValidationCategories.ts";
import { ProblemWorkspaceValidationGates } from "./problemWorkspaceValidationGates.ts";
import { ProblemWorkspaceValidationIdentity } from "./problemWorkspaceValidationIdentity.ts";
import { ProblemWorkspaceValidationOutcomes } from "./problemWorkspaceValidationOutcomes.ts";
import { ProblemWorkspaceValidationRules } from "./problemWorkspaceValidationRules.ts";
import { ProblemWorkspaceValidationTargets } from "./problemWorkspaceValidationTargets.ts";

const guaranteeNames = Object.freeze([
  "Immutable Architecture",
  "Stable Identities",
  "Complete Metadata",
  "Canonical Naming",
  "Dependency Correctness",
  "Relationship Correctness",
  "Boundary Compliance",
  "ReadyForManifest Eligibility",
] as const);

export const ProblemWorkspaceValidation = Object.freeze({
  identity: ProblemWorkspaceValidationIdentity,
  foundation: ProblemWorkspaceFoundation,
  registry: ProblemWorkspaceRegistry,
  model: ProblemWorkspaceModel,
  categories: ProblemWorkspaceValidationCategories,
  targets: ProblemWorkspaceValidationTargets,
  rules: ProblemWorkspaceValidationRules,
  outcomes: ProblemWorkspaceValidationOutcomes,
  gates: ProblemWorkspaceValidationGates,
  guarantees: Object.freeze(
    guaranteeNames.map((name, index) => Object.freeze({
      id: `WS-6:4/Guarantee/${String(index + 1).padStart(2, "0")}`,
      name,
      state: "Guaranteed",
      order: index + 1,
      declarative: true,
      metadataOnly: true,
      immutable: true,
    })),
  ),
  summary: Object.freeze({
    validationStatus: "Pass",
    readiness: "ReadyForManifest",
    categoryCount: ProblemWorkspaceValidationCategories.length,
    targetCount: ProblemWorkspaceValidationTargets.length,
    ruleCount: ProblemWorkspaceValidationRules.length,
    outcomeCount: ProblemWorkspaceValidationOutcomes.length,
    gateCount: ProblemWorkspaceValidationGates.length,
    dependencyVerification: Object.freeze([
      "WS-6:1 Problem Workspace Foundation",
      "WS-6:2 Problem Workspace Registry",
      "WS-6:3 Problem Workspace Model",
    ]),
  }),
  upstreamDependencies: Object.freeze([
    "WS-6:1 Problem Workspace Foundation",
    "WS-6:2 Problem Workspace Registry",
    "WS-6:3 Problem Workspace Model",
  ]),
  publicApiSurface: Object.freeze(["ProblemWorkspaceValidation"]),
  readiness: "ReadyForManifest",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeValidationEngine: false,
  businessDataValidation: false,
  reasoning: false,
  problemSolving: false,
  rootCauseAnalysis: false,
  workflow: false,
  persistence: false,
  rendering: false,
  orchestration: false,
  stateManagement: false,
  networking: false,
  businessLogic: false,
} as const);
