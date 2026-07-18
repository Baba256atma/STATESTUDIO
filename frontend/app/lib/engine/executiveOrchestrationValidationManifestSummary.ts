import {
  ExecutiveOrchestrationFoundationValidation,
  ExecutiveOrchestrationModelValidation,
  ExecutiveOrchestrationOwnershipValidation,
  ExecutiveOrchestrationRegistryValidation,
  ExecutiveOrchestrationValidationManifest,
  ExecutiveOrchestrationValidationRunner,
  getExecutiveOrchestrationValidationSummary,
} from "./executiveOrchestrationValidationRunner.ts";

const validationSummary = getExecutiveOrchestrationValidationSummary();

/**
 * Immutable validation summary for ENG-8:5.
 * References ENG-8:4 only through its public API.
 * Named Summary to avoid colliding with ENG-8:4 ValidationManifest.
 */
export const ExecutiveOrchestrationValidationManifestSummary = Object.freeze({
  id: "eng-8-manifest-validation-summary",
  section: "Validation",
  name: "Executive Orchestration Validation Manifest Summary",
  description:
    "Immutable summary of ENG-8:4 validation categories, rules, severities, statuses, and readiness.",
  validationManifest: ExecutiveOrchestrationValidationManifest,
  validationRunner: ExecutiveOrchestrationValidationRunner,
  validationSummary,
  categories: Object.freeze([
    ExecutiveOrchestrationFoundationValidation.category,
    ExecutiveOrchestrationRegistryValidation.category,
    ExecutiveOrchestrationModelValidation.category,
    ExecutiveOrchestrationOwnershipValidation.category,
  ] as const),
  inventory: Object.freeze({
    categoryCount: 4,
    ruleCount: validationSummary.totalRules,
    passedRules: validationSummary.passedRules,
    failedRules: validationSummary.failedRules,
    severities: ExecutiveOrchestrationValidationManifest.coverage.severities,
    statuses: ExecutiveOrchestrationValidationManifest.coverage.statuses,
    validationStatus: validationSummary.validationStatus,
    readiness: validationSummary.readiness,
  } as const),
  status: "Complete",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  deeplyFrozen: true,
} as const);
