/** WS-4:4 — Canonical Validation metadata surface for Manifest. */
import { DecisionWorkspaceFoundation } from "./decisionWorkspaceFoundation.ts";
import { DecisionWorkspaceModel } from "./decisionWorkspaceModel.ts";
import { DecisionWorkspaceRegistry } from "./decisionWorkspaceRegistry.ts";
import { DecisionWorkspaceValidationCategories } from "./decisionWorkspaceValidationCategories.ts";
import { DecisionWorkspaceValidationGates } from "./decisionWorkspaceValidationGates.ts";
import { DecisionWorkspaceValidationIdentity } from "./decisionWorkspaceValidationIdentity.ts";
import {
  DecisionWorkspaceValidationOutcomes,
  DecisionWorkspaceValidationSeverities,
} from "./decisionWorkspaceValidationOutcomes.ts";
import { DecisionWorkspaceValidationRules } from "./decisionWorkspaceValidationRules.ts";
import { DecisionWorkspaceValidationTargets } from "./decisionWorkspaceValidationTargets.ts";

export const DecisionWorkspaceValidation = Object.freeze({
  identity: DecisionWorkspaceValidationIdentity,
  foundation: DecisionWorkspaceFoundation,
  registry: DecisionWorkspaceRegistry,
  model: DecisionWorkspaceModel,
  categories: DecisionWorkspaceValidationCategories,
  targets: DecisionWorkspaceValidationTargets,
  rules: DecisionWorkspaceValidationRules,
  outcomes: DecisionWorkspaceValidationOutcomes,
  severities: DecisionWorkspaceValidationSeverities,
  gates: DecisionWorkspaceValidationGates,
  summary: Object.freeze({
    validationStatus: "Pass",
    validationReadiness: "ReadyForManifest",
    validatedSources: Object.freeze([
      "WS-4:1 Decision Workspace Foundation",
      "WS-4:2 Decision Workspace Registry",
      "WS-4:3 Decision Workspace Model",
    ]),
    runtimeValidation: "Not Implemented",
    businessLogic: "Not Implemented",
    categoryCount: DecisionWorkspaceValidationCategories.length,
    targetCount: DecisionWorkspaceValidationTargets.length,
    ruleCount: DecisionWorkspaceValidationRules.length,
    outcomeCount: DecisionWorkspaceValidationOutcomes.length,
    severityCount: DecisionWorkspaceValidationSeverities.length,
    gateCount: DecisionWorkspaceValidationGates.length,
  }),
  readiness: "ReadyForManifest",
  upstreamDependencies: Object.freeze([
    "WS-4:1 Decision Workspace Foundation",
    "WS-4:2 Decision Workspace Registry",
    "WS-4:3 Decision Workspace Model",
  ]),
  publicApiSurface: Object.freeze(["DecisionWorkspaceValidation"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeValidation: false,
  dynamicValidationEngine: false,
  businessLogic: false,
  persistence: false,
  ui: false,
  orchestration: false,
  aiBehavior: false,
  mutableState: false,
  externalSideEffects: false,
} as const);
