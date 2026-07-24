/** WS-3:4 — Canonical Validation metadata surface for Manifest. */
import { GoalWorkspaceFoundation } from "./goalWorkspaceFoundation.ts";
import { GoalWorkspaceModel } from "./goalWorkspaceModel.ts";
import { GoalWorkspaceRegistry } from "./goalWorkspaceRegistry.ts";
import { GoalWorkspaceValidationCategories } from "./goalWorkspaceValidationCategories.ts";
import { GoalWorkspaceValidationGates } from "./goalWorkspaceValidationGates.ts";
import { GoalWorkspaceValidationIdentity } from "./goalWorkspaceValidationIdentity.ts";
import { GoalWorkspaceValidationOutcomes,
  GoalWorkspaceValidationSeverities } from "./goalWorkspaceValidationOutcomes.ts";
import { GoalWorkspaceValidationRules } from "./goalWorkspaceValidationRules.ts";
import { GoalWorkspaceValidationTargets } from "./goalWorkspaceValidationTargets.ts";

export const GoalWorkspaceValidation = Object.freeze({
  identity: GoalWorkspaceValidationIdentity,
  foundation: GoalWorkspaceFoundation, registry: GoalWorkspaceRegistry, model: GoalWorkspaceModel,
  categories: GoalWorkspaceValidationCategories, targets: GoalWorkspaceValidationTargets,
  rules: GoalWorkspaceValidationRules, outcomes: GoalWorkspaceValidationOutcomes,
  severities: GoalWorkspaceValidationSeverities, gates: GoalWorkspaceValidationGates,
  summary: Object.freeze({
    validationStatus: "Pass", validationReadiness: "ReadyForManifest",
    validatedSources: Object.freeze(["WS-3:1 Goal Workspace Foundation",
      "WS-3:2 Goal Workspace Registry", "WS-3:3 Goal Workspace Model"]),
    runtimeValidation: "Not Implemented", businessLogic: "Not Implemented",
    categoryCount: GoalWorkspaceValidationCategories.length,
    targetCount: GoalWorkspaceValidationTargets.length,
    ruleCount: GoalWorkspaceValidationRules.length,
    outcomeCount: GoalWorkspaceValidationOutcomes.length,
    severityCount: GoalWorkspaceValidationSeverities.length,
    gateCount: GoalWorkspaceValidationGates.length,
  }),
  readiness: "ReadyForManifest",
  upstreamDependencies: Object.freeze(["WS-3:1 Goal Workspace Foundation",
    "WS-3:2 Goal Workspace Registry", "WS-3:3 Goal Workspace Model"]),
  publicApiSurface: Object.freeze(["GoalWorkspaceValidation"]),
  metadataOnly: true, immutable: true, deterministic: true,
  runtimeValidation: false, dynamicValidationEngine: false, businessLogic: false,
  persistence: false, ui: false, mutableState: false, externalSideEffects: false,
} as const);

