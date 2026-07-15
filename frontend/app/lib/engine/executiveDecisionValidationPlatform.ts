import {
  ExecutiveDecisionValidationCategories,
  ExecutiveDecisionValidationInventory,
  ExecutiveDecisionValidationManifest,
  ExecutiveDecisionValidationSeverities,
} from "./executiveDecisionValidationManifest.ts";
import type {
  ExecutiveDecisionValidationMetadata as ExecutiveDecisionValidationMetadataDescriptor,
  ExecutiveDecisionValidationRule,
  ExecutiveDecisionValidationSummary,
} from "./executiveDecisionValidationTypes.ts";

export const ExecutiveDecisionValidationMetadata = Object.freeze({
  id: "ENG-7:4",
  name: "Executive Decision Validation Platform",
  namespace: "Nexora.Engine.ExecutiveDecision.Validation",
  version: "1.0.0",
  status: "Stable",
  architectureMode: "MetadataOnly",
  immutability: "DeeplyFrozen",
  runtimeBehavior: "None",
  owner: "ENG-7",
  previousPhase: "ENG-7:3",
  nextPhase: "ENG-7:5",
  readiness: "ReadyForDecisionManifest",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const satisfies ExecutiveDecisionValidationMetadataDescriptor);

export const ExecutiveDecisionValidationRegistry = Object.freeze({
  id: "eng-7-validation-registry",
  name: "Executive Decision Validation Registry",
  categories: ExecutiveDecisionValidationCategories,
  severities: ExecutiveDecisionValidationSeverities,
  rules: ExecutiveDecisionValidationManifest.rules,
  ruleCount: ExecutiveDecisionValidationManifest.rules.length,
  inventory: ExecutiveDecisionValidationInventory,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const);

const passCount = ExecutiveDecisionValidationRegistry.rules.filter(({ status }) => status === "PASS").length;
const warningCount = ExecutiveDecisionValidationRegistry.rules.filter(
  ({ status }) => (status as string) === "WARNING",
).length;
const failureCount = ExecutiveDecisionValidationRegistry.rules.filter(
  ({ status }) => (status as string) === "FAIL",
).length;

const summary = Object.freeze({
  validationId: "ENG-7:4",
  phase: "ENG-7:4",
  namespace: "Nexora.Engine.ExecutiveDecision.Validation",
  owner: "ENG-7",
  totalRules: ExecutiveDecisionValidationRegistry.ruleCount,
  passedRules: passCount,
  warningCount,
  failureCount,
  categoryCount: ExecutiveDecisionValidationCategories.length,
  severityCount: ExecutiveDecisionValidationSeverities.length,
  status: "Stable",
  architectureMode: "MetadataOnly",
  immutability: "DeeplyFrozen",
  ownershipStatus: "OwnershipProtected",
  dependencyStatus: "DependencySafe",
  validationStatus: "ValidationCertified",
  readiness: "ReadyForDecisionManifest",
  nextPhase: "ENG-7:5",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const satisfies ExecutiveDecisionValidationSummary);

export const ExecutiveDecisionValidationPlatform = Object.freeze({
  metadata: ExecutiveDecisionValidationMetadata,
  manifest: ExecutiveDecisionValidationManifest,
  registry: ExecutiveDecisionValidationRegistry,
  summary,
  guarantees: Object.freeze({
    status: "Stable",
    architectureMode: "MetadataOnly",
    immutability: "DeeplyFrozen",
    ownershipStatus: "OwnershipProtected",
    dependencyStatus: "DependencySafe",
    validationStatus: "ValidationCertified",
    readiness: "ReadyForDecisionManifest",
  } as const),
  consumedSurfaces: Object.freeze({
    foundation: "executiveDecisionPublicApi.ts",
    registry: "executiveDecisionRegistryPlatform.ts",
    model: "executiveDecisionModelPlatform.ts",
  } as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);

const ruleIndex = Object.freeze(
  Object.fromEntries(
    ExecutiveDecisionValidationRegistry.rules.map((entry) => [entry.id, entry]),
  ) as Readonly<Record<string, ExecutiveDecisionValidationRule | undefined>>,
);

export const getExecutiveDecisionValidationPlatform = () => ExecutiveDecisionValidationPlatform;
export const getExecutiveDecisionValidationMetadata = () => ExecutiveDecisionValidationMetadata;
export const getExecutiveDecisionValidationSummary = () => summary;
export const getExecutiveDecisionValidationRuleById = (
  id: string,
): ExecutiveDecisionValidationRule | undefined => ruleIndex[id];

export {
  ExecutiveDecisionValidationCategories,
  ExecutiveDecisionValidationManifest,
  ExecutiveDecisionValidationSeverities,
};
