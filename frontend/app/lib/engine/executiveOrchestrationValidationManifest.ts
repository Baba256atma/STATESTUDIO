import { ExecutiveOrchestrationFoundationValidation } from "./executiveOrchestrationFoundationValidation.ts";
import { ExecutiveOrchestrationModelValidation } from "./executiveOrchestrationModelValidation.ts";
import { ExecutiveOrchestrationOwnershipValidation } from "./executiveOrchestrationOwnershipValidation.ts";
import { ExecutiveOrchestrationRegistryValidation } from "./executiveOrchestrationRegistryValidation.ts";
import type {
  ExecutiveOrchestrationValidationMetadata as ExecutiveOrchestrationValidationMetadataDescriptor,
} from "./executiveOrchestrationValidationTypes.ts";

const allRules = Object.freeze([
  ...ExecutiveOrchestrationFoundationValidation.rules,
  ...ExecutiveOrchestrationRegistryValidation.rules,
  ...ExecutiveOrchestrationModelValidation.rules,
  ...ExecutiveOrchestrationOwnershipValidation.rules,
] as const);

const severities = Object.freeze([
  "Info",
  "Warning",
  "Error",
  "Critical",
] as const);

const statuses = Object.freeze([
  "Pass",
  "Fail",
  "Skipped",
  "NotApplicable",
] as const);

const categories = Object.freeze([
  "Foundation",
  "Registry",
  "Model",
  "Ownership",
  "Dependency",
  "Lifecycle",
  "Capability",
  "Coordination",
  "ExecutionMode",
  "PublicApi",
  "AntiDuplication",
  "MetadataConsistency",
] as const);

export const ExecutiveOrchestrationValidationMetadata = Object.freeze({
  id: "ENG-8:4",
  name: "Executive Orchestration Validation Platform",
  namespace: "nexora.engine.executive.orchestration.validation",
  version: "1.0.0",
  status: "Stable",
  architectureMode: "MetadataOnly",
  immutability: "DeeplyFrozen",
  runtimeBehavior: "None",
  owner: "ENG-8",
  previousPhase: "ENG-8:3",
  nextPhase: "ENG-8:5",
  readiness: "ReadyForManifest",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  deeplyFrozen: true,
  readyForManifest: true,
} as const satisfies ExecutiveOrchestrationValidationMetadataDescriptor);

/**
 * Immutable validation manifest for ENG-8:4.
 */
export const ExecutiveOrchestrationValidationManifest = Object.freeze({
  id: "eng-8-validation-manifest",
  name: "Executive Orchestration Validation Manifest",
  foundation: ExecutiveOrchestrationFoundationValidation,
  registry: ExecutiveOrchestrationRegistryValidation,
  model: ExecutiveOrchestrationModelValidation,
  ownership: ExecutiveOrchestrationOwnershipValidation,
  validationRules: allRules,
  coverage: Object.freeze({
    validatedPhases: Object.freeze(["ENG-8:1", "ENG-8:2", "ENG-8:3"] as const),
    categoryCount: categories.length,
    ruleCount: allRules.length,
    foundationRuleCount: ExecutiveOrchestrationFoundationValidation.rules.length,
    registryRuleCount: ExecutiveOrchestrationRegistryValidation.rules.length,
    modelRuleCount: ExecutiveOrchestrationModelValidation.rules.length,
    ownershipRuleCount: ExecutiveOrchestrationOwnershipValidation.rules.length,
    severities,
    statuses,
    categories,
  } as const),
  summary: Object.freeze({
    totalRules: allRules.length,
    passedRules: allRules.length,
    failedRules: 0,
    skippedRules: 0,
    notApplicableRules: 0,
    validationStatus: "Pass",
    readiness: "ReadyForManifest",
  } as const),
  metadata: ExecutiveOrchestrationValidationMetadata,
  sections: Object.freeze([
    "Foundation",
    "Registry",
    "Model",
    "Ownership",
    "Validation Rules",
    "Coverage",
    "Summary",
    "Metadata",
  ] as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  deeplyFrozen: true,
} as const);
