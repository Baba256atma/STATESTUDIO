import { TimelineVisualizationModelPlatform } from "./timelineVisualizationModel.ts";
import {
  TimelineVisualizationValidationDiagnostics,
  TimelineVisualizationValidationOutcomes,
  TimelineVisualizationValidationSeverityLevels,
} from "./timelineVisualizationValidationDiagnostics.ts";
import {
  TimelineVisualizationValidationGates,
  TimelineVisualizationValidationReadinessDeclarations,
} from "./timelineVisualizationValidationGates.ts";
import {
  TimelineVisualizationValidationInventory,
  TimelineVisualizationValidationMetadata,
} from "./timelineVisualizationValidationMetadata.ts";
import { TimelineVisualizationValidationPolicies } from "./timelineVisualizationValidationPolicies.ts";
import {
  TimelineVisualizationValidationCategories,
  TimelineVisualizationValidationRules,
} from "./timelineVisualizationValidationRules.ts";

export const TimelineVisualizationValidationId = TimelineVisualizationValidationMetadata.id;
export const TimelineVisualizationValidationVersion = TimelineVisualizationValidationMetadata.version;
export const TimelineVisualizationValidationNamespace = TimelineVisualizationValidationMetadata.namespace;
export { TimelineVisualizationValidationMetadata };

export const TimelineVisualizationValidationPlatform = Object.freeze({
  metadata: TimelineVisualizationValidationMetadata,
  model: TimelineVisualizationModelPlatform,
  categories: TimelineVisualizationValidationCategories,
  rules: TimelineVisualizationValidationRules,
  gates: TimelineVisualizationValidationGates,
  diagnostics: TimelineVisualizationValidationDiagnostics,
  severityLevels: TimelineVisualizationValidationSeverityLevels,
  outcomes: TimelineVisualizationValidationOutcomes,
  policies: TimelineVisualizationValidationPolicies,
  readiness: TimelineVisualizationValidationReadinessDeclarations,
  inventory: TimelineVisualizationValidationInventory,
  validationEngine: false,
  runtimeValidation: false,
  playbackExecution: false,
  animationExecution: false,
  scheduling: false,
  simulation: false,
  rendering: false,
  services: false,
  factories: false,
  runtimeExecution: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export function getTimelineVisualizationValidationSummary() {
  return TimelineVisualizationValidationMetadata;
}

export function getTimelineVisualizationValidationCount() {
  return TimelineVisualizationValidationInventory.counts.ruleCount;
}

export function getTimelineVisualizationValidationReleaseMetadata() {
  return Object.freeze({
    id: TimelineVisualizationValidationId,
    name: TimelineVisualizationValidationMetadata.name,
    version: TimelineVisualizationValidationVersion,
    namespace: TimelineVisualizationValidationNamespace,
    status: TimelineVisualizationValidationMetadata.status,
    modelReference: TimelineVisualizationValidationMetadata.modelReference,
  });
}
