/** WS-8:4 — Canonical War Room Workspace Validation surface. */
import { WarRoomWorkspaceFoundation } from "./warRoomWorkspaceFoundation.ts";
import { WarRoomWorkspaceModel } from "./warRoomWorkspaceModel.ts";
import { WarRoomWorkspaceRegistry } from "./warRoomWorkspaceRegistry.ts";
import { WarRoomWorkspaceValidationCategories } from "./warRoomWorkspaceValidationCategories.ts";
import { WarRoomWorkspaceValidationGates } from "./warRoomWorkspaceValidationGates.ts";
import { WarRoomWorkspaceValidationIdentity } from "./warRoomWorkspaceValidationIdentity.ts";
import { WarRoomWorkspaceValidationOutcomes } from "./warRoomWorkspaceValidationOutcomes.ts";
import { WarRoomWorkspaceValidationRules } from "./warRoomWorkspaceValidationRules.ts";
import { WarRoomWorkspaceValidationTargets } from "./warRoomWorkspaceValidationTargets.ts";

const guarantees = Object.freeze([
  "Immutable Architecture", "Stable Identities", "Metadata Completeness",
  "Canonical Naming", "Dependency Integrity", "Relationship Integrity",
  "Boundary Compliance", "ReadyForManifest Eligibility",
].map((name, index) => Object.freeze({
  id: `WS-8:4/Guarantee/${String(index + 1).padStart(2, "0")}`,
  name,
  state: "Guaranteed",
  order: index + 1,
  declarative: true,
  metadataOnly: true,
  immutable: true,
})));

export const WarRoomWorkspaceValidation = Object.freeze({
  identity: WarRoomWorkspaceValidationIdentity,
  foundation: WarRoomWorkspaceFoundation,
  registry: WarRoomWorkspaceRegistry,
  model: WarRoomWorkspaceModel,
  categories: WarRoomWorkspaceValidationCategories,
  targets: WarRoomWorkspaceValidationTargets,
  rules: WarRoomWorkspaceValidationRules,
  outcomes: WarRoomWorkspaceValidationOutcomes,
  gates: WarRoomWorkspaceValidationGates,
  guarantees,
  summary: Object.freeze({
    validationStatus: "Pass",
    readiness: "ReadyForManifest",
    categoryCount: WarRoomWorkspaceValidationCategories.length,
    targetCount: WarRoomWorkspaceValidationTargets.length,
    ruleCount: WarRoomWorkspaceValidationRules.length,
    outcomeCount: WarRoomWorkspaceValidationOutcomes.length,
    gateCount: WarRoomWorkspaceValidationGates.length,
  }),
  upstreamDependencies: Object.freeze([
    "WS-8:1 War Room Workspace Foundation",
    "WS-8:2 War Room Workspace Registry",
    "WS-8:3 War Room Workspace Model",
  ]),
  publicApiSurface: Object.freeze(["WarRoomWorkspaceValidation"]),
  status: "ReadyForManifest",
  readiness: "ReadyForManifest",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  executableValidators: false,
  runtime: false,
  liveMonitoring: false,
  workflowOrchestration: false,
  aiReasoning: false,
  eventProcessing: false,
  incidentManagement: false,
  persistence: false,
  networking: false,
  rendering: false,
  visualization: false,
  stateManagement: false,
  services: false,
  factories: false,
  businessLogic: false,
} as const);
