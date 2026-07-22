import { SceneRenderingModel } from "./sceneRenderingModel.ts";
import {
  SceneRenderingValidationDiagnostics,
  SceneRenderingValidationOutcomes,
  SceneRenderingValidationSeverityLevels,
} from "./sceneRenderingValidationDiagnostics.ts";
import { SceneRenderingValidationInventory } from "./sceneRenderingValidationInventory.ts";
import { SceneRenderingValidationMetadata } from "./sceneRenderingValidationMetadata.ts";
import { SceneRenderingValidationPolicies } from "./sceneRenderingValidationPolicies.ts";
import {
  SceneRenderingValidationCategories,
  SceneRenderingValidationGates,
  SceneRenderingValidationRules,
} from "./sceneRenderingValidationRules.ts";

export const SceneRenderingValidationId = SceneRenderingValidationMetadata.id;
export const SceneRenderingValidationVersion = SceneRenderingValidationMetadata.version;
export const SceneRenderingValidationName = SceneRenderingValidationMetadata.name;
export const SceneRenderingValidationNamespace = SceneRenderingValidationMetadata.namespace;
export const SceneRenderingValidationStatus = SceneRenderingValidationMetadata.status;
export const SceneRenderingValidationReadiness = SceneRenderingValidationMetadata.readiness;

export { SceneRenderingValidationMetadata };

export const SceneRenderingValidation = Object.freeze({
  metadata: SceneRenderingValidationMetadata,
  model: SceneRenderingModel,
  categories: SceneRenderingValidationCategories,
  rules: SceneRenderingValidationRules,
  gates: SceneRenderingValidationGates,
  severityLevels: SceneRenderingValidationSeverityLevels,
  outcomes: SceneRenderingValidationOutcomes,
  diagnostics: SceneRenderingValidationDiagnostics,
  policies: SceneRenderingValidationPolicies,
  inventory: SceneRenderingValidationInventory,
  validationEngine: false,
  automaticRuleExecution: false,
  runtimeDiagnostics: false,
  rendering: false,
  sceneExecution: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
