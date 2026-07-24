/** WS-5:4 — Canonical Validation metadata surface for Manifest. */
import { ScenarioWorkspaceFoundation } from "./scenarioWorkspaceFoundation.ts";
import { ScenarioWorkspaceModel } from "./scenarioWorkspaceModel.ts";
import { ScenarioWorkspaceRegistry } from "./scenarioWorkspaceRegistry.ts";
import { ScenarioWorkspaceValidationCategories } from "./scenarioWorkspaceValidationCategories.ts";
import { ScenarioWorkspaceValidationGates } from "./scenarioWorkspaceValidationGates.ts";
import { ScenarioWorkspaceValidationIdentity } from "./scenarioWorkspaceValidationIdentity.ts";
import {
  ScenarioWorkspaceValidationOutcomes,
  ScenarioWorkspaceValidationSeverities,
} from "./scenarioWorkspaceValidationOutcomes.ts";
import { ScenarioWorkspaceValidationRules } from "./scenarioWorkspaceValidationRules.ts";
import { ScenarioWorkspaceValidationTargets } from "./scenarioWorkspaceValidationTargets.ts";

export const ScenarioWorkspaceValidation = Object.freeze({
  identity: ScenarioWorkspaceValidationIdentity,
  foundation: ScenarioWorkspaceFoundation,
  registry: ScenarioWorkspaceRegistry,
  model: ScenarioWorkspaceModel,
  categories: ScenarioWorkspaceValidationCategories,
  targets: ScenarioWorkspaceValidationTargets,
  rules: ScenarioWorkspaceValidationRules,
  outcomes: ScenarioWorkspaceValidationOutcomes,
  severities: ScenarioWorkspaceValidationSeverities,
  gates: ScenarioWorkspaceValidationGates,
  summary: Object.freeze({
    validationStatus: "Pass",
    validationReadiness: "ReadyForManifest",
    validatedSources: Object.freeze([
      "WS-5:1 Scenario Workspace Foundation",
      "WS-5:2 Scenario Workspace Registry",
      "WS-5:3 Scenario Workspace Model",
    ]),
    runtimeValidation: "Not Implemented",
    businessLogic: "Not Implemented",
    categoryCount: ScenarioWorkspaceValidationCategories.length,
    targetCount: ScenarioWorkspaceValidationTargets.length,
    ruleCount: ScenarioWorkspaceValidationRules.length,
    outcomeCount: ScenarioWorkspaceValidationOutcomes.length,
    severityCount: ScenarioWorkspaceValidationSeverities.length,
    gateCount: ScenarioWorkspaceValidationGates.length,
  }),
  readiness: "ReadyForManifest",
  upstreamDependencies: Object.freeze([
    "WS-5:1 Scenario Workspace Foundation",
    "WS-5:2 Scenario Workspace Registry",
    "WS-5:3 Scenario Workspace Model",
  ]),
  publicApiSurface: Object.freeze(["ScenarioWorkspaceValidation"]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeValidation: false,
  simulationEngine: false,
  predictionEngine: false,
  dynamicValidationEngine: false,
  businessLogic: false,
  persistence: false,
  ui: false,
  orchestration: false,
  aiBehavior: false,
  mutableState: false,
} as const);
