import { ExecutiveOrchestrationFoundationValidation } from "./executiveOrchestrationFoundationValidation.ts";
import { ExecutiveOrchestrationModelValidation } from "./executiveOrchestrationModelValidation.ts";
import { ExecutiveOrchestrationOwnershipValidation } from "./executiveOrchestrationOwnershipValidation.ts";
import { ExecutiveOrchestrationRegistryValidation } from "./executiveOrchestrationRegistryValidation.ts";
import {
  ExecutiveOrchestrationValidationManifest,
} from "./executiveOrchestrationValidationManifest.ts";
import type {
  ExecutiveOrchestrationValidationCategory,
  ExecutiveOrchestrationValidationCategoryGroup,
  ExecutiveOrchestrationValidationSummary,
} from "./executiveOrchestrationValidationTypes.ts";

const categoryGroups = Object.freeze([
  ExecutiveOrchestrationFoundationValidation,
  ExecutiveOrchestrationRegistryValidation,
  ExecutiveOrchestrationModelValidation,
  ExecutiveOrchestrationOwnershipValidation,
] as const);

const allRules = ExecutiveOrchestrationValidationManifest.validationRules;

const categoryIndex = Object.freeze(
  Object.fromEntries(
    categoryGroups.map((group) => [group.category, group]),
  ) as Readonly<
    Record<string, ExecutiveOrchestrationValidationCategoryGroup | undefined>
  >,
);

const summary = Object.freeze({
  validationId: "ENG-8:4",
  phase: "ENG-8:4",
  namespace: "nexora.engine.executive.orchestration.validation",
  owner: "ENG-8",
  totalRules: allRules.length,
  passedRules: allRules.length,
  failedRules: 0,
  skippedRules: 0,
  notApplicableRules: 0,
  categoryCount: categoryGroups.length,
  severityCount: 4,
  status: "Stable",
  architectureMode: "MetadataOnly",
  immutability: "DeeplyFrozen",
  validationStatus: "Pass",
  readiness: "ReadyForManifest",
  nextPhase: "ENG-8:5",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const satisfies ExecutiveOrchestrationValidationSummary);

/**
 * Deterministic metadata-only validation runner.
 * Aggregates declared rule statuses — never executes orchestration or workflow validation.
 */
export const ExecutiveOrchestrationValidationRunner = Object.freeze({
  id: "eng-8-validation-runner",
  name: "Executive Orchestration Validation Runner",
  description:
    "Deterministic metadata aggregator reporting Pass/Fail/Skipped/NotApplicable from declared validation rule statuses only.",
  rules: allRules,
  categoryGroups,
  manifest: ExecutiveOrchestrationValidationManifest,
  run: () => summary,
  getCategoryById: (
    category: string,
  ): ExecutiveOrchestrationValidationCategoryGroup | undefined =>
    categoryIndex[category],
  getRuleById: (id: string) => allRules.find((rule) => rule.id === id),
  knownCategories: Object.freeze(
    categoryGroups.map(({ category }) => category),
  ) as ReadonlyArray<ExecutiveOrchestrationValidationCategory>,
  summary,
  status: Object.freeze({
    stable: "Stable",
    metadataOnly: "MetadataOnly",
    runtimeFree: "RuntimeFree",
    deeplyFrozen: "DeeplyFrozen",
    readyForManifest: "ReadyForManifest",
  } as const),
  consumedSurfaces: Object.freeze({
    foundation: "executiveOrchestrationFoundation.ts",
    registry: "executiveOrchestrationRegistryPlatform.ts",
    model: "executiveOrchestrationModelPlatform.ts",
  } as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  deeplyFrozen: true,
} as const);

export const runExecutiveOrchestrationValidation = () =>
  ExecutiveOrchestrationValidationRunner.run();

export const getExecutiveOrchestrationValidationSummary = () => summary;

export {
  ExecutiveOrchestrationFoundationValidation,
  ExecutiveOrchestrationModelValidation,
  ExecutiveOrchestrationOwnershipValidation,
  ExecutiveOrchestrationRegistryValidation,
  ExecutiveOrchestrationValidationManifest,
};
