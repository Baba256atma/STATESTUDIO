/** WS-10:4 — Canonical Timeline Workspace Validation surface. */
import { TimelineWorkspaceFoundation } from "./timelineWorkspaceFoundation.ts";
import { TimelineWorkspaceModel } from "./timelineWorkspaceModel.ts";
import { TimelineWorkspaceRegistry } from "./timelineWorkspaceRegistry.ts";
import { TimelineWorkspaceValidationCategories } from "./timelineWorkspaceValidationCategories.ts";
import { TimelineWorkspaceValidationGates } from "./timelineWorkspaceValidationGates.ts";
import { TimelineWorkspaceValidationIdentity } from "./timelineWorkspaceValidationIdentity.ts";
import { TimelineWorkspaceValidationOutcomes } from "./timelineWorkspaceValidationOutcomes.ts";
import { TimelineWorkspaceValidationRules } from "./timelineWorkspaceValidationRules.ts";
import { TimelineWorkspaceValidationTargets } from "./timelineWorkspaceValidationTargets.ts";

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
  id: `WS-10:4/Guarantee/${String(index + 1).padStart(2, "0")}`,
  name,
  state: "Guaranteed",
  order: index + 1,
  declarative: true,
  metadataOnly: true,
  immutable: true,
})));

export const TimelineWorkspaceValidation = Object.freeze({
  identity: TimelineWorkspaceValidationIdentity,
  foundation: TimelineWorkspaceFoundation,
  registry: TimelineWorkspaceRegistry,
  model: TimelineWorkspaceModel,
  categories: TimelineWorkspaceValidationCategories,
  targets: TimelineWorkspaceValidationTargets,
  rules: TimelineWorkspaceValidationRules,
  outcomes: TimelineWorkspaceValidationOutcomes,
  gates: TimelineWorkspaceValidationGates,
  guarantees,
  summary: Object.freeze({
    validationStatus: "Pass",
    readiness: "ReadyForManifest",
    categoryCount: TimelineWorkspaceValidationCategories.length,
    targetCount: TimelineWorkspaceValidationTargets.length,
    ruleCount: TimelineWorkspaceValidationRules.length,
    outcomeCount: TimelineWorkspaceValidationOutcomes.length,
    gateCount: TimelineWorkspaceValidationGates.length,
  }),
  upstreamDependencies: Object.freeze([
    "WS-10:1 Timeline Workspace Foundation",
    "WS-10:2 Timeline Workspace Registry",
    "WS-10:3 Timeline Workspace Model",
  ]),
  publicApiSurface: Object.freeze(["TimelineWorkspaceValidation"]),
  status: "ReadyForManifest",
  readiness: "ReadyForManifest",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  executableValidators: false,
  runtime: false,
  timelinePlayback: false,
  chronologicalProcessing: false,
  eventExecution: false,
  analytics: false,
  aiReasoning: false,
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
